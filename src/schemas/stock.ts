import { z } from "zod";

export const movementTypeSchema = z.enum(["entry", "exit", "adjustment"]);

export type MovementType = z.infer<typeof movementTypeSchema>;

export const stockMovementSchema = z.object({
  id: z.string().trim().min(1),
  type: movementTypeSchema,
  productId: z.string().trim().min(1),
  quantity: z.number(),
  userId: z.string().trim().min(1),
  createdAt: z.string().trim().min(1),
  unitCost: z.number().optional(),
  supplierId: z.string().trim().min(1).optional(),
  customerId: z.string().trim().min(1).optional(),
  reason: z.string().trim().min(1).optional(),
  reference: z.string().trim().min(1).optional(),
  note: z.string().trim().optional(),
});

export type StockMovement = z.infer<typeof stockMovementSchema>;

export const stockMovementListResponseSchema = z.object({
  items: z.array(stockMovementSchema),
  nextCursor: z.string().nullable(),
});

export type StockMovementListResponse = z.infer<typeof stockMovementListResponseSchema>;

export const createEntryFormSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.number().positive(),
  unitCost: z.number().nonnegative().optional(),
  supplierId: z.string().trim().min(1).optional(),
  reference: z.string().trim().min(1).max(100).optional(),
  note: z.string().trim().max(1000).optional(),
});

export type CreateEntryFormValues = z.infer<typeof createEntryFormSchema>;

export const createExitFormSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.number().positive(),
  customerId: z.string().trim().min(1).optional(),
  reference: z.string().trim().min(1).max(100).optional(),
  note: z.string().trim().max(1000).optional(),
});

export type CreateExitFormValues = z.infer<typeof createExitFormSchema>;

export const createAdjustmentFormSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.number().refine((value) => value !== 0, {
    message: "A quantidade do ajuste não pode ser zero",
  }),
  reason: z.string().trim().min(1).max(200),
  note: z.string().trim().max(1000).optional(),
});

export type CreateAdjustmentFormValues = z.infer<typeof createAdjustmentFormSchema>;
