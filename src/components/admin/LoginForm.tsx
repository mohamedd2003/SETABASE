"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { api, ApiError } from "@/components/admin/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/lib/admin-schemas";
import type { z } from "zod";

type LoginInput = z.infer<typeof loginSchema>;

/** Only paths inside the dashboard are safe to return to after signing in. */
const safeNext = (next: string | undefined) =>
  next && next.startsWith("/admin") && !next.startsWith("/admin/login") ? next : "/admin/requests";

/** Why the dashboard sent someone back here, when it did. */
const reasons: Record<string, string> = {
  "signed-out": "You've been signed out — your account was changed or removed, or the session ended. Sign in again to continue.",
};

export function LoginForm({ next, reason }: { next?: string; reason?: string }) {
  const id = useId();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const notice = reason ? reasons[reason] : undefined;

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: LoginInput) {
    setError(null);
    try {
      await api("/api/admin/auth/login", { method: "POST", json: values });
      router.replace(safeNext(next));
      router.refresh();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Something went wrong. Try again.");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-8 grid gap-5">
      {notice ? (
        <p role="status" className="rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-muted-foreground">
          {notice}
        </p>
      ) : null}
      <div className="grid gap-2">
        <Label htmlFor={`${id}-email`}>Email</Label>
        <div className="relative">
          <MailIcon aria-hidden="true" className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={`${id}-email`}
            type="email"
            autoComplete="username"
            inputMode="email"
            placeholder="you@setabase.com"
            className="ps-10"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${id}-email-error` : undefined}
            {...form.register("email")}
          />
        </div>
        {errors.email ? (
          <p id={`${id}-email-error`} className="text-xs text-destructive">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor={`${id}-password`}>Password</Label>
        <div className="relative">
          <LockIcon aria-hidden="true" className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={`${id}-password`}
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className="ps-10 pe-12"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? `${id}-password-error` : undefined}
            {...form.register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute end-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPassword ? <EyeOffIcon className="size-4" aria-hidden="true" /> : <EyeIcon className="size-4" aria-hidden="true" />}
          </button>
        </div>
        {errors.password ? (
          <p id={`${id}-password-error`} className="text-xs text-destructive">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="pill" className="w-full rounded-lg" disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
      <Button variant="outline" size="pill" className="w-full rounded-lg" nativeButton={false} render={<Link href="/" />}>
        Back to website
      </Button>
    </form>
  );
}
