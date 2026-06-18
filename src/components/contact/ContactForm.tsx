"use client";

import { useState } from "react";
import { MessageCircle, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { siteConfig } from "@/config/site";

/**
 * Contact form that lets visitors write a message and send it straight to us,
 * either via WhatsApp (opens a chat with the message pre-filled) or email.
 * No server needed: the message goes directly to our own channels.
 */
export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function compose() {
    const lines = [
      "Hi UK Linen House, I'd like to enquire.",
      "",
      form.name && `Name: ${form.name}`,
      form.email && `Email: ${form.email}`,
      form.phone && `Phone: ${form.phone}`,
      form.message && `Message: ${form.message}`,
    ].filter(Boolean);
    return lines.join("\n");
  }

  function valid() {
    if (!form.name.trim() || !form.message.trim()) {
      toast.error("Please add your name and a message.");
      return false;
    }
    return true;
  }

  function sendWhatsApp(e: React.FormEvent) {
    e.preventDefault();
    if (!valid()) return;
    const url = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(compose())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function sendEmail() {
    if (!valid()) return;
    const subject = `Enquiry from ${form.name}`;
    const url = `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(compose())}`;
    window.location.href = url;
  }

  return (
    <form onSubmit={sendWhatsApp} className="rounded-2xl border border-grey-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-lg font-semibold text-foreground">Send us a message</h2>
      <p className="mt-1 text-sm text-grey-500">
        Tell us what you need and we&apos;ll get straight back to you.
      </p>

      <div className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name" value={form.name} onChange={(v) => set("name", v)} required />
          <Field label="Email" type="email" value={form.email} onChange={(v) => set("email", v)} />
        </div>
        <Field label="Phone (optional)" value={form.phone} onChange={(v) => set("phone", v)} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-grey-700">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="Tell us about your business and what you're looking for (e.g. towels for a hotel, linen for a laundry, workwear for staff)…"
            className="w-full resize-y rounded-lg border border-grey-200 px-3 py-2.5 text-sm outline-none focus:border-foreground"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <MessageCircle size={17} /> Send via WhatsApp
        </button>
        <button
          type="button"
          onClick={sendEmail}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-grey-300 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-grey-50"
        >
          <Mail size={17} /> Send by email
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
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
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-grey-200 px-3 py-2.5 text-sm outline-none focus:border-foreground"
      />
    </div>
  );
}
