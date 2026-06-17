import mongoose, { Schema, model, models, Types } from "mongoose";

export interface IAdmin {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, default: "Admin" },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export const Admin =
  (models.Admin as mongoose.Model<IAdmin>) ||
  model<IAdmin>("Admin", AdminSchema);
