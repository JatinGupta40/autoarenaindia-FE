import type { Metadata } from "next";
import { getArticles } from "@/lib/queries";
import { ArticleCard } from "@/components/ArticleCard";
import { EmptyState } from "@/components/EmptyState";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description: "Buying guides, comparisons and maintenance tips for car owners in India.",
};

export default async function BlogPage() {
  const articles = await getArticles(48);

  return (
    <div className="mx-auto max-w-(--container-page) px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl font-700 text-primary-800 dark:text-accent-100 mb-6">Blog</h1>

      {articles.length === 0 ? (
        <EmptyState message="No blog posts yet." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
        </div>
      )}
    </div>
  );
}
