"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderTree,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/hamzah", label: "Dashboard", icon: LayoutDashboard },
  { href: "/hamzah/categories", label: "Categories", icon: FolderTree },
  { href: "/hamzah/products", label: "Products", icon: Package },
  { href: "/hamzah/orders", label: "Orders", icon: ShoppingCart },
  { href: "/hamzah/customers", label: "Customers", icon: Users },
];

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    toast.success("Signed out");
    router.push("/hamzah/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/hamzah" ? pathname === "/hamzah" : pathname.startsWith(href);

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-grey-200 bg-white px-4 py-3 lg:hidden">
        <span className="text-sm font-semibold tracking-wide">UK LINEN — Admin</span>
        <button onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-grey-200 bg-white transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-grey-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <Image src="/linen-house-logo.png" alt="UK Linen House" width={36} height={24} className="h-7 w-auto object-contain" />
            <span className="text-sm font-semibold tracking-wide">Admin</span>
          </div>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-foreground text-white"
                  : "text-grey-600 hover:bg-grey-50 hover:text-foreground"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-grey-200 p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-grey-500 hover:bg-grey-50 hover:text-foreground"
          >
            <ExternalLink size={16} /> View store
          </Link>
          <div className="mt-2 px-3 py-1 text-xs text-grey-400 truncate">{email}</div>
          <button
            onClick={logout}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-grey-600 hover:bg-grey-50 hover:text-red-600"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
