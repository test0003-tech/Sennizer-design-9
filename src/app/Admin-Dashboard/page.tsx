'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  MapPin,
  Palette,
  Download,
  ChevronDown,
  ChevronUp,
  Settings,
  Rocket,
  Save,
  Clock,
  Camera,
  Map,
  Phone,
  Type,
  Paintbrush,
} from 'lucide-react';
import {
  type BrandFormConfig,
  type FormSectionConfig,
  type FormFieldConfig,
  type ColorConfig,
  getDefaultConfig,
} from '@/lib/brand-types';

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
}

interface Brand {
  slug: string;
  name: string;
  brandUrl: string | null;
  logoUrl: string | null;
  driveFolderId: string | null;
  config: BrandFormConfig | null;
  active: number;
  createdAt: string | null;
  updatedAt: string | null;
}

/* ════════════════════════════════════════════
   GENERATE PREVIEW HTML
   ════════════════════════════════════════════ */
function generatePreviewHTML(config: BrandFormConfig, brandName: string, brandLogoUrl: string): string {
  const c = config.colors;
  const sections = config.sections;

  const renderField = (fieldKey: string, field: FormFieldConfig) => {
    if (!field.enabled) return '';
    const reqMark = field.required ? '<span style="color:#e74c3c;margin-left:2px">*</span>' : '';
    const inputStyle = `width:100%;padding:10px 12px;border:1px solid ${c.inputBorder};border-radius:8px;font-size:14px;background:${c.inputBg};color:#333;outline:none;transition:border-color 0.2s,box-shadow 0.2s`;
    const focusHandlers = `onfocus="this.style.borderColor='${c.inputFocusBorder}';this.style.boxShadow='0 0 0 3px ${c.inputFocusShadow}'" onblur="this.style.borderColor='${c.inputBorder}';this.style.boxShadow='none'"`;

    let inputHTML = '';
    if (field.type === 'dropdown' && field.options && field.options.length > 0) {
      const optionTags = [`<option value="">${field.placeholder || 'Select'}</option>`, ...field.options.map(o => `<option value="${o}">${o}</option>`)].join('');
      inputHTML = `<select style="${inputStyle};appearance:auto;padding-right:12px" ${focusHandlers}>${optionTags}</select>`;
    } else {
      inputHTML = `<input type="text" placeholder="${field.placeholder}" style="${inputStyle}" ${focusHandlers} />`;
    }

    return `
      <div style="margin-bottom:16px">
        <label style="display:block;font-size:13px;font-weight:500;color:${c.label};margin-bottom:6px">
          ${field.label}${reqMark}
        </label>
        ${inputHTML}
      </div>`;
  };

  const renderSection = (sectionKey: string, section: FormSectionConfig, icon: string) => {
    if (!section.enabled) return '';
    const fieldKeys = Object.keys(section.fields);
    const hasFields = fieldKeys.length > 0;
    return `
      <div style="margin-bottom:24px">
        <h3 style="font-size:16px;font-weight:600;color:${c.sectionTitle};padding-bottom:8px;border-bottom:3px solid ${c.sectionTitleBorder};margin-bottom:16px;display:flex;align-items:center;gap:8px">
          <span>${icon}</span> ${section.title}
        </h3>
        ${hasFields ? fieldKeys.map(fk => renderField(fk, section.fields[fk])).join('') : ''}
      </div>`;
  };

  // Location section
  let locationHTML = '';
  if (sections.location.enabled) {
    locationHTML = `
      <div style="margin-bottom:24px">
        <h3 style="font-size:16px;font-weight:600;color:${c.sectionTitle};padding-bottom:8px;border-bottom:3px solid ${c.sectionTitleBorder};margin-bottom:16px;display:flex;align-items:center;gap:8px">
          <span>&#128205;</span> ${sections.location.title}
        </h3>
        <div style="width:100%;height:200px;border-radius:10px;border:2px dashed ${c.inputBorder};background:${c.inputBg};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#999">
          <div style="font-size:32px">&#128506;</div>
          <div style="font-size:13px">Map Preview Area</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
          <div>
            <label style="display:block;font-size:13px;font-weight:500;color:${c.label};margin-bottom:6px">Latitude</label>
            <input type="text" placeholder="28.6139" style="width:100%;padding:10px 12px;border:1px solid ${c.inputBorder};border-radius:8px;font-size:14px;background:${c.inputBg};color:#333;outline:none" />
          </div>
          <div>
            <label style="display:block;font-size:13px;font-weight:500;color:${c.label};margin-bottom:6px">Longitude</label>
            <input type="text" placeholder="77.2090" style="width:100%;padding:10px 12px;border:1px solid ${c.inputBorder};border-radius:8px;font-size:14px;background:${c.inputBg};color:#333;outline:none" />
          </div>
        </div>
        <button type="button" style="margin-top:10px;width:100%;padding:10px;border:none;border-radius:8px;background:${c.mapButton};color:#fff;font-size:14px;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px">
          &#128205; Use Current Location
        </button>
      </div>`;
  }

  // Storefront photos section
  let storefrontHTML = '';
  if (sections.storefrontPhotos.enabled) {
    storefrontHTML = `
      <div style="margin-bottom:24px">
        <h3 style="font-size:16px;font-weight:600;color:${c.sectionTitle};padding-bottom:8px;border-bottom:3px solid ${c.sectionTitleBorder};margin-bottom:16px;display:flex;align-items:center;gap:8px">
          <span>&#127912;</span> ${sections.storefrontPhotos.title}
        </h3>
        <div style="border:2px dashed ${c.inputBorder};border-radius:10px;padding:24px;text-align:center;background:${c.inputBg}">
          <div style="font-size:28px;margin-bottom:8px">&#128247;</div>
          <div style="font-size:13px;color:#999">Click or drag to upload storefront photos</div>
        </div>
      </div>`;
  }

  // Inventory photos section
  let inventoryHTML = '';
  if (sections.inventoryPhotos.enabled) {
    inventoryHTML = `
      <div style="margin-bottom:24px">
        <h3 style="font-size:16px;font-weight:600;color:${c.sectionTitle};padding-bottom:8px;border-bottom:3px solid ${c.sectionTitleBorder};margin-bottom:16px;display:flex;align-items:center;gap:8px">
          <span>&#128230;</span> ${sections.inventoryPhotos.title}
        </h3>
        <div style="border:2px dashed ${c.inputBorder};border-radius:10px;padding:24px;text-align:center;background:${c.inputBg}">
          <div style="font-size:28px;margin-bottom:8px">&#128247;</div>
          <div style="font-size:13px;color:#999">Click or drag to upload inventory photos</div>
        </div>
      </div>`;
  }

  // Business hours section
  let businessHoursHTML = '';
  if (sections.businessHours.enabled) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayRows = days.map(day => `
      <div style="display:grid;grid-template-columns:110px 1fr 1fr;gap:8px;align-items:center;padding:6px 0;border-bottom:1px solid ${c.inputBorder}">
        <span style="font-size:13px;font-weight:500;color:${c.label}">${day}</span>
        <input type="text" placeholder="09:00 AM" style="padding:8px 10px;border:1px solid ${c.inputBorder};border-radius:6px;font-size:13px;background:${c.inputBg};color:#333;outline:none" />
        <input type="text" placeholder="06:00 PM" style="padding:8px 10px;border:1px solid ${c.inputBorder};border-radius:6px;font-size:13px;background:${c.inputBg};color:#333;outline:none" />
      </div>`).join('');

    businessHoursHTML = `
      <div style="margin-bottom:24px">
        <h3 style="font-size:16px;font-weight:600;color:${c.sectionTitle};padding-bottom:8px;border-bottom:3px solid ${c.sectionTitleBorder};margin-bottom:16px;display:flex;align-items:center;gap:8px">
          <span>&#128336;</span> ${sections.businessHours.title}
        </h3>
        <div style="display:grid;grid-template-columns:110px 1fr 1fr;gap:8px;padding:6px 0;margin-bottom:4px">
          <span style="font-size:11px;font-weight:600;color:#999;text-transform:uppercase">Day</span>
          <span style="font-size:11px;font-weight:600;color:#999;text-transform:uppercase">Open</span>
          <span style="font-size:11px;font-weight:600;color:#999;text-transform:uppercase">Close</span>
        </div>
        ${dayRows}
      </div>`;
  }

  const siLogoUrl = 'https://www.singleinterface.com/Enquiry/imgwebp/Singleinterface-logo-light.svg';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${brandName} - Dealer Registration</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: ${c.pageBg}; color: #333; }
    .form-container { max-width: 100%; margin: 0 auto; padding: 20px 24px; }
    .header { background: ${c.header}; border-radius: 14px 14px 0 0; padding: 16px 24px; margin-bottom: 0; display: flex; align-items: center; justify-content: space-between; }
    .header-logo { height: 48px; width: auto; max-width: 200px; object-fit: contain; filter: brightness(0) invert(1); }
    .header-si-logo { height: 40px; width: auto; object-fit: contain; }
    .body-headings { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid ${c.inputBorder}; }
    .body-heading-left { font-size: 18px; font-weight: 700; color: ${c.sectionTitle}; }
    .body-heading-right { font-size: 14px; font-weight: 600; color: #6b7280; }
    .form-card { background: ${c.formBg}; border-radius: 0 0 14px 14px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .submit-btn { width: 100%; padding: 14px; border: none; border-radius: 10px; background: ${c.submitButton}; color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; margin-top: 8px; transition: background 0.2s; }
    .submit-btn:hover { background: ${c.submitButtonHover}; }
  </style>
</head>
<body>
  <div class="form-container">
    <div class="header">
      ${brandLogoUrl ? `<img src="${brandLogoUrl}" alt="${brandName}" class="header-logo" onerror="this.style.display='none'" />` : `<div style="height:44px;min-width:44px;border-radius:10px;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;font-weight:700">${brandName.charAt(0)}</div>`}
      <img src="${siLogoUrl}" alt="SingleInterface" class="header-si-logo" onerror="this.style.display='none'" />
    </div>

    <div class="form-card">
      <div class="body-headings">
        <span class="body-heading-left">${config.headerTitle}</span>
        <span class="body-heading-right">${config.headerSubtitle}</span>
      </div>
      ${renderSection('storeDetails', sections.storeDetails, '&#127978;')}
      ${renderSection('address', sections.address, '&#128205;')}
      ${locationHTML}
      ${businessHoursHTML}
      ${renderSection('contactDetails', sections.contactDetails, '&#128222;')}
      ${storefrontHTML}
      ${inventoryHTML}

      <button type="button" class="submit-btn">${config.submitButtonText}</button>
      <p style="text-align:center;margin-top:12px;font-size:12px;color:#999">Powered by SingleInterface</p>
    </div>
  </div>
</body>
</html>`;
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
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#1e3a6e]/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#1a3668]/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-[#162d5a]/10 blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] p-8 sm:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-emerald-500/20">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Brand Location Data Gather</h1>
            <p className="text-sm text-white/50">Form Management Portal</p>
            <div className="mt-3 h-0.5 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full" />
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
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
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
                  className="w-full h-12 pl-10 pr-12 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
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
              className="w-full h-12 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25 hover:shadow-emerald-500/40 transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          <p className="text-center text-[11px] text-white/20 mt-6">
            SingleInterface Brand Management System
          </p>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   COLOR PICKER COMPONENT
   ════════════════════════════════════════════ */
function ColorPickerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <label className="text-xs font-medium text-slate-600 mb-1 block">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value.startsWith('#') ? value : '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 w-9 rounded-lg border border-slate-300 cursor-pointer shrink-0"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 h-9 px-3 rounded-lg border border-slate-300 text-xs font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
          />
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   TOGGLE SWITCH COMPONENT
   ════════════════════════════════════════════ */
function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
        checked ? 'bg-emerald-500' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

/* ════════════════════════════════════════════
   BRAND CARD
   ════════════════════════════════════════════ */
function BrandCard({
  brand,
  onDelete,
  onViewData,
  onSetupForm,
  onClearCache,
  recordCount,
}: {
  brand: Brand;
  onDelete: (slug: string) => void;
  onViewData: (slug: string) => void;
  onSetupForm: (slug: string) => void;
  onClearCache: (slug: string) => void;
  recordCount: number;
}) {
  const [clearingCache, setClearingCache] = useState(false);

  const handleClearCache = async () => {
    setClearingCache(true);
    try {
      const res = await fetch('/api/clear-cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: brand.slug }),
      });
      if (res.ok) {
        onClearCache(brand.slug);
      }
    } catch {
      // ignore
    }
    setClearingCache(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all group">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center overflow-hidden">
              {brand.logoUrl ? (
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="h-8 w-8 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <Building2 className="h-6 w-6 text-slate-400" />
              )}
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#0f172a]">{brand.name}</h3>
              <p className="text-xs text-slate-400 font-mono">/{brand.slug}</p>
            </div>
          </div>
          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
              brand.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {brand.active ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>

        <div className="space-y-2 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-3.5 w-3.5 text-slate-400" />
            <span className="truncate font-mono text-[11px]">{brand.driveFolderId || 'Not set'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="h-3.5 w-3.5 text-slate-400" />
            <span>{recordCount} record(s)</span>
          </div>
          <div className="flex items-center gap-2">
            <Palette className="h-3.5 w-3.5 text-slate-400" />
            <span>{brand.config ? 'Configured' : 'Default config'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
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
          onClick={() => onSetupForm(brand.slug)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
        >
          <Settings className="h-3 w-3" />
          Setup Form
        </button>
        <button
          onClick={handleClearCache}
          disabled={clearingCache}
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-50"
          title="Clear Cache"
        >
          {clearingCache ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
        </button>
        <button
          onClick={() => onViewData(brand.slug)}
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="View Data"
        >
          <Database className="h-3.5 w-3.5" />
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
function DataViewerModal({ brandSlug, brandName, onClose }: { brandSlug: string; brandName: string; onClose: () => void }) {
  const [records, setRecords] = useState<DealerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredRecords = records.filter(
    (r) =>
      r.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.storeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) return;
    const headers = ['ID', 'Brand', 'Store Code', 'Store Name', 'Address Line 1', 'Address Line 2', 'Address Line 3', 'Sub Locality', 'Locality', 'Landmark', 'City', 'State', 'Pin Code', 'Latitude', 'Longitude', 'Store Number', 'Email', 'WhatsApp Number', 'Storefront Photos', 'Inventory Photos', 'Created At'];
    const rows = filteredRecords.map((r) =>
      [r.id, r.brand, r.storeCode, r.storeName, r.addressLine1, r.addressLine2 || '', r.addressLine3 || '', r.subLocality || '', r.locality, r.landmark || '', r.city, r.state, r.pinCode, r.latitude ?? '', r.longitude ?? '', r.storeNumber || '', r.email || '', r.whatsappNumber || '', r.storefrontPhotoUrls ? r.storefrontPhotoUrls.split(',').length : 0, r.insideStorePhotoUrls ? r.insideStorePhotoUrls.split(',').length : 0, r.createdAt].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brandSlug}-data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl max-h-[90vh] rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-semibold text-[#0f172a]">
                Data for <span className="text-emerald-600">{brandName}</span>
              </h3>
              <p className="text-xs text-slate-400">{records.length} record(s) found</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={filteredRecords.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50"
            >
              <Download className="h-3 w-3" />
              Export CSV
            </button>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-3 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by store name, code, or city..."
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 max-h-96">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              <span className="ml-3 text-sm text-slate-500">Loading data...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-3" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <Store className="h-8 w-8 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">
                {searchTerm ? 'No records match your search.' : 'No records found for this brand.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="rounded-xl border border-slate-200/80 p-4 hover:border-emerald-200/60 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-[#0f172a]">{rec.storeName}</p>
                      <p className="text-xs text-slate-400">
                        {rec.storeCode} &bull; {rec.brand}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(rec.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">
                    {rec.addressLine1}{rec.addressLine2 ? `, ${rec.addressLine2}` : ''}{rec.addressLine3 ? `, ${rec.addressLine3}` : ''}, {rec.locality}, {rec.city}, {rec.state} - {rec.pinCode}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {rec.latitude ?? 'N/A'}, {rec.longitude ?? 'N/A'}
                    </span>
                    <span>{rec.storefrontPhotoUrls ? rec.storefrontPhotoUrls.split(',').length : 0} storefront photos</span>
                    <span>{rec.insideStorePhotoUrls ? rec.insideStorePhotoUrls.split(',').length : 0} inventory photos</span>
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
   ADD BRAND MODAL (Simplified)
   ════════════════════════════════════════════ */
function AddBrandModal({ onClose, onAdd }: { onClose: () => void; onAdd: () => void }) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [brandUrl, setBrandUrl] = useState('');
  const [driveFolderId, setDriveFolderId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleNameChange = (val: string) => {
    setName(val);
    if (val && !slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          name,
          logoUrl: logoUrl || undefined,
          brandUrl: brandUrl || undefined,
          driveFolderId: driveFolderId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create brand');
        setSaving(false);
        return;
      }
      onAdd();
    } catch {
      setError('Network error');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[90vh] rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <Plus className="h-5 w-5 text-emerald-600" />
            <h3 className="text-base font-semibold text-[#0f172a]">Setup New Brand</h3>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {error && (
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-3 mb-4">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">
                Brand Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                placeholder="e.g. Sennheiser"
                className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">
                Brand Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) =>
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                }
                required
                placeholder="e.g. sennheiser"
                className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
              />
              <p className="text-[10px] text-slate-400">
                Form URL: singleinterface-hyperlocal.pages.dev/{slug || 'brand'}
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Brand Logo URL</label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.svg"
                className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">
                Google Drive Folder ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={driveFolderId}
                onChange={(e) => setDriveFolderId(e.target.value)}
                required
                placeholder="e.g. 1aBcDeFgHiJkLmNoPqRs"
                className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
              />
              <p className="text-[10px] text-slate-400">Photos will be uploaded to this Drive folder</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Brand URL</label>
              <input
                type="text"
                value={brandUrl}
                onChange={(e) => setBrandUrl(e.target.value)}
                placeholder="e.g. https://www.example.com"
                className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
              />
              <p className="text-[10px] text-slate-400">The brand&apos;s primary website URL</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !name || !slug || !driveFolderId}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25 hover:shadow-emerald-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Create Brand
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   FORM CONFIGURATOR
   ════════════════════════════════════════════ */
function FormConfigurator({
  brand,
  onClose,
  onSaved,
}: {
  brand: Brand;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [config, setConfig] = useState<BrandFormConfig>(() => brand.config || getDefaultConfig());
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    // Auto-expand sections that have fields
    const initial: Record<string, boolean> = {};
    const cfg = brand.config || getDefaultConfig();
    for (const key of Object.keys(cfg.sections)) {
      const section = cfg.sections[key as keyof typeof cfg.sections];
      if (section.enabled && Object.keys(section.fields).length > 0) {
        initial[key] = true;
      }
    }
    return initial;
  });
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(-1);
  const [deployComplete, setDeployComplete] = useState(false);
  const [showDeployConfirm, setShowDeployConfirm] = useState(false);

  const previewHTML = useMemo(
    () => generatePreviewHTML(config, brand.name, brand.logoUrl || ''),
    [config, brand.name, brand.logoUrl]
  );

  const toggleSectionExpand = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateSection = (key: string, updates: Partial<FormSectionConfig>) => {
    setConfig((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [key]: { ...prev.sections[key as keyof typeof prev.sections], ...updates },
      },
    }));
  };

  const updateField = (sectionKey: string, fieldKey: string, updates: Partial<FormFieldConfig>) => {
    setConfig((prev) => {
      const section = prev.sections[sectionKey as keyof typeof prev.sections];
      return {
        ...prev,
        sections: {
          ...prev.sections,
          [sectionKey]: {
            ...section,
            fields: {
              ...section.fields,
              [fieldKey]: { ...section.fields[fieldKey], ...updates },
            },
          },
        },
      };
    });
  };

  const updateColor = (key: keyof ColorConfig, value: string) => {
    setConfig((prev) => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }));
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/brands', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: brand.slug, config }),
      });
      if (res.ok) {
        onSaved();
      }
    } catch {
      // ignore
    }
    setSaving(false);
  };

  const handleDeploy = () => {
    setShowDeployConfirm(true);
  };

  const [deployMessage, setDeployMessage] = useState('');

  const confirmDeploy = async () => {
    setShowDeployConfirm(false);
    setDeploying(true);
    setDeployStep(0);

    // Step 1: Save configuration to D1
    await new Promise((r) => setTimeout(r, 500));
    setDeployStep(1);

    // Step 2: Push to Git & trigger Cloudflare Pages rebuild
    let deployResult: { success?: boolean; deployTriggered?: boolean; message?: string } = {};
    try {
      const res = await fetch('/api/deploy-brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: brand.slug, config, active: 1 }),
      });
      deployResult = await res.json();
    } catch (err) {
      deployResult = { success: false, message: 'Network error during deploy' };
    }
    setDeployStep(2);

    // Step 3: Wait for Cloudflare Pages to pick up the commit
    await new Promise((r) => setTimeout(r, 1500));
    setDeployStep(3);

    // Step 4: Complete
    await new Promise((r) => setTimeout(r, 500));
    setDeployMessage(deployResult.message || 'Deployment complete');
    setDeployComplete(true);
    setDeploying(false);
    onSaved();
  };

  const sectionConfig = [
    { key: 'storeDetails', label: 'Store Details', icon: <Store className="h-4 w-4" /> },
    { key: 'address', label: 'Store Address', icon: <MapPin className="h-4 w-4" /> },
    { key: 'location', label: 'Store Location', icon: <Map className="h-4 w-4" /> },
    { key: 'businessHours', label: 'Business Hours', icon: <Clock className="h-4 w-4" /> },
    { key: 'contactDetails', label: 'Contact Details', icon: <Phone className="h-4 w-4" /> },
    { key: 'storefrontPhotos', label: 'Store Front Photos', icon: <Camera className="h-4 w-4" /> },
    { key: 'inventoryPhotos', label: 'Store Inside Photos', icon: <Camera className="h-4 w-4" /> },
  ];

  const colorFields: { key: keyof ColorConfig; label: string; group?: string }[] = [
    { key: 'header', label: 'Header', group: 'Header' },
    { key: 'sectionTitle', label: 'Form Headings Color', group: 'Form Headings' },
    { key: 'sectionTitleBorder', label: 'Form Headings Border', group: 'Form Headings' },
    { key: 'label', label: 'Form Elements (Labels)', group: 'Form Elements' },
    { key: 'inputBg', label: 'Input Box Background', group: 'Input Boxes' },
    { key: 'inputBorder', label: 'Input Box Border', group: 'Input Boxes' },
    { key: 'inputFocusBorder', label: 'Input Focus Border', group: 'Input Boxes' },
    { key: 'mapButton', label: 'Button (Map/Location)', group: 'Buttons' },
    { key: 'submitButton', label: 'Submit Button', group: 'Final Submit Button' },
    { key: 'submitButtonHover', label: 'Submit Button Hover', group: 'Final Submit Button' },
    { key: 'formBg', label: 'Form Background', group: 'Form Background' },
    { key: 'pageBg', label: 'Overall Background', group: 'Overall Background' },
  ];

  const sectionKey = (key: string) => key as keyof BrandFormConfig['sections'];

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200 bg-white shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-[#0f172a]">
              Form Configurator &mdash; {brand.name}
            </h2>
            <p className="text-[10px] text-slate-400">/{brand.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save as Draft
          </button>
          <button
            onClick={handleDeploy}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25 hover:shadow-emerald-500/40 transition-all"
          >
            <Rocket className="h-3.5 w-3.5" />
            Deploy
          </button>
        </div>
      </div>

      {/* Body - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Config */}
        <div className="w-[50%] border-r border-slate-200 overflow-y-auto p-4 sm:p-5 space-y-6 bg-slate-50/30">
          {/* Section A: Section Toggles */}
          <div>
            <h3 className="text-sm font-semibold text-[#0f172a] mb-3 flex items-center gap-2">
              <Settings className="h-4 w-4 text-emerald-600" />
              Form Sections
            </h3>
            <div className="space-y-2">
              {sectionConfig.map((sec) => {
                const sKey = sectionKey(sec.key);
                const section = config.sections[sKey];
                const isExpanded = expandedSections[sec.key];
                const fieldKeys = Object.keys(section.fields);

                return (
                  <div key={sec.key} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                    <div
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => toggleSectionExpand(sec.key)}
                    >
                      <div className="text-slate-400">{sec.icon}</div>
                      <div className="flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => updateSection(sec.key, { title: e.target.value })}
                          className="text-sm font-medium text-[#0f172a] bg-transparent border-none outline-none w-full focus:bg-slate-50 focus:rounded px-1 -ml-1"
                        />
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <ToggleSwitch
                          checked={section.enabled}
                          onChange={(val) => updateSection(sec.key, { enabled: val })}
                        />
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {isExpanded && section.enabled && fieldKeys.length > 0 && (
                      <div className="border-t border-slate-100 px-4 py-3 space-y-3 bg-slate-50/50">
                        <div className="flex items-center gap-4 mb-2 px-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-1">Field</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[36px] text-center">Show</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[36px] text-center">Req</span>
                        </div>
                        {fieldKeys.map((fk) => {
                          const field = section.fields[fk];
                          const isDropdown = field.type === 'dropdown';
                          return (
                            <div key={fk} className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                              {/* Field Header Row */}
                              <div className="flex items-center justify-between px-3 py-2.5 bg-white">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <code className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">{fk}</code>
                                  <span className={`text-xs font-semibold truncate ${field.enabled ? 'text-slate-700' : 'text-slate-400 line-through'}`}>{field.label}</span>
                                  {field.required && field.enabled && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-600 shrink-0">REQ</span>
                                  )}
                                  {isDropdown && field.enabled && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 shrink-0">DROPDOWN</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 shrink-0 ml-2">
                                  <ToggleSwitch
                                    checked={field.enabled}
                                    onChange={(val) => updateField(sec.key, fk, { enabled: val })}
                                  />
                                  <ToggleSwitch
                                    checked={field.required}
                                    onChange={(val) => updateField(sec.key, fk, { required: val })}
                                  />
                                </div>
                              </div>
                              {/* Nomenclature Editor (always visible when enabled) */}
                              {field.enabled && (
                                <div
                                  className="px-3 pb-3 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-2"
                                  onClick={(e) => e.stopPropagation()}
                                  onMouseDown={(e) => e.stopPropagation()}
                                >
                                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Nomenclature</p>
                                  <div>
                                    <label className="text-[10px] text-slate-500 mb-0.5 block font-medium">Label / Display Name</label>
                                    <input
                                      type="text"
                                      value={field.label}
                                      onChange={(e) => { e.stopPropagation(); updateField(sec.key, fk, { label: e.target.value }); }}
                                      onClick={(e) => e.stopPropagation()}
                                      onMouseDown={(e) => e.stopPropagation()}
                                      className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                                      placeholder="Enter field label"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-slate-500 mb-0.5 block font-medium">Placeholder Text</label>
                                    <input
                                      type="text"
                                      value={field.placeholder}
                                      onChange={(e) => { e.stopPropagation(); updateField(sec.key, fk, { placeholder: e.target.value }); }}
                                      onClick={(e) => e.stopPropagation()}
                                      onMouseDown={(e) => e.stopPropagation()}
                                      className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                                      placeholder="Enter placeholder text"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-slate-500 mb-0.5 block font-medium">Field Type</label>
                                    <select
                                      value={field.type || 'text'}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        const newType = e.target.value as 'text' | 'dropdown';
                                        const updates: Partial<FormFieldConfig> = { type: newType };
                                        if (newType === 'dropdown' && !field.options) {
                                          updates.options = ['Option 1', 'Option 2', 'Option 3'];
                                        }
                                        updateField(sec.key, fk, updates);
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      onMouseDown={(e) => e.stopPropagation()}
                                      className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-white"
                                    >
                                      <option value="text">Text Input</option>
                                      <option value="dropdown">Dropdown / Select</option>
                                    </select>
                                  </div>
                                  {isDropdown && field.options && (
                                    <div>
                                      <div className="flex items-center justify-between mb-1">
                                        <label className="text-[10px] text-slate-500 font-medium">Dropdown Options</label>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const newOpts = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
                                            updateField(sec.key, fk, { options: newOpts });
                                          }}
                                          className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                        >
                                          + Add Option
                                        </button>
                                      </div>
                                      <div className="space-y-1">
                                        {field.options.map((opt, idx) => (
                                          <div key={idx} className="flex items-center gap-1">
                                            <span className="text-[10px] text-slate-400 w-4 shrink-0">{idx + 1}.</span>
                                            <input
                                              type="text"
                                              value={opt}
                                              onChange={(e) => {
                                                e.stopPropagation();
                                                const newOpts = [...(field.options || [])];
                                                newOpts[idx] = e.target.value;
                                                updateField(sec.key, fk, { options: newOpts });
                                              }}
                                              onClick={(e) => e.stopPropagation()}
                                              onMouseDown={(e) => e.stopPropagation()}
                                              className="flex-1 h-8 px-2 rounded-md border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                                            />
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                const newOpts = (field.options || []).filter((_, i) => i !== idx);
                                                updateField(sec.key, fk, { options: newOpts });
                                              }}
                                              className="h-8 w-8 rounded-md border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 flex items-center justify-center transition-colors shrink-0"
                                            >
                                              <X className="h-3 w-3" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {isExpanded && section.enabled && fieldKeys.length === 0 && (
                      <div className="border-t border-slate-100 px-4 py-3 bg-slate-50/50">
                        <p className="text-xs text-slate-400 italic">
                          This section has no configurable fields. It will be shown as-is when enabled.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section B: Body Headings */}
          <div>
            <h3 className="text-sm font-semibold text-[#0f172a] mb-3 flex items-center gap-2">
              <Type className="h-4 w-4 text-emerald-600" />
              Body Headings
            </h3>
            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Left Heading (Main Title)</label>
                <input
                  type="text"
                  value={config.headerTitle}
                  onChange={(e) => setConfig((prev) => ({ ...prev, headerTitle: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                />
                <p className="text-[10px] text-slate-400">Left-aligned heading shown in the form body</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Right Heading (Subtitle)</label>
                <input
                  type="text"
                  value={config.headerSubtitle}
                  onChange={(e) => setConfig((prev) => ({ ...prev, headerSubtitle: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                />
                <p className="text-[10px] text-slate-400">Right-aligned heading shown in the form body</p>
              </div>
            </div>
          </div>

          {/* Section C: Submit Button Settings */}
          <div>
            <h3 className="text-sm font-semibold text-[#0f172a] mb-3 flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-emerald-600" />
              Submit Button Settings
            </h3>
            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Submit Button Text</label>
                <input
                  type="text"
                  value={config.submitButtonText}
                  onChange={(e) => setConfig((prev) => ({ ...prev, submitButtonText: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Success Message</label>
                <input
                  type="text"
                  value={config.successMessage}
                  onChange={(e) => setConfig((prev) => ({ ...prev, successMessage: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>

          {/* Section D: Color Configuration */}
          <div>
            <h3 className="text-sm font-semibold text-[#0f172a] mb-3 flex items-center gap-2">
              <Paintbrush className="h-4 w-4 text-emerald-600" />
              Color Configuration
            </h3>
            <div className="space-y-4">
              {Array.from(new Set(colorFields.map(cf => cf.group))).map(group => (
                <div key={group} className="rounded-xl border border-slate-200 bg-white p-4">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">{group}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {colorFields.filter(cf => cf.group === group).map((cf) => (
                      <ColorPickerField
                        key={cf.key}
                        label={cf.label}
                        value={config.colors[cf.key]}
                        onChange={(val) => updateColor(cf.key, val)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-[50%] overflow-hidden bg-slate-100 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200 shrink-0">
            <span className="text-xs font-medium text-slate-500">Live Preview</span>
            <span className="text-[10px] text-slate-400 font-mono">/{brand.slug}</span>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full">
              <iframe
                srcDoc={previewHTML}
                title="Form Preview"
                className="w-full border-0"
                style={{ height: 'calc(100vh - 140px)', minHeight: 600 }}
                sandbox="allow-scripts"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Deploy Confirmation Dialog */}
      {showDeployConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6">
            <div className="text-center mb-6">
              <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-7 w-7 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-[#0f172a] mb-2">Deploy Form?</h3>
              <p className="text-sm text-slate-500">
                Are you sure you want to deploy this form? It will save the config and push to Git, triggering a Cloudflare Pages rebuild. The form will be live at{' '}
                <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                  singleinterface-hyperlocal.pages.dev/{brand.slug}
                </span>
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowDeployConfirm(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeploy}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25 hover:shadow-emerald-500/40 transition-all"
              >
                Yes, Deploy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deploy Progress Overlay */}
      {(deploying || deployComplete) && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-8">
            {deployComplete ? (
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-9 w-9 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-[#0f172a] mb-2">Deployment Complete!</h3>
                <p className="text-xs text-slate-400 mb-1">
                  {deployMessage || 'Config saved & Git push triggered.'}
                </p>
                <p className="text-sm text-slate-500 mb-4">
                  Your form will be live shortly at:
                </p>
                <a
                  href={`/${brand.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  singleinterface-hyperlocal.pages.dev/{brand.slug}
                </a>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setDeployComplete(false);
                      setDeployStep(-1);
                    }}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25 hover:shadow-emerald-500/40 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-[#0f172a] mb-6 text-center">Deploying Form...</h3>
                <div className="space-y-4">
                  {[
                    { step: 0, label: 'Preparing configuration...' },
                    { step: 1, label: 'Saving to database & pushing to Git...' },
                    { step: 2, label: 'Triggering Cloudflare Pages rebuild...' },
                    { step: 3, label: 'Complete!' },
                  ].map((s) => (
                    <div key={s.step} className="flex items-center gap-3">
                      {deployStep > s.step ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                      ) : deployStep === s.step ? (
                        <Loader2 className="h-5 w-5 animate-spin text-emerald-500 shrink-0" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-slate-200 shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          deployStep >= s.step ? 'text-slate-800 font-medium' : 'text-slate-400'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN DASHBOARD
   ════════════════════════════════════════════ */
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewDataSlug, setViewDataSlug] = useState<string | null>(null);
  const [configuratorSlug, setConfiguratorSlug] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [brandRecordCounts, setBrandRecordCounts] = useState<Record<string, number>>({});
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  const fetchBrands = useCallback(async () => {
    setLoadingBrands(true);
    try {
      const res = await fetch('/api/brands');
      const data = await res.json();
      if (res.ok) {
        setBrands(data.brands || []);
      }
    } catch {
      // ignore
    }
    setLoadingBrands(false);
  }, []);

  // Initial brand fetch
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchBrands();
    }
  }, [fetchBrands]);

  const fetchRecordCounts = useCallback(async (brandList: Brand[]) => {
    setLoadingCounts(true);
    const counts: Record<string, number> = {};
    for (const brand of brandList) {
      try {
        const res = await fetch(`/api/dealer?brand=${brand.slug}`);
        const data = await res.json();
        counts[brand.slug] = data.dealers?.length || 0;
      } catch {
        counts[brand.slug] = 0;
      }
    }
    setBrandRecordCounts(counts);
    setLoadingCounts(false);
  }, []);

  // Fetch record counts when brands change
  useEffect(() => {
    if (brands.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchRecordCounts(brands);
    }
  }, [brands, fetchRecordCounts]);

  const showNotif = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDeleteBrand = async (slug: string) => {
    const brandName = brands.find((b) => b.slug === slug)?.name || slug;
    try {
      // First, delete all dealer records for this brand
      try {
        await fetch(`/api/dealer?brand=${slug}`, { method: 'DELETE' });
      } catch {
        // Continue even if dealer deletion fails
      }
      // Then delete the brand from brand_config
      const res = await fetch('/api/brands', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      if (res.ok) {
        setBrands((prev) => prev.filter((b) => b.slug !== slug));
        showNotif('success', `Brand "${brandName}" and all associated data deleted.`);
      } else {
        showNotif('error', 'Failed to delete brand');
      }
    } catch {
      showNotif('error', 'Network error');
    }
    setDeleteConfirmSlug(null);
  };

  const handleClearCache = (slug: string) => {
    const brandName = brands.find((b) => b.slug === slug)?.name || slug;
    showNotif('success', `Cache clear triggered for "${brandName}". Page will refresh shortly.`);
  };

  const totalRecords = Object.values(brandRecordCounts).reduce((a, b) => a + b, 0);

  const configuratorBrand = brands.find((b) => b.slug === configuratorSlug);

  if (configuratorBrand) {
    return (
      <FormConfigurator
        brand={configuratorBrand}
        onClose={() => setConfiguratorSlug(null)}
        onSaved={fetchBrands}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-[#0f172a]">
                  Brand Location Data Gather Form Management
                </h1>
                <p className="text-[10px] text-slate-400">Brand Lead Form Configuration</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => { fetchBrands(); fetchRecordCounts(brands); }}
                disabled={loadingCounts}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingCounts ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <a
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
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
          <div
            className={`mb-6 flex items-center gap-3 rounded-xl border p-4 ${
              notification.type === 'success'
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            )}
            <p
              className={`text-sm font-medium ${
                notification.type === 'success' ? 'text-emerald-800' : 'text-red-800'
              }`}
            >
              {notification.message}
            </p>
            <button onClick={() => setNotification(null)} className="ml-auto text-slate-400 hover:text-slate-600">
              &times;
            </button>
          </div>
        )}

        {/* Stats bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Active Brands',
              value: brands.filter((b) => b.active).length,
              icon: Building2,
              color: 'text-emerald-600 bg-emerald-50',
            },
            {
              label: 'Total Records',
              value: loadingCounts ? '...' : totalRecords,
              icon: Database,
              color: 'text-violet-600 bg-violet-50',
            },
            {
              label: 'Drive Folders',
              value: new Set(brands.filter(b => b.driveFolderId).map((b) => b.driveFolderId)).size,
              icon: FolderOpen,
              color: 'text-amber-600 bg-amber-50',
            },
            {
              label: 'Form Routes',
              value: brands.filter((b) => b.active).length,
              icon: ChevronRight,
              color: 'text-teal-600 bg-teal-50',
            },
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
            <p className="text-xs text-slate-400">
              Manage brand lead form configurations and view submitted data
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25 hover:shadow-emerald-500/40 transition-all"
          >
            <Plus className="h-4 w-4" />
            Setup New Brand
          </button>
        </div>

        {loadingBrands ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="ml-3 text-sm text-slate-500">Loading brands...</span>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {brands.map((brand) => (
              <BrandCard
                key={brand.slug}
                brand={brand}
                onDelete={(slug) => setDeleteConfirmSlug(slug)}
                onViewData={setViewDataSlug}
                onSetupForm={setConfiguratorSlug}
                onClearCache={handleClearCache}
                recordCount={brandRecordCounts[brand.slug] || 0}
              />
            ))}
          </div>
        )}

        {!loadingBrands && brands.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-slate-600 mb-2">No Brands Configured</h3>
            <p className="text-sm text-slate-400 mb-6">Get started by setting up your first brand.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25"
            >
              <Plus className="h-4 w-4" />
              Setup New Brand
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-5">
          <h3 className="text-sm font-semibold text-emerald-900 mb-2 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            How Brand Configuration Works
          </h3>
          <div className="text-xs text-emerald-700 leading-relaxed space-y-2">
            <p>
              <strong>1. Setup a Brand:</strong> Click &quot;Setup New Brand&quot; to create a brand with its name, logo, and Google Drive folder ID. Each brand gets its own form route at <code className="px-1 py-0.5 rounded bg-emerald-100 font-mono text-[11px]">/brand-slug</code>.
            </p>
            <p>
              <strong>2. Configure the Form:</strong> Click &quot;Setup Form&quot; on any brand card to open the Form Configurator. Customize sections, fields, labels, colors, and see a live preview in real-time.
            </p>
            <p>
              <strong>3. Deploy:</strong> When ready, click &quot;Deploy&quot; to make the form live. You can also &quot;Save as Draft&quot; to save your progress without deploying.
            </p>
            <p>
              <strong>4. Data Storage:</strong> All dealer data is stored in the shared D1 database with a &quot;brand&quot; column to distinguish records. View submitted data with the &quot;View Data&quot; button.
            </p>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmSlug && (() => {
        const brandToDelete = brands.find((b) => b.slug === deleteConfirmSlug);
        const recordCount = brandRecordCounts[deleteConfirmSlug] || 0;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6">
              <div className="text-center mb-6">
                <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="h-7 w-7 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-[#0f172a] mb-2">Delete Brand?</h3>
                <div className="space-y-2 text-sm text-slate-500 mb-4">
                  <p>
                    Are you sure you want to delete <span className="font-semibold text-[#0f172a]">&quot;{brandToDelete?.name}&quot;</span>?
                  </p>
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-left space-y-1">
                    <p className="text-xs text-slate-400">Brand details:</p>
                    <p className="text-xs"><span className="font-medium text-slate-600">Slug:</span> <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{deleteConfirmSlug}</code></p>
                    {brandToDelete?.brandUrl && (
                      <p className="text-xs"><span className="font-medium text-slate-600">URL:</span> <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{brandToDelete.brandUrl}</code></p>
                    )}
                    <p className="text-xs"><span className="font-medium text-slate-600">Records:</span> {recordCount} dealer record(s)</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3">
                    <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                    <p className="text-xs text-red-600 text-left">
                      This will permanently delete the brand configuration and all {recordCount} associated dealer records. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setDeleteConfirmSlug(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteBrand(deleteConfirmSlug)}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Delete Everything
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modals */}
      {showAddModal && (
        <AddBrandModal
          onClose={() => setShowAddModal(false)}
          onAdd={() => {
            setShowAddModal(false);
            fetchBrands();
            showNotif('success', 'Brand created successfully!');
          }}
        />
      )}
      {viewDataSlug && (
        <DataViewerModal
          brandSlug={viewDataSlug}
          brandName={brands.find((b) => b.slug === viewDataSlug)?.name || viewDataSlug}
          onClose={() => setViewDataSlug(null)}
        />
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   PAGE (auth gate)
   ════════════════════════════════════════════ */
function getInitialAuthState(): { authenticated: boolean; checking: boolean } {
  if (typeof window === 'undefined') return { authenticated: false, checking: true };
  const isAuth = localStorage.getItem('si_admin_auth') === 'true';
  return { authenticated: isAuth, checking: false };
}

export default function AdminDashboardPage() {
  const [authState, setAuthState] = useState(getInitialAuthState);

  const handleLogin = () => setAuthState({ authenticated: true, checking: false });
  const handleLogout = () => {
    localStorage.removeItem('si_admin_auth');
    setAuthState({ authenticated: false, checking: false });
  };

  if (authState.checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!authState.authenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}
