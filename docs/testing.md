---
applies_to: "**"
---

# Testing Guide

This document covers test structure, fixture patterns, test data lifecycle, and
execution guidelines for the Demo Web Shop E2E suite.

## Test Layer

### E2E Tests

**Location**: `src/demowebshop/tests/e2e/specs/`

**Purpose**: End-to-end browser automation of user flows (search, browse, sort, …).

**Structure**:
```typescript
import { test, expect } from "@fixtures/demowebshop-e2e-fixtures";
import { CATEGORIES } from "@constants/category-constants";

test.describe("Category Verification", () => {
  test("shows products on the category page", async ({ categoryPage }) => {
    await categoryPage.goto(CATEGORIES.APPAREL_SHOES.slug);
    expect(await categoryPage.products.count()).toBeGreaterThan(0);
  });
});
```

### Test Tags

Tags come from `src/demowebshop/constants/tags.ts` (never inline the strings)
and are set via the `test(...)` options arg: `test(name, { tag: Tags.SANITY }, fn)`.

- **`@sanity`** — core, must-pass happy paths. Keep fast, minimal-setup, and
  low-flakiness so they can gate deploys and CI.
- **`@regression`** — coverage outside priorities (exhaustive parameterized
  loops, edge cases) run on a broader pass.

Filter runs with `--grep`; see [Test Execution](#test-execution).

## Fixture Patterns

### E2E Fixtures

**Location**: `src/demowebshop/tests/e2e/fixtures/demowebshop-e2e-fixtures.ts`

Extend the base `@playwright/test` fixtures with the page objects your specs need.

```typescript
import { test as base, expect } from "@playwright/test";
import { SearchPage } from "@pages/search.page";
import { CategoryPage } from "@pages/category.page";

export const test = base.extend<{ searchPage: SearchPage; categoryPage: CategoryPage }>({
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
  categoryPage: async ({ page }, use) => {
    await use(new CategoryPage(page));
  },
});

export { expect };
```

### Fixture Naming Convention

Name local variables to match their class/type: `const searchPage = new SearchPage(...)`, not `const page2 = ...`.

## Test Data Lifecycle

- **Prefer stateless assertions** where possible (navigation, visibility, validation messages).
- **Clean up** anything a test creates (e.g. items added to the cart) — prefer fixtures
  with automatic teardown, or `try/finally`.
- **Isolation**: each test sets up and cleans up its own state — never rely on execution
  order or pre-existing data. This enables parallel execution.

## Page Object Model (POM)

- Encapsulate UI structure, selectors, navigation, interaction, and extraction in
  page objects. Keep assertions in specs.
- Expose getters only for locators specs assert on.

### Selector Best Practices

```typescript
// Best: semantic attribute
page.locator('input[name="Email"]');
// Good: id from the app markup
page.locator("#Email");
// Acceptable: partial class
page.locator(".login-button");
// Avoid: brittle structure
page.locator("div > div > input");
```

Keep selector parameter names consistent with the attribute content they match.

## Test Execution

```bash
npm test                                        # all tests
npx playwright test src/demowebshop/tests/e2e/  # E2E only
npx playwright test --project=chrome            # a browser
npx playwright test --debug                     # Inspector
npx playwright test --headed --slow-mo=1000     # watch it run
npx playwright test --ui                        # interactive UI
npx playwright test --grep @sanity              # only @sanity tests
npx playwright test --grep @regression          # only @regression tests
npx playwright show-report                      # open HTML report
```

Reports are generated at `playwright-report/`; artifacts at `test-results/`.

## Avoiding Flakiness

- **Trust Playwright auto-waiting** — `await button.click()`, `await expect(...).toBeVisible()`. Avoid `page.waitForTimeout(...)`.
- **Wait for specific conditions** (`toBeHidden`/`toBeVisible`), not arbitrary delays.
- **Use stable locators** (semantic attributes / ids), not positional selectors.
- **Never commit `test.only` / `describe.only`** — `forbidOnly` is enabled on CI.

## Common Pitfalls

- **Hardcoded strings** → use constants from `@constants/*`.
- **Assertions in page objects** → keep them in specs.
- **Overly complex page objects** → keep methods thin; orchestrate in the spec.

## Test Writing Conventions

### Test Structure

- Keep each test to **20 executable lines or fewer** (non-empty, non-comment lines in the body).
- Use arrange/act/assert step comments for major phases only; don't over-comment.

### Parameterized Tests

Use a `for...of` loop over a test-cases array — do not duplicate test bodies:

```typescript
const categories = ["books", "computers", "jewelry"];

for (const category of categories) {
  test(`opens the ${category} category`, async ({ page }) => {
    await page.goto(`/${category}`);
    await expect(page).toHaveURL(new RegExp(category));
  });
}
```

### Timeouts

Use Playwright defaults unless a requirement specifies otherwise. Never hardcode
millisecond values in specs or page objects — if a custom timeout becomes
necessary, add a named constant under `@constants/` and reference it.

### Spec File Size

If a spec file reaches 15+ tests, split it by flow or domain
(`search.spec.ts`, `category.spec.ts`, …).

### Variable Usage in Specs

Pass params directly when used once; introduce a const only when reused 2+ times.

### Spec Responsibilities

**Specs contain**: test structure, data setup, fixture/page calls, assertions, cleanup.
**Specs avoid**: helper definitions (→ `utils/`), inline values (→ constants),
locators (→ page objects), one-off const aliases.

## Links

- **Agent Guide**: [AGENTS.md](../AGENTS.md)
- **Module Structure**: [module-structure.md](module-structure.md)
- **Architecture**: [ARCHITECTURE.md](../ARCHITECTURE.md)
- **Commands**: [COMMANDS.md](../COMMANDS.md)
- **Security**: [SECURITY.md](../SECURITY.md)
- **Playwright Best Practices**: https://playwright.dev/docs/best-practices
- **Playwright Fixtures**: https://playwright.dev/docs/test-fixtures
