"use client";

import { useState } from "react";
import toast from "react-hot-toast";

/**
 * "Join our mailing list" newsletter band.
 * On submit it validates the email and confirms with a toast.
 * Wire `onSubmit` to a real endpoint (e.g. /api/newsletter) when ready.
 */

const IMG = "/slider-image/uk-linen-house-bed-linen-image1.png";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      // TODO: connect to a real newsletter endpoint.
      await new Promise((r) => setTimeout(r, 500));
      toast.success("Thanks for subscribing! Check your inbox soon.");
      setEmail("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="grid overflow-hidden rounded-2xl border border-grey-200 bg-white shadow-sm lg:grid-cols-2">
        {/* Image */}
        <div className="relative min-h-[140px] lg:min-h-[240px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMG} alt="Premium hotel bed linen" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent lg:bg-gradient-to-r" />
        </div>

        {/* Form */}
        <div className="flex flex-col justify-center p-6 sm:p-9">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Newsletter</span>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Join Our Mailing List
          </h2>
          <p className="mt-2 max-w-md text-sm text-grey-600">
            Our latest offers, advice and new arrivals, straight to your inbox.
          </p>
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              aria-label="Email address"
              className="flex-1 rounded-lg border border-grey-300 px-4 py-3.5 text-sm outline-none transition-colors focus:border-accent"
            />
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-accent px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
            >
              {submitting ? "Signing up" : "Sign Me Up"}
            </button>
          </form>
          <p className="mt-3 text-xs text-grey-400">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  );
}
