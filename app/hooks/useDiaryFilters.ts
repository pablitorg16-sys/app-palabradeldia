"use client";

import { useState } from "react";
import type { DiaryEntry } from "../types";
import { getUsedTags } from "../utils/tags";
import { getVisibleDiaryEntries } from "../utils/diary";

export type DiarySourceFilter = "all" | "own" | "community";

export function useDiaryFilters(diaryEntries: DiaryEntry[]) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [sourceFilter, setSourceFilter] =
    useState<DiarySourceFilter>("all");

  const usedTags = getUsedTags(diaryEntries);

  const visibleEntries = getVisibleDiaryEntries({
    diaryEntries,
    selectedDate,
    selectedTagId,
    showOnlyFavorites,
    sourceFilter,
  });

  return {
    selectedDate,
    setSelectedDate,
    selectedTagId,
    setSelectedTagId,
    showOnlyFavorites,
    setShowOnlyFavorites,
    sourceFilter,
    setSourceFilter,
    usedTags,
    visibleEntries,
  };
}