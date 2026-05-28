import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { liturgicalCalendar2026 } from "../app/data/liturgicalCalendar2026";
import { getPassageFromReference } from "../app/utils/bible";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const liturgicalDays = liturgicalCalendar2026.map((day) => {
    const gospelText = getPassageFromReference(day.gospel_reference);

    if (!gospelText) {
      console.warn(
        `Sin texto para ${day.date} - ${day.gospel_reference}`
      );
    }

    return {
      ...day,
      gospel_text: gospelText,
    };
  });

  console.log(`Importing ${liturgicalDays.length} liturgical days...`);

  const { error } = await supabase
    .from("liturgical_days")
    .upsert(liturgicalDays, {
      onConflict: "date",
    });

  if (error) {
    console.error("Import failed:", error.message);
    process.exit(1);
  }

  console.log("Import completed successfully.");
}

main();