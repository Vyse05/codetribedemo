# Test Cases — Demo Web Shop E2E

Test cases for the automated suite, mapped to their specs. Priority follows the
tag split in the [Test Plan](test-plan.md): **P1 = `@sanity`**, **P2 =
`@regression`**. Preconditions for all cases: the app is reachable at `BASE_URL`.

Parameterised cases (one `test()` run per data row) are noted in the steps.

## Product Search — `search.spec.ts`

### TC-01 — Search returns only relevant results and lists names · P1 (first term) / P2 (rest)
- **Steps:** For each term in `SEARCH_TERMS`, search → read result names.
- **Expected:** ≥1 result; every result name contains the term; names written to
  `reports/search-results-<term>.md`. *(Parameterised over every term; the first
  is `@sanity`, the rest `@regression` — this absorbs the former TC-04 exhaustive
  per-term case.)*

### TC-02 — Each result has a valid name and price · P1
- **Steps:** Search the representative term → iterate every result tile.
- **Expected:** each tile has a non-empty title and a valid price; when an old
  (discounted) price is shown, it is also valid.

### TC-03 — Open a product-details page from results · P1
- **Steps:** Search the representative term → click the first result.
- **Expected:** the resulting URL matches the tile's product link and the PDP
  renders (product heading visible).

## Product Details — `product-details.spec.ts`

### TC-05 — Tile title and price carry to the PDP · P1
- **Steps:** Search an in-stock term → capture the tile's title, price, and
  (if present) old price → open the PDP.
- **Expected:** PDP title and price match the tile; availability is "In stock";
  when discounted, the PDP old price matches. *(Parameterised: non-discounted and
  discounted terms. Add-to-Cart is out of scope here — see TC-06.)*

### TC-06 — Add-to-Cart presence follows availability (hunter) · P2
- **Steps:** For each product in the curated cross-category pool: read the tile's
  Add-to-Cart presence → open the PDP → read availability and PDP Add-to-Cart
  presence → navigate back → re-read the tile.
- **Expected:** the observed 3-checkpoint record `{list, pdp, listAfter}` equals
  the state **derived from the product's own live availability** (in stock ⇒
  button at every checkpoint; out of stock ⇒ none). The test hunts contradictions
  rather than pinning known-bad products; consistent products pass, buggy ones
  (handbag, bracelet, camcorder, desktop) fail by design and are filed as bugs.
  A mismatched checkpoint pinpoints *where* the button diverged. *(Parameterised:
  the pool.)*

## Category Verification — `category.spec.ts`

### TC-07 — Apparel & Shoes pagination and products · P1
- **Steps:** Open Apparel & Shoes → verify page 1 → jump to the last page via the
  highest pager number.
- **Expected:** category title correct; page 1 shows products; last page has no
  "Next" control and still shows products.

### TC-08 — Subcategory selection via breadcrumb · P2
- **Steps:** Open a parent category → select a subcategory from the nav.
- **Expected:** heading and breadcrumb current-item match the subcategory; parent
  breadcrumb link is visible. *(Parameterised: every subcategory in the tree.)*

## Sorting — `sorting.spec.ts`

### TC-09 — Derivable sort orders correctly · P1 (A–Z) / P2 (others)
- **Steps:** Open Apparel & Shoes → apply a name/price sort → read the resulting list.
- **Expected:** the sort is applied (URL carries `orderby`), the list stays
  populated, and the order matches the expected name/price ordering.
  *(Parameterised: the 4 derivable options; "Name: A to Z" is P1, the rest P2.)*

### TC-10 — Server-defined sort applies and keeps products listed · P2
- **Steps:** Open Apparel & Shoes → apply Position or Created on → read the list.
- **Expected:** the sort is applied (URL carries `orderby`) and the list stays
  populated. **Order is not asserted** — Position (backend rank) and Created on
  (creation date) can't be derived from on-page data, so there is no reliable
  expected order to check. *(Parameterised: the 2 server options.)*

## Coverage summary

| Requirement area | Cases |
| :--------------- | :---- |
| Product Search | TC-01 – TC-03 |
| Product Details | TC-05 – TC-06 |
| Category Verification | TC-07 – TC-08 |
| Sorting | TC-09 – TC-10 |

## Known coverage gaps (future work)

Negative paths within areas we already cover. Not a priority now; to be added
later.

- **No search results** — a query that matches nothing (empty-state message, no
  result tiles, no error). Search cases only assert the populated path.
- **Empty category** — a category page with zero products (empty grid handled
  gracefully). Category cases assume products are present.
