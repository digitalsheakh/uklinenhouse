import { Truck, BadgePoundSterling, ShieldCheck, BadgeCheck } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Next Day Delivery",
    text: "On orders £100 or over",
  },
  {
    icon: BadgePoundSterling,
    title: "Unbeatable Prices",
    text: "Great value, every order",
  },
  {
    icon: ShieldCheck,
    title: "Secure Online Payments",
    text: "Protected checkout",
  },
  {
    icon: BadgeCheck,
    title: "100% Best Quality",
    text: "Premium products",
  },
];

export default function FeatureStrip() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="flex items-center gap-3 rounded-xl border border-grey-200 bg-grey-50 p-4 transition-colors hover:border-accent-100"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent">
              <f.icon size={22} strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{f.title}</p>
              <p className="truncate text-xs text-grey-500">{f.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
