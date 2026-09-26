"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Snap-scrolling horizontal rail with prev/next buttons. Children should be fixed-width
 * items (e.g. `w-[80%] sm:w-[340px] shrink-0 snap-start`).
 */
export function HorizontalScroller({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setEdges({
        start: el.scrollLeft <= 4,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
      });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const button =
    "grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-foreground transition-all duration-300 hover:border-accent-400 hover:text-link disabled:pointer-events-none disabled:opacity-30";

  return (
    <div className="horizontal-scroller">
      <div className="horizontal-scroller__controls mb-4 hidden justify-end gap-2 sm:flex">
        <button type="button" className={`horizontal-scroller__prev ${button}`} onClick={() => scrollBy(-1)} disabled={edges.start} aria-label={`Scroll ${label} left`}>
          <ChevronLeft size={18} className="horizontal-scroller__prev-icon" />
        </button>
        <button type="button" className={`horizontal-scroller__next ${button}`} onClick={() => scrollBy(1)} disabled={edges.end} aria-label={`Scroll ${label} right`}>
          <ChevronRight size={18} className="horizontal-scroller__next-icon" />
        </button>
      </div>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="horizontal-scroller__track scrollbar-none -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 focus-visible:outline-none"
      >
        {children}
      </div>
    </div>
  );
}
