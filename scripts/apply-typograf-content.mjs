/**
 * Генерирует content/*.json из plain-text источников content/sources/*.json.
 * npm run typograf:apply
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { typografText } from "./lib/typograf-shared.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourcesDir = join(root, "content", "sources");
const contentDir = join(root, "content");

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, data) {
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function typografBadgesString(badges) {
  if (!badges?.trim()) return badges ?? "";
  return badges
    .split(",")
    .map((part) => typografText(part.trim()))
    .join(", ");
}

function typografResume(src) {
  const out = structuredClone(src);

  out.summary = src.summary.map((p) => typografText(p));

  out.experience = src.experience.map((block) => {
    const b = structuredClone(block);
    if (b.heading) b.heading = typografText(b.heading);
    if (b.headingLines) b.headingLines = b.headingLines.map((l) => typografText(l));
    if (b.paragraphs) b.paragraphs = b.paragraphs.map((p) => typografText(p));
    if (b.bullets) {
      b.bullets = b.bullets.map((bullet) => {
        const item = structuredClone(bullet);
        if (item.label) item.label = typografText(item.label);
        if (item.text) item.text = typografText(item.text);
        if (item.lines) item.lines = item.lines.map((l) => typografText(l));
        return item;
      });
    }
    return b;
  });

  out.education = {
    ...src.education,
    title: typografText(src.education.title),
    entries: src.education.entries.map((e) => ({
      org: typografText(e.org),
      detail: typografText(e.detail),
    })),
  };

  out.highlights = {
    ...src.highlights,
    title: typografText(src.highlights.title),
    items: src.highlights.items.map((i) => ({
      text: typografText(i.text),
    })),
  };

  out.skills = src.skills.map((s) => ({
    title: typografText(s.title),
    body: typografText(s.body),
  }));

  return out;
}

function typografHomeCards(src) {
  return src.map((card) => ({
    ...card,
    title: typografText(card.title),
    subtitle: typografText(card.subtitle),
    badges: typografBadgesString(card.badges),
  }));
}

const jobs = [
  {
    source: "resume.json",
    out: "resume.json",
    transform: typografResume,
  },
  {
    source: "home-cards.json",
    out: "home-cards.json",
    transform: typografHomeCards,
  },
];

mkdirSync(sourcesDir, { recursive: true });

for (const { source, out, transform } of jobs) {
  const sourcePath = join(sourcesDir, source);
  const outPath = join(contentDir, out);

  if (!existsSync(sourcePath)) {
    if (existsSync(outPath)) {
      console.warn(
        `⚠ Нет ${sourcePath} — копирую текущий ${out} в sources как стартовый plain-text.`,
      );
      writeFileSync(sourcePath, readFileSync(outPath, "utf8"), "utf8");
    } else {
      throw new Error(`Нет источника: ${sourcePath}`);
    }
  }

  const plain = readJson(sourcePath);
  const baked = transform(plain);
  writeJson(outPath, baked);
  console.log(`✓ ${out} ← content/sources/${source}`);
}
