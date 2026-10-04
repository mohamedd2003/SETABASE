"use client";

import { useId, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { api, ApiError } from "@/components/admin/api-client";
import { asNumber, asOptionalNumber, FormField, SwitchRow } from "@/components/admin/FormBits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { relocationPackageInputSchema, type RelocationPackageInput } from "@/lib/admin-schemas";
import {
  relocationStageLabels,
  relocationStages,
  slugify,
  type RelocationPackage,
} from "@/lib/catalog";

type RelocationFormProps = {
  pkg?: RelocationPackage;
  onSaved: (pkg: RelocationPackage) => void;
  onCancel: () => void;
};

/** react-hook-form needs objects in a field array, so features are wrapped while editing. */
const formSchema = relocationPackageInputSchema.extend({
  features: z.array(z.object({ value: z.string().trim().min(1, "Write the feature.").max(200) })).max(60),
});
type FormValues = z.infer<typeof formSchema>;

const stageItems = relocationStages.map((value) => ({ value, label: relocationStageLabels[value] }));

const empty: FormValues = {
  title: "",
  slug: "",
  stage: "before-moving",
  when: "",
  shortDescription: "",
  description: "",
  features: [{ value: "" }],
  price: undefined,
  priceOnRequest: true,
  isActive: true,
  sortOrder: 0,
};

function toValues(pkg: RelocationPackage): FormValues {
  return {
    title: pkg.title,
    slug: pkg.slug,
    stage: pkg.stage,
    when: pkg.when ?? "",
    shortDescription: pkg.shortDescription,
    description: pkg.description ?? "",
    features: pkg.features.map((value) => ({ value })),
    price: pkg.price,
    priceOnRequest: pkg.priceOnRequest,
    isActive: pkg.isActive,
    sortOrder: pkg.sortOrder,
  };
}

export function RelocationForm({ pkg, onSaved, onCancel }: RelocationFormProps) {
  const id = useId();
  const [slugTouched, setSlugTouched] = useState(Boolean(pkg));

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: pkg ? toValues(pkg) : empty,
  });
  const { register, control, handleSubmit, setValue, setError, formState } = form;
  const { errors, isSubmitting } = formState;
  const features = useFieldArray({ control, name: "features" });

  const stage = useWatch({ control, name: "stage" });
  const priceOnRequest = useWatch({ control, name: "priceOnRequest" });

  async function onSubmit(values: FormValues) {
    const payload: RelocationPackageInput = {
      ...values,
      when: values.when || undefined,
      description: values.description || undefined,
      features: values.features.map((f) => f.value.trim()),
      price: values.priceOnRequest ? undefined : values.price,
    };
    try {
      const saved = pkg
        ? await api<RelocationPackage>(`/api/admin/corporate-relocation/${pkg.id}`, { method: "PATCH", json: payload })
        : await api<RelocationPackage>("/api/admin/corporate-relocation", { method: "POST", json: payload });
      toast.success(pkg ? "Package saved." : "Package added.");
      onSaved(saved);
    } catch (error) {
      if (error instanceof ApiError && error.fields) {
        for (const [field, message] of Object.entries(error.fields)) {
          setError(field as keyof FormValues, { message });
        }
      }
      toast.error(error instanceof ApiError ? error.message : "Couldn't save the package.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id={`${id}-title`} label="Title" error={errors.title?.message}>
          <Input
            id={`${id}-title`}
            aria-invalid={!!errors.title}
            {...register("title", {
              // The slug follows the title until it's edited by hand.
              onChange: (e) => !slugTouched && setValue("slug", slugify(e.target.value)),
            })}
          />
        </FormField>
        <FormField id={`${id}-slug`} label="Slug" hint="Used as the package id on the website." error={errors.slug?.message}>
          <Input id={`${id}-slug`} aria-invalid={!!errors.slug} {...register("slug", { onChange: () => setSlugTouched(true) })} />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <FormField id={`${id}-stage`} label="Stage" error={errors.stage?.message}>
          <Controller
            control={control}
            name="stage"
            render={({ field }) => (
              <Select items={stageItems} value={field.value} onValueChange={(value) => field.onChange(value)}>
                <SelectTrigger id={`${id}-stage`} onBlur={field.onBlur}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stageItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
        <FormField id={`${id}-when`} label="When" hint="e.g. The first weeks in Egypt" error={errors.when?.message}>
          <Input id={`${id}-when`} {...register("when")} />
        </FormField>
        <FormField id={`${id}-sort`} label="Sort order" hint="Lower numbers come first." error={errors.sortOrder?.message}>
          <Input id={`${id}-sort`} type="number" min={0} inputMode="numeric" {...register("sortOrder", { setValueAs: asNumber })} />
        </FormField>
      </div>

      <FormField id={`${id}-short`} label="Short description" error={errors.shortDescription?.message}>
        <Textarea id={`${id}-short`} className="min-h-20" maxLength={300} aria-invalid={!!errors.shortDescription} {...register("shortDescription")} />
      </FormField>
      <FormField id={`${id}-desc`} label="Description (optional)" error={errors.description?.message}>
        <Textarea id={`${id}-desc`} className="min-h-24" maxLength={3000} {...register("description")} />
      </FormField>

      <fieldset className="grid gap-3">
        <legend className="text-sm text-foreground">
          {stage === "options" ? "Options" : "Features"}
        </legend>
        <p className="text-xs text-muted-foreground">
          {stage === "options"
            ? "Each line becomes an extra the client can add to the move."
            : "Write “Feature — detail” to show a smaller detail line under the feature."}
        </p>
        <ul className="grid gap-2">
          {features.fields.map((field, index) => (
            <li key={field.id} className="flex items-start gap-2">
              <div className="flex-1">
                <Input
                  aria-label={`Feature ${index + 1}`}
                  aria-invalid={!!errors.features?.[index]?.value}
                  {...register(`features.${index}.value` as const)}
                />
                {errors.features?.[index]?.value ? (
                  <p className="mt-1 text-xs text-destructive">{errors.features[index]?.value?.message}</p>
                ) : null}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-11 text-muted-foreground hover:text-destructive"
                onClick={() => features.remove(index)}
                aria-label="Remove feature"
              >
                <Trash2Icon aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
        <Button type="button" variant="outline" className="justify-self-start" onClick={() => features.append({ value: "" })}>
          <PlusIcon aria-hidden="true" />
          Add {stage === "options" ? "option" : "feature"}
        </Button>
      </fieldset>

      <div className="grid gap-3">
        <SwitchRow id={`${id}-on-request`} label="Price on request" hint="Relocations are usually quoted per move.">
          <Controller
            control={control}
            name="priceOnRequest"
            render={({ field }) => <Switch id={`${id}-on-request`} checked={field.value} onCheckedChange={field.onChange} />}
          />
        </SwitchRow>
        {!priceOnRequest ? (
          <FormField id={`${id}-price`} label="Price" hint="EGP" error={errors.price?.message}>
            <Input id={`${id}-price`} type="number" min={0} inputMode="numeric" {...register("price", { setValueAs: asOptionalNumber })} />
          </FormField>
        ) : null}
        <SwitchRow id={`${id}-active`} label="Active" hint="Inactive packages stay here but leave the website.">
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => <Switch id={`${id}-active`} checked={field.value} onCheckedChange={field.onChange} />}
          />
        </SwitchRow>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : pkg ? "Save changes" : "Add package"}
        </Button>
      </div>
    </form>
  );
}
