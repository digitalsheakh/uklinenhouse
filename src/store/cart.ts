"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { siteConfig } from "@/config/site";

export interface CartItem {
  productId: string;
  variantId?: string; // undefined for simple products
  variantLabel?: string; // e.g. "Grey / Large"
  name: string;
  slug: string;
  price: number;
  image?: string;
  quantity: number;
}

/** Unique line identity = product + variant. */
function lineId(productId: string, variantId?: string) {
  return `${productId}::${variantId || ""}`;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  count: () => number;
  /** Sum of line prices, EXCLUDING VAT (product prices are stored ex-VAT). */
  subtotal: () => number;
  /** VAT (20%) on the subtotal. */
  vat: () => number;
  /** Flat shipping & handling, charged once per order (0 when cart empty). */
  shipping: () => number;
  /** Grand total: subtotal + VAT + shipping. */
  total: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item, qty = 1) =>
        set((state) => {
          const id = lineId(item.productId, item.variantId);
          const existing = state.items.find((i) => lineId(i.productId, i.variantId) === id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                lineId(i.productId, i.variantId) === id
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              ),
              isOpen: true,
            };
          }
          return { items: [...state.items, { ...item, quantity: qty }], isOpen: true };
        }),

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => lineId(i.productId, i.variantId) !== lineId(productId, variantId)
          ),
        })),

      updateQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              lineId(i.productId, i.variantId) === lineId(productId, variantId)
                ? { ...i, quantity }
                : i
            )
            .filter((i) => i.quantity > 0),
        })),

      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      count: () => get().items.reduce((n, i) => n + i.quantity, 0),
      subtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
      vat: () => get().subtotal() * siteConfig.vatRate,
      shipping: () => (get().items.length > 0 ? siteConfig.shippingFee : 0),
      total: () => {
        const sub = get().subtotal();
        return sub + sub * siteConfig.vatRate + (get().items.length > 0 ? siteConfig.shippingFee : 0);
      },
    }),
    {
      name: "ulh-cart",
      // Only persist the items — never the open/closed UI state, so the
      // drawer can't reopen itself on load.
      partialize: (state) => ({ items: state.items }),
      // Don't read localStorage during the first render; we rehydrate
      // manually after mount (see CartDrawer) to avoid SSR hydration
      // mismatches that would break client-side JS on the whole page.
      skipHydration: true,
      // Only restore the saved items — never any stale UI state.
      merge: (persisted, current) => ({
        ...current,
        items: (persisted as { items?: CartItem[] })?.items ?? [],
      }),
    }
  )
);
