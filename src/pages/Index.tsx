// FILE: src/pages/Index.tsx

import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import EconomicChart from "@/components/EconomicChart";

// 1) Import the new hook:
import { useIndicatorData } from "@/hooks/useIndicatorData";

const Index = () => {
  // 2) Instead of generating "GDP" dummy data, let's fetch "PPIITM" from Supabase
  const {
    data: ppiRows,       // raw rows from the DB
    isLoading: ppiLoading,
    error: ppiError
  } = useIndicatorData("PPIITM");

  // 3) If the array has any rows, the first row has the "description" from economic_indicators
  const ppiDescription =
    ppiRows && ppiRows.length > 0
      ? ppiRows[0]?.economic_indicators?.description ?? "No description"
      : "Loading PPI data...";

  // 4) Transform DB rows => { date: string, value: number } for EconomicChart
  const ppiData =
    ppiRows?.map((row) => {
      const dateObj = new Date(row.date);
      // e.g. "Sep 2009"
      const shortDate = dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
      return {
        date: shortDate,
        value: row.value ?? 0,
      };
    }) ?? [];

  // -------------- Your existing dummy data for other charts --------------
  function generatePlaceholderData(points: number, baseValue: number, volatility: number) {
    const data = [];
    for (let i = 0; i < points; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - (points - i - 1));
      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        value: baseValue + Math.sin(i / 5) * volatility + Math.random() * volatility,
      });
    }
    return data;
  }
  const inflationData = generatePlaceholderData(24, 3, 0.5);
  const unemploymentData = generatePlaceholderData(24, 5, 0.3);

  // -----------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">PrettyFRED</h1>
          <p className="text-xl text-gray-600 mb-8">Beautiful Economic Data Visualization</p>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              className="bg-white hover:bg-secondary"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Sign Up
            </Button>
          </div>
        </div>

        {/* First row with info card and the PPI chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Visualize Economic Data</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-primary">Basic (Free)</h3>
                <ul className="list-disc list-inside text-gray-600 ml-4">
                  <li>Access to key economic indicators</li>
                  <li>Basic visualization options</li>
                  <li>Monthly data updates</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-primary">Premium</h3>
                <ul className="list-disc list-inside text-gray-600 ml-4">
                  <li>Advanced customization tools</li>
                  <li>Real-time data updates</li>
                  <li>Export data in multiple formats</li>
                  <li>API access</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Our "PPI" chart section */}
          {ppiLoading ? (
            <div className="flex items-center justify-center h-80">
              Loading PPI data...
            </div>
          ) : ppiError ? (
            <div className="text-red-500">
              Error fetching PPI data: {(ppiError as Error).message}
            </div>
          ) : (
            <EconomicChart
              title={ppiDescription}     // from economic_indicators
              subtitle="(PPIITM data from Supabase!)"
              data={ppiData}            // transformed array for the chart
              color="#6E59A5"
              isEditable={true}
            />
          )}

        </div>

        {/* Additional example charts with dummy data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EconomicChart
            title="Inflation Rate"
            subtitle="Monthly, Year-over-Year (placeholder)"
            data={inflationData}
            color="#9b87f5"
          />
          <EconomicChart
            title="Unemployment Rate"
            subtitle="Monthly, Seasonally Adjusted (placeholder)"
            data={unemploymentData}
            color="#7E69AB"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;