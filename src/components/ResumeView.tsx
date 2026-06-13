import { type CustomTemplateConfig } from "./CustomTemplateDesigner";

export type ResumeEducation = {
  school: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  grade?: string;
};

export type ResumeExperience = {
  company: string;
  role: string;
  location: string;
  startYear: string;
  endYear: string;
  description: string;
};

export type ResumeProject = {
  title: string;
  description: string;
  link?: string;
};

export type JobResumeData = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  summary: string;
  education: ResumeEducation[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  skills: string[];
  languages: string[];
};

export type MatrimonialBiodataData = {
  name: string;
  dob: string;
  tob: string;
  pob: string;
  height: string;
  complexion: string;
  gotra: string;
  rashi?: string;
  nakshatra?: string;
  caste?: string;
  religion?: string;
  education: string;
  occupation: string;
  company?: string;
  income?: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  siblings: string;
  familyStatus: "Middle Class" | "Upper Middle Class" | "Noble / Affluent" | "High Class" | string;
  familyValues: "Traditional" | "Moderate" | "Liberal" | string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  expectations: string;
};

export type ResumeTemplate = "modern" | "classic" | "minimal" | "custom";
export type BiodataTemplate = "traditional" | "royal" | "floral" | "custom";

type ResumeViewProps = {
  mode: "job" | "wedding";
  resumeData: JobResumeData;
  biodataData: MatrimonialBiodataData;
  template: string; // resumeTemplate or biodataTemplate
  themeColor?: string;
  logoUrl?: string | null;
  footer?: string;
  customConfig?: CustomTemplateConfig;
};

