// FILE: src/hooks/useFredData.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

// A plain fetch function that returns rows from the "fred_data" table
// filtered by a given `seriesId`.
async function fetchFredData(seriesId: string) {
  const { data, error } = await supabase
    .from("fred_data")
    .select("*")
    .eq("series_id", seriesId)
    .order("date", { ascending: true }); // example: sort ascending by date

  if (error) {
    throw new Error(error.message);
  }
  return data || [];
}

// The React Query hook
export function useFredData(seriesId: string) {
  return useQuery({
    queryKey: ["fred_data", seriesId],
    queryFn: () => fetchFredData(seriesId),
    // optional: specify staleTime, refetch, etc.
  });
}