import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

/**
 * Brand story / "Our Story" section. Edit the copy & stats here.
 */
export default function BrandStory() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        {/* Visual */}
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-accent-50 via-grey-100 to-white">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-7xl font-semibold tracking-[0.2em] text-accent/30">LH</span>
            </div>
            {/* Stats card */}
            <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-3 rounded-xl border border-grey-200 bg-white/90 p-4 backdrop-blur sm:right-auto sm:w-auto sm:gap-6">
              <Stat value="10+" label="Years" />
              <Stat value="1000s" label="Orders shipped" />
              <Stat value="UK" label="Based & stocked" />
            </div>
          </div>
        </Reveal>

        {/* Copy */}
        <Reveal delay={0.1}>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Our Story</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Quality linen, trusted by UK businesses
          </h2>
          <div className="mt-5 space-y-4 text-grey-600">
            <p>
              UK Linen House began with a simple goal, to supply hospitality businesses and homes
              with premium linen, towels and workwear at honest prices. From cotton wet towels to
              luxury bath linen, every product is chosen for quality and durability.
            </p>
            <p>
              Today we serve restaurants, hotels, airlines and households across the country, with
              fast dispatch from our UK warehouse and friendly support for every order.
            </p>
          </div>
          <Link
            href="/about"
            className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover"
          >
            More about us
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-lg font-semibold text-foreground">{value}</p>
      <p className="text-[11px] leading-tight text-grey-500">{label}</p>
    </div>
  );
}
