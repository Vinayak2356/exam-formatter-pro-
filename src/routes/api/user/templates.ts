import { createFileRoute } from "@tanstack/react-router";
import { saveTemplate, getUserTemplates, deleteTemplate } from "@/lib/logger.server";

// Reusing verifyAuth logic
async function verifyAuth(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Response(JSON.stringify({ error: "Unauthorized: Missing header" }), { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Response(JSON.stringify({ error: "Server configuration missing" }), { status: 500 });
  }

  try {
    const decoded = (await import("jsonwebtoken")).default.verify(token, JWT_SECRET) as {
      email: string;
    };
    return { email: decoded.email };
  } catch {
    throw new Response(JSON.stringify({ error: "Unauthorized: Invalid token" }), { status: 401 });
  }
}

export const Route = createFileRoute("/api/user/templates")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const { email } = await verifyAuth(request);
          const templates = await getUserTemplates(email);
          return new Response(JSON.stringify({ templates }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          if (err instanceof Response) return err;
          return new Response(JSON.stringify({ error: err.message || "Server error" }), {
            status: 500,
          });
        }
      },
      POST: async ({ request }) => {
        try {
          const { email } = await verifyAuth(request);
          const body = await request.json();
          const { title, mode, content } = body;

          if (!title || !mode || !content) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
          }

          const template = await saveTemplate(email, title, mode, content);
          return new Response(JSON.stringify({ success: true, template }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          if (err instanceof Response) return err;
          return new Response(JSON.stringify({ error: err.message || "Server error" }), {
            status: 500,
          });
        }
      },
      DELETE: async ({ request }) => {
        try {
          const { email } = await verifyAuth(request);
          const url = new URL(request.url);
          const id = url.searchParams.get("id");

          if (!id) {
            return new Response(JSON.stringify({ error: "Missing template id" }), { status: 400 });
          }

          await deleteTemplate(email, id);
          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          if (err instanceof Response) return err;
          return new Response(JSON.stringify({ error: err.message || "Server error" }), {
            status: 500,
          });
        }
      },
    },
  },
});
