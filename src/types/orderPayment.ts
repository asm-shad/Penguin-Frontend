/* eslint-disable @typescript-eslint/no-explicit-any */
// Add these to your types file or create a new one

import { IProduct, IProductVariant } from "./product.interface";
import { IUser, PaymentGatewayType } from "./user.interface";

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  PAID = "PAID",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
  PAYPAL = "PAYPAL",
}

export enum PaymentGateway {
  STRIPE = "STRIPE",
  PAYPAL = "PAYPAL",
  RAZORPAY = "RAZORPAY",
  CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
  CANCELLED = "CANCELLED",
}

export enum ShippingCarrier {
  FEDEX = "FEDEX",
  UPS = "UPS",
  USPS = "USPS",
  DHL = "DHL",
  LOCAL = "LOCAL",
}

export enum ShippingMethod {
  STANDARD = "STANDARD",
  EXPRESS = "EXPRESS",
  NEXT_DAY = "NEXT_DAY",
  INTERNATIONAL = "INTERNATIONAL",
}

export interface IOrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  productName: string;
  productSlug: string;
  variantInfo?: string;
  createdAt: Date;
  orderId: string;
  productId: string;
  variantId?: string;
  product?: IProduct;
  variant?: IProductVariant;
}

export interface IOrderTracking {
  id: string;
  status: OrderStatus;
  notes?: string;
  location?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  createdAt: Date;
  orderId: string;
  userId?: string;
  user?: IUser;
}

export interface IShipping {
  id: string;
  carrier: ShippingCarrier;
  trackingNumber?: string;
  shippingMethod: ShippingMethod;
  shippingCost: number;
  estimatedDays?: number;
  shippedAt?: Date;
  deliveredAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  orderId: string;
  order?: IOrder;
}

export interface IInvoice {
  id: string;
  stripeInvoiceId?: string;
  invoiceNumber?: string;
  hostedInvoiceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  orderId: string;
  order?: IOrder;
}

export interface IPayment {
  id: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentGateway: PaymentGateway;
  transactionId?: string;
  amount: number;
  currency: string;
  gatewayResponse?: any;
  failureReason?: string;
  paidAt?: Date;
  refundedAmount: number;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  orderId: string;
  order?: IOrder;
  userId: string;
  user?: IUser;
}

export interface ICoupon {
  id: string;
  code: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  maxUses?: number;
  usedCount: number;
  minOrderAmount: number;
  validFrom: Date;
  validUntil?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  orders?: IOrder[];
}

export interface IOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  subtotal: number;
  discountAmount: number;
  totalPrice: number;
  currency: string;
  shippingName?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZipCode?: string;
  stripeCheckoutSessionId?: string;
  stripeCustomerId?: string;
  stripePaymentIntentId?: string;
  status: OrderStatus;
  orderDate: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  userId: string;
  user: IUser;
  couponId?: string;
  coupon?: ICoupon;
  orderItems: IOrderItem[];
  invoice?: IInvoice;
  payments: IPayment[];
  orderTrackings: IOrderTracking[];
  shipping?: IShipping;
  returnRequests?: any[];

  // Counts
  _count?: {
    orderItems: number;
    returnRequests: number;
  };
}

export interface ICreateOrderDto {
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  couponCode?: string;
  orderItems: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
  }>;
}

export interface CreateOrderDto {
  userId: string;
  customerName: string;
  customerEmail: string;
  subtotal: number;
  totalPrice: number;
  currency: string;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  orderItems: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
    unitPrice: number;
    productName: string;
    productSlug: string;
    variantInfo?: string;
  }>;
  couponCode?: string;
}

export interface IInitPaymentDto {
  gateway: PaymentGatewayType;
  successUrl?: string;
  cancelUrl?: string;
}

export interface IUpdateOrderStatusDto {
  status: OrderStatus;
  notes?: string;
}

export interface IUpdatePaymentStatusDto {
  paymentStatus: PaymentStatus;
  transactionId?: string;
  failureReason?: string;
  gatewayResponse?: any;
  refundedAmount?: number;
}

export interface IInitiateRefundDto {
  refundAmount: number;
  reason: string;
}

export interface IOrderFilters {
  searchTerm?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  customerEmail?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}