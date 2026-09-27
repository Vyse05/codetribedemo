/** Price parsing/validation for displayed money values (e.g. `10.00`, `1200.00`).*/

/** Format only: 1+ digits, a dot, exactly two decimals.*/
const PRICE_FORMAT = /^\d+\.\d{2}$/;

/** True when `text` is a well-formed price strictly greater than zero. */
export function isValidPrice(text: string | null): boolean {
  const value = text?.trim() ?? "";
  if (!PRICE_FORMAT.test(value)) {
    return false;
  }
  return Number(value) > 0;
}
