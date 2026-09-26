import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { News } from "@/types/drupal";
import { imageAlt, imageUrl } from "@/lib/image";
import { formatDate } from "@/utils/format";
import { Badge } from "@/components/Badge";

export function NewsCard({ news }: { news: News }) {
  const cover = imageUrl(news.field_images?.[0]);
  const href = news.path?.alias || `/news/${news.id}`;
  const car = news.field_related_car;

  return (
    <Link
      href={href}
      className="news-card group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-card transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:border-accent-400/40 hover:shadow-card-hover"
    >
      <div className="news-card__media relative aspect-[16/10] overflow-hidden bg-surface-2">
        {cover ? (
          <Image
            src={cover}
            alt={imageAlt(news.field_images?.[0], news.title)}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="news-card__image object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.06]"
          />
        ) : (
          <div className="news-card__placeholder flex h-full items-center justify-center text-sm text-muted">No image</div>
        )}
        {news.field_type_of_news?.name && (
          <span className="news-card__category absolute top-3 left-3">
            <Badge variant="glass">{news.field_type_of_news.name}</Badge>
          </span>
        )}
      </div>
      <div className="news-card__body flex flex-1 flex-col p-5">
        <p className="news-card__meta text-xs text-muted">
          {formatDate(news.created)}
          {car?.field_brand?.name && (
            <>
              <span className="news-card__separator mx-1.5">·</span>
              {car.field_brand.name} {car.field_car_model?.name}
            </>
          )}
        </p>
        <h3 className="news-card__title mt-2 line-clamp-2 font-display text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-link">
          {news.title}
        </h3>
        <span className="news-card__cta mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-foreground">
          Read story <ArrowRight size={14} className="news-card__cta-icon arrow-nudge" />
        </span>
      </div>
    </Link>
  );
}
