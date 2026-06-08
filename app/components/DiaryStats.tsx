"use client";

import { getThemeClasses } from "../utils/theme";
import { countReflectionDays } from "../utils/diaryStats";
import type { DiaryEntry } from "../types";

type DiaryStatsProps = {
  diaryEntries: DiaryEntry[];
};

export default function DiaryStats({ diaryEntries }: DiaryStatsProps) {
  const theme = getThemeClasses();
  const reflectionDays = countReflectionDays(diaryEntries);

  const stats = [
    { label: "Reflexiones", value: diaryEntries.length },
    { label: "Compartidas", value: diaryEntries.filter((e) => e.shared).length },
    { label: "Favoritas",   value: diaryEntries.filter((e) => e.favorite).length },
  ];

  return (
    <div className="space-y-4">
      {reflectionDays > 0 && (
        <p className={`text-sm leading-6 ${theme.mutedText}`}>
          Llevas {reflectionDays} {reflectionDays === 1 ? "día" : "días"} reflexionando sobre la Palabra.
        </p>
      )}

      <section className="grid grid-cols-3 gap-2 sm:gap-3">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className={`rounded-[1.7rem] border p-4 text-center shadow-sm backdrop-blur sm:rounded-3xl sm:p-5 ${theme.card}`}
          >
            <p className={`text-2xl font-bold sm:text-3xl ${theme.primaryText}`}>
              {stat.value}
            </p>
            <p className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] sm:text-xs sm:tracking-[0.18em] ${theme.accentText}`}>
              {stat.label}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}