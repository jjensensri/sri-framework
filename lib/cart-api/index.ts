import { cookies } from 'next/headers';
import { AccessToken, Cart } from './types';

const apiHost = process.env.API_HOST;
const orgId = process.env.ORG_ID;
const channelKey = process.env.CHANNEL_KEY;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
let accessToken = '';

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
      console.log('go get new access token');
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
  const res = await fetch(`${apiHost}/admin/orgs/${orgId}/channels/${channelKey}/api-clients/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({ scopes: ['cart:read', 'cart:write'] }),
  });

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

  // Old carts becomes `null` when you checkout.
  if (!res.body) {
    return undefined;
  }

  return res.body.cart as Cart;
}

export async function createCart(): Promise<Cart> {
  const res = await cartApiFetch({
    endpoint: `/admin/carts/${channelKey}/carts`,
    method: 'POST',
    payload: {
      origin: 'C',
      enforceInventory: true,
    },
  });

  return res.body as Cart;
}


export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get('cart-id')?.value;
    let cartVersion = Number(cookieStore.get('cart-version')?.value);

    if (!cartId) {
      throw new Error('Cart ID is missing from cookies.');
    }
    if (!cartVersion || isNaN(cartVersion)) {
      // Doing this temporarily since the cookie doesn't exist yet
      cartVersion = 1;
    }

    //TODO JOSH - need the proper payload
    let addToCartRequest = {
      endpoint: `/admin/carts/${channelKey}/carts/${cartId}/line-items?version=${cartVersion}`,
      method: 'POST',
      payload: {
        sku: 'sku1',
        productId: '001D',
        productName: 'Shoes',
        productType: 'physical',
        skuName: 'Nike Shoe blue 7',
        skuOptions: {
          color: 'blue',
          size: '7',
        },
      },
    }

    //TODO: Cart ID changed for me, need to figure out how to refresh my token without having to re-login/create a new cart
    // if the cart ID changes, that's a problem.
    const res = await cartApiFetch(addToCartRequest);
    if (res.status === 404) {
      // Add to cart failed to find, get the latest version to see
      // if that was the reason
      return await retryWithNewCartVersion(
        addToCartRequest,
        cartVersion,
        (newVersion) =>
          `/admin/carts/${channelKey}/carts/${cartId}/line-items?version=${newVersion}`
      );
    }

    if (res.status >= 400) {
      console.error(`Add to cart failed with status ${res.status}`, res.body);
      throw new Error(`Add to cart failed: ${JSON.stringify(res.body)}`);
    }
    return res.body as Cart;

  } catch (err) {
    console.error('Error adding to cart:', err);

    // Optional: rethrow or return a safe fallback
    throw new Error(`Unable to add to cart. Reason: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get('cart-id')?.value;
    let cartVersion = Number(cookieStore.get('cart-version')?.value);

    if (!cartId) {
      throw new Error('Cart ID is missing from cookies.');
    }

    if (!cartVersion || isNaN(cartVersion)) {
      cartVersion = 1;
    }

    let latestCart: Cart | undefined;

    for (const lineId of lineIds) {
      const initialEndpoint = `/admin/carts/${channelKey}/carts/${cartId}/line-items/${lineId}?version=${cartVersion}`;
      const request = {
        endpoint: initialEndpoint,
        method: 'DELETE',
      };

      const res = await cartApiFetch(request);

      if (res.status === 404) {
        // Retry with updated cart version
        const retryResult = await retryWithNewCartVersion(
          request,
          cartVersion,
          (newVersion) =>
            `/admin/carts/${channelKey}/carts/${cartId}/line-items/${lineId}?version=${newVersion}`
        );

        cartVersion = retryResult.version;
        latestCart = retryResult.cart;
        continue;
      }

      if (res.status >= 400) {
        throw new Error(`Remove from cart failed: ${JSON.stringify(res.body)}`);
      }

      latestCart = res.body as Cart;
    }

    if (!latestCart) {
      throw new Error('No cart returned after removing items.');
    }

    return latestCart;
  } catch (err) {
    console.error('Error removing from cart:', err);
    throw new Error(
      `Unable to remove from cart. Reason: ${err instanceof Error ? err.message : 'Unknown error'}`
    );
  }
}

async function retryWithNewCartVersion(
  request: { endpoint: string; method: string; payload?: any },
  oldVersion: number,
  updateEndpointVersion: (version: number) => string
): Promise<Cart> {
  const getCartResponse = await getCart();

  if (!getCartResponse || getCartResponse.version === oldVersion) {
    throw new Error(`Cart operation failed and cart version has not changed.`);
  }

  // Replace the endpoint using the new version via callback
  const updatedRequest = {
    ...request,
    endpoint: updateEndpointVersion(getCartResponse.version),
  };

  const secondRes = await cartApiFetch(updatedRequest);

  if (secondRes.status >= 400) {
    throw new Error(`Retry failed: ${JSON.stringify(secondRes.body)}`);
  }

  return secondRes?.body?.cart as Cart;
}

