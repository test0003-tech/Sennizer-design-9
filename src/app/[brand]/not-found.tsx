import Link from 'next/link';

export default function BrandNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="text-center max-w-md">
        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl font-bold text-slate-400">404</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Brand Not Found</h1>
        <p className="text-slate-500 mb-6">
          The brand page you&apos;re looking for doesn&apos;t exist or hasn&apos;t been set up yet.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md hover:shadow-lg transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
