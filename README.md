# codetribedemo

Playwright + TypeScript **E2E** test suite for the
[Tricentis Demo Web Shop](https://demowebshop.tricentis.com/). It ships with a
modular project structure, shared utilities, path aliases, linting, and CI.

Specs live under `src/demowebshop/tests/e2e/specs/` and cover product search,
product-details consistency, category pagination/navigation, and sorting.

## Documentation

- **[AGENTS.md](AGENTS.md)** — contributor / AI-assisted development conventions
- **[ARCHITECTURE.md](ARCHITECTURE.md)** — structure and design decisions
- **[COMMANDS.md](COMMANDS.md)** — common commands
- **[SECURITY.md](SECURITY.md)** — secret handling and safe practices
- **[Test Plan](docs/test-plan.md)** — scope, objectives, prioritisation, scenarios
- **[Test Cases](docs/test-cases.md)** — the test-case list mapped to specs
- **[Testing Guide](docs/testing.md)** — test layers, fixtures, patterns
- **[Module Structure](docs/module-structure.md)** — how the module is organized

## Getting Started

### 1. Install the correct Node.js version

The required version is pinned in [.nvmrc](.nvmrc). With [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install
nvm use
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install
```

### 4. Configure environment

```bash
cp .env.example .env
```

`BASE_URL` defaults to the Demo Web Shop, so `.env` is optional — copy it only if
you need to point the suite at a different environment or tune run behavior.

### 5. Run the suite

```bash
npm test
```

## Project Structure

```
codetribedemo/
├── .github/workflows/        # CI (lint + typecheck)
├── .husky/                   # Git hooks (pre-commit: lint-staged + typecheck)
├── docs/                     # test plan, test cases, guides, findings
├── src/
│   └── demowebshop/          # The one feature module for this project
│       ├── constants/        # page urls, labels, tags, category/search data
│       ├── pages/            # Page Object Models (search, product, category)
│       ├── utils/            # helpers (price, sort, random, report)
│       └── tests/e2e/        # fixtures + specs
├── reports/                  # generated search-results reports (gitignored)
├── .env.example              # environment variable template
├── playwright.config.ts      # Playwright configuration
├── tsconfig.json             # TypeScript config + path aliases
└── package.json
```

## Configuration

### TypeScript Path Aliases

```typescript
// @tests/*     - Test files
// @utils/*     - Utility functions
// @pages/*     - Page Object Models
// @constants/* - Configuration constants
// @fixtures/*  - Test fixtures
```

### Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `BASE_URL` | App under test; Playwright `baseURL` | No (defaults to Demo Web Shop) | `https://demowebshop.tricentis.com` |
| `CI` | Enables retries + blob reporter | No | `true` |
| `TRACE_ENABLED` | Capture traces on retry | No | `true` |
| `RECORDING_ENABLED` | Record video on retry | No | `true` |
| `RUN_ALL_BROWSERS` | Also run Firefox and WebKit | No | `true` |

## Running Tests

```bash
npm test                                            # all tests
npm run test:ci                                     # CI mode (retries)
npx playwright test src/demowebshop/tests/e2e/      # E2E only
npx playwright test --project=chrome                # a single browser
npx playwright test --grep @sanity                  # critical happy paths only
npx playwright test --grep @regression              # extended coverage only
npx playwright test --debug                         # Playwright Inspector
npx playwright test --headed                        # see the browser
npx playwright test --ui                            # interactive UI mode
npx playwright show-report                          # open the HTML report
```

Tests are tagged `@sanity` (critical) and `@regression` (extended); see the
[Test Plan](docs/test-plan.md) for the prioritisation model.

## Reports

- **HTML report** — `npx playwright show-report` (generated at `playwright-report/`).
- **Search names** — the search suite writes matched product names to
  `reports/search-results-<term>.md` for quick human inspection.

## Writing Tests

1. **Use the Page Object Model** — put selectors/interactions in `pages/`, assertions in specs.
2. **Use fixtures** — import from `@fixtures/demowebshop-e2e-fixtures`; don't wire page objects by hand.
3. **No inline magic values** — keep labels, URLs, and test data in `constants/`.
4. **Stable selectors** — prefer semantic/`name`-based or partial-class locators.
5. **Tag every test** — apply `@sanity` or `@regression` from `constants/tags.ts`.

A Husky pre-commit hook runs `lint-staged` (ESLint + Prettier on staged `.ts`)
and `npm run typecheck`, so commits are blocked on lint or type errors.

## Additional Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

**Happy Testing!** 🚀