// export async function addToCart(
//   lines: { merchandiseId: string; quantity: number }[]
// ): Promise<Cart> {
//   const cartId = (await cookies()).get('cartId')?.value!;
//   const res = await cartApiFetch<ShopifyAddToCartOperation>({
//     query: addToCartMutation,
//     variables: {
//       cartId,
//       lines,
//     },
//   });
//   return reshapeCart(res.body.data.cartLinesAdd.cart);
// }
//
// export async function removeFromCart(lineIds: string[]): Promise<Cart> {
//   const cartId = (await cookies()).get('cartId')?.value!;
//   const res = await cartApiFetch<ShopifyRemoveFromCartOperation>({
//     query: removeFromCartMutation,
//     variables: {
//       cartId,
//       lineIds,
//     },
//   });
//
//   return reshapeCart(res.body.data.cartLinesRemove.cart);
// }
//
// export async function updateCart(
//   lines: { id: string; merchandiseId: string; quantity: number }[]
// ): Promise<Cart> {
//   const cartId = (await cookies()).get('cartId')?.value!;
//   const res = await cartApiFetch<ShopifyUpdateCartOperation>({
//     query: editCartItemsMutation,
//     variables: {
//       cartId,
//       lines,
//     },
//   });
//
//   return reshapeCart(res.body.data.cartLinesUpdate.cart);
// }

// TODO: do we need everything below here?

