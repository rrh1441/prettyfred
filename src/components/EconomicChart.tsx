
import { Card } from "@/components/ui/card";
import { ResponsiveLine } from '@nivo/line';
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "./ui/input";

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
  const [chartColor, setChartColor] = useState(color);
  const [yMin, setYMin] = useState<string>('auto');
  const [yMax, setYMax] = useState<string>('auto');
  const [startDate, setStartDate] = useState<number>(0);
  const [endDate, setEndDate] = useState<number>(data.length);

  // Filter data based on date range
  const filteredData = data.slice(startDate, endDate);

  // Transform data for Nivo format
  const transformedData = [{
    id: title,
    color: chartColor,
    data: filteredData.map(d => ({
      x: d.date,
      y: d.value
    }))
  }];

  return (
    <Card className={`p-4 ${isEditable ? 'border-primary' : ''}`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{subtitle}</p>
      {isEditable && (
        <div className="space-y-4 mb-4">
          <div className="flex gap-4 items-center">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Color</label>
              <Input
                type="color"
                value={chartColor}
                onChange={(e) => setChartColor(e.target.value)}
                className="w-20 h-8"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Y-Axis Range</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Min"
                  value={yMin}
                  onChange={(e) => setYMin(e.target.value)}
                  className="w-24"
                />
                <Input
                  type="text"
                  placeholder="Max"
                  value={yMax}
                  onChange={(e) => setYMax(e.target.value)}
                  className="w-24"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Date Range</label>
            <div className="flex gap-2">
              <Input
                type="range"
                min={0}
                max={data.length - 1}
                value={startDate}
                onChange={(e) => setStartDate(Number(e.target.value))}
                className="w-full"
              />
              <Input
                type="range"
                min={startDate + 1}
                max={data.length}
                value={endDate}
                onChange={(e) => setEndDate(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>{filteredData[0]?.date}</span>
              <span>{filteredData[filteredData.length - 1]?.date}</span>
            </div>
          </div>
        </div>
      )}
      <div className="h-[300px] w-full">
        <ResponsiveLine
          data={transformedData}
          margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: yMin === 'auto' ? 'auto' : Number(yMin),
            max: yMax === 'auto' ? 'auto' : Number(yMax),
            stacked: false,
            reverse: false
          }}
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
          enableArea={true}
          areaOpacity={0.1}
          colors={[chartColor]}
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
