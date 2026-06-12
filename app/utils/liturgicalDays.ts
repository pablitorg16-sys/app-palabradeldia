import { supabase } from "../lib/supabaseClient";
import type { Gospel } from "../types";
import { getPassageFromReference } from "./bible";

const BIBLE_IMPORT_TIMEOUT_MS = 4_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ]);
}

type LiturgicalDayRow = {
  date: string;
  celebration: string | null;
  gospel_reference: string;
  highlight_phrase: string;
  gospel_text: string;
};

async function mapLiturgicalDayToGospel(row: LiturgicalDayRow): Promise<Gospel> {
  let text = "";
  try {
    text = await withTimeout(
      getPassageFromReference(row.gospel_reference),
      BIBLE_IMPORT_TIMEOUT_MS
    );
  } catch {
    // Dynamic import timed out or failed — fall through to row.gospel_text
  }

  return {
    date: row.date,
    reference: row.gospel_reference,
    title: row.highlight_phrase,
    text: text || row.gospel_text,
  };
}

export async function getLiturgicalDayByDate(
  date: string
): Promise<Gospel | null> {
  const { data, error } = await supabase
    .from("liturgical_days")
    .select("date, celebration, gospel_reference, highlight_phrase, gospel_text")
    .eq("date", date)
    .maybeSingle();

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

  const { data, error } = await supabase
    .from("liturgical_days")
    .select("date, celebration, gospel_reference, highlight_phrase, gospel_text")
    .in("date", uniqueDates);

  if (error || !data) {
    console.error("Error loading liturgical days:", error);
    return [];
  }

  return Promise.all((data as LiturgicalDayRow[]).map(mapLiturgicalDayToGospel));
}