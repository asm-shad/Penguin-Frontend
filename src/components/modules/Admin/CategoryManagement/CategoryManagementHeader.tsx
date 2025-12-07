"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import CategoryFormDialog from "./CategoryFormDialog";
import ManagementPageHeader from "../../Dashboard/shared/ManagementPageHeader";

const CategoryManagementHeader = () => {
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
      <CategoryFormDialog
        key={dialogKey}
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
      />

      <ManagementPageHeader
        title="Category Management"
        description="Manage product categories and details"
        action={{
          label: "Add Category",
          icon: Plus,
          onClick: handleOpenDialog,
        }}
      />
    </>
  );
};

export default CategoryManagementHeader;