// components/modules/Admin/CustomerSupportManagement/CustomerSupportTable.tsx
"use client";

import { IUser } from "@/types/user.interface";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import CustomerSupportFormDialog from "./CustomerSupportFormDialog";
import CustomerSupportViewDetailDialog from "./CustomerSupportViewDetailDialog";
import { deleteUser } from "@/services/superAdmin/user.actions";
import ManagementTable from "../../Dashboard/shared/ManagementTable";
import { customerSupportColumns } from "./CustomerSupportColumns";
import DeleteConfirmationDialog from "../../Dashboard/shared/DeleteConfirmationDialog";

interface CustomerSupportTableProps {
  customerSupports: IUser[];
}

const CustomerSupportTable = ({ customerSupports }: CustomerSupportTableProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deletingCS, setDeletingCS] = useState<IUser | null>(null);
  const [viewingCS, setViewingCS] = useState<IUser | null>(null);
  const [editingCS, setEditingCS] = useState<IUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleView = (cs: IUser) => {
    setViewingCS(cs);
  };

  const handleEdit = (cs: IUser) => {
    setEditingCS(cs);
  };

  const handleDelete = (cs: IUser) => {
    setDeletingCS(cs);
  };

  const confirmDelete = async () => {
    if (!deletingCS) return;

    setIsDeleting(true);
    
    // Use deleteUser function
    const result = await deleteUser(deletingCS.id!);
    
    setIsDeleting(false);

    if (result.success) {
      toast.success(result.message || "Customer Support deleted successfully");
      setDeletingCS(null);
      handleRefresh();
    } else {
      toast.error(result.message || "Failed to delete customer support");
    }
  };

  return (
    <>
      <ManagementTable
        data={customerSupports}
        columns={customerSupportColumns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowKey={(cs) => cs.id!}
        emptyMessage="No customer support representatives found"
      />
      
      {/* Edit Customer Support Form Dialog */}
      <CustomerSupportFormDialog
        open={!!editingCS}
        onClose={() => setEditingCS(null)}
        customerSupport={editingCS!}
        onSuccess={() => {
          setEditingCS(null);
          handleRefresh();
        }}
      />

      {/* View Customer Support Detail Dialog */}
      <CustomerSupportViewDetailDialog
        open={!!viewingCS}
        onClose={() => setViewingCS(null)}
        customerSupport={viewingCS}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={!!deletingCS}
        onOpenChange={(open) => !open && setDeletingCS(null)}
        onConfirm={confirmDelete}
        title="Delete Customer Support"
        description={`Are you sure you want to delete ${deletingCS?.name}? This action cannot be undone.`}
        isDeleting={isDeleting}
        itemName="Delete"
        // cancelText="Cancel"
      />
    </>
  );
};

export default CustomerSupportTable;