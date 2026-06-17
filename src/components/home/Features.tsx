import { Truck, ShieldCheck, Headphones, Recycle } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const features = [
  { icon: Truck, title: "Fast UK Delivery", text: "Quick dispatch on stocked items" },
  { icon: ShieldCheck, title: "Quality Assured", text: "Premium materials, trade tested" },
  { icon: Recycle, title: "Reusable Range", text: "Eco-friendly towel options" },
  { icon: Headphones, title: "Trade Support", text: "Friendly help for businesses" },
];

export default function Features() {
  return (
    <section className="border-y border-grey-200 bg-grey-50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 sm:px-6 lg:grid-cols-4">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.05} className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-foreground shadow-sm">
              <f.icon size={20} strokeWidth={1.6} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
              <p className="mt-0.5 text-xs text-grey-500">{f.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
