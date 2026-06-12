import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function oklchToRgb(l: number, c: number, h: number): { r: number; g: number; b: number } {
  // h is in degrees, convert to radians
  const hRad = (h * Math.PI) / 180;

  // OKLCH to Oklab
  const L = l;
  const a_lab = c * Math.cos(hRad);
  const b_lab = c * Math.sin(hRad);

  // Oklab to LMS
  const l_lms = L + 0.3963377774 * a_lab + 0.2158037573 * b_lab;
  const m_lms = L - 0.1055613458 * a_lab - 0.0638541728 * b_lab;
  const s_lms = L - 0.0894841775 * a_lab - 1.291485548 * b_lab;

  // LMS to non-linear LMS
  const l_cube = l_lms * l_lms * l_lms;
  const m_cube = m_lms * m_lms * m_lms;
  const s_cube = s_lms * s_lms * s_lms;

  // LMS to linear sRGB
  const r_linear = +4.0767416621 * l_cube - 3.3077115913 * m_cube + 0.2309699292 * s_cube;
  const g_linear = -1.2684380046 * l_cube + 2.6097574011 * m_cube - 0.3413193965 * s_cube;
  const b_linear = -0.0041960863 * l_cube - 0.7034186147 * m_cube + 1.707614701 * s_cube;

  // Helper for gamma correction
  const gamma = (v: number) => {
    return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  };

  const r = Math.min(255, Math.max(0, Math.round(gamma(r_linear) * 255)));
  const g = Math.min(255, Math.max(0, Math.round(gamma(g_linear) * 255)));
  const b = Math.min(255, Math.max(0, Math.round(gamma(b_linear) * 255)));

  return { r, g, b };
}

export function parseAndConvertOklch(colorStr: string): string {
  if (!colorStr || typeof colorStr !== "string") return colorStr;

  // Matches oklch(L C H) or oklch(L C H / A)
  // Supports decimals, percentages (e.g. 50%), none, deg
  const oklchRegex =
    /oklch\(\s*([\d.]+%?|none)\s+([\d.]+|none)\s+([\d.deg]+%?|none)(?:\s*\/\s*([\d.]+%?|none))?\s*\)/gi;

  return colorStr.replace(oklchRegex, (match, lStr, cStr, hStr, aStr) => {
    try {
      const parseVal = (val: string, isL: boolean) => {
        if (!val || val === "none") return 0;
        if (val.endsWith("%")) {
          const num = parseFloat(val) / 100;
          return isL ? num : num * 0.4;
        }
        return parseFloat(val);
      };

      const l = parseVal(lStr, true);
      const c = parseVal(cStr, false);

      let h = 0;
      if (hStr && hStr !== "none") {
        hStr = hStr.replace("deg", "");
        h = hStr.endsWith("%") ? (parseFloat(hStr) / 100) * 360 : parseFloat(hStr);
      }

      let a = 1;
      if (aStr && aStr !== "none") {
        a = aStr.endsWith("%") ? parseFloat(aStr) / 100 : parseFloat(aStr);
      }

      const rgb = oklchToRgb(l, c, h);
      if (a === 1) {
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      } else {
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
      }
    } catch {
      return match;
    }
  });
}

export async function withHexStylesForPdf(action: () => Promise<void>) {
  if (typeof window === "undefined") {
    await action();
    return;
  }

  // Find target element inside paper views
  const target = document.querySelector(
    ".exam-paper, .hhw-paper, .timetable-paper, .resume-paper, .biodata-paper",
  ) as HTMLElement | null;

  if (!target) {
    await action();
    return;
  }

  // Styles related to colors, layout, sizing and text that we should inline
  // to bypass Tailwind stylesheets parsing by html2canvas
  const propsToInline = [
    "color",
    "background-color",
    "background-image",
    "font-family",
    "font-size",
    "font-weight",
    "font-style",
    "line-height",
    "text-align",
    "text-transform",
    "text-decoration",
    "border-top-width",
    "border-top-style",
    "border-top-color",
    "border-bottom-width",
    "border-bottom-style",
    "border-bottom-color",
    "border-left-width",
    "border-left-style",
    "border-left-color",
    "border-right-width",
    "border-right-style",
    "border-right-color",
    "padding-top",
    "padding-bottom",
    "padding-left",
    "padding-right",
    "margin-top",
    "margin-bottom",
    "margin-left",
    "margin-right",
    "width",
    "height",
    "display",
    "flex-direction",
    "justify-content",
    "align-items",
    "gap",
    "flex-wrap",
    "flex-shrink",
    "flex-grow",
    "border-collapse",
    "border-spacing",
    "box-shadow",
    "border-radius",
    "opacity",
  ];

  const originalStyles = new Map<HTMLElement, string>();

  const inlineStylesRecursively = (el: HTMLElement) => {
    try {
      const computed = window.getComputedStyle(el);
      const styleAttr = el.getAttribute("style") || "";
      originalStyles.set(el, styleAttr);

      for (const prop of propsToInline) {
        let val = computed.getPropertyValue(prop);
        if (val) {
          // Parse and convert any OKLCH colors to RGB in the computed value
          if (val.includes("oklch")) {
            val = parseAndConvertOklch(val);
          }
          el.style.setProperty(prop, val);
        }
      }
    } catch (err) {
      console.warn("Failed to inline styles for element:", el, err);
    }

    // Recurse children
    const children = Array.from(el.children) as HTMLElement[];
    for (const child of children) {
      inlineStylesRecursively(child);
    }
  };

  // Inline computed styles recursively
  inlineStylesRecursively(target);

  try {
    await action();
  } finally {
    // Restore original inline styles
    for (const [el, originalStyleVal] of originalStyles.entries()) {
      if (originalStyleVal) {
        el.setAttribute("style", originalStyleVal);
      } else {
        el.removeAttribute("style");
      }
    }
  }
}
