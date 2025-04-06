// CartContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface CartItem {
  bookId: number;
  title: string;
  price: number;
  quantity: number;
}

// Our CartContext shape
interface CartContextValue {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (bookId: number) => void;
  clearCart: () => void;
  // You can add more functions like updateQuantity
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.bookId === item.bookId);
      if (existing) {
        // Already in cart, increment quantity
        return prevItems.map((i) =>
          i.bookId === item.bookId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        // New item
        return [...prevItems, item];
      }
    });
  };

  const removeFromCart = (bookId: number) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.bookId !== bookId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Helper hook to access the CartContext easily
export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
