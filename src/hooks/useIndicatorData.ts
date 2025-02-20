
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

interface IndicatorData {
  series_id: string;
  date: string;
  value: number;
  economic_indicators: {
    description: string;
  };
}

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
async function fetchIndicatorData(seriesId: string): Promise<IndicatorData[]> {
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
  return data as IndicatorData[];
}

/**
 * React Query hook that fetches from "fred_data" & "economic_indicators"
 */
export function useIndicatorData(seriesId: string) {
  return useQuery({
    queryKey: ["indicatorData", seriesId],
    queryFn: () => fetchIndicatorData(seriesId)
  });
}
