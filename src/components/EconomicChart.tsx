import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  date: string;
  value: number;
}

interface EconomicChartProps {
  title: string;
  subtitle: string;
  data: DataPoint[];
  color?: string;
}

const EconomicChart = ({ title, subtitle, data, color = "#6E59A5" }: EconomicChartProps) => {
  return (
    <Card className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <p className="chart-subtitle">{subtitle}</p>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#666' }}
              tickLine={{ stroke: '#666' }}
            />
            <YAxis 
              tick={{ fill: '#666' }}
              tickLine={{ stroke: '#666' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default EconomicChart;