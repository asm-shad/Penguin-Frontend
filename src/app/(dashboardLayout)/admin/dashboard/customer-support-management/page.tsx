import CustomerSupportFilters from "@/components/modules/Admin/CustomerSupport/CustomerSupportFilters";
import CustomerSupportManagementHeader from "@/components/modules/Admin/CustomerSupport/CustomerSupportManagementHeader";
import CustomerSupportTable from "@/components/modules/Admin/CustomerSupport/CustomerSupportTable";
import TablePagination from "@/components/modules/Dashboard/shared/TablePagination";
import { TableSkeleton } from "@/components/modules/Dashboard/shared/TableSkeleton";
import { queryStringFormatter } from "@/lib/formatters";
import { getUsers } from "@/services/superAdmin/user.actions";
import { Suspense } from "react";

const CustomerSupportManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  
  // Always include role=CUSTOMER_SUPPORT filter
  const filters = {
    ...searchParamsObj,
    role: "CUSTOMER_SUPPORT", // Force customer support filter
  };
  
  const queryString = queryStringFormatter(filters);
  
  const csResult = await getUsers(queryString);
  
  const totalPages = Math.ceil(
    (csResult?.meta?.total || 1) / (csResult?.meta?.limit || 1)
  );
  
  return (
    <div className="space-y-6">
      <CustomerSupportManagementHeader />
      <CustomerSupportFilters />
      <Suspense fallback={<TableSkeleton columns={9} rows={10} />}>
        <CustomerSupportTable customerSupports={csResult.data || []} />
        <TablePagination
          currentPage={csResult?.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
};

export default CustomerSupportManagementPage;