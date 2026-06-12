import { useState } from "react";
import type React from "react";

// ───────────────────────────── Types ────────────────────────────────
export type GalleryMode = "exam" | "hhw" | "timetable" | "resume-job" | "resume-wedding";

interface TemplateOption {
  id: string;
  label: string;
  description: string;
  emoji: string;
  preview: React.FC<{ accent: string }>;
}

// ───────────────────── Mini Preview Components ───────────────────────

/** A tiny exam paper thumbnail */
const ExamPreviewStandard: React.FC<{ accent: string }> = ({ accent }) => (
  <svg viewBox="0 0 120 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="160" fill="white" />
    <rect x="4" y="4" width="112" height="152" fill="none" stroke={accent} strokeWidth="1.5" />
    {/* Header */}
    <rect x="4" y="4" width="112" height="34" fill={accent} opacity="0.08" />
    <circle cx="20" cy="21" r="8" fill="none" stroke={accent} strokeWidth="1" />
    <rect x="35" y="12" width="50" height="4" rx="1" fill={accent} opacity="0.7" />
    <rect x="40" y="19" width="40" height="2.5" rx="1" fill={accent} opacity="0.4" />
    <rect x="42" y="25" width="36" height="2" rx="1" fill={accent} opacity="0.3" />
    {/* Meta row */}
    <rect x="4" y="38" width="112" height="1" fill={accent} opacity="0.3" />
    <rect x="8" y="41" width="22" height="2" rx="1" fill="#666" opacity="0.5" />
    <rect x="40" y="41" width="22" height="2" rx="1" fill="#666" opacity="0.5" />
    <rect x="80" y="41" width="30" height="2" rx="1" fill="#666" opacity="0.5" />
    {/* Section A */}
    <rect x="8" y="48" width="50" height="3" rx="1" fill={accent} opacity="0.8" />
    <rect x="8" y="48" width="112" height="0.5" fill={accent} opacity="0.2" />
    {/* Questions */}
    <rect x="8" y="56" width="100" height="2" rx="1" fill="#333" opacity="0.4" />
    <rect x="8" y="61" width="90" height="2" rx="1" fill="#333" opacity="0.3" />
    <rect x="8" y="66" width="95" height="2" rx="1" fill="#333" opacity="0.3" />
    <rect x="8" y="74" width="100" height="2" rx="1" fill="#333" opacity="0.4" />
    <rect x="8" y="79" width="85" height="2" rx="1" fill="#333" opacity="0.3" />
    {/* Section B */}
    <rect x="8" y="87" width="55" height="3" rx="1" fill={accent} opacity="0.8" />
    <rect x="8" y="94" width="100" height="2" rx="1" fill="#333" opacity="0.4" />
    <rect x="8" y="99" width="80" height="2" rx="1" fill="#333" opacity="0.3" />
    <rect x="8" y="104" width="95" height="2" rx="1" fill="#333" opacity="0.3" />
    {/* Footer */}
    <rect x="8" y="148" width="45" height="1.5" rx="1" fill="#666" opacity="0.4" />
    <rect x="70" y="148" width="42" height="1.5" rx="1" fill="#666" opacity="0.4" />
  </svg>
);

const HHWPreviewStandard: React.FC<{ accent: string }> = ({ accent }) => (
  <svg viewBox="0 0 120 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="160" fill="white" />
    {/* Cover */}
    <rect x="4" y="4" width="112" height="72" fill={accent} opacity="0.06" />
    <rect x="4" y="76" width="112" height="1.5" fill={accent} opacity="0.5" />
    <circle cx="60" cy="22" r="9" fill="none" stroke={accent} strokeWidth="1.2" />
    <rect x="30" y="35" width="60" height="5" rx="1.5" fill={accent} opacity="0.75" />
    <rect x="38" y="43" width="44" height="3" rx="1" fill={accent} opacity="0.45" />
    <rect x="42" y="50" width="36" height="2.5" rx="1" fill="#555" opacity="0.35" />
    <rect x="36" y="56" width="48" height="3" rx="1" fill={accent} opacity="0.3" />
    <rect x="46" y="62" width="28" height="2" rx="1" fill="#666" opacity="0.3" />
    {/* Subjects */}
    <rect x="8" y="82" width="104" height="6" rx="1.5" fill={accent} opacity="0.75" />
    <rect x="8" y="91" width="100" height="2" rx="1" fill="#333" opacity="0.35" />
    <rect x="8" y="96" width="85" height="2" rx="1" fill="#333" opacity="0.3" />
    <rect x="8" y="101" width="90" height="2" rx="1" fill="#333" opacity="0.3" />
    <rect x="8" y="108" width="104" height="6" rx="1.5" fill={accent} opacity="0.75" />
    <rect x="8" y="117" width="100" height="2" rx="1" fill="#333" opacity="0.35" />
    <rect x="8" y="122" width="80" height="2" rx="1" fill="#333" opacity="0.3" />
    <rect x="8" y="130" width="104" height="6" rx="1.5" fill={accent} opacity="0.75" />
    <rect x="8" y="139" width="90" height="2" rx="1" fill="#333" opacity="0.35" />
    <rect x="8" y="144" width="75" height="2" rx="1" fill="#333" opacity="0.3" />
  </svg>
);

