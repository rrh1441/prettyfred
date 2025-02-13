import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  const SUPABASE_URL = Deno.env.get("URL")!;
  const SUPABASE_SERVICE_ROLE = Deno.env.get("SERVICE_ROLE")!;
  const FRED_API_KEY = Deno.env.get("FRED_API_KEY")!;

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

  try {
    // Fetch all series_id from Supabase
    const { data: indicators, error } = await supabase
      .from("economic_indicators")
      .select("series_id");

    if (error) throw new Error(`Failed to fetch series_ids: ${error.message}`);

    for (const indicator of indicators) {
      const seriesId = indicator.series_id;
      console.log(`Fetching data for: ${seriesId}`);

      // Fetch data from FRED API
      const response = await fetch(
        `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json`
      );

      const result = await response.json();
      if (!result.observations) continue;

      const observations = result.observations.map((obs: any) => ({
        series_id: seriesId,
        date: obs.date,
        value: obs.value ? parseFloat(obs.value) : null,
      }));

      // Upsert data into Supabase
      const { error: insertError } = await supabase
        .from("fred_data")
        .upsert(observations, { onConflict: ["series_id", "date"] });

      if (insertError) {
        console.error(`Error inserting ${seriesId}: ${insertError.message}`);
      } else {
        console.log(`Successfully inserted data for: ${seriesId}`);
      }
    }

    return new Response("FRED Data Updated Successfully", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
});