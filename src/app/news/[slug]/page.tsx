import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getNewsByPath } from "@/lib/queries";
import { imageAlt, imageUrl } from "@/lib/image";
import { formatDate, formatPriceLakh } from "@/utils/format";
import { Badge } from "@/components/Badge";

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

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 mb-4">
        {news.field_type_of_news?.name && <Badge variant="accent">{news.field_type_of_news.name}</Badge>}
        <span className="text-sm text-muted">{formatDate(news.created)}</span>
      </div>

      <h1 className="font-display text-3xl sm:text-4xl font-700 text-primary-800 dark:text-accent-100">
        {news.title}
      </h1>

      {cover && (
        <div className="relative aspect-[16/9] mt-6 overflow-hidden rounded-2xl bg-primary-100">
          <Image
            src={cover}
            alt={imageAlt(news.field_images?.[0], news.title)}
            fill
            priority
            sizes="768px"
            className="object-cover"
          />
        </div>
      )}

      {news.body?.processed && (
        <div
          className="prose prose-sm sm:prose-base max-w-none dark:prose-invert mt-8"
          dangerouslySetInnerHTML={{ __html: news.body.processed }}
        />
      )}

      {car && (
        <Link
          href={car.path?.alias || `/cars/${car.id}`}
          className="mt-10 flex items-center justify-between rounded-2xl border border-border bg-surface p-5 hover:border-accent-400 transition-colors"
        >
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">About this car</p>
            <p className="font-display font-600 text-lg mt-0.5">
              {car.field_brand?.name} {car.field_car_model?.name}
            </p>
          </div>
          <span className="font-display font-600 text-primary-800 dark:text-accent-100">
            {formatPriceLakh(car.field_price)}
          </span>
        </Link>
      )}
    </article>
  );
}
