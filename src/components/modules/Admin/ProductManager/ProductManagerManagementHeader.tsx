// components/modules/Admin/ProductManagerManagement/ProductManagerManagementHeader.tsx
"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import ProductManagerFormDialog from "./ProductManagerFormDialog";
import ManagementPageHeader from "../../Dashboard/shared/ManagementPageHeader";

const ProductManagerManagementHeader = () => {
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
      <ProductManagerFormDialog
        key={dialogKey}
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
      />

      <ManagementPageHeader
        title="Product Manager Management"
        description="Manage product managers and their permissions"
        action={{
          label: "Add Product Manager",
          icon: Plus,
          onClick: handleOpenDialog,
        }}
      />
    </>
  );
};

export default ProductManagerManagementHeader;