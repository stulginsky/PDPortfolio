#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function stripTags(input) {
  return input
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractContentBlock(text) {
  const match = text.match(/<content>\n?([\s\S]*?)\n?<\/content>/);
  return match ? match[1].trim() : "";
}

function htmlUnescape(input) {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractImageUrls(markdown) {
  const urls = [];
  const seen = new Set();
  const pushUrl = (url) => {
    const clean = htmlUnescape(url.trim());
    if (!/^https?:\/\//i.test(clean)) return;
    if (seen.has(clean)) return;
    seen.add(clean);
    urls.push(clean);
  };

  const mdRegex = /!\[[^\]]*?\]\((https?:\/\/[^)\s]+(?:\s+"[^"]*")?)\)/g;
  let mdMatch = mdRegex.exec(markdown);
  while (mdMatch) {
    const onlyUrl = mdMatch[1].split(/\s+"/)[0];
    pushUrl(onlyUrl);
    mdMatch = mdRegex.exec(markdown);
  }

  const htmlRegex = /<img[^>]+src=["'](https?:\/\/[^"']+)["'][^>]*>/gi;
  let htmlMatch = htmlRegex.exec(markdown);
  while (htmlMatch) {
    pushUrl(htmlMatch[1]);
    htmlMatch = htmlRegex.exec(markdown);
  }

  return urls;
}

function getExtensionFromUrl(url) {
  try {
    const parsed = new URL(url);
    const ext = path.extname(parsed.pathname).toLowerCase();
    if (ext && ext.length <= 8) return ext;
  } catch (_error) {
    return "";
  }
  return "";
}

function getExtensionFromContentType(contentType) {
  const normalized = contentType.toLowerCase().split(";")[0].trim();
  if (normalized === "image/jpeg") return ".jpg";
  if (normalized === "image/png") return ".png";
  if (normalized === "image/webp") return ".webp";
  if (normalized === "image/gif") return ".gif";
  if (normalized === "image/svg+xml") return ".svg";
  if (normalized === "image/avif") return ".avif";
  return "";
}

function hashUrl(input) {
  return createHash("sha1").update(input).digest("hex").slice(0, 10);
}

function replaceImageUrls(markdown, replacementMap) {
  let result = markdown;
  for (const [remoteUrl, localUrl] of replacementMap) {
    const escaped = remoteUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    result = result.replace(new RegExp(escaped, "g"), localUrl);
  }
  return result;
}

async function downloadImage(url, targetDir, fileBaseName) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const fromType = getExtensionFromContentType(response.headers.get("content-type") ?? "");
  const fromUrl = getExtensionFromUrl(url);
  const ext = fromType || fromUrl || ".img";
  const fileName = `${fileBaseName}${ext}`;
  const absolutePath = path.join(targetDir, fileName);
  await fs.writeFile(absolutePath, buffer);
  return fileName;
}

async function localizeCaseImages(content, slug, assetsRootRelative, publicDir) {
  const imageUrls = extractImageUrls(content);
  if (imageUrls.length === 0) {
    return { content, firstImage: null, downloaded: 0, failed: 0 };
  }

  const absoluteAssetsDir = path.join(publicDir, assetsRootRelative, slug);
  await ensureDir(absoluteAssetsDir);

  const replacementMap = new Map();
  let downloaded = 0;
  let failed = 0;

  for (let index = 0; index < imageUrls.length; index += 1) {
    const remoteUrl = imageUrls[index];
    const fileBaseName = `img-${String(index + 1).padStart(2, "0")}-${hashUrl(remoteUrl)}`;
    try {
      const fileName = await downloadImage(remoteUrl, absoluteAssetsDir, fileBaseName);
      const localPath = `/${assetsRootRelative}/${slug}/${fileName}`.replace(/\\/g, "/");
      replacementMap.set(remoteUrl, localPath);
      downloaded += 1;
    } catch (error) {
      failed += 1;
      console.warn(`Warn: failed to download image for ${slug}: ${remoteUrl} (${error.message})`);
    }
  }

  const localizedContent = replaceImageUrls(content, replacementMap);
  const firstImage = replacementMap.values().next().value ?? null;
  return { content: localizedContent, firstImage, downloaded, failed };
}

function extractRootProjects(rootText) {
  const projectRegex =
    /<page url="https:\/\/www\.notion\.so\/([a-f0-9]+)">([\s\S]*?)<\/page>/g;
  const projects = [];
  let match = projectRegex.exec(rootText);
  while (match) {
    const id = match[1];
    const rawTitle = stripTags(match[2]);
    if (!rawTitle) {
      match = projectRegex.exec(rootText);
      continue;
    }
    projects.push({
      notionPageId: id,
      title: rawTitle,
      slug: slugify(rawTitle),
    });
    match = projectRegex.exec(rootText);
  }
  return projects;
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function main() {
  const rootDir = process.argv[2];
  const casesDir = process.argv[3];
  const outputDir = process.argv[4] ?? path.resolve("content/notion");
  const publicDir = process.argv[5] ?? path.resolve("public");
  const assetsRootRelative = process.argv[6] ?? "notion-assets";
  if (!rootDir || !casesDir) {
    console.error(
      "Usage: node scripts/notion-to-content.mjs <root-json> <cases-dir> [output-dir] [public-dir] [assets-subdir]",
    );
    process.exit(1);
  }

  const root = await readJson(path.resolve(rootDir));
  const rootProjects = extractRootProjects(root.text);
  const caseFiles = await fs.readdir(path.resolve(casesDir));
  const caseMap = new Map();

  for (const file of caseFiles) {
    if (!file.endsWith(".json")) continue;
    const fullPath = path.join(path.resolve(casesDir), file);
    const data = await readJson(fullPath);
    const title = stripTags(data.title ?? "");
    const pageId = data.url?.split("/").pop() ?? file.replace(".json", "");
    const content = extractContentBlock(data.text ?? "");
    const summary = stripTags(content.split("\n")[0] ?? "");
    const cover = extractImageUrls(content)[0] ?? null;
    caseMap.set(pageId, {
      notionPageId: pageId,
      notionUrl: data.url,
      title,
      content,
      summary,
      coverRemote: cover,
    });
  }

  const projects = rootProjects
    .map((project, index) => {
      const extra = caseMap.get(project.notionPageId);
      return {
        title: project.title,
        slug: project.slug,
        notionPageId: project.notionPageId,
        notionUrl: extra?.notionUrl ?? `https://www.notion.so/${project.notionPageId}`,
        summary: extra?.summary || "",
        cover: extra?.coverRemote || null,
        status: "published",
        featured: true,
        order: index + 1,
      };
    })
    .filter((project) => project.slug.length > 0);

  await ensureDir(outputDir);
  await ensureDir(path.join(outputDir, "cases"));
  await ensureDir(path.join(publicDir, assetsRootRelative));

  let totalDownloaded = 0;
  let totalFailed = 0;

  const projectsWithLocalizedContent = [];
  for (let index = 0; index < projects.length; index += 1) {
    const project = projects[index];
    const extra = caseMap.get(project.notionPageId);
    const baseBody = extra?.content?.trim()
      ? extra.content
      : `# ${project.title}\n\nКонтент кейса пока не выгружен.`;
    const localized = await localizeCaseImages(
      baseBody,
      project.slug,
      assetsRootRelative,
      path.resolve(publicDir),
    );
    totalDownloaded += localized.downloaded;
    totalFailed += localized.failed;

    const summary = extra?.summary || "";
    const cover = localized.firstImage ?? extra?.coverRemote ?? null;
    projectsWithLocalizedContent.push({
      ...project,
      summary,
      cover,
    });

    const md = `---\ntitle: ${project.title}\nslug: ${project.slug}\nnotionUrl: ${project.notionUrl}\n---\n\n${localized.content}\n`;
    await fs.writeFile(
      path.join(outputDir, "cases", `${project.slug}.md`),
      md,
      "utf8",
    );
  }

  await fs.writeFile(
    path.join(outputDir, "projects.json"),
    `${JSON.stringify(projectsWithLocalizedContent, null, 2)}\n`,
    "utf8",
  );

  console.log(
    `Done. Wrote ${projects.length} projects and ${projects.length} case files to ${outputDir}. Downloaded ${totalDownloaded} images (${totalFailed} failed).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
