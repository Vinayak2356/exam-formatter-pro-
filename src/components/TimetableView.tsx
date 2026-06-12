import { useEffect } from "react";
import { type CustomTemplateConfig } from "./CustomTemplateDesigner";

export type TimetableTemplate = "modern" | "classic" | "vvip" | "minimal" | "vibrant" | "custom";

export type TimetablePeriod = {
  label: string; // e.g. "Period 1" or "Lunch"
  time: string; // e.g. "8:20-9:00"
  isBreak?: boolean;
};

export type TimetableCell = {
  subject: string;
  teacher?: string;
};

export type TimetableHeader = {
  schoolName: string;
  schoolAddress: string;
  className: string; // e.g. "CLASS IX"
  title: string; // e.g. "Academic Schedule 2026-27"
};

export type TimetableData = {
  periods: TimetablePeriod[];
  days: string[];
  // grid[dayIndex][periodIndex] => cell
  grid: TimetableCell[][];
  notes?: string[];
};

const SUBJECT_COLORS: Record<string, string> = {
  english: "#dbeafe",
  hindi: "#fee2e2",
  mathematics: "#fef3c7",
  maths: "#fef3c7",
  physics: "#e0e7ff",
  chemistry: "#dcfce7",
  biology: "#fce7f3",
  "social studies": "#ffedd5",
  computer: "#cffafe",
  evs: "#dcfce7",
  sanskrit: "#f3e8ff",
  music: "#fae8ff",
  pe: "#e0f2fe",
  "physical education": "#e0f2fe",
  lunch: "#f1f5f9",
  break: "#f1f5f9",
};

function subjectColor(subject: string): string {
  const k = subject.trim().toLowerCase();
  if (!k) return "transparent";
  for (const key of Object.keys(SUBJECT_COLORS)) {
    if (k.includes(key)) return SUBJECT_COLORS[key];
  }
  // hash fallback
  let h = 0;
  for (let i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) | 0;
  const hue = Math.abs(h) % 360;
  return `hsl(${hue} 70% 92%)`;
}

