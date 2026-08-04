import { env } from "@/lib/env";
import { authHeaders } from "@/lib/auth";
import {
  productListResponseSchema,
  productSchema,
  type Product,
  type ProductFormValues,
} from "@/schemas/product";

const PRODUCTS_ENDPOINT = `${env.API_URL}/products`;

async function parseErrorMessage(res: Response): Promise<string> {
  const body = await res.text();
  return body || `${res.status} ${res.statusText}`;
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${PRODUCTS_ENDPOINT}?limit=100`, {
    cache: "no-store",
    next: { tags: ["products", "stock"] },
    headers: await authHeaders(),
  });
  if (!res.ok) {
    throw new Error(
      `Falha ao buscar produtos: ${await parseErrorMessage(res)}`,
    );
  }
  return productListResponseSchema.parse(await res.json()).items;
}

export async function getLowStockProducts(): Promise<Product[]> {
  const res = await fetch(`${PRODUCTS_ENDPOINT}/low-stock`, {
    cache: "no-store",
    headers: await authHeaders(),
  });
  if (!res.ok) {
    throw new Error(
      `Falha ao buscar produtos com estoque baixo: ${await parseErrorMessage(res)}`,
    );
  }
  return productListResponseSchema.shape.items.parse(await res.json());
}

export async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(`${PRODUCTS_ENDPOINT}/${id}`, {
    cache: "no-store",
    headers: await authHeaders(),
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Falha ao buscar produto: ${await parseErrorMessage(res)}`);
  }
  return productSchema.parse(await res.json());
}

export async function createProduct(data: ProductFormValues): Promise<Product> {
  const res = await fetch(PRODUCTS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Falha ao criar produto: ${await parseErrorMessage(res)}`);
  }
  return productSchema.parse(await res.json());
}

export async function updateProduct(
  id: string,
  data: ProductFormValues,
): Promise<Product> {
  const res = await fetch(`${PRODUCTS_ENDPOINT}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(
      `Falha ao atualizar produto: ${await parseErrorMessage(res)}`,
    );
  }
  return productSchema.parse(await res.json());
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${PRODUCTS_ENDPOINT}/${id}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });
  if (!res.ok) {
    throw new Error(
      `Falha ao remover produto: ${await parseErrorMessage(res)}`,
    );
  }
}
