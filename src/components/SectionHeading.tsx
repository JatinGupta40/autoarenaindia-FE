import Link from "next/link";

export function SectionHeading({
  title,
  subtitle,
  viewAllHref,
}: {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="font-display text-2xl sm:text-3xl font-600 text-primary-800 dark:text-accent-100">
          {title}
        </h2>
        {subtitle && <p className="text-muted mt-1">{subtitle}</p>}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="text-sm font-medium text-accent-500 hover:text-accent-400 transition-colors whitespace-nowrap"
        >
          View all →
        </Link>
      )}
    </div>
  );
}
