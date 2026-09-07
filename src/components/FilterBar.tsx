import Link from "next/link";
import type { DrupalTerm } from "@/types/drupal";

function buildHref(base: Record<string, string | undefined>, key: string, value: string) {
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
}: {
  label: string;
  filterKey: string;
  options: DrupalTerm[];
  active?: string;
  current: Record<string, string | undefined>;
}) {
  if (options.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = active === option.name;
          return (
            <Link
              key={option.id}
              href={buildHref(current, filterKey, option.name)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                isActive
                  ? "border-accent-400 bg-accent-400 text-primary-800 font-medium"
                  : "border-border text-foreground/80 hover:border-accent-400"
              }`}
            >
              {option.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function FilterBar({
  brands,
  bodyTypes,
  fuels,
  current,
}: {
  brands: DrupalTerm[];
  bodyTypes: DrupalTerm[];
  fuels: DrupalTerm[];
  current: { brand?: string; bodyType?: string; fuel?: string };
}) {
  const hasFilters = current.brand || current.bodyType || current.fuel;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-600 text-foreground">Filter cars</h2>
        {hasFilters && (
          <Link href="/cars" className="text-sm text-accent-500 hover:text-accent-400">
            Clear all
          </Link>
        )}
      </div>
      <FilterGroup label="Brand" filterKey="brand" options={brands} active={current.brand} current={current} />
      <FilterGroup label="Body type" filterKey="bodyType" options={bodyTypes} active={current.bodyType} current={current} />
      <FilterGroup label="Fuel" filterKey="fuel" options={fuels} active={current.fuel} current={current} />
    </div>
  );
}
