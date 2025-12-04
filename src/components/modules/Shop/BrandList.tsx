import { IBrand } from "@/types/product.interface";
import React from "react";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";
import { Title } from "@/components/ui/text";

interface Props {
  brands: IBrand[];
  selectedBrand?: string | null;
  setSelectedBrand: React.Dispatch<React.SetStateAction<string | null>>;
}

const BrandList = ({ brands, selectedBrand, setSelectedBrand }: Props) => {
  return (
    <div className="w-full bg-white p-5">
      <Title className="text-base font-black">Brands</Title>
      <RadioGroup value={selectedBrand || ""} className="mt-2 space-y-1">
        {brands?.map((brand) => (
          <div
            key={brand.id}
            onClick={() => setSelectedBrand(brand.slug)}
            className="flex items-center space-x-2 hover:cursor-pointer"
          >
            <RadioGroupItem
              value={brand.slug}
              id={brand.slug}
              className="rounded-sm"
            />
            <Label
              htmlFor={brand.slug}
              className={`${
                selectedBrand === brand.slug
                  ? "font-semibold text-shop_dark_green"
                  : "font-normal"
              }`}
            >
              {brand.name}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {selectedBrand && (
        <button
          onClick={() => setSelectedBrand(null)}
          className="text-sm font-medium mt-2 underline underline-offset-2 decoration-1 hover:text-shop_dark_green hoverEffect text-left"
        >
          Reset selection
        </button>
      )}
    </div>
  );
};

export default BrandList;
