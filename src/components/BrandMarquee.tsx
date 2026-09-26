import Link from "next/link";
import type { DrupalTerm } from "@/types/drupal";

/** Endlessly scrolling brand strip. Pauses on hover/focus; static under reduced motion. */
export function BrandMarquee({ brands }: { brands: DrupalTerm[] }) {
  if (brands.length === 0) return null;
  // Repeat short lists so one copy is always wider than the viewport.
  const base = brands.length < 8 ? [...brands, ...brands, ...brands] : brands;

  const row = (hidden: boolean) =>
    base.map((brand, i) => (
      <li key={`${brand.id}-${i}`} className="brand-marquee__item">
        <Link
          href={`/cars?brand=${encodeURIComponent(brand.name)}`}
          tabIndex={hidden || i >= brands.length ? -1 : undefined}
          className="brand-marquee__link block whitespace-nowrap px-8 font-display text-2xl font-semibold text-ink-400 transition-colors duration-300 hover:text-foreground sm:text-3xl"
        >
          {brand.name}
        </Link>
      </li>
    ));

  return (
    <div className="brand-marquee group relative overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div className="brand-marquee__track flex w-max animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
        <ul className="brand-marquee__list flex" aria-label="Browse by brand">{row(false)}</ul>
        <ul className="brand-marquee__list brand-marquee__list--clone flex" aria-hidden>{row(true)}</ul>
      </div>
    </div>
  );
}
