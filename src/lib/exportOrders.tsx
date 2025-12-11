/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";

interface ExportOrdersParams {
  format: "csv" | "excel" | "pdf";
  filters?: any;
}

export const exportOrders = async ({ format, filters }: ExportOrdersParams) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    queryParams.append("format", format);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const res = await serverFetch.get(`/orders/export?${queryParams.toString()}`, {
      headers: {
        "Accept": format === "pdf" ? "application/pdf" : "text/csv",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to export orders: ${res.statusText}`);
    }

    // For PDF, get as blob
    if (format === "pdf") {
      const blob = await res.blob();
      return {
        success: true,
        data: blob,
        message: "Orders exported successfully",
      };
    }
    
    // For CSV/Excel, get as text
    const data = await res.text();
    return {
      success: true,
      data,
      message: "Orders exported successfully",
    };
  } catch (error: any) {
    console.error("Error exporting orders:", error);
    return {
      success: false,
      message: error.message || "Failed to export orders",
      data: null,
    };
  }
};