import { z } from "zod";

export const supplierSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1).max(150),
  taxId: z.string().trim().min(1).max(30).optional(),
  contactPerson: z.string().trim().min(1).max(150).optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().min(1).max(30).optional(),
  address: z.string().trim().min(1).max(300).optional(),
  paymentTerms: z.string().trim().min(1).max(150).optional(),
  note: z.string().trim().max(1000).optional(),
  active: z.boolean().default(true),
});

export type Supplier = z.infer<typeof supplierSchema>;

export const supplierListResponseSchema = z.object({
  items: z.array(supplierSchema),
  nextCursor: z.string().nullable(),
});

export type SupplierListResponse = z.infer<typeof supplierListResponseSchema>;

export const supplierFormSchema = supplierSchema.omit({ id: true });

export type SupplierFormValues = z.infer<typeof supplierFormSchema>;
