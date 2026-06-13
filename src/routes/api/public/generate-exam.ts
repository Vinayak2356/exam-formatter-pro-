import { createFileRoute } from "@tanstack/react-router";
import { generateExamOffline } from "@/lib/offline-generator";

type Body = {
  schoolName: string;
  schoolAddress: string;
  examTitle: string;
  time: string;
  className: string;
  subject: string;
  maxMarks: number;
  sourceText?: string;
  websiteUrl?: string;
  instructions?: string;
  engine?: "ai" | "offline";
};

async function fetchSiteText(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 ExamPaperBot" },
    });
    if (!res.ok) return "";
    const html = await res.text();
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 2000);
  } catch {
    return "";
  }
}

const SYSTEM_PROMPT = `You are an Indian school exam paper generator.
Respond with ONLY a valid JSON object — no markdown, no explanation.
Schema: {"sections":[{"name":string,"marks":number,"questions":[{"number":string,"instruction":string,"marks":number,"type":"mcq"|"short"|"long"|"fill"|"match"|"passage"|"other","passage":string|null,"subQuestions":[{"label":string,"text":string,"options":string[]|null}]}]}]}
Rules:
- All section marks must add up to MaxMarks exactly.
- MCQ must have exactly 4 options.
- Keep questions concise and relevant to the source.
- Do NOT wrap output in json fences.`;

async function getRequesterEmail(request: Request): Promise<string> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return "anonymous@school.com";
  }
  const token = authHeader.replace("Bearer ", "");
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    return "anonymous@school.com";
  }

  try {
    const decoded = (await import("jsonwebtoken")).default.verify(token, JWT_SECRET) as {
      email: string;
    };
    return decoded.email || "anonymous@school.com";
  } catch {
    return "anonymous@school.com";
  }
}

export const Route = createFileRoute("/api/public/generate-exam")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const userEmail = await getRequesterEmail(request);
        let body: Body;
        try {
          body = (await request.json()) as Body;
        } catch {
          return new Response(JSON.stringify({ error: "Invalid request" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        let apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          try {
            const fs = await import("fs");
            const path = await import("path");
            const envContent = fs.readFileSync(path.join(process.cwd(), ".env"), "utf-8");
            const match = envContent.match(/^GEMINI_API_KEY=["']?(.*?)["']?$/m);
            if (match) apiKey = match[1];
          } catch (e) {
            // ignore
          }
        }
        const useOffline = body.engine === "offline" || !apiKey;

        if (useOffline) {
          console.log(
            `[generate-exam] Generating offline. Reason: engine=${body.engine || "not-specified"}, key-present=${!!apiKey}`,
          );
          const paper = generateExamOffline(body);
          await (
            await import("@/lib/logger.server")
          ).addLog(
            userEmail,
            "Generate Exam (Offline)",
            `${body.subject} - Class ${body.className} (${body.maxMarks} marks)`,
          );
          return new Response(
            JSON.stringify({
              paper,
              header: {
                schoolName: body.schoolName,
                schoolAddress: body.schoolAddress,
                examTitle: body.examTitle,
                time: body.time,
                className: body.className,
                subject: body.subject,
                maxMarks: body.maxMarks,
                isOffline: true,
                isOfflineFallback: !apiKey && body.engine === "ai",
              },
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        }

        const siteText = body.websiteUrl ? await fetchSiteText(body.websiteUrl) : "";

        const trimmedSource = (body.sourceText || "").slice(0, 2000);

        const userPrompt =
          `Class:${body.className} Subject:${body.subject} MaxMarks:${body.maxMarks} Time:${body.time}` +
          (body.instructions ? ` Instructions:${body.instructions}` : "") +
          `\nSOURCE: ${trimmedSource || "(none)"}` +
          (siteText ? ` SITE: ${siteText}` : "") +
          `\nGenerate exam paper JSON. Total marks must equal ${body.maxMarks}.`;

        try {
          const aiRes = await fetch(
            // gemini-2.5-flash: the model this API key has quota for.
            // Do NOT use responseMimeType with thinking models — it conflicts.
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
                contents: [{ role: "user", parts: [{ text: userPrompt }] }],
                generationConfig: {
                  temperature: 0.4,
                  maxOutputTokens: 8192,
                  // No responseMimeType — incompatible with gemini-2.5-flash thinking mode
                },
              }),
            },
          );

          if (!aiRes.ok) {
            const errText = await aiRes.text();
            console.error("[generate-exam] Gemini error:", aiRes.status, errText);
            throw new Error(`Gemini API failed with status ${aiRes.status}: ${errText}`);
          }

          const aiJson = (await aiRes.json()) as {
            candidates?: {
              content?: {
                parts?: { text?: string; thought?: boolean }[];
              };
            }[];
            error?: { message?: string };
          };

          // Skip any thought parts — grab the first real text part
          const parts = aiJson.candidates?.[0]?.content?.parts ?? [];
          const responsePart = parts.find((p) => !p.thought) ?? parts[0];
          let raw = responsePart?.text ?? "";

          // Strip markdown fences just in case
          raw = raw
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```\s*$/i, "")
            .trim();

          // Extract first {...} block if model added preamble text
          if (!raw.startsWith("{")) {
            const match = raw.match(/\{[\s\S]*\}/);
            raw = match ? match[0] : "{}";
          }

          const parsed = JSON.parse(raw);
          await (
            await import("@/lib/logger.server")
          ).addLog(
            userEmail,
            "Generate Exam (AI)",
            `${body.subject} - Class ${body.className} (${body.maxMarks} marks)`,
          );
          return new Response(
            JSON.stringify({
              paper: parsed,
              header: {
                schoolName: body.schoolName,
                schoolAddress: body.schoolAddress,
                examTitle: body.examTitle,
                time: body.time,
                className: body.className,
                subject: body.subject,
                maxMarks: body.maxMarks,
                isOffline: false,
              },
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          console.warn(
            "[generate-exam] AI generation failed, falling back to local generator:",
            errorMsg,
          );
          const paper = generateExamOffline(body);
          await (
            await import("@/lib/logger.server")
          ).addLog(
            userEmail,
            "Generate Exam (AI Fallback)",
            `${body.subject} - Class ${body.className} (${body.maxMarks} marks) - Error: ${errorMsg}`,
          );
          return new Response(
            JSON.stringify({
              paper,
              header: {
                schoolName: body.schoolName,
                schoolAddress: body.schoolAddress,
                examTitle: body.examTitle,
                time: body.time,
                className: body.className,
                subject: body.subject,
                maxMarks: body.maxMarks,
                isOffline: true,
                isOfflineFallback: true,
                fallbackReason: errorMsg,
              },
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
