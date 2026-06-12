import type React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

// ─────────────────────── Types ───────────────────────────────────────

export interface CustomTemplateConfig {
  accentColor: string;
  bgColor: string;
  textColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderStyle: "none" | "single" | "double" | "thick" | "dashed" | "ornate";
  headerLayout: "centered" | "left" | "logo-left" | "logo-right";
  sectionStyle: "filled" | "underline" | "left-bar" | "pill" | "dots" | "none";
  showWatermark: boolean;
  watermarkText: string;
  paperSize: "a4" | "letter";
  cornerStyle: "square" | "rounded" | "circle-dots";
  // FlowCV features
  layoutStyle?: "single" | "sidebar-left" | "sidebar-right";
  fontSize?: "sm" | "base" | "lg";
  spacing?: "compact" | "normal" | "loose";
  skillBadgeStyle?: "pill" | "square" | "underline" | "simple";
  profilePicShape?: "circle" | "square" | "rounded";
  visibleSections?: {
    summary: boolean;
    experience: boolean;
    projects: boolean;
    education: boolean;
    skills: boolean;
    languages: boolean;
  };
  sectionTitles?: {
    experience: string;
    projects: string;
    education: string;
    skills: string;
    languages: string;
  };
}

export const DEFAULT_CUSTOM_CONFIG: CustomTemplateConfig = {
  accentColor: "#1E2761",
  bgColor: "#ffffff",
  textColor: "#111827",
  secondaryColor: "#6b7280",
  fontFamily: "Georgia, serif",
  borderStyle: "single",
  headerLayout: "centered",
  sectionStyle: "filled",
  showWatermark: false,
  watermarkText: "",
  paperSize: "a4",
  cornerStyle: "square",
  // FlowCV features defaults
  layoutStyle: "sidebar-right",
  fontSize: "base",
  spacing: "normal",
  skillBadgeStyle: "pill",
  profilePicShape: "circle",
  visibleSections: {
    summary: true,
    experience: true,
    projects: true,
    education: true,
    skills: true,
    languages: true,
  },
  sectionTitles: {
    experience: "Work Experience",
    projects: "Key Projects",
    education: "Education",
    skills: "Skills",
    languages: "Languages",
  },
};

// ─────────────────────── Sub-selector components ─────────────────────

function OptionGrid<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string; preview: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`flex flex-col items-center gap-1 rounded-lg border-2 p-2 transition-all cursor-pointer ${
            value === o.id
              ? "border-primary bg-primary/10 shadow-md scale-[1.04]"
              : "border-border hover:border-primary/40 bg-card"
          }`}
          aria-pressed={value === o.id}
          title={o.label}
        >
          <div className="w-16 h-10 rounded overflow-hidden bg-white flex items-center justify-center border border-gray-100">
            {o.preview}
          </div>
          <span className="text-[9px] font-semibold text-center leading-tight text-muted-foreground">
            {o.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─────────────────────── Preview thumbnails ──────────────────────────

const BorderPreviews: Record<CustomTemplateConfig["borderStyle"], React.ReactNode> = {
  none: (
    <svg viewBox="0 0 64 40" className="w-full h-full">
      <rect width="64" height="40" fill="white" />
      <rect x="8" y="8" width="48" height="4" rx="1" fill="#ccc" />
      <rect x="8" y="16" width="35" height="2" rx="0.5" fill="#ddd" />
      <rect x="8" y="22" width="42" height="2" rx="0.5" fill="#ddd" />
    </svg>
  ),
  single: (
    <svg viewBox="0 0 64 40" className="w-full h-full">
      <rect width="64" height="40" fill="white" />
      <rect x="2" y="2" width="60" height="36" fill="none" stroke="#1E2761" strokeWidth="1.5" />
      <rect x="10" y="10" width="44" height="4" rx="1" fill="#ccc" />
      <rect x="10" y="18" width="32" height="2" rx="0.5" fill="#ddd" />
    </svg>
  ),
  double: (
    <svg viewBox="0 0 64 40" className="w-full h-full">
      <rect width="64" height="40" fill="white" />
      <rect x="2" y="2" width="60" height="36" fill="none" stroke="#1E2761" strokeWidth="1.5" />
      <rect x="4" y="4" width="56" height="32" fill="none" stroke="#1E2761" strokeWidth="0.6" />
      <rect x="10" y="10" width="44" height="4" rx="1" fill="#ccc" />
    </svg>
  ),
  thick: (
    <svg viewBox="0 0 64 40" className="w-full h-full">
      <rect width="64" height="40" fill="white" />
      <rect x="1" y="1" width="62" height="38" fill="none" stroke="#1E2761" strokeWidth="4" />
      <rect x="10" y="10" width="44" height="4" rx="1" fill="#ccc" />
    </svg>
  ),
  dashed: (
    <svg viewBox="0 0 64 40" className="w-full h-full">
      <rect width="64" height="40" fill="white" />
      <rect
        x="2"
        y="2"
        width="60"
        height="36"
        fill="none"
        stroke="#1E2761"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      <rect x="10" y="10" width="44" height="4" rx="1" fill="#ccc" />
    </svg>
  ),
  ornate: (
    <svg viewBox="0 0 64 40" className="w-full h-full">
      <rect width="64" height="40" fill="white" />
      <rect x="2" y="2" width="60" height="36" fill="none" stroke="#C9A227" strokeWidth="2" />
      <rect x="4" y="4" width="56" height="32" fill="none" stroke="#C9A227" strokeWidth="0.5" />
      {[
        [2, 2],
        [62, 2],
        [2, 38],
        [62, 38],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#C9A227" />
      ))}
      <rect x="10" y="12" width="44" height="4" rx="1" fill="#ccc" />
    </svg>
  ),
};

