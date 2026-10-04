"use client";

import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, WandSparklesIcon } from "lucide-react";
import { toast } from "sonner";
import { api, ApiError } from "@/components/admin/api-client";
import { FormField, SwitchRow } from "@/components/admin/FormBits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { teamMemberFormSchema, type TeamMemberFormValues } from "@/lib/admin-schemas";
import type { TeamMemberRecord } from "@/lib/team-types";

type TeamMemberFormProps = {
  /** Editing an existing member, or adding one when absent. */
  member?: TeamMemberRecord;
  /** True when the member being edited is the person signed in. */
  self?: boolean;
  onSaved: (member: TeamMemberRecord) => void;
  onCancel: () => void;
};

/** A password people can read back over the phone: letters and digits, no look-alikes. */
function suggestPassword() {
  const alphabet = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(14));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export function TeamMemberForm({ member, self = false, onSaved, onCancel }: TeamMemberFormProps) {
  const id = useId();
  const mode = member ? "edit" : "create";
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberFormSchema(mode)),
    defaultValues: member
      ? { name: member.name ?? "", email: member.email, password: "", isActive: member.isActive }
      : { name: "", email: "", password: "", isActive: true },
  });
  const { register, control, handleSubmit, setValue, setError, formState } = form;
  const { errors, isSubmitting } = formState;

  async function onSubmit(values: TeamMemberFormValues) {
    const payload = {
      name: values.name ?? "",
      email: values.email,
      isActive: values.isActive,
      ...(values.password && { password: values.password }),
    };
    try {
      const saved = member
        ? await api<TeamMemberRecord>(`/api/admin/team/${member.id}`, { method: "PATCH", json: payload })
        : await api<TeamMemberRecord>("/api/admin/team", { method: "POST", json: payload });
      toast.success(member ? "Team member saved." : `${saved.name || saved.email} can sign in now.`);
      onSaved(saved);
    } catch (error) {
      if (error instanceof ApiError && error.fields) {
        for (const [field, message] of Object.entries(error.fields)) {
          setError(field as keyof TeamMemberFormValues, { message });
        }
      }
      toast.error(error instanceof ApiError ? error.message : "Couldn't save the team member.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id={`${id}-name`} label="Name (optional)" error={errors.name?.message}>
          <Input id={`${id}-name`} autoComplete="off" aria-invalid={!!errors.name} {...register("name")} />
        </FormField>
        <FormField id={`${id}-email`} label="Email" error={errors.email?.message}>
          <Input
            id={`${id}-email`}
            type="email"
            inputMode="email"
            autoComplete="off"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </FormField>
      </div>

      <FormField
        id={`${id}-password`}
        label={mode === "create" ? "Password" : "New password (optional)"}
        hint={
          mode === "create"
            ? "At least 8 characters. Share it with them yourself — it isn't emailed."
            : "Leave empty to keep the current one. A new password signs them out everywhere else."
        }
        error={errors.password?.message}
      >
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id={`${id}-password`}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className="pe-12"
              aria-invalid={!!errors.password}
              {...register("password")}
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
          <Button
            type="button"
            variant="outline"
            className="h-11 shrink-0"
            onClick={() => {
              setValue("password", suggestPassword(), { shouldValidate: true });
              setShowPassword(true);
            }}
          >
            <WandSparklesIcon aria-hidden="true" />
            Suggest
          </Button>
        </div>
      </FormField>

      {mode === "edit" ? (
        <SwitchRow
          id={`${id}-active`}
          label="Can sign in"
          hint={self ? "You can't switch off your own account." : "Switched off, they're signed out and can't sign back in."}
        >
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <Switch id={`${id}-active`} checked={field.value} onCheckedChange={field.onChange} disabled={self} />
            )}
          />
        </SwitchRow>
      ) : null}

      <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : member ? "Save changes" : "Add member"}
        </Button>
      </div>
    </form>
  );
}
