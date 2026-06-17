"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Tag, Phone, FileText, Truck } from "lucide-react";
import toast from "react-hot-toast";

export default function WholesalePage() {
  const [form, setForm] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    password: "",
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
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Left: pitch */}
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-grey-900 px-3 py-1 text-xs font-semibold text-white">
            <Tag size={13} /> Trade & Wholesale
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Wholesale Pricing for Trade Customers
          </h1>
          <p className="mt-4 max-w-md text-grey-600">
            Register for a trade account and we&apos;ll send you our full wholesale price list.
            Trade orders are placed over the phone with our team — quick, personal, and tailored
            to your volume.
          </p>

          <ul className="mt-8 space-y-4">
            <Benefit icon={FileText} title="Full price list" text="Receive our complete wholesale catalogue & pricing." />
            <Benefit icon={Phone} title="Order by phone" text="Place and adjust orders directly with our trade team." />
            <Benefit icon={Truck} title="Bulk delivery" text="Nationwide UK delivery on trade volumes." />
          </ul>
        </div>

        {/* Right: form / success */}
        <div className="rounded-2xl border border-grey-200 bg-white p-6 shadow-sm sm:p-8">
          {done ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 size={48} className="text-green-600" />
              <h2 className="mt-4 text-xl font-semibold text-foreground">Application received</h2>
              <p className="mt-2 max-w-sm text-sm text-grey-500">
                Thank you. We&apos;ll review your trade account and send your wholesale price list
                shortly. Our team will be in touch by phone or email.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Apply for a trade account</h2>

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
              <FormField label="Create a password" type="password" value={form.password} onChange={(v) => set("password", v)} required hint="At least 8 characters." />

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground py-3 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Request Wholesale Pricing
              </button>
              <p className="text-center text-xs text-grey-400">
                Trade accounts order by phone — you won&apos;t be charged online.
              </p>
            </form>
          )}
        </div>
      </div>
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
