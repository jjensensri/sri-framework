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

  // todo: merge in the properties from the product catalog necessary to render the cart & side cart.
  // todo: you can also pass in custom properties to the addToCart call so you don't have to call
  //       the product catalog. you would have to update the addToCart call to accept these properties
  const cart = use(context.cartPromise);
  cart?.lineItems.map(async (item, i) => {
    const sku = item?.sku.toLowerCase();
    const product = await getProductBySku(sku);
    if (!product) {
      return;
    }

    item.handle = product.handle;
    item.featuredImage = product.featuredImage.url;
    item.productName = product.title;
    item.skuOptions = {};

    const variant = product.variants.find((i) => i.id === sku);
    variant?.selectedOptions?.map((option) => {
      item.skuOptions![option.name] = option.value;
    });
  });

  return {
    cart: use(context.cartPromise),
    cartQuantity: use(context.cartPromise)
      ?.lineItems?.flatMap((i) => i.quantity)
      .reduce((total, currentValue) => total + currentValue, 0),
  };
}
