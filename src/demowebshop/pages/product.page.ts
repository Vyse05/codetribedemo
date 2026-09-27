import { Page, Locator } from "@playwright/test";
import { DemoWebShopPageUrls } from "@constants/demowebshop-page-urls";
import { DemoWebShopLabels } from "@constants/labels/demowebshop-labels";

/**
 * Page Object Model for the Demo Web Shop product-details page (PDP).
 *
 * Conventions (see AGENTS.md):
 *  - Keep selectors and interactions here; keep assertions in specs.
 *  - Locator priority: getByRole → id → plain CSS. The price `price-value-NN`
 *    class is dynamic, so prices are scoped by their stable container classes.
 *  - Expose getters only for locators specs assert on.
 */
export class ProductPage {
  private readonly selectors = {
    // Discounted PDPs render old-product-price; the actual price is the itemprop span.
    actualPrice: ".product-price span[itemprop='price']",
    oldPrice: ".old-product-price",
    // Main-product button; related-product tiles use .product-box-add-to-cart-button.
    addToCart: "input.add-to-cart-button",
    availability: ".stock .value",
  };

  constructor(private readonly page: Page) {}

  /** Navigate directly to a product-details page by slug. */
  async goto(slug: string): Promise<void> {
    await this.page.goto(DemoWebShopPageUrls.PRODUCT_BY_SLUG(slug));
  }

  /** Product name heading. */
  get title(): Locator {
    return this.page.getByRole("heading", { level: 1 });
  }

  /** Actual (currently charged) price. */
  get actualPrice(): Locator {
    return this.page.locator(this.selectors.actualPrice);
  }

  /** Original (struck-through) price; present only when discounted. */
  get oldPrice(): Locator {
    return this.page.locator(this.selectors.oldPrice);
  }

  /** "Add to cart" button for the main product (excludes related-product tiles). */
  get addToCart(): Locator {
    return this.page.locator(this.selectors.addToCart);
  }

  /** Availability value, e.g. "In stock" / "Out of stock". */
  get availability(): Locator {
    return this.page.locator(this.selectors.availability);
  }

  /**
   * Resolved availability. Gift cards, digital downloads, and training products
   * render no .stock element; with no product spec to say how they behave, a
   * missing stock element is treated as in stock (matches their purchasability).
   * Caveat: attribute-dependent PDPs may also lack .stock until a variant is
   * chosen, so this can mask a variant that is actually out of stock.
   */
  async resolvedAvailability(): Promise<string> {
    const availability = this.page.locator(this.selectors.availability);
    if ((await availability.count()) === 0) {
      return DemoWebShopLabels.IN_STOCK;
    }
    return (await availability.textContent())?.trim() ?? "";
  }

  /** Whether the main-product Add-to-Cart button is present (excludes related tiles). */
  async hasAddToCart(): Promise<boolean> {
    return (await this.addToCart.count()) > 0;
  }

  /** Wait for the PDP to finish rendering so presence/absence reads are reliable, not racing load. */
  async waitUntilReady(): Promise<void> {
    await this.title.waitFor();
  }
}
