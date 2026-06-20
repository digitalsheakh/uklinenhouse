"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  Loader2, Lock, ShoppingBag, ShieldCheck, MapPin, Search,
  WifiOff, Minus, Plus, Trash2, Tag, CheckCircle, CreditCard, Building2,
  ChevronDown, ChevronUp,
} from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice, vatPercent } from "@/lib/utils";
import FreeDeliveryBar from "@/components/cart/FreeDeliveryBar";
import { siteConfig } from "@/config/site";

export interface InitialCustomer {
  name?: string; email?: string; phone?: string;
  address?: string; city?: string; postcode?: string; country?: string;
}

const BLANK_ADDR = { name: "", address: "", city: "", postcode: "", country: "United Kingdom" };

export default function CheckoutClient({ initial }: { initial: InitialCustomer }) {
  const router = useRouter();
  const params = useSearchParams();
  const { items, subtotal, vat, shipping, total, updateQuantity, removeItem } = useCart();
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState(true);

  // ── Billing form ──────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name: initial.name || "",
    email: initial.email || "",
    phone: initial.phone || "",
    company: "",
    address: initial.address || "",
    city: initial.city || "",
    postcode: initial.postcode || "",
    country: initial.country || "United Kingdom",
  });

  // ── Ship to different address ──────────────────────────────────────────────
  const [shipDifferent, setShipDifferent] = useState(false);
  const [shipAddr, setShipAddr] = useState(BLANK_ADDR);

  // ── Coupon ─────────────────────────────────────────────────────────────────
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponOpen, setCouponOpen] = useState(false);

  // ── Payment method ─────────────────────────────────────────────────────────
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank_transfer">("card");

  // ── Notes / marketing / terms ──────────────────────────────────────────────
  const [notes, setNotes] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // ── Lead capture (abandoned cart) ─────────────────────────────────────────
  const leadSent = useRef(false);

  const sendLead = useCallback(async () => {
    if (leadSent.current || !form.email || items.length === 0) return;
    leadSent.current = true;
    try {
      await fetch("/api/checkout/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: form.name, email: form.email, phone: form.phone },
          items: items.map((i) => ({
            productId: i.productId, variantId: i.variantId,
            variantLabel: i.variantLabel, name: i.name,
            price: i.price, quantity: i.quantity, image: i.image,
          })),
        }),
      });
    } catch { /* best-effort */ }
  }, [form.email, form.name, form.phone, items]);

  // Send lead when customer fills in email and tabs away
  const onEmailBlur = () => { if (form.email) sendLead(); };

  useEffect(() => { useCart.persist.rehydrate(); setHydrated(true); }, []);
  useEffect(() => { if (params.get("canceled")) toast("Payment canceled — your bag is saved.", { icon: "🛈" }); }, [params]);
  useEffect(() => {
    const u = () => setOnline(navigator.onLine);
    u(); window.addEventListener("online", u); window.addEventListener("offline", u);
    return () => { window.removeEventListener("online", u); window.removeEventListener("offline", u); };
  }, []);

  const setF = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const setS = (k: keyof typeof shipAddr) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setShipAddr((a) => ({ ...a, [k]: e.target.value }));

  // Coupon discount applied locally so totals update in real-time
  const discount = appliedCoupon?.discount ?? 0;
  const discountedSub = subtotal() - discount;
  const effectiveVat = discountedSub * siteConfig.vatRate;
  const effectiveShipping = discountedSub >= siteConfig.freeDeliveryThreshold ? 0 : siteConfig.shippingFee;
  const effectiveTotal = discountedSub + effectiveVat + effectiveShipping;

  async function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal: subtotal() }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Invalid coupon."); return; }
      setAppliedCoupon({ code: data.code, discount: data.discount });
      toast.success(data.message || "Coupon applied!");
      setCouponOpen(false);
    } catch { toast.error("Could not apply coupon. Try again."); }
    finally { setCouponLoading(false); }
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || items.length === 0) return;
    if (!agreeTerms) { toast.error("Please accept the terms and conditions."); return; }
    if (!navigator.onLine) { toast.error("You appear to be offline. Reconnect and try again."); return; }

    setLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
          customer: form,
          shippingAddress: shipDifferent ? shipAddr : undefined,
          notes,
          couponCode: appliedCoupon?.code || couponInput.trim() || "",
          marketingOptIn: marketing,
          paymentMethod,
          agreeTerms: true,
        }),
      });

      let data: { url?: string; bankTransfer?: boolean; orderNumber?: string; orderId?: string; error?: string } = {};
      try { data = await res.json(); } catch { /* non-JSON */ }

      if (!res.ok) {
        toast.error(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      if (data.bankTransfer) {
        router.push(`/checkout/success?bank=1&ref=${data.orderNumber}`);
        return;
      }

      if (data.url) { window.location.assign(data.url); return; }

      toast.error("Could not complete checkout. Please try again.");
      setLoading(false);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        toast.error("Request timed out. Check your connection and try again — you won't be charged twice.");
      } else if (!navigator.onLine) {
        toast.error("Connection lost. Your bag is saved, reconnect and try again.");
      } else {
        toast.error("Network error. Please try again.");
      }
      setLoading(false);
    } finally {
      clearTimeout(timeout);
    }
  }

  if (!hydrated) {
    return <div className="flex min-h-[50vh] items-center justify-center text-grey-400"><Loader2 className="animate-spin" /></div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <ShoppingBag size={40} className="mx-auto text-grey-300" />
        <h1 className="mt-4 text-2xl font-semibold text-foreground">Your bag is empty</h1>
        <p className="mt-2 text-sm text-grey-500">Add some products before checking out.</p>
        <Link href="/shop" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent-hover">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-grey-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Checkout</h1>

        <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">

          {/* ── LEFT: Details ─────────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Contact details */}
            <Section title="Contact Details">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" value={form.name} onChange={setF("name")} autoComplete="name" required />
                <Field label="Email Address" type="email" value={form.email} onChange={setF("email")} onBlur={onEmailBlur} autoComplete="email" required />
                <Field label="Phone Number" value={form.phone} onChange={setF("phone")} autoComplete="tel" required />
                <Field label="Company Name (optional)" value={form.company} onChange={setF("company")} autoComplete="organization" />
              </div>
            </Section>

            {/* Billing address */}
            <Section title="Billing Address">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Address" value={form.address} onChange={setF("address")} autoComplete="street-address" required />
                </div>
                <Field label="Town / City" value={form.city} onChange={setF("city")} autoComplete="address-level2" required />
                <PostcodeField
                  value={form.postcode}
                  onChange={(v) => setForm((f) => ({ ...f, postcode: v }))}
                  onResolved={({ city, country }) => setForm((f) => ({ ...f, city: city || f.city, country: country || f.country }))}
                />
                <Field label="Country" value={form.country} onChange={setF("country")} autoComplete="country-name" required />
              </div>

              {/* Ship to a different address */}
              <label className="mt-5 flex cursor-pointer items-center gap-2.5 select-none">
                <input
                  type="checkbox"
                  checked={shipDifferent}
                  onChange={(e) => setShipDifferent(e.target.checked)}
                  className="h-4 w-4 rounded border-grey-300 text-accent accent-accent"
                />
                <span className="text-sm font-medium text-foreground">Ship to a different address?</span>
              </label>

              {shipDifferent && (
                <div className="mt-4 grid gap-4 rounded-xl border border-grey-200 bg-grey-50 p-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label="Recipient Name" value={shipAddr.name || ""} onChange={setS("name")} autoComplete="shipping name" />
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Delivery Address" value={shipAddr.address} onChange={setS("address")} autoComplete="shipping street-address" required={shipDifferent} />
                  </div>
                  <Field label="Town / City" value={shipAddr.city} onChange={setS("city")} autoComplete="shipping address-level2" required={shipDifferent} />
                  <PostcodeField
                    value={shipAddr.postcode}
                    onChange={(v) => setShipAddr((a) => ({ ...a, postcode: v }))}
                    onResolved={({ city, country }) => setShipAddr((a) => ({ ...a, city: city || a.city, country: country || a.country }))}
                  />
                  <Field label="Country" value={shipAddr.country} onChange={setS("country")} autoComplete="shipping country-name" required={shipDifferent} />
                </div>
              )}
            </Section>

            {/* Order notes */}
            <Section title="Order Notes (optional)">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions, delivery notes, or message for us…"
                rows={3}
                maxLength={1000}
                className="w-full rounded-lg border border-grey-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent resize-none"
              />
              <p className="mt-1 text-xs text-grey-400">{notes.length}/1000</p>
            </Section>

            {/* Payment method */}
            <Section title="Payment Method">
              <div className="grid gap-3 sm:grid-cols-2">
                {/* Card */}
                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${paymentMethod === "card" ? "border-accent bg-accent-50" : "border-grey-200 bg-white hover:border-grey-300"}`}>
                  <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="mt-0.5 accent-accent" />
                  <div>
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground"><CreditCard size={15} /> Pay by Card</span>
                    <p className="mt-0.5 text-xs text-grey-500">Secure card payment via Stripe.</p>
                  </div>
                </label>

                {/* Bank transfer */}
                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${paymentMethod === "bank_transfer" ? "border-accent bg-accent-50" : "border-grey-200 bg-white hover:border-grey-300"}`}>
                  <input type="radio" name="paymentMethod" value="bank_transfer" checked={paymentMethod === "bank_transfer"} onChange={() => setPaymentMethod("bank_transfer")} className="mt-0.5 accent-accent" />
                  <div>
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground"><Building2 size={15} /> Bank Transfer</span>
                    <p className="mt-0.5 text-xs text-grey-500">Pay directly to our bank account.</p>
                  </div>
                </label>
              </div>

              {/* Bank transfer details */}
              {paymentMethod === "bank_transfer" && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
                  <p className="font-semibold text-amber-800">Bank Transfer Instructions</p>
                  <p className="mt-1 text-amber-700 leading-relaxed">
                    If you have chosen to pay by bank transfer, please note your order will not be processed until payment has been received. Please quote your <strong>order reference number</strong> when making the payment.
                  </p>
                  <div className="mt-3 space-y-1 rounded-lg bg-white border border-amber-200 p-3 text-amber-900 font-mono text-sm">
                    <p><span className="font-sans font-medium text-grey-600 not-italic">Account Name:</span> FRNHZ (Bedford) Limited</p>
                    <p><span className="font-sans font-medium text-grey-600 not-italic">Account No:</span> 52094560</p>
                    <p><span className="font-sans font-medium text-grey-600 not-italic">Sort Code:</span> 30-96-26</p>
                  </div>
                </div>
              )}
            </Section>

            {/* Privacy / marketing / terms */}
            <Section title="Privacy & Communication">
              <div className="space-y-3 text-sm text-grey-600">
                <label className="flex cursor-pointer items-start gap-2.5 select-none">
                  <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-grey-300 accent-accent" />
                  <span>I would like to receive exclusive emails with discounts and product information.</span>
                </label>

                <p className="text-xs text-grey-500 leading-relaxed">
                  Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{" "}
                  <Link href="/privacy-policy" className="underline hover:text-foreground" target="_blank">privacy policy</Link>.
                </p>

                <label className="flex cursor-pointer items-start gap-2.5 select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-grey-300 accent-accent"
                    required
                  />
                  <span>
                    I have read and agree to the{" "}
                    <Link href="/terms-for-online-shopping" className="underline hover:text-foreground" target="_blank">website terms and conditions</Link>
                    <span className="text-red-500"> *</span>
                  </span>
                </label>
              </div>
            </Section>
          </div>

          {/* ── RIGHT: Order summary ────────────────────────────────────── */}
          <aside className="lg:sticky lg:top-24 lg:self-start space-y-4">

            {/* Bag items */}
            <div className="rounded-2xl border border-grey-200 bg-white p-5">
              <h2 className="text-base font-semibold text-foreground">Your Bag</h2>
              <ul className="mt-3 divide-y divide-grey-100">
                {items.map((i) => (
                  <li key={`${i.productId}-${i.variantId || ""}`} className="flex gap-3 py-3">
                    <Link href={`/product/${i.slug}`} className="shrink-0">
                      <div className="h-14 w-14 overflow-hidden rounded-lg border border-grey-200 bg-grey-100">
                        {i.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-grey-300"><ShoppingBag size={14} /></span>
                        )}
                      </div>
                    </Link>
                    <div className="flex flex-1 flex-col min-w-0">
                      <Link href={`/product/${i.slug}`} className="text-sm font-medium leading-snug text-foreground hover:underline line-clamp-2">{i.name}</Link>
                      {i.variantLabel && <span className="text-xs text-grey-400">{i.variantLabel}</span>}
                      <span className="mt-0.5 text-xs text-grey-500">{formatPrice(i.price)} each</span>
                      <div className="mt-1.5 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-grey-200">
                          <button type="button" onClick={() => updateQuantity(i.productId, i.variantId, i.quantity - 1)} className="px-2 py-0.5 text-grey-500 hover:text-foreground" aria-label="Decrease"><Minus size={12} /></button>
                          <span className="w-6 text-center text-xs">{i.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(i.productId, i.variantId, i.quantity + 1)} className="px-2 py-0.5 text-grey-500 hover:text-foreground" aria-label="Increase"><Plus size={12} /></button>
                        </div>
                        <button type="button" onClick={() => removeItem(i.productId, i.variantId)} className="text-grey-400 hover:text-red-500 transition-colors" aria-label="Remove"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-foreground shrink-0">{formatPrice(i.price * i.quantity)}</span>
                  </li>
                ))}
              </ul>

              {/* Coupon */}
              <div className="mt-3 border-t border-grey-100 pt-3">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-lg bg-green-50 px-3 py-2">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-green-700"><CheckCircle size={14} /> {appliedCoupon.code} applied</span>
                    <button type="button" onClick={removeCoupon} className="text-xs text-grey-500 underline hover:text-red-500">Remove</button>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={() => setCouponOpen((o) => !o)}
                      className="flex w-full items-center justify-between text-sm text-grey-600 hover:text-foreground"
                    >
                      <span className="flex items-center gap-1.5"><Tag size={14} /> Have a coupon code?</span>
                      {couponOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {couponOpen && (
                      <div className="mt-2 flex gap-2">
                        <input
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="Enter code"
                          className="flex-1 rounded-lg border border-grey-300 px-3 py-2 text-sm uppercase outline-none focus:border-accent"
                        />
                        <button
                          type="button"
                          onClick={applyCoupon}
                          disabled={couponLoading || !couponInput.trim()}
                          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
                        >
                          {couponLoading ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="mt-3 border-t border-grey-100 pt-3">
                <FreeDeliveryBar subtotal={discountedSub} />
              </div>
              <div className="mt-3 space-y-1.5">
                <Row label="Subtotal (ex VAT)" value={formatPrice(subtotal())} />
                {discount > 0 && (
                  <Row label={`Discount (${appliedCoupon?.code || "coupon"})`} value={`-${formatPrice(discount)}`} accent />
                )}
                <Row label={`VAT (${vatPercent}%)`} value={formatPrice(effectiveVat)} />
                <Row label="Shipping" value={effectiveShipping === 0 ? "FREE" : formatPrice(effectiveShipping)} green={effectiveShipping === 0} />
                <div className="flex items-center justify-between border-t border-grey-200 pt-2 text-base font-bold text-foreground">
                  <span>Total</span>
                  <span>{formatPrice(effectiveTotal)}</span>
                </div>
              </div>

              {!online && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-xs font-medium text-amber-700">
                  <WifiOff size={14} /> You are offline. Reconnect to complete your order.
                </div>
              )}

              {/* Place order button */}
              <button
                type="submit"
                disabled={loading || !online}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={15} />}
                {loading
                  ? (paymentMethod === "bank_transfer" ? "Placing order…" : "Redirecting to payment…")
                  : (paymentMethod === "bank_transfer" ? `Place Order — ${formatPrice(effectiveTotal)}` : `Pay Securely — ${formatPrice(effectiveTotal)}`)}
              </button>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-grey-400">
                {paymentMethod === "card"
                  ? <><ShieldCheck size={13} /> Secure card payment via Stripe</>
                  : <><Lock size={13} /> Order confirmed on submission</>}
              </p>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

/* ── Small UI helpers ───────────────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-grey-200 bg-white p-5 sm:p-6">
      <h2 className="mb-4 text-base font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label, value, onChange, type = "text", autoComplete, required, onBlur,
}: {
  label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; autoComplete?: string; required?: boolean;
  onBlur?: () => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <input
        type={type} value={value} onChange={onChange} onBlur={onBlur}
        autoComplete={autoComplete} required={required}
        className="w-full rounded-lg border border-grey-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent"
      />
    </label>
  );
}

function Row({ label, value, accent, green }: { label: string; value: string; accent?: boolean; green?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-grey-500">{label}</span>
      <span className={accent ? "font-semibold text-green-600" : green ? "font-semibold text-green-600" : "text-grey-700"}>{value}</span>
    </div>
  );
}

function PostcodeField({ value, onChange, onResolved }: {
  value: string;
  onChange: (v: string) => void;
  onResolved: (a: { city?: string; country?: string }) => void;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const justPicked = useRef(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (justPicked.current) { justPicked.current = false; return; }
    const q = value.trim();
    if (q.length < 2) { setSuggestions([]); return; }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(q)}/autocomplete`, { signal: ctrl.signal });
        const data = await res.json();
        const list: string[] = Array.isArray(data.result) ? data.result : [];
        setSuggestions(list); setOpen(list.length > 0);
      } catch { /* silent */ } finally { setLoading(false); }
    }, 250);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [value]);

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  async function pick(postcode: string) {
    justPicked.current = true;
    onChange(postcode); setOpen(false); setSuggestions([]);
    try {
      const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`);
      const data = await res.json();
      if (data.result) onResolved({ city: data.result.admin_district || data.result.parliamentary_constituency, country: "United Kingdom" });
    } catch { /* ignore */ }
  }

  return (
    <div className="relative" ref={boxRef}>
      <span className="mb-1.5 block text-sm font-medium text-foreground">Postcode</span>
      <div className="flex items-center overflow-hidden rounded-lg border border-grey-300 transition-colors focus-within:border-accent">
        <span className="pl-3 text-grey-400"><MapPin size={15} /></span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          autoComplete="off" required
          placeholder="e.g. MK41 7BJ"
          className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
        />
        {loading && <Loader2 size={14} className="mr-3 animate-spin text-grey-400" />}
      </div>
      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-grey-200 bg-white py-1 shadow-lg">
          {suggestions.map((s) => (
            <li key={s}>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => pick(s)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-grey-700 hover:bg-grey-50">
                <Search size={13} className="shrink-0 text-grey-400" /> {s}
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-1 text-xs text-grey-400">We will fill in your town automatically.</p>
    </div>
  );
}
