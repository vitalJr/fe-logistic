"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { completeRegisterFormSchema } from "@/schemas/user";
import { completeRegister, CompleteRegisterApiError } from "@/lib/api/users";

export type ProfileFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function completeRegisterAction(
  userId: string,
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const parsed = completeRegisterFormSchema.safeParse({
    identificationDocument: formData.get("identificationDocument"),
    cargoId: formData.get("cargoId"),
    companyId: formData.get("companyId"),
  });

  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await completeRegister(userId, parsed.data);
  } catch (error) {
    if (error instanceof CompleteRegisterApiError) {
      return {
        status: "error",
        message: error.message,
        fieldErrors: error.fieldErrors,
      };
    }
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Erro ao completar cadastro.",
    };
  }

  revalidatePath("/profile");
  redirect("/dashboard");
}
