import type { DrupalImage } from "@/types/drupal";

const BASE_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL ?? "";

export function toAbsoluteUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  return url.startsWith("http") ? url : `${BASE_URL}${url}`;
}

export function imageUrl(image: DrupalImage | undefined | null): string | null {
  return toAbsoluteUrl(image?.uri?.url);
}

export function imageAlt(image: DrupalImage | undefined | null, fallback: string): string {
  return image?.resourceIdObjMeta?.alt || fallback;
}
