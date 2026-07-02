import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { getPassageFromReference } from "../app/utils/bible";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  // 1. Leer todas las filas
  const { data, error } = await supabase
    .from("liturgical_days")
    .select("date, gospel_reference");

  if (error || !data) {
    console.error("Error leyendo liturgical_days:", error?.message);
    process.exit(1);
  }

  console.log(`Filas encontradas: ${data.length}`);

  let updated = 0;
  const empty: { date: string; reference: string }[] = [];

  // 2. Procesar cada fila
  for (const row of data) {
    const text = await getPassageFromReference(row.gospel_reference);

    if (!text) {
      empty.push({ date: row.date, reference: row.gospel_reference });
      continue;
    }

    // 3. Actualizar SOLO gospel_text
    const { error: updateError } = await supabase
      .from("liturgical_days")
      .update({ gospel_text: text })
      .eq("date", row.date);

    if (updateError) {
      console.warn(`Error actualizando ${row.date}:`, updateError.message);
    } else {
      updated++;
      console.log(`✓ ${row.date} — ${row.gospel_reference}`);
    }
  }

  // 4. Resumen
  console.log(`\n✅ Actualizadas: ${updated} filas`);

  if (empty.length > 0) {
    console.warn(`\n⚠️  Sin texto (revisar a mano): ${empty.length}`);
    for (const e of empty) {
      console.warn(`   ${e.date}  →  ${e.reference}`);
    }
  } else {
    console.log("Todas las referencias resolvieron texto correctamente.");
  }
}

main();
