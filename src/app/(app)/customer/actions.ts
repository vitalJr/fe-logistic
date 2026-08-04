"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { customerFormSchema } from "@/schemas/customer";
import {
  createCustomer,
  updateCustomer,
  setCustomerActive,
  CustomerApiError,
} from "@/lib/api/customers";

export type CustomerFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

function emptyToUndefined(value: FormDataEntryValue | null): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function parseCustomerFormData(formData: FormData) {
  return customerFormSchema.safeParse({
    name: formData.get("name"),
    taxId: emptyToUndefined(formData.get("taxId")),
    contactPerson: emptyToUndefined(formData.get("contactPerson")),
    email: emptyToUndefined(formData.get("email")),
    phone: emptyToUndefined(formData.get("phone")),
    deliveryAddress: emptyToUndefined(formData.get("deliveryAddress")),
    note: emptyToUndefined(formData.get("note")),
    active: formData.get("active") === "on",
  });
}

async function handleApiError(error: unknown, fallback: string): Promise<CustomerFormState> {
  if (error instanceof CustomerApiError) {
    return { status: "error", message: error.message, fieldErrors: error.fieldErrors };
  }
  return {
    status: "error",
    message: error instanceof Error ? error.message : fallback,
  };
}

export async function createCustomerAction(
  _prevState: CustomerFormState,
  formData: FormData,
): Promise<CustomerFormState> {
  const parsed = parseCustomerFormData(formData);
  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await createCustomer(parsed.data);
  } catch (error) {
    return handleApiError(error, "Erro ao criar cliente.");
  }

  revalidatePath("/customer");
  redirect("/customer");
}

export async function updateCustomerAction(
  id: string,
  _prevState: CustomerFormState,
  formData: FormData,
): Promise<CustomerFormState> {
  const parsed = parseCustomerFormData(formData);
  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await updateCustomer(id, parsed.data);
  } catch (error) {
    return handleApiError(error, "Erro ao atualizar cliente.");
  }

  revalidatePath("/customer");
  return { status: "success" };
}

export async function setCustomerActiveAction(id: string, active: boolean): Promise<void> {
  await setCustomerActive(id, active);
  revalidatePath("/customer");
}
