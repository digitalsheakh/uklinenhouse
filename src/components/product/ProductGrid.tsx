import { ProductCard as TProductCard } from "@/lib/data";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: TProductCard[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
