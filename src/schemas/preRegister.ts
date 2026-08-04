import { z } from "zod";

export const preRegisterFormSchema = z
  .object({
    name: z.string().trim().min(1).max(150),
    birthDate: z.string().trim().min(1),
    street: z.string().trim().min(1).max(200),
    number: z.string().trim().min(1).max(20),
    zipCode: z.string().trim().min(1).max(20),
    contact: z.string().trim().min(1).max(50),
    email: z.string().trim().min(1).email(),
    password: z.string().min(6).max(72),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type PreRegisterFormValues = z.infer<typeof preRegisterFormSchema>;
