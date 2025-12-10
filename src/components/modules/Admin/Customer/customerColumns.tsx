// components/modules/Admin/CustomerManagement/customerColumns.tsx (Updated)
import { DateCell } from "@/components/shared/cell/DateCell";
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell";
import { UserInfoCell } from "@/components/shared/cell/UserInfoCell";
import { Badge } from "@/components/ui/badge";
import { IOrder } from "@/types/order.interface";
import { IUser } from "@/types/user.interface";
import { ShoppingBag, MapPin, MessageSquare, TrendingUp } from "lucide-react";
import { Column } from "../../Dashboard/shared/ManagementTable";
import { formatShortDate } from "@/lib/formatters";

// Helper functions using actual data
const getOrderCount = (customer: IUser): number => {
  return customer.orders?.length || 0;
};

const getTotalSpent = (customer: IUser): string => {
  const orders: IOrder[] = customer.orders || [];
  const total = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  return `$${total.toFixed(2)}`;
};

const getAverageOrderValue = (customer: IUser): number => {
  const orders: IOrder[] = customer.orders || [];
  if (orders.length === 0) return 0;
  const total = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  return total / orders.length;
};

const getAddressCount = (customer: IUser): number => {
  return customer.userAddresses?.length || 0;
};

const getReviewCount = (customer: IUser): number => {
  return customer.productReviews?.length || 0;
};

const getCustomerType = (customer: IUser): { type: string, variant: "default" | "secondary" | "outline" | "destructive" } => {
  const orderCount = getOrderCount(customer);
  const totalSpent = getAverageOrderValue(customer);
  
  if (orderCount === 0) {
    return { type: "New", variant: "outline" };
  } else if (orderCount === 1) {
    return { type: "One-time", variant: "secondary" };
  } else if (orderCount > 1 && orderCount <= 5) {
    return { type: "Regular", variant: "default" };
  } else if (orderCount > 5 && totalSpent < 100) {
    return { type: "Frequent", variant: "default" };
  } else if (totalSpent >= 100) {
    return { type: "VIP", variant: "default" };
  } else {
    return { type: "Customer", variant: "outline" };
  }
};

export const customerColumns: Column<IUser>[] = [
  {
    header: "Customer",
    accessor: (customer) => (
      <UserInfoCell
        name={customer.name}
        email={customer.email}
        photo={customer.profileImageUrl}
      />
    ),
    sortKey: "name",
  },
  {
    header: "Contact",
    accessor: (customer) => (
      <div className="flex flex-col space-y-1">
        <span className="text-sm text-gray-600">{customer.phone || "No phone"}</span>
        <span className="text-xs text-gray-500">{customer.email}</span>
      </div>
    ),
  },
  {
    header: "Orders",
    accessor: (customer) => {
      const orderCount = getOrderCount(customer);
      const totalSpent = getTotalSpent(customer);
      return (
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-blue-600" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{orderCount}</span>
            {orderCount > 0 && (
              <span className="text-xs text-gray-500">
                {totalSpent}
              </span>
            )}
          </div>
        </div>
      );
    },
    sortKey: "orders",
  },
  {
    header: "Avg. Order",
    accessor: (customer) => {
      const avgValue = getAverageOrderValue(customer);
      return (
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium">
            ${avgValue.toFixed(2)}
          </span>
        </div>
      );
    },
  },
  {
    header: "Addresses",
    accessor: (customer) => {
      const addressCount = getAddressCount(customer);
      return (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-green-600" />
          <span className="text-sm">{addressCount}</span>
        </div>
      );
    },
  },
  {
    header: "Reviews",
    accessor: (customer) => {
      const reviewCount = getReviewCount(customer);
      return (
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-purple-600" />
          <span className="text-sm">{reviewCount}</span>
        </div>
      );
    },
  },
  {
    header: "Gender",
    accessor: (customer) => (
      <span className="text-sm capitalize">
        {customer.gender?.toLowerCase() || "N/A"}
      </span>
    ),
  },
  {
    header: "Status",
    accessor: (customer) => (
      <StatusBadgeCell 
        isDeleted={customer.userStatus === "INACTIVE" || customer.isDeleted} 
        statusText={customer.isDeleted ? "DELETED" : customer.userStatus}
        activeText="Active"
        inactiveText="Inactive"
        deletedText="Deleted"
      />
    ),
  },
  {
    header: "Customer Type",
    accessor: (customer) => {
      const { type, variant } = getCustomerType(customer);
      return (
        <Badge variant={variant} className="text-xs">
          {type}
        </Badge>
      );
    },
  },
    {
    header: "Joined",
    accessor: (customer) => <DateCell date={customer.createdAt} format="date" />,
    sortKey: "createdAt",
    },
    {
    header: "Last Order",
    accessor: (customer) => {
        const orders: IOrder[] = customer.orders || [];
        if (orders.length === 0) return <span className="text-sm text-gray-500">Never</span>;
        
        const lastOrder = orders.reduce((latest, order) => 
        new Date(order.orderDate) > new Date(latest.orderDate) ? order : latest
        );
        
        return <span className="text-sm">{formatShortDate(lastOrder.orderDate)}</span>;
    },
    },
];