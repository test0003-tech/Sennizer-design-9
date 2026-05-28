'use client';

import { useState, useCallback } from 'react';
import {
  Building2, MapPin, Camera, Loader2, CheckCircle2, AlertCircle,
  Clock, Phone, Navigation, Crosshair, Shield, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import dynamic from 'next/dynamic';
import PhotoUpload from '@/components/photo-upload';
import {
  BrandFormConfig,
  FormSectionConfig,
  FormFieldConfig,
  ColorConfig,
  getDefaultConfig,
} from '@/lib/brand-types';

const MapPicker = dynamic(() => import('@/components/map-picker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] rounded-xl border flex items-center justify-center"
      style={{ backgroundColor: '#f8fafc' }}
    >
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-sm font-medium">Loading map...</span>
      </div>
    </div>
  ),
});

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

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

const FLOOR_OPTIONS = [
  'Lower Ground Floor', 'Ground Floor', '1st Floor', '2nd Floor',
  '3rd Floor', '4th Floor', '5th Floor', '6th Floor', '7th Floor', '8th Floor',
];

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
] as const;

const SINGLEINTERFACE_LOGO_URL = 'https://www.singleinterface.com/Enquiry/imgwebp/Singleinterface-logo-light.svg';

// ---------------------------------------------------------------------------
// Props Interface
// ---------------------------------------------------------------------------

interface ConfigurableDealerFormProps {
  brandData: {
    slug: string;
    name: string;
    logoUrl: string | null;
    driveFolderId: string | null;
    config: BrandFormConfig | null;
    active: number;
  };
}

// ---------------------------------------------------------------------------
// Business Hours Type
// ---------------------------------------------------------------------------

interface BusinessHourDay {
  open: string;
  close: string;
  closed: boolean;
}

type BusinessHours = Record<string, BusinessHourDay>;

