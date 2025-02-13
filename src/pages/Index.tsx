import EconomicChart from "@/components/EconomicChart";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";

// Placeholder data until Supabase  integration asdgadsgad
const generatePlaceholderData = (points: number, baseValue: number, volatility: number) => {
  const data = [];
  for (let i = 0; i < points; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (points - i - 1));
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      value: baseValue + Math.sin(i / 5) * volatility + Math.random() * volatility,
    });
  }
  return data;
};
// Placeholder data until Supabase  integration asdgadsgad
const gdpData = generatePlaceholderData(24, 20000, 500);
const inflationData = generatePlaceholderData(24, 3, 0.5);
const unemploymentData = generatePlaceholderData(24, 5, 0.3);
const interestRateData = generatePlaceholderData(24, 4, 0.2);

const Index = () => {
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

        {/* First row with info and editable chart */}
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
          <EconomicChart
            title="Interactive GDP Chart"
            subtitle="Try our interactive features"
            data={gdpData}
            color="#6E59A5"
            isEditable={true}
          />
        </div>

        {/* Additional charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EconomicChart
            title="Inflation Rate"
            subtitle="Monthly, Year-over-Year"
            data={inflationData}
            color="#9b87f5"
          />
          <EconomicChart
            title="Unemployment Rate"
            subtitle="Monthly, Seasonally Adjusted"
            data={unemploymentData}
            color="#7E69AB"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