const HHWPreviewClassic: React.FC<{ accent: string }> = ({ accent }) => (
  <svg viewBox="0 0 120 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="160" fill="white" />
    <rect x="3" y="3" width="114" height="154" fill="none" stroke={accent} strokeWidth="2" />
    <rect
      x="6"
      y="6"
      width="108"
      height="148"
      fill="none"
      stroke={accent}
      strokeWidth="0.5"
      strokeDasharray="2 2"
    />
    <circle cx="60" cy="24" r="9" fill="none" stroke={accent} strokeWidth="1.2" />
    <rect x="30" y="36" width="60" height="5" rx="1.5" fill={accent} opacity="0.8" />
    <rect x="38" y="44" width="44" height="3" rx="1" fill="#555" opacity="0.45" />
    <rect x="42" y="50" width="36" height="2.5" rx="1" fill="#555" opacity="0.35" />
    <rect x="6" y="58" width="108" height="1" fill={accent} opacity="0.4" />
    {/* Classic subject headers: left-bordered */}
    <rect x="8" y="63" width="3" height="10" fill={accent} />
    <rect x="14" y="65" width="55" height="4" rx="1" fill={accent} opacity="0.7" />
    <rect x="8" y="76" width="100" height="2" rx="1" fill="#333" opacity="0.35" />
    <rect x="8" y="81" width="85" height="2" rx="1" fill="#333" opacity="0.3" />
    <rect x="8" y="90" width="3" height="10" fill={accent} />
    <rect x="14" y="92" width="55" height="4" rx="1" fill={accent} opacity="0.7" />
    <rect x="8" y="103" width="100" height="2" rx="1" fill="#333" opacity="0.35" />
    <rect x="8" y="108" width="80" height="2" rx="1" fill="#333" opacity="0.3" />
    <rect x="8" y="117" width="3" height="10" fill={accent} />
    <rect x="14" y="119" width="55" height="4" rx="1" fill={accent} opacity="0.7" />
    <rect x="8" y="130" width="100" height="2" rx="1" fill="#333" opacity="0.35" />
    <rect x="8" y="135" width="75" height="2" rx="1" fill="#333" opacity="0.3" />
  </svg>
);

const HHWPreviewVVIP: React.FC<{ accent: string }> = ({ accent: _accent }) => {
  const gold = "#C9A227";
  const darkGold = "#8A6D1A";
  return (
    <svg viewBox="0 0 120 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="160" fill="white" />
      <rect x="2" y="2" width="116" height="156" fill="none" stroke={gold} strokeWidth="2" />
      <rect x="5" y="5" width="110" height="150" fill="none" stroke={gold} strokeWidth="0.5" />
      <circle cx="60" cy="22" r="9" fill="none" stroke={gold} strokeWidth="1.5" />
      {/* Golden school name */}
      <rect x="28" y="34" width="64" height="5" rx="1.5" fill={darkGold} opacity="0.85" />
      <rect x="38" y="43" width="44" height="3" rx="1" fill="#555" opacity="0.35" />
      <rect x="40" y="49" width="40" height="2.5" rx="1" fill={darkGold} opacity="0.35" />
      {/* Seal */}
      <circle cx="60" cy="62" r="8" fill="none" stroke={gold} strokeWidth="1" />
      <rect x="55" y="60" width="10" height="2" rx="0.5" fill={gold} opacity="0.5" />
      <rect x="55" y="63" width="10" height="1.5" rx="0.5" fill={gold} opacity="0.5" />
      {/* Gold subject headers */}
      <rect x="8" y="75" width="104" height="6" rx="1.5">
        <animate
          attributeName="fill"
          values={`${gold};${darkGold};${gold}`}
          dur="2s"
          repeatCount="indefinite"
        />
      </rect>
      <rect x="8" y="75" width="104" height="6" rx="1.5" fill={`url(#goldGrad)`} />
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={darkGold} />
          <stop offset="50%" stopColor={gold} />
          <stop offset="100%" stopColor={darkGold} />
        </linearGradient>
      </defs>
      <rect x="8" y="84" width="100" height="2" rx="1" fill="#333" opacity="0.35" />
      <rect x="8" y="89" width="80" height="2" rx="1" fill="#333" opacity="0.3" />
      <rect x="8" y="96" width="104" height="6" rx="1.5" fill={`url(#goldGrad)`} />
      <rect x="8" y="105" width="90" height="2" rx="1" fill="#333" opacity="0.35" />
      <rect x="8" y="110" width="70" height="2" rx="1" fill="#333" opacity="0.3" />
      <rect x="8" y="117" width="104" height="6" rx="1.5" fill={`url(#goldGrad)`} />
      <rect x="8" y="126" width="90" height="2" rx="1" fill="#333" opacity="0.35" />
      <rect x="8" y="131" width="75" height="2" rx="1" fill="#333" opacity="0.3" />
    </svg>
  );
};

const TimetablePreviewModern: React.FC<{ accent: string }> = ({ accent }) => (
  <svg viewBox="0 0 160 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect width="160" height="120" fill="white" />
    {/* Header */}
    <rect x="0" y="0" width="160" height="22" fill={accent} opacity="0.1" />
    <rect x="8" y="5" width="40" height="4" rx="1" fill={accent} opacity="0.8" />
    <rect x="8" y="12" width="60" height="2.5" rx="1" fill="#666" opacity="0.4" />
    <rect x="0" y="22" width="160" height="2" fill={accent} opacity="0.6" />
    {/* Grid header */}
    <rect x="0" y="24" width="160" height="10" fill={accent} />
    {[28, 50, 72, 94, 116, 138].map((x, i) => (
      <rect key={i} x={x} y="27" width={16} height="4" rx="1" fill="white" opacity="0.85" />
    ))}
    <rect x="5" y="27" width="18" height="4" rx="1" fill="white" opacity="0.6" />
    {/* Rows */}
    {[34, 46, 58, 70, 82, 94].map((y, ri) => (
      <g key={ri}>
        <rect x="0" y={y} width="160" height="12" fill={ri % 2 === 0 ? "#f8f9fb" : "white"} />
        <rect x="5" y={y + 3} width="18" height="3" rx="1" fill={accent} opacity="0.5" />
        {[28, 50, 72, 94, 116, 138].map((x, ci) => (
          <rect key={ci} x={x} y={y + 3} width={16} height="3" rx="0.5" fill="#ccc" opacity="0.6" />
        ))}
      </g>
    ))}
    <rect x="0" y="106" width="160" height="14" fill={accent} opacity="0.06" />
    <rect x="8" y="110" width="60" height="2" rx="1" fill="#666" opacity="0.3" />
  </svg>
);

