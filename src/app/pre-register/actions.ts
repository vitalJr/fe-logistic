"use server";

import { redirect } from "next/navigation";
import { preRegisterFormSchema } from "@/schemas/preRegister";
import { preRegister, PreRegisterApiError } from "@/lib/api/preRegister";

export type PreRegisterFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function preRegisterAction(
  _prevState: PreRegisterFormState,
  formData: FormData,
): Promise<PreRegisterFormState> {
  const parsed = preRegisterFormSchema.safeParse({
    name: formData.get("name"),
    birthDate: formData.get("birthDate"),
    street: formData.get("street"),
    number: formData.get("number"),
    zipCode: formData.get("zipCode"),
    contact: formData.get("contact"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await preRegister(parsed.data);
  } catch (error) {
    if (error instanceof PreRegisterApiError) {
      return {
        status: "error",
        message: error.message,
        fieldErrors: error.fieldErrors,
      };
    }
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Erro ao realizar o pré-cadastro.",
    };
  }

  redirect("/login");
}
