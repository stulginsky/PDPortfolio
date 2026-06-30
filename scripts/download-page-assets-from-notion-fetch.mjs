#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

function usage() {
  console.log("Usage: node scripts/download-page-assets-from-notion-fetch.mjs <notion-fetch-output-file> <bucket>");
}

function hash(input) {
  return createHash("sha1").update(input).digest("hex").slice(0, 10);
}

function extFromUrl(url) {
  try {
    const ext = path.extname(new URL(url).pathname).toLowerCase();
    return ext || ".img";
  } catch {
    return ".img";
  }
}

function normalizeUrl(url) {
  return url.replace(/\\u0026/g, "&").replace(/&amp;/g, "&").replace(/\\\//g, "/");
}

async function main() {
  const [, , inputFile, bucket] = process.argv;
  if (!inputFile || !bucket) {
    usage();
    process.exit(1);
  }

  const raw = await fs.readFile(path.resolve(inputFile), "utf8");
  const parsed = JSON.parse(raw);
  const text = parsed?.text ?? "";
  const matches = text.match(/https:\/\/prod-files-secure\.s3\.us-west-2\.amazonaws\.com\/[^)\s"]+/g) ?? [];
  const urls = [...new Set(matches.map(normalizeUrl))];

  const targetDir = path.resolve("public/notion-assets", bucket);
  await fs.mkdir(targetDir, { recursive: true });

  let downloaded = 0;
  let failed = 0;
  for (let i = 0; i < urls.length; i += 1) {
    const url = urls[i];
    const ext = extFromUrl(url);
    const fileName = `img-${String(i + 1).padStart(2, "0")}-${hash(url)}${ext}`;
    const filePath = path.join(targetDir, fileName);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = Buffer.from(await res.arrayBuffer());
      await fs.writeFile(filePath, body);
      downloaded += 1;
      console.log(`ok ${fileName}`);
    } catch (err) {
      failed += 1;
      console.warn(`fail ${fileName}: ${err.message}`);
    }
  }

  console.log(`Found: ${urls.length}, downloaded: ${downloaded}, failed: ${failed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
