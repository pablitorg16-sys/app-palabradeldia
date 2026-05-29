"use client";

import { SkeletonBlock, SkeletonCard } from "./SkeletonPrimitives";

type CommunitySkeletonProps = {
  theme: {
    mode?: string;
    accentText: string;
    primaryText: string;
    bodyText: string;
  };
};

export default function CommunitySkeleton({ theme }: CommunitySkeletonProps) {
  return (
    <section className="space-y-5">
      <div>
        <p
          className={`text-xs font-semibold uppercase tracking-[0.35em] ${theme.accentText}`}
        >
          Comunidad
        </p>

        <h2 className={`mt-3 text-2xl font-bold ${theme.primaryText}`}>
          Reflexiones compartidas
        </h2>

        <p className={`mt-2 text-sm leading-6 ${theme.bodyText}`}>
          Preparando las reflexiones de la comunidad...
        </p>
      </div>

      <div
        className={`inline-flex rounded-full border p-1 shadow-sm ${
          theme.mode === "night"
  ? "border-[#9aa58f]/20 bg-[#3d493f]/45"
  : "border-[#d8d1c0] bg-[#f8f4ea]"
        }`}
      >
        <SkeletonBlock theme={theme} className="h-9 w-24" />
        <SkeletonBlock theme={theme} className="ml-2 h-9 w-24" />
      </div>

      <div className="space-y-5">
        {[0, 1, 2].map((item) => (
          <SkeletonCard key={item} theme={theme}>
            <div className="flex items-center gap-3">
              <SkeletonBlock theme={theme} className="h-11 w-11 rounded-full" />

              <div className="min-w-0 flex-1">
                <SkeletonBlock theme={theme} className="h-4 w-32" />
                <SkeletonBlock theme={theme} className="mt-2 h-3 w-48" />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <SkeletonBlock theme={theme} className="h-4 w-full rounded-xl" />
              <SkeletonBlock theme={theme} className="h-4 w-11/12 rounded-xl" />
              <SkeletonBlock theme={theme} className="h-4 w-7/12 rounded-xl" />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <SkeletonBlock theme={theme} className="h-8 w-28" />
              <SkeletonBlock theme={theme} className="h-8 w-24" />
              <SkeletonBlock theme={theme} className="h-8 w-20" />
            </div>
          </SkeletonCard>
        ))}
      </div>
    </section>
  );
}