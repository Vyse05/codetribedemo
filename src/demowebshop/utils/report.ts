import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

/** Project-root reports directory; persists across runs (gitignored). */
const REPORTS_DIR = join(process.cwd(), "reports");

/**
 * Writes a simple Markdown list of product names to
 * `reports/search-results-<term>.md` for human-readable inspection.
 */
export function writeSearchResultsReport(term: string, names: string[]): string {
  mkdirSync(REPORTS_DIR, { recursive: true });
  const filePath = join(REPORTS_DIR, `search-results-${term}.md`);
  const body = `# Search results for "${term}"\n\n${names.map(name => `- ${name}`).join("\n")}\n`;
  writeFileSync(filePath, body, "utf8");
  return filePath;
}
