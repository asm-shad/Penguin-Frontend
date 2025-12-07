// PriceFormatter.tsx
import { twMerge } from "tailwind-merge";

interface Props {
  amount: number | undefined;
  className?: string;
  prefix?: string;
  showLineThrough?: boolean;
}

const PriceFormatter = ({ 
  amount, 
  className, 
  prefix = "",
  showLineThrough = false 
}: Props) => {
  const formattedPrice = new Number(amount).toLocaleString("en-US", {
    currency: "USD",
    style: "currency",
    minimumFractionDigits: 2,
  });
  
  // Add prefix if provided (like "-" for discount)
  const displayPrice = prefix ? `${prefix}${formattedPrice}` : formattedPrice;
  
  return (
    <span
      className={twMerge(
        "text-sm font-semibold text-darkColor",
        showLineThrough && "line-through text-gray-500",
        className
      )}
    >
      {displayPrice}
    </span>
  );
};

export default PriceFormatter;