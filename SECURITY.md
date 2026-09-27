---
applies_to: "**"
---

# Security Guidelines

Security rules and safe practices for this test suite. Adapt the specifics
(credential sources, escalation channels) to your organization.

## Secret Handling

### Environment Variables

**Rule**: All sensitive credentials must be stored in `.env` and never committed.

**Setup**:
1. Copy `.env.example` to `.env`
2. Fill in actual values
3. Never commit `.env`

**.gitignore protection** (already configured):
```
.env
*.env.json
*.key
*.pem
credentials.json
```

### Code Review Checklist

**Before committing**:
- [ ] No hardcoded tokens, passwords, or API keys
- [ ] No committed `.env` files
- [ ] No credentials in test data or fixtures
- [ ] No credentials in `console.log` or debug statements
- [ ] No credentials in test names or descriptions
- [ ] No credentials in git commit messages

**Example**:
```typescript
// BAD: hardcoded / fallback secret
const password = "hunter2";
const pass = process.env.APP_PASSWORD || "fallback-secret";

// GOOD: load from environment only, fail loudly if missing
const password = process.env.APP_PASSWORD;
if (!password) {
  throw new Error("APP_PASSWORD is required");
}
```

## Authentication and Authorization

### Test Authentication

**Rule**: Credentials come from the environment only — never hardcode them in
specs or page objects.

- The current suite is unauthenticated — all covered flows (search, product
  details, category browsing, sorting) work as an anonymous visitor.
- If a future flow needs sign-in, read the credentials from environment
  variables (loaded via `.env`, never committed) and drive login through a
  dedicated page object rather than re-implementing the form inline.

**Never**:
- Hardcode credentials in tests
- Bypass authentication for "convenience"
- Store passwords in code or config files

### Authorization Boundaries

- Tests must respect authorization boundaries and not bypass permission checks.
- Security testing (injection, exploit, boundary bypass) is **authorized-only**:
  document it, get approval, isolate it in tagged suites, and report findings
  through private channels — not public issues.

## Data Handling

### PII and Customer Data

- **Do not** use real PII in test data — generate synthetic data (e.g. Faker.js),
  use patterns like `test-user-{random}@example.com`.
- **Do not** run against production customer data. Use test/staging environments
  and dedicated test accounts. Production access requires explicit approval.

### Test Data Cleanup

Clean up any data a test creates. Prefer fixtures with automatic teardown, or
`try/finally`:

```typescript
test("adds a product to the cart", async ({ page }) => {
  await page.goto("/books");
  try {
    // ... add to cart and assert ...
  } finally {
    // remove the item from the cart to leave the account clean
  }
});
```

## Input Validation

- Test valid, invalid, and boundary values freely.
- Malicious payloads (SQLi, XSS, path traversal, command injection) require
  explicit authorization and a tagged, isolated suite.

## Dependencies and Vulnerabilities

- Run `npm audit` regularly; address critical advisories promptly.
- Run the full suite after dependency updates and commit `package-lock.json`.
- Vet third-party libraries: actively maintained, good security track record,
  compatible license, sufficient docs.

## Logging and Observability

- **Never** log credentials, tokens, PII, or customer data. Redact sensitive
  fields before logging structured objects.
- Screenshots/videos/traces may capture sensitive data — review before sharing.

## Incident Response

**Suspected vulnerability**: do not open a public issue or commit details; report
through your organization's private security channel with repro steps and impact.

**Credential leak**: immediately revoke/rotate the credential, notify your security
contact, purge it from git history, and document the remediation.

## Links

- **Agent Guide**: [AGENTS.md](AGENTS.md)
- **Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Testing Guide**: [docs/testing.md](docs/testing.md)
