/* eslint-disable @typescript-eslint/no-explicit-any */
// components/modules/BlogCategory/BlogCategoryFormDialog.tsx
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
import { createBlogCategory } from "@/services/admin/catalogManagement.actions";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface IBlogCategoryFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: any;
}

const BlogCategoryFormDialog = ({
  open,
  onClose,
  onSuccess,
  category,
}: IBlogCategoryFormDialogProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(createBlogCategory, null);
  const processedStateRef = useRef<string | null>(null);

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
      }
    }
  }, [state, open, onSuccess, onClose]);

  const handleClose = () => {
    formRef.current?.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Blog Category" : "Add New Blog Category"}
          </DialogTitle>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-4">
          {category && <input type="hidden" name="id" value={category.id} />}

          <Field>
            <FieldLabel htmlFor="name">Name *</FieldLabel>
            <Input
              id="name"
              name="name"
              placeholder="Technology"
              defaultValue={category?.name || state?.formData?.name || ""}
              required
            />
            <InputFieldError field="name" state={state} />
          </Field>

          <Field>
            <FieldLabel htmlFor="slug">Slug *</FieldLabel>
            <Input
              id="slug"
              name="slug"
              placeholder="technology"
              defaultValue={category?.slug || state?.formData?.slug || ""}
              required
            />
            <InputFieldError field="slug" state={state} />
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              name="description"
              placeholder="Description of the blog category"
              defaultValue={category?.description || state?.formData?.description || ""}
              rows={3}
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
              {pending ? "Saving..." : category ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogCategoryFormDialog;