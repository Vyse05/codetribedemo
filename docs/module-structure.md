---
applies_to: "src/**"
---

# Module Structure Guide

This project has a single module, `src/demowebshop/`. This document defines how it
is organized.

## Module Organization

```
src/demowebshop/
├── constants/
│   ├── demowebshop-page-urls.ts
│   ├── category-constants.ts
│   ├── search-constants.ts
│   ├── tags.ts
│   └── labels/
│       └── demowebshop-labels.ts
├── pages/
│   └── *.page.ts
├── utils/
│   └── *.ts
├── types/
│   └── *.ts
└── tests/
    └── e2e/
        ├── fixtures/
        └── specs/
```

## Constants

### Labels and UI Text

**Location**: `constants/labels/*-labels.ts`

**Purpose**: Store UI text labels used by specs and page objects.

**Rules**:
- Export labels as `as const` `PascalCase` objects with `SCREAMING_SNAKE_CASE` keys
- Use label constants directly — no intermediate variables except for dynamic values

**Example**:
```typescript
// constants/labels/demowebshop-labels.ts
export const DemoWebShopLabels = {
  ADD_TO_CART: "Add to cart",
  IN_STOCK: "In stock",
  OUT_OF_STOCK: "Out of stock",
} as const;
```

### Page URLs

**Location**: `constants/demowebshop-page-urls.ts`

**Rules**:
- Static string constants for fixed routes; functions for parameterized routes
- Uppercase, descriptive keys; use a `BY_SLUG`/`BY_ID` pattern for parameterized routes

**Example**:
```typescript
export const DemoWebShopPageUrls = {
  SEARCH_BY_TERM: (term: string): string => `/search?q=${encodeURIComponent(term)}`,
  CATEGORY_BY_SLUG: (slug: string): string => `/${slug}`,
  PRODUCT_BY_SLUG: (slug: string): string => `/${slug}`,
} as const;
```

## Pages (Page Object Model)

**Location**: `pages/*.page.ts`

**Rules**:
- Keep selectors and UI interactions in page objects
- Page object methods **MUST NOT** contain assertions — assertions live in specs
- Use partial class selectors (`.class-name`) not exact matches
- Expose getters only for locators specs need to assert on
- Prefer semantic / `name`-based / `id` selectors for stability

**Example** (see `src/demowebshop/pages/product.page.ts`):
```typescript
import { Page, Locator } from "@playwright/test";
import { DemoWebShopPageUrls } from "@constants/demowebshop-page-urls";

export class ProductPage {
  constructor(private readonly page: Page) {}

  async goto(slug: string): Promise<void> {
    await this.page.goto(DemoWebShopPageUrls.PRODUCT_BY_SLUG(slug));
  }

  get title(): Locator {
    return this.page.getByRole("heading", { level: 1 });
  }
}
```

## Fixtures

### E2E Fixtures

**Location**: `tests/e2e/fixtures/demowebshop-e2e-fixtures.ts`

**Rules**:
- Build by extending the base `@playwright/test` fixtures
- Name local variables to match their class/type name

**Example** (see `src/demowebshop/tests/e2e/fixtures/demowebshop-e2e-fixtures.ts`):
```typescript
import { test as base, expect } from "@playwright/test";
import { SearchPage } from "@pages/search.page";

export const test = base.extend<{ searchPage: SearchPage }>({
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
});

export { expect };
```

## Utils

**Location**: `utils/*.ts`

**Rules**:
- Keep helpers small and focused (e.g. price parsing, sort-order checks, the
  availability rule that derives expected Add-to-Cart state from stock)
- Reusable/parameterized logic **MUST NOT** live in spec files

## Types

**Location**: `types/*.ts`

**Purpose**: Shared type definitions consumed by page objects and specs (e.g.
`ProductTile`, the tile-snapshot shape returned by `SearchPage.readTile`).

**Rules**:
- One concern per file; export named `type`/`interface` declarations
- Imported via the `@typings/*` alias
- Avoid `any`; use `unknown` only when a concrete type can't be derived

## Tests

### Specs

**Location**: `tests/e2e/specs/`

**Rules**:
- Import from module fixtures, not manual wiring
- Keep tests independent and cleanup-aware for parallel execution
- Behavior-focused, stable test names
- Spec files **MUST NOT** define helper methods/functions/classes
- Pass params directly when used once; introduce a const only when reused 2+ times
- Locators/selectors **MUST NOT** be introduced in specs — they live in page objects

## Import Rules

- **Use absolute imports only** via configured aliases (`@utils/...`, `@pages/...`, `@constants/...`, `@tests/...`, `@typings/...`, `@fixtures/...`)
- **Do not use relative traversal** (`../`, `../../`)

```typescript
// Good
import { SearchPage } from "@pages/search.page";
import { DemoWebShopPageUrls } from "@constants/demowebshop-page-urls";

// Bad
import { SearchPage } from "../../../pages/search.page";
```

## File Naming Conventions

- Page objects: `*.page.ts`
- Constants: `*-page-urls.ts`, `*-labels.ts`, `*-constants.ts`
- Specs: `*.spec.ts`

## Links

- **Agent Guide**: [AGENTS.md](../AGENTS.md)
- **Testing Guide**: [testing.md](testing.md)
- **Architecture**: [ARCHITECTURE.md](../ARCHITECTURE.md)
- **Commands**: [COMMANDS.md](../COMMANDS.md)
