
import { Card } from "@/components/ui/card";
import { ResponsiveLine } from '@nivo/line';

interface DataPoint {
  date: string;
  value: number;
}

interface EconomicChartProps {
  title: string;
  subtitle: string;
  data: DataPoint[];
  color?: string;
  isEditable?: boolean;
}

const EconomicChart = ({ title, subtitle, data, color = "#6E59A5", isEditable = false }: EconomicChartProps) => {
  // Transform data for Nivo format
  const transformedData = [{
    id: title,
    color: color,
    data: data.map(d => ({
      x: d.date,
      y: d.value
    }))
  }];

  return (
    <Card className={`chart-container ${isEditable ? 'border-primary' : ''}`}>
      <h3 className="chart-title">{title}</h3>
      <p className="chart-subtitle">{subtitle}</p>
      <div className="h-[300px] w-full">
        <ResponsiveLine
          data={transformedData}
          margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
          curve="natural"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: 'Date',
            legendOffset: 40,
            legendPosition: 'middle'
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Value',
            legendOffset: -40,
            legendPosition: 'middle'
          }}
          pointSize={0}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          enableSlices="x"
          enableArea={true}
          areaOpacity={0.1}
          colors={[color]}
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: '#666'
                }
              },
              legend: {
                text: {
                  fill: '#666'
                }
              }
            }
          }}
        />
      </div>
    </Card>
  );
};

export default EconomicChart;
