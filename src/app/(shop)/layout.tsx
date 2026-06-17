import { ReactNode } from "react";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { getCategoryTree } from "@/lib/data";

export default async function ShopLayout({ children }: { children: ReactNode }) {
  const categories = await getCategoryTree();

  return (
    <>
      <TopBar />
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
      <CartDrawer />
    </>
  );
}
