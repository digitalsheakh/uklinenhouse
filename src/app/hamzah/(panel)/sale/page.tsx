"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Pencil, Loader2, Search, Tag, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";

interface Prod {
  _id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  images: string[];
  isActive: boolean;
  category?: { name?: string };
}

/** A product is "on sale" when its compare-at price is higher than its price. */
const isOnSale = (p: Prod) => !!p.compareAtPrice && p.compareAtPrice > p.price;

export default function SalePage() {
  const [products, setProducts] = useState<Prod[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(async (q = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products${q ? `?search=${encodeURIComponent(q)}` : ""}`);
      const data = await res.json();
      if (res.ok) setProducts(data.products);
      else toast.error(data.error || "Failed to load");
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => load(search), 350);
    return () => clearTimeout(t);
  }, [search, load]);

  // Remove a product from the sale by clearing its compare-at price.
  async function removeFromSale(p: Prod) {
    if (!confirm(`Remove "${p.name}" from the sale? Its price stays the same.`)) return;
    try {
      const res = await fetch(`/api/admin/products/${p._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ compareAtPrice: 0 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast.success("Removed from sale");
      load(search);
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  const saleProducts = products.filter(isOnSale);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
            <Tag size={22} className="text-red-600" /> Sale
          </h1>
          <p className="mt-1 text-sm text-grey-500">{saleProducts.length} product(s) on sale</p>
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-grey-200 bg-white px-4 py-3 text-sm text-grey-600">
        Products appear here automatically when their{" "}
        <strong className="font-semibold text-foreground">Compare-at price</strong> is set higher than the
        selling price. Set or change it in the{" "}
        <Link href="/hamzah/products" className="font-medium text-foreground underline">
          product editor
        </Link>
        .
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search sale products…"
          className="w-full rounded-lg border border-grey-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-foreground"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-grey-400">
          <Loader2 className="animate-spin" />
        </div>
      ) : saleProducts.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-grey-300 bg-white py-16 text-center">
          <Tag size={36} className="text-grey-300" />
          <p className="mt-3 text-sm font-medium text-grey-600">No products on sale</p>
          <p className="mt-1 max-w-xs text-xs text-grey-400">
            Open a product and set a Compare-at price above its selling price to put it on sale.
          </p>
          <Link href="/hamzah/products" className="mt-3 text-sm font-medium text-foreground underline">
            Go to products
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-grey-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-grey-200 text-left text-xs uppercase tracking-wide text-grey-400">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Was</th>
                <th className="px-4 py-3 font-medium">Now</th>
                <th className="px-4 py-3 font-medium">Discount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {saleProducts.map((p) => {
                const was = p.compareAtPrice!;
                const saved = was - p.price;
                const percent = Math.round((saved / was) * 100);
                return (
                  <tr key={p._id} className="border-b border-grey-100 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-grey-100">
                          {p.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-grey-300">
                              <Tag size={16} />
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-foreground line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-grey-400 line-through sm:table-cell">{formatPrice(was)}</td>
                    <td className="px-4 py-3 font-semibold text-red-600">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600">
                        -{percent}% · save {formatPrice(saved)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          p.isActive ? "bg-green-50 text-green-700" : "bg-grey-100 text-grey-500"
                        }`}
                      >
                        {p.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/hamzah/products/${p._id}/edit`}
                          className="rounded-md p-2 text-grey-400 hover:bg-grey-50 hover:text-foreground"
                          aria-label="Edit"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => removeFromSale(p)}
                          className="flex items-center gap-1 rounded-md px-2 py-2 text-xs font-medium text-grey-500 hover:bg-grey-50 hover:text-red-600"
                          aria-label="Remove from sale"
                        >
                          <XCircle size={15} /> Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
