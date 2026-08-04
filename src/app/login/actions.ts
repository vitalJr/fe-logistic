"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "@/schemas/auth";
import { setAuthToken, clearAuthToken } from "@/lib/auth";
import { env } from "@/lib/env";

export type LoginFormState = {
  status: "idle" | "error";
  message?: string;
};

type LoginResponse = {
  token: string;
};

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Informe email e senha válidos." };
  }

  const res = await fetch(`${env.API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  if (!res.ok) {
    const body: unknown = await res.json().catch(() => null);
    const message =
      body && typeof body === "object" && "error" in body && typeof body.error === "string"
        ? body.error
        : "Usuário ou senha inválidos.";
    return { status: "error", message };
  }

  const { token } = (await res.json()) as LoginResponse;

  await setAuthToken(token);

  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await clearAuthToken();
  redirect("/");
}
