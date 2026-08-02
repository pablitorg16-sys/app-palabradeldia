import { supabase } from "../lib/supabaseClient";

export type Saint = {
  name: string;
  role: string;
  birthYear: string | null;
  birthPlace: string | null;
  deathYear: string | null;
  deathPlace: string | null;
  summary: string;
};

type SaintOfDayRow = {
  date: string;
  name: string;
  role: string;
  birth_year: string | null;
  birth_place: string | null;
  death_year: string | null;
  death_place: string | null;
  summary: string;
  order_index: number;
};

function mapRowToSaint(row: SaintOfDayRow): Saint {
  return {
    name: row.name,
    role: row.role,
    birthYear: row.birth_year,
    birthPlace: row.birth_place,
    deathYear: row.death_year,
    deathPlace: row.death_place,
    summary: row.summary,
  };
}

// Une año y lugar en un bloque tipo "1811, Isère (Francia)".
// Si falta uno de los dos, muestra solo el que existe. Si no hay ninguno, null.
function buildDatePlaceBlock(year: string | null, place: string | null): string | null {
  if (year && place) return `${year}, ${place}`;
  if (year) return year;
  if (place) return place;
  return null;
}

// Combina nacimiento y muerte con " - " solo si ambos existen.
// Si solo hay uno, se muestra ese solo, sin guion colgando.
// Si no hay ningún dato, devuelve null (no se renderiza ninguna línea).
export function formatSaintDates(saint: Saint): string | null {
  const birthBlock = buildDatePlaceBlock(saint.birthYear, saint.birthPlace);
  const deathBlock = buildDatePlaceBlock(saint.deathYear, saint.deathPlace);

  if (birthBlock && deathBlock) return `${birthBlock} - ${deathBlock}`;
  if (birthBlock) return birthBlock;
  if (deathBlock) return deathBlock;
  return null;
}

export async function getSaintsByDate(date: string): Promise<Saint[]> {
  const { data, error } = await supabase
    .from("saints_of_day")
    .select("date, name, role, birth_year, birth_place, death_year, death_place, summary, order_index")
    .eq("date", date)
    .order("order_index", { ascending: true });

  if (error || !data) {
    if (error) console.error("Error loading saints of day:", error);
    return [];
  }

  return (data as SaintOfDayRow[]).map(mapRowToSaint);
}
