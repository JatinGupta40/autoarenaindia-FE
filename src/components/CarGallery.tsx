"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DrupalImage } from "@/types/drupal";
import { imageAlt, imageUrl } from "@/lib/image";

export function CarGallery({ images, title }: { images: DrupalImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const thumbsRef = useRef<HTMLDivElement>(null);

  // Keep the active thumbnail visible in the strip without scrolling the page.
  useEffect(() => {
    const strip = thumbsRef.current;
    const thumb = strip?.children[active] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    strip.scrollTo({ left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  if (images.length === 0) return null;

  const go = (dir: number) => setActive((i) => (i + dir + images.length) % images.length);

  return (
    <div className="car-gallery space-y-4">
      <div
        className="car-gallery__stage group relative aspect-[4/3] overflow-hidden rounded-3xl bg-surface-2 sm:aspect-[16/9]"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={images[active].id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="car-gallery__slide absolute inset-0"
          >
            <Image
              src={imageUrl(images[active])!}
              alt={imageAlt(images[active], title)}
              fill
              sizes="(min-width: 1280px) 1232px, 100vw"
              className="car-gallery__image object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <div className="car-gallery__controls absolute inset-x-0 bottom-0 flex items-center justify-between bg-linear-to-t from-ink-950/60 to-transparent p-4 text-white">
              <span className="car-gallery__counter num rounded-full bg-ink-950/50 px-3 py-1 text-xs backdrop-blur" aria-live="polite">
                {active + 1} / {images.length}
              </span>
              <div className="car-gallery__arrows flex gap-2">
                {[-1, 1].map((dir) => (
                  <button
                    key={dir}
                    type="button"
                    onClick={() => go(dir)}
                    aria-label={dir < 0 ? "Previous photo" : "Next photo"}
                    className="car-gallery__arrow grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-white hover:text-ink-950"
                  >
                    {dir < 0 ? <ChevronLeft size={18} className="car-gallery__arrow-icon" /> : <ChevronRight size={18} className="car-gallery__arrow-icon" />}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div ref={thumbsRef} className="car-gallery__thumbs scrollbar-none flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === active}
              className={`car-gallery__thumb relative aspect-[3/2] w-28 shrink-0 overflow-hidden rounded-xl transition-all duration-300 ${
                i === active ? "car-gallery__thumb--active ring-2 ring-accent-400 ring-offset-2 ring-offset-background" : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={imageUrl(img)!} alt={imageAlt(img, title)} fill sizes="112px" className="car-gallery__thumb-image object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