const TimetablePreviewVVIP: React.FC<{ accent: string }> = ({ accent: _ }) => {
  const gold = "#C9A227";
  const darkGold = "#8A6D1A";
  return (
    <svg viewBox="0 0 160 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="120" fill="white" />
      <rect x="1" y="1" width="158" height="118" fill="none" stroke={gold} strokeWidth="2" />
      <rect x="4" y="4" width="152" height="112" fill="none" stroke={gold} strokeWidth="0.5" />
      <rect x="8" y="6" width="40" height="4" rx="1" fill={darkGold} opacity="0.8" />
      <rect x="8" y="13" width="55" height="2.5" rx="1" fill={gold} opacity="0.5" />
      <rect x="0" y="22" width="160" height="2" fill={gold} opacity="0.6" />
      <defs>
        <linearGradient id="ttGold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={darkGold} />
          <stop offset="50%" stopColor={gold} />
          <stop offset="100%" stopColor={darkGold} />
        </linearGradient>
      </defs>
      <rect x="0" y="24" width="160" height="10" fill="url(#ttGold)" />
      {[28, 50, 72, 94, 116, 138].map((x, i) => (
        <rect key={i} x={x} y="27" width={16} height="4" rx="1" fill="white" opacity="0.85" />
      ))}
      <rect x="5" y="27" width="18" height="4" rx="1" fill="white" opacity="0.6" />
      {[34, 46, 58, 70, 82, 94].map((y, ri) => (
        <g key={ri}>
          <rect x="0" y={y} width="160" height="12" fill={ri % 2 === 0 ? "#fdf8e7" : "white"} />
          <rect x="5" y={y + 3} width="18" height="3" rx="1" fill={darkGold} opacity="0.6" />
          {[28, 50, 72, 94, 116, 138].map((x, ci) => (
            <rect
              key={ci}
              x={x}
              y={y + 3}
              width={16}
              height="3"
              rx="0.5"
              fill={gold}
              opacity="0.2"
            />
          ))}
        </g>
      ))}
    </svg>
  );
};

const ResumePreviewModern: React.FC<{ accent: string }> = ({ accent }) => (
  <svg viewBox="0 0 120 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="160" fill="white" />
    {/* Left accent bar */}
    <rect x="0" y="0" width="28" height="160" fill={accent} opacity="0.12" />
    {/* Photo/avatar */}
    <circle cx="14" cy="20" r="10" fill={accent} opacity="0.3" />
    <circle cx="14" cy="17" r="5" fill={accent} opacity="0.4" />
    {/* Left side labels */}
    <rect x="4" y="36" width="20" height="2" rx="0.5" fill={accent} opacity="0.6" />
    <rect x="4" y="40" width="18" height="1.5" rx="0.5" fill="#888" opacity="0.4" />
    <rect x="4" y="44" width="18" height="1.5" rx="0.5" fill="#888" opacity="0.4" />
    <rect x="4" y="50" width="20" height="2" rx="0.5" fill={accent} opacity="0.6" />
    {[55, 59, 63].map((y, i) => (
      <rect key={i} x="4" y={y} width="18" height="1.5" rx="0.5" fill="#888" opacity="0.35" />
    ))}
    <rect x="4" y="70" width="20" height="2" rx="0.5" fill={accent} opacity="0.6" />
    {[75, 79].map((y, i) => (
      <rect key={i} x="4" y={y} width="18" height="1.5" rx="0.5" fill="#888" opacity="0.35" />
    ))}
    {/* Right content */}
    <rect x="34" y="8" width="80" height="7" rx="1.5" fill={accent} opacity="0.8" />
    <rect x="34" y="18" width="60" height="3.5" rx="1" fill={accent} opacity="0.45" />
    <rect x="34" y="24" width="50" height="2" rx="0.5" fill="#888" opacity="0.4" />
    <rect x="34" y="30" width="80" height="0.5" fill={accent} opacity="0.3" />
    {/* Section heading */}
    <rect x="34" y="35" width="40" height="2.5" rx="0.5" fill={accent} opacity="0.75" />
    <rect x="34" y="35" width="82" height="0.5" fill={accent} opacity="0.2" />
    {[40, 44, 48].map((y, i) => (
      <rect
        key={i}
        x="34"
        y={y}
        width={75 - i * 8}
        height="1.5"
        rx="0.5"
        fill="#555"
        opacity="0.35"
      />
    ))}
    <rect x="34" y="55" width="45" height="2.5" rx="0.5" fill={accent} opacity="0.75" />
    {[60, 64, 68].map((y, i) => (
      <rect
        key={i}
        x="34"
        y={y}
        width={72 - i * 5}
        height="1.5"
        rx="0.5"
        fill="#555"
        opacity="0.35"
      />
    ))}
    <rect x="34" y="75" width="50" height="2.5" rx="0.5" fill={accent} opacity="0.75" />
    {[80, 84].map((y, i) => (
      <rect
        key={i}
        x="34"
        y={y}
        width={70 - i * 10}
        height="1.5"
        rx="0.5"
        fill="#555"
        opacity="0.35"
      />
    ))}
    {/* Skills chips */}
    {[34, 56, 78, 98].map((x, i) => (
      <rect key={i} x={x} y="92" width="16" height="5" rx="2.5" fill={accent} opacity="0.2" />
    ))}
  </svg>
);

