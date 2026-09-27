import { test, expect } from "@fixtures/demowebshop-e2e-fixtures";
import {
  CATEGORIES,
  DERIVABLE_SORT_OPTIONS,
  SERVER_SORT_OPTIONS,
} from "@constants/category-constants";
import { Tags } from "@constants/tags";
import {
  isNameAscending,
  isNameDescending,
  isPriceAscending,
  isPriceDescending,
} from "@utils/sort";

/**
 * Sorting suite on a multi-product category (Apparel & Shoes). Derivable orders
 * (name/price) are verified for correct ordering; server-defined orders
 * (Position, Created on) can't be derived from the page, so they are only
 * verified as applied with the list still populated.
 */
test.describe("Product Sorting", () => {
  const { slug } = CATEGORIES.APPAREL_SHOES;

  for (const { label, order } of DERIVABLE_SORT_OPTIONS) {
    // Name: A to Z is the representative happy path; the rest are regression coverage.
    const tag = order === "name-asc" ? Tags.SANITY : Tags.REGRESSION;
    test(`sorts Apparel & Shoes by "${label}"`, { tag }, async ({ categoryPage }) => {
      await categoryPage.goto(slug);
      await categoryPage.sortBy(label);

      await expect(categoryPage.sortSelect).toHaveValue(/orderby=/);
      expect(await categoryPage.products.count()).toBeGreaterThan(1);

      if (order === "name-asc") {
        expect(isNameAscending(await categoryPage.productTitles())).toBe(true);
      } else if (order === "name-desc") {
        expect(isNameDescending(await categoryPage.productTitles())).toBe(true);
      } else if (order === "price-asc") {
        expect(isPriceAscending(await categoryPage.productPrices())).toBe(true);
      } else if (order === "price-desc") {
        expect(isPriceDescending(await categoryPage.productPrices())).toBe(true);
      }
    });
  }

  // Server-defined orders: order can't be derived, so only assert applied + populated.
  for (const { label } of SERVER_SORT_OPTIONS) {
    test(
      `applies "${label}" sort and keeps products listed`,
      { tag: Tags.REGRESSION },
      async ({ categoryPage }) => {
        await categoryPage.goto(slug);
        await categoryPage.sortBy(label);

        await expect(categoryPage.sortSelect).toHaveValue(/orderby=/);
        expect(await categoryPage.products.count()).toBeGreaterThan(1);
      },
    );
  }
});
