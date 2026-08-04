import { env } from "@/lib/env";
import { authHeaders } from "@/lib/auth";
import {
  stockMovementSchema,
  stockMovementListResponseSchema,
  type StockMovement,
  type MovementType,
  type CreateEntryFormValues,
  type CreateExitFormValues,
  type CreateAdjustmentFormValues,
} from "@/schemas/stock";

const STOCK_ENDPOINT = `${env.API_URL}/stock`;

export class StockApiError extends Error {
  fieldErrors: Record<string, string[]>;

  constructor(message: string, fieldErrors: Record<string, string[]>) {
    super(message);
    this.name = "StockApiError";
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
    return new StockApiError(message, extractFieldErrors(details));
  }

  return new Error(`${fallback}: ${res.status} ${res.statusText}`);
}

async function postMovement(
  path: string,
  data: unknown,
  fallback: string,
): Promise<StockMovement> {
  const res = await fetch(`${STOCK_ENDPOINT}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw await buildApiError(res, fallback);
  }
  return stockMovementSchema.parse(await res.json());
}

export async function createEntry(data: CreateEntryFormValues): Promise<StockMovement> {
  return postMovement("/entries", data, "Erro ao registrar entrada.");
}

export async function createExit(data: CreateExitFormValues): Promise<StockMovement> {
  return postMovement("/exits", data, "Erro ao registrar saída.");
}

export async function createAdjustment(
  data: CreateAdjustmentFormValues,
): Promise<StockMovement> {
  return postMovement("/adjustments", data, "Erro ao registrar ajuste.");
}

export type MovementFilters = {
  productId?: string;
  type?: MovementType;
  from?: string;
  to?: string;
};

export async function getMovements(filters: MovementFilters = {}): Promise<StockMovement[]> {
  const params = new URLSearchParams({ limit: "100" });
  if (filters.productId) params.set("productId", filters.productId);
  if (filters.type) params.set("type", filters.type);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);

  const res = await fetch(`${STOCK_ENDPOINT}/movements?${params.toString()}`, {
    cache: "no-store",
    headers: await authHeaders(),
  });
  if (!res.ok) {
    throw await buildApiError(res, "Falha ao buscar movimentos.");
  }
  return stockMovementListResponseSchema.parse(await res.json()).items;
}
