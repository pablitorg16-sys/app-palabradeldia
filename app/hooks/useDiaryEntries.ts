"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    async function syncLocalEntriesToSupabase() {
      if (!userId) return 0;

      const localEntries = getLocalDiaryEntries();
      let migratedCount = 0;

      for (const entry of localEntries) {
        const exists = await reflectionExists(
          userId,
          entry.text,
          entry.gospelDate
        );

        if (!exists) {
          await insertReflection(entry, userId);
          migratedCount += 1;
        }
      }

      if (localEntries.length > 0) {
        clearLocalDiaryEntries();
      }

      return migratedCount;
    }

    async function loadEntries() {
      if (userId) {
        setIsLoadingDiary(true);

        const migratedCount = await syncLocalEntriesToSupabase();

        if (migratedCount > 0) {
          setSyncMessage(
            `${migratedCount} reflexión${
              migratedCount === 1 ? "" : "es"
            } sincronizada${migratedCount === 1 ? "" : "s"} con tu cuenta.`
          );

          setTimeout(() => {
            setSyncMessage("");
          }, 3500);
        }

        const { entries, error } = await getUserReflections(userId);

        if (!error) {
          setDiaryEntries(entries);
        }

        setIsLoadingDiary(false);
        return;
      }

      const localEntries = getLocalDiaryEntries();
      setDiaryEntries(localEntries);
    }

    loadEntries();
  }, [userId]);

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
  };
}