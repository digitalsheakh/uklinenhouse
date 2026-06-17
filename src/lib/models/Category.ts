import mongoose, { Schema, model, models, Types } from "mongoose";

export interface ICategory {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  parent: Types.ObjectId | null; // null = top-level category
  description?: string;
  image?: string;
  order: number;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
  },
  { timestamps: true }
);

CategorySchema.index({ parent: 1, order: 1 });

export const Category =
  (models.Category as mongoose.Model<ICategory>) ||
  model<ICategory>("Category", CategorySchema);
