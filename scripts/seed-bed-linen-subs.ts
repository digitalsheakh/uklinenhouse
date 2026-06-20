/*
  Seed Bed Linen subcategories — run with: npx tsx scripts/seed-bed-linen-subs.ts
  Idempotent: re-running won't create duplicates.
*/
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";
import { Category } from "../src/lib/models/Category";

const PLACEHOLDER_IMG = "/category-image/linen-house-bed-linen-image.png";

const subcategories = [
  {
    name: "Duvets",
    slug: "duvets",
    image: PLACEHOLDER_IMG,
    description:
      "Premium hotel-quality duvets and duvet covers in a range of thread counts and finishes, designed for crisp comfort and lasting durability.",
    order: 1,
  },
  {
    name: "Flat Bed Sheets",
    slug: "flat-bed-sheets",
    image: PLACEHOLDER_IMG,
    description:
      "Soft, breathable flat bed sheets in classic white percale, built for the demands of hotels and the comfort of everyday use.",
    order: 2,
  },
  {
    name: "Pillow Cases",
    slug: "pillow-cases",
    image: PLACEHOLDER_IMG,
    description:
      "Smooth, hard-wearing pillow cases in 100% cotton and easy-care finishes, perfect for hospitality and home.",
    order: 3,
  },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing in .env.local");

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected.\n");

  const bed = await Category.findOne({ slug: "bed-linen" });
  if (!bed) throw new Error('"bed-linen" category not found.');

  console.log(`Parent: ${bed.name} (${bed._id})\n`);

  for (const sub of subcategories) {
    const existing = await Category.findOne({ slug: sub.slug });
    if (existing) {
      // Update parent/image/description in case they were missing.
      existing.parent      = bed._id;
      existing.image       = sub.image || existing.image;
      existing.description = existing.description || sub.description;
      existing.order       = sub.order;
      existing.isActive    = true;
      await existing.save();
      console.log(`  ✓ Updated  ${sub.name}`);
    } else {
      await Category.create({
        name:        sub.name,
        slug:        sub.slug,
        parent:      bed._id,
        image:       sub.image,
        description: sub.description,
        order:       sub.order,
        isActive:    true,
        metaTitle:        `${sub.name} | UK Linen House`,
        metaDescription:  sub.description,
      });
      console.log(`  + Created  ${sub.name}`);
    }
  }

  console.log("\nDone.");
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
