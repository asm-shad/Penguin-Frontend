// components/modules/Admin/CustomerSupportManagement/customerSupportColumns.tsx
import { DateCell } from "@/components/shared/cell/DateCell";
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell";
import { UserInfoCell } from "@/components/shared/cell/UserInfoCell";
import { IUser } from "@/types/user.interface";
import { Headphones } from "lucide-react";
import { Column } from "../../Dashboard/shared/ManagementTable";

export const customerSupportColumns: Column<IUser>[] = [
  {
    header: "Customer Support",
    accessor: (cs) => (
      <UserInfoCell
        name={cs.name}
        email={cs.email}
        photo={cs.profileImageUrl}
      />
    ),
    sortKey: "name",
  },
  {
    header: "Contact",
    accessor: (cs) => (
      <div className="flex flex-col">
        <span className="text-sm">{cs.phone || "N/A"}</span>
      </div>
    ),
  },
  {
    header: "Gender",
    accessor: (cs) => (
      <span className="text-sm capitalize">
        {cs.gender?.toLowerCase() || "N/A"}
      </span>
    ),
  },
  {
    header: "Role",
    accessor: (cs) => (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
        <Headphones className="h-3 w-3 mr-1" />
        {cs.role.replace("_", " ")}
      </span>
    ),
  },
  {
    header: "Status",
    accessor: (cs) => (
      <StatusBadgeCell 
        isDeleted={cs.userStatus === "INACTIVE"} 
        // statusText={cs.userStatus}
        activeText="Active"
        // inactiveText="Inactive"
      />
    ),
  },
  {
    header: "Password Reset",
    accessor: (cs) => (
      <span className={`text-sm font-medium ${cs.needPasswordReset ? 'text-orange-600' : 'text-green-600'}`}>
        {cs.needPasswordReset ? "Required" : "Completed"}
      </span>
    ),
  },
  {
    header: "Joined",
    accessor: (cs) => <DateCell date={cs.createdAt} />,
    sortKey: "createdAt",
  },
];