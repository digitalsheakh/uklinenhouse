import mongoose, { Schema, model, models, Types } from "mongoose";

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IAddress {
  name?: string;
  address?: string;
  city?: string;
  postcode?: string;
  country?: string;
}

export interface IOrder {
  _id: Types.ObjectId;
  orderNumber: string; // human-friendly, e.g. "LN-001"
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  customer: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    address?: string;
    city?: string;
    postcode?: string;
    country?: string;
  };
  shippingAddress?: IAddress; // only set when "ship to a different address"
  notes?: string;
  marketingOptIn: boolean;
  paymentMethod: "card" | "bank_transfer";
  status:
    | "pending"
    | "awaiting_payment"
    | "paid"
    | "processing"
    | "shipped"
    | "completed"
    | "cancelled"
    | "abandoned";
  paymentStatus: "unpaid" | "paid" | "refunded";
  stripeSessionId?: string;
  courier?: "evri" | "parcelforce" | "dpd" | "other" | "";
  trackingNumber?: string;
  trackingUrl?: string;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const AddressSchema = new Schema<IAddress>(
  {
    name: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    postcode: { type: String, default: "" },
    country: { type: String, default: "" },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, unique: true, sparse: true, index: true },
    items: { type: [OrderItemSchema], default: [] },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, default: "" },
    total: { type: Number, required: true },
    customer: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      company: { type: String, default: "" },
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      postcode: { type: String, default: "" },
      country: { type: String, default: "" },
    },
    shippingAddress: { type: AddressSchema, default: undefined },
    notes: { type: String, default: "" },
    marketingOptIn: { type: Boolean, default: false },
    paymentMethod: {
      type: String,
      enum: ["card", "bank_transfer"],
      default: "card",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "awaiting_payment",
        "paid",
        "processing",
        "shipped",
        "completed",
        "cancelled",
        "abandoned",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    stripeSessionId: { type: String, default: "" },
    courier: { type: String, enum: ["evri", "parcelforce", "dpd", "other", ""], default: "" },
    trackingNumber: { type: String, default: "" },
    trackingUrl: { type: String, default: "" },
    adminNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Order =
  (models.Order as mongoose.Model<IOrder>) ||
  model<IOrder>("Order", OrderSchema);
