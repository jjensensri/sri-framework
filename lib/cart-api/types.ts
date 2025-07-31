export type AccessToken = {
  access_token: string;
};

export type SKUOptionsSchema = {
  name: string;
  value: string;
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
  properties?: any;
};

export type LineItem = {
  id: string;
  state: string;
  productId?: string;
  productName?: string;
  productType?: string;
  sku: string;
  skuName?: string;
  skuOptions?: SKUOptionsSchema[];
  quantity: number;
  price: {
    purchasePrice: number;
    totalPurchasePrice: number;
    originalPrice?: number;
    totalOriginalPrice?: number;
    lineItemSubtotal: number;
    lineItemTotal: number;
  };
  shippingDetails: ShippingDetailsSchema[];
  itemDiscounts: DiscountsInfoSchema;
  itemTaxes: {
    total: number;
    taxCode: string;
    taxRate?: number;
    country?: string;
    state?: string;
    subRates?: TaxSubRateSchema[];
  };
  lastAvailabilityCheck: Date;
  properties?: any;
};

export type Cart = {
  id: string | undefined;
  currency: string;
  country: string;
  shippingMode: string;
  deleteAfterDays: number;
  enforceInventory: boolean;
  origin: string;
  state: string;
  shippingGroups: [];
  channelId: string | undefined;
  channelKey: string | undefined;
  customerId: string | undefined;
  isAnonymous: boolean;
  shippingAddresses: [];
  lineItems: LineItem[];
  pricingSummary: {
    totalLineItemPurchasePrice: number;
    totalLineItemOriginalPrice: number;
    totalItemDiscount: number;
    totalShipping: number;
    totalShippingDiscount: number;
    totalDiscounts: number;
    totalTax: number;
    subtotal: number;
    grandTotal: number;
  };
  taxInfo: {
    total: number;
    taxCode: string;
  };
  orderDiscounts: {
    total: number;
    discounts: [];
  };
  version: number;
};
