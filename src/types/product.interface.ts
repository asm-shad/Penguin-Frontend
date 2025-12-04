import { IOrderItem, IReturnItem } from "./order.interface";
import { IUser, ProductStatusType, UserRoleType } from "./user.interface";

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Relations - productCategories is a junction table
  productCategories?: IProductCategory[];
  // Add productCount for transformed data from backend
  productCount?: number;
  // For Prisma _count
  _count?: {
    productCategories: number;
  };
}

export interface IBrand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  products?: IProduct[];
}

export interface IProductImage {
  id: string;
  imageUrl: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
  productId: string;
  product?: IProduct;
}

export interface IProductVariant {
  id: string;
  name: string; // e.g., "Color", "Size"
  value: string; // e.g., "Red", "XL"
  sku?: string;
  price?: number; // Price override for the variant
  stock: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  productId: string;
  product?: IProduct;
  orderItems?: IOrderItem[];
  productInventories?: IProductInventory[];
}

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number; // Base price
  discount: number;
  salePrice?: number; // Calculated sale price
  status: ProductStatusType;
  isFeatured: boolean;
  isActive: boolean;
  sku?: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;

  // Relations - EXACTLY AS IN YOUR SCHEMA
  brandId?: string;
  brand?: IBrand;
  productCategories?: IProductCategory[]; // Junction table
  productImages?: IProductImage[];
  productReviews?: IProductReview[];
  orderItems?: IOrderItem[];
  wishlists?: IWishlist[];
  productVariants?: IProductVariant[];
  productInventories?: IProductInventory[];
  returnItems?: IReturnItem[];

  // Helper/computed fields for frontend (not in schema but useful)
  primaryImage?: string;
  categories?: ICategory[]; // Flattened from productCategories
  averageRating?: number;
  reviewCount?: number;

  _count?: {
    productReviews: number;
    wishlists: number;
    // Add other counts if needed
  };
}

// ProductCategory (Junction Table) - MATCHES YOUR SCHEMA
export interface IProductCategory {
  id: string;
  createdAt: Date;
  productId: string;
  product: IProduct;
  categoryId: string;
  category: ICategory;
}

// ProductReview interface - MATCHES YOUR SCHEMA
export interface IProductReview {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  productId: string;
  product?: IProduct;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: UserRoleType;
    profileImageUrl?: string;
  };
}

export interface IWishlist {
  id: string;
  createdAt: Date;
  userId: string;
  user?: IUser;
  productId: string;
  product?: IProduct;
}

export interface IProductInventory {
  id: string;
  changeType:
    | "STOCK_IN"
    | "STOCK_OUT"
    | "ADJUSTMENT"
    | "RETURN"
    | "DAMAGE"
    | "EXPIRED";
  previousStock: number;
  newStock: number;
  changeQuantity: number;
  reason?: string;
  referenceId?: string;
  notes?: string;
  createdAt: Date;
  productId: string;
  product?: IProduct;
  variantId?: string;
  variant?: IProductVariant;
  userId?: string;
  user?: IUser;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface IProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: ProductStatusType;
  isFeatured?: boolean;
  isActive?: boolean;
  searchTerm?: string;
  sortBy?: "price" | "createdAt" | "name" | "discount" | "stock";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// Product creation/update DTO
export interface ICreateProductDto {
  name: string;
  slug: string;
  description?: string;
  price: number;
  discount?: number;
  status?: ProductStatusType;
  isFeatured?: boolean;
  isActive?: boolean;
  sku?: string;
  stock?: number;
  brandId?: string;
  categoryIds?: string[]; // Array of category IDs
  images?: Array<{
    imageUrl: string;
    altText?: string;
    sortOrder?: number;
    isPrimary?: boolean;
  }>;
  variants?: Array<{
    name: string;
    value: string;
    sku?: string;
    price?: number;
    stock?: number;
    imageUrl?: string;
    isActive?: boolean;
  }>;
}

export interface IUpdateProductStatusDto {
  status: ProductStatusType;
  discount?: number; // Optional discount (only valid for HOT and SALE)
}

export interface IUpdateProductStatusResponse {
  success: boolean;
  message?: string;
  data?: IProduct;
}
