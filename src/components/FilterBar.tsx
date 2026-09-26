"use client";

import { Check } from "lucide-react";
import type { DrupalTerm } from "@/types/drupal";

export type CarQuery = { brand?: string; bodyType?: string; fuel?: string; q?: string };

/** Toggles `key=value` in the current query (removing it if already set). */
export function buildHref(base: Record<string, string | undefined>, key: string, value: string) {
  const next = { ...base };
  if (next[key] === value) {
    delete next[key];
  } else {
    next[key] = value;
  }
  const query = new URLSearchParams(
    Object.entries(next).filter(([, v]) => v) as [string, string][]
  ).toString();
  return query ? `/cars?${query}` : "/cars";
}

function FilterGroup({
  label,
  filterKey,
  options,
  active,
  current,
  onNavigate,
}: {
  label: string;
  filterKey: string;
  options: DrupalTerm[];
  active?: string;
  current: Record<string, string | undefined>;
  onNavigate: (href: string) => void;
}) {
  if (options.length === 0) return null;
  return (
    <fieldset className="filter-group">
      <legend className="filter-group__legend eyebrow mb-3 text-muted">{label}</legend>
      <div className="filter-group__options flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = active === option.name;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onNavigate(buildHref(current, filterKey, option.name))}
              className={`filter-group__option inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-all duration-300 ease-premium active:scale-95 ${
                isActive
                  ? "filter-group__option--active border-ink-900 bg-ink-900 font-medium text-white dark:border-accent-400 dark:bg-accent-400 dark:text-ink-950"
                  : "border-border bg-surface text-foreground/80 hover:border-ink-400 hover:text-foreground"
              }`}
            >
              {isActive && <Check size={14} strokeWidth={2.5} aria-hidden className="filter-group__option-icon" />}
              {option.name}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function FilterBar({
  brands,
  bodyTypes,
  fuels,
  current,
  onNavigate,
  pending,
}: {
  brands: DrupalTerm[];
  bodyTypes: DrupalTerm[];
  fuels: DrupalTerm[];
  current: CarQuery;
  onNavigate: (href: string) => void;
  pending: boolean;
}) {
  const hasFilters = current.brand || current.bodyType || current.fuel || current.q;

  return (
    <div className={`filter-bar space-y-6 rounded-3xl border border-border bg-surface p-6 transition-opacity ${pending ? "filter-bar--pending opacity-60" : ""}`}>
      <div className="filter-bar__header flex items-center justify-between">
        <h2 className="filter-bar__title font-display text-lg font-semibold text-foreground">Filters</h2>
        {hasFilters && (
          <button
            type="button"
            onClick={() => onNavigate("/cars")}
            className="filter-bar__clear text-sm font-medium text-link hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
      <FilterGroup label="Brand" filterKey="brand" options={brands} active={current.brand} current={current} onNavigate={onNavigate} />
      <FilterGroup label="Body type" filterKey="bodyType" options={bodyTypes} active={current.bodyType} current={current} onNavigate={onNavigate} />
      <FilterGroup label="Fuel" filterKey="fuel" options={fuels} active={current.fuel} current={current} onNavigate={onNavigate} />
    </div>
  );
}
