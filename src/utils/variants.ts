import type { Car, CarVariant, DrupalTerm, Powertrain } from "@/types/drupal";
import { formatRange } from "@/utils/format";

/** Cheapest price a variant is sold at across its powertrains, or null when unpriced. */
export function variantPriceFrom(variant: CarVariant): number | null {
  const prices = (variant.field_powertrains ?? [])
    .map((p) => p.ex_showroom_price)
    .filter((p): p is number => p !== null);
  return prices.length ? Math.min(...prices) : null;
}

/** Published variants, cheapest first. Unpriced variants go last. */
export function carVariants(car: Car): CarVariant[] {
  return (car.field_car_variants ?? [])
    .filter((v) => v.status !== false)
    .sort((a, b) => (variantPriceFrom(a) ?? Infinity) - (variantPriceFrom(b) ?? Infinity));
}

/** A variant's powertrains, cheapest first. Unpriced ones go last. */
export function variantPowertrains(variant: CarVariant): Powertrain[] {
  return [...(variant.field_powertrains ?? [])].sort(
    (a, b) => (a.ex_showroom_price ?? Infinity) - (b.ex_showroom_price ?? Infinity),
  );
}

/** Every powertrain of every published variant. */
function carPowertrains(car: Car): Powertrain[] {
  return carVariants(car).flatMap((v) => v.field_powertrains ?? []);
}

/** Resolves a powertrain's term ID against the car's included fuel / transmission terms. */
export function termName(terms: DrupalTerm[] | null | undefined, tid: number | null): string {
  if (tid === null) return "";
  return terms?.find((t) => t.drupal_internal__tid === tid)?.name ?? "";
}

export function engineRange(car: Car) {
  return formatRange(carPowertrains(car).map((p) => p.engine_cc), "cc");
}

export function mileageRange(car: Car) {
  return formatRange(carPowertrains(car).map((p) => p.mileage_kmpl), "km/l");
}

/** Best claimed mileage across powertrains, for comparisons. */
export function bestMileage(car: Car): number | null {
  const nums = carPowertrains(car)
    .map((p) => Number(p.mileage_kmpl))
    .filter((n) => n > 0);
  return nums.length ? Math.max(...nums) : null;
}
