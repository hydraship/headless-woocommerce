import { useEffect, useState } from 'react';
import { useUpdateEffect } from 'usehooks-ts';

import { env } from '@src/lib/env';
import TSTaxonomy from '../typesense/taxonomy';
import { ITSProductQueryResponse, ITSTaxonomyProductQueryVars } from '../typesense/types';

// Check if it's a true localhost environment (not Vercel preview)
const { NEXT_PUBLIC_WORDPRESS_SITE_URL } = env();
const isLocalEnvironment = NEXT_PUBLIC_WORDPRESS_SITE_URL?.includes('localhost') ||
                          NEXT_PUBLIC_WORDPRESS_SITE_URL?.includes('.local');

export const useFetchTsTaxonomyProducts = (
  queryVars: ITSTaxonomyProductQueryVars,
  fetchOnload = false
) => {
  const [data, setData] = useState<ITSProductQueryResponse>();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);

  const effect = fetchOnload ? useEffect : useUpdateEffect;
  effect(() => {
    const controller = new AbortController();
    setLoading(true);
    setIsFetched(false);
    const searchParameters = TSTaxonomy.generateSearchParams(queryVars);
    const searchOptions = {
      // Increase cache time for local environment to improve performance
      cacheSearchResultsForSeconds: isLocalEnvironment ? 300 : 60, // 5 minutes for local, 1 minute for production
      abortSignal: controller.signal,
    };

    TSTaxonomy.getProductDocument()
      .search(searchParameters, searchOptions)
      .then(async (results) => {
        setData(await TSTaxonomy.generateProductQueryResponse(queryVars, results));
      })
      .catch(setError)
      .finally(() => {
        setIsFetched(true);
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [queryVars]);

  return { data, error, loading, isFetched };
};
