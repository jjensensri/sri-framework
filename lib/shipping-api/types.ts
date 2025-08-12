export type AccessToken = {
    access_token: string;
};

export type ShippingMethod = {
    id: string | undefined;
    carrier: string | undefined;
    name: string | undefined;
    minDays: number;
    maxDays: number;
    taxCode: string;
    provider: string;
    isActive: boolean;
    description: string;
}

export interface ShippingItem {
    productId: string;
    sku: string;
    quantity: number;
    price: number;
}

export interface ShippingAddress {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export interface ShippingMethodsRequest {
    items: ShippingItem[];
    shippingAddress: ShippingAddress;
    currency: string;
    channelKey: string;
    country: string;
    shippingMethodId?: string | undefined
}

export interface AvailableShippingMethodsResponse {
    shippingMethods: ShippingMethod[];
}

export interface ShippingCostResponse {
    name: string;
    cost: number;
}
