/**
 * Brand Database Operations (Native D1 Bindings)
 * =============================================
 * Handles CRUD operations for the `brand_config` table in Cloudflare D1.
 * Uses native D1 bindings via getRequestContext() — NO API token needed.
 *
 * Types are re-exported from brand-types.ts (client-safe).
 * Client Components should import types from @/lib/brand-types directly.
 */

import { getRequestContext } from '@cloudflare/next-on-pages';

// Re-export types from client-safe file so server code can still import from here
export type { FormFieldConfig, FormSectionConfig, ColorConfig, BrandFormConfig, Brand } from './brand-types';
export { getDefaultConfig } from './brand-types';
import type { BrandFormConfig, Brand } from './brand-types';

// ---------------------------------------------------------------------------
// D1 Helper — get the bound D1 database instance
// ---------------------------------------------------------------------------

function getDB(): D1Database {
  try {
    const ctx = getRequestContext();
    if (ctx?.env?.DB) {
      return ctx.env.DB as D1Database;
    }
  } catch {
    // Not running on Cloudflare Pages
  }
  throw new Error(
    'D1 database binding not available. Ensure wrangler.toml has the D1 binding and the app is deployed on Cloudflare Pages.'
  );
}

// ---------------------------------------------------------------------------
// D1 Row Type (internal only)
// ---------------------------------------------------------------------------

/** Raw row shape coming from D1 (config is still a JSON string) */
interface BrandRow {
  slug: string;
  name: string;
  brandUrl: string | null;
  logoUrl: string | null;
  driveFolderId: string | null;
  config: string | null;
  active: number;
  createdAt: string | null;
  updatedAt: string | null;
}

// ---------------------------------------------------------------------------
// Helper: parse a raw D1 row into a Brand with parsed config
// ---------------------------------------------------------------------------

function parseBrandRow(row: BrandRow): Brand {
  let parsedConfig: BrandFormConfig | null = null;
  if (row.config) {
    try {
      parsedConfig = JSON.parse(row.config) as BrandFormConfig;
    } catch {
      console.error(`Failed to parse config for brand "${row.slug}"`);
      parsedConfig = null;
    }
  }
  return {
    slug: row.slug,
    name: row.name,
    brandUrl: row.brandUrl,
    logoUrl: row.logoUrl,
    driveFolderId: row.driveFolderId,
    config: parsedConfig,
    active: row.active,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

// ---------------------------------------------------------------------------
// Table Initialization
// ---------------------------------------------------------------------------

/**
 * Ensure the brand_config table exists.
 * Called automatically on first DB access or via the /api/db-check endpoint.
 */
export async function ensureBrandConfigTable(): Promise<void> {
  const db = getDB();
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS brand_config (
      slug TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      brandUrl TEXT,
      logoUrl TEXT,
      driveFolderId TEXT,
      config TEXT,
      active INTEGER DEFAULT 1,
      createdAt TEXT,
      updatedAt TEXT
    )
  `).run();
}

// ---------------------------------------------------------------------------
// CRUD Operations
// ---------------------------------------------------------------------------

/**
 * Get a single brand by slug.
 * Returns the brand row with parsed config, or null if not found.
 */
export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const db = getDB();
  const result = await db.prepare('SELECT * FROM brand_config WHERE slug = ?')
    .bind(slug)
    .first<BrandRow>();

  if (!result) return null;
  return parseBrandRow(result);
}

/**
 * Get all brands.
 * Returns all brand rows with parsed configs.
 */
export async function getAllBrands(): Promise<Brand[]> {
  const db = getDB();
  const { results } = await db.prepare('SELECT * FROM brand_config ORDER BY createdAt DESC')
    .all<BrandRow>();

  return results.map(parseBrandRow);
}

/**
 * Create a new brand.
 * If no config is provided, uses the default configuration.
 * Returns the created brand.
 */
export async function createBrand(data: {
  slug: string;
  name: string;
  brandUrl?: string;
  logoUrl?: string;
  driveFolderId?: string;
  config?: BrandFormConfig;
  active?: number;
}): Promise<Brand> {
  const db = getDB();
  const now = new Date().toISOString();
  const config = data.config || getDefaultConfig();
  const configJson = JSON.stringify(config);
  const active = data.active ?? 1;

  await db.prepare(
    `INSERT INTO brand_config (slug, name, brandUrl, logoUrl, driveFolderId, config, active, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    data.slug,
    data.name,
    data.brandUrl || null,
    data.logoUrl || null,
    data.driveFolderId || null,
    configJson,
    active,
    now,
    now
  ).run();

  return {
    slug: data.slug,
    name: data.name,
    brandUrl: data.brandUrl || null,
    logoUrl: data.logoUrl || null,
    driveFolderId: data.driveFolderId || null,
    config,
    active,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Update an existing brand.
 * Only the provided fields will be updated.
 * Returns the updated brand, or null if the brand was not found.
 */
export async function updateBrand(
  slug: string,
  data: {
    config?: BrandFormConfig;
    name?: string;
    brandUrl?: string;
    logoUrl?: string;
    driveFolderId?: string;
    active?: number;
  }
): Promise<Brand | null> {
  const existing = await getBrandBySlug(slug);
  if (!existing) return null;

  const db = getDB();
  const now = new Date().toISOString();
  const updatedName = data.name ?? existing.name;
  const updatedBrandUrl = data.brandUrl !== undefined ? data.brandUrl : existing.brandUrl;
  const updatedLogoUrl = data.logoUrl !== undefined ? data.logoUrl : existing.logoUrl;
  const updatedDriveFolderId = data.driveFolderId !== undefined ? data.driveFolderId : existing.driveFolderId;
  const updatedActive = data.active !== undefined ? data.active : existing.active;
  const updatedConfig = data.config !== undefined ? data.config : existing.config;
  const configJson = updatedConfig ? JSON.stringify(updatedConfig) : null;

  await db.prepare(
    `UPDATE brand_config SET name = ?, brandUrl = ?, logoUrl = ?, driveFolderId = ?, config = ?, active = ?, updatedAt = ?
     WHERE slug = ?`
  ).bind(
    updatedName,
    updatedBrandUrl,
    updatedLogoUrl,
    updatedDriveFolderId,
    configJson,
    updatedActive,
    now,
    slug
  ).run();

  return {
    slug,
    name: updatedName,
    brandUrl: updatedBrandUrl,
    logoUrl: updatedLogoUrl,
    driveFolderId: updatedDriveFolderId,
    config: updatedConfig,
    active: updatedActive,
    createdAt: existing.createdAt,
    updatedAt: now,
  };
}

/**
 * Delete a brand by slug.
 */
export async function deleteBrand(slug: string): Promise<void> {
  const db = getDB();
  await db.prepare('DELETE FROM brand_config WHERE slug = ?').bind(slug).run();
}
