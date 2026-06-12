import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/register")({
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

          const passwordHash = await (await import("bcryptjs")).default.hash(password, 10);

          try {
            await db.query("INSERT INTO auth_users (email, password_hash) VALUES ($1, $2)", [
              email,
              passwordHash,
            ]);
          } catch (err: any) {
            if (err.code === "23505") {
              // unique violation
              return new Response(JSON.stringify({ error: "Email already registered" }), {
                status: 400,
              });
            }
            throw err;
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
          console.error("[Auth] Register error:", err);
          return new Response(JSON.stringify({ error: "Registration failed" }), { status: 500 });
        }
      },
    },
  },
});
