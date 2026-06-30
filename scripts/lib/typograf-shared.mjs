import Typograf from "typograf";

let instance;

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
  return getTypograf().execute(String(text)).trimEnd();
}
