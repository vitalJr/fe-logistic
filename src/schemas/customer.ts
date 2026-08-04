import { z } from "zod";

export const customerSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1).max(150),
  taxId: z.string().trim().min(1).max(30).optional(),
  contactPerson: z.string().trim().min(1).max(150).optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().min(1).max(30).optional(),
  deliveryAddress: z.string().trim().min(1).max(300).optional(),
  note: z.string().trim().max(1000).optional(),
  active: z.boolean().default(true),
});

export type Customer = z.infer<typeof customerSchema>;

export const customerListResponseSchema = z.object({
  items: z.array(customerSchema),
  nextCursor: z.string().nullable(),
});

export type CustomerListResponse = z.infer<typeof customerListResponseSchema>;

export const customerFormSchema = customerSchema.omit({ id: true });

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
