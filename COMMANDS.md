### TypeScript Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
// Instead of: import { SearchPage } from '../../../pages/search.page'
import { SearchPage } from '@pages/search.page';

// Available aliases:
// @tests/*     - Test files
// @utils/*     - Utility functions
// @pages/*     - Page Object Models
// @constants/* - Configuration constants
// @fixtures/*  - Test fixtures
```

### Playwright Configuration

Key settings in `playwright.config.ts`:

| Setting | Value |
| :------ | :---- |
| **Timeout** | 3 minutes per test |
| **Retries** | 2 retries on CI, 0 locally |
| **Browsers** | Chrome (Firefox, WebKit when `RUN_ALL_BROWSERS=true`) |
| **Viewport** | 1600x1200 |
| **Screenshots** | Captured on failure |
| **Video / Trace** | On retry (configurable) |
| **Parallel Execution** | Enabled by default |

```bash
### Core commands ###

# Run all tests || Run all tests in CI mode (with retries)
npm test
npm run test:ci

# Run all E2E tests
npx playwright test src/demowebshop/tests/e2e/
# Run a specific test file
npx playwright test src/demowebshop/tests/e2e/specs/login.spec.ts

### Run arguments ###

# Run tests by browser
--project=chrome
--project=firefox
--project=webkit

# Run tests by tag (see src/demowebshop/constants/tags.ts)
# @sanity     - core, must-pass happy paths
# @regression - coverage outside priorities (exhaustive loops, edge cases)
npx playwright test --grep @sanity
npx playwright test --grep @regression
# Combine tags (run either)
npx playwright test --grep "@sanity|@regression"
# Exclude a tag
npx playwright test --grep-invert @regression

# Debug mode with Playwright Inspector (step-by-step)
--debug
# Headed mode
--headed
# Headed mode, slower
--headed --slow-mo=1000
# Interactive UI mode
--ui

### Reporting, validating ###

# View the HTML report (generated at ./playwright-report/)
npx playwright show-report

# Lint / fix
npm run lint
npm run lint:fix

# Type-check
npm run typecheck
```
