/**
 * Превью типографики для plain-text в content/sources/resume.json.
 * npm run typograf:preview
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { typografText } from "./lib/typograf-shared.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const resume = JSON.parse(
  readFileSync(join(root, "content", "sources", "resume.json"), "utf8"),
);

console.log("--- summary (после typograf) ---\n");
for (const p of resume.summary) {
  console.log(typografText(p));
  console.log("");
}
