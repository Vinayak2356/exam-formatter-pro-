import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/export-docx")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          if (!body || !body.html) {
            return new Response(JSON.stringify({ error: "Missing HTML" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const HTMLtoDOCX = (await import("html-to-docx")).default;
          
          const fileBuffer = await HTMLtoDOCX(body.html, null, {
            table: { row: { cantSplit: true } },
            footer: true,
            pageNumber: true,
          });

          return new Response(fileBuffer, {
            headers: {
              "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "Content-Disposition": 'attachment; filename="document.docx"',
            },
          });
        } catch (error) {
          console.error("DOCX Export Error:", error);
          return new Response(JSON.stringify({ error: "Export failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
