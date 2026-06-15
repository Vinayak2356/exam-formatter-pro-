import server from "./dist/server/server.js";
import { join } from "path";

const port = process.env.PORT || 3000;

const serverInstance = Bun.serve({
  hostname: "0.0.0.0",
  port: port,
  async fetch(request) {
    const url = new URL(request.url);

    // Serve static assets from dist/client if the file exists (excluding root SSR)
    if (url.pathname !== "/") {
      const filePath = join(process.cwd(), "dist", "client", url.pathname);
      const file = Bun.file(filePath);
      if (await file.exists()) {
        return new Response(file);
      }
    }

    return server.fetch(request);
  },
});

console.log(`Server running on http://${serverInstance.hostname}:${serverInstance.port}`);

// Graceful shutdown to prevent 'npm error signal SIGTERM' on Railway deployments
const gracefulShutdown = () => {
  console.log("Received shutdown signal. Stopping server gracefully...");
  serverInstance.stop(true);
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
