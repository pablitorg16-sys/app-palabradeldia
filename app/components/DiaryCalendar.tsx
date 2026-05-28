"use client";

import { useState } from "react";
import type { DiaryEntry } from "../types";

type DiaryCalendarProps = {
  diaryEntries: DiaryEntry[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
  theme: {
    card: string;
    accentText: string;
    primaryText: string;
    bodyText: string;
    pill: string;
  };
};

function formatMonthLabel(date: Date) {
  const label = date.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  return label.charAt(0).toUpperCase() + label.slice(1);
}

export default function DiaryCalendar({
  diaryEntries,
  selectedDate,
  onSelectDate,
  theme,
}: DiaryCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(new Date());

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const monthName = formatMonthLabel(visibleMonth);

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (firstDayOfMonth.getDay() + 6) % 7;

  const entryDates = new Set(diaryEntries.map((entry) => entry.date));

  const emptyDays = Array.from({ length: firstWeekday });
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  function formatSpanishDate(day: number) {
    return `${day}/${month + 1}/${year}`;
  }

  function goToPreviousMonth() {
    setVisibleMonth(new Date(year, month - 1, 1));
    onSelectDate(null);
  }

  function goToNextMonth() {
    setVisibleMonth(new Date(year, month + 1, 1));
    onSelectDate(null);
  }

  function goToCurrentMonth() {
    setVisibleMonth(new Date());
    onSelectDate(null);
  }

  return (
    <section
      className={`mb-6 rounded-3xl border border-[#5f6f52]/30 p-5 shadow-sm backdrop-blur ${theme.card}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <div>
  <p
    className={`text-sm font-semibold uppercase tracking-[0.2em] ${theme.accentText}`}
  >
    Tu calendario de reflexiones
  </p>

</div>

        <span
          className={`rounded-full px-4 py-2 text-sm font-semibold ${theme.pill}`}
        >
          {isOpen ? "Ocultar" : "Mostrar"}
        </span>
      </button>

      {isOpen && (
        <div className="mt-5">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <button
              onClick={goToPreviousMonth}
              className={`rounded-full border border-[#5f6f52]/20 bg-white/50 px-4 py-2 text-sm font-semibold transition hover:bg-white/75 ${theme.primaryText}`}
            >
              ←
            </button>

            <button
              onClick={goToCurrentMonth}
              className={`rounded-full border border-[#5f6f52]/20 bg-white/50 px-4 py-2 text-sm font-semibold transition hover:bg-white/75 ${theme.primaryText}`}
            >
              {monthName}
            </button>

            <button
              onClick={goToNextMonth}
              className={`rounded-full border border-[#5f6f52]/20 bg-white/50 px-4 py-2 text-sm font-semibold transition hover:bg-white/75 ${theme.primaryText}`}
            >
              →
            </button>

            <button
              onClick={() => onSelectDate(null)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedDate === null
                  ? "bg-[#26351f] text-white"
                  : `border border-[#5f6f52]/20 bg-white/50 hover:bg-white/75 ${theme.primaryText}`
              }`}
            >
              Todas
            </button>
          </div>

          <div
            className={`mb-2 grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase ${theme.accentText}`}
          >
            <span>L</span>
            <span>M</span>
            <span>X</span>
            <span>J</span>
            <span>V</span>
            <span>S</span>
            <span>D</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {emptyDays.map((_, index) => (
              <div key={`empty-${index}`} />
            ))}

            {days.map((day) => {
              const date = formatSpanishDate(day);
              const hasEntry = entryDates.has(date);
              const isSelected = selectedDate === date;

              return (
                <button
                  key={day}
                  onClick={() => hasEntry && onSelectDate(date)}
                  disabled={!hasEntry}
                  className={`relative rounded-xl py-3 text-sm font-semibold transition ${
                    isSelected
                      ? "bg-[#26351f] text-white"
                      : hasEntry
                      ? "bg-[#dfe6d2] text-[#26351f] hover:bg-[#cfd9c0]"
                      : "bg-white/25 text-stone-400"
                  } disabled:cursor-not-allowed`}
                >
                  {day}

                  {hasEntry && (
                    <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#4f6740]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}