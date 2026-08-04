import { env } from "@/lib/env";
import type { PreRegisterFormValues } from "@/schemas/preRegister";

const PRE_REGISTER_ENDPOINT = `${env.API_URL}/users/pre-register`;

// The backend field is "phone"; our form/schema calls it "contact".
const API_TO_FORM_FIELD: Record<string, string> = {
  phone: "contact",
};

export class PreRegisterApiError extends Error {
  fieldErrors: Record<string, string[]>;

  constructor(message: string, fieldErrors: Record<string, string[]>) {
    super(message);
    this.name = "PreRegisterApiError";
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
    const fieldName = API_TO_FORM_FIELD[key] ?? key;
    if (node.errors?.length) {
      fieldErrors[fieldName] = node.errors;
    }
    if (node.properties) {
      for (const [nestedKey, nestedNode] of Object.entries(node.properties)) {
        if (nestedNode.errors?.length) {
          fieldErrors[API_TO_FORM_FIELD[nestedKey] ?? nestedKey] = nestedNode.errors;
        }
      }
    }
  }

  return fieldErrors;
}

async function buildApiError(res: Response): Promise<Error> {
  const body: unknown = await res.json().catch(() => null);

  if (body && typeof body === "object" && "error" in body) {
    const { error, details } = body as { error: unknown; details?: unknown };
    const message = typeof error === "string" ? error : "Erro ao realizar o pré-cadastro.";
    return new PreRegisterApiError(message, extractFieldErrors(details));
  }

  return new Error(`Falha ao realizar o pré-cadastro: ${res.status} ${res.statusText}`);
}

export async function preRegister(data: PreRegisterFormValues): Promise<void> {
  const payload = {
    name: data.name,
    birthDate: data.birthDate,
    phone: data.contact,
    email: data.email,
    password: data.password,
    address: {
      street: data.street,
      number: data.number,
      zipCode: data.zipCode,
    },
  };

  const res = await fetch(PRE_REGISTER_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw await buildApiError(res);
  }
}
