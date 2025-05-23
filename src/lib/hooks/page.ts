import client from '@src/lib/typesense/client';
import TS_CONFIG from '@src/lib/typesense/config';
import {
  generatePageSearchParameters,
  PageQueryVars,
  PageTypesenseResponse,
  transformToPagesData,
} from '@src/lib/typesense/page';
import { useEffect, useState } from 'react';

export const useFetchPosts = (queryVars: PageQueryVars) => {
  const [data, setData] = useState<PageTypesenseResponse[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const searchParameters = generatePageSearchParameters(queryVars);

    const searchOptions = {
      cacheSearchResultsForSeconds: 60,
      abortSignal: controller.signal,
    };

    client
      .collections(TS_CONFIG.collectionNames.page)
      .documents()
      .search(searchParameters, searchOptions)
      .then(async (results) => {
        const posts = await transformToPagesData(results);
        setData(posts);
      })
      .catch(setError)
      .finally(() => setLoading(false));

    return () => {
      controller.abort();
    };
  }, []);

  return { data, error, loading };
};
