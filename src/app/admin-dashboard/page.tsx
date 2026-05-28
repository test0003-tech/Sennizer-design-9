'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Building2,
  ChevronRight,
  Database,
  Eye,
  EyeOff,
  Key,
  LayoutDashboard,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Store,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  FolderOpen,
  Image,
  Tag,
} from 'lucide-react';
import { BRANDS, getAllBrands, type BrandConfig } from '@/lib/brands';

/* ════════════════════════════════════════════
   AUTH CONSTANTS
   ════════════════════════════════════════════ */
const AUTH_EMAIL = 'shubham.dhyani@singleinterface.com';
const AUTH_PASSWORD = 'Resonance@123';

/* ════════════════════════════════════════════
   TYPES
   ════════════════════════════════════════════ */
interface DealerRecord {
  id: string;
  brand: string;
  storeCode: string;
  storeName: string;
  address1: string;
  locality: string;
  city: string;
  state: string;
  pinCode: string;
  latitude: number;
  longitude: number;
  storefrontPhotos: string;
  inventoryPhotos: string;
  createdAt: string;
}

/* ════════════════════════════════════════════
   LOGIN SCREEN
   ════════════════════════════════════════════ */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 500));

    if (email === AUTH_EMAIL && password === AUTH_PASSWORD) {
      localStorage.setItem('si_admin_auth', 'true');
      onLogin();
    } else {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f1e] via-[#0d1a3a] to-[#0a1628] p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#1e3a6e]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#1a3668]/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] p-8 sm:p-10 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-[#2563eb] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/20">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">Admin Dashboard</h1>
            <p className="text-sm text-white/50">SingleInterface Brand Configuration Portal</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3 mb-6">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full h-11 pl-10 pr-11 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-[#2563eb] text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Key className="h-4 w-4" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   BRAND CARD
   ════════════════════════════════════════════ */
function BrandCard({ brand, onDelete, onViewData }: { brand: BrandConfig; onDelete: (slug: string) => void; onViewData: (slug: string) => void }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center overflow-hidden">
            <img src={brand.logoUrl} alt={brand.name} className="h-8 w-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23999"><rect width="24" height="24" rx="4"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">%3F</text></svg>'; }} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#0f172a]">{brand.name}</h3>
            <p className="text-xs text-slate-400">/{brand.slug}</p>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${brand.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
          {brand.active ? 'ACTIVE' : 'INACTIVE'}
        </span>
      </div>

      <div className="space-y-2 text-xs text-slate-500 mb-4">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-3.5 w-3.5 text-slate-400" />
          <span className="truncate font-mono text-[11px]">{brand.driveFolderId}</span>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="h-3.5 w-3.5 text-slate-400" />
          <span>Added: {brand.addedAt}</span>
        </div>
        <div className="flex items-center gap-2">
          <Image className="h-3.5 w-3.5 text-slate-400" />
          <span>Color: {brand.primaryColor}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
        <a
          href={`/${brand.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          Open Form
        </a>
        <button
          onClick={() => onViewData(brand.slug)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <Database className="h-3 w-3" />
          View Data
        </button>
        <button
          onClick={() => onDelete(brand.slug)}
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Delete brand"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   DATA VIEWER MODAL
   ════════════════════════════════════════════ */
function DataViewerModal({ brandSlug, onClose }: { brandSlug: string; onClose: () => void }) {
  const [records, setRecords] = useState<DealerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/dealer?brand=${brandSlug}`);
        const data = await res.json();
        if (res.ok) {
          setRecords(data.dealers || []);
        } else {
          setError(data.error || 'Failed to fetch data');
        }
      } catch {
        setError('Network error');
      }
      setLoading(false);
    }
    fetchData();
  }, [brandSlug]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl max-h-[85vh] rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="text-base font-semibold text-[#0f172a]">
                Data for <span className="text-blue-600">{brandSlug}</span>
              </h3>
              <p className="text-xs text-slate-400">{records.length} record(s) found</p>
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-3 text-sm text-slate-500">Loading data...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-3" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12">
              <Store className="h-8 w-8 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No records found for this brand.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((rec) => (
                <div key={rec.id} className="rounded-xl border border-slate-200/80 p-4 hover:border-blue-200/60 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-[#0f172a]">{rec.storeName}</p>
                      <p className="text-xs text-slate-400">{rec.storeCode} &bull; {rec.brand}</p>
                    </div>
                    <span className="text-[10px] text-slate-400">{new Date(rec.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{rec.address1}, {rec.locality}, {rec.city}, {rec.state} - {rec.pinCode}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>Lat: {rec.latitude}</span>
                    <span>Lng: {rec.longitude}</span>
                    <span>{JSON.parse(rec.storefrontPhotos || '[]').length} storefront photos</span>
                    <span>{JSON.parse(rec.inventoryPhotos || '[]').length} inventory photos</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   ADD BRAND MODAL
   ════════════════════════════════════════════ */
function AddBrandModal({ onClose, onAdd }: { onClose: () => void; onAdd: (brand: BrandConfig) => void }) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [driveFolderId, setDriveFolderId] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  const [secondaryColor, setSecondaryColor] = useState('#1d4ed8');
  const [nomenclature, setNomenclature] = useState({
    storeCodeLabel: 'Store Code',
    storeCodePlaceholder: 'e.g. BR-DL-001',
    storeNameLabel: 'Store Name',
    storeNamePlaceholder: 'e.g. Brand Store',
    headerTitle: '',
    headerSubtitle: 'Google Business Profile Management',
    submitButtonText: 'Submit Registration',
    successMessage: 'Registration Successful!',
    storefrontPhotoLabel: 'Store Front Photos',
    inventoryPhotoLabel: 'Store Inventory Photos',
  });

  useEffect(() => {
    if (name && !slug) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''));
    }
  }, [name, slug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const brand: BrandConfig = {
      slug,
      name,
      logoUrl,
      driveFolderId,
      primaryColor,
      secondaryColor,
      nomenclature: {
        ...nomenclature,
        headerTitle: nomenclature.headerTitle || `${name} × SingleInterface`,
      },
      active: true,
      addedAt: new Date().toISOString().split('T')[0],
    };
    onAdd(brand);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Plus className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-semibold text-[#0f172a]">Setup New Brand</h3>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div>
              <h4 className="text-sm font-semibold text-[#0f172a] mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                Brand Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Brand Name <span className="text-red-500">*</span></label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Dabur" className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">URL Slug <span className="text-red-500">*</span></label>
                  <input type="text" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} required placeholder="e.g. dabur" className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
                  <p className="text-[10px] text-slate-400">URL will be: singleinterface-hyperlocal.pages.dev/{slug || 'brand'}</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Brand Logo URL</label>
                  <input type="text" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://example.com/logo.svg" className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Google Drive Folder ID <span className="text-red-500">*</span></label>
                  <input type="text" value={driveFolderId} onChange={(e) => setDriveFolderId(e.target.value)} required placeholder="e.g. 1aBcDeFgHiJkLmNoPqRs" className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
                  <p className="text-[10px] text-slate-400">Photos will be uploaded to this Drive folder</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-10 w-10 rounded-lg border border-slate-300 cursor-pointer" />
                    <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1 h-10 px-3 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Secondary Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="h-10 w-10 rounded-lg border border-slate-300 cursor-pointer" />
                    <input type="text" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="flex-1 h-10 px-3 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Nomenclature */}
            <div>
              <h4 className="text-sm font-semibold text-[#0f172a] mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4 text-blue-600" />
                Form Nomenclature
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Store Code Label</label>
                  <input type="text" value={nomenclature.storeCodeLabel} onChange={(e) => setNomenclature({ ...nomenclature, storeCodeLabel: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Store Code Placeholder</label>
                  <input type="text" value={nomenclature.storeCodePlaceholder} onChange={(e) => setNomenclature({ ...nomenclature, storeCodePlaceholder: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Store Name Label</label>
                  <input type="text" value={nomenclature.storeNameLabel} onChange={(e) => setNomenclature({ ...nomenclature, storeNameLabel: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Store Name Placeholder</label>
                  <input type="text" value={nomenclature.storeNamePlaceholder} onChange={(e) => setNomenclature({ ...nomenclature, storeNamePlaceholder: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Header Title</label>
                  <input type="text" value={nomenclature.headerTitle} onChange={(e) => setNomenclature({ ...nomenclature, headerTitle: e.target.value })} placeholder={`${name || 'Brand'} × SingleInterface`} className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Header Subtitle</label>
                  <input type="text" value={nomenclature.headerSubtitle} onChange={(e) => setNomenclature({ ...nomenclature, headerSubtitle: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Submit Button Text</label>
                  <input type="text" value={nomenclature.submitButtonText} onChange={(e) => setNomenclature({ ...nomenclature, submitButtonText: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Success Message</label>
                  <input type="text" value={nomenclature.successMessage} onChange={(e) => setNomenclature({ ...nomenclature, successMessage: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Storefront Photo Label</label>
                  <input type="text" value={nomenclature.storefrontPhotoLabel} onChange={(e) => setNomenclature({ ...nomenclature, storefrontPhotoLabel: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Inventory Photo Label</label>
                  <input type="text" value={nomenclature.inventoryPhotoLabel} onChange={(e) => setNomenclature({ ...nomenclature, inventoryPhotoLabel: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-[#2563eb] text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 transition-all flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Brand
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN DASHBOARD
   ════════════════════════════════════════════ */
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [brands, setBrands] = useState<BrandConfig[]>(getAllBrands());
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewDataSlug, setViewDataSlug] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotif = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddBrand = (brand: BrandConfig) => {
    if (brands.find((b) => b.slug === brand.slug)) {
      showNotif('error', `Brand with slug "${brand.slug}" already exists`);
      return;
    }
    setBrands((prev) => [...prev, brand]);
    setShowAddModal(false);
    showNotif('success', `Brand "${brand.name}" added successfully! Code update required to persist — see instructions below.`);
  };

  const handleDeleteBrand = (slug: string) => {
    if (slug === 'sennheiser') {
      showNotif('error', 'Cannot delete the default Sennheiser brand');
      return;
    }
    if (confirm(`Are you sure you want to remove the brand "${slug}"? This will only remove it from this session. Update the code to persist.`)) {
      setBrands((prev) => prev.filter((b) => b.slug !== slug));
      showNotif('success', `Brand "${slug}" removed from current session.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-[#2563eb] flex items-center justify-center shadow-lg shadow-blue-500/20">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-[#0f172a]">Admin Dashboard</h1>
                <p className="text-[10px] text-slate-400">Brand Lead Form Configuration</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href="/" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Site
              </a>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        {notification && (
          <div className={`mb-6 flex items-center gap-3 rounded-xl border p-4 ${notification.type === 'success' ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
            {notification.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            )}
            <p className={`text-sm font-medium ${notification.type === 'success' ? 'text-emerald-800' : 'text-red-800'}`}>{notification.message}</p>
            <button onClick={() => setNotification(null)} className="ml-auto text-slate-400 hover:text-slate-600">&times;</button>
          </div>
        )}

        {/* Stats bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Brands', value: brands.filter((b) => b.active).length, icon: Building2, color: 'text-blue-600 bg-blue-50' },
            { label: 'Total Brands', value: brands.length, icon: Store, color: 'text-violet-600 bg-violet-50' },
            { label: 'Drive Folders', value: new Set(brands.map((b) => b.driveFolderId)).size, icon: FolderOpen, color: 'text-amber-600 bg-amber-50' },
            { label: 'Form Routes', value: brands.filter((b) => b.active).length, icon: ChevronRight, color: 'text-emerald-600 bg-emerald-50' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0f172a]">{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Brands section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#0f172a]">Configured Brands</h2>
            <p className="text-xs text-slate-400">Manage brand lead form configurations and view submitted data</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-[#2563eb] text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 transition-all"
          >
            <Plus className="h-4 w-4" />
            Setup New Brand
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {brands.map((brand) => (
            <BrandCard key={brand.slug} brand={brand} onDelete={handleDeleteBrand} onViewData={setViewDataSlug} />
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-8 rounded-xl border border-amber-200/80 bg-amber-50/50 p-5">
          <h3 className="text-sm font-semibold text-amber-900 mb-2">How to persist brand changes</h3>
          <p className="text-xs text-amber-700 leading-relaxed">
            Brands added in this session are temporary. To make them permanent, you need to update the <code className="px-1 py-0.5 rounded bg-amber-100 font-mono text-[11px]">src/lib/brands.ts</code> file
            with the new brand configuration. The form at <code className="px-1 py-0.5 rounded bg-amber-100 font-mono text-[11px]">/brand-slug</code> will then automatically render
            with that brand&apos;s nomenclature, colors, and Drive folder. All dealer data is tagged with the brand name in the D1 database.
          </p>
        </div>
      </main>

      {/* Modals */}
      {showAddModal && <AddBrandModal onClose={() => setShowAddModal(false)} onAdd={handleAddBrand} />}
      {viewDataSlug && <DataViewerModal brandSlug={viewDataSlug} onClose={() => setViewDataSlug(null)} />}
    </div>
  );
}

/* ════════════════════════════════════════════
   PAGE (auth gate)
   ════════════════════════════════════════════ */
export default function AdminDashboardPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    const isAuth = localStorage.getItem('si_admin_auth') === 'true';
    setAuthenticated(isAuth);
    setChecking(false);
  }, []);

  const handleLogin = () => setAuthenticated(true);
  const handleLogout = () => {
    localStorage.removeItem('si_admin_auth');
    setAuthenticated(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!authenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}
