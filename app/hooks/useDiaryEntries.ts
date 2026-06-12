"use client";

import { useCallback, useEffect, useState } from "react";
import type { DiaryEntry } from "../types";
import {
  getUserReflections,
  insertReflection,
  reflectionExists,
} from "../utils/reflections";
import {
  clearLocalDiaryEntries,
  getLocalDiaryEntries,
} from "../utils/localDiary";

export function useDiaryEntries(userId?: string) {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [isLoadingDiary, setIsLoadingDiary] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  const loadEntries = useCallback(async () => {
    if (userId) {
      setIsLoadingDiary(true);

      const localEntries = getLocalDiaryEntries();
      let migratedCount = 0;

      for (const entry of localEntries) {
        const exists = await reflectionExists(userId, entry.text, entry.gospelDate);
        if (!exists) {
          await insertReflection(entry, userId);
          migratedCount += 1;
        }
      }

      if (localEntries.length > 0) {
        clearLocalDiaryEntries();
      }

      if (migratedCount > 0) {
        setSyncMessage(
          `${migratedCount} reflexión${migratedCount === 1 ? "" : "es"} sincronizada${migratedCount === 1 ? "" : "s"} con tu cuenta.`
        );
        setTimeout(() => setSyncMessage(""), 3500);
      }

      const { entries, error } = await getUserReflections(userId);
      if (!error) setDiaryEntries(entries);

      setIsLoadingDiary(false);
      return;
    }

    const localEntries = getLocalDiaryEntries();
    setDiaryEntries(localEntries);
  }, [userId]);

  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  // Recargar cuando el usuario vuelve a la app
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void loadEntries();
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [loadEntries]);

  useEffect(() => {
    if (!userId) {
      localStorage.setItem("diaryEntries", JSON.stringify(diaryEntries));
    }
  }, [diaryEntries, userId]);

  return {
    diaryEntries,
    setDiaryEntries,
    isLoadingDiary,
    syncMessage,
    refreshDiary: loadEntries,
  };
}