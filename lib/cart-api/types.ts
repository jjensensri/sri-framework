export type AccessToken = {
  access_token: string;
};

export type SKUOptionsSchema = {
  [key: string]: string;
};

export type TaxSubRateSchema = {
  name: string;
  amount: number;
};

export type DiscountSchema = {
  id: string;
  amount: number;
  name: string;
  description: string;
};

export type DiscountsInfoSchema = {
  total: number;
  discounts?: DiscountSchema[];
};

export type ShippingDetailsSchema = {
  id: string;
  shippingGroupId: string;
  quantity: number;
  properties?: any; // todo
};

export type LineItem = {
  categories?: string[];
  featuredImage?: string;
  handle?: string;
  id: string;
  itemDiscounts: DiscountsInfoSchema;
  itemTaxes: {
    total: number;
    taxCode?: string;
    taxRate?: number;
    country?: string;
    state?: string;
    subRates?: TaxSubRateSchema[];
  };
  lastAvailabilityCheck?: string;
  price: {
    lineItemSubtotal: number;
    lineItemTotal: number;
    originalPrice?: number;
    purchasePrice: number;
    totalOriginalPrice?: number;
    totalPurchasePrice: number;
  };
  productId?: string;
  productName?: string;
  productType?: string;
  properties?: any; // todo
  quantity: number;
  shippingDetails: ShippingDetailsSchema[];
  sku: string;
  skuName?: string;
  skuOptions?: SKUOptionsSchema;
  state: string;
  type: string;
};

export type Cart = {
  channelId?: string;
  channelKey?: string;
  country: string;
  currency: string;
  customer: {
    id: string;
    isAnonymous: boolean;
  };
  deleteAfterDays: number;
  enforceInventory: boolean;
  id?: string;
  lineItems: LineItem[];
  orderDiscounts: {
    discounts: any[]; // todo
    total: number;
  };
  origin: string;
  pricingSummary: {
    grandTotal: number;
    subtotal: number;
    totalDiscounts: number;
    totalItemDiscount: number;
    totalLineItemOriginalPrice: number;
    totalLineItemPurchasePrice: number;
    totalOrderDiscount: number;
    totalShipping: number;
    totalShippingDiscount: number;
    totalTax: number;
  };
  shippingAddresses: any[]; // todo
  shippingGroups: any[]; // todo
  shippingMode: string;
  state: string;
  taxInfo: {
    total: number;
    taxCode?: string;
  };
  version: number;
};


export type CartResponse = {
  cart: Cart;
  status: any[];
};
