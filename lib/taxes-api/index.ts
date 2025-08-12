import { AccessToken, TaxCalculationRequest, TaxCalculationResponse } from './types';

const apiHost = process.env.API_HOST;
const orgId = process.env.ORG_ID;
const channelKey = process.env.CHANNEL_KEY;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
let accessToken = '';

export async function taxesApiFetch<T>({
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

export async function getTaxCalculation(request: TaxCalculationRequest): Promise<TaxCalculationResponse | undefined> {
    const res = await taxesApiFetch<TaxCalculationResponse>({
        method: 'POST',
        endpoint: `/admin/taxes/calculateTaxes`,
        payload: request
    });

    if (!res.body) {
        return undefined;
    }

    return res.body as TaxCalculationResponse;
}
