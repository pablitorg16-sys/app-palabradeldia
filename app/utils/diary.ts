import type { DiaryEntry, Gospel } from "../types";

type SourceFilter = "all" | "own" | "community";

export function normalizeDate(date: string) {
  if (!date) return "";

  if (date.includes("-")) {
    return date;
  }

  const [day, month, year] = date.split("/");

  if (!day || !month || !year) {
    return date;
  }

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export function getGospelForEntry(entry: DiaryEntry, gospels: Gospel[]) {
  const entryDate = normalizeDate(entry.gospelDate || entry.date);

  return gospels.find((gospel) => {
    return normalizeDate(gospel.date) === entryDate;
  });
}

export function getVisibleDiaryEntries({
  diaryEntries,
  selectedDate,
  selectedTagId,
  showOnlyFavorites,
  sourceFilter,
}: {
  diaryEntries: DiaryEntry[];
  selectedDate: string | null;
  selectedTagId: string | null;
  showOnlyFavorites: boolean;
  sourceFilter: SourceFilter;
}) {
  return diaryEntries.filter((entry) => {
    if (selectedDate && entry.date !== selectedDate) {
      return false;
    }

    if (selectedTagId) {
      const hasSelectedTag = entry.tags.some(
        (tag) => tag.id === selectedTagId
      );

      if (!hasSelectedTag) {
        return false;
      }
    }

    if (showOnlyFavorites && !entry.favorite) {
      return false;
    }

    if (sourceFilter !== "all" && entry.source !== sourceFilter) {
      return false;
    }

    return true;
  });
}

export function getUsedDiaryTags(diaryEntries: DiaryEntry[]) {
  const tagsMap = new Map<string, DiaryEntry["tags"][number]>();

  diaryEntries.forEach((entry) => {
    entry.tags.forEach((tag) => {
      tagsMap.set(tag.id, tag);
    });
  });

  return Array.from(tagsMap.values());
}