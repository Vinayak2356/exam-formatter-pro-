import type React from "react";
import { type CustomTemplateConfig } from "./CustomTemplateDesigner";

export type HHWAssignment = { number: string; text: string };
export type HHWSubject = {
  subject: string;
  note: string | null;
  assignments: HHWAssignment[];
};
export type HHWPacket = {
  title: string;
  generalInstructions: string[];
  subjects: HHWSubject[];
};
export type HHWHeader = {
  schoolName: string;
  schoolAddress: string;
  className: string;
  title: string;
};

export type HHWTemplate = "standard" | "classic" | "vvip" | "custom";

export function HHWView({
  header,
  packet,
  template = "standard",
  logoUrl,
  themeColor = "#1E2761",
  coverImageUrl,
  footer,
  customConfig,
}: {
  header: HHWHeader;
  packet: HHWPacket;
  template?: HHWTemplate;
  logoUrl?: string | null;
  themeColor?: string;
  coverImageUrl?: string | null;
  footer?: string;
  customConfig?: CustomTemplateConfig;
}) {
  const isCustom = template === "custom" && customConfig;

  // Custom styling attributes
  const customStyles: React.CSSProperties = isCustom
    ? ({
        fontFamily: customConfig.fontFamily,
        background: customConfig.bgColor,
        color: customConfig.textColor,
        border: {
          none: "none",
          single: `1.5px solid ${customConfig.accentColor}`,
          double: `3px double ${customConfig.accentColor}`,
          thick: `4px solid ${customConfig.accentColor}`,
          dashed: `1.5px dashed ${customConfig.accentColor}`,
          ornate: `2px solid #C9A227`,
        }[customConfig.borderStyle],
        outline:
          customConfig.borderStyle === "double"
            ? `1px solid ${customConfig.accentColor}`
            : undefined,
        outlineOffset: customConfig.borderStyle === "double" ? "-4px" : undefined,
        position: "relative",
        ["--hhw-accent" as string]: customConfig.accentColor,
      } as React.CSSProperties)
    : ({
        ["--hhw-accent" as string]: themeColor,
        position: "relative",
      } as React.CSSProperties);

  const headerLayoutClass = isCustom ? customConfig.headerLayout : "centered";

  return (
    <article className={`hhw-paper hhw-${template}`} style={customStyles}>
      {/* Watermark */}
      {isCustom && customConfig.showWatermark && customConfig.watermarkText && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
          style={{
            fontSize: "4.5rem",
            fontWeight: 900,
            color: customConfig.accentColor,
            opacity: 0.05,
            transform: "rotate(-30deg)",
            userSelect: "none",
            whiteSpace: "nowrap",
            zIndex: 0,
          }}
        >
          {customConfig.watermarkText}
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* COVER PAGE */}
        <section
          className="hhw-cover"
          style={isCustom ? { borderBottom: `2px solid ${customConfig.accentColor}` } : undefined}
        >
          {(template === "vvip" || (isCustom && customConfig.borderStyle === "ornate")) && (
            <div
              className="hhw-cover-frame"
              style={isCustom ? { borderColor: "#C9A227" } : undefined}
            />
          )}
          {logoUrl && (
            <img
              src={logoUrl}
              alt="logo"
              className="hhw-cover-logo"
              style={isCustom ? { borderColor: customConfig.accentColor } : undefined}
            />
          )}

          {isCustom && headerLayoutClass === "centered" ? (
            <>
              <h1 className="hhw-cover-school" style={{ color: customConfig.accentColor }}>
                {header.schoolName}
              </h1>
              <p className="hhw-cover-address" style={{ color: customConfig.secondaryColor }}>
                {header.schoolAddress}
              </p>
            </>
          ) : isCustom ? (
            <div
              className={`flex gap-4 mb-3 ${
                headerLayoutClass === "left"
                  ? "flex-col items-start text-left"
                  : headerLayoutClass === "logo-left"
                    ? "flex-row items-center text-left"
                    : "flex-row-reverse items-center text-right"
              }`}
            >
              <div className="flex-1">
                <h1 className="hhw-cover-school" style={{ color: customConfig.accentColor }}>
                  {header.schoolName}
                </h1>
                <p className="hhw-cover-address" style={{ color: customConfig.secondaryColor }}>
                  {header.schoolAddress}
                </p>
              </div>
            </div>
          ) : (
            <>
              <h1 className="hhw-cover-school">{header.schoolName}</h1>
              <p className="hhw-cover-address">{header.schoolAddress}</p>
            </>
          )}

          {(template === "vvip" || (isCustom && customConfig.borderStyle === "ornate")) && (
            <p className="hhw-cover-tag" style={isCustom ? { color: "#8a6d1a" } : undefined}>
              — A Tradition of Excellence —
            </p>
          )}

          <h2
            className="hhw-cover-title"
            style={isCustom ? { color: customConfig.accentColor } : undefined}
          >
            {packet.title || header.title}
          </h2>
          <p className="hhw-cover-class">CLASS — {header.className}</p>

          {coverImageUrl && <img src={coverImageUrl} alt="cover" className="hhw-cover-image" />}

          {template === "vvip" && (
            <div className="hhw-cover-seal">
              <span>★ Est.</span>
              <span>School Seal</span>
            </div>
          )}
        </section>

        {/* GENERAL INSTRUCTIONS */}
        {packet.generalInstructions?.length > 0 && (
          <section className="hhw-section hhw-instructions">
            <h3
              className="hhw-section-head"
              style={
                isCustom
                  ? {
                      color: customConfig.accentColor,
                      borderBottom: `1.5px solid ${customConfig.accentColor}`,
                    }
                  : undefined
              }
            >
              General Instructions
            </h3>
            <ul>
              {packet.generalInstructions.map((ins, i) => (
                <li key={i}>{ins}</li>
              ))}
            </ul>
          </section>
        )}

        {/* SUBJECTS */}
        {packet.subjects?.map((sub, sIdx) => {
          const sectionStyle = isCustom ? customConfig.sectionStyle : "filled";
          let headStyle: React.CSSProperties = {};

          if (isCustom) {
            if (sectionStyle === "filled") {
              headStyle = {
                background: customConfig.accentColor,
                color: customConfig.bgColor,
                padding: "0.4rem 0.75rem",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
              };
            } else if (sectionStyle === "underline") {
              headStyle = {
                background: "transparent",
                color: customConfig.accentColor,
                borderBottom: `1.5px solid ${customConfig.accentColor}`,
                paddingBottom: "0.25rem",
                justifyContent: "flex-start",
                display: "flex",
              };
            } else if (sectionStyle === "left-bar") {
              headStyle = {
                background: "transparent",
                color: customConfig.accentColor,
                borderLeft: `4px solid ${customConfig.accentColor}`,
                paddingLeft: "0.5rem",
                justifyContent: "flex-start",
                display: "flex",
              };
            } else if (sectionStyle === "pill") {
              headStyle = {
                display: "inline-block",
                background: customConfig.accentColor,
                color: customConfig.bgColor,
                padding: "0.3rem 0.9rem",
                borderRadius: "9999px",
                textAlign: "center",
              };
            } else if (sectionStyle === "dots") {
              headStyle = {
                background: "transparent",
                color: customConfig.accentColor,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                justifyContent: "flex-start",
              };
            } else if (sectionStyle === "none") {
              headStyle = {
                background: "transparent",
                color: customConfig.textColor,
                justifyContent: "flex-start",
                display: "flex",
              };
            }
          }

          return (
            <section key={sIdx} className="hhw-section hhw-subject">
              <h3 className="hhw-subject-head" style={headStyle}>
                {((template === "vvip" && sectionStyle === "filled") ||
                  (isCustom && sectionStyle === "dots")) && <span className="hhw-orn">❦</span>}
                <span>SUBJECT: {sub.subject}</span>
                {((template === "vvip" && sectionStyle === "filled") ||
                  (isCustom && sectionStyle === "dots")) && <span className="hhw-orn">❦</span>}
              </h3>
              {sub.note && (
                <p
                  className="hhw-subject-note"
                  style={isCustom ? { color: customConfig.secondaryColor } : undefined}
                >
                  {sub.note}
                </p>
              )}
              <ol className="hhw-assignments">
                {sub.assignments?.map((a, i) => (
                  <li key={i} className="hhw-assignment">
                    <span
                      className="hhw-assignment-num"
                      style={isCustom ? { color: customConfig.accentColor } : undefined}
                    >
                      {a.number}.
                    </span>
                    <span className="hhw-assignment-text">{a.text}</span>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}

        {footer && (
          <p
            className="hhw-footer"
            style={isCustom ? { borderTopColor: customConfig.accentColor } : undefined}
          >
            {footer}
          </p>
        )}

        <div className="hhw-signature">
          <span>Class Teacher: ____________________</span>
          <span>Principal: ____________________</span>
        </div>
      </div>
    </article>
  );
}
