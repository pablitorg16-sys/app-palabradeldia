"use client";

import { useTheme } from "../../context/ThemeContext";
import { getThemeClasses } from "../../utils/theme";
import { SkeletonBlock, SkeletonCard } from "./SkeletonPrimitives";

export default function CommunitySkeleton() {
  const { theme: dayPeriod } = useTheme();
  const theme = getThemeClasses();
  const isNight = dayPeriod === "night";

  const filterBg = isNight
    ? "border-[#9aa58f]/20 bg-[#3d493f]/45"
    : "border-[#d8d1c0] bg-[#f8f4ea]";

  return (
    <section className="space-y-5">
      <div>
        <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${theme.accentText}`}>
          Comunidad
        </p>
        <h2 className={`mt-3 text-2xl font-bold ${theme.primaryText}`}>
          Reflexiones compartidas
        </h2>
        <p className={`mt-2 text-sm leading-6 ${theme.bodyText}`}>
          Preparando las reflexiones de la comunidad...
        </p>
      </div>

      <div className={`inline-flex rounded-full border p-1 shadow-sm ${filterBg}`}>
        <SkeletonBlock className="h-9 w-24" />
        <SkeletonBlock className="ml-2 h-9 w-24" />
      </div>

      <div className="space-y-5">
        {[0, 1, 2].map((item) => (
          <SkeletonCard key={item}>
            <div className="flex items-center gap-3">
              <SkeletonBlock className="h-11 w-11 rounded-full" />
              <div className="min-w-0 flex-1">
                <SkeletonBlock className="h-4 w-32" />
                <SkeletonBlock className="mt-2 h-3 w-48" />
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <SkeletonBlock className="h-4 w-full rounded-xl" />
              <SkeletonBlock className="h-4 w-11/12 rounded-xl" />
              <SkeletonBlock className="h-4 w-7/12 rounded-xl" />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <SkeletonBlock className="h-8 w-28" />
              <SkeletonBlock className="h-8 w-24" />
              <SkeletonBlock className="h-8 w-20" />
            </div>
          </SkeletonCard>
        ))}
      </div>
    </section>
  );
}