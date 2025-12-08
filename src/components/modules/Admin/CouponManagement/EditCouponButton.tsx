// components/modules/Coupon/EditCouponButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useState } from "react";
import CouponFormDialog from "./CouponFormDialog";
import { ICoupon } from "@/types/coupon.interface";
import { useRouter } from "next/navigation";

interface EditCouponButtonProps {
  coupon: ICoupon;
}

const EditCouponButton = ({ coupon }: EditCouponButtonProps) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setTimeout(() => {
      router.refresh();
    }, 100);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsDialogOpen(true)}
        className="h-8 w-8 p-0"
      >
        <Edit className="h-4 w-4" />
      </Button>

      <CouponFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={handleSuccess}
        coupon={coupon}
      />
    </>
  );
};

export default EditCouponButton;