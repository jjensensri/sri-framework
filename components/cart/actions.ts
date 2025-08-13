'use server';

import { addToCart, createCart, getCart, removeFromCart, updateCart } from '@lib/cart-api';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function addItem(
  prevState: any,
  payload: {
    skuId: string;
    quantity: number;
  }
): Promise<string> {
  const { skuId, quantity } = payload;

  if (!skuId) {
    return 'Error adding item to cart';
  }

  try {
    await addToCart(skuId, quantity || 1);
    return 'Item added to cart successfully';
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, lineItemId: string): Promise<string> {
  try {
    const cart = await getCart();

    if (!cart) {
      return 'Error fetching cart';
    }

    const lineItem: any = cart.lineItems?.find((line: any) => line.id === lineItemId);

    if (lineItem && lineItem?.id) {
      try {
        await removeFromCart([lineItemId]);
        return 'Item removed from cart successfully';
      } catch (e) {
        console.error(e);
        return 'Error removing item from cart';
      }
    } else {
      return 'Item not found in cart';
    }
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItem(
  prevState: any,
  payload: {
    lineItemId: string;
    quantity: number;
  }
): Promise<string> {
  const { lineItemId, quantity } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return 'Error fetching cart';
    }

    const lineItem: any = cart.lineItems?.find((line: any) => line.id === lineItemId);

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        try {
          await removeFromCart([lineItemId]);
          return 'Item updated successfully';
        } catch (e) {
          console.error(e);
          return 'Error updating item quantity';
        }
      } else {
        try {
          await updateCart(lineItemId, quantity);
          return 'Item updated successfully';
        } catch (e) {
          console.error(e);
          return 'Error updating item quantity';
        }
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      try {
        await addToCart(lineItemId, quantity);
        return 'Item updated successfully';
      } catch (e) {
        console.error(e);
        return 'Error updating item quantity';
      }
    } else {
      return 'How did you get here?';
    }
  } catch (e) {
    console.error(e);
    return 'Error updating item quantity';
  }
}

export async function redirectToCheckout() {
  redirect('/checkout');
}

export async function createCartAndSetCookie() {
  const cartId = (await cookies()).get('cart-id')?.value;
  if (cartId) {
    await getCart();
  } else {
    let cart = await createCart();
    (await cookies()).set('cart-id', cart.id!);
    (await cookies()).set('cart-version', (cart.version || 0).toString());
  }
}
