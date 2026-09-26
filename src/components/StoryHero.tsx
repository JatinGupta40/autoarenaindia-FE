import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { FadeUp } from "@/components/Reveal";

/** Dark title band for news/blog detail pages, with the cover image overlapping into the page below. */
export function StoryHero({
  section,
  sectionHref,
  meta,
  title,
  cover,
  coverAlt,
}: {
  section: string;
  sectionHref: string;
  meta: React.ReactNode;
  title: string;
  cover: string | null;
  coverAlt: string;
}) {
  return (
    <>
      <section className={`story-hero relative overflow-hidden bg-ink-950 text-white ${cover ? "story-hero--has-cover pb-40 sm:pb-56" : "pb-14"}`}>
        <div aria-hidden className="story-hero__grid bg-grid pointer-events-none absolute inset-0" />
        <div className="story-hero__inner relative mx-auto max-w-3xl px-4 pt-[calc(var(--header-h)+3rem)] sm:px-6">
          <FadeUp className="story-hero__intro">
            <nav aria-label="Breadcrumb" className="story-hero__breadcrumb mb-6 flex items-center gap-1.5 text-sm text-ink-400">
              <Link href={sectionHref} className="story-hero__breadcrumb-link transition-colors hover:text-white">{section}</Link>
              <ChevronRight size={14} aria-hidden className="story-hero__breadcrumb-icon" />
            </nav>
            <div className="story-hero__meta mb-5 flex flex-wrap items-center gap-2">{meta}</div>
            <h1 className="story-hero__title font-display text-4xl leading-tight font-bold sm:text-5xl">{title}</h1>
          </FadeUp>
        </div>
      </section>
      {cover && (
        <div className="story-hero__cover mx-auto -mt-32 max-w-5xl px-4 sm:-mt-48 sm:px-6">
          <FadeUp delay={0.1} className="story-hero__cover-reveal">
            <div className="story-hero__cover-frame relative aspect-[16/9] overflow-hidden rounded-3xl bg-surface-2 shadow-2xl shadow-black/30">
              <Image src={cover} alt={coverAlt} fill priority sizes="(min-width: 1024px) 1024px, 100vw" className="story-hero__cover-image object-cover" />
            </div>
          </FadeUp>
        </div>
      )}
    </>
  );
}
