import Stripe from "stripe";
import { getStripeConfig } from "@/lib/settings";

/**
 * Build a Stripe client from the configured secret key (admin panel → env).
 * Returns null when no secret key is set, so callers can respond gracefully
 * instead of throwing. Server-only, never import this into a client component.
 */
export async function getStripe(): Promise<Stripe | null> {
  const { secretKey, enabled } = await getStripeConfig();
  if (!enabled || !secretKey) return null;
  return new Stripe(secretKey);
}
