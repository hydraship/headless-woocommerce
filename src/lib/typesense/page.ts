import { env } from '@src/lib/env';
import siteData from '@public/site.json';
import { getTypesenseClient } from '@src/lib/typesense';
import client from '@src/lib/typesense/client';
import TS_CONFIG from '@src/lib/typesense/config';
import { ITSPage } from '@src/lib/typesense/types';
import { PageRoute, PageSchema, PageSlugs } from '@src/schemas/page-schema';
import { isEmpty, reduce } from 'lodash';
import { ProductTaxonomy } from '@src/models/product/types';
import { SearchResponse, SearchResponseHit } from 'typesense/lib/Typesense/Documents';
import { Route, RoutesMap } from '@src/lib/types/route';
const { NEXT_PUBLIC_STORE_ID } = env();

export type PageThumbnail = {
  title?: string;
  altText?: string;
  src?: string;
};

export type PageTaxonomy = ProductTaxonomy;

export type PageTypesenseResponse = {
  name: string;
  permalink: string;
  thumbnail: PageThumbnail;
  slug: string;
  updatedAt?: number;
  publishedAt?: number;
  content?: string;
  template: string;
  taxonomies: PageTaxonomy[];
  metaData?: Record<string, unknown>;
};

export class Page {
  static async find(count?: number): Promise<PageTypesenseResponse[]> {
    if (!count) return [];

    const searchParameters = {
      q: '*',
      query_by: 'name',
      page: 1,
      per_page: count ?? 100,
      include_fields: 'name,permalink,thumbnail,slug,updatedAt,publishedAt,content',
      sort_by: 'publishedAt:desc',
    };

    const response = await getTypesenseClient()
      .collections<PageTypesenseResponse>(`page-${NEXT_PUBLIC_STORE_ID}`)
      .documents()
      .search(searchParameters);
    const results = response.hits?.map((hit) => hit.document);
    return results || [];
  }

  static async findByThumbnail(): Promise<PageTypesenseResponse[]> {
    const searchParameters = {
      q: '*',
      query_by: 'name',
      page: 1,
      per_page: 250,
      include_fields: 'name,permalink,thumbnail,slug,updatedAt,publishedAt,content',
      sort_by: 'publishedAt:desc',
    };

    const response = await getTypesenseClient()
      .collections<PageTypesenseResponse>(`page-${NEXT_PUBLIC_STORE_ID}`)
      .documents()
      .search(searchParameters);
    const results = response.hits?.map((hit) => hit.document);

    return (
      reduce(
        results,
        (result: PageTypesenseResponse[], page: PageTypesenseResponse) => {
          if (!isEmpty(page?.thumbnail) && page?.thumbnail?.src) {
            result.push(page);
          }

          return result;
        },
        []
      ) || []
    );
  }
}

export const getPageBySlug = async (slug: string): Promise<ITSPage | null> => {
  const searchParameters = {
    q: '*',
    query_by: 'slug',
    filter_by: `slug:=[${slug}]`,
    sort_by: '_text_match:desc',
  };

  const results = await client
    .collections(TS_CONFIG.collectionNames.page)
    .documents()
    .search(searchParameters);

  const found = null;
  if (typeof results.hits !== 'undefined' && results.hits[0]) {
    const tsPage: ITSPage = JSON.parse(JSON.stringify(results.hits[0].document));
    return tsPage;
  }
  return found;
};

export const getPageByPermalink = async (permalink: string): Promise<ITSPage | null> => {
  const searchParameters = {
    q: '*',
    query_by: 'permalink',
    filter_by: `permalink:=${permalink}`,
    sort_by: '_text_match:desc',
  };

  const results = await client
    .collections(TS_CONFIG.collectionNames.page)
    .documents()
    .search(searchParameters);

  const found = null;
  if (typeof results.hits !== 'undefined' && results.hits[0]) {
    const tsPage: ITSPage = JSON.parse(JSON.stringify(results.hits[0].document));
    return tsPage;
  }
  return found;
};

const EXCLUDED_PAGE_SLUGS = [siteData.blogPageSlug];
/**
 * We will use this function to get all the page/post slugs so that we can rebuild those pages in the frontend later
 *
 * @param result this is an optional parameter that we need to remove later on.
 * @returns string[]
 */
