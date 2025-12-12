// app/admin/dashboard/category-management/page.tsx
export const dynamic = 'force-dynamic';

import CategoryManagementHeader from "@/components/modules/Admin/CategoryManagement/CategoryManagementHeader";
import CategoryTable from "@/components/modules/Admin/CategoryManagement/CategoryTable";
import RefreshButton from "@/components/modules/Dashboard/shared/RefreshButton";
import TablePagination from "@/components/modules/Dashboard/shared/TablePagination";
import { TableSkeleton } from "@/components/modules/Dashboard/shared/TableSkeleton";
import { fetchCategories } from "@/services/product/category.actions";
import { Suspense } from "react";

const AdminProductCategoryManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  
  // Extract pagination and search parameters
  const page = searchParamsObj.page ? parseInt(searchParamsObj.page as string) : 1;
  const limit = searchParamsObj.limit ? parseInt(searchParamsObj.limit as string) : 10;
  const searchTerm = searchParamsObj.search as string | undefined;
  const sortBy = searchParamsObj.sortBy as string | undefined;
  const sortOrder = searchParamsObj.sortOrder as "asc" | "desc" | undefined;
  
  // Call with pagination options
  const result = await fetchCategories({
    page,
    limit,
    searchTerm,
    sortBy,
    sortOrder,
  });
  
  // Calculate total pages from meta
  const totalPages = result.meta?.totalPages || 
    Math.ceil((result.meta?.total || 1) / (result.meta?.limit || limit));
  
  return (
    <div className="space-y-6">
      <CategoryManagementHeader />
      <div className="flex">
        <RefreshButton />
      </div>
      <Suspense fallback={<TableSkeleton columns={2} rows={10} />}>
        <CategoryTable categories={result.data} />
        <TablePagination
          currentPage={result.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
};

export default AdminProductCategoryManagementPage;