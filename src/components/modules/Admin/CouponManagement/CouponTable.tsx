/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  deleteCoupon,
  updateCouponStatus,
} from "@/services/admin/couponManagement.actions";
import { ICoupon } from "@/types/coupon.interface";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import ManagementTable from "../../Dashboard/shared/ManagementTable";
import DeleteConfirmationDialog from "../../Dashboard/shared/DeleteConfirmationDialog";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { couponColumns } from "./CouponColumns";
import EditCouponButton from "./EditCouponButton";

interface CouponTableProps {
  coupons: ICoupon[];
}

const CouponTable = ({ coupons }: CouponTableProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deletingCoupon, setDeletingCoupon] = useState<ICoupon | null>(null);
  const [isDeletingDialog, setIsDeletingDialog] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDelete = (coupon: ICoupon) => {
    setDeletingCoupon(coupon);
  };

  const handleToggleStatus = async (coupon: ICoupon) => {
    try {
      // Use the regular update endpoint instead
      const result = await updateCouponStatus(coupon.id, !coupon.isActive);

      if (result.success) {
        toast.success(result.message || "Coupon status updated");
        handleRefresh();
      } else {
        toast.error(result.message || "Failed to update status");
      }
    } catch (error: any) {
      console.error("Toggle status error:", error);
      toast.error(error.message || "Failed to update status");
    }
  };

  const confirmDelete = async () => {
    if (!deletingCoupon) return;

    setIsDeletingDialog(true);
    try {
      const result = await deleteCoupon(deletingCoupon.id);

      if (result.success) {
        toast.success(result.message || "Coupon deleted successfully");
        setDeletingCoupon(null);
        handleRefresh();
      } else {
        toast.error(result.message || "Failed to delete coupon");
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete coupon");
    } finally {
      setIsDeletingDialog(false);
    }
  };

  // Add status column and actions
  const columnsWithActions = [
    ...couponColumns,
    {
      header: "Active",
      accessor: (coupon: ICoupon) => (
        <div className="flex justify-center">
          <Switch
            checked={coupon.isActive}
            onCheckedChange={() => handleToggleStatus(coupon)}
            className="data-[state=checked]:bg-green-600 h-5 w-9"
          />
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: (coupon: ICoupon) => (
        <div className="flex items-center justify-center gap-1">
          <EditCouponButton coupon={coupon} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(coupon)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <ManagementTable
        data={coupons}
        columns={columnsWithActions}
        getRowKey={(coupon) => coupon.id}
        emptyMessage="No coupons found"
      />

      <DeleteConfirmationDialog
        open={!!deletingCoupon}
        onOpenChange={(open) => !open && setDeletingCoupon(null)}
        onConfirm={confirmDelete}
        title="Delete Coupon"
        description={`Are you sure you want to delete coupon "${deletingCoupon?.code}"? This action cannot be undone.`}
        isDeleting={isDeletingDialog}
      />
    </>
  );
};

export default CouponTable;
