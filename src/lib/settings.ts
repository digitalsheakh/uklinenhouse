import { connectDB } from "@/lib/db";
import { Settings, ISettings } from "@/lib/models/Settings";

/**
 * Read the singleton settings document, creating it on first use.
 * Always call from server code only (it touches the database directly).
 */
export async function getSettings() {
  await connectDB();
  const existing = await Settings.findOne();
  if (existing) return existing;
  return Settings.create({});
}

/**
 * Resolve the effective Stripe configuration: admin-panel values take
 * priority, falling back to environment variables. Secrets stay server-side.
 */
export async function getStripeConfig() {
  let doc: ISettings | null = null;
  try {
    doc = await getSettings();
  } catch {
    // DB unreachable, fall back to env-only config.
  }
  return {
    enabled: doc?.stripeEnabled ?? false,
    publishableKey: doc?.stripePublishableKey || process.env.STRIPE_PUBLISHABLE_KEY || "",
    secretKey: doc?.stripeSecretKey || process.env.STRIPE_SECRET_KEY || "",
    webhookSecret: doc?.stripeWebhookSecret || process.env.STRIPE_WEBHOOK_SECRET || "",
  };
}

/**
 * Resolve the effective email (SMTP) configuration: admin-panel values take
 * priority, falling back to environment variables. Secrets stay server-side.
 */
export async function getEmailConfig() {
  let doc: ISettings | null = null;
  try {
    doc = await getSettings();
  } catch {
    // DB unreachable, fall back to env-only config.
  }
  return {
    enabled: doc?.emailEnabled ?? false,
    host: doc?.smtpHost || process.env.SMTP_HOST || "",
    port: doc?.smtpPort || Number(process.env.SMTP_PORT) || 587,
    user: doc?.smtpUser || process.env.SMTP_USER || "",
    pass: doc?.smtpPass || process.env.SMTP_PASS || "",
    from: doc?.emailFrom || process.env.EMAIL_FROM || "",
    notifyEmail: doc?.orderNotifyEmail || process.env.ORDER_NOTIFY_EMAIL || "",
  };
}
