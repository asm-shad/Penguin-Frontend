import CustomerFilters from "@/components/modules/Admin/Customer/CustomerFilters";
import CustomerManagementHeader from "@/components/modules/Admin/Customer/CustomerManagementHeader";
import CustomerTable from "@/components/modules/Admin/Customer/CustomerTable";
import TablePagination from "@/components/modules/Dashboard/shared/TablePagination";
import { TableSkeleton } from "@/components/modules/Dashboard/shared/TableSkeleton";
import { queryStringFormatter } from "@/lib/formatters";
import { getUsers } from "@/services/superAdmin/user.actions";
import { Suspense } from "react";

const CustomerManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  
  // Always include role=USER filter for customers
  const filters = {
    ...searchParamsObj,
    role: "USER", // Force customer filter
  };
  
  const queryString = queryStringFormatter(filters);
  
  const customersResult = await getUsers(queryString);
  
  const totalPages = Math.ceil(
    (customersResult?.meta?.total || 1) / (customersResult?.meta?.limit || 1)
  );
  
  return (
    <div className="space-y-6">
      <CustomerManagementHeader />
      <CustomerFilters />
      <Suspense fallback={<TableSkeleton columns={11} rows={10} />}>
        <CustomerTable customers={customersResult.data || []} />
        <TablePagination
          currentPage={customersResult?.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
};

export default CustomerManagementPage;