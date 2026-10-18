import { z } from "zod";

// ---------- Login ----------
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Enter your email address")
    .email("Enter a valid email, like name@company.com"),
  password: z.string().min(1, "Enter your password"),
});

// ---------- Signup ----------
export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be 50 characters or fewer"),
    email: z
      .string()
      .min(1, "Enter your email address")
      .email("Enter a valid email, like name@company.com"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Add at least one uppercase letter")
      .regex(/[0-9]/, "Add at least one number"),
    confirmPassword: z.string().min(1, "Re-enter your password"),
    terms: z
      .boolean()
      .refine((v) => v === true, "You must accept the terms to continue"),
  })
  // Cross-field rule: the error is attached to confirmPassword
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

// Types are inferred from the schemas, so there is one source of truth.
export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;