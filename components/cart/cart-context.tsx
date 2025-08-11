'use client';

import type { Cart } from '@lib/cart-api/types';
import React, { createContext, use, useContext } from 'react';
import { getProductBySku } from '@lib/catalog-api';

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

  // todo: currently we're passing in custom properties to the addToCart call so we don't have to call the product catalog
  // todo: if you want to use the product catalog, merge in the properties you want below
  // const cart = use(context.cartPromise);
  // cart?.lineItems.map(async (item, i) => {
  //   const product = await getProductBySku(item?.sku.toLowerCase() || '');
  //   if (!product) {
  //     return;
  //   }
  //   item.handle = product.handle;
  //   item.featuredImage = product.featuredImage.url;
  //   item.productName = product.title;
  // });

  return {
    cart: use(context.cartPromise),
    cartQuantity: use(context.cartPromise)
      ?.lineItems?.flatMap((i) => i.quantity)
      .reduce((total, currentValue) => total + currentValue, 0),
  };
}
