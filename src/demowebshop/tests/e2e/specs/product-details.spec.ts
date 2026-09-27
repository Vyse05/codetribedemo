import { test, expect } from "@fixtures/demowebshop-e2e-fixtures";
import { DemoWebShopLabels } from "@constants/labels/demowebshop-labels";
import {
  AVAILABILITY_CONSISTENCY_POOL,
  IN_STOCK_TERMS_BY_PRICE_LAYOUT,
} from "@constants/search-constants";
import { Tags } from "@constants/tags";
import { expectedButtonPresence } from "@utils/availability";

/**
 * Product-details suite. The sanity tests guard that a product's title and price
 * carry from the search tile to the PDP; the availability hunter guards that
 * Add-to-Cart presence follows stock across the list, the PDP, and back.
 */
test.describe("Product Details", () => {
  for (const term of IN_STOCK_TERMS_BY_PRICE_LAYOUT) {
    test(
      `carries title and price from the list to the PDP for "${term}"`,
      { tag: Tags.SANITY },
      async ({ searchPage, productPage }) => {
        await searchPage.goto(term);
        const tile = await searchPage.readTile(searchPage.resultItems.first());
        await searchPage.openResult(0);

        await expect(productPage.title).toHaveText(tile.title);
        await expect(productPage.actualPrice).toHaveText(tile.actualPrice);
        expect(await productPage.resolvedAvailability()).toBe(DemoWebShopLabels.IN_STOCK);
        if (tile.oldPrice) {
          await expect(productPage.oldPrice).toContainText(tile.oldPrice);
        }
      },
    );
  }

  // Add-to-Cart must follow availability at every checkpoint. Expected state is derived
  // from each product's own stock, so any mismatch (either direction) is a real defect.
  for (const term of AVAILABILITY_CONSISTENCY_POOL) {
    test(
      `Add to cart presence follows availability for "${term}"`,
      { tag: Tags.REGRESSION },
      async ({ searchPage, productPage }) => {
        await searchPage.goto(term);
        const list = await searchPage.resultHasAddToCart(0);
        await searchPage.openResult(0);
        await productPage.waitUntilReady();
        const availability = await productPage.resolvedAvailability();
        const pdp = await productPage.hasAddToCart();
        await searchPage.back();
        await searchPage.waitUntilReady();
        const listAfter = await searchPage.resultHasAddToCart(0);

        expect({ list, pdp, listAfter }).toEqual(expectedButtonPresence(availability));
      },
    );
  }
});
