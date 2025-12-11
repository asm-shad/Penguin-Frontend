"use client";

import InputFieldError from "@/components/shared/InputFieldError";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus } from "@/services/order/order.actions";
import { IOrder } from "@/types/order.interface";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface IOrderFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  order?: IOrder;
}

const OrderFormDialog = ({
  open,
  onClose,
  onSuccess,
  order,
}: IOrderFormDialogProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const isEdit = !!order;

  const [state, formAction, pending] = useActionState(
    isEdit ? updateOrderStatus.bind(null, order.id!) : () => ({ success: false }),
    null
  );

  const handleClose = () => {
    formRef.current?.reset();
    onClose();
  };

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || "Order updated successfully");
      if (formRef.current) {
        formRef.current.reset();
      }
      onSuccess();
      onClose();
    } else if (state && !state.success) {
      toast.error(state.message || "Failed to update order");
    }
  }, [state, onSuccess, onClose]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] flex flex-col p-0 max-w-lg">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>
            {isEdit ? `Update Order #${order.orderNumber}` : "Update Order Status"}
          </DialogTitle>
        </DialogHeader>

        <form
          ref={formRef}
          action={formAction}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-4">
            {order && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  <strong>Customer:</strong> {order.customerName}
                </p>
                <p className="text-sm">
                  <strong>Total:</strong> ${order.totalPrice.toFixed(2)}
                </p>
                <p className="text-sm">
                  <strong>Current Status:</strong> {order.status}
                </p>
              </div>
            )}

            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <Select name="status" defaultValue={order?.status || "PENDING"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <InputFieldError state={state} field="status" />
            </Field>

            <Field>
              <FieldLabel htmlFor="notes">Notes (Optional)</FieldLabel>
              <Input
                id="notes"
                name="notes"
                placeholder="Add any notes about this status change..."
                defaultValue={""}
              />
              <InputFieldError state={state} field="notes" />
            </Field>
          </div>

          <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderFormDialog;