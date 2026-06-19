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
      {/* Mobile: horizontal scroller of cards. Desktop: 4-column divided row. */}
      <div
        className="no-scrollbar mx-auto flex max-w-[1400px] snap-x snap-proximity gap-3 overflow-x-auto px-4 py-4 [-webkit-overflow-scrolling:touch] lg:grid lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-grey-200 lg:overflow-visible lg:px-0 lg:py-0"
        style={{ touchAction: "pan-x pan-y" }}
      >
        {features.map((f) => (
          <div
            key={f.title}
            className="flex min-w-[230px] shrink-0 snap-start items-center gap-3 rounded-xl border border-grey-200 bg-white px-4 py-4 text-left sm:min-w-[250px] lg:min-w-0 lg:justify-center lg:rounded-none lg:border-0 lg:bg-transparent lg:py-5"
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
