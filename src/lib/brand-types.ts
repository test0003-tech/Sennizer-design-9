/**
 * Brand Configuration Types (Client-Safe)
 * ========================================
 * This file contains ONLY TypeScript interfaces and the default config factory.
 * It does NOT import @cloudflare/next-on-pages, so it can be safely imported
 * from Client Components without triggering the 'server-only' error.
 *
 * For D1 database operations, use @/lib/brand-db (server-only).
 */

// ---------------------------------------------------------------------------
// TypeScript Interfaces
// ---------------------------------------------------------------------------

export interface FormFieldConfig {
  enabled: boolean;
  label: string;
  placeholder: string;
  required: boolean;
  type?: 'text' | 'dropdown';
  options?: string[];
}

export interface FormSectionConfig {
  enabled: boolean;
  title: string;
  fields: Record<string, FormFieldConfig>;
}

export interface ColorConfig {
  header: string;
  sectionTitle: string;
  sectionTitleBorder: string;
  label: string;
  inputBg: string;
  inputBorder: string;
  inputFocusBorder: string;
  inputFocusShadow: string;
  mapButton: string;
  submitButton: string;
  submitButtonHover: string;
  formBg: string;
  pageBg: string;
}

export interface BrandFormConfig {
  sections: {
    storeDetails: FormSectionConfig;
    address: FormSectionConfig;
    location: FormSectionConfig;
    storefrontPhotos: FormSectionConfig;
    inventoryPhotos: FormSectionConfig;
    businessHours: FormSectionConfig;
    contactDetails: FormSectionConfig;
  };
  colors: ColorConfig;
  headerTitle: string;
  headerSubtitle: string;
  submitButtonText: string;
  successMessage: string;
}

export interface Brand {
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

// ---------------------------------------------------------------------------
// Default Configuration
// ---------------------------------------------------------------------------

export function getDefaultConfig(): BrandFormConfig {
  return {
    sections: {
      storeDetails: {
        enabled: true,
        title: 'Store Details',
        fields: {
          storeCode: {
            enabled: true,
            label: 'Store Code',
            placeholder: 'e.g. SN-DL-001',
            required: true,
          },
          storeName: {
            enabled: true,
            label: 'Store Name',
            placeholder: 'e.g. Sennheiser Audio Hub',
            required: true,
          },
        },
      },
      address: {
        enabled: true,
        title: 'Store Address',
        fields: {
          floorNo: {
            enabled: true,
            label: 'Floor No',
            placeholder: 'Select Floor',
            required: true,
            type: 'dropdown',
            options: [
              'Lower Ground Floor',
              'Ground Floor',
              '1st Floor',
              '2nd Floor',
              '3rd Floor',
              '4th Floor',
              '5th Floor',
              '6th Floor',
              '7th Floor',
              '8th Floor',
            ],
          },
          addressLine1: {
            enabled: true,
            label: 'Address Line 1',
            placeholder: 'Door / Flat / Building No. & Name',
            required: true,
          },
          addressLine2: {
            enabled: true,
            label: 'Address Line 2',
            placeholder: 'Street / Road Name',
            required: false,
          },
          addressLine3: {
            enabled: true,
            label: 'Address Line 3',
            placeholder: 'Additional area details',
            required: false,
          },
          sublocality: {
            enabled: true,
            label: 'Sub Locality',
            placeholder: 'e.g. 4th Block',
            required: false,
          },
          locality: {
            enabled: true,
            label: 'Locality',
            placeholder: 'e.g. Koramangala',
            required: true,
          },
          landmark: {
            enabled: true,
            label: 'Landmark',
            placeholder: 'e.g. Near MG Road Metro Station',
            required: false,
          },
          city: {
            enabled: true,
            label: 'City',
            placeholder: 'e.g. Bengaluru',
            required: true,
          },
          state: {
            enabled: true,
            label: 'State',
            placeholder: 'Select State',
            required: true,
          },
          pincode: {
            enabled: true,
            label: 'Pin Code',
            placeholder: 'e.g. 560034',
            required: true,
          },
        },
      },
      location: {
        enabled: true,
        title: 'Store Location',
        fields: {},
      },
      storefrontPhotos: {
        enabled: true,
        title: 'Store Front Photos',
        fields: {},
      },
      inventoryPhotos: {
        enabled: true,
        title: 'Store Inside Photos',
        fields: {},
      },
      businessHours: {
        enabled: true,
        title: 'Business Hours',
        fields: {},
      },
      contactDetails: {
        enabled: true,
        title: 'Contact Details',
        fields: {
          storeNumber: {
            enabled: true,
            label: 'Store Number',
            placeholder: 'e.g. +91-XXXXXXXXXX',
            required: true,
          },
          email: {
            enabled: true,
            label: 'Email',
            placeholder: 'e.g. store@email.com',
            required: true,
          },
          whatsapp: {
            enabled: true,
            label: 'WhatsApp Number',
            placeholder: 'e.g. +91-XXXXXXXXXX',
            required: false,
          },
        },
      },
    },
    colors: {
      header: '#1a1a2e',
      sectionTitle: '#2c3e50',
      sectionTitleBorder: '#3498db',
      label: '#495057',
      inputBg: '#fafafa',
      inputBorder: '#e9ecef',
      inputFocusBorder: '#3498db',
      inputFocusShadow: 'rgba(52, 152, 219, 0.1)',
      mapButton: '#3498db',
      submitButton: '#27ae60',
      submitButtonHover: '#2ecc71',
      formBg: '#ffffff',
      pageBg: '#f5f7fa',
    },
    headerTitle: 'Google Business Profile Management',
    headerSubtitle: 'Dealer Details',
    submitButtonText: 'Submit Dealer Details',
    successMessage: 'Dealer Registered Successfully!',
  };
}
