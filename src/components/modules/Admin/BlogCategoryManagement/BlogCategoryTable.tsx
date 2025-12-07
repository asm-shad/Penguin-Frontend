// components/modules/BlogCategory/BlogCategoryTable.tsx
"use client";

import { deleteBlogCategory } from "@/services/admin/catalogManagement.actions";
import { IBlogCategory } from "@/types/blog.interface";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import ManagementTable from "../../Dashboard/shared/ManagementTable";
import { BlogCategoryColumns } from "./BlogCategoryColumns";
import DeleteConfirmationDialog from "../../Dashboard/shared/DeleteConfirmationDialog";

interface BlogCategoryTableProps {
  categories: IBlogCategory[];
}

const BlogCategoryTable = ({ categories }: BlogCategoryTableProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deletingCategory, setDeletingCategory] = useState<IBlogCategory | null>(null);
  const [isDeletingDialog, setIsDeletingDialog] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDelete = (category: IBlogCategory) => {
    setDeletingCategory(category);
  };

  const confirmDelete = async () => {
    if (!deletingCategory) return;

    setIsDeletingDialog(true);
    const result = await deleteBlogCategory(deletingCategory.id);
    setIsDeletingDialog(false);
    
    if (result.success) {
      toast.success(result.message || "Blog category deleted successfully");
      setDeletingCategory(null);
      handleRefresh();
    } else {
      toast.error(result.message || "Failed to delete blog category");
    }
  };

  return (
    <>
      <ManagementTable
        data={categories}
        columns={BlogCategoryColumns}
        onDelete={handleDelete}
        getRowKey={(category) => category.id}
        emptyMessage="No blog categories found"
      />

      <DeleteConfirmationDialog
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
        onConfirm={confirmDelete}
        title="Delete Blog Category"
        description={`Are you sure you want to delete "${deletingCategory?.name}"? This action cannot be undone.`}
        isDeleting={isDeletingDialog}
      />
    </>
  );
};

export default BlogCategoryTable;