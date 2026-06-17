"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const options = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function ShopToolbar({ count }: { count: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") || "newest";

  function setSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <p className="text-sm text-grey-500">{count} product{count === 1 ? "" : "s"}</p>
      <label className="flex items-center gap-2 text-sm text-grey-500">
        Sort by
        <select
          value={current}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border border-grey-200 px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
