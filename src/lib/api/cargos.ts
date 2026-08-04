import { env } from "@/lib/env";
import { authHeaders } from "@/lib/auth";
import { cargoListSchema, type Cargo } from "@/schemas/user";

const CARGOS_ENDPOINT = `${env.API_URL}/cargos`;

export async function getCargos(): Promise<Cargo[]> {
  const res = await fetch(`${CARGOS_ENDPOINT}/all`, {
    cache: "no-store",
    headers: await authHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Falha ao buscar cargos: ${res.status} ${res.statusText}`);
  }
  return cargoListSchema.parse(await res.json());
}
