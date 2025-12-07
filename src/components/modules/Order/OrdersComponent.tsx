// components/modules/Order/OrdersComponent.tsx
"use client";

import { IOrder } from "@/types/order.interface";
import { format } from "date-fns";
import { X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PriceFormatter from "../Product/PriceFormatter";
import OrderDetailDialog from "./OrderDetailDialog";
import { cancelOrder } from "@/services/order/order.actions";

const OrdersComponent = ({ orders }: { orders: IOrder[] }) => {
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isCanceling, setIsCanceling] = useState<string | null>(null);

  const handleDelete = async (orderId: string, orderNumber: string) => {
    try {
      setIsCanceling(orderId);
      
      const confirmed = window.confirm(
        `Are you sure you want to cancel order ${orderNumber}?`
      );
      
      if (!confirmed) {
        setIsCanceling(null);
        return;
      }

      const result = await cancelOrder(orderId);
      
      if (result.success) {
        toast.success(`Order ${orderNumber} cancelled successfully!`);
        // Refresh the page to show updated orders
        window.location.reload();
      } else {
        toast.error(result.message || "Failed to cancel order");
      }
    } catch (error) {
      toast.error("An error occurred while cancelling the order");
      console.error("Cancel error:", error);
    } finally {
      setIsCanceling(null);
    }
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PAID":
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
      case "OUT_FOR_DELIVERY":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "REFUNDED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Check if order can be cancelled
  const canCancelOrder = (order: IOrder) => {
    const cancellableStatuses = ["PENDING", "PROCESSING"];
    return cancellableStatuses.includes(order.status) && 
           !order.payments?.some(p => p.paymentStatus === "COMPLETED");
  };

  return (
    <>
      <TableBody>
        <TooltipProvider>
          {orders.map((order) => (
            <Tooltip key={order.id}>
              <TooltipTrigger asChild>
                <TableRow
                  className="cursor-pointer hover:bg-gray-100 h-12"
                  onClick={() => setSelectedOrder(order)}
                >
                  <TableCell className="font-medium">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {order.orderDate &&
                      format(new Date(order.orderDate), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {order.customerEmail}
                  </TableCell>
                  <TableCell>
                    <PriceFormatter
                      amount={order.totalPrice}
                      className="text-black font-medium"
                    />
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                    </span>
                  </TableCell>

                  <TableCell className="hidden sm:table-cell">
                    {order.payments && order.payments.length > 0 ? (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.payments[0].paymentStatus === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.payments[0].paymentStatus}
                      </span>
                    ) : (
                      "----"
                    )}
                  </TableCell>
                  <TableCell
                    onClick={(event) => {
                      event.stopPropagation();
                      if (canCancelOrder(order)) {
                        handleDelete(order.id, order.orderNumber);
                      } else {
                        toast.error(
                          order.status === "CANCELLED"
                            ? "Order already cancelled"
                            : "Cannot cancel this order"
                        );
                      }
                    }}
                    className="flex items-center justify-center group"
                  >
                    {isCanceling === order.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    ) : (
                      <X
                        size={20}
                        className={`group-hover:text-red-600 hoverEffect ${
                          canCancelOrder(order)
                            ? "cursor-pointer text-gray-500"
                            : "cursor-not-allowed text-gray-300"
                        }`}
                      />
                    )}
                  </TableCell>
                </TableRow>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to see order details</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </TableBody>
      <OrderDetailDialog
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onCancelOrder={handleDelete}
      />
    </>
  );
};

export default OrdersComponent;