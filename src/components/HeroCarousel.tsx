"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type { Car } from "@/types/drupal";
import { imageAlt, imageUrl } from "@/lib/image";
import { formatPriceLakh } from "@/utils/format";
import { Badge } from "@/components/Badge";

const AUTO_ADVANCE_MS = 5000;
const SWIPE_THRESHOLD = 60;

export function HeroCarousel({ cars }: { cars: Car[] }) {
  const [[active, direction], setSlide] = useState<[number, number]>([0, 0]);

  const go = (dir: number) => {
    setSlide(([current]) => {
      const next = (current + dir + cars.length) % cars.length;
      return [next, dir];
    });
  };

  useEffect(() => {
    if (cars.length < 2) return;
    const timer = setInterval(() => go(1), AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cars.length]);

  if (cars.length === 0) return null;

  const car = cars[active];
  const cover = imageUrl(car.field_car_images?.[0]);
  const href = car.path?.alias || `/cars/${car.id}`;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-primary-800 text-primary-100">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={car.id}
          custom={direction}
          initial={{ opacity: 0, x: direction >= 0 ? 60 : -60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction >= 0 ? -60 : 60 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          drag={cars.length > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -SWIPE_THRESHOLD) go(1);
            else if (info.offset.x > SWIPE_THRESHOLD) go(-1);
          }}
          className="grid sm:grid-cols-2 items-center cursor-grab active:cursor-grabbing"
        >
          <div className="p-8 sm:p-12 space-y-4 order-2 sm:order-1">
            <Badge variant="accent">Featured</Badge>
            <h1 className="font-display text-3xl sm:text-4xl font-700 leading-tight">
              {car.field_brand?.name} {car.field_car_model?.name}
            </h1>
            <p className="text-primary-200">
              {car.field_body_type?.name} · {car.field_fuel_type?.[0]?.name}
            </p>
            <p className="font-display text-2xl font-600 text-accent-300">
              {formatPriceLakh(car.field_price)}
            </p>
            <Link
              href={href}
              className="inline-flex items-center rounded-full bg-accent-400 px-5 py-2.5 text-sm font-600 text-primary-800 transition-colors hover:bg-accent-300"
            >
              View details
            </Link>
          </div>
          <div className="relative order-1 sm:order-2 aspect-[3/2] sm:aspect-auto sm:h-80 pointer-events-none">
            {cover && (
              <Image
                src={cover}
                alt={imageAlt(car.field_car_images?.[0], car.title)}
                fill
                priority
                draggable={false}
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {cars.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {cars.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setSlide([i, i > active ? 1 : -1])}
              aria-label={`Show ${c.title}`}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-6 bg-accent-400" : "w-1.5 bg-primary-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
