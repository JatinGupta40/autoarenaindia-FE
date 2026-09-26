/** Loading placeholder matching <PageHero>, so the header never flashes over a light background. */
export function PageHeroSkeleton({ children }: { children?: React.ReactNode }) {
  return (
    <div className="page-hero-skeleton bg-ink-950 pt-[calc(var(--header-h)+3.5rem)] pb-14 sm:pb-16">
      <div className="page-hero-skeleton__inner container-page animate-pulse">
        <div className="page-hero-skeleton__eyebrow h-3 w-24 rounded-full bg-white/10" />
        <div className="page-hero-skeleton__title mt-5 h-12 w-72 max-w-full rounded-xl bg-white/10" />
        <div className="page-hero-skeleton__description mt-5 h-4 w-96 max-w-full rounded-full bg-white/5" />
        {children}
      </div>
    </div>
  );
}
