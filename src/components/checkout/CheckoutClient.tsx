"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Lock, ShoppingBag, ShieldCheck, MapPin, Search, WifiOff } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice, vatPercent } from "@/lib/utils";

export interface InitialCustomer {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postcode?: string;
  country?: string;
}

export default function CheckoutClient({ initial }: { initial: InitialCustomer }) {
  const params = useSearchParams();
  const { items, subtotal, vat, shipping, total } = useCart();
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState(true);

  const [form, setForm] = useState({
    name: initial.name || "",
    email: initial.email || "",
    phone: initial.phone || "",
    address: initial.address || "",
    city: initial.city || "",
    postcode: initial.postcode || "",
    country: initial.country || "United Kingdom",
  });

  // Rehydrate the persisted cart after mount (store uses skipHydration).
  useEffect(() => {
    useCart.persist.rehydrate();
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (params.get("canceled")) {
      toast("Payment canceled — your cart is saved.", { icon: "🛈" });
    }
  }, [params]);

  // Track connectivity so we can warn before the customer tries to pay.
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || items.length === 0) return;

    // Don't even try if the browser knows it's offline.
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      toast.error("You appear to be offline. Reconnect to the internet and try again.");
      return;
    }

    setLoading(true);

    // Abort the request if the network hangs, so the button never sticks.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          customer: form,
        }),
      });

      // Parse defensively — a proxy/error page may not return JSON.
      let data: { url?: string; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        /* non-JSON response */
      }

      if (!res.ok || !data.url) {
        if (res.status === 503) {
          toast.error(data.error || "Online payments are temporarily unavailable. Please try again shortly or contact us.");
        } else if (res.status === 400) {
          toast.error(data.error || "Please check your details and your cart, then try again.");
        } else {
          toast.error(data.error || "We couldn't start checkout. Please try again.");
        }
        setLoading(false);
        return;
      }

      // Success — hand off to Stripe's hosted, PCI-compliant payment page.
      // We intentionally leave `loading` on; the page is navigating away.
      window.location.assign(data.url);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        toast.error("The request timed out. Check your connection and try again — you won't be charged twice.");
      } else if (typeof navigator !== "undefined" && !navigator.onLine) {
        toast.error("Connection lost. Your cart is saved — reconnect and try again.");
      } else {
        toast.error("Network error. Your cart is saved — please try again.");
      }
      setLoading(false);
    } finally {
      clearTimeout(timeout);
    }
  }

  // Avoid a hydration flash: show a light placeholder until the cart loads.
  if (!hydrated) {
    return (
      <div className="mx-auto flex max-w-md items-center justify-center px-4 py-24 text-grey-400">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <ShoppingBag size={40} className="mx-auto text-grey-300" />
        <h1 className="mt-4 text-2xl font-semibold text-foreground">Your cart is empty</h1>
        <p className="mt-2 text-sm text-grey-500">Add some products before checking out.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-grey-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Checkout</h1>
        <p className="mt-2 text-sm text-grey-500">
          Enter your details and pay securely with card. You&apos;ll be taken to our payment partner Stripe.
        </p>

        <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* ---- Details ---- */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-grey-200 bg-white p-6">
              <h2 className="text-base font-semibold text-foreground">Contact details</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Full name" value={form.name} onChange={set("name")} autoComplete="name" required />
                <Field label="Email" type="email" value={form.email} onChange={set("email")} autoComplete="email" required />
                <Field label="Phone" value={form.phone} onChange={set("phone")} autoComplete="tel" required />
              </div>
            </section>

            <section className="rounded-2xl border border-grey-200 bg-white p-6">
              <h2 className="text-base font-semibold text-foreground">Delivery address</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Address" value={form.address} onChange={set("address")} autoComplete="street-address" required />
                </div>
                <Field label="Town / City" value={form.city} onChange={set("city")} autoComplete="address-level2" required />
                <PostcodeField
                  value={form.postcode}
                  onChange={(v) => setForm((f) => ({ ...f, postcode: v }))}
                  onResolved={({ city, country }) =>
                    setForm((f) => ({
                      ...f,
                      city: city || f.city,
                      country: country || f.country,
                    }))
                  }
                />
                <Field label="Country" value={form.country} onChange={set("country")} autoComplete="country-name" required />
              </div>
            </section>
          </div>

          {/* ---- Order summary ---- */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-grey-200 bg-white p-6">
              <h2 className="text-base font-semibold text-foreground">Order summary</h2>

              <ul className="mt-4 divide-y divide-grey-100">
                {items.map((i) => (
                  <li key={`${i.productId}-${i.variantId || ""}`} className="flex gap-3 py-3">
                    <div className="relative shrink-0">
                      <div className="h-14 w-14 overflow-hidden rounded-lg border border-grey-200 bg-grey-100">
                        {i.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-grey-300">
                            <ShoppingBag size={16} />
                          </span>
                        )}
                      </div>
                      <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-semibold text-white ring-2 ring-white">
                        {i.quantity}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-medium leading-snug text-foreground">{i.name}</span>
                      {i.variantLabel && <span className="text-xs text-grey-400">{i.variantLabel}</span>}
                    </div>
                    <span className="text-sm text-grey-600">{formatPrice(i.price * i.quantity)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 space-y-1.5 border-t border-grey-200 pt-4">
                <Row label="Subtotal (ex VAT)" value={formatPrice(subtotal())} />
                <Row label={`VAT (${vatPercent}%)`} value={formatPrice(vat())} />
                <Row label="Shipping & handling" value={formatPrice(shipping())} />
                <div className="flex items-center justify-between border-t border-grey-200 pt-2 text-base font-semibold text-foreground">
                  <span>Total</span>
                  <span>{formatPrice(total())}</span>
                </div>
              </div>

              {!online && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-xs font-medium text-amber-700">
                  <WifiOff size={14} /> You&apos;re offline. Reconnect to complete your payment.
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !online}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                {loading ? "Redirecting to secure payment…" : `Pay ${formatPrice(total())}`}
              </button>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-grey-400">
                <ShieldCheck size={14} /> Secure card payment via Stripe
              </p>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  required,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        className="w-full rounded-lg border border-grey-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent"
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm text-grey-500">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

/**
 * UK postcode field with free type-ahead suggestions (postcodes.io — no API
 * key needed). Choosing a suggestion auto-fills the town/city and country.
 */
function PostcodeField({
  value,
  onChange,
  onResolved,
}: {
  value: string;
  onChange: (v: string) => void;
  onResolved: (a: { city?: string; country?: string }) => void;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const justPicked = useRef(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Debounced autocomplete lookup as the customer types.
  useEffect(() => {
    if (justPicked.current) {
      justPicked.current = false;
      return;
    }
    const q = value.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.postcodes.io/postcodes/${encodeURIComponent(q)}/autocomplete`,
          { signal: ctrl.signal }
        );
        const data = await res.json();
        const list: string[] = Array.isArray(data.result) ? data.result : [];
        setSuggestions(list);
        setOpen(list.length > 0);
      } catch {
        /* network/abort — silently ignore, manual entry still works */
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [value]);

  // Close the dropdown when clicking outside.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  async function pick(postcode: string) {
    justPicked.current = true;
    onChange(postcode);
    setOpen(false);
    setSuggestions([]);
    // Resolve town/city + country for the chosen postcode.
    try {
      const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`);
      const data = await res.json();
      const r = data.result;
      if (r) {
        onResolved({
          city: r.admin_district || r.parliamentary_constituency || undefined,
          country: "United Kingdom",
        });
      }
    } catch {
      /* ignore — postcode is still filled */
    }
  }

  return (
    <div className="relative" ref={boxRef}>
      <span className="mb-1.5 block text-sm font-medium text-foreground">Postcode</span>
      <div className="flex items-center overflow-hidden rounded-lg border border-grey-300 transition-colors focus-within:border-accent">
        <span className="pl-3 text-grey-400">
          <MapPin size={16} />
        </span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          autoComplete="off"
          required
          placeholder="Start typing, e.g. MK41"
          className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-grey-400"
        />
        {loading && <Loader2 size={15} className="mr-3 animate-spin text-grey-400" />}
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-grey-200 bg-white py-1 shadow-lg">
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(s)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-grey-700 hover:bg-grey-50"
              >
                <Search size={14} className="shrink-0 text-grey-400" />
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-1 text-xs text-grey-400">We&apos;ll fill in your town & country automatically.</p>
    </div>
  );
}
