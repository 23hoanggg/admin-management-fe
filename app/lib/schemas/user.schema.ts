import { z } from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(1, "Tên không được để trống")
  .max(50, "Tên tối đa 50 ký tự")
  .regex(
    /^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u,
    "Tên chỉ được chứa chữ cái, khoảng trắng và dấu nối",
  );

const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username tối thiểu 3 ký tự")
  .max(20, "Username tối đa 20 ký tự")
  .regex(/^[a-zA-Z0-9_]+$/, "Username chỉ được chứa chữ, số và gạch dưới");

const emailSchema = z.string().trim().email("Email không hợp lệ");

const createPasswordSchema = z
  .string()
  .min(8, "Mật khẩu tối thiểu 8 ký tự")
  .max(64, "Mật khẩu tối đa 64 ký tự");

const updatePasswordSchema = z
  .string()
  .refine(
    (value) => value === "" || value.length >= 8,
    "Mật khẩu tối thiểu 8 ký tự",
  )
  .refine((value) => value.length <= 64, "Mật khẩu tối đa 64 ký tự");

export const createUserSchema = z.object({
  name: nameSchema,
  username: usernameSchema,
  email: emailSchema,
  password: createPasswordSchema,
});

export const updateUserSchema = z.object({
  name: nameSchema,
  username: usernameSchema,
  email: emailSchema,
  password: updatePasswordSchema,
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
