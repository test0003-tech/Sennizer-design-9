import { NextResponse } from 'next/server';
import { updateBrand, getBrandBySlug, ensureBrandConfigTable } from '@/lib/brand-db';
import type { BrandFormConfig } from '@/lib/brand-types';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

function getEnv(key: string): string | undefined {
  // Try Cloudflare Worker env first
  try {
    const ctx = getRequestContext();
    if (ctx?.env?.[key]) {
      return ctx.env[key] as string;
    }
  } catch {
    // Not on Cloudflare
  }
  return process.env[key];
}

/**
 * POST /api/deploy-brand
 * Saves the brand config to D1 brand_config table and triggers a GitHub commit
 * to force Cloudflare Pages to rebuild from Git (avoids caching issues).
 */
export async function POST(request: Request) {
  try {
    // Ensure the table exists
    await ensureBrandConfigTable();

    const body = await request.json() as {
      slug: string;
      config: BrandFormConfig;
      active?: number;
    };

    const { slug, config, active } = body;

    if (!slug || !config) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, config' },
        { status: 400 }
      );
    }

    // Step 1: Save config to D1 brand_config table
    const updated = await updateBrand(slug, {
      config,
      active: active ?? 1,
    });

    if (!updated) {
      return NextResponse.json(
        { error: `Brand "${slug}" not found` },
        { status: 404 }
      );
    }

    // Step 2: Trigger GitHub commit to force Cloudflare Pages rebuild
    let deployTriggered = false;
    try {
      const brand = await getBrandBySlug(slug);
      const deployTimestamp = new Date().toISOString();

      const GITHUB_TOKEN = getEnv('GITHUB_TOKEN') || '';
      const GITHUB_OWNER = 'test0003-tech';
      const GITHUB_REPO = 'Sennizer-design-9';

      const triggerContent = btoa(JSON.stringify({
        slug,
        deployedAt: deployTimestamp,
        brandName: brand?.name || slug,
      }));

      // First, get the current file SHA if it exists
      let fileSha: string | null = null;
      try {
        const getFileRes = await fetch(
          `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/deploy-trigger.json`,
          {
            headers: {
              Authorization: `Bearer ${GITHUB_TOKEN}`,
              Accept: 'application/vnd.github.v3+json',
            },
          }
        );
        if (getFileRes.ok) {
          const fileData = await getFileRes.json() as { sha: string };
          fileSha = fileData.sha;
        }
      } catch {
        // File doesn't exist yet, that's fine
      }

      // Create or update the deploy trigger file
      const commitPayload: Record<string, unknown> = {
        message: `deploy: ${slug} - ${deployTimestamp}`,
        content: triggerContent,
        branch: 'main',
      };

      if (fileSha) {
        commitPayload.sha = fileSha;
      }

      const commitRes = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/deploy-trigger.json`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(commitPayload),
        }
      );

      if (commitRes.ok) {
        deployTriggered = true;
        console.log(`Deploy triggered for ${slug} via GitHub commit`);
      } else {
        const errData = await commitRes.json() as { message?: string };
        console.error('GitHub commit failed:', errData.message);
      }
    } catch (deployErr) {
      console.error('Deploy trigger failed:', deployErr);
    }

    return NextResponse.json({
      success: true,
      message: deployTriggered
        ? `Config saved and deployment triggered for ${slug}. Cloudflare Pages will rebuild shortly.`
        : `Config saved for ${slug}. Deploy trigger failed - you may need to manually push to Git.`,
      slug,
      deployTriggered,
    });
  } catch (error) {
    console.error('Deploy-brand error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
