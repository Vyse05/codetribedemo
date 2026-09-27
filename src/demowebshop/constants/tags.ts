/**
 * Test tags for selective runs (e.g. `--grep @sanity`). Keep tag strings here
 * so specs share one source of truth.
 */
export const Tags = {
  // Core, must-pass happy paths.
  SANITY: "@sanity",
  // Coverage that falls outside priorities (exhaustive loops, edge cases).
  REGRESSION: "@regression",
} as const;
