"use client";

import { DateCell } from "@/components/shared/cell/DateCell";
import { IOrder } from "@/types/order.interface";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatShortDate } from "@/lib/formatters"; // Import formatShortDate
import { Column } from "../Dashboard/shared/ManagementTable";

export const ordersColumns: Column<IOrder>[] = [
  {
    header: "Order Number",
    accessor: (order) => (
      <div className="flex flex-col">
        <span className="font-semibold">{order.orderNumber}</span>
        <span className="text-xs text-gray-500">
          {formatShortDate(order.orderDate)} {/* Use formatShortDate here */}
        </span>
      </div>
    ),
    sortKey: "orderNumber",
  },
  {
    header: "Customer",
    accessor: (order) => (
      <div className="flex flex-col">
        <span className="font-medium">{order.customerName}</span>
        <span className="text-xs text-gray-500">{order.customerEmail}</span>
      </div>
    ),
    sortKey: "customerName",
  },
  {
    header: "Amount",
    accessor: (order) => (
      <div className="font-semibold">
        {formatCurrency(order.totalPrice, order.currency)}
      </div>
    ),
    sortKey: "totalPrice",
  },
  {
    header: "Status",
    accessor: (order) => {
      const statusConfig = {
        PENDING: { label: "Pending", variant: "secondary" as const },
        PROCESSING: { label: "Processing", variant: "default" as const },
        PAID: { label: "Paid", variant: "default" as const },
        SHIPPED: { label: "Shipped", variant: "default" as const },
        OUT_FOR_DELIVERY: { label: "Out for Delivery", variant: "default" as const },
        DELIVERED: { label: "Delivered", variant: "success" as const },
        CANCELLED: { label: "Cancelled", variant: "destructive" as const },
        REFUNDED: { label: "Refunded", variant: "destructive" as const },
      };

      const config = statusConfig[order.status as keyof typeof statusConfig] || 
                     { label: order.status, variant: "secondary" as const };

      return (
        <Badge variant="default">
          {config.label}
        </Badge>
      );
    },
    sortKey: "status",
  },
  {
    header: "Payment",
    accessor: (order) => {
      const payment = order.payments?.[0];
      return (
        <div className="flex flex-col">
          {payment ? (
            <Badge
              variant={
                payment.paymentStatus === "COMPLETED"
                  ? "default"
                  : payment.paymentStatus === "PENDING"
                  ? "secondary"
                  : payment.paymentStatus === "PROCESSING"
                  ? "outline"
                  : "destructive"
              }
              className="text-xs"
            >
              {payment.paymentStatus}
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              PENDING
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    header: "Items",
    accessor: (order) => (
      <span className="text-sm">{order.orderItems.length} items</span>
    ),
  },
  {
    header: "Created",
    accessor: (order) => <DateCell date={order.createdAt} />,
    sortKey: "createdAt",
  },
];