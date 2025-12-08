// components/modules/Admin/AdminManagement/adminColumns.tsx

import { IUser } from "@/types/user.interface";
import { Column } from "../../Dashboard/shared/ManagementTable";
import { UserInfoCell } from "@/components/shared/cell/UserInfoCell";
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell";
import { DateCell } from "@/components/shared/cell/DateCell";

export const adminColumns: Column<IUser>[] = [
  {
    header: "Admin",
    accessor: (admin) => (
      <UserInfoCell
        name={admin.name}
        email={admin.email}
        photo={admin.profileImageUrl}
      />
    ),
    sortKey: "name",
  },
  {
    header: "Contact",
    accessor: (admin) => (
      <div className="flex flex-col">
        <span className="text-sm">{admin.phone || "N/A"}</span>
      </div>
    ),
  },
  {
    header: "Gender",
    accessor: (admin) => (
      <span className="text-sm capitalize">
        {admin.gender?.toLowerCase() || "N/A"}
      </span>
    ),
  },
  {
    header: "Role",
    accessor: (admin) => (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
        {admin.role.replace("_", " ")}
      </span>
    ),
  },
  {
    header: "Status",
    accessor: (admin) => (
      <StatusBadgeCell
        isDeleted={admin.userStatus === "INACTIVE"} 
        // statusText={admin.userStatus}
        activeText="Active"
        // inactiveText="Inactive"
      />
    ),
  },
  {
    header: "Password Reset",
    accessor: (admin) => (
      <span className={`text-sm font-medium ${admin.needPasswordReset ? 'text-orange-600' : 'text-green-600'}`}>
        {admin.needPasswordReset ? "Required" : "Completed"}
      </span>
    ),
  },
  {
    header: "Joined",
    accessor: (admin) => <DateCell date={admin.createdAt} />,
    sortKey: "createdAt",
  },
];