import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  Header,
} from "docx";
import FileSaver from "file-saver";
const { saveAs } = FileSaver;
import type { HHWHeader, HHWPacket, HHWTemplate } from "@/components/HHWView";
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

const VVIP_GOLD = "C9A227";

export async function exportHHWDocx(
  header: HHWHeader,
  packet: HHWPacket,
  template: HHWTemplate,
  logoDataUrl?: string | null,
  customConfig?: CustomTemplateConfig,
) {
  const isCustom = template === ("custom" as HHWTemplate) && !!customConfig;
  const accent = isCustom
    ? getHexColor(customConfig.accentColor)
    : template === "vvip"
      ? VVIP_GOLD
      : "1E2761";
  const font = isCustom
    ? cleanFontName(customConfig.fontFamily)
    : template === "vvip"
      ? "Georgia"
      : "Times New Roman";
  const textColor = isCustom ? getHexColor(customConfig.textColor) : "000000";
  const secondaryColor = isCustom ? getHexColor(customConfig.secondaryColor) : "555555";
  const bgColor = isCustom ? getHexColor(customConfig.bgColor) : "FFFFFF";

  const children: (Paragraph | Table)[] = [];

  let logoImageRun: ImageRun | null = null;
  if (logoDataUrl) {
    try {
      const { buf, type } = await dataUrlToBuffer(logoDataUrl);
      logoImageRun = new ImageRun({
        type,
        data: buf,
        transformation: { width: 90, height: 90 },
        altText: { title: "Logo", description: "School logo", name: "logo" },
      });
    } catch {
      /* ignore */
    }
  }

  const headerLayoutClass = isCustom ? customConfig.headerLayout : "centered";

  if (headerLayoutClass === "logo-left" && logoImageRun) {
    children.push(
      new Table({
        width: { size: 10000, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 15, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.LEFT,
                    children: [logoImageRun],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 85, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: header.schoolName,
                        bold: true,
                        size: 44,
                        color: accent,
                        font,
                      }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: header.schoolAddress,
                        size: 22,
                        font,
                        color: secondaryColor,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    );
  } else if (headerLayoutClass === "logo-right" && logoImageRun) {
    children.push(
      new Table({
        width: { size: 10000, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 85, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: header.schoolName,
                        bold: true,
                        size: 44,
                        color: accent,
                        font,
                      }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: header.schoolAddress,
                        size: 22,
                        font,
                        color: secondaryColor,
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 15, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [logoImageRun],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    );
  } else {
    if (logoImageRun) {
      children.push(
        new Paragraph({
          alignment: headerLayoutClass === "left" ? AlignmentType.LEFT : AlignmentType.CENTER,
          children: [logoImageRun],
        }),
      );
    }
    children.push(
      new Paragraph({
        alignment: headerLayoutClass === "left" ? AlignmentType.LEFT : AlignmentType.CENTER,
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun({
            text: header.schoolName,
            bold: true,
            size: 44,
            color: accent,
            font,
          }),
        ],
      }),
      new Paragraph({
        alignment: headerLayoutClass === "left" ? AlignmentType.LEFT : AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({ text: header.schoolAddress, size: 22, font, color: secondaryColor }),
        ],
      }),
    );
  }

  children.push(
    new Paragraph({
      alignment: headerLayoutClass === "left" ? AlignmentType.LEFT : AlignmentType.CENTER,
      spacing: { before: 200, after: 120 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 8, color: accent, space: 4 },
      },
      children: [
        new TextRun({
          text: (packet.title || header.title).toUpperCase(),
          bold: true,
          size: 32,
          font,
          color: accent,
        }),
      ],
    }),
    new Paragraph({
      alignment: headerLayoutClass === "left" ? AlignmentType.LEFT : AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `CLASS — ${header.className}`,
          bold: true,
          size: 26,
          font,
          color: textColor,
        }),
      ],
    }),
  );

  if (packet.generalInstructions?.length) {
    children.push(
      new Paragraph({
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: "General Instructions",
            bold: true,
            size: 26,
            color: accent,
            font,
          }),
        ],
      }),
    );
    for (const ins of packet.generalInstructions) {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [new TextRun({ text: ins, size: 22, font, color: textColor })],
        }),
      );
    }
  }

  for (const sub of packet.subjects || []) {
    const sectionStyle = isCustom ? customConfig.sectionStyle : "filled";
    let subPara: Paragraph;

    if (sectionStyle === "filled" || sectionStyle === "pill") {
      subPara = new Paragraph({
        spacing: { before: 280, after: 120 },
        shading: { fill: accent },
        children: [
          new TextRun({
            text: `  SUBJECT: ${sub.subject}  `,
            bold: true,
            size: 26,
            color: bgColor,
            font,
          }),
        ],
      });
    } else if (sectionStyle === "underline") {
      subPara = new Paragraph({
        spacing: { before: 280, after: 120 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: accent, space: 2 } },
        children: [
          new TextRun({
            text: `SUBJECT: ${sub.subject}`,
            bold: true,
            size: 26,
            color: accent,
            font,
          }),
        ],
      });
    } else if (sectionStyle === "left-bar") {
      subPara = new Paragraph({
        spacing: { before: 280, after: 120 },
        border: { left: { style: BorderStyle.SINGLE, size: 24, color: accent, space: 6 } },
        children: [
          new TextRun({
            text: `  SUBJECT: ${sub.subject}`,
            bold: true,
            size: 26,
            color: accent,
            font,
          }),
        ],
      });
    } else if (sectionStyle === "dots") {
      subPara = new Paragraph({
        spacing: { before: 280, after: 120 },
        children: [
          new TextRun({
            text: `▪ SUBJECT: ${sub.subject}`,
            bold: true,
            size: 26,
            color: accent,
            font,
          }),
        ],
      });
    } else {
      subPara = new Paragraph({
        spacing: { before: 280, after: 120 },
        children: [
          new TextRun({
            text: `SUBJECT: ${sub.subject}`,
            bold: true,
            size: 26,
            color: textColor,
            font,
          }),
        ],
      });
    }

    children.push(subPara);

    if (sub.note) {
      children.push(
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({ text: sub.note, italics: true, size: 22, font, color: textColor }),
          ],
        }),
      );
    }
    for (const a of sub.assignments || []) {
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({ text: `${a.number}. `, bold: true, size: 22, font, color: textColor }),
            new TextRun({ text: a.text, size: 22, font, color: textColor }),
          ],
        }),
      );
    }
  }

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
                    font,
                  }),
                ],
              }),
            ],
          }),
        }
      : undefined;

  const doc = new Document({
    styles: { default: { document: { run: { font, size: 22 } } } },
    sections: [
      {
        properties: { page: { margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
        headers,
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${header.className}-holiday-homework.docx`);
}

import { withHexStylesForPdf } from "@/lib/utils";

export async function exportHHWPdf(filename: string) {
  const el = document.querySelector(".hhw-paper") as HTMLElement | null;
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
        margin: 10,
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(el)
      .save();
  });
}
