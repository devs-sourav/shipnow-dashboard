import { z } from "zod";
import { loginSchema } from "@/lib/validation";

export type LoginFormData = z.infer<typeof loginSchema>;