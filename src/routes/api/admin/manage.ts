import { createFileRoute } from "@tanstack/react-router";

async function verifyAdmin(request: Request) {
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
    // We allow either admin@school.com or admin2026@school.com for admin access
    if (
      decoded.email?.toLowerCase() !== "admin@school.com" &&
      decoded.email?.toLowerCase() !== "admin2026@school.com"
    ) {
      throw new Response(JSON.stringify({ error: "Unauthorized: Admin access required" }), {
        status: 401,
      });
    }
    return { email: decoded.email };
  } catch {
    throw new Response(JSON.stringify({ error: "Unauthorized: Invalid token" }), { status: 401 });
  }
}

export const Route = createFileRoute("/api/admin/manage")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          await verifyAdmin(request);
          const url = new URL(request.url);
          const action = url.searchParams.get("action");

          if (action === "logs") {
            const logs = await (await import("@/lib/logger.server")).getLogs();
            return new Response(JSON.stringify({ logs }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "users") {
            const users = await (await import("@/lib/logger.server")).getAddedUsers();
            return new Response(JSON.stringify({ users }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
        } catch (err: any) {
          if (err instanceof Response) return err;
          return new Response(JSON.stringify({ error: err.message || "Server error" }), {
            status: 500,
          });
        }
      },
      POST: async ({ request }) => {
        try {
          await verifyAdmin(request);

          let body: { email?: string; password?: string };
          try {
            body = await request.json();
          } catch {
            return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
          }

          const { email, password } = body;
          if (!email || !password) {
            return new Response(JSON.stringify({ error: "Email and password are required" }), {
              status: 400,
            });
          }

          const db = (await import("@/lib/logger.server")).getPool();
          if (!db) {
            return new Response(JSON.stringify({ error: "Database not available" }), {
              status: 500,
            });
          }

          const passwordHash = await (await import("bcryptjs")).default.hash(password, 10);

          try {
            await db.query("INSERT INTO registered_users (email, password_hash) VALUES ($1, $2)", [
              email,
              passwordHash,
            ]);
          } catch (err: any) {
            if (err.code === "23505") {
              return new Response(JSON.stringify({ error: "Email already exists" }), {
                status: 400,
              });
            }
            throw err;
          }

          // Register in local users list for the dashboard logging
          await (await import("@/lib/logger.server")).addAddedUser(email);

          return new Response(
            JSON.stringify({
              success: true,
              user: { email },
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        } catch (err: any) {
          if (err instanceof Response) return err;
          return new Response(JSON.stringify({ error: err.message || "Server error" }), {
            status: 500,
          });
        }
      },
      DELETE: async ({ request }) => {
        try {
          const { email: adminEmail } = await verifyAdmin(request);
          const url = new URL(request.url);
          const emailToDelete = url.searchParams.get("email");

          if (!emailToDelete) {
            return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
          }

          if (
            emailToDelete.toLowerCase() === "admin@school.com" ||
            emailToDelete.toLowerCase() === "admin2026@school.com"
          ) {
            return new Response(JSON.stringify({ error: "Cannot delete master admin accounts" }), {
              status: 403,
            });
          }

          const db = (await import("@/lib/logger.server")).getPool();
          if (!db) return new Response(JSON.stringify({ error: "DB error" }), { status: 500 });

          await db.query("DELETE FROM registered_users WHERE email = $1", [emailToDelete]);

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
      PUT: async ({ request }) => {
        try {
          await verifyAdmin(request);
          const body = await request.json();
          const { email, password } = body;

          if (!email || !password) {
            return new Response(JSON.stringify({ error: "Email and new password required" }), {
              status: 400,
            });
          }

          const db = (await import("@/lib/logger.server")).getPool();
          if (!db) return new Response(JSON.stringify({ error: "DB error" }), { status: 500 });

          const passwordHash = await (await import("bcryptjs")).default.hash(password, 10);
          const res = await db.query(
            "UPDATE registered_users SET password_hash = $1 WHERE email = $2",
            [passwordHash, email],
          );

          if (res.rowCount === 0) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
          }

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
