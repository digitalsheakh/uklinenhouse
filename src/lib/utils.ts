import { siteConfig } from "@/config/site";

/** Convert a string to a URL-friendly slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Format a number as a price using the configured currency. */
export function formatPrice(amount: number): string {
  return `${siteConfig.currencySymbol}${amount.toFixed(2)}`;
}

/** Format a price, or a range "£4 – £28" when min and max differ. */
export function formatPriceRange(min: number, max?: number): string {
  if (typeof max === "number" && max > min) {
    return `${formatPrice(min)} – ${formatPrice(max)}`;
  }
  return formatPrice(min);
}

/** Tiny className combiner. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
