import { NextResponse } from 'next/server';
import { ensureBrandConfigTable } from '@/lib/brand-db';
import { ensureRecordsTable } from '@/lib/d1-database';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

/**
 * GET /api/db-check
 * Diagnostic endpoint that:
 * 1. Checks if D1 binding is available
 * 2. Creates tables if they don't exist
 * 3. Returns status info
 */
export async function GET() {
  try {
    // Check D1 binding
    let dbAvailable = false;
    let bindingError = '';
    try {
      const ctx = getRequestContext();
      if (ctx?.env?.DB) {
        dbAvailable = true;
      } else {
        bindingError = 'DB binding not found in env. Check wrangler.toml D1 binding.';
      }
    } catch (err) {
      bindingError = `getRequestContext() failed: ${err instanceof Error ? err.message : String(err)}`;
    }

    if (!dbAvailable) {
      return NextResponse.json({
        status: 'error',
        message: 'D1 binding not available',
        error: bindingError,
        hint: 'Make sure wrangler.toml has [[d1_databases]] with binding="DB" and the app is deployed on Cloudflare Pages.',
      }, { status: 500 });
    }

    // Create tables if they don't exist
    let brandConfigOk = false;
    let recordsOk = false;
    let createError = '';

    try {
      await ensureBrandConfigTable();
      brandConfigOk = true;
    } catch (err) {
      createError += `brand_config: ${err instanceof Error ? err.message : String(err)}. `;
    }

    try {
      await ensureRecordsTable();
      recordsOk = true;
    } catch (err) {
      createError += `records: ${err instanceof Error ? err.message : String(err)}. `;
    }

    return NextResponse.json({
      status: brandConfigOk && recordsOk ? 'ok' : 'partial',
      message: brandConfigOk && recordsOk
        ? 'Database is ready. Both tables exist.'
        : `Some tables could not be created: ${createError}`,
      tables: {
        brand_config: brandConfigOk,
        records: recordsOk,
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error during db check',
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
