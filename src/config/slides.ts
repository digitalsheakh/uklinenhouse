/*
  =====================================================================
  HOMEPAGE HERO SLIDER — edit your slides here.
  Each slide: small label, heading, subtext, button, link, and an
  optional background image (drop the file in /public and set `image`).
  If no image is set, a clean grey gradient is used.
  =====================================================================
*/

export interface HeroSlide {
  label?: string;
  heading: string;
  subtext?: string;
  buttonText: string;
  buttonLink: string;
  image?: string; // e.g. "/slides/towels.jpg"
  align?: "left" | "center";
}

export const heroSlides: HeroSlide[] = [
  {
    label: "Premium Hospitality Linen",
    heading: "Luxury Bathrobes & Towels",
    subtext: "Terry towelling cotton — extremely soft and comfortable.",
    buttonText: "Shop Bath Linen",
    buttonLink: "/shop/bath-linen",
    align: "left",
  },
  {
    label: "Trusted UK Supplier",
    heading: "Cotton Wet Towels, In Bulk",
    subtext: "Perfect for restaurants, airlines and events. Order by the case.",
    buttonText: "Shop Wet Towels",
    buttonLink: "/shop/cotton-wet-towels",
    align: "left",
  },
  {
    label: "Trade Customers",
    heading: "Wholesale Pricing Available",
    subtext: "Register for a trade account and get our full price list.",
    buttonText: "Get Wholesale Pricing",
    buttonLink: "/wholesale",
    align: "left",
  },
];
