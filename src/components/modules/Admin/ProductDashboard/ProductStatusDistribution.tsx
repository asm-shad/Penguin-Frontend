/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/product-management/components/ProductStatusDistribution.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ProductStatusDistributionProps {
  data?: {
    NEW: number;
    HOT: number;
    SALE: number;
    OUT_OF_STOCK: number;
    DISCONTINUED: number;
  };
}

// Recharts expects data with string index signature
interface PieChartData {
  [key: string]: string | number;
  name: string;
  value: number;
  percentage: number;
}

// Define CustomTooltip outside the main component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload as PieChartData;
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg cursor-default"> {/* Add cursor-default */}
        <p className="font-medium">{data?.name}</p>
        <p className="text-sm text-gray-600">
          Products: {data?.value}
        </p>
        <p className="text-sm text-gray-600">
          Percentage: {data?.percentage}%
        </p>
      </div>
    );
  }
  return null;
};

// Custom label renderer
const renderCustomizedLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs"
      style={{ cursor: 'default' }}
    >
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ProductStatusDistribution = ({ data }: ProductStatusDistributionProps) => {
  const defaultData = {
    NEW: 0,
    HOT: 0,
    SALE: 0,
    OUT_OF_STOCK: 0,
    DISCONTINUED: 0,
  };

  const distribution = data || defaultData;

  // Create chart data with proper index signature
  const chartData: PieChartData[] = Object.entries(distribution)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => {
      const percentage = Math.round((value / Object.values(distribution).reduce((a, b) => a + b, 0)) * 100);
      return {
        name: name.replace('_', ' '),
        value,
        percentage,
        // Additional properties can be added here if needed
        id: name.toLowerCase(),
      } as PieChartData;
    });

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <Card className="cursor-default"> {/* Add cursor-default */}
      <CardHeader>
        <CardTitle>Product Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart style={{ cursor: 'default' }}> {/* Add this */}
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                cursor="default"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    cursor="default"
                  />
                ))}
              </Pie>
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'transparent' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4 cursor-default"> {/* Add cursor-default */}
          {chartData.map((item, index) => (
            <div key={item.name} className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index], cursor: 'default' }}
                />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <p className="text-lg font-bold">{item.value}</p>
              <p className="text-xs text-gray-500">{item.percentage}%</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductStatusDistribution;