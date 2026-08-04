import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1).email(),
  password: z.string().min(1),
});

export type LoginValues = z.infer<typeof loginSchema>;
