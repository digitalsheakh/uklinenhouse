import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <Link href="/hamzah/products" className="mb-4 inline-flex items-center gap-1 text-sm text-grey-500 hover:text-foreground">
        <ArrowLeft size={15} /> Back to products
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-foreground">Add Product</h1>
      <ProductForm />
    </div>
  );
}
