"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supplierFormSchema } from "@/schemas/supplier";
import {
  createSupplier,
  updateSupplier,
  setSupplierActive,
  SupplierApiError,
} from "@/lib/api/suppliers";

export type SupplierFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

function emptyToUndefined(value: FormDataEntryValue | null): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function parseSupplierFormData(formData: FormData) {
  return supplierFormSchema.safeParse({
    name: formData.get("name"),
    taxId: emptyToUndefined(formData.get("taxId")),
    contactPerson: emptyToUndefined(formData.get("contactPerson")),
    email: emptyToUndefined(formData.get("email")),
    phone: emptyToUndefined(formData.get("phone")),
    address: emptyToUndefined(formData.get("address")),
    paymentTerms: emptyToUndefined(formData.get("paymentTerms")),
    note: emptyToUndefined(formData.get("note")),
    active: formData.get("active") === "on",
  });
}

async function handleApiError(error: unknown, fallback: string): Promise<SupplierFormState> {
  if (error instanceof SupplierApiError) {
    return { status: "error", message: error.message, fieldErrors: error.fieldErrors };
  }
  return {
    status: "error",
    message: error instanceof Error ? error.message : fallback,
  };
}

export async function createSupplierAction(
  _prevState: SupplierFormState,
  formData: FormData,
): Promise<SupplierFormState> {
  const parsed = parseSupplierFormData(formData);
  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await createSupplier(parsed.data);
  } catch (error) {
    return handleApiError(error, "Erro ao criar fornecedor.");
  }

  revalidatePath("/supplier");
  redirect("/supplier");
}

export async function updateSupplierAction(
  id: string,
  _prevState: SupplierFormState,
  formData: FormData,
): Promise<SupplierFormState> {
  const parsed = parseSupplierFormData(formData);
  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await updateSupplier(id, parsed.data);
  } catch (error) {
    return handleApiError(error, "Erro ao atualizar fornecedor.");
  }

  revalidatePath("/supplier");
  return { status: "success" };
}

export async function setSupplierActiveAction(id: string, active: boolean): Promise<void> {
  await setSupplierActive(id, active);
  revalidatePath("/supplier");
}
