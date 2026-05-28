import type { DiaryEntry } from "../types";

const LOCAL_STORAGE_KEY = "diaryEntries";

export function getLocalDiaryEntries(): DiaryEntry[] {
  if (typeof window === "undefined") return [];

  const savedEntries = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (!savedEntries) return [];

  try {
    return JSON.parse(savedEntries);
  } catch {
    return [];
  }
}

export function clearLocalDiaryEntries() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(LOCAL_STORAGE_KEY);
}