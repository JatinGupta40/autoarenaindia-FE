"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import type { DrupalImage } from "@/types/drupal";
import { imageAlt, imageUrl } from "@/lib/image";

export function CarGallery({ images, title }: { images: DrupalImage[]; title: string }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/2] sm:aspect-[16/9] overflow-hidden rounded-2xl bg-primary-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={images[active].id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <Image
              src={imageUrl(images[active])!}
              alt={imageAlt(images[active], title)}
              fill
              priority
              sizes="(min-width: 640px) 66vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`relative aspect-[3/2] w-24 shrink-0 overflow-hidden rounded-lg ring-2 transition-all ${
                i === active ? "ring-accent-400" : "ring-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={imageUrl(img)!} alt={imageAlt(img, title)} fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
