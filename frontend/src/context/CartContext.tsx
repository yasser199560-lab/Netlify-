import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import api from "../api/axiosInstance";
import { Cart } from "../types";
import { useAuth } from "./AuthContext";

interface CartContextValue {
  cart: Cart | null;
  loading: boolean;
  getQuantity: (productId: string) => number;
  addToCart: (productId: string) => Promise<void>;
  setQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

// Keeps a single source of truth for the customer's cart, so the +/- quantity
// stepper looks the same whether you're adding an item from the dashboard,
// a store page, or adjusting it on the cart/checkout screen itself.
export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user || user.role !== "customer") {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get<Cart>("/cart");
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getQuantity = (productId: string) => {
    return cart?.items.find((i) => i.productId._id === productId)?.quantity ?? 0;
  };

  const addToCart = async (productId: string) => {
    const { data } = await api.post<Cart>("/cart/items", { productId, quantity: 1 });
    setCart(data);
  };

  const setQuantity = async (productId: string, quantity: number) => {
    const { data } = await api.patch<Cart>(`/cart/items/${productId}`, { quantity });
    setCart(data);
  };

  const removeFromCart = async (productId: string) => {
    const { data } = await api.delete<Cart>(`/cart/items/${productId}`);
    setCart(data);
  };

  return (
    <CartContext.Provider value={{ cart, loading, getQuantity, addToCart, setQuantity, removeFromCart, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside a CartProvider");
  return ctx;
}
