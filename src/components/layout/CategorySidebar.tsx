"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, LayoutGrid, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { CategoryNode } from "@/lib/data";

/**
 * Vertical category list for the home & listing pages.
 * - Subcategories appear as a flyout on hover (desktop).
 * - Collapsible; the choice is remembered (localStorage) so customers can
 *   hide it on listing pages.
 */
export default function CategorySidebar({
  categories,
  collapsible = true,
}: {
  categories: CategoryNode[];
  collapsible?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    if (!collapsible) return;
    const saved = localStorage.getItem("ulh-sidebar");
    if (saved === "closed") setOpen(false);
  }, [collapsible]);

  function toggle() {
    setOpen((o) => {
      const next = !o;
      localStorage.setItem("ulh-sidebar", next ? "open" : "closed");
      return next;
    });
  }

  if (collapsible && !open) {
    return (
      <button
        onClick={toggle}
        className="flex h-fit items-center gap-2 rounded-lg border border-grey-200 bg-white px-3 py-2.5 text-sm font-medium text-grey-700 hover:border-grey-300"
      >
        <PanelLeftOpen size={18} /> Categories
      </button>
    );
  }

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="overflow-visible rounded-xl border border-grey-200 bg-white">
        <div className="flex items-center justify-between border-b border-grey-200 bg-accent px-4 py-3 text-white">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <LayoutGrid size={16} /> All Categories
          </span>
          {collapsible && (
            <button onClick={toggle} aria-label="Hide categories" className="text-grey-300 hover:text-white">
              <PanelLeftClose size={16} />
            </button>
          )}
        </div>

        <ul className="py-1.5">
          {categories.map((cat) => (
            <li
              key={cat._id}
              className="relative"
              onMouseEnter={() => setHovered(cat._id)}
              onMouseLeave={() => setHovered(null)}
            >
              <Link
                href={`/shop/${cat.slug}`}
                className="flex items-center justify-between px-4 py-2.5 text-sm text-grey-700 transition-colors hover:bg-grey-50 hover:text-foreground"
              >
                {cat.name}
                {cat.children.length > 0 && <ChevronRight size={15} className="text-grey-400" />}
              </Link>

              {/* Flyout (desktop) */}
              <AnimatePresence>
                {cat.children.length > 0 && hovered === cat._id && (
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-full top-0 z-30 hidden min-w-[220px] rounded-xl border border-grey-200 bg-white p-2 shadow-lg lg:block"
                  >
                    <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-grey-400">
                      {cat.name}
                    </p>
                    {cat.children.map((sub) => (
                      <Link
                        key={sub._id}
                        href={`/shop/${cat.slug}/${sub.slug}`}
                        className="block rounded-lg px-3 py-2 text-sm text-grey-600 hover:bg-grey-50 hover:text-foreground"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
