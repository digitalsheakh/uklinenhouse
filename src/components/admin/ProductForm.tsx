"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import VariantsEditor, { EditorOption, EditorVariant } from "./VariantsEditor";
import { formatPrice, withVat, vatPercent } from "@/lib/utils";
import { siteConfig } from "@/config/site";

const shippingFee = siteConfig.shippingFee;

interface CatOpt {
  _id: string;
  name: string;
  parent: string | null;
}

export interface ProductFormData {
  _id?: string;
  name: string;
  brand: string;
  description: string;
  price: number | string;
  compareAtPrice: number | string;
  category: string;
  sku: string;
  stock: number | string;
  images: string[];
  options: EditorOption[];
  variants: EditorVariant[];
  featured: boolean;
  isActive: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

const blank: ProductFormData = {
  name: "",
  brand: "UK Linen House",
  description: "",
  price: "",
  compareAtPrice: "",
  category: "",
  sku: "",
  stock: "",
  images: [],
  options: [],
  variants: [],
  featured: false,
  isActive: true,
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
};

export default function ProductForm({ initial }: { initial?: ProductFormData }) {
  const router = useRouter();
  const editing = !!initial?._id;
  const [form, setForm] = useState<ProductFormData>(initial || blank);
  const [cats, setCats] = useState<CatOpt[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [dragging, setDragging] = useState(false); // file drop-zone highlight
  const [dragIndex, setDragIndex] = useState<number | null>(null); // thumbnail being reordered

  // Move an image to a new position (used for drag-to-reorder; index 0 = main image).
  function moveImage(from: number, to: number) {
    if (from === to) return;
    setForm((f) => {
      const imgs = [...f.images];
      const [moved] = imgs.splice(from, 1);
      imgs.splice(to, 0, moved);
      return { ...f, images: imgs };
    });
  }

  function addImageUrl() {
    const url = imageUrl.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url) && !url.startsWith("/")) {
      toast.error("Enter a valid image URL (https://…)");
      return;
    }
    setForm((f) => ({ ...f, images: [...f.images, url] }));
    setImageUrl("");
  }

  const set = <K extends keyof ProductFormData>(k: K, v: ProductFormData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const loadCats = useCallback(async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    if (res.ok) setCats(data.categories);
  }, []);

  useEffect(() => {
    loadCats();
  }, [loadCats]);

