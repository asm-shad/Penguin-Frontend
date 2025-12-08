"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import CustomerSupportFormDialog from "./CustomerSupportFormDialog";
import ManagementPageHeader from "../../Dashboard/shared/ManagementPageHeader";

const CustomerSupportManagementHeader = () => {
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
      <CustomerSupportFormDialog
        key={dialogKey}
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
      />

      <ManagementPageHeader
        title="Customer Support Management"
        description="Manage customer support representatives"
        action={{
          label: "Add Customer Support",
          icon: Plus,
          onClick: handleOpenDialog,
        }}
      />
    </>
  );
};

export default CustomerSupportManagementHeader;