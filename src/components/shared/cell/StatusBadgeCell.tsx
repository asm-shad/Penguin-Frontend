// components/shared/StatusBadgeCell.tsx
"use client";

import { Badge } from "@/components/ui/badge";

interface StatusBadgeCellProps {
  isDeleted?: boolean;
  statusText?: string;
  activeText?: string;
  inactiveText?: string;  // Add this
  deletedText?: string;
}

export function StatusBadgeCell({
  isDeleted,
  statusText,
  activeText = "Active",
  deletedText = "Deleted",
}: StatusBadgeCellProps) {
  // Determine the badge variant
  let variant: "default" | "destructive" | "outline" | "secondary" = "default";
  let displayText = activeText;
  
  if (statusText) {
    displayText = statusText;
    // Map status text to variant
    if (statusText === "DELETED" || statusText === "INACTIVE") {
      variant = "destructive";
    } else if (statusText === "PENDING") {
      variant = "outline";
    } else if (statusText === "SUSPENDED") {
      variant = "secondary";
    }
  } else if (isDeleted) {
    displayText = deletedText;
    variant = "destructive";
  } else {
    // Use active/inactive based on isDeleted
    displayText = isDeleted ? deletedText : activeText;
    variant = isDeleted ? "destructive" : "default";
  }
  
  return (
    <Badge variant={variant}>
      {displayText}
    </Badge>
  );
}