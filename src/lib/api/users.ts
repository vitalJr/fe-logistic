import { env } from "@/lib/env";
import { authHeaders } from "@/lib/auth";
import {
  userSchema,
  type User,
  type CompleteRegisterFormValues,
} from "@/schemas/user";

const USERS_ENDPOINT = `${env.API_URL}/users`;

export class CompleteRegisterApiError extends Error {
  fieldErrors: Record<string, string[]>;

  constructor(message: string, fieldErrors: Record<string, string[]>) {
    super(message);
    this.name = "CompleteRegisterApiError";
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
    return new CompleteRegisterApiError(message, extractFieldErrors(details));
  }

  return new Error(`${fallback}: ${res.status} ${res.statusText}`);
}

export async function getUser(id: string): Promise<User> {
  const res = await fetch(`${USERS_ENDPOINT}/${id}`, {
    cache: "no-store",
    headers: await authHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Falha ao buscar usuário: ${res.status} ${res.statusText}`);
  }
  return userSchema.parse(await res.json());
}

export async function completeRegister(
  id: string,
  data: CompleteRegisterFormValues,
): Promise<User> {
  const res = await fetch(`${USERS_ENDPOINT}/${id}/complete-register`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw await buildApiError(res, "Erro ao completar cadastro.");
  }

  return userSchema.parse(await res.json());
}