const ResumePreviewClassic: React.FC<{ accent: string }> = ({ accent }) => (
  <svg viewBox="0 0 120 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="160" fill="white" />
    {/* Centered header */}
    <rect x="15" y="8" width="90" height="7" rx="1" fill={accent} opacity="0.85" />
    <rect x="25" y="18" width="70" height="3" rx="1" fill="#666" opacity="0.5" />
    <rect x="8" y="24" width="104" height="0.5" fill={accent} opacity="0.5" />
    <rect x="30" y="27" width="60" height="2" rx="0.5" fill="#888" opacity="0.4" />
    <rect x="8" y="32" width="104" height="0.5" fill={accent} opacity="0.5" />
    {/* Sections with simple header-line style */}
    <rect x="8" y="36" width="50" height="3" rx="0.5" fill={accent} opacity="0.8" />
    <rect x="8" y="40" width="104" height="0.5" fill={accent} opacity="0.25" />
    {[44, 48, 52, 56].map((y, i) => (
      <rect
        key={i}
        x="8"
        y={y}
        width={100 - i * 8}
        height="1.5"
        rx="0.5"
        fill="#555"
        opacity="0.35"
      />
    ))}
    <rect x="8" y="62" width="55" height="3" rx="0.5" fill={accent} opacity="0.8" />
    <rect x="8" y="66" width="104" height="0.5" fill={accent} opacity="0.25" />
    {[70, 74, 78, 82].map((y, i) => (
      <rect
        key={i}
        x="8"
        y={y}
        width={95 - i * 10}
        height="1.5"
        rx="0.5"
        fill="#555"
        opacity="0.35"
      />
    ))}
    <rect x="8" y="88" width="50" height="3" rx="0.5" fill={accent} opacity="0.8" />
    <rect x="8" y="92" width="104" height="0.5" fill={accent} opacity="0.25" />
    {[96, 100, 104].map((y, i) => (
      <rect
        key={i}
        x="8"
        y={y}
        width={90 - i * 10}
        height="1.5"
        rx="0.5"
        fill="#555"
        opacity="0.35"
      />
    ))}
  </svg>
);

const ResumePreviewMinimal: React.FC<{ accent: string }> = ({ accent }) => (
  <svg viewBox="0 0 120 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="160" fill="#fafafa" />
    {/* Ultra-clean header */}
    <rect x="12" y="12" width="90" height="6" rx="1" fill="#111" opacity="0.85" />
    <rect x="12" y="21" width="60" height="2.5" rx="0.5" fill="#888" opacity="0.5" />
    <rect x="12" y="26" width="45" height="2" rx="0.5" fill="#999" opacity="0.4" />
    {/* Thin accent line */}
    <rect x="12" y="32" width={40} height="1.5" rx="0.5" fill={accent} />
    {/* Simple sections */}
    <rect x="12" y="40" width="45" height="2.5" rx="0.5" fill="#111" opacity="0.75" />
    {[46, 50, 54, 58].map((y, i) => (
      <rect
        key={i}
        x="12"
        y={y}
        width={100 - i * 6}
        height="1.5"
        rx="0.5"
        fill="#777"
        opacity={0.3 + i * 0.02}
      />
    ))}
    <rect x="12" y="66" width="50" height="2.5" rx="0.5" fill="#111" opacity="0.75" />
    {[72, 76, 80, 84].map((y, i) => (
      <rect
        key={i}
        x="12"
        y={y}
        width={95 - i * 6}
        height="1.5"
        rx="0.5"
        fill="#777"
        opacity={0.3}
      />
    ))}
    <rect x="12" y="92" width="40" height="2.5" rx="0.5" fill="#111" opacity="0.75" />
    {[98, 102, 106].map((y, i) => (
      <rect
        key={i}
        x="12"
        y={y}
        width={90 - i * 8}
        height="1.5"
        rx="0.5"
        fill="#777"
        opacity={0.3}
      />
    ))}
    {/* Skills dots */}
    {[12, 26, 40, 54, 68, 82].map((x, i) => (
      <circle key={i} cx={x + 5} cy="120" r="4" fill={accent} opacity="0.2" />
    ))}
  </svg>
);

const BiodataPreviewTraditional: React.FC<{ accent: string }> = ({ accent: _ }) => {
  const saffron = "#C2410C";
  const maroon = "#7F1D1D";
  return (
    <svg viewBox="0 0 120 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="160" fill="white" />
      <rect x="2" y="2" width="116" height="156" fill="none" stroke={saffron} strokeWidth="2" />
      <rect
        x="5"
        y="5"
        width="110"
        height="150"
        fill="none"
        stroke={saffron}
        strokeWidth="0.5"
        strokeDasharray="4 2"
      />
      {/* Blessing symbol */}
      <text
        x="60"
        y="20"
        fontSize="12"
        textAnchor="middle"
        fill={maroon}
        fontFamily="serif"
        opacity="0.8"
      >
        ॥ श्री ॥
      </text>
      <rect x="20" y="24" width="80" height="5" rx="1.5" fill={saffron} opacity="0.75" />
      {/* Name and photo */}
      <circle
        cx="60"
        cy="44"
        r="10"
        fill={saffron}
        opacity="0.12"
        stroke={saffron}
        strokeWidth="0.8"
      />
      <rect x="30" y="58" width="60" height="4" rx="1" fill={maroon} opacity="0.7" />
      <rect x="35" y="65" width="50" height="2.5" rx="1" fill="#777" opacity="0.4" />
      {/* Section dividers */}
      <rect x="8" y="72" width="104" height="5" rx="1" fill={saffron} opacity="0.8" />
      {[80, 84, 88, 92].map((y, i) => (
        <g key={i}>
          <rect x="8" y={y} width="35" height="1.5" rx="0.5" fill={maroon} opacity="0.5" />
          <rect x="48" y={y} width="60" height="1.5" rx="0.5" fill="#555" opacity="0.35" />
        </g>
      ))}
      <rect x="8" y="98" width="104" height="5" rx="1" fill={saffron} opacity="0.8" />
      {[106, 110, 114].map((y, i) => (
        <g key={i}>
          <rect x="8" y={y} width="35" height="1.5" rx="0.5" fill={maroon} opacity="0.5" />
          <rect x="48" y={y} width="60" height="1.5" rx="0.5" fill="#555" opacity="0.35" />
        </g>
      ))}
      <rect x="8" y="120" width="104" height="5" rx="1" fill={saffron} opacity="0.8" />
      {[128, 132].map((y, i) => (
        <g key={i}>
          <rect x="8" y={y} width="35" height="1.5" rx="0.5" fill={maroon} opacity="0.5" />
          <rect x="48" y={y} width="60" height="1.5" rx="0.5" fill="#555" opacity="0.35" />
        </g>
      ))}
    </svg>
  );
};

