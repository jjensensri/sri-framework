export type AccessToken = {
    access_token: string;
};

export interface LineItem {
    id: string;
    sku: string;
    price: number;
    quantity: number;
    categories: string[];
};

export interface ShippingAddress {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
};

export interface CalculatePromotionsRequest {
    currency: string;
    channelKey: string;
    country: string;
    customer: {
        customerGroups: string[];
    };
    totalShippingCost: number;
    items: LineItem[];
}

export interface PromotionInfo {
    id: string;
    name: string;
}

export interface PromotionItem {
    promotion: PromotionInfo;
    type: string;
    sku?: string;
    price?: number;
    discount: number;
    quantity?: number;
}

export interface CalculatePromotionsResponse {
    items: PromotionItem[];
}