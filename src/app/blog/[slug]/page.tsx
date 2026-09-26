import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleByPath } from "@/lib/queries";
import { imageAlt, imageUrl } from "@/lib/image";
import { formatDate } from "@/utils/format";
import { Badge } from "@/components/Badge";
import { StoryHero } from "@/components/StoryHero";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleByPath(slug);
  if (!article) return {};
  return { title: article.title, description: article.body?.summary || article.title };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleByPath(slug);
  if (!article) notFound();

  const cover = imageUrl(article.field_image);

  return (
    <article className="blog-detail">
      <StoryHero
        section="Blog"
        sectionHref="/blog"
        title={article.title}
        cover={cover}
        coverAlt={imageAlt(article.field_image, article.title)}
        meta={
          <>
            {article.field_tags?.map((tag) => (
              <Badge key={tag.id} variant="glass">{tag.name}</Badge>
            ))}
            <span className="blog-detail__date text-sm text-ink-400">{formatDate(article.created)}</span>
          </>
        }
      />

      {article.body?.processed && (
        <div className="blog-detail__content mx-auto max-w-3xl px-4 sm:px-6">
          <div
            className="blog-detail__body prose prose-lg mt-12 max-w-none prose-headings:font-display prose-a:text-link dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: article.body.processed }}
          />
        </div>
      )}
    </article>
  );
}
