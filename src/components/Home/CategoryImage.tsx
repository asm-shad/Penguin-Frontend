// components/shared/CategoryImage.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

interface CategoryImageProps {
  src: string;
  alt: string;
  fallbackSrc: string;
  href: string;
}

const CategoryImage = ({ src, alt, fallbackSrc }: CategoryImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={500}
      height={500}
      className="w-full h-full object-contain group-hover:scale-110 hoverEffect"
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
};

export default CategoryImage;
