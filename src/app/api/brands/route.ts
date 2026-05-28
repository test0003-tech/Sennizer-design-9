import { NextRequest, NextResponse } from 'next/server';
import {
  getBrandBySlug,
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  ensureBrandConfigTable,
  getDefaultConfig,
  type BrandFormConfig,
} from '@/lib/brand-db';

export const runtime = 'edge';

// ---------------------------------------------------------------------------
// POST — Create a new brand
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    // Ensure the table exists before any operation
    await ensureBrandConfigTable();

    const body = await request.json();

    const { slug, name, logoUrl, driveFolderId, brandUrl, config } = body as {
      slug?: string;
      name?: string;
      logoUrl?: string;
      driveFolderId?: string;
      brandUrl?: string;
      config?: BrandFormConfig;
    };

    // Validate required fields
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json(
        { error: 'slug is required' },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'name is required' },
        { status: 400 }
      );
    }

    // Check if slug is already taken
    const existing = await getBrandBySlug(slug.trim());
    if (existing) {
      return NextResponse.json(
        { error: `Brand with slug "${slug.trim()}" already exists` },
        { status: 409 }
      );
    }

    const brand = await createBrand({
      slug: slug.trim(),
      name: name.trim(),
      brandUrl,
      logoUrl,
      driveFolderId,
      config: config || getDefaultConfig(),
    });

    return NextResponse.json({ brand }, { status: 201 });
  } catch (error) {
    console.error('Create brand error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create brand';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// PUT — Update an existing brand
// ---------------------------------------------------------------------------

export async function PUT(request: NextRequest) {
  try {
    // Ensure the table exists before any operation
    await ensureBrandConfigTable();

    const body = await request.json();

    const { slug, name, logoUrl, driveFolderId, brandUrl, config, active } = body as {
      slug?: string;
      name?: string;
      logoUrl?: string;
      driveFolderId?: string;
      brandUrl?: string;
      config?: BrandFormConfig;
      active?: number;
    };

    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json(
        { error: 'slug is required to identify the brand to update' },
        { status: 400 }
      );
    }

    const updated = await updateBrand(slug.trim(), {
      name,
      brandUrl,
      logoUrl,
      driveFolderId,
      config,
      active,
    });

    if (!updated) {
      return NextResponse.json(
        { error: `Brand with slug "${slug.trim()}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ brand: updated });
  } catch (error) {
    console.error('Update brand error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update brand';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// GET — Retrieve brand(s)
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    // Ensure the table exists before any operation
    await ensureBrandConfigTable();

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      // Return a specific brand
      const brand = await getBrandBySlug(slug);
      if (!brand) {
        return NextResponse.json(
          { error: `Brand with slug "${slug}" not found` },
          { status: 404 }
        );
      }
      return NextResponse.json({ brand });
    }

    // Return all brands
    const brands = await getAllBrands();
    return NextResponse.json({ brands });
  } catch (error) {
    console.error('Fetch brands error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch brands';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// DELETE — Delete a brand
// ---------------------------------------------------------------------------

export async function DELETE(request: NextRequest) {
  try {
    // Ensure the table exists before any operation
    await ensureBrandConfigTable();

    const body = await request.json();

    const { slug } = body as { slug?: string };

    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json(
        { error: 'slug is required' },
        { status: 400 }
      );
    }

    // Verify the brand exists before deleting
    const existing = await getBrandBySlug(slug.trim());
    if (!existing) {
      return NextResponse.json(
        { error: `Brand with slug "${slug.trim()}" not found` },
        { status: 404 }
      );
    }

    await deleteBrand(slug.trim());

    return NextResponse.json({
      success: true,
      message: `Brand "${slug.trim()}" deleted successfully`,
    });
  } catch (error) {
    console.error('Delete brand error:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete brand';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
