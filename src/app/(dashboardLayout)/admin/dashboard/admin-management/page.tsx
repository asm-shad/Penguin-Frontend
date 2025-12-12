import TablePagination from "@/components/modules/Dashboard/shared/TablePagination";
import { TableSkeleton } from "@/components/modules/Dashboard/shared/TableSkeleton";
import AdminFilters from "@/components/modules/SuperAdmin/AdminManagement/AdminFilters";
import AdminManagementHeader from "@/components/modules/SuperAdmin/AdminManagement/AdminManagementHeader";
import AdminTable from "@/components/modules/SuperAdmin/AdminManagement/AdminTable";
import { queryStringFormatter } from "@/lib/formatters";
import { getUsers } from "@/services/superAdmin/user.actions";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

const AdminManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  
  // Always include role=ADMIN filter
  const filters = {
    ...searchParamsObj,
    role: "ADMIN", // Force admin filter
  };
  
  const queryString = queryStringFormatter(filters);
  
  const adminsResult = await getUsers(queryString);
  
  const totalPages = Math.ceil(
    (adminsResult?.meta?.total || 1) / (adminsResult?.meta?.limit || 1)
  );
  
  return (
    <div className="space-y-6">
      <AdminManagementHeader />
      <AdminFilters />
      <Suspense fallback={<TableSkeleton columns={9} rows={10} />}>
        <AdminTable admins={adminsResult.data || []} />
        <TablePagination
          currentPage={adminsResult?.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
};

export default AdminManagementPage;