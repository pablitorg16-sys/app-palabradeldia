import { publicSupabase } from "../lib/supabaseClient";
import type { Gospel } from "../types";

type LiturgicalDayRow = {
  date: string;
  celebration: string | null;
  gospel_reference: string;
  highlight_phrase: string;
  gospel_text: string;
};

function mapLiturgicalDayToGospel(row: LiturgicalDayRow): Gospel {
  return {
    date: row.date,
    reference: row.gospel_reference,
    title: row.highlight_phrase,
    text: row.gospel_text,
    ...(row.celebration ? { celebration: row.celebration } : {}),
  };
}

export async function getLiturgicalDayByDate(
  date: string,
  signal?: AbortSignal
): Promise<Gospel | null> {
  let query = publicSupabase
    .from("liturgical_days")
    .select("date, celebration, gospel_reference, highlight_phrase, gospel_text")
    .eq("date", date);

  if (signal) {
    query = query.abortSignal(signal);
  }

  const { data, error } = await query.maybeSingle();

  if (error || !data) {
    console.error("Error loading liturgical day:", error);
    return null;
  }

  return mapLiturgicalDayToGospel(data as LiturgicalDayRow);
}

export async function getLiturgicalDaysByDates(
  dates: string[]
): Promise<Gospel[]> {
  if (dates.length === 0) return [];

  const uniqueDates = Array.from(new Set(dates));

  const { data, error } = await publicSupabase
    .from("liturgical_days")
    .select("date, celebration, gospel_reference, highlight_phrase, gospel_text")
    .in("date", uniqueDates);

  if (error || !data) {
    console.error("Error loading liturgical days:", error);
    return [];
  }

  return (data as LiturgicalDayRow[]).map(mapLiturgicalDayToGospel);
}
