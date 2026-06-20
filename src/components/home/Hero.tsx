"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-grey-50">
      {/* Soft grey gradient backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-grey-50 to-white" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block rounded-full border border-grey-200 bg-white px-4 py-1.5 text-xs font-medium tracking-wide text-grey-600"
          >
            Trusted UK Linen & Towel Supplier
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Premium Linen, Towels
            <br />
            <span className="text-grey-400">& Workwear</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mx-auto mt-6 max-w-xl text-base text-grey-500 sm:text-lg"
          >
            Quality cotton wet towels, table & bath linen, bags and more, supplied
            to hospitality businesses and homes across the UK.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              Shop All Products
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-grey-300 bg-white px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-grey-50"
            >
              Trade Enquiries
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
