// app/(dashboard)/product-management/components/StockOverview.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Package } from "lucide-react";

interface StockOverviewProps {
  data?: {
    totalStock: number;
    averageStock: number;
    lowStockThreshold: number;
    productsBelowThreshold: number;
  };
}

const StockOverview = ({ data }: StockOverviewProps) => {
  const defaultData = {
    totalStock: 0,
    averageStock: 0,
    lowStockThreshold: 10,
    productsBelowThreshold: 0,
  };

  const stockData = data || defaultData;
  const stockHealth = stockData.productsBelowThreshold === 0 ? "Healthy" : "Needs Attention";
  const healthColor = stockHealth === "Healthy" ? "text-green-600" : "text-yellow-600";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Stock */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Total Stock</span>
            </div>
            <span className="text-2xl font-bold">{stockData.totalStock.toLocaleString()}</span>
          </div>
          <Progress value={Math.min(stockData.totalStock / 1000 * 100, 100)} className="h-2" />
        </div>

        {/* Average Stock */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Average Stock per Product</span>
            <span className="text-lg font-semibold">{Math.round(stockData.averageStock)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span>50</span>
            <span>100</span>
            <span>150</span>
            <span>200+</span>
          </div>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-200 text-blue-800">
                  Average
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div
                style={{ width: `${Math.min(stockData.averageStock, 200) / 2}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className={`p-4 rounded-lg ${stockData.productsBelowThreshold > 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {stockData.productsBelowThreshold > 0 ? (
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              ) : (
                <CheckCircle className="h-6 w-6 text-green-600" />
              )}
              <div>
                <p className="font-medium">Low Stock Products</p>
                <p className="text-sm text-gray-600">
                  Below {stockData.lowStockThreshold} units
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${stockData.productsBelowThreshold > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                {stockData.productsBelowThreshold}
              </p>
              <p className={`text-xs ${healthColor}`}>{stockHealth}</p>
            </div>
          </div>
          {stockData.productsBelowThreshold > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Low Stock Level</span>
                <span>{stockData.productsBelowThreshold} products</span>
              </div>
              <Progress 
                value={(stockData.productsBelowThreshold / 50) * 100} 
                className="h-2 bg-yellow-200 [&>div]:bg-yellow-600" 
              />
            </div>
          )}
        </div>

        {/* Stock Distribution Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Stock Turnover</p>
            <p className="text-lg font-bold">2.4x</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Restock Needed</p>
            <p className="text-lg font-bold">{stockData.productsBelowThreshold}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockOverview;