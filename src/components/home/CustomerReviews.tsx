import { Star, Quote } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

/**
 * Customer reviews / social proof section.
 * Edit the reviews and the headline rating here.
 */

const RATING = 4.8;
const REVIEW_COUNT = 1240;

const reviews = [
  {
    name: "Sarah M.",
    role: "Boutique Hotel, Manchester",
    stars: 5,
    text: "Excellent quality towels and lightning-fast delivery. Exactly what our hotel needed, and the team were a pleasure to deal with.",
  },
  {
    name: "James T.",
    role: "Restaurant Group",
    stars: 5,
    text: "We've ordered table linen in bulk three times now, consistent quality every single time. Our go-to supplier.",
  },
  {
    name: "Priya K.",
    role: "Spa & Wellness",
    stars: 5,
    text: "Lovely soft bath linen and a genuinely helpful team. Easy to reorder and great value for the quality.",
  },
  {
    name: "Daniel R.",
    role: "Airbnb Host",
    stars: 5,
    text: "Reliable, well-packaged and arrived next day. The bed linen feels properly premium, guests have noticed.",
  },
];

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < value ? "fill-amber-400 text-amber-400" : "fill-grey-200 text-grey-200"}
        />
      ))}
    </div>
  );
}

export default function CustomerReviews() {
  return (
    <section className="border-y border-grey-200 bg-grey-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Headline rating */}
        <Reveal className="mx-auto mb-8 max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            What Our Customers Say
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Loved by Businesses Across the UK
          </h2>
          <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-grey-200 bg-white px-5 py-2.5 shadow-sm">
            <Stars value={Math.round(RATING)} size={20} />
            <span className="text-base font-bold text-foreground">{RATING.toFixed(1)}/5</span>
            <span className="hidden h-4 w-px bg-grey-200 sm:block" />
            <span className="hidden text-sm text-grey-500 sm:inline">
              {REVIEW_COUNT.toLocaleString()}+ verified reviews
            </span>
          </div>
        </Reveal>

        {/* Review cards — horizontal scroll on mobile, grid from sm up */}
        <div className="no-scrollbar -mx-4 flex snap-x gap-5 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {reviews.map((r, i) => (
            <Reveal
              key={r.name}
              delay={i * 0.08}
              className="flex h-full w-[80%] shrink-0 snap-start flex-col rounded-2xl border border-grey-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:w-auto"
            >
              <Quote size={26} className="text-accent/25" />
              <div className="mt-3">
                <Stars value={r.stars} />
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-grey-700">{r.text}</p>
              <div className="mt-5 border-t border-grey-100 pt-4">
                <p className="text-sm font-semibold text-foreground">{r.name}</p>
                <p className="text-xs text-grey-500">{r.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
