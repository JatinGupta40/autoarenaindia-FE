import type { Metadata } from "next";
import { getCars, getTaxonomyTerms } from "@/lib/queries";
import { CarCard } from "@/components/CarCard";
import { FilterBar } from "@/components/FilterBar";
import { EmptyState } from "@/components/EmptyState";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Cars",
  description: "Browse new car launches and facelifts by brand, body type and fuel.",
};

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; bodyType?: string; fuel?: string }>;
}) {
  const params = await searchParams;

  const [cars, brands, bodyTypes, fuels] = await Promise.all([
    getCars({ brand: params.brand, bodyType: params.bodyType, fuel: params.fuel }),
    getTaxonomyTerms("brands"),
    getTaxonomyTerms("body_type"),
    getTaxonomyTerms("fuel"),
  ]);

  return (
    <div className="mx-auto max-w-(--container-page) px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl font-700 text-primary-800 dark:text-accent-100 mb-6">
        Cars
      </h1>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <FilterBar brands={brands} bodyTypes={bodyTypes} fuels={fuels} current={params} />
        </aside>

        <div>
          <p className="text-sm text-muted mb-4">{cars.length} car{cars.length === 1 ? "" : "s"} found</p>
          {cars.length === 0 ? (
            <EmptyState message="No cars match these filters yet." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {cars.map((car) => <CarCard key={car.id} car={car} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
