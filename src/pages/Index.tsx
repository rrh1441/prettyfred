import EconomicChart from "@/components/EconomicChart";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

// Placeholder data until Supabase integration
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EconomicChart
            title="GDP Growth Rate"
            subtitle="Quarterly, Seasonally Adjusted"
            data={gdpData}
            color="#6E59A5"
          />
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
          <EconomicChart
            title="Federal Funds Rate"
            subtitle="Daily, Effective Rate"
            data={interestRateData}
            color="#D6BCFA"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
