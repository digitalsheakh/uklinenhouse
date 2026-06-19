import mongoose, { Schema, model, models, Types } from "mongoose";

/** A selectable option, e.g. { name: "Colour", values: [{ value: "Grey", swatch: "#808080" }] } */
export interface IProductOptionValue {
  value: string;
  swatch?: string; // hex colour for colour-type options
}
export interface IProductOption {
  name: string;
  values: IProductOptionValue[];
}

/** A concrete buyable combination, e.g. Colour=Grey / Size=Large with its own price & stock. */
export interface IProductVariant {
  _id?: Types.ObjectId;
  options: { name: string; value: string }[]; // ordered to match product.options
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku?: string;
  image?: string;
}

export interface IProduct {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  brand: string;
  description: string;
  price: number; // simple price, or MIN variant price when variants exist
  priceMax?: number; // MAX variant price (for "£4 – £28" ranges)
  compareAtPrice?: number;
  images: string[];
  category: Types.ObjectId;
  sku?: string;
  stock: number;
  options: IProductOption[];
  variants: IProductVariant[];
  featured: boolean;
  bestQuality: boolean;
  showOnHomepage: boolean; // appears in the homepage "All Products" section
  isActive: boolean;
  // ---- SEO ----
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const OptionValueSchema = new Schema<IProductOptionValue>(
  {
    value: { type: String, required: true },
    swatch: { type: String, default: "" },
  },
  { _id: false }
);

const OptionSchema = new Schema<IProductOption>(
  {
    name: { type: String, required: true },
    values: { type: [OptionValueSchema], default: [] },
  },
  { _id: false }
);

const VariantSchema = new Schema<IProductVariant>({
  options: {
    type: [{ name: String, value: String }],
    default: [],
  },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  sku: { type: String, default: "" },
  image: { type: String, default: "" },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    brand: { type: String, default: "UK Linen House", trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    priceMax: { type: Number, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    images: { type: [String], default: [] },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    sku: { type: String, default: "" },
    stock: { type: Number, default: 0, min: 0 },
    options: { type: [OptionSchema], default: [] },
    variants: { type: [VariantSchema], default: [] },
    featured: { type: Boolean, default: false },
    bestQuality: { type: Boolean, default: false },
    showOnHomepage: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    // ---- SEO ----
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: [String], default: [] },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ name: "text", description: "text" });

export const Product =
  (models.Product as mongoose.Model<IProduct>) ||
  model<IProduct>("Product", ProductSchema);
