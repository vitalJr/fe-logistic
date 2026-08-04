import { z } from "zod";

export const productUnitSchema = z.enum([
  "UN",
  "KG",
  "L",
  "M",
  "CX",
  "PC",
  "DZ",
  "PAR",
]);

export type ProductUnit = z.infer<typeof productUnitSchema>;

export const productUnitOptions = productUnitSchema.options;

export const productSchema = z.object({
  id: z.string().trim().min(1),
  sku: z.string().trim().min(1).max(50),
  name: z.string().trim().min(1).max(150),
  categoryId: z.string().trim().min(1),
  unit: productUnitSchema,
  minStock: z.number().int().min(0),
  price: z.number().nonnegative().default(0),
  active: z.boolean().default(true),
});

export type Product = z.infer<typeof productSchema>;

export const productListResponseSchema = z.object({
  items: z.array(productSchema),
  nextCursor: z.string().nullable(),
});

export type ProductListResponse = z.infer<typeof productListResponseSchema>;

export const productFormSchema = productSchema.omit({ id: true });

export type ProductFormValues = z.infer<typeof productFormSchema>;
