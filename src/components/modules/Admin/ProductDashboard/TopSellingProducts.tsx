// app/(dashboard)/product-management/components/TopSellingProducts.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  stock: number;
  status: string;
}

interface TopSellingProductsProps {
  data?: TopProduct[];
  limit?: number;
}

const TopSellingProducts = ({ data = [], limit = 5 }: TopSellingProductsProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      NEW: { color: "bg-blue-100 text-blue-800", label: "New" },
      HOT: { color: "bg-red-100 text-red-800", label: "Hot" },
      SALE: { color: "bg-green-100 text-green-800", label: "Sale" },
      OUT_OF_STOCK: { color: "bg-gray-100 text-gray-800", label: "Out of Stock" },
      DISCONTINUED: { color: "bg-gray-100 text-gray-800", label: "Discontinued" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { color: "bg-gray-100", label: status };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getTrendIcon = (index: number) => {
    if (index === 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (index === 1) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (index === data.length - 1) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.length > 0 ? (
            data.slice(0, limit).map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-primary/10 rounded-lg">
                    <span className="font-bold text-primary">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusBadge(product.status)}
                      <span className="text-xs text-gray-500">
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {getTrendIcon(index)}
                    <div>
                      <p className="font-bold">${product.revenue.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">
                        {product.sales} sales
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No product data available</p>
            </div>
          )}
        </div>
        {data.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-lg font-bold text-green-600">
                  ${data.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg Price</p>
                <p className="text-lg font-bold">
                  ${Math.round(data.reduce((sum, p) => sum + p.revenue / p.sales, 0) / data.length).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Stock</p>
                <p className="text-lg font-bold">
                  {data.reduce((sum, p) => sum + p.stock, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopSellingProducts;