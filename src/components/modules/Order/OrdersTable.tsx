"use client";

import { cancelOrder } from "@/services/order/order.actions";
import { IOrder } from "@/types/order.interface";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import ManagementTable from "../Dashboard/shared/ManagementTable";
import { ordersColumns } from "./ordersColumns";
import OrderViewDetailDialog from "./OrderViewDetailDialog";
import DeleteConfirmationDialog from "../Dashboard/shared/DeleteConfirmationDialog";

interface OrdersTableProps {
  orders: IOrder[];
}

const OrdersTable = ({ orders }: OrdersTableProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [cancellingOrder, setCancellingOrder] = useState<IOrder | null>(null);
  const [viewingOrder, setViewingOrder] = useState<IOrder | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleView = (order: IOrder) => {
    setViewingOrder(order);
  };

  const handleCancel = (order: IOrder) => {
    setCancellingOrder(order);
  };

  const confirmCancel = async () => {
    if (!cancellingOrder) return;

    setIsProcessing(true);
    const result = await cancelOrder(cancellingOrder.id!);
    setIsProcessing(false);

    if (result.success) {
      toast.success(result.message || "Order cancelled successfully");
      setCancellingOrder(null);
      handleRefresh();
    } else {
      toast.error(result.message || "Failed to cancel order");
    }
  };

  return (
    <>
      <ManagementTable
        data={orders}
        columns={ordersColumns}
        onView={handleView}
        onDelete={handleCancel}
        getRowKey={(order) => order.id!}
        emptyMessage="No orders found"
      />

      {/* View Order Detail Dialog */}
      <OrderViewDetailDialog
        open={!!viewingOrder}
        onClose={() => setViewingOrder(null)}
        order={viewingOrder}
      />

      {/* Cancel Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={!!cancellingOrder}
        onOpenChange={(open) => !open && setCancellingOrder(null)}
        onConfirm={confirmCancel}
        title="Cancel Order"
        description={`Are you sure you want to cancel order ${cancellingOrder?.orderNumber}?`}
        isDeleting={isProcessing}
      />
    </>
  );
};

export default OrdersTable;