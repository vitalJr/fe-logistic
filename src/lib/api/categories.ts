import { env } from "@/lib/env";
import { authHeaders } from "@/lib/auth";
import {
  categoryListResponseSchema,
  categoryListSchema,
  categorySchema,
  type Category,
  type CategoryFormValues,
} from "@/schemas/category";

const CATEGORIES_ENDPOINT = `${env.API_URL}/categories`;

async function parseErrorMessage(res: Response): Promise<string> {
  const body = await res.text();
  return body || `${res.status} ${res.statusText}`;
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(CATEGORIES_ENDPOINT, {
    cache: "no-store",
    headers: await authHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Falha ao buscar categorias: ${await parseErrorMessage(res)}`);
  }
  return categoryListResponseSchema.parse(await res.json()).items;
}

export async function getAllCategories(): Promise<Category[]> {
  const res = await fetch(`${CATEGORIES_ENDPOINT}/all`, {
    cache: "no-store",
    headers: await authHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Falha ao buscar categorias: ${await parseErrorMessage(res)}`);
  }
  const categories = categoryListSchema.parse(await res.json());
  return [...categories].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

export async function getCategory(id: string): Promise<Category | null> {
  const res = await fetch(`${CATEGORIES_ENDPOINT}/${id}`, {
    cache: "no-store",
    headers: await authHeaders(),
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Falha ao buscar categoria: ${await parseErrorMessage(res)}`);
  }
  return categorySchema.parse(await res.json());
}

export async function createCategory(data: CategoryFormValues): Promise<Category> {
  const res = await fetch(CATEGORIES_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Falha ao criar categoria: ${await parseErrorMessage(res)}`);
  }
  return categorySchema.parse(await res.json());
}

export async function updateCategory(
  id: string,
  data: CategoryFormValues,
): Promise<Category> {
  const res = await fetch(`${CATEGORIES_ENDPOINT}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Falha ao atualizar categoria: ${await parseErrorMessage(res)}`);
  }
  return categorySchema.parse(await res.json());
}

export async function deleteCategory(id: string): Promise<void> {
  const res = await fetch(`${CATEGORIES_ENDPOINT}/${id}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Falha ao remover categoria: ${await parseErrorMessage(res)}`);
  }
}
