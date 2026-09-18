/**
 * Border Spec Cart Store (Zustand)
 * Global cart state with localStorage persistence and Coupon support
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateEntries } from '../lib/entries';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      appliedCoupon: null, // { code, type, value, discount, subtotal, newSubtotal }

      // --- Actions ---
      addItem: (product, size = null, color = null) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.id === product.id &&
              item.selectedSize === size &&
              item.selectedColor === color
          );

          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += 1;
            return { items: newItems, isCartOpen: true };
          }

          return {
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: product.images?.[0] || '',
                variant: product.variants?.[0]?.color || '',
                selectedSize: size,
                selectedColor: color,
                hasMultiplier: product.hasMultiplier || product.has_multiplier || false,
                entryMultiplier: product.entryMultiplier || product.entry_multiplier || 1,
                isMysteryBox: product.isMysteryBox || product.category === 'mystery' || false,
                bundleItems: product.bundleItems || product.bundle_items || [],
                quantity: 1,
              },
            ],
            isCartOpen: true,
          };
        });
      },

      removeItem: (id, size = null, color = null) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.id === id &&
                item.selectedSize === size &&
                item.selectedColor === color)
          ),
        }));
      },

      updateQuantity: (id, size, color, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (item) =>
                  !(item.id === id &&
                    item.selectedSize === size &&
                    item.selectedColor === color)
              ),
            };
          }
          return {
            items: state.items.map((item) =>
              item.id === id &&
              item.selectedSize === size &&
              item.selectedColor === color
                ? { ...item, quantity }
                : item
            ),
          };
        });
      },

      applyCoupon: (coupon) => set({ appliedCoupon: coupon }),
      removeCoupon: () => set({ appliedCoupon: null }),

      clearCart: () => set({ items: [], appliedCoupon: null }),

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      // --- Computed values ---
      getSubtotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getDiscount: () => {
        const { appliedCoupon } = get();
        const subtotal = get().getSubtotal();
        // Entries-type coupons grant giveaway entries, NOT a price discount
        if (!appliedCoupon || appliedCoupon.reward_type === 'entries') return 0;

        let discount = 0;
        // The API returns `type` for discount_type (percentage | fixed)
        const discountType = appliedCoupon.type || appliedCoupon.discount_type || 'percentage';
        const value = parseFloat(appliedCoupon.value) || 0;

        if (discountType === 'percentage') {
          discount = subtotal * (value / 100);
          if (appliedCoupon.max_discount && appliedCoupon.max_discount > 0) {
            discount = Math.min(discount, appliedCoupon.max_discount);
          }
        } else {
          discount = Math.min(subtotal, value);
        }
        return Math.round(discount * 100) / 100;
      },

      getTotalEntries: () => {
        const { items } = get();
        return items.reduce((sum, item) => {
          const entries = calculateEntries(item.price, item);
          return sum + entries * item.quantity;
        }, 0);
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        // Free shipping over $100
        return subtotal >= 100 ? 0 : 8.99;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const shipping = get().getShipping();
        return Math.max(0, subtotal - discount) + shipping;
      },
    }),
    {
      name: 'border_cart',
      partialize: (state) => ({
        items: state.items.map((item) => ({
          ...item,
          image: item.image && item.image.startsWith('data:image') && item.image.length > 20000 ? '' : item.image,
        })),
        appliedCoupon: state.appliedCoupon,
      }),
    }
  )
);

export { useCartStore };
