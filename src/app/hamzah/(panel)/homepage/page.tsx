"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Pencil, Loader2, Search, Home, XCircle, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";

interface Prod {
  _id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
  isActive: boolean;
  showOnHomepage: boolean;
  category?: { name?: string };
}

const MAX_VISIBLE = 6;

export default function HomepageProductsPage() {
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

  useEffect(() => {
    const t = setTimeout(() => load(search), 350);
    return () => clearTimeout(t);
  }, [search, load]);

  async function setShown(p: Prod, showOnHomepage: boolean) {
    if (!showOnHomepage && !confirm(`Remove "${p.name}" from the homepage?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${p._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showOnHomepage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast.success(showOnHomepage ? "Added to homepage" : "Removed from homepage");
      load(search);
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  const shown = products.filter((p) => p.showOnHomepage);
  const notShown = products.filter((p) => !p.showOnHomepage);

  return (
    <div>
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
          <Home size={22} className="text-accent" /> Homepage Products
        </h1>
        <p className="mt-1 text-sm text-grey-500">
          {shown.length} selected · the first {MAX_VISIBLE} show in the homepage{" "}
          <strong className="font-semibold text-foreground">“All Products”</strong> section
        </p>
      </div>

      <div className="mb-4 rounded-xl border border-grey-200 bg-white px-4 py-3 text-sm text-grey-600">
        Choose which products appear in the <strong className="font-semibold text-foreground">All Products</strong>{" "}
        section on the homepage. Only the most recent {MAX_VISIBLE} are shown there, then the next section begins.
        {shown.length > MAX_VISIBLE && (
          <span className="mt-1 block text-xs text-amber-600">
            You&apos;ve selected {shown.length}; only the newest {MAX_VISIBLE} will be visible on the homepage.
          </span>
        )}
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
            title={`On homepage (${shown.length})`}
            empty="No products selected yet. Add some below."
            rows={shown}
            maxVisible={MAX_VISIBLE}
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
                  onClick={() => setShown(p, false)}
                  className="flex items-center gap-1 rounded-md px-2 py-2 text-xs font-medium text-grey-500 hover:bg-grey-50 hover:text-red-600"
                >
                  <XCircle size={15} /> Remove
                </button>
              </div>
            )}
          />

          <Group
            title="Add to homepage"
            empty="No other products available."
            rows={notShown}
            muted
            renderActions={(p) => (
              <div className="flex items-center justify-end">
                <button
                  onClick={() => setShown(p, true)}
                  className="flex items-center gap-1.5 rounded-lg border border-grey-200 px-3 py-1.5 text-xs font-semibold text-grey-600 hover:border-accent hover:text-accent"
                >
                  <Plus size={14} /> Add
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
  maxVisible,
}: {
  title: string;
  empty: string;
  rows: Prod[];
  renderActions: (p: Prod) => React.ReactNode;
  muted?: boolean;
  maxVisible?: number;
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
              {rows.map((p, i) => {
                const hidden = maxVisible != null && i >= maxVisible;
                return (
                  <tr key={p._id} className="border-b border-grey-100 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 shrink-0 overflow-hidden rounded-md bg-grey-100 ${muted ? "opacity-80" : ""}`}>
                          {p.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-grey-300">
                              <Home size={16} />
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-foreground line-clamp-1">{p.name}</span>
                        {hidden && (
                          <span className="rounded-full bg-grey-100 px-2 py-0.5 text-[10px] font-medium text-grey-500">
                            not shown
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-grey-500 sm:table-cell">{p.category?.name || "—"}</td>
                    <td className="px-4 py-3 text-foreground">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">{renderActions(p)}</td>
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
