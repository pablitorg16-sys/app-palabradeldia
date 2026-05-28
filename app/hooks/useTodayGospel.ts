"use client";

import { useEffect, useState } from "react";
import type { Gospel } from "../types";
import { getTodayGospel } from "../data/gospels";
import { getLiturgicalDayByDate } from "../utils/liturgicalDays";

function getTodayDateKey() {
  return new Date().toISOString().slice(0, 10) // Para pruebas, usar la fecha de la Anunciación
}

export function useTodayGospel() {
  const [todayGospel, setTodayGospel] = useState<Gospel>(getTodayGospel());
  const [isLoadingGospel, setIsLoadingGospel] = useState(false);

  useEffect(() => {
    async function loadTodayGospel() {
      setIsLoadingGospel(true);

      const gospelFromSupabase = await getLiturgicalDayByDate(
        getTodayDateKey()
      );

      if (gospelFromSupabase) {
        setTodayGospel(gospelFromSupabase);
      }

      setIsLoadingGospel(false);
    }

    loadTodayGospel();
  }, []);

  return {
    todayGospel,
    isLoadingGospel,
  };
}