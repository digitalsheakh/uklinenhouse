"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, X, FolderTree } from "lucide-react";
import toast from "react-hot-toast";

interface Cat {
  _id: string;
  name: string;
  slug: string;
  parent: string | null;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
  order: number;
}

const empty = {
  name: "",
  parent: "",
  description: "",
  metaTitle: "",
  metaDescription: "",
  isActive: true,
  order: 0,
};

export default function CategoriesPage() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Cat | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (res.ok) setCats(data.categories);
      else toast.error(data.error || "Failed to load");
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const tops = cats.filter((c) => !c.parent);
  const childrenOf = (id: string) => cats.filter((c) => c.parent === id);

  function openNew() {
    setEditing(null);
    setForm({ ...empty });
    setShowForm(true);
  }

  function openEdit(cat: Cat) {
    setEditing(cat);
    setForm({
      name: cat.name,
      parent: cat.parent || "",
      description: cat.description || "",
      metaTitle: cat.metaTitle || "",
      metaDescription: cat.metaDescription || "",
      isActive: cat.isActive,
      order: cat.order || 0,
    });
    setShowForm(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, parent: form.parent || null };
      const url = editing ? `/api/admin/categories/${editing._id}` : "/api/admin/categories";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast.success(editing ? "Category updated" : "Category created");
      setShowForm(false);
      load();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(cat: Cat) {
    if (!confirm(`Delete "${cat.name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${cat._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast.success("Deleted");
      load();
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Categories</h1>
          <p className="mt-1 text-sm text-grey-500">Manage your categories & subcategories.</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-grey-400">
          <Loader2 className="animate-spin" />
        </div>
      ) : tops.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-grey-300 bg-white py-16 text-center">
          <FolderTree size={36} className="text-grey-300" />
          <p className="mt-3 text-sm font-medium text-grey-600">No categories yet</p>
          <p className="mt-1 text-xs text-grey-400">Add your first category, or run the seed script.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tops.map((top) => (
            <div key={top._id} className="rounded-2xl border border-grey-200 bg-white">
              <Row cat={top} onEdit={openEdit} onDelete={remove} bold />
              {childrenOf(top._id).map((child) => (
                <div key={child._id} className="border-t border-grey-100 pl-8">
                  <Row cat={child} onEdit={openEdit} onDelete={remove} />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <CategoryForm
          editing={!!editing}
          form={form}
          setForm={setForm}
          tops={tops.filter((t) => t._id !== editing?._id)}
          onClose={() => setShowForm(false)}
          onSave={save}
          saving={saving}
        />
      )}
    </div>
  );
}

function Row({
  cat,
  onEdit,
  onDelete,
  bold,
}: {
  cat: Cat;
  onEdit: (c: Cat) => void;
  onDelete: (c: Cat) => void;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <div className="flex items-center gap-3">
        <span className={bold ? "text-sm font-semibold text-foreground" : "text-sm text-grey-700"}>
          {cat.name}
        </span>
        {!cat.isActive && (
          <span className="rounded-full bg-grey-100 px-2 py-0.5 text-[10px] text-grey-500">Hidden</span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => onEdit(cat)} className="rounded-md p-2 text-grey-400 hover:bg-grey-50 hover:text-foreground" aria-label="Edit">
          <Pencil size={15} />
        </button>
        <button onClick={() => onDelete(cat)} className="rounded-md p-2 text-grey-400 hover:bg-grey-50 hover:text-red-600" aria-label="Delete">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

function CategoryForm({
  editing,
  form,
  setForm,
  tops,
  onClose,
  onSave,
  saving,
}: {
  editing: boolean;
  form: typeof empty;
  setForm: React.Dispatch<React.SetStateAction<typeof empty>>;
  tops: Cat[];
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  saving: boolean;
}) {
  const set = (k: keyof typeof empty, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{editing ? "Edit Category" : "Add Category"}</h2>
          <button onClick={onClose} aria-label="Close"><X size={20} className="text-grey-500" /></button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <Field label="Name">
            <input
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full rounded-lg border border-grey-200 px-3 py-2.5 text-sm outline-none focus:border-foreground"
              placeholder="e.g. Bags"
            />
          </Field>

          <Field label="Parent category" hint="Leave as 'None' for a main category">
            <select
              value={form.parent}
              onChange={(e) => set("parent", e.target.value)}
              className="w-full rounded-lg border border-grey-200 px-3 py-2.5 text-sm outline-none focus:border-foreground"
            >
              <option value="">None (main category)</option>
              {tops.map((t) => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-grey-200 px-3 py-2.5 text-sm outline-none focus:border-foreground"
            />
          </Field>

          <div className="rounded-lg border border-grey-200 bg-grey-50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-grey-500">SEO</p>
            <Field label="Meta title">
              <input
                value={form.metaTitle}
                onChange={(e) => set("metaTitle", e.target.value)}
                className="w-full rounded-lg border border-grey-200 px-3 py-2.5 text-sm outline-none focus:border-foreground"
                placeholder="Bags | UK Linen House"
              />
            </Field>
            <div className="mt-3" />
            <Field label="Meta description">
              <textarea
                value={form.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-grey-200 px-3 py-2.5 text-sm outline-none focus:border-foreground"
                placeholder="Shop our full range of bags…"
              />
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm text-grey-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
              className="h-4 w-4"
            />
            Visible on store
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-grey-200 px-4 py-2.5 text-sm font-medium hover:bg-grey-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
            >
              {saving && <Loader2 size={15} className="animate-spin" />}
              {editing ? "Save changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
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
