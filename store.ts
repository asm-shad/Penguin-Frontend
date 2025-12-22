/* eslint-disable @typescript-eslint/no-explicit-any */
import { IProduct, IProductVariant } from "@/types/product.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  validateCoupon,
  CouponValidationResult,
} from "@/services/coupon/coupon.service";

export interface CartItem {
  product: IProduct;
  quantity: number;
  selectedVariant?: IProductVariant;
}

interface AppliedCoupon {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  discountAmount: number;
  minOrderAmount: number;
}

interface StoreState {
  // Cart
  items: CartItem[];
  appliedCoupon: AppliedCoupon | null;
  couponValidationResult: CouponValidationResult | null;

  // Cart actions
  addItem: (product: IProduct, variant?: IProductVariant) => void;
  removeItem: (productId: string) => void;
  deleteCartProduct: (productId: string) => void;
  resetCart: () => void;

  // Price calculations
  getTotalPrice: () => number; // Final price after product discounts only
  getSubTotalPrice: () => number; // Original price total before discounts
  getProductDiscountTotal: () => number; // Total product discount amount
  getCouponDiscount: () => number; // Coupon discount amount
  getFinalTotal: () => number; // Final price after all discounts

  // Coupon actions
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  clearCouponValidation: () => void;

  // Utility
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
      appliedCoupon: null,
      couponValidationResult: null,

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
              items: [
                ...state.items,
                { product, quantity: 1, selectedVariant: variant },
              ],
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

      resetCart: () =>
        set({
          items: [],
          appliedCoupon: null,
          couponValidationResult: null,
        }),

      // Final price after product discounts only
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const basePrice =
            item.selectedVariant?.price || item.product.price || 0;
          const discount = item.product.discount || 0;
          const salePrice = basePrice - (basePrice * discount) / 100;
          return total + salePrice * item.quantity;
        }, 0);
      },

      // Original price total before discounts
      getSubTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const basePrice =
            item.selectedVariant?.price || item.product.price || 0;
          return total + basePrice * item.quantity;
        }, 0);
      },

      // Total product discount amount
      getProductDiscountTotal: () => {
        return get().items.reduce((total, item) => {
          const basePrice =
            item.selectedVariant?.price || item.product.price || 0;
          const discount = item.product.discount || 0;
          const discountAmount = (basePrice * discount) / 100;
          return total + discountAmount * item.quantity;
        }, 0);
      },

      // Coupon discount amount
      getCouponDiscount: () => {
        const { appliedCoupon, getTotalPrice } = get();
        const totalBeforeCoupon = getTotalPrice();

        if (!appliedCoupon) return 0;

        // Check minimum order amount
        if (totalBeforeCoupon < appliedCoupon.minOrderAmount) {
          // Remove coupon if minimum order not met
          set({ appliedCoupon: null });
          return 0;
        }

        if (appliedCoupon.discountType === "PERCENTAGE") {
          return (totalBeforeCoupon * appliedCoupon.discountValue) / 100;
        } else {
          // Fixed amount discount - cannot exceed total
          return Math.min(appliedCoupon.discountValue, totalBeforeCoupon);
        }
      },

      // Final price after all discounts
      getFinalTotal: () => {
        const totalBeforeCoupon = get().getTotalPrice();
        const couponDiscount = get().getCouponDiscount();
        return Math.max(0, totalBeforeCoupon - couponDiscount);
      },

      // Coupon actions
      applyCoupon: async (code: string) => {
        try {
          const totalBeforeCoupon = get().getTotalPrice();
          const result = await validateCoupon(code, totalBeforeCoupon);

          set({ couponValidationResult: result });

          if (result.isValid && result.coupon) {
            const appliedCoupon = {
              code: result.coupon.code,
              discountType: result.coupon.discountType,
              discountValue: result.coupon.discountValue,
              discountAmount: result.coupon.discountAmount,
              minOrderAmount: result.coupon.minOrderAmount,
            };

            set({ appliedCoupon });
            return { success: true, message: result.message };
          }

          return { success: false, message: result.message };
        } catch (error: any) {
          console.error("Apply coupon error:", error);
          return {
            success: false,
            message: error.message || "Failed to apply coupon",
          };
        }
      },

      removeCoupon: () => {
        set({
          appliedCoupon: null,
          couponValidationResult: null,
        });
      },

      clearCouponValidation: () => {
        set({ couponValidationResult: null });
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
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon, // Persist coupon
        favoriteProduct: state.favoriteProduct,
      }),
    }
  )
);

export default useStore;
