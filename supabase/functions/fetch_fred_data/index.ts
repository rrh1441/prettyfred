import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// This Edge Function handles all "economic_indicators" in chunks of 20.
// After each chunk, it waits 5 seconds before continuing, 
// to avoid hitting CPU/memory/time limits on your Supabase plan.

serve(async () => {
  const SUPABASE_URL = Deno.env.get("URL")!;
  const SUPABASE_SERVICE_ROLE = Deno.env.get("SERVICE_ROLE")!;
  const FRED_API_KEY = Deno.env.get("FRED_API_KEY")!;

  // Initialize Supabase client with Service Role
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

  try {
    // 1) Fetch all series IDs from "economic_indicators"
    const { data: indicators, error } = await supabase
      .from("economic_indicators")
      .select("series_id");

    if (error) throw new Error(`Failed to fetch series_ids: ${error.message}`);
    if (!indicators || indicators.length === 0) {
      return new Response("No economic_indicators found.", { status: 200 });
    }

    console.log(`Found ${indicators.length} series. Processing in chunks of 20, with a 5s delay after each chunk.`);

    // 2) Process the indicators in chunks of 20
    const chunkSize = 20;
    for (let i = 0; i < indicators.length; i += chunkSize) {
      const chunk = indicators.slice(i, i + chunkSize);

      // Loop over each indicator in this chunk
      for (const indicator of chunk) {
        const seriesId = indicator.series_id;
        console.log(`Fetching data for: ${seriesId}`);

        // 2a) Fetch data from FRED
        const resp = await fetch(
          `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json`
        );
        const result = await resp.json();

        if (!result.observations) {
          console.log(`No observations returned for ${seriesId}, skipping.`);
         