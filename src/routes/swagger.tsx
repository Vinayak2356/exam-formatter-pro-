import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Terminal,
  Check,
  Copy,
  ArrowLeft,
  Cpu,
  Send,
  Play,
  CheckCircle,
  Code2,
  FileCode,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

// OpenAPI 3.0 Specification YAML String
const OPENAPI_SPEC = `openapi: 3.0.3
info:
  title: Exam Formatter Pro API
  description: Public API endpoints for generating school exam papers and holiday homework packets using Gemini AI or offline heuristics.
  version: 1.0.0
servers:
  - url: http://localhost:8080
    description: Local development server
paths:
  /api/public/generate-exam:
    post:
      summary: Generate an Exam Paper
      description: Generates a complete exam paper structure (sections, questions, subquestions, and marks) from source text, a website, or custom instructions.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ExamGenerationRequest'
      responses:
        '200':
          description: Successful generation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExamGenerationResponse'
        '400':
          description: Invalid request payload
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /api/public/generate-hhw:
    post:
      summary: Generate Holiday Homework
      description: Generates a holiday homework packet containing general instructions, subject notes, and structured assignments.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HHWGenerationRequest'
      responses:
        '200':
          description: Successful generation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HHWGenerationResponse'
        '400':
          description: Invalid request payload
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

components:
  schemas:
    ExamGenerationRequest:
      type: object
      required:
        - schoolName
        - schoolAddress
        - examTitle
        - time
        - className
        - subject
        - maxMarks
      properties:
        schoolName:
          type: string
          example: "MERRY CITY SCHOOL & HOSTEL"
        schoolAddress:
          type: string
          example: "Narayanpur near Bypass Dafi, Varanasi"
        examTitle:
          type: string
          example: "Half-Yearly Examination 2026-2027"
        time:
          type: string
          example: "3 hrs"
        className:
          type: string
          example: "VIII"
        subject:
          type: string
          example: "Social Science"
        maxMarks:
          type: integer
          example: 80
        sourceText:
          type: string
          description: Contextual text/passage material to generate questions from.
          example: "When Gandhi returned to India, he was convinced that the British could be fought..."
        websiteUrl:
          type: string
          format: uri
          description: Optional webpage link to scrape text from.
          example: "https://en.wikipedia.org/wiki/Satyagraha"
        instructions:
          type: string
          description: Custom hints or formatting directions for the generator.
          example: "Focus heavily on history and political science."
        engine:
          type: string
          enum: [ai, offline]
          default: ai
          description: Select AI-based (Gemini) or rule-based offline generation.

    ExamGenerationResponse:
      type: object
      properties:
        paper:
          type: object
          properties:
            sections:
              type: array
              items:
                $ref: '#/components/schemas/ExamSection'
        header:
          type: object
          properties:
            schoolName:
              type: string
            schoolAddress:
              type: string
            examTitle:
              type: string
            time:
              type: string
            className:
              type: string
            subject:
              type: string
            maxMarks:
              type: integer
            isOffline:
              type: boolean
            isOfflineFallback:
              type: boolean

    ExamSection:
      type: object
      properties:
        name:
          type: string
          example: "SECTION A - HISTORY"
        marks:
          type: integer
          example: 20
        questions:
          type: array
          items:
            $ref: '#/components/schemas/ExamQuestion'

    ExamQuestion:
      type: object
      properties:
        number:
          type: string
          example: "1"
        instruction:
          type: string
          example: "Which of the following options correctly matches the event with the year?"
        marks:
          type: integer
          example: 1
        type:
          type: string
          enum: [mcq, short, long, fill, match, passage, other]
          example: mcq
        passage:
          type: string
          nullable: true
          example: null
        subQuestions:
          type: array
          items:
            $ref: '#/components/schemas/ExamSubQuestion'

    ExamSubQuestion:
      type: object
      properties:
        label:
          type: string
          example: "A"
        text:
          type: string
          example: "Treaty of Vienna - 1815"
        options:
          type: array
          items:
            type: string
          nullable: true
          example: ["Option A", "Option B", "Option C", "Option D"]

    HHWGenerationRequest:
      type: object
      required:
        - schoolName
        - schoolAddress
        - title
        - className
        - subjects
      properties:
        schoolName:
          type: string
          example: "MERRY CITY SCHOOL & HOSTEL"
        schoolAddress:
          type: string
          example: "Narayanpur near Bypass Dafi, Varanasi"
        title:
          type: string
          example: "SUMMER VACATION HOMEWORK"
        className:
          type: string
          example: "VIII"
        subjects:
          type: array
          items:
            type: string
          example: ["English", "Mathematics", "Science"]
        sourceText:
          type: string
          example: "Include lessons on cell structures and force."
        websiteUrl:
          type: string
          format: uri
        instructions:
          type: string
          example: "Keep tasks creative and research-oriented."
        tone:
          type: string
          enum: [standard, premium]
          default: standard
        engine:
          type: string
          enum: [ai, offline]
          default: ai

    HHWGenerationResponse:
      type: object
      properties:
        packet:
          type: object
          properties:
            title:
              type: string
            generalInstructions:
              type: array
              items:
                type: string
            subjects:
              type: array
              items:
                $ref: '#/components/schemas/HHWSubject'
        header:
          type: object
          properties:
            schoolName:
              type: string
            schoolAddress:
              type: string
            className:
              type: string
            title:
              type: string
            isOffline:
              type: boolean

    HHWSubject:
      type: object
      properties:
        subject:
          type: string
          example: "Science"
        note:
          type: string
          nullable: true
          example: "Read Chapter 1 before solving tasks."
        assignments:
          type: array
          items:
            $ref: '#/components/schemas/HHWAssignment'

    HHWAssignment:
      type: object
      properties:
        number:
          type: string
          example: "1"
        text:
          type: string
          example: "Create a 3D model of a plant cell using household materials."

    ErrorResponse:
      type: object
      properties:
        error:
          type: string
          example: "Invalid request"`;

export const Route = createFileRoute("/swagger")({
  component: SwaggerDocs,
});

function SwaggerDocs() {
  const [activeTab, setActiveTab] = useState<"intro" | "exam" | "hhw" | "openapi">("intro");
  const [copiedSpec, setCopiedSpec] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<Record<string, boolean>>({});

  // Playground States - Exam Paper
  const [examBody, setExamBody] = useState({
    schoolName: "MERRY CITY SCHOOL & HOSTEL",
    schoolAddress: "NARAYANPUR NEAR BYPASS DAFI, VARANASI",
    examTitle: "Half-Yearly Examination 2026-2027",
    time: "3 hrs",
    className: "VIII",
    subject: "Social Science",
    maxMarks: 80,
    sourceText: "Satyagraha was a novel method of mass agitation based on truth and non-violence.",
    websiteUrl: "",
    instructions: "Focus on MCQ and history sections.",
    engine: "offline",
  });
  const [examResponse, setExamResponse] = useState<unknown>(null);
  const [examLoading, setExamLoading] = useState(false);

  // Playground States - HHW
  const [hhwBody, setHhwBody] = useState({
    schoolName: "MERRY CITY SCHOOL & HOSTEL",
    schoolAddress: "NARAYANPUR NEAR BYPASS DAFI, VARANASI",
    title: "SUMMER VACATION HOMEWORK",
    className: "VIII",
    subjectsString: "English, Mathematics, Science",
    sourceText: "Focus assignments on geometry and ecology.",
    websiteUrl: "",
    instructions: "Include at least one practical research activity per subject.",
    tone: "standard",
    engine: "offline",
  });
  const [hhwResponse, setHhwResponse] = useState<unknown>(null);
  const [hhwLoading, setHhwLoading] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    if (key === "spec") {
      setCopiedSpec(true);
      setTimeout(() => setCopiedSpec(false), 2000);
    } else {
      setCopiedSnippet((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => setCopiedSnippet((prev) => ({ ...prev, [key]: false })), 2000);
    }
    toast.success("Copied to clipboard!");
  };

  const handleTestExam = async () => {
    setExamLoading(true);
    setExamResponse(null);
    try {
      const res = await fetch("/api/public/generate-exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...examBody,
          maxMarks: Number(examBody.maxMarks),
        }),
      });
      const data = await res.json();
      setExamResponse(data);
      if (res.ok) {
        toast.success("Exam successfully generated!");
      } else {
        toast.error("Generation failed: " + (data.error || "Bad Request"));
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      toast.error("Request error: " + errorMsg);
      setExamResponse({ error: "Failed to connect to API server.", details: errorMsg });
    } finally {
      setExamLoading(false);
    }
  };

  const handleTestHHW = async () => {
    setHhwLoading(true);
    setHhwResponse(null);
    try {
      const subjects = hhwBody.subjectsString
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/public/generate-hhw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolName: hhwBody.schoolName,
          schoolAddress: hhwBody.schoolAddress,
          title: hhwBody.title,
          className: hhwBody.className,
          subjects,
          sourceText: hhwBody.sourceText,
          websiteUrl: hhwBody.websiteUrl,
          instructions: hhwBody.instructions,
          tone: hhwBody.tone,
          engine: hhwBody.engine,
        }),
      });
      const data = await res.json();
      setHhwResponse(data);
      if (res.ok) {
        toast.success("Holiday Homework successfully generated!");
      } else {
        toast.error("Generation failed: " + (data.error || "Bad Request"));
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      toast.error("Request error: " + errorMsg);
      setHhwResponse({ error: "Failed to connect to API server.", details: errorMsg });
    } finally {
      setHhwLoading(false);
    }
  };

  const codeSnippets = {
    exam: {
      curl: `curl -X POST http://localhost:8080/api/public/generate-exam \\
  -H "Content-Type: application/json" \\
  -d '{
    "schoolName": "${examBody.schoolName}",
    "schoolAddress": "${examBody.schoolAddress}",
    "examTitle": "${examBody.examTitle}",
    "time": "${examBody.time}",
    "className": "${examBody.className}",
    "subject": "${examBody.subject}",
    "maxMarks": ${examBody.maxMarks},
    "engine": "${examBody.engine}",
    "sourceText": "${examBody.sourceText}"
  }'`,
      javascript: `fetch('http://localhost:8080/api/public/generate-exam', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    schoolName: "${examBody.schoolName}",
    schoolAddress: "${examBody.schoolAddress}",
    examTitle: "${examBody.examTitle}",
    time: "${examBody.time}",
    className: "${examBody.className}",
    subject: "${examBody.subject}",
    maxMarks: ${examBody.maxMarks},
    engine: "${examBody.engine}",
    sourceText: "${examBody.sourceText}"
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));`,
      python: `import requests

url = "http://localhost:8080/api/public/generate-exam"
payload = {
    "schoolName": "${examBody.schoolName}",
    "schoolAddress": "${examBody.schoolAddress}",
    "examTitle": "${examBody.examTitle}",
    "time": "${examBody.time}",
    "className": "${examBody.className}",
    "subject": "${examBody.subject}",
    "maxMarks": ${examBody.maxMarks},
    "engine": "${examBody.engine}",
    "sourceText": "${examBody.sourceText}"
}

response = requests.post(url, json=payload)
print(response.json())`,
    },
    hhw: {
      curl: `curl -X POST http://localhost:8080/api/public/generate-hhw \\
  -H "Content-Type: application/json" \\
  -d '{
    "schoolName": "${hhwBody.schoolName}",
    "schoolAddress": "${hhwBody.schoolAddress}",
    "title": "${hhwBody.title}",
    "className": "${hhwBody.className}",
    "subjects": [${hhwBody.subjectsString
      .split(",")
      .map((s) => `"${s.trim()}"`)
      .join(", ")}],
    "tone": "${hhwBody.tone}",
    "engine": "${hhwBody.engine}",
    "sourceText": "${hhwBody.sourceText}"
  }'`,
      javascript: `fetch('http://localhost:8080/api/public/generate-hhw', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    schoolName: "${hhwBody.schoolName}",
    schoolAddress: "${hhwBody.schoolAddress}",
    title: "${hhwBody.title}",
    className: "${hhwBody.className}",
    subjects: [${hhwBody.subjectsString
      .split(",")
      .map((s) => `"${s.trim()}"`)
      .join(", ")}],
    tone: "${hhwBody.tone}",
    engine: "${hhwBody.engine}",
    sourceText: "${hhwBody.sourceText}"
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));`,
      python: `import requests

url = "http://localhost:8080/api/public/generate-hhw"
payload = {
    "schoolName": "${hhwBody.schoolName}",
    "schoolAddress": "${hhwBody.schoolAddress}",
    "title": "${hhwBody.title}",
    "className": "${hhwBody.className}",
    "subjects": [${hhwBody.subjectsString
      .split(",")
      .map((s) => `"${s.trim()}"`)
      .join(", ")}],
    "tone": "${hhwBody.tone}",
    "engine": "${hhwBody.engine}",
    "sourceText": "${hhwBody.sourceText}"
}

response = requests.post(url, json=payload)
print(response.json())`,
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Toaster />

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-slate-400 hover:text-slate-100 transition flex items-center gap-1.5 text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" /> Back to App
            </Link>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-indigo-400" />
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                API Reference Sandbox
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-500/20 font-mono">
              v1.0.0
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-[260px_1fr] divide-y md:divide-y-0 md:divide-x divide-slate-800">
        {/* Navigation Sidebar */}
        <aside className="p-6 space-y-6 flex flex-col bg-slate-900/30">
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
              Overview
            </h2>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("intro")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2.5 ${
                  activeTab === "intro"
                    ? "bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-600/15"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Introduction
              </button>
              <button
                onClick={() => setActiveTab("openapi")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2.5 ${
                  activeTab === "openapi"
                    ? "bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-600/15"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <FileCode className="h-4 w-4" />
                OpenAPI Specification
              </button>
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
              Endpoints
            </h2>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("exam")}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition flex flex-col items-start gap-1 ${
                  activeTab === "exam"
                    ? "bg-slate-900 border border-slate-700 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                    POST
                  </span>
                  Generate Exam
                </span>
                <span className="text-[10px] text-slate-500 font-mono truncate w-full">
                  /api/public/generate-exam
                </span>
              </button>

              <button
                onClick={() => setActiveTab("hhw")}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition flex flex-col items-start gap-1 ${
                  activeTab === "hhw"
                    ? "bg-slate-900 border border-slate-700 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                    POST
                  </span>
                  Generate HHW
                </span>
                <span className="text-[10px] text-slate-500 font-mono truncate w-full">
                  /api/public/generate-hhw
                </span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="p-6 md:p-8 space-y-8 bg-slate-950">
          {activeTab === "intro" && (
            <div className="space-y-6 max-w-4xl">
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Public API Reference
                </h1>
                <p className="text-lg text-slate-400">
                  Integrate Exam Formatter Pro's generation engines directly into your own
                  applications, school websites, or management software.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 mt-8">
                <Card className="bg-slate-900/50 border-slate-800 text-slate-300">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-indigo-400" />
                      Two Generation Engines
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Standardize how output is created.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p>
                      <strong>🤖 AI Engine (Gemini):</strong> Creates dynamic, smart content based
                      on your parameters, scrape data, or text resources.
                    </p>
                    <p>
                      <strong>⚡ Instant Heuristics:</strong> Runs instantly local, offline
                      rule-based templates. Used automatically as a fallback.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800 text-slate-300">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-indigo-400" />
                      Production Ready
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      JSON formatting, easy handling, and fallbacks.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p>
                      All API responses deliver clean, predictable JSON objects that map perfectly
                      to print, PDF, and DOCX templates.
                    </p>
                    <p>
                      Try testing the endpoints interactively in the sidebar playground, or view the
                      complete OpenAPI spec.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="border border-slate-800 rounded-xl p-5 bg-indigo-950/10 border-indigo-900/30 text-slate-300 mt-6">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-1.5">
                  🔑 API Key Authentication
                </h3>
                <p className="text-sm">
                  The API endpoints authenticate using the server's environment keys. Make sure your
                  production host has the <code>GEMINI_API_KEY</code> variable configured if you
                  want the API to use Gemini models.
                </p>
              </div>
            </div>
          )}

          {activeTab === "openapi" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">OpenAPI 3.0 YAML Specification</h1>
                  <p className="text-slate-400 text-sm">
                    Paste this specification directly into Swagger Editor to generate Client SDKs.
                  </p>
                </div>
                <Button
                  onClick={() => copyToClipboard(OPENAPI_SPEC, "spec")}
                  className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200"
                >
                  {copiedSpec ? (
                    <Check className="h-4 w-4 mr-2 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  Copy YAML
                </Button>
              </div>

              <pre className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 overflow-x-auto text-xs font-mono leading-relaxed text-indigo-200 max-h-[600px]">
                {OPENAPI_SPEC}
              </pre>
            </div>
          )}

          {activeTab === "exam" && (
            <div className="space-y-8">
              {/* Header & Path */}
              <div className="space-y-2 border-b border-slate-900 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-extrabold uppercase">
                    POST
                  </span>
                  <span className="font-mono text-lg font-bold text-white">
                    /api/public/generate-exam
                  </span>
                </div>
                <h1 className="text-xl font-bold text-slate-100">Generate an Exam Paper</h1>
                <p className="text-slate-400 text-sm">
                  Generates an exam structure including sections, questions, and mark distribution
                  using AI context or offline generation.
                </p>
              </div>

              {/* Layout: Form on Left, Snippets & Response on Right */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Request Parameters */}
                <div className="space-y-6">
                  <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider">
                    Interactive Playground Sandbox
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="exam-schoolName">School Name</Label>
                      <Input
                        id="exam-schoolName"
                        value={examBody.schoolName}
                        onChange={(e) => setExamBody({ ...examBody, schoolName: e.target.value })}
                        className="bg-slate-900/80 border-slate-800 text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="exam-schoolAddress">School Address</Label>
                      <Input
                        id="exam-schoolAddress"
                        value={examBody.schoolAddress}
                        onChange={(e) =>
                          setExamBody({ ...examBody, schoolAddress: e.target.value })
                        }
                        className="bg-slate-900/80 border-slate-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="exam-examTitle">Exam Title</Label>
                      <Input
                        id="exam-examTitle"
                        value={examBody.examTitle}
                        onChange={(e) => setExamBody({ ...examBody, examTitle: e.target.value })}
                        className="bg-slate-900/80 border-slate-800 text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="exam-time">Time Allowed</Label>
                      <Input
                        id="exam-time"
                        value={examBody.time}
                        onChange={(e) => setExamBody({ ...examBody, time: e.target.value })}
                        className="bg-slate-900/80 border-slate-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="exam-className">Class</Label>
                      <Input
                        id="exam-className"
                        value={examBody.className}
                        onChange={(e) => setExamBody({ ...examBody, className: e.target.value })}
                        className="bg-slate-900/80 border-slate-800 text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="exam-subject">Subject</Label>
                      <Input
                        id="exam-subject"
                        value={examBody.subject}
                        onChange={(e) => setExamBody({ ...examBody, subject: e.target.value })}
                        className="bg-slate-900/80 border-slate-800 text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="exam-maxMarks">Max Marks</Label>
                      <Input
                        id="exam-maxMarks"
                        type="number"
                        value={examBody.maxMarks}
                        onChange={(e) =>
                          setExamBody({ ...examBody, maxMarks: Number(e.target.value) })
                        }
                        className="bg-slate-900/80 border-slate-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="exam-engine">Generation Engine</Label>
                      <Select
                        value={examBody.engine}
                        onValueChange={(val) => setExamBody({ ...examBody, engine: val })}
                      >
                        <SelectTrigger className="bg-slate-900 border-slate-800 text-white">
                          <SelectValue placeholder="Select Engine" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-white">
                          <SelectItem value="ai">🤖 AI (Gemini)</SelectItem>
                          <SelectItem value="offline">⚡ Offline / Instant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="exam-websiteUrl">Website URL (optional)</Label>
                      <Input
                        id="exam-websiteUrl"
                        value={examBody.websiteUrl}
                        onChange={(e) => setExamBody({ ...examBody, websiteUrl: e.target.value })}
                        className="bg-slate-900/80 border-slate-800 text-white"
                        placeholder="https://example.com/topic"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="exam-sourceText">Source Material (context)</Label>
                    <Textarea
                      id="exam-sourceText"
                      value={examBody.sourceText}
                      onChange={(e) => setExamBody({ ...examBody, sourceText: e.target.value })}
                      className="bg-slate-900/80 border-slate-800 text-white min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="exam-instructions">Generation Guidelines</Label>
                    <Input
                      id="exam-instructions"
                      value={examBody.instructions}
                      onChange={(e) => setExamBody({ ...examBody, instructions: e.target.value })}
                      className="bg-slate-900/80 border-slate-800 text-white"
                    />
                  </div>

                  <Button
                    onClick={handleTestExam}
                    disabled={examLoading}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold flex items-center justify-center gap-2 py-5 shadow-lg shadow-indigo-500/20"
                  >
                    {examLoading ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    Send Request ⚡
                  </Button>
                </div>

                {/* Right Side: Code Snippets & Output */}
                <div className="space-y-6">
                  {/* Code Snippets */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider">
                      Request Snippet
                    </h3>
                    <Tabs defaultValue="curl" className="w-full">
                      <TabsList className="bg-slate-900 border border-slate-800 grid grid-cols-3">
                        <TabsTrigger
                          value="curl"
                          className="text-slate-400 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                        >
                          cURL
                        </TabsTrigger>
                        <TabsTrigger
                          value="js"
                          className="text-slate-400 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                        >
                          JavaScript
                        </TabsTrigger>
                        <TabsTrigger
                          value="py"
                          className="text-slate-400 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                        >
                          Python
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="curl" className="relative">
                        <pre className="bg-slate-900 p-4 rounded-lg border border-slate-800 overflow-x-auto text-[11px] font-mono text-indigo-300">
                          {codeSnippets.exam.curl}
                        </pre>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => copyToClipboard(codeSnippets.exam.curl, "examCurl")}
                          className="absolute right-2 top-2 text-slate-400 hover:text-white"
                        >
                          {copiedSnippet.examCurl ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </TabsContent>
                      <TabsContent value="js" className="relative">
                        <pre className="bg-slate-900 p-4 rounded-lg border border-slate-800 overflow-x-auto text-[11px] font-mono text-indigo-300">
                          {codeSnippets.exam.javascript}
                        </pre>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => copyToClipboard(codeSnippets.exam.javascript, "examJS")}
                          className="absolute right-2 top-2 text-slate-400 hover:text-white"
                        >
                          {copiedSnippet.examJS ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </TabsContent>
                      <TabsContent value="py" className="relative">
                        <pre className="bg-slate-900 p-4 rounded-lg border border-slate-800 overflow-x-auto text-[11px] font-mono text-indigo-300">
                          {codeSnippets.exam.python}
                        </pre>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => copyToClipboard(codeSnippets.exam.python, "examPy")}
                          className="absolute right-2 top-2 text-slate-400 hover:text-white"
                        >
                          {copiedSnippet.examPy ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Output Response */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider">
                      Response Console
                    </h3>
                    <div className="bg-slate-900 rounded-lg border border-slate-800 p-4 min-h-[200px] max-h-[400px] overflow-y-auto font-mono text-[11px] text-slate-300">
                      {examLoading ? (
                        <div className="flex flex-col items-center justify-center h-full min-h-[160px] gap-2">
                          <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent animate-spin rounded-full" />
                          <span className="text-slate-400">Requesting resources...</span>
                        </div>
                      ) : examResponse ? (
                        <pre className="text-emerald-400 overflow-x-auto">
                          {JSON.stringify(examResponse, null, 2)}
                        </pre>
                      ) : (
                        <div className="flex items-center justify-center h-full min-h-[160px] text-slate-500">
                          No response yet. Fill out playground parameters and hit "Send Request".
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "hhw" && (
            <div className="space-y-8">
              {/* Header & Path */}
              <div className="space-y-2 border-b border-slate-900 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-extrabold uppercase">
                    POST
                  </span>
                  <span className="font-mono text-lg font-bold text-white">
                    /api/public/generate-hhw
                  </span>
                </div>
                <h1 className="text-xl font-bold text-slate-100">Generate Holiday Homework</h1>
                <p className="text-slate-400 text-sm">
                  Generates a full holiday homework pack containing instructions, note information,
                  and unique student assignments per subject.
                </p>
              </div>

              {/* Layout: Form on Left, Snippets & Response on Right */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Request Parameters */}
                <div className="space-y-6">
                  <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider">
                    Interactive Playground Sandbox
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="hhw-schoolName">School Name</Label>
                      <Input
                        id="hhw-schoolName"
                        value={hhwBody.schoolName}
                        onChange={(e) => setHhwBody({ ...hhwBody, schoolName: e.target.value })}
                        className="bg-slate-900/80 border-slate-800 text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="hhw-schoolAddress">School Address</Label>
                      <Input
                        id="hhw-schoolAddress"
                        value={hhwBody.schoolAddress}
                        onChange={(e) => setHhwBody({ ...hhwBody, schoolAddress: e.target.value })}
                        className="bg-slate-900/80 border-slate-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="hhw-title">HW Title</Label>
                      <Input
                        id="hhw-title"
                        value={hhwBody.title}
                        onChange={(e) => setHhwBody({ ...hhwBody, title: e.target.value })}
                        className="bg-slate-900/80 border-slate-800 text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="hhw-className">Class</Label>
                      <Input
                        id="hhw-className"
                        value={hhwBody.className}
                        onChange={(e) => setHhwBody({ ...hhwBody, className: e.target.value })}
                        className="bg-slate-900/80 border-slate-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="hhw-subjects">Subjects (comma separated)</Label>
                    <Input
                      id="hhw-subjects"
                      value={hhwBody.subjectsString}
                      onChange={(e) => setHhwBody({ ...hhwBody, subjectsString: e.target.value })}
                      className="bg-slate-900/80 border-slate-800 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="hhw-tone">Tone</Label>
                      <Select
                        value={hhwBody.tone}
                        onValueChange={(val) => setHhwBody({ ...hhwBody, tone: val })}
                      >
                        <SelectTrigger className="bg-slate-900 border-slate-800 text-white">
                          <SelectValue placeholder="Select Tone" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-white">
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium / Enrichment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="hhw-engine">Engine</Label>
                      <Select
                        value={hhwBody.engine}
                        onValueChange={(val) => setHhwBody({ ...hhwBody, engine: val })}
                      >
                        <SelectTrigger className="bg-slate-900 border-slate-800 text-white">
                          <SelectValue placeholder="Select Engine" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-white">
                          <SelectItem value="ai">🤖 AI (Gemini)</SelectItem>
                          <SelectItem value="offline">⚡ Offline / Instant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="hhw-websiteUrl">Website URL</Label>
                      <Input
                        id="hhw-websiteUrl"
                        value={hhwBody.websiteUrl}
                        onChange={(e) => setHhwBody({ ...hhwBody, websiteUrl: e.target.value })}
                        className="bg-slate-900/80 border-slate-800 text-white"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="hhw-sourceText">Source Context (optional)</Label>
                    <Textarea
                      id="hhw-sourceText"
                      value={hhwBody.sourceText}
                      onChange={(e) => setHhwBody({ ...hhwBody, sourceText: e.target.value })}
                      className="bg-slate-900/80 border-slate-800 text-white min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="hhw-instructions">Instructions</Label>
                    <Input
                      id="hhw-instructions"
                      value={hhwBody.instructions}
                      onChange={(e) => setHhwBody({ ...hhwBody, instructions: e.target.value })}
                      className="bg-slate-900/80 border-slate-800 text-white"
                    />
                  </div>

                  <Button
                    onClick={handleTestHHW}
                    disabled={hhwLoading}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold flex items-center justify-center gap-2 py-5 shadow-lg shadow-indigo-500/20"
                  >
                    {hhwLoading ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    Send Request ⚡
                  </Button>
                </div>

                {/* Right Side: Code Snippets & Output */}
                <div className="space-y-6">
                  {/* Code Snippets */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider">
                      Request Snippet
                    </h3>
                    <Tabs defaultValue="curl" className="w-full">
                      <TabsList className="bg-slate-900 border border-slate-800 grid grid-cols-3">
                        <TabsTrigger
                          value="curl"
                          className="text-slate-400 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                        >
                          cURL
                        </TabsTrigger>
                        <TabsTrigger
                          value="js"
                          className="text-slate-400 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                        >
                          JavaScript
                        </TabsTrigger>
                        <TabsTrigger
                          value="py"
                          className="text-slate-400 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                        >
                          Python
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="curl" className="relative">
                        <pre className="bg-slate-900 p-4 rounded-lg border border-slate-800 overflow-x-auto text-[11px] font-mono text-indigo-300">
                          {codeSnippets.hhw.curl}
                        </pre>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => copyToClipboard(codeSnippets.hhw.curl, "hhwCurl")}
                          className="absolute right-2 top-2 text-slate-400 hover:text-white"
                        >
                          {copiedSnippet.hhwCurl ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </TabsContent>
                      <TabsContent value="js" className="relative">
                        <pre className="bg-slate-900 p-4 rounded-lg border border-slate-800 overflow-x-auto text-[11px] font-mono text-indigo-300">
                          {codeSnippets.hhw.javascript}
                        </pre>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => copyToClipboard(codeSnippets.hhw.javascript, "hhwJS")}
                          className="absolute right-2 top-2 text-slate-400 hover:text-white"
                        >
                          {copiedSnippet.hhwJS ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </TabsContent>
                      <TabsContent value="py" className="relative">
                        <pre className="bg-slate-900 p-4 rounded-lg border border-slate-800 overflow-x-auto text-[11px] font-mono text-indigo-300">
                          {codeSnippets.hhw.python}
                        </pre>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => copyToClipboard(codeSnippets.hhw.python, "hhwPy")}
                          className="absolute right-2 top-2 text-slate-400 hover:text-white"
                        >
                          {copiedSnippet.hhwPy ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Output Response */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider">
                      Response Console
                    </h3>
                    <div className="bg-slate-900 rounded-lg border border-slate-800 p-4 min-h-[200px] max-h-[400px] overflow-y-auto font-mono text-[11px] text-slate-300">
                      {hhwLoading ? (
                        <div className="flex flex-col items-center justify-center h-full min-h-[160px] gap-2">
                          <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent animate-spin rounded-full" />
                          <span className="text-slate-400">Requesting resources...</span>
                        </div>
                      ) : hhwResponse ? (
                        <pre className="text-emerald-400 overflow-x-auto">
                          {JSON.stringify(hhwResponse, null, 2)}
                        </pre>
                      ) : (
                        <div className="flex items-center justify-center h-full min-h-[160px] text-slate-500">
                          No response yet. Fill out playground parameters and hit "Send Request".
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