export function TimetableView({
  header,
  data,
  template,
  themeColor,
  logoUrl,
  footer,
  customConfig,
}: {
  header: TimetableHeader;
  data: TimetableData;
  template: TimetableTemplate;
  themeColor?: string;
  logoUrl?: string | null;
  footer?: string;
  customConfig?: CustomTemplateConfig;
}) {
  useEffect(() => {
    const root = document.documentElement;
    if (themeColor) root.style.setProperty("--tt-accent", themeColor);
  }, [themeColor]);

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
        ["--tt-accent" as string]: customConfig.accentColor,
      } as React.CSSProperties)
    : ({
        ["--tt-accent" as string]: template === "vvip" ? "#8a6d1a" : themeColor || "#1E2761",
        position: "relative",
      } as React.CSSProperties);

  const headerLayoutClass = isCustom ? customConfig.headerLayout : "centered";
  const useColors = template === "vibrant" || template === "modern";

  return (
    <div className={`timetable-paper timetable-${template}`} style={customStyles}>
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
        {template === "vvip" && <div className="tt-frame" aria-hidden />}
        {isCustom && customConfig.borderStyle === "ornate" && (
          <div className="tt-frame" style={{ borderColor: "#C9A227" }} aria-hidden />
        )}

        <header
          className="tt-header"
          style={isCustom ? { borderBottomColor: customConfig.accentColor } : undefined}
        >
          {logoUrl && headerLayoutClass !== "logo-right" && (
            <img
              src={logoUrl}
              alt="School logo"
              className="tt-logo"
              style={isCustom ? { borderColor: customConfig.accentColor } : undefined}
            />
          )}
          <div
            className="tt-titles"
            style={
              isCustom
                ? {
                    textAlign:
                      headerLayoutClass === "left" || headerLayoutClass === "logo-left"
                        ? "left"
                        : headerLayoutClass === "logo-right"
                          ? "right"
                          : "center",
                  }
                : undefined
            }
          >
            <div
              className="tt-tag"
              style={isCustom ? { color: customConfig.accentColor } : undefined}
            >
              School Time Table
            </div>
            <h1
              className="tt-school"
              style={isCustom ? { color: customConfig.accentColor } : undefined}
            >
              {header.schoolName}
            </h1>
            <div
              className="tt-address"
              style={isCustom ? { color: customConfig.secondaryColor } : undefined}
            >
              {header.schoolAddress}
            </div>
            <div
              className="tt-meta-row"
              style={
                isCustom
                  ? {
                      color: customConfig.secondaryColor,
                      justifyContent:
                        headerLayoutClass === "left" || headerLayoutClass === "logo-left"
                          ? "flex-start"
                          : headerLayoutClass === "logo-right"
                            ? "flex-end"
                            : "center",
                    }
                  : undefined
              }
            >
              <span>
                <strong>Class:</strong> {header.className}
              </span>
              <span>{header.title}</span>
            </div>
          </div>
          {logoUrl && headerLayoutClass === "logo-right" && (
            <img
              src={logoUrl}
              alt="School logo"
              className="tt-logo"
              style={isCustom ? { borderColor: customConfig.accentColor } : undefined}
            />
          )}
        </header>

        <div className="tt-table-wrap">
          <table className="tt-table">
            <thead>
              <tr>
                <th
                  className="tt-day-col"
                  style={
                    isCustom
                      ? {
                          background: customConfig.accentColor,
                          color: customConfig.bgColor,
                          borderColor: customConfig.accentColor,
                        }
                      : undefined
                  }
                >
                  Day
                </th>
                {data.periods.map((p, i) => (
                  <th
                    key={i}
                    className={p.isBreak ? "tt-break" : ""}
                    style={
                      isCustom
                        ? {
                            background: customConfig.accentColor,
                            color: customConfig.bgColor,
                            borderColor: customConfig.accentColor,
                          }
                        : undefined
                    }
                  >
                    <div className="tt-period-label">{p.label}</div>
                    {p.time && <div className="tt-period-time">{p.time}</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.days.map((day, di) => (
                <tr key={di}>
                  <th
                    className="tt-day"
                    style={
                      isCustom
                        ? {
                            background: customConfig.bgColor,
                            color: customConfig.textColor,
                            borderColor: customConfig.accentColor,
                          }
                        : undefined
                    }
                  >
                    {day}
                  </th>
                  {data.periods.map((p, pi) => {
                    const c = data.grid[di]?.[pi] || { subject: "", teacher: "" };
                    const isBreak = p.isBreak || /lunch|break/i.test(c.subject);
                    const bg = isBreak
                      ? "#f1f5f9"
                      : useColors && c.subject
                        ? subjectColor(c.subject)
                        : undefined;
                    return (
                      <td
                        key={pi}
                        className={isBreak ? "tt-break-cell" : ""}
                        style={
                          isCustom
                            ? {
                                background: isBreak ? "#f1f5f9" : customConfig.bgColor,
                                color: customConfig.textColor,
                                borderColor: customConfig.accentColor,
                              }
                            : bg
                              ? { background: bg }
                              : undefined
                        }
                      >
                        {isBreak ? (
                          <div className="tt-break-text">{c.subject || "LUNCH"}</div>
                        ) : (
                          <>
                            <div className="tt-subject">{c.subject}</div>
                            {c.teacher && (
                              <div
                                className="tt-teacher"
                                style={
                                  isCustom ? { color: customConfig.secondaryColor } : undefined
                                }
                              >
                                {c.teacher}
                              </div>
                            )}
                          </>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.notes && data.notes.length > 0 && (
          <div className="tt-notes">
            <strong>Notes:</strong>
            <ul>
              {data.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="tt-signature">
          <span>__________________________</span>
          <span>__________________________</span>
        </div>
        <div className="tt-signature-labels">
          <span>Class Teacher</span>
          <span>Principal</span>
        </div>

        {footer && (
          <div
            className="tt-footer"
            style={isCustom ? { color: customConfig.secondaryColor } : undefined}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
