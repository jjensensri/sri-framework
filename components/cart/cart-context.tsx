'use client';

import type { Cart } from '@lib/cart-api/types';
import React, { createContext, use, useContext } from 'react';

type CartContextType = {
  cartPromise: Promise<Cart | undefined>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
  cartPromise,
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}) {
  return <CartContext.Provider value={{ cartPromise }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return {
    cart: use(context.cartPromise),
    cartQuantity: use(context.cartPromise)
      ?.lineItems?.flatMap((i) => i.quantity)
      .reduce((total, currentValue) => total + currentValue, 0),
  };
}
