'use client';

import { useState, useCallback } from 'react';
import {
  Building2, MapPin, Camera, Loader2, CheckCircle2, AlertCircle,
  Headphones, Globe, Store, ChevronRight, Shield, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';
import PhotoUpload from '@/components/photo-upload';

const MapPicker = dynamic(() => import('@/components/map-picker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] rounded-xl border border-border flex items-center justify-center bg-muted/30">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-sm font-medium">Loading map...</span>
      </div>
    </div>
  ),
});

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

const SECTION_STEPPER = [
  { id: 1, label: 'Store', icon: Building2 },
  { id: 2, label: 'Address', icon: MapPin },
  { id: 3, label: 'Location', icon: MapPin },
  { id: 4, label: 'Photos', icon: Camera },
];

interface DealerFormProps {
  brandConfig?: {
    slug: string;
    name: string;
    logoUrl: string;
    driveFolderId: string;
    primaryColor: string;
    secondaryColor: string;
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
  };
}

export default function DealerForm({ brandConfig }: DealerFormProps = {}) {
  const brand = brandConfig || {
    slug: 'sennheiser',
    name: 'Sennheiser',
    logoUrl: '',
    primaryColor: '#059669',
    secondaryColor: '#0d9488',
    nomenclature: {
      storeCodeLabel: 'Store Code',
      storeCodePlaceholder: 'e.g. SN-DL-001',
      storeNameLabel: 'Store Name',
      storeNamePlaceholder: 'e.g. Sennheiser Audio Hub',
      headerTitle: 'Sennheiser Hearables × SingleInterface',
      headerSubtitle: 'Google Business Profile Management',
      submitButtonText: 'Submit Dealer Registration',
      successMessage: 'Dealer Registered Successfully!',
      storefrontPhotoLabel: 'Store Front Photos',
      inventoryPhotoLabel: 'Store Inventory Photos',
    },
  };

  const [storeCode, setStoreCode] = useState('');
  const [storeName, setStoreName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [address3, setAddress3] = useState('');
  const [locality, setLocality] = useState('');
  const [subLocality, setSubLocality] = useState('');
  const [landmark, setLandmark] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [storefrontPhotos, setStorefrontPhotos] = useState<string[]>([]);
  const [inventoryPhotos, setInventoryPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleLocationChange = useCallback((lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  }, []);

  const resetForm = () => {
    setStoreCode(''); setStoreName('');
    setAddress1(''); setAddress2(''); setAddress3('');
    setLocality(''); setSubLocality(''); setLandmark('');
    setState(''); setCity(''); setPinCode('');
    setLatitude(null); setLongitude(null);
    setStorefrontPhotos([]); setInventoryPhotos([]);
    setError('');
  };

  const getActiveSection = () => {
    if (!storeCode.trim() || !storeName.trim()) return 1;
    if (!address1.trim() || !locality.trim() || !state.trim() || !city.trim() || !pinCode.trim()) return 2;
    if (latitude === null || longitude === null) return 3;
    if (storefrontPhotos.length === 0 || inventoryPhotos.length === 0) return 4;
    return 4;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!storeCode.trim()) { setError('Store Code is required'); return; }
    if (!storeName.trim()) { setError('Store Name is required'); return; }
    if (!address1.trim()) { setError('Address Line 1 is required'); return; }
    if (!locality.trim()) { setError('Locality is required'); return; }
    if (!state.trim()) { setError('State is required'); return; }
    if (!city.trim()) { setError('City is required'); return; }
    if (!pinCode.trim()) { setError('Pin Code is required'); return; }
    if (latitude === null || longitude === null) { setError('Latitude and Longitude are required. Please set your location on the map.'); return; }
    if (storefrontPhotos.length === 0) { setError('At least one Store Front photo is required'); return; }
    if (inventoryPhotos.length === 0) { setError('At least one Store Inventory photo is required'); return; }

    setSubmitting(true);

    try {
      const response = await fetch('/api/dealer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: brand.slug,
          storeCode: storeCode.trim(), storeName: storeName.trim(),
          address1: address1.trim(), address2: address2.trim(), address3: address3.trim(),
          locality: locality.trim(), subLocality: subLocality.trim(), landmark: landmark.trim(),
          state: state.trim(), city: city.trim(), pinCode: pinCode.trim(),
          latitude, longitude, storefrontPhotos, inventoryPhotos,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to register dealer');
        return;
      }

      setSuccess(true);
      setTimeout(() => { resetForm(); setSuccess(false); }, 8000);
    } catch (err) {
      console.error('Submit error:', err);
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 p-4">
        <div className="w-full max-w-md text-center">
          <div className="relative mb-6">
            <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto shadow-lg shadow-emerald-200/50">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <div className="absolute -top-1 -right-1 left-1/2 ml-6 h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{brand.nomenclature.successMessage}</h2>
          <p className="text-slate-500 mb-2 text-sm">
            Store details, location, and all photos have been saved.
          </p>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs text-emerald-700 font-medium mb-6">
            <Shield className="h-3.5 w-3.5" />
            Data saved to Cloudflare D1 &bull; Photos uploaded to Google Drive
          </div>
          <br />
          <Button onClick={() => { resetForm(); setSuccess(false); }} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl h-11 px-8">
            Register Another Dealer
          </Button>
        </div>
      </div>
    );
  }

  const activeSection = getActiveSection();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 ring-2 ring-white">
              <Headphones className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                {brand.nomenclature.headerTitle}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Globe className="h-3 w-3 text-slate-400" />
                <p className="text-xs text-slate-500 font-medium">{brand.nomenclature.headerSubtitle}</p>
              </div>
            </div>
            <Badge variant="secondary" className="hidden sm:flex items-center gap-1 bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium">
              <Store className="h-3 w-3" />
              Dealer Registration
            </Badge>
          </div>
        </div>
      </header>

      {/* Section Stepper */}
      <div className="border-b border-slate-200/60 bg-white/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-1">
            {SECTION_STEPPER.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeSection === step.id;
              const isCompleted = activeSection > step.id;
              return (
                <div key={step.id} className="flex items-center flex-1 last:flex-none">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                    isActive ? 'bg-emerald-50 text-emerald-700' :
                    isCompleted ? 'text-emerald-600' : 'text-slate-400'
                  }`}>
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isActive ? 'bg-emerald-600 text-white shadow-md shadow-emerald-300/40' :
                      isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : step.id}
                    </div>
                    <span className={`text-sm font-medium hidden sm:inline ${isActive ? 'text-emerald-700' : ''}`}>{step.label}</span>
                  </div>
                  {idx < SECTION_STEPPER.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-slate-300 mx-1 hidden sm:block" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-28">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <p className="text-sm font-medium text-red-800 flex-1">{error}</p>
              <button type="button" onClick={() => setError('')} className="text-red-400 hover:text-red-600 text-lg leading-none">&times;</button>
            </div>
          )}

          {/* Section 1: Store Details */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Store Details</h2>
                  <p className="text-xs text-slate-500">Basic store identification information</p>
                </div>
              </div>
            </div>
            <div className="px-5 sm:px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeCode" className="text-sm font-medium text-slate-700">
                    {brand.nomenclature.storeCodeLabel} <span className="text-red-500">*</span>
                  </Label>
                  <Input id="storeCode" placeholder={brand.nomenclature.storeCodePlaceholder} value={storeCode} onChange={(e) => setStoreCode(e.target.value.toUpperCase())} required className="h-10 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20" />
                  <p className="text-[11px] text-slate-400">Unique identifier for the dealer store</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeName" className="text-sm font-medium text-slate-700">
                    {brand.nomenclature.storeNameLabel} <span className="text-red-500">*</span>
                  </Label>
                  <Input id="storeName" placeholder={brand.nomenclature.storeNamePlaceholder} value={storeName} onChange={(e) => setStoreName(e.target.value)} required className="h-10 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20" />
                  <p className="text-[11px] text-slate-400">Official store name as per records</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Store Address */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Store Address</h2>
                  <p className="text-xs text-slate-500">GMB listing format address details</p>
                </div>
              </div>
            </div>
            <div className="px-5 sm:px-6 py-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address1" className="text-sm font-medium text-slate-700">
                  Address Line 1 <span className="text-red-500">*</span>
                </Label>
                <Input id="address1" placeholder="Door / Flat / Building No. & Name" value={address1} onChange={(e) => setAddress1(e.target.value)} required className="h-10 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address2" className="text-sm font-medium text-slate-700">Address Line 2</Label>
                  <Input id="address2" placeholder="Street / Road Name" value={address2} onChange={(e) => setAddress2(e.target.value)} className="h-10 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address3" className="text-sm font-medium text-slate-700">Address Line 3</Label>
                  <Input id="address3" placeholder="Additional area details" value={address3} onChange={(e) => setAddress3(e.target.value)} className="h-10 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="locality" className="text-sm font-medium text-slate-700">
                    Locality <span className="text-red-500">*</span>
                  </Label>
                  <Input id="locality" placeholder="e.g. Koramangala" value={locality} onChange={(e) => setLocality(e.target.value)} required className="h-10 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subLocality" className="text-sm font-medium text-slate-700">Sub Locality</Label>
                  <Input id="subLocality" placeholder="e.g. 4th Block" value={subLocality} onChange={(e) => setSubLocality(e.target.value)} className="h-10 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="landmark" className="text-sm font-medium text-slate-700">Landmark</Label>
                <Input id="landmark" placeholder="e.g. Near MG Road Metro Station" value={landmark} onChange={(e) => setLandmark(e.target.value)} className="h-10 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-medium text-slate-700">
                    State <span className="text-red-500">*</span>
                  </Label>
                  <select id="state" value={state} onChange={(e) => setState(e.target.value)} required
                    className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm transition-colors focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20">
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-slate-700">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Input id="city" placeholder="e.g. Bengaluru" value={city} onChange={(e) => setCity(e.target.value)} required className="h-10 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pinCode" className="text-sm font-medium text-slate-700">
                    Pin Code <span className="text-red-500">*</span>
                  </Label>
                  <Input id="pinCode" placeholder="e.g. 560034" value={pinCode} onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))} required maxLength={6} className="h-10 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20" />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Location on Map */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-sm">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Store Location</h2>
                  <p className="text-xs text-slate-500">Pin the exact store location on the map <span className="text-red-500 font-medium">(Required)</span></p>
                </div>
              </div>
            </div>
            <div className="px-5 sm:px-6 py-5">
              <MapPicker latitude={latitude} longitude={longitude} onLocationChange={handleLocationChange} />
            </div>
          </section>

          {/* Section 4: Photos */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-sm">
                  <Camera className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Store Photos</h2>
                  <p className="text-xs text-slate-500">Upload storefront and inventory photos (max 5 each)</p>
                </div>
              </div>
            </div>
            <div className="px-5 sm:px-6 py-5 space-y-6">
              <PhotoUpload label={brand.nomenclature.storefrontPhotoLabel} photos={storefrontPhotos} onPhotosChange={setStorefrontPhotos} maxPhotos={5} required />
              <div className="border-t border-slate-100" />
              <PhotoUpload label={brand.nomenclature.inventoryPhotoLabel} photos={inventoryPhotos} onPhotosChange={setInventoryPhotos} maxPhotos={5} required />
            </div>
          </section>

          {/* Submit Button */}
          <div className="sticky bottom-4 z-30">
            <div className="max-w-5xl mx-auto">
              <Button type="submit" disabled={submitting}
                className="w-full h-13 text-base font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl shadow-emerald-500/25 rounded-xl transition-all">
                {submitting ? (
                  <div className="flex items-center gap-2.5">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Registering Dealer...
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5" />
                    {brand.nomenclature.submitButtonText}
                  </div>
                )}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
