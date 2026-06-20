"use client";

import { useEffect, useState } from "react";
import { Plus, Tag, Trash2, Pencil, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";

interface Coupon {
  _id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  minSpend: number;
  active: boolean;
  expiresAt?: string | null;
  usageLimit?: number | null;
  usedCount: number;
}

const EMPTY: Omit<Coupon, "_id" | "usedCount"> = {
  code: "", type: "percent", value: 10, minSpend: 0,
  active: true, expiresAt: "", usageLimit: null,
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/coupons");
      const d = await r.json();
      if (r.ok) setCoupons(d.coupons);
    } catch { /* ignore */ } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function openCreate() { setEditing(null); setForm(EMPTY); setShowForm(true); }
  function openEdit(c: Coupon) {
    setEditing(c);
    setForm({ code: c.code, type: c.type, value: c.value, minSpend: c.minSpend, active: c.active, expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : "", usageLimit: c.usageLimit ?? null });
    setShowForm(true);
  }

  async function save() {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/coupons/${editing._id}` : "/api/admin/coupons";
      const method = editing ? "PATCH" : "POST";
      const r = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, value: Number(form.value), minSpend: Number(form.minSpend), usageLimit: form.usageLimit ? Number(form.usageLimit) : null }),
      });
      const d = await r.json();
      if (!r.ok) { toast.error(d.error || "Failed"); return; }
      toast.success(editing ? "Coupon updated" : "Coupon created");
      setShowForm(false); setEditing(null); load();
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  }

  async function remove(c: Coupon) {
    if (!confirm(`Delete coupon "${c.code}"?`)) return;
    try {
      await fetch(`/api/admin/coupons/${c._id}`, { method: "DELETE" });
      toast.success("Deleted");
      load();
    } catch { toast.error("Failed"); }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Coupons</h1>
          <p className="mt-1 text-sm text-grey-500">{coupons.length} coupon(s)</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          <Plus size={16} /> Add Coupon
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-grey-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">{editing ? "Edit Coupon" : "New Coupon"}</h2>
            <button onClick={() => setShowForm(false)} className="text-grey-400 hover:text-foreground"><X size={18} /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Code" required>
              <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="e.g. SUMMER20"
                className="w-full rounded-lg border border-grey-300 px-3 py-2.5 text-sm font-mono uppercase outline-none focus:border-accent" />
            </FormField>
            <FormField label="Type">
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "percent" | "fixed" }))}
                className="w-full rounded-lg border border-grey-300 px-3 py-2.5 text-sm outline-none focus:border-accent bg-white">
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed amount (£)</option>
              </select>
            </FormField>
            <FormField label={form.type === "percent" ? "Discount %" : "Discount (£)"} required>
              <input type="number" min={0} value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: +e.target.value }))}
                className="w-full rounded-lg border border-grey-300 px-3 py-2.5 text-sm outline-none focus:border-accent" />
            </FormField>
            <FormField label="Min spend (£, 0 = any)">
              <input type="number" min={0} value={form.minSpend} onChange={(e) => setForm((f) => ({ ...f, minSpend: +e.target.value }))}
                className="w-full rounded-lg border border-grey-300 px-3 py-2.5 text-sm outline-none focus:border-accent" />
            </FormField>
            <FormField label="Expires (leave blank = never)">
              <input type="date" value={form.expiresAt || ""} onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                className="w-full rounded-lg border border-grey-300 px-3 py-2.5 text-sm outline-none focus:border-accent" />
            </FormField>
            <FormField label="Usage limit (blank = unlimited)">
              <input type="number" min={0} value={form.usageLimit ?? ""} onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value ? +e.target.value : null }))}
                placeholder="e.g. 100"
                className="w-full rounded-lg border border-grey-300 px-3 py-2.5 text-sm outline-none focus:border-accent" />
            </FormField>
          </div>
          <label className="mt-4 flex cursor-pointer items-center gap-2 select-none">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="h-4 w-4 accent-accent" />
            <span className="text-sm font-medium text-foreground">Active</span>
          </label>
          <div className="mt-5 flex gap-3">
            <button onClick={save} disabled={saving || !form.code}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50">
              {saving ? <Loader2 size={14} className="animate-spin" /> : null}
              {editing ? "Save Changes" : "Create Coupon"}
            </button>
            <button onClick={() => setShowForm(false)} className="rounded-lg border border-grey-300 px-5 py-2.5 text-sm font-medium text-foreground hover:bg-grey-50">Cancel</button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20 text-grey-400"><Loader2 className="animate-spin" /></div>
      ) : coupons.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-grey-300 bg-white py-16 text-center">
          <Tag size={36} className="text-grey-300" />
          <p className="mt-3 text-sm font-medium text-grey-600">No coupons yet</p>
          <button onClick={openCreate} className="mt-3 text-sm font-medium text-foreground underline">Create your first coupon</button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-grey-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-grey-200 text-left text-xs uppercase tracking-wide text-grey-400">
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Discount</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Min Spend</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Usage</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Expires</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id} className="border-b border-grey-100 last:border-0 hover:bg-grey-50">
                  <td className="px-4 py-3 font-mono font-bold text-foreground">{c.code}</td>
                  <td className="px-4 py-3 text-foreground">
                    {c.type === "percent" ? `${c.value}%` : formatPrice(c.value)}
                  </td>
                  <td className="hidden px-4 py-3 text-grey-500 sm:table-cell">
                    {c.minSpend > 0 ? formatPrice(c.minSpend) : "Any"}
                  </td>
                  <td className="hidden px-4 py-3 text-grey-500 md:table-cell">
                    {c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}
                  </td>
                  <td className="hidden px-4 py-3 text-grey-500 md:table-cell">
                    {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-GB") : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${c.active ? "bg-green-50 text-green-700" : "bg-grey-100 text-grey-500"}`}>
                      {c.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(c)} className="rounded-md p-2 text-grey-400 hover:bg-grey-100 hover:text-foreground" aria-label="Edit"><Pencil size={14} /></button>
                      <button onClick={() => remove(c)} className="rounded-md p-2 text-grey-400 hover:bg-grey-100 hover:text-red-600" aria-label="Delete"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FormField({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}{required && <span className="text-red-500"> *</span>}</span>
      {children}
    </label>
  );
}