export const getPageSlugs = async (): Promise<string[]> => {
  const slugs: string[] = [];

  if (!siteData.wpPageHeadless) {
    // We push the home page slug to the slugs as the only page for now is home page
    slugs.push(getHomePageSlug());
    return slugs;
  }

  const perPage = 250;
  const fetchPageSlugs = async (page: number) => {
    const searchParameters = {
      q: '*',
      query_by: 'name',
      page: page,
      per_page: perPage,
      include_fields: 'slug',
      filter_by: 'type:=[page]',
    };

    const results = await getTypesenseClient()
      .collections(TS_CONFIG.collectionNames.page)
      .documents()
      .search(searchParameters);

    results.hits?.forEach((hit) => {
      const parse = PageSlugs.safeParse(hit.document);
      if (parse.success && parse.data.slug) {
        const slug = parse.data.slug;
        if (!EXCLUDED_PAGE_SLUGS.includes(slug)) {
          slugs.push(slug);
        }
      }
    });

    return results;
  };

  // Fetch first page
  const initialResults = await fetchPageSlugs(1);

  // Calculate total remaining pages
  const totalRemainingPages = Math.ceil(initialResults.found / perPage);

  // Fetch remaining pages
  for (let i = 2; i <= totalRemainingPages; i++) {
    await fetchPageSlugs(i);
  }

  return slugs;
};

export const getPageRoutes = async (): Promise<RoutesMap> => {
  const routes: RoutesMap = {};

  const perPage = 250;
  const fetchPageRoutes = async (page: number) => {
    const searchParameters = {
      q: '*',
      query_by: 'name',
      page: page,
      per_page: perPage,
      include_fields: 'id,slug,permalink,type',
    };

    const results = await getTypesenseClient()
      .collections(TS_CONFIG.collectionNames.page)
      .documents()
      .search(searchParameters);

    results.hits?.forEach((hit) => {
      const parse = PageRoute.safeParse(hit.document);
      if (parse.success) {
        const page = parse.data;
        const slug = page.slug;
        const permalink = page.permalink;
        if (permalink && !EXCLUDED_PAGE_SLUGS.includes(slug)) {
          routes[permalink] = {
            type: page.type === 'page' ? 'page' : 'post',
            id: parseInt(page.id),
            slug,
          };
        }
      }
    });

    return results;
  };

  // Fetch first page
  const initialResults = await fetchPageRoutes(1);

  // Calculate total remaining pages
  const totalRemainingPages = Math.ceil(initialResults.found / perPage);

  // Fetch remaining pages
  for (let i = 2; i <= totalRemainingPages; i++) {
    await fetchPageRoutes(i);
  }

  return routes;
};
/**
 *
 * @returns string The homepage slug base on the wordpress settings
 */
export const getHomePageSlug = () => {
  return siteData.homepageSlug;
};

export type PageQueryVars = {
  taxonomySlug?: string;
  termSlug?: string;
  postType?: string;
  page?: number;
  perPage?: number;
};

export const generatePageSearchParameters = (queryVars: PageQueryVars) => {
  // type = 'feature_product_slid' this is post type
  // taxonomies.slug = this is term slug
  // taxonomies.type  = this is taxonomy slug
  const filterByArr: string[] = [];
  if (typeof queryVars.taxonomySlug !== 'undefined' && queryVars.taxonomySlug) {
    filterByArr.push('taxonomies.type:=[`' + queryVars.taxonomySlug + '`]');
  }

  if (typeof queryVars.termSlug !== 'undefined' && queryVars.termSlug) {
    filterByArr.push('taxonomies.slug:=[`' + queryVars.termSlug + '`]');
  }

  if (typeof queryVars.postType !== 'undefined' && queryVars.postType) {
    filterByArr.push('type:=[`' + queryVars.postType + '`]');
  }

  const queryByString = 'slug';

  const searchParameters = {
    collection: TS_CONFIG.collectionNames.page,
    q: '*',
    query_by: queryByString,
    highlight_fields: queryByString,
    facet_by: 'taxonomies.slug,taxonomies.type,type,slug',
    per_page: queryVars.perPage ? queryVars.perPage : 1,
    page: queryVars.page ? queryVars.page : 1,
    max_facet_values: 200,
    filter_by: filterByArr.join(' && '),
  };

  return searchParameters;
};

export const transformToPageData = (hit: SearchResponseHit<{}>) => {
  return hit.document as PageTypesenseResponse;
};

export const transformToPagesData = async (results: SearchResponse<{}>) => {
  if (typeof results.hits !== 'undefined' && results.hits) {
    const pages = results.hits.map(async (doc) => {
      return await transformToPageData(doc);
    });
    return await Promise.all(pages);
  }

  return [];
};
