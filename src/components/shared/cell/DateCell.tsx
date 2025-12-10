// components/shared/DateCell.tsx
"use client";

import { formatDateTime } from "@/lib/formatters";

interface DateCellProps {
  date?: string | Date;
  format?: "datetime" | "short" | "date";
}

export function DateCell({ date, format = "datetime" }: DateCellProps) {
  if (!date) return <span className="text-sm text-gray-500">-</span>;
  
  let formattedDate: string;
  
  switch (format) {
    case "date":
      // Format as full date only (e.g., "Jan 15, 2024")
      formattedDate = new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      break;
    case "short":
      // Format as short date (e.g., "Jan 15")
      formattedDate = new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      break;
    case "datetime":
    default:
      // Use existing formatDateTime
      formattedDate = formatDateTime(date);
      break;
  }
  
  return <span className="text-sm">{formattedDate}</span>;
}