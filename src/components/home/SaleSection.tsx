"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Plus, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { ProductCard as TProductCard } from "@/lib/data";
import { useCart } from "@/store/cart";
import { formatPrice, formatPriceRange } from "@/lib/utils";

/**
 * Homepage "On Sale" section. Shows products that have a Compare-at price
 * higher than their selling price — set per product in the admin panel
 * (Product editor → "Compare-at price"). Each card highlights the discount
 * percentage and the amount saved.
 */
function SaleCard({ product }: { product: TProductCard }) {
  const addItem = useCart((s) => s.addItem);

  const was = product.compareAtPrice!;
  const now = product.price;
  const saved = was - now;
  const percent = Math.round((saved / was) * 100);

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

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#f3f1ee]">
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

          {/* Discount badge */}
          <span className="absolute left-3 top-3 flex flex-col items-center rounded-lg bg-red-600 px-2.5 py-1 leading-none text-white shadow-sm">
            <span className="text-base font-extrabold">-{percent}%</span>
            <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide">Off</span>
          </span>

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

        <div className="mt-3">
          <p className="text-sm font-semibold text-foreground">{product.brand}</p>
          <h3 className="line-clamp-2 text-sm text-grey-600">{product.name}</h3>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-bold text-red-600">
              {formatPriceRange(product.price, product.priceMax)}
            </span>
            <span className="text-sm text-grey-400 line-through">{formatPrice(was)}</span>
          </div>
          <p className="mt-1 text-xs font-semibold text-red-600">
            Save {formatPrice(saved)} ({percent}% off)
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function SaleSection({ products }: { products: TProductCard[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-600">
            Limited time
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            On Sale Now
          </h2>
          <p className="mt-2 text-sm text-grey-500">Save while stocks last</p>
        </div>
        <Link
          href="/shop"
          className="hidden items-center gap-1 text-sm font-medium text-grey-600 hover:text-foreground sm:inline-flex"
        >
          View all <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <SaleCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
