import mongoose, { Schema, model, models, Types } from "mongoose";

export interface ICoupon {
  _id: Types.ObjectId;
  code: string; // stored uppercase
  type: "percent" | "fixed";
  value: number; // percent (0-100) or fixed amount (£, ex VAT)
  minSpend: number; // minimum subtotal (ex VAT) required
  active: boolean;
  expiresAt?: Date | null;
  usageLimit?: number | null; // total times it can be used (null = unlimited)
  usedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    type: { type: String, enum: ["percent", "fixed"], default: "percent" },
    value: { type: Number, required: true, min: 0 },
    minSpend: { type: Number, default: 0, min: 0 },
    active: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Coupon =
  (models.Coupon as mongoose.Model<ICoupon>) ||
  model<ICoupon>("Coupon", CouponSchema);
