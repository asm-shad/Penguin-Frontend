// app/orders/page.tsx
import { Suspense } from "react";
import OrdersComponent from "@/components/modules/Order/OrdersComponent";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMyOrders } from "@/services/order/order.actions";
import { IOrder } from "@/types/order.interface";
import { FileX } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import OrdersSkeleton from "@/components/modules/Order/OrdersSkeleton";

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
  let orders: IOrder[] = [];
  
  try {
    const result = await getMyOrders();
    if (result.success) {
      orders = result.data || [];
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
  }

  if (orders.length === 0) {
    return <NoOrdersMessage />;
  }

  return (
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
            <OrdersComponent orders={orders} />
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
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

export default OrdersPage;