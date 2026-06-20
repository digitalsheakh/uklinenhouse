"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { ProductCard as TProductCard } from "@/lib/data";

/**
 * Card "Add to Bag" button. From listing/home cards it takes the customer
 * to the product page (where they pick options and add to the bag).
 * Sits above the card's click overlay, so it has its own clear hit area.
 */
export default function AddToCartButton({ product }: { product: TProductCard }) {
  const router = useRouter();

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/product/${product.slug}`);
  }

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
    >
      <Plus size={16} /> Add to Bag
    </button>
  );
}
