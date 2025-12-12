/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Textarea } from "@/components/ui/textarea";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createCoupon, updateCoupon } from "@/services/admin/couponManagement.actions";
import { DiscountType, ICoupon } from "@/types/coupon.interface";

interface ICouponFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  coupon?: ICoupon; // Add optional coupon prop for editing
}

// Define the state type that matches IInputErrorState
interface CouponFormState {
  success: boolean;
  message: string;
  errors: Array<{ field: string; message: string }>;
  formData?: any;
  data?: any;
}

const CouponFormDialog = ({
  open,
  onClose,
  onSuccess,
  coupon, // Destructure the coupon prop
}: ICouponFormDialogProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  
  // Choose action based on whether we're editing or creating
  const action = coupon ? updateCoupon : createCoupon;
  
  // Cast the action to match the expected signature
  const [state, formAction, pending] = useActionState(
    action as (state: CouponFormState, formData: FormData) => Promise<CouponFormState>,
    {
      success: false,
      message: '',
      errors: []
    }
  );
  
  const [discountType, setDiscountType] = useState<DiscountType>(
    coupon?.discountType || DiscountType.PERCENTAGE
  );
  const [isActive, setIsActive] = useState(coupon?.isActive ?? true);
  const processedStateRef = useRef<string | null>(null);

  // Format date for datetime-local input
  const formatDateForInput = (date: Date | string | undefined): string => {
    if (!date) return '';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Format to YYYY-MM-DDTHH:mm
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Handle state changes from the action
  useEffect(() => {
    if (!state) return;
    
    const stateKey = JSON.stringify(state);
    
    // Only process if we haven't seen this state before
    if (stateKey !== processedStateRef.current) {
      processedStateRef.current = stateKey;
      
      if (state.success) {
        toast.success(state.message || (coupon ? "Coupon updated successfully" : "Coupon created successfully"));
        
        setTimeout(() => {
          onClose();
          // Small delay before success callback
          setTimeout(() => {
            onSuccess();
          }, 50);
        }, 100);
      } else {
        toast.error(state.message || (coupon ? "Failed to update coupon" : "Failed to create coupon"));
      }
    }
  }, [state, onSuccess, onClose, coupon]);

  // Reset form when dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleClose();
    } else {
      // Reset form state when opening
      if (coupon) {
        setDiscountType(coupon.discountType);
        setIsActive(coupon.isActive);
      } else {
        setDiscountType(DiscountType.PERCENTAGE);
        setIsActive(true);
      }
      processedStateRef.current = null;
    }
  };

  const handleClose = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{coupon ? "Edit Coupon" : "Create New Coupon"}</DialogTitle>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-4">
          {/* Hidden field for coupon ID when editing */}
          {coupon && <input type="hidden" name="id" value={coupon.id} />}
          
          <input type="hidden" name="isActive" value={isActive.toString()} />
          <input type="hidden" name="discountType" value={discountType} />

          <Field>
            <FieldLabel htmlFor="code">Coupon Code *</FieldLabel>
            <Input
              id="code"
              name="code"
              placeholder="SUMMER25"
              className="font-mono uppercase"
              defaultValue={coupon?.code || state?.formData?.code || ""}
              required
              disabled={!!coupon} // Disable code editing if it's an existing coupon
            />
            {coupon && <p className="text-xs text-gray-500 mt-1">Coupon code cannot be changed</p>}
            <InputFieldError field="code" state={state} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="discountType">Discount Type *</FieldLabel>
              <Select
                value={discountType}
                onValueChange={(value: DiscountType) => setDiscountType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DiscountType.PERCENTAGE}>Percentage</SelectItem>
                  <SelectItem value={DiscountType.FIXED_AMOUNT}>Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
              <InputFieldError field="discountType" state={state} />
            </Field>

            <Field>
              <FieldLabel htmlFor="discountValue">
                {discountType === DiscountType.PERCENTAGE ? "Discount % *" : "Discount Amount ($) *"}
              </FieldLabel>
              <Input
                id="discountValue"
                name="discountValue"
                type="number"
                placeholder={discountType === DiscountType.PERCENTAGE ? "25" : "50"}
                min="0"
                max={discountType === DiscountType.PERCENTAGE ? "100" : undefined}
                step="0.01"
                defaultValue={coupon?.discountValue || state?.formData?.discountValue || ""}
                required
              />
              <InputFieldError field="discountValue" state={state} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="maxUses">Max Uses (0 = unlimited)</FieldLabel>
              <Input
                id="maxUses"
                name="maxUses"
                type="number"
                placeholder="0"
                min="0"
                defaultValue={coupon?.maxUses?.toString() || state?.formData?.maxUses || "0"}
              />
              <InputFieldError field="maxUses" state={state} />
            </Field>

            <Field>
              <FieldLabel htmlFor="minOrderAmount">Min Order Amount ($)</FieldLabel>
              <Input
                id="minOrderAmount"
                name="minOrderAmount"
                type="number"
                placeholder="0"
                min="0"
                step="0.01"
                defaultValue={coupon?.minOrderAmount?.toString() || state?.formData?.minOrderAmount || "0"}
              />
              <InputFieldError field="minOrderAmount" state={state} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="validFrom">Valid From *</FieldLabel>
              <Input
                id="validFrom"
                name="validFrom"
                type="datetime-local"
                defaultValue={formatDateForInput(coupon?.validFrom) || state?.formData?.validFrom || ""}
                required
              />
              <InputFieldError field="validFrom" state={state} />
            </Field>

            <Field>
              <FieldLabel htmlFor="validUntil">Valid Until (Optional)</FieldLabel>
              <Input
                id="validUntil"
                name="validUntil"
                type="datetime-local"
                defaultValue={formatDateForInput(coupon?.validUntil) || state?.formData?.validUntil || ""}
              />
              <InputFieldError field="validUntil" state={state} />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              name="description"
              placeholder="e.g., Summer sale discount for all products"
              defaultValue={coupon?.description || state?.formData?.description || ""}
              rows={2}
            />
            <InputFieldError field="description" state={state} />
          </Field>

          <Field className="flex items-center justify-between">
            <FieldLabel htmlFor="isActive">Active</FieldLabel>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </Field>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending 
                ? (coupon ? "Updating..." : "Creating...") 
                : (coupon ? "Update Coupon" : "Create Coupon")
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CouponFormDialog;