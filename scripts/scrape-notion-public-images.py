import hashlib
import re
from pathlib import Path
from urllib.parse import urlparse

import requests

PAGES = {
    "showcase": "https://www.notion.so/ad67228eaaf348d1962ca3ed15cba885",
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
}

ASSETS_ROOT = Path("public/notion-assets")
URL_RE = re.compile(r"https://prod-files-secure[^\s\"')>]+")


def ext_from_url(url: str) -> str:
    path = urlparse(url).path
    suffix = Path(path).suffix.lower()
    return suffix if suffix else ".img"


def normalize(url: str) -> str:
    return (
        url.replace("\\u0026", "&")
        .replace("&amp;", "&")
        .replace("%5Cu0026", "&")
    )


def main() -> None:
    total = 0
    for bucket, page_url in PAGES.items():
        html = requests.get(page_url, timeout=45).text
        raw_urls = {normalize(u) for u in URL_RE.findall(html)}
        if not raw_urls:
            continue
        out_dir = ASSETS_ROOT / bucket
        out_dir.mkdir(parents=True, exist_ok=True)
        for i, url in enumerate(sorted(raw_urls), start=1):
            h = hashlib.sha1(url.encode("utf-8")).hexdigest()[:10]
            file_name = f"img-{i:02d}-{h}{ext_from_url(url)}"
            out_path = out_dir / file_name
            if out_path.exists():
                continue
            try:
                res = requests.get(url, timeout=45)
                if res.status_code == 200:
                    out_path.write_bytes(res.content)
                    total += 1
            except Exception:
                pass
    print(f"Downloaded {total} images from public Notion pages")


if __name__ == "__main__":
    main()
