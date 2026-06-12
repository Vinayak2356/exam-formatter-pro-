# Exam · Holiday Homework · Time Table Maker

Generate properly formatted **exam papers**, **holiday homework packets**, and **school timetables** (5 premium templates each) from text / a website. Export to **PDF** or **DOCX**, or print directly.

Built with TanStack Start (React 19 + Vite 7).

---

## ✅ Requirements

You need **one** of the following installed:

- [**Bun**](https://bun.sh) ≥ 1.1 (recommended — fastest)
- OR Node.js ≥ 20 + npm

That's it. Everything else (PDF generation, DOCX export, AI calls) runs in the browser or via a built-in server endpoint.

---

## 🚀 Run Locally

```bash
# 1. install dependencies
bun install
#   – or –
npm install

# 2. create your local env file (see below)
cp .env.example .env       # then edit .env

# 3. start the dev server
bun run dev
#   – or –
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔑 Environment Variables

Create a `.env` file in the project root with:

```bash
# Required ONLY if you want AI generation to work locally.
# Get your Google Gemini API key from Google AI Studio.
GEMINI_API_KEY=your_key_here
```

> The **Timetable Maker** does **not** require any API key — it's a fully manual builder.  
> Only **Exam Paper** and **Holiday Homework** generation use the AI endpoint.

### Where the AI key is used

The key is read on the server side by:

- `src/routes/api/public/generate-exam.ts`
- `src/routes/api/public/generate-hhw.ts`

Both call the Google Gemini API (`https://generativelanguage.googleapis.com`) to generate content.

---

## 🧱 Build for Production

```bash
bun run build
bun run start          # serves the built app
```

Output goes to `.output/`. The app is a standard TanStack Start build and can be deployed to any Node ≥ 20 host, Cloudflare Workers, or Vercel.

---

## 📂 Project Structure

```
src/
├── components/
│   ├── ExamPaperView.tsx       # exam renderer
│   ├── HHWView.tsx             # holiday homework renderer (3 templates)
│   └── TimetableView.tsx       # timetable renderer (5 templates)
├── lib/
│   ├── exam-export.ts          # PDF + DOCX for exams
│   ├── hhw-export.ts           # PDF + DOCX for homework
│   └── timetable-export.ts     # PDF + DOCX for timetables (landscape)
├── routes/
│   ├── index.tsx               # main UI with the 3 modes
│   └── api/public/
│       ├── generate-exam.ts    # AI endpoint for exams
│       └── generate-hhw.ts     # AI endpoint for HHW
└── styles.css                  # all template CSS (modern / classic / vvip / minimal / vibrant)
```

---

## 🎨 Templates

| Mode           | Templates                                                  |
| -------------- | ---------------------------------------------------------- |
| **Exam Paper** | Standard (logo + bordered header, like a CBSE paper)       |
| **Holiday HW** | Standard · Classic · VVIP (gold premium)                   |
| **Time Table** | Modern · Classic · Minimal · Vibrant · VVIP (gold premium) |

All templates respect:

- Custom **school name / address / class**
- **Logo** upload (PNG / JPG)
- **Accent color** picker
- **Footer note**

---

## 🖨️ Export

Three options for every generated document:

1. **PDF** — rendered via `html2pdf.js` (timetables auto-use landscape A4)
2. **DOCX** — generated with `docx` library (works in Word, Google Docs, LibreOffice)
3. **Print** — uses the browser's native print dialog with print-optimized CSS

---

## 🛠️ Troubleshooting

**`GEMINI_API_KEY` not set →** AI generation returns 500. Add it to `.env` and restart `bun run dev`.

**PDF looks cut off →** Timetables print best in **landscape**. The export already forces landscape; if you use _Print_ manually, set the browser print dialog to **landscape A4**.

**DOCX images missing →** Make sure your logo / cover image is under **2 MB** and is PNG / JPG.

**Port 5173 already in use →** `bun run dev --port 3001`.

---

## 📜 License

MIT — use freely for your school.
