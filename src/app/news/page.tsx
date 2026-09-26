import Link from "next/link";
import type { Metadata } from "next";
import { getNews } from "@/lib/queries";
import { NewsCard } from "@/components/NewsCard";
import { EmptyState } from "@/components/EmptyState";
import { PageHero } from "@/components/PageHero";
import { Reveal, RevealItem } from "@/components/Reveal";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "News",
  description: "New car launches, facelifts, reviews and comparisons.",
};

const TYPES = ["New Launch", "Facelift", "Review", "Comparison", "Upcoming", "EV"];

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const news = await getNews({ type, limit: 48 });

  const chip = (isActive: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ease-premium ${
      isActive
        ? "news-page__filter-chip--active border-white bg-white text-ink-950"
        : "border-white/15 text-ink-200 hover:border-white/40 hover:text-white"
    }`;

  return (
    <>
      <PageHero
        eyebrow="Newsroom"
        title="Car news"
        description="Launches, facelifts, reviews and comparisons from the Indian car market."
      >
        <nav aria-label="Filter news by type" className="news-page__filters scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          <Link href="/news" aria-current={!type ? "page" : undefined} className={`news-page__filter-chip shrink-0 ${chip(!type)}`}>
            All
          </Link>
          {TYPES.map((t) => (
            <Link
              key={t}
              href={`/news?type=${encodeURIComponent(t)}`}
              aria-current={type === t ? "page" : undefined}
              className={`news-page__filter-chip shrink-0 ${chip(type === t)}`}
            >
              {t}
            </Link>
          ))}
        </nav>
      </PageHero>

      <div className="news-page__results container-page py-12 sm:py-16">
        {news.length === 0 ? (
          <EmptyState message="No news stories match this filter yet." />
        ) : (
          <Reveal key={type ?? "all"} className="news-page__grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((n) => (
              <RevealItem key={n.id} className="news-page__grid-item">
                <NewsCard news={n} />
              </RevealItem>
            ))}
          </Reveal>
        )}
      </div>
    </>
  );
}
