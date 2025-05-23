import { Client as TypesenseClient } from 'typesense';

import { env } from '@src/lib/env';
import { ProductTypesenseResponse } from '@src/models/product';
import TS_CONFIG from '@src/lib/typesense/config';

const { NEXT_PUBLIC_STORE_ID, NEXT_PUBLIC_WORDPRESS_SITE_URL } = env();

// Check if it's a true localhost environment (not Vercel preview)
const isLocalEnvironment = NEXT_PUBLIC_WORDPRESS_SITE_URL?.includes('localhost') ||
                          NEXT_PUBLIC_WORDPRESS_SITE_URL?.includes('.local');

// Set MAX_QUERY_LIMIT based on environment
// 20 for localhost only, 250 for production and Vercel preview environments
export const MAX_QUERY_LIMIT = isLocalEnvironment ? 20 : 250;

const client = new TypesenseClient({
  apiKey: TS_CONFIG.server.apiKey as string, // Be sure to use an API key that only allows search operations
  nodes: TS_CONFIG.server.nodes,
  connectionTimeoutSeconds: 20,
  // Enable caching for local environment to improve performance
  cacheSearchResultsForSeconds: isLocalEnvironment ? 300 : 0, // 5 minutes cache for local environment
});

export const getTypesenseClient = () => client;

export class WoolessTypesense {
  static get product() {
    return client.collections<ProductTypesenseResponse>(`product-${NEXT_PUBLIC_STORE_ID}`);
  }
}
