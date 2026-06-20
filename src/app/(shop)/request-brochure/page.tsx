import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import BrochureRequestForm from "@/components/brochure/BrochureRequestForm";
import { BookOpen, Truck, ShieldCheck, Phone } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: `Request Our Brochure | ${siteConfig.name}`,
  description:
    "Request a copy of the UK Linen House product brochure. Enter your details and we will send it straight to you.",
  alternates: { canonical: "/request-brochure" },
};

const perks = [
  { icon: BookOpen,    title: "Full Product Range",      text: "Every product we offer, with specifications and pricing." },
  { icon: Truck,       title: "Fast UK Delivery",        text: "Nationwide dispatch from our Bedford warehouse." },
  { icon: ShieldCheck, title: "Trade & Wholesale",       text: "Competitive pricing for hospitality businesses." },
  { icon: Phone,       title: "Dedicated Support",       text: "Our team is on hand to help with any enquiry." },
];

export default function RequestBrochurePage() {
  return (
    <div className="bg-grey-50 min-h-screen">

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-accent">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Text */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Free · No obligation
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Request Our <br className="hidden sm:block" />Product Brochure
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/80">
              Get our full product catalogue sent directly to you, featuring our complete range of
              premium linen, towels, workwear and bags. Trusted by hotels, restaurants and
              hospitality businesses across the UK.
            </p>
            <ul className="mt-6 space-y-2">
              {["Wet towels, bath & bed linen", "Table linen & kitchen textiles",
                "Chef jackets, coats & aprons", "Bags & packaging"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-white/80">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Brochure cover mock */}
          <div className="mt-10 flex justify-center lg:mt-0">
            <div className="relative w-64 sm:w-72">
              <div className="absolute -inset-3 rotate-2 rounded-2xl bg-white/10" />
              <div className="absolute -inset-3 -rotate-1 rounded-2xl bg-white/5" />
              <div className="relative overflow-hidden rounded-2xl border-2 border-white/20 bg-white shadow-2xl">
                <Image
                  src="/linen-house-logo.png"
                  alt="UK Linen House brochure"
                  width={480}
                  height={320}
                  className="h-auto w-full object-contain p-8"
                />
                <div className="bg-accent px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/60">
                    UK Linen House
                  </p>
                  <p className="mt-0.5 text-lg font-semibold text-white">
                    Product Brochure 2026
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-accent shadow-lg whitespace-nowrap">
                Free to request
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Perks strip ─────────────────────────────────────────────────── */}
      <section className="border-b border-grey-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-grey-200 sm:grid-cols-4">
          {perks.map((p) => (
            <div key={p.title} className="flex items-start gap-3 bg-white px-5 py-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent">
                <p.icon size={17} />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{p.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-grey-500">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Form ────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_480px]">

          {/* Left: intro */}
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Complete your details
            </h2>
            <p className="mt-3 text-grey-600">
              Fill in the form and we will send you a copy of our brochure. We typically respond
              within one working day.
            </p>

            <div className="mt-8 space-y-5 text-sm text-grey-600">
              <div className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">1</span>
                <div>
                  <p className="font-semibold text-foreground">Submit your details</p>
                  <p className="mt-0.5">Tell us who you are and where you would like the brochure sent.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">2</span>
                <div>
                  <p className="font-semibold text-foreground">We process your request</p>
                  <p className="mt-0.5">Our team reviews your request and prepares your brochure.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">3</span>
                <div>
                  <p className="font-semibold text-foreground">Receive your brochure</p>
                  <p className="mt-0.5">We will email it to you within one working day.</p>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-grey-200 bg-white p-5">
              <p className="text-sm font-semibold text-foreground">Prefer to speak with us?</p>
              <p className="mt-1 text-sm text-grey-500">
                Call us on{" "}
                <a href={`tel:${siteConfig.phone}`} className="font-medium text-accent hover:underline">
                  {siteConfig.phone}
                </a>{" "}
                or email{" "}
                <a href={`mailto:${siteConfig.email}`} className="font-medium text-accent hover:underline">
                  {siteConfig.email}
                </a>
              </p>
            </div>
          </div>

          {/* Right: form */}
          <BrochureRequestForm />
        </div>
      </section>
    </div>
  );
}
