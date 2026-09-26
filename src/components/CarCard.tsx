import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Cog, Fuel, Gauge } from "lucide-react";
import type { Car } from "@/types/drupal";
import { imageAlt, imageUrl } from "@/lib/image";
import { formatGenerationRange, priceParts } from "@/utils/format";
import { Badge } from "@/components/Badge";

function MiniSpec({ icon: Icon, label, value }: { icon: typeof Gauge; label: string; value: string }) {
  return (
    <div className="car-card__spec min-w-0">
      <dt className="car-card__spec-label flex items-center gap-1 text-[11px] text-muted">
        <Icon size={12} strokeWidth={2} aria-hidden className="car-card__spec-icon" />
        {label}
      </dt>
      <dd className="car-card__spec-value mt-0.5 truncate text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

export function CarCard({ car, priority = false }: { car: Car; priority?: boolean }) {
  const cover = imageUrl(car.field_car_images?.[0]);
  const href = car.path?.alias || `/cars/${car.id}`;
  const price = priceParts(car.field_price);
  const name = `${car.field_brand?.name ?? ""} ${car.field_car_model?.name ?? ""}`.trim();

  return (
    <Link
      href={href}
      aria-label={`${name}, ${formatGenerationRange(car.field_year_start, car.field_year_end)}`}
      className="car-card group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-card transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:border-accent-400/40 hover:shadow-card-hover focus-visible:outline-2 focus-visible:outline-accent-400"
    >
      <div className="car-card__media relative aspect-[16/10] overflow-hidden bg-surface-2">
        {cover ? (
          <Image
            src={cover}
            alt={imageAlt(car.field_car_images?.[0], car.title)}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 400px, (min-width: 640px) 50vw, 90vw"
            className="car-card__image object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.06]"
          />
        ) : (
          <div className="car-card__placeholder flex h-full items-center justify-center text-sm text-muted">No image</div>
        )}
        <div aria-hidden className="car-card__scrim absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-ink-950/40 to-transparent" />
        <div className="car-card__badges absolute top-3 right-3 left-3 flex items-start justify-between gap-2">
          {car.field_year_end === null ? <Badge variant="solid">Current gen</Badge> : <span className="car-card__badge-spacer" />}
          {car.field_body_type?.name && <Badge variant="glass">{car.field_body_type.name}</Badge>}
        </div>
      </div>

      <div className="car-card__body flex flex-1 flex-col p-5">
        <p className="car-card__brand eyebrow text-link">{car.field_brand?.name}</p>
        <h3 className="car-card__title mt-1 truncate font-display text-xl font-semibold text-foreground">
          {car.field_car_model?.name}
        </h3>
        <p className="car-card__years text-sm text-muted">{formatGenerationRange(car.field_year_start, car.field_year_end)}</p>

        <dl className="car-card__specs mt-4 grid grid-cols-3 gap-3 border-y border-border py-3">
          <MiniSpec icon={Gauge} label="Mileage" value={car.field_mileage ? `${car.field_mileage} km/l` : "—"} />
          <MiniSpec icon={Fuel} label="Fuel" value={car.field_fuel_type?.[0]?.name ?? "—"} />
          <MiniSpec icon={Cog} label="Gearbox" value={car.field_transmission?.[0]?.name ?? "—"} />
        </dl>

        <div className="car-card__footer mt-auto flex items-end justify-between pt-4">
          <div className="car-card__pricing">
            <p className="car-card__price-label text-[11px] text-muted">Starting at</p>
            {price ? (
              <p className="car-card__price num text-xl font-bold text-foreground">
                ₹ {price.amount} <span className="car-card__price-unit text-sm font-medium text-muted">{price.unit}</span>
              </p>
            ) : (
              <p className="car-card__price car-card__price--empty num text-xl font-bold text-muted">—</p>
            )}
          </div>
          <span
            aria-hidden
            className="car-card__cta grid h-10 w-10 place-items-center rounded-full border border-border text-foreground transition-all duration-500 ease-premium group-hover:rotate-45 group-hover:border-accent-400 group-hover:bg-accent-400 group-hover:text-ink-950"
          >
            <ArrowUpRight size={18} className="car-card__cta-icon" />
          </span>
        </div>
      </div>
    </Link>
  );
}
