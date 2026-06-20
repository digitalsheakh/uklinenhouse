import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Leaf, Recycle, HeartHandshake, Sprout } from "lucide-react";
import { siteConfig } from "@/config/site";

const description =
  "Sustainability at UK Linen House, responsible cotton sourcing, ethical partnerships and durable products designed to last, reducing waste across the hospitality supply chain.";

export const metadata: Metadata = {
  title: "Our Sustainability | UK Linen House",
  description,
  alternates: { canonical: "/sustainability" },
  openGraph: { title: "Our Sustainability, UK Linen House", description, type: "website" },
};

const IMG = {
  hero: "/About%20Us%20Images/uk-linen-house-cotton-tree.png",
  detail: "/About%20Us%20Images/uk-linen-house-about-images.png",
};

const principles = [
  { icon: Sprout, title: "Responsible Sourcing", text: "We work with mills and partners who share our standards for quality cotton and fair, transparent practices." },
  { icon: Recycle, title: "Built to Last", text: "Durable linen that withstands commercial laundering means fewer replacements, and far less waste over time." },
  { icon: HeartHandshake, title: "Ethical Partnerships", text: "Long-term relationships with suppliers who treat their people and the environment with respect." },
  { icon: Leaf, title: "Mindful Packaging", text: "We keep packaging practical and minimal, and continually look for greener alternatives." },
];

export default function SustainabilityPage() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent">
              Our Sustainability
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Sustainable. Ethical. Responsible.
            </h1>
            <p className="mt-5 max-w-xl text-grey-600">
              We actively champion high ethical standards and rigorous principles throughout our supply
              chain and partnerships. From the cotton we source to the products we ship, we aim to do
              right by our customers, our partners and the planet.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/shop" className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover">
                Shop the range <ArrowRight size={16} />
              </Link>
              <Link href="/about" className="inline-flex items-center gap-2 rounded-lg border border-grey-300 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-grey-50">
                Our Story
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-grey-200 bg-[#f3f1ee]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG.hero} alt="Cotton, the heart of our products" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-y border-grey-200 bg-grey-50">
        <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {principles.map((p) => (
            <div key={p.title} className="rounded-2xl border border-grey-200 bg-white p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-50 text-accent">
                <p.icon size={22} />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-grey-600">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Detail */}
      <section>
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
          <div className="overflow-hidden rounded-3xl border border-grey-200 bg-[#f3f1ee]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG.detail} alt="UK Linen House quality products" className="h-full w-full object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Quality is the first step to sustainability
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed text-grey-600">
              <p>
                The most sustainable product is one that doesn&apos;t need replacing. That&apos;s why every item
                we supply is chosen for durability first, linen that holds up to the demands of busy
                hotels, restaurants and spas, wash after wash.
              </p>
              <p>
                By helping our customers buy better and buy less often, we reduce waste across the whole
                hospitality supply chain, and that&apos;s a standard we&apos;ll keep raising.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-6">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-accent px-6 py-12 text-center text-white sm:px-10">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Partner with a supplier that cares</h2>
          <p className="mx-auto max-w-lg text-sm text-white/80">
            Talk to us about quality linen, sourced responsibly and delivered nationwide.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-accent transition-colors hover:bg-grey-100">
            Contact us <ArrowRight size={16} />
          </Link>
        </div>
        <p className="mt-8 text-center text-xs text-grey-400">
          {siteConfig.name} · Family run business established 2013 · Bedford, Bedfordshire
        </p>
      </section>
    </div>
  );
}
