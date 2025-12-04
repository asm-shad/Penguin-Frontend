import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IProduct } from "@/types/product.interface";

const ProductCharacteristics = ({ product }: { product: IProduct }) => {
  // Extract categories from productCategories
  const categories = product.productCategories?.map((pc) => pc.category) || [];
  const primaryCategory = categories[0];

  // Get variants
  const variants = product.productVariants || [];

  // Group variants by name
  const groupedVariants = variants.reduce((acc, variant) => {
    if (!acc[variant.name]) {
      acc[variant.name] = [];
    }
    acc[variant.name].push(variant.value);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>{product.name}: Characteristics</AccordionTrigger>
        <AccordionContent className="space-y-2">
          {/* Brand */}
          {product.brand && (
            <p className="flex items-center justify-between">
              Brand:{" "}
              <span className="font-semibold tracking-wide">
                {product.brand.name}
              </span>
            </p>
          )}

          {/* Category */}
          {primaryCategory && (
            <p className="flex items-center justify-between">
              Category:{" "}
              <span className="font-semibold tracking-wide">
                {primaryCategory.name}
              </span>
            </p>
          )}

          {/* SKU */}
          {product.sku && (
            <p className="flex items-center justify-between">
              SKU:{" "}
              <span className="font-semibold tracking-wide">{product.sku}</span>
            </p>
          )}

          {/* Status */}
          <p className="flex items-center justify-between">
            Status:{" "}
            <span
              className={`font-semibold tracking-wide px-2 py-1 rounded ${
                product.status === "NEW"
                  ? "bg-blue-100 text-blue-800"
                  : product.status === "HOT"
                  ? "bg-red-100 text-red-800"
                  : product.status === "SALE"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {product.status.replace("_", " ")}
            </span>
          </p>

          {/* Stock Status */}
          <p className="flex items-center justify-between">
            Stock Status:{" "}
            <span
              className={`font-semibold tracking-wide ${
                product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stock > 0
                ? `${product.stock} units available`
                : "Out of Stock"}
            </span>
          </p>

          {/* Variants */}
          {Object.keys(groupedVariants).length > 0 && (
            <div className="pt-2 border-t mt-2">
              <p className="font-medium mb-1">Available Variants:</p>
              {Object.entries(groupedVariants).map(([name, values]) => (
                <p
                  key={name}
                  className="flex items-center justify-between text-sm"
                >
                  {name}:{" "}
                  <span className="font-semibold">{values.join(", ")}</span>
                </p>
              ))}
            </div>
          )}

          {/* Last Updated */}
          <p className="flex items-center justify-between text-sm text-gray-500 mt-2 pt-2 border-t">
            Updated:{" "}
            <span>{new Date(product.updatedAt).toLocaleDateString()}</span>
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductCharacteristics;
