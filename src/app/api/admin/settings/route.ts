import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { settingsSchema } from "@/lib/validation";

/** Show only the last 4 chars of a secret, never the whole thing. */
function mask(secret: string): string {
  if (!secret) return "";
  return `••••••••${secret.slice(-4)}`;
}

// GET, current settings (secrets are masked, never returned in full).
export async function GET() {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const s = await getSettings();
  return NextResponse.json({
    settings: {
      // Stripe
      stripeEnabled: s.stripeEnabled,
      stripePublishableKey: s.stripePublishableKey,
      secretKeySet: Boolean(s.stripeSecretKey),
      webhookSecretSet: Boolean(s.stripeWebhookSecret),
      secretKeyMasked: mask(s.stripeSecretKey),
      webhookSecretMasked: mask(s.stripeWebhookSecret),
      // Email
      emailEnabled: s.emailEnabled,
      smtpHost: s.smtpHost,
      smtpPort: s.smtpPort,
      smtpUser: s.smtpUser,
      emailFrom: s.emailFrom,
      orderNotifyEmail: s.orderNotifyEmail,
      smtpPassSet: Boolean(s.smtpPass),
      smtpPassMasked: mask(s.smtpPass),
    },
  });
}

// PUT, update settings. Blank secret fields keep the existing value.
export async function PUT(req: NextRequest) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const data = parsed.data;

    const s = await getSettings();

    // ---- Stripe ----
    s.stripeEnabled = data.stripeEnabled;
    s.stripePublishableKey = data.stripePublishableKey ?? "";
    if (data.stripeSecretKey?.trim()) s.stripeSecretKey = data.stripeSecretKey.trim();
    if (data.stripeWebhookSecret?.trim()) s.stripeWebhookSecret = data.stripeWebhookSecret.trim();

    // ---- Email ----
    s.emailEnabled = data.emailEnabled;
    s.smtpHost = data.smtpHost ?? "";
    s.smtpPort = data.smtpPort ?? 587;
    s.smtpUser = data.smtpUser ?? "";
    s.emailFrom = data.emailFrom ?? "";
    s.orderNotifyEmail = data.orderNotifyEmail ?? "";
    if (data.smtpPass?.trim()) s.smtpPass = data.smtpPass.trim();

    await s.save();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin settings PUT]", err);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
