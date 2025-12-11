"use client";
import ClearFiltersButton from "@/components/shared/ClearFiltersButton";
import SearchFilter from "../Dashboard/shared/SearchFilter";
import RefreshButton from "../Dashboard/shared/RefreshButton";
import SelectFilter from "../Dashboard/shared/SelectFilter";

const OrdersFilter = () => {
  return (
    <div className="space-y-3">
      {/* Row 1: Search and Refresh */}
      <div className="flex items-center gap-3">
        <SearchFilter
          paramName="searchTerm" 
          placeholder="Search orders..." 
        />
        <RefreshButton />
      </div>

      {/* Row 2: Filter Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Order Status Filter - Using your OrderStatus enum */}
        <SelectFilter
          paramName="status"
          placeholder="Order Status"
          options={[
            { label: "Pending", value: "PENDING" },
            { label: "Processing", value: "PROCESSING" },
            { label: "Paid", value: "PAID" },
            { label: "Shipped", value: "SHIPPED" },
            { label: "Out for Delivery", value: "OUT_FOR_DELIVERY" },
            { label: "Delivered", value: "DELIVERED" },
            { label: "Cancelled", value: "CANCELLED" },
            { label: "Refunded", value: "REFUNDED" },
          ]}
        />

        {/* Payment Status Filter - Using your PaymentStatus enum */}
        <SelectFilter
          paramName="paymentStatus"
          placeholder="Payment Status"
          options={[
            { label: "Pending", value: "PENDING" },
            { label: "Processing", value: "PROCESSING" },
            { label: "Completed", value: "COMPLETED" },
            { label: "Failed", value: "FAILED" },
            { label: "Refunded", value: "REFUNDED" },
            { label: "Partially Refunded", value: "PARTIALLY_REFUNDED" },
            { label: "Cancelled", value: "CANCELLED" },
          ]}
        />

        {/* Customer Email Filter */}
        <SearchFilter 
          paramName="customerEmail" 
          placeholder="Customer Email" 
        />

        {/* Additional filters you might want */}
        <SearchFilter 
          paramName="customerName" 
          placeholder="Customer Name" 
        />

        {/* Clear All Filters */}
        <ClearFiltersButton />
      </div>
    </div>
  );
};

export default OrdersFilter;