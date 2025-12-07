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
import Image from "next/image";
import { createBrand } from "@/services/admin/catalogManagement.actions";

interface IBrandFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  brand?: any;
}

const BrandFormDialog = ({
  open,
  onClose,
  onSuccess,
  brand,
}: IBrandFormDialogProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, formAction, pending] = useActionState(createBrand, null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(brand?.imageUrl || null);
  const processedStateRef = useRef<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
    
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(brand?.imageUrl || null);
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
    formRef.current?.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {brand ? "Edit Brand" : "Add New Brand"}
          </DialogTitle>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-4">
          {brand && <input type="hidden" name="id" value={brand.id} />}

          <Field>
            <FieldLabel htmlFor="name">Name *</FieldLabel>
            <Input
              id="name"
              name="name"
              placeholder="Apple"
              defaultValue={brand?.name || state?.formData?.name || ""}
              required
            />
            <InputFieldError field="name" state={state} />
          </Field>

          <Field>
            <FieldLabel htmlFor="slug">Slug</FieldLabel>
            <Input
              id="slug"
              name="slug"
              placeholder="apple"
              defaultValue={brand?.slug || state?.formData?.slug || ""}
            />
            <InputFieldError field="slug" state={state} />
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              name="description"
              placeholder="Brand description"
              defaultValue={brand?.description || state?.formData?.description || ""}
              rows={3}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="file">Brand Logo/Image</FieldLabel>
            <Input
              ref={fileInputRef}
              onChange={handleFileChange}
              id="file"
              name="file"
              type="file"
              accept="image/*"
            />
            {imagePreview && (
              <div className="mt-2">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={100}
                  height={100}
                  className="rounded-md object-cover"
                />
              </div>
            )}
            <InputFieldError field="file" state={state} />
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
              {pending ? "Saving..." : brand ? "Update Brand" : "Create Brand"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BrandFormDialog;