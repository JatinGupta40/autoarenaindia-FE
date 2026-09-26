import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getArticles, getCars, getFeaturedCars, getNews, getTaxonomyTerms } from "@/lib/queries";
import { imageAlt, imageUrl } from "@/lib/image";
import { HeroCarousel } from "@/components/HeroCarousel";
import { BrandMarquee } from "@/components/BrandMarquee";
import { CarCard } from "@/components/CarCard";
import { NewsCard } from "@/components/NewsCard";
import { ArticleCard } from "@/components/ArticleCard";
import { SectionHeading } from "@/components/SectionHeading";
import { EmptyState } from "@/components/EmptyState";
import { HorizontalScroller } from "@/components/HorizontalScroller";
import { Parallax } from "@/components/Parallax";
import { FadeUp, Reveal, RevealItem } from "@/components/Reveal";
import { StatsStrip } from "@/components/StatsStrip";

export const revalidate = 60;

export default async function HomePage() {
  const [featuredCars, launches, facelifts, articles, brands, bodyTypes, allCars, allNews] = await Promise.all([
    getFeaturedCars(5),
    getNews({ type: "New Launch", limit: 3 }),
    getNews({ type: "Facelift", limit: 3 }),
    getArticles(3),
    getTaxonomyTerms("brands"),
    getTaxonomyTerms("body_type"),
    getCars(),
    getNews(),
  ]);

  const latestCars = allCars.slice(0, 8);
  const bodyTypeCounts = bodyTypes
    .map((bt) => ({ ...bt, count: allCars.filter((c) => c.field_body_type?.id === bt.id).length }))
    .filter((bt) => bt.count > 0);
  const ctaCar = featuredCars[1] ?? featuredCars[0] ?? allCars[0];
  const ctaImage = ctaCar ? imageUrl(ctaCar.field_car_images?.[0]) : null;

  return (
    <>
      <HeroCarousel cars={featuredCars} />

      {brands.length > 0 && (
        <section aria-label="Brands" className="home-page__brands border-b border-border py-8">
          <p className="home-page__brands-eyebrow eyebrow mb-4 text-center text-muted">Browse by brand</p>
          <BrandMarquee brands={brands} />
        </section>
      )}

      <div className="home-page__content container-page space-y-24 pt-16 sm:space-y-32 sm:pt-20">
        <FadeUp className="home-page__stats">
          <StatsStrip
            stats={[
              { label: "Cars listed", value: allCars.length, suffix: "+" },
              { label: "Brands covered", value: brands.length },
              { label: "News stories", value: allNews.length, suffix: "+" },
              { label: "Blog posts", value: articles.length, suffix: "+" },
            ]}
          />
        </FadeUp>

        {latestCars.length > 0 && (
          <section className="home-page__latest-models">
            <FadeUp className="home-page__latest-models-heading">
              <SectionHeading
                eyebrow="Showroom"
                title="Latest models"
                subtitle="The newest generations on sale, with price and key specs at a glance."
                viewAllHref="/cars"
                viewAllLabel="All cars"
              />
            </FadeUp>
            <HorizontalScroller label="Latest models">
              {latestCars.map((car, i) => (
                <div key={car.id} className="home-page__model-slide w-[82%] shrink-0 snap-start sm:w-[340px]">
                  <FadeUp delay={Math.min(i, 4) * 0.08} className="home-page__model-reveal h-full">
                    <CarCard car={car} />
                  </FadeUp>
                </div>
              ))}
            </HorizontalScroller>
          </section>
        )}

        {bodyTypeCounts.length > 0 && (
          <section className="home-page__body-types">
            <FadeUp className="home-page__body-types-heading">
              <SectionHeading eyebrow="Find your fit" title="Browse by body type" />
            </FadeUp>
            <Reveal className="home-page__body-type-grid grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {bodyTypeCounts.map((bt) => (
                <RevealItem key={bt.id} className="home-page__body-type-item">
                  <Link
                    href={`/cars?bodyType=${encodeURIComponent(bt.name)}`}
                    className="home-page__body-type-card group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-5 transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-ink-900 hover:bg-ink-900 hover:text-white dark:hover:border-accent-400/40 dark:hover:bg-surface-2 sm:p-6"
                  >
                    <ArrowUpRight
                      size={18}
                      className="home-page__body-type-icon absolute top-5 right-5 text-muted transition-all duration-500 ease-premium group-hover:rotate-45 group-hover:text-accent-400"
                    />
                    <p className="home-page__body-type-count num text-4xl font-bold">{bt.count}</p>
                    <div className="home-page__body-type-info mt-8">
                      <p className="home-page__body-type-name font-display text-lg font-semibold">{bt.name}</p>
                      <p className="home-page__body-type-label text-sm text-muted group-hover:text-ink-300">
                        {bt.count === 1 ? "model" : "models"}
                      </p>
                    </div>
                  </Link>
                </RevealItem>
              ))}
            </Reveal>
          </section>
        )}

        <section className="home-page__launches">
          <FadeUp className="home-page__launches-heading">
            <SectionHeading
              eyebrow="Just launched"
              title="Latest launches"
              subtitle="Newly launched cars in India"
              viewAllHref="/news?type=New Launch"
            />
          </FadeUp>
          {launches.length === 0 ? (
            <EmptyState message="No launch stories yet." />
          ) : (
            <Reveal className="home-page__launch-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {launches.map((n) => (
                <RevealItem key={n.id} className="home-page__launch-item">
                  <NewsCard news={n} />
                </RevealItem>
              ))}
            </Reveal>
          )}
        </section>

        <section className="home-page__facelifts">
          <FadeUp className="home-page__facelifts-heading">
            <SectionHeading
              eyebrow="Refreshed"
              title="Latest facelifts"
              subtitle="Mid-life updates to your favourite cars"
              viewAllHref="/news?type=Facelift"
            />
          </FadeUp>
          {facelifts.length === 0 ? (
            <EmptyState message="No facelift stories yet." />
          ) : (
            <Reveal className="home-page__facelift-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {facelifts.map((n) => (
                <RevealItem key={n.id} className="home-page__facelift-item">
                  <NewsCard news={n} />
                </RevealItem>
              ))}
            </Reveal>
          )}
        </section>

        <FadeUp className="home-page__cta-reveal">
          <section className="home-page__cta relative isolate overflow-hidden rounded-[2rem] bg-ink-950 text-white">
            {ctaImage && (
              <Parallax offset={50} className="home-page__cta-parallax absolute inset-0 -z-10 scale-110">
                <Image
                  src={ctaImage}
                  alt={imageAlt(ctaCar.field_car_images?.[0], ctaCar.title)}
                  fill
                  sizes="(min-width: 1280px) 1280px, 100vw"
                  className="home-page__cta-image object-cover opacity-50"
                />
              </Parallax>
            )}
            <div aria-hidden className="home-page__cta-overlay absolute inset-0 -z-10 bg-linear-to-r from-ink-950 via-ink-950/80 to-transparent" />
            <div className="home-page__cta-body max-w-xl p-8 sm:p-14">
              <p className="home-page__cta-eyebrow eyebrow text-accent-300">Buying guide</p>
              <h2 className="home-page__cta-title mt-3 font-display text-3xl font-bold sm:text-5xl">Not sure where to start?</h2>
              <p className="home-page__cta-text mt-4 text-ink-300">
                Filter by brand, body type and fuel, then dig into the specs, variants and pricing
                that matter to you.
              </p>
              <div className="home-page__cta-actions mt-8 flex flex-wrap gap-3">
                <Link href="/cars" className="home-page__cta-primary btn btn-primary group">
                  Find your car <ArrowRight size={16} className="home-page__cta-icon arrow-nudge" />
                </Link>
                <Link href="/blog" className="home-page__cta-secondary btn btn-ghost">
                  Read buying guides
                </Link>
              </div>
            </div>
          </section>
        </FadeUp>

        <section className="home-page__blog">
          <FadeUp className="home-page__blog-heading">
            <SectionHeading
              eyebrow="Journal"
              title="From the blog"
              subtitle="Buying guides, reviews and maintenance tips"
              viewAllHref="/blog"
            />
          </FadeUp>
          {articles.length === 0 ? (
            <EmptyState message="No blog posts yet." />
          ) : (
            <Reveal className="home-page__blog-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <RevealItem key={a.id} className="home-page__blog-item">
                  <ArticleCard article={a} />
                </RevealItem>
              ))}
            </Reveal>
          )}
        </section>
      </div>
    </>
  );
}
