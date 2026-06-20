/*
  =====================================================================
  HOMEPAGE HERO SLIDER, edit your slides here.
  Each slide: small label, heading, subtext, button, link, and a
  background image (files live in /public/slider-image).
  Links are placeholders for now, wire them to real pages later.
  =====================================================================
*/

export interface HeroSlide {
  label?: string;
  heading: string;
  subtext?: string;
  buttonText: string;
  buttonLink: string;
  image: string;
}

export const heroSlides: HeroSlide[] = [
  {
    label: "Luxury Hospitality Linen",
    heading: "Hotel Towels & Bath Linen",
    subtext: "Premium terry cotton, soft, absorbent and built to last.",
    buttonText: "Shop Now",
    buttonLink: "/shop/bath-linen",
    image: "/slider-image/uk-linen-house-bath-linen-header.png",
  },
  {
    label: "Crisp & Comfortable",
    heading: "Premium Hotel Bed Linen",
    subtext: "Soft, durable bedding for hotels, B&Bs and homes.",
    buttonText: "Shop Now",
    buttonLink: "/shop/bed-linen",
    image: "/slider-image/uk-linen-house-bed-linen-image1.png",
  },
  {
    label: "Trusted UK Supplier",
    heading: "Cotton Wet Towels, In Bulk",
    subtext: "Perfect for restaurants, airlines and events. Order by the case.",
    buttonText: "Shop Now",
    buttonLink: "/shop/cotton-wet-towels",
    image: "/slider-image/uk-linen-house-wet-towels.png",
  },
  {
    label: "Set the Table",
    heading: "Table Linen & Napkins",
    subtext: "Elegant napkins and tablecloths for every occasion.",
    buttonText: "Shop Now",
    buttonLink: "/shop/table-linen",
    image: "/slider-image/uk-linen-house-table-linen-napkins.png",
  },
  {
    label: "Professional Workwear",
    heading: "Chef Jackets & Aprons",
    subtext: "Hard-wearing kitchen and hospitality workwear.",
    buttonText: "Shop Now",
    buttonLink: "/shop/work-wear",
    image: "/slider-image/uk-linen-house-chef-jacket-black-short-sleeve.png",
  },
];
