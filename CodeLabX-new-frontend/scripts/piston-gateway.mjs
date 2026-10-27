import { timingSafeEqual } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const EXECUTE_PATH = '/api/v2/execute';
const MAX_REQUEST_BYTES = 2 * 1024 * 1024;
const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
const UPSTREAM_TIMEOUT_MS = 20_000;
const ALLOWED_LANGUAGES = new Set(['java', 'python', 'sqlite3', 'nasm64']);

function json(res, status, body, extraHeaders = {}) {
  const data = Buffer.from(JSON.stringify(body));
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': data.length,
    'cache-control': 'no-store',
    ...extraHeaders,
  });
  res.end(data);
}

function matchesAuthorization(header, token) {
  if (typeof header !== 'string') return false;
  const supplied = Buffer.from(header);
  const expected = Buffer.from(`Bearer ${token}`);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

async function readBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_REQUEST_BYTES) return null;
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export function createPistonGateway({ token, upstreamUrl = 'http://127.0.0.1:2000/api/v2/execute' }) {
  if (typeof token !== 'string' || token.length < 32) {
    throw new Error('Piston gateway token must contain at least 32 characters.');
  }
  const upstream = new URL(upstreamUrl);
  if (upstream.protocol !== 'http:' || upstream.hostname !== '127.0.0.1' || upstream.pathname !== EXECUTE_PATH) {
    throw new Error('Piston gateway upstream must be the local Piston execution endpoint.');
  }

  const server = http.createServer(async (req, res) => {
    if (req.url !== EXECUTE_PATH) {
      json(res, 404, { error: 'Not found.' });
      return;
    }
    if (req.method !== 'POST') {
      json(res, 405, { error: 'Method not allowed.' }, { allow: 'POST' });
      return;
    }
    if (!matchesAuthorization(req.headers.authorization, token)) {
      json(res, 401, { error: 'Unauthorized.' }, { 'www-authenticate': 'Bearer' });
      return;
    }
    if (!req.headers['content-type']?.toLowerCase().startsWith('application/json')) {
      json(res, 415, { error: 'JSON required.' });
      return;
    }

    const body = await readBody(req);
    if (body === null) {
      json(res, 413, { error: 'Request too large.' });
      return;
    }
    let payload;
    try {
      payload = JSON.parse(body.toString('utf8'));
    } catch {
      json(res, 400, { error: 'Malformed JSON.' });
      return;
    }
    if (!payload || !ALLOWED_LANGUAGES.has(payload.language)
      || !Array.isArray(payload.files) || payload.files.length === 0
      || payload.files.some((file) => !file || typeof file.name !== 'string' || typeof file.content !== 'string')) {
      json(res, 400, { error: 'Invalid execution request.' });
      return;
    }

    try {
      const upstreamResponse = await fetch(upstream, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body,
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      });
      const reader = upstreamResponse.body?.getReader();
      const chunks = [];
      let size = 0;
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > MAX_RESPONSE_BYTES) {
            await reader.cancel();
            json(res, 502, { error: 'Execution provider response too large.' });
            return;
          }
          chunks.push(Buffer.from(value));
        }
      }
      const responseBody = Buffer.concat(chunks);
      res.writeHead(upstreamResponse.status, {
        'content-type': upstreamResponse.headers.get('content-type') || 'application/json',
        'content-length': responseBody.length,
        'cache-control': 'no-store',
      });
      res.end(responseBody);
    } catch {
      json(res, 502, { error: 'Local execution provider unavailable.' });
    }
  });

  server.headersTimeout = 10_000;
  server.requestTimeout = 25_000;
  return server;
}

async function main() {
  const token = (await readFile(resolve(PROJECT_ROOT, '.piston-gateway-secret'), 'utf8')).trim();
  const port = Number(process.env.PISTON_GATEWAY_PORT || 2100);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PISTON_GATEWAY_PORT.');
  const server = createPistonGateway({ token });
  server.listen(port, '127.0.0.1', () => {
    process.stdout.write(`Authenticated Piston gateway listening on 127.0.0.1:${port}\n`);
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(() => {
    process.stderr.write('Piston gateway could not start; check its ignored local secret file and port.\n');
    process.exitCode = 1;
  });
}
