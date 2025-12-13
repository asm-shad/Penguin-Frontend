// store/useStore.ts
import { IProduct, IProductVariant } from "@/types/product.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

export interface CartItem {
  product: IProduct;
  quantity: number;
  selectedVariant?: IProductVariant;
}

interface StoreState {
  // ================= CART =================
  items: CartItem[];
  addItem: (product: IProduct, variant?: IProductVariant) => void;
  removeItem: (productId: string) => void;
  deleteCartProduct: (productId: string) => void;
  resetCart: () => void;
  getTotalPrice: () => number;
  getSubTotalPrice: () => number;
  getDiscountTotal: () => number;
  getItemCount: (productId: string) => number;
  getGroupedItems: () => CartItem[];

  // ================= FAVORITES =================
  favoriteProduct: IProduct[];
  addToFavorite: (product: IProduct) => Promise<void>;
  removeFromFavorite: (productId: string) => void;
  resetFavorite: () => void;

  // ================= AUTH =================
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // ================= CART =================
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
          }
          return {
            items: [
              ...state.items,
              { product, quantity: 1, selectedVariant: variant },
            ],
          };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.reduce((acc, item) => {
            if (item.product.id === productId) {
              if (item.quantity > 1)
                acc.push({ ...item, quantity: item.quantity - 1 });
            } else acc.push(item);
            return acc;
          }, [] as CartItem[]),
        })),
      deleteCartProduct: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        })),
      resetCart: () => set({ items: [] }),
      getTotalPrice: () =>
        get().items.reduce((total, item) => {
          const base = item.selectedVariant?.price || item.product.price || 0;
          const discount = item.product.discount || 0;
          return total + (base - (base * discount) / 100) * item.quantity;
        }, 0),
      getSubTotalPrice: () =>
        get().items.reduce((total, item) => {
          const base = item.selectedVariant?.price || item.product.price || 0;
          return total + base * item.quantity;
        }, 0),
      getDiscountTotal: () =>
        get().items.reduce((total, item) => {
          const base = item.selectedVariant?.price || item.product.price || 0;
          const discount = item.product.discount || 0;
          return total + ((base * discount) / 100) * item.quantity;
        }, 0),
      getItemCount: (productId) =>
        get().items.find((item) => item.product.id === productId)?.quantity ||
        0,
      getGroupedItems: () => get().items,

      // ================= FAVORITES =================
      favoriteProduct: [],
      addToFavorite: (product) =>
        new Promise<void>((resolve) => {
          set((state) => ({
            favoriteProduct: state.favoriteProduct.some(
              (p) => p.id === product.id
            )
              ? state.favoriteProduct.filter((p) => p.id !== product.id)
              : [...state.favoriteProduct, product],
          }));
          resolve();
        }),
      removeFromFavorite: (productId) =>
        set((state) => ({
          favoriteProduct: state.favoriteProduct.filter(
            (p) => p.id !== productId
          ),
        })),
      resetFavorite: () => set({ favoriteProduct: [] }),

      // ================= AUTH =================
      accessToken: Cookies.get("accessToken") || null,
      setAccessToken: (token: string) => {
        Cookies.set("accessToken", token);
        set({ accessToken: token });
      },
      clearAccessToken: () => {
        Cookies.remove("accessToken");
        set({ accessToken: null });
      },
    }),
    {
      name: "cart-store", // persistent storage key
    }
  )
);

export default useStore;
