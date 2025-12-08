// components/modules/Admin/AdminManagement/AdminManagementHeader.tsx
"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import ManagementPageHeader from "../../Dashboard/shared/ManagementPageHeader";
import AdminFormDialog from "./AdminFormDialog";

const AdminManagementHeader = () => {
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
      <AdminFormDialog
        key={dialogKey}
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
      />

      <ManagementPageHeader
        title="Admin Management"
        description="Manage admin users and their permissions"
        action={{
          label: "Add Admin",
          icon: Plus,
          onClick: handleOpenDialog,
        }}
      />
    </>
  );
};

export default AdminManagementHeader;