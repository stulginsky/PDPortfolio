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
const manualCaseBodyPath = join(sourcesDir, "cases", "chirp-product.typograf.txt");

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function typografTree(value) {
  if (typeof value === "string") return typografText(value);
  if (Array.isArray(value)) return value.map(typografTree);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, typografTree(child)]),
    );
  }
  return value;
}

function decodeTypografEntities(text) {
  const entities = {
    "&nbsp;": "\u00a0",
    "&#160;": "\u00a0",
    "&#xA0;": "\u00a0",
    "&laquo;": "«",
    "&raquo;": "»",
    "&mdash;": "—",
    "&ndash;": "–",
    "&middot;": "·",
    "&rarr;": "→",
    "&#8209;": "‑",
  };
  return text.replace(/&(?:nbsp|#160|#xA0|laquo|raquo|mdash|ndash|middot|rarr|#8209);/g, (entity) => entities[entity]);
}

function readManualCaseText() {
  if (!existsSync(manualCaseBodyPath)) {
    throw new Error(`Нет источника ручной типографики: ${manualCaseBodyPath}`);
  }

  const lines = readFileSync(manualCaseBodyPath, "utf8")
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line) => decodeTypografEntities(line.trim()));

  if (lines.length !== 61) {
    throw new Error(
      `Неверное число строк в ${manualCaseBodyPath}: ${lines.length}; ожидается 61.`,
    );
  }
  return lines;
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

function typografSite(src) {
  return {
    ...src,
    name: typografText(src.name),
    role: typografText(src.role),
    experience: typografText(src.experience),
    footerCredit: typografText(src.footerCredit),
  };
}

function typografCase(src) {
  const out = typografTree(src);
  const lines = readManualCaseText();
  const copyLineIndexes = [
    3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    23, 24, 25, 28, 29, 30, 33, 34, 35, 38, 39, 40, 41, 42, 43,
    44, 45, 46, 49, 50, 51, 52, 53, 56, 57,
  ];
  const mediaLineIndexes = [[9, 10], [21, 22], [26, 27], [31, 32], [36, 37], [47, 48], [54, 55]];
  return {
    ...out,
    // Весь текст ниже предоставлен после ручной типографики и не должен быть
    // повторно изменён библиотекой Typograf.
    copy: [out.copy[0], out.copy[1], lines[0], lines[1], lines[2], ...copyLineIndexes.map((index) => lines[index])],
    media: out.media.map((item, index) => ({
      ...item,
      title: lines[mediaLineIndexes[index][0]],
      alt: lines[mediaLineIndexes[index][1]],
    })),
    ui: {
      ...out.ui,
      relatedTitle: lines[58],
      relatedDescription: `${lines[59]}\n${lines[60]}`,
    },
  };
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
  {
    source: "site.json",
    out: "site.json",
    transform: typografSite,
  },
  {
    source: "cases/chirp-product.json",
    out: "cases/chirp-product.json",
    transform: typografCase,
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
