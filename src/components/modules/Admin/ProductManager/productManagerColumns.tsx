// components/modules/Admin/ProductManagerManagement/productManagerColumns.tsx
import { DateCell } from "@/components/shared/cell/DateCell";
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell";
import { UserInfoCell } from "@/components/shared/cell/UserInfoCell";
import { IUser } from "@/types/user.interface";
import { Package } from "lucide-react";
import { Column } from "../../Dashboard/shared/ManagementTable";

export const productManagerColumns: Column<IUser>[] = [
  {
    header: "Product Manager",
    accessor: (pm) => (
      <UserInfoCell
        name={pm.name}
        email={pm.email}
        photo={pm.profileImageUrl}
      />
    ),
    sortKey: "name",
  },
  {
    header: "Contact",
    accessor: (pm) => (
      <div className="flex flex-col">
        <span className="text-sm">{pm.phone || "N/A"}</span>
      </div>
    ),
  },
  {
    header: "Gender",
    accessor: (pm) => (
      <span className="text-sm capitalize">
        {pm.gender?.toLowerCase() || "N/A"}
      </span>
    ),
  },
  {
    header: "Role",
    accessor: (pm) => (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
        <Package className="h-3 w-3 mr-1" />
        {pm.role.replace("_", " ")}
      </span>
    ),
  },
  {
    header: "Status",
    accessor: (pm) => (
      <StatusBadgeCell 
        isDeleted={pm.userStatus === "INACTIVE"} 
        // statusText={pm.userStatus}
        activeText="Active"
        // inactiveText="Inactive"
      />
    ),
  },
  {
    header: "Password Reset",
    accessor: (pm) => (
      <span className={`text-sm font-medium ${pm.needPasswordReset ? 'text-orange-600' : 'text-green-600'}`}>
        {pm.needPasswordReset ? "Required" : "Completed"}
      </span>
    ),
  },
  {
    header: "Joined",
    accessor: (pm) => <DateCell date={pm.createdAt} />,
    sortKey: "createdAt",
  },
];