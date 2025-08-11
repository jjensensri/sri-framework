// todo: cms
// todo: josh

import collections from '@app/data/collections.json';
import products from '@app/data/catalog.json';
import { Collection, Product } from '@lib/catalog-api/types';

export async function getProduct(handle: string): Promise<Product | undefined> {
  return products.find((product) => product.handle === handle);
}

export async function getProductById(productId: string): Promise<Product | undefined> {
  return products.find((product) => product.id === productId);
}

export async function getProductBySku(sku: string): Promise<Product | undefined> {
  return products.find((product) => product.variants.find((variant) => variant.id === sku));
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  return products;
}

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  return products;
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  return collections.find((collection: Collection) => collection.handle === handle);
}

export async function getCollectionProducts(
  collectionName: string
): Promise<Product[] | undefined> {
  const collection = await getCollection(collectionName);
  return collection?.products;
}
