interface VariantLike {
  price: number;
}

/**
 * Given a product's variants (may be empty) and its base price, returns the
 * `price` (minimum) and `priceMax` (maximum) used for display & sorting.
 * - No variants  → price = base, priceMax = base
 * - With variants → price = cheapest variant, priceMax = dearest variant
 */
export function computePricing(
  variants: VariantLike[] | undefined,
  basePrice: number
): { price: number; priceMax: number } {
  if (variants && variants.length > 0) {
    const prices = variants.map((v) => v.price);
    return { price: Math.min(...prices), priceMax: Math.max(...prices) };
  }
  return { price: basePrice, priceMax: basePrice };
}

/** Whether a product shows a price range (min ≠ max). */
export function isPriceRange(price: number, priceMax?: number): boolean {
  return typeof priceMax === "number" && priceMax > price;
}
