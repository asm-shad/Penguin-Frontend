/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge";
import { ICoupon, DiscountType } from "@/types/coupon.interface";
import { format } from "date-fns";
import { Column } from "../../Dashboard/shared/ManagementTable";

export const couponColumns: Column<ICoupon>[] = [
  {
    header: "Code",
    accessor: (coupon) => (
      <div className="font-mono font-bold text-blue-600">{coupon.code}</div>
    ),
  },
  {
    header: "Discount",
    accessor: (coupon) => {
      // Safely handle undefined discountValue
      const discountValue = coupon.discountValue || 0;

      return (
        <div className="font-semibold">
          {coupon.discountType === DiscountType.PERCENTAGE ? (
            <span>{discountValue}% OFF</span>
          ) : (
            <span>${discountValue.toFixed(2)} OFF</span>
          )}
        </div>
      );
    },
  },
  {
    header: "Status",
    accessor: (coupon) => {
      const now = new Date();
      const validFrom = new Date(coupon.validFrom);
      const validUntil = coupon.validUntil ? new Date(coupon.validUntil) : null;

      let status = "Active";
      let variant: "default" | "destructive" | "outline" | "secondary" =
        "default";

      if (!coupon.isActive) {
        status = "Inactive";
        variant = "destructive";
      } else if (now < validFrom) {
        status = "Scheduled";
        variant = "outline";
      } else if (validUntil && now > validUntil) {
        status = "Expired";
        variant = "destructive";
      } else if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        status = "Used Up";
        variant = "secondary";
      }

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    header: "Usage",
    accessor: (coupon) => (
      <div className="text-sm">
        {coupon.maxUses ? (
          <span>
            {coupon.usedCount || 0} / {coupon.maxUses}
          </span>
        ) : (
          <span>{coupon.usedCount || 0} / ∞</span>
        )}
      </div>
    ),
  },
  {
    header: "Dates",
    accessor: (coupon) => {
      try {
        const validFrom = coupon.validFrom
          ? new Date(coupon.validFrom)
          : new Date();
        const validUntil = coupon.validUntil
          ? new Date(coupon.validUntil)
          : null;

        return (
          <div className="text-sm space-y-1">
            <div className="font-medium">
              From: {format(validFrom, "MMM dd, yyyy")}
            </div>
            {validUntil && (
              <div className="text-gray-500">
                To: {format(validUntil, "MMM dd, yyyy")}
              </div>
            )}
          </div>
        );
      } catch (error: any) {
        console.log(error);
        return <div className="text-sm text-red-500">Invalid date</div>;
      }
    },
  },
  {
    header: "Min. Order",
    accessor: (coupon) => (
      <div className="text-sm">
        {(coupon.minOrderAmount || 0) > 0
          ? `$${(coupon.minOrderAmount || 0).toFixed(2)}`
          : "No minimum"}
      </div>
    ),
  },
  {
    header: "Description",
    accessor: (coupon) => (
      <div className="text-sm text-gray-600 truncate max-w-[200px]">
        {coupon.description || "No description"}
      </div>
    ),
  },
  {
    header: "Created",
    accessor: (coupon) => {
      try {
        const createdAt = coupon.createdAt
          ? new Date(coupon.createdAt)
          : new Date();
        return format(createdAt, "MMM dd, yyyy");
      } catch (error: any) {
        console.log(error);
        return "Invalid date";
      }
    },
  },
];
