
import { Card } from "@/components/ui/card";
import { ResponsiveLine } from '@nivo/line';
import { Button } from "@/components/ui/button";
import { useState } from "react";

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

const EconomicChart = ({ title, subtitle, data: initialData, color = "#6E59A5", isEditable = false }: EconomicChartProps) => {
  const [data, setData] = useState(initialData);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);

  const handleClick = (point: any, event: any) => {
    if (!isEditable) return;
    
    const index = data.findIndex(d => d.date === point.data.x);
    setSelectedPoint(index);
  };

  const adjustValue = (amount: number) => {
    if (selectedPoint === null) return;
    
    setData(prevData => {
      const newData = [...prevData];
      newData[selectedPoint] = {
        ...newData[selectedPoint],
        value: newData[selectedPoint].value + amount
      };
      return newData;
    });
  };

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
    <Card className={`p-4 ${isEditable ? 'border-primary' : ''}`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{subtitle}</p>
      {isEditable && selectedPoint !== null && (
        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustValue(-100)}
          >
            -100
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustValue(-10)}
          >
            -10
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustValue(10)}
          >
            +10
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustValue(100)}
          >
            +100
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedPoint(null)}
          >
            Done
          </Button>
        </div>
      )}
      {isEditable && selectedPoint === null && (
        <p className="text-sm text-muted-foreground mb-4">
          Click any point on the chart to edit its value
        </p>
      )}
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
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          enableSlices={false}
          useMesh={true}
          onClick={handleClick}
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
