"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Loader2,
  CheckCircle2,
  Tag,
  Phone,
  FileText,
  Truck,
  CreditCard,
  BookOpen,
  ArrowRight,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";

export default function WholesalePage() {
  const [form, setForm] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    password: "",
    message: "",
    businessType: "",
    vatNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/wholesale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setDone(true);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* ---- Hero ---- */}
      <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left: pitch */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-grey-900 px-3 py-1 text-xs font-semibold text-white">
              <Tag size={13} /> Trade &amp; Wholesale
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Wholesale Pricing for Trade Customers
            </h1>
            <p className="mt-4 max-w-md text-grey-600">
              Premium linen, towels and workwear for hospitality and home, at honest trade prices.
              Browse our brochure, then send us a trade enquiry and our team will set you up with a
              tailored wholesale price list.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/brochure"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                <BookOpen size={17} /> View our brochure
              </Link>
              <a
                href="#trade-enquiry"
                className="inline-flex items-center gap-2 rounded-lg border border-grey-300 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-grey-50"
              >
                Trade enquiry <ArrowRight size={16} />
              </a>
            </div>

            <ul className="mt-8 space-y-4">
              <Benefit icon={FileText} title="Full price list" text="Receive our complete wholesale catalogue & pricing." />
              <Benefit
                icon={CreditCard}
                title="30-day credit available"
                text="Established regular trade customers can apply for 30-day credit terms (subject to approval, T&Cs apply)."
              />
              <Benefit icon={Truck} title="Delivered by our own fleet" text="Nationwide UK delivery on trade volumes, shipped with our own fleet." />
              <Benefit icon={Phone} title="Order by phone" text="Place and adjust orders directly with our trade team." />
            </ul>
          </div>

          {/* Right: trade enquiry form / success */}
          <div id="trade-enquiry" className="scroll-mt-24 rounded-2xl border border-grey-200 bg-white p-6 shadow-sm sm:p-8">
            {done ? (
              <div className="flex flex-col items-center py-10 text-center">
                <CheckCircle2 size={48} className="text-green-600" />
                <h2 className="mt-4 text-xl font-semibold text-foreground">Enquiry received</h2>
                <p className="mt-2 max-w-sm text-sm text-grey-500">
                  Thank you. We&apos;ll review your trade enquiry and send your wholesale price list
                  shortly. Our team will be in touch by phone or email.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Trade Enquiry</h2>
                  <p className="mt-1 text-sm text-grey-500">
                    Tell us about your business and we&apos;ll be in touch with trade pricing.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Your name" value={form.name} onChange={(v) => set("name", v)} required />
                  <FormField label="Company name" value={form.companyName} onChange={(v) => set("companyName", v)} required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Email" type="email" value={form.email} onChange={(v) => set("email", v)} required />
                  <FormField label="Phone" value={form.phone} onChange={(v) => set("phone", v)} required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Business type" value={form.businessType} onChange={(v) => set("businessType", v)} placeholder="e.g. Restaurant, Hotel" />
                  <FormField label="VAT number" value={form.vatNumber} onChange={(v) => set("vatNumber", v)} placeholder="Optional" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-grey-700">
                    Your enquiry
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder="Tell us what you're looking for: products, quantities, how often you order, and your delivery location."
                    className="w-full resize-y rounded-lg border border-grey-200 px-3 py-2.5 text-sm outline-none focus:border-foreground"
                  />
                </div>

                <FormField label="Create a password" type="password" value={form.password} onChange={(v) => set("password", v)} required hint="At least 8 characters." />

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground py-3 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Send Trade Enquiry
                </button>
                <p className="text-center text-xs text-grey-400">
                  Trade accounts order by phone. You won&apos;t be charged online.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ---- Own fleet, nationwide delivery ---- */}
      <section className="border-y border-grey-200 bg-grey-50">
        <div className="mx-auto grid max-w-[1400px] items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
          <div className="overflow-hidden rounded-2xl border border-grey-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/fleet-image/uk-linen-house-fleet.png"
              alt="UK Linen House delivery fleet"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent">
              <MapPin size={13} /> Nationwide
            </span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Delivered by our own fleet
            </h2>
            <p className="mt-4 max-w-md text-grey-600">
              We don&apos;t rely on third-party couriers for trade orders. We deliver nationwide with our
              own UK fleet, which means reliable schedules, careful handling and a team that knows your
              business, wherever you are in the country.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-grey-600">
              <li className="flex items-center gap-2"><Truck size={16} className="text-accent" /> Nationwide coverage across the UK</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent" /> Reliable, scheduled trade deliveries</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent" /> Careful handling of bulk linen orders</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---- Brochure promo ---- */}
      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-accent px-6 py-12 text-center text-white sm:px-10">
          <BookOpen size={36} />
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Explore the full 2026 range</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-white/80">
              Browse our complete collection of linen, towels and workwear in our interactive brochure.
              Flip through it just like a real book.
            </p>
          </div>
          <Link
            href="/brochure"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-accent transition-colors hover:bg-grey-100"
          >
            <BookOpen size={17} /> Open the brochure
          </Link>
        </div>
      </section>
    </div>
  );
}

function Benefit({ icon: Icon, title, text }: { icon: React.ElementType; title: string; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-grey-100 text-foreground">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-sm text-grey-500">{text}</p>
      </div>
    </li>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-grey-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-grey-200 px-3 py-2.5 text-sm outline-none focus:border-foreground"
      />
      {hint && <p className="mt-1 text-xs text-grey-400">{hint}</p>}
    </div>
  );
}