  // Build "Parent › Child" labels for the category dropdown
  const catLabel = (c: CatOpt) => {
    if (!c.parent) return c.name;
    const parent = cats.find((x) => x._id === c.parent);
    return parent ? `${parent.name} › ${c.name}` : c.name;
  };

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setForm((f) => ({ ...f, images: [...f.images, data.url] }));
      }
      toast.success("Image uploaded");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url: string) {
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== url) }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.category) return toast.error("Please select a category");

    // Clean options (drop empties) and variants (require a price each).
    const cleanOptions = form.options
      .filter((o) => o.name.trim() && o.values.length > 0)
      .map((o) => ({ name: o.name.trim(), values: o.values }));

    const cleanVariants = form.variants.map((v) => ({
      options: v.options,
      price: Number(v.price) || 0,
      compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : undefined,
      stock: Number(v.stock) || 0,
      sku: v.sku || "",
      image: v.image || "",
    }));

    if (cleanVariants.length === 0 && (!form.price || Number(form.price) <= 0)) {
      return toast.error("Enter a price, or add variants with prices");
    }
    if (cleanVariants.some((v) => v.price <= 0)) {
      return toast.error("Every variant needs a price");
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        brand: form.brand || "UK Linen House",
        description: form.description,
        price: Number(form.price) || (cleanVariants[0]?.price ?? 0),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
        category: form.category,
        sku: form.sku,
        stock: Number(form.stock) || 0,
        images: form.images,
        options: cleanOptions,
        variants: cleanVariants,
        featured: form.featured,
        isActive: form.isActive,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        metaKeywords: form.metaKeywords
          ? form.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
          : [],
      };
      const url = editing ? `/api/admin/products/${initial!._id}` : "/api/admin/products";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      toast.success(editing ? "Product updated" : "Product created");
      router.push("/hamzah/products");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const metaTitleLen = form.metaTitle.length;
  const metaDescLen = form.metaDescription.length;

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
      {/* Left: main details */}
      <div className="space-y-6 lg:col-span-2">
        <Card title="Product details">
          <Field label="Product name">
            <input
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="inp"
              placeholder="e.g. Premium Cotton Wet Towels (Pack of 100)"
            />
          </Field>
          <Field label="Brand" hint="Shown on the product card (like 'M&S'). Defaults to UK Linen House.">
            <input
              value={form.brand}
              onChange={(e) => set("brand", e.target.value)}
              className="inp"
              placeholder="UK Linen House"
            />
          </Field>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-grey-700">Description <span className="text-grey-400">(HTML supported)</span></label>
              <button
                type="button"
                onClick={() => setShowPreview((p) => !p)}
                className="rounded-md border border-grey-200 px-2.5 py-1 text-xs font-medium text-grey-600 hover:bg-grey-50"
              >
                {showPreview ? "Edit HTML" : "Preview"}
              </button>
            </div>

            {!showPreview && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {[
                  { label: "H2", snippet: "<h2>Heading</h2>" },
                  { label: "Paragraph", snippet: "<p>Your text here.</p>" },
                  { label: "Bold", snippet: "<strong>bold text</strong>" },
                  { label: "List", snippet: "<ul>\n  <li>Point one</li>\n  <li>Point two</li>\n</ul>" },
                  { label: "Table", snippet: "<table>\n  <tr><th>Size</th><th>Detail</th></tr>\n  <tr><td>Hand</td><td>50 x 90cm</td></tr>\n</table>" },
                ].map((b) => (
                  <button
                    key={b.label}
                    type="button"
                    onClick={() => set("description", (form.description ? form.description + "\n" : "") + b.snippet)}
                    className="rounded-md border border-grey-200 px-2 py-1 text-xs text-grey-600 hover:bg-grey-50"
                  >
                    + {b.label}
                  </button>
                ))}
              </div>
            )}

            {showPreview ? (
              <div className="min-h-[10rem] rounded-lg border border-grey-200 bg-grey-50 p-4">
                {form.description ? (
                  <div className="rich-text" dangerouslySetInnerHTML={{ __html: form.description }} />
                ) : (
                  <p className="text-sm text-grey-400">Nothing to preview yet.</p>
                )}
              </div>
            ) : (
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={8}
                className="inp font-mono text-xs"
                placeholder="<p>Describe the product…</p> — use the buttons above to insert HTML."
              />
            )}
            <p className="mt-1 text-xs text-grey-400">Write plain text or HTML. Click Preview to see how it will look on the product page.</p>
          </div>
        </Card>

        <Card title="Variants (size, colour, etc.)">
          <p className="-mt-2 mb-1 text-xs text-grey-400">
            Optional. Add options like Size or Colour, then generate variants and set a price &
            stock for each. Leave empty for a simple single-price product.
          </p>
          <VariantsEditor
            options={form.options}
            variants={form.variants}
            images={form.images}
            onChange={({ options, variants }) =>
              setForm((f) => ({ ...f, options, variants }))
            }
          />
        </Card>

        <Card title="Images">
          {/* Drag-and-drop upload zone */}
          <label
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleUpload(e.dataTransfer.files);
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
              dragging ? "border-foreground bg-accent-50 text-foreground" : "border-grey-300 text-grey-400 hover:border-foreground hover:text-foreground"
            }`}
          >
            {uploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
            <span className="text-sm font-medium">
              {uploading ? "Uploading…" : "Drag & drop images here, or click to browse"}
            </span>
            <span className="text-xs text-grey-400">The first image is the main image. Max 5MB each.</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
          </label>

          {/* Thumbnails — drag to reorder; drop into first position to set the main image */}
          {form.images.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {form.images.map((img, i) => (
                <div
                  key={img}
                  draggable
                  onDragStart={() => setDragIndex(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragIndex !== null) moveImage(dragIndex, i);
                    setDragIndex(null);
                  }}
                  onDragEnd={() => setDragIndex(null)}
                  title="Drag to reorder"
                  className={`group relative h-24 w-24 cursor-grab overflow-hidden rounded-lg border active:cursor-grabbing ${
                    i === 0 ? "border-foreground ring-2 ring-foreground/20" : "border-grey-200"
                  } ${dragIndex === i ? "opacity-50" : ""}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="h-full w-full object-cover" draggable={false} />
                  {i === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-foreground/80 py-0.5 text-center text-[10px] font-semibold text-white">
                      Main
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(img)}
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="mt-3 text-xs text-grey-400">
            Drag a thumbnail into the first position to make it the main image.
          </p>

          {/* Add image by URL */}
          <div className="mt-3 flex gap-2">
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImageUrl(); } }}
              placeholder="…or paste an image URL (https://…)"
              className="inp"
            />
            <button
              type="button"
              onClick={addImageUrl}
              className="shrink-0 rounded-lg border border-grey-200 px-4 text-sm font-medium text-grey-700 hover:bg-grey-50"
            >
              Add URL
            </button>
          </div>
        </Card>

        {/* SEO */}
        <Card title="Search engine optimisation (SEO)">
          <Field
            label="Meta title"
            hint={`${metaTitleLen} characters — aim for 50–60 for best results.`}
          >
            <div className="flex gap-2">
              <input
                value={form.metaTitle}
                onChange={(e) => set("metaTitle", e.target.value)}
                className="inp"
                placeholder="Premium Cotton Wet Towels | UK Linen House"
              />
              <button
                type="button"
                onClick={() => set("metaTitle", `${form.name} | UK Linen House`)}
                className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-grey-200 px-3 text-xs font-medium text-grey-600 hover:bg-grey-50"
                title="Generate from product name"
              >
                <Sparkles size={13} /> Auto
              </button>
            </div>
          </Field>

          <Field
            label="Meta description"
            hint={`${metaDescLen} characters — a detailed summary (150–300 chars works well for rich results).`}
          >
            <div className="space-y-2">
              <textarea
                value={form.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
                rows={4}
                className="inp"
                placeholder="A full, descriptive summary of the product for search engines — you can make this as long and detailed as the product description."
              />
              <button
                type="button"
                onClick={() => set("metaDescription", form.description.slice(0, 320))}
                className="inline-flex items-center gap-1 rounded-lg border border-grey-200 px-3 py-1.5 text-xs font-medium text-grey-600 hover:bg-grey-50"
              >
                <Sparkles size={13} /> Copy from description
              </button>
            </div>
          </Field>

          <Field label="Meta keywords" hint="Comma-separated, e.g. cotton towels, wet towels, hospitality">
            <input
              value={form.metaKeywords}
              onChange={(e) => set("metaKeywords", e.target.value)}
              className="inp"
              placeholder="cotton towels, wet towels, hospitality"
            />
          </Field>
        </Card>
      </div>

      {/* Right: meta / pricing / category */}
      <div className="space-y-6">
        <Card title="Status">
          <label className="flex items-center justify-between">
            <span className="text-sm text-grey-700">Visible on store</span>
            <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} className="h-4 w-4" />
          </label>
          <label className="mt-3 flex items-center justify-between">
            <span className="text-sm text-grey-700">Featured on homepage</span>
            <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4" />
          </label>
        </Card>

        <Card title="Category">
          <select
            required
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="inp"
          >
            <option value="">Select a category…</option>
            {cats.map((c) => (
              <option key={c._id} value={c._id}>{catLabel(c)}</option>
            ))}
          </select>
          {cats.length === 0 && (
            <p className="mt-2 text-xs text-amber-600">No categories yet — add one first.</p>
          )}
        </Card>

        <Card title="Pricing & stock">
          <p className="mb-3 rounded-lg bg-accent-50 px-3 py-2 text-xs text-accent">
            Enter all prices <strong>excluding VAT</strong>. {vatPercent}% VAT and {formatPrice(shippingFee)} shipping are added automatically at checkout.
          </p>
          <Field
            label="Price (£, ex VAT)"
            hint={
              form.variants.length > 0
                ? "Ignored. Price comes from variants below."
                : form.price
                ? `Customer pays ${formatPrice(withVat(Number(form.price) || 0))} inc. VAT (before shipping).`
                : "Base price for this product, excluding VAT."
            }
          >
            <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} className="inp" placeholder="0.00" disabled={form.variants.length > 0} />
          </Field>
          <Field label="Compare-at price (£, ex VAT)" hint="Optional. Shows a struck-through 'was' price.">
            <input type="number" step="0.01" min="0" value={form.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} className="inp" placeholder="0.00" />
          </Field>
          <Field label="Stock quantity">
            <input type="number" min="0" value={form.stock} onChange={(e) => set("stock", e.target.value)} className="inp" placeholder="0" />
          </Field>
          <Field label="SKU">
            <input value={form.sku} onChange={(e) => set("sku", e.target.value)} className="inp" placeholder="ULH-CWT-100" />
          </Field>
        </Card>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-foreground py-3 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {editing ? "Save changes" : "Create product"}
        </button>
      </div>

      <style jsx>{`
        :global(.inp) {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid var(--grey-200);
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        :global(.inp:focus) {
          border-color: var(--foreground);
        }
      `}</style>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-grey-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-grey-700">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-grey-400">{hint}</p>}
    </div>
  );
}
