import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

function getEnv(key: string): string | undefined {
  try {
    const ctx = getRequestContext();
    if (ctx?.env?.[key]) return ctx.env[key] as string;
  } catch {}
  return process.env[key];
}

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();

    // The "clear cache" is achieved by triggering a Cloudflare Pages rebuild via GitHub
    // This is the same as deploy but without saving config
    const GITHUB_TOKEN = getEnv('GITHUB_TOKEN') || '';
    const GITHUB_OWNER = 'test0003-tech';
    const GITHUB_REPO = 'Sennizer-design-9';

    const triggerContent = btoa(JSON.stringify({
      slug,
      cacheClearedAt: new Date().toISOString(),
    }));

    // Get current file SHA
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
    } catch {}

    const commitPayload: Record<string, unknown> = {
      message: `cache-clear: ${slug} - ${new Date().toISOString()}`,
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
      return NextResponse.json({ success: true, message: 'Cache clear triggered. Page will refresh shortly.' });
    } else {
      const errData = await commitRes.json() as { message?: string };
      return NextResponse.json({ success: false, message: `Failed to clear cache: ${errData.message || 'Unknown error'}` }, { status: 500 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
