#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const groups = {
  "nested-chirp-ai-check": [
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/774ef047-202c-4ec0-b0d8-7c1fdaba15e5/%D0%91%D0%B0%D0%B7%D0%BE%D0%B2%D1%8B%D0%B5_%D1%81%D1%86%D0%B5%D0%BD%D0%B0%D1%80%D0%B8%D0%B8_%D0%A0%D0%95%D0%94%D0%90%D0%9A%D0%A2%D0%98%D0%A0%D0%9E%D0%92%D0%90%D0%9D%D0%98%D0%95_%D0%9F%D0%A0%D0%9E%D0%A4%D0%98%D0%9B%D0%AF.png",
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/7131621d-cbeb-48c7-941d-a21abc1bb1e9/%D0%91%D0%B0%D0%B7%D0%BE%D0%B2%D1%8B%D0%B5_%D1%81%D1%86%D0%B5%D0%BD%D0%B0%D1%80%D0%B8%D0%B8_%D0%9F%D0%A0%D0%9E%D0%A1%D0%9C%D0%9E%D0%A2%D0%A0_%D0%A1%D0%9F%D0%95%D0%A6%D0%98%D0%A4%D0%98%D0%A7%D0%9D%D0%9E%D0%93%D0%9E_%D0%9E%D0%91%D0%AA%D0%95%D0%9A%D0%A2%D0%90_%D0%A1%D0%9F%D0%98%D0%A1%D0%9A%D0%90.png",
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/31d28af8-7317-48a2-bd02-a66a00f40b33/%D0%91%D0%B0%D0%B7%D0%BE%D0%B2%D1%8B%D0%B5_%D1%81%D1%86%D0%B5%D0%BD%D0%B0%D1%80%D0%B8%D0%B8_%D0%A0%D0%95%D0%94%D0%90%D0%9A%D0%A2%D0%98%D0%A0%D0%9E%D0%92%D0%90%D0%9D%D0%98%D0%95_%D0%A1%D0%9F%D0%95%D0%A6%D0%98%D0%A4%D0%98%D0%A7%D0%9D%D0%9E%D0%93%D0%9E_%D0%9E%D0%91%D0%AA%D0%95%D0%9A%D0%A2%D0%90_%D0%A1%D0%9F%D0%98%D0%A1%D0%9A%D0%90.png",
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/c7631fcc-1ac1-4527-99f8-bf819f46410b/%D0%91%D0%B0%D0%B7%D0%BE%D0%B2%D1%8B%D0%B5_%D1%81%D1%86%D0%B5%D0%BD%D0%B0%D1%80%D0%B8%D0%B8_%D0%9F%D0%A0%D0%9E%D0%92%D0%95%D0%A0%D0%9A%D0%90_%D0%94%D0%98%D0%90%D0%93%D0%9D%D0%9E%D0%97%D0%90.png",
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/e4285bb7-7050-45e0-91f5-429b629c301e/%D0%98%D1%81%D1%82%D0%BE%D1%80%D0%B8%D1%8F_%D0%B8_%D0%BA%D0%BE%D0%BD%D1%82%D0%B5%D0%BA%D1%81%D1%82.png",
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/7dc4c460-7c34-467d-9778-284310415103/%D0%9F%D1%80%D0%BE%D0%B7%D1%80%D0%B0%D1%87%D0%BD%D0%BE%D1%81%D1%82%D1%8C_%D0%B0%D0%BD%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0.png",
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/b8c7a798-ac6e-420c-8948-7a9a50f33b7e/%D0%9F%D0%BE%D0%BD%D1%8F%D1%82%D0%BD%D1%8B%D0%B9_%D1%80%D0%B5%D0%B7%D1%83%D0%BB%D1%8C%D1%82%D0%B0%D1%82.png",
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/c3c588bd-4a0c-4788-8332-00f0d78928db/%D0%A3%D0%BF%D1%80%D0%BE%D1%89%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B2%D0%B7%D0%B0%D0%B8%D0%BC%D0%BE%D0%B4%D0%B5%D0%B9%D1%81%D1%82%D0%B2%D0%B8%D1%8F.png"
  ],
  "nested-chirp-brand": [
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/1056e711-f94f-4e00-813b-6e8f4ad704c7/image.png",
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/3e29644b-9db0-4fca-934f-c934151e4f81/Group_4183.png",
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/997966c7-4027-44eb-883b-058feaefdb55/image.png",
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/5bbcc667-dcab-4346-9cab-904d5496c7bd/1366x_12.png",
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/7126a45f-3462-49f0-9374-d8316208d26a/%D0%90%D0%BD%D0%B8%D0%BC%D0%B0%D1%86%D0%B8%D1%8F.png",
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/afb84698-9a2c-4b90-beb5-425152efef18/1366x_13.png",
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/7c2c74dd-b4a9-4d01-87c8-d6fc4a297c95/1366x_23.png"
  ],
  "nested-lada-table": [
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/e79803f1-9fe7-402f-b31f-9426a7737fb8/image.png",
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/1e9a0c14-b27b-4654-bf72-1c8b183f16ba/Frame_2087326897.png",
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/84d5fdec-5c0a-4dad-9aba-41be2c39f162/Frame_861.png",
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/25e4f33a-2f1b-43d5-b186-ebd6eaf4fb16/Frame_2087326899.png",
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/45290907-498a-4c95-b006-496816636893/Frame_2087326903.png",
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/aad1ab3f-9df9-4be7-910e-3ba9c813b9f6/Frame_2087326901.png",
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/32768364-1292-48f4-a7ca-542cd9f49ff5/Frame_2087326907.png",
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/59263778-3975-4ba5-bf08-dad6184077e5/Frame_2087326904.png",
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/729f6ea2-d57a-4880-aa6f-23f950987a6e/Frame_2087326902.png"
  ],
  "nested-lada-inspector": [
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/b8961c54-7915-4b3b-b9b0-257ec85f142c/image.png"
  ]
};

function extFromUrl(url) {
  try {
    const ext = path.extname(new URL(url).pathname).toLowerCase();
    return ext || ".img";
  } catch {
    return ".img";
  }
}

async function main() {
  let ok = 0;
  let fail = 0;
  for (const [group, urls] of Object.entries(groups)) {
    const dir = path.join("public", "notion-assets", group);
    await fs.mkdir(dir, { recursive: true });
    for (let i = 0; i < urls.length; i += 1) {
      const url = urls[i];
      const hash = createHash("sha1").update(url).digest("hex").slice(0, 10);
      const file = `img-${String(i + 1).padStart(2, "0")}-${hash}${extFromUrl(url)}`;
      const target = path.join(dir, file);
      try {
        await fs.access(target);
        continue;
      } catch {}
      try {
        const res = await fetch(url);
        if (!res.ok) {
          fail += 1;
          continue;
        }
        const buf = Buffer.from(await res.arrayBuffer());
        await fs.writeFile(target, buf);
        ok += 1;
      } catch {
        fail += 1;
      }
    }
  }
  console.log(`Downloaded ${ok} files, failed ${fail}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
