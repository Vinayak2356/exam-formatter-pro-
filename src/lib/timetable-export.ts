import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  PageOrientation,
  ImageRun,
  Header,
} from "docx";
import FileSaver from "file-saver";
const { saveAs } = FileSaver;
import type { TimetableHeader, TimetableData, TimetableTemplate } from "@/components/TimetableView";
import type { CustomTemplateConfig } from "@/components/CustomTemplateDesigner";

function cleanFontName(fontFamily: string): string {
  if (fontFamily.includes("Times New Roman")) return "Times New Roman";
  if (fontFamily.includes("Georgia")) return "Georgia";
  if (fontFamily.includes("Arial")) return "Arial";
  if (fontFamily.includes("Segoe UI")) return "Segoe UI";
  if (fontFamily.includes("Courier")) return "Courier New";
  if (fontFamily.includes("Garamond")) return "Garamond";
  return "Calibri";
}

const getHexColor = (color: string) => color.replace("#", "");

async function dataUrlToBuffer(
  dataUrl: string,
): Promise<{ buf: ArrayBuffer; type: "png" | "jpg" }> {
  const res = await fetch(dataUrl);
  const buf = await res.arrayBuffer();
  const type = dataUrl.startsWith("data:image/png") ? "png" : "jpg";
  return { buf, type };
}

