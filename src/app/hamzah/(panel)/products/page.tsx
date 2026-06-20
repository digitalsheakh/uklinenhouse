"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, Search, Package, Copy, Filter } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";

interface Prod {
  _id: string;
  name: string;
  sku?: string;
  price: number;
  stock: number;
  images: string[];
  isActive: boolean;
  featured: boolean;
  category?: { _id?: string; name?: string };
}

interface Cat {
  _id: string;
  name: string;
  slug: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Prod[]>([]);
  const [categories, setCategories] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  // Load flat category list for the filter dropdown
  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => { if (d.categories) setCategories(d.categories); })
      .catch(() => {});
  }, []);

  const load = useCallback(async (q = "", catId = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("search", q);
      if (catId) params.set("category", catId);
      const res = await fetch(`/api/admin/products${params.toString() ? `?${params}` : ""}`);
      const data = await res.json();
      if (res.ok) setProducts(data.products);
      else toast.error(data.error || "Failed to load");
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Debounce search + react to category change
  useEffect(() => {
    const t = setTimeout(() => load(search, categoryId), 300);
    return () => clearTimeout(t);
  }, [search, categoryId, load]);

  async function remove(p: Prod) {
    if (!confirm(`Delete "${p.name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${p._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast.success("Deleted");
      load(search, categoryId);
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  async function duplicate(p: Prod) {
    setBusyId(p._id);
    try {
      const res = await fetch(`/api/admin/products/${p._id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load product");
      const src = data.product as Record<string, unknown>;
      const payload: Record<string, unknown> = { ...src, name: `${p.name} (Copy)`, sku: "", featured: false, bestQuality: false };
      delete payload._id; delete payload.slug; delete payload.priceMax;
      delete payload.createdAt; delete payload.updatedAt; delete payload.__v;
      const create = await fetch("/api/admin/products", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const created = await create.json();
      if (!create.ok) throw new Error(created.error || "Failed to duplicate");
      toast.success("Product duplicated");
      const newId = created.product?._id;
      if (newId) router.push(`/hamzah/products/${newId}/edit`);
      else load(search, categoryId);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Products</h1>
          <p className="mt-1 text-sm text-grey-500">{products.length} product(s)</p>
        </div>
        <Link
          href="/hamzah/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-lg border border-grey-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-foreground"
          />
        </div>

        {/* Category filter */}
        <div className="relative">
          <Filter size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-grey-400" />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-lg border border-grey-200 py-2.5 pl-9 pr-8 text-sm text-foreground outline-none focus:border-foreground appearance-none bg-white cursor-pointer min-w-[180px]"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Clear filters */}
        {(search || categoryId) && (
          <button
            onClick={() => { setSearch(""); setCategoryId(""); }}
            className="text-sm text-grey-500 hover:text-foreground underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Products table */}
      {loading ? (
        <div className="flex justify-center py-20 text-grey-400"><Loader2 className="animate-spin" /></div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-grey-300 bg-white py-16 text-center">
          <Package size={36} className="text-grey-300" />
          <p className="mt-3 text-sm font-medium text-grey-600">
            {search || categoryId ? "No products match your filters" : "No products yet"}
          </p>
          {!search && !categoryId && (
            <Link href="/hamzah/products/new" className="mt-3 text-sm font-medium text-foreground underline">
              Add your first product
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-grey-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-grey-200 text-left text-xs uppercase tracking-wide text-grey-400">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Category</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">SKU</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-grey-100 last:border-0 hover:bg-grey-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-grey-100">
                        {p.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-grey-300">
                            <Package size={16} />
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-foreground line-clamp-1 max-w-[200px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-grey-500 sm:table-cell">
                    {categoryId ? (
                      <span className="rounded-full bg-accent-50 px-2 py-0.5 text-xs font-medium text-accent">
                        {p.category?.name || "-"}
                      </span>
                    ) : (
                      p.category?.name || "-"
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-grey-400 font-mono text-xs md:table-cell">
                    {p.sku || "-"}
                  </td>
                  <td className="px-4 py-3 text-foreground">{formatPrice(p.price)}</td>
                  <td className="hidden px-4 py-3 text-grey-500 sm:table-cell">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${p.isActive ? "bg-green-50 text-green-700" : "bg-grey-100 text-grey-500"}`}>
                      {p.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/hamzah/products/${p._id}/edit`}
                        className="rounded-md p-2 text-grey-400 hover:bg-grey-100 hover:text-foreground"
                        aria-label="Edit"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => duplicate(p)}
                        disabled={busyId === p._id}
                        className="rounded-md p-2 text-grey-400 hover:bg-grey-100 hover:text-foreground disabled:opacity-50"
                        aria-label="Duplicate"
                        title="Duplicate"
                      >
                        {busyId === p._id ? <Loader2 size={15} className="animate-spin" /> : <Copy size={15} />}
                      </button>
                      <button
                        onClick={() => remove(p)}
                        className="rounded-md p-2 text-grey-400 hover:bg-grey-100 hover:text-red-600"
                        aria-label="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
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
