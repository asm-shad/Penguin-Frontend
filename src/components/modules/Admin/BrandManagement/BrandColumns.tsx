// components/modules/Brand/brandColumns.tsx
import { IBrand } from "@/types/product.interface";
import Image from "next/image";
import { Column } from "../../Dashboard/shared/ManagementTable";

export const BrandColumns: Column<IBrand>[] = [
  {
    header: "Logo",
    accessor: (brand) => (
      brand.imageUrl ? (
        <Image
          src={brand.imageUrl}
          alt={brand.name}
          width={40}
          height={40}
          className="rounded-md"
        />
      ) : (
        <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
          <span className="text-xs text-gray-500">No Logo</span>
        </div>
      )
    ),
  },
  {
    header: "Name",
    accessor: (brand) => brand.name,
  },
  {
    header: "Slug",
    accessor: (brand) => brand.slug,
  },
  {
    header: "Products",
    accessor: (brand) => brand._count?.products || 0,
  },
];