export function ResumeView({
  mode,
  resumeData,
  biodataData,
  template,
  themeColor = "#1E2761",
  logoUrl,
  footer,
  customConfig,
}: ResumeViewProps) {
  const isCustom = template === "custom" && customConfig;

  // Custom styling attributes
  const layoutStyle = isCustom ? customConfig.layoutStyle || "sidebar-right" : "sidebar-right";
  const fontSize = isCustom ? customConfig.fontSize || "base" : "base";
  const spacing = isCustom ? customConfig.spacing || "normal" : "normal";
  const skillBadgeStyle = isCustom ? customConfig.skillBadgeStyle || "pill" : "pill";
  const profilePicShape = isCustom ? customConfig.profilePicShape || "circle" : "circle";

  const visibleSections = {
    summary: true,
    experience: true,
    projects: true,
    education: true,
    skills: true,
    languages: true,
    ...(isCustom ? customConfig.visibleSections : {}),
  };

  const sectionTitles = {
    experience: "Work Experience",
    projects: "Key Projects",
    education: "Education",
    skills: "Skills",
    languages: "Languages",
    ...(isCustom ? customConfig.sectionTitles : {}),
  };

  const fsConfig = {
    sm: {
      container: "8.5pt",
      name: "18pt",
      secTitle: "10pt",
      itemTitle: "9.5pt",
      desc: "8.5pt",
      contact: "8pt",
      sub: "8.5pt",
    },
    base: {
      container: "10pt",
      name: "24pt",
      secTitle: "11.5pt",
      itemTitle: "11pt",
      desc: "9.5pt",
      contact: "9pt",
      sub: "9.5pt",
    },
    lg: {
      container: "11.5pt",
      name: "30pt",
      secTitle: "13.5pt",
      itemTitle: "12.5pt",
      desc: "10.5pt",
      contact: "10pt",
      sub: "10.5pt",
    },
  }[fontSize];

  const spacingConfig = {
    compact: { itemMargin: "0.4rem", secMargin: "0.75rem", lineHeight: "1.3", listGap: "0.25rem" },
    normal: { itemMargin: "1rem", secMargin: "1.5rem", lineHeight: "1.5", listGap: "0.75rem" },
    loose: { itemMargin: "1.5rem", secMargin: "2.25rem", lineHeight: "1.7", listGap: "1.25rem" },
  }[spacing];

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
        ["--resume-accent" as string]: customConfig.accentColor,
        ["--bio-accent" as string]: customConfig.accentColor,
        // FlowCV font size and spacing integration
        fontSize: fsConfig.container,
        lineHeight: spacingConfig.lineHeight,
      } as React.CSSProperties)
    : ({
        ["--resume-accent" as string]: themeColor,
        ["--bio-accent" as string]: template === "royal" ? "#8a6d1a" : themeColor,
        position: "relative",
      } as React.CSSProperties);

  const headerLayoutClass = isCustom ? customConfig.headerLayout : "centered";

  // FlowCV styles definitions
  const bodyGridStyle: React.CSSProperties = isCustom
    ? {
        display: layoutStyle === "single" ? "flex" : "grid",
        flexDirection: layoutStyle === "single" ? "column" : undefined,
        gridTemplateColumns:
          layoutStyle === "sidebar-left"
            ? "1fr 2.5fr"
            : layoutStyle === "sidebar-right"
              ? "2.5fr 1fr"
              : undefined,
        gap: spacingConfig.secMargin,
      }
    : {};

  const mainColStyle: React.CSSProperties = isCustom
    ? {
        gridColumn:
          layoutStyle === "sidebar-left" ? 2 : layoutStyle === "sidebar-right" ? 1 : undefined,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: spacingConfig.secMargin,
      }
    : {};

  const sideColStyle: React.CSSProperties = isCustom
    ? {
        gridColumn:
          layoutStyle === "sidebar-left" ? 1 : layoutStyle === "sidebar-right" ? 2 : undefined,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: spacingConfig.secMargin,
      }
    : {};

  const badgeStyle: React.CSSProperties = isCustom
    ? {
        display: "inline-flex",
        alignItems: "center",
        fontSize: fsConfig.desc,
        color:
          skillBadgeStyle === "underline" || skillBadgeStyle === "simple"
            ? customConfig.textColor
            : customConfig.accentColor,
        backgroundColor:
          skillBadgeStyle === "pill" || skillBadgeStyle === "square"
            ? `${customConfig.accentColor}15`
            : "transparent",
        border:
          skillBadgeStyle === "pill" || skillBadgeStyle === "square"
            ? `1px solid ${customConfig.accentColor}30`
            : undefined,
        borderRadius:
          skillBadgeStyle === "pill" ? "9999px" : skillBadgeStyle === "square" ? "4px" : "0px",
        padding:
          skillBadgeStyle === "pill" || skillBadgeStyle === "square"
            ? "0.25rem 0.6rem"
            : "0.1rem 0px",
        borderBottom:
          skillBadgeStyle === "underline" ? `1.5px solid ${customConfig.accentColor}` : undefined,
        marginRight:
          skillBadgeStyle === "underline" || skillBadgeStyle === "simple" ? "0.75rem" : "0.5rem",
        marginBottom: "0.5rem",
      }
    : {};

  if (mode === "job") {
    return (
      <article className={`resume-paper resume-${template}`} style={customStyles}>
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
          {/* Header */}
          <header
            className={`res-header flex gap-4 ${
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
              isCustom
                ? { borderBottom: `2px solid ${customConfig.accentColor}`, paddingBottom: "1rem" }
                : undefined
            }
          >
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Profile Photo"
                className="res-logo"
                style={
                  isCustom
                    ? {
                        borderRadius:
                          profilePicShape === "circle"
                            ? "9999px"
                            : profilePicShape === "rounded"
                              ? "8px"
                              : "0px",
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        border: `2px solid ${customConfig.accentColor}`,
                      }
                    : undefined
                }
              />
            )}
            <div className="res-header-content">
              <h1
                className="res-name"
                style={
                  isCustom
                    ? { color: customConfig.accentColor, fontSize: fsConfig.name }
                    : undefined
                }
              >
                {resumeData.name || "YOUR NAME"}
              </h1>
              <p
                className="res-title"
                style={
                  isCustom
                    ? { color: customConfig.secondaryColor, fontSize: fsConfig.sub }
                    : undefined
                }
              >
                {resumeData.title || "Professional Title"}
              </p>
              <div
                className="res-contact-bar"
                style={
                  isCustom
                    ? {
                        borderBottom: "none",
                        color: customConfig.secondaryColor,
                        fontSize: fsConfig.contact,
                        justifyContent:
                          headerLayoutClass === "centered"
                            ? "center"
                            : headerLayoutClass === "logo-right"
                              ? "flex-end"
                              : "flex-start",
                      }
                    : undefined
                }
              >
                {resumeData.email && <span>📧 {resumeData.email}</span>}
                {resumeData.phone && <span>📞 {resumeData.phone}</span>}
                {resumeData.location && <span>📍 {resumeData.location}</span>}
                {resumeData.website && <span>🌐 {resumeData.website}</span>}
              </div>
            </div>
          </header>

          {/* Summary */}
          {resumeData.summary && visibleSections.summary && (
            <section
              className="res-section res-summary"
              style={isCustom ? { marginBottom: spacingConfig.secMargin } : undefined}
            >
              <p
                className="res-summary-text"
                style={
                  isCustom ? { color: customConfig.textColor, fontSize: fsConfig.desc } : undefined
                }
              >
                {resumeData.summary}
              </p>
            </section>
          )}
          {/* Main Body Grid */}
          <div className="res-body-grid" style={bodyGridStyle}>
            {/* Main Column */}
            <div className="res-main-col" style={mainColStyle}>
              {/* Experience */}
              {resumeData.experience?.length > 0 && visibleSections.experience && (
                <section
                  className="res-section"
                  style={isCustom ? { marginBottom: spacingConfig.secMargin } : undefined}
                >
                  <h2
                    className="res-sec-title"
                    style={
                      isCustom
                        ? {
                            color: customConfig.accentColor,
                            borderBottomColor: customConfig.accentColor,
                            fontSize: fsConfig.secTitle,
                            marginBottom: spacingConfig.listGap,
                          }
                        : undefined
                    }
                  >
                    {sectionTitles.experience}
                  </h2>
                  <div className="res-list">
                    {resumeData.experience.map((exp, idx) => (
                      <div
                        key={idx}
                        className="res-item"
                        style={isCustom ? { marginBottom: spacingConfig.itemMargin } : undefined}
                      >
                        <div className="res-item-header">
                          <h3
                            className="res-item-title"
                            style={
                              isCustom
                                ? { fontSize: fsConfig.itemTitle, color: customConfig.textColor }
                                : undefined
                            }
                          >
                            {exp.role}
                          </h3>
                          <span
                            className="res-item-date"
                            style={
                              isCustom
                                ? { color: customConfig.accentColor, fontSize: fsConfig.desc }
                                : undefined
                            }
                          >
                            {exp.startYear} – {exp.endYear}
                          </span>
                        </div>
                        <p
                          className="res-item-sub"
                          style={
                            isCustom
                              ? { fontSize: fsConfig.desc, color: customConfig.secondaryColor }
                              : undefined
                          }
                        >
                          {exp.company} | {exp.location}
                        </p>
                        <p
                          className="res-item-desc"
                          style={
                            isCustom
                              ? { color: customConfig.textColor, fontSize: fsConfig.desc }
                              : undefined
                          }
                        >
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects */}
              {resumeData.projects?.length > 0 && visibleSections.projects && (
                <section
                  className="res-section"
                  style={isCustom ? { marginBottom: spacingConfig.secMargin } : undefined}
                >
                  <h2
                    className="res-sec-title"
                    style={
                      isCustom
                        ? {
                            color: customConfig.accentColor,
                            borderBottomColor: customConfig.accentColor,
                            fontSize: fsConfig.secTitle,
                            marginBottom: spacingConfig.listGap,
                          }
                        : undefined
                    }
                  >
                    {sectionTitles.projects}
                  </h2>
                  <div className="res-list">
                    {resumeData.projects.map((proj, idx) => (
                      <div
                        key={idx}
                        className="res-item"
                        style={isCustom ? { marginBottom: spacingConfig.itemMargin } : undefined}
                      >
                        <div className="res-item-header">
                          <h3
                            className="res-item-title"
                            style={
                              isCustom
                                ? { fontSize: fsConfig.itemTitle, color: customConfig.textColor }
                                : undefined
                            }
                          >
                            {proj.title}
                          </h3>
                          {proj.link && (
                            <span
                              className="res-item-link text-xs italic"
                              style={isCustom ? { fontSize: fsConfig.desc } : undefined}
                            >
                              {proj.link}
                            </span>
                          )}
                        </div>
                        <p
                          className="res-item-desc"
                          style={
                            isCustom
                              ? { color: customConfig.textColor, fontSize: fsConfig.desc }
                              : undefined
                          }
                        >
                          {proj.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar/Secondary Column */}
            <div className="res-side-col" style={sideColStyle}>
              {/* Education */}
              {resumeData.education?.length > 0 && visibleSections.education && (
                <section
                  className="res-section"
                  style={isCustom ? { marginBottom: spacingConfig.secMargin } : undefined}
                >
                  <h2
                    className="res-sec-title"
                    style={
                      isCustom
                        ? {
                            color: customConfig.accentColor,
                            borderBottomColor: customConfig.accentColor,
                            fontSize: fsConfig.secTitle,
                            marginBottom: spacingConfig.listGap,
                          }
                        : undefined
                    }
                  >
                    {sectionTitles.education}
                  </h2>
                  <div className="res-list">
                    {resumeData.education.map((edu, idx) => (
                      <div
                        key={idx}
                        className="res-item-side"
                        style={isCustom ? { marginBottom: spacingConfig.itemMargin } : undefined}
                      >
                        <h3
                          className="res-item-side-title"
                          style={
                            isCustom
                              ? { fontSize: fsConfig.itemTitle, color: customConfig.textColor }
                              : undefined
                          }
                        >
                          {edu.degree} in {edu.field}
                        </h3>
                        <p
                          className="res-item-side-school"
                          style={
                            isCustom
                              ? { fontSize: fsConfig.desc, color: customConfig.secondaryColor }
                              : undefined
                          }
                        >
                          {edu.school}
                        </p>
                        <p
                          className="res-item-side-date"
                          style={
                            isCustom
                              ? { fontSize: fsConfig.desc, color: customConfig.secondaryColor }
                              : undefined
                          }
                        >
                          {edu.startYear} – {edu.endYear}
                          {edu.grade && ` | Grade: ${edu.grade}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Skills */}
              {resumeData.skills?.length > 0 && visibleSections.skills && (
                <section
                  className="res-section"
                  style={isCustom ? { marginBottom: spacingConfig.secMargin } : undefined}
                >
                  <h2
                    className="res-sec-title"
                    style={
                      isCustom
                        ? {
                            color: customConfig.accentColor,
                            borderBottomColor: customConfig.accentColor,
                            fontSize: fsConfig.secTitle,
                            marginBottom: spacingConfig.listGap,
                          }
                        : undefined
                    }
                  >
                    {sectionTitles.skills}
                  </h2>
                  <div className="res-skills-wrap">
                    {resumeData.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className={isCustom ? "" : "res-skill-badge"}
                        style={isCustom ? badgeStyle : undefined}
                      >
                        {isCustom && skillBadgeStyle === "simple" && (
                          <span style={{ color: customConfig.accentColor, marginRight: "0.25rem" }}>
                            •
                          </span>
                        )}
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Languages */}
              {resumeData.languages?.length > 0 && visibleSections.languages && (
                <section
                  className="res-section"
                  style={isCustom ? { marginBottom: spacingConfig.secMargin } : undefined}
                >
                  <h2
                    className="res-sec-title"
                    style={
                      isCustom
                        ? {
                            color: customConfig.accentColor,
                            borderBottomColor: customConfig.accentColor,
                            fontSize: fsConfig.secTitle,
                            marginBottom: spacingConfig.listGap,
                          }
                        : undefined
                    }
                  >
                    {sectionTitles.languages}
                  </h2>
                  <div className="res-skills-wrap">
                    {resumeData.languages.map((lang, idx) => (
                      <span
                        key={idx}
                        className={isCustom ? "" : "res-lang-badge"}
                        style={isCustom ? badgeStyle : undefined}
                      >
                        {isCustom && skillBadgeStyle === "simple" && (
                          <span style={{ color: customConfig.accentColor, marginRight: "0.25rem" }}>
                            •
                          </span>
                        )}
                        {lang}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          {footer && (
            <footer
              className="res-footer"
              style={isCustom ? { borderTopColor: customConfig.accentColor } : undefined}
            >
              {footer}
            </footer>
          )}
        </div>
      </article>
    );
  }

  // --- Matrimonial Biodata (Wedding CV) Render ---
  const tSymbol = isCustom
    ? customConfig.borderStyle === "ornate"
      ? "⚜️"
      : "🌸"
    : template === "traditional"
      ? "⚜️"
      : template === "royal"
        ? "⚜️"
        : "🌸";

  return (
    <article className={`biodata-paper biodata-${template}`} style={customStyles}>
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
        {template === "royal" && <div className="biodata-frame" />}
        {isCustom && customConfig.borderStyle === "ornate" && (
          <div className="biodata-frame" style={{ borderColor: "#C9A227" }} />
        )}

        {/* Header Ornaments */}
        <div className="bio-header-orn">
          {(template === "traditional" || (isCustom && customConfig.borderStyle === "ornate")) && (
            <div className="bio-ganesha-symbol">
              <span className="text-xl font-bold text-orange-700">|| श्री गणेशाय नमः ||</span>
            </div>
          )}
        </div>

        <header className="bio-header">
          {logoUrl && <img src={logoUrl} alt="Logo" className="bio-logo" />}
          <h1
            className="bio-main-title"
            style={isCustom ? { color: customConfig.accentColor } : undefined}
          >
            {template === "traditional" || (isCustom && customConfig.borderStyle === "ornate")
              ? "शुभ विवाह"
              : ""}{" "}
            BIODATA
          </h1>
          <p className="bio-subtitle">Matrimonial CV</p>
          <div
            className="bio-ornament-line"
            style={isCustom ? { color: customConfig.accentColor } : undefined}
          >
            <span>
              {tSymbol} ❁ ❁ ❁ {tSymbol}
            </span>
          </div>
        </header>

        {/* 1. Personal Details Section */}
        <section className="bio-section">
          <h2
            className="bio-sec-title"
            style={isCustom ? { color: customConfig.accentColor } : undefined}
          >
            {tSymbol} Personal Details {tSymbol}
          </h2>
          <div className="bio-grid" style={isCustom ? { background: "transparent" } : undefined}>
            <div
              className="bio-grid-row"
              style={isCustom ? { borderBottomColor: `${customConfig.accentColor}20` } : undefined}
            >
              <span
                className="bio-label"
                style={isCustom ? { color: customConfig.secondaryColor } : undefined}
              >
                Full Name:
              </span>
              <span
                className="bio-value font-bold"
                style={isCustom ? { color: customConfig.textColor } : undefined}
              >
                {biodataData.name || "YOUR NAME"}
              </span>
            </div>
            <div
              className="bio-grid-row"
              style={isCustom ? { borderBottomColor: `${customConfig.accentColor}20` } : undefined}
            >
              <span
                className="bio-label"
                style={isCustom ? { color: customConfig.secondaryColor } : undefined}
              >
                Date of Birth:
              </span>
              <span
                className="bio-value"
                style={isCustom ? { color: customConfig.textColor } : undefined}
              >
                {biodataData.dob || "DD-MM-YYYY"}
              </span>
            </div>
            <div
              className="bio-grid-row"
              style={isCustom ? { borderBottomColor: `${customConfig.accentColor}20` } : undefined}
            >
              <span
                className="bio-label"
                style={isCustom ? { color: customConfig.secondaryColor } : undefined}
              >
                Time of Birth:
              </span>
              <span
                className="bio-value"
                style={isCustom ? { color: customConfig.textColor } : undefined}
              >
                {biodataData.dob ? biodataData.tob || "HH:MM AM/PM" : biodataData.tob || ""}
              </span>
            </div>
            <div
              className="bio-grid-row"
              style={isCustom ? { borderBottomColor: `${customConfig.accentColor}20` } : undefined}
            >
              <span
                className="bio-label"
                style={isCustom ? { color: customConfig.secondaryColor } : undefined}
              >
                Place of Birth:
              </span>
              <span
                className="bio-value"
                style={isCustom ? { color: customConfig.textColor } : undefined}
              >
                {biodataData.pob || "City, State"}
              </span>
            </div>
            <div
              className="bio-grid-row"
              style={isCustom ? { borderBottomColor: `${customConfig.accentColor}20` } : undefined}
            >
              <span
                className="bio-label"
                style={isCustom ? { color: customConfig.secondaryColor } : undefined}
              >
                Height:
              </span>
              <span
                className="bio-value"
                style={isCustom ? { color: customConfig.textColor } : undefined}
              >
                {biodataData.height || "e.g. 5'7\""}
              </span>
            </div>
            <div
              className="bio-grid-row"
              style={isCustom ? { borderBottomColor: `${customConfig.accentColor}20` } : undefined}
            >
              <span
                className="bio-label"
                style={isCustom ? { color: customConfig.secondaryColor } : undefined}
              >
                Complexion:
              </span>
              <span
                className="bio-value"
                style={isCustom ? { color: customConfig.textColor } : undefined}
              >
                {biodataData.complexion || "Fair"}
              </span>
            </div>
            {biodataData.gotra && (
              <div
                className="bio-grid-row"
                style={
                  isCustom ? { borderBottomColor: `${customConfig.accentColor}20` } : undefined
                }
              >
                <span
                  className="bio-label"
                  style={isCustom ? { color: customConfig.secondaryColor } : undefined}
                >
                  Gotra:
                </span>
                <span
                  className="bio-value"
                  style={isCustom ? { color: customConfig.textColor } : undefined}
                >
                  {biodataData.gotra}
                </span>
              </div>
            )}
            {biodataData.rashi && (
              <div
                className="bio-grid-row"
                style={
                  isCustom ? { borderBottomColor: `${customConfig.accentColor}20` } : undefined
                }
              >
                <span
                  className="bio-label"
                  style={isCustom ? { color: customConfig.secondaryColor } : undefined}
                >
                  Rashi:
                </span>
                <span
                  className="bio-value"
                  style={isCustom ? { color: customConfig.textColor } : undefined}
                >
                  {biodataData.rashi}
                </span>
              </div>
            )}
            {biodataData.nakshatra && (
              <div
                className="bio-grid-row"
                style={
                  isCustom ? { borderBottomColor: `${customConfig.accentColor}20` } : undefined
                }
              >
                <span
                  className="bio-label"
                  style={isCustom ? { color: customConfig.secondaryColor } : undefined}
                >
                  Nakshatra:
                </span>
                <span
                  className="bio-value"
                  style={isCustom ? { color: customConfig.textColor } : undefined}
                >
                  {biodataData.nakshatra}
                </span>
              </div>
            )}
            {biodataData.religion && (
              <div
                className="bio-grid-row"
                style={
                  isCustom ? { borderBottomColor: `${customConfig.accentColor}20` } : undefined
                }
              >
                <span
                  className="bio-label"
                  style={isCustom ? { color: customConfig.secondaryColor } : undefined}
                >
                  Religion / Caste:
                </span>
                <span
                  className="bio-value"
                  style={isCustom ? { color: customConfig.textColor } : undefined}
                >
                  {biodataData.religion} {biodataData.caste ? `/ ${biodataData.caste}` : ""}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* 2. Educational & Professional Information */}
        <section className="bio-section">
          <h2
            className="bio-sec-title"
            style={isCustom ? { color: customConfig.accentColor } : undefined}
          >
            {tSymbol} Education & Occupation {tSymbol}
          </h2>
          <div className="bio-grid" style={isCustom ? { background: "transparent" } : undefined}>
            <div
              className="bio-grid-row"
              style={isCustom ? { borderBottomColor: `${customConfig.accentColor}20` } : undefined}
            >
              <span
                className="bio-label"
                style={isCustom ? { color: customConfig.secondaryColor } : undefined}
              >
                Education:
              </span>
              <span
                className="bio-value"
                style={isCustom ? { color: customConfig.textColor } : undefined}
              >
                {biodataData.education || "Bachelor / Master details"}
              </span>
            </div>
            <div
              className="bio-grid-row"
              style={isCustom ? { borderBottomColor: `${customConfig.accentColor}20` } : undefined}
            >
              <span
                className="bio-label"
                style={isCustom ? { color: customConfig.secondaryColor } : undefined}
              >
                Occupation / Profession:
              </span>
              <span
                className="bio-value"
                style={isCustom ? { color: customConfig.textColor } : undefined}
              >
                {biodataData.occupation || "Software Engineer / Doctor / Business"}
              </span>
            </div>
            {biodataData.company && (
              <div
                className="bio-grid-row"
                style={
                  isCustom ? { borderBottomColor: `${customConfig.accentColor}20` } : undefined
                }
              >
                <span
                  className="bio-label"
                  style={isCustom ? { color: customConfig.secondaryColor } : undefined}
                >
                  Company Name:
                </span>
                <span
                  className="bio-value"
                  style={isCustom ? { color: customConfig.textColor } : undefined}
                >
                  {biodataData.company}
                </span>
              </div>
            )}
            {biodataData.income && (
              <div
                className="bio-grid-row"
                style={
                  isCustom ? { borderBottomColor: `${customConfig.accentColor}20` } : undefined
                }
              >
                <span
                  className="bio-label"
                  style={isCustom ? { color: customConfig.secondaryColor } : undefined}
                >
                  Annual Income:
                </span>
                <span
                  className="bio-value"
                  style={isCustom ? { color: customConfig.textColor } : undefined}
                >
                  {biodataData.income}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* 3. Family Background Section */}
        <section className="bio-section">
          <h2
            className="bio-sec-title"
            style={isCustom ? { color: customConfig.accentColor } : undefined}
          >
            {tSymbol} Family Details {tSymbol}
          </h2>
          <div className="bio-grid" style={isCustom ? { background: "transparent" } : undefined}>
            <div
              className="bio-grid-row"
              style={isCustom ? { borderBottomColor: `${customConfig.accentColor}20` } : undefined}
            >
              <span
                className="bio-label"
                style={isCustom ? { color: customConfig.secondaryColor } : undefined}
              >
                Father's Name:
              </span>
              <span
                className="bio-value"
                style={isCustom ? { color: customConfig.textColor } : undefined}
              >
                {biodataData.fatherName || "Father's Full Name"}
              </span>
            </div>
            <div
              className="bio-grid-row"
              style={isCustom ? { borderBottomColor: `${customConfig.accentColor}20` } : undefined}
            >
              <span
                className="bio-label"
                style={isCustom ? { color: customConfig.secondaryColor } : undefined}
              >
                Father's Occupation:
              </span>
              <span
                className="bio-value"
                style={isCustom ? { color: customConfig.textColor } : undefined}
              >
                {biodataData.fatherOccupation || "Retired / Business / Service"}
              </span>
            </div>
            <div
              className="bio-grid-row"
              style={isCustom ? { borderBottomColor: `${customConfig.accentColor}20` } : undefined}
            >
              <span
                className="bio-label"
                style={isCustom ? { color: customConfig.secondaryColor } : undefined}
              >
                Mother's Name:
              </span>
              <span
                className="bio-value"
                style={isCustom ? { color: customConfig.textColor } : undefined}
              >
                {biodataData.motherName || "Mother's Full Name"}
              </span>
            </div>
            <div
              className="bio-grid-row"
              style={isCustom ? { borderBottomColor: `${customConfig.accentColor}20` } : undefined}
            >
              <span
                className="bio-label"
                style={isCustom ? { color: customConfig.secondaryColor } : undefined}
              >
                Mother's Occupation:
              </span>
              <span
                className="bio-value"
                style={isCustom ? { color: customConfig.textColor } : undefined}
              >
                {biodataData.motherOccupation || "Housewife / Service"}
              </span>
            </div>
            <div
              className="bio-grid-row"
              style={isCustom ? { borderBottomColor: `${customConfig.accentColor}20` } : undefined}
            >
              <span
                className="bio-label"
                style={isCustom ? { color: customConfig.secondaryColor } : undefined}
              >
                Siblings:
              </span>
              <span
                className="bio-value"
                style={isCustom ? { color: customConfig.textColor } : undefined}
              >
                {biodataData.siblings || "Brothers / Sisters details"}
              </span>
            </div>
            <div
              className="bio-grid-row"
              style={isCustom ? { borderBottomColor: `${customConfig.accentColor}20` } : undefined}
            >
              <span
                className="bio-label"
                style={isCustom ? { color: customConfig.secondaryColor } : undefined}
              >
                Family Status:
              </span>
              <span
                className="bio-value"
                style={isCustom ? { color: customConfig.textColor } : undefined}
              >
                {biodataData.familyStatus}
              </span>
            </div>
            <div
              className="bio-grid-row"
              style={isCustom ? { borderBottomColor: `${customConfig.accentColor}20` } : undefined}
            >
              <span
                className="bio-label"
                style={isCustom ? { color: customConfig.secondaryColor } : undefined}
              >
                Family Values:
              </span>
              <span
                className="bio-value"
                style={isCustom ? { color: customConfig.textColor } : undefined}
              >
                {biodataData.familyValues}
              </span>
            </div>
            <div
              className="bio-grid-row"
              style={isCustom ? { borderBottomColor: `${customConfig.accentColor}20` } : undefined}
            >
              <span
                className="bio-label"
                style={isCustom ? { color: customConfig.secondaryColor } : undefined}
              >
                Residential Address:
              </span>
              <span
                className="bio-value"
                style={isCustom ? { color: customConfig.textColor } : undefined}
              >
                {biodataData.address || "Permanent address details"}
              </span>
            </div>
          </div>
        </section>

        {/* 4. Partner Expectations (Optional) */}
        {biodataData.expectations && (
          <section className="bio-section">
            <h2
              className="bio-sec-title"
              style={isCustom ? { color: customConfig.accentColor } : undefined}
            >
              {tSymbol} Partner Expectations {tSymbol}
            </h2>
            <p
              className="bio-expectations-text"
              style={isCustom ? { color: customConfig.textColor } : undefined}
            >
              {biodataData.expectations}
            </p>
          </section>
        )}

        {/* 5. Contact Section */}
        <section className="bio-section bio-contact-section">
          <h2
            className="bio-sec-title"
            style={isCustom ? { color: customConfig.accentColor } : undefined}
          >
            {tSymbol} Contact Person Details {tSymbol}
          </h2>
          <div className="bio-grid" style={isCustom ? { background: "transparent" } : undefined}>
            <div
              className="bio-grid-row"
              style={isCustom ? { borderBottomColor: `${customConfig.accentColor}20` } : undefined}
            >
              <span
                className="bio-label"
                style={isCustom ? { color: customConfig.secondaryColor } : undefined}
              >
                Contact Person:
              </span>
              <span
                className="bio-value font-bold"
                style={isCustom ? { color: customConfig.textColor } : undefined}
              >
                {biodataData.contactPerson}
              </span>
            </div>
            <div
              className="bio-grid-row"
              style={isCustom ? { borderBottomColor: `${customConfig.accentColor}20` } : undefined}
            >
              <span
                className="bio-label"
                style={isCustom ? { color: customConfig.secondaryColor } : undefined}
              >
                Contact Numbers:
              </span>
              <span
                className="bio-value font-bold"
                style={isCustom ? { color: customConfig.textColor } : undefined}
              >
                {biodataData.contactPhone}
              </span>
            </div>
          </div>
        </section>

        {footer && (
          <footer
            className="bio-footer"
            style={
              isCustom
                ? { borderTopColor: customConfig.accentColor, color: customConfig.secondaryColor }
                : undefined
            }
          >
            {footer}
          </footer>
        )}
      </div>
    </article>
  );
}
