import { PageHeroSkeleton } from "@/components/PageHeroSkeleton";

export default function CarsLoading() {
  return (
    <>
      <PageHeroSkeleton>
        <div className="cars-loading__search mt-8 h-14 w-full max-w-xl rounded-full bg-white/10" />
      </PageHeroSkeleton>
      <div className="cars-loading__content container-page grid animate-pulse gap-8 py-10 sm:py-14 lg:grid-cols-[300px_1fr]">
        <div className="cars-loading__filters hidden h-96 rounded-3xl bg-surface-2 lg:block" />
        <div className="cars-loading__grid grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="cars-loading__card overflow-hidden rounded-3xl border border-border bg-surface">
              <div className="cars-loading__card-image aspect-[16/10] bg-surface-2" />
              <div className="cars-loading__card-body space-y-3 p-5">
                <div className="cars-loading__card-eyebrow h-3 w-16 rounded-full bg-surface-2" />
                <div className="cars-loading__card-title h-5 w-40 rounded-full bg-surface-2" />
                <div className="cars-loading__card-specs h-12 rounded-xl bg-surface-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
