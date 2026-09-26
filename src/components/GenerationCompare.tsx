import Link from "next/link";
import type { Car } from "@/types/drupal";
import { formatGenerationRange, formatPriceLakh, joinNames } from "@/utils/format";
import { bestMileage, engineRange, mileageRange } from "@/utils/variants";

type Row = {
  label: string;
  value: (car: Car) => string;
  /** Numeric value used to mark the best column; omit for non-comparable rows. */
  score?: (car: Car) => number | null;
  better?: "higher" | "lower";
};

const ROWS: Row[] = [
  { label: "Starting price", value: (c) => formatPriceLakh(c.field_price_min), score: (c) => c.field_price_min, better: "lower" },
  { label: "Engine", value: engineRange },
  { label: "Mileage", value: mileageRange, score: bestMileage, better: "higher" },
  { label: "Fuel", value: (c) => joinNames(c.field_fuel_type) },
  { label: "Transmission", value: (c) => joinNames(c.field_transmission) },
  { label: "Body type", value: (c) => c.field_body_type?.name ?? "—" },
];

/**
 * Side-by-side comparison of this car against its other generations. Cells that differ
 * from this car are marked, and the best price/mileage gets a badge.
 */
export function GenerationCompare({ car, others }: { car: Car; others: Car[] }) {
  const cars = [car, ...others].sort((a, b) => b.field_year_start - a.field_year_start).slice(0, 4);

  const best = (row: Row) => {
    if (!row.score) return null;
    const scored = cars.map((c) => ({ id: c.id, s: row.score!(c) })).filter((x) => x.s !== null) as { id: string; s: number }[];
    if (scored.length < 2) return null;
    const pick = scored.reduce((a, b) => ((row.better === "higher" ? b.s > a.s : b.s < a.s) ? b : a));
    return scored.every((x) => x.s === pick.s) ? null : pick.id;
  };

  return (
    <div className="generation-compare -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <table className="generation-compare__table w-full min-w-[560px] border-separate border-spacing-0 text-sm">
        <thead className="generation-compare__head">
          <tr className="generation-compare__head-row">
            <th scope="col" className="generation-compare__corner sticky left-0 z-10 w-36 bg-background" />
            {cars.map((c) => {
              const current = c.id === car.id;
              return (
                <th key={c.id} scope="col" className="generation-compare__column-head p-2 text-left align-bottom font-normal">
                  <div
                    className={`generation-compare__column rounded-2xl border p-4 transition-all duration-300 ${
                      current ? "generation-compare__column--current border-accent-400/50 bg-accent-400/[0.06]" : "border-border bg-surface hover:-translate-y-0.5 hover:border-ink-400"
                    }`}
                  >
                    <p className="generation-compare__column-label eyebrow text-muted">{current ? "This car" : c.field_year_end === null ? "Current gen" : "Generation"}</p>
                    {current ? (
                      <p className="generation-compare__column-years num mt-1 text-lg font-bold">{formatGenerationRange(c.field_year_start, c.field_year_end)}</p>
                    ) : (
                      <Link href={c.path?.alias || `/cars/${c.id}`} className="generation-compare__column-link num mt-1 block text-lg font-bold hover:text-link">
                        {formatGenerationRange(c.field_year_start, c.field_year_end)} →
                      </Link>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="generation-compare__body">
          {ROWS.map((row) => {
            const bestId = best(row);
            const base = row.value(car);
            return (
              <tr key={row.label} className="generation-compare__row group">
                <th
                  scope="row"
                  className="generation-compare__row-label sticky left-0 z-10 border-b border-border bg-background py-4 pr-4 text-left text-xs font-medium text-muted transition-colors group-hover:text-foreground"
                >
                  {row.label}
                </th>
                {cars.map((c) => {
                  const value = row.value(c);
                  const differs = c.id !== car.id && value !== base;
                  return (
                    <td key={c.id} className="generation-compare__cell border-b border-border px-4 py-4 transition-colors group-hover:bg-surface-2/60">
                      <span className="generation-compare__cell-content inline-flex flex-wrap items-center gap-2">
                        {differs && <span className="generation-compare__diff-dot h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" aria-hidden />}
                        <span className={`generation-compare__value num ${differs ? "generation-compare__value--differs font-semibold text-foreground" : "text-foreground/80"}`}>{value}</span>
                        {bestId === c.id && (
                          <span className="generation-compare__best rounded-full bg-success-400/15 px-2 py-0.5 text-[10px] font-semibold text-success-400">
                            {row.better === "lower" ? "Lowest" : "Best"}
                          </span>
                        )}
                        {differs && <span className="generation-compare__sr-note sr-only">(differs from this car)</span>}
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="generation-compare__legend mt-4 flex items-center gap-2 text-xs text-muted">
        <span className="generation-compare__legend-dot h-1.5 w-1.5 rounded-full bg-accent-400" aria-hidden /> Differs from this car
      </p>
    </div>
  );
}
