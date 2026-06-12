import { createFileRoute } from "@tanstack/react-router";
import { generateHHWOffline } from "@/lib/offline-generator";
import { addLog } from "@/lib/logger.server";
import { createClient } from "@supabase/supabase-js";

type Body = {
  schoolName: string;
  schoolAddress: string;
  title: string;
  className: string;
  subjects: string[];
  sourceText?: string;
  websiteUrl?: string;
  instructions?: string;
  tone?: "standard" | "premium";
  engine?: "ai" | "offline";
};

async function fetchSiteText(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 HHWBot" },
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

const SYSTEM_PROMPT = `You are an Indian school holiday homework generator.
Respond with ONLY a valid JSON object — no markdown, no explanation.
Schema: {"title":string,"generalInstructions":string[],"subjects":[{"subject":string,"note":string|null,"assignments":[{"number":string,"text":string}]}]}
Rules:
- 4-6 assignments per subject.
- Premium tone = enrichment/research tasks.
- Use Hindi/Devanagari script for Hindi and Sanskrit subjects.
- Do NOT wrap output in json fences.`;

async function getRequesterEmail(request: Request): Promise<string> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return "anonymous@school.com";
  }
  const token = authHeader.replace("Bearer ", "");
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    return "anonymous@school.com";
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { storage: undefined, persistSession: false },
    });
    const { data } = await supabase.auth.getClaims(token);
    return data?.claims?.email || "anonymous@school.com";
  } catch {
    return "anonymous@school.com";
  }
}

export const Route = createFileRoute("/api/public/generate-hhw")({
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

        const apiKey = process.env.GEMINI_API_KEY;
        const useOffline = body.engine === "offline" || !apiKey;

        if (useOffline) {
          console.log(
            `[generate-hhw] Generating offline. Reason: engine=${body.engine || "not-specified"}, key-present=${!!apiKey}`,
          );
          const packet = generateHHWOffline(body);
          await addLog(userEmail, "Generate HHW (Offline)", `Subjects: ${body.subjects.join(", ")} - Class ${body.className}`);
          return new Response(
            JSON.stringify({
              packet,
              header: {
                schoolName: body.schoolName,
                schoolAddress: body.schoolAddress,
                className: body.className,
                title: body.title,
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
          `Class:${body.className} Subjects:${body.subjects.join(",")} Tone:${body.tone === "premium" ? "premium" : "standard"} Title:${body.title}` +
          (body.instructions ? ` Instructions:${body.instructions}` : "") +
          `\nSOURCE: ${trimmedSource || "(none)"}` +
          (siteText ? ` SITE: ${siteText}` : "") +
          `\nGenerate holiday homework JSON.`;

        try {
          const aiRes = await fetch(
            // gemini-2.5-flash: the model this API key has quota for.
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
                contents: [{ role: "user", parts: [{ text: userPrompt }] }],
                generationConfig: {
                  temperature: 0.5,
                  maxOutputTokens: 8192,
                },
              }),
            },
          );

          if (!aiRes.ok) {
            const errText = await aiRes.text();
            console.error("[generate-hhw] Gemini error:", aiRes.status, errText);
            throw new Error(`Gemini API failed with status ${aiRes.status}: ${errText}`);
          }

          const aiJson = (await aiRes.json()) as {
            candidates?: {
              content?: {
                parts?: { text?: string; thought?: boolean }[];
              };
            }[];
          };

          const parts = aiJson.candidates?.[0]?.content?.parts ?? [];
          const responsePart = parts.find((p) => !p.thought) ?? parts[0];
          let raw = responsePart?.text ?? "";

          raw = raw
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```\s*$/i, "")
            .trim();

          if (!raw.startsWith("{")) {
            const match = raw.match(/\{[\s\S]*\}/);
            raw = match ? match[0] : "{}";
          }

          const parsed = JSON.parse(raw);
          await addLog(userEmail, "Generate HHW (AI)", `Subjects: ${body.subjects.join(", ")} - Class ${body.className}`);

          return new Response(
            JSON.stringify({
              packet: parsed,
              header: {
                schoolName: body.schoolName,
                schoolAddress: body.schoolAddress,
                className: body.className,
                title: body.title,
                isOffline: false,
              },
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          console.warn(
            "[generate-hhw] AI generation failed, falling back to local generator:",
            errorMsg,
          );
          const packet = generateHHWOffline(body);
          await addLog(userEmail, "Generate HHW (AI Fallback)", `Subjects: ${body.subjects.join(", ")} - Class ${body.className} - Error: ${errorMsg}`);
          return new Response(
            JSON.stringify({
              packet,
              header: {
                schoolName: body.schoolName,
                schoolAddress: body.schoolAddress,
                className: body.className,
                title: body.title,
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
