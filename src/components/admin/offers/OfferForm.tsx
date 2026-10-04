"use client";

import { useId, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
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
import { offerInputSchema, type OfferInput } from "@/lib/admin-schemas";
import {
  flexUnitLabels,
  flexUnits,
  offerCategories,
  offerCategoryLabels,
  slugify,
  type SpecialOffer,
} from "@/lib/catalog";

type OfferFormProps = {
  /** Editing an existing offer, or creating when absent. */
  offer?: SpecialOffer;
  onSaved: (offer: SpecialOffer) => void;
  onCancel: () => void;
};

const categoryItems = offerCategories.map((value) => ({ value, label: offerCategoryLabels[value] }));
const unitItems = flexUnits.map((value) => ({ value, label: flexUnitLabels[value] }));

const empty: OfferInput = {
  title: "",
  slug: "",
  category: "delivery",
  shortDescription: "",
  description: "",
  items: [{ name: "", frequency: "Weekly" }],
  costPrice: undefined,
  clientPrice: undefined,
  pricePerEmployee: undefined,
  priceOnRequest: false,
  isActive: true,
  sortOrder: 0,
};

function toInput(offer: SpecialOffer): OfferInput {
  return {
    title: offer.title,
    slug: offer.slug,
    category: offer.category,
    shortDescription: offer.shortDescription,
    description: offer.description ?? "",
    items: offer.items.map((item) => ({
      name: item.name,
      frequency: item.frequency ?? "",
      group: item.group ?? "",
      price: item.price,
      unit: item.unit,
    })),
    costPrice: offer.costPrice,
    clientPrice: offer.clientPrice,
    pricePerEmployee: offer.pricePerEmployee,
    priceOnRequest: offer.priceOnRequest,
    isActive: offer.isActive,
    sortOrder: offer.sortOrder,
  };
}

/**
 * One form for every category. Flexible Pack items carry a price and unit; Event Pack
 * items carry a group and price; Delivery and Services items are just name and frequency.
 */
export function OfferForm({ offer, onSaved, onCancel }: OfferFormProps) {
  const id = useId();
  const [slugTouched, setSlugTouched] = useState(Boolean(offer));

  const form = useForm<OfferInput>({
    resolver: zodResolver(offerInputSchema),
    defaultValues: offer ? toInput(offer) : empty,
  });
  const { register, control, handleSubmit, setValue, setError, formState } = form;
  const { errors, isSubmitting } = formState;
  const items = useFieldArray({ control, name: "items" });

  const category = useWatch({ control, name: "category" });
  const priceOnRequest = useWatch({ control, name: "priceOnRequest" });

  async function onSubmit(values: OfferInput) {
    // Unused item columns are dropped so the record stays tidy.
    const payload: OfferInput = {
      ...values,
      description: values.description || undefined,
      items: values.items.map((item) => ({
        name: item.name,
        frequency: item.frequency || undefined,
        group: category === "event" ? item.group || undefined : undefined,
        price: category === "flexible" || category === "event" ? item.price : undefined,
        unit: category === "flexible" ? item.unit : undefined,
      })),
    };
    try {
      const saved = offer
        ? await api<SpecialOffer>(`/api/admin/special-offers/${offer.id}`, { method: "PATCH", json: payload })
        : await api<SpecialOffer>("/api/admin/special-offers", { method: "POST", json: payload });
      toast.success(offer ? "Offer saved." : "Offer added.");
      onSaved(saved);
    } catch (error) {
      if (error instanceof ApiError && error.fields) {
        for (const [field, message] of Object.entries(error.fields)) {
          setError(field as keyof OfferInput, { message });
        }
      }
      toast.error(error instanceof ApiError ? error.message : "Couldn't save the offer.");
    }
  }

  const showPrices = !priceOnRequest && category !== "flexible";
  // An item is one line from md up. Below that the name shares a line with the remove
  // button and the other fields wrap underneath, so none of them gets squeezed.
  const itemGrid =
    category === "flexible"
      ? "md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_6rem_minmax(10rem,1fr)_auto]"
      : category === "event"
        ? "md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_6rem_auto]"
        : "md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto]";
  const fieldsGrid =
    category === "flexible"
      ? "grid-cols-2 sm:grid-cols-3"
      : category === "event"
        ? "grid-cols-[minmax(0,1fr)_6rem]"
        : "grid-cols-1";

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
          <Input
            id={`${id}-slug`}
            aria-invalid={!!errors.slug}
            {...register("slug", { onChange: () => setSlugTouched(true) })}
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id={`${id}-category`} label="Category" error={errors.category?.message}>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select items={categoryItems} value={field.value} onValueChange={(value) => field.onChange(value)}>
                <SelectTrigger id={`${id}-category`} onBlur={field.onBlur}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
        <FormField id={`${id}-sort`} label="Sort order" hint="Lower numbers come first." error={errors.sortOrder?.message}>
          <Input
            id={`${id}-sort`}
            type="number"
            min={0}
            inputMode="numeric"
            aria-invalid={!!errors.sortOrder}
            {...register("sortOrder", { setValueAs: asNumber })}
          />
        </FormField>
      </div>

      <FormField id={`${id}-short`} label="Short description" error={errors.shortDescription?.message}>
        <Textarea
          id={`${id}-short`}
          className="min-h-20"
          maxLength={300}
          aria-invalid={!!errors.shortDescription}
          {...register("shortDescription")}
        />
      </FormField>
      <FormField id={`${id}-desc`} label="Description (optional)" error={errors.description?.message}>
        <Textarea id={`${id}-desc`} className="min-h-24" maxLength={3000} {...register("description")} />
      </FormField>

      {/* Items */}
      <fieldset className="grid gap-3">
        <legend className="text-sm text-foreground">
          {category === "event" ? "Event ideas" : "Items"}
        </legend>
        {errors.items?.root?.message || (typeof errors.items?.message === "string" && errors.items.message) ? (
          <p className="text-xs text-destructive">{errors.items.root?.message ?? errors.items.message}</p>
        ) : null}
        <ul className="grid gap-2">
          {items.fields.map((field, index) => {
            const rowErrors = errors.items?.[index];
            return (
              <li
                key={field.id}
                className={`grid grid-cols-[minmax(0,1fr)_auto] gap-2 rounded-xl border border-border p-3 ${itemGrid}`}
              >
                <Input
                  aria-label="Item name"
                  placeholder={category === "event" ? "Idea" : "Item"}
                  aria-invalid={!!rowErrors?.name}
                  {...register(`items.${index}.name` as const)}
                />
                <div className={`col-span-2 grid gap-2 md:contents ${fieldsGrid}`}>
                  {category === "event" ? (
                    <Input
                      aria-label="Group"
                      placeholder="Group, e.g. Team building"
                      list={`${id}-groups`}
                      {...register(`items.${index}.group` as const)}
                    />
                  ) : (
                    <Input
                      aria-label="Frequency"
                      placeholder="Weekly"
                      list={`${id}-frequencies`}
                      {...register(`items.${index}.frequency` as const)}
                    />
                  )}
                  {category === "flexible" || category === "event" ? (
                    <Input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      aria-label="Client price, EGP"
                      placeholder="EGP"
                      aria-invalid={!!rowErrors?.price}
                      {...register(`items.${index}.price` as const, { setValueAs: asOptionalNumber })}
                    />
                  ) : null}
                  {category === "flexible" ? (
                    <Controller
                      control={control}
                      name={`items.${index}.unit` as const}
                      render={({ field: unitField }) => (
                        <Select
                          items={unitItems}
                          value={unitField.value ?? null}
                          onValueChange={(value) => unitField.onChange(value ?? undefined)}
                        >
                          <SelectTrigger aria-label="Unit" className="col-span-2 sm:col-span-1">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {unitItems.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  ) : null}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="col-start-2 row-start-1 size-11 justify-self-end text-muted-foreground hover:text-destructive md:col-start-auto md:row-start-auto"
                  onClick={() => items.remove(index)}
                  aria-label="Remove item"
                >
                  <Trash2Icon aria-hidden="true" />
                </Button>
                {rowErrors?.name ? (
                  <p className="col-span-full text-xs text-destructive">{rowErrors.name.message}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
        <datalist id={`${id}-frequencies`}>
          <option value="Weekly" />
          <option value="Monthly" />
          <option value="Semi-annual" />
          <option value="Upon hiring" />
        </datalist>
        <datalist id={`${id}-groups`}>
          <option value="Team building" />
          <option value="Afterwork" />
          <option value="Ramadan, Eid, Christmas and New Year" />
          <option value="Company anniversaries" />
          <option value="Product launches" />
          <option value="Milestone celebrations" />
        </datalist>
        <Button
          type="button"
          variant="outline"
          className="justify-self-start"
          onClick={() => items.append({ name: "", frequency: category === "event" ? "" : "Weekly", group: "" })}
        >
          <PlusIcon aria-hidden="true" />
          Add {category === "event" ? "idea" : "item"}
        </Button>
      </fieldset>

      {/* Pricing */}
      <div className="grid gap-3">
        <SwitchRow id={`${id}-on-request`} label="Price on request" hint="Hide prices and quote each client.">
          <Controller
            control={control}
            name="priceOnRequest"
            render={({ field }) => (
              <Switch id={`${id}-on-request`} checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </SwitchRow>
        {showPrices ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField id={`${id}-cost`} label="Cost price" hint="EGP a month, 20 employees" error={errors.costPrice?.message}>
              <Input id={`${id}-cost`} type="number" min={0} inputMode="numeric" {...register("costPrice", { setValueAs: asOptionalNumber })} />
            </FormField>
            <FormField id={`${id}-client`} label="Client price" hint="EGP a month, 20 employees" error={errors.clientPrice?.message}>
              <Input id={`${id}-client`} type="number" min={0} inputMode="numeric" {...register("clientPrice", { setValueAs: asOptionalNumber })} />
            </FormField>
            <FormField id={`${id}-per`} label="Per employee" hint="EGP a month — shown on the site" error={errors.pricePerEmployee?.message}>
              <Input id={`${id}-per`} type="number" min={0} inputMode="numeric" {...register("pricePerEmployee", { setValueAs: asOptionalNumber })} />
            </FormField>
          </div>
        ) : null}
        <SwitchRow id={`${id}-active`} label="Active" hint="Inactive offers stay here but leave the website.">
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
          {isSubmitting ? "Saving…" : offer ? "Save changes" : "Add offer"}
        </Button>
      </div>
    </form>
  );
}
