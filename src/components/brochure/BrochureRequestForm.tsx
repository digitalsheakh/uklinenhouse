"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

interface FormState {
  name: string;
  email: string;
  phone: string;
  customerType: "business" | "personal";
  companyName: string;
  streetAddress: string;
  city: string;
  postcode: string;
  deliveryMethod: "email" | "post";
  callBack: "yes" | "no";
  newsletter: boolean;
}

const INIT: FormState = {
  name: "", email: "", phone: "",
  customerType: "business", companyName: "",
  streetAddress: "", city: "", postcode: "",
  deliveryMethod: "email", callBack: "no", newsletter: false,
};

export default function BrochureRequestForm() {
  const [form, setForm]     = useState<FormState>(INIT);
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);

  const str = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Please enter your name."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address."); return;
    }
    if (form.customerType === "business" && !form.companyName.trim()) {
      toast.error("Please enter your company name."); return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/brochure-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName:   form.name.split(" ")[0] || form.name,
          lastName:    form.name.split(" ").slice(1).join(" ") || "-",
          companyName: form.companyName || "Personal",
          jobTitle:    "",
          email:       form.email,
          phone:       form.phone,
          address:     form.streetAddress,
          city:        form.city,
          postcode:    form.postcode,
          message: [
            `Customer type: ${form.customerType}`,
            `Delivery: ${form.deliveryMethod}`,
            `Call back: ${form.callBack}`,
            `Newsletter: ${form.newsletter ? "yes" : "no"}`,
          ].join(" | "),
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Something went wrong."); return; }
      setDone(true);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ── Success state ─────────────────────────────────────────────────────── */
  if (done) {
    return (
      <div className="py-12 text-center">
        <CheckCircle2 size={40} className="mx-auto text-green-500" />
        <p className="mt-4 text-lg font-semibold text-foreground">
          Thank you, {form.name.split(" ")[0]}!
        </p>
        <p className="mt-2 text-sm text-grey-600">
          We have received your request and will send your brochure to{" "}
          <strong>{form.email}</strong> within one working day.
        </p>
        <button
          onClick={() => { setForm(INIT); setDone(false); }}
          className="mt-6 text-sm font-medium text-accent hover:underline"
        >
          Submit another request
        </button>
      </div>
    );
  }

  /* ── Form ──────────────────────────────────────────────────────────────── */
  return (
    <form onSubmit={submit} noValidate className="space-y-6">

      {/* Contact */}
      <div className="space-y-4">
        <Field label="Name" required>
          <input type="text" value={form.name} onChange={str("name")}
            autoComplete="name" placeholder="Your full name"
            required className={inp} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="E-mail" required>
            <input type="email" value={form.email} onChange={str("email")}
              autoComplete="email" placeholder="you@company.co.uk"
              required className={inp} />
          </Field>
          <Field label="Phone">
            <input type="tel" value={form.phone} onChange={str("phone")}
              autoComplete="tel" placeholder="+44 1234 567890"
              className={inp} />
          </Field>
        </div>
      </div>

      <Divider />

      {/* Customer type */}
      <Field label="Customer Type" required>
        <div className="flex gap-6 pt-0.5">
          <RadioOpt name="customerType" value="business"
            checked={form.customerType === "business"}
            onChange={() => setForm(f => ({ ...f, customerType: "business" }))}
            label="Business" />
          <RadioOpt name="customerType" value="personal"
            checked={form.customerType === "personal"}
            onChange={() => setForm(f => ({ ...f, customerType: "personal", deliveryMethod: "email" }))}
            label="Personal" />
        </div>
      </Field>

      {/* Company name — business only */}
      {form.customerType === "business" && (
        <Field label="Company Name" required>
          <input type="text" value={form.companyName} onChange={str("companyName")}
            autoComplete="organization" placeholder="e.g. The Grand Hotel"
            required className={inp} />
        </Field>
      )}

      <Divider />

      {/* Address */}
      <Field label="Street Address">
        <input type="text" value={form.streetAddress} onChange={str("streetAddress")}
          autoComplete="street-address" placeholder="123 High Street"
          className={inp} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Town / City">
          <input type="text" value={form.city} onChange={str("city")}
            autoComplete="address-level2" placeholder="Bedford"
            className={inp} />
        </Field>
        <Field label="Post Code">
          <input type="text" value={form.postcode} onChange={str("postcode")}
            autoComplete="postal-code" placeholder="MK41 7BJ"
            className={inp} />
        </Field>
      </div>

      <Divider />

      {/* Delivery method */}
      <Field label="Receive brochure via" required>
        <div className="flex gap-6 pt-0.5">
          <RadioOpt name="delivery" value="email"
            checked={form.deliveryMethod === "email"}
            onChange={() => setForm(f => ({ ...f, deliveryMethod: "email" }))}
            label="Email" />
          {form.customerType === "business" && (
            <RadioOpt name="delivery" value="post"
              checked={form.deliveryMethod === "post"}
              onChange={() => setForm(f => ({ ...f, deliveryMethod: "post" }))}
              label="Post" />
          )}
        </div>
      </Field>

      {/* Call back */}
      <Field label="Would you like a call back?">
        <div className="flex gap-6 pt-0.5">
          <RadioOpt name="callback" value="yes"
            checked={form.callBack === "yes"}
            onChange={() => setForm(f => ({ ...f, callBack: "yes" }))}
            label="Yes" />
          <RadioOpt name="callback" value="no"
            checked={form.callBack === "no"}
            onChange={() => setForm(f => ({ ...f, callBack: "no" }))}
            label="No" />
        </div>
      </Field>

      {/* Newsletter */}
      <label className="flex cursor-pointer items-center gap-2.5 select-none">
        <input
          type="checkbox"
          checked={form.newsletter}
          onChange={e => setForm(f => ({ ...f, newsletter: e.target.checked }))}
          className="h-4 w-4 rounded border-grey-300 accent-accent"
        />
        <span className="text-sm text-foreground">Sign Up for Newsletter</span>
      </label>

      {/* Submit */}
      <div className="border-t border-grey-200 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-accent px-10 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Submitting…
            </span>
          ) : "Submit"}
        </button>
      </div>

    </form>
  );
}

/* ── helpers ─────────────────────────────────────────────────────────────── */

const inp =
  "w-full rounded-md border border-grey-300 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-grey-400 focus:border-accent focus:ring-1 focus:ring-accent/20";

function Divider() {
  return <hr className="border-grey-200" />;
}

function Field({
  label, required, children,
}: {
  label: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </p>
      {children}
    </div>
  );
}

function RadioOpt({
  name, value, checked, onChange, label,
}: {
  name: string; value: string; checked: boolean; onChange: () => void; label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 select-none">
      <input
        type="radio" name={name} value={value} checked={checked} onChange={onChange}
        className="h-4 w-4 accent-accent"
      />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );
}
