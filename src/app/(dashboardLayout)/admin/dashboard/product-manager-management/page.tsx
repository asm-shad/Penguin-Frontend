import ProductManagerFilters from "@/components/modules/Admin/ProductManager/ProductManagerFilters";
import ProductManagerManagementHeader from "@/components/modules/Admin/ProductManager/ProductManagerManagementHeader";
import ProductManagerTable from "@/components/modules/Admin/ProductManager/ProductManagerTable";
import TablePagination from "@/components/modules/Dashboard/shared/TablePagination";
import { TableSkeleton } from "@/components/modules/Dashboard/shared/TableSkeleton";
import { queryStringFormatter } from "@/lib/formatters";
import { getUsers } from "@/services/superAdmin/user.actions";
import { Suspense } from "react";

const ProductManagerManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  
  // Always include role=PRODUCT_MANAGER filter
  const filters = {
    ...searchParamsObj,
    role: "PRODUCT_MANAGER", // Force product manager filter
  };
  
  const queryString = queryStringFormatter(filters);
  
  const pmResult = await getUsers(queryString);
  
  const totalPages = Math.ceil(
    (pmResult?.meta?.total || 1) / (pmResult?.meta?.limit || 1)
  );
  
  return (
    <div className="space-y-6">
      <ProductManagerManagementHeader />
      <ProductManagerFilters />
      <Suspense fallback={<TableSkeleton columns={9} rows={10} />}>
        <ProductManagerTable productManagers={pmResult.data || []} />
        <TablePagination
          currentPage={pmResult?.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
};

export default ProductManagerManagementPage;