export async function exportTimetableDocx(
  header: TimetableHeader,
  data: TimetableData,
  template: TimetableTemplate,
  logoDataUrl?: string | null,
  customConfig?: CustomTemplateConfig,
) {
  const isCustom = template === ("custom" as TimetableTemplate) && !!customConfig;
  const accent = isCustom
    ? getHexColor(customConfig.accentColor)
    : template === "vvip"
      ? "C9A227"
      : "1E2761";
  const fontName = isCustom ? cleanFontName(customConfig.fontFamily) : "Calibri";
  const textColorHex = isCustom ? getHexColor(customConfig.textColor) : "000000";
  const secondaryColorHex = isCustom ? getHexColor(customConfig.secondaryColor) : "555555";
  const bgColorHex = isCustom ? getHexColor(customConfig.bgColor) : "FFFFFF";

  const cellBorderColor = isCustom ? accent : "888888";
  const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: cellBorderColor };
  const cellBorders = {
    top: cellBorder,
    bottom: cellBorder,
    left: cellBorder,
    right: cellBorder,
  };

  const totalWidth = 14400; // ~10 inches usable
  const cols = data.periods.length + 1;
  const dayCol = 1200;
  const periodCol = Math.floor((totalWidth - dayCol) / data.periods.length);
  const columnWidths = [dayCol, ...Array(data.periods.length).fill(periodCol)];

  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        width: { size: dayCol, type: WidthType.DXA },
        borders: cellBorders,
        shading: { fill: accent, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "Day",
                bold: true,
                color: isCustom ? bgColorHex : "FFFFFF",
                font: fontName,
              }),
            ],
          }),
        ],
      }),
      ...data.periods.map(
        (p) =>
          new TableCell({
            width: { size: periodCol, type: WidthType.DXA },
            borders: cellBorders,
            shading: { fill: accent, type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 80, right: 80 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: p.label,
                    bold: true,
                    color: isCustom ? bgColorHex : "FFFFFF",
                    size: 18,
                    font: fontName,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: p.time,
                    color: isCustom ? bgColorHex : "FFFFFF",
                    size: 16,
                    font: fontName,
                  }),
                ],
              }),
            ],
          }),
      ),
    ],
  });

  const bodyRows = data.days.map(
    (day, di) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: dayCol, type: WidthType.DXA },
            borders: cellBorders,
            shading: { fill: "F5F5F5", type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: day, bold: true, font: fontName, color: textColorHex }),
                ],
              }),
            ],
          }),
          ...data.periods.map((p, pi) => {
            const c = data.grid[di]?.[pi] || { subject: "", teacher: "" };
            const isBreak = p.isBreak || /lunch|break/i.test(c.subject);
            return new TableCell({
              width: { size: periodCol, type: WidthType.DXA },
              borders: cellBorders,
              shading: isBreak ? { fill: "EEF2F6", type: ShadingType.CLEAR } : undefined,
              margins: { top: 60, bottom: 60, left: 80, right: 80 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: c.subject || "",
                      bold: true,
                      size: 18,
                      font: fontName,
                      color: textColorHex,
                    }),
                  ],
                }),
                ...(c.teacher
                  ? [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: c.teacher,
                            size: 16,
                            color: isCustom ? secondaryColorHex : "555555",
                            font: fontName,
                          }),
                        ],
                      }),
                    ]
                  : []),
              ],
            });
          }),
        ],
      }),
  );

  const headerChildren: Paragraph[] = [];
  let logoImageRun: ImageRun | null = null;
  if (logoDataUrl) {
    try {
      const { buf, type } = await dataUrlToBuffer(logoDataUrl);
      logoImageRun = new ImageRun({
        type,
        data: buf,
        transformation: { width: 60, height: 60 },
        altText: { title: "Logo", description: "School logo", name: "logo" },
      });
    } catch {
      /* ignore */
    }
  }

  const headerLayoutClass = isCustom ? customConfig.headerLayout : "centered";

  if (headerLayoutClass === "logo-left" && logoImageRun) {
    headerChildren.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          logoImageRun,
          new TextRun({
            text: `   ${header.schoolName}`,
            bold: true,
            size: 32,
            color: accent,
            font: fontName,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text: `   ${header.schoolAddress}`,
            size: 20,
            font: fontName,
            color: secondaryColorHex,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: `   ${header.className} — ${header.title}`,
            bold: true,
            size: 24,
            font: fontName,
            color: textColorHex,
          }),
        ],
      }),
    );
  } else if (headerLayoutClass === "logo-right" && logoImageRun) {
    headerChildren.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: `${header.schoolName}   `,
            bold: true,
            size: 32,
            color: accent,
            font: fontName,
          }),
          logoImageRun,
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: `${header.schoolAddress}   `,
            size: 20,
            font: fontName,
            color: secondaryColorHex,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: `${header.className} — ${header.title}   `,
            bold: true,
            size: 24,
            font: fontName,
            color: textColorHex,
          }),
        ],
      }),
    );
  } else {
    if (logoImageRun) {
      headerChildren.push(
        new Paragraph({
          alignment: headerLayoutClass === "left" ? AlignmentType.LEFT : AlignmentType.CENTER,
          children: [logoImageRun],
        }),
      );
    }
    headerChildren.push(
      new Paragraph({
        alignment: headerLayoutClass === "left" ? AlignmentType.LEFT : AlignmentType.CENTER,
        children: [
          new TextRun({
            text: header.schoolName,
            bold: true,
            size: 32,
            color: accent,
            font: fontName,
          }),
        ],
      }),
      new Paragraph({
        alignment: headerLayoutClass === "left" ? AlignmentType.LEFT : AlignmentType.CENTER,
        children: [
          new TextRun({
            text: header.schoolAddress,
            size: 20,
            font: fontName,
            color: secondaryColorHex,
          }),
        ],
      }),
      new Paragraph({
        alignment: headerLayoutClass === "left" ? AlignmentType.LEFT : AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: `${header.className} — ${header.title}`,
            bold: true,
            size: 24,
            font: fontName,
            color: textColorHex,
          }),
        ],
      }),
    );
  }

  const notesParagraphs = (data.notes || []).map(
    (n) =>
      new Paragraph({
        spacing: { before: 60 },
        children: [new TextRun({ text: `• ${n}`, size: 18, font: fontName, color: textColorHex })],
      }),
  );

  const headers =
    isCustom && customConfig.showWatermark && customConfig.watermarkText
      ? {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: customConfig.watermarkText.toUpperCase(),
                    color: "E0E0E0",
                    size: 14,
                    bold: true,
                    font: fontName,
                  }),
                ],
              }),
            ],
          }),
        }
      : undefined;

  const doc = new Document({
    styles: { default: { document: { run: { font: fontName, size: 20 } } } },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906,
              height: 16838,
              orientation: PageOrientation.LANDSCAPE,
            },
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        headers,
        children: [
          ...headerChildren,
          new Table({
            width: { size: totalWidth, type: WidthType.DXA },
            columnWidths,
            rows: [headerRow, ...bodyRows],
          }),
          ...(notesParagraphs.length
            ? [
                new Paragraph({
                  spacing: { before: 240 },
                  children: [
                    new TextRun({
                      text: "Notes:",
                      bold: true,
                      font: fontName,
                      color: textColorHex,
                    }),
                  ],
                }),
                ...notesParagraphs,
              ]
            : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${header.className}-timetable.docx`);
}

import { withHexStylesForPdf } from "@/lib/utils";

export async function exportTimetablePdf(filename: string) {
  const el = document.querySelector(".timetable-paper") as HTMLElement | null;
  if (!el) return;
  const html2pdf = (await import("html2pdf.js")).default;

  await withHexStylesForPdf(async () => {
    await (
      html2pdf() as unknown as {
        set: (o: Record<string, unknown>) => {
          from: (e: HTMLElement) => { save: () => Promise<void> };
        };
      }
    )
      .set({
        margin: 8,
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
      })
      .from(el)
      .save();
  });
}
