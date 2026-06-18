"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Star, Truck, RotateCcw, MessageCircleQuestion, PackagePlus, Receipt } from "lucide-react";
import { FullProduct } from "@/lib/data";
import { formatPrice, vatPercent } from "@/lib/utils";
import { siteConfig } from "@/config/site";

/* A row of stars for a 0–5 rating (supports halves). */
function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i)); // 0, 0.5-ish, or 1
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="absolute inset-0 text-grey-300" strokeWidth={1.5} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star size={size} className="text-amber-400 fill-amber-400" strokeWidth={1.5} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

type Section = {
  id: string;
  title: string;
  /** Optional inline content shown next to the title (e.g. rating summary). */
  meta?: React.ReactNode;
  body: React.ReactNode;
};

function AccordionRow({
  section,
  open,
  onToggle,
}: {
  section: Section;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-grey-200">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3 py-5 text-left"
      >
        <h3 className="text-lg font-semibold tracking-tight text-foreground">{section.title}</h3>
        {section.meta && <div className="flex items-center gap-1.5 text-sm text-grey-500">{section.meta}</div>}
        <ChevronDown
          size={22}
          className={`ml-auto shrink-0 text-grey-500 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 pr-8 text-sm leading-relaxed text-grey-600">{section.body}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductAccordion({ product }: { product: FullProduct }) {
  // "About this product" is open by default; everything else starts collapsed.
  const [openId, setOpenId] = useState<string | null>("about");
  const toggle = (id: string) => setOpenId((cur) => (cur === id ? null : id));

  const sections: Section[] = [
    {
      id: "about",
      title: "About this product",
      body: product.description ? (
        <div className="rich-text" dangerouslySetInnerHTML={{ __html: product.description }} />
      ) : (
        <p>Detailed product information is on its way. Get in touch and our team will be happy to help.</p>
      ),
    },
    {
      id: "delivery",
      title: "Delivery & returns",
      body: (
        <ul className="space-y-3">
          <li className="flex gap-3">
            <Truck size={18} className="mt-0.5 shrink-0 text-accent" />
            <span>
              <strong className="font-semibold text-foreground">Fast UK delivery.</strong> Stocked items are
              dispatched quickly with tracked delivery across the UK.
            </span>
          </li>
          <li className="flex gap-3">
            <RotateCcw size={18} className="mt-0.5 shrink-0 text-accent" />
            <span>
              <strong className="font-semibold text-foreground">Easy returns.</strong> Unused items in their
              original packaging can be returned within 30 days of delivery.
            </span>
          </li>
          <li className="flex gap-3">
            <Receipt size={18} className="mt-0.5 shrink-0 text-accent" />
            <span>
              <strong className="font-semibold text-foreground">Pricing.</strong> All prices are shown
              excluding VAT. {vatPercent}% VAT and a flat {formatPrice(siteConfig.shippingFee)} shipping &amp;
              handling charge are added at checkout.
            </span>
          </li>
        </ul>
      ),
    },
    {
      id: "reviews",
      title: "Reviews",
      meta: (
        <>
          <Stars rating={0} />
          <span>No reviews yet</span>
        </>
      ),
      body: (
        <div className="rounded-xl bg-grey-50 p-6 text-center">
          <Stars rating={0} size={20} />
          <p className="mt-3 font-medium text-foreground">No reviews yet</p>
          <p className="mt-1 text-grey-500">Be the first to review {product.name}.</p>
        </div>
      ),
    },
    {
      id: "qa",
      title: "Questions and answers",
      body: (
        <div className="flex flex-col items-center gap-2 rounded-xl bg-grey-50 p-6 text-center">
          <MessageCircleQuestion size={22} className="text-grey-400" />
          <p className="font-medium text-foreground">No questions yet</p>
          <p className="text-grey-500">Have a question about this product? Contact us and we&apos;ll be glad to help.</p>
        </div>
      ),
    },
    {
      id: "fbt",
      title: "Frequently bought together",
      body: (
        <div className="flex flex-col items-center gap-2 rounded-xl bg-grey-50 p-6 text-center">
          <PackagePlus size={22} className="text-grey-400" />
          <p className="text-grey-500">Recommended pairings will appear here soon.</p>
        </div>
      ),
    },
  ];

  return (
    <section className="mt-12 border-t border-grey-200">
      {sections.map((s) => (
        <AccordionRow key={s.id} section={s} open={openId === s.id} onToggle={() => toggle(s.id)} />
      ))}
    </section>
  );
}
