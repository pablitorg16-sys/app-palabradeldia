"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Gospel } from "../types";
import { getLiturgicalDayByDate } from "../utils/liturgicalDays";

function getTodayDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 750;
const REQUEST_TIMEOUT_MS = 6000;

export function useTodayGospel() {
  const [todayGospel, setTodayGospel] = useState<Gospel | null>(null);
  const [isLoadingGospel, setIsLoadingGospel] = useState(true);
  const gospelRef = useRef<Gospel | null>(null);
  const activeLoadRef = useRef<Promise<void> | null>(null);

  const loadTodayGospel = useCallback(() => {
    if (activeLoadRef.current) {
      return activeLoadRef.current;
    }

    const loadPromise = (async () => {
      if (!gospelRef.current) {
        setIsLoadingGospel(true);
      }

      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const controller = new AbortController();
        const timeout = window.setTimeout(
          () => controller.abort(),
          REQUEST_TIMEOUT_MS
        );

        try {
          const gospelFromSupabase = await getLiturgicalDayByDate(
            getTodayDateKey(),
            controller.signal
          );

          if (gospelFromSupabase) {
            gospelRef.current = gospelFromSupabase;
            setTodayGospel(gospelFromSupabase);
            setIsLoadingGospel(false);
            return;
          }
        } catch (error) {
          console.warn(`Intento ${attempt + 1} fallido:`, error);
        } finally {
          window.clearTimeout(timeout);
        }

        if (attempt < MAX_ATTEMPTS - 1) {
          await new Promise((resolve) =>
            window.setTimeout(resolve, RETRY_DELAY_MS)
          );
        }
      }

      setIsLoadingGospel(false);
    })().finally(() => {
      activeLoadRef.current = null;
    });

    activeLoadRef.current = loadPromise;
    return loadPromise;
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

    function handleOnline() {
      void loadTodayGospel();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("online", handleOnline);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleOnline);
    };
  }, [loadTodayGospel]);

  return {
    todayGospel,
    isLoadingGospel,
  };
}
