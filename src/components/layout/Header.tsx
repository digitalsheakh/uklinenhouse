"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag, X, ChevronDown, User, Heart } from "lucide-react";
import Logo from "./Logo";
import { CategoryNode } from "@/lib/data";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export default function Header({ categories }: { categories: CategoryNode[] }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hidden, setHidden] = useState(false);

  // Hide the header when scrolling down, reveal it when scrolling up.
  useEffect(() => {
    let lastY = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      if (y > lastY && y > 140) setHidden(true);
      else if (y < lastY) setHidden(false);
      lastY = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const count = useCart((s) => s.count());
  const subtotal = useCart((s) => s.subtotal());
  const openCart = useCart((s) => s.openCart);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/shop${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-grey-200 bg-white transition-transform duration-300 ease-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
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
          className="hidden flex-1 items-center overflow-hidden rounded-lg border border-grey-300 transition-colors focus-within:border-foreground lg:flex"
        >
          <Search size={18} className="ml-4 shrink-0 text-grey-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for?"
            className="flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-grey-400"
          />
          <button
            type="submit"
            className="self-stretch bg-foreground px-7 text-sm font-semibold text-white transition-colors hover:bg-grey-800"
          >
            Search
          </button>
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
      <form onSubmit={onSearch} className="px-4 pb-3 lg:hidden">
        <div className="flex items-center overflow-hidden rounded-lg border border-grey-300 focus-within:border-foreground">
          <Search size={18} className="ml-3 shrink-0 text-grey-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for?"
            className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-grey-400"
          />
          <button type="submit" className="self-stretch bg-foreground px-5 text-sm font-semibold text-white">
            Search
          </button>
        </div>
      </form>

      {/* Nav row (desktop) */}
      <div className="hidden border-t border-grey-200 lg:block">
        <nav className="mx-auto flex max-w-[1400px] items-center justify-center gap-10 px-4 sm:px-6">
          {[
            { href: "/about", label: "About Us" },
            { href: "/contact", label: "Contact Us" },
            { href: "/wholesale", label: "Wholesale" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-grey-700 transition-colors hover:text-accent"
            >
              {item.label}
              <span className="absolute inset-x-0 bottom-0 h-0.5 origin-center scale-x-0 bg-accent transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>
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
