import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(80),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const wholesaleSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(80),
  companyName: z.string().min(2, "Company name is required").max(120),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Phone number is required").max(30),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  businessType: z.string().max(80).optional(),
  vatNumber: z.string().max(40).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().optional(),
  parent: z.string().nullable().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

const optionValueSchema = z.object({
  value: z.string().min(1),
  swatch: z.string().optional(),
});

const optionSchema = z.object({
  name: z.string().min(1),
  values: z.array(optionValueSchema).min(1),
});

const variantSchema = z.object({
  options: z.array(z.object({ name: z.string(), value: z.string() })),
  price: z.number().min(0),
  compareAtPrice: z.number().min(0).optional(),
  stock: z.number().min(0).optional(),
  sku: z.string().optional(),
  image: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z.string().optional(),
  brand: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be 0 or more"),
  compareAtPrice: z.number().min(0).optional(),
  images: z.array(z.string()).optional(),
  category: z.string().min(1, "Category is required"),
  sku: z.string().optional(),
  stock: z.number().min(0).optional(),
  options: z.array(optionSchema).optional(),
  variants: z.array(variantSchema).optional(),
  featured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type ProductInput = z.infer<typeof productSchema>;
