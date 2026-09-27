import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for the Demo Web Shop E2E suite.
 *
 * Environment variables (see .env.example):
 *  - BASE_URL           — the app under test; defaults to the Demo Web Shop.
 *  - CI                 — enables retries and the blob reporter.
 *  - TRACE_ENABLED      — retain traces on failure.
 *  - RECORDING_ENABLED  — retain video on failure; also slows actions to a human pace.
 *  - SLOWMO_MS          — per-action delay while recording (default 900ms).
 *  - RUN_ALL_BROWSERS   — also run Firefox and WebKit projects.
 */
export default defineConfig({
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  // maximum duration for a test to execute, in ms
  timeout: 3 * 60_000, // 3 minutes
  // maximum wait time for web-first assertions, in ms
  expect: { timeout: 30_000 }, // 30 seconds
  testDir: "./src",
  // Run tests in files in parallel
  fullyParallel: true,
  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,
  // Reporters define how the test results are reported. See https://playwright.dev/docs/test-reporters
  reporter: process.env.CI
    ? [["blob"]]
    : [
        ["list"],
        ["html", { outputFolder: "playwright-report", open: "never" }],
        ["junit", { outputFile: "playwright-report/results.xml" }],
        ["json", { outputFile: "playwright-report/results.json" }],
      ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    // Base URL so tests can use relative paths, e.g. page.goto("/").
    baseURL: process.env.BASE_URL ?? "https://demowebshop.tricentis.com",
    actionTimeout: 30_000, // maximum time each action such as click() can take, in ms
    trace: process.env.TRACE_ENABLED === "true" ? "retain-on-failure" : "off",
    video: {
      mode: process.env.RECORDING_ENABLED === "true" ? "retain-on-failure" : "off",
      size: { width: 1600, height: 1200 },
    },
    screenshot: "only-on-failure",
    // When recording, slow each action to a human pace so the video is legible; off otherwise.
    launchOptions: {
      slowMo: process.env.RECORDING_ENABLED === "true" ? Number(process.env.SLOWMO_MS ?? 900) : 0,
    },
  },
  projects: [
    {
      name: "chrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1600, height: 1200 },
        channel: "chrome",
      },
    },
    ...(process.env.RUN_ALL_BROWSERS === "true"
      ? [
          {
            name: "firefox",
            use: {
              ...devices["Desktop Firefox"],
              viewport: { width: 1600, height: 1200 },
            },
          },
          {
            name: "webkit",
            use: {
              ...devices["Desktop Safari"],
              viewport: { width: 1600, height: 1200 },
            },
          },
        ]
      : []),
  ],
});
