// components/modules/Admin/CustomerManagement/CustomerManagementHeader.tsx
"use client";

import { Download } from "lucide-react";
import ManagementPageHeader from "../../Dashboard/shared/ManagementPageHeader";

const CustomerManagementHeader = () => {
  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export customers");
  };

  return (
    <ManagementPageHeader
      title="Customer Management"
      description="Manage customer accounts, view orders, and track customer activity"
      action={{
        label: "Export Customers",
        icon: Download,
        onClick: handleExport,
      }}
    />
  );
};

export default CustomerManagementHeader;