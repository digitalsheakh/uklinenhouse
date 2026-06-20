import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

/**
 * "Our Story" homepage section: a section intro plus three cards that
 * lead to dedicated pages (Story, Sustainability, Values).
 */

const cards = [
  {
    image: "/About%20Us%20Images/uk-linen-house-about-us-image.png",
    eyebrow: "Since 2013",
    title: "Our Heritage",
    text: "A family-run British supplier of premium bath, bed and table linen to hotels, restaurants and homes nationwide.",
    href: "/about",
    cta: "Our Story",
  },
  {
    image: "/About%20Us%20Images/uk-linen-house-cotton-tree.png",
    eyebrow: "Ethical & Responsible",
    title: "Sustainability",
    text: "Responsibly sourced cotton and durable products, designed to last and reduce waste across the supply chain.",
    href: "/sustainability",
    cta: "Our Sustainability",
  },
  {
    image: "/category-image/linen-house-bath-linen-image.png",
    eyebrow: "Built to Last",
    title: "Quality & Consistency",
    text: "Carefully crafted linen made for the rigours of hospitality use, with easy laundering and lasting durability.",
    href: "/values",
    cta: "Our Values",
  },
];

export default function OurStory() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <Reveal className="mx-auto mb-8 max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          About UK Linen House
        </span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Trusted British Linen, Since 2013
        </h2>
        <p className="mt-4 text-base leading-relaxed text-grey-600">
          A family-run business built on quality products, honest pricing and dependable service,
          delivered nationwide from our base in Bedford.
        </p>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.1}>
            <Link
              href={c.href}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-grey-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-grey-300 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-grey-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image}
                  alt={c.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-grey-400">
                  {c.eyebrow}
                </span>
                <h3 className="mt-1.5 text-lg font-bold tracking-tight text-foreground">{c.title}</h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-grey-600">{c.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  {c.cta}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
