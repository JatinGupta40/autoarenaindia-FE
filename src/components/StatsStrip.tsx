import { CountUp } from "@/components/CountUp";

export function StatsStrip({
  stats,
}: {
  stats: { label: string; value: number; suffix?: string }[];
}) {
  return (
    <div className="stats-strip grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="stats-strip__item bg-surface p-6 transition-colors duration-300 hover:bg-surface-2 sm:p-8">
          <p className="stats-strip__value num text-4xl font-bold text-foreground sm:text-5xl">
            <CountUp to={stat.value} />
            <span className="stats-strip__suffix text-link">{stat.suffix}</span>
          </p>
          <p className="stats-strip__label mt-2 text-sm text-muted">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
