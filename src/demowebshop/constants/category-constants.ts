import { DemoWebShopLabels } from "@constants/labels/demowebshop-labels";

/**
 * Categories under test, each bundling the navigation slug with its on-page
 * title so a spec targeting one pulls both from a single source (title stays
 * canonically in labels; this only references it).
 */
export const CATEGORIES = {
  APPAREL_SHOES: {
    slug: "apparel-shoes",
    title: DemoWebShopLabels.APPAREL_SHOES_CATEGORY,
  },
} as const;

export type Category = (typeof CATEGORIES)[keyof typeof CATEGORIES];

/**
 * Full parent→subcategory tree from the store's top navigation. Only these two
 * categories have subcategories; names match the on-page nav and breadcrumb text.
 */
export const CATEGORY_TREE = [
  {
    category: "Computers",
    slug: "computers",
    subCategories: ["Desktops", "Notebooks", "Accessories"],
  },
  { category: "Electronics", slug: "electronics", subCategories: ["Camera, photo", "Cell phones"] },
] as const;

/**
 * Sort options whose expected order is derivable from on-page data (names,
 * prices), so the resulting order can be verified directly. `order` names the
 * check to apply.
 */
export const DERIVABLE_SORT_OPTIONS = [
  { label: "Name: A to Z", order: "name-asc" },
  { label: "Name: Z to A", order: "name-desc" },
  { label: "Price: Low to High", order: "price-asc" },
  { label: "Price: High to Low", order: "price-desc" },
] as const;

/**
 * Server-defined sort options (backend rank / creation date). Their expected
 * order is not derivable from the page, so tests only assert the sort applies
 * and the list stays populated — not that the order is correct.
 */
export const SERVER_SORT_OPTIONS = [{ label: "Position" }, { label: "Created on" }] as const;
