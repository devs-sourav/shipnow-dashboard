import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .refine((val) => !/\s/.test(val), "Email cannot contain spaces")
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine((val) => !/\s/.test(val), "Password cannot contain spaces"),
});