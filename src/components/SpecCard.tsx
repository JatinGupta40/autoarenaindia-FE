import type { LucideIcon } from "lucide-react";
import { CountUp } from "@/components/CountUp";

/**
 * One scannable specification: icon, label, and a large value. Numeric values count up
 * when they scroll into view; anything else renders as text.
 */
export function SpecCard({
  icon: Icon,
  label,
  value,
  unit,
  highlight = false,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string | null | undefined;
  unit?: string;
  highlight?: boolean;
}) {
  const str = value === null || value === undefined ? "" : String(value).trim();
  const empty = str === "";
  const isNumber = /^\d+(\.\d+)?$/.test(str);
  const decimals = str.split(".")[1]?.length ?? 0;

  return (
    <div
      className={`spec-card group relative overflow-hidden rounded-2xl border p-5 transition-all duration-500 ease-premium hover:-translate-y-1 ${
        highlight
          ? "spec-card--highlight border-accent-400/30 bg-accent-400/[0.06] hover:border-accent-400/60"
          : "border-border bg-surface hover:border-accent-400/40 hover:shadow-card-hover"
      }`}
    >
      <div className="spec-card__header flex items-center gap-2 text-muted">
        <span className="spec-card__icon-wrap grid h-8 w-8 place-items-center rounded-lg bg-surface-2 text-foreground transition-colors duration-300 group-hover:bg-accent-400 group-hover:text-ink-950">
          <Icon size={16} strokeWidth={2} aria-hidden className="spec-card__icon" />
        </span>
        <span className="spec-card__label text-xs font-medium">{label}</span>
      </div>
      <p className="spec-card__value num mt-4 text-2xl font-bold text-foreground sm:text-3xl">
        {empty ? (
          <span className="spec-card__empty text-muted">—</span>
        ) : isNumber ? (
          <CountUp to={Number(str)} decimals={decimals} />
        ) : (
          <span className="spec-card__text text-xl sm:text-2xl">{value}</span>
        )}
        {!empty && unit && <span className="spec-card__unit ml-1 text-sm font-medium text-muted">{unit}</span>}
      </p>
    </div>
  );
}
