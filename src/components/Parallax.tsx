"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/** Drifts its content vertically by up to `offset` px as the element scrolls through the viewport. */
export function Parallax({
  children,
  className,
  offset = 60,
}: {
  children: React.ReactNode;
  className?: string;
  offset?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <div ref={ref} className={["parallax", className].filter(Boolean).join(" ")}>
      <motion.div style={{ y }} className="parallax__layer relative h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}
