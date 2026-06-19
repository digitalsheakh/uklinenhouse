"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, CreditCard, KeyRound, CheckCircle2, Mail } from "lucide-react";

interface SettingsState {
  stripeEnabled: boolean;
  stripePublishableKey: string;
  secretKeySet: boolean;
  webhookSecretSet: boolean;
  secretKeyMasked: string;
  webhookSecretMasked: string;
  // Email
  emailEnabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  emailFrom: string;
  orderNotifyEmail: string;
  smtpPassSet: boolean;
  smtpPassMasked: string;
}

export default function SettingsForm({ initial }: { initial: SettingsState }) {
  const [enabled, setEnabled] = useState(initial.stripeEnabled);
  const [publishable, setPublishable] = useState(initial.stripePublishableKey);
  const [secret, setSecret] = useState("");
  const [webhook, setWebhook] = useState("");
  const [secretSet, setSecretSet] = useState(initial.secretKeySet);
  const [webhookSet, setWebhookSet] = useState(initial.webhookSecretSet);

  // Email
  const [emailEnabled, setEmailEnabled] = useState(initial.emailEnabled);
  const [smtpHost, setSmtpHost] = useState(initial.smtpHost);
  const [smtpPort, setSmtpPort] = useState(String(initial.smtpPort || 587));
  const [smtpUser, setSmtpUser] = useState(initial.smtpUser);
  const [smtpPass, setSmtpPass] = useState("");
  const [smtpPassSet, setSmtpPassSet] = useState(initial.smtpPassSet);
  const [emailFrom, setEmailFrom] = useState(initial.emailFrom);
  const [orderNotifyEmail, setOrderNotifyEmail] = useState(initial.orderNotifyEmail);

  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stripeEnabled: enabled,
          stripePublishableKey: publishable,
          // Only send secrets if the admin typed a new value.
          ...(secret.trim() ? { stripeSecretKey: secret.trim() } : {}),
          ...(webhook.trim() ? { stripeWebhookSecret: webhook.trim() } : {}),
          emailEnabled,
          smtpHost,
          smtpPort: Number(smtpPort) || 587,
          smtpUser,
          emailFrom,
          orderNotifyEmail,
          ...(smtpPass.trim() ? { smtpPass: smtpPass.trim() } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Could not save settings");
        return;
      }
      toast.success("Settings saved");
      if (secret.trim()) setSecretSet(true);
      if (webhook.trim()) setWebhookSet(true);
      if (smtpPass.trim()) setSmtpPassSet(true);
      setSecret("");
      setWebhook("");
      setSmtpPass("");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="max-w-2xl space-y-6">
      <section className="rounded-2xl border border-grey-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <CreditCard size={18} className="text-foreground" />
          <h2 className="text-base font-semibold text-foreground">Stripe payments</h2>
        </div>
        <p className="mt-1 text-sm text-grey-500">
          Enter your Stripe API keys to accept card payments at checkout. Use test keys
          (<code className="text-xs">sk_test_…</code>) while setting up, then switch to live keys when ready.
        </p>

        {/* Enable toggle */}
        <label className="mt-5 flex items-center justify-between rounded-lg border border-grey-200 px-4 py-3">
          <span>
            <span className="block text-sm font-medium text-foreground">Accept online payments</span>
            <span className="block text-xs text-grey-500">Turn on once your keys are saved.</span>
          </span>
          <button
            type="button"
            onClick={() => setEnabled((v) => !v)}
            className={`relative h-6 w-11 rounded-full transition-colors ${enabled ? "bg-accent" : "bg-grey-300"}`}
            aria-pressed={enabled}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"}`}
            />
          </button>
        </label>

        <div className="mt-5 space-y-4">
          <KeyField
            label="Publishable key"
            hint="Starts with pk_. Safe to be public."
            value={publishable}
            onChange={setPublishable}
            placeholder="pk_test_…"
          />
          <KeyField
            label="Secret key"
            hint={secretSet ? `A key is saved (${initial.secretKeyMasked}). Leave blank to keep it.` : "Starts with sk_. Kept private."}
            value={secret}
            onChange={setSecret}
            placeholder={secretSet ? "•••••••• (unchanged)" : "sk_test_…"}
            secret
            saved={secretSet}
          />
          <KeyField
            label="Webhook signing secret"
            hint={webhookSet ? `A secret is saved (${initial.webhookSecretMasked}). Leave blank to keep it.` : "Starts with whsec_. From your Stripe webhook endpoint."}
            value={webhook}
            onChange={setWebhook}
            placeholder={webhookSet ? "•••••••• (unchanged)" : "whsec_…"}
            secret
            saved={webhookSet}
          />
        </div>
      </section>

      {/* ---- Email notifications ---- */}
      <section className="rounded-2xl border border-grey-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <Mail size={18} className="text-foreground" />
          <h2 className="text-base font-semibold text-foreground">Order email notifications</h2>
        </div>
        <p className="mt-1 text-sm text-grey-500">
          Send a confirmation to the customer and an alert to your inbox when an order is paid.
          Works with any SMTP provider (Gmail, Outlook/Microsoft 365, your web host, etc.).
        </p>

        <label className="mt-5 flex items-center justify-between rounded-lg border border-grey-200 px-4 py-3">
          <span>
            <span className="block text-sm font-medium text-foreground">Send order emails</span>
            <span className="block text-xs text-grey-500">Turn on once your SMTP details are saved.</span>
          </span>
          <button
            type="button"
            onClick={() => setEmailEnabled((v) => !v)}
            className={`relative h-6 w-11 rounded-full transition-colors ${emailEnabled ? "bg-accent" : "bg-grey-300"}`}
            aria-pressed={emailEnabled}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${emailEnabled ? "translate-x-5" : "translate-x-0.5"}`}
            />
          </button>
        </label>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <TextField label="Send order alerts to" hint="Your inbox — where new-order alerts arrive." value={orderNotifyEmail} onChange={setOrderNotifyEmail} placeholder="you@uklinenhouse.co.uk" />
          <TextField label="From address" hint="The address emails are sent from." value={emailFrom} onChange={setEmailFrom} placeholder="orders@uklinenhouse.co.uk" />
          <TextField label="SMTP host" value={smtpHost} onChange={setSmtpHost} placeholder="smtp.gmail.com" />
          <TextField label="SMTP port" value={smtpPort} onChange={setSmtpPort} placeholder="587" />
          <TextField label="SMTP username" value={smtpUser} onChange={setSmtpUser} placeholder="you@gmail.com" />
          <KeyField
            label="SMTP password"
            hint={smtpPassSet ? `A password is saved (${initial.smtpPassMasked}). Leave blank to keep it.` : "App password / SMTP key. Kept private."}
            value={smtpPass}
            onChange={setSmtpPass}
            placeholder={smtpPassSet ? "•••••••• (unchanged)" : "app password"}
            secret
            saved={smtpPassSet}
          />
        </div>
      </section>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
      >
        {saving && <Loader2 size={16} className="animate-spin" />}
        Save settings
      </button>

      <p className="text-xs text-grey-400">
        Point your Stripe webhook at <code className="text-[11px]">/api/webhooks/stripe</code> and listen for{" "}
        <code className="text-[11px]">checkout.session.completed</code>.
      </p>
    </form>
  );
}

function TextField({
  label,
  hint,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-lg border border-grey-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent placeholder:text-grey-400"
      />
      {hint && <p className="mt-1 text-xs text-grey-400">{hint}</p>}
    </div>
  );
}

function KeyField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  secret,
  saved,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  secret?: boolean;
  saved?: boolean;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {saved && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-green-600">
            <CheckCircle2 size={12} /> saved
          </span>
        )}
      </div>
      <div className="flex items-center overflow-hidden rounded-lg border border-grey-300 focus-within:border-accent">
        <span className="pl-3 text-grey-400">
          <KeyRound size={16} />
        </span>
        <input
          type={secret ? "password" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-grey-400"
        />
      </div>
      <p className="mt-1 text-xs text-grey-400">{hint}</p>
    </div>
  );
}
