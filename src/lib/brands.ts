/**
 * Static Brand Configuration
 * ===========================
 * Each brand defines its own form nomenclature, logo, Google Drive folder, and theming.
 * When a new brand is added via the Admin Dashboard, it must be added here as well.
 *
 * Brand data submitted through the dealer form will be tagged with the brand slug
 * so it can be filtered in the database.
 */

export interface BrandConfig {
  /** URL-friendly slug (e.g. "sennheiser") — used in routes like /sennheiser */
  slug: string;
  /** Display name shown in headers */
  name: string;
  /** Logo URL — can be an external URL or a local path */
  logoUrl: string;
  /** Google Drive folder ID where this brand's photos get uploaded */
  driveFolderId: string;
  /** Theme color for the brand (Tailwind hex) */
  primaryColor: string;
  /** Secondary theme color */
  secondaryColor: string;
  /** Form field nomenclature — controls labels and placeholders */
  nomenclature: {
    storeCodeLabel: string;
    storeCodePlaceholder: string;
    storeNameLabel: string;
    storeNamePlaceholder: string;
    headerTitle: string;
    headerSubtitle: string;
    submitButtonText: string;
    successMessage: string;
    storefrontPhotoLabel: string;
    inventoryPhotoLabel: string;
  };
  /** Is this brand active? */
  active: boolean;
  /** When was this brand added? */
  addedAt: string;
}

export const BRANDS: Record<string, BrandConfig> = {};

// NOTE: Brands are now managed entirely via the Admin Dashboard (D1 database).
// Static brand configs are no longer used. To add a brand, use the Admin Dashboard.

/** Get a brand config by slug */
export function getBrandConfig(slug: string): BrandConfig | null {
  return BRANDS[slug.toLowerCase()] || null;
}

/** Get all active brands */
export function getActiveBrands(): BrandConfig[] {
  return Object.values(BRANDS).filter((b) => b.active);
}

/** Get all brands (active + inactive) */
export function getAllBrands(): BrandConfig[] {
  return Object.values(BRANDS);
}

/** Validate a brand slug */
export function isValidBrand(slug: string): boolean {
  return slug.toLowerCase() in BRANDS;
}
