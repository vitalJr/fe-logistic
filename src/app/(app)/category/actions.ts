"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { categoryFormSchema } from "@/schemas/category";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/api/categories";

export type CategoryFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

function parseCategoryFormData(formData: FormData) {
  const description = formData.get("description");
  return categoryFormSchema.safeParse({
    name: formData.get("name"),
    description:
      typeof description === "string" && description.trim() !== ""
        ? description
        : undefined,
    active: formData.get("active") === "on",
  });
}

export async function createCategoryAction(
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const parsed = parseCategoryFormData(formData);
  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await createCategory(parsed.data);
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Erro ao criar categoria.",
    };
  }

  revalidatePath("/category");
  redirect("/category");
}

export async function updateCategoryAction(
  id: string,
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const parsed = parseCategoryFormData(formData);
  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await updateCategory(id, parsed.data);
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Erro ao atualizar categoria.",
    };
  }

  revalidatePath("/category");
  return { status: "success" };
}

export async function deleteCategoryAction(id: string): Promise<void> {
  await deleteCategory(id);
  revalidatePath("/category");
}