const BiodataPreviewRoyal: React.FC<{ accent: string }> = ({ accent: _ }) => {
  const gold = "#C9A227";
  const darkGold = "#8A6D1A";
  return (
    <svg viewBox="0 0 120 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="160" fill="#fffdf5" />
      <defs>
        <linearGradient id="rGold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={darkGold} />
          <stop offset="50%" stopColor={gold} />
          <stop offset="100%" stopColor={darkGold} />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="116" height="156" fill="none" stroke={gold} strokeWidth="2.5" />
      <rect x="5" y="5" width="110" height="150" fill="none" stroke={gold} strokeWidth="0.5" />
      {/* Crown/symbol */}
      <text x="60" y="18" fontSize="14" textAnchor="middle" fill={gold} opacity="0.9">
        ⚜
      </text>
      <rect x="25" y="22" width="70" height="5" rx="1.5" fill="url(#rGold)" />
      <text x="60" y="36" fontSize="8" textAnchor="middle" fill={darkGold} opacity="0.7">
        BIODATA
      </text>
      <circle cx="60" cy="50" r="10" fill={gold} opacity="0.1" stroke={gold} strokeWidth="1" />
      <rect x="30" y="64" width="60" height="4" rx="1" fill={darkGold} opacity="0.75" />
      <rect x="35" y="71" width="50" height="2.5" rx="1" fill="#888" opacity="0.4" />
      {[80, 84, 88, 92].map((y, i) => (
        <g key={i}>
          <rect x="8" y={y} width="38" height="1.5" rx="0.5" fill={darkGold} opacity="0.55" />
          <rect x="52" y={y} width="58" height="1.5" rx="0.5" fill="#555" opacity="0.35" />
        </g>
      ))}
      <rect x="8" y="78" width="104" height="5" rx="1" fill="url(#rGold)" opacity="0.9" />
      {[106, 110, 114].map((y, i) => (
        <g key={i}>
          <rect x="8" y={y} width="38" height="1.5" rx="0.5" fill={darkGold} opacity="0.55" />
          <rect x="52" y={y} width="58" height="1.5" rx="0.5" fill="#555" opacity="0.35" />
        </g>
      ))}
      <rect x="8" y="102" width="104" height="5" rx="1" fill="url(#rGold)" opacity="0.9" />
      {[130, 134].map((y, i) => (
        <g key={i}>
          <rect x="8" y={y} width="38" height="1.5" rx="0.5" fill={darkGold} opacity="0.55" />
          <rect x="52" y={y} width="58" height="1.5" rx="0.5" fill="#555" opacity="0.35" />
        </g>
      ))}
      <rect x="8" y="126" width="104" height="5" rx="1" fill="url(#rGold)" opacity="0.9" />
    </svg>
  );
};

const BiodataPreviewFloral: React.FC<{ accent: string }> = ({ accent: _ }) => {
  const rose = "#BE185D";
  const blush = "#FADADD";
  return (
    <svg viewBox="0 0 120 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="160" fill="white" />
      {/* Soft floral border */}
      <rect x="2" y="2" width="116" height="156" fill="none" stroke={rose} strokeWidth="1.5" />
      {/* Corner flowers */}
      {[
        [4, 4],
        [116, 4],
        [4, 156],
        [116, 156],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="5" fill={blush} stroke={rose} strokeWidth="0.8" />
          <circle cx={cx} cy={cy} r="2" fill={rose} opacity="0.6" />
        </g>
      ))}
      {/* Header */}
      <rect x="20" y="18" width="80" height="5" rx="1.5" fill={rose} opacity="0.75" />
      <text x="60" y="32" fontSize="8" textAnchor="middle" fill={rose} opacity="0.6">
        🌸 BIODATA 🌸
      </text>
      <circle cx="60" cy="46" r="10" fill={blush} stroke={rose} strokeWidth="0.8" />
      <rect x="30" y="60" width="60" height="4" rx="1" fill={rose} opacity="0.7" />
      <rect x="35" y="67" width="50" height="2.5" rx="1" fill="#888" opacity="0.4" />
      {[76, 80, 84, 88].map((y, i) => (
        <g key={i}>
          <rect x="8" y={y} width="38" height="1.5" rx="0.5" fill={rose} opacity="0.5" />
          <rect x="52" y={y} width="58" height="1.5" rx="0.5" fill="#555" opacity="0.35" />
        </g>
      ))}
      <rect x="8" y="72" width="104" height="5" rx="1" fill={rose} opacity="0.75" />
      {[104, 108, 112].map((y, i) => (
        <g key={i}>
          <rect x="8" y={y} width="38" height="1.5" rx="0.5" fill={rose} opacity="0.5" />
          <rect x="52" y={y} width="58" height="1.5" rx="0.5" fill="#555" opacity="0.35" />
        </g>
      ))}
      <rect x="8" y="100" width="104" height="5" rx="1" fill={rose} opacity="0.75" />
    </svg>
  );
};

