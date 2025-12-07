"use client";

import { TableBody, TableCell, TableRow } from "@/components/ui/table";

const OrdersSkeleton = () => {
  return (
    <TableBody>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index} className="h-12">
          <TableCell>
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          </TableCell>
          <TableCell className="hidden md:table-cell">
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </TableCell>
          <TableCell className="hidden sm:table-cell">
            <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
          </TableCell>
          <TableCell>
            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
          </TableCell>
          <TableCell className="hidden sm:table-cell">
            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
          </TableCell>
          <TableCell className="text-center">
            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default OrdersSkeleton;