"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag, X, ChevronDown, User, Heart, LayoutGrid } from "lucide-react";
import Logo from "./Logo";
import { CategoryNode } from "@/lib/data";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export default function Header({ categories }: { categories: CategoryNode[] }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchCat, setSearchCat] = useState("");

  const count = useCart((s) => s.count());
  const subtotal = useCart((s) => s.subtotal());
  const openCart = useCart((s) => s.openCart);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (searchCat) params.set("category", searchCat);
    router.push(`/shop${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-grey-200 bg-white">
      {/* Main row */}
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3.5 sm:px-6 lg:gap-6">
        <button
          className="lg:hidden text-grey-700"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        <Logo />

        {/* Search (desktop) */}
        <form
          onSubmit={onSearch}
          className="hidden flex-1 items-center overflow-hidden rounded-full border border-grey-300 focus-within:border-foreground lg:flex"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products…"
            className="flex-1 bg-transparent px-5 py-2.5 text-sm outline-none"
          />
          <div className="flex items-center border-l border-grey-200">
            <select
              value={searchCat}
              onChange={(e) => setSearchCat(e.target.value)}
              className="max-w-[140px] cursor-pointer bg-transparent py-2.5 pl-3 pr-2 text-sm text-grey-600 outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <button
              type="submit"
              className="flex h-11 w-12 items-center justify-center bg-accent text-white transition-colors hover:bg-accent-hover"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1 sm:gap-3 lg:ml-0">
          <Link href="/account" className="hidden flex-col items-center text-grey-700 hover:text-foreground sm:flex" aria-label="Account">
            <User size={20} />
            <span className="text-[10px]">Account</span>
          </Link>
          <Link href="/wishlist" className="hidden flex-col items-center text-grey-700 hover:text-foreground sm:flex" aria-label="Wishlist">
            <Heart size={20} />
            <span className="text-[10px]">Saved</span>
          </Link>
          <button onClick={openCart} className="flex items-center gap-2 rounded-full px-2 py-1 text-grey-800 hover:bg-grey-50" aria-label="Cart">
            <span className="relative">
              <ShoppingBag size={22} />
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-white">
                  {count}
                </span>
              )}
            </span>
            <span className="hidden text-sm font-semibold sm:inline">{formatPrice(subtotal)}</span>
          </button>
        </div>
      </div>

      {/* Search (mobile) */}
      <form onSubmit={onSearch} className="flex items-center gap-2 px-4 pb-3 lg:hidden">
        <div className="flex flex-1 items-center overflow-hidden rounded-full border border-grey-300">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products…"
            className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none"
          />
          <button type="submit" className="flex h-10 w-11 items-center justify-center bg-foreground text-white" aria-label="Search">
            <Search size={18} />
          </button>
        </div>
      </form>

      {/* Nav row (desktop) */}
      <div className="hidden border-t border-grey-200 lg:block">
        <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-4 sm:px-6">
          <Link
            href="/shop"
            className="flex items-center gap-2 bg-accent px-5 py-3 text-sm font-semibold text-white"
          >
            <LayoutGrid size={16} /> All Products
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/shop" className="py-3 text-sm font-medium text-grey-700 hover:text-foreground">Shop</Link>
            <Link href="/about" className="py-3 text-sm font-medium text-grey-700 hover:text-foreground">About Us</Link>
            <Link href="/contact" className="py-3 text-sm font-medium text-grey-700 hover:text-foreground">Contact Us</Link>
            <Link href="/wholesale" className="py-3 text-sm font-medium text-grey-700 hover:text-foreground">Wholesale</Link>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && <MobileMenu categories={categories} onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>
    </header>
  );
}

function MobileMenu({ categories, onClose }: { categories: CategoryNode[]; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "tween", duration: 0.25 }}
        className="absolute left-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-white p-5"
      >
        <div className="mb-6 flex items-center justify-between">
          <Logo />
          <button onClick={onClose} aria-label="Close menu" className="text-grey-700"><X size={24} /></button>
        </div>

        <nav className="flex flex-col">
          <Link href="/shop" onClick={onClose} className="border-b border-grey-100 py-3 text-sm font-semibold text-foreground">All Products</Link>
          {categories.map((cat) => (
            <div key={cat._id} className="border-b border-grey-100">
              <div className="flex items-center justify-between py-3">
                <Link href={`/shop/${cat.slug}`} onClick={onClose} className="text-sm font-medium text-grey-800">{cat.name}</Link>
                {cat.children.length > 0 && (
                  <button onClick={() => setExpanded(expanded === cat._id ? null : cat._id)} className="p-1 text-grey-400" aria-label="Toggle">
                    <ChevronDown size={16} className={`transition-transform ${expanded === cat._id ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>
              <AnimatePresence>
                {expanded === cat._id && cat.children.length > 0 && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="flex flex-col pb-2 pl-3">
                      {cat.children.map((sub) => (
                        <Link key={sub._id} href={`/shop/${cat.slug}/${sub.slug}`} onClick={onClose} className="py-2 text-sm text-grey-500">{sub.name}</Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <Link href="/about" onClick={onClose} className="border-b border-grey-100 py-3 text-sm font-medium text-grey-800">About Us</Link>
          <Link href="/contact" onClick={onClose} className="border-b border-grey-100 py-3 text-sm font-medium text-grey-800">Contact Us</Link>
          <Link href="/wholesale" onClick={onClose} className="py-3 text-sm font-semibold text-foreground">Wholesale Pricing</Link>
        </nav>
      </motion.div>
    </motion.div>
  );
}
