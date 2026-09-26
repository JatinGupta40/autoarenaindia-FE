import type { Metadata } from "next";
import { getArticles } from "@/lib/queries";
import { ArticleCard } from "@/components/ArticleCard";
import { EmptyState } from "@/components/EmptyState";
import { PageHero } from "@/components/PageHero";
import { Reveal, RevealItem } from "@/components/Reveal";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description: "Buying guides, comparisons and maintenance tips for car owners in India.",
};

export default async function BlogPage() {
  const articles = await getArticles(48);

  return (
    <>
      <PageHero
        eyebrow="Journal"
        title="The AutoArena blog"
        description="Buying guides, comparisons and maintenance tips for car owners in India."
      />

      <div className="blog-page__results container-page py-12 sm:py-16">
        {articles.length === 0 ? (
          <EmptyState message="No blog posts yet." />
        ) : (
          <Reveal className="blog-page__grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <RevealItem key={a.id} className="blog-page__grid-item">
                <ArticleCard article={a} />
              </RevealItem>
            ))}
          </Reveal>
        )}
      </div>
    </>
  );
}