function getDefaultBusinessHours(): BusinessHours {
  const hours: BusinessHours = {};
  for (const day of DAYS_OF_WEEK) {
    hours[day.key] = {
      open: '09:00',
      close: '18:00',
      closed: day.key === 'sunday',
    };
  }
  return hours;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ConfigurableDealerForm({ brandData }: ConfigurableDealerFormProps) {
  const config: BrandFormConfig = brandData.config ?? getDefaultConfig();
  const colors = config.colors;

  // -- Form state --
  const [storeCode, setStoreCode] = useState('');
  const [storeName, setStoreName] = useState('');
  const [floorNo, setFloorNo] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [address3, setAddress3] = useState('');
  const [subLocality, setSubLocality] = useState('');
  const [locality, setLocality] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [storefrontPhotos, setStorefrontPhotos] = useState<string[]>([]);
  const [inventoryPhotos, setInventoryPhotos] = useState<string[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHours>(getDefaultBusinessHours());
  const [storeNumber, setStoreNumber] = useState('');
  const [storeEmail, setStoreEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // -- Handlers --
  const handleLocationChange = useCallback((lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  }, []);

  const resetForm = () => {
    setStoreCode(''); setStoreName(''); setFloorNo('');
    setAddress1(''); setAddress2(''); setAddress3('');
    setSubLocality(''); setLocality(''); setLandmark('');
    setState(''); setCity(''); setPinCode('');
    setLatitude(null); setLongitude(null);
    setStorefrontPhotos([]); setInventoryPhotos([]);
    setBusinessHours(getDefaultBusinessHours());
    setStoreNumber(''); setStoreEmail(''); setWhatsappNumber('');
    setError('');
  };

  const updateBusinessHour = (dayKey: string, field: keyof BusinessHourDay, value: string | boolean) => {
    setBusinessHours(prev => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], [field]: value },
    }));
  };

  // -- Field config helpers --
  const getField = (section: FormSectionConfig, fieldName: string): FormFieldConfig | undefined => {
    return section.fields[fieldName];
  };

  const isFieldEnabled = (section: FormSectionConfig, fieldName: string): boolean => {
    const field = getField(section, fieldName);
    return field ? field.enabled : true;
  };

  const isFieldRequired = (section: FormSectionConfig, fieldName: string): boolean => {
    const field = getField(section, fieldName);
    return field ? field.required : false;
  };

  const fieldLabel = (section: FormSectionConfig, fieldName: string, fallback: string): string => {
    const field = getField(section, fieldName);
    return field?.label || fallback;
  };

  const fieldPlaceholder = (section: FormSectionConfig, fieldName: string, fallback: string): string => {
    const field = getField(section, fieldName);
    return field?.placeholder || fallback;
  };

  // -- Dynamic style helpers --
  const inputStyle = (hasFocus?: boolean): React.CSSProperties => ({
    backgroundColor: colors.inputBg,
    borderColor: colors.inputBorder,
  });

  const inputClassName = 'h-10 w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2';

  const inputFocusStyle: React.CSSProperties = {
    borderColor: colors.inputFocusBorder,
    boxShadow: `0 0 0 3px ${colors.inputFocusShadow || 'rgba(0,0,0,0.05)'}`,
  };

  // -- Submit --
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate based on enabled sections and required fields
    const sections = config.sections;

    if (sections.storeDetails.enabled) {
      if (isFieldEnabled(sections.storeDetails, 'storeCode') && isFieldRequired(sections.storeDetails, 'storeCode') && !storeCode.trim()) {
        setError(`${fieldLabel(sections.storeDetails, 'storeCode', 'Store Code')} is required`);
        return;
      }
      if (isFieldEnabled(sections.storeDetails, 'storeName') && isFieldRequired(sections.storeDetails, 'storeName') && !storeName.trim()) {
        setError(`${fieldLabel(sections.storeDetails, 'storeName', 'Store Name')} is required`);
        return;
      }
    }

    if (sections.address.enabled) {
      if (isFieldEnabled(sections.address, 'floorNo') && isFieldRequired(sections.address, 'floorNo') && !floorNo.trim()) {
        setError(`${fieldLabel(sections.address, 'floorNo', 'Floor No')} is required`);
        return;
      }
      if (isFieldEnabled(sections.address, 'addressLine1') && isFieldRequired(sections.address, 'addressLine1') && !address1.trim()) {
        setError(`${fieldLabel(sections.address, 'addressLine1', 'Address Line 1')} is required`);
        return;
      }
      if (isFieldEnabled(sections.address, 'addressLine2') && isFieldRequired(sections.address, 'addressLine2') && !address2.trim()) {
        setError(`${fieldLabel(sections.address, 'addressLine2', 'Address Line 2')} is required`);
        return;
      }
      if (isFieldEnabled(sections.address, 'addressLine3') && isFieldRequired(sections.address, 'addressLine3') && !address3.trim()) {
        setError(`${fieldLabel(sections.address, 'addressLine3', 'Address Line 3')} is required`);
        return;
      }
      if (isFieldEnabled(sections.address, 'sublocality') && isFieldRequired(sections.address, 'sublocality') && !subLocality.trim()) {
        setError(`${fieldLabel(sections.address, 'sublocality', 'Sublocality')} is required`);
        return;
      }
      if (isFieldEnabled(sections.address, 'locality') && isFieldRequired(sections.address, 'locality') && !locality.trim()) {
        setError(`${fieldLabel(sections.address, 'locality', 'Locality')} is required`);
        return;
      }
      if (isFieldEnabled(sections.address, 'landmark') && isFieldRequired(sections.address, 'landmark') && !landmark.trim()) {
        setError(`${fieldLabel(sections.address, 'landmark', 'Landmark')} is required`);
        return;
      }
      if (isFieldEnabled(sections.address, 'city') && isFieldRequired(sections.address, 'city') && !city.trim()) {
        setError(`${fieldLabel(sections.address, 'city', 'City')} is required`);
        return;
      }
      if (isFieldEnabled(sections.address, 'state') && isFieldRequired(sections.address, 'state') && !state.trim()) {
        setError(`${fieldLabel(sections.address, 'state', 'State')} is required`);
        return;
      }
      if (isFieldEnabled(sections.address, 'pincode') && isFieldRequired(sections.address, 'pincode') && !pinCode.trim()) {
        setError(`${fieldLabel(sections.address, 'pincode', 'Pincode')} is required`);
        return;
      }
    }

    if (sections.location.enabled && (latitude === null || longitude === null)) {
      setError('Latitude and Longitude are required. Please set your location on the map.');
      return;
    }

    if (sections.storefrontPhotos.enabled && storefrontPhotos.length === 0) {
      setError('At least one Store Front photo is required');
      return;
    }

    if (sections.inventoryPhotos.enabled && inventoryPhotos.length === 0) {
      setError('At least one Store Inventory photo is required');
      return;
    }

    if (sections.contactDetails.enabled) {
      if (isFieldEnabled(sections.contactDetails, 'storeNumber') && isFieldRequired(sections.contactDetails, 'storeNumber') && !storeNumber.trim()) {
        setError(`${fieldLabel(sections.contactDetails, 'storeNumber', 'Store Number')} is required`);
        return;
      }
      if (isFieldEnabled(sections.contactDetails, 'email') && isFieldRequired(sections.contactDetails, 'email') && !storeEmail.trim()) {
        setError(`${fieldLabel(sections.contactDetails, 'email', 'Email')} is required`);
        return;
      }
      if (isFieldEnabled(sections.contactDetails, 'whatsapp') && isFieldRequired(sections.contactDetails, 'whatsapp') && !whatsappNumber.trim()) {
        setError(`${fieldLabel(sections.contactDetails, 'whatsapp', 'WhatsApp Number')} is required`);
        return;
      }
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/dealer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: brandData.slug,
          storeCode: storeCode.trim(),
          storeName: storeName.trim(),
          floorNo: floorNo.trim(),
          addressLine1: address1.trim(),
          addressLine2: address2.trim(),
          addressLine3: address3.trim(),
          subLocality: subLocality.trim(),
          locality: locality.trim(),
          landmark: landmark.trim(),
          city: city.trim(),
          state: state.trim(),
          pinCode: pinCode.trim(),
          latitude,
          longitude,
          businessHours: JSON.stringify(businessHours),
          storeNumber: storeNumber.trim(),
          email: storeEmail.trim(),
          whatsappNumber: whatsappNumber.trim(),
          storefrontPhotos,
          inventoryPhotos,
        }),
      });

      const data = await response.json() as { error?: string; message?: string };
      if (!response.ok) {
        setError(data.error || 'Failed to register dealer');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        resetForm();
        setSuccess(false);
      }, 8000);
    } catch (err) {
      console.error('Submit error:', err);
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // -- Success screen --
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: colors.pageBg }}>
        <div className="w-full max-w-md text-center">
          <div className="relative mb-6">
            <div
              className="h-20 w-20 rounded-full flex items-center justify-center mx-auto shadow-lg"
              style={{ backgroundColor: `${colors.submitButton}20` }}
            >
              <CheckCircle2 className="h-10 w-10" style={{ color: colors.submitButton }} />
            </div>
            <div
              className="absolute -top-1 left-1/2 ml-6 h-6 w-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.submitButton }}
            >
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{config.successMessage}</h2>
          <p className="text-slate-500 mb-2 text-sm">
            Store details, location, and all photos have been saved.
          </p>
          <div
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium mb-6"
            style={{
              backgroundColor: `${colors.submitButton}10`,
              borderColor: `${colors.submitButton}30`,
              color: colors.submitButton,
            }}
          >
            <Shield className="h-3.5 w-3.5" />
            Data saved to Cloudflare D1 &bull; Photos uploaded to Google Drive
          </div>
          <br />
          <Button
            onClick={() => { resetForm(); setSuccess(false); }}
            className="rounded-xl h-11 px-8 text-white"
            style={{ backgroundColor: colors.submitButton }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.submitButtonHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.submitButton; }}
          >
            Register Another Dealer
          </Button>
        </div>
      </div>
    );
  }

  const sections = config.sections;

  // -- Render field helper --
  const renderField = (
    section: FormSectionConfig,
    fieldName: string,
    fallbackLabel: string,
    fallbackPlaceholder: string,
    inputType: string = 'text',
    inputValue: string,
    onInputChange: (val: string) => void,
    extraProps?: Record<string, unknown>,
  ) => {
    if (!isFieldEnabled(section, fieldName)) return null;
    const required = isFieldRequired(section, fieldName);
    const label = fieldLabel(section, fieldName, fallbackLabel);
    const placeholder = fieldPlaceholder(section, fieldName, fallbackPlaceholder);

    return (
      <div className="space-y-1.5">
        <Label className="text-sm font-medium" style={{ color: colors.label }}>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
          type={inputType}
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          required={required}
          className={inputClassName}
          style={inputStyle()}
          onFocus={(e) => {
            Object.assign(e.target.style, inputFocusStyle);
          }}
          onBlur={(e) => {
            e.target.style.borderColor = colors.inputBorder;
            e.target.style.boxShadow = 'none';
          }}
          {...extraProps}
        />
      </div>
    );
  };

  // -- Main render --
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.pageBg }}>
      {/* ========== Header ========== */}
      <header
        className="sticky top-0 z-40 shadow-md"
        style={{ backgroundColor: colors.header }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              {brandData.logoUrl ? (
                <img
                  src={brandData.logoUrl}
                  alt={brandData.name}
                  className="h-12 w-auto max-w-[200px] object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
              )}
            </div>
            {/* SingleInterface Logo */}
            <img
              src={SINGLEINTERFACE_LOGO_URL}
              alt="SingleInterface"
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>
      </header>

      {/* ========== Section Heading ========== */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-2 flex items-baseline justify-between">
        <h1 className="text-xl font-bold text-slate-900">{config.headerTitle}</h1>
        <p className="text-sm font-semibold text-slate-500">{config.headerSubtitle}</p>
      </div>

      {/* ========== Form ========== */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-28 pt-4">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <p className="text-sm font-medium text-red-800 flex-1">{error}</p>
              <button
                type="button"
                onClick={() => setError('')}
                className="text-red-400 hover:text-red-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>
          )}

          {/* ========== Store Details Section ========== */}
          {sections.storeDetails.enabled && (
            <section
              className="rounded-xl border shadow-sm overflow-hidden"
              style={{ backgroundColor: colors.formBg, borderColor: `${colors.sectionTitleBorder}30` }}
            >
              <div
                className="px-5 sm:px-6 py-4 border-b-2"
                style={{ borderBottomColor: colors.sectionTitleBorder, backgroundColor: `${colors.sectionTitleBorder}08` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: colors.sectionTitleBorder }}
                  >
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold" style={{ color: colors.sectionTitle }}>
                      {sections.storeDetails.title}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="px-5 sm:px-6 py-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {isFieldEnabled(sections.storeDetails, 'storeCode') && (
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium" style={{ color: colors.label }}>
                        {fieldLabel(sections.storeDetails, 'storeCode', 'Store Code')}
                        {isFieldRequired(sections.storeDetails, 'storeCode') && <span className="text-red-500"> *</span>}
                      </Label>
                      <Input
                        placeholder={fieldPlaceholder(sections.storeDetails, 'storeCode', 'e.g. SN-DL-001')}
                        value={storeCode}
                        onChange={(e) => setStoreCode(e.target.value.toUpperCase())}
                        required={isFieldRequired(sections.storeDetails, 'storeCode')}
                        className={inputClassName}
                        style={inputStyle()}
                        onFocus={(e) => { Object.assign(e.target.style, inputFocusStyle); }}
                        onBlur={(e) => { e.target.style.borderColor = colors.inputBorder; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  )}
                  {isFieldEnabled(sections.storeDetails, 'storeName') && (
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium" style={{ color: colors.label }}>
                        {fieldLabel(sections.storeDetails, 'storeName', 'Store Name')}
                        {isFieldRequired(sections.storeDetails, 'storeName') && <span className="text-red-500"> *</span>}
                      </Label>
                      <Input
                        placeholder={fieldPlaceholder(sections.storeDetails, 'storeName', 'e.g. Sennheiser Audio Hub')}
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        required={isFieldRequired(sections.storeDetails, 'storeName')}
                        className={inputClassName}
                        style={inputStyle()}
                        onFocus={(e) => { Object.assign(e.target.style, inputFocusStyle); }}
                        onBlur={(e) => { e.target.style.borderColor = colors.inputBorder; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ========== Store Address Section ========== */}
          {sections.address.enabled && (
            <section
              className="rounded-xl border shadow-sm overflow-hidden"
              style={{ backgroundColor: colors.formBg, borderColor: `${colors.sectionTitleBorder}30` }}
            >
              <div
                className="px-5 sm:px-6 py-4 border-b-2"
                style={{ borderBottomColor: colors.sectionTitleBorder, backgroundColor: `${colors.sectionTitleBorder}08` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: colors.sectionTitleBorder }}
                  >
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold" style={{ color: colors.sectionTitle }}>
                      {sections.address.title}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="px-5 sm:px-6 py-5 space-y-4">
                {/* Floor No */}
                {isFieldEnabled(sections.address, 'floorNo') && (
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium" style={{ color: colors.label }}>
                      {fieldLabel(sections.address, 'floorNo', 'Floor No')}
                      {isFieldRequired(sections.address, 'floorNo') && <span className="text-red-500"> *</span>}
                    </Label>
                    <select
                      value={floorNo}
                      onChange={(e) => setFloorNo(e.target.value)}
                      required={isFieldRequired(sections.address, 'floorNo')}
                      className={inputClassName}
                      style={{
                        ...inputStyle(),
                        backgroundColor: colors.inputBg,
                      }}
                      onFocus={(e) => { Object.assign(e.target.style, inputFocusStyle); }}
                      onBlur={(e) => { e.target.style.borderColor = colors.inputBorder; e.target.style.boxShadow = 'none'; }}
                    >
                      <option value="">{fieldPlaceholder(sections.address, 'floorNo', 'Select Floor')}</option>
                      {(getField(sections.address, 'floorNo')?.options || FLOOR_OPTIONS).map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Address Line 1 */}
                {isFieldEnabled(sections.address, 'addressLine1') && (
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium" style={{ color: colors.label }}>
                      {fieldLabel(sections.address, 'addressLine1', 'Address Line 1')}
                      {isFieldRequired(sections.address, 'addressLine1') && <span className="text-red-500"> *</span>}
                    </Label>
                    <Input
                      placeholder={fieldPlaceholder(sections.address, 'addressLine1', 'Door / Flat / Building No. & Name')}
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                      required={isFieldRequired(sections.address, 'addressLine1')}
                      className={inputClassName}
                      style={inputStyle()}
                      onFocus={(e) => { Object.assign(e.target.style, inputFocusStyle); }}
                      onBlur={(e) => { e.target.style.borderColor = colors.inputBorder; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                )}

                {/* Address Line 2 & 3 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {isFieldEnabled(sections.address, 'addressLine2') && (
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium" style={{ color: colors.label }}>
                        {fieldLabel(sections.address, 'addressLine2', 'Address Line 2')}
                        {isFieldRequired(sections.address, 'addressLine2') && <span className="text-red-500"> *</span>}
                      </Label>
                      <Input
                        placeholder={fieldPlaceholder(sections.address, 'addressLine2', 'Street / Road Name')}
                        value={address2}
                        onChange={(e) => setAddress2(e.target.value)}
                        required={isFieldRequired(sections.address, 'addressLine2')}
                        className={inputClassName}
                        style={inputStyle()}
                        onFocus={(e) => { Object.assign(e.target.style, inputFocusStyle); }}
                        onBlur={(e) => { e.target.style.borderColor = colors.inputBorder; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  )}
                  {isFieldEnabled(sections.address, 'addressLine3') && (
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium" style={{ color: colors.label }}>
                        {fieldLabel(sections.address, 'addressLine3', 'Address Line 3')}
                        {isFieldRequired(sections.address, 'addressLine3') && <span className="text-red-500"> *</span>}
                      </Label>
                      <Input
                        placeholder={fieldPlaceholder(sections.address, 'addressLine3', 'Additional area details')}
                        value={address3}
                        onChange={(e) => setAddress3(e.target.value)}
                        required={isFieldRequired(sections.address, 'addressLine3')}
                        className={inputClassName}
                        style={inputStyle()}
                        onFocus={(e) => { Object.assign(e.target.style, inputFocusStyle); }}
                        onBlur={(e) => { e.target.style.borderColor = colors.inputBorder; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  )}
                </div>

                {/* Sublocality & Locality */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {isFieldEnabled(sections.address, 'sublocality') && (
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium" style={{ color: colors.label }}>
                        {fieldLabel(sections.address, 'sublocality', 'Sublocality')}
                        {isFieldRequired(sections.address, 'sublocality') && <span className="text-red-500"> *</span>}
                      </Label>
                      <Input
                        placeholder={fieldPlaceholder(sections.address, 'sublocality', 'e.g. 4th Block')}
                        value={subLocality}
                        onChange={(e) => setSubLocality(e.target.value)}
                        required={isFieldRequired(sections.address, 'sublocality')}
                        className={inputClassName}
                        style={inputStyle()}
                        onFocus={(e) => { Object.assign(e.target.style, inputFocusStyle); }}
                        onBlur={(e) => { e.target.style.borderColor = colors.inputBorder; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  )}
                  {isFieldEnabled(sections.address, 'locality') && (
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium" style={{ color: colors.label }}>
                        {fieldLabel(sections.address, 'locality', 'Locality')}
                        {isFieldRequired(sections.address, 'locality') && <span className="text-red-500"> *</span>}
                      </Label>
                      <Input
                        placeholder={fieldPlaceholder(sections.address, 'locality', 'e.g. Koramangala')}
                        value={locality}
                        onChange={(e) => setLocality(e.target.value)}
                        required={isFieldRequired(sections.address, 'locality')}
                        className={inputClassName}
                        style={inputStyle()}
                        onFocus={(e) => { Object.assign(e.target.style, inputFocusStyle); }}
                        onBlur={(e) => { e.target.style.borderColor = colors.inputBorder; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  )}
                </div>

                {/* Landmark */}
                {isFieldEnabled(sections.address, 'landmark') && (
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium" style={{ color: colors.label }}>
                      {fieldLabel(sections.address, 'landmark', 'Landmark')}
                      {isFieldRequired(sections.address, 'landmark') && <span className="text-red-500"> *</span>}
                    </Label>
                    <Input
                      placeholder={fieldPlaceholder(sections.address, 'landmark', 'e.g. Near MG Road Metro Station')}
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      required={isFieldRequired(sections.address, 'landmark')}
                      className={inputClassName}
                      style={inputStyle()}
                      onFocus={(e) => { Object.assign(e.target.style, inputFocusStyle); }}
                      onBlur={(e) => { e.target.style.borderColor = colors.inputBorder; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                )}

                {/* City, State, Pincode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {isFieldEnabled(sections.address, 'city') && (
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium" style={{ color: colors.label }}>
                        {fieldLabel(sections.address, 'city', 'City')}
                        {isFieldRequired(sections.address, 'city') && <span className="text-red-500"> *</span>}
                      </Label>
                      <Input
                        placeholder={fieldPlaceholder(sections.address, 'city', 'e.g. Bengaluru')}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required={isFieldRequired(sections.address, 'city')}
                        className={inputClassName}
                        style={inputStyle()}
                        onFocus={(e) => { Object.assign(e.target.style, inputFocusStyle); }}
                        onBlur={(e) => { e.target.style.borderColor = colors.inputBorder; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  )}
                  {isFieldEnabled(sections.address, 'state') && (
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium" style={{ color: colors.label }}>
                        {fieldLabel(sections.address, 'state', 'State')}
                        {isFieldRequired(sections.address, 'state') && <span className="text-red-500"> *</span>}
                      </Label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required={isFieldRequired(sections.address, 'state')}
                        className={inputClassName}
                        style={{
                          ...inputStyle(),
                          backgroundColor: colors.inputBg,
                        }}
                        onFocus={(e) => { Object.assign(e.target.style, inputFocusStyle); }}
                        onBlur={(e) => { e.target.style.borderColor = colors.inputBorder; e.target.style.boxShadow = 'none'; }}
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {isFieldEnabled(sections.address, 'pincode') && (
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium" style={{ color: colors.label }}>
                        {fieldLabel(sections.address, 'pincode', 'Pincode')}
                        {isFieldRequired(sections.address, 'pincode') && <span className="text-red-500"> *</span>}
                      </Label>
                      <Input
                        placeholder={fieldPlaceholder(sections.address, 'pincode', 'e.g. 560034')}
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        required={isFieldRequired(sections.address, 'pincode')}
                        maxLength={6}
                        className={inputClassName}
                        style={inputStyle()}
                        onFocus={(e) => { Object.assign(e.target.style, inputFocusStyle); }}
                        onBlur={(e) => { e.target.style.borderColor = colors.inputBorder; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ========== Store Location Section ========== */}
          {sections.location.enabled && (
            <section
              className="rounded-xl border shadow-sm overflow-hidden"
              style={{ backgroundColor: colors.formBg, borderColor: `${colors.sectionTitleBorder}30` }}
            >
              <div
                className="px-5 sm:px-6 py-4 border-b-2"
                style={{ borderBottomColor: colors.sectionTitleBorder, backgroundColor: `${colors.sectionTitleBorder}08` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: colors.sectionTitleBorder }}
                  >
                    <Navigation className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold" style={{ color: colors.sectionTitle }}>
                      {sections.location.title}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="px-5 sm:px-6 py-5 space-y-4">
                <MapPicker latitude={latitude} longitude={longitude} onLocationChange={handleLocationChange} />

                {/* Use Current Location Button */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (!navigator.geolocation) return;
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          const lat = parseFloat(pos.coords.latitude.toFixed(6));
                          const lng = parseFloat(pos.coords.longitude.toFixed(6));
                          handleLocationChange(lat, lng);
                        },
                        () => {},
                        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                      );
                    }}
                    className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
                    style={{ backgroundColor: colors.mapButton }}
                  >
                    <Crosshair className="h-4 w-4" />
                    Use Current Location
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* ========== Business Hours Section ========== */}
          {sections.businessHours.enabled && (
            <section
              className="rounded-xl border shadow-sm overflow-hidden"
              style={{ backgroundColor: colors.formBg, borderColor: `${colors.sectionTitleBorder}30` }}
            >
              <div
                className="px-5 sm:px-6 py-4 border-b-2"
                style={{ borderBottomColor: colors.sectionTitleBorder, backgroundColor: `${colors.sectionTitleBorder}08` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: colors.sectionTitleBorder }}
                  >
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold" style={{ color: colors.sectionTitle }}>
                      {sections.businessHours.title}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="px-5 sm:px-6 py-5">
                {/* Desktop table view */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b" style={{ borderColor: colors.inputBorder }}>
                        <th className="text-left py-2 px-3 text-sm font-medium" style={{ color: colors.label }}>Day</th>
                        <th className="text-left py-2 px-3 text-sm font-medium" style={{ color: colors.label }}>Open</th>
                        <th className="text-left py-2 px-3 text-sm font-medium" style={{ color: colors.label }}>Close</th>
                        <th className="text-center py-2 px-3 text-sm font-medium" style={{ color: colors.label }}>Closed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DAYS_OF_WEEK.map((day) => {
                        const bh = businessHours[day.key];
                        return (
                          <tr key={day.key} className="border-b" style={{ borderColor: `${colors.inputBorder}50` }}>
                            <td className="py-2.5 px-3 text-sm font-medium text-slate-700">{day.label}</td>
                            <td className="py-2.5 px-3">
                              <input
                                type="time"
                                value={bh.open}
                                onChange={(e) => updateBusinessHour(day.key, 'open', e.target.value)}
                                disabled={bh.closed}
                                className="h-9 rounded-lg border px-2 text-sm transition-colors focus:outline-none focus:ring-2 disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{
                                  backgroundColor: colors.inputBg,
                                  borderColor: colors.inputBorder,
                                  ...(bh.closed ? {} : {}),
                                }}
                                onFocus={(e) => { if (!bh.closed) Object.assign(e.target.style, inputFocusStyle); }}
                                onBlur={(e) => { e.target.style.borderColor = colors.inputBorder; e.target.style.boxShadow = 'none'; }}
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <input
                                type="time"
                                value={bh.close}
                                onChange={(e) => updateBusinessHour(day.key, 'close', e.target.value)}
                                disabled={bh.closed}
                                className="h-9 rounded-lg border px-2 text-sm transition-colors focus:outline-none focus:ring-2 disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{
                                  backgroundColor: colors.inputBg,
                                  borderColor: colors.inputBorder,
                                }}
                                onFocus={(e) => { if (!bh.closed) Object.assign(e.target.style, inputFocusStyle); }}
                                onBlur={(e) => { e.target.style.borderColor = colors.inputBorder; e.target.style.boxShadow = 'none'; }}
                              />
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={bh.closed}
                                onChange={(e) => updateBusinessHour(day.key, 'closed', e.target.checked)}
                                className="h-4 w-4 rounded cursor-pointer accent-red-500"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card view */}
                <div className="sm:hidden space-y-3">
                  {DAYS_OF_WEEK.map((day) => {
                    const bh = businessHours[day.key];
                    return (
                      <div
                        key={day.key}
                        className="rounded-lg border p-3 space-y-2"
                        style={{
                          backgroundColor: bh.closed ? `${colors.inputBg}` : colors.inputBg,
                          borderColor: colors.inputBorder,
                          opacity: bh.closed ? 0.6 : 1,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">{day.label}</span>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-xs text-slate-500">Closed</span>
                            <input
                              type="checkbox"
                              checked={bh.closed}
                              onChange={(e) => updateBusinessHour(day.key, 'closed', e.target.checked)}
                              className="h-4 w-4 rounded cursor-pointer accent-red-500"
                            />
                          </label>
                        </div>
                        {!bh.closed && (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <span className="text-xs" style={{ color: colors.label }}>Open</span>
                              <input
                                type="time"
                                value={bh.open}
                                onChange={(e) => updateBusinessHour(day.key, 'open', e.target.value)}
                                className="h-9 w-full rounded-lg border px-2 text-sm"
                                style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder }}
                                onFocus={(e) => { Object.assign(e.target.style, inputFocusStyle); }}
                                onBlur={(e) => { e.target.style.borderColor = colors.inputBorder; e.target.style.boxShadow = 'none'; }}
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs" style={{ color: colors.label }}>Close</span>
                              <input
                                type="time"
                                value={bh.close}
                                onChange={(e) => updateBusinessHour(day.key, 'close', e.target.value)}
                                className="h-9 w-full rounded-lg border px-2 text-sm"
                                style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder }}
                                onFocus={(e) => { Object.assign(e.target.style, inputFocusStyle); }}
                                onBlur={(e) => { e.target.style.borderColor = colors.inputBorder; e.target.style.boxShadow = 'none'; }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* ========== Contact Details Section ========== */}
          {sections.contactDetails.enabled && (
            <section
              className="rounded-xl border shadow-sm overflow-hidden"
              style={{ backgroundColor: colors.formBg, borderColor: `${colors.sectionTitleBorder}30` }}
            >
              <div
                className="px-5 sm:px-6 py-4 border-b-2"
                style={{ borderBottomColor: colors.sectionTitleBorder, backgroundColor: `${colors.sectionTitleBorder}08` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: colors.sectionTitleBorder }}
                  >
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold" style={{ color: colors.sectionTitle }}>
                      {sections.contactDetails.title}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="px-5 sm:px-6 py-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {isFieldEnabled(sections.contactDetails, 'storeNumber') && (
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium" style={{ color: colors.label }}>
                        {fieldLabel(sections.contactDetails, 'storeNumber', 'Store Number')}
                        {isFieldRequired(sections.contactDetails, 'storeNumber') && <span className="text-red-500"> *</span>}
                      </Label>
                      <Input
                        type="tel"
                        placeholder={fieldPlaceholder(sections.contactDetails, 'storeNumber', '+91-XXXXXXXXXX')}
                        value={storeNumber}
                        onChange={(e) => setStoreNumber(e.target.value)}
                        required={isFieldRequired(sections.contactDetails, 'storeNumber')}
                        className={inputClassName}
                        style={inputStyle()}
                        onFocus={(e) => { Object.assign(e.target.style, inputFocusStyle); }}
                        onBlur={(e) => { e.target.style.borderColor = colors.inputBorder; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  )}
                  {isFieldEnabled(sections.contactDetails, 'email') && (
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium" style={{ color: colors.label }}>
                        {fieldLabel(sections.contactDetails, 'email', 'Email')}
                        {isFieldRequired(sections.contactDetails, 'email') && <span className="text-red-500"> *</span>}
                      </Label>
                      <Input
                        type="email"
                        placeholder={fieldPlaceholder(sections.contactDetails, 'email', 'store@email.com')}
                        value={storeEmail}
                        onChange={(e) => setStoreEmail(e.target.value)}
                        required={isFieldRequired(sections.contactDetails, 'email')}
                        className={inputClassName}
                        style={inputStyle()}
                        onFocus={(e) => { Object.assign(e.target.style, inputFocusStyle); }}
                        onBlur={(e) => { e.target.style.borderColor = colors.inputBorder; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  )}
                </div>
                {isFieldEnabled(sections.contactDetails, 'whatsapp') && (
                  <div className="space-y-1.5 max-w-md">
                    <Label className="text-sm font-medium" style={{ color: colors.label }}>
                      {fieldLabel(sections.contactDetails, 'whatsapp', 'WhatsApp Number')}
                      {isFieldRequired(sections.contactDetails, 'whatsapp') && <span className="text-red-500"> *</span>}
                    </Label>
                    <Input
                      type="tel"
                      placeholder={fieldPlaceholder(sections.contactDetails, 'whatsapp', '+91-XXXXXXXXXX')}
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      required={isFieldRequired(sections.contactDetails, 'whatsapp')}
                      className={inputClassName}
                      style={inputStyle()}
                      onFocus={(e) => { Object.assign(e.target.style, inputFocusStyle); }}
                      onBlur={(e) => { e.target.style.borderColor = colors.inputBorder; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ========== Store Front Photos Section ========== */}
          {sections.storefrontPhotos.enabled && (
            <section
              className="rounded-xl border shadow-sm overflow-hidden"
              style={{ backgroundColor: colors.formBg, borderColor: `${colors.sectionTitleBorder}30` }}
            >
              <div
                className="px-5 sm:px-6 py-4 border-b-2"
                style={{ borderBottomColor: colors.sectionTitleBorder, backgroundColor: `${colors.sectionTitleBorder}08` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: colors.sectionTitleBorder }}
                  >
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold" style={{ color: colors.sectionTitle }}>
                      {sections.storefrontPhotos.title}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="px-5 sm:px-6 py-5">
                <PhotoUpload
                  label={sections.storefrontPhotos.title}
                  photos={storefrontPhotos}
                  onPhotosChange={setStorefrontPhotos}
                  maxPhotos={5}
                  required
                  driveFolderId={brandData.driveFolderId}
                />
              </div>
            </section>
          )}

          {/* ========== Store Inside Photos Section ========== */}
          {sections.inventoryPhotos.enabled && (
            <section
              className="rounded-xl border shadow-sm overflow-hidden"
              style={{ backgroundColor: colors.formBg, borderColor: `${colors.sectionTitleBorder}30` }}
            >
              <div
                className="px-5 sm:px-6 py-4 border-b-2"
                style={{ borderBottomColor: colors.sectionTitleBorder, backgroundColor: `${colors.sectionTitleBorder}08` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: colors.sectionTitleBorder }}
                  >
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold" style={{ color: colors.sectionTitle }}>
                      {sections.inventoryPhotos.title}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="px-5 sm:px-6 py-5">
                <PhotoUpload
                  label={sections.inventoryPhotos.title}
                  photos={inventoryPhotos}
                  onPhotosChange={setInventoryPhotos}
                  maxPhotos={5}
                  required
                  driveFolderId={brandData.driveFolderId}
                />
              </div>
            </section>
          )}

          {/* ========== Submit Button ========== */}
          <div className="sticky bottom-4 z-30">
            <div className="max-w-4xl mx-auto">
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-13 text-base font-semibold text-white rounded-xl shadow-xl transition-all flex items-center justify-center gap-2.5 disabled:opacity-60"
                style={{
                  backgroundColor: colors.submitButton,
                  boxShadow: `0 10px 25px -5px ${colors.submitButton}40`,
                }}
                onMouseEnter={(e) => {
                  if (!submitting) e.currentTarget.style.backgroundColor = colors.submitButtonHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.submitButton;
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Registering Dealer...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    {config.submitButtonText}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
