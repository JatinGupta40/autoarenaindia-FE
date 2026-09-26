"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";

/** Counts from 0 to `to` the first time it scrolls into view. */
export function CountUp({
  to,
  decimals = 0,
  suffix = "",
  duration = 1.2,
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const count = useMotionValue(reduce ? to : 0);
  const text = useTransform(count, (v) =>
    v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  );

  useEffect(() => {
    if (!isInView || reduce) return;
    const controls = animate(count, to, { duration, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [isInView, reduce, to, count, duration]);

  return (
    <span ref={ref} className="count-up">
      <motion.span className="count-up__value">{text}</motion.span>
      {suffix}
    </span>
  );
}
