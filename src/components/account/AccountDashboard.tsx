"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Loader2,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Package,
  Heart,
  Truck,
  BadgeCheck,
  Building2,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export interface AccountUser {
  name: string;
  email: string;
  phone: string;
  accountType: "retail" | "wholesale";
  companyName: string;
  approved: boolean;
  addresses: { line1: string; line2?: string; city: string; postcode: string; country: string }[];
  memberSince: string | null;
}

export interface AccountOrder {
  ref: string;
  date: string;
  total: number;
  status: string;
  paymentStatus: string;
  itemCount: number;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-grey-100 text-grey-600",
  paid: "bg-green-50 text-green-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-indigo-50 text-indigo-700",
  completed: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-600",
};

export default function AccountDashboard({ user, orders }: { user: AccountUser; orders: AccountOrder[] }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const firstName = user.name.split(" ")[0] || user.name;

  async function signOut() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Signed out");
      router.refresh();
    } catch {
      toast.error("Could not sign out. Please try again.");
      setLoggingOut(false);
    }
  }

  return (
    <div className="bg-grey-50">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-grey-500">My Account</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
              Hello, {firstName}
            </h1>
          </div>
          <button
            onClick={signOut}
            disabled={loggingOut}
            className="inline-flex items-center gap-2 rounded-lg border border-grey-300 px-4 py-2.5 text-sm font-semibold text-grey-700 transition-colors hover:bg-white disabled:opacity-60"
          >
            {loggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
            Sign out
          </button>
        </div>

        {/* Account type badge */}
        <div className="mt-5">
          {user.accountType === "wholesale" ? (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                user.approved ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
              }`}
            >
              <Building2 size={13} />
              {user.approved ? "Wholesale account, approved" : "Wholesale account, pending approval"}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent">
              <BadgeCheck size={13} /> Retail account
            </span>
          )}
        </div>

        {/* Quick links */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <QuickCard href="#orders" icon={<Package size={20} />} title="Orders" sub="Track & view orders" />
          <QuickCard href="/wishlist" icon={<Heart size={20} />} title="Saved items" sub="Your wishlist" />
          <QuickCard href="/shop" icon={<Truck size={20} />} title="Continue shopping" sub="Browse the range" />
        </div>

        {/* Details + addresses */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Account details */}
          <section className="rounded-2xl border border-grey-200 bg-white p-6">
            <h2 className="text-base font-semibold text-foreground">Account details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Row icon={<Mail size={15} />} label="Email" value={user.email} />
              <Row icon={<Phone size={15} />} label="Phone" value={user.phone || "Not added yet"} muted={!user.phone} />
              {user.companyName && (
                <Row icon={<Building2 size={15} />} label="Company" value={user.companyName} />
              )}
              {user.memberSince && (
                <Row icon={<BadgeCheck size={15} />} label="Member since" value={user.memberSince} />
              )}
            </dl>
          </section>

          {/* Addresses */}
          <section className="rounded-2xl border border-grey-200 bg-white p-6">
            <h2 className="text-base font-semibold text-foreground">Saved addresses</h2>
            {user.addresses.length === 0 ? (
              <div className="mt-4 flex flex-col items-start gap-2 text-sm text-grey-500">
                <MapPin size={20} className="text-grey-300" />
                <p>You haven&apos;t saved any addresses yet. Your delivery address will be saved when you place your first order.</p>
              </div>
            ) : (
              <ul className="mt-4 space-y-4">
                {user.addresses.map((a, i) => (
                  <li key={i} className="rounded-lg bg-grey-50 p-4 text-sm text-grey-600">
                    <p className="text-foreground">{a.line1}</p>
                    {a.line2 && <p>{a.line2}</p>}
                    <p>{a.city}, {a.postcode}</p>
                    <p>{a.country}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Order history */}
        <section id="orders" className="mt-6 rounded-2xl border border-grey-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Order history</h2>
            <span className="text-xs text-grey-400">{orders.length} order(s)</span>
          </div>

          {orders.length === 0 ? (
            <div className="mt-4 flex flex-col items-start gap-2 text-sm text-grey-500">
              <Package size={20} className="text-grey-300" />
              <p>You haven&apos;t placed any orders yet. When you do, they&apos;ll appear here with their status.</p>
              <Link href="/shop" className="font-medium text-accent hover:underline">
                Start shopping →
              </Link>
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-grey-200 text-left text-xs uppercase tracking-wide text-grey-400">
                    <th className="py-2 pr-4 font-medium">Order</th>
                    <th className="hidden py-2 pr-4 font-medium sm:table-cell">Date</th>
                    <th className="hidden py-2 pr-4 font-medium sm:table-cell">Items</th>
                    <th className="py-2 pr-4 font-medium">Total</th>
                    <th className="py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.ref} className="border-b border-grey-100 last:border-0">
                      <td className="py-3 pr-4 font-mono text-xs font-semibold text-foreground">{o.ref}</td>
                      <td className="hidden py-3 pr-4 text-grey-500 sm:table-cell">{o.date}</td>
                      <td className="hidden py-3 pr-4 text-grey-500 sm:table-cell">{o.itemCount}</td>
                      <td className="py-3 pr-4 text-foreground">{formatPrice(o.total)}</td>
                      <td className="py-3">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${
                            STATUS_STYLES[o.status] || "bg-grey-100 text-grey-600"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Wholesale CTA for retail customers */}
        {user.accountType === "retail" && (
          <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl bg-accent px-6 py-6 text-white sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-semibold">Buy for your business?</h3>
              <p className="mt-1 text-sm text-white/80">Apply for a trade account to unlock wholesale pricing.</p>
            </div>
            <Link
              href="/wholesale"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-grey-100"
            >
              Apply for wholesale
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickCard({ href, icon, title, sub }: { href: string; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-grey-200 bg-white p-5 transition-colors hover:border-accent"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-50 text-accent">{icon}</span>
      <span>
        <span className="block text-sm font-semibold text-foreground">{title}</span>
        <span className="block text-xs text-grey-500">{sub}</span>
      </span>
    </Link>
  );
}

function Row({ icon, label, value, muted }: { icon: React.ReactNode; label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-grey-400">{icon}</span>
      <div>
        <dt className="text-xs uppercase tracking-wide text-grey-400">{label}</dt>
        <dd className={muted ? "text-grey-400" : "text-foreground"}>{value}</dd>
      </div>
    </div>
  );
}
