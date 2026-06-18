"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Pencil, Loader2, Search, Award, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";

interface Prod {
  _id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
  isActive: boolean;
  bestQuality?: boolean;
  category?: { name?: string };
}

export default function BestQualityPage() {
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

  // Toggle a product's bestQuality flag.
  async function setBestQuality(p: Prod, bestQuality: boolean) {
    if (!bestQuality && !confirm(`Remove "${p.name}" from Best Quality Products?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${p._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bestQuality }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast.success(bestQuality ? "Added to Best Quality" : "Removed from Best Quality");
      load(search);
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  const selected = products.filter((p) => p.bestQuality);
  const others = products.filter((p) => !p.bestQuality);

  return (
    <div>
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
          <Award size={22} className="text-accent" /> Best Quality Products
        </h1>
        <p className="mt-1 text-sm text-grey-500">{selected.length} product(s) shown on the homepage</p>
      </div>

      <div className="mb-4 rounded-xl border border-grey-200 bg-white px-4 py-3 text-sm text-grey-600">
        These products appear in the{" "}
        <strong className="font-semibold text-foreground">Best Quality Products</strong> section on the
        homepage. Add a product below to include it, or remove it any time.
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full rounded-lg border border-grey-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-foreground"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-grey-400">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          <Group
            title={`Best Quality (${selected.length})`}
            empty="No products yet. Add one from the list below."
            rows={selected}
            renderActions={(p) => (
              <div className="flex items-center justify-end gap-1">
                <Link
                  href={`/hamzah/products/${p._id}/edit`}
                  className="rounded-md p-2 text-grey-400 hover:bg-grey-50 hover:text-foreground"
                  aria-label="Edit"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  onClick={() => setBestQuality(p, false)}
                  className="flex items-center gap-1 rounded-md px-2 py-2 text-xs font-medium text-grey-500 hover:bg-grey-50 hover:text-red-600"
                >
                  <XCircle size={15} /> Remove
                </button>
              </div>
            )}
          />

          <Group
            title="Add to Best Quality"
            empty="No other products available."
            rows={others}
            muted
            renderActions={(p) => (
              <div className="flex items-center justify-end">
                <button
                  onClick={() => setBestQuality(p, true)}
                  className="flex items-center gap-1.5 rounded-lg border border-grey-200 px-3 py-1.5 text-xs font-semibold text-grey-600 hover:border-accent hover:text-accent"
                >
                  <Award size={14} /> Add
                </button>
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
}

function Group({
  title,
  empty,
  rows,
  renderActions,
  muted,
}: {
  title: string;
  empty: string;
  rows: Prod[];
  renderActions: (p: Prod) => React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-grey-400">{title}</h2>
      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-grey-300 bg-white px-4 py-6 text-center text-sm text-grey-400">
          {empty}
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-grey-200 bg-white">
          <table className="w-full text-sm">
            <tbody>
              {rows.map((p) => (
                <tr key={p._id} className="border-b border-grey-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 shrink-0 overflow-hidden rounded-md bg-grey-100 ${muted ? "opacity-80" : ""}`}>
                        {p.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-grey-300">
                            <Award size={16} />
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-foreground line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-grey-500 sm:table-cell">{p.category?.name || "—"}</td>
                  <td className="px-4 py-3 text-foreground">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">{renderActions(p)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
