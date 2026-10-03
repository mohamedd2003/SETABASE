"use client";

import { useId, useState } from "react";
import { OfficeBuildModel } from "@/components/BuildModels";
import { PlusIcon } from "lucide-react";
import { Chip, SelectCard, Tabs } from "@/components/packages/Choice";
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
  FLEX_MIN_ITEMS,
  contractLengths,
  eventGroups,
  eventIdeas,
  fixedPackages,
  flexItems,
  specialServicesTerms,
  type FixedPackageId,
} from "@/content/special-services";
import { specialServicesRequestSchema, type RequesterInput } from "@/lib/package-request-schema";
import {
  estimateSpecialServices,
  flexItemMonthly,
  formatEgp,
  includedItems,
} from "@/lib/special-services-pricing";

const toggle = <T,>(list: T[], value: T) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

const sectionTitle =
  "font-serif text-[1.75rem]/[1.15] font-medium text-gold-gradient sm:text-[2.25rem]";

/**
 * Pick packages, watch the office building get built, see the monthly estimate, then send
 * the request. One component so the picker, the model, the estimate and the form share
 * the selection.
 */
export function SpecialServicesPlanner() {
  const id = useId();
  const [employees, setEmployees] = useState(20);
  const [packages, setPackages] = useState<FixedPackageId[]>([]);
  const [flex, setFlex] = useState<string[]>([]);
  const [events, setEvents] = useState<string[]>([]);
  const [contract, setContract] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [tab, setTab] = useState("packages");
  const [selectionError, setSelectionError] = useState<string | null>(null);

  const team = Math.max(1, employees || 1);
  const included = includedItems(packages);
  const chosenFlex = flex.filter((item) => !included.has(item));
  const estimate = estimateSpecialServices({ employees: team, packages, flexItems: chosenFlex });
  const count = packages.length + chosenFlex.length + events.length;

  // What the model shows: one floor per package, the flexible floor, the roof for events.
  const built = [
    ...packages,
    ...(chosenFlex.length ? ["flexible"] : []),
    ...(events.length ? ["events"] : []),
  ];

  function choosePackage(pkg: FixedPackageId) {
    setPackages((current) => toggle(current, pkg));
    setSelectionError(null);
  }

  function reset() {
    setPackages([]);
    setFlex([]);
    setEvents([]);
    setContract(null);
  }

  function buildRequest(requester: RequesterInput) {
    if (count === 0) {
      setSelectionError("Choose at least one package, Flexible Pack item or event above.");
      return null;
    }
    if (estimate.flexShortBy > 0) {
      setSelectionError(
        `The Flexible Pack on its own needs ${FLEX_MIN_ITEMS} items — add ${estimate.flexShortBy} more, or choose a package.`,
      );
      return null;
    }
    const parsed = specialServicesRequestSchema.safeParse({
      service: "special-services",
      employees: team,
      packages,
      flexItems: chosenFlex,
      eventIdeas: events,
      contractLength: contract ?? undefined,
      requester,
    });
    if (!parsed.success) {
      setSelectionError(parsed.error.issues[0]?.message ?? "Check your selection.");
      return null;
    }
    setSelectionError(null);
    return parsed.data;
  }

  return (
    <>
      <section id="packages" className="container-site scroll-mt-24 py-16 nav:py-24">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 nav:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] nav:gap-12">
          {/* The building and the estimate, kept in view while the packages scroll by. */}
          <aside className="nav:sticky nav:top-24 nav:self-start">
            <OfficeBuildModel on={built} preview={preview} />
            <div className="relative mt-8 rounded-3xl border border-line-gold-soft bg-[color-mix(in_srgb,var(--navy-medium)_14%,var(--navy-deep))] p-6">
              <Field id={`${id}-employees`} label="Employees at the office">
                <Input
                  id={`${id}-employees`}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={100000}
                  value={employees || ""}
                  onChange={(e) => setEmployees(Math.min(100000, Math.max(0, Math.floor(e.target.valueAsNumber || 0))))}
                />
              </Field>

              <Estimate estimate={estimate} count={count} events={events.length} />

              <a
                href="#request"
                className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full border border-gold text-sm font-medium text-gold transition-colors hover:bg-gold hover:text-navy-deep"
              >
                Continue to request
              </a>
            </div>
          </aside>

          <div>
            <h2 className={sectionTitle}>Choose your packages</h2>
            <p className="mt-3 max-w-[56ch] text-ink-soft">
              Pick a ready package, build your own from single items, or add events. Two or more
              packages take 10% off.
            </p>

            <div className="mt-8">
              <Tabs
                active={tab}
                onChange={setTab}
                tabs={[
                  {
                    id: "packages",
                    label: "Packages",
                    count: packages.length,
                    content: (
                      <ul className="grid gap-3">
                        {fixedPackages.map((pkg) => (
                          <li key={pkg.id}>
                            <SelectCard
                              on={packages.includes(pkg.id)}
                              onToggle={() => choosePackage(pkg.id)}
                              onPreview={(on) => setPreview(on ? pkg.id : null)}
                              kicker={`${pkg.kind}, ${pkg.tier.toLowerCase()}`}
                              title={pkg.title}
                              summary={pkg.summary}
                              footer={
                                <span className="font-serif text-xl text-white">
                                  {formatEgp(pkg.perEmployee)}
                                  <span className="font-sans text-xs text-ink-soft"> per employee a month</span>
                                </span>
                              }
                              included={
                                <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
                                  {pkg.items.map((itemId) => {
                                    const item = flexItems.find((f) => f.id === itemId)!;
                                    return (
                                      <li key={itemId} className="flex justify-between gap-3">
                                        <span className="text-ink">{item.label}</span>
                                        <span className="shrink-0 text-ink-soft">{item.frequency}</span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              }
                            />
                          </li>
                        ))}
                      </ul>
                    ),
                  },
                  {
                    id: "flexible",
                    label: "Build your own",
                    count: chosenFlex.length,
                    content: (
                      <div
                        onPointerEnter={() => setPreview("flexible")}
                        onPointerLeave={() => setPreview(null)}
                      >
                        <p className="max-w-[56ch] text-sm text-ink-soft">
                          Add single items on top of a package, or pick {FLEX_MIN_ITEMS} or more to
                          take them on their own. Prices per month for {team}{" "}
                          {team === 1 ? "employee" : "employees"}.
                        </p>
                        <ul className="mt-5 flex flex-wrap gap-2">
                          {flexItems.map((item) => {
                            const owner = fixedPackages.find(
                              (p) => packages.includes(p.id) && p.items.includes(item.id),
                            );
                            return (
                              <li key={item.id}>
                                <Chip
                                  on={!!owner || flex.includes(item.id)}
                                  disabled={!!owner}
                                  onToggle={() => {
                                    setFlex((current) => toggle(current, item.id));
                                    setSelectionError(null);
                                  }}
                                  detail={
                                    owner
                                      ? "included"
                                      : item.unit === "kit"
                                        ? `${formatEgp(item.price)} per hire`
                                        : formatEgp(flexItemMonthly(item, team))
                                  }
                                >
                                  {item.label}
                                </Chip>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ),
                  },
                  {
                    id: "events",
                    label: "Events",
                    count: events.length,
                    content: (
                      <div
                        onPointerEnter={() => setPreview("events")}
                        onPointerLeave={() => setPreview(null)}
                      >
                        <p className="max-w-[56ch] text-sm text-ink-soft">
                          Pick the ones you&rsquo;d like and we&rsquo;ll price them for your team.
                          Prices shown are for a group of 20.
                        </p>
                        <div className="mt-5 grid gap-6">
                          {eventGroups.map((group) => (
                            <div key={group.id}>
                              <h3 className="text-sm text-gold">{group.title}</h3>
                              <ul className="mt-2 flex flex-wrap gap-2">
                                {group.ideas.map((idea) => (
                                  <li key={idea.id}>
                                    <Chip
                                      on={events.includes(idea.id)}
                                      onToggle={() => {
                                        setEvents((current) => toggle(current, idea.id));
                                        setSelectionError(null);
                                      }}
                                      detail={formatEgp(idea.price)}
                                    >
                                      {idea.label}
                                    </Chip>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </div>

            <details className="group/terms mt-8 rounded-2xl border border-line-gold-soft px-5">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-sm text-ink transition-colors hover:text-gold [&::-webkit-details-marker]:hidden">
                How contracts work
                <PlusIcon
                  aria-hidden="true"
                  className="size-4 text-gold transition-transform duration-300 group-open/terms:rotate-45"
                />
              </summary>
              <ul className="grid gap-2 pb-5 text-sm text-ink-soft">
                {specialServicesTerms.map((term) => (
                  <li key={term} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.75em] h-px w-3 shrink-0 bg-gold" />
                    {term}
                  </li>
                ))}
              </ul>
            </details>
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
                Request your packages
              </h2>
              <p className="mt-4 max-w-[46ch] text-ink-soft">
                We&rsquo;ll confirm the price for your office and set up your one-month trial —
                usually within one business day.
              </p>

              <div className="mt-8 rounded-2xl border border-line-gold-soft p-5">
                <p className="text-sm text-ink-soft">Your selection</p>
                {count === 0 ? (
                  <p className="mt-2 text-ink">
                    Nothing chosen yet.{" "}
                    <a href="#packages" className="text-gold underline underline-offset-4">
                      Choose packages
                    </a>
                  </p>
                ) : (
                  <SelectionList packages={packages} flex={chosenFlex} events={events} team={team} />
                )}
                {count > 0 ? (
                  <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 border-t border-line-gold-soft pt-4">
                    <span className="text-sm text-ink-soft">Estimated per month</span>
                    <span className="font-serif text-xl text-white">
                      {estimate.monthly > 0 ? formatEgp(estimate.monthly) : "On request"}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="nav:col-span-7">
              <RequestForm
                submitLabel="Send request"
                helperText="We'll reply within one business day."
                buildRequest={buildRequest}
                onSent={reset}
              >
                {selectionError ? (
                  <p role="alert" className="rounded-xl border border-destructive/50 px-4 py-3 text-sm text-destructive">
                    {selectionError}{" "}
                    <a href="#packages" className="underline underline-offset-4">
                      Go to packages
                    </a>
                  </p>
                ) : null}
                <Field id={`${id}-contract`} label="Contract length (optional)">
                  <Select
                    items={contractLengths.map((c) => ({ value: c.value, label: c.label }))}
                    value={contract}
                    onValueChange={(value) => setContract(value as string | null)}
                  >
                    <SelectTrigger id={`${id}-contract`}>
                      <SelectValue placeholder="Not sure yet" />
                    </SelectTrigger>
                    <SelectContent>
                      {contractLengths.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </RequestForm>
            </div>
          </div>
        </div>
      </section>

      <SelectionBar
        count={count}
        detail={estimate.monthly > 0 ? `About ${formatEgp(estimate.monthly)} a month` : undefined}
      />
    </>
  );
}

type EstimateProps = {
  estimate: ReturnType<typeof estimateSpecialServices>;
  count: number;
  events: number;
};

function Estimate({ estimate, count, events }: EstimateProps) {
  if (count === 0) {
    return (
      <p className="mt-5 text-sm text-ink-soft">
        Choose packages and each one is added to the building as a floor.
      </p>
    );
  }

  return (
    <div className="mt-5" aria-live="polite">
      <dl className="grid gap-2 text-sm">
        {estimate.subtotal > 0 ? (
          <Row label="Packages and items" value={formatEgp(estimate.subtotal)} />
        ) : null}
        {estimate.bundleDiscount > 0 ? (
          <Row label="Two or more packages, 10% off" value={`−${formatEgp(estimate.bundleDiscount)}`} />
        ) : null}
        {estimate.volumeDiscount > 0 ? (
          <Row
            label={`Team size, ${estimate.volumeRate * 100}% off`}
            value={`−${formatEgp(estimate.volumeDiscount)}`}
          />
        ) : null}
        {events > 0 ? <Row label={`${events} event ${events === 1 ? "idea" : "ideas"}`} value="Priced on request" /> : null}
      </dl>
      {estimate.monthly > 0 ? (
        <p className="mt-4 flex items-baseline justify-between gap-3 border-t border-line-gold-soft pt-4">
          <span className="text-sm text-ink-soft">Estimated per month</span>
          <span className="font-serif text-2xl text-white">{formatEgp(estimate.monthly)}</span>
        </p>
      ) : null}
      {estimate.perHire > 0 ? (
        <p className="mt-2 text-xs text-ink-soft">
          Plus {formatEgp(estimate.perHire)} for each new hire&rsquo;s welcome kit.
        </p>
      ) : null}
      {estimate.flexShortBy > 0 ? (
        <p className="mt-3 text-xs text-gold">
          Add {estimate.flexShortBy} more Flexible Pack {estimate.flexShortBy === 1 ? "item" : "items"} to
          take it on its own, or choose a package.
        </p>
      ) : null}
      <p className="mt-3 text-xs text-ink-soft">An estimate — your quote confirms the final price.</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="text-end text-ink">{value}</dd>
    </div>
  );
}

type SelectionListProps = {
  packages: FixedPackageId[];
  flex: string[];
  events: string[];
  team: number;
};

function SelectionList({ packages, flex, events, team }: SelectionListProps) {
  return (
    <ul className="mt-3 grid gap-2 text-sm">
      {fixedPackages
        .filter((p) => packages.includes(p.id))
        .map((p) => (
          <li key={p.id} className="flex justify-between gap-3">
            <span className="text-ink">{p.title}</span>
            <span className="text-ink-soft">{formatEgp(p.perEmployee * team)}</span>
          </li>
        ))}
      {flex.length > 0 ? (
        <li className="flex justify-between gap-3">
          <span className="text-ink">
            Flexible Pack, {flex.length} {flex.length === 1 ? "item" : "items"}
          </span>
        </li>
      ) : null}
      {events.length > 0 ? (
        <li className="text-ink">
          Events: {eventIdeas.filter((e) => events.includes(e.id)).map((e) => e.label).join(", ")}
        </li>
      ) : null}
    </ul>
  );
}
