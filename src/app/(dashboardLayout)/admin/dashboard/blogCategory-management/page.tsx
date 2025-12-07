// app/admin/dashboard/blog-category-management/page.tsx
import BlogCategoryManagementHeader from "@/components/modules/Admin/BlogCategoryManagement/BlogCategoryManagementHeader";
import BlogCategoryTable from "@/components/modules/Admin/BlogCategoryManagement/BlogCategoryTable";
import RefreshButton from "@/components/modules/Dashboard/shared/RefreshButton";
import TablePagination from "@/components/modules/Dashboard/shared/TablePagination";
import { TableSkeleton } from "@/components/modules/Dashboard/shared/TableSkeleton";
import { fetchBlogCategories } from "@/services/product/blog.actions";
import { Suspense } from "react";

const AdminBlogCategoryManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  
  // Extract pagination and search parameters
  const page = searchParamsObj.page ? parseInt(searchParamsObj.page as string) : 1;
  const limit = searchParamsObj.limit ? parseInt(searchParamsObj.limit as string) : 10;
  const search = searchParamsObj.search as string | undefined;
  const searchTerm = search;
  const sortBy = searchParamsObj.sortBy as string | undefined;
  const sortOrder = searchParamsObj.sortOrder as "asc" | "desc" | undefined;
  
  // Call with pagination options
  const result = await fetchBlogCategories({
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
      <BlogCategoryManagementHeader />
      <div className="flex items-center justify-between">
        <RefreshButton />
      </div>
      <Suspense fallback={<TableSkeleton columns={2} rows={10} />}>
        <BlogCategoryTable categories={result.data} />
        <TablePagination
          currentPage={result.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
};

export default AdminBlogCategoryManagementPage;