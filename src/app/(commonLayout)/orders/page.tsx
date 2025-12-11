/* eslint-disable @typescript-eslint/no-explicit-any */
// app/orders/page.tsx
import { Suspense } from "react";
import OrdersComponent from "@/components/modules/Order/OrdersComponent";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileX } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import OrdersSkeleton from "@/components/modules/Order/OrdersSkeleton";
import { getUserInfo } from "@/services/auth/getUserInfo";

// Main server component
const OrdersPage = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  
  if (!accessToken) {
    return <UnauthorizedMessage />;
  }

  return (
    <div>
      <Container className="py-10">
        <Suspense fallback={<OrdersLoadingCard />}>
          <OrdersContent />
        </Suspense>
      </Container>
    </div>
  );
};

// Sub-components for better organization
const UnauthorizedMessage = () => (
  <Container className="py-10">
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <FileX className="h-24 w-24 text-gray-400 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-900">
        Please login to view orders
      </h2>
      <p className="mt-2 text-sm text-gray-600 text-center max-w-md">
        You need to be logged in to see your order history.
      </p>
      <Button asChild className="mt-6">
        <Link href="/auth/login">Login</Link>
      </Button>
    </div>
  </Container>
);

const OrdersLoadingCard = () => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>Order List</CardTitle>
    </CardHeader>
    <CardContent>
      <ScrollArea>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] md:w-auto">Order Number</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Payment</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <OrdersSkeleton />
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </CardContent>
  </Card>
);

const OrdersContent = async () => {
  // Add a simple test first
  console.log("=== ORDERS PAGE DEBUG ===");
  
  try {
    // First, test the API directly
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    console.log("Access token exists:", !!accessToken);
    
    // Get user info which now includes orders
    const user = await getUserInfo();
    
    console.log("User data received:", {
      hasUser: !!user,
      userEmail: user?.email,
      hasOrders: !!user?.orders,
      ordersCount: user?.orders?.length || 0,
      orderNumbers: user?.orders?.map(o => o.orderNumber),
      userRaw: JSON.stringify(user, null, 2) // Full user object
    });
    
    if (!user) {
      console.error("No user data returned");
      return <ErrorDisplay message="Failed to load user data" />;
    }
    
    if (!user.orders || user.orders.length === 0) {
      console.log("No orders found for user:", user.email);
      return <NoOrdersMessage />;
    }

    const orders = user.orders;
    console.log(`Displaying ${orders.length} orders for user: ${user.email}`);

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Order List ({orders.length} orders)</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] md:w-auto">Order Number</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Payment</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <OrdersComponent orders={orders} />
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          
          {/* Debug panel - remove in production */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-sm font-semibold mb-2">Debug Info</h3>
            <p className="text-xs">
              User: {user.email}<br/>
              Orders: {orders.length}<br/>
              First Order: {orders[0]?.orderNumber}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  } catch (error: any) {
    console.error("Error in OrdersContent:", error);
    return <ErrorDisplay message={`Error: ${error.message}`} />;
  }
};

const NoOrdersMessage = () => (
  <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <FileX className="h-24 w-24 text-gray-400 mb-4" />
    <h2 className="text-2xl font-semibold text-gray-900">No orders found</h2>
    <p className="mt-2 text-sm text-gray-600 text-center max-w-md">
      It looks like you haven&apos;t placed any orders yet. Start
      shopping to see your orders here!
    </p>
    <Button asChild className="mt-6">
      <Link href="/">Browse Products</Link>
    </Button>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <FileX className="h-24 w-24 text-red-400 mb-4" />
    <h2 className="text-2xl font-semibold text-gray-900">Error Loading Orders</h2>
    <p className="mt-2 text-sm text-gray-600 text-center max-w-md">
      {message}
    </p>
    <div className="mt-6 flex gap-4">
      <Button asChild variant="outline">
        <Link href="/">Go Home</Link>
      </Button>
      <Button asChild>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </Button>
    </div>
  </div>
);

export default OrdersPage;