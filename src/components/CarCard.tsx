import Image from "next/image";
import Link from "next/link";
import type { Car } from "@/types/drupal";
import { imageAlt, imageUrl } from "@/lib/image";
import { formatGenerationRange, formatPriceLakh } from "@/utils/format";
import { Badge } from "@/components/Badge";

export function CarCard({ car }: { car: Car }) {
  const cover = imageUrl(car.field_car_images?.[0]);
  const href = car.path?.alias || `/cars/${car.id}`;

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-primary-100">
        {cover ? (
          <Image
            src={cover}
            alt={imageAlt(car.field_car_images?.[0], car.title)}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-primary-400">No image</div>
        )}
        {car.field_year_end === null && (
          <span className="absolute top-3 left-3">
            <Badge variant="accent">Current gen</Badge>
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs font-medium text-accent-500 uppercase tracking-wide">
          {car.field_brand?.name}
        </p>
        <h3 className="font-display font-600 text-lg text-foreground mt-0.5 truncate">
          {car.field_car_model?.name}
        </h3>
        <p className="text-sm text-muted mt-0.5">
          {formatGenerationRange(car.field_year_start, car.field_year_end)}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {car.field_body_type?.name && <Badge>{car.field_body_type.name}</Badge>}
          {car.field_fuel_type?.[0]?.name && <Badge>{car.field_fuel_type[0].name}</Badge>}
        </div>

        <p className="mt-3 font-display font-700 text-primary-800 dark:text-accent-100">
          {formatPriceLakh(car.field_price)}
          <span className="text-xs font-normal text-muted"> onwards</span>
        </p>
      </div>
    </Link>
  );
}
