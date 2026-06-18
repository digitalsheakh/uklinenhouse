import mongoose, { Schema, model, models, Types } from "mongoose";

export interface IAddress {
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
  isDefault?: boolean;
}

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  addresses: IAddress[];
  emailVerified: boolean;
  // ---- Trade / wholesale ----
  accountType: "retail" | "wholesale";
  companyName?: string;
  vatNumber?: string;
  businessType?: string;
  message?: string; // optional query submitted with a trade enquiry
  approved: boolean; // wholesale accounts approved by admin
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    label: { type: String, default: "" },
    line1: { type: String, required: true },
    line2: { type: String, default: "" },
    city: { type: String, required: true },
    postcode: { type: String, required: true },
    country: { type: String, default: "United Kingdom" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, default: "" },
    addresses: { type: [AddressSchema], default: [] },
    emailVerified: { type: Boolean, default: false },
    accountType: { type: String, enum: ["retail", "wholesale"], default: "retail" },
    companyName: { type: String, default: "" },
    vatNumber: { type: String, default: "" },
    businessType: { type: String, default: "" },
    message: { type: String, default: "" },
    approved: { type: Boolean, default: true }, // retail auto-approved; wholesale set false on apply
  },
  { timestamps: true }
);

export const User =
  (models.User as mongoose.Model<IUser>) ||
  model<IUser>("User", UserSchema);