const HeaderPreviews: Record<CustomTemplateConfig["headerLayout"], React.ReactNode> = {
  centered: (
    <svg viewBox="0 0 64 40" className="w-full h-full">
      <rect width="64" height="40" fill="white" />
      <circle cx="32" cy="10" r="5" fill="none" stroke="#1E2761" strokeWidth="1" />
      <rect x="18" y="18" width="28" height="3" rx="0.5" fill="#1E2761" opacity="0.7" />
      <rect x="22" y="23" width="20" height="2" rx="0.5" fill="#888" opacity="0.5" />
      <rect x="4" y="28" width="56" height="0.5" fill="#1E2761" opacity="0.3" />
    </svg>
  ),
  left: (
    <svg viewBox="0 0 64 40" className="w-full h-full">
      <rect width="64" height="40" fill="white" />
      <rect x="4" y="8" width="30" height="3" rx="0.5" fill="#1E2761" opacity="0.8" />
      <rect x="4" y="13" width="22" height="2" rx="0.5" fill="#888" opacity="0.5" />
      <rect x="4" y="17" width="18" height="1.5" rx="0.5" fill="#888" opacity="0.4" />
      <rect x="4" y="23" width="56" height="0.5" fill="#1E2761" opacity="0.3" />
    </svg>
  ),
  "logo-left": (
    <svg viewBox="0 0 64 40" className="w-full h-full">
      <rect width="64" height="40" fill="white" />
      <circle cx="10" cy="14" r="7" fill="none" stroke="#1E2761" strokeWidth="1" />
      <rect x="22" y="9" width="36" height="3" rx="0.5" fill="#1E2761" opacity="0.8" />
      <rect x="22" y="14" width="26" height="2" rx="0.5" fill="#888" opacity="0.5" />
      <rect x="22" y="18" width="20" height="1.5" rx="0.5" fill="#888" opacity="0.4" />
      <rect x="4" y="24" width="56" height="0.5" fill="#1E2761" opacity="0.3" />
    </svg>
  ),
  "logo-right": (
    <svg viewBox="0 0 64 40" className="w-full h-full">
      <rect width="64" height="40" fill="white" />
      <circle cx="54" cy="14" r="7" fill="none" stroke="#1E2761" strokeWidth="1" />
      <rect x="6" y="9" width="36" height="3" rx="0.5" fill="#1E2761" opacity="0.8" />
      <rect x="6" y="14" width="26" height="2" rx="0.5" fill="#888" opacity="0.5" />
      <rect x="6" y="18" width="20" height="1.5" rx="0.5" fill="#888" opacity="0.4" />
      <rect x="4" y="24" width="56" height="0.5" fill="#1E2761" opacity="0.3" />
    </svg>
  ),
};

