import { NextRequest, NextResponse } from 'next/server';
import { createDealer, getDealerByStoreCode, getAllDealers, deleteDealer, deleteDealersByBrand, ensureRecordsTable } from '@/lib/d1-database';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // Ensure the table exists before any operation
    await ensureRecordsTable();

    const body = await request.json();

    const {
      brand,
      storeCode,
      storeName,
      floorNo,
      addressLine1,
      addressLine2,
      addressLine3,
      subLocality,
      locality,
      landmark,
      city,
      state,
      pinCode,
      latitude,
      longitude,
      businessHours,
      storeNumber,
      email,
      whatsappNumber,
      storefrontPhotos,
      inventoryPhotos,
    } = body;

    // Validate required fields (DB accepts all, validation is config-driven on frontend)
    const requiredFields: Record<string, string> = {
      storeCode,
      storeName,
      addressLine1,
      locality,
      state,
      city,
      pinCode,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value || value.trim() === '') {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate lat/lng
    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Latitude and Longitude are required' },
        { status: 400 }
      );
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { error: 'Invalid latitude or longitude values' },
        { status: 400 }
      );
    }

    // Validate photos - at least 1 each
    if (!storefrontPhotos || !Array.isArray(storefrontPhotos) || storefrontPhotos.length === 0) {
      return NextResponse.json(
        { error: 'At least one Store Front photo is required' },
        { status: 400 }
      );
    }

    if (!inventoryPhotos || !Array.isArray(inventoryPhotos) || inventoryPhotos.length === 0) {
      return NextResponse.json(
        { error: 'At least one Store Inside photo is required' },
        { status: 400 }
      );
    }

    // Check for duplicate store code within the same brand
    const existing = await getDealerByStoreCode(storeCode.trim(), brand);
    if (existing) {
      return NextResponse.json(
        { error: 'A dealer with this Store Code already exists for this brand' },
        { status: 409 }
      );
    }

    // Parse business hours - separate day columns
    let bh: Record<string, { open?: string; close?: string }> = {};
    try {
      bh = typeof businessHours === 'string' ? JSON.parse(businessHours) : (businessHours || {});
    } catch {
      bh = {};
    }

    const sunday = bh.sunday || bh.Sunday || {};
    const monday = bh.monday || bh.Monday || {};
    const tuesday = bh.tuesday || bh.Tuesday || {};
    const wednesday = bh.wednesday || bh.Wednesday || {};
    const thursday = bh.thursday || bh.Thursday || {};
    const friday = bh.friday || bh.Friday || {};
    const saturday = bh.saturday || bh.Saturday || {};

    // Create dealer with brand tag - using new records table schema
    const dealer = await createDealer({
      id: crypto.randomUUID(),
      brand: brand || 'unknown',
      storeCode: storeCode.trim(),
      storeName: storeName.trim(),
      floorNo: floorNo?.trim() || null,
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2?.trim() || null,
      addressLine3: addressLine3?.trim() || null,
      subLocality: subLocality?.trim() || null,
      locality: locality.trim(),
      landmark: landmark?.trim() || null,
      state: state.trim(),
      city: city.trim(),
      pinCode: pinCode.trim(),
      latitude: lat,
      longitude: lng,
      sundayOpen: sunday.closed ? 'Closed' : (sunday.open || null),
      sundayClose: sunday.closed ? 'Closed' : (sunday.close || null),
      mondayOpen: monday.closed ? 'Closed' : (monday.open || null),
      mondayClose: monday.closed ? 'Closed' : (monday.close || null),
      tuesdayOpen: tuesday.closed ? 'Closed' : (tuesday.open || null),
      tuesdayClose: tuesday.closed ? 'Closed' : (tuesday.close || null),
      wednesdayOpen: wednesday.closed ? 'Closed' : (wednesday.open || null),
      wednesdayClose: wednesday.closed ? 'Closed' : (wednesday.close || null),
      thursdayOpen: thursday.closed ? 'Closed' : (thursday.open || null),
      thursdayClose: thursday.closed ? 'Closed' : (thursday.close || null),
      fridayOpen: friday.closed ? 'Closed' : (friday.open || null),
      fridayClose: friday.closed ? 'Closed' : (friday.close || null),
      saturdayOpen: saturday.closed ? 'Closed' : (saturday.open || null),
      saturdayClose: saturday.closed ? 'Closed' : (saturday.close || null),
      storeNumber: storeNumber?.trim() || null,
      email: email?.trim() || null,
      whatsappNumber: whatsappNumber?.trim() || null,
      storefrontPhotoUrls: Array.isArray(storefrontPhotos) ? storefrontPhotos.join(',') : (storefrontPhotos || null),
      insideStorePhotoUrls: Array.isArray(inventoryPhotos) ? inventoryPhotos.join(',') : (inventoryPhotos || null),
    });

    return NextResponse.json(
      { message: 'Dealer registered successfully', dealer },
      { status: 201 }
    );
  } catch (error) {
    console.error('Dealer registration error:', error);
    const message = error instanceof Error ? error.message : 'Failed to register dealer';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Ensure the table exists before any operation
    await ensureRecordsTable();

    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand') || undefined;
    const dealers = await getAllDealers(brand);
    return NextResponse.json({ dealers });
  } catch (error) {
    console.error('Fetch dealers error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch dealers';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ensureRecordsTable();

    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');
    const id = searchParams.get('id');

    if (id) {
      await deleteDealer(id);
      return NextResponse.json({ success: true, message: 'Record deleted' });
    }

    if (brand) {
      const count = await deleteDealersByBrand(brand);
      return NextResponse.json({ success: true, message: `Deleted ${count} records for brand ${brand}` });
    }

    return NextResponse.json({ error: 'Provide id or brand parameter' }, { status: 400 });
  } catch (error) {
    console.error('Delete dealer error:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
