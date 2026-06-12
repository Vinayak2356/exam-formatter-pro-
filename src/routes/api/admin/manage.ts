import { createFileRoute } from "@tanstack/react-router";
import { getLogs, getAddedUsers, addAddedUser } from "@/lib/logger.server";
import { createClient } from "@supabase/supabase-js";

async function verifyAdmin(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Response(JSON.stringify({ error: "Unauthorized: Missing header" }), { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Response(JSON.stringify({ error: "Server configuration missing" }), { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { storage: undefined, persistSession: false },
  });

  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims || data.claims.email?.toLowerCase() !== "admin@school.com") {
    throw new Response(JSON.stringify({ error: "Unauthorized: Admin access required" }), { status: 401 });
  }

  return { email: data.claims.email };
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
            const logs = await getLogs();
            return new Response(JSON.stringify({ logs }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "users") {
            const users = await getAddedUsers();
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

          const SUPABASE_URL = process.env.SUPABASE_URL;
          const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

          // Secondary client ensures the admin's session remains untouched
          const secondarySupabase = createClient(SUPABASE_URL!, SUPABASE_PUBLISHABLE_KEY!, {
            auth: {
              persistSession: false,
              autoRefreshToken: false,
              detectSessionInUrl: false,
            },
          });

          const { data, error } = await secondarySupabase.auth.signUp({
            email,
            password,
          });

          if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 400 });
          }

          // Register in local users list
          await addAddedUser(email);

          return new Response(
            JSON.stringify({
              success: true,
              user: data.user,
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
    },
  },
});
