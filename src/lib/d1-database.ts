/**
 * Cloudflare D1 Database Helper (Native D1 Bindings)
 * ===================================================
 * Uses native D1 bindings via getRequestContext() — NO API token needed.
 * Compatible with Edge Runtime.
 */

import { getRequestContext } from '@cloudflare/next-on-pages';

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
// Dealer Type
// ---------------------------------------------------------------------------

export interface Dealer {
  id: string;
  brand: string;
  storeCode: string;
  storeName: string;
  floorNo: string | null;
  addressLine1: string;
  addressLine2: string | null;
  addressLine3: string | null;
  subLocality: string | null;
  locality: string;
  landmark: string | null;
  city: string;
  state: string;
  pinCode: string;
  latitude: number | null;
  longitude: number | null;
  sundayOpen: string | null;
  sundayClose: string | null;
  mondayOpen: string | null;
  mondayClose: string | null;
  tuesdayOpen: string | null;
  tuesdayClose: string | null;
  wednesdayOpen: string | null;
  wednesdayClose: string | null;
  thursdayOpen: string | null;
  thursdayClose: string | null;
  fridayOpen: string | null;
  fridayClose: string | null;
  saturdayOpen: string | null;
  saturdayClose: string | null;
  storeNumber: string | null;
  email: string | null;
  whatsappNumber: string | null;
  storefrontPhotoUrls: string | null;
  insideStorePhotoUrls: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Table Initialization
// ---------------------------------------------------------------------------

/**
 * Ensure the records table exists.
 * Called automatically on first DB access or via the /api/db-check endpoint.
 */
export async function ensureRecordsTable(): Promise<void> {
  const db = getDB();
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS records (
      id TEXT PRIMARY KEY,
      brand TEXT NOT NULL,
      storeCode TEXT NOT NULL,
      storeName TEXT NOT NULL,
      floorNo TEXT,
      addressLine1 TEXT NOT NULL,
      addressLine2 TEXT,
      addressLine3 TEXT,
      subLocality TEXT,
      locality TEXT NOT NULL,
      landmark TEXT,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pinCode TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      sundayOpen TEXT,
      sundayClose TEXT,
      mondayOpen TEXT,
      mondayClose TEXT,
      tuesdayOpen TEXT,
      tuesdayClose TEXT,
      wednesdayOpen TEXT,
      wednesdayClose TEXT,
      thursdayOpen TEXT,
      thursdayClose TEXT,
      fridayOpen TEXT,
      fridayClose TEXT,
      saturdayOpen TEXT,
      saturdayClose TEXT,
      storeNumber TEXT,
      email TEXT,
      whatsappNumber TEXT,
      storefrontPhotoUrls TEXT,
      insideStorePhotoUrls TEXT,
      createdAt TEXT,
      updatedAt TEXT
    )
  `).run();
}

// ---------------------------------------------------------------------------
// CRUD Operations
// ---------------------------------------------------------------------------

export async function createDealer(dealer: Omit<Dealer, 'createdAt' | 'updatedAt'>): Promise<Dealer> {
  const db = getDB();
  const now = new Date().toISOString();

  await db.prepare(
    `INSERT INTO records (id, brand, storeCode, storeName, floorNo, addressLine1, addressLine2, addressLine3, subLocality, locality, landmark, city, state, pinCode, latitude, longitude, sundayOpen, sundayClose, mondayOpen, mondayClose, tuesdayOpen, tuesdayClose, wednesdayOpen, wednesdayClose, thursdayOpen, thursdayClose, fridayOpen, fridayClose, saturdayOpen, saturdayClose, storeNumber, email, whatsappNumber, storefrontPhotoUrls, insideStorePhotoUrls, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    dealer.id,
    dealer.brand,
    dealer.storeCode,
    dealer.storeName,
    dealer.floorNo || null,
    dealer.addressLine1,
    dealer.addressLine2 || null,
    dealer.addressLine3 || null,
    dealer.subLocality || null,
    dealer.locality,
    dealer.landmark || null,
    dealer.city,
    dealer.state,
    dealer.pinCode,
    dealer.latitude ?? null,
    dealer.longitude ?? null,
    dealer.sundayOpen || null,
    dealer.sundayClose || null,
    dealer.mondayOpen || null,
    dealer.mondayClose || null,
    dealer.tuesdayOpen || null,
    dealer.tuesdayClose || null,
    dealer.wednesdayOpen || null,
    dealer.wednesdayClose || null,
    dealer.thursdayOpen || null,
    dealer.thursdayClose || null,
    dealer.fridayOpen || null,
    dealer.fridayClose || null,
    dealer.saturdayOpen || null,
    dealer.saturdayClose || null,
    dealer.storeNumber || null,
    dealer.email || null,
    dealer.whatsappNumber || null,
    dealer.storefrontPhotoUrls || null,
    dealer.insideStorePhotoUrls || null,
    now,
    now
  ).run();

  return { ...dealer, createdAt: now, updatedAt: now };
}

export async function getDealerByStoreCode(storeCode: string, brand?: string): Promise<Dealer | null> {
  const db = getDB();
  if (brand) {
    return db.prepare(
      'SELECT * FROM records WHERE storeCode = ? AND brand = ?'
    ).bind(storeCode, brand).first<Dealer>();
  }
  return db.prepare(
    'SELECT * FROM records WHERE storeCode = ?'
  ).bind(storeCode).first<Dealer>();
}

export async function getAllDealers(brand?: string): Promise<Dealer[]> {
  const db = getDB();
  if (brand) {
    const { results } = await db.prepare(
      'SELECT * FROM records WHERE brand = ? ORDER BY createdAt DESC'
    ).bind(brand).all<Dealer>();
    return results;
  }
  const { results } = await db.prepare(
    'SELECT * FROM records ORDER BY createdAt DESC'
  ).all<Dealer>();
  return results;
}

export async function deleteDealer(id: string): Promise<void> {
  const db = getDB();
  await db.prepare('DELETE FROM records WHERE id = ?').bind(id).run();
}

export async function deleteDealersByBrand(brand: string): Promise<number> {
  const db = getDB();
  const countResult = await db.prepare(
    'SELECT COUNT(*) as count FROM records WHERE brand = ?'
  ).bind(brand).first<{ count: number }>();
  const count = countResult?.count || 0;
  await db.prepare('DELETE FROM records WHERE brand = ?').bind(brand).run();
  return count;
}

export async function getDealerCountByBrand(): Promise<{ brand: string; count: number }[]> {
  const db = getDB();
  const { results } = await db.prepare(
    'SELECT brand, COUNT(*) as count FROM records GROUP BY brand'
  ).all<{ brand: string; count: number }>();
  return results;
}
