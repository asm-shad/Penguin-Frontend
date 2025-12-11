/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/product-management/components/PriceDistributionChart.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface PriceDistribution {
  range: string;
  count: number;
  percentage: number;
}

interface PriceDistributionChartProps {
  data?: PriceDistribution[];
}

// Define CustomTooltip outside the main component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload as PriceDistribution;
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg cursor-default">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-600">
          Products: {payload[0].value}
        </p>
        <p className="text-sm text-gray-600">
          Percentage: {data?.percentage || 0}%
        </p>
      </div>
    );
  }
  return null;
};

const PriceDistributionChart = ({ data }: PriceDistributionChartProps) => {
  const defaultData: PriceDistribution[] = [
    { range: "$0 - $50", count: 0, percentage: 0 },
    { range: "$50 - $100", count: 0, percentage: 0 },
    { range: "$100 - $200", count: 0, percentage: 0 },
    { range: "$200 - $500", count: 0, percentage: 0 },
    { range: "$500+", count: 0, percentage: 0 },
  ];

  const chartData = data || defaultData;

  const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

  return (
    <Card className="cursor-default"> {/* Add cursor-default here */}
      <CardHeader>
        <CardTitle>Price Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              style={{ cursor: 'default' }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="range" 
                angle={-45}
                textAnchor="end"
                height={60}
                fontSize={12}
              />
              <YAxis />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'transparent' }}
              />
              <Bar 
                dataKey="count" 
                name="Products"
                cursor="default"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    cursor="default"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Price Distribution Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4 cursor-default"> {/* Add cursor-default */}
          {chartData.map((item, index) => (
            <div key={item.range} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-xs font-medium">{item.range}</span>
              </div>
              <p className="text-lg font-bold">{item.count}</p>
              <p className="text-xs text-gray-500">{item.percentage}% of total</p>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t cursor-default"> {/* Add cursor-default */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Most Common Price Range</p>
              <p className="font-bold">
                {chartData.reduce((max, item) => item.count > max.count ? item : max, chartData[0]).range}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Total Products in Chart</p>
              <p className="font-bold">
                {chartData.reduce((sum, item) => sum + item.count, 0)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceDistributionChart;