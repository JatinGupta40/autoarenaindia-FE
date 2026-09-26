import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCarByPath, getCarGenerations, getCarVariants, getNewsByRelatedCar } from "@/lib/queries";
import { formatGenerationRange, formatPriceLakh } from "@/utils/format";
import { Badge } from "@/components/Badge";
import { NewsCard } from "@/components/NewsCard";
import { SectionHeading } from "@/components/SectionHeading";
import { CarGallery } from "@/components/CarGallery";
import { Reveal, RevealItem } from "@/components/Reveal";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarByPath(slug);
  if (!car) return {};
  return {
    title: `${car.field_brand?.name} ${car.field_car_model?.name} — Price, Specs & Images`,
    description: `${car.field_brand?.name} ${car.field_car_model?.name} (${formatGenerationRange(
      car.field_year_start,
      car.field_year_end
    )}): price, mileage, specifications and images.`,
  };
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = await getCarByPath(slug);
  if (!car) notFound();

  const [variants, generations, relatedNews] = await Promise.all([
    getCarVariants(car.id),
    getCarGenerations(car),
    getNewsByRelatedCar(car.id),
  ]);

  const specs: [string, string][] = [
    ["Body type", car.field_body_type?.name ?? "—"],
    ["Fuel", car.field_fuel_type?.map((f) => f.name).join(", ") || "—"],
    ["Transmission", car.field_transmission?.map((t) => t.name).join(", ") || "—"],
    ["Engine capacity", car.field_engine_capacity ? `${car.field_engine_capacity} cc` : "—"],
    ["Mileage", car.field_mileage ? `${car.field_mileage} km/l` : "—"],
    ["Generation", formatGenerationRange(car.field_year_start, car.field_year_end)],
  ];

  return (
    <div className="mx-auto max-w-(--container-page) px-4 sm:px-6 py-8 space-y-12">
      <div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted mb-3">
          <Link href="/cars" className="hover:text-accent-500">Cars</Link>
          <span>/</span>
          <span>{car.field_brand?.name}</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-700 text-primary-800 dark:text-accent-100">
          {car.field_brand?.name} {car.field_car_model?.name}
        </h1>
        <p className="text-muted mt-1">{formatGenerationRange(car.field_year_start, car.field_year_end)}</p>
      </div>

      <CarGallery images={car.field_car_images ?? []} title={car.title} />

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="font-display font-600 text-xl mb-4">Specifications</h2>
            <dl className="grid grid-cols-2 gap-y-4 gap-x-6 sm:grid-cols-3">
              {specs.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
                  <dd className="font-medium mt-0.5">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {variants.length > 0 && (
            <section className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="font-display font-600 text-xl mb-4">Variants & pricing</h2>
              <div className="divide-y divide-border">
                {variants.map((v) => (
                  <div key={v.id} className="flex items-center justify-between py-3">
                    <span className="font-medium">{v.title}</span>
                    <span className="font-display font-600 text-primary-800 dark:text-accent-100">
                      {formatPriceLakh(v.field_price)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {car.body?.processed && (
            <section
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: car.body.processed }}
            />
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-primary-800 text-primary-100 p-6">
            <p className="text-sm text-primary-200">Starting price</p>
            <p className="font-display text-2xl font-700 mt-1">{formatPriceLakh(car.field_price)}</p>
          </div>

          {generations.length > 0 && (
            <div>
              <h2 className="font-display font-600 mb-3">Other generations</h2>
              <div className="space-y-3">
                {generations.map((g) => (
                  <Link
                    key={g.id}
                    href={g.path?.alias || `/cars/${g.id}`}
                    className="flex items-center justify-between rounded-xl border border-border p-3 hover:border-accent-400 transition-colors"
                  >
                    <span className="text-sm font-medium">
                      {formatGenerationRange(g.field_year_start, g.field_year_end)}
                    </span>
                    {g.field_year_end === null && <Badge variant="accent">Current</Badge>}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {relatedNews.length > 0 && (
        <section>
          <SectionHeading title="Related news" />
          <Reveal className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedNews.map((n) => (
              <RevealItem key={n.id}>
                <NewsCard news={n} />
              </RevealItem>
            ))}
          </Reveal>
        </section>
      )}

    </div>
  );
}
