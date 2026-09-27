/**
 * Search-related constants for the Demo Web Shop: the pool of terms specs draw
 * from. Keep test data out of specs.
 */

/** Terms with clean, name-relevant results. "fiction" surfaces discounted Books (old + actual price). */
export const SEARCH_TERMS = ["laptop", "computer", "jewelry", "fiction"] as const;

/** A single term from the pool. */
export type SearchTerm = (typeof SEARCH_TERMS)[number];

/** Terms that isolate a specific product for deterministic product-details checks. */
export const PRODUCT_TERMS = {
  // Non-discounted, in-stock product (single price).
  NON_DISCOUNTED: "laptop",
  // Discounted, in-stock product (old + actual price).
  DISCOUNTED: "fiction",
  // Out of stock (Diamond Pave Earrings).
  OUT_OF_STOCK: "earrings",
} as const;

/** In-stock terms, one per price layout, for the title/price consistency checks. */
export const IN_STOCK_TERMS_BY_PRICE_LAYOUT = [
  PRODUCT_TERMS.NON_DISCOUNTED,
  PRODUCT_TERMS.DISCOUNTED,
] as const;

/**
 * Curated cross-category pool for the Add-to-Cart availability rule: for each
 * product, in stock ⇒ button on list + PDP, out of stock ⇒ button on neither.
 * The test derives the expectation from the product's own live availability, so
 * it hunts contradictions rather than asserting a product is broken. Some
 * members currently violate the rule (documented) and fail by design.
 */
export const AVAILABILITY_CONSISTENCY_POOL = [
  PRODUCT_TERMS.NON_DISCOUNTED, // laptop — in stock, button both (consistent)
  PRODUCT_TERMS.DISCOUNTED, // fiction — in stock, button both (consistent)
  PRODUCT_TERMS.OUT_OF_STOCK, // earrings — out of stock, no button (consistent)
  "sneaker", // Blue and green Sneaker — in stock configurable, button both (consistent)
  "handbag", // out of stock yet keeps the button on both (bug)
  "bracelet", // in stock yet no button on either (bug)
  "camcorder", // in stock yet no button on either (bug)
  "desktop", // in stock yet no button on either (bug)
] as const;
