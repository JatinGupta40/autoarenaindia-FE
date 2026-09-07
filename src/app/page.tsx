import Link from "next/link";
import { getArticles, getFeaturedCars, getNews, getTaxonomyTerms } from "@/lib/queries";
import { HeroCarousel } from "@/components/HeroCarousel";
import { NewsCard } from "@/components/NewsCard";
import { ArticleCard } from "@/components/ArticleCard";
import { SectionHeading } from "@/components/SectionHeading";
import { EmptyState } from "@/components/EmptyState";

export const revalidate = 60;

export default async function HomePage() {
  const [featuredCars, launches, facelifts, articles, brands] = await Promise.all([
    getFeaturedCars(4),
    getNews({ type: "New Launch", limit: 3 }),
    getNews({ type: "Facelift", limit: 3 }),
    getArticles(3),
    getTaxonomyTerms("brands"),
  ]);

  return (
    <div className="mx-auto max-w-(--container-page) px-4 sm:px-6 py-8 space-y-16">
      <HeroCarousel cars={featuredCars} />

      {brands.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 justify-center text-sm font-medium text-muted">
          {brands.map((brand) => (
            <Link key={brand.id} href={`/cars?brand=${encodeURIComponent(brand.name)}`} className="hover:text-accent-500">
              {brand.name}
            </Link>
          ))}
        </div>
      )}

      <section>
        <SectionHeading title="Latest Launches" subtitle="Newly launched cars in India" viewAllHref="/news?type=New Launch" />
        {launches.length === 0 ? (
          <EmptyState message="No launch stories yet." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {launches.map((n) => <NewsCard key={n.id} news={n} />)}
          </div>
        )}
      </section>

      <section>
        <SectionHeading title="Latest Facelifts" subtitle="Mid-life updates to your favourite cars" viewAllHref="/news?type=Facelift" />
        {facelifts.length === 0 ? (
          <EmptyState message="No facelift stories yet." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {facelifts.map((n) => <NewsCard key={n.id} news={n} />)}
          </div>
        )}
      </section>

      <section>
        <SectionHeading title="From the Blog" subtitle="Buying guides, reviews and maintenance tips" viewAllHref="/blog" />
        {articles.length === 0 ? (
          <EmptyState message="No blog posts yet." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
          </div>
        )}
      </section>
    </div>
  );
}
