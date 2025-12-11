// app/admin/dashboard/product-management/page.tsx
import ProductFilters from "@/components/modules/Admin/Product/ProductFilters";
import ProductManagementHeader from "@/components/modules/Admin/Product/ProductManagementHeader";
import ProductTable from "@/components/modules/Admin/Product/ProductTable";
import TablePagination from "@/components/modules/Dashboard/shared/TablePagination";
import { TableSkeleton } from "@/components/modules/Dashboard/shared/TableSkeleton";
import { queryStringFormatter } from "@/lib/formatters";
import { fetchAllBrands } from "@/services/product/brand.actions";
import { fetchCategories } from "@/services/product/category.actions";
import { getProducts } from "@/services/product/product.actions";

import { Suspense } from "react";

const ProductManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);

  const [productsResult, categoriesResult, brandsResult] = await Promise.all([
    getProducts(queryString),
    fetchCategories(),
    fetchAllBrands(),
  ]);

  const totalPages = Math.ceil(
    (productsResult?.meta?.total || 1) / (productsResult?.meta?.limit || 10)
  );

  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading header...</div>}>
        <ProductManagementHeader
          categories={categoriesResult?.data || []}
          brands={brandsResult?.data || []}
        />
      </Suspense>

      <Suspense fallback={<div>Loading filters...</div>}>
        <ProductFilters
          categories={categoriesResult?.data || []}
          brands={brandsResult?.data || []}
        />
      </Suspense>

      <Suspense fallback={<TableSkeleton columns={10} rows={10} />}>
        <ProductTable
          products={productsResult.data || []}
          categories={categoriesResult?.data || []}
          brands={brandsResult?.data || []}
        />

        <TablePagination
          currentPage={productsResult?.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
};

export default ProductManagementPage;
