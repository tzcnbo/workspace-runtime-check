import app from "./app.js";

const port = Number(process.env.PORT || process.env.API_PORT || 8080);
const host = process.env.HOST || "0.0.0.0";

function timeoutMs(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

const server = app.listen(port, host, () => {
  console.log(`OpenRouter compatible proxy listening on http://${host}:${port}`);
  console.log(
    `HTTP timeouts: request=${server.requestTimeout}ms, headers=${server.headersTimeout}ms, idle=${server.timeout}ms, keepAlive=${server.keepAliveTimeout}ms`,
  );
});

// Long streaming model responses can run past Node's default 300_000ms
// requestTimeout. Disable by default inside the container and keep everything
// configurable via env for hosts that prefer hard caps.
server.requestTimeout = timeoutMs("HTTP_REQUEST_TIMEOUT_MS", 0);
server.headersTimeout = timeoutMs("HTTP_HEADERS_TIMEOUT_MS", 0);
server.timeout = timeoutMs("HTTP_IDLE_TIMEOUT_MS", 0);
server.keepAliveTimeout = timeoutMs("HTTP_KEEP_ALIVE_TIMEOUT_MS", 65_000);
