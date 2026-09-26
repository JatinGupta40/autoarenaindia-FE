"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { SlidersHorizontal, X } from "lucide-react";
import type { DrupalTerm } from "@/types/drupal";
import { buildHref, FilterBar, type CarQuery } from "@/components/FilterBar";

const LABELS: Record<keyof CarQuery, string> = { q: "Search", brand: "Brand", bodyType: "Body", fuel: "Fuel" };

export function CarsExplorer({
  brands,
  bodyTypes,
  fuels,
  current,
  resultCount,
  children,
}: {
  brands: DrupalTerm[];
  bodyTypes: DrupalTerm[];
  fuels: DrupalTerm[];
  current: CarQuery;
  resultCount: number;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = (href: string) => {
    startTransition(() => router.push(href, { scroll: false }));
  };

  const active = (Object.keys(LABELS) as (keyof CarQuery)[]).filter((k) => current[k]);

  const filterBar = (
    <FilterBar brands={brands} bodyTypes={bodyTypes} fuels={fuels} current={current} onNavigate={navigate} pending={isPending} />
  );

  return (
    <div className="cars-explorer grid gap-8 lg:grid-cols-[300px_1fr]">
      <aside className="cars-explorer__sidebar hidden lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:block lg:self-start">{filterBar}</aside>

      <div className="cars-explorer__main">
        <div className="cars-explorer__toolbar mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="cars-explorer__count text-sm text-muted" aria-live="polite">
            <span className="cars-explorer__count-value num font-semibold text-foreground">{resultCount}</span> car{resultCount === 1 ? "" : "s"} found
          </p>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            className="cars-explorer__filters-toggle btn btn-outline !py-2 lg:hidden"
          >
            <SlidersHorizontal size={16} className="cars-explorer__filters-toggle-icon" /> Filters{active.length > 0 && ` (${active.length})`}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="cars-explorer__mobile-filters overflow-hidden lg:hidden"
            >
              <div className="cars-explorer__mobile-filters-inner pb-6">{filterBar}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {active.length > 0 && (
          <div className="cars-explorer__chips mb-6 flex flex-wrap gap-2">
            {active.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => navigate(buildHref(current, key, current[key]!))}
                className="cars-explorer__chip group inline-flex items-center gap-1.5 rounded-full bg-surface-2 py-1.5 pr-2 pl-3.5 text-sm transition-colors hover:bg-border"
                aria-label={`Remove ${LABELS[key]} filter ${current[key]}`}
              >
                <span className="cars-explorer__chip-label text-muted">{LABELS[key]}:</span>
                <span className="cars-explorer__chip-value font-medium">{current[key]}</span>
                <X size={14} className="cars-explorer__chip-icon text-muted transition-transform duration-300 group-hover:rotate-90" />
              </button>
            ))}
          </div>
        )}

        <div className={`cars-explorer__results transition-opacity duration-300 ${isPending ? "cars-explorer__results--pending opacity-50" : "opacity-100"}`} aria-busy={isPending}>
          {children}
        </div>
      </div>
    </div>
  );
}