const SectionPreviews: Record<CustomTemplateConfig["sectionStyle"], React.ReactNode> = {
  filled: (
    <svg viewBox="0 0 64 40" className="w-full h-full">
      <rect width="64" height="40" fill="white" />
      <rect x="4" y="6" width="56" height="7" rx="1" fill="#1E2761" opacity="0.8" />
      <rect x="4" y="17" width="50" height="2" rx="0.5" fill="#ddd" />
      <rect x="4" y="21" width="42" height="2" rx="0.5" fill="#ddd" />
      <rect x="4" y="28" width="56" height="5" rx="1" fill="#1E2761" opacity="0.8" />
    </svg>
  ),
  underline: (
    <svg viewBox="0 0 64 40" className="w-full h-full">
      <rect width="64" height="40" fill="white" />
      <rect x="4" y="6" width="30" height="4" rx="0.5" fill="#1E2761" opacity="0.8" />
      <rect x="4" y="11" width="56" height="1" fill="#1E2761" opacity="0.5" />
      <rect x="4" y="16" width="50" height="2" rx="0.5" fill="#ddd" />
      <rect x="4" y="22" width="30" height="4" rx="0.5" fill="#1E2761" opacity="0.8" />
      <rect x="4" y="27" width="56" height="1" fill="#1E2761" opacity="0.5" />
    </svg>
  ),
  "left-bar": (
    <svg viewBox="0 0 64 40" className="w-full h-full">
      <rect width="64" height="40" fill="white" />
      <rect x="4" y="6" width="3" height="10" fill="#1E2761" />
      <rect x="10" y="8" width="30" height="4" rx="0.5" fill="#1E2761" opacity="0.7" />
      <rect x="4" y="20" width="50" height="2" rx="0.5" fill="#ddd" />
      <rect x="4" y="28" width="3" height="8" fill="#1E2761" />
      <rect x="10" y="30" width="28" height="3" rx="0.5" fill="#1E2761" opacity="0.7" />
    </svg>
  ),
  pill: (
    <svg viewBox="0 0 64 40" className="w-full h-full">
      <rect width="64" height="40" fill="white" />
      <rect x="4" y="6" width="30" height="6" rx="3" fill="#1E2761" opacity="0.8" />
      <rect x="4" y="16" width="50" height="2" rx="0.5" fill="#ddd" />
      <rect x="4" y="20" width="42" height="2" rx="0.5" fill="#ddd" />
      <rect x="4" y="28" width="24" height="6" rx="3" fill="#1E2761" opacity="0.8" />
    </svg>
  ),
  dots: (
    <svg viewBox="0 0 64 40" className="w-full h-full">
      <rect width="64" height="40" fill="white" />
      <circle cx="7" cy="9" r="2" fill="#1E2761" opacity="0.8" />
      <rect x="13" y="7" width="28" height="4" rx="0.5" fill="#1E2761" opacity="0.7" />
      <rect x="4" y="15" width="50" height="2" rx="0.5" fill="#ddd" />
      <rect x="4" y="20" width="42" height="2" rx="0.5" fill="#ddd" />
      <circle cx="7" cy="29" r="2" fill="#1E2761" opacity="0.8" />
      <rect x="13" y="27" width="22" height="4" rx="0.5" fill="#1E2761" opacity="0.7" />
    </svg>
  ),
  none: (
    <svg viewBox="0 0 64 40" className="w-full h-full">
      <rect width="64" height="40" fill="white" />
      <rect x="4" y="6" width="30" height="4" rx="0.5" fill="#555" opacity="0.7" />
      <rect x="4" y="14" width="50" height="2" rx="0.5" fill="#ddd" />
      <rect x="4" y="19" width="42" height="2" rx="0.5" fill="#ddd" />
      <rect x="4" y="28" width="24" height="4" rx="0.5" fill="#555" opacity="0.7" />
    </svg>
  ),
};

