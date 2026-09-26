"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * Sticky bar under the header on car pages: section tabs with scroll-spy, plus the
 * car name and price, which slide in once the hero has scrolled away.
 */
export function CarDetailNav({
  name,
  price,
  sections,
}: {
  name: string;
  price: string;
  sections: { id: string; label: string }[];
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const [pastHero, setPastHero] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = document.getElementById("car-hero");
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), {
      rootMargin: "-120px 0px 0px 0px",
    });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  // Keep the active tab in view on narrow screens without moving the page.
  useEffect(() => {
    const strip = tabsRef.current;
    const tab = strip?.querySelector<HTMLElement>(`[data-id="${activeId}"]`);
    if (!strip || !tab) return;
    strip.scrollTo({ left: tab.offsetLeft - 16, behavior: "smooth" });
  }, [activeId]);

  return (
    <div className="car-detail-nav sticky top-(--header-h) z-40 border-b border-border bg-background/85 backdrop-blur-xl backdrop-saturate-150">
      <div className="car-detail-nav__inner container-page flex h-14 items-center gap-6">
        <AnimatePresence initial={false}>
          {pastHero && (
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.3 }}
              className="car-detail-nav__summary hidden shrink-0 items-baseline gap-3 lg:flex"
            >
              <span className="car-detail-nav__name font-display font-semibold">{name}</span>
              <span className="car-detail-nav__price num text-sm text-muted">{price}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <nav aria-label="Sections" ref={tabsRef} className="car-detail-nav__tabs scrollbar-none -mx-4 flex h-full flex-1 items-stretch gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {sections.map((s) => {
            const active = s.id === activeId;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                data-id={s.id}
                aria-current={active ? "location" : undefined}
                className={`car-detail-nav__tab relative flex items-center px-3 text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
                  active ? "car-detail-nav__tab--active text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {s.label}
                {active && (
                  <motion.span
                    layoutId="detail-tab"
                    className="car-detail-nav__indicator absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-accent-400"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        <a href="#price" className="car-detail-nav__cta btn btn-primary hidden shrink-0 !py-2 sm:inline-flex">
          Check prices
        </a>
      </div>
    </div>
  );
}
