import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "View all",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}) {
  return (
    <div className="section-heading mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="section-heading__text max-w-2xl">
        {eyebrow && <p className="section-heading__eyebrow eyebrow mb-3 text-link">{eyebrow}</p>}
        <h2 className="section-heading__title font-display text-3xl font-bold text-foreground sm:text-4xl">{title}</h2>
        {subtitle && <p className="section-heading__subtitle mt-2 text-muted">{subtitle}</p>}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="section-heading__link group inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-foreground transition-colors hover:text-link"
        >
          {viewAllLabel}
          <ArrowRight size={16} className="section-heading__link-icon arrow-nudge" />
        </Link>
      )}
    </div>
  );
}
