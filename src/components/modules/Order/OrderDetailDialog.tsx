// components/modules/Order/OrderDetailDialog.tsx
"use client";

import { IOrder } from "@/types/order.interface";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PriceFormatter from "../Product/PriceFormatter";
import { format } from "date-fns";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

interface OrderDetailDialogProps {
  order: IOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelOrder?: (orderId: string, orderNumber: string) => void;
}

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({
  order,
  isOpen,
  onClose,
  onCancelOrder,
}) => {
  if (!order) return null;

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "PROCESSING":
        return <Package className="w-5 h-5 text-blue-500" />;
      case "SHIPPED":
      case "OUT_FOR_DELIVERY":
        return <Truck className="w-5 h-5 text-purple-500" />;
      case "DELIVERED":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  // Check if order can be cancelled
  const canCancelOrder = order && 
    ["PENDING", "PROCESSING"].includes(order.status) &&
    !order.payments?.some(p => p.paymentStatus === "COMPLETED");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl! max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon(order.status)}
            Order Details - {order.orderNumber}
          </DialogTitle>
        </DialogHeader>

        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Customer Information</h3>
            <div className="space-y-1">
              <p>
                <strong>Name:</strong> {order.customerName}
              </p>
              <p>
                <strong>Email:</strong> {order.customerEmail}
              </p>
              <p>
                <strong>Order Date:</strong>{" "}
                {format(new Date(order.orderDate), "PPpp")}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Order Status</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "DELIVERED"
                      ? "bg-green-100 text-green-800"
                      : order.status === "CANCELLED"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              {order.orderTrackings && order.orderTrackings.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600">
                    Last update: {order.orderTrackings[0].notes}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(order.orderTrackings[0].createdAt), "PPpp")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        {order.shippingAddress && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Shipping Address</h3>
            <p>
              {order.shippingName}, {order.shippingAddress}, {order.shippingCity},{" "}
              {order.shippingState} {order.shippingZipCode}
            </p>
          </div>
        )}

        {/* Order Items */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Order Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="flex items-center gap-2">
                    {item.product?.productImages?.[0]?.imageUrl && (
                      <Image
                        src={item.product.productImages[0].imageUrl}
                        alt={item.productName}
                        width={50}
                        height={50}
                        className="border rounded-sm object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      {item.variantInfo && (
                        <p className="text-sm text-gray-600">{item.variantInfo}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <PriceFormatter
                      amount={item.unitPrice}
                      className="text-black"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <PriceFormatter
                      amount={item.unitPrice * item.quantity}
                      className="font-medium"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Order Summary */}
        <div className="border-t pt-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <PriceFormatter amount={order.subtotal} />
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <PriceFormatter amount={-order.discountAmount} />
                </div>
              )}
              {order.shipping?.shippingCost && (
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <PriceFormatter amount={order.shipping.shippingCost} />
                </div>
              )}
              <div className="flex justify-between border-t pt-2 font-bold text-lg">
                <span>Total:</span>
                <PriceFormatter amount={order.totalPrice} />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        {order.payments && order.payments.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Payment Information</h3>
            <div className="space-y-2">
              {order.payments.map((payment) => (
                <div key={payment.id} className="border p-3 rounded">
                  <p>
                    <strong>Method:</strong> {payment.paymentMethod}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        payment.paymentStatus === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {payment.paymentStatus}
                    </span>
                  </p>
                  <p>
                    <strong>Amount:</strong>{" "}
                    <PriceFormatter amount={payment.amount} />
                  </p>
                  {payment.paidAt && (
                    <p>
                      <strong>Paid at:</strong>{" "}
                      {format(new Date(payment.paidAt), "PPpp")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          {canCancelOrder && onCancelOrder && (
            <Button
              variant="destructive"
              onClick={() => {
                onCancelOrder(order.id, order.orderNumber);
                onClose();
              }}
            >
              Cancel Order
            </Button>
          )}
          
          {order.invoice?.hostedInvoiceUrl && (
            <Button variant="outline" asChild>
              <Link href={order.invoice.hostedInvoiceUrl} target="_blank">
                Download Invoice
              </Link>
            </Button>
          )}
          
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;