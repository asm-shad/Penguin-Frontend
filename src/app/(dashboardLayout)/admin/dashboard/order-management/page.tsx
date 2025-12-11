
import TablePagination from "@/components/modules/Dashboard/shared/TablePagination";
import { TableSkeleton } from "@/components/modules/Dashboard/shared/TableSkeleton";
import OrdersFilter from "@/components/modules/Order/OrdersFilter";
import OrdersManagementHeader from "@/components/modules/Order/OrdersManagementHeader";
import OrdersTable from "@/components/modules/Order/OrdersTable";
import { queryStringFormatter } from "@/lib/formatters";
import { fetchOrders } from "@/services/order/order.actions";
import { Suspense } from "react";

interface IAdminOrdersManagementPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const AdminOrdersManagementPage = async ({
  searchParams,
}: IAdminOrdersManagementPageProps) => {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);
  
  // Fetch orders with filters
  const ordersResult = await fetchOrders(queryString);
  
  console.log({ ordersResult });
  
  const totalPages = Math.ceil(
    (ordersResult?.meta?.total || 1) / (ordersResult?.meta?.limit || 10)
  );

  return (
    <div className="space-y-6">
      <OrdersManagementHeader />
      <OrdersFilter />
      <Suspense fallback={<TableSkeleton columns={9} rows={10} />}>
        <OrdersTable orders={ordersResult?.data || []} />
        <TablePagination
          currentPage={ordersResult?.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
};

export default AdminOrdersManagementPage;