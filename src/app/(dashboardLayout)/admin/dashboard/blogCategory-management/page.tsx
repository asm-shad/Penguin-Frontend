export const dynamic = "force-dynamic";

import BlogCategoryManagementHeader from "@/components/modules/Admin/BlogCategoryManagement/BlogCategoryManagementHeader";
import BlogCategoryTable from "@/components/modules/Admin/BlogCategoryManagement/BlogCategoryTable";
import RefreshButton from "@/components/modules/Dashboard/shared/RefreshButton";
import TablePagination from "@/components/modules/Dashboard/shared/TablePagination";
import { fetchBlogCategories } from "@/services/product/blog.actions";

const AdminBlogCategoryManagementPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
  const limit = searchParams.limit ? parseInt(searchParams.limit as string) : 10;
  const search = searchParams.search as string | undefined;
  const sortBy = searchParams.sortBy as string | undefined;
  const sortOrder = searchParams.sortOrder as "asc" | "desc" | undefined;

  const result = await fetchBlogCategories({
    page,
    limit,
    searchTerm: search,
    sortBy,
    sortOrder,
  });

  const totalPages =
    result.meta?.totalPages ||
    Math.ceil((result.meta?.total || 1) / (result.meta?.limit || limit));

  return (
    <div className="space-y-6">
      <BlogCategoryManagementHeader />
      <div className="flex items-center justify-between">
        <RefreshButton />
      </div>

      <BlogCategoryTable categories={result.data} />

      <TablePagination
        currentPage={result.meta?.page || 1}
        totalPages={totalPages}
      />
    </div>
  );
};

export default AdminBlogCategoryManagementPage;
