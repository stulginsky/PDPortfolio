import { RESUME_PDF_PATH } from "~/constants/resume";

/** Opens the resume PDF and triggers the browser print dialog. */
export function printResumePdf(pdfUrl = RESUME_PDF_PATH): void {
  if (typeof window === "undefined") return;

  const iframe = document.createElement("iframe");
  iframe.setAttribute("title", "Резюме для печати");
  iframe.style.cssText =
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;";
  iframe.src = pdfUrl;

  const cleanup = () => {
    window.setTimeout(() => iframe.remove(), 1000);
  };

  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      const win = window.open(pdfUrl, "_blank", "noopener,noreferrer");
      if (win) {
        win.addEventListener("load", () => win.print(), { once: true });
      }
    }
    cleanup();
  };

  document.body.appendChild(iframe);
}
