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
    "UK Linen House supplies premium cotton wet towels, table & bath linen, bags, workwear and more — quality products for hospitality and home.",

  // Contact details (shown in footer / contact page)
  email: "info@uklinenhouse.co.uk",
  phone: "+44 0000 000000",
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

  // Admin panel path
  adminPath: "/hamzah",

  // Top notification bar
  topBar: {
    message: "Free delivery on trade orders over £150 — nationwide UK shipping",
    brochureUrl: "/brochure.pdf", // drop a PDF in /public, or change this link
  },
} as const;

export type SiteConfig = typeof siteConfig;
