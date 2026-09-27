/** Ordering checks for sorted product lists (names locale-aware, prices numeric). */

/** True when strings are in non-decreasing locale order (case-insensitive). */
export function isNameAscending(names: string[]): boolean {
  return names.every((name, i) => i === 0 || names[i - 1].localeCompare(name) <= 0);
}

/** True when strings are in non-increasing locale order (case-insensitive). */
export function isNameDescending(names: string[]): boolean {
  return names.every((name, i) => i === 0 || names[i - 1].localeCompare(name) >= 0);
}

/** True when numbers never decrease across the list. */
export function isPriceAscending(prices: number[]): boolean {
  return prices.every((price, i) => i === 0 || prices[i - 1] <= price);
}

/** True when numbers never increase across the list. */
export function isPriceDescending(prices: number[]): boolean {
  return prices.every((price, i) => i === 0 || prices[i - 1] >= price);
}
