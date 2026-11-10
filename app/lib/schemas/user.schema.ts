import { z } from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(50, "Name must be at most 50 characters")
  .regex(
    /^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u,
    "Name may only contain letters, spaces and hyphens",
  );

const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username may only contain letters, numbers and underscores",
  );

const emailSchema = z.string().trim().email("Invalid email address");

const createPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password must be at most 64 characters");

const updatePasswordSchema = z
  .string()
  .refine(
    (value) => value === "" || value.length >= 8,
    "Password must be at least 8 characters",
  )
  .refine(
    (value) => value.length <= 64,
    "Password must be at most 64 characters",
  );

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
