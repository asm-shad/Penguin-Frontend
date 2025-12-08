// components/modules/Admin/AdminManagement/AdminTable.tsx
"use client";

import { IUser } from "@/types/user.interface";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import AdminFormDialog from "./AdminFormDialog";
import AdminViewDetailDialog from "./AdminViewDetailDialog";
import { deleteUser } from "@/services/superAdmin/user.actions";
import ManagementTable from "../../Dashboard/shared/ManagementTable";
import { adminColumns } from "./AdminColumns";
import DeleteConfirmationDialog from "../../Dashboard/shared/DeleteConfirmationDialog";

interface AdminTableProps {
  admins: IUser[];
}

const AdminTable = ({ admins }: AdminTableProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deletingAdmin, setDeletingAdmin] = useState<IUser | null>(null);
  const [viewingAdmin, setViewingAdmin] = useState<IUser | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<IUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleView = (admin: IUser) => {
    setViewingAdmin(admin);
  };

  const handleEdit = (admin: IUser) => {
    setEditingAdmin(admin);
  };

  const handleDelete = (admin: IUser) => {
    setDeletingAdmin(admin);
  };

  const confirmDelete = async () => {
    if (!deletingAdmin) return;

    setIsDeleting(true);
    
    // Use deleteUser function
    const result = await deleteUser(deletingAdmin.id!);
    
    setIsDeleting(false);

    if (result.success) {
      toast.success(result.message || "Admin deleted successfully");
      setDeletingAdmin(null);
      handleRefresh();
    } else {
      toast.error(result.message || "Failed to delete admin");
    }
  };

  return (
    <>
      <ManagementTable
        data={admins}
        columns={adminColumns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowKey={(admin) => admin.id!}
        emptyMessage="No admins found"
      />
      
      {/* Edit Admin Form Dialog */}
      <AdminFormDialog
        open={!!editingAdmin}
        onClose={() => setEditingAdmin(null)}
        admin={editingAdmin!}
        onSuccess={() => {
          setEditingAdmin(null);
          handleRefresh();
        }}
      />

      {/* View Admin Detail Dialog */}
      <AdminViewDetailDialog
        open={!!viewingAdmin}
        onClose={() => setViewingAdmin(null)}
        admin={viewingAdmin}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={!!deletingAdmin}
        onOpenChange={(open) => !open && setDeletingAdmin(null)}
        onConfirm={confirmDelete}
        title="Delete Admin"
        description={`Are you sure you want to delete ${deletingAdmin?.name}? This action cannot be undone.`}
        isDeleting={isDeleting}
        itemName="Delete"
        // cancelText="Cancel"
      />
    </>
  );
};

export default AdminTable;