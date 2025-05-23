import type { NextRequest } from 'next/server';
import { geolocation } from '@vercel/functions';
import { NextResponse } from 'next/server';
import { NextURL } from 'next/dist/server/web/next-url';

import CATEGORY_PATHS from '@public/categorypaths.json';
import configData from '@public/config.json';
import rawPageRoutes from '@public/routes/page.json';
import { getDefaultCountry, getRegionByCountry } from '@src/lib/helpers/country';
import { RoutesMap } from '@src/lib/types/route';

// Constants and patterns
export const PAGE_URL_PATTERN = /\/page\/\d+\//;
const BLOG_PAGE_PATTERN = /^blog\/page\/\d+$/;
const IMAGE_PATTERN = /\.(jpg|jpeg|png|gif|webp|svg|xml)$/i;
const WP_ADMIN_PATTERN = /\/wp-admin|\/wp-content/i;
const typedPageRoutes = rawPageRoutes as RoutesMap;

// Limit middleware pathname config
export const config = {
  matcher: [
    '/',
    '/shop/:path*',
    '/product/:path*',
    '/products/:path*',
    '/brand/:path*',
    '/product-category/:path*',
    '/brands',
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
  unstable_allowDynamic: ['/node_modules/lodash/lodash.js', '/node_modules/lodash/_root.js'],
};

// Helper functions
function stripSlashes(str: string): string {
  return str.replace(/^\/|\/$/g, '');
}

/**
 * @returns string The homepage slug based on the WordPress settings
 */
export const getHomePageSlug = () => configData.homepageSlug;

const createCountryResponse = (nextUrl: NextURL, currentCountry: string, geoCountry: string) => {
  const response = NextResponse.rewrite(nextUrl);
  response.cookies.set('currentCountry', currentCountry);
  response.cookies.set('geoCountry', geoCountry);
  return response;
};

const resolveCountry = (country: string) => {
  const region = getRegionByCountry(country);
  return region ? region.baseCountry : getDefaultCountry();
};

const isBlogPageUrl = (url: string): boolean => BLOG_PAGE_PATTERN.test(url);

export async function middleware(req: NextRequest) {
  // Skip processing for static assets, admin paths, or special requests
  if (
    IMAGE_PATTERN.test(req.nextUrl.pathname) ||
    WP_ADMIN_PATTERN.test(req.nextUrl.pathname) ||
    req.nextUrl.search.includes('esc-nextjs=1')
  ) {
    return NextResponse.next();
  }

  // Check if allowedProductPermalinks exists and is not empty
  const allowedPermalinks: string[] = Array.isArray(configData.allowedPermalinks)
    ? configData.allowedPermalinks
    : [];

  if (allowedPermalinks.length > 0) {
    // If the current product URL is not in the allowedPermalinks array, redirect to WordPress
    if (!allowedPermalinks.includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(
        new URL(`${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}${req.nextUrl.pathname}`, req.url),
        302
      );
    }
  }

  // Determine country from cookies or geolocation
  const { country: geoCountry = '' } = geolocation(req);
  const country = req.cookies.get('currentCountry')?.value || geoCountry;
  const currentCountry = resolveCountry(country);

  // Handle special product routes
  if (req.nextUrl.pathname.startsWith('/products/new')) {
    req.nextUrl.pathname = `/${currentCountry}/new`;
    return NextResponse.rewrite(req.nextUrl);
  }

  if (req.nextUrl.pathname.startsWith('/products/on-sale')) {
    req.nextUrl.pathname = `/${currentCountry}/on-sale`;
    return NextResponse.rewrite(req.nextUrl);
  }

  // Handle product pages
  if (req.nextUrl.pathname.startsWith(configData.woocommercePermalinks.product_base)) {
    const pathName = req.nextUrl.pathname;

    req.nextUrl.pathname = `/${currentCountry}${pathName}`;

    // Convert shop product URLs to product URLs
    if (/\/shop\/.+$/.test(pathName)) {
      req.nextUrl.pathname = `/${currentCountry}${pathName.replace('/shop/', '/product/')}`;
    }

    return createCountryResponse(req.nextUrl, currentCountry, geoCountry);
  }

  const pathname = req.nextUrl.pathname;
  const isCatalogPage = CATEGORY_PATHS.includes(pathname.replace(PAGE_URL_PATTERN, ''));

  // Handle category pages
  if (isCatalogPage) {
    req.nextUrl.pathname = `/${currentCountry}/product-category${pathname}`;
    return createCountryResponse(req.nextUrl, currentCountry, geoCountry);
  }

  if (req.nextUrl.pathname.startsWith('/brand') || req.nextUrl.pathname.startsWith('/brands')) {
    req.nextUrl.pathname = `/${currentCountry}${pathname}`;
    return createCountryResponse(req.nextUrl, currentCountry, geoCountry);
  }

  // Handle homepage
  if (pathname === '/') {
    const homepageSlug = getHomePageSlug();
    req.nextUrl.pathname = `/${currentCountry}/page/${homepageSlug}`;
    return createCountryResponse(req.nextUrl, currentCountry, geoCountry);
  }

  // Clean path for further processing
  const cleanPath = stripSlashes(pathname);

  // Handle shop page
  if (cleanPath === configData.shopPageSlug) {
    req.nextUrl.pathname = `/${currentCountry}/shop`;
    return createCountryResponse(req.nextUrl, currentCountry, geoCountry);
  }

  // Handle cart page
  if (cleanPath === configData.cartPageSlug) {
    req.nextUrl.pathname = `/${currentCountry}/cart`;
    return createCountryResponse(req.nextUrl, currentCountry, geoCountry);
  }

  // Handle WordPress pages if enabled
  if (configData.wpPageHeadless) {
    // Handle blog page
    if (cleanPath === configData.blogPageSlug) {
      req.nextUrl.pathname = `/${currentCountry}/blog`;
      return createCountryResponse(req.nextUrl, currentCountry, geoCountry);
    }

    // Handle blog pagination
    if (isBlogPageUrl(cleanPath)) {
      req.nextUrl.pathname = `/${currentCountry}/${cleanPath}/`;
      return createCountryResponse(req.nextUrl, currentCountry, geoCountry);
    }

    // @TODO we will handle parent child post/page url structure later

    // Handle other WordPress pages
    const permalink = `/${cleanPath}`;
    if (permalink in typedPageRoutes) {
      const route = typedPageRoutes[permalink];
      if (route.type === 'page') {
        req.nextUrl.pathname = `/${currentCountry}/page/${route.slug}`;
        return createCountryResponse(req.nextUrl, currentCountry, geoCountry);
      }
    }
  }

  // Handle WordPress posts if enabled
  if (configData.wpPostHeadless) {
    const permalink = `/${cleanPath}`;
    if (permalink in typedPageRoutes) {
      const route = typedPageRoutes[permalink];
      if (route.type === 'post') {
        req.nextUrl.pathname = `/${currentCountry}/post/${route.slug}`;
        return createCountryResponse(req.nextUrl, currentCountry, geoCountry);
      }
    }
  }

  // Handle search results
  if (['/search-results', '/search-results/'].includes(pathname)) {
    req.nextUrl.pathname = `/${currentCountry}${pathname}`;
    return createCountryResponse(req.nextUrl, currentCountry, geoCountry);
  }

  // Fall back to WordPress for non-catalog pages
  if (!isCatalogPage) {
    return NextResponse.rewrite(
      new URL(`${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}${pathname}`, req.url)
    );
  }

  // Let Next.js handle the request
  return NextResponse.next();
}
