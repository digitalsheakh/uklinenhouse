"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Minus, Plus, Check, Truck, ShieldCheck, ChevronRight, ChevronLeft, ZoomIn, X } from "lucide-react";
import toast from "react-hot-toast";
import { FullProduct } from "@/lib/data";
import { useCart } from "@/store/cart";
import { formatPrice, formatPriceRange } from "@/lib/utils";
import ProductAccordion from "./ProductAccordion";

const isColour = (name: string) => /colou?r/i.test(name);

export default function ProductDetail({ product }: { product: FullProduct }) {
  const addItem = useCart((s) => s.addItem);
  const hasVariants = product.variants.length > 0;

  const [selected, setSelected] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  // The variant matching all currently-selected options (only when every option chosen).
  const currentVariant = useMemo(() => {
    if (!hasVariants) return null;
    const allChosen = product.options.every((o) => selected[o.name]);
    if (!allChosen) return null;
    return (
      product.variants.find((v) =>
        v.options.every((o) => selected[o.name] === o.value)
      ) || null
    );
  }, [selected, product, hasVariants]);

  const gallery = product.images.length ? product.images : [];
  // When navigating with the arrows we always follow the gallery index; a
  // selected variant image (if any) takes precedence only until the user navigates.
  const displayImage = currentVariant?.image && activeImage === 0 ? currentVariant.image : gallery[activeImage] || gallery[0];

  const step = (dir: number) => {
    if (gallery.length < 2) return;
    setActiveImage((i) => (i + dir + gallery.length) % gallery.length);
  };

  const price = currentVariant ? currentVariant.price : product.price;
  const compareAt = currentVariant?.compareAtPrice ?? product.compareAtPrice;
  const discounted = compareAt && compareAt > price;

  const inStock = currentVariant
    ? currentVariant.stock > 0
    : hasVariants
    ? true
    : product.stock > 0;

  function selectValue(optName: string, value: string) {
    setSelected((s) => ({ ...s, [optName]: value }));
    setActiveImage(0); // surface the variant image (or first gallery image) again
  }

  function handleAdd() {
    if (hasVariants) {
      const missing = product.options.find((o) => !selected[o.name]);
      if (missing) return toast.error(`Please choose a ${missing.name}`);
      if (!currentVariant) return toast.error("That combination is unavailable");
      if (currentVariant.stock <= 0) return toast.error("Out of stock");
      addItem(
        {
          productId: product._id,
          variantId: currentVariant._id,
          variantLabel: currentVariant.options.map((o) => o.value).join(" / "),
          name: product.name,
          slug: product.slug,
          price: currentVariant.price,
          image: currentVariant.image || gallery[0],
        },
        qty
      );
    } else {
      if (product.stock <= 0) return toast.error("Out of stock");
      addItem(
        {
          productId: product._id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: gallery[0],
        },
        qty
      );
    }
    toast.success("Added to bag");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-grey-400">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight size={12} />
        <Link href="/shop" className="hover:text-foreground">Shop</Link>
        {product.category && (
          <>
            <ChevronRight size={12} />
            <Link href={`/shop/${product.category.slug}`} className="hover:text-foreground">
              {product.category.name}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          {/* Main image */}
          <div className="group relative flex-1 overflow-hidden rounded-2xl bg-[#f3f1ee]">
            <div className="aspect-square">
              {displayImage ? (
                <motion.img
                  key={displayImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={displayImage}
                  alt={product.name}
                  onClick={() => setZoomed(true)}
                  className="h-full w-full cursor-zoom-in object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-grey-300">
                  <ShoppingBag size={56} strokeWidth={1} />
                </div>
              )}
            </div>

            {gallery.length > 1 && (
              <>
                {/* Prev / next arrows */}
                <button
                  onClick={() => step(-1)}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md backdrop-blur transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => step(1)}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md backdrop-blur transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <ChevronRight size={20} />
                </button>
                {/* Position counter */}
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-2.5 py-0.5 text-xs font-medium text-white">
                  {activeImage + 1} / {gallery.length}
                </span>
              </>
            )}

            {displayImage && (
              <button
                onClick={() => setZoomed(true)}
                aria-label="Zoom image"
                className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md backdrop-blur transition hover:bg-white"
              >
                <ZoomIn size={18} />
              </button>
            )}
          </div>

          {/* Thumbnails, a row on mobile, a column on desktop */}
          {gallery.length > 1 && (
            <div className="no-scrollbar flex gap-3 overflow-x-auto sm:flex-col sm:overflow-visible">
              {gallery.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    displayImage === img ? "border-foreground" : "border-grey-200 hover:border-grey-400"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm font-semibold text-grey-500">{product.brand}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold text-foreground">
              {currentVariant || !hasVariants
                ? formatPrice(price)
                : formatPriceRange(product.price, product.priceMax)}
            </span>
            <span className="rounded-full bg-grey-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-grey-500">
              Ex VAT
            </span>
            {discounted && (
              <span className="text-base text-grey-400 line-through">{formatPrice(compareAt!)}</span>
            )}
          </div>
          <p className="mt-1.5 text-xs text-grey-400">
            VAT and shipping are calculated at checkout.
          </p>

          {/* Options */}
          {product.options.map((opt) => (
            <div key={opt.name} className="mt-6">
              <div className="mb-2 flex items-center gap-2 text-sm">
                <span className="font-medium text-foreground">{opt.name}</span>
                {selected[opt.name] && <span className="text-grey-500">- {selected[opt.name]}</span>}
              </div>

              {isColour(opt.name) ? (
                <div className="flex flex-wrap gap-2">
                  {opt.values.map((v) => {
                    const active = selected[opt.name] === v.value;
                    return (
                      <button
                        key={v.value}
                        onClick={() => selectValue(opt.name, v.value)}
                        title={v.value}
                        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${
                          active ? "border-foreground" : "border-grey-200 hover:border-grey-400"
                        }`}
                      >
                        <span
                          className="h-6 w-6 rounded-full border border-black/10"
                          style={{ backgroundColor: v.swatch || "#ccc" }}
                        />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {opt.values.map((v) => {
                    const active = selected[opt.name] === v.value;
                    return (
                      <button
                        key={v.value}
                        onClick={() => selectValue(opt.name, v.value)}
                        className={`min-w-[3rem] rounded-lg border px-3.5 py-2 text-sm font-medium transition ${
                          active
                            ? "border-foreground bg-foreground text-white"
                            : "border-grey-200 text-grey-700 hover:border-grey-400"
                        }`}
                      >
                        {v.value}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* Quantity + add to cart */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-grey-200">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-3 text-grey-500 hover:text-foreground" aria-label="Decrease">
                <Minus size={16} />
              </button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-3 py-3 text-grey-500 hover:text-foreground" aria-label="Increase">
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={!inStock}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              <ShoppingBag size={17} />
              {inStock ? "Add to Bag" : "Out of Stock"}
            </button>
          </div>

          {/* Trust strip */}
          <div className="mt-6 space-y-2 border-t border-grey-200 pt-6">
            <p className="flex items-center gap-2 text-sm text-grey-600"><Truck size={16} /> Fast UK delivery on stocked items</p>
            <p className="flex items-center gap-2 text-sm text-grey-600"><ShieldCheck size={16} /> Quality assured, trade tested</p>
            {product.category && (
              <p className="flex items-center gap-2 text-sm text-grey-600"><Check size={16} /> {product.category.name}</p>
            )}
          </div>

        </div>
      </div>

      {/* Collapsible info sections (About / Delivery / Reviews / Q&A / FBT) */}
      <ProductAccordion product={product} />

      {/* Full-screen zoom */}
      <AnimatePresence>
        {zoomed && displayImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomed(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          >
            <button
              onClick={() => setZoomed(false)}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            >
              <X size={22} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayImage}
              alt={product.name}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full rounded-lg object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
