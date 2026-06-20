"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft, Package, Truck, CreditCard, Building2,
  Loader2, Check, ExternalLink, User, MapPin, StickyNote, Tag,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";

interface OrderItem { name: string; price: number; quantity: number; image?: string; }

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name?: string; email?: string; phone?: string;
    company?: string; address?: string; city?: string;
    postcode?: string; country?: string;
  };
  shippingAddress?: {
    name?: string; address?: string; city?: string; postcode?: string; country?: string;
  };
  items: OrderItem[];
  subtotal: number; discount: number; couponCode?: string; total: number;
  notes?: string; adminNotes?: string;
  paymentMethod: string; status: string; paymentStatus: string;
  courier?: string; trackingNumber?: string; trackingUrl?: string;
  marketingOptIn?: boolean;
  createdAt: string; updatedAt: string;
}

const STATUS_OPTIONS = [
  "pending","awaiting_payment","paid","processing","shipped","completed","cancelled",
];
const PAY_OPTIONS = ["unpaid", "paid", "refunded"];
const COURIERS = [
  { value: "", label: "Not dispatched" },
  { value: "evri",        label: "Evri" },
  { value: "parcelforce", label: "Parcel Force" },
  { value: "dpd",         label: "DPD" },
  { value: "other",       label: "Other" },
];
const TRACK_BASE: Record<string, string> = {
  evri:        "https://www.evri.com/track-a-parcel#/tracking/{num}",
  parcelforce: "https://www.parcelforce.com/track-trace?trackNumber={num}",
  dpd:         "https://track.dpd.co.uk/search?reference={num}",
};

