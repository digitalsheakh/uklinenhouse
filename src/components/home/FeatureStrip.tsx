import { BedDouble, Leaf, Truck } from "lucide-react";

/** Simplified, crisp Union Jack rendered as inline SVG. */
function UnionJack({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={className} aria-hidden="true">
      <clipPath id="uj-clip">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id="uj-diag">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath="url(#uj-clip)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uj-diag)" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

type Feature =
  | { kind: "icon"; Icon: typeof Truck; title: string; sub: string }
  | { kind: "flag"; title: string; sub: string };

const features: Feature[] = [
  { kind: "icon", Icon: BedDouble, title: "Hotel Linen Experts", sub: "Trusted by UK hospitality" },
  { kind: "flag", title: "Proudly British Business", sub: "Family-run, based in the UK" },
  { kind: "icon", Icon: Leaf, title: "Ethically Sourced", sub: "Responsible materials" },
  { kind: "icon", Icon: Truck, title: "Free Next Day Delivery", sub: "On orders £100 or over" },
];

export default function FeatureStrip() {
  return (
    <section className="border-y border-grey-200 bg-grey-50">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-grey-200 lg:grid-cols-4 lg:divide-x">
        {features.map((f) => (
          <div
            key={f.title}
            className="flex items-center justify-center gap-3 px-4 py-5 text-left"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent">
              {f.kind === "flag" ? (
                <UnionJack className="h-5 w-auto rounded-[2px] shadow-sm ring-1 ring-black/5" />
              ) : (
                <f.Icon size={22} strokeWidth={1.8} />
              )}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight text-foreground">{f.title}</p>
              <p className="truncate text-xs text-grey-500">{f.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
