import type { Metadata } from "next";
import { getCars, getTaxonomyTerms } from "@/lib/queries";
import { CarCard } from "@/components/CarCard";
import { CarsExplorer } from "@/components/CarsExplorer";
import { EmptyState } from "@/components/EmptyState";
import { Reveal, RevealItem } from "@/components/Reveal";

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

      <CarsExplorer brands={brands} bodyTypes={bodyTypes} fuels={fuels} current={params}>
        <p className="text-sm text-muted mb-4">{cars.length} car{cars.length === 1 ? "" : "s"} found</p>
        {cars.length === 0 ? (
          <EmptyState message="No cars match these filters yet." />
        ) : (
          <Reveal key={JSON.stringify(params)} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {cars.map((car) => (
              <RevealItem key={car.id}>
                <CarCard car={car} />
              </RevealItem>
            ))}
          </Reveal>
        )}
      </CarsExplorer>
    </div>
  );
}
