export interface CartProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images?: { url: string }[];
  variant?: string;
  variantId?: string;
  status?: string;
  quantity: number;
}

export interface GroupedCartItem {
  product: CartProduct;
  // Add other grouping properties if needed
}