"use client";

import InfoRow from "@/components/shared/InfoRow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { IOrder } from "@/types/order.interface";
import {
  Calendar,
  CreditCard,
  DollarSign,
  MapPin,
  Package,
  ShoppingCart,
  Truck,
  User,
} from "lucide-react";

interface IOrderViewDialogProps {
  open: boolean;
  onClose: () => void;
  order: IOrder | null;
}

const OrderViewDetailDialog = ({
  open,
  onClose,
  order,
}: IOrderViewDialogProps) => {
  if (!order) {
    return null;
  }

  const latestPayment = order.payments?.[0];
//   const latestTracking = order.orderTrackings?.[0];
  const shipping = order.shipping;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-5xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center justify-between">
            <span>Order #{order.orderNumber}</span>
            <Badge variant={
              order.status === "DELIVERED" ? "default" :
              order.status === "CANCELLED" ? "destructive" :
              "secondary"
            }>
              {order.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-blue-600" />
                <h3 className="font-semibold">Customer</h3>
              </div>
              <p className="font-medium">{order.customerName}</p>
              <p className="text-sm text-gray-600">{order.customerEmail}</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <h3 className="font-semibold">Order Total</h3>
              </div>
              <p className="text-2xl font-bold">
                {formatCurrency(order.totalPrice, order.currency)}
              </p>
              {order.discountAmount > 0 && (
                <p className="text-sm text-green-600">
                  Discount: {formatCurrency(order.discountAmount, order.currency)}
                </p>
              )}
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-purple-600" />
                <h3 className="font-semibold">Order Date</h3>
              </div>
              <p className="font-medium">{formatDateTime(order.orderDate)}</p>
              <p className="text-sm text-gray-600">
                Updated: {formatDateTime(order.updatedAt)}
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Order Items */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold text-lg">Order Items</h3>
              <Badge variant="outline">{order.orderItems.length} items</Badge>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">Product</th>
                    <th className="text-left p-3 text-sm font-medium">Variant</th>
                    <th className="text-left p-3 text-sm font-medium">Quantity</th>
                    <th className="text-left p-3 text-sm font-medium">Price</th>
                    <th className="text-left p-3 text-sm font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-gray-600">{item.productSlug}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-sm">
                          {item.variantInfo || "Standard"}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-medium">{item.quantity}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-medium">
                          {formatCurrency(item.unitPrice, order.currency)}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold">
                          {formatCurrency(item.unitPrice * item.quantity, order.currency)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100">
                  <tr>
                    <td colSpan={4} className="p-3 text-right font-medium">
                      Subtotal:
                    </td>
                    <td className="p-3 font-semibold">
                      {formatCurrency(order.subtotal, order.currency)}
                    </td>
                  </tr>
                  {order.discountAmount > 0 && (
                    <tr>
                      <td colSpan={4} className="p-3 text-right font-medium text-green-600">
                        Discount:
                      </td>
                      <td className="p-3 font-semibold text-green-600">
                        -{formatCurrency(order.discountAmount, order.currency)}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={4} className="p-3 text-right font-bold">
                      Total:
                    </td>
                    <td className="p-3 font-bold text-lg">
                      {formatCurrency(order.totalPrice, order.currency)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Payment Information */}
          {latestPayment && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-lg">Payment Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <InfoRow
                  label="Payment Status"
                  value={
                    <Badge
                      variant={
                        latestPayment.paymentStatus === "COMPLETED"
                          ? "default"
                          : latestPayment.paymentStatus === "PENDING"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {latestPayment.paymentStatus}
                    </Badge>
                  }
                />
                <InfoRow
                  label="Payment Method"
                  value={latestPayment.paymentMethod}
                />
                <InfoRow
                  label="Amount"
                  value={formatCurrency(latestPayment.amount, latestPayment.currency)}
                />
                {latestPayment.transactionId && (
                  <InfoRow
                    label="Transaction ID"
                    value={latestPayment.transactionId}
                  />
                )}
                {latestPayment.paidAt && (
                  <InfoRow
                    label="Paid At"
                    value={formatDateTime(latestPayment.paidAt)}
                  />
                )}
              </div>
            </div>
          )}

          <Separator className="my-6" />

          {/* Shipping Information */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-lg">Shipping Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
              <InfoRow
                label="Shipping Name"
                value={order.shippingName || "Not provided"}
              />
              <InfoRow
                label="Address"
                value={order.shippingAddress || "Not provided"}
              />
              <InfoRow
                label="City"
                value={order.shippingCity || "Not provided"}
              />
              <InfoRow
                label="State/ZIP"
                value={`${order.shippingState || ""} ${order.shippingZipCode || ""}`.trim() || "Not provided"}
              />
              
              {shipping && (
                <>
                  <InfoRow
                    label="Carrier"
                    value={shipping.carrier}
                  />
                  <InfoRow
                    label="Shipping Method"
                    value={shipping.shippingMethod}
                  />
                  {shipping.trackingNumber && (
                    <InfoRow
                      label="Tracking Number"
                      value={shipping.trackingNumber}
                    />
                  )}
                  {shipping.shippedAt && (
                    <InfoRow
                      label="Shipped At"
                      value={formatDateTime(shipping.shippedAt)}
                    />
                  )}
                  {shipping.deliveredAt && (
                    <InfoRow
                      label="Delivered At"
                      value={formatDateTime(shipping.deliveredAt)}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Order Tracking */}
          {order.orderTrackings && order.orderTrackings.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-lg">Order Tracking History</h3>
              </div>
              <div className="space-y-3">
                {[...order.orderTrackings].reverse().map((tracking) => (
                  <div
                    key={tracking.id}
                    className="flex items-start gap-3 p-3 bg-white border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{tracking.status}</span>
                        <span className="text-sm text-gray-500">
                          {formatDateTime(tracking.createdAt)}
                        </span>
                      </div>
                      {tracking.notes && (
                        <p className="text-sm text-gray-600 mt-1">
                          {tracking.notes}
                        </p>
                      )}
                      {tracking.location && (
                        <p className="text-sm text-gray-500 mt-1">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {tracking.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {/* Add other actions like print invoice, etc. */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderViewDetailDialog;