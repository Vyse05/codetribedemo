import { test as base, expect } from "@playwright/test";
import { SearchPage } from "@pages/search.page";
import { ProductPage } from "@pages/product.page";
import { CategoryPage } from "@pages/category.page";

/**
 * E2E fixtures for the Demo Web Shop module.
 *
 * Provides ready-to-use Page Objects. Extend with more page objects (cart,
 * checkout, …) as the suite grows.
 */
type DemoWebShopE2EFixtures = {
  searchPage: SearchPage;
  productPage: ProductPage;
  categoryPage: CategoryPage;
};

export const test = base.extend<DemoWebShopE2EFixtures>({
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  categoryPage: async ({ page }, use) => {
    await use(new CategoryPage(page));
  },
});

export { expect };
