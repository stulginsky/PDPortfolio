#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const pages = {
  showcase: "https://www.notion.so/ad67228eaaf348d1962ca3ed15cba885",
  "vendor-app": "https://www.notion.so/30af7ee7bf04801db14fcb2ef97af0a5",
  "lecar-online-oms": "https://www.notion.so/30af7ee7bf0480719e36df4878fba069",
  "chirp-ai-health-assistant": "https://www.notion.so/312f7ee7bf04801e829beba4fdd56fcb",
  "платформа-lada-business": "https://www.notion.so/309f7ee7bf048190bc1ef3146d1f11ac",
  "self-service-kiosk-for-horeca": "https://www.notion.so/341f7ee7bf0480108648e3e1ec415f0d",
  "nested-chirp-ai-check": "https://www.notion.so/33af7ee7bf0480b5ac27d46489c17385",
  "nested-chirp-brand": "https://www.notion.so/33af7ee7bf0480a19e59c0104a23d743",
  "nested-lada-table": "https://www.notion.so/325f7ee7bf048011a658c91b6278c650",
  "nested-lada-filtering": "https://www.notion.so/325f7ee7bf0480d9b578e7b529bf77c1",
  "nested-lada-inspector": "https://www.notion.so/325f7ee7bf0480f89d75ddbc8de266f3",
  "nested-lada-onboarding": "https://www.notion.so/325f7ee7bf0480f78dc4fbd91137c228",
};

const assetsRoot = path.resolve("public/notion-assets");
const urlRegex = /https:\\\/\\\/prod-files-secure[^"\\\s<)]+/g;

function normalizeUrl(url) {
  return url
    .replace(/\\u0026/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/%5Cu0026/g, "&")
    .replace(/\\\//g, "/");
}

function extFromUrl(url) {
  try {
    const ext = path.extname(new URL(url).pathname).toLowerCase();
    return ext || ".img";
  } catch {
    return ".img";
  }
}

async function main() {
  let downloaded = 0;
  for (const [bucket, notionUrl] of Object.entries(pages)) {
    const htmlRes = await fetch(notionUrl);
    const html = await htmlRes.text();
    const all = html.match(urlRegex) ?? [];
    const urls = [...new Set(all.map(normalizeUrl))];
    if (urls.length === 0) continue;
    const outDir = path.join(assetsRoot, bucket);
    await fs.mkdir(outDir, { recursive: true });
    for (let i = 0; i < urls.length; i += 1) {
      const url = urls[i];
      const fileName = `img-${String(i + 1).padStart(2, "0")}-${createHash("sha1").update(url).digest("hex").slice(0, 10)}${extFromUrl(url)}`;
      const outPath = path.join(outDir, fileName);
      try {
        await fs.access(outPath);
        continue;
      } catch {}
      try {
        const fileRes = await fetch(url);
        if (!fileRes.ok) continue;
        const buffer = Buffer.from(await fileRes.arrayBuffer());
        await fs.writeFile(outPath, buffer);
        downloaded += 1;
      } catch {}
    }
  }
  console.log(`Downloaded ${downloaded} images from public Notion pages`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
