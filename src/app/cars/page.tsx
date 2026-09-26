import type { Metadata } from "next";
import Form from "next/form";
import { Search } from "lucide-react";
import { getCars, getTaxonomyTerms } from "@/lib/queries";
import { CarCard } from "@/components/CarCard";
import { CarsExplorer } from "@/components/CarsExplorer";
import { EmptyState } from "@/components/EmptyState";
import { PageHero } from "@/components/PageHero";
import { Reveal, RevealItem } from "@/components/Reveal";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Cars",
  description: "Browse new car launches and facelifts by brand, body type and fuel.",
};

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; bodyType?: string; fuel?: string; q?: string }>;
}) {
  const params = await searchParams;

  const [cars, brands, bodyTypes, fuels] = await Promise.all([
    getCars({ brand: params.brand, bodyType: params.bodyType, fuel: params.fuel, q: params.q }),
    getTaxonomyTerms("brands"),
    getTaxonomyTerms("body_type"),
    getTaxonomyTerms("fuel"),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Showroom"
        title="Find your next car"
        description="Every model we track, with price, mileage and key specs up front. Narrow it down by brand, body type or fuel."
      >
        <Form action="/cars" className="cars-page__search glass flex max-w-xl items-center gap-2 rounded-full p-1.5 pl-5 focus-within:shadow-glow">
          {/* Keep the active filters when searching. */}
          {params.brand && <input type="hidden" name="brand" className="cars-page__search-filter" value={params.brand} />}
          {params.bodyType && <input type="hidden" name="bodyType" className="cars-page__search-filter" value={params.bodyType} />}
          {params.fuel && <input type="hidden" name="fuel" className="cars-page__search-filter" value={params.fuel} />}
          <Search size={18} className="cars-page__search-icon shrink-0 text-ink-400" aria-hidden />
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Search a brand or model"
            aria-label="Search a brand or model"
            className="cars-page__search-input h-11 min-w-0 flex-1 bg-transparent text-white placeholder:text-ink-500 focus:outline-none"
          />
          <button type="submit" className="cars-page__search-button btn btn-primary shrink-0 !py-2.5">
            Search
          </button>
        </Form>
      </PageHero>

      <div className="cars-page__results container-page py-10 sm:py-14">
        <CarsExplorer brands={brands} bodyTypes={bodyTypes} fuels={fuels} current={params} resultCount={cars.length}>
          {cars.length === 0 ? (
            <EmptyState message="No cars match these filters yet." />
          ) : (
            <Reveal key={JSON.stringify(params)} className="cars-page__grid grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {cars.map((car, i) => (
                <RevealItem key={car.id} className="cars-page__grid-item">
                  <CarCard car={car} priority={i < 3} />
                </RevealItem>
              ))}
            </Reveal>
          )}
        </CarsExplorer>
      </div>
    </>
  );
}
