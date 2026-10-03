"use client";

import { useId, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/content/site";
import { requesterSchema, type RequesterInput } from "@/lib/package-request-schema";

type Status = { state: "idle" | "submitting" | "failed" } | { state: "sent"; reference: string };

type RequestFormProps = {
  submitLabel: string;
  helperText: string;
  /**
   * Checks the page's own fields and returns the request body, or null when something on
   * the page needs fixing first (the page shows its own errors).
   */
  buildRequest: (requester: RequesterInput) => object | null;
  /** Clears the page's selection once the request has gone through. */
  onSent?: () => void;
  /** Fields that belong to this page, shown above the contact details. */
  children?: ReactNode;
};

/** Contact details and sending, shared by the package pages. */
export function RequestForm({ submitLabel, helperText, buildRequest, onSent, children }: RequestFormProps) {
  const id = useId();
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const form = useForm<RequesterInput>({
    resolver: zodResolver(requesterSchema),
    defaultValues: { name: "", company: "", email: "", phone: "", message: "", website: "" },
  });
  const { errors } = form.formState;

  async function onSubmit(requester: RequesterInput) {
    const body = buildRequest(requester);
    if (!body) return;

    setStatus({ state: "submitting" });
    try {
      const response = await fetch("/api/package-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error(`Request failed with ${response.status}`);
      const result = (await response.json()) as { id?: string };
      setStatus({ state: "sent", reference: result.id?.slice(0, 8).toUpperCase() ?? "" });
      form.reset();
      onSent?.();
    } catch {
      setStatus({ state: "failed" });
    }
  }

  // Run the page's checks too, so every problem shows at once rather than one form at a time.
  const submit = form.handleSubmit(onSubmit, () => buildRequest(form.getValues()));

  if (status.state === "sent") {
    return (
      <div role="status" className="rounded-2xl border border-line-gold bg-navy/40 p-7">
        <p className="font-serif text-xl font-medium text-white">Request sent.</p>
        <p className="mt-2 text-ink-soft">{helperText}</p>
        {status.reference ? (
          <p className="mt-4 text-sm text-ink-soft">
            Your reference is <span className="font-medium text-gold">{status.reference}</span>.
          </p>
        ) : null}
        <Button
          variant="brand"
          size="pill-sm"
          className="mt-6"
          onClick={() => setStatus({ state: "idle" })}
        >
          Start a new request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-6">
      {children}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={`${id}-name`} label="Your name" error={errors.name?.message}>
          <Input
            id={`${id}-name`}
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${id}-name-error` : undefined}
            {...form.register("name")}
          />
        </Field>
        <Field id={`${id}-company`} label="Company" error={errors.company?.message}>
          <Input
            id={`${id}-company`}
            autoComplete="organization"
            aria-invalid={!!errors.company}
            aria-describedby={errors.company ? `${id}-company-error` : undefined}
            {...form.register("company")}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={`${id}-email`} label="Work email" error={errors.email?.message}>
          <Input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${id}-email-error` : undefined}
            {...form.register("email")}
          />
        </Field>
        <Field id={`${id}-phone`} label="Phone (optional)" error={errors.phone?.message}>
          <Input
            id={`${id}-phone`}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+20"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
            {...form.register("phone")}
          />
        </Field>
      </div>

      <Field id={`${id}-message`} label="Anything else we should know? (optional)" error={errors.message?.message}>
        <Textarea
          id={`${id}-message`}
          className="min-h-24"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? `${id}-message-error` : undefined}
          {...form.register("message")}
        />
      </Field>

      {/* Honeypot: hidden from people, filled only by bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} tabIndex={-1} autoComplete="off" {...form.register("website")} />
      </div>

      <div className="flex flex-col items-start gap-3">
        <Button type="submit" variant="brandSolid" size="pill" disabled={status.state === "submitting"}>
          {status.state === "submitting" ? "Sending…" : submitLabel}
        </Button>
        {status.state === "failed" ? (
          <p role="alert" className="text-sm text-destructive">
            The request didn&rsquo;t go through. Try again, or email us at{" "}
            <a href={`mailto:${site.email}`} className="underline underline-offset-4">
              {site.email}
            </a>
            .
          </p>
        ) : (
          <p className="text-sm text-ink-soft">{helperText}</p>
        )}
      </div>
    </form>
  );
}

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
};

export function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
