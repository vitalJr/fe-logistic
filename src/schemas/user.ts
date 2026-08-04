import { z } from "zod";

export const cargoSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
});

export type Cargo = z.infer<typeof cargoSchema>;

export const cargoListSchema = z.array(cargoSchema);

export const companySchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
});

export type Company = z.infer<typeof companySchema>;

export const companyListSchema = z.array(companySchema);

const addressSchema = z.object({
  street: z.string().trim().min(1).max(200),
  number: z.string().trim().min(1).max(20),
  zipCode: z.string().trim().min(1).max(20),
});

export const registrationStatusSchema = z.enum(["pre_registered", "completed"]);

export type RegistrationStatus = z.infer<typeof registrationStatusSchema>;

export const userSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  birthDate: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  email: z.string().trim().min(1).email(),
  address: addressSchema,
  registrationStatus: registrationStatusSchema,
  identificationDocument: z.string().trim().min(1).nullable().default(null),
  cargoId: z.string().trim().min(1).nullable().default(null),
  companyId: z.string().trim().min(1).nullable().default(null),
});

export type User = z.infer<typeof userSchema>;

export const completeRegisterFormSchema = z.object({
  identificationDocument: z.string().trim().min(1).max(50),
  cargoId: z.string().trim().min(1),
  companyId: z.string().trim().min(1),
});

export type CompleteRegisterFormValues = z.infer<typeof completeRegisterFormSchema>;
