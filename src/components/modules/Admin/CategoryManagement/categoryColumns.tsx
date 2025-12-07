// components/modules/Category/categoryColumns.tsx
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ICategory } from "@/types/product.interface";
import { Column } from "../../Dashboard/shared/ManagementTable";

export const categoryColumns: Column<ICategory>[] = [
  {
    header: "Image",
    accessor: (category) => (
      category.imageUrl ? (
        <Image
          src={category.imageUrl}
          alt={category.name}
          width={40}
          height={40}
          className="rounded-md"
        />
      ) : (
        <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
          <span className="text-xs text-gray-500">No Image</span>
        </div>
      )
    ),
  },
  {
    header: "Name",
    accessor: (category) => category.name,
  },
  {
    header: "Slug",
    accessor: (category) => category.slug,
  },
  {
    header: "Featured",
    accessor: (category) => (
      category.isFeatured ? (
        <Badge variant="default">Featured</Badge>
      ) : (
        <Badge variant="outline">Regular</Badge>
      )
    ),
  },
  {
    header: "Products",
    accessor: (category) => category._count?.productCategories || 0,
  },
];