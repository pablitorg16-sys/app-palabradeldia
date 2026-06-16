"use client";

import { useEffect, useState, useCallback } from "react";
import type { Gospel } from "../types";
import { getTodayGospel } from "../data/gospels";
import { getLiturgicalDayByDate } from "../utils/liturgicalDays";

function getTodayDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;
const TIMEOUT_MS = 8000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout después de ${ms}ms`)), ms)
    ),
  ]);
}

export function useTodayGospel() {
  const [todayGospel, setTodayGospel] = useState<Gospel | null>(null);
  const [isLoadingGospel, setIsLoadingGospel] = useState(true);

  const loadTodayGospel = useCallback(async () => {
    setIsLoadingGospel(true);

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const gospelFromSupabase = await withTimeout(
          getLiturgicalDayByDate(getTodayDateKey()),
          TIMEOUT_MS
        );

        if (gospelFromSupabase) {
          setTodayGospel(gospelFromSupabase);
          setIsLoadingGospel(false);
          return;
        }
      } catch (error) {
        console.warn(`Intento ${attempt + 1} fallido:`, error);
      }

      if (attempt < MAX_RETRIES - 1) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }

    // Fallback local — siempre muestra algo
    const fallback = getTodayGospel();
    setTodayGospel(fallback);
    setIsLoadingGospel(false);
  }, []);

  useEffect(() => {
    void loadTodayGospel();
  }, [loadTodayGospel]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void loadTodayGospel();
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [loadTodayGospel]);

  return {
    todayGospel,
    isLoadingGospel,
  };
}