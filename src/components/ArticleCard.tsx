import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/drupal";
import { imageAlt, imageUrl } from "@/lib/image";
import { formatDate } from "@/utils/format";
import { Badge } from "@/components/Badge";

export function ArticleCard({ article }: { article: Article }) {
  const cover = imageUrl(article.field_image);
  const href = article.path?.alias || `/blog/${article.id}`;

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-primary-100">
        {cover ? (
          <Image
            src={cover}
            alt={imageAlt(article.field_image, article.title)}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-primary-400">No image</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {article.field_tags?.map((tag) => <Badge key={tag.id}>{tag.name}</Badge>)}
        </div>
        <h3 className="font-display font-600 text-lg text-foreground line-clamp-2">
          {article.title}
        </h3>
        <p className="text-xs text-muted mt-2">{formatDate(article.created)}</p>
      </div>
    </Link>
  );
}
