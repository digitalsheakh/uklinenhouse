/*
  =====================================================================
  SITE CONFIG — edit your brand details here in one place.
  =====================================================================
*/

export const siteConfig = {
  name: "UK Linen House",
  shortName: "UK Linen House",
  tagline: "Premium Linen, Towels & Workwear",
  description:
    "UK Linen House supplies premium cotton wet towels, table & bath linen, bags, workwear and more. Quality products for hospitality and home.",

  // Contact details (shown in footer / contact page)
  email: "info@uklinenhouse.co.uk",
  phone: "+44 0000 000000",
  // WhatsApp number in full international format (digits only, no +, spaces or 0 prefix).
  // e.g. UK mobile 07123 456789 becomes "447123456789". Update this to your real number.
  whatsapp: "440000000000",
  address: "United Kingdom",

  // Social links (leave blank to hide)
  social: {
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
  },

  // Currency
  currency: "GBP",
  currencySymbol: "£",

  // Tax & shipping. Product prices entered in the admin are EXCLUDING VAT;
  // VAT and shipping are added at checkout.
  vatRate: 0.2, // 20% UK VAT
  shippingFee: 7.5, // flat shipping & handling per order (£)

  // Admin panel path
  adminPath: "/hamzah",

  // Top notification bar
  topBar: {
    message: "Free delivery on trade orders over £150. Nationwide UK shipping",
    brochureUrl: "/brochure.pdf", // drop a PDF in /public, or change this link
  },
} as const;

export type SiteConfig = typeof siteConfig;
