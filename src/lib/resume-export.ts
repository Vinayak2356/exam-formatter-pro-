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
  Header,
} from "docx";
import FileSaver from "file-saver";
const { saveAs } = FileSaver;
import type { JobResumeData, MatrimonialBiodataData } from "@/components/ResumeView";
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

function createKeyValueRow(
  key: string,
  value: string,
  fontName: string,
  textColor = "111111",
  keyColor = "555555",
) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 2500, type: WidthType.DXA },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
        },
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: key,
                bold: true,
                size: 20,
                font: fontName,
                color: keyColor,
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 6500, type: WidthType.DXA },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
        },
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `:   ${value}`,
                size: 20,
                font: fontName,
                color: textColor,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

import { withHexStylesForPdf } from "@/lib/utils";

export async function exportResumePdf(filename: string, mode: "job" | "wedding") {
  const selector = mode === "job" ? ".resume-paper" : ".biodata-paper";
  const el = document.querySelector(selector) as HTMLElement | null;
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

export async function exportResumeDocx(
  data: JobResumeData,
  template: string,
  themeColor: string = "#1E2761",
  customConfig?: CustomTemplateConfig,
) {
  const isCustom = template === "custom" && !!customConfig;
  const fontName = isCustom
    ? cleanFontName(customConfig.fontFamily)
    : template === "classic"
      ? "Georgia"
      : "Calibri";
  const accentColor = isCustom
    ? getHexColor(customConfig.accentColor)
    : themeColor.replace("#", "");
  const textColorHex = isCustom ? getHexColor(customConfig.textColor) : "000000";
  const secondaryColorHex = isCustom ? getHexColor(customConfig.secondaryColor) : "555555";

  const visible =
    isCustom && customConfig.visibleSections
      ? customConfig.visibleSections
      : {
          summary: true,
          experience: true,
          projects: true,
          education: true,
          skills: true,
          languages: true,
        };

  const titles =
    isCustom && customConfig.sectionTitles
      ? customConfig.sectionTitles
      : {
          experience: "Work Experience",
          projects: "Key Projects",
          education: "Education",
          skills: "Skills",
          languages: "Languages",
        };

  const children: Paragraph[] = [];

  const p = (
    text: string,
    opts: Partial<{
      bold: boolean;
      size: number;
      color: string;
      align: (typeof AlignmentType)[keyof typeof AlignmentType];
      spacing: { before?: number; after?: number };
    }> = {},
  ) => {
    return new Paragraph({
      alignment: opts.align,
      spacing: { before: opts.spacing?.before ?? 0, after: opts.spacing?.after ?? 80 },
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
  };

  const heading = (title: string) => {
    const sectionStyle = isCustom ? customConfig.sectionStyle : "underline";
    let headingPara: Paragraph;

    if (sectionStyle === "filled" || sectionStyle === "pill") {
      headingPara = new Paragraph({
        spacing: { before: 240, after: 120 },
        shading: { fill: accentColor },
        children: [
          new TextRun({
            text: `  ${title.toUpperCase()}  `,
            bold: true,
            size: 24,
            font: fontName,
            color: isCustom ? getHexColor(customConfig.bgColor) : "FFFFFF",
          }),
        ],
      });
    } else if (sectionStyle === "left-bar") {
      headingPara = new Paragraph({
        spacing: { before: 240, after: 120 },
        border: { left: { style: BorderStyle.SINGLE, size: 24, color: accentColor, space: 6 } },
        children: [
          new TextRun({
            text: `  ${title.toUpperCase()}`,
            bold: true,
            size: 24,
            font: fontName,
            color: accentColor,
          }),
        ],
      });
    } else if (sectionStyle === "dots") {
      headingPara = new Paragraph({
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text: `▪ ${title.toUpperCase()}`,
            bold: true,
            size: 24,
            font: fontName,
            color: accentColor,
          }),
        ],
      });
    } else if (sectionStyle === "none") {
      headingPara = new Paragraph({
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 24,
            font: fontName,
            color: textColorHex,
          }),
        ],
      });
    } else {
      headingPara = new Paragraph({
        spacing: { before: 240, after: 120 },
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 12,
            color: accentColor,
            space: 4,
          },
        },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 24,
            font: fontName,
            color: accentColor,
          }),
        ],
      });
    }

    return headingPara;
  };

  const headerLayoutClass = isCustom ? customConfig.headerLayout : "centered";

  children.push(
    new Paragraph({
      alignment: headerLayoutClass === "left" ? AlignmentType.LEFT : AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: data.name || "YOUR NAME",
          bold: true,
          size: 36,
          font: fontName,
          color: accentColor,
        }),
      ],
    }),
    new Paragraph({
      alignment: headerLayoutClass === "left" ? AlignmentType.LEFT : AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: data.title || "Professional Title",
          italics: true,
          size: 24,
          font: fontName,
          color: secondaryColorHex,
        }),
      ],
    }),
  );

  const contacts: string[] = [];
  if (data.email) contacts.push(`📧 ${data.email}`);
  if (data.phone) contacts.push(`📞 ${data.phone}`);
  if (data.location) contacts.push(`📍 ${data.location}`);
  if (data.website) contacts.push(`🌐 ${data.website}`);

  if (contacts.length > 0) {
    children.push(
      new Paragraph({
        alignment: headerLayoutClass === "left" ? AlignmentType.LEFT : AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: contacts.join("   |   "),
            size: 18,
            font: fontName,
            color: secondaryColorHex,
          }),
        ],
      }),
    );
  }

  if (data.summary && visible.summary !== false) {
    children.push(
      p(data.summary, {
        spacing: { after: 160 },
        align: AlignmentType.JUSTIFIED,
        color: textColorHex,
      }),
    );
  }

  if (data.experience && data.experience.length > 0 && visible.experience !== false) {
    children.push(heading(titles.experience || "Work Experience"));
    data.experience.forEach((exp) => {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: exp.role,
              bold: true,
              size: 22,
              font: fontName,
              color: textColorHex,
            }),
            new TextRun({
              text: `  at  ${exp.company} (${exp.location})`,
              size: 22,
              font: fontName,
              color: secondaryColorHex,
            }),
            new TextRun({
              text: `\t${exp.startYear} – ${exp.endYear}`,
              bold: true,
              size: 20,
              font: fontName,
              color: textColorHex,
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: exp.description,
              size: 20,
              font: fontName,
              color: secondaryColorHex,
            }),
          ],
        }),
      );
    });
  }

  if (data.projects && data.projects.length > 0 && visible.projects !== false) {
    children.push(heading(titles.projects || "Key Projects"));
    data.projects.forEach((proj) => {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: proj.title,
              bold: true,
              size: 22,
              font: fontName,
              color: textColorHex,
            }),
            ...(proj.link
              ? [
                  new TextRun({
                    text: `  (${proj.link})`,
                    italics: true,
                    size: 18,
                    font: fontName,
                    color: secondaryColorHex,
                  }),
                ]
              : []),
          ],
        }),
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: proj.description,
              size: 20,
              font: fontName,
              color: secondaryColorHex,
            }),
          ],
        }),
      );
    });
  }

  if (data.education && data.education.length > 0 && visible.education !== false) {
    children.push(heading(titles.education || "Education"));
    data.education.forEach((edu) => {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: `${edu.degree} in ${edu.field}`,
              bold: true,
              size: 22,
              font: fontName,
              color: textColorHex,
            }),
            new TextRun({
              text: `\t${edu.startYear} – ${edu.endYear}`,
              bold: true,
              size: 20,
              font: fontName,
              color: textColorHex,
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: `${edu.school}${edu.grade ? `  |  Grade: ${edu.grade}` : ""}`,
              size: 20,
              font: fontName,
              color: secondaryColorHex,
            }),
          ],
        }),
      );
    });
  }

  if (isCustom) {
    if (data.skills && data.skills.length > 0 && visible.skills !== false) {
      children.push(heading(titles.skills || "Skills"));
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 80 },
          children: [
            new TextRun({
              text: data.skills.join(", "),
              size: 20,
              font: fontName,
              color: textColorHex,
            }),
          ],
        }),
      );
    }

    if (data.languages && data.languages.length > 0 && visible.languages !== false) {
      children.push(heading(titles.languages || "Languages"));
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 80 },
          children: [
            new TextRun({
              text: data.languages.join(", "),
              size: 20,
              font: fontName,
              color: textColorHex,
            }),
          ],
        }),
      );
    }
  } else {
    if ((data.skills && data.skills.length > 0) || (data.languages && data.languages.length > 0)) {
      children.push(heading("Skills & Languages"));

      if (data.skills && data.skills.length > 0) {
        children.push(
          new Paragraph({
            spacing: { before: 40, after: 80 },
            children: [
              new TextRun({
                text: "Key Skills: ",
                bold: true,
                size: 20,
                font: fontName,
                color: textColorHex,
              }),
              new TextRun({
                text: data.skills.join(", "),
                size: 20,
                font: fontName,
                color: secondaryColorHex,
              }),
            ],
          }),
        );
      }

      if (data.languages && data.languages.length > 0) {
        children.push(
          new Paragraph({
            spacing: { before: 40, after: 80 },
            children: [
              new TextRun({
                text: "Languages: ",
                bold: true,
                size: 20,
                font: fontName,
                color: textColorHex,
              }),
              new TextRun({
                text: data.languages.join(", "),
                size: 20,
                font: fontName,
                color: secondaryColorHex,
              }),
            ],
          }),
        );
      }
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
      default: {
        document: {
          run: { font: fontName, size: 20 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        headers,
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeName = (data.name || "Resume").replace(/[^a-zA-Z0-9]/g, "_");
  saveAs(blob, `${safeName}_Resume.docx`);
}

export async function exportBiodataDocx(
  data: MatrimonialBiodataData,
  template: string,
  themeColor: string = "#9A0F0F",
  customConfig?: CustomTemplateConfig,
) {
  const isCustom = template === "custom" && !!customConfig;
  const fontName = isCustom
    ? cleanFontName(customConfig.fontFamily)
    : template === "royal"
      ? "Georgia"
      : "Calibri";
  const accentColor = isCustom
    ? getHexColor(customConfig.accentColor)
    : template === "royal"
      ? "8A6D1A"
      : themeColor.replace("#", "");
  const textColorHex = isCustom ? getHexColor(customConfig.textColor) : "000000";
  const secondaryColorHex = isCustom ? getHexColor(customConfig.secondaryColor) : "555555";
  const bgColorHex = isCustom ? getHexColor(customConfig.bgColor) : "FFFFFF";

  const children: (Paragraph | Table)[] = [];

  if (template === "traditional") {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: "|| श्री गणेशाय नमः ||",
            bold: true,
            size: 26,
            font: fontName,
            color: "C2410C",
          }),
        ],
      }),
    );
  }

  const tSymbol = template === "traditional" ? "⚜️" : template === "royal" ? "⚜️" : "🌸";

  const headerLayoutClass = isCustom ? customConfig.headerLayout : "centered";

  children.push(
    new Paragraph({
      alignment: headerLayoutClass === "left" ? AlignmentType.LEFT : AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: template === "traditional" ? "शुभ विवाह बायोडाटा" : "BIODATA",
          bold: true,
          size: 36,
          font: fontName,
          color: accentColor,
        }),
      ],
    }),
    new Paragraph({
      alignment: headerLayoutClass === "left" ? AlignmentType.LEFT : AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: `${tSymbol}  MATRIMONIAL BIODATA  ${tSymbol}`,
          bold: true,
          size: 20,
          font: fontName,
          color: secondaryColorHex,
        }),
      ],
    }),
  );

  const addSection = (title: string, rows: TableRow[]) => {
    const sectionStyle = isCustom ? customConfig.sectionStyle : "filled";
    let headingPara: Paragraph;

    if (sectionStyle === "filled" || sectionStyle === "pill") {
      headingPara = new Paragraph({
        spacing: { before: 240, after: 120 },
        shading: {
          fill: accentColor,
          type: ShadingType.CLEAR,
        },
        alignment: headerLayoutClass === "left" ? AlignmentType.LEFT : AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `  ${title.toUpperCase()}  `,
            bold: true,
            size: 22,
            font: fontName,
            color: isCustom ? getHexColor(customConfig.bgColor) : "FFFFFF",
          }),
        ],
      });
    } else if (sectionStyle === "underline") {
      headingPara = new Paragraph({
        spacing: { before: 240, after: 120 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: accentColor, space: 4 } },
        alignment: headerLayoutClass === "left" ? AlignmentType.LEFT : AlignmentType.CENTER,
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 22,
            font: fontName,
            color: accentColor,
          }),
        ],
      });
    } else if (sectionStyle === "left-bar") {
      headingPara = new Paragraph({
        spacing: { before: 240, after: 120 },
        border: { left: { style: BorderStyle.SINGLE, size: 24, color: accentColor, space: 6 } },
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text: `  ${title.toUpperCase()}`,
            bold: true,
            size: 22,
            font: fontName,
            color: accentColor,
          }),
        ],
      });
    } else if (sectionStyle === "dots") {
      headingPara = new Paragraph({
        spacing: { before: 240, after: 120 },
        alignment: headerLayoutClass === "left" ? AlignmentType.LEFT : AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `▪ ${title.toUpperCase()}`,
            bold: true,
            size: 22,
            font: fontName,
            color: accentColor,
          }),
        ],
      });
    } else {
      headingPara = new Paragraph({
        spacing: { before: 240, after: 120 },
        alignment: headerLayoutClass === "left" ? AlignmentType.LEFT : AlignmentType.CENTER,
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 22,
            font: fontName,
            color: textColorHex,
          }),
        ],
      });
    }

    children.push(
      headingPara,
      new Table({
        width: { size: 9000, type: WidthType.DXA },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
        rows,
      }),
    );
  };

  const personalRows: TableRow[] = [];
  const kv = (k: string, v: string) =>
    createKeyValueRow(k, v, fontName, textColorHex, secondaryColorHex);

  if (data.name) personalRows.push(kv("Full Name", data.name));
  if (data.dob) personalRows.push(kv("Date of Birth", data.dob));
  if (data.tob) personalRows.push(kv("Time of Birth", data.tob));
  if (data.pob) personalRows.push(kv("Place of Birth", data.pob));
  if (data.height) personalRows.push(kv("Height", data.height));
  if (data.complexion) personalRows.push(kv("Complexion", data.complexion));
  if (data.gotra) personalRows.push(kv("Gotra", data.gotra));
  if (data.rashi) personalRows.push(kv("Rashi", data.rashi));
  if (data.nakshatra) personalRows.push(kv("Nakshatra", data.nakshatra));
  if (data.religion || data.caste) {
    const relVal = [data.religion, data.caste].filter(Boolean).join(" / ");
    personalRows.push(kv("Religion / Caste", relVal));
  }

  if (personalRows.length > 0) {
    addSection("Personal Details", personalRows);
  }

  const eduOccRows: TableRow[] = [];
  if (data.education) eduOccRows.push(kv("Education", data.education));
  if (data.occupation) eduOccRows.push(kv("Occupation", data.occupation));
  if (data.company) eduOccRows.push(kv("Company Name", data.company));
  if (data.income) eduOccRows.push(kv("Annual Income", data.income));

  if (eduOccRows.length > 0) {
    addSection("Education & Career", eduOccRows);
  }

  const familyRows: TableRow[] = [];
  if (data.fatherName) familyRows.push(kv("Father's Name", data.fatherName));
  if (data.fatherOccupation) familyRows.push(kv("Father's Occupation", data.fatherOccupation));
  if (data.motherName) familyRows.push(kv("Mother's Name", data.motherName));
  if (data.motherOccupation) familyRows.push(kv("Mother's Occupation", data.motherOccupation));
  if (data.siblings) familyRows.push(kv("Siblings Details", data.siblings));
  if (data.familyStatus) familyRows.push(kv("Family Status", data.familyStatus));
  if (data.familyValues) familyRows.push(kv("Family Values", data.familyValues));
  if (data.address) familyRows.push(kv("Permanent Address", data.address));

  if (familyRows.length > 0) {
    addSection("Family Details", familyRows);
  }

  if (data.expectations) {
    const sectionStyle = isCustom ? customConfig.sectionStyle : "filled";
    let headingPara: Paragraph;

    if (sectionStyle === "filled" || sectionStyle === "pill") {
      headingPara = new Paragraph({
        spacing: { before: 240, after: 120 },
        shading: {
          fill: accentColor,
          type: ShadingType.CLEAR,
        },
        alignment: headerLayoutClass === "left" ? AlignmentType.LEFT : AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "  PARTNER EXPECTATIONS  ",
            bold: true,
            size: 22,
            font: fontName,
            color: isCustom ? getHexColor(customConfig.bgColor) : "FFFFFF",
          }),
        ],
      });
    } else if (sectionStyle === "underline") {
      headingPara = new Paragraph({
        spacing: { before: 240, after: 120 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: accentColor, space: 4 } },
        alignment: headerLayoutClass === "left" ? AlignmentType.LEFT : AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "PARTNER EXPECTATIONS",
            bold: true,
            size: 22,
            font: fontName,
            color: accentColor,
          }),
        ],
      });
    } else if (sectionStyle === "left-bar") {
      headingPara = new Paragraph({
        spacing: { before: 240, after: 120 },
        border: { left: { style: BorderStyle.SINGLE, size: 24, color: accentColor, space: 6 } },
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text: "  PARTNER EXPECTATIONS",
            bold: true,
            size: 22,
            font: fontName,
            color: accentColor,
          }),
        ],
      });
    } else if (sectionStyle === "dots") {
      headingPara = new Paragraph({
        spacing: { before: 240, after: 120 },
        alignment: headerLayoutClass === "left" ? AlignmentType.LEFT : AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "▪ PARTNER EXPECTATIONS",
            bold: true,
            size: 22,
            font: fontName,
            color: accentColor,
          }),
        ],
      });
    } else {
      headingPara = new Paragraph({
        spacing: { before: 240, after: 120 },
        alignment: headerLayoutClass === "left" ? AlignmentType.LEFT : AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "PARTNER EXPECTATIONS",
            bold: true,
            size: 22,
            font: fontName,
            color: textColorHex,
          }),
        ],
      });
    }

    children.push(
      headingPara,
      new Paragraph({
        spacing: { before: 80, after: 120 },
        indent: { left: 240, right: 240 },
        children: [
          new TextRun({
            text: data.expectations,
            size: 20,
            font: fontName,
            color: secondaryColorHex,
          }),
        ],
      }),
    );
  }

  const contactRows: TableRow[] = [];
  if (data.contactPerson) contactRows.push(kv("Contact Person", data.contactPerson));
  if (data.contactPhone) contactRows.push(kv("Contact Numbers", data.contactPhone));

  if (contactRows.length > 0) {
    addSection("Contact Details", contactRows);
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
      default: {
        document: {
          run: { font: fontName, size: 20 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        headers,
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeName = (data.name || "Biodata").replace(/[^a-zA-Z0-9]/g, "_");
  saveAs(blob, `${safeName}_Biodata.docx`);
}
