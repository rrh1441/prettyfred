import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  const SUPABASE_URL = Deno.env.get("URL")!;
  const SUPABASE_SERVICE_ROLE = Deno.env.get("SERVICE_ROLE")!;
  const FRED_API_KEY = Deno.env.get("FRED_API_KEY")!;

  // Create client with Service Role
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

  try {
    // 1) Fetch series IDs from "economic_indicators"
    const { data: indicators, error } = await supabase
      .from("economic_indicators")
      .select("series_id");

    if (error) {
      throw new Error(`Failed to fetch series_ids: ${error.message}`);
    }
    if (!indicators || indicators.length === 0) {
      return new Response("No economic_indicators found.", { status: 200 });
    }

    console.log(
      `Found ${indicators.length} series. Processing in chunks of 20 with a 5s delay.`
    );

    // 2) Chunk size = 20
    const chunkSize = 20;

    // Loop over indicators in increments of chunkSize
    for (let i = 0; i < indicators.length; i += chunkSize) {
      const chunk = indicators.slice(i, i + chunkSize);

      // Process each series in the chunk
      for (const indicator of chunk) {
        const seriesId = indicator.series_id;
        console.log(`Fetching data for: ${seriesId}`);

        // 2a) Fetch from FRED
        const resp = await fetch(
          `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json`
        );
        const result = await resp.json();

        if (!result.observations) {
          console.log(`No observations returned for ${seriesId}, skipping.`);
          continue;
        }

        // 2b) Map observations for upsert
        const observations = result.observations.map((obs: any) => ({
          series_id: seriesId,
          date: obs.date,
          value: obs.value ? parseFloat(obs.value) : null,
        }));

        // 2c) Upsert into "fred_data"
        const { error: upsertError } = await supabase
          .from("fred_data")
          .upsert(observations, { onConflict: ["series_id", "date"] });

        if (upsertError) {
          console.error(`Error inserting ${seriesId}: ${upsertError.message}`);
        } else {
          console.log(`Inserted data for: ${seriesId}`);
        }
      }

      // 3) After each chunk, wait 5s (if not done)
      console.log(
        `Completed chunk covering indices [${i}..${i + chunk.length - 1}] of ${indicators.length}. Waiting 5s...`
      );
      if (i + chunkSize < indicators.length) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    return new Response(
      "FRED data updated successfully (chunk=20, delay=5s).",
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
});