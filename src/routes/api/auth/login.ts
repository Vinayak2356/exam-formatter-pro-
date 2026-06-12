import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { email, password } = await request.json();
          if (!email || !password) {
            return new Response(JSON.stringify({ error: "Email and password are required" }), {
              status: 400,
            });
          }

          const db = (await import("@/lib/logger.server")).getPool();
          if (!db)
            return new Response(JSON.stringify({ error: "Database not available" }), {
              status: 500,
            });

          const res = await db.query("SELECT password_hash FROM registered_users WHERE email = $1", [
            email,
          ]);
          if (res.rows.length === 0) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
          }

          const isValid = await (
            await import("bcryptjs")
          ).default.compare(password, res.rows[0].password_hash);
          if (!isValid) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
          }

          const token = (await import("jsonwebtoken")).default.sign(
            { email },
            process.env.JWT_SECRET || "fallback_secret",
            { expiresIn: "7d" },
          );

          return new Response(
            JSON.stringify({ session: { access_token: token, user: { email } } }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (err) {
          console.error("[Auth] Login error:", err);
          return new Response(JSON.stringify({ error: "Login failed" }), { status: 500 });
        }
      },
    },
  },
});
