// components/modules/Brand/BrandManagementHeader.tsx
"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import BrandFormDialog from "./BrandFormDialog";
import ManagementPageHeader from "../../Dashboard/shared/ManagementPageHeader";

const BrandManagementHeader = () => {
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
      <BrandFormDialog
        key={dialogKey}
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
      />

      <ManagementPageHeader
        title="Brand Management"
        description="Manage product brands and details"
        action={{
          label: "Add Brand",
          icon: Plus,
          onClick: handleOpenDialog,
        }}
      />
    </>
  );
};

export default BrandManagementHeader;