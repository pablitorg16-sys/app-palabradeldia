"use client";

import { getThemeClasses } from "../../utils/theme";
import { SkeletonBlock, SkeletonCard } from "./SkeletonPrimitives";

export default function GospelSkeleton() {
  const theme = getThemeClasses();

  return (
    <section className="space-y-5">
      <div>
        <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${theme.accentText}`}>
          Evangelio del día
        </p>
        <p className={`mt-3 text-sm leading-6 ${theme.bodyText}`}>
          Preparando la lectura de hoy...
        </p>
      </div>

      <SkeletonCard className="space-y-6">
        <div>
          <SkeletonBlock className="h-4 w-36 rounded-xl" />
          <SkeletonBlock className="mt-3 h-8 w-52 rounded-xl" />
          <SkeletonBlock className="mt-3 h-4 w-40 rounded-xl" />
        </div>

        <div className="space-y-3">
          <SkeletonBlock className="h-4 w-full rounded-xl" />
          <SkeletonBlock className="h-4 w-11/12 rounded-xl" />
          <SkeletonBlock className="h-4 w-10/12 rounded-xl" />
          <SkeletonBlock className="h-4 w-8/12 rounded-xl" />
        </div>

        <div className="rounded-[1.5rem] border border-dashed border-[#5f6f52]/20 p-4">
          <SkeletonBlock className="h-4 w-44 rounded-xl" />
          <SkeletonBlock className="mt-3 h-20 w-full rounded-2xl" />
        </div>
      </SkeletonCard>
    </section>
  );
}