// ─────────────────────── Shared Custom Preview ──────────────────────

const CustomPreviewCard: React.FC<{ accent: string }> = ({ accent }) => (
  <svg viewBox="0 0 120 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="160" fill="#fafafa" />
    {/* Grid of color swatches */}
    {[
      [8, 8, "#1E2761"],
      [28, 8, "#C9A227"],
      [48, 8, "#BE185D"],
      [68, 8, "#166534"],
      [88, 8, "#6d28d9"],
      [108, 8, "#0369a1"],
    ].map(([x, y, c], i) => (
      <circle key={i} cx={Number(x) + 6} cy={Number(y) + 6} r={6} fill={String(c)} />
    ))}
    {/* Paint palette outline */}
    <ellipse cx="60" cy="75" rx="40" ry="35" fill="white" stroke={accent} strokeWidth="1.5" />
    <circle cx="40" cy="62" r="6" fill={accent} opacity="0.25" />
    <circle cx="56" cy="56" r="5" fill="#BE185D" opacity="0.35" />
    <circle cx="72" cy="56" r="5" fill="#C9A227" opacity="0.45" />
    <circle cx="84" cy="66" r="6" fill="#166534" opacity="0.35" />
    <circle cx="78" cy="82" r="6" fill="#6d28d9" opacity="0.3" />
    <circle cx="60" cy="88" r="5" fill="#0369a1" opacity="0.3" />
    {/* Brush */}
    <rect
      x="90"
      y="50"
      width="4"
      height="28"
      rx="2"
      fill={accent}
      opacity="0.8"
      transform="rotate(-35 90 50)"
    />
    <rect
      x="86"
      y="72"
      width="6"
      height="10"
      rx="1"
      fill={accent}
      opacity="0.5"
      transform="rotate(-35 86 72)"
    />
    {/* Label at bottom */}
    <rect x="20" y="122" width="80" height="8" rx="4" fill={accent} opacity="0.15" />
    <rect x="32" y="124" width="56" height="4" rx="2" fill={accent} opacity="0.5" />
    <rect x="20" y="135" width="80" height="4" rx="2" fill="#ddd" />
    <rect x="20" y="142" width="60" height="4" rx="2" fill="#eee" />
    <rect x="20" y="149" width="70" height="4" rx="2" fill="#eee" />
  </svg>
);

const ExamPreviewBoard: React.FC<{ accent: string }> = ({ accent }) => (
  <svg viewBox="0 0 120 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="160" fill="white" />
    <rect x="4" y="4" width="112" height="152" fill="none" stroke="#000000" strokeWidth="1.5" />
    {/* Boxed Header */}
    <rect x="8" y="8" width="104" height="28" fill="none" stroke="#000000" strokeWidth="1.2" />
    {/* Inside lines */}
    <line x1="8" y1="26" x2="112" y2="26" stroke="#000000" strokeWidth="0.8" />
    {/* Vertical dividers */}
    <line x1="32" y1="26" x2="32" y2="36" stroke="#000000" strokeWidth="0.8" />
    <line x1="58" y1="26" x2="58" y2="36" stroke="#000000" strokeWidth="0.8" />
    <line x1="86" y1="26" x2="86" y2="36" stroke="#000000" strokeWidth="0.8" />
    {/* Titles */}
    <rect x="25" y="12" width="70" height="3" rx="0.5" fill="#000" />
    <rect x="35" y="18" width="50" height="2" rx="0.5" fill="#666" />
    {/* Name Row */}
    <rect x="8" y="40" width="30" height="1.5" rx="0.5" fill="#888" />
    <rect x="45" y="40" width="30" height="1.5" rx="0.5" fill="#888" />
    <rect x="82" y="40" width="30" height="1.5" rx="0.5" fill="#888" />
    {/* Table columns for Board style */}
    <line x1="8" y1="46" x2="112" y2="46" stroke="#000000" strokeWidth="0.8" />
    <line x1="20" y1="46" x2="20" y2="140" stroke="#000000" strokeWidth="0.8" />
    <line x1="100" y1="46" x2="100" y2="140" stroke="#000000" strokeWidth="0.8" />
    <line x1="8" y1="140" x2="112" y2="140" stroke="#000000" strokeWidth="0.8" />
    {/* Q rows */}
    {[58, 70, 82, 94, 106, 118, 130].map((y) => (
      <line key={y} x1="8" y1={y} x2="112" y2={y} stroke="#ccc" strokeWidth="0.5" />
    ))}
    {/* Q numbers */}
    {[51, 63, 75, 87, 99, 111, 123, 135].map((y, i) => (
      <rect key={y} x="11" y={y} width="6" height="2" fill="#000" opacity="0.6" />
    ))}
    {/* Content lines */}
    {[51, 63, 75, 87, 99, 111, 123, 135].map((y, i) => (
      <rect key={y} x="24" y={y} width="70" height="2" fill="#666" opacity="0.4" />
    ))}
    {/* Marks */}
    {[51, 63, 75, 87, 99, 111, 123, 135].map((y, i) => (
      <rect key={y} x="104" y={y} width="4" height="2" fill="#000" opacity="0.6" />
    ))}
  </svg>
);

// ─────────────────────── Template Config ────────────────────────────

