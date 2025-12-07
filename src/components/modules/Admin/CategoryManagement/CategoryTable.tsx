// components/modules/Category/CategoryTable.tsx
"use client";

import { deleteCategory } from "@/services/admin/catalogManagement.actions";
import { ICategory } from "@/types/product.interface";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import ManagementTable from "../../Dashboard/shared/ManagementTable";
import DeleteConfirmationDialog from "../../Dashboard/shared/DeleteConfirmationDialog";
import { categoryColumns } from "./categoryColumns";

interface CategoryTableProps {
  categories: ICategory[];
}

const CategoryTable = ({ categories }: CategoryTableProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deletingCategory, setDeletingCategory] = useState<ICategory | null>(null);
  const [isDeletingDialog, setIsDeletingDialog] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDelete = (category: ICategory) => {
    setDeletingCategory(category);
  };

  const confirmDelete = async () => {
    if (!deletingCategory) return;

    setIsDeletingDialog(true);
    const result = await deleteCategory(deletingCategory.id);
    setIsDeletingDialog(false);
    
    if (result.success) {
      toast.success(result.message || "Category deleted successfully");
      setDeletingCategory(null);
      handleRefresh();
    } else {
      toast.error(result.message || "Failed to delete category");
    }
  };

  return (
    <>
      <ManagementTable
        data={categories}
        columns={categoryColumns}
        onDelete={handleDelete}
        getRowKey={(category) => category.id}
        emptyMessage="No categories found"
      />

      <DeleteConfirmationDialog
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
        onConfirm={confirmDelete}
        title="Delete Category"
        description={`Are you sure you want to delete "${deletingCategory?.name}"? This action cannot be undone.`}
        isDeleting={isDeletingDialog}
      />
    </>
  );
};

export default CategoryTable;