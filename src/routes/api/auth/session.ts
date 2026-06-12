import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/session")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const authHeader = request.headers.get("authorization");
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new Response(JSON.stringify({ session: null }), { status: 200 });
          }

          const token = authHeader.replace("Bearer ", "");
          const decoded = (await import("jsonwebtoken")).default.verify(
            token,
            process.env.JWT_SECRET || "fallback_secret",
          ) as { email: string };

          return new Response(JSON.stringify({ session: { user: { email: decoded.email } } }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          return new Response(JSON.stringify({ session: null }), { status: 200 });
        }
      },
    },
  },
});
