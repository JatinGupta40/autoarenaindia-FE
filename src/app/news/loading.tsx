import { PageHeroSkeleton } from "@/components/PageHeroSkeleton";

export default function NewsLoading() {
  return (
    <>
      <PageHeroSkeleton>
        <div className="news-loading__filters mt-8 flex flex-wrap gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="news-loading__filter-chip h-9 w-24 rounded-full bg-white/10" />
          ))}
        </div>
      </PageHeroSkeleton>
      <div className="news-loading__grid container-page grid animate-pulse gap-6 py-12 sm:grid-cols-2 sm:py-16 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="news-loading__card overflow-hidden rounded-3xl border border-border bg-surface">
            <div className="news-loading__card-image aspect-[16/10] bg-surface-2" />
            <div className="news-loading__card-body space-y-3 p-5">
              <div className="news-loading__card-meta h-3 w-24 rounded-full bg-surface-2" />
              <div className="news-loading__card-title h-5 w-full rounded-full bg-surface-2" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
