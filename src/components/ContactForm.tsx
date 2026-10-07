"use client";

import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/content/site";
import type { ServiceId } from "@/content/types";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";

type ContactFormProps = {
  interests: { value: ServiceId; label: string }[];
  submitLabel: string;
  helperText: string;
};

type Status = "idle" | "submitting" | "sent" | "failed";

export function ContactForm({ interests, submitLabel, helperText }: ContactFormProps) {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", company: "", email: "", message: "", website: "" },
  });
  const { errors } = form.formState;

  async function onSubmit(values: ContactInput) {
    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error(`Request failed with ${response.status}`);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("failed");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="mt-8 rounded-2xl border border-line-gold bg-navy/40 p-7">
        <p className="font-serif text-xl font-medium text-white">Request sent.</p>
        <p className="mt-2 text-ink-soft">{helperText}</p>
        <Button
          variant="brand"
          size="pill-sm"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          Send another request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-8 grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={`${id}-name`} label="Name" error={errors.name?.message}>
          <Input
            id={`${id}-name`}
            autoComplete="name"
            placeholder="Your full name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${id}-name-error` : undefined}
            {...form.register("name")}
          />
        </Field>
        <Field id={`${id}-company`} label="Company (optional)" error={errors.company?.message}>
          <Input
            id={`${id}-company`}
            autoComplete="organization"
            placeholder="Company name"
            aria-invalid={!!errors.company}
            aria-describedby={errors.company ? `${id}-company-error` : undefined}
            {...form.register("company")}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={`${id}-email`} label="Email" error={errors.email?.message}>
          <Input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@email.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${id}-email-error` : undefined}
            {...form.register("email")}
          />
        </Field>
        <Field id={`${id}-interest`} label="I'm interested in" error={errors.interest?.message}>
          <Controller
            control={form.control}
            name="interest"
            render={({ field }) => (
              <Select
                items={interests}
                value={field.value ?? null}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger
                  id={`${id}-interest`}
                  aria-invalid={!!errors.interest}
                  aria-describedby={errors.interest ? `${id}-interest-error` : undefined}
                  onBlur={field.onBlur}
                >
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  {interests.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>

      <Field id={`${id}-message`} label="Message" error={errors.message?.message}>
        <Textarea
          id={`${id}-message`}
          placeholder="Tell us a little about what you need"
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
        <Button
          type="submit"
          variant="brandSolid"
          size="pill"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending…" : submitLabel}
        </Button>
        {status === "failed" ? (
          <p role="alert" className="text-sm text-destructive">
            The request didn&rsquo;t go through. Try again, or email us at{" "}
            <a href={`mailto:${site.email}`} className="underline underline-offset-4">
              {site.email}
            </a>
            .
          </p>
        ) : (
          <p className="text-sm text-ink-soft">
            {helperText} {site.reassurance}
          </p>
        )}
      </div>
    </form>
  );
}

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
};

function Field({ id, label, error, children }: FieldProps) {
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
