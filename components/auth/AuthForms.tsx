"use client"; // needed in the Next.js App Router

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  signupSchema,
  type LoginValues,
  type SignupValues,
} from "./schemas";
import "./auth-forms.css";

/* Small reusable field: label + input + field-level error message */
function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <p id={`${id}-error`} className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/* Fake API call so you can see loading + server errors */
const fakeApi = (email: string) =>
  new Promise<void>((resolve, reject) =>
    setTimeout(
      () => (email === "taken@test.com" ? reject(new Error("taken")) : resolve()),
      900
    )
  );

/* ---------------- LOGIN ---------------- */
function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched", // validate after the field is first blurred, then on change
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginValues) => {
    try {
      await fakeApi(data.email);
    } catch {
      setError("root", { message: "Incorrect email or password" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Field id="login-email" label="Email" error={errors.email?.message}>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          {...register("email")}
        />
      </Field>

      <Field id="login-password" label="Password" error={errors.password?.message}>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "login-password-error" : undefined}
          {...register("password")}
        />
      </Field>

      {errors.root && <p className="error banner" role="alert">{errors.root.message}</p>}
      {isSubmitSuccessful && !errors.root && <p className="success banner">Logged in.</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}

/* ---------------- SIGNUP ---------------- */
function SignupForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", terms: false },
  });

  const onSubmit = async (data: SignupValues) => {
    try {
      await fakeApi(data.email);
    } catch {
      // Server-side error shown on the exact field it belongs to
      setError("email", { message: "An account with this email already exists" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Field id="su-name" label="Full name" error={errors.name?.message}>
        <input
          id="su-name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "su-name-error" : undefined}
          {...register("name")}
        />
      </Field>

      <Field id="su-email" label="Email" error={errors.email?.message}>
        <input
          id="su-email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "su-email-error" : undefined}
          {...register("email")}
        />
      </Field>

      <Field id="su-password" label="Password" error={errors.password?.message}>
        <input
          id="su-password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "su-password-error" : undefined}
          {...register("password")}
        />
      </Field>

      <Field
        id="su-confirm"
        label="Confirm password"
        error={errors.confirmPassword?.message}
      >
        <input
          id="su-confirm"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? "su-confirm-error" : undefined}
          {...register("confirmPassword")}
        />
      </Field>

      <div className="field">
        <label className="check">
          <input
            type="checkbox"
            aria-invalid={!!errors.terms}
            {...register("terms")}
          />
          I accept the terms and conditions
        </label>
        {errors.terms && (
          <p className="error" role="alert">{errors.terms.message}</p>
        )}
      </div>

      {isSubmitSuccessful && !errors.email && (
        <p className="success banner">Account created.</p>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

/* ---------------- PAGE ---------------- */
export default function AuthForms() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <main className="auth">
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={mode === "login"} onClick={() => setMode("login")}>
          Log in
        </button>
        <button role="tab" aria-selected={mode === "signup"} onClick={() => setMode("signup")}>
          Sign up
        </button>
      </div>
      {/* key forces a fresh form (and fresh errors) when switching tabs */}
      {mode === "login" ? <LoginForm key="login" /> : <SignupForm key="signup" />}
    </main>
  );
}