---
applies_to: "**"
---

# Agent Guide

High-level guide for working with the codetribedemo Playwright + TypeScript E2E
suite. For detailed conventions, see the linked documentation.

## Scope

Playwright-based **E2E** test automation for the
[Tricentis Demo Web Shop](https://demowebshop.tricentis.com/). This is a single-team
project: all code lives in one module under `src/demowebshop/`.

## Essential Documentation

Read these before making changes:

- **[Module Structure](docs/module-structure.md)** — module organization, constants, pages, fixtures, types, utils, import rules
- **[Testing Guide](docs/testing.md)** — test layers, fixtures, POM, test data lifecycle, execution, conventions
- **[Architecture](ARCHITECTURE.md)** — system map, component structure, main flows
- **[Commands](COMMANDS.md)** — local setup, test execution, validation
- **[Security](SECURITY.md)** — secret handling, auth boundaries

## Stack and Standards

- **Language**: TypeScript
- **Test framework**: Playwright (`@playwright/test`)
- **Test layer**: E2E (browser) — no API layer in this project
- **Linting**: ESLint + Prettier
- **App under test**: Demo Web Shop (`https://demowebshop.tricentis.com`)

## Import Rules

- **Use absolute imports only** via configured aliases (`@utils/...`, `@pages/...`, `@constants/...`, `@tests/...`, `@typings/...`, `@fixtures/...`)
- **For class imports** (page objects): prefer alias-based imports; use `src/...` only when no alias exists
- **Never use relative traversal** (`../`, `../../`)

## Quick Conventions

### Constants
- **Labels & UI text**: `constants/labels/*-labels.ts` as `as const` exports
- **Page URLs**: `constants/<module>-page-urls.ts` with uppercase keys and `BY_SLUG`/`BY_ID` functions

### Pages (POM)
- Keep selectors and interactions in page objects under `pages/*.page.ts`
- Page methods **MUST NOT** contain assertions — assertions belong in specs
- Use partial class selectors (`.class-name`) not exact matches
- **Getter methods**: only create getters when specs need to access a locator for assertions (`.toBeVisible()`, `.toHaveCount()`, etc.). Otherwise, use `this.page.locator(...)` directly in action methods

### Tests
- Import from module fixtures, never manual wiring
- Keep tests independent; each creates/cleans its own data
- **20 executable lines or fewer** per test (warn if exceeded)
- **15+ tests per file**: suggest splitting by flow/domain
- **Parameterized tests**: use `for...of` loop, don't duplicate test bodies
- **No helpers in specs**: move to `utils/`
- **No selectors in specs**: move to page objects
- **Pass params directly** when used once; const only when reused 2+ times

### Comments
- **Keep comments to a single line.** State the "why" concisely; do not write multi-line explanatory blocks.

### Timeouts
- Use Playwright defaults unless a requirement specifies otherwise
- Custom timeouts: use constants from `@constants/timeouts` (never hardcode)

### Fixtures
- Build by extending the base `@playwright/test` fixtures
- Name variables to match class/type name (`const loginPage = new LoginPage()`)
- E2E fixtures: `tests/e2e/fixtures/`

### Types
- Update alongside fixtures and page changes
- Avoid `any`; `unknown` only when necessary (report with rationale)

## File Organization

Do not move/rename files or introduce new top-level folders unless explicitly requested.

## Safety and Scope

- Do only what is requested; avoid unrelated refactors
- Never commit secrets, tokens, credentials, or `.env` values
- Never modify generated artifacts unless asked (`playwright-report/`, `test-results/`)

## Validation

When code changes, validate with the narrowest relevant checks first:

1. Run targeted Playwright spec(s) impacted by the change
2. Run lint for impacted files or project lint if needed
3. Expand to broader test runs only when requested

Common commands:
```bash
npx playwright test <path-to-spec>
npm run lint
npm run typecheck
```

See [COMMANDS.md](COMMANDS.md) for the full command reference.

## Response Expectations

- Summarize changes concisely
- List what was validated and what was not validated
- Call out assumptions and blockers clearly
- If requirements are ambiguous, ask focused clarifying questions before broad implementation

## Priority Order

If instructions conflict, apply this order:

1. Direct user request
2. Workspace/system-level instructions
3. This `AGENTS.md`
4. Local stylistic preference
