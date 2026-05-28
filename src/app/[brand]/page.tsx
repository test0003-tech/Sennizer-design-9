import { notFound } from 'next/navigation';
import ConfigurableDealerForm from '@/components/configurable-dealer-form';
import { getBrandBySlug, ensureBrandConfigTable } from '@/lib/brand-db';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface BrandPageProps {
  params: Promise<{ brand: string }>;
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brand } = await params;
  const normalizedBrand = brand.toLowerCase();

  // All brands come from D1 database (managed via Admin Dashboard)
  try {
    await ensureBrandConfigTable();
    const d1Brand = await getBrandBySlug(normalizedBrand);

    if (!d1Brand || !d1Brand.active) {
      notFound();
    }

    return <ConfigurableDealerForm brandData={d1Brand} />;
  } catch (error) {
    console.error('Error loading brand page:', error);
    notFound();
  }
}
