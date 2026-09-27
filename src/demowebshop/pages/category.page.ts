import { Page, Locator } from "@playwright/test";
import { DemoWebShopPageUrls } from "@constants/demowebshop-page-urls";

/**
 * Page Object Model for a Demo Web Shop product category page (e.g.
 * `/apparel-shoes`).
 *
 * Conventions (see AGENTS.md):
 *  - Keep selectors and interactions here; keep assertions in specs.
 *  - Locator priority: getByRole → id → plain CSS.
 *  - Expose getters only for locators specs assert on.
 */
export class CategoryPage {
  private readonly selectors = {
    products: ".product-grid .item-box",
    currentPage: ".pager .current-page",
    nextPage: ".pager .next-page",
    pageLink: ".pager .individual-page a",
    categoryNav: ".block-category-navigation",
    breadcrumbCurrent: ".breadcrumb .current-item",
    sortSelect: "#products-orderby",
    productTitle: ".product-title a",
    productPrice: ".prices .actual-price",
  };

  constructor(private readonly page: Page) {}

  /** Navigate directly to a category by its slug. */
  async goto(slug: string): Promise<void> {
    await this.page.goto(DemoWebShopPageUrls.CATEGORY_BY_SLUG(slug));
  }

  /** Category name heading. */
  get title(): Locator {
    return this.page.getByRole("heading", { level: 1 });
  }

  /** Product tiles in the category grid. */
  get products(): Locator {
    return this.page.locator(this.selectors.products);
  }

  /** Active page number in the pager. */
  get currentPage(): Locator {
    return this.page.locator(this.selectors.currentPage);
  }

  /** The "Next" pager control; absent on the last page. */
  get nextPage(): Locator {
    return this.page.locator(this.selectors.nextPage);
  }

  /** Click the highest-numbered page link in the pager (jumps to the last page). */
  async goToLastPage(): Promise<void> {
    await this.page.locator(this.selectors.pageLink).last().click();
  }

  /** Select a category or subcategory by its link text in the left category nav. */
  async selectCategory(name: string): Promise<void> {
    await this.page
      .locator(this.selectors.categoryNav)
      .getByRole("link", { name, exact: true })
      .click();
  }

  /** Trailing breadcrumb item naming the currently selected category. */
  get breadcrumbCurrent(): Locator {
    return this.page.locator(this.selectors.breadcrumbCurrent);
  }

  /** Breadcrumb link for an ancestor category by its text. */
  breadcrumbLink(name: string): Locator {
    return this.page.locator(".breadcrumb").getByRole("link", { name, exact: true });
  }

  /** The "Sort by" dropdown. */
  get sortSelect(): Locator {
    return this.page.locator(this.selectors.sortSelect);
  }

  /** Choose a sort option by its visible label; the page reloads with the new order. */
  async sortBy(label: string): Promise<void> {
    await this.sortSelect.selectOption({ label });
  }

  /** Trimmed product titles in current display order. */
  async productTitles(): Promise<string[]> {
    return (await this.products.locator(this.selectors.productTitle).allTextContents()).map(t =>
      t.trim(),
    );
  }

  /** Product prices in current display order, as numbers. */
  async productPrices(): Promise<number[]> {
    const texts = await this.products.locator(this.selectors.productPrice).allTextContents();
    return texts.map(t => Number(t.trim()));
  }
}
