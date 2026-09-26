"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronLeft, ChevronRight, Fuel, Gauge, Search, Zap } from "lucide-react";
import type { Car } from "@/types/drupal";
import { imageAlt, imageUrl } from "@/lib/image";
import { priceParts } from "@/utils/format";
import { engineRange, mileageRange } from "@/utils/variants";

const AUTO_ADVANCE_MS = 6000;
const SWIPE_THRESHOLD = 60;
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Home hero: platform headline + search on the left, the featured (promoted) cars
 * rotating full-bleed behind it with floating spec cards.
 */
export function HeroCarousel({ cars }: { cars: Car[] }) {
  const router = useRouter();
  const [[active, direction], setSlide] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const [query, setQuery] = useState("");

  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 700], [0, 140]);
  const contentY = useTransform(scrollY, [0, 700], [0, -60]);
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0.2]);

  const go = (dir: number) => {
    setSlide(([current]) => [(current + dir + cars.length) % cars.length, dir]);
  };

  useEffect(() => {
    if (cars.length < 2 || paused) return;
    const timer = setInterval(() => go(1), AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cars.length, paused, active]);

  const car = cars[active];
  const cover = car ? imageUrl(car.field_car_images?.[0]) : null;
  const href = car ? car.path?.alias || `/cars/${car.id}` : "/cars";
  const price = car ? priceParts(car.field_price_min) : null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/cars?q=${encodeURIComponent(q)}` : "/cars");
  };

  return (
    <section
      className="hero-carousel relative isolate flex min-h-[min(92svh,960px)] flex-col overflow-hidden bg-ink-950 text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background: rotating featured car, drifting with scroll. */}
      <motion.div style={{ y: imageY }} className="hero-carousel__background absolute inset-0 -z-10" aria-hidden={!car}>
        <AnimatePresence initial={false}>
          {cover && (
            <motion.div
              key={car.id}
              className="hero-carousel__slide absolute inset-0"
              initial={{ opacity: 0, scale: 1.08, x: direction >= 0 ? 40 : -40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: EASE }}
              drag={cars.length > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(_, info) => {
                if (info.offset.x < -SWIPE_THRESHOLD) go(1);
                else if (info.offset.x > SWIPE_THRESHOLD) go(-1);
              }}
            >
              <Image
                src={cover}
                alt={imageAlt(car.field_car_images?.[0], car.title)}
                fill
                priority
                draggable={false}
                sizes="100vw"
                className="hero-carousel__image object-cover object-center lg:object-[70%_center]"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <div aria-hidden className="hero-carousel__overlay pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-ink-950 via-ink-950/75 to-ink-950/40 lg:bg-linear-to-r lg:from-ink-950 lg:via-ink-950/85 lg:to-ink-950/10" />
      <div aria-hidden className="hero-carousel__vignette pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-ink-950 via-transparent to-ink-950/60" />
      <div aria-hidden className="hero-carousel__grid bg-grid pointer-events-none absolute inset-0 -z-10 opacity-60" />
      <motion.div
        aria-hidden
        className="hero-carousel__glow pointer-events-none absolute -bottom-40 -left-40 -z-10 h-[32rem] w-[32rem] rounded-full bg-accent-400/20 blur-[140px]"
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="hero-carousel__inner container-page pointer-events-none flex flex-1 flex-col justify-center pt-[calc(var(--header-h)+3rem)] pb-10">
        <motion.div style={{ y: contentY, opacity: contentOpacity }} className="hero-carousel__content pointer-events-auto max-w-2xl">
          <motion.p
            className="hero-carousel__eyebrow eyebrow mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-accent-300 backdrop-blur"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="hero-carousel__eyebrow-dot h-1.5 w-1.5 rounded-full bg-accent-400" />
            India&apos;s car research platform
          </motion.p>
          <motion.h1
            className="hero-carousel__title font-display text-5xl leading-[1.02] font-bold sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
          >
            Every car.
            <br className="hero-carousel__title-break" />
            Every spec.
            <br className="hero-carousel__title-break" />
            <span className="hero-carousel__title-accent bg-linear-to-r from-white via-ink-200 to-ink-400 bg-clip-text text-transparent">
              Decided.
            </span>
          </motion.h1>
          <motion.p
            className="hero-carousel__lead mt-6 max-w-lg text-lg text-ink-300"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.16 }}
          >
            Prices, mileage, variants and the latest launches for cars on sale in India — laid out so
            you can compare and choose with confidence.
          </motion.p>

          <motion.div
            className="hero-carousel__actions mt-6 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.32 }}
          >
            <Link href="/cars" className="hero-carousel__action btn btn-ghost group">
              Explore all cars <ArrowRight size={16} className="hero-carousel__action-icon arrow-nudge" />
            </Link>
            <Link href="/news?type=New%20Launch" className="hero-carousel__action hero-carousel__action--secondary btn group px-2 text-ink-300 hover:text-white">
              Latest launches <ArrowRight size={16} className="hero-carousel__action-icon arrow-nudge" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Featured car card + slide controls. */}
      {car && (
        <div className="hero-carousel__featured container-page relative pb-8 sm:pb-12">
          <div className="hero-carousel__featured-row flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="hero-carousel__featured-group flex flex-col gap-3 sm:flex-row sm:items-stretch lg:ml-auto lg:order-2"
              >
                <Link
                  href={href}
                  className="hero-carousel__featured-card glass group flex items-center justify-between gap-6 rounded-2xl p-4 pr-5 transition-colors duration-300 hover:border-white/25"
                >
                  <div className="hero-carousel__featured-info">
                    <p className="hero-carousel__featured-label eyebrow text-accent-300">Featured</p>
                    <p className="hero-carousel__featured-name mt-1 font-display text-lg font-semibold">
                      {car.field_brand?.name} {car.field_car_model?.name}
                    </p>
                    {price && (
                      <p className="hero-carousel__featured-price num text-sm text-ink-300">
                        From <span className="hero-carousel__featured-price-value font-semibold text-white">₹ {price.amount} {price.unit}</span>
                      </p>
                    )}
                  </div>
                  <span className="hero-carousel__featured-cta grid h-10 w-10 place-items-center rounded-full bg-white text-ink-950 transition-transform duration-500 ease-premium group-hover:translate-x-1">
                    <ArrowRight size={18} className="hero-carousel__featured-cta-icon" />
                  </span>
                </Link>
                <dl className="hero-carousel__stats grid grid-cols-3 gap-3">
                  {[
                    { icon: Zap, label: "Engine", value: engineRange(car) },
                    { icon: Gauge, label: "Mileage", value: mileageRange(car) },
                    { icon: Fuel, label: "Fuel", value: car.field_fuel_type?.[0]?.name ?? "—" },
                  ].map((spec, i) => (
                    <motion.div
                      key={spec.label}
                      className="hero-carousel__stat glass rounded-2xl px-4 py-3"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.07 }}
                    >
                      <dt className="hero-carousel__stat-label flex items-center gap-1.5 text-[11px] text-ink-400">
                        <spec.icon size={12} aria-hidden className="hero-carousel__stat-icon" /> {spec.label}
                      </dt>
                      <dd className="hero-carousel__stat-value num mt-1 text-sm font-semibold whitespace-nowrap sm:text-base">{spec.value}</dd>
                    </motion.div>
                  ))}
                </dl>
              </motion.div>
            </AnimatePresence>

            {cars.length > 1 && (
              <div className="hero-carousel__controls flex items-center gap-4 lg:order-1">
                <div className="hero-carousel__arrows flex gap-2">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous featured car"
                    className="hero-carousel__arrow grid h-10 w-10 place-items-center rounded-full border border-white/15 transition-colors hover:border-white/40 hover:bg-white/10"
                  >
                    <ChevronLeft size={18} className="hero-carousel__arrow-icon" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next featured car"
                    className="hero-carousel__arrow grid h-10 w-10 place-items-center rounded-full border border-white/15 transition-colors hover:border-white/40 hover:bg-white/10"
                  >
                    <ChevronRight size={18} className="hero-carousel__arrow-icon" />
                  </button>
                </div>
                <div className="hero-carousel__dots flex gap-1.5">
                  {cars.map((c, i) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSlide([i, i > active ? 1 : -1])}
                      aria-label={`Show ${c.title}`}
                      aria-current={i === active}
                      className="hero-carousel__dot relative h-1 w-8 overflow-hidden rounded-full bg-white/20"
                    >
                      {i === active && (
                        <motion.span
                          key={`${active}-${paused}`}
                          className="hero-carousel__dot-progress absolute inset-y-0 left-0 bg-accent-400"
                          initial={{ width: paused ? "100%" : "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: paused ? 0 : AUTO_ADVANCE_MS / 1000, ease: "linear" }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
