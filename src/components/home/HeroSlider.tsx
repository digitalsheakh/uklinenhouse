"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { heroSlides } from "@/config/slides";

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const count = heroSlides.length;

  const go = useCallback((i: number) => setIndex((i + count) % count), [count]);
  const next = useCallback(() => go(index + 1), [go, index]);

  // Auto-advance every 6s
  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(t);
  }, [count]);

  const slide = heroSlides[index];

  return (
    <div className="relative h-[320px] overflow-hidden rounded-xl bg-grey-100 sm:h-[400px] lg:h-[460px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background: image if provided, else grey gradient */}
          {slide.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={slide.image} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-grey-200 via-grey-100 to-white" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 z-10 flex max-w-xl flex-col justify-center px-8 sm:px-12 lg:px-16">
            {slide.label && (
              <span className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-grey-500">
                {slide.label}
              </span>
            )}
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {slide.heading}
            </h2>
            {slide.subtext && (
              <p className="mt-4 max-w-md text-sm text-grey-600 sm:text-base">{slide.subtext}</p>
            )}
            <div>
              <Link
                href={slide.buttonLink}
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                {slide.buttonText}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      {count > 1 && (
        <>
          <button
            onClick={() => go(index - 1)}
            className="absolute left-3 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/80 p-2 text-foreground shadow-sm backdrop-blur hover:bg-white sm:flex"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/80 p-2 text-foreground shadow-sm backdrop-blur hover:bg-white sm:flex"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots */}
      {count > 1 && (
        <div className="absolute bottom-4 left-8 flex gap-2 sm:left-12 lg:left-16">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-7 bg-foreground" : "w-3 bg-grey-400 hover:bg-grey-500"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
