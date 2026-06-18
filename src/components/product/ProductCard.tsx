"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { ProductCard as TProductCard } from "@/lib/data";
import { useCart } from "@/store/cart";
import { formatPrice, formatPriceRange } from "@/lib/utils";

export default function ProductCard({ product }: { product: TProductCard }) {
  const addItem = useCart((s) => s.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0],
    });
    toast.success(`${product.name} added to cart`);
  };

  const discounted = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="group">
      <Link href={`/product/${product.slug}`} className="block">
        {/* Image in a soft neutral frame */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[#f3f1ee]">
          {product.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-grey-300">
              <ShoppingBag size={40} strokeWidth={1.2} />
            </div>
          )}

          {discounted && (
            <span className="absolute left-3 top-3 rounded-full bg-foreground px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white">
              SALE
            </span>
          )}

          {/* Quick add only for simple products (variants must be chosen on the page) */}
          {!product.hasVariants && (
            <button
              onClick={handleAdd}
              className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-foreground opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100 hover:bg-foreground hover:text-white"
              aria-label="Add to cart"
            >
              <Plus size={18} />
            </button>
          )}
        </div>

        {/* Details — M&S style: price, brand, name */}
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              {formatPriceRange(product.price, product.priceMax)}
            </span>
            <span className="text-[11px] text-grey-400">ex VAT</span>
            {discounted && (
              <span className="text-xs text-grey-400 line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm font-semibold text-foreground">{product.brand}</p>
          <h3 className="text-sm text-grey-600 line-clamp-2">{product.name}</h3>
        </div>
      </Link>
    </motion.div>
  );
}
