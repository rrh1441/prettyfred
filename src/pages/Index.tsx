// FILE: src/pages/Index.tsx

import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import EconomicChart from "@/components/EconomicChart";
import { useIndicatorData } from "@/hooks/useIndicatorData";

/**
 * A helper to transform DB rows into { date: string, value: number }
 * plus a 'description' for the chart title.
 */
function transformIndicatorData(rows: any[] | undefined) {
  if (!rows || rows.length === 0) {
    return {
      data: [],
      description: "Loading...",
    };
  }
  const description = rows[0]?.economic_indicators?.description ?? "No description";
  const data = rows.map((row) => {
    const dateObj = new Date(row.date);
    const dateLabel = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
    return {
      date: dateLabel,
      value: row.value ?? 0,
    };
  });
  return { data, description };
}

const Index = () => {
  //
  // 1) Fetch "GDPC1" for the top chart
  //
  const {
    data: gdpc1Rows,
    isLoading: gdpc1Loading,
    error: gdpc1Error,
  } = useIndicatorData("GDPC1");
  const gdpc1 = transformIndicatorData(gdpc1Rows);

  //
  // 2) Fetch the other 8 series (uneditable)
  //
  const {
    data: gdpRows,
    isLoading: gdpLoading,
    error: gdpError,
  } = useIndicatorData("GDP");
  const gdp = transformIndicatorData(gdpRows);

  const {
    data: unrateRows,
    isLoading: unrateLoading,
    error: unrateError,
  } = useIndicatorData("UNRATE");
  const unrate = transformIndicatorData(unrateRows);

  const {
    data: cpiaucslRows,
    isLoading: cpiaucslLoading,
    error: cpiaucslError,
  } = useIndicatorData("CPIAUCSL");
  const cpiaucsl = transformIndicatorData(cpiaucslRows);

  const {
    data: fedfundsRows,
    isLoading: fedfundsLoading,
    error: fedfundsError,
  } = useIndicatorData("FEDFUNDS");
  const fedfunds = transformIndicatorData(fedfundsRows);

  const {
    data: gs10Rows,
    isLoading: gs10Loading,
    error: gs10Error,
  } = useIndicatorData("GS10");
  const gs10 = transformIndicatorData(gs10Rows);

  const {
    data: payemsRows,
    isLoading: payemsLoading,
    error: payemsError,
  } = useIndicatorData("PAYEMS");
  const payems = transformIndicatorData(payemsRows);

  const {
    data: m2slRows,
    isLoading: m2slLoading,
    error: m2slError,
  } = useIndicatorData("M2SL");
  const m2sl = transformIndicatorData(m2slRows);

  const {
    data: m2vRows,
    isLoading: m2vLoading,
    error: m2vError,
  } = useIndicatorData("M2V");
  const m2v = transformIndicatorData(m2vRows);

  // Just a quick check for top chart loading / error
  // (or you can show partial charts if the others fail)
  if (gdpc1Loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading Real GDP data (GDPC1)...</p>
      </div>
    );
  }
  if (gdpc1Error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600">
          Error loading Real GDP (GDPC1): {(gdpc1Error as Error).message}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Top heading / sign in / sign up */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">PrettyFRED</h1>
          <p className="text-xl text-gray-600 mb-8">
            Beautiful Economic Data Visualization
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" className="bg-white hover:bg-secondary">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Sign Up
            </Button>
          </div>
        </div>

        {/* Row with info card on left and top chart on right */}
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

          {/* GDPC1 chart (editable) */}
          <EconomicChart
            title={gdpc1.description}
            subtitle="(Real Gross Domestic Product)"
            data={gdpc1.data}
            color="#6E59A5"
            isEditable
          />
        </div>

        {/* The next 8 series, displayed in rows of two (uneditable) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 1) GDP */}
          {gdpLoading ? (
            <div className="flex items-center justify-center h-80">
              Loading GDP...
            </div>
          ) : gdpError ? (
            <div className="text-red-500">
              Error: {(gdpError as Error).message}
            </div>
          ) : (
            <EconomicChart
              title={gdp.description}
              subtitle="(Gross Domestic Product)"
              data={gdp.data}
              color="#7E69AB"
              isEditable={false}
            />
          )}

          {/* 2) UNRATE */}
          {unrateLoading ? (
            <div className="flex items-center justify-center h-80">
              Loading UNRATE...
            </div>
          ) : unrateError ? (
            <div className="text-red-500">
              Error: {(unrateError as Error).message}
            </div>
          ) : (
            <EconomicChart
              title={unrate.description}
              subtitle="(Civilian Unemployment Rate)"
              data={unrate.data}
              color="#9b87f5"
              isEditable={false}
            />
          )}

          {/* 3) CPIAUCSL */}
          {cpiaucslLoading ? (
            <div className="flex items-center justify-center h-80">
              Loading CPIAUCSL...
            </div>
          ) : cpiaucslError ? (
            <div className="text-red-500">
              Error: {(cpiaucslError as Error).message}
            </div>
          ) : (
            <EconomicChart
              title={cpiaucsl.description}
              subtitle="(Consumer Price Index for All Urban Consumers: All Items)"
              data={cpiaucsl.data}
              color="#808000"
              isEditable={false}
            />
          )}

          {/* 4) FEDFUNDS */}
          {fedfundsLoading ? (
            <div className="flex items-center justify-center h-80">
              Loading FEDFUNDS...
            </div>
          ) : fedfundsError ? (
            <div className="text-red-500">
              Error: {(fedfundsError as Error).message}
            </div>
          ) : (
            <EconomicChart
              title={fedfunds.description}
              subtitle="(Effective Federal Funds Rate)"
              data={fedfunds.data}
              color="#696969"
              isEditable={false}
            />
          )}

          {/* 5) GS10 */}
          {gs10Loading ? (
            <div className="flex items-center justify-center h-80">
              Loading GS10...
            </div>
          ) : gs10Error ? (
            <div className="text-red-500">
              Error: {(gs10Error as Error).message}
            </div>
          ) : (
            <EconomicChart
              title={gs10.description}
              subtitle="(10-Year Treasury Constant Maturity Rate)"
              data={gs10.data}
              color="#dc4c64"
              isEditable={false}
            />
          )}

          {/* 6) PAYEMS */}
          {payemsLoading ? (
            <div className="flex items-center justify-center h-80">
              Loading PAYEMS...
            </div>
          ) : payemsError ? (
            <div className="text-red-500">
              Error: {(payemsError as Error).message}
            </div>
          ) : (
            <EconomicChart
              title={payems.description}
              subtitle="(All Employees: Total Nonfarm Payrolls)"
              data={payems.data}
              color="#8884d8"
              isEditable={false}
            />
          )}

          {/* 7) M2SL */}
          {m2slLoading ? (
            <div className="flex items-center justify-center h-80">
              Loading M2SL...
            </div>
          ) : m2slError ? (
            <div className="text-red-500">
              Error: {(m2slError as Error).message}
            </div>
          ) : (
            <EconomicChart
              title={m2sl.description}
              subtitle="(M2 Money Stock - Discontinued)"
              data={m2sl.data}
              color="#3CB371"
              isEditable={false}
            />
          )}

          {/* 8) M2V */}
          {m2vLoading ? (
            <div className="flex items-center justify-center h-80">
              Loading M2V...
            </div>
          ) : m2vError ? (
            <div className="text-red-500">
              Error: {(m2vError as Error).message}
            </div>
          ) : (
            <EconomicChart
              title={m2v.description}
              subtitle="(Velocity of M2 Money Stock)"
              data={m2v.data}
              color="#6E59A5"
              isEditable={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;