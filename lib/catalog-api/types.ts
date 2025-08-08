// todo: cms
// todo: josh -- (currently based on shopify product)

export type Image = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type Price = {
  amount: string;
  currencyCode: string;
};

export type Option = {
  id: string;
  name: string;
  values: string[];
};

export type SkuOption = {
  name: string;
  value: string;
};

export type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SkuOption[];
  price: Price;
};

export type Product = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  options: Option[];
  priceRange: {
    maxVariantPrice: Price;
    minVariantPrice: Price;
  };
  featuredImage: Image;
  seo: {
    description?: string | null;
    title?: string | null;
  };
  tags: string[];
  updatedAt: string;
  images: Image[];
  variants: Variant[];
};

export type Collection = {
  title: string;
  description: string;
  handle: string;
  seo: {
    title: string;
    description: string;
  };
  products: Product[];
};
