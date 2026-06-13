import { withHexStylesForPdf } from "@/lib/utils";
import FileSaver from "file-saver";

export async function exportRawHtmlPdf(html: string, filename: string) {
  const html2pdf = (await import("html2pdf.js")).default;

  // Create a temporary container
  const container = document.createElement("div");
  container.innerHTML = html;
  // Make it visible to html2canvas but off-screen to avoid layout shifts
  container.style.position = "absolute";
  container.style.top = "-9999px";
  container.style.left = "-9999px";
  container.style.width = "800px"; // standard width
  container.style.backgroundColor = "white";
  container.style.color = "black";
  container.style.padding = "20px";
  document.body.appendChild(container);

  await withHexStylesForPdf(async () => {
    try {
      await (
        html2pdf() as unknown as {
          set: (o: Record<string, unknown>) => {
            from: (e: HTMLElement) => { save: () => Promise<void> };
          };
        }
      )
        .set({
          margin: 10,
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(container)
        .save();
    } finally {
      document.body.removeChild(container);
    }
  });
}

export async function exportRawHtmlDocx(html: string, filename: string) {
  try {
    const res = await fetch("/api/public/export-docx", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html }),
    });
    if (!res.ok) throw new Error("Failed to export DOCX");
    const blob = await res.blob();
    FileSaver.saveAs(blob, filename);
  } catch (err) {
    console.error("Export DOCX failed:", err);
    throw err;
  }
}
