// app/(dashboard)/product-management/page.tsx
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProductStats } from "@/services/product/productStats.action";
import DashboardHeader from "@/components/modules/Admin/ProductDashboard/DashboardHeader";
import ProductDashboardStats from "@/components/modules/Admin/ProductDashboard/ProductDashboardStats";
import ProductStatusDistribution from "@/components/modules/Admin/ProductDashboard/ProductStatusDistribution";
import PriceDistributionChart from "@/components/modules/Admin/ProductDashboard/PriceDistributionChart";
import TopSellingProducts from "@/components/modules/Admin/ProductDashboard/TopSellingProducts";
import StockOverview from "@/components/modules/Admin/ProductDashboard/StockOverview";
import RecentProducts from "@/components/modules/Admin/ProductDashboard/RecentProducts";


export default async function ProductDashboardPage() {
  // Fetch product stats (this will be a server action)
  const statsData = await fetchProductStats();

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Product Management"
        description="Monitor and manage your product inventory, performance, and analytics"
      />

      {/* Stats Overview */}
      <ProductDashboardStats stats={statsData?.stats} />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Status Distribution */}
          <Suspense fallback={<CardSkeleton />}>
            <ProductStatusDistribution data={statsData?.statusDistribution} />
          </Suspense>

          {/* Price Distribution */}
          <Suspense fallback={<CardSkeleton />}>
            <PriceDistributionChart data={statsData?.priceDistribution} />
          </Suspense>

          {/* Top Selling Products */}
          <Suspense fallback={<CardSkeleton />}>
            <TopSellingProducts data={statsData?.topProducts} />
          </Suspense>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Stock Overview */}
          <Suspense fallback={<CardSkeleton />}>
            <StockOverview data={statsData?.stockOverview} />
          </Suspense>

          {/* Recent Products */}
          <Suspense fallback={<CardSkeleton />}>
            <RecentProducts data={statsData?.recentProducts} />
          </Suspense>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Add New Product
              </button>
              <button className="w-full py-2 px-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
                Update Inventory
              </button>
              <button className="w-full py-2 px-4 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors">
                View Low Stock
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}