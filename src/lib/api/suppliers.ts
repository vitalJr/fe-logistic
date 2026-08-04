import { env } from "@/lib/env";
import { authHeaders } from "@/lib/auth";
import {
  supplierListResponseSchema,
  supplierSchema,
  type Supplier,
  type SupplierFormValues,
} from "@/schemas/supplier";

const SUPPLIERS_ENDPOINT = `${env.API_URL}/suppliers`;

export class SupplierApiError extends Error {
  fieldErrors: Record<string, string[]>;

  constructor(message: string, fieldErrors: Record<string, string[]>) {
    super(message);
    this.name = "SupplierApiError";
    this.fieldErrors = fieldErrors;
  }
}

type ErrorTreeNode = {
  errors?: string[];
  properties?: Record<string, ErrorTreeNode>;
};

function extractFieldErrors(details: unknown): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  const properties = (details as { properties?: Record<string, ErrorTreeNode> } | undefined)
    ?.properties;
  if (!properties) return fieldErrors;

  for (const [key, node] of Object.entries(properties)) {
    if (node.errors?.length) {
      fieldErrors[key] = node.errors;
    }
  }

  return fieldErrors;
}

async function buildApiError(res: Response, fallback: string): Promise<Error> {
  const body: unknown = await res.json().catch(() => null);

  if (body && typeof body === "object" && "error" in body) {
    const { error, details } = body as { error: unknown; details?: unknown };
    const message = typeof error === "string" ? error : fallback;
    return new SupplierApiError(message, extractFieldErrors(details));
  }

  return new Error(`${fallback}: ${res.status} ${res.statusText}`);
}

export async function getSuppliers(): Promise<Supplier[]> {
  const res = await fetch(`${SUPPLIERS_ENDPOINT}?limit=100`, {
    cache: "no-store",
    headers: await authHeaders(),
  });
  if (!res.ok) {
    throw await buildApiError(res, "Falha ao buscar fornecedores.");
  }
  return supplierListResponseSchema.parse(await res.json()).items;
}

export async function getSupplier(id: string): Promise<Supplier | null> {
  const res = await fetch(`${SUPPLIERS_ENDPOINT}/${id}`, {
    cache: "no-store",
    headers: await authHeaders(),
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw await buildApiError(res, "Falha ao buscar fornecedor.");
  }
  return supplierSchema.parse(await res.json());
}

export async function createSupplier(data: SupplierFormValues): Promise<Supplier> {
  const res = await fetch(SUPPLIERS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw await buildApiError(res, "Erro ao criar fornecedor.");
  }
  return supplierSchema.parse(await res.json());
}

export async function updateSupplier(
  id: string,
  data: SupplierFormValues,
): Promise<Supplier> {
  const res = await fetch(`${SUPPLIERS_ENDPOINT}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw await buildApiError(res, "Erro ao atualizar fornecedor.");
  }
  return supplierSchema.parse(await res.json());
}

export async function setSupplierActive(id: string, active: boolean): Promise<Supplier> {
  const res = await fetch(`${SUPPLIERS_ENDPOINT}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify({ active }),
  });
  if (!res.ok) {
    throw await buildApiError(res, "Erro ao atualizar status do fornecedor.");
  }
  return supplierSchema.parse(await res.json());
}
