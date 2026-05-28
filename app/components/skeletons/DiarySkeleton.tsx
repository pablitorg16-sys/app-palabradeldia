"use client";

import { SkeletonBlock, SkeletonCard } from "./SkeletonPrimitives";

type DiarySkeletonProps = {
  theme: {
    mode?: string;
    accentText: string;
    primaryText: string;
    bodyText: string;
  };
};

export default function DiarySkeleton({ theme }: DiarySkeletonProps) {
  return (
    <section className="space-y-5">
      <div>
        <p
          className={`text-xs font-semibold uppercase tracking-[0.35em] ${theme.accentText}`}
        >
          Diario de reflexiones
        </p>

        <p className={`mt-3 text-sm leading-6 ${theme.bodyText}`}>
          Preparando tus reflexiones guardadas...
        </p>
      </div>

      <div
        className={`rounded-[2rem] border p-3 shadow-sm ${
          theme.mode === "night"
            ? "border-[#d9e2cf]/10 bg-[#263126]"
            : "border-[#d8d1c0] bg-[#f8f4ea]"
        }`}
      >
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <SkeletonBlock theme={theme} className="h-9 w-full sm:w-28" />
          <SkeletonBlock theme={theme} className="h-9 w-full sm:w-40" />
          <SkeletonBlock theme={theme} className="col-span-2 h-9 w-full sm:w-56" />
        </div>
      </div>

      <div className="space-y-5">
        {[0, 1, 2].map((item) => (
          <SkeletonCard key={item} theme={theme}>
            <SkeletonBlock theme={theme} className="h-4 w-36 rounded-xl" />
            <SkeletonBlock theme={theme} className="mt-2 h-3 w-28 rounded-xl" />

            <div className="mt-6 space-y-3">
              <SkeletonBlock theme={theme} className="h-4 w-full rounded-xl" />
              <SkeletonBlock theme={theme} className="h-4 w-10/12 rounded-xl" />
              <SkeletonBlock theme={theme} className="h-4 w-7/12 rounded-xl" />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <SkeletonBlock theme={theme} className="h-8 w-32" />
              <SkeletonBlock theme={theme} className="h-8 w-24" />
            </div>
          </SkeletonCard>
        ))}
      </div>
    </section>
  );
}