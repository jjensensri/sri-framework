export type AccessToken = {
    access_token: string;
};

export interface TaxItem {
    lineItemId: string;
    rate: number;
    tax: number;
    code: string;
};

export interface LineItem {
    id: string;
    productId: string;
    sku: string;
    quantity: number;
    price: number;
};

export interface ShippingAddress {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
};

export interface TaxCalculationRequest {
    items: LineItem[];
    shippingAddress: ShippingAddress;
    currency: string;
    channelKey: string;
    country: string;
};

export interface TaxCalculationResponse {
    items: TaxItem[];
};
