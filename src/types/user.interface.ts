import { IBlogPost } from "./blog.interface";
import {
  IOrder,
  IOrderTracking,
  IPayment,
  IReturnRequest,
} from "./order.interface";
import {
  IProductInventory,
  IProductReview,
  IWishlist,
} from "./product.interface";

// Runtime enum values for frontend
export const UserRole = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  PRODUCT_MANAGER: "PRODUCT_MANAGER",
  CUSTOMER_SUPPORT: "CUSTOMER_SUPPORT",
  USER: "USER",
} as const;

export const UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  DELETED: "DELETED",
} as const;

export const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
} as const;

export const ProductStatus = {
  NEW: "NEW",
  HOT: "HOT",
  SALE: "SALE",
  OUT_OF_STOCK: "OUT_OF_STOCK",
  DISCONTINUED: "DISCONTINUED",
} as const;

export const DiscountType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED_AMOUNT: "FIXED_AMOUNT",
} as const;

export const OrderStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  PAID: "PAID",
  SHIPPED: "SHIPPED",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;

export const PaymentMethod = {
  CREDIT_CARD: "CREDIT_CARD",
  DEBIT_CARD: "DEBIT_CARD",
  PAYPAL: "PAYPAL",
  STRIPE: "STRIPE",
  BANK_TRANSFER: "BANK_TRANSFER",
  COD: "COD",
} as const;

export const PaymentStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
  PARTIALLY_REFUNDED: "PARTIALLY_REFUNDED",
  CANCELLED: "CANCELLED",
} as const;

export const PaymentGateway = {
  STRIPE: "STRIPE",
  PAYPAL: "PAYPAL",
  RAZORPAY: "RAZORPAY",
  CASH_ON_DELIVERY: "CASH_ON_DELIVERY",
} as const;

// Type definitions
export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];
export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];
export type GenderType = (typeof Gender)[keyof typeof Gender];
export type ProductStatusType =
  (typeof ProductStatus)[keyof typeof ProductStatus];
export type DiscountTypeType = (typeof DiscountType)[keyof typeof DiscountType];
export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus];
export type PaymentMethodType =
  (typeof PaymentMethod)[keyof typeof PaymentMethod];
export type PaymentStatusType =
  (typeof PaymentStatus)[keyof typeof PaymentStatus];
export type PaymentGatewayType =
  (typeof PaymentGateway)[keyof typeof PaymentGateway];

// User Interface
export interface IUser {
  id: string;
  email: string;
  name: string;
  role: UserRoleType;
  gender?: GenderType;
  phone?: string;
  profileImageUrl?: string;
  userStatus: UserStatusType;
  needPasswordReset: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Optional relations
  userAddresses?: IUserAddress[];
  orders?: IOrder[];
  productReviews?: IProductReview[];
  wishlists?: IWishlist[];
  payments?: IPayment[];
  productInventories?: IProductInventory[];
  orderTrackings?: IOrderTracking[];
  returnRequests?: IReturnRequest[];
  blogPosts?: IBlogPost[];
}

export interface IAddress {
  id: string;
  addressLine: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
  userAddresses?: IUserAddress[];
}

export interface IUserAddress {
  id: string;
  addressName: string;
  email?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: IUser;
  addressId: string;
  address: IAddress;
}
