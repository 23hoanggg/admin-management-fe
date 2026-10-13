import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tên không được để trống")
    .max(50, "Tối đa 50 ký tự"),
  email: z.string().trim().email("Email không hợp lệ"),
  password: z
    .string()
    .min(8, "Mật khẩu tối thiểu 8 ký tự")
    .max(64, "Tối đa 64 ký tự"),
  role: z.enum(["user", "admin"], { message: "Role không hợp lệ" }),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tên không được để trống")
    .max(50, "Tối đa 50 ký tự"),
  username: z
    .string()
    .trim()
    .min(3, "Tối thiểu 3 ký tự")
    .max(20, "Tối đa 20 ký tự")
    .regex(/^[a-zA-Z0-9_]+$/, "Chỉ gồm chữ, số và gạch dưới"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export function getFieldErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "");
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
