/*
  Seed script — run with:  npm run seed
  - Creates the admin account (from ADMIN_EMAIL / ADMIN_PASSWORD in .env.local)
  - Seeds the category tree from src/lib/seed-data.ts (idempotent)
*/
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Category } from "../src/lib/models/Category";
import { Admin } from "../src/lib/models/Admin";
import { seedCategories, SeedCategory } from "../src/lib/seed-data";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function seedCategory(node: SeedCategory, parent: string | null, order: number) {
  const slug = slugify(node.name);
  let cat = await Category.findOne({ slug });
  if (!cat) {
    cat = await Category.create({ name: node.name, slug, parent, order, isActive: true });
    console.log(`  + ${parent ? "  " : ""}${node.name}`);
  } else {
    console.log(`  = ${parent ? "  " : ""}${node.name} (exists)`);
  }
  if (node.children) {
    let childOrder = 0;
    for (const child of node.children) {
      await seedCategory(child, String(cat._id), childOrder++);
    }
  }
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing in .env.local");

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected.\n");

  // --- Admin ---
  const email = (process.env.ADMIN_EMAIL || "admin@uklinenhouse.co.uk").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const existingAdmin = await Admin.findOne({ email });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ name: "Admin", email, passwordHash });
    console.log(`Admin created: ${email} (password from .env.local)\n`);
  } else {
    console.log(`Admin already exists: ${email}\n`);
  }

  // --- Categories ---
  console.log("Seeding categories:");
  let order = 0;
  for (const node of seedCategories) {
    await seedCategory(node, null, order++);
  }

  console.log("\nDone.");
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
