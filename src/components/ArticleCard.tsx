import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
      className="article-card group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-card transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:border-accent-400/40 hover:shadow-card-hover"
    >
      <div className="article-card__media relative aspect-[16/10] overflow-hidden bg-surface-2">
        {cover ? (
          <Image
            src={cover}
            alt={imageAlt(article.field_image, article.title)}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="article-card__image object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.06]"
          />
        ) : (
          <div className="article-card__placeholder flex h-full items-center justify-center text-sm text-muted">No image</div>
        )}
      </div>
      <div className="article-card__body flex flex-1 flex-col p-5">
        {article.field_tags?.length > 0 && (
          <div className="article-card__tags mb-3 flex flex-wrap gap-1.5">
            {article.field_tags.map((tag) => (
              <Badge key={tag.id}>{tag.name}</Badge>
            ))}
          </div>
        )}
        <h3 className="article-card__title line-clamp-2 font-display text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-link">
          {article.title}
        </h3>
        <div className="article-card__footer mt-auto flex items-center justify-between pt-4 text-sm">
          <span className="article-card__date text-muted">{formatDate(article.created)}</span>
          <span className="article-card__cta inline-flex items-center gap-1.5 font-semibold text-foreground">
            Read <ArrowRight size={14} className="article-card__cta-icon arrow-nudge" />
          </span>
        </div>
      </div>
    </Link>
  );
}
