/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DiscountTypeType,
  OrderStatusType,
  PaymentMethodType,
  PaymentStatusType,
  PaymentGatewayType,
} from "./user.interface";
import { IProduct, IProductVariant } from "./product.interface";

// Coupon interface
export interface ICoupon {
  id: string;
  code: string;
  description?: string;
  discountType: DiscountTypeType;
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

// Order interface
export interface IOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  subtotal: number;
  discountAmount: number;
  totalPrice: number;
  currency: string;

  // Shipping snapshot fields
  shippingName?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZipCode?: string;

  // Payment gateway fields
  stripeCheckoutSessionId?: string;
  stripeCustomerId?: string;
  stripePaymentIntentId?: string;

  status: OrderStatusType;
  orderDate: Date;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  couponId?: string;
  coupon?: ICoupon;
  orderItems: IOrderItem[];
  invoice?: IInvoice;
  payments?: IPayment[];
  orderTrackings?: IOrderTracking[];
  shipping?: IShipping;
  returnRequests?: IReturnRequest[];
}

// OrderItem interface
export interface IOrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  productName: string;
  productSlug: string;
  variantInfo?: string;
  createdAt: Date;

  // Relations
  orderId: string;
  order?: IOrder;
  productId: string;
  product?: IProduct;
  variantId?: string;
  variant?: IProductVariant;
  returnItems?: IReturnItem[];
}

// Invoice interface
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

// Payment interface
export interface IPayment {
  id: string;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatusType;
  paymentGateway: PaymentGatewayType;
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

  // Relations
  orderId: string;
  order?: IOrder;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

// OrderTracking interface
export interface IOrderTracking {
  id: string;
  status: OrderStatusType;
  notes?: string;
  location?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  createdAt: Date;

  // Relations
  orderId: string;
  order?: IOrder;
  userId?: string;
  user?: {
    id: string;
    name: string;
  };
}

// Shipping interface
export interface IShipping {
  id: string;
  carrier:
    | "FEDEX"
    | "UPS"
    | "DHL"
    | "USPS"
    | "BLUE_DART"
    | "DELHIVERY"
    | "OTHER";
  trackingNumber?: string;
  shippingMethod:
    | "STANDARD"
    | "EXPRESS"
    | "NEXT_DAY"
    | "SAME_DAY"
    | "INTERNATIONAL";
  shippingCost: number;
  estimatedDays?: number;
  shippedAt?: Date;
  deliveredAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  orderId: string;
  order?: IOrder;
}

// ReturnRequest interface
export interface IReturnRequest {
  id: string;
  returnReason:
    | "DEFECTIVE"
    | "WRONG_ITEM"
    | "SIZE_ISSUE"
    | "QUALITY_ISSUE"
    | "NOT_AS_DESCRIBED"
    | "CHANGE_OF_MIND"
    | "OTHER";
  status:
    | "REQUESTED"
    | "APPROVED"
    | "REJECTED"
    | "PICKUP_SCHEDULED"
    | "PICKUP_COMPLETED"
    | "REFUND_PROCESSED"
    | "COMPLETED";
  additionalNotes?: string;
  refundAmount?: number;
  approvedAt?: Date;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  orderId: string;
  order?: IOrder;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  returnItems?: IReturnItem[];
}

// ReturnItem interface
export interface IReturnItem {
  id: string;
  quantity: number;
  returnReason?: string;
  condition: "UNOPENED" | "LIKE_NEW" | "USED" | "DAMAGED" | "DEFECTIVE";
  refundAmount?: number;
  createdAt: Date;

  // Relations
  returnId: string;
  returnRequest?: IReturnRequest;
  orderItemId: string;
  orderItem?: IOrderItem;
  productId: string;
  product?: IProduct;
}
