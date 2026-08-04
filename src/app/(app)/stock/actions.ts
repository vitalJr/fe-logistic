"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import {
  createEntryFormSchema,
  createExitFormSchema,
  createAdjustmentFormSchema,
} from "@/schemas/stock";
import {
  createEntry,
  createExit,
  createAdjustment,
  StockApiError,
} from "@/lib/api/stock";

export type MovementFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

function emptyToUndefined(
  value: FormDataEntryValue | null,
): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function numberOrUndefined(
  value: FormDataEntryValue | null,
): number | undefined {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  return Number(value);
}

async function handleApiError(
  error: unknown,
  fallback: string,
): Promise<MovementFormState> {
  if (error instanceof StockApiError) {
    return {
      status: "error",
      message: error.message,
      fieldErrors: error.fieldErrors,
    };
  }
  return {
    status: "error",
    message: error instanceof Error ? error.message : fallback,
  };
}

function revalidateStock() {
  revalidatePath("/stock");
  revalidatePath("/stock/movements");
  revalidateTag("products");
  revalidateTag("stock");
}

export async function createEntryAction(
  productId: string,
  _prevState: MovementFormState,
  formData: FormData,
): Promise<MovementFormState> {
  const parsed = createEntryFormSchema.safeParse({
    productId,
    quantity: Number(formData.get("quantity")),
    unitCost: numberOrUndefined(formData.get("unitCost")),
    supplierId: emptyToUndefined(formData.get("supplierId")),
    reference: emptyToUndefined(formData.get("reference")),
    note: emptyToUndefined(formData.get("note")),
  });

  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await createEntry(parsed.data);
  } catch (error) {
    return handleApiError(error, "Erro ao registrar entrada.");
  }

  revalidateStock();
  return { status: "success" };
}

export async function createExitAction(
  productId: string,
  _prevState: MovementFormState,
  formData: FormData,
): Promise<MovementFormState> {
  const parsed = createExitFormSchema.safeParse({
    productId,
    quantity: Number(formData.get("quantity")),
    customerId: emptyToUndefined(formData.get("customerId")),
    reference: emptyToUndefined(formData.get("reference")),
    note: emptyToUndefined(formData.get("note")),
  });

  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await createExit(parsed.data);
  } catch (error) {
    return handleApiError(error, "Erro ao registrar saída.");
  }

  revalidateStock();
  return { status: "success" };
}

export async function createAdjustmentAction(
  productId: string,
  _prevState: MovementFormState,
  formData: FormData,
): Promise<MovementFormState> {
  const direction = formData.get("direction") === "decrease" ? -1 : 1;
  const rawQuantity = Number(formData.get("quantity"));

  const parsed = createAdjustmentFormSchema.safeParse({
    productId,
    quantity: Number.isNaN(rawQuantity) ? rawQuantity : rawQuantity * direction,
    reason: formData.get("reason"),
    note: emptyToUndefined(formData.get("note")),
  });

  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await createAdjustment(parsed.data);
  } catch (error) {
    return handleApiError(error, "Erro ao registrar ajuste.");
  }

  revalidateStock();
  return { status: "success" };
}
