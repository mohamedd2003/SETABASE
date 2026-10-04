"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react";

type ChipProps = {
  on: boolean;
  onToggle: () => void;
  disabled?: boolean;
  children: ReactNode;
  /** Small detail after the label, e.g. a price. */
  detail?: ReactNode;
};

/** A small pick-me pill: tap to add, tap again to take out. */
export function Chip({ on, onToggle, disabled, children, detail }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={disabled}
      onClick={onToggle}
      className={`inline-flex min-h-11 items-center gap-2 rounded-[1.375rem] border px-4 py-2 text-start text-sm transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
        on
          ? "border-gold bg-gold text-navy-deep"
          : "border-line-gold-soft text-ink hover:border-gold"
      }`}
    >
      {on ? (
        <CheckIcon aria-hidden="true" strokeWidth={2.5} className="size-3.5 shrink-0" />
      ) : (
        <PlusIcon aria-hidden="true" className="size-3.5 shrink-0 text-gold" />
      )}
      <span>{children}</span>
      {detail ? (
        <span className={`text-xs ${on ? "text-navy-deep/75" : "text-ink-soft"}`}>{detail}</span>
      ) : null}
    </button>
  );
}

type SelectCardProps = {
  on: boolean;
  onToggle: () => void;
  onPreview?: (previewing: boolean) => void;
  /** Small line above the title. */
  kicker: string;
  title: string;
  summary: string;
  /** Shown beside the title, e.g. the price. */
  footer?: ReactNode;
  /** What's inside, shown when the row is opened. */
  included: ReactNode;
};

/**
 * A package as an accordion row: the row opens to show what's inside, and its own button
 * adds it to the request. The panel animates its height through a 0fr → 1fr grid row.
 */
export function SelectCard({ on, onToggle, onPreview, kicker, title, summary, footer, included }: SelectCardProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <div
      data-on={on ? "" : undefined}
      onPointerEnter={() => onPreview?.(true)}
      onPointerLeave={() => onPreview?.(false)}
      className="package-card w-full rounded-3xl border border-line-gold-soft bg-[var(--surface-dusk)]"
    >
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((v) => !v)}
          className="group/row flex min-w-0 flex-1 items-start gap-4 text-start"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-sm text-gold">{kicker}</span>
            <span className="mt-1 block font-serif text-[1.5rem]/[1.15] font-medium text-white transition-colors group-hover/row:text-gold">
              {title}
            </span>
            <span className="mt-1.5 block max-w-[52ch] text-sm text-ink-soft">{summary}</span>
            {footer ? <span className="mt-3 block">{footer}</span> : null}
          </span>
          <ChevronDownIcon
            aria-hidden="true"
            className={`mt-1 size-5 shrink-0 text-gold transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>
        <button
          type="button"
          aria-pressed={on}
          onClick={onToggle}
          aria-label={on ? `Remove ${title}` : `Add ${title}`}
          className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full border px-5 text-sm sm:w-28 font-medium transition-colors duration-300 sm:self-center ${
            on
              ? "border-gold bg-gold text-navy-deep hover:bg-[color-mix(in_srgb,var(--gold)_85%,white)]"
              : "border-gold text-gold hover:bg-gold hover:text-navy-deep"
          }`}
        >
          {on ? <CheckIcon aria-hidden="true" strokeWidth={2.5} className="size-4" /> : <PlusIcon aria-hidden="true" className="size-4" />}
          {on ? "Added" : "Add"}
        </button>
      </div>

      <div
        id={`${id}-panel`}
        className={`grid transition-[grid-template-rows] duration-400 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        inert={!open}
      >
        <div className="overflow-hidden">
          <div className="mx-5 border-t border-line-gold-soft py-5 text-sm sm:mx-6">{included}</div>
        </div>
      </div>
    </div>
  );
}

type Tab = { id: string; label: string; count: number; content: ReactNode };

/** Tabs with arrow-key movement; each tab's count shows how much is chosen inside it. */
export function Tabs({ tabs, active, onChange }: { tabs: Tab[]; active: string; onChange: (id: string) => void }) {
  const id = useId();
  const list = useRef<HTMLDivElement>(null);

  function onKeyDown(e: KeyboardEvent) {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const index = tabs.findIndex((t) => t.id === active);
    const next = tabs[(index + step + tabs.length) % tabs.length];
    onChange(next.id);
    list.current?.querySelector<HTMLElement>(`[data-tab="${next.id}"]`)?.focus();
  }

  return (
    <div>
      <div
        ref={list}
        role="tablist"
        onKeyDown={onKeyDown}
        className="flex gap-0.5 overflow-x-auto rounded-full border border-line-gold-soft bg-navy-deep/60 p-1 [scrollbar-width:none] sm:gap-1"
      >
        {tabs.map((tab) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              data-tab={tab.id}
              id={`${id}-${tab.id}-tab`}
              aria-selected={selected}
              aria-controls={`${id}-${tab.id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(tab.id)}
              className={`flex min-h-10 flex-1 shrink-0 items-center justify-center gap-1.5 rounded-full px-2.5 text-[0.8125rem] whitespace-nowrap sm:gap-2 sm:px-4 sm:text-sm transition-colors duration-300 ${
                selected ? "bg-gold text-navy-deep" : "text-ink-soft hover:text-white"
              }`}
            >
              {tab.label}
              {tab.count > 0 ? (
                <span
                  className={`min-w-5 rounded-full px-1.5 text-xs leading-5 ${
                    selected ? "bg-navy-deep text-gold" : "bg-gold/20 text-gold"
                  }`}
                >
                  {tab.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${id}-${tab.id}-panel`}
          aria-labelledby={`${id}-${tab.id}-tab`}
          hidden={tab.id !== active}
          className="mt-6"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
