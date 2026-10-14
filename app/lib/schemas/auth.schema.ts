import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Username không được để trống"),

  password: z.string().min(1, "Password không được để trống"),
});

export type LoginInput = z.infer<typeof loginSchema>;
