import type { DiaryEntry } from "../types";

export function countReflectionDays(entries: DiaryEntry[]): number {
  const uniqueDates = new Set(
    entries
      .filter((entry) => entry.source === "own")
      .map((entry) => entry.date)
  );
  return uniqueDates.size;
}