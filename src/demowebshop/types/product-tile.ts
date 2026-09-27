/**
 * Snapshot of a product tile in a results/category grid (`.item-box`).
 *
 * A plain data capture read off the DOM — no assertions. Specs read whichever
 * fields they need and assert against them; a missing or malformed field is the
 * spec's problem to catch, not this type's.
 */
export type ProductTile = {
  /** Product name from the title link. */
  title: string;
  /** Relative PDP link from the title link's href. */
  href: string;
  /** Short blurb under the title; empty string when the tile has none. */
  description: string;
  /** Currently charged price, as displayed. */
  actualPrice: string;
  /** Struck-through original price; present only when the tile is discounted. */
  oldPrice?: string;
  /** Thumbnail image source; empty string when the tile has no picture. */
  imageSrc: string;
  /** Whether the tile renders its own Add-to-Cart button. */
  hasAddToCart: boolean;
};
