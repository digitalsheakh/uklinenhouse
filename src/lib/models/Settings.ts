import mongoose, { Schema, model, models, Types } from "mongoose";

/**
 * Singleton store settings — currently the Stripe payment configuration.
 * There is only ever ONE document (see getSettings() in src/lib/settings.ts).
 * Secret values are stored server-side only and never returned to the browser.
 */
export interface ISettings {
  _id: Types.ObjectId;
  // Stripe
  stripeEnabled: boolean;
  stripePublishableKey: string; // safe to expose to the client
  stripeSecretKey: string; // SECRET — server only
  stripeWebhookSecret: string; // SECRET — server only
  // Email (order notifications via SMTP)
  emailEnabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string; // SECRET — server only
  emailFrom: string; // "From" address shown on emails
  orderNotifyEmail: string; // where new-order alerts are sent (your inbox)
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    stripeEnabled: { type: Boolean, default: false },
    stripePublishableKey: { type: String, default: "" },
    stripeSecretKey: { type: String, default: "" },
    stripeWebhookSecret: { type: String, default: "" },
    emailEnabled: { type: Boolean, default: false },
    smtpHost: { type: String, default: "" },
    smtpPort: { type: Number, default: 587 },
    smtpUser: { type: String, default: "" },
    smtpPass: { type: String, default: "" },
    emailFrom: { type: String, default: "" },
    orderNotifyEmail: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Settings =
  (models.Settings as mongoose.Model<ISettings>) ||
  model<ISettings>("Settings", SettingsSchema);
