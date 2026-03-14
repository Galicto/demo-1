import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string, color: string) => void;
  updateQuantity: (id: string, color: string, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  addItem: (newItem) => {
    set((state) => {
      const existingItem = state.items.find(
        (i) => i.id === newItem.id && i.color === newItem.color
      );
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === newItem.id && i.color === newItem.color
              ? { ...i, quantity: i.quantity + (newItem.quantity || 1) }
              : i
          ),
          isOpen: true,
        };
      }
      return { items: [...state.items, { ...newItem, quantity: newItem.quantity || 1 }], isOpen: true };
    });
  },
  removeItem: (id, color) => {
    set((state) => ({
      items: state.items.filter((i) => !(i.id === id && i.color === color)),
    }));
  },
  updateQuantity: (id, color, quantity) => {
    if (quantity < 1) return;
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id && i.color === color ? { ...i, quantity } : i
      ),
    }));
  },
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  clearCart: () => set({ items: [] }),
  getCartTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));
