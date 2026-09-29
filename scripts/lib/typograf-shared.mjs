import Typograf from "typograf";

let instance;

const widowWords = [
  "а", "в", "во", "и", "к", "ко", "на", "не", "ни", "о", "об", "от", "по",
  "с", "со", "у", "за", "из", "до", "для", "над", "под", "при", "про", "без",
  "как", "что", "это", "его", "её", "их", "всё", "все", "или", "либо", "ещё", "еще",
].join("|");

function bindWidowWords(text) {
  return text.replace(
    new RegExp(`(^|[^\\p{L}])(${widowWords})[ \\t]+(?=\\p{L})`, "giu"),
    "$1$2\u00a0",
  );
}

export function getTypograf() {
  if (!instance) {
    instance = new Typograf({
      locale: ["ru", "en-US"],
      htmlEntity: { type: "default", only: ["nbsp"] },
    });
    instance.enableRule("common/nbsp/*");
    instance.enableRule("ru/nbsp/*");
    instance.enableRule("ru/punctuation/*");
    instance.enableRule("ru/other/typograph");
    instance.enableRule("common/punctuation/*");
    instance.enableRule("common/space/*");
    instance.enableRule("common/other/*");
  }
  return instance;
}

/** Plain text → HTML-сущности (&nbsp; и т.д.). */
export function typografText(text) {
  if (text == null || text === "") return text ?? "";
  if (!String(text).trim()) return text;
  return bindWidowWords(getTypograf()
    .execute(String(text))
    .replace(/\b([12]\d{3})\s*—\s*([12]\d{3})\b/g, "$1\u00a0—\u00a0$2")
    .replace(/\bE-(comm(?:erce)?)/gi, "E‑$1")
    .replace(/\b(AI|B2B|B2C|UX|UI|MVP)-(?=\p{L})/gu, "$1‑")
    .trimEnd());
}