//
// const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
//   return array.edges.map((edge) => edge?.node);
// };
//
// const reshapeCart = (cart: ShopifyCart): Cart => {
//   if (!cart.cost?.totalTaxAmount) {
//     cart.cost.totalTaxAmount = {
//       amount: "0.0",
//       currencyCode: cart.currency,
//     };
//   }
//
//   return {
//     ...cart,
//     lines: removeEdgesAndNodes(cart.lines),
//   };
// };
//
// const reshapeCollection = (
//   collection: ShopifyCollection,
// ): Collection | undefined => {
//   if (!collection) {
//     return undefined;
//   }
//
//   return {
//     ...collection,
//     path: `/search/${collection.handle}`,
//   };
// };
//
// const reshapeCollections = (collections: ShopifyCollection[]) => {
//   const reshapedCollections = [];
//
//   for (const collection of collections) {
//     if (collection) {
//       const reshapedCollection = reshapeCollection(collection);
//
//       if (reshapedCollection) {
//         reshapedCollections.push(reshapedCollection);
//       }
//     }
//   }
//
//   return reshapedCollections;
// };
//
// const reshapeImages = (images: Connection<Image>, productTitle: string) => {
//   const flattened = removeEdgesAndNodes(images);
//
//   return flattened.map((image) => {
//     const filename = image.url.match(/.*\/(.*)\..*/)?.[1];
//     return {
//       ...image,
//       altText: image.altText || `${productTitle} - ${filename}`,
//     };
//   });
// };
//
// const reshapeProduct = (
//   product: ShopifyProduct,
//   filterHiddenProducts: boolean = true,
// ) => {
//   if (
//     !product ||
//     (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
//   ) {
//     return undefined;
//   }
//
//   const { images, variants, ...rest } = product;
//
//   return {
//     ...rest,
//     images: reshapeImages(images, product.title),
//     variants: removeEdgesAndNodes(variants),
//   };
// };
//
// const reshapeProducts = (products: ShopifyProduct[]) => {
//   const reshapedProducts = [];
//
//   for (const product of products) {
//     if (product) {
//       const reshapedProduct = reshapeProduct(product);
//
//       if (reshapedProduct) {
//         reshapedProducts.push(reshapedProduct);
//       }
//     }
//   }
//
//   return reshapedProducts;
// };
//
//
//
// export async function getCollection(
//   handle: string,
// ): Promise<Collection | undefined> {
//   "use cache";
//   cacheTag(TAGS.collections);
//   cacheLife("days");
//
//   const res = await cartApiFetch<ShopifyCollectionOperation>({
//     query: getCollectionQuery,
//     variables: {
//       handle,
//     },
//   });
//
//   return reshapeCollection(res.body.data.collection);
// }
//
// export async function getCollectionProducts({
//   collection,
//   reverse,
//   sortKey,
// }: {
//   collection: string;
//   reverse?: boolean;
//   sortKey?: string;
// }): Promise<Product[]> {
//   "use cache";
//   cacheTag(TAGS.collections, TAGS.products);
//   cacheLife("days");
//
//   const res = await cartApiFetch<ShopifyCollectionProductsOperation>({
//     query: getCollectionProductsQuery,
//     variables: {
//       handle: collection,
//       reverse,
//       sortKey: sortKey === "CREATED_AT" ? "CREATED" : sortKey,
//     },
//   });
//
//   if (!res.body.data.collection) {
//     console.log(`No collection found for \`${collection}\``);
//     return [];
//   }
//
//   return reshapeProducts(
//     removeEdgesAndNodes(res.body.data.collection.products),
//   );
// }
//
// export async function getCollections(): Promise<Collection[]> {
//   "use cache";
//   cacheTag(TAGS.collections);
//   cacheLife("days");
//
//   const res = await cartApiFetch<ShopifyCollectionsOperation>({
//     query: getCollectionsQuery,
//   });
//   const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
//   const collections = [
//     {
//       handle: "",
//       title: "All",
//       description: "All products",
//       seo: {
//         title: "All",
//         description: "All products",
//       },
//       path: "/search",
//       updatedAt: new Date().toISOString(),
//     },
//     // Filter out the `hidden` collections.
//     // Collections that start with `hidden-*` need to be hidden on the search page.
//     ...reshapeCollections(shopifyCollections).filter(
//       (collection) => !collection.handle.startsWith("hidden"),
//     ),
//   ];
//
//   return collections;
// }
//
// export async function getMenu(handle: string): Promise<Menu[]> {
//   "use cache";
//   cacheTag(TAGS.collections);
//   cacheLife("days");
//
//   const res = await cartApiFetch<ShopifyMenuOperation>({
//     query: getMenuQuery,
//     variables: {
//       handle,
//     },
//   });
//
//   return (
//     res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
//       title: item.title,
//       path: item.url.replace("/collections", "/search").replace("/pages", ""),
//     })) || []
//   );
// }
//
// export async function getPage(handle: string): Promise<Page> {
//   const res = await cartApiFetch<ShopifyPageOperation>({
//     query: getPageQuery,
//     variables: { handle },
//   });
//
//   return res.body.data.pageByHandle;
// }
//
// export async function getPages(): Promise<Page[]> {
//   const res = await cartApiFetch<ShopifyPagesOperation>({
//     query: getPagesQuery,
//   });
//
//   return removeEdgesAndNodes(res.body.data.pages);
// }
//
// export async function getProduct(handle: string): Promise<Product | undefined> {
//   "use cache";
//   cacheTag(TAGS.products);
//   cacheLife("days");
//
//   const res = await cartApiFetch<ShopifyProductOperation>({
//     query: getProductQuery,
//     variables: {
//       handle,
//     },
//   });
//
//   return reshapeProduct(res.body.data.product, false);
// }
//
// export async function getProductRecommendations(
//   productId: string,
// ): Promise<Product[]> {
//   "use cache";
//   cacheTag(TAGS.products);
//   cacheLife("days");
//
//   const res = await cartApiFetch<ShopifyProductRecommendationsOperation>({
//     query: getProductRecommendationsQuery,
//     variables: {
//       productId,
//     },
//   });
//
//   return reshapeProducts(res.body.data.productRecommendations);
// }
//
// export async function getProducts({
//   query,
//   reverse,
//   sortKey,
// }: {
//   query?: string;
//   reverse?: boolean;
//   sortKey?: string;
// }): Promise<Product[]> {
//   "use cache";
//   cacheTag(TAGS.products);
//   cacheLife("days");
//
//   const res = await cartApiFetch<ShopifyProductsOperation>({
//     query: getProductsQuery,
//     variables: {
//       query,
//       reverse,
//       sortKey,
//     },
//   });
//
//   return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
// }
//
// // This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
// export async function revalidate(req: NextRequest): Promise<NextResponse> {
//   // We always need to respond with a 200 status code to Shopify,
//   // otherwise it will continue to retry the request.
//   const collectionWebhooks = [
//     "collections/create",
//     "collections/delete",
//     "collections/update",
//   ];
//   const productWebhooks = [
//     "products/create",
//     "products/delete",
//     "products/update",
//   ];
//   const topic = (await headers()).get("x-shopify-topic") || "unknown";
//   const secret = req.nextUrl.searchParams.get("secret");
//   const isCollectionUpdate = collectionWebhooks.includes(topic);
//   const isProductUpdate = productWebhooks.includes(topic);
//
//   if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
//     console.error("Invalid revalidation secret.");
//     return NextResponse.json({ status: 401 });
//   }
//
//   if (!isCollectionUpdate && !isProductUpdate) {
//     // We don't need to revalidate anything for any other topics.
//     return NextResponse.json({ status: 200 });
//   }
//
//   if (isCollectionUpdate) {
//     revalidateTag(TAGS.collections);
//   }
//
//   if (isProductUpdate) {
//     revalidateTag(TAGS.products);
//   }
//
//   return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
// }
