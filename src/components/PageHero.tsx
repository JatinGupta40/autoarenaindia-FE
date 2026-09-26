import { FadeUp } from "@/components/Reveal";

/**
 * Dark band at the top of listing pages. Sits under the transparent fixed header,
 * so it carries the header's height as top padding.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="page-hero relative overflow-hidden bg-ink-950 pt-[calc(var(--header-h)+3.5rem)] pb-14 text-white sm:pb-16">
      <div aria-hidden className="page-hero__grid bg-grid pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="page-hero__glow pointer-events-none absolute -top-40 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-accent-400/15 blur-[120px]"
      />
      <div className="page-hero__inner container-page relative">
        <FadeUp className="page-hero__intro">
          {eyebrow && <p className="page-hero__eyebrow eyebrow mb-4 text-accent-300">{eyebrow}</p>}
          <h1 className="page-hero__title font-display text-4xl font-bold sm:text-5xl lg:text-6xl">{title}</h1>
          {description && <p className="page-hero__description mt-4 max-w-2xl text-lg text-ink-300">{description}</p>}
        </FadeUp>
        {children && <FadeUp delay={0.1} className="page-hero__actions mt-8">{children}</FadeUp>}
      </div>
    </section>
  );
}
