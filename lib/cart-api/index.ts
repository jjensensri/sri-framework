import { cookies } from 'next/headers';
import { AccessToken, Cart, CartResponse } from './types';

const apiHost = process.env.API_HOST;
const orgId = process.env.ORG_ID;
const channelKey = process.env.CHANNEL_KEY;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
let accessToken = '';

// todo: zach -- return real data
import cart from '@app/data/cart.json';

export async function cartApiFetch<T>({
  endpoint,
  method,
  headers,
  payload,
}: {
  endpoint: string;
  method?: string;
  headers?: HeadersInit;
  payload?: object;
}): Promise<{ status: number; body: T } | never> {
  const requestOptions: RequestInit = {
    method: method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...headers,
    },
  };

  if (method?.toLowerCase() === 'post') {
    requestOptions.body = JSON.stringify(payload);
  }

  try {
    const result = await fetch(`${apiHost}${endpoint}`, requestOptions);
    const body = await result.json();

    if (body.errors) {
      console.error(body.errors[0]);
      throw body.errors[0];
    }

    if (result.status === 401) {
      // fetch new access token
      await fetchAccessToken();
    }

    return {
      status: result.status,
      body,
    };
  } catch (e) {
    console.error('catch: ', e);
    throw {
      error: e,
      payload,
    };
  }
}

