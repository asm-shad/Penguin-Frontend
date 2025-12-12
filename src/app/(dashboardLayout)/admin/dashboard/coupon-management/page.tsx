// app/admin/dashboard/coupon-management/page.tsx
import CouponManagementHeader from "@/components/modules/Admin/CouponManagement/CouponManagementHeader";
import CouponTable from "@/components/modules/Admin/CouponManagement/CouponTable";
import RefreshButton from "@/components/modules/Dashboard/shared/RefreshButton";
import TablePagination from "@/components/modules/Dashboard/shared/TablePagination";
import { TableSkeleton } from "@/components/modules/Dashboard/shared/TableSkeleton";
import { fetchCoupons } from "@/services/admin/couponManagement.actions";
import { Suspense } from "react";

// This directive tells Next.js to render this page on each request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CouponManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  
  // Extract pagination and search parameters
  const page = searchParamsObj.page ? parseInt(searchParamsObj.page as string) : 1;
  const limit = searchParamsObj.limit ? parseInt(searchParamsObj.limit as string) : 10;
  const searchTerm = searchParamsObj.search as string | undefined;
  const isActive = searchParamsObj.isActive as string | undefined;
  const sortBy = searchParamsObj.sortBy as string | undefined;
  const sortOrder = searchParamsObj.sortOrder as "asc" | "desc" | undefined;
  
  // Call with pagination options
  const result = await fetchCoupons({
    page,
    limit,
    searchTerm,
    isActive: isActive ? isActive === 'true' : undefined,
    sortBy,
    sortOrder,
  });
  
  // Calculate total pages from meta
  const totalPages = result.meta?.totalPages || 
    Math.ceil((result.meta?.total || 1) / (result.meta?.limit || limit));
  
  return (
    <div className="space-y-6">
      <CouponManagementHeader />
      <div className="flex">
        <RefreshButton />
      </div>
      <Suspense fallback={<TableSkeleton columns={2} rows={10} />}>
        <CouponTable coupons={result.data || []} />
        <TablePagination
          currentPage={result.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
};

export default CouponManagementPage;