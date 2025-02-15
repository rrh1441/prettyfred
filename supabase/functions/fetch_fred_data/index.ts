import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  const SUPABASE_URL = Deno.env.get("URL")!;
  const SUPABASE_SERVICE_ROLE = Deno.env.get("SERVICE_ROLE")!;
  const FRED_API_KEY = Deno.env.get("FRED_API_KEY")!;

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

  try {
    // 1) Load the current offset from function_state
    const { data: stateData, error: stateErr } = await supabase
      .from("function_state")
      .select("next_offset")
      .eq("name", "fetch_fred_data_offset")
      .single();

    if (stateErr || !stateData) {
      throw new Error(`Could not load offset state: ${stateErr?.message || "No row found"}`);
    }

    let currentOffset = stateData.next_offset ?? 0;
    console.log(`Current offset is ${currentOffset}.`);

    // We'll process 20 indicators at a time.
    const batchSize = 20;

    // 2) Fetch a subset of economic_indicators from currentOffset
    const { data: indicators, error: indErr } = await supabase
      .from("economic_indicators")
      .select("series_id")
      // range(a, b) picks rows from a..b inclusive. So offset..offset+batchSize-1
      .range(currentOffset, currentOffset + batchSize - 1);

    if (indErr) {
      throw new Error(`Failed to fetch indicators: ${indErr.message}`);
    }
    if (!indicators || indicators.length === 0) {
      // no more indicators left
      return new Response(
        "No more economic_indicators left to process.",
        { status: 200 }
      );
    }

    console.log(
      `Fetched ${indicators.length} indicators for this invocation (offset ${currentOffset}..${currentOffset + indicators.length - 1}).`
    );

    // 3) Loop over each indicator in this batch
    for (const indicator of indicators) {
      const seriesId = indicator.series_id;
      console.log(`Fetching data for series ID: ${seriesId}`);

      // 3a) Fetch from FRED
      const response = await fetch(
        `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json`
      );
      const result = await response.json();
      if (!result.observations) {
        console.log(`No observations for ${seriesId}, skipping.`);
        continue;
      }

      // 3b) Map observations for upsert
      const observations = result.observations.map((obs: any) => ({
        series_id: seriesId,
        date: obs.date,
        value: obs.value ? parseFloat(obs.value) : null,
      }));

      // 3c) Upsert into fred_data
      const { error: upsertErr } = await supabase
        .from("fred_data")
        .upsert(observations, { onConflict: ["series_id", "date"] });

      if (upsertErr) {
        console.error(`Error inserting ${seriesId}: ${upsertErr.message}`);
      } else {
        console.log(`Successfully inserted data for: ${seriesId}`);
      }
    }

    // 4) Increment the offset by however many we processed
    const newOffset = currentOffset + indicators.length;
    console.log(`Processed ${indicators.length} series, new offset = ${newOffset}.`);

    const { error: updateErr } = await supabase
      .from("function_state")
      .update({ next_offset: newOffset })
      .eq("name", "fetch_fred_data_offset");

    if (updateErr) {
      console.error(`Error updating offset state: ${updateErr.message}`);
    }

    // 5) Return a message with details
    return new Response(
      `Fetched ${indicators.length} indicators (offset ${currentOffset}..${
        currentOffset + indicators.length - 1
      }). Next offset = ${newOffset}.`,
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
});
