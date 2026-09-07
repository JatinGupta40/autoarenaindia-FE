import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { getArticleByPath } from "@/lib/queries";
import { imageAlt, imageUrl } from "@/lib/image";
import { formatDate } from "@/utils/format";
import { Badge } from "@/components/Badge";

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
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {article.field_tags?.map((tag) => <Badge key={tag.id}>{tag.name}</Badge>)}
        <span className="text-sm text-muted">{formatDate(article.created)}</span>
      </div>

      <h1 className="font-display text-3xl sm:text-4xl font-700 text-primary-800 dark:text-accent-100">
        {article.title}
      </h1>

      {cover && (
        <div className="relative aspect-[16/9] mt-6 overflow-hidden rounded-2xl bg-primary-100">
          <Image
            src={cover}
            alt={imageAlt(article.field_image, article.title)}
            fill
            priority
            sizes="768px"
            className="object-cover"
          />
        </div>
      )}

      {article.body?.processed && (
        <div
          className="prose prose-sm sm:prose-base max-w-none dark:prose-invert mt-8"
          dangerouslySetInnerHTML={{ __html: article.body.processed }}
        />
      )}
    </article>
  );
}