const EXAM_TEMPLATES: TemplateOption[] = [
  {
    id: "standard",
    label: "Standard",
    description: "Clean bordered layout with accent headings. Classic school format.",
    emoji: "📝",
    preview: ExamPreviewStandard,
  },
  {
    id: "board",
    label: "CBSE Board Grid",
    description: "Tabular boxed header with Name/Roll No row and structured question-marks grid.",
    emoji: "🏫",
    preview: ExamPreviewBoard,
  },
  {
    id: "custom",
    label: "Custom ✎",
    description: "Design your own: pick colors, fonts, borders, and layout.",
    emoji: "🎨",
    preview: CustomPreviewCard,
  },
];

const HHW_TEMPLATES: TemplateOption[] = [
  {
    id: "standard",
    label: "Standard",
    description: "Modern layout with colored subject bars and clean typography.",
    emoji: "📚",
    preview: HHWPreviewStandard,
  },
  {
    id: "classic",
    label: "Classic",
    description: "Bordered formal layout with left-accent subject headers.",
    emoji: "🏛️",
    preview: HHWPreviewClassic,
  },
  {
    id: "vvip",
    label: "VVIP ✦",
    description: "Premium gold-accented design with ornate cover and seal.",
    emoji: "👑",
    preview: HHWPreviewVVIP,
  },
  {
    id: "custom",
    label: "Custom ✎",
    description: "Design your own: colors, fonts, borders, and layout style.",
    emoji: "🎨",
    preview: CustomPreviewCard,
  },
];

