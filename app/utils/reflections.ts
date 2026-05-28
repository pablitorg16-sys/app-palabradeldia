import { supabase } from "../lib/supabaseClient";
import type { DiaryEntry, DiaryEntrySource, ReflectionTag } from "../types";

type ReflectionRow = {
  id: string | number;
  text: string;
  created_at: string;
  gospel_date: string;
  gospel_reference: string;
  shared: boolean;
  favorite: boolean;
  tags: ReflectionTag[] | null;
  source: DiaryEntrySource;
  original_author: string | null;
};

function mapRowToDiaryEntry(row: ReflectionRow): DiaryEntry {
  const createdAt = new Date(row.created_at);

  return {
    id: row.id,
    text: row.text,
    date: createdAt.toLocaleDateString("es-ES"),
    time: createdAt.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    gospelDate: row.gospel_date,
    gospelReference: row.gospel_reference,
    gospelLink: "#evangelio-de-hoy",
    shared: row.shared,
    favorite: row.favorite,
    likes: 0,
    tags: row.tags ?? [],
    source: row.source,
    originalAuthor: row.original_author ?? undefined,
  };
}

export async function insertReflection(entry: DiaryEntry, userId: string) {
  const { data, error } = await supabase
    .from("reflections")
    .insert({
      user_id: userId,
      text: entry.text,
      gospel_date: entry.gospelDate,
      gospel_reference: entry.gospelReference,
      shared: entry.shared,
      favorite: entry.favorite,
      tags: entry.tags,
      source: entry.source,
      original_author: entry.originalAuthor ?? null,
    })
    .select("*")
    .single();

  return {
    entry: data ? mapRowToDiaryEntry(data) : null,
    error,
  };
}

export async function getUserReflections(userId: string) {
  const { data, error } = await supabase
    .from("reflections")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return { entries: [], error };
  }

  const entries = await Promise.all(
    data.map(async (row) => {
      const entry = mapRowToDiaryEntry(row);
const { count, error } = await supabase
  .from("reflection_likes")
  .select("*", { count: "exact", head: true })
  .eq("reflection_id", row.id);

if (error) {
  console.error("Error loading reflection likes count:", error.message);
}

return {
  ...entry,
  likes: count ?? 0,
};
    })
  );

  return {
    entries,
    error: null,
  };
}

export async function updateReflection(
  id: string | number,
  userId: string,
  updates: Partial<DiaryEntry>
) {
  const supabaseUpdates: Record<string, unknown> = {};

  if (updates.shared !== undefined) supabaseUpdates.shared = updates.shared;
  if (updates.favorite !== undefined) supabaseUpdates.favorite = updates.favorite;
  if (updates.text !== undefined) supabaseUpdates.text = updates.text;
  if (updates.tags !== undefined) supabaseUpdates.tags = updates.tags;

  const { data, error } = await supabase
    .from("reflections")
    .update(supabaseUpdates)
    .eq("id", id)
    .eq("user_id", userId)
    .select("*");

  return { data, error };
}

export async function deleteReflection(id: string | number, userId: string) {
  const { data, error } = await supabase
    .from("reflections")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select("*");

  return { data, error };  
}

export async function reflectionExists(
  userId: string,
  text: string,
  gospelDate: string
) {
  const { data } = await supabase
    .from("reflections")
    .select("id")
    .eq("user_id", userId)
    .eq("text", text)
    .eq("gospel_date", gospelDate)
    .maybeSingle();

  return !!data;
}