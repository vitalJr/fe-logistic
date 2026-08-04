"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { productFormSchema } from "@/schemas/product";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/lib/api/products";

export type ProductFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

function parseProductFormData(formData: FormData) {
  return productFormSchema.safeParse({
    sku: formData.get("sku"),
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    unit: formData.get("unit"),
    minStock: Number(formData.get("minStock")),
    price: Number(formData.get("price")),
    active: formData.get("active") === "on",
  });
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const parsed = parseProductFormData(formData);
  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await createProduct(parsed.data);
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Erro ao criar produto.",
    };
  }

  revalidatePath("/product");
  redirect("/product");
}

export async function updateProductAction(
  id: string,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const parsed = parseProductFormData(formData);
  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await updateProduct(id, parsed.data);
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Erro ao atualizar produto.",
    };
  }

  revalidatePath("/product");
  return { status: "success" };
}

export async function deleteProductAction(id: string): Promise<void> {
  await deleteProduct(id);
  revalidatePath("/product");
}
