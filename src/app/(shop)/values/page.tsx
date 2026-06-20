import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, Sparkles, Users, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";

const description =
  "Our values at UK Linen House, quality and consistency, honest pricing, dependable service and genuine care for every customer, from single sites to national groups.";

export const metadata: Metadata = {
  title: "Our Values | UK Linen House",
  description,
  alternates: { canonical: "/values" },
  openGraph: { title: "Our Values, UK Linen House", description, type: "website" },
};

const IMG = {
  hero: "/category-image/linen-house-bath-linen-image.png",
  detail: "/fleet-image/uk-linen-house-fleet.png",
};

const values = [
  { icon: Award, title: "Quality First", text: "Every product is selected for durability and finish, designed for the rigours of daily hospitality use." },
  { icon: Sparkles, title: "Consistency", text: "Reorder with confidence: the linen you receive today matches what you bought last year." },
  { icon: Users, title: "Customer Focused", text: "From owner-operators to national groups, we tailor our service around what your business actually needs." },
  { icon: ShieldCheck, title: "Honest & Dependable", text: "Fair pricing, clear communication and reliable nationwide delivery, no surprises." },
];

export default function ValuesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent">
              Our Values
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Quality &amp; Consistency, in everything we do
            </h1>
            <p className="mt-5 max-w-xl text-grey-600">
              Our carefully crafted linen is designed for the rigours of hotel use, with ease of
              laundering and longevity as key features. But great products are only half the story,               the way we work matters just as much.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/shop" className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover">
                Shop the range <ArrowRight size={16} />
              </Link>
              <Link href="/sustainability" className="inline-flex items-center gap-2 rounded-lg border border-grey-300 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-grey-50">
                Our Sustainability
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-grey-200 bg-[#f3f1ee]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG.hero} alt="Premium bath linen by UK Linen House" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Values grid */}
      <section className="border-y border-grey-200 bg-grey-50">
        <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-grey-200 bg-white p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-50 text-accent">
                <v.icon size={22} />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-grey-600">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Detail */}
      <section>
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
          <div className="lg:order-2 overflow-hidden rounded-3xl border border-grey-200 bg-[#f3f1ee]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG.detail} alt="UK Linen House nationwide delivery" className="h-full w-full object-cover" />
          </div>
          <div className="lg:order-1">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Service you can build a business on
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed text-grey-600">
              <p>
                Since 2013 we&apos;ve grown by doing the simple things well, answering the phone, packing
                orders properly and delivering on time. Our customers stay with us because they know
                exactly what to expect, every single order.
              </p>
              <p>
                Whether you run a single guesthouse or a multinational group, you get the same care, the
                same quality and the same straightforward pricing. That&apos;s a promise we don&apos;t compromise on.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-6">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-accent px-6 py-12 text-center text-white sm:px-10">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Experience the difference</h2>
          <p className="mx-auto max-w-lg text-sm text-white/80">
            Quality linen, honest service and nationwide delivery, let&apos;s work together.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/wholesale" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-accent transition-colors hover:bg-grey-100">
              Trade enquiry <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
              Contact us
            </Link>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-grey-400">
          {siteConfig.name} · Family run business established 2013 · Bedford, Bedfordshire
        </p>
      </section>
    </div>
  );
}
