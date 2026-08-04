import { z } from "zod";

function nullToUndefined(value: unknown): unknown {
  return value === null ? undefined : value;
}

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
  price: z.preprocess(nullToUndefined, z.number().nonnegative().default(0)),
  active: z.boolean().default(true),
  stockQuantity: z.preprocess(nullToUndefined, z.number().default(0)),
  averageCost: z.preprocess(nullToUndefined, z.number().optional()),
  stockUpdatedAt: z.preprocess(nullToUndefined, z.string().trim().min(1).optional()),
});

export type Product = z.infer<typeof productSchema>;

export const productListResponseSchema = z.object({
  items: z.array(productSchema),
  nextCursor: z.string().nullable(),
});

export type ProductListResponse = z.infer<typeof productListResponseSchema>;

export const productFormSchema = productSchema.omit({
  id: true,
  stockQuantity: true,
  averageCost: true,
  stockUpdatedAt: true,
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
