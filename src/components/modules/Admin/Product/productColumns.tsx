import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { IProduct } from "@/types/product.interface";
import { Column } from "../../Dashboard/shared/ManagementTable";
import { formatDateTime } from "@/lib/formatters";
import { ProductStatusType } from "@/types/user.interface";

// Status variant mapping
const statusVariantMap: Record<ProductStatusType, { 
  variant: "default" | "destructive" | "outline" | "secondary", 
  label: string 
}> = {
  NEW: { variant: "secondary", label: "New" },
  HOT: { variant: "destructive", label: "Hot" },
  SALE: { variant: "secondary", label: "Sale" },
  OUT_OF_STOCK: { variant: "outline", label: "Out of Stock" },
  DISCONTINUED: { variant: "destructive", label: "Discontinued" },
};

export const productColumns: Column<IProduct>[] = [
  {
    header: "Image",
    accessor: (product) => {
      const primaryImage = product.productImages?.find(img => img.isPrimary)?.imageUrl || 
                          product.productImages?.[0]?.imageUrl;
      return (
        <div className="relative w-12 h-12">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className="object-cover rounded-md"
              sizes="48px"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-xs text-gray-500">No Image</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    header: "Name",
    accessor: (product) => (
      <div className="flex flex-col">
        <span className="font-medium line-clamp-2">{product.name}</span>
        <span className="text-xs text-gray-500">{product.slug}</span>
      </div>
    ),
    className: "min-w-[200px]",
    sortKey: "name",
  },
  {
    header: "SKU",
    accessor: (product) => (
      <span className="font-mono text-sm">{product.sku || "-"}</span>
    ),
    sortKey: "sku",
  },
  {
    header: "Price",
    accessor: (product) => {
      const salePrice = product.discount > 0 
        ? product.price - (product.price * product.discount / 100)
        : product.price;
      
      return (
        <div className="flex flex-col">
          <span className="font-semibold">${salePrice.toFixed(2)}</span>
          {product.discount > 0 ? (
            <>
              <span className="text-sm text-red-600 line-through">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs text-green-600 font-medium">
                -{product.discount}% (Save ${(product.price * product.discount / 100).toFixed(2)})
              </span>
            </>
          ) : null}
        </div>
      );
    },
    sortKey: "price",
  },
  {
    header: "Stock",
    accessor: (product) => {
      let variant: "default" | "destructive" | "outline" = "default";
      if (product.stock === 0) variant = "destructive";
      else if (product.stock < 10) variant = "outline";
      
      return (
        <Badge variant={variant}>
          {product.stock} unit{product.stock !== 1 ? 's' : ''}
        </Badge>
      );
    },
    sortKey: "stock",
  },
  {
    header: "Status",
    accessor: (product) => {
      const config = statusVariantMap[product.status] || { variant: "default", label: product.status };
      return (
        <Badge variant={config.variant} className="whitespace-nowrap">
          {config.label}
        </Badge>
      );
    },
    sortKey: "status",
  },
  {
    header: "Featured",
    accessor: (product) => (
      product.isFeatured ? (
        <Badge variant="default" className="bg-purple-100 text-purple-800 border-purple-200">
          Featured
        </Badge>
      ) : (
        <span className="text-sm text-gray-500">-</span>
      )
    ),
    sortKey: "isFeatured",
  },
  {
    header: "Categories",
    accessor: (product) => {
      const categories = product.productCategories?.map(pc => pc.category?.name).filter(Boolean) || [];
      return categories.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {categories.slice(0, 2).map((name, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {name}
            </Badge>
          ))}
          {categories.length > 2 && (
            <span className="text-xs text-gray-500">+{categories.length - 2}</span>
          )}
        </div>
      ) : (
        <span className="text-sm text-gray-500">-</span>
      );
    },
  },
  {
    header: "Brand",
    accessor: (product) => (
      <Badge variant="outline">
        {product.brand?.name || "Unbranded"}
      </Badge>
    ),
    sortKey: "brand.name",
  },
  {
    header: "Created",
    accessor: (product) => (
      <div className="flex flex-col">
        <span className="text-sm">{formatDateTime(product.createdAt).split(',')[0]}</span>
        <span className="text-xs text-gray-500">
          {formatDateTime(product.createdAt).split(',')[1]}
        </span>
      </div>
    ),
    sortKey: "createdAt",
  },
];