import { type CustomTemplateConfig } from "./CustomTemplateDesigner";

export type SubQuestion = {
  label: string;
  text: string;
  options: string[] | null;
};

export type Question = {
  number: string;
  instruction: string;
  marks: number;
  type: "mcq" | "short" | "long" | "fill" | "match" | "passage" | "other";
  passage: string | null;
  subQuestions: SubQuestion[];
};

export type Section = {
  name: string;
  marks: number;
  questions: Question[];
};

export type ExamHeader = {
  schoolName: string;
  schoolAddress: string;
  examTitle: string;
  time: string;
  className: string;
  subject: string;
  maxMarks: number;
};

export type ExamPaper = {
  sections: Section[];
};

export function ExamPaperView({
  header,
  paper,
  logoUrl,
  themeColor = "#000000",
  footer,
  template = "standard",
  customConfig,
}: {
  header: ExamHeader;
  paper: ExamPaper;
  logoUrl?: string | null;
  themeColor?: string;
  footer?: string;
  template?: string;
  customConfig?: CustomTemplateConfig;
}) {
  const isCustom = template === "custom" && customConfig;

  if (template === "board") {
    return (
      <article
        className="exam-paper exam-paper-board"
        style={{
          position: "relative",
          fontFamily: "Times New Roman, Times, serif",
          color: "#000000",
          background: "#ffffff",
          border: "1.5px solid #000000",
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <table className="exam-board-header-table">
            <tbody>
              <tr>
                {logoUrl && (
                  <td className="exam-board-logo-cell">
                    <img
                      src={logoUrl}
                      alt="School logo"
                      className="exam-logo mx-auto"
                      style={{
                        borderRadius: "50%",
                        border: "1.5px solid #000000",
                        width: "60px",
                        height: "60px",
                        padding: "2px",
                        background: "#ffffff",
                      }}
                    />
                  </td>
                )}
                <td
                  className="exam-board-title-cell"
                  colSpan={logoUrl ? 3 : 4}
                  style={{ textAlign: "center", width: logoUrl ? "85%" : "100%" }}
                >
                  <h1 className="exam-board-school-name">{header.schoolName}</h1>
                  <p className="exam-board-school-address">{header.schoolAddress}</p>
                  <p className="exam-board-exam-title">{header.examTitle}</p>
                </td>
              </tr>
              <tr className="exam-board-meta-row" style={{ borderTop: "1.5px solid #000000" }}>
                <td
                  style={{
                    borderRight: "1.5px solid #000000",
                    padding: "0.4rem",
                    textAlign: "center",
                  }}
                >
                  <strong>TIME:</strong> {header.time}
                </td>
                <td
                  style={{
                    borderRight: "1.5px solid #000000",
                    padding: "0.4rem",
                    textAlign: "center",
                  }}
                >
                  <strong>CLASS:</strong> {header.className}
                </td>
                <td
                  style={{
                    borderRight: "1.5px solid #000000",
                    padding: "0.4rem",
                    textAlign: "center",
                  }}
                >
                  <strong>SUBJECT:</strong> {header.subject}
                </td>
                <td style={{ padding: "0.4rem", textAlign: "center" }}>
                  <strong>MM:</strong> {header.maxMarks}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="exam-board-candidate-row">
            <span>Name: _______________________________</span>
            <span>Roll No: ____________________</span>
            <span>Inv. Sign: ____________________</span>
          </div>

          <p className="exam-board-compulsory-text">All questions are compulsory.</p>

          {paper.sections?.map((section, sIdx) => (
            <table key={sIdx} className="exam-board-section-table">
              <thead>
                <tr>
                  <th className="exam-board-qno-col">Q.No</th>
                  <th className="exam-board-content-col" style={{ textTransform: "uppercase" }}>
                    {section.name} ({section.marks} Marks)
                  </th>
                  <th className="exam-board-mks-col">MKS</th>
                </tr>
              </thead>
              <tbody>
                {section.questions?.map((q, qIdx) => (
                  <tr key={qIdx}>
                    <td
                      className="exam-board-qno-col"
                      style={{ verticalAlign: "top", textAlign: "center", fontWeight: "bold" }}
                    >
                      {q.number}
                    </td>
                    <td className="exam-board-content-col" style={{ verticalAlign: "top" }}>
                      {q.instruction && (
                        <div className="exam-board-question-text">{q.instruction}</div>
                      )}
                      {q.passage && (
                        <blockquote className="exam-board-passage">{q.passage}</blockquote>
                      )}
                      {q.subQuestions?.length > 0 && (
                        <ol className="exam-board-subquestions">
                          {q.subQuestions.map((sq, i) => (
                            <li key={i} className="exam-board-subquestion-item">
                              <span className="exam-board-subq-label">{sq.label}</span>{" "}
                              <span>{sq.text}</span>
                              {sq.options && sq.options.length > 0 && (
                                <div className="exam-board-options">
                                  {sq.options.map((opt, oi) => (
                                    <span key={oi} className="exam-board-option">
                                      {opt} [ ]
                                    </span>
                                  ))}
                                </div>
                              )}
                            </li>
                          ))}
                        </ol>
                      )}
                    </td>
                    <td
                      className="exam-board-mks-col"
                      style={{ verticalAlign: "top", textAlign: "center", fontWeight: "bold" }}
                    >
                      {q.marks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}

          {footer && <p className="exam-board-footer">{footer}</p>}

          <div className="exam-board-signature">
            <span>Invigilator: ____________________</span>
            <span>Examiner: ____________________</span>
          </div>
        </div>
      </article>
    );
  }

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
        ["--exam-accent" as string]: customConfig.accentColor,
      } as React.CSSProperties)
    : ({
        ["--exam-accent" as string]: themeColor,
        position: "relative",
      } as React.CSSProperties);

  const headerLayoutClass = isCustom ? customConfig.headerLayout : "logo-left";

  return (
    <article className="exam-paper" style={customStyles}>
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
        <header className="exam-header" style={isCustom ? { border: "none" } : undefined}>
          <div
            className={`exam-header-top flex gap-4 ${
              headerLayoutClass === "left" || headerLayoutClass === "centered"
                ? "flex-col " +
                  (headerLayoutClass === "centered"
                    ? "items-center text-center"
                    : "items-start text-left")
                : headerLayoutClass === "logo-left"
                  ? "flex-row items-center text-left"
                  : "flex-row-reverse items-center text-right"
            }`}
            style={
              isCustom ? { borderBottom: `1.5px solid ${customConfig.accentColor}` } : undefined
            }
          >
            {logoUrl && (
              <img
                src={logoUrl}
                alt="School logo"
                className="exam-logo"
                style={isCustom ? { borderColor: customConfig.accentColor } : undefined}
              />
            )}
            <div className="exam-header-titles">
              <h1
                className="exam-school"
                style={isCustom ? { color: customConfig.accentColor } : undefined}
              >
                {header.schoolName}
              </h1>
              <p
                className="exam-address"
                style={isCustom ? { color: customConfig.secondaryColor } : undefined}
              >
                {header.schoolAddress}
              </p>
              <p
                className="exam-title"
                style={isCustom ? { color: customConfig.accentColor } : undefined}
              >
                {header.examTitle}
              </p>
            </div>
          </div>
          <div
            className="exam-meta"
            style={isCustom ? { color: customConfig.secondaryColor } : undefined}
          >
            <span>
              <strong>TIME:</strong> {header.time}
            </span>
            <span>
              <strong>CLASS:</strong> {header.className}
            </span>
            <span>
              <strong>SUBJECT:</strong> {header.subject}
            </span>
            <span>
              <strong>MM:</strong> {header.maxMarks}
            </span>
          </div>
        </header>

        {paper.sections?.map((section, sIdx) => {
          const sectionStyle = isCustom ? customConfig.sectionStyle : "underline";
          let sectionTitleStyle: React.CSSProperties = {};

          if (isCustom) {
            if (sectionStyle === "filled") {
              sectionTitleStyle = {
                background: customConfig.accentColor,
                color: customConfig.bgColor,
                padding: "0.4rem 0.75rem",
                borderRadius: "4px",
                borderBottom: "none",
              };
            } else if (sectionStyle === "underline") {
              sectionTitleStyle = {
                color: customConfig.accentColor,
                borderBottom: `1.5px solid ${customConfig.accentColor}`,
              };
            } else if (sectionStyle === "left-bar") {
              sectionTitleStyle = {
                color: customConfig.accentColor,
                borderLeft: `4px solid ${customConfig.accentColor}`,
                paddingLeft: "0.5rem",
                borderBottom: "none",
              };
            } else if (sectionStyle === "pill") {
              sectionTitleStyle = {
                display: "inline-block",
                background: customConfig.accentColor,
                color: customConfig.bgColor,
                padding: "0.3rem 0.9rem",
                borderRadius: "9999px",
                borderBottom: "none",
              };
            } else if (sectionStyle === "dots") {
              sectionTitleStyle = {
                color: customConfig.accentColor,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                borderBottom: "none",
              };
            } else if (sectionStyle === "none") {
              sectionTitleStyle = {
                borderBottom: "none",
                color: customConfig.textColor,
              };
            }
          }

          return (
            <section key={sIdx} className="exam-section">
              <h2 className="exam-section-title" style={sectionTitleStyle}>
                {isCustom && sectionStyle === "dots" && (
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ background: customConfig.accentColor }}
                  />
                )}
                {section.name}{" "}
                <span
                  className="exam-section-marks"
                  style={isCustom ? { color: customConfig.textColor } : undefined}
                >
                  ({section.marks} Marks)
                </span>
              </h2>

              {section.questions?.map((q, qIdx) => (
                <div key={qIdx} className="exam-question">
                  <div className="exam-q-head">
                    <span className="exam-q-instruction">
                      <strong>{q.number}.</strong> {q.instruction}
                    </span>
                    <span className="exam-q-marks">({q.marks})</span>
                  </div>

                  {q.passage && (
                    <blockquote
                      className="exam-passage"
                      style={isCustom ? { borderLeftColor: customConfig.accentColor } : undefined}
                    >
                      {q.passage}
                    </blockquote>
                  )}

                  {q.subQuestions?.length > 0 && (
                    <ol className="exam-subq">
                      {q.subQuestions.map((sq, i) => (
                        <li key={i} className="exam-subq-item">
                          <span className="exam-subq-label">{sq.label}</span> <span>{sq.text}</span>
                          {sq.options && sq.options.length > 0 && (
                            <div className="exam-options">
                              {sq.options.map((opt, oi) => (
                                <span key={oi} className="exam-option">
                                  {opt} [ ]
                                </span>
                              ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              ))}
            </section>
          );
        })}

        {footer && (
          <p
            className="exam-footer"
            style={isCustom ? { borderTopColor: customConfig.accentColor } : undefined}
          >
            {footer}
          </p>
        )}

        <div className="exam-signature">
          <span>Invigilator: ____________________</span>
          <span>Examiner: ____________________</span>
        </div>
      </div>
    </article>
  );
}
