import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const admin = await getAdmin();
  if (!admin) redirect("/hamzah/login");

  return (
    <div className="flex min-h-screen bg-grey-50">
      <AdminSidebar email={admin.email} />
      <div className="flex-1 lg:pl-64">
        <main className="mx-auto max-w-6xl px-4 pb-10 pt-20 sm:px-6 lg:pt-8">{children}</main>
      </div>
    </div>
  );
}
