// components/modules/Admin/CustomerManagement/CustomerTable.tsx
"use client";

import { deleteUser, updateUserStatus } from "@/services/superAdmin/user.actions";
import { IUser } from "@/types/user.interface";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import ManagementTable from "../../Dashboard/shared/ManagementTable";
import { customerColumns } from "./customerColumns";
import CustomerViewDetailDialog from "./CustomerViewDetailDialog";
import DeleteConfirmationDialog from "../../Dashboard/shared/DeleteConfirmationDialog";

interface CustomerTableProps {
  customers: IUser[];
}

const CustomerTable = ({ customers }: CustomerTableProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deletingCustomer, setDeletingCustomer] = useState<IUser | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<IUser | null>(null);
  const [statusChangingCustomer, setStatusChangingCustomer] = useState<IUser | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleView = (customer: IUser) => {
    setViewingCustomer(customer);
  };

  const handleStatusChange = (customer: IUser) => {
    setStatusChangingCustomer(customer);
  };

  const handleDelete = (customer: IUser) => {
    setDeletingCustomer(customer);
  };

  const confirmStatusChange = async () => {
    if (!statusChangingCustomer) return;

    setIsProcessing(true);
    const newStatus = statusChangingCustomer.userStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    
    const result = await updateUserStatus(statusChangingCustomer.id!, { userStatus: newStatus });
    setIsProcessing(false);

    if (result.success) {
      toast.success(`Customer ${newStatus === "INACTIVE" ? "deactivated" : "activated"} successfully`);
      setStatusChangingCustomer(null);
      handleRefresh();
    } else {
      toast.error(result.message || "Failed to update customer status");
    }
  };

  const confirmDelete = async () => {
    if (!deletingCustomer) return;

    setIsProcessing(true);
    const result = await deleteUser(deletingCustomer.id!);
    setIsProcessing(false);

    if (result.success) {
      toast.success(result.message || "Customer deleted successfully");
      setDeletingCustomer(null);
      handleRefresh();
    } else {
      toast.error(result.message || "Failed to delete customer");
    }
  };

  return (
    <>
      <ManagementTable
        data={customers}
        columns={customerColumns}
        onView={handleView}
        onEdit={handleStatusChange} // Using edit button for status change
        onDelete={handleDelete}
        getRowKey={(customer) => customer.id!}
        emptyMessage="No customers found"
      />
      
      {/* View Customer Detail Dialog */}
      <CustomerViewDetailDialog
        open={!!viewingCustomer}
        onClose={() => setViewingCustomer(null)}
        customer={viewingCustomer}
      />

      {/* Status Change Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={!!statusChangingCustomer}
        onOpenChange={(open) => !open && setStatusChangingCustomer(null)}
        onConfirm={confirmStatusChange}
        title={statusChangingCustomer?.userStatus === "ACTIVE" ? "Deactivate Customer" : "Activate Customer"}
        description={`Are you sure you want to ${statusChangingCustomer?.userStatus === "ACTIVE" ? "deactivate" : "activate"} ${statusChangingCustomer?.name}?`}
        isDeleting={isProcessing}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={!!deletingCustomer}
        onOpenChange={(open) => !open && setDeletingCustomer(null)}
        onConfirm={confirmDelete}
        title="Delete Customer"
        description={`Are you sure you want to delete ${deletingCustomer?.name}? This action cannot be undone and will delete all customer data including orders and addresses.`}
        isDeleting={isProcessing}
      />
    </>
  );
};

export default CustomerTable;