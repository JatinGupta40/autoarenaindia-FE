import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Calendar, CarFront, ChevronRight, Cog, Fuel, Gauge, Zap } from "lucide-react";
import { getCarByPath, getCarGenerations, getNewsByRelatedCar, getRelatedCars } from "@/lib/queries";
import { imageAlt, imageUrl } from "@/lib/image";
import { formatGenerationRange, formatPriceLakh, formatRange, joinNames, priceParts } from "@/utils/format";
import { carVariants, engineRange, mileageRange, termName, variantPowertrains, variantPriceFrom } from "@/utils/variants";
import { Badge } from "@/components/Badge";
import { CarCard } from "@/components/CarCard";
import { CarDetailNav } from "@/components/CarDetailNav";
import { CarGallery } from "@/components/CarGallery";
import { GenerationCompare } from "@/components/GenerationCompare";
import { HorizontalScroller } from "@/components/HorizontalScroller";
import { NewsCard } from "@/components/NewsCard";
import { Parallax } from "@/components/Parallax";
import { FadeUp, Reveal, RevealItem } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SpecCard } from "@/components/SpecCard";

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

  const variants = carVariants(car);
  const powertrains = variants.flatMap((v) => v.field_powertrains ?? []);
  const [generations, relatedNews, relatedCars] = await Promise.all([
    getCarGenerations(car),
    getNewsByRelatedCar(car.id),
    getRelatedCars(car),
  ]);

  const name = `${car.field_brand?.name ?? ""} ${car.field_car_model?.name ?? ""}`.trim();
  const generation = formatGenerationRange(car.field_year_start, car.field_year_end);
  const cover = imageUrl(car.field_car_images?.[0]);
  const price = priceParts(car.field_price_min);
  const minPrice = car.field_price_min;
  const maxPrice = car.field_price_max;
  const priceRange =
    minPrice !== null && maxPrice !== null && maxPrice > minPrice
      ? `${formatPriceLakh(minPrice)} – ${formatPriceLakh(maxPrice)}`
      : null;

  const hasGallery = (car.field_car_images?.length ?? 0) > 0;
  const sections = [
    { id: "specs", label: "Specs" },
    { id: "price", label: variants.length ? "Price & variants" : "Price" },
    hasGallery && { id: "gallery", label: "Gallery" },
    car.body?.processed && { id: "overview", label: "Overview" },
    generations.length > 0 && { id: "compare", label: "Compare" },
    relatedCars.length > 0 && { id: "similar", label: "Similar cars" },
    relatedNews.length > 0 && { id: "news", label: "News" },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <>
      {/* 1. Hero / overview */}
      <section id="car-hero" className="car-detail__hero relative isolate overflow-hidden bg-ink-950 text-white">
        <div aria-hidden className="car-detail__hero-grid bg-grid pointer-events-none absolute inset-0 -z-10" />
        <div
          aria-hidden
          className="car-detail__hero-glow pointer-events-none absolute top-1/3 right-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-accent-400/15 blur-[140px]"
        />
        <div className="car-detail__hero-inner container-page grid items-center gap-10 pt-[calc(var(--header-h)+2rem)] pb-12 lg:grid-cols-[1fr_1.25fr] lg:pb-16">
          <FadeUp className="car-detail__intro">
            <nav aria-label="Breadcrumb" className="car-detail__breadcrumb mb-6 flex flex-wrap items-center gap-1.5 text-sm text-ink-400">
              <Link href="/cars" className="car-detail__breadcrumb-link transition-colors hover:text-white">Cars</Link>
              <ChevronRight size={14} className="car-detail__breadcrumb-icon" aria-hidden />
              <Link
                href={`/cars?brand=${encodeURIComponent(car.field_brand?.name ?? "")}`}
                className="car-detail__breadcrumb-link transition-colors hover:text-white"
              >
                {car.field_brand?.name}
              </Link>
              <ChevronRight size={14} className="car-detail__breadcrumb-icon" aria-hidden />
              <span className="car-detail__breadcrumb-current text-ink-200" aria-current="page">{car.field_car_model?.name}</span>
            </nav>

            <p className="car-detail__brand eyebrow text-accent-300">{car.field_brand?.name}</p>
            <h1 className="car-detail__title mt-2 font-display text-5xl leading-none font-bold sm:text-6xl">{car.field_car_model?.name}</h1>
            <div className="car-detail__badges mt-4 flex flex-wrap items-center gap-2">
              <Badge variant="glass">{generation}</Badge>
              {car.field_year_end === null && <Badge variant="solid">Current gen</Badge>}
              {car.field_body_type?.name && <Badge variant="glass">{car.field_body_type.name}</Badge>}
            </div>

            {/* 2. Price */}
            <div className="car-detail__price mt-8">
              <p className="car-detail__price-label text-sm text-ink-400">Ex-showroom price from</p>
              {price ? (
                <p className="car-detail__price-value num mt-1 text-4xl font-bold sm:text-5xl">
                  ₹ {price.amount} <span className="car-detail__price-unit text-xl font-medium text-ink-300">{price.unit}</span>
                </p>
              ) : (
                <p className="car-detail__price-value num mt-1 text-4xl font-bold text-ink-400">—</p>
              )}
              {priceRange && <p className="car-detail__price-range num mt-1 text-sm text-ink-400">{priceRange} across {variants.length} variants</p>}
            </div>

            <div className="car-detail__actions mt-8 flex flex-wrap gap-3">
              <a href="#price" className="car-detail__action-primary btn btn-primary group">
                {variants.length ? "View variants" : "Price details"} <ArrowRight size={16} className="car-detail__action-icon arrow-nudge" />
              </a>
              {generations.length > 0 && (
                <a href="#compare" className="car-detail__action-secondary btn btn-ghost">Compare generations</a>
              )}
            </div>
          </FadeUp>

          {cover && (
            <FadeUp delay={0.1} className="car-detail__cover-reveal">
              <Parallax offset={24} className="car-detail__cover relative aspect-[16/10] overflow-hidden rounded-3xl bg-ink-800 shadow-2xl shadow-black/40">
                <Image
                  src={cover}
                  alt={imageAlt(car.field_car_images?.[0], car.title)}
                  fill
                  priority
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="car-detail__cover-image scale-110 object-cover"
                />
              </Parallax>
            </FadeUp>
          )}
        </div>

        {/* Key numbers strip */}
        <div className="car-detail__key-numbers border-t border-white/10">
          <div className="car-detail__key-numbers-inner container-page">
            <dl className="car-detail__key-numbers-list grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-4">
              {[
                { icon: Zap, label: "Engine", value: engineRange(car) },
                { icon: Gauge, label: "Mileage", value: mileageRange(car) },
                { icon: Fuel, label: "Fuel", value: joinNames(car.field_fuel_type) },
                { icon: Cog, label: "Transmission", value: joinNames(car.field_transmission) },
              ].map((s) => (
                <div key={s.label} className="car-detail__key-number bg-ink-950 px-4 py-5 transition-colors duration-300 hover:bg-ink-900 sm:px-6">
                  <dt className="car-detail__key-number-label flex items-center gap-1.5 text-xs text-ink-400">
                    <s.icon size={13} className="car-detail__key-number-icon" aria-hidden /> {s.label}
                  </dt>
                  <dd className="car-detail__key-number-value num mt-1 text-lg font-semibold">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <CarDetailNav name={name} price={price ? `From ₹ ${price.amount} ${price.unit}` : ""} sections={sections} />

      <div className="car-detail__content container-page space-y-16 pt-16 sm:space-y-12">
        {/* 3. Key specifications */}
        <section id="specs" className="car-detail__specs">
          <FadeUp className="car-detail__specs-heading">
            <SectionHeading eyebrow="At a glance" title="Key specifications" />
          </FadeUp>
          <Reveal className="car-detail__specs-grid grid grid-cols-2 gap-4 lg:grid-cols-3">
            <RevealItem className="car-detail__spec">
              <SpecCard icon={Zap} label="Engine capacity" value={formatRange(powertrains.map((p) => p.engine_cc))} unit="cc" />
            </RevealItem>
            <RevealItem className="car-detail__spec">
              <SpecCard icon={Gauge} label="Claimed mileage" value={formatRange(powertrains.map((p) => p.mileage_kmpl))} unit="km/l" highlight />
            </RevealItem>
            <RevealItem className="car-detail__spec">
              <SpecCard icon={Fuel} label="Fuel type" value={joinNames(car.field_fuel_type, "")} />
            </RevealItem>
            <RevealItem className="car-detail__spec">
              <SpecCard icon={Cog} label="Transmission" value={joinNames(car.field_transmission, "")} />
            </RevealItem>
            <RevealItem className="car-detail__spec">
              <SpecCard icon={CarFront} label="Body type" value={car.field_body_type?.name} />
            </RevealItem>
            <RevealItem className="car-detail__spec">
              <SpecCard icon={Calendar} label="Generation" value={generation} />
            </RevealItem>
          </Reveal>
        </section>

        {/* 4. Price & variants */}
        <section id="price" className="car-detail__pricing">
          <FadeUp className="car-detail__pricing-heading">
            <SectionHeading
              eyebrow="Pricing"
              title={variants.length ? "Price & variants" : "Price"}
              subtitle="Ex-showroom prices. On-road price varies by city."
            />
          </FadeUp>
          <div className="car-detail__pricing-grid grid gap-6 lg:grid-cols-[340px_1fr]">
            <FadeUp className="car-detail__price-card-reveal">
              <div className="car-detail__price-card relative h-full overflow-hidden rounded-3xl bg-ink-950 p-8 text-white">
                <div aria-hidden className="car-detail__price-card-glow absolute -top-20 -right-20 h-56 w-56 rounded-full bg-accent-400/25 blur-3xl" />
                <p className="car-detail__price-card-label relative text-sm text-ink-400">Starting price</p>
                {price ? (
                  <p className="car-detail__price-card-value num relative mt-2 text-5xl font-bold">
                    ₹ {price.amount}
                    <span className="car-detail__price-card-unit ml-2 text-xl font-medium text-ink-300">{price.unit}</span>
                  </p>
                ) : (
                  <p className="car-detail__price-card-value num relative mt-2 text-5xl font-bold text-ink-400">—</p>
                )}
                {priceRange && (
                  <div className="car-detail__price-card-range relative mt-8 border-t border-white/10 pt-6">
                    <p className="car-detail__price-card-range-label text-sm text-ink-400">Variant range</p>
                    <p className="car-detail__price-card-range-value num mt-1 text-lg font-semibold">{priceRange}</p>
                  </div>
                )}
                {variants.length > 0 && (
                  <p className="car-detail__price-card-count relative mt-4 text-sm text-ink-400">
                    {variants.length} variant{variants.length === 1 ? "" : "s"} available
                  </p>
                )}
              </div>
            </FadeUp>

            {variants.length > 0 ? (
              <Reveal className="car-detail__variants divide-y divide-border overflow-hidden rounded-3xl border border-border bg-surface">
                {variants.map((v) => {
                  const p = variantPriceFrom(v);
                  const pct =
                    minPrice !== null && maxPrice !== null && maxPrice > minPrice && p !== null
                      ? 15 + ((p - minPrice) / (maxPrice - minPrice)) * 85
                      : 100;
                  const rows = variantPowertrains(v);
                  return (
                    <RevealItem key={v.id} className="car-detail__variant-item">
                      <div className="car-detail__variant group px-6 py-5 transition-colors duration-300 hover:bg-surface-2">
                        <div className="car-detail__variant-header flex items-baseline justify-between gap-4">
                          <span className="car-detail__variant-name font-medium">{v.field_variant_name}</span>
                          <span className="car-detail__variant-price num shrink-0 font-bold text-foreground">
                            {rows.length > 1 && <span className="car-detail__variant-price-from mr-1 text-xs font-normal text-muted">from</span>}
                            {formatPriceLakh(p)}
                          </span>
                        </div>
                        <ul className="car-detail__powertrains mt-2 space-y-1">
                          {rows.map((pt, i) => (
                            <li key={i} className="car-detail__powertrain flex items-baseline justify-between gap-4 text-xs text-muted">
                              <span className="car-detail__powertrain-specs">
                                {[
                                  pt.engine_name,
                                  termName(car.field_fuel_type, pt.fuel_type),
                                  termName(car.field_transmission, pt.transmission),
                                  formatRange([pt.power_bhp], "bhp", ""),
                                  formatRange([pt.mileage_kmpl], "km/l", ""),
                                ]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </span>
                              {rows.length > 1 && (
                                <span className="car-detail__powertrain-price num shrink-0">{formatPriceLakh(pt.ex_showroom_price)}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                        <div className="car-detail__variant-track mt-3 h-1 overflow-hidden rounded-full bg-surface-2 group-hover:bg-border" aria-hidden>
                          <div
                            className="car-detail__variant-bar h-full rounded-full bg-ink-400 transition-colors duration-300 group-hover:bg-accent-400"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </RevealItem>
                  );
                })}
              </Reveal>
            ) : (
              <div className="car-detail__variants-empty flex items-center rounded-3xl border border-dashed border-border p-8 text-muted">
                Variant-wise pricing hasn&apos;t been published for this car yet.
              </div>
            )}
          </div>
        </section>

        {/* 5. Gallery */}
        {hasGallery && (
          <section id="gallery" className="car-detail__gallery">
            <FadeUp className="car-detail__gallery-heading">
              <SectionHeading eyebrow="Gallery" title="Exterior & interior" />
            </FadeUp>
            <FadeUp className="car-detail__gallery-body">
              <CarGallery images={car.field_car_images ?? []} title={car.title} />
            </FadeUp>
          </section>
        )}

        {/* 6. Editorial overview */}
        {car.body?.processed && (
          <section id="overview" className="car-detail__overview grid gap-8 lg:grid-cols-[1fr_2fr]">
            <FadeUp className="car-detail__overview-heading">
              <p className="car-detail__overview-eyebrow eyebrow text-link">Overview</p>
              <h2 className="car-detail__overview-title mt-3 font-display text-3xl font-bold sm:text-4xl">About the {car.field_car_model?.name}</h2>
            </FadeUp>
            <FadeUp delay={0.08} className="car-detail__overview-reveal">
              <div
                className="car-detail__overview-body prose max-w-none prose-headings:font-display prose-a:text-link dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: car.body.processed }}
              />
            </FadeUp>
          </section>
        )}

        {/* 7. Comparison across generations */}
        {generations.length > 0 && (
          <section id="compare" className="car-detail__compare">
            <FadeUp className="car-detail__compare-heading">
              <SectionHeading
                eyebrow="Compare"
                title="Generation by generation"
                subtitle={`How this ${car.field_car_model?.name} stacks up against its other generations.`}
              />
            </FadeUp>
            <FadeUp className="car-detail__compare-body">
              <GenerationCompare car={car} others={generations} />
            </FadeUp>
          </section>
        )}

        {/* 8. Related cars */}
        {relatedCars.length > 0 && (
          <section id="similar" className="car-detail__similar">
            <FadeUp className="car-detail__similar-heading">
              <SectionHeading
                eyebrow="Alternatives"
                title={`Similar ${car.field_body_type?.name ?? "cars"}`}
                viewAllHref={`/cars?bodyType=${encodeURIComponent(car.field_body_type?.name ?? "")}`}
              />
            </FadeUp>
            <HorizontalScroller label="Similar cars">
              {relatedCars.map((c) => (
                <div key={c.id} className="car-detail__similar-slide w-[82%] shrink-0 snap-start sm:w-[340px]">
                  <CarCard car={c} />
                </div>
              ))}
            </HorizontalScroller>
          </section>
        )}

        {/* 9. Related news */}
        {relatedNews.length > 0 && (
          <section id="news" className="car-detail__news">
            <FadeUp className="car-detail__news-heading">
              <SectionHeading eyebrow="Latest" title="Related news" />
            </FadeUp>
            <Reveal className="car-detail__news-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedNews.map((n) => (
                <RevealItem key={n.id} className="car-detail__news-item">
                  <NewsCard news={n} />
                </RevealItem>
              ))}
            </Reveal>
          </section>
        )}
      </div>
    </>
  );
}
