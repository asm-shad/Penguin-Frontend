import { IProduct, IProductVariant } from "@/types/product.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  product: IProduct;
  quantity: number;
  selectedVariant?: IProductVariant;
}

interface StoreState {
  // Cart
  items: CartItem[];
  addItem: (product: IProduct, variant?: IProductVariant) => void;
  removeItem: (productId: string) => void;
  deleteCartProduct: (productId: string) => void;
  resetCart: () => void;
  getTotalPrice: () => number; // Final price after discounts
  getSubTotalPrice: () => number; // Original price total before discounts
  getDiscountTotal: () => number; // Total discount amount
  getItemCount: (productId: string) => number;
  getGroupedItems: () => CartItem[];
  
  // Favorites
  favoriteProduct: IProduct[];
  addToFavorite: (product: IProduct) => Promise<void>;
  removeFromFavorite: (productId: string) => void;
  resetFavorite: () => void;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart
      items: [],
      
      addItem: (product, variant) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => 
              item.product.id === product.id && 
              item.selectedVariant?.id === variant?.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id && 
                item.selectedVariant?.id === variant?.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              items: [...state.items, { product, quantity: 1, selectedVariant: variant }],
            };
          }
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.reduce((acc, item) => {
            if (item.product.id === productId) {
              if (item.quantity > 1) {
                acc.push({ ...item, quantity: item.quantity - 1 });
              }
            } else {
              acc.push(item);
            }
            return acc;
          }, [] as CartItem[]),
        })),

      deleteCartProduct: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        })),

      resetCart: () => set({ items: [] }),

      // Final price after all discounts (what customer pays)
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => {
            const basePrice = item.selectedVariant?.price || item.product.price || 0;
            const discount = item.product.discount || 0;
            const salePrice = basePrice - (basePrice * discount / 100);
            return total + (salePrice * item.quantity);
          },
          0
        );
      },

      // Original price total before discounts
      getSubTotalPrice: () => {
        return get().items.reduce(
          (total, item) => {
            const basePrice = item.selectedVariant?.price || item.product.price || 0;
            return total + (basePrice * item.quantity);
          },
          0
        );
      },

      // Total discount amount
      getDiscountTotal: () => {
        return get().items.reduce(
          (total, item) => {
            const basePrice = item.selectedVariant?.price || item.product.price || 0;
            const discount = item.product.discount || 0;
            const discountAmount = (basePrice * discount / 100);
            return total + (discountAmount * item.quantity);
          },
          0
        );
      },

      getItemCount: (productId) => {
        const item = get().items.find((item) => item.product.id === productId);
        return item ? item.quantity : 0;
      },

      getGroupedItems: () => get().items,

      // Favorites
      favoriteProduct: [],
      
      addToFavorite: (product: IProduct) => {
        return new Promise<void>((resolve) => {
          set((state: StoreState) => {
            const isFavorite = state.favoriteProduct.some(
              (item) => item.id === product.id
            );
            return {
              favoriteProduct: isFavorite
                ? state.favoriteProduct.filter((item) => item.id !== product.id)
                : [...state.favoriteProduct, { ...product }],
            };
          });
          resolve();
        });
      },

      removeFromFavorite: (productId: string) => {
        set((state: StoreState) => ({
          favoriteProduct: state.favoriteProduct.filter(
            (item) => item?.id !== productId
          ),
        }));
      },

      resetFavorite: () => {
        set({ favoriteProduct: [] });
      },
    }),
    {
      name: "cart-store",
    }
  )
);

export default useStore;