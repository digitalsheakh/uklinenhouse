"use client";

import { Plus, X, Wand2, Tag } from "lucide-react";
import toast from "react-hot-toast";

export interface EditorOptionValue {
  value: string;
  swatch?: string;
}
export interface EditorOption {
  name: string;
  values: EditorOptionValue[];
}
export interface EditorVariant {
  options: { name: string; value: string }[];
  price: number | string;
  compareAtPrice: number | string;
  stock: number | string;
  sku: string;
  image: string;
}

const PRESETS = ["Size", "Colour", "Material", "Pack size"];
const MAX_OPTIONS = 5; // option *types* (e.g. Size, Colour). Each can hold unlimited values.

const isColour = (name: string) => /colou?r/i.test(name);
const signature = (opts: { name: string; value: string }[]) =>
  opts.map((o) => `${o.name}:${o.value}`).join("|");

export default function VariantsEditor({
  options,
  variants,
  images,
  onChange,
}: {
  options: EditorOption[];
  variants: EditorVariant[];
  images: string[];
  onChange: (next: { options: EditorOption[]; variants: EditorVariant[] }) => void;
}) {
  const setOptions = (opts: EditorOption[]) => onChange({ options: opts, variants });
  const setVariants = (vars: EditorVariant[]) => onChange({ options, variants: vars });

  function addOption(name = "") {
    if (options.length >= MAX_OPTIONS) return toast.error(`Up to ${MAX_OPTIONS} options`);
    setOptions([...options, { name, values: [] }]);
  }
  function updateOptionName(i: number, name: string) {
    const next = [...options];
    next[i] = { ...next[i], name };
    setOptions(next);
  }
  function removeOption(i: number) {
    setOptions(options.filter((_, idx) => idx !== i));
  }
  function addValue(i: number, raw: string, swatch?: string) {
    // Accept a single value or several separated by commas (e.g. "S, M, L").
    const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length === 0) return;
    const next = [...options];
    const seen = new Set(next[i].values.map((v) => v.value.toLowerCase()));
    const toAdd: EditorOptionValue[] = [];
    for (const p of parts) {
      if (!seen.has(p.toLowerCase())) {
        seen.add(p.toLowerCase());
        toAdd.push({ value: p, swatch });
      }
    }
    if (toAdd.length === 0) return;
    next[i] = { ...next[i], values: [...next[i].values, ...toAdd] };
    setOptions(next);
  }
  function removeValue(i: number, vi: number) {
    const next = [...options];
    next[i] = { ...next[i], values: next[i].values.filter((_, idx) => idx !== vi) };
    setOptions(next);
  }
  function updateSwatch(i: number, vi: number, swatch: string) {
    const next = [...options];
    const vals = [...next[i].values];
    vals[vi] = { ...vals[vi], swatch };
    next[i] = { ...next[i], values: vals };
    setOptions(next);
  }

  // Cartesian product → variant rows, preserving existing prices/stock by signature.
  function generate() {
    const valid = options.filter((o) => o.name.trim() && o.values.length > 0);
    if (valid.length === 0) return toast.error("Add at least one option with values");

    let combos: { name: string; value: string }[][] = [[]];
    for (const opt of valid) {
      const next: { name: string; value: string }[][] = [];
      for (const combo of combos) {
        for (const v of opt.values) {
          next.push([...combo, { name: opt.name, value: v.value }]);
        }
      }
      combos = next;
    }

    const existing = new Map(variants.map((v) => [signature(v.options), v]));
    const rows: EditorVariant[] = combos.map((combo) => {
      const prev = existing.get(signature(combo));
      return (
        prev || {
          options: combo,
          price: "",
          compareAtPrice: "",
          stock: "",
          sku: "",
          image: "",
        }
      );
    });
    onChange({ options, variants: rows });
    toast.success(`${rows.length} variant(s) generated`);
  }

  function updateVariant(i: number, field: keyof EditorVariant, value: string) {
    const next = [...variants];
    next[i] = { ...next[i], [field]: value };
    setVariants(next);
  }

  const variantLabel = (v: EditorVariant) => v.options.map((o) => o.value).join(" / ");

  return (
    <div className="space-y-5">
      {/* Options */}
      <div className="space-y-4">
        {options.map((opt, i) => (
          <div key={i} className="rounded-lg border border-grey-200 p-4">
            <div className="mb-3 flex items-center gap-2">
              <input
                value={opt.name}
                onChange={(e) => updateOptionName(i, e.target.value)}
                placeholder="Option name (e.g. Size, Colour, or type your own)"
                className="flex-1 rounded-lg border border-grey-200 px-3 py-2 text-sm outline-none focus:border-foreground"
                list="option-presets"
              />
              <button
                type="button"
                onClick={() => removeOption(i)}
                className="rounded-md p-2 text-grey-400 hover:bg-grey-50 hover:text-red-600"
                aria-label="Remove option"
              >
                <X size={16} />
              </button>
            </div>

            {/* Values */}
            <div className="flex flex-wrap items-center gap-2">
              {opt.values.map((v, vi) => (
                <span key={vi} className="inline-flex items-center gap-1.5 rounded-full bg-grey-100 py-1 pl-2 pr-1 text-xs">
                  {isColour(opt.name) && (
                    <input
                      type="color"
                      value={v.swatch || "#cccccc"}
                      onChange={(e) => updateSwatch(i, vi, e.target.value)}
                      className="h-4 w-4 cursor-pointer rounded-full border-0 bg-transparent p-0"
                      title="Pick colour"
                    />
                  )}
                  {v.value}
                  <button
                    type="button"
                    onClick={() => removeValue(i, vi)}
                    className="rounded-full p-0.5 text-grey-400 hover:text-red-600"
                    aria-label="Remove value"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <ValueInput colour={isColour(opt.name)} onAdd={(val, sw) => addValue(i, val, sw)} />
            </div>
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => addOption()}
            className="inline-flex items-center gap-1 rounded-lg border border-grey-200 px-3 py-2 text-sm font-medium text-grey-700 hover:bg-grey-50"
          >
            <Plus size={15} /> Add option
          </button>
          <span className="text-xs text-grey-400">Quick add:</span>
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => addOption(p)}
              className="rounded-full border border-grey-200 px-2.5 py-1 text-xs text-grey-600 hover:bg-grey-50"
            >
              {p}
            </button>
          ))}
        </div>
        <datalist id="option-presets">
          {PRESETS.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
        <p className="text-xs text-grey-400">
          An &ldquo;option&rdquo; is an attribute like Size or Colour (up to {MAX_OPTIONS}). Each option can have as
          many values as you need, for example Size: S, M, L, XL, XXL.
        </p>
      </div>

      {options.length > 0 && (
        <button
          type="button"
          onClick={generate}
          className="inline-flex items-center gap-2 rounded-lg bg-grey-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black"
        >
          <Wand2 size={15} /> Generate variants
        </button>
      )}

      {/* Variants table */}
      {variants.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-grey-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-grey-200 bg-grey-50 text-left text-xs uppercase tracking-wide text-grey-400">
                <th className="px-3 py-2 font-medium">Variant</th>
                <th className="px-3 py-2 font-medium">Price £</th>
                <th className="px-3 py-2 font-medium">Was £</th>
                <th className="px-3 py-2 font-medium">Stock</th>
                <th className="px-3 py-2 font-medium">SKU</th>
                <th className="px-3 py-2 font-medium">Image</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v, i) => (
                <tr key={signature(v.options)} className="border-b border-grey-100 last:border-0">
                  <td className="px-3 py-2 font-medium text-foreground whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <Tag size={13} className="text-grey-300" />
                      {variantLabel(v)}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" step="0.01" min="0" value={v.price}
                      onChange={(e) => updateVariant(i, "price", e.target.value)}
                      className="w-20 rounded border border-grey-200 px-2 py-1 outline-none focus:border-foreground" />
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" step="0.01" min="0" value={v.compareAtPrice}
                      onChange={(e) => updateVariant(i, "compareAtPrice", e.target.value)}
                      className="w-20 rounded border border-grey-200 px-2 py-1 outline-none focus:border-foreground" />
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" min="0" value={v.stock}
                      onChange={(e) => updateVariant(i, "stock", e.target.value)}
                      className="w-16 rounded border border-grey-200 px-2 py-1 outline-none focus:border-foreground" />
                  </td>
                  <td className="px-3 py-2">
                    <input value={v.sku}
                      onChange={(e) => updateVariant(i, "sku", e.target.value)}
                      className="w-24 rounded border border-grey-200 px-2 py-1 outline-none focus:border-foreground" />
                  </td>
                  <td className="px-3 py-2">
                    <select value={v.image}
                      onChange={(e) => updateVariant(i, "image", e.target.value)}
                      className="w-24 rounded border border-grey-200 px-2 py-1 outline-none focus:border-foreground">
                      <option value="">-</option>
                      {images.map((img, idx) => (
                        <option key={img} value={img}>Image {idx + 1}</option>
                      ))}
                    </select>
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

function ValueInput({ colour, onAdd }: { colour: boolean; onAdd: (val: string, swatch?: string) => void }) {
  const commit = (input: HTMLInputElement) => {
    if (input.value.trim()) {
      onAdd(input.value, colour ? "#cccccc" : undefined);
      input.value = "";
    }
  };
  return (
    <input
      placeholder="+ add value(s), e.g. S, M, L, Enter to add"
      className="min-w-[180px] flex-1 rounded-lg border border-dashed border-grey-300 px-2 py-1 text-xs outline-none focus:border-foreground"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === ",") {
          e.preventDefault();
          commit(e.currentTarget);
        }
      }}
      // Commit any typed value when focus leaves (e.g. clicking "Generate variants").
      onBlur={(e) => commit(e.currentTarget)}
    />
  );
}
