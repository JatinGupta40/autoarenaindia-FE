import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getNewsByPath } from "@/lib/queries";
import { imageAlt, imageUrl } from "@/lib/image";
import { formatDate, formatPriceLakh } from "@/utils/format";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/Badge";
import { StoryHero } from "@/components/StoryHero";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsByPath(slug);
  if (!news) return {};
  return { title: news.title, description: news.body?.summary || news.title };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const news = await getNewsByPath(slug);
  if (!news) notFound();

  const cover = imageUrl(news.field_images?.[0]);
  const car = news.field_related_car;
  const carImage = car ? imageUrl(car.field_car_images?.[0]) : null;

  return (
    <article className="news-detail">
      <StoryHero
        section="News"
        sectionHref="/news"
        title={news.title}
        cover={cover}
        coverAlt={imageAlt(news.field_images?.[0], news.title)}
        meta={
          <>
            {news.field_type_of_news?.name && <Badge variant="solid">{news.field_type_of_news.name}</Badge>}
            <span className="news-detail__date text-sm text-ink-400">{formatDate(news.created)}</span>
          </>
        }
      />

      <div className="news-detail__content mx-auto max-w-3xl px-4 sm:px-6">
        {news.body?.processed && (
          <div
            className="news-detail__body prose prose-lg mt-12 max-w-none prose-headings:font-display prose-a:text-link dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: news.body.processed }}
          />
        )}

        {car && (
          <Link
            href={car.path?.alias || `/cars/${car.id}`}
            className="news-detail__car group mt-14 flex items-center gap-5 overflow-hidden rounded-3xl border border-border bg-surface p-4 transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-accent-400/40 hover:shadow-card-hover sm:p-5"
          >
            {carImage && (
              <div className="news-detail__car-media relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-2xl bg-surface-2 sm:w-40">
                <Image
                  src={carImage}
                  alt={imageAlt(car.field_car_images?.[0], car.title)}
                  fill
                  sizes="160px"
                  className="news-detail__car-image object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.06]"
                />
              </div>
            )}
            <div className="news-detail__car-info min-w-0 flex-1">
              <p className="news-detail__car-eyebrow eyebrow text-muted">About this car</p>
              <p className="news-detail__car-name mt-1 truncate font-display text-xl font-semibold">
                {car.field_brand?.name} {car.field_car_model?.name}
              </p>
              <p className="news-detail__car-price num mt-1 text-sm text-muted">
                From <span className="news-detail__car-price-value font-semibold text-foreground">{formatPriceLakh(car.field_price)}</span>
              </p>
            </div>
            <span className="news-detail__car-arrow hidden h-10 w-10 shrink-0 place-items-center rounded-full border border-border transition-all duration-500 ease-premium group-hover:border-accent-400 group-hover:bg-accent-400 group-hover:text-ink-950 sm:grid">
              <ArrowRight size={18} className="news-detail__car-arrow-icon" />
            </span>
          </Link>
        )}
      </div>
    </article>
  );
}
