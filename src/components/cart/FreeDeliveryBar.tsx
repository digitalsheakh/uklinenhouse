import { Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/config/site";

/**
 * Shows how close the order is to qualifying for free delivery.
 * `subtotal` is the ex-VAT order value.
 */
export default function FreeDeliveryBar({ subtotal }: { subtotal: number }) {
  const threshold = siteConfig.freeDeliveryThreshold;
  const remaining = Math.max(0, threshold - subtotal);
  const pct = Math.min(100, Math.round((subtotal / threshold) * 100));
  const qualified = remaining === 0;

  return (
    <div className="rounded-lg bg-accent-50 px-3 py-2.5">
      <p className="flex items-center gap-1.5 text-xs text-foreground">
        <Truck size={14} className="shrink-0 text-accent" />
        {qualified ? (
          <span className="font-semibold text-green-700">You&apos;ve unlocked FREE delivery!</span>
        ) : (
          <span>
            Spend <span className="font-bold">{formatPrice(remaining)}</span> more for FREE delivery
          </span>
        )}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
