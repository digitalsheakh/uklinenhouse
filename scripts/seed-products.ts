/*
  Product seed/sync script — run with:  npx tsx scripts/seed-products.ts
  ─────────────────────────────────────────────────────────────────────
  1. Removes the old duplicate WWCJAC/WWAPRN-SKU work-wear products
     (they were the first seeded batch with wrong SKUs).
  2. Updates the existing UKLH-style products with full verified details.
  3. Seeds every bag product from frnhz.com/product-category/bags/
  All operations are idempotent (safe to re-run).
*/
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";
import { Category } from "../src/lib/models/Category";
import { Product } from "../src/lib/models/Product";

// ─── helpers ────────────────────────────────────────────────────────────────

function slugify(s: string) {
  return s.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

async function uniqueSlug(base: string, excludeId?: string) {
  let slug = base; let n = 1;
  while (true) {
    const q: Record<string, unknown> = { slug };
    if (excludeId) q._id = { $ne: new mongoose.Types.ObjectId(excludeId) };
    const existing = await Product.findOne(q);
    if (!existing) return slug;
    slug = `${base}-${n++}`;
  }
}

function sizeOpts(sizes: string[]) {
  return [{ name: "Size", values: sizes.map(v => ({ value: v, swatch: "" })) }];
}

function sizeVariants(sizes: string[], price: number) {
  return sizes.map(sz => ({
    options: [{ name: "Size", value: sz }],
    price, compareAtPrice: undefined as number | undefined,
    stock: 100, sku: "", image: "",
  }));
}

function colourOpts(colours: string[]) {
  return [{ name: "Colour", values: colours.map(v => ({ value: v, swatch: "" })) }];
}

function colourVariants(colours: string[], price: number) {
  return colours.map(c => ({
    options: [{ name: "Colour", value: c }],
    price, compareAtPrice: undefined as number | undefined,
    stock: 100, sku: "", image: "",
  }));
}

function sizeColourVariants(sizes: string[], colours: string[], price: number) {
  const variants = [];
  for (const sz of sizes) {
    for (const cl of colours) {
      variants.push({
        options: [{ name: "Size", value: sz }, { name: "Colour", value: cl }],
        price, compareAtPrice: undefined as number | undefined,
        stock: 100, sku: "", image: "",
      });
    }
  }
  return variants;
}

function quantityOpts(options: string[]) {
  return [{ name: "Size", values: options.map(v => ({ value: v, swatch: "" })) }];
}

function quantityVariants(options: { label: string; price: number }[]) {
  return options.map(o => ({
    options: [{ name: "Size", value: o.label }],
    price: o.price, compareAtPrice: undefined as number | undefined,
    stock: 500, sku: "", image: "",
  }));
}

// ─── descriptions ───────────────────────────────────────────────────────────

const D = {
  chefJacket: `<ul>
<li>Made from poly cotton fabrics — combining the comfort of cotton with the durability of polyester</li>
<li>Easy to Care &amp; Machine Washable</li>
<li>Strong and Durable construction</li>
<li>Snap Buttons for easy fastening</li>
<li>Customise with Embroidered Logo</li>
<li>Available in Long and Short Sleeve</li>
<li>Available in Black and White</li>
<li>FRNHZ Int. Famous Chef Jackets</li>
<li>Orders placed by 12PM will be dispatched Same Working Day</li>
</ul>`,

  workCoat: `<ul>
<li>Made from poly-cotton fabric combining comfort of cotton with durability of polyester</li>
<li>Long sleeves providing protection against spills and splashes</li>
<li>Three pockets for practical storage</li>
<li>Easy Care Fabric — Machine Washable</li>
<li>Strong and Durable construction</li>
<li>Easy fastenings for quick on/off</li>
<li>Suitable for chefs, cooks, medical professionals and lab workers</li>
<li>Customise with Embroidered Logo</li>
<li>Orders placed by 12pm will be dispatched Same Working Day</li>
</ul>`,

  chefTrouser: `<ul>
<li>Made from poly-cotton fabrics — easy care and highly durable</li>
<li>Elasticated waistband with adjustable drawstring for a comfortable fit</li>
<li>Easy Care Fabric — Machine Washable</li>
<li>Strong and Durable</li>
<li>Professional appearance for kitchen uniforms</li>
<li>Customise with Embroidered Logo</li>
<li>Competitive Price</li>
<li>FRNHZ Int. Chef Trousers</li>
<li>Orders placed by 12pm will be dispatched Same Working Day</li>
</ul>`,

  apron: `<ul>
<li>Made from poly-cotton fabrics — comfortable and easy to clean</li>
<li>Long ties for adjustable fit around waist and neck</li>
<li>Easy to Care &amp; Machine Washable</li>
<li>Strong and Durable</li>
<li>Professional appearance for hospitality and food service staff</li>
<li>Competitive Price</li>
<li>Orders placed by 12PM will be dispatched Same Working Day</li>
</ul>`,

  loopHandlePlatter: `<ul>
<li>Attractive luxurious printed carrier bag to make your customer feel extra special</li>
<li>250 pieces per box</li>
<li>HDPE Virgin Material — 60 micron thick</li>
<li>Dimensions: W325 x H235 x D220mm</li>
<li>Holds up to 9-inch x 9-inch standard containers — ideal for platters, desserts and chocolates</li>
<li>Loop handles for added strength and elegance</li>
<li>Customise with your Logo</li>
<li>Strong and Durable</li>
<li>Recyclable</li>
<li>Orders placed by 12pm will be dispatched Same Working Day</li>
</ul>`,

  loopHandleSmall: `<ul>
<li>Attractive luxurious printed loop handle takeaway bag</li>
<li>500 pieces per box</li>
<li>HDPE Virgin Material — 50 micron thick plastic</li>
<li>Dimensions: W27cm x H26cm x Sides 15cm</li>
<li>Holds up to 10 standard 500ml containers — suitable for 5–7 kg weight</li>
<li>Cardboard-reinforced loop handles for strength and elegance</li>
<li>Customise with your Logo</li>
<li>Strong and Durable</li>
<li>Recyclable</li>
<li>Orders placed by 12pm will be dispatched Same Working Day</li>
</ul>`,

  loopHandleLarge: `<ul>
<li>Attractive luxurious printed loop handle takeaway bag</li>
<li>500 pieces per box</li>
<li>HDPE Virgin Material — 50 micron thick plastic</li>
<li>Dimensions: W26cm x H36.5cm x Sides 15cm</li>
<li>Holds up to 10 standard 500ml containers — suitable for hot and cold food transport</li>
<li>Cardboard-reinforced loop handles for strength and elegance</li>
<li>Customise with your Logo</li>
<li>Strong and Durable</li>
<li>Recyclable</li>
<li>Orders placed by 12pm will be dispatched Same Working Day</li>
</ul>`,

  hamperBag: `<ul>
<li>Made from heat set polyester fabric — commercial grade and highly durable</li>
<li>Reinforced webbing carry handles for easy transportation</li>
<li>Shrink and buckle closure system</li>
<li>Large capacity — suitable for hotels, hospitals, care homes, laundrettes and domestic use</li>
<li>Strong and Durable for daily heavy-duty use</li>
<li>Easy to Use</li>
<li>Orders placed by 12pm will be dispatched Same Working Day</li>
</ul>`,

  drawstringBag: `<ul>
<li>Extra large capacity for heavy loads</li>
<li>Strong drawstring closure mechanism</li>
<li>Made from durable commercial-grade fabric</li>
<li>Suitable for laundry, hamper storage and transport</li>
<li>Ideal for hotels, hospitals, student accommodation and travel</li>
<li>Easy to Use</li>
<li>Orders placed by 12pm will be dispatched Same Working Day</li>
</ul>`,

  highTensile: `<ul>
<li>High tensile polythene construction — 22 micron thick</li>
<li>500 pieces per box</li>
<li>Available in three sizes: 18×24", 20×30", 24×36"</li>
<li>Safe and hygienic protection against dirt, dust and moisture</li>
<li>Heat-seal capable for secure packaging</li>
<li>Strong and Durable</li>
<li>Recyclable</li>
<li>Free shipping on orders of 2+ boxes</li>
<li>Orders placed by 12pm will be dispatched Same Working Day</li>
</ul>`,

  clearPolythene: `<ul>
<li>Clear polythene multi-purpose packaging bags</li>
<li>500 pieces per box</li>
<li>20 micron thick — strong and lightweight</li>
<li>Dimensions: 20" x 30"</li>
<li>Safe and hygienic protection against dirt, dust and moisture</li>
<li>Strong and Durable</li>
<li>Recyclable</li>
<li>Orders placed by 12pm will be dispatched Same Working Day</li>
</ul>`,
};

// ─── Chef jacket sizes ───────────────────────────────────────────────────────
const CHEF_SIZES    = ['XXS(36")', 'XS(38")', 'S(40")', 'M(42")', 'L(44")', 'XL(46")', 'XXL(48")', 'XXXL(50")'];
const COAT_SIZES    = ['XS(38")', 'S(40")', 'M(42")', 'L(44")', 'XL(46")', 'XXL(48")'];
const TROUSER_SIZES = ['XS(38")', 'S(40")', 'M(42")', 'L(44")', 'XL(46")', 'XXL(48")'];

const APRON_COLOURS = ["Black", "White", "Black & White Striped", "Navy Blue & White Striped", "Red & White Striped"];

const HAMPER_COLOURS    = ["Black", "Blue", "Green", "Pink", "Red", "White", "Yellow", "Grey"];
const DRAWSTRING_COLOURS = ["Black", "Blue", "Green", "Red", "White", "Brown", "Grey", "Peacock Blue", "Violet"];
const PLATTER_COLOURS   = ["Black/Gold", "White/Gold"];
const LOOP_SMALL_COLOURS = ["Orange/Black", "Black/Silver", "Burgundy/Silver", "Purple/Silver", "White/Gold", "White/Purple", "White/Red"];
const LOOP_LARGE_COLOURS = ["Orange/Black", "Black/Silver", "Burgundy/Silver", "Gold/Black", "Navy Blue", "Neon Green", "Purple/Silver", "White/Gold", "White/Purple", "White/Red"];

// ─── Old SKUs to DELETE (duplicates with wrong WWCJAC-style SKU) ─────────────
const DELETE_SKUS = [
  "WWCJAC1000/001-1-3",
  "WWCJAC1000/001-1-2",
  "WWCJAC1000/001-1-4",
  "WWCJAC1000/001-1-1",
  "WWCCWT1000/001",
  "WWCTR1000/001",
  "WWCTR1000/001-1",
  "WWAPRN1000/001",
  "WWAPRN1000/001-3",
  "WWAPRN1000/001-1",
  "APRNSWHITE/1000-1",
  "WWAPRN1000/001-5",
  "WWAPRN1000/001-4",
];

// ─── Work-wear: update existing UKLH products with verified details ───────────
interface WwUpdate {
  sku: string;
  name: string;
  newSku?: string;          // rename if needed
  description: string;
  price: number;
  sizes?: string[];
  colours?: string[];       // for aprons (colour variants, one size)
  metaKeywords: string[];
}

const WW_UPDATES: WwUpdate[] = [
  {
    sku: "UKLH-CJLS-BLK",
    name: "Black Chef Jacket Unisex Long Sleeve Professional Work Wear",
    description: D.chefJacket,
    price: 6.67,
    sizes: CHEF_SIZES,
    metaKeywords: ["chef jacket", "black", "long sleeve", "unisex", "work wear", "hospitality"],
  },
  {
    sku: "UKLH-CJSS-BLK",
    name: "Black Chef Jacket Unisex Short Sleeve Professional Work Wear",
    description: D.chefJacket,
    price: 6.67,
    sizes: CHEF_SIZES,
    metaKeywords: ["chef jacket", "black", "short sleeve", "unisex", "work wear", "hospitality"],
  },
  {
    sku: "UKLH-CJLS-WHT",
    name: "White Chef Jacket Unisex Long Sleeve Professional Work Wear",
    description: D.chefJacket,
    price: 6.67,
    sizes: CHEF_SIZES,
    metaKeywords: ["chef jacket", "white", "long sleeve", "unisex", "work wear", "hospitality"],
  },
  {
    sku: "UKLH-CJSS-WHT",
    name: "White Chef Jacket Unisex Short Sleeve Professional Work Wear",
    description: D.chefJacket,
    price: 6.67,
    sizes: CHEF_SIZES,
    metaKeywords: ["chef jacket", "white", "short sleeve", "unisex", "work wear"],
  },
  {
    sku: "UKLH-WCLS-WHT",
    name: "Work Coat Unisex White Long Sleeve Professional Chef & Lab Coat",
    description: D.workCoat,
    price: 7.42,
    sizes: COAT_SIZES,
    metaKeywords: ["work coat", "white", "chef coat", "lab coat", "unisex", "long sleeve"],
  },
];

// ─── New work-wear products (not yet in DB) ──────────────────────────────────
interface NewProduct {
  sku: string;
  name: string;
  description: string;
  price: number;
  priceMax?: number;
  categorySlug: string;
  sizes?: string[];
  colours?: string[];
  variants?: { label: string; price: number }[];
  metaKeywords: string[];
}

const NEW_PRODUCTS: NewProduct[] = [
  // ── Chef trouser (black) ──────────────────────────────────────────────────
  {
    sku: "UKLH-CTR-BLK",
    name: "Black Chef Trouser Professional Work Wear",
    description: D.chefTrouser,
    price: 7.42,
    categorySlug: "work-wear",
    sizes: TROUSER_SIZES,
    metaKeywords: ["chef trouser", "black", "work wear", "hospitality", "kitchen"],
  },
  // ── Chef trouser (white blue check) ──────────────────────────────────────
  {
    sku: "UKLH-CTR-WBC",
    name: "Chef Trouser White Blue Check Professional Work Wear",
    description: D.chefTrouser,
    price: 7.42,
    categorySlug: "work-wear",
    sizes: TROUSER_SIZES,
    metaKeywords: ["chef trouser", "white blue check", "work wear", "hospitality"],
  },
  // ── Aprons (colour variants) ─────────────────────────────────────────────
  {
    sku: "UKLH-APRN-BLK",
    name: "Unisex Adult Plain Apron Black Professional Work Wear",
    description: D.apron,
    price: 3.25,
    categorySlug: "work-wear",
    colours: ["One Size"],
    metaKeywords: ["apron", "black", "plain", "unisex", "work wear", "hospitality"],
  },
  {
    sku: "UKLH-APRN-WHT",
    name: "Unisex Adult Plain White Apron Professional Work Wear",
    description: D.apron,
    price: 3.25,
    categorySlug: "work-wear",
    colours: ["One Size"],
    metaKeywords: ["apron", "white", "plain", "unisex", "work wear"],
  },
  {
    sku: "UKLH-APRN-BWS",
    name: "Unisex Adult Black White Striped Apron Professional Work Wear",
    description: D.apron,
    price: 3.25,
    categorySlug: "work-wear",
    colours: ["One Size"],
    metaKeywords: ["apron", "black white striped", "unisex", "work wear"],
  },
  {
    sku: "UKLH-APRN-NWS",
    name: "Unisex Adult Apron Navy Blue White Striped Professional Work Wear",
    description: D.apron,
    price: 3.25,
    categorySlug: "work-wear",
    colours: ["One Size"],
    metaKeywords: ["apron", "navy blue", "white striped", "unisex", "work wear"],
  },
  {
    sku: "UKLH-APRN-RWS",
    name: "Unisex Adult Red White Striped Apron Professional Work Wear",
    description: D.apron,
    price: 3.25,
    categorySlug: "work-wear",
    colours: ["One Size"],
    metaKeywords: ["apron", "red white striped", "unisex", "work wear"],
  },
  // ── Bags ─────────────────────────────────────────────────────────────────
  {
    sku: "UKLH-LHPB-250",
    name: "Loop Handle Platter Bag 250pc Box Premium Carrier Bags",
    description: D.loopHandlePlatter,
    price: 30.83,
    categorySlug: "loop-handle-platter-bag",
    colours: PLATTER_COLOURS,
    metaKeywords: ["platter bag", "loop handle", "carrier bag", "takeaway", "HDPE"],
  },
  {
    sku: "UKLH-LHSM-500",
    name: "Loop Handle Takeaway Bags Small 500pc Box Recyclable Carrier Bags",
    description: D.loopHandleSmall,
    price: 50.00,
    categorySlug: "loop-handle-carrier-bag-small",
    colours: LOOP_SMALL_COLOURS,
    metaKeywords: ["loop handle bag", "takeaway bag", "small", "500pc", "HDPE", "recyclable"],
  },
  {
    sku: "UKLH-LHLG-500",
    name: "Loop Handle Takeaway Bags Large 500pc Box Recyclable Carrier Bags",
    description: D.loopHandleLarge,
    price: 58.33,
    categorySlug: "loop-handle-carrier-bag-large",
    colours: LOOP_LARGE_COLOURS,
    metaKeywords: ["loop handle bag", "takeaway bag", "large", "500pc", "HDPE", "recyclable"],
  },
  {
    sku: "UKLH-HMPB-STD",
    name: "Large Capacity Hamper Bag Heavy Duty Laundry & Storage Bag",
    description: D.hamperBag,
    price: 5.50,
    categorySlug: "hamper-bag",
    colours: HAMPER_COLOURS,
    metaKeywords: ["hamper bag", "laundry bag", "heavy duty", "hotel", "hospital"],
  },
  {
    sku: "UKLH-DRSB-XL",
    name: "Extra Large Heavy Duty Drawstring Bag Multi-Purpose Storage Bag",
    description: D.drawstringBag,
    price: 5.50,
    categorySlug: "drawstring-bag",
    colours: DRAWSTRING_COLOURS,
    metaKeywords: ["drawstring bag", "extra large", "heavy duty", "laundry", "storage"],
  },
  {
    sku: "UKLH-HTPB-500",
    name: "High Tensile Poly Bag 500pc Box Multi-Purpose Polythene Packaging Bags",
    description: D.highTensile,
    price: 31.33,
    priceMax: 39.33,
    categorySlug: "high-tensile-poly-bag",
    variants: [
      { label: '18"×24" — 500pc', price: 31.33 },
      { label: '20"×30" — 500pc', price: 35.33 },
      { label: '24"×36" — 500pc', price: 39.33 },
    ],
    metaKeywords: ["poly bag", "polythene bag", "packaging", "500pc", "high tensile"],
  },
  {
    sku: "UKLH-CLPB-500",
    name: "Clear Polythene Bags 500pc Box Multi-Purpose Packaging Bags 20x30 Inch",
    description: D.clearPolythene,
    price: 27.50,
    categorySlug: "clear-polythene-bags",
    colours: ["One Size — 20\"×30\""],
    metaKeywords: ["clear polythene bag", "packaging bag", "500pc", "20x30"],
  },
];

// ─── main ────────────────────────────────────────────────────────────────────

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing in .env.local");

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected.\n");

  // 1. Delete old duplicate products (wrong SKU format)
  console.log("── Removing old duplicate SKUs ──");
  for (const sku of DELETE_SKUS) {
    const deleted = await Product.deleteOne({ sku });
    if (deleted.deletedCount) console.log(`  ✗ Deleted  ${sku}`);
    else console.log(`  - Not found ${sku} (already gone)`);
  }

  // 2. Update existing UKLH work-wear products with full verified details
  console.log("\n── Updating existing work-wear products ──");
  const wwCat = await Category.findOne({ slug: "work-wear" });
  if (!wwCat) throw new Error("work-wear category not found");

  for (const u of WW_UPDATES) {
    const prod = await Product.findOne({ sku: u.sku });
    if (!prod) { console.log(`  ? Not found  ${u.sku} — skipping`); continue; }

    const opts  = u.sizes ? sizeOpts(u.sizes) : colourOpts(u.colours ?? ["One Size"]);
    const vars  = u.sizes ? sizeVariants(u.sizes, u.price) : colourVariants(u.colours ?? ["One Size"], u.price);

    prod.name        = u.name;
    prod.sku         = u.newSku ?? u.sku;
    prod.description = u.description;
    prod.price       = u.price;
    prod.priceMax    = u.price;
    prod.category    = wwCat._id;
    prod.brand       = "UK Linen House";
    prod.options     = opts as typeof prod.options;
    prod.variants    = vars as typeof prod.variants;
    prod.metaTitle   = `${u.name} | UK Linen House`;
    prod.metaDescription = `Buy ${u.name} from UK Linen House. Premium quality workwear, fast UK delivery.`;
    prod.metaKeywords = u.metaKeywords;
    prod.isActive    = true;
    await prod.save();
    console.log(`  ✓ Updated   ${u.sku} — ${u.name}`);
  }

  // 3. Seed new products (idempotent by SKU)
  console.log("\n── Seeding new products ──");
  let created = 0; let skipped = 0;

  for (const p of NEW_PRODUCTS) {
    const existing = await Product.findOne({ sku: p.sku });
    if (existing) { console.log(`  = Exists   ${p.sku}`); skipped++; continue; }

    const cat = await Category.findOne({ slug: p.categorySlug });
    if (!cat) { console.warn(`  ! Category not found: ${p.categorySlug} — skipping "${p.name}"`); continue; }

    const slug = await uniqueSlug(slugify(p.name));

    let options: object[], variants: object[];
    if (p.variants) {
      options  = quantityOpts(p.variants.map(v => v.label));
      variants = quantityVariants(p.variants);
    } else if (p.colours && p.colours.length) {
      options  = colourOpts(p.colours);
      variants = colourVariants(p.colours, p.price);
    } else if (p.sizes && p.sizes.length) {
      options  = sizeOpts(p.sizes);
      variants = sizeVariants(p.sizes, p.price);
    } else {
      options = []; variants = [];
    }

    const priceMax = p.priceMax ?? (p.variants ? Math.max(...p.variants.map(v => v.price)) : p.price);

    await Product.create({
      name: p.name, slug, sku: p.sku,
      brand: "UK Linen House",
      description: p.description,
      price: p.price, priceMax,
      images: [],
      category: cat._id,
      stock: 0,
      options, variants,
      featured: false, bestQuality: false, showOnHomepage: false,
      isActive: true,
      metaTitle: `${p.name} | UK Linen House`,
      metaDescription: `Buy ${p.name} from UK Linen House. Fast UK delivery, competitive pricing.`,
      metaKeywords: p.metaKeywords,
    });

    console.log(`  + Created  ${p.sku} — ${p.name}`);
    created++;
  }

  console.log(`\n✓ Done. ${created} products created, ${skipped} already existed.`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
