import * as z from "zod";

import { authApi } from "@/lib/api/auth";

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .refine((val) => val.trim().length >= 1, {
        message: "Name is required",
      })
      .max(50, { error: "Name must not exceed 50 characters" }),
    username: z
      .string()
      .refine((val) => val.trim().length >= 1, {
        message: "Username is required",
      })
      .max(15, { error: "Username must not exceed 15 characters" })
      .refine((val) => /\s/.test(val) === false, {
        error: "Username must not have spaces",
      })
      .refine(
        async (val) => {
          const isUnique = await authApi.checkPropertyUnique(
            val,
            "username",
            false,
          );
          return isUnique;
        },
        { message: "This username is already taken" },
      ),
    email: z
      .email({ error: "Must be a valid email" })
      .refine((val) => val.trim().length >= 1, {
        message: "Email is required",
      })
      .refine(
        async (val) => {
          const isUnique = await authApi.checkPropertyUnique(val, "email");
          return isUnique;
        },
        { message: "This email is already taken" },
      ),
    password: z
      .string()
      .refine((val) => val.trim().length >= 1, {
        error: "Password is required",
      })
      .min(8, { error: " " })
      .refine((val) => /[A-Z]/.test(val), {
        error: "one capital",
      })
      .refine((val) => /[^A-Za-z0-9]/.test(val), {
        error: "special char",
      }),
    confirmPassword: z.string().refine((val) => val.trim().length >= 1, {
      error: "Password is required",
    }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ["confirmPassword"],
    error: "Password does not match",
  });
