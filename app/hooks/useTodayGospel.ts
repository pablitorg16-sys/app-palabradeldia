"use client";

import { useEffect, useState, useCallback } from "react";
import type { Gospel } from "../types";
import { getTodayGospel } from "../data/gospels";
import { getLiturgicalDayByDate } from "../utils/liturgicalDays";

function getTodayDateKey() {
  return new Date().toISOString().slice(0, 10);
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;
const FETCH_TIMEOUT_MS = 6_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ]);
}

export function useTodayGospel() {
  const [todayGospel, setTodayGospel] = useState<Gospel>(getTodayGospel());
  const [isLoadingGospel, setIsLoadingGospel] = useState(true);

  const loadTodayGospel = useCallback(async () => {
    setIsLoadingGospel(true);

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const gospelFromSupabase = await withTimeout(
          getLiturgicalDayByDate(getTodayDateKey()),
          FETCH_TIMEOUT_MS
        );

        if (gospelFromSupabase) {
          setTodayGospel(gospelFromSupabase);
          setIsLoadingGospel(false);
          return;
        }
      } catch (error) {
        console.warn(`Intento ${attempt + 1} fallido cargando el Evangelio:`, error);
      }

      if (attempt < MAX_RETRIES - 1) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }

    // Si todos los intentos fallan, usar el fallback local
    setIsLoadingGospel(false);
  }, []);

  useEffect(() => {
    void loadTodayGospel();
  }, [loadTodayGospel]);

  // Recargar cuando el usuario vuelve a la pestaña
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
    refreshGospel: loadTodayGospel,
  };
}