// components/modules/Admin/CustomerSupportManagement/CustomerSupportFormDialog.tsx
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
import { createCustomerSupport, updateCustomerSupport } from "@/services/superAdmin/user.actions";
import { IUser } from "@/types/user.interface";
import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ICustomerSupportFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customerSupport?: IUser;
}

const CustomerSupportFormDialog = ({
  open,
  onClose,
  onSuccess,
  customerSupport,
}: ICustomerSupportFormDialogProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = !!customerSupport;

  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">(
    customerSupport?.gender || "MALE"
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(customerSupport?.profileImageUrl || null);
  const processedStateRef = useRef<string | null>(null);

  const [state, formAction, pending] = useActionState(
    isEdit ? updateCustomerSupport.bind(null, customerSupport.id!) : createCustomerSupport,
    null
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
    
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(customerSupport?.profileImageUrl || null);
    }
  };

  // Reset processed state when dialog opens
  useEffect(() => {
    if (open) {
      processedStateRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    // Don't process if dialog is closed or no state
    if (!open || !state) return;
    
    // Create a unique key for this state
    const stateKey = JSON.stringify(state);
    
    // Only process if we haven't seen this state before
    if (stateKey !== processedStateRef.current) {
      processedStateRef.current = stateKey;
      
      if (state.success) {
        toast.success(state.message);
        
        // Close dialog first, then trigger success
        setTimeout(() => {
          onClose();
          // Small delay before success callback
          setTimeout(() => {
            onSuccess();
          }, 50);
        }, 100);
      } else {
        toast.error(state.message);
        
        if (selectedFile && fileInputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(selectedFile);
          fileInputRef.current.files = dataTransfer.files;
        }
      }
    }
  }, [state, open, onSuccess, selectedFile, onClose]);

  const handleClose = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (selectedFile && imagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedFile(null);
    setImagePreview(null);
    setGender(customerSupport?.gender || "MALE");
    formRef.current?.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>{isEdit ? "Edit Customer Support" : "Add New Customer Support"}</DialogTitle>
        </DialogHeader>

        <form
          ref={formRef}
          action={formAction}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-4">
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                defaultValue={customerSupport?.name || ""}
              />
              <InputFieldError state={state} field="name" />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="support@example.com"
                defaultValue={customerSupport?.email || ""}
                disabled={isEdit}
                readOnly={isEdit}
              />
              <InputFieldError state={state} field="email" />
            </Field>

            {!isEdit && (
              <>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter password (min 6 characters)"
                  />
                  <InputFieldError state={state} field="password" />
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                  />
                  <InputFieldError state={state} field="confirmPassword" />
                </Field>
              </>
            )}

            <Field>
              <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
              <Input
                id="phone"
                name="phone"
                placeholder="+1234567890"
                defaultValue={customerSupport?.phone || ""}
              />
              <InputFieldError state={state} field="phone" />
            </Field>

            <Field>
              <FieldLabel htmlFor="gender">Gender</FieldLabel>
              <Input
                id="gender"
                name="gender"
                defaultValue={gender}
                type="hidden"
              />
              <Select
                value={gender}
                onValueChange={(value) => setGender(value as "MALE" | "FEMALE" | "OTHER")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              <InputFieldError state={state} field="gender" />
            </Field>

            <Field>
              <FieldLabel htmlFor="file">Profile Photo</FieldLabel>
              {imagePreview && (
                <div className="mb-2">
                  <p className="text-sm text-gray-600 mb-1">
                    {isEdit && customerSupport?.profileImageUrl ? "Current Photo" : "New Photo"}:
                  </p>
                  <Image
                    src={imagePreview}
                    alt="Profile Preview"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </div>
              )}
              <Input
                ref={fileInputRef}
                id="file"
                name="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                {isEdit ? "Upload a new profile photo (optional)" : "Upload a profile photo (optional)"}
              </p>
              <InputFieldError state={state} field="profilePhoto" />
            </Field>
          </div>

          <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
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
                ? "Saving..."
                : isEdit
                ? "Update Customer Support"
                : "Create Customer Support"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerSupportFormDialog;