"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useMotionValue, useTransform, motion } from "motion/react";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString("en-IN"));

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, to, { duration: 1.2, ease: "easeOut" });
    return controls.stop;
  }, [isInView, to, count]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export function StatsStrip({
  stats,
}: {
  stats: { label: string; value: number; suffix?: string }[];
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 rounded-2xl border border-border bg-surface p-6 sm:p-8">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="font-display text-3xl sm:text-4xl font-700 text-primary-800 dark:text-accent-100">
            <Counter to={stat.value} suffix={stat.suffix} />
          </p>
          <p className="text-sm text-muted mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
