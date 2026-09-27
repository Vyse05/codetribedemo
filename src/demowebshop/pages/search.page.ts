import { Page, Locator } from "@playwright/test";
import { DemoWebShopPageUrls } from "@constants/demowebshop-page-urls";
import { DemoWebShopLabels } from "@constants/labels/demowebshop-labels";
import { ProductTile } from "@typings/product-tile";

/**
 * Page Object Model for the Demo Web Shop product search results (`/search`).
 *
 * Conventions (see AGENTS.md):
 *  - Keep selectors and interactions here; keep assertions in specs.
 *  - Locator priority: getByRole → id → plain CSS. The result tile holds two
 *    links (thumbnail + title), so getByRole('link') would need .nth() — the
 *    title/price are scoped by their app class instead.
 *  - Expose getters only for locators specs assert on.
 */
export class SearchPage {
  private readonly selectors = {
    resultItem: ".search-results .item-box",
    resultTitle: ".product-title a",
    // Discounted tiles render both; non-discounted tiles have only actual-price.
    actualPrice: ".prices .actual-price",
    oldPrice: ".prices .old-price",
    description: ".description",
    image: ".picture img",
  };

  constructor(private readonly page: Page) {}

  /** Navigate directly to the results page for a term. */
  async goto(term: string): Promise<void> {
    await this.page.goto(DemoWebShopPageUrls.SEARCH_BY_TERM(term));
  }

  /** All product tiles in the results grid. */
  get resultItems(): Locator {
    return this.page.locator(this.selectors.resultItem);
  }

  /** Title link within a single result tile. */
  resultTitle(item: Locator): Locator {
    return item.locator(this.selectors.resultTitle);
  }

  /** Actual (currently charged) price within a result tile. */
  resultPrice(item: Locator): Locator {
    return item.locator(this.selectors.actualPrice);
  }

  /** Original (struck-through) price within a tile; present only when discounted. */
  resultOldPrice(item: Locator): Locator {
    return item.locator(this.selectors.oldPrice);
  }

  /** "Add to cart" button within a result tile. */
  resultAddToCart(item: Locator): Locator {
    return item.getByRole("button", { name: DemoWebShopLabels.ADD_TO_CART });
  }

  /**
   * Capture every field a result tile exposes as plain data. No assertions —
   * specs read what they need and judge it; a missing field surfaces there.
   */
  async readTile(item: Locator): Promise<ProductTile> {
    const oldPrice = this.resultOldPrice(item);
    const description = item.locator(this.selectors.description);
    return {
      title: (await this.resultTitle(item).textContent())?.trim() ?? "",
      href: (await this.resultTitle(item).getAttribute("href")) ?? "",
      description: (await description.count())
        ? ((await description.textContent())?.trim() ?? "")
        : "",
      actualPrice: (await this.resultPrice(item).textContent())?.trim() ?? "",
      oldPrice: (await oldPrice.count())
        ? ((await oldPrice.textContent())?.trim() ?? "")
        : undefined,
      imageSrc: (await item.locator(this.selectors.image).getAttribute("src")) ?? "",
      hasAddToCart: (await this.resultAddToCart(item).count()) > 0,
    };
  }

  /** Collected trimmed names of all result tiles. */
  async resultNames(): Promise<string[]> {
    return (await this.resultTitle(this.resultItems).allTextContents()).map(name => name.trim());
  }

  /** Relative link target of the title link for the result at the given index. */
  async resultHref(index: number): Promise<string> {
    return (await this.resultTitle(this.resultItems.nth(index)).getAttribute("href")) ?? "";
  }

  /** Current page URL. */
  get currentUrl(): string {
    return this.page.url();
  }

  /** Open the product-details page for the result at the given index. */
  async openResult(index: number): Promise<void> {
    await this.resultTitle(this.resultItems.nth(index)).click();
  }

  /** Return to the previous page (e.g. the results listing after opening a PDP). */
  async back(): Promise<void> {
    await this.page.goBack();
  }

  /** Whether the result at the given index renders an Add-to-Cart button. */
  async resultHasAddToCart(index: number): Promise<boolean> {
    return (await this.resultAddToCart(this.resultItems.nth(index)).count()) > 0;
  }

  /** Wait for the results grid to finish rendering so tile reads are reliable, not racing load. */
  async waitUntilReady(): Promise<void> {
    await this.resultItems.first().waitFor();
  }
}
