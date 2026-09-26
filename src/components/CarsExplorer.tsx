"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { DrupalTerm } from "@/types/drupal";
import { FilterBar } from "@/components/FilterBar";

export function CarsExplorer({
  brands,
  bodyTypes,
  fuels,
  current,
  children,
}: {
  brands: DrupalTerm[];
  bodyTypes: DrupalTerm[];
  fuels: DrupalTerm[];
  current: { brand?: string; bodyType?: string; fuel?: string };
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (href: string) => {
    startTransition(() => router.push(href));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <FilterBar brands={brands} bodyTypes={bodyTypes} fuels={fuels} current={current} onNavigate={navigate} pending={isPending} />
      </aside>

      <div className={`transition-opacity duration-200 ${isPending ? "opacity-50" : "opacity-100"}`}>
        {children}
      </div>
    </div>
  );
}
