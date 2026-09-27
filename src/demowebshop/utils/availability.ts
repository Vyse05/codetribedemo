import { DemoWebShopLabels } from "@constants/labels/demowebshop-labels";

/** Add-to-Cart button presence observed at each checkpoint of the buy flow. */
export type ButtonPresence = {
  /** On the search-results tile. */
  list: boolean;
  /** On the product-details page. */
  pdp: boolean;
  /** On the results tile again after navigating back from the PDP. */
  listAfter: boolean;
};

/**
 * Expected button presence derived from a product's own availability: in stock
 * ⇒ button everywhere, out of stock ⇒ button nowhere. Deriving from live state
 * (rather than a per-product flag) is what lets the test hunt contradictions.
 */
export function expectedButtonPresence(availability: string): ButtonPresence {
  const present = availability === DemoWebShopLabels.IN_STOCK;
  return { list: present, pdp: present, listAfter: present };
}
