export const DiscountType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
} as const;

export type DiscountType = (typeof DiscountType)[keyof typeof DiscountType];

export interface ICoupon {
  id: string;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  maxUses?: number;
  usedCount: number;
  minOrderAmount: number;
  validFrom: Date | string;
  validUntil?: Date | string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  orders?: Array<{
    id: string;
    orderNumber: string;
    totalPrice: number;
    createdAt: Date | string;
  }>;
}

export interface ICreateCoupon {
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  maxUses?: number;
  minOrderAmount?: number;
  validFrom?: Date | string;
  validUntil?: Date | string;
  isActive?: boolean;
}

export interface IUpdateCoupon {
  code?: string;
  description?: string;
  discountType?: DiscountType;
  discountValue?: number;
  maxUses?: number;
  minOrderAmount?: number;
  validFrom?: Date | string;
  validUntil?: Date | string;
  isActive?: boolean;
}

export interface IUpdateCouponStatus {
  isActive: boolean;
}

export interface IValidateCoupon {
  code: string;
  orderAmount: number;
}
