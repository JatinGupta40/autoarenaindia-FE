import Image from "next/image";
import Link from "next/link";
import type { News } from "@/types/drupal";
import { imageAlt, imageUrl } from "@/lib/image";
import { formatDate } from "@/utils/format";
import { Badge } from "@/components/Badge";

export function NewsCard({ news }: { news: News }) {
  const cover = imageUrl(news.field_images?.[0]);
  const href = news.path?.alias || `/news/${news.id}`;

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-primary-100">
        {cover ? (
          <Image
            src={cover}
            alt={imageAlt(news.field_images?.[0], news.title)}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-primary-400">No image</div>
        )}
        {news.field_type_of_news?.name && (
          <span className="absolute top-3 left-3">
            <Badge variant="accent">{news.field_type_of_news.name}</Badge>
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-muted">{formatDate(news.created)}</p>
        <h3 className="font-display font-600 text-lg text-foreground mt-1 line-clamp-2">
          {news.title}
        </h3>
      </div>
    </Link>
  );
}
