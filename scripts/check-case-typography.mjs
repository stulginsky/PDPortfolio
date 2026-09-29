/**
 * Проверяет обязательный текстовый контракт Figma-кейса.
 * Запускается после typograf:apply перед build/generate.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cases = ["chirp-product"];
const errors = [];

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function visitStrings(value, visit) {
  if (typeof value === "string") visit(value);
  else if (Array.isArray(value)) value.forEach((item) => visitStrings(item, visit));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => visitStrings(item, visit));
}

for (const slug of cases) {
  const sourcePath = join(root, "content", "sources", "cases", `${slug}.json`);
  const manualTextPath = join(root, "content", "sources", "cases", `${slug}.typograf.txt`);
  const generatedPath = join(root, "content", "cases", `${slug}.json`);
  const pagePath = join(root, "app", "pages", "cases", `${slug}.vue`);

  for (const path of [sourcePath, manualTextPath, generatedPath, pagePath]) {
    if (!existsSync(path)) errors.push(`${slug}: отсутствует ${path}`);
  }
  if (errors.length) continue;

  const source = readJson(sourcePath);
  const manualText = readFileSync(manualTextPath, "utf8");
  const generated = readJson(generatedPath);
  visitStrings(source, (text) => {
    if (/\u00a0|\u2011/u.test(text)) {
      errors.push(`${slug}: в content/sources найден ручной неразрывный символ`);
    }
  });
  if (manualText.split(/\r?\n/).filter((line) => line.trim()).length !== 61) {
    errors.push(`${slug}: в источнике ручной типографики должна быть 61 непустая строка`);
  }
  visitStrings(generated, (text) => {
    if (/\b(?:AI|B2B|B2C|UX|UI|MVP)-(?=\p{L})/gu.test(text)) {
      errors.push(`${slug}: в generated content остался разрывный дефис составного термина`);
    }
  });

  const caseTemplates = [
    pagePath,
    join(root, "app", "components", "CaseMediaFrame.vue"),
    join(root, "app", "components", "CaseRelatedCases.vue"),
    join(root, "app", "components", "CaseImageViewer.vue"),
  ];
  for (const templatePath of caseTemplates) {
    const component = readFileSync(templatePath, "utf8");
    const template = component.slice(component.indexOf("<template>"), component.indexOf("</template>"));
    if (/>[^<\n]*\p{L}[^<\n]*</u.test(template)) {
      errors.push(`${slug}: найден видимый текст напрямую в ${templatePath}`);
    }
  }
}

if (errors.length) {
  throw new Error(`Нарушен контракт типографики кейса:\n${errors.join("\n")}`);
}

console.log("✓ case typography contract");
