"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice, vatPercent } from "@/lib/utils";
import FreeDeliveryBar from "./FreeDeliveryBar";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, vat, shipping, total } = useCart();

  // Load the saved cart from localStorage after mount (persist uses
  // skipHydration) so the server and first client render always match.
  useEffect(() => {
    useCart.persist.rehydrate();
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60]"
        >
          <div className="absolute inset-0 bg-black/40" onClick={closeCart} />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-grey-200 px-5 py-4">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <ShoppingBag size={18} /> Your Bag
              </h2>
              <button onClick={closeCart} aria-label="Close cart" className="text-grey-500 hover:text-foreground">
                <X size={22} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <ShoppingBag size={40} className="text-grey-300" />
                <p className="text-sm text-grey-500">Your bag is empty.</p>
                <button
                  onClick={closeCart}
                  className="mt-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variantId || ""}`} className="flex gap-3 border-b border-grey-100 py-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-grey-100">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-grey-300">
                            <ShoppingBag size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={closeCart}
                          className="text-sm font-medium text-foreground hover:underline"
                        >
                          {item.name}
                        </Link>
                        {item.variantLabel && (
                          <span className="mt-0.5 text-xs text-grey-400">{item.variantLabel}</span>
                        )}
                        <span className="mt-1 text-sm text-grey-500">{formatPrice(item.price)} <span className="text-xs text-grey-400">ex VAT</span></span>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-grey-200">
                            <button
                              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                              className="px-2 py-1 text-grey-500 hover:text-foreground"
                              aria-label="Decrease"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-7 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                              className="px-2 py-1 text-grey-500 hover:text-foreground"
                              aria-label="Increase"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.productId, item.variantId)}
                            className="text-grey-400 hover:text-red-500"
                            aria-label="Remove"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-grey-200 px-5 py-4">
                  <div className="mb-3">
                    <FreeDeliveryBar subtotal={subtotal()} />
                  </div>
                  <div className="mb-3 space-y-1.5">
                    <div className="flex items-center justify-between text-sm text-grey-500">
                      <span>Subtotal (ex VAT)</span>
                      <span>{formatPrice(subtotal())}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-grey-500">
                      <span>VAT ({vatPercent}%)</span>
                      <span>{formatPrice(vat())}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-grey-500">
                      <span>Shipping &amp; handling</span>
                      <span>{shipping() === 0 ? <span className="font-semibold text-green-700">FREE</span> : formatPrice(shipping())}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-grey-200 pt-2 text-base font-semibold text-foreground">
                      <span>Total</span>
                      <span>{formatPrice(total())}</span>
                    </div>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="block w-full rounded-full bg-foreground py-3 text-center text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
                  >
                    Checkout
                  </Link>
                  <p className="mt-2 text-center text-xs text-grey-400">
                    Prices exclude VAT. {vatPercent}% VAT and {formatPrice(shipping() || 7.5)} shipping included in the total above.
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
