// FILE: src/hooks/useIndicatorData.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

/**
 * This function runs a single join query:
 *   SELECT
 *     series_id,
 *     date,
 *     value,
 *     economic_indicators!inner(description)
 *   FROM fred_data
 *   WHERE series_id = <seriesId>
 */
async function fetchIndicatorData(seriesId: string) {
  // `.select()` references your foreign key relationship
  //   "economic_indicators" so we can fetch its "description" field
  const { data, error } = await supabase
    .from("fred_data")
    .select(`
      series_id,
      date,
      value,
      economic_indicators!inner (
        description
      )
    `)
    .eq("series_id", seriesId)
    .order("date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data || [];
}

/**
 * React Query hook that fetches from "fred_data" & "economic_indicators"
 */
export function useIndicatorData(seriesId: string) {
  // Return the usual { data, isLoading, error, ... }
  return useQuery(["indicatorData", seriesId], () => fetchIndicatorData(seriesId));
}