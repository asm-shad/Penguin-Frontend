// components/modules/Coupon/CouponManagementHeader.tsx
"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import CouponFormDialog from "./CouponFormDialog";
import ManagementPageHeader from "../../Dashboard/shared/ManagementPageHeader";

const CouponManagementHeader = () => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSuccess = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const [dialogKey, setDialogKey] = useState(0);

  const handleOpenDialog = () => {
    setDialogKey((prev) => prev + 1);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <CouponFormDialog
        key={dialogKey}
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
      />

      <ManagementPageHeader
        title="Coupon Management"
        description="Create and manage discount coupons for your store"
        action={{
          label: "Create Coupon",
          icon: Plus,
          onClick: handleOpenDialog,
        }}
      />
    </>
  );
};

export default CouponManagementHeader;