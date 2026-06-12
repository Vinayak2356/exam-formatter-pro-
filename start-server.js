import server from './dist/server/server.js';
import { join } from 'path';

const port = process.env.PORT || 3000;

Bun.serve({
  port: port,
  async fetch(request) {
    const url = new URL(request.url);
    
    // Serve static assets from dist/client if the file exists (excluding root SSR)
    if (url.pathname !== '/') {
      const filePath = join(process.cwd(), 'dist', 'client', url.pathname);
      const file = Bun.file(filePath);
      if (await file.exists()) {
        return new Response(file);
      }
    }
    
    return server.fetch(request);
  }
});

console.log(`Server running on http://localhost:${port}`);
