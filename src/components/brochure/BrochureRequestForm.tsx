"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

interface FormState {
  firstName: string;
  lastName: string;
  companyName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  message: string;
}

const EMPTY: FormState = {
  firstName: "", lastName: "", companyName: "", jobTitle: "",
  email: "", phone: "", address: "", city: "", postcode: "", message: "",
};

export default function BrochureRequestForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    // Basic client validation
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("Please enter your full name."); return;
    }
    if (!form.companyName.trim()) {
      toast.error("Please enter your company name."); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address."); return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/brochure-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Something went wrong."); return; }
      setSubmitted(true);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Success screen
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-grey-200 bg-white p-10 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
          <CheckCircle2 size={36} />
        </div>
        <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
          Request received!
        </h3>
        <p className="mx-auto mt-3 max-w-xs text-sm text-grey-600">
          Thank you, <strong>{form.firstName}</strong>. We will send your brochure to{" "}
          <span className="font-medium text-foreground">{form.email}</span> within one working day.
        </p>
        <button
          type="button"
          onClick={() => { setForm(EMPTY); setSubmitted(false); }}
          className="mt-6 text-sm font-medium text-accent hover:underline"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-grey-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="mb-6 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-50 text-accent">
          <BookOpen size={17} />
        </span>
        <h3 className="text-base font-semibold text-foreground">Your Details</h3>
      </div>

      <div className="space-y-4">
        {/* Name row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First Name" required>
            <input
              type="text" value={form.firstName} onChange={set("firstName")}
              placeholder="John" autoComplete="given-name" required
              className={inputClass}
            />
          </Field>
          <Field label="Last Name" required>
            <input
              type="text" value={form.lastName} onChange={set("lastName")}
              placeholder="Smith" autoComplete="family-name" required
              className={inputClass}
            />
          </Field>
        </div>

        {/* Company + job title */}
        <Field label="Company Name" required>
          <input
            type="text" value={form.companyName} onChange={set("companyName")}
            placeholder="e.g. The Grand Hotel" autoComplete="organization" required
            className={inputClass}
          />
        </Field>
        <Field label="Job Title" hint="Optional">
          <input
            type="text" value={form.jobTitle} onChange={set("jobTitle")}
            placeholder="e.g. Purchasing Manager" autoComplete="organization-title"
            className={inputClass}
          />
        </Field>

        <div className="border-t border-grey-100 pt-2" />

        {/* Contact */}
        <Field label="Email Address" required>
          <input
            type="email" value={form.email} onChange={set("email")}
            placeholder="john@company.co.uk" autoComplete="email" required
            className={inputClass}
          />
        </Field>
        <Field label="Phone Number" hint="Optional">
          <input
            type="tel" value={form.phone} onChange={set("phone")}
            placeholder="+44 1234 567890" autoComplete="tel"
            className={inputClass}
          />
        </Field>

        <div className="border-t border-grey-100 pt-2" />

        {/* Address */}
        <Field label="Address" hint="Optional — so we can post a hard copy">
          <input
            type="text" value={form.address} onChange={set("address")}
            placeholder="123 High Street" autoComplete="street-address"
            className={inputClass}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Town / City" hint="Optional">
            <input
              type="text" value={form.city} onChange={set("city")}
              placeholder="Bedford" autoComplete="address-level2"
              className={inputClass}
            />
          </Field>
          <Field label="Postcode" hint="Optional">
            <input
              type="text" value={form.postcode} onChange={set("postcode")}
              placeholder="MK41 7BJ" autoComplete="postal-code"
              className={inputClass}
            />
          </Field>
        </div>

        <div className="border-t border-grey-100 pt-2" />

        {/* Message */}
        <Field label="Anything else you'd like to tell us?" hint="Optional">
          <textarea
            value={form.message} onChange={set("message")}
            placeholder="e.g. interested in bulk pricing for towels…"
            rows={3} maxLength={1000}
            className={`${inputClass} resize-none`}
          />
          <p className="mt-1 text-right text-xs text-grey-400">{form.message.length}/1000</p>
        </Field>

        {/* Privacy */}
        <p className="text-xs text-grey-400">
          Your information is used only to process this brochure request and will not be sold
          to third parties. See our{" "}
          <a href="/privacy-policy" className="underline hover:text-foreground">privacy policy</a>.
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> Sending request…</>
          ) : (
            <><BookOpen size={16} /> Request Your Brochure</>
          )}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-grey-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent placeholder:text-grey-400";

function Field({
  label, hint, required, children,
}: {
  label: string; hint?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline gap-1.5">
        <span className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-0.5 text-red-500"> *</span>}
        </span>
        {hint && <span className="text-xs text-grey-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
