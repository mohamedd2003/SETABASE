"use client";

import { useId, useState } from "react";
import { RelocationBuildModel } from "@/components/BuildModels";
import { Chip, SelectCard } from "@/components/packages/Choice";
import { Field, RequestForm } from "@/components/packages/RequestForm";
import { SelectionBar } from "@/components/packages/SelectionBar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  relocationDestinations,
  relocationExclusions,
  relocationOptions,
  relocationStages,
  type RelocationOptionId,
  type RelocationStageId,
} from "@/content/relocation";
import { relocationRequestSchema, type RequesterInput } from "@/lib/package-request-schema";

const toggle = <T,>(list: T[], value: T) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

const sectionTitle =
  "font-serif text-[1.75rem]/[1.15] font-medium text-gold-gradient sm:text-[2.25rem]";

type DetailErrors = Partial<Record<"employees" | "movingFrom" | "destination" | "arrival" | "selection", string>>;

/**
 * Pick the stages of the move and any extras, watch the new home come together on the
 * model, then send the request with the details of the move.
 */
export function RelocationPlanner() {
  const id = useId();
  const [stages, setStages] = useState<RelocationStageId[]>([]);
  const [options, setOptions] = useState<RelocationOptionId[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [employees, setEmployees] = useState(1);
  const [movingFrom, setMovingFrom] = useState("");
  const [destination, setDestination] = useState<string | null>(null);
  const [arrival, setArrival] = useState("");
  const [errors, setErrors] = useState<DetailErrors>({});

  const count = stages.length + options.length;
  const built = [...stages, ...(options.length ? ["options"] : [])];
  // In the order of the move, whatever order they were clicked in.
  const orderedStages = relocationStages.filter((s) => stages.includes(s.id));

  function clearError(key: keyof DetailErrors) {
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function reset() {
    setStages([]);
    setOptions([]);
    setEmployees(1);
    setMovingFrom("");
    setDestination(null);
    setArrival("");
  }

  function buildRequest(requester: RequesterInput) {
    const parsed = relocationRequestSchema.safeParse({
      service: "relocation",
      stages: orderedStages.map((s) => s.id),
      options,
      employees,
      movingFrom,
      destination: destination ?? undefined,
      arrival,
      requester,
    });

    const next: DetailErrors = {};
    if (count === 0) next.selection = "Choose at least one stage of the move or an extra above.";
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === "employees" || key === "movingFrom" || key === "destination" || key === "arrival") {
          next[key] ??= issue.message;
        }
      }
    }
    setErrors(next);
    return parsed.success && count > 0 ? parsed.data : null;
  }

  return (
    <>
      <section id="packages" className="container-site scroll-mt-24 py-16 nav:py-24">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 nav:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] nav:gap-12">
          <aside className="nav:sticky nav:top-24 nav:self-start">
            <RelocationBuildModel on={built} preview={preview} />
            <div className="relative mt-8 rounded-3xl border border-line-gold-soft bg-[color-mix(in_srgb,var(--navy-medium)_14%,var(--navy-deep))] p-6">
              <p className="text-sm text-ink-soft">The move so far</p>
              {count === 0 ? (
                <p className="mt-2 text-sm text-ink">
                  Choose the stages you&rsquo;d like us to handle, and the new home comes together
                  on the model.
                </p>
              ) : (
                <ul className="mt-3 grid gap-2 text-sm" aria-live="polite">
                  {orderedStages.map((stage) => (
                    <li key={stage.id} className="flex justify-between gap-3">
                      <span className="text-ink">{stage.title}</span>
                      <span className="text-ink-soft">{stage.when}</span>
                    </li>
                  ))}
                  {options.length > 0 ? (
                    <li className="text-ink">
                      {options.length} {options.length === 1 ? "extra" : "extras"}
                    </li>
                  ) : null}
                </ul>
              )}
              <p className="mt-4 border-t border-line-gold-soft pt-4 text-xs text-ink-soft">
                Every move is priced on its own — your quote follows the request.
              </p>
              <a
                href="#request"
                className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full border border-gold text-sm font-medium text-gold transition-colors hover:bg-gold hover:text-navy-deep"
              >
                Continue to request
              </a>
            </div>
          </aside>

          <div>
            <h2 className={sectionTitle}>The move, in three stages</h2>
            <p className="mt-3 max-w-[56ch] text-ink-soft">
              Take the whole journey, or only the stages you need. One person at SETABASE runs it
              from the first viewing to the last box.
            </p>
            <ol className="mt-8 grid gap-3">
              {relocationStages.map((stage, i) => (
                <li key={stage.id}>
                  <SelectCard
                    on={stages.includes(stage.id)}
                    onToggle={() => {
                      setStages((current) => toggle(current, stage.id));
                      clearError("selection");
                    }}
                    onPreview={(on) => setPreview(on ? stage.id : null)}
                    kicker={`${i + 1}. ${stage.when}`}
                    title={stage.title}
                    summary={stage.summary}
                    included={
                      <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                        {stage.items.map((item) => (
                          <li key={item.label}>
                            <span className="text-ink">{item.label}</span>
                            {item.detail ? (
                              <span className="mt-0.5 block text-xs text-ink-soft">{item.detail}</span>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    }
                  />
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-ink-soft">{relocationExclusions}</p>

            <div
              className="mt-12"
              onPointerEnter={() => setPreview("options")}
              onPointerLeave={() => setPreview(null)}
            >
              <h3 className="font-serif text-xl font-medium text-white">Extras</h3>
              <p className="mt-2 max-w-[56ch] text-sm text-ink-soft">
                Add any of these to the move, or on their own once the family has arrived.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {relocationOptions.map((option) => (
                  <li key={option.id}>
                    <Chip
                      on={options.includes(option.id)}
                      onToggle={() => {
                        setOptions((current) => toggle(current, option.id));
                        clearError("selection");
                      }}
                    >
                      {option.label}
                    </Chip>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="request" className="scroll-mt-24 px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="contact-scene relative overflow-hidden rounded-[2rem] nav:rounded-[2.5rem]">
          <span
            aria-hidden="true"
            className="blueprint-grid blueprint-grid-gold pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_70%_at_15%_30%,#000_5%,transparent_70%)]"
          />
          <div className="container-site relative grid gap-12 py-16 nav:grid-cols-12 nav:gap-16 nav:py-24">
            <div className="nav:col-span-5">
              <h2 className="font-serif text-[1.75rem]/[1.15] font-medium text-gold-gradient sm:text-[2.5rem] nav:text-3xl">
                Request a relocation quote
              </h2>
              <p className="mt-4 max-w-[46ch] text-ink-soft">
                Tell us who&rsquo;s moving and when. We&rsquo;ll come back with a plan and a price —
                usually within one business day.
              </p>

              <div className="mt-8 rounded-2xl border border-line-gold-soft p-5">
                <p className="text-sm text-ink-soft">Your selection</p>
                {count === 0 ? (
                  <p className="mt-2 text-ink">
                    Nothing chosen yet.{" "}
                    <a href="#packages" className="text-gold underline underline-offset-4">
                      Choose stages
                    </a>
                  </p>
                ) : (
                  <ul className="mt-3 grid gap-2 text-sm text-ink">
                    {orderedStages.map((stage) => (
                      <li key={stage.id}>{stage.title}</li>
                    ))}
                    {options.length > 0 ? (
                      <li>
                        Extras:{" "}
                        {relocationOptions
                          .filter((o) => options.includes(o.id))
                          .map((o) => o.label.toLowerCase())
                          .join(", ")}
                      </li>
                    ) : null}
                  </ul>
                )}
              </div>
            </div>

            <div className="nav:col-span-7">
              <RequestForm
                submitLabel="Send request"
                helperText="We'll reply within one business day."
                buildRequest={buildRequest}
                onSent={reset}
              >
                {errors.selection ? (
                  <p role="alert" className="rounded-xl border border-destructive/50 px-4 py-3 text-sm text-destructive">
                    {errors.selection}{" "}
                    <a href="#packages" className="underline underline-offset-4">
                      Go to stages
                    </a>
                  </p>
                ) : null}

                <div className="grid gap-6 sm:grid-cols-2">
                  <Field id={`${id}-employees`} label="People relocating" error={errors.employees}>
                    <Input
                      id={`${id}-employees`}
                      type="number"
                      inputMode="numeric"
                      min={1}
                      value={employees || ""}
                      aria-invalid={!!errors.employees}
                      onChange={(e) => {
                        setEmployees(Math.max(0, Math.floor(e.target.valueAsNumber || 0)));
                        clearError("employees");
                      }}
                    />
                  </Field>
                  <Field id={`${id}-from`} label="Moving from" error={errors.movingFrom}>
                    <Input
                      id={`${id}-from`}
                      autoComplete="country-name"
                      placeholder="Country"
                      value={movingFrom}
                      aria-invalid={!!errors.movingFrom}
                      onChange={(e) => {
                        setMovingFrom(e.target.value);
                        clearError("movingFrom");
                      }}
                    />
                  </Field>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <Field id={`${id}-destination`} label="Moving to" error={errors.destination}>
                    <Select
                      items={relocationDestinations.map((d) => ({ value: d, label: d }))}
                      value={destination}
                      onValueChange={(value) => {
                        setDestination(value as string | null);
                        clearError("destination");
                      }}
                    >
                      <SelectTrigger id={`${id}-destination`} aria-invalid={!!errors.destination}>
                        <SelectValue placeholder="Choose a city" />
                      </SelectTrigger>
                      <SelectContent>
                        {relocationDestinations.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field id={`${id}-arrival`} label="Arriving around (optional)" error={errors.arrival}>
                    <Input
                      id={`${id}-arrival`}
                      type="month"
                      value={arrival}
                      aria-invalid={!!errors.arrival}
                      onChange={(e) => {
                        setArrival(e.target.value);
                        clearError("arrival");
                      }}
                      className="[color-scheme:dark]"
                    />
                  </Field>
                </div>
              </RequestForm>
            </div>
          </div>
        </div>
      </section>

      <SelectionBar count={count} detail="Quoted on request" />
    </>
  );
}
