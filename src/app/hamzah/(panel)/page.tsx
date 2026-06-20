import Link from "next/link";
import { Package, FolderTree, ShoppingCart, Users, Plus, ArrowRight } from "lucide-react";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { Category } from "@/lib/models/Category";
import { Order } from "@/lib/models/Order";
import { User } from "@/lib/models/User";

async function getStats() {
  try {
    await connectDB();
    const [products, categories, orders, customers] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
    ]);
    return { products, categories, orders, customers, ok: true };
  } catch {
    return { products: 0, categories: 0, orders: 0, customers: 0, ok: false };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "Products", value: stats.products, icon: Package, href: "/hamzah/products" },
    { label: "Categories", value: stats.categories, icon: FolderTree, href: "/hamzah/categories" },
    { label: "Orders", value: stats.orders, icon: ShoppingCart, href: "/hamzah/orders" },
    { label: "Customers", value: stats.customers, icon: Users, href: "/hamzah/customers" },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-grey-500">Welcome back, here&apos;s your store at a glance.</p>
        </div>
        <Link
          href="/hamzah/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {!stats.ok && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Database not connected yet. Add your <code className="font-mono">MONGODB_URI</code> to
          <code className="font-mono"> .env.local</code> and run <code className="font-mono">npm run seed</code>.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="group rounded-2xl border border-grey-200 bg-white p-5 transition-colors hover:border-grey-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-grey-100 text-grey-700">
                <c.icon size={20} />
              </div>
              <ArrowRight size={16} className="text-grey-300 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="mt-4 text-3xl font-semibold text-foreground">{c.value}</p>
            <p className="mt-1 text-sm text-grey-500">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <QuickAction href="/hamzah/products/new" title="Add a product" desc="Create a new product with images & SEO" />
        <QuickAction href="/hamzah/categories" title="Manage categories" desc="Add or edit categories & subcategories" />
      </div>
    </div>
  );
}

function QuickAction({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-2xl border border-grey-200 bg-white p-5 hover:border-grey-300"
    >
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-sm text-grey-500">{desc}</p>
      </div>
      <ArrowRight size={18} className="text-grey-400" />
    </Link>
  );
}
