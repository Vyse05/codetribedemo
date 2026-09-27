/**
 * Page URLs for the Demo Web Shop (paths relative to `BASE_URL`).
 *
 * Convention: uppercase keys for static routes, `BY_SLUG`-style functions for
 * parameterized routes.
 */
export const DemoWebShopPageUrls = {
  SEARCH_BY_TERM: (term: string): string => `/search?q=${encodeURIComponent(term)}`,
  CATEGORY_BY_SLUG: (slug: string): string => `/${slug}`,
  // Product PDPs are served at flat top-level slugs, same shape as categories.
  PRODUCT_BY_SLUG: (slug: string): string => `/${slug}`,
} as const;