export async function fetchAccessToken(): Promise<string> {
  const auth = btoa(`${clientId}:${clientSecret}`);
  const res = await fetch(
    `${apiHost}/admin/orgs/${orgId}/channels/${channelKey}/api-clients/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({ scopes: ['cart:read', 'cart:write'] }),
    }
  );

  const text = await res.text();

  if (!res.ok) {
    console.error(`Token request failed [${res.status}]:`, text);
    throw new Error(`Token fetch error: ${text}`);
  }

  let body;
  try {
    body = JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse response as JSON:', text);
    throw new Error(`Invalid JSON: ${text}`);
  }

  const token = (body as AccessToken).access_token || '';
  accessToken = token;

  return token;
}

export async function getCart(): Promise<Cart | undefined> {
  const cartId = (await cookies()).get('cart-id')?.value;
  if (!cartId) {
    return undefined;
  }

  const res = await cartApiFetch({
    method: 'GET',
    endpoint: `/admin/carts/${channelKey}/carts/${cartId}`,
  });

  if (!res.body) {
    return undefined;
  }

  return (res.body as CartResponse).cart;
}

export async function createCart(): Promise<Cart> {
  let res = await cartApiFetch({
    endpoint: `/admin/carts/${channelKey}/carts`,
    method: 'POST',
    payload: {
      origin: 'C',
      enforceInventory: true,
    },
  });

  if (res.status === 401) {
    // there was a stale access token, it should be refreshed so try again once
    res = await cartApiFetch({
      endpoint: `/admin/carts/${channelKey}/carts`,
      method: 'POST',
      payload: {
        origin: 'C',
        enforceInventory: true,
      },
    });
  }

  return res.body as Cart;
}

export async function addToCart(skuId: string, quantity: number): Promise<Cart> {
  console.log('skuId: ', skuId);
  console.log('quantity: ', quantity);
  return cart.cart;
  // todo: zach

  // try {
  //   const cookieStore = await cookies();
  //   const cartId = cookieStore.get('cart-id')?.value;
  //   let cartVersion = Number(cookieStore.get('cart-version')?.value);
  //
  //   if (!cartId) {
  //     throw new Error('Cart ID is missing from cookies.');
  //   }
  //   if (!cartVersion || isNaN(cartVersion)) {
  //     // Doing this temporarily since the cookie doesn't exist yet
  //     cartVersion = 1;
  //   }
  //
  //   let addToCartRequest = {
  //     endpoint: `/admin/carts/${channelKey}/carts/${cartId}/line-items?version=${cartVersion}`,
  //     method: 'POST',
  //     payload: {
  //       sku: 'sku1',
  //       productId: '001D',
  //       productName: 'Shoes',
  //       productType: 'physical',
  //       skuName: 'Nike Shoe blue 7',
  //       skuOptions: {
  //         color: 'blue',
  //         size: '7',
  //       },
  //     },
  //   };
  //
  //   //TODO: Cart ID changed for me, need to figure out how to refresh my token without having to re-login/create a new cart
  //   // if the cart ID changes, that's a problem.
  //   const res = await cartApiFetch(addToCartRequest);
  //   if (res.status === 404) {
  //     // Add to cart failed to find, get the latest version to see
  //     // if that was the reason
  //     return await retryWithNewCartVersion(
  //       addToCartRequest,
  //       cartVersion,
  //       (newVersion) =>
  //         `/admin/carts/${channelKey}/carts/${cartId}/line-items?version=${newVersion}`
  //     );
  //   }
  //
  //   if (res.status >= 400) {
  //     console.error(`Add to cart failed with status ${res.status}`, res.body);
  //     throw new Error(`Add to cart failed: ${JSON.stringify(res.body)}`);
  //   }
  //   return res.body as Cart;
  // } catch (err) {
  //   console.error('Error adding to cart:', err);
  //
  //   // Optional: rethrow or return a safe fallback
  //   throw new Error(
  //     `Unable to add to cart. Reason: ${err instanceof Error ? err.message : 'Unknown error'}`
  //   );
  // }
}

export async function removeFromCart(lineItemId: string): Promise<Cart> {
  console.log('lineItemId: ', lineItemId);
  return cart.cart;
  // todo: zach

  // try {
  //   const cookieStore = await cookies();
  //   const cartId = cookieStore.get('cart-id')?.value;
  //   let cartVersion = Number(cookieStore.get('cart-version')?.value);
  //
  //   if (!cartId) {
  //     throw new Error('Cart ID is missing from cookies.');
  //   }
  //
  //   if (!cartVersion || isNaN(cartVersion)) {
  //     cartVersion = 1;
  //   }
  //
  //   let latestCart: Cart | undefined;
  //
  //   for (const lineId of lineIds) {
  //     const initialEndpoint = `/admin/carts/${channelKey}/carts/${cartId}/line-items/${lineId}?version=${cartVersion}`;
  //     const request = {
  //       endpoint: initialEndpoint,
  //       method: 'DELETE',
  //     };
  //
  //     const res = await cartApiFetch(request);
  //
  //     if (res.status === 404) {
  //       // Retry with updated cart version
  //       const retryResult = await retryWithNewCartVersion(
  //         request,
  //         cartVersion,
  //         (newVersion) =>
  //           `/admin/carts/${channelKey}/carts/${cartId}/line-items/${lineId}?version=${newVersion}`
  //       );
  //
  //       cartVersion = retryResult.version;
  //       latestCart = retryResult.cart;
  //       continue;
  //     }
  //
  //     if (res.status >= 400) {
  //       throw new Error(`Remove from cart failed: ${JSON.stringify(res.body)}`);
  //     }
  //
  //     latestCart = res.body as Cart;
  //   }
  //
  //   if (!latestCart) {
  //     throw new Error('No cart returned after removing items.');
  //   }
  //
  //   return latestCart;
  // } catch (err) {
  //   console.error('Error removing from cart:', err);
  //   throw new Error(
  //     `Unable to remove from cart. Reason: ${err instanceof Error ? err.message : 'Unknown error'}`
  //   );
  // }
}

async function retryWithNewCartVersion(
  request: { endpoint: string; method: string; payload?: any },
  oldVersion: number,
  updateEndpointVersion: (version: number) => string
): Promise<Cart> {
  console.log('request: ', request);
  console.log('oldVersion: ', oldVersion);
  console.log('updateEndpointVersion: ', updateEndpointVersion);
  return cart.cart;
  // todo: zach

  // const getCartResponse = await getCart();
  //
  // if (!getCartResponse || getCartResponse.version === oldVersion) {
  //   throw new Error(`Cart operation failed and cart version has not changed.`);
  // }
  //
  // // Replace the endpoint using the new version via callback
  // const updatedRequest = {
  //   ...request,
  //   endpoint: updateEndpointVersion(getCartResponse.version),
  // };
  //
  // const secondRes = await cartApiFetch(updatedRequest);
  //
  // if (secondRes.status >= 400) {
  //   throw new Error(`Retry failed: ${JSON.stringify(secondRes.body)}`);
  // }
  //
  // return secondRes?.body?.cart as Cart;
}

export async function updateCart(lineItemId: string, quantity: number): Promise<Cart> {
  console.log('lineItemId: ', lineItemId);
  console.log('quantity: ', quantity);
  return cart.cart;
  // todo: zach
}
