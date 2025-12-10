// components/modules/Admin/CustomerManagement/CustomerFilters.tsx
"use client";

import ClearFiltersButton from "@/components/shared/ClearFiltersButton";
import SearchFilter from "../../Dashboard/shared/SearchFilter";
import RefreshButton from "../../Dashboard/shared/RefreshButton";
import SelectFilter from "../../Dashboard/shared/SelectFilter";

const CustomerFilters = () => {
  return (
    <div className="space-y-3">
      {/* Row 1: Search and Refresh */}
      <div className="flex items-center gap-3">
        <SearchFilter paramName="searchTerm" placeholder="Search customers by name, email, or phone..." />
        <RefreshButton />
      </div>

      {/* Row 2: Filter Controls - All on same line */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Gender Filter */}
        <SelectFilter
          paramName="gender"
          placeholder="Gender"
          defaultValue="All Genders"
          options={[
            { label: "Male", value: "MALE" },
            { label: "Female", value: "FEMALE" },
            { label: "Other", value: "OTHER" },
          ]}
        />

        {/* Status Filter */}
        <SelectFilter
          paramName="userStatus"
          placeholder="Status"
          defaultValue="All Status"
          options={[
            { label: "Active", value: "ACTIVE" },
            { label: "Inactive", value: "INACTIVE" },
            { label: "Deleted", value: "DELETED" },
          ]}
        />

        {/* Order Count Filter */}
        <SelectFilter
          paramName="orderCount"
          placeholder="Order Activity"
          defaultValue="All Customers"
          options={[
            { label: "No Orders", value: "0" },
            { label: "1-5 Orders", value: "1-5" },
            { label: "6+ Orders", value: "6+" },
            { label: "Repeat Customers", value: "repeat" },
          ]}
        />

        {/* Email Filter */}
        <SearchFilter paramName="email" placeholder="Email" />

        {/* Phone Filter */}
        <SearchFilter paramName="phone" placeholder="Phone" />

        {/* Clear All Filters */}
        <ClearFiltersButton />
      </div>
    </div>
  );
};

export default CustomerFilters;