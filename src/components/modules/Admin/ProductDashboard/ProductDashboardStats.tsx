// app/(dashboard)/product-management/components/ProductDashboardStats.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Package, TrendingUp, DollarSign, AlertTriangle, Star, Layers, Tag, CheckCircle } from "lucide-react";

interface ProductStats {
  totalProducts: number;
  totalRevenue: number;
  averagePrice: number;
  outOfStockCount: number;
  lowStockCount: number;
  featuredProducts: number;
  activeProducts: number;
  categoriesCount: number;
  brandsCount: number;
}

interface ProductDashboardStatsProps {
  stats?: ProductStats;
}

const ProductDashboardStats = ({ stats }: ProductDashboardStatsProps) => {
  const defaultStats: ProductStats = {
    totalProducts: 0,
    totalRevenue: 0,
    averagePrice: 0,
    outOfStockCount: 0,
    lowStockCount: 0,
    featuredProducts: 0,
    activeProducts: 0,
    categoriesCount: 0,
    brandsCount: 0,
  };

  const data = stats || defaultStats;

  const statCards = [
    {
      title: "Total Products",
      value: data.totalProducts,
      icon: Package,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      trend: "+12%",
    },
    {
      title: "Total Revenue",
      value: `$${data.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-500",
      textColor: "text-green-600",
      trend: "+18%",
    },
    {
      title: "Avg Price",
      value: `$${data.averagePrice.toFixed(2)}`,
      icon: TrendingUp,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      trend: "+5%",
    },
    {
      title: "Out of Stock",
      value: data.outOfStockCount,
      icon: AlertTriangle,
      color: "bg-red-500",
      textColor: "text-red-600",
      trend: data.outOfStockCount > 0 ? "Attention" : "Good",
    },
    {
      title: "Featured",
      value: data.featuredProducts,
      icon: Star,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      trend: `${Math.round((data.featuredProducts / data.totalProducts) * 100)}%`,
    },
    {
      title: "Categories",
      value: data.categoriesCount,
      icon: Layers,
      color: "bg-indigo-500",
      textColor: "text-indigo-600",
      trend: "Diverse",
    },
    {
      title: "Brands",
      value: data.brandsCount,
      icon: Tag,
      color: "bg-pink-500",
      textColor: "text-pink-600",
      trend: "Variety",
    },
    {
      title: "Active",
      value: data.activeProducts,
      icon: CheckCircle,
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
      trend: `${Math.round((data.activeProducts / data.totalProducts) * 100)}%`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className={`text-xs mt-1 ${stat.trend.includes("+") ? "text-green-600" : stat.trend === "Attention" ? "text-red-600" : "text-gray-500"}`}>
                  {stat.trend}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductDashboardStats;