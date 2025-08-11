'use server';

import { TAGS } from '@lib/constants';
import { /*addToCart, createCart, getCart,*/ removeFromCart, updateCart } from '@lib/shopify';
import { addToCart, createCart, getCart /*, removeFromCart, updateCart*/ } from '@lib/cart-api';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getShippingCosts } from '@/lib/shipping-api';

export async function addItem(prevState: any, selectedVariantId: string | undefined) {
  if (!selectedVariantId) {
    return 'Error adding item to cart';
  }

  try {
    await getShippingCosts({
        "items": [
        {
          "productId": "PROD123",
          "sku": "SKU123",
          "quantity": 1,
          "price": 2599
        },
        {
          "productId": "PROD456",
          "sku": "SKU456",
          "quantity": 2,
          "price": 1000
        }
      ],
      "shippingAddress": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zip": "90210",
        "country": "US"
      },
      "currency": "USD",
      "channelKey": "ch11040",
      "country": "US",
      "shippingMethodId": "687fd23892cb3b54056e22c0"
   });
    await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  //   try {
  //     const cart = await getCart();
  //
  //     if (!cart) {
  //       return 'Error fetching cart';
  //     }
  //
  //     const lineItem = cart.lines.find((line) => line.merchandise.id === merchandiseId);
  //
  //     if (lineItem && lineItem.id) {
  //       await removeFromCart([lineItem.id]);
  //       revalidateTag(TAGS.cart);
  //     } else {
  //       return 'Item not found in cart';
  //     }
  //   } catch (e) {
  //     return 'Error removing item from cart';
  //   }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
  //   const { merchandiseId, quantity } = payload;
  //
  //   try {
  //     const cart = await getCart();
  //
  //     if (!cart) {
  //       return 'Error fetching cart';
  //     }
  //
  //     const lineItem = cart.lines.find((line) => line.merchandise.id === merchandiseId);
  //
  //     if (lineItem && lineItem.id) {
  //       if (quantity === 0) {
  //         await removeFromCart([lineItem.id]);
  //       } else {
  //         await updateCart([
  //           {
  //             id: lineItem.id,
  //             merchandiseId,
  //             quantity,
  //           },
  //         ]);
  //       }
  //     } else if (quantity > 0) {
  //       // If the item doesn't exist in the cart and quantity > 0, add it
  //       await addToCart([{ merchandiseId, quantity }]);
  //     }
  //
  //     revalidateTag(TAGS.cart);
  //   } catch (e) {
  //     console.error(e);
  //     return 'Error updating item quantity';
  //   }
}

export async function redirectToCheckout() {
  let cart = await getCart();
  // redirect(cart!.checkoutUrl);
  redirect('/checkout');
}

export async function createCartAndSetCookie() {
  let cart = await createCart();
  console.log('createCartAndSetCookie: ', cart);
  (await cookies()).set('cart-id', cart.id!);
}
