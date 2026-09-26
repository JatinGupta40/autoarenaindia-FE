import Link from "next/link";
import { getArticles, getCars, getFeaturedCars, getNews, getTaxonomyTerms } from "@/lib/queries";
import { HeroCarousel } from "@/components/HeroCarousel";
import { NewsCard } from "@/components/NewsCard";
import { ArticleCard } from "@/components/ArticleCard";
import { SectionHeading } from "@/components/SectionHeading";
import { EmptyState } from "@/components/EmptyState";
import { Reveal, RevealItem } from "@/components/Reveal";
import { StatsStrip } from "@/components/StatsStrip";

export const revalidate = 60;

export default async function HomePage() {
  const [featuredCars, launches, facelifts, articles, brands, allCars, allNews] = await Promise.all([
    getFeaturedCars(4),
    getNews({ type: "New Launch", limit: 3 }),
    getNews({ type: "Facelift", limit: 3 }),
    getArticles(3),
    getTaxonomyTerms("brands"),
    getCars(),
    getNews(),
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

      <Reveal>
        <StatsStrip
          stats={[
            { label: "Cars listed", value: allCars.length, suffix: "+" },
            { label: "Brands", value: brands.length },
            { label: "News stories", value: allNews.length, suffix: "+" },
            { label: "Blog posts", value: articles.length, suffix: "+" },
          ]}
        />
      </Reveal>

      <section>
        <SectionHeading title="Latest Launches" subtitle="Newly launched cars in India" viewAllHref="/news?type=New Launch" />
        {launches.length === 0 ? (
          <EmptyState message="No launch stories yet." />
        ) : (
          <Reveal className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {launches.map((n) => (
              <RevealItem key={n.id}>
                <NewsCard news={n} />
              </RevealItem>
            ))}
          </Reveal>
        )}
      </section>

      <section>
        <SectionHeading title="Latest Facelifts" subtitle="Mid-life updates to your favourite cars" viewAllHref="/news?type=Facelift" />
        {facelifts.length === 0 ? (
          <EmptyState message="No facelift stories yet." />
        ) : (
          <Reveal className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {facelifts.map((n) => (
              <RevealItem key={n.id}>
                <NewsCard news={n} />
              </RevealItem>
            ))}
          </Reveal>
        )}
      </section>

      <section>
        <SectionHeading title="From the Blog" subtitle="Buying guides, reviews and maintenance tips" viewAllHref="/blog" />
        {articles.length === 0 ? (
          <EmptyState message="No blog posts yet." />
        ) : (
          <Reveal className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <RevealItem key={a.id}>
                <ArticleCard article={a} />
              </RevealItem>
            ))}
          </Reveal>
        )}
      </section>
    </div>
  );
}
