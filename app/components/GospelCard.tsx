"use client";

import { getThemeClasses } from "../utils/theme";
import type { Gospel } from "../types";
import SaintsOfDay from "./SaintsOfDay";

type GospelCardProps = {
  gospel: Gospel;
};

export default function GospelCard({ gospel }: GospelCardProps) {
  const theme = getThemeClasses();
  const dateStr = new Date(gospel.date).toLocaleDateString("es-ES", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <article className="pb-8 pt-2 sm:pb-12 sm:pt-4">
      <div className="mb-5 flex items-center gap-4 sm:mb-7">
        <div className={`h-px flex-1 ${theme.divider}`}></div>
        <div className="flex flex-col items-center gap-1">
          <p
            className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${theme.mutedText}`}
            style={{ fontFamily: "var(--font-ui, sans-serif)" }}
          >
            {dateStr}
          </p>
          {gospel.celebration && (
            <p
              className={`text-[9px] font-semibold uppercase tracking-[0.12em] opacity-60 ${theme.mutedText}`}
              style={{ fontFamily: "var(--font-ui, sans-serif)" }}
            >
              {gospel.celebration}
            </p>
          )}
        </div>
        <div className={`h-px flex-1 ${theme.divider}`}></div>
      </div>

      <SaintsOfDay date={gospel.date} />

      <p
        className={`mb-5 mt-6 first:mt-0 text-[10px] font-semibold uppercase tracking-[0.18em] ${theme.accentText}`}
        style={{ fontFamily: "var(--font-ui, sans-serif)" }}
      >
        Evangelio del día
      </p>

      <h2
        className={`mb-3 text-[1.9rem] font-medium italic leading-[1.15] sm:text-[2.4rem] ${theme.primaryText}`}
        style={{ fontFamily: "var(--font-display, Georgia, serif)" }}
      >
        {gospel.title}
      </h2>

      <p
        className={`mb-10 text-[11px] font-semibold uppercase tracking-[0.14em] sm:mb-12 ${theme.accentText}`}
        style={{ fontFamily: "var(--font-ui, sans-serif)" }}
      >
        {gospel.reference}
      </p>

      <div className="border-l-[2px] border-[var(--accent)] pl-6 sm:pl-10">
        <blockquote
          className={`max-w-3xl text-[1.08rem] font-normal leading-[1.95] sm:text-[1.18rem] sm:leading-[2.05] ${theme.bodyText}`}
          style={{ fontFamily: "var(--font-body, Georgia, serif)" }}
        >
          {gospel.text}
        </blockquote>
      </div>
    </article>
  );
}