"use client";
import { IProductImage } from "@/types/product.interface";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

interface Props {
  images?: IProductImage[];
  isStock?: number;
}

const ImageView = ({ images = [], isStock }: Props) => {
  const [activeImage, setActiveImage] = useState<IProductImage | null>(
    images.find((img) => img.isPrimary) || images[0] || null
  );

  return (
    <div className="w-full md:w-1/2 space-y-2 md:space-y-4">
      {/* Main Image */}
      <AnimatePresence mode="wait">
        {activeImage && (
          <motion.div
            key={activeImage.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-h-[550px] min-h-[450px] border border-darkColor/10 rounded-md group overflow-hidden"
          >
            <Image
              src={activeImage.imageUrl || "/placeholder-image.jpg"}
              alt={activeImage.altText || "Product image"}
              width={700}
              height={700}
              priority
              className={`w-full h-96 max-h-[550px] min-h-[500px] object-contain group-hover:scale-110 hoverEffect rounded-md ${
                isStock === 0 ? "opacity-50" : ""
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thumbnail Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-6 gap-2 h-20 md:h-24">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => setActiveImage(image)}
              className={`border rounded-md overflow-hidden ${
                activeImage?.id === image.id
                  ? "border-darkColor opacity-100"
                  : "opacity-80 hover:opacity-100"
              }`}
            >
              <Image
                src={image.imageUrl || "/placeholder-image.jpg"}
                alt={image.altText || `Product thumbnail`}
                width={100}
                height={100}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageView;
