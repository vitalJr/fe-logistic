import { env } from "@/lib/env";
import { authHeaders } from "@/lib/auth";
import { companyListSchema, type Company } from "@/schemas/user";

const COMPANIES_ENDPOINT = `${env.API_URL}/companies`;

export async function getCompanies(): Promise<Company[]> {
  const res = await fetch(`${COMPANIES_ENDPOINT}/all`, {
    cache: "no-store",
    headers: await authHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Falha ao buscar empresas: ${res.status} ${res.statusText}`);
  }
  return companyListSchema.parse(await res.json());
}