const STATUS_COLORS: Record<string, string> = {
  pending:          "bg-grey-100 text-grey-600",
  awaiting_payment: "bg-amber-50 text-amber-700",
  paid:             "bg-blue-50 text-blue-700",
  processing:       "bg-blue-50 text-blue-700",
  shipped:          "bg-purple-50 text-purple-700",
  completed:        "bg-green-50 text-green-700",
  cancelled:        "bg-red-50 text-red-600",
};
const PAY_COLORS: Record<string, string> = {
  unpaid:   "bg-grey-100 text-grey-600",
  paid:     "bg-green-50 text-green-700",
  refunded: "bg-red-50 text-red-600",
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder]   = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  // edit state
  const [status,      setStatus]      = useState("");
  const [payStatus,   setPayStatus]   = useState("");
  const [courier,     setCourier]     = useState("");
  const [trackNum,    setTrackNum]    = useState("");
  const [trackUrl,    setTrackUrl]    = useState("");
  const [adminNotes,  setAdminNotes]  = useState("");

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.order) {
          const o: Order = d.order;
          setOrder(o);
          setStatus(o.status);
          setPayStatus(o.paymentStatus);
          setCourier(o.courier ?? "");
          setTrackNum(o.trackingNumber ?? "");
          setTrackUrl(o.trackingUrl ?? "");
          setAdminNotes(o.adminNotes ?? "");
        } else toast.error("Order not found");
      })
      .catch(() => toast.error("Failed to load order"))
      .finally(() => setLoading(false));
  }, [id]);

  async function save() {
    if (!order) return;
    setSaving(true);
    try {
      const r = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentStatus: payStatus, courier, trackingNumber: trackNum, trackingUrl: trackUrl, adminNotes }),
      });
      const d = await r.json();
      if (!r.ok) { toast.error(d.error || "Failed to save"); return; }
      toast.success("Order updated");
      setOrder(o => o ? { ...o, status, paymentStatus: payStatus, courier, trackingNumber: trackNum, trackingUrl: trackUrl, adminNotes } : o);
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-32 text-grey-400">
      <Loader2 className="animate-spin" size={32} />
    </div>
  );

  if (!order) return (
    <div className="py-20 text-center text-grey-500">
      <Package size={40} className="mx-auto text-grey-300" />
      <p className="mt-3">Order not found.</p>
      <Link href="/hamzah/orders" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
        <ArrowLeft size={14} /> Back to orders
      </Link>
    </div>
  );

  const deliveryAddr = order.shippingAddress?.address
    ? [order.shippingAddress.name, order.shippingAddress.address, order.shippingAddress.city, order.shippingAddress.postcode, order.shippingAddress.country].filter(Boolean).join(", ")
    : [order.customer.address, order.customer.city, order.customer.postcode, order.customer.country].filter(Boolean).join(", ");

  const autoTrackUrl = courier && trackNum && TRACK_BASE[courier]
    ? TRACK_BASE[courier].replace("{num}", encodeURIComponent(trackNum))
    : trackUrl;

  const hasChanges =
    status !== order.status ||
    payStatus !== order.paymentStatus ||
    courier !== (order.courier ?? "") ||
    trackNum !== (order.trackingNumber ?? "") ||
    trackUrl !== (order.trackingUrl ?? "") ||
    adminNotes !== (order.adminNotes ?? "");

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="mb-6">
        <Link href="/hamzah/orders" className="inline-flex items-center gap-1.5 text-sm text-grey-500 hover:text-foreground">
          <ArrowLeft size={15} /> Back to Orders
        </Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-mono text-2xl font-bold text-foreground">{order.orderNumber}</h1>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_COLORS[order.status] || "bg-grey-100 text-grey-600"}`}>
                {order.status.replace(/_/g, " ")}
              </span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${PAY_COLORS[order.paymentStatus] || ""}`}>
                {order.paymentStatus}
              </span>
            </div>
            <p className="mt-1 text-sm text-grey-400">
              Placed {new Date(order.createdAt).toLocaleString("en-GB", { day:"2-digit", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit" })}
            </p>
          </div>
          <button
            onClick={save}
            disabled={!hasChanges || saving}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-40"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">

        {/* ── LEFT ────────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Items */}
          <Card title="Order Items" icon={<Package size={16} />}>
            <ul className="divide-y divide-grey-100">
              {order.items.map((item, i) => (
                <li key={i} className="flex items-center gap-4 py-3.5">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-grey-200 bg-grey-100">
                    {item.image
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      : <div className="flex h-full w-full items-center justify-center text-grey-300"><Package size={18} /></div>
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground leading-snug line-clamp-2">{item.name}</p>
                    <p className="mt-0.5 text-sm text-grey-500">{formatPrice(item.price)} each &times; {item.quantity}</p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-foreground">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 space-y-1.5 border-t border-grey-100 pt-4 text-sm">
              <Row label="Subtotal (ex VAT)" value={formatPrice(order.subtotal)} />
              {(order.discount ?? 0) > 0 && (
                <Row label={`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`} value={`-${formatPrice(order.discount)}`} green />
              )}
              <div className="flex items-center justify-between border-t border-grey-100 pt-2 text-base font-bold text-foreground">
                <span>Total</span><span>{formatPrice(order.total)}</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${order.paymentMethod === "bank_transfer" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}>
                {order.paymentMethod === "bank_transfer" ? <Building2 size={12} /> : <CreditCard size={12} />}
                {order.paymentMethod === "bank_transfer" ? "Bank Transfer" : "Card Payment"}
              </span>
              {order.couponCode && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                  <Tag size={11} /> Coupon: {order.couponCode}
                </span>
              )}
            </div>
          </Card>

          {/* Customer */}
          <Card title="Customer" icon={<User size={16} />}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Detail label="Name"    value={order.customer.name} />
              <Detail label="Email"   value={order.customer.email ? <a href={`mailto:${order.customer.email}`} className="text-accent hover:underline">{order.customer.email}</a> : null} />
              <Detail label="Phone"   value={order.customer.phone || "-"} />
              <Detail label="Company" value={order.customer.company || "-"} />
              {order.marketingOptIn !== undefined && (
                <Detail label="Marketing" value={order.marketingOptIn ? "Opted in" : "Not opted in"} />
              )}
            </div>
          </Card>

          {/* Addresses */}
          <Card title="Delivery Address" icon={<MapPin size={16} />}>
            {order.shippingAddress?.address ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-grey-400 mb-1">Billing</p>
                  <p className="text-sm text-grey-600 leading-relaxed">
                    {[order.customer.address, order.customer.city, order.customer.postcode, order.customer.country].filter(Boolean).join(", ")}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-grey-400 mb-1">Shipping (different)</p>
                  <p className="text-sm text-grey-600 leading-relaxed">{deliveryAddr}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-grey-600">{deliveryAddr || "Not provided"}</p>
            )}
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card title="Customer Notes" icon={<StickyNote size={16} />}>
              <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 leading-relaxed">{order.notes}</p>
            </Card>
          )}
        </div>

        {/* ── RIGHT: controls ──────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Status */}
          <Card title="Order Status">
            <div className="space-y-3">
              <ControlField label="Order Status">
                <select value={status} onChange={e => setStatus(e.target.value)} className={selectClass}>
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</option>
                  ))}
                </select>
              </ControlField>
              <ControlField label="Payment Status">
                <select value={payStatus} onChange={e => setPayStatus(e.target.value)} className={selectClass}>
                  {PAY_OPTIONS.map(s => (
                    <option key={s} value={s}>{s.replace(/\b\w/g, c => c.toUpperCase())}</option>
                  ))}
                </select>
              </ControlField>
            </div>
          </Card>

          {/* Tracking */}
          <Card title="Shipping & Tracking" icon={<Truck size={16} />}>
            <div className="space-y-3">
              <ControlField label="Courier">
                <select value={courier} onChange={e => setCourier(e.target.value)} className={selectClass}>
                  {COURIERS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </ControlField>
              <ControlField label="Tracking Number">
                <input
                  value={trackNum} onChange={e => setTrackNum(e.target.value)}
                  placeholder="e.g. H00123456789"
                  className="w-full rounded-lg border border-grey-300 px-3 py-2.5 font-mono text-sm outline-none focus:border-accent"
                />
              </ControlField>

              {autoTrackUrl && (
                <a href={autoTrackUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline">
                  <ExternalLink size={12} /> Track on {COURIERS.find(c => c.value === courier)?.label}
                </a>
              )}

              <ControlField label="Custom Tracking URL">
                <input
                  value={trackUrl} onChange={e => setTrackUrl(e.target.value)}
                  placeholder="https://track.carrier.com/..."
                  className="w-full rounded-lg border border-grey-300 px-3 py-2.5 text-sm outline-none focus:border-accent"
                />
              </ControlField>
            </div>
          </Card>

          {/* Admin notes */}
          <Card title="Admin Notes">
            <textarea
              value={adminNotes} onChange={e => setAdminNotes(e.target.value)}
              rows={4} placeholder="Internal notes — not shown to the customer"
              className="w-full resize-none rounded-lg border border-grey-300 px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </Card>

          {/* Save */}
          <button
            onClick={save}
            disabled={!hasChanges || saving}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-40"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
            {saving ? "Saving changes…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ────────────────────────────────────────────────────────────── */

function Card({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-grey-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
        {icon && <span className="text-grey-400">{icon}</span>}
        {title}
      </div>
      {children}
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-grey-400">{label}</p>
      <p className="mt-0.5 text-sm text-foreground">{value || "-"}</p>
    </div>
  );
}

function ControlField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-grey-600">{label}</p>
      {children}
    </div>
  );
}

function Row({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-grey-500">{label}</span>
      <span className={green ? "font-semibold text-green-600" : "text-foreground"}>{value}</span>
    </div>
  );
}

const selectClass = "w-full rounded-lg border border-grey-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-accent";
