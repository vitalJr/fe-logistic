import { env } from "@/lib/env";
import { authHeaders } from "@/lib/auth";
import {
  customerListResponseSchema,
  customerSchema,
  type Customer,
  type CustomerFormValues,
} from "@/schemas/customer";

const CUSTOMERS_ENDPOINT = `${env.API_URL}/customers`;

export class CustomerApiError extends Error {
  fieldErrors: Record<string, string[]>;

  constructor(message: string, fieldErrors: Record<string, string[]>) {
    super(message);
    this.name = "CustomerApiError";
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
    return new CustomerApiError(message, extractFieldErrors(details));
  }

  return new Error(`${fallback}: ${res.status} ${res.statusText}`);
}

export async function getCustomers(): Promise<Customer[]> {
  const res = await fetch(`${CUSTOMERS_ENDPOINT}?limit=100`, {
    cache: "no-store",
    headers: await authHeaders(),
  });
  if (!res.ok) {
    throw await buildApiError(res, "Falha ao buscar clientes.");
  }
  return customerListResponseSchema.parse(await res.json()).items;
}

export async function getCustomer(id: string): Promise<Customer | null> {
  const res = await fetch(`${CUSTOMERS_ENDPOINT}/${id}`, {
    cache: "no-store",
    headers: await authHeaders(),
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw await buildApiError(res, "Falha ao buscar cliente.");
  }
  return customerSchema.parse(await res.json());
}

export async function createCustomer(data: CustomerFormValues): Promise<Customer> {
  const res = await fetch(CUSTOMERS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw await buildApiError(res, "Erro ao criar cliente.");
  }
  return customerSchema.parse(await res.json());
}

export async function updateCustomer(
  id: string,
  data: CustomerFormValues,
): Promise<Customer> {
  const res = await fetch(`${CUSTOMERS_ENDPOINT}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw await buildApiError(res, "Erro ao atualizar cliente.");
  }
  return customerSchema.parse(await res.json());
}

export async function setCustomerActive(id: string, active: boolean): Promise<Customer> {
  const res = await fetch(`${CUSTOMERS_ENDPOINT}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify({ active }),
  });
  if (!res.ok) {
    throw await buildApiError(res, "Erro ao atualizar status do cliente.");
  }
  return customerSchema.parse(await res.json());
}
