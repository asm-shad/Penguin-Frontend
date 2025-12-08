// components/modules/Coupon/CouponTable.tsx
"use client";

import { deleteCoupon, toggleCouponStatus } from "@/services/admin/couponManagement.actions";
import { ICoupon } from "@/types/coupon.interface";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import ManagementTable from "../../Dashboard/shared/ManagementTable";
import DeleteConfirmationDialog from "../../Dashboard/shared/DeleteConfirmationDialog";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { couponColumns } from "./CouponColumns";

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
    const result = await toggleCouponStatus(coupon.id, !coupon.isActive);
    
    if (result.success) {
      toast.success(result.message || "Coupon status updated");
      handleRefresh();
    } else {
      toast.error(result.message || "Failed to update status");
    }
  };

  const confirmDelete = async () => {
    if (!deletingCoupon) return;

    setIsDeletingDialog(true);
    const result = await deleteCoupon(deletingCoupon.id);
    setIsDeletingDialog(false);
    
    if (result.success) {
      toast.success(result.message || "Coupon deleted successfully");
      setDeletingCoupon(null);
      handleRefresh();
    } else {
      toast.error(result.message || "Failed to delete coupon");
    }
  };

  // Add status column and actions
  const columnsWithActions = [
    ...couponColumns,
    {
      header: "Status",
      accessor: (coupon: ICoupon) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={coupon.isActive}
            onCheckedChange={() => handleToggleStatus(coupon)}
          />
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: (coupon: ICoupon) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Edit functionality would go here - either open a dialog or navigate
              toast.info("Edit functionality to be implemented");
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(coupon)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
        onDelete={handleDelete}
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