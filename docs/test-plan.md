# Test Plan — Demo Web Shop E2E

## Overview

This suite validates the core shopping-discovery flows of the
[Tricentis Demo Web Shop](https://demowebshop.tricentis.com/) — search, product
details, category browsing, and sorting — from a customer's point of view.

The approach is a Playwright + TypeScript E2E framework using the Page Object
Model: selectors and interactions live in page objects, specs hold only
assertions. Test data is fixed and chosen against the live catalogue so expected
values are derivable rather than guessed, and every check is independent so the
suite runs in parallel and can gate changes.

## Objectives

Design and implement a basic automation testing framework and write automated
tests that validate core functionalities of the website. Core functionalities to
cover:

- **Product Search**
  - Validate that search returns only relevant products and print the product
    names in a list
  - Validate product name and price for each result
  - Open a product details page from the search results
- **Product Details Page**
  - Verify product title, price, and presence of the "Add to Cart" button both
    in the product list and on the product details page
- **Category Verification**
  - Navigate to "Apparel & Shoes" category
  - Verify pagination works correctly
  - Verify products are displayed on both pages
- **Sorting**
  - Sort products on any category page using any available sort option
  - Verify that sorting is applied correctly

**Out of scope:** authenticated flows (login/account/checkout), cart and
payment, API testing (the app exposes no public API), and visual/performance
testing. Chrome only by default.

## Test Suite

| # | Scenario | Area | Priority |
| :- | :------- | :--- | :------- |
| TC-01 | Search returns only relevant results and lists their names (every term; first is sanity, rest regression) | Search | P1 / P2 |
| TC-02 | Each result has a valid name and price | Search | P1 |
| TC-03 | A result opens its product-details page | Search | P1 |
| TC-05 | Tile title and price carry to the PDP | Product Details | P1 |
| TC-06 | Add-to-Cart presence follows availability across list, PDP, and back (hunter) | Product Details | P2 |
| TC-07 | Apparel & Shoes paginates with products on every page | Category | P1 |
| TC-08 | Each subcategory is selectable and shown in the breadcrumb | Category | P2 |
| TC-09 | Every derivable sort option applies and orders correctly | Sorting | P1 / P2 |
| TC-10 | Server-defined sort applies and keeps products listed | Sorting | P2 |

TC-04 (exhaustive per-term relevance) merged into TC-01, which now parameterises
over every term. See [test-cases.md](test-cases.md) for per-case detail and spec
mapping.

## Prioritisation

Tests are tagged so runs can be scoped by risk:

- **P1 — `@sanity`**: the core happy paths that must always work. One
  representative check per area (a single search term, the A–Z sort, one
  in-stock product). Fast, run on every change and as a merge/deploy gate.
- **P2 — `@regression`**: broader and edge-case coverage — every search term,
  every sort option, every subcategory, and the availability hunter (which sweeps
  a cross-category product pool and catches Add-to-Cart defects). Run in a full
  regression pass rather than on every commit.

The split keeps day-to-day feedback quick while still exercising the whole
catalogue before release. Run with `--grep @sanity` / `--grep @regression`.

## A note on scope

These cases assert **observed, consistent behaviour**, not a formal product
spec (the site has none published). Where the live app is internally
inconsistent — e.g. in-stock products missing an Add-to-Cart button, or
stockless digital items — the suite pins deterministic fixtures and documents
the discrepancies in [findings-product-details.md](findings-product-details.md)
rather than encoding a rule the app doesn't actually enforce.

## Environment & Criteria

- **App:** `https://demowebshop.tricentis.com` (override via `BASE_URL`).
- **Runner:** Playwright (`@playwright/test`), Chrome by default; `list` + HTML
  report, with search names also written to `reports/`.
- **Entry:** app reachable at `BASE_URL`; dependencies and browsers installed.
- **Exit:** all `@sanity` tests pass; `@regression` failures triaged (real
  defect vs. fixture drift) and logged.

## Links

[Test Cases](test-cases.md) · [Testing Guide](testing.md) ·
[Commands](../COMMANDS.md) · [Architecture](../ARCHITECTURE.md)
