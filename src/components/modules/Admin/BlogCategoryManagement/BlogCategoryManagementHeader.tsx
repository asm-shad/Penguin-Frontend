// components/modules/BlogCategory/BlogCategoryManagementHeader.tsx
"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import BlogCategoryFormDialog from "./BlogCategoryFormDialog";
import ManagementPageHeader from "../../Dashboard/shared/ManagementPageHeader";

const BlogCategoryManagementHeader = () => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSuccess = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const [dialogKey, setDialogKey] = useState(0);

  const handleOpenDialog = () => {
    setDialogKey((prev) => prev + 1);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <BlogCategoryFormDialog
        key={dialogKey}
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
      />

      <ManagementPageHeader
        title="Blog Category Management"
        description="Manage blog categories and details"
        action={{
          label: "Add Blog Category",
          icon: Plus,
          onClick: handleOpenDialog,
        }}
      />
    </>
  );
};

export default BlogCategoryManagementHeader;