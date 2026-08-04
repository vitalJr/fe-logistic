import { z } from "zod";

export const categorySchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1).max(150),
  description: z.string().trim().max(500).optional(),
  active: z.boolean().default(true),
});

export type Category = z.infer<typeof categorySchema>;

export const categoryListSchema = z.array(categorySchema);

export const categoryListResponseSchema = z.object({
  items: z.array(categorySchema),
  nextCursor: z.string().nullable(),
});

export type CategoryListResponse = z.infer<typeof categoryListResponseSchema>;

export const categoryFormSchema = categorySchema.omit({ id: true });

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