const TIMETABLE_TEMPLATES: TemplateOption[] = [
  {
    id: "modern",
    label: "Modern",
    description: "Clean grid with colored header row and light alternating rows.",
    emoji: "🗓️",
    preview: TimetablePreviewModern,
  },
  {
    id: "classic",
    label: "Classic",
    description: "Formal bordered table with serif font and monochrome header.",
    emoji: "📋",
    preview: ({ accent }) => (
      <svg viewBox="0 0 160 120" className="w-full h-full">
        <rect width="160" height="120" fill="white" />
        <rect x="1" y="1" width="158" height="118" fill="none" stroke={accent} strokeWidth="2.5" />
        <rect x="8" y="6" width="40" height="4" rx="1" fill={accent} opacity="0.8" />
        <rect x="8" y="13" width="55" height="2" rx="1" fill="#666" opacity="0.4" />
        <rect x="0" y="22" width="160" height="1.5" fill={accent} opacity="0.5" />
        {/* Classic grid - white header cells with border */}
        <rect x="0" y="24" width="160" height="10" fill="white" />
        {[28, 50, 72, 94, 116, 138].map((x, i) => (
          <rect
            key={i}
            x={x}
            y="26"
            width={16}
            height="6"
            rx="0"
            fill="none"
            stroke={accent}
            strokeWidth="0.5"
          />
        ))}
        <rect
          x="5"
          y="26"
          width="18"
          height="6"
          rx="0"
          fill="none"
          stroke={accent}
          strokeWidth="0.5"
        />
        {[34, 46, 58, 70, 82, 94].map((y, ri) => (
          <g key={ri}>
            <rect
              x="0"
              y={y}
              width="160"
              height="12"
              fill="white"
              stroke={accent}
              strokeWidth="0.3"
            />
            {[5, 28, 50, 72, 94, 116, 138].map((x, ci) => (
              <rect
                key={ci}
                x={x}
                y={y}
                width={ci === 0 ? 18 : 16}
                height="12"
                fill="none"
                stroke="#333"
                strokeWidth="0.5"
              />
            ))}
            <rect x="5" y={y + 4} width="16" height="3" rx="0.5" fill={accent} opacity="0.5" />
            {[28, 50, 72, 94, 116, 138].map((x, ci) => (
              <rect
                key={ci}
                x={x}
                y={y + 4}
                width={13}
                height="3"
                rx="0.5"
                fill="#ccc"
                opacity="0.6"
              />
            ))}
          </g>
        ))}
      </svg>
    ),
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "Airy borderless design with subtle dividers and light typography.",
    emoji: "✨",
    preview: ({ accent }) => (
      <svg viewBox="0 0 160 120" className="w-full h-full">
        <rect width="160" height="120" fill="#fafafa" />
        <rect x="8" y="6" width="35" height="4" rx="1" fill="#111" opacity="0.85" />
        <rect x="8" y="13" width="50" height="2" rx="1" fill="#999" opacity="0.5" />
        <rect x="0" y="22" width="160" height="2" fill={accent} opacity="0.8" />
        {/* Minimal - no background header, just text */}
        {[28, 50, 72, 94, 116, 138].map((x, i) => (
          <rect key={i} x={x} y="27" width={16} height="3" rx="0.5" fill={accent} opacity="0.5" />
        ))}
        <rect x="5" y="27" width="18" height="3" rx="0.5" fill="#ccc" opacity="0.6" />
        <rect x="0" y="32" width="160" height="0.5" fill="#eee" />
        {[34, 46, 58, 70, 82, 94].map((y, ri) => (
          <g key={ri}>
            <rect x="0" y={y} width="160" height="0.5" fill="#eee" />
            <rect x="5" y={y + 4} width="16" height="2" rx="0.5" fill={accent} opacity="0.5" />
            {[28, 50, 72, 94, 116, 138].map((x, ci) => (
              <rect
                key={ci}
                x={x}
                y={y + 4}
                width={13}
                height="2"
                rx="0.5"
                fill="#ccc"
                opacity="0.5"
              />
            ))}
          </g>
        ))}
      </svg>
    ),
  },
  {
    id: "vibrant",
    label: "Vibrant",
    description: "Bold gradient header with colorful accents for a lively look.",
    emoji: "🎨",
    preview: ({ accent }) => (
      <svg viewBox="0 0 160 120" className="w-full h-full">
        <rect width="160" height="120" fill="white" />
        <defs>
          <linearGradient id="vbGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={accent} />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="160" height="22" fill="url(#vbGrad)" opacity="0.15" />
        <rect x="8" y="5" width="40" height="4" rx="1" fill="url(#vbGrad)" opacity="0.85" />
        <rect x="8" y="12" width="60" height="2" rx="1" fill="#666" opacity="0.4" />
        <rect x="0" y="22" width="160" height="1" fill={accent} opacity="0.4" />
        <rect x="0" y="24" width="160" height="10" fill="url(#vbGrad)" />
        {[28, 50, 72, 94, 116, 138].map((x, i) => (
          <rect key={i} x={x} y="27" width={16} height="4" rx="1" fill="white" opacity="0.85" />
        ))}
        {[34, 46, 58, 70, 82, 94].map((y, ri) => (
          <g key={ri}>
            <rect x="0" y={y} width="160" height="12" fill={ri % 2 === 0 ? "#fff" : "#f8f0ff"} />
            <rect x="5" y={y + 3} width="18" height="3" rx="0.5" fill="#d946ef" opacity="0.4" />
            {[28, 50, 72, 94, 116, 138].map((x, ci) => (
              <rect
                key={ci}
                x={x}
                y={y + 3}
                width={16}
                height="3"
                rx="0.5"
                fill="#ccc"
                opacity="0.6"
              />
            ))}
          </g>
        ))}
      </svg>
    ),
  },
  {
    id: "vvip",
    label: "VVIP ✦",
    description: "Luxurious gold-bordered premium timetable with ornate frames.",
    emoji: "👑",
    preview: TimetablePreviewVVIP,
  },
  {
    id: "custom",
    label: "Custom ✎",
    description: "Design your own: colors, fonts, borders, and layout style.",
    emoji: "🎨",
    preview: CustomPreviewCard,
  },
];

const RESUME_JOB_TEMPLATES: TemplateOption[] = [
  {
    id: "modern",
    label: "Modern",
    description: "Two-column with left accent sidebar, bold name header.",
    emoji: "💼",
    preview: ResumePreviewModern,
  },
  {
    id: "classic",
    label: "Classic",
    description: "Centered heading with serif font and clean horizontal dividers.",
    emoji: "🏛️",
    preview: ResumePreviewClassic,
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "Spacious, airy layout with minimal decoration and a color accent line.",
    emoji: "✨",
    preview: ResumePreviewMinimal,
  },
  {
    id: "custom",
    label: "Custom ✎",
    description: "Design your own: colors, fonts, borders, and layout style.",
    emoji: "🎨",
    preview: CustomPreviewCard,
  },
];

const RESUME_WEDDING_TEMPLATES: TemplateOption[] = [
  {
    id: "traditional",
    label: "Traditional",
    description: "Saffron & maroon with Sanskrit blessings and decorative border.",
    emoji: "🪔",
    preview: BiodataPreviewTraditional,
  },
  {
    id: "royal",
    label: "Royal Gold",
    description: "Elegant gold gradient frames with a regal ⚜ symbol.",
    emoji: "👑",
    preview: BiodataPreviewRoyal,
  },
  {
    id: "floral",
    label: "Floral",
    description: "Soft rose and blush with floral corner accents.",
    emoji: "🌸",
    preview: BiodataPreviewFloral,
  },
  {
    id: "custom",
    label: "Custom ✎",
    description: "Design your own: colors, fonts, borders, and layout style.",
    emoji: "🎨",
    preview: CustomPreviewCard,
  },
];

// ─────────────────────── Main Component ──────────────────────────────

interface TemplateGalleryProps {
  mode: GalleryMode;
  selected: string;
  accent?: string;
  onSelect: (templateId: string) => void;
}

export function TemplateGallery({
  mode,
  selected,
  accent = "#1E2761",
  onSelect,
}: TemplateGalleryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const templatesMap: Record<GalleryMode, TemplateOption[]> = {
    exam: EXAM_TEMPLATES,
    hhw: HHW_TEMPLATES,
    timetable: TIMETABLE_TEMPLATES,
    "resume-job": RESUME_JOB_TEMPLATES,
    "resume-wedding": RESUME_WEDDING_TEMPLATES,
  };

  const templates = templatesMap[mode] ?? [];
  const isWide = mode === "timetable";

  return (
    <div className="space-y-2">
      <div
        className={`grid gap-3 ${
          isWide ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 md:grid-cols-3"
        }`}
      >
        {templates.map((tpl) => {
          const isSelected = selected === tpl.id;
          const isHovered = hoveredId === tpl.id;
          const Preview = tpl.preview;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelect(tpl.id)}
              onMouseEnter={() => setHoveredId(tpl.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`group relative flex flex-col rounded-xl border-2 overflow-hidden transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isSelected
                  ? "border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                  : isHovered
                    ? "border-primary/40 shadow-md scale-[1.01]"
                    : "border-border hover:border-primary/30"
              }`}
              aria-label={`Select ${tpl.label} template`}
              aria-pressed={isSelected}
            >
              {/* Thumbnail preview */}
              <div
                className={`w-full bg-white overflow-hidden transition-all duration-200 ${
                  isWide ? "aspect-[4/3]" : "aspect-[3/4]"
                }`}
                style={{ display: "flex", alignItems: "stretch" }}
              >
                <Preview accent={accent} />
              </div>

              {/* Selected badge */}
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 shadow-sm">
                  ✓ Active
                </div>
              )}

              {/* Label bar */}
              <div
                className={`px-2 py-1.5 text-left transition-colors ${
                  isSelected ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
                }`}
              >
                <span className="text-[11px] font-semibold block leading-tight">
                  {tpl.emoji} {tpl.label}
                </span>
                <span
                  className={`text-[9px] leading-tight opacity-70 block mt-0.5 ${
                    isSelected ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {tpl.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
