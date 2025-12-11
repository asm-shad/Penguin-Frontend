"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import ManagementPageHeader from "../Dashboard/shared/ManagementPageHeader";

const OrdersManagementHeader = () => {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <ManagementPageHeader
      title="Orders Management"
      description="Manage customer orders and fulfillment"
      action={{
        label: "Refresh",
        icon: RefreshCw,
        onClick: handleRefresh,
        // variant: "outline",
      }}
    />
  );
};

export default OrdersManagementHeader;