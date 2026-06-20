/*
  =====================================================================
  CATEGORY TREE, your initial categories & subcategories.
  Used to seed the database (npm run seed) and as a fallback for the
  navigation before the database is populated.
  You can add/edit/remove all of these later from the /hamzah admin panel.
  =====================================================================
*/

export interface SeedCategory {
  name: string;
  children?: SeedCategory[];
}

export const seedCategories: SeedCategory[] = [
  {
    name: "Cotton Wet Towels",
  },
  {
    name: "Tissue Wet Towels",
  },
  {
    name: "Reusable Hot Towels",
  },
  {
    name: "Air Lines Wet Towels",
  },
  {
    name: "Towel Warmer",
  },
  {
    name: "Kitchen Linen",
  },
  {
    name: "Table Linen",
    children: [{ name: "Napkins" }],
  },
  {
    name: "Bath Linen",
  },
  {
    name: "Bed Linen",
  },
  {
    name: "Bags",
    children: [
      { name: "Loop Handle Bags" },
      { name: "Loop Handle Platter Bag" },
      { name: "Loop Handle Carrier Bag Small" },
      { name: "Loop Handle Carrier Bag Large" },
      { name: "Hamper Bag" },
      { name: "Drawstring Bag" },
      { name: "High Tensile Poly Bag" },
      { name: "Clear Polythene Bags" },
      { name: "Custom Bags" },
    ],
  },
  {
    name: "Work Wear",
  },
  {
    name: "Electric Bikes",
  },
  {
    name: "Electric Items",
  },
];
