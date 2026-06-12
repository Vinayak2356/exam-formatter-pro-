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
import type { ExamHeader, ExamPaper } from "@/components/ExamPaperView";
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

export async function exportExamDocx(
  header: ExamHeader,
  paper: ExamPaper,
  template?: string,
  logoDataUrl?: string | null,
  customConfig?: CustomTemplateConfig,
  footer?: string,
  themeColor?: string,
) {
  if (template === "board") {
    const fontName = "Times New Roman";
    const accentColorHex = "000000";
    const textColorHex = "000000";
    const secondaryColorHex = "000000";

    const children: (Paragraph | Table)[] = [];

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
        // ignore logo errors
      }
    }

    const borderBlack = { style: BorderStyle.SINGLE, size: 8, color: "000000" };
    const bordersBox = {
      top: borderBlack,
      bottom: borderBlack,
      left: borderBlack,
      right: borderBlack,
    };

    const headerCells = [];
    if (logoImageRun) {
      headerCells.push(
        new TableCell({
          width: { size: 15, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [logoImageRun],
            }),
          ],
        }),
      );
    }

    headerCells.push(
      new TableCell({
        columnSpan: logoImageRun ? 3 : 4,
        width: { size: logoImageRun ? 85 : 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: header.schoolName.toUpperCase(),
                bold: true,
                size: 30,
                font: "Times New Roman",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: header.schoolAddress, size: 20, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80 },
            children: [
              new TextRun({
                text: header.examTitle.toUpperCase(),
                bold: true,
                size: 24,
                font: "Times New Roman",
              }),
            ],
          }),
        ],
      }),
    );

    const metaRow = new TableRow({
      children: [
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `TIME: ${header.time}`,
                  bold: true,
                  size: 20,
                  font: "Times New Roman",
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `CLASS: ${header.className}`,
                  bold: true,
                  size: 20,
                  font: "Times New Roman",
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `SUBJECT: ${header.subject}`,
                  bold: true,
                  size: 20,
                  font: "Times New Roman",
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `MM: ${header.maxMarks}`,
                  bold: true,
                  size: 20,
                  font: "Times New Roman",
                }),
              ],
            }),
          ],
        }),
      ],
    });

    children.push(
      new Table({
        width: { size: 10000, type: WidthType.PERCENTAGE },
        borders: bordersBox,
        rows: [new TableRow({ children: headerCells }), metaRow],
      }),
      new Paragraph({ spacing: { before: 200, after: 120 } }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Name: _______________________________",
            bold: true,
            size: 20,
            font: "Times New Roman",
          }),
          new TextRun({
            text: "      Roll No: ____________________",
            bold: true,
            size: 20,
            font: "Times New Roman",
          }),
          new TextRun({
            text: "      Inv. Sign: ____________________",
            bold: true,
            size: 20,
            font: "Times New Roman",
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "All questions are compulsory.",
            italics: true,
            size: 20,
            font: "Times New Roman",
          }),
        ],
      }),
    );

    for (const section of paper.sections || []) {
      const rows: TableRow[] = [];

      rows.push(
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({
              width: { size: 12, type: WidthType.PERCENTAGE },
              borders: bordersBox,
              shading: { fill: "F2F2F2" },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: "Q.No", bold: true, size: 22, font: "Times New Roman" }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 76, type: WidthType.PERCENTAGE },
              borders: bordersBox,
              shading: { fill: "F2F2F2" },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: section.name.toUpperCase(),
                      bold: true,
                      size: 22,
                      font: "Times New Roman",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 12, type: WidthType.PERCENTAGE },
              borders: bordersBox,
              shading: { fill: "F2F2F2" },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: "MKS", bold: true, size: 22, font: "Times New Roman" }),
                  ],
                }),
              ],
            }),
          ],
        }),
      );

      for (const q of section.questions || []) {
        const qCellChildren: Paragraph[] = [];

        if (q.instruction) {
          qCellChildren.push(
            new Paragraph({
              children: [
                new TextRun({ text: q.instruction, bold: true, size: 20, font: "Times New Roman" }),
              ],
            }),
          );
        }

        if (q.passage) {
          qCellChildren.push(
            new Paragraph({
              indent: { left: 240 },
              spacing: { before: 60, after: 60 },
              border: { left: { style: BorderStyle.SINGLE, size: 12, color: "000000", space: 4 } },
              children: [
                new TextRun({ text: q.passage, italics: true, size: 20, font: "Times New Roman" }),
              ],
            }),
          );
        }

        for (const sq of q.subQuestions || []) {
          qCellChildren.push(
            new Paragraph({
              spacing: { before: 60, after: 60 },
              children: [
                new TextRun({
                  text: `${sq.label}. `,
                  bold: true,
                  size: 20,
                  font: "Times New Roman",
                }),
                new TextRun({ text: sq.text, size: 20, font: "Times New Roman" }),
              ],
            }),
          );

          if (sq.options && sq.options.length) {
            qCellChildren.push(
              new Paragraph({
                indent: { left: 360 },
                spacing: { after: 60 },
                children: [
                  new TextRun({
                    text: sq.options.map((o) => `${o} [ ]`).join("    "),
                    size: 20,
                    font: "Times New Roman",
                  }),
                ],
              }),
            );
          }
        }

        rows.push(
          new TableRow({
            children: [
              new TableCell({
                width: { size: 12, type: WidthType.PERCENTAGE },
                borders: bordersBox,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: q.number,
                        bold: true,
                        size: 20,
                        font: "Times New Roman",
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 76, type: WidthType.PERCENTAGE },
                borders: bordersBox,
                children: qCellChildren.length ? qCellChildren : [new Paragraph({})],
              }),
              new TableCell({
                width: { size: 12, type: WidthType.PERCENTAGE },
                borders: bordersBox,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: String(q.marks),
                        bold: true,
                        size: 20,
                        font: "Times New Roman",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        );
      }

      children.push(
        new Table({
          width: { size: 10000, type: WidthType.PERCENTAGE },
          rows,
        }),
        new Paragraph({ spacing: { before: 100, after: 100 } }),
      );
    }

    if (footer) {
      children.push(
        new Paragraph({
          spacing: { before: 240, after: 120 },
          border: { top: { style: BorderStyle.DASHED, size: 6, color: "000000", space: 4 } },
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: footer, size: 20, font: "Times New Roman", italics: true }),
          ],
        }),
      );
    }

    children.push(
      new Paragraph({
        spacing: { before: 400 },
        children: [
          new TextRun({
            text: "Invigilator: ____________________",
            size: 22,
            font: "Times New Roman",
            bold: true,
          }),
          new TextRun({
            text: "        Examiner: ____________________",
            size: 22,
            font: "Times New Roman",
            bold: true,
          }),
        ],
      }),
    );

    const doc = new Document({
      styles: {
        default: { document: { run: { font: "Times New Roman", size: 22 } } },
      },
      sections: [
        {
          properties: { page: { margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${header.subject}-${header.className}-exam.docx`);
    return;
  }

  const isCustom = template === "custom" && !!customConfig;
  const fontName = isCustom ? cleanFontName(customConfig.fontFamily) : "Times New Roman";
  const accentColorHex = isCustom
    ? getHexColor(customConfig.accentColor)
    : themeColor
      ? getHexColor(themeColor)
      : "000000";
  const textColorHex = isCustom ? getHexColor(customConfig.textColor) : "000000";
  const secondaryColorHex = isCustom ? getHexColor(customConfig.secondaryColor) : "555555";

  const children: (Paragraph | Table)[] = [];

  function p(
    text: string,
    opts: Partial<{
      bold: boolean;
      size: number;
      align: (typeof AlignmentType)[keyof typeof AlignmentType];
      spacing: number;
      color: string;
    }> = {},
  ) {
    return new Paragraph({
      alignment: opts.align,
      spacing: { after: opts.spacing ?? 80 },
      children: [
        new TextRun({
          text,
          bold: opts.bold,
          size: opts.size ?? 22,
          font: fontName,
          color: opts.color ?? textColorHex,
        }),
      ],
    });
  }

  let logoImageRun: ImageRun | null = null;
  if (logoDataUrl) {
    try {
      const { buf, type } = await dataUrlToBuffer(logoDataUrl);
      logoImageRun = new ImageRun({
        type,
        data: buf,
        transformation: { width: 70, height: 70 },
        altText: { title: "Logo", description: "School logo", name: "logo" },
      });
    } catch {
      // ignore logo errors
    }
  }

  const headerLayoutClass = isCustom ? customConfig.headerLayout : "logo-left";

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
                        size: 32,
                        font: fontName,
                        color: accentColorHex,
                      }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: header.schoolAddress,
                        size: 22,
                        font: fontName,
                        color: secondaryColorHex,
                      }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: header.examTitle,
                        bold: true,
                        size: 24,
                        font: fontName,
                        color: accentColorHex,
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
                        size: 32,
                        font: fontName,
                        color: accentColorHex,
                      }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: header.schoolAddress,
                        size: 22,
                        font: fontName,
                        color: secondaryColorHex,
                      }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: header.examTitle,
                        bold: true,
                        size: 24,
                        font: fontName,
                        color: accentColorHex,
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
            size: 32,
            font: fontName,
            color: accentColorHex,
          }),
        ],
      }),
      p(header.schoolAddress, {
        align: headerLayoutClass === "left" ? AlignmentType.LEFT : AlignmentType.CENTER,
        size: 22,
        color: secondaryColorHex,
      }),
      new Paragraph({
        alignment: headerLayoutClass === "left" ? AlignmentType.LEFT : AlignmentType.CENTER,
        children: [
          new TextRun({
            text: header.examTitle,
            bold: true,
            size: 24,
            font: fontName,
            color: accentColorHex,
          }),
        ],
      }),
    );
  }

  children.push(
    new Paragraph({
      spacing: { after: 200, before: 100 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: accentColorHex, space: 4 } },
      children: [],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `TIME: ${header.time}`,
          bold: true,
          size: 22,
          font: fontName,
          color: textColorHex,
        }),
        new TextRun({
          text: `        CLASS: ${header.className}`,
          bold: true,
          size: 22,
          font: fontName,
          color: textColorHex,
        }),
        new TextRun({
          text: `        SUBJECT: ${header.subject}`,
          bold: true,
          size: 22,
          font: fontName,
          color: textColorHex,
        }),
        new TextRun({
          text: `        MM: ${header.maxMarks}`,
          bold: true,
          size: 22,
          font: fontName,
          color: textColorHex,
        }),
      ],
    }),
  );

  for (const section of paper.sections || []) {
    const sectionStyle = isCustom ? customConfig.sectionStyle : "underline";
    let sectionPara: Paragraph;

    if (sectionStyle === "filled" || sectionStyle === "pill") {
      sectionPara = new Paragraph({
        spacing: { before: 200, after: 120 },
        shading: { fill: accentColorHex },
        children: [
          new TextRun({
            text: `  ${section.name}  (${section.marks} Marks)  `,
            bold: true,
            size: 26,
            font: fontName,
            color: isCustom ? getHexColor(customConfig.bgColor) : "FFFFFF",
          }),
        ],
      });
    } else if (sectionStyle === "left-bar") {
      sectionPara = new Paragraph({
        spacing: { before: 200, after: 120 },
        border: { left: { style: BorderStyle.SINGLE, size: 24, color: accentColorHex, space: 6 } },
        children: [
          new TextRun({
            text: `  ${section.name}  (${section.marks} Marks)`,
            bold: true,
            size: 26,
            font: fontName,
            color: accentColorHex,
          }),
        ],
      });
    } else if (sectionStyle === "dots") {
      sectionPara = new Paragraph({
        spacing: { before: 200, after: 120 },
        children: [
          new TextRun({
            text: `▪ ${section.name}  (${section.marks} Marks)`,
            bold: true,
            size: 26,
            font: fontName,
            color: accentColorHex,
          }),
        ],
      });
    } else if (sectionStyle === "none") {
      sectionPara = new Paragraph({
        spacing: { before: 200, after: 120 },
        children: [
          new TextRun({
            text: `${section.name}  (${section.marks} Marks)`,
            bold: true,
            size: 26,
            font: fontName,
            color: textColorHex,
          }),
        ],
      });
    } else {
      sectionPara = new Paragraph({
        spacing: { before: 200, after: 120 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: accentColorHex, space: 2 } },
        children: [
          new TextRun({
            text: `${section.name}  (${section.marks} Marks)`,
            bold: true,
            size: 26,
            font: fontName,
            color: accentColorHex,
          }),
        ],
      });
    }

    children.push(sectionPara);

    for (const q of section.questions || []) {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 60 },
          children: [
            new TextRun({
              text: `${q.number}. `,
              bold: true,
              size: 22,
              font: fontName,
              color: textColorHex,
            }),
            new TextRun({ text: q.instruction, size: 22, font: fontName, color: textColorHex }),
            new TextRun({
              text: `   (${q.marks})`,
              bold: true,
              size: 22,
              font: fontName,
              color: textColorHex,
            }),
          ],
        }),
      );

      if (q.passage) {
        children.push(
          new Paragraph({
            indent: { left: 360 },
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: q.passage,
                italics: true,
                size: 22,
                font: fontName,
                color: textColorHex,
              }),
            ],
          }),
        );
      }

      for (const sq of q.subQuestions || []) {
        children.push(
          new Paragraph({
            indent: { left: 360 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: `${sq.label} `,
                bold: true,
                size: 22,
                font: fontName,
                color: textColorHex,
              }),
              new TextRun({ text: sq.text, size: 22, font: fontName, color: textColorHex }),
            ],
          }),
        );
        if (sq.options && sq.options.length) {
          children.push(
            new Paragraph({
              indent: { left: 720 },
              spacing: { after: 60 },
              children: [
                new TextRun({
                  text: sq.options.map((o) => `${o} [ ]`).join("    "),
                  size: 22,
                  font: fontName,
                  color: textColorHex,
                }),
              ],
            }),
          );
        }
      }
    }
  }

  if (footer) {
    children.push(
      new Paragraph({
        spacing: { before: 240, after: 120 },
        border: { top: { style: BorderStyle.SINGLE, size: 6, color: accentColorHex, space: 4 } },
        children: [new TextRun({ text: footer, size: 22, font: fontName, color: textColorHex })],
      }),
    );
  }

  children.push(
    new Paragraph({
      spacing: { before: 400 },
      children: [
        new TextRun({
          text: "Invigilator: ____________________",
          size: 22,
          font: fontName,
          color: textColorHex,
        }),
        new TextRun({
          text: "        Examiner: ____________________",
          size: 22,
          font: fontName,
          color: textColorHex,
        }),
      ],
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
    styles: {
      default: { document: { run: { font: fontName, size: 22 } } },
    },
    sections: [
      {
        properties: { page: { margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
        headers,
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${header.subject}-${header.className}-exam.docx`);
}

import { withHexStylesForPdf } from "@/lib/utils";

export async function exportExamPdf(filename: string) {
  const el = document.querySelector(".exam-paper") as HTMLElement | null;
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
