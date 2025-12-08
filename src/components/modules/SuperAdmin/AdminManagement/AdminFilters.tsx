// components/modules/Admin/AdminManagement/AdminFilters.tsx
"use client";

import ClearFiltersButton from "@/components/shared/ClearFiltersButton";
import RefreshButton from "../../Dashboard/shared/RefreshButton";
import SearchFilter from "../../Dashboard/shared/SearchFilter";
import SelectFilter from "../../Dashboard/shared/SelectFilter";

const AdminFilters = () => {
  return (
    <div className="space-y-3">
      {/* Row 1: Search and Refresh */}
      <div className="flex items-center gap-3">
        <SearchFilter paramName="searchTerm" placeholder="Search admins..." />
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

export default AdminFilters;