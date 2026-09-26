import Link from "next/link";
import type { Metadata } from "next";
import { getNews } from "@/lib/queries";
import { NewsCard } from "@/components/NewsCard";
import { EmptyState } from "@/components/EmptyState";
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

  return (
    <div className="mx-auto max-w-(--container-page) px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl font-700 text-primary-800 dark:text-accent-100 mb-6">News</h1>

      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/news"
          className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
            !type ? "border-accent-400 bg-accent-400 text-primary-800 font-medium" : "border-border hover:border-accent-400"
          }`}
        >
          All
        </Link>
        {TYPES.map((t) => (
          <Link
            key={t}
            href={`/news?type=${encodeURIComponent(t)}`}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              type === t ? "border-accent-400 bg-accent-400 text-primary-800 font-medium" : "border-border hover:border-accent-400"
            }`}
          >
            {t}
          </Link>
        ))}
      </div>

      {news.length === 0 ? (
        <EmptyState message="No news stories match this filter yet." />
      ) : (
        <Reveal key={type ?? "all"} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((n) => (
            <RevealItem key={n.id}>
              <NewsCard news={n} />
            </RevealItem>
          ))}
        </Reveal>
      )}
    </div>
  );
}
