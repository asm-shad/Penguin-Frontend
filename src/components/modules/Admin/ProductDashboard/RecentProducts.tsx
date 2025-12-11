// app/(dashboard)/product-management/components/RecentProducts.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface RecentProduct {
  id: string;
  name: string;
  price: number;
  status: string;
  createdAt: string;
  imageUrl?: string;
}

interface RecentProductsProps {
  data?: RecentProduct[];
  limit?: number;
}

const RecentProducts = ({ data = [], limit = 5 }: RecentProductsProps) => {
  const getStatusColor = (status: string) => {
    const colors = {
      NEW: "bg-blue-100 text-blue-800",
      HOT: "bg-red-100 text-red-800",
      SALE: "bg-green-100 text-green-800",
      OUT_OF_STOCK: "bg-gray-100 text-gray-800",
      DISCONTINUED: "bg-gray-100 text-gray-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recently Added Products</span>
          <Clock className="h-5 w-5 text-gray-400" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.length > 0 ? (
            data.slice(0, limit).map((product) => (
              <div
                key={product.id}
                className="flex items-center space-x-3 p-3"
              >
                <div className="shrink-0">
                  {product.imageUrl ? (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {product.name}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getStatusColor(product.status)}>
                      {product.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatDate(product.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${product.price.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Price</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent products</p>
            </div>
          )}
        </div>

        {/* Summary */}
        {data.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Recent</p>
                <p className="text-lg font-bold">{data.length} products</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Average Price</p>
                <p className="text-lg font-bold">
                  ${(data.reduce((sum, p) => sum + p.price, 0) / data.length).toFixed(2)}
                </p>
              </div>
            </div>
            
            {/* Status Distribution */}
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Status Breakdown</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(
                  data.reduce((acc, product) => {
                    acc[product.status] = (acc[product.status] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([status, count]) => (
                  <div key={status} className="flex items-center">
                    <Badge className={getStatusColor(status)}>
                      {status.replace('_', ' ')}: {count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentProducts;