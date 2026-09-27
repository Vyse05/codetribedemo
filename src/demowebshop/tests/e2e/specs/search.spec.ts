import { test, expect } from "@fixtures/demowebshop-e2e-fixtures";
import { SEARCH_TERMS } from "@constants/search-constants";
import { Tags } from "@constants/tags";
import { isValidPrice } from "@utils/price";
import { writeSearchResultsReport } from "@utils/report";

test.describe("Product Search", () => {
  // The first term is the fixed @sanity representative; the rest are @regression coverage.
  const [representativeTerm] = SEARCH_TERMS;

  // Relevance + names: parameterised over every term, first sanity, rest regression.
  for (const term of SEARCH_TERMS) {
    const tag = term === representativeTerm ? Tags.SANITY : Tags.REGRESSION;
    test(
      `returns only relevant products and lists their names for "${term}"`,
      { tag },
      async ({ searchPage }) => {
        await searchPage.goto(term);
        const names = await searchPage.resultNames();
        expect(names.length).toBeGreaterThan(0);
        // Writes the names of results into a report @reports/search-results-<term>.md
        writeSearchResultsReport(term, names);
        for (const name of names) {
          expect(name.toLowerCase()).toContain(term.toLowerCase());
        }
      },
    );
  }

  test(
    "shows a valid name and price for each result",
    { tag: Tags.SANITY },
    async ({ searchPage }) => {
      await searchPage.goto(representativeTerm);
      for (const item of await searchPage.resultItems.all()) {
        await expect(searchPage.resultTitle(item)).not.toBeEmpty();
        expect(isValidPrice(await searchPage.resultPrice(item).textContent())).toBe(true);
        const oldPrice = searchPage.resultOldPrice(item);
        if (await oldPrice.count()) {
          expect(isValidPrice(await oldPrice.textContent())).toBe(true);
        }
      }
    },
  );

  test(
    "open a product-details page from the search results",
    { tag: Tags.SANITY },
    async ({ searchPage, productPage }) => {
      await searchPage.goto(representativeTerm);
      const href = await searchPage.resultHref(0);
      await searchPage.openResult(0);
      expect(searchPage.currentUrl).toContain(href);
      // A visible product heading confirms a real PDP rendered, not just a URL change.
      await expect(productPage.title).toBeVisible();
    },
  );
});
