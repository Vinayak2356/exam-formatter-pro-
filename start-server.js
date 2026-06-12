import server from './dist/server/server.js';

const port = process.env.PORT || 3000;

Bun.serve({
  port: port,
  fetch(request) {
    return server.fetch(request);
  }
});

console.log(`Server running on http://localhost:${port}`);
