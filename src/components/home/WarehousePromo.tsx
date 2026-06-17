import Link from "next/link";
import { Warehouse, PackageCheck, Clock, MapPin } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const points = [
  { icon: PackageCheck, title: "Stock held in the UK", text: "Thousands of items ready to ship" },
  { icon: Clock, title: "Same-day dispatch", text: "Order before 2pm on stocked lines" },
  { icon: MapPin, title: "Nationwide delivery", text: "Fast, tracked UK shipping" },
];

export default function WarehousePromo() {
  return (
    <section className="bg-foreground text-white">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-100">
              <Warehouse size={14} /> UK Warehouse
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Shipped fast from our UK warehouse
            </h2>
            <p className="mt-4 max-w-md text-grey-300">
              We hold our range in stock in the UK, so your order is picked, packed and dispatched
              quickly — no long waits, no overseas delays.
            </p>
            <Link
              href="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              Shop the range
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {points.map((p) => (
                <div key={p.title} className="flex items-start gap-3 rounded-xl bg-white/5 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                    <p.icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{p.title}</p>
                    <p className="mt-0.5 text-sm text-grey-400">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
