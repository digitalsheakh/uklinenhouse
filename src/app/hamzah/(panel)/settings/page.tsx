import { getSettings } from "@/lib/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

function mask(secret: string): string {
  if (!secret) return "";
  return `••••••••${secret.slice(-4)}`;
}

export default async function AdminSettingsPage() {
  const s = await getSettings();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-foreground">Settings</h1>
      <p className="mb-6 text-sm text-grey-500">Manage payments and store configuration.</p>

      <SettingsForm
        initial={{
          stripeEnabled: s.stripeEnabled,
          stripePublishableKey: s.stripePublishableKey,
          secretKeySet: Boolean(s.stripeSecretKey),
          webhookSecretSet: Boolean(s.stripeWebhookSecret),
          secretKeyMasked: mask(s.stripeSecretKey),
          webhookSecretMasked: mask(s.stripeWebhookSecret),
          emailEnabled: s.emailEnabled,
          smtpHost: s.smtpHost,
          smtpPort: s.smtpPort,
          smtpUser: s.smtpUser,
          emailFrom: s.emailFrom,
          orderNotifyEmail: s.orderNotifyEmail,
          smtpPassSet: Boolean(s.smtpPass),
          smtpPassMasked: mask(s.smtpPass),
        }}
      />
    </div>
  );
}
