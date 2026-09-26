"use client";

import { MotionConfig } from "motion/react";

/** Honour the OS "reduce motion" setting for every motion component in the app. */
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
