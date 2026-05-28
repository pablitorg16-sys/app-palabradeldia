import { supabase } from "../lib/supabaseClient";

export default async function TestSupabasePage() {
  const result = await supabase.from("test").select("*");

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">
        Test Supabase
      </h1>

      <pre className="mt-6 whitespace-pre-wrap">
        {JSON.stringify(result, null, 2)}
      </pre>
    </main>
  );
}