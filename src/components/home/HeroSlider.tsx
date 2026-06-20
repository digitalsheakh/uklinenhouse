"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { heroSlides } from "@/config/slides";

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const count = heroSlides.length;

  const go = useCallback((i: number) => setIndex((i + count) % count), [count]);

  // Auto-advance every 6s
  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(t);
  }, [count]);

  return (
    <div className="relative h-[400px] overflow-hidden rounded-2xl bg-grey-50 shadow-sm ring-1 ring-grey-200 sm:h-[480px] lg:h-[560px]">
      {/* Slides, text on the left, full product image on the right */}
      {heroSlides.map((slide, i) => (
        <div
          key={i}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div className="flex h-full">
            {/* Text, left */}
            <div className="flex w-[52%] flex-col justify-center pl-5 pr-2 sm:w-1/2 sm:pl-10 sm:pr-4 lg:pl-14">
              {slide.label && (
                <span className="mb-2.5 w-fit text-[10px] font-bold uppercase tracking-[0.16em] text-accent sm:mb-3 sm:text-xs">
                  {slide.label}
                </span>
              )}
              <h2 className="text-xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-[3.25rem]">
                {slide.heading}
              </h2>
              {slide.subtext && (
                <p className="mt-2.5 max-w-md text-[11px] leading-relaxed text-grey-600 sm:mt-4 sm:text-base">
                  {slide.subtext}
                </p>
              )}
              <div>
                <Link
                  href={slide.buttonLink}
                  className="mt-4 inline-flex w-fit items-center rounded-lg bg-accent px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-accent-hover sm:mt-7 sm:px-8 sm:py-3.5 sm:text-sm"
                >
                  {slide.buttonText}
                </Link>
              </div>
            </div>

            {/* Image, right (full image, never cropped) */}
            <div className="flex w-[48%] items-center justify-center p-3 sm:w-1/2 sm:p-8">
              <Image
                src={slide.image}
                alt={slide.heading}
                width={900}
                height={900}
                quality={90}
                priority={i === 0}
                sizes="(max-width: 1024px) 48vw, 520px"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Dots */}
      {count > 1 && (
        <div className="absolute bottom-4 left-5 z-20 flex gap-2 sm:bottom-5 sm:left-10 lg:left-14">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-8 bg-accent" : "w-2.5 bg-grey-300 hover:bg-grey-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
