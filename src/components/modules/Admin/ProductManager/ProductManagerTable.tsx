// components/modules/Admin/ProductManagerManagement/ProductManagerTable.tsx
"use client";

import { IUser } from "@/types/user.interface";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import ProductManagerFormDialog from "./ProductManagerFormDialog";
import { productManagerColumns } from "./productManagerColumns";
import ProductManagerViewDetailDialog from "./ProductManagerViewDetailDialog";
import { deleteUser } from "@/services/superAdmin/user.actions";
import ManagementTable from "../../Dashboard/shared/ManagementTable";
import DeleteConfirmationDialog from "../../Dashboard/shared/DeleteConfirmationDialog";

interface ProductManagerTableProps {
  productManagers: IUser[];
}

const ProductManagerTable = ({ productManagers }: ProductManagerTableProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deletingPM, setDeletingPM] = useState<IUser | null>(null);
  const [viewingPM, setViewingPM] = useState<IUser | null>(null);
  const [editingPM, setEditingPM] = useState<IUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleView = (pm: IUser) => {
    setViewingPM(pm);
  };

  const handleEdit = (pm: IUser) => {
    setEditingPM(pm);
  };

  const handleDelete = (pm: IUser) => {
    setDeletingPM(pm);
  };

  const confirmDelete = async () => {
    if (!deletingPM) return;

    setIsDeleting(true);
    
    // Use deleteUser function
    const result = await deleteUser(deletingPM.id!);
    
    setIsDeleting(false);

    if (result.success) {
      toast.success(result.message || "Product Manager deleted successfully");
      setDeletingPM(null);
      handleRefresh();
    } else {
      toast.error(result.message || "Failed to delete product manager");
    }
  };

  return (
    <>
      <ManagementTable
        data={productManagers}
        columns={productManagerColumns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowKey={(pm) => pm.id!}
        emptyMessage="No product managers found"
      />
      
      {/* Edit Product Manager Form Dialog */}
      <ProductManagerFormDialog
        open={!!editingPM}
        onClose={() => setEditingPM(null)}
        productManager={editingPM!}
        onSuccess={() => {
          setEditingPM(null);
          handleRefresh();
        }}
      />

      {/* View Product Manager Detail Dialog */}
      <ProductManagerViewDetailDialog
        open={!!viewingPM}
        onClose={() => setViewingPM(null)}
        productManager={viewingPM}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={!!deletingPM}
        onOpenChange={(open) => !open && setDeletingPM(null)}
        onConfirm={confirmDelete}
        title="Delete Product Manager"
        description={`Are you sure you want to delete ${deletingPM?.name}? This action cannot be undone.`}
        isDeleting={isDeleting}
        itemName="Delete"
        // cancelText="Cancel"
      />
    </>
  );
};

export default ProductManagerTable;