const LayoutPreviews: Record<NonNullable<CustomTemplateConfig["layoutStyle"]>, React.ReactNode> = {
  single: (
    <svg viewBox="0 0 64 40" className="w-full h-full">
      <rect width="64" height="40" fill="white" />
      <rect x="8" y="6" width="48" height="4" rx="0.5" fill="#1E2761" opacity="0.8" />
      <rect x="8" y="14" width="48" height="4" rx="0.5" fill="#ddd" />
      <rect x="8" y="20" width="48" height="4" rx="0.5" fill="#ddd" />
      <rect x="8" y="26" width="48" height="4" rx="0.5" fill="#ddd" />
    </svg>
  ),
  "sidebar-left": (
    <svg viewBox="0 0 64 40" className="w-full h-full">
      <rect width="64" height="40" fill="white" />
      <rect x="6" y="6" width="16" height="28" rx="0.5" fill="#1E2761" opacity="0.2" />
      <rect x="26" y="6" width="32" height="28" rx="0.5" fill="#ddd" />
      <rect x="8" y="10" width="12" height="2" rx="0.5" fill="#1E2761" opacity="0.6" />
      <rect x="8" y="16" width="12" height="2" rx="0.5" fill="#1E2761" opacity="0.6" />
    </svg>
  ),
  "sidebar-right": (
    <svg viewBox="0 0 64 40" className="w-full h-full">
      <rect width="64" height="40" fill="white" />
      <rect x="42" y="6" width="16" height="28" rx="0.5" fill="#1E2761" opacity="0.2" />
      <rect x="6" y="6" width="32" height="28" rx="0.5" fill="#ddd" />
      <rect x="44" y="10" width="12" height="2" rx="0.5" fill="#1E2761" opacity="0.6" />
      <rect x="44" y="16" width="12" height="2" rx="0.5" fill="#1E2761" opacity="0.6" />
    </svg>
  ),
};

const SkillPreviews: Record<NonNullable<CustomTemplateConfig["skillBadgeStyle"]>, React.ReactNode> = {
  pill: (
    <svg viewBox="0 0 64 40" className="w-full h-full">
      <rect width="64" height="40" fill="white" />
      <rect x="6" y="14" width="22" height="12" rx="6" fill="#1E2761" opacity="0.1" />
      <rect x="6" y="14" width="22" height="12" rx="6" fill="none" stroke="#1E2761" strokeWidth="1" />
      <rect x="34" y="14" width="24" height="12" rx="6" fill="#1E2761" opacity="0.1" />
      <rect x="34" y="14" width="24" height="12" rx="6" fill="none" stroke="#1E2761" strokeWidth="1" />
    </svg>
  ),
  square: (
    <svg viewBox="0 0 64 40" className="w-full h-full">
      <rect width="64" height="40" fill="white" />
      <rect x="6" y="14" width="22" height="12" rx="2" fill="#1E2761" opacity="0.1" />
      <rect x="6" y="14" width="22" height="12" rx="2" fill="none" stroke="#1E2761" strokeWidth="1" />
      <rect x="34" y="14" width="24" height="12" rx="2" fill="#1E2761" opacity="0.1" />
      <rect x="34" y="14" width="24" height="12" rx="2" fill="none" stroke="#1E2761" strokeWidth="1" />
    </svg>
  ),
  underline: (
    <svg viewBox="0 0 64 40" className="w-full h-full">
      <rect width="64" height="40" fill="white" />
      <rect x="6" y="24" width="22" height="1" fill="#1E2761" />
      <rect x="34" y="24" width="24" height="1" fill="#1E2761" />
      <rect x="8" y="14" width="18" height="2" rx="0.5" fill="#444" />
      <rect x="36" y="14" width="20" height="2" rx="0.5" fill="#444" />
    </svg>
  ),
  simple: (
    <svg viewBox="0 0 64 40" className="w-full h-full">
      <rect width="64" height="40" fill="white" />
      <rect x="8" y="16" width="18" height="2" rx="0.5" fill="#444" />
      <circle cx="30" cy="17" r="1.5" fill="#1E2761" />
      <rect x="36" y="16" width="20" height="2" rx="0.5" fill="#444" />
    </svg>
  ),
};

const FontPreviews: { id: string; label: string; font: string }[] = [
  { id: "Georgia, serif", label: "Georgia", font: "Georgia, serif" },
  { id: "'Times New Roman', serif", label: "Times New Roman", font: "'Times New Roman', serif" },
  { id: "Arial, sans-serif", label: "Arial", font: "Arial, sans-serif" },
  { id: "'Segoe UI', sans-serif", label: "Segoe UI", font: "'Segoe UI', sans-serif" },
  { id: "'Courier New', monospace", label: "Courier", font: "'Courier New', monospace" },
  { id: "Garamond, serif", label: "Garamond", font: "Garamond, serif" },
];

// ─────────────────────── Main Component ─────────────────────────────

interface CustomTemplateDesignerProps {
  config: CustomTemplateConfig;
  onChange: (config: CustomTemplateConfig) => void;
}

export function CustomTemplateDesigner({ config, onChange }: CustomTemplateDesignerProps) {
  function set<K extends keyof CustomTemplateConfig>(key: K, value: CustomTemplateConfig[K]) {
    onChange({ ...config, [key]: value });
  }

  return (
    <div className="space-y-5 pt-2">
      {/* Live mini preview */}
      <div className="rounded-xl border overflow-hidden shadow-sm">
        <div className="bg-muted/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground border-b">
          Live Preview
        </div>
        <CustomMiniPreview config={config} />
      </div>

      {/* Colors */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary inline-block" /> Colors
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { key: "accentColor", label: "Accent / Header" },
              { key: "bgColor", label: "Background" },
              { key: "textColor", label: "Text Color" },
              { key: "secondaryColor", label: "Secondary Text" },
            ] as { key: keyof CustomTemplateConfig; label: string }[]
          ).map(({ key, label }) => (
            <div key={String(key)} className="space-y-1">
              <Label className="text-[10px]">{label}</Label>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={config[key] as string}
                  onChange={(e) => set(key, e.target.value)}
                  className="h-7 w-10 cursor-pointer rounded border bg-transparent p-0.5"
                />
                <Input
                  value={config[key] as string}
                  onChange={(e) => set(key, e.target.value)}
                  className="h-7 text-[10px] font-mono"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Quick color presets */}
        <div className="space-y-1">
          <Label className="text-[10px]">Quick Palettes</Label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { accent: "#1E2761", bg: "#ffffff", text: "#111827", label: "Navy Classic" },
              { accent: "#C9A227", bg: "#fffdf5", text: "#1a1200", label: "Royal Gold" },
              { accent: "#7F1D1D", bg: "#fff7f7", text: "#1a0000", label: "Maroon" },
              { accent: "#166534", bg: "#f0fdf4", text: "#052e16", label: "Forest" },
              { accent: "#BE185D", bg: "#fff0f6", text: "#500724", label: "Rose" },
              { accent: "#0f172a", bg: "#f8fafc", text: "#0f172a", label: "Charcoal" },
              { accent: "#6d28d9", bg: "#faf5ff", text: "#2e1065", label: "Purple" },
              { accent: "#0369a1", bg: "#f0f9ff", text: "#082f49", label: "Ocean" },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                title={p.label}
                onClick={() =>
                  onChange({ ...config, accentColor: p.accent, bgColor: p.bg, textColor: p.text })
                }
                className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-semibold hover:border-primary transition-colors"
              >
                <span
                  className="w-3 h-3 rounded-full border border-white/30"
                  style={{ background: p.accent }}
                />
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Font */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
          <span className="inline-block text-sm font-bold">T</span> Font Family
        </h3>
        <div className="flex flex-wrap gap-2">
          {FontPreviews.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => set("fontFamily", f.font)}
              className={`px-3 py-1.5 rounded-lg border-2 text-xs transition-all ${
                config.fontFamily === f.font
                  ? "border-primary bg-primary/10 font-bold text-primary"
                  : "border-border hover:border-primary/40 text-muted-foreground"
              }`}
              style={{ fontFamily: f.font }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Border */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          ▭ Border Style
        </h3>
        <OptionGrid
          options={[
            { id: "none" as const, label: "None", preview: BorderPreviews.none },
            { id: "single" as const, label: "Single", preview: BorderPreviews.single },
            { id: "double" as const, label: "Double", preview: BorderPreviews.double },
            { id: "thick" as const, label: "Thick", preview: BorderPreviews.thick },
            { id: "dashed" as const, label: "Dashed", preview: BorderPreviews.dashed },
            { id: "ornate" as const, label: "Ornate", preview: BorderPreviews.ornate },
          ]}
          value={config.borderStyle}
          onChange={(v) => set("borderStyle", v)}
        />
      </div>

      {/* Header Layout */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          ☰ Header Layout
        </h3>
        <OptionGrid
          options={[
            { id: "centered" as const, label: "Centered", preview: HeaderPreviews.centered },
            { id: "left" as const, label: "Left Align", preview: HeaderPreviews.left },
            { id: "logo-left" as const, label: "Logo Left", preview: HeaderPreviews["logo-left"] },
            {
              id: "logo-right" as const,
              label: "Logo Right",
              preview: HeaderPreviews["logo-right"],
            },
          ]}
          value={config.headerLayout}
          onChange={(v) => set("headerLayout", v)}
        />
      </div>

      {/* Section Style */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          ≡ Section Heading Style
        </h3>
        <OptionGrid
          options={[
            { id: "filled" as const, label: "Filled Bar", preview: SectionPreviews.filled },
            { id: "underline" as const, label: "Underline", preview: SectionPreviews.underline },
            { id: "left-bar" as const, label: "Left Bar", preview: SectionPreviews["left-bar"] },
            { id: "pill" as const, label: "Pill", preview: SectionPreviews.pill },
            { id: "dots" as const, label: "Dot", preview: SectionPreviews.dots },
            { id: "none" as const, label: "Plain", preview: SectionPreviews.none },
          ]}
          value={config.sectionStyle}
          onChange={(v) => set("sectionStyle", v)}
        />
      </div>

      {/* FlowCV Premium Features Section */}
      <div className="border-t pt-3 space-y-4">
        <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> FlowCV Layout & Styling
        </h4>

        {/* Layout Style */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
            <span>◫ Column Layout</span>
          </h3>
          <OptionGrid
            options={[
              { id: "single" as const, label: "Single Column", preview: LayoutPreviews.single },
              { id: "sidebar-left" as const, label: "Left Sidebar", preview: LayoutPreviews["sidebar-left"] },
              { id: "sidebar-right" as const, label: "Right Sidebar", preview: LayoutPreviews["sidebar-right"] },
            ]}
            value={config.layoutStyle || "sidebar-right"}
            onChange={(v) => set("layoutStyle", v)}
          />
        </div>

        {/* Font Size & Spacing */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              🗚 Text Size
            </h3>
            <div className="flex rounded-lg border p-0.5 bg-muted/50 gap-0.5">
              {(["sm", "base", "lg"] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => set("fontSize", sz)}
                  className={`flex-1 text-[10px] font-bold py-1 px-1.5 rounded transition-all capitalize cursor-pointer ${
                    (config.fontSize || "base") === sz
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {sz === "base" ? "normal" : sz}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              ↕ Row Spacing
            </h3>
            <div className="flex rounded-lg border p-0.5 bg-muted/50 gap-0.5">
              {(["compact", "normal", "loose"] as const).map((sp) => (
                <button
                  key={sp}
                  type="button"
                  onClick={() => set("spacing", sp)}
                  className={`flex-1 text-[10px] font-bold py-1 px-1.5 rounded transition-all capitalize cursor-pointer ${
                    (config.spacing || "normal") === sp
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skill Badge Style */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            🏷️ Skill Badge Style
          </h3>
          <OptionGrid
            options={[
              { id: "pill" as const, label: "Pill Tag", preview: SkillPreviews.pill },
              { id: "square" as const, label: "Square Tag", preview: SkillPreviews.square },
              { id: "underline" as const, label: "Underlined", preview: SkillPreviews.underline },
              { id: "simple" as const, label: "Simple Dot", preview: SkillPreviews.simple },
            ]}
            value={config.skillBadgeStyle || "pill"}
            onChange={(v) => set("skillBadgeStyle", v)}
          />
        </div>

        {/* Profile Photo Shape */}
        <div className="space-y-2 border-t pt-3">
          <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            📷 Profile Photo Shape
          </h3>
          <div className="flex rounded-lg border p-0.5 bg-muted/50 gap-0.5">
            {(["circle", "square", "rounded"] as const).map((shape) => (
              <button
                key={shape}
                type="button"
                onClick={() => set("profilePicShape", shape)}
                className={`flex-1 text-[10px] font-bold py-1 px-1.5 rounded transition-all capitalize cursor-pointer ${
                  (config.profilePicShape || "circle") === shape
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {shape}
              </button>
            ))}
          </div>
        </div>

        {/* Section Visibility */}
        <div className="space-y-2 border-t pt-3">
          <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            👁️ Hide / Show Sections
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {([
              { key: "summary", label: "Summary" },
              { key: "experience", label: "Work Experience" },
              { key: "projects", label: "Key Projects" },
              { key: "education", label: "Education" },
              { key: "skills", label: "Skills" },
              { key: "languages", label: "Languages" },
            ] as const).map(({ key, label }) => {
              const currentVisible = config.visibleSections || {
                summary: true,
                experience: true,
                projects: true,
                education: true,
                skills: true,
                languages: true,
              };
              const isVal = currentVisible[key] !== false;
              return (
                <label key={key} className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={isVal}
                    onChange={(e) => {
                      const nextVisible = { ...currentVisible, [key]: e.target.checked };
                      set("visibleSections", nextVisible);
                    }}
                    className="rounded"
                  />
                  {label}
                </label>
              );
            })}
          </div>
        </div>

        {/* Section Titles Renaming */}
        <div className="space-y-2 border-t pt-3">
          <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            ✍️ Rename Section Headings
          </h3>
          <div className="space-y-2">
            {([
              { key: "experience", label: "Work Experience", placeholder: "Work Experience" },
              { key: "projects", label: "Key Projects", placeholder: "Key Projects" },
              { key: "education", label: "Education", placeholder: "Education" },
              { key: "skills", label: "Skills", placeholder: "Skills" },
              { key: "languages", label: "Languages", placeholder: "Languages" },
            ] as const).map(({ key, label, placeholder }) => {
              const currentTitles = config.sectionTitles || {
                experience: "Work Experience",
                projects: "Key Projects",
                education: "Education",
                skills: "Skills",
                languages: "Languages",
              };
              const currentVal = currentTitles[key] || "";
              return (
                <div key={key} className="flex items-center justify-between gap-2">
                  <Label className="text-[10px] text-muted-foreground shrink-0 w-24">{label}</Label>
                  <Input
                    className="h-7 text-xs flex-1 bg-background"
                    value={currentVal}
                    placeholder={placeholder}
                    onChange={(e) => {
                      const nextTitles = { ...currentTitles, [key]: e.target.value };
                      set("sectionTitles", nextTitles);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className="space-y-2 border-t pt-3">
        <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Watermark / Confidential Text
        </h3>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={config.showWatermark}
              onChange={(e) => set("showWatermark", e.target.checked)}
              className="rounded"
            />
            Show watermark
          </label>
        </div>
        {config.showWatermark && (
          <input
            type="text"
            value={config.watermarkText}
            onChange={(e) => set("watermarkText", e.target.value)}
            placeholder="e.g. CONFIDENTIAL or SCHOOL NAME"
            className="w-full h-8 rounded border px-2 text-xs bg-background"
          />
        )}
      </div>
    </div>
  );
}

// ─────────────── Live Mini Preview inside designer ───────────────────

function CustomMiniPreview({ config }: { config: CustomTemplateConfig }) {
  const {
    accentColor,
    bgColor,
    textColor,
    secondaryColor,
    borderStyle,
    headerLayout,
    sectionStyle,
    fontFamily,
    showWatermark,
    watermarkText,
  } = config;

  const borderMap: Record<CustomTemplateConfig["borderStyle"], string> = {
    none: "none",
    single: `1.5px solid ${accentColor}`,
    double: `3px double ${accentColor}`,
    thick: `4px solid ${accentColor}`,
    dashed: `1.5px dashed ${accentColor}`,
    ornate: `2px solid #C9A227`,
  };

  return (
    <div
      className="relative p-3 overflow-hidden"
      style={{
        background: bgColor,
        border: borderMap[borderStyle],
        fontFamily,
        minHeight: 140,
        color: textColor,
        ...(borderStyle === "double"
          ? { outline: `1px solid ${accentColor}`, outlineOffset: "-4px" }
          : {}),
      }}
    >
      {/* Watermark */}
      {showWatermark && watermarkText && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: accentColor,
            opacity: 0.07,
            transform: "rotate(-30deg)",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          {watermarkText}
        </div>
      )}

      {/* Header */}
      {headerLayout === "centered" ? (
        <div className="text-center mb-2">
          <div className="font-bold text-sm" style={{ color: accentColor }}>
            MERRY CITY SCHOOL
          </div>
          <div className="text-[9px]" style={{ color: secondaryColor }}>
            Narayanpur, Varanasi
          </div>
        </div>
      ) : headerLayout === "left" ? (
        <div className="mb-2">
          <div className="font-bold text-sm" style={{ color: accentColor }}>
            MERRY CITY SCHOOL
          </div>
          <div className="text-[9px]" style={{ color: secondaryColor }}>
            Narayanpur, Varanasi
          </div>
        </div>
      ) : headerLayout === "logo-left" ? (
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-8 h-8 rounded-full border-2 flex-shrink-0"
            style={{ borderColor: accentColor }}
          />
          <div>
            <div className="font-bold text-sm" style={{ color: accentColor }}>
              MERRY CITY SCHOOL
            </div>
            <div className="text-[9px]" style={{ color: secondaryColor }}>
              Narayanpur, Varanasi
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="font-bold text-sm" style={{ color: accentColor }}>
              MERRY CITY SCHOOL
            </div>
            <div className="text-[9px]" style={{ color: secondaryColor }}>
              Narayanpur, Varanasi
            </div>
          </div>
          <div
            className="w-8 h-8 rounded-full border-2 flex-shrink-0"
            style={{ borderColor: accentColor }}
          />
        </div>
      )}

      <div className="border-t mb-2" style={{ borderColor: accentColor, opacity: 0.3 }} />

      {/* Section heading preview */}
      {sectionStyle === "filled" && (
        <div
          className="px-2 py-0.5 text-[10px] font-bold mb-1.5"
          style={{ background: accentColor, color: bgColor }}
        >
          SECTION A — MCQ (10 Marks)
        </div>
      )}
      {sectionStyle === "underline" && (
        <div className="mb-1.5">
          <span className="text-[10px] font-bold" style={{ color: accentColor }}>
            SECTION A — MCQ
          </span>
          <div className="h-px mt-0.5" style={{ background: accentColor, opacity: 0.5 }} />
        </div>
      )}
      {sectionStyle === "left-bar" && (
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-1 h-4 rounded" style={{ background: accentColor }} />
          <span className="text-[10px] font-bold" style={{ color: accentColor }}>
            SECTION A — MCQ
          </span>
        </div>
      )}
      {sectionStyle === "pill" && (
        <div
          className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-1.5"
          style={{ background: accentColor, color: bgColor }}
        >
          SECTION A — MCQ
        </div>
      )}
      {sectionStyle === "dots" && (
        <div className="flex items-center gap-1 mb-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
          <span className="text-[10px] font-bold" style={{ color: accentColor }}>
            SECTION A — MCQ
          </span>
        </div>
      )}
      {sectionStyle === "none" && (
        <div className="text-[10px] font-bold mb-1.5" style={{ color: textColor }}>
          SECTION A — MCQ (10 Marks)
        </div>
      )}

      {/* Dummy questions */}
      <div className="text-[9px] pl-1 space-y-0.5" style={{ color: textColor, opacity: 0.7 }}>
        <div>1. Choose the correct answer — fill in the blank.</div>
        <div>2. Identify the type of each sentence.</div>
        <div>3. Write the antonym of the underlined word.</div>
      </div>
    </div>
  );
}
