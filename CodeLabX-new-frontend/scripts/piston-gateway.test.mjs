import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import http from 'node:http';
import { once } from 'node:events';
import { createPistonGateway } from './piston-gateway.mjs';

const token = 'test-only-token-that-is-long-enough-to-pass';
let upstream;
let gateway;
let upstreamUrl;
let gatewayUrl;
const received = [];

before(async () => {
  upstream = http.createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    received.push({ url: req.url, authorization: req.headers.authorization, body: Buffer.concat(chunks).toString() });
    const body = Buffer.from(JSON.stringify({ run: { stdout: 'gateway-ok\n', stderr: '', code: 0 } }));
    res.writeHead(200, { 'content-type': 'application/json', 'content-length': body.length });
    res.end(body);
  });
  upstream.listen(0, '127.0.0.1');
  await once(upstream, 'listening');
  upstreamUrl = `http://127.0.0.1:${upstream.address().port}/api/v2/execute`;

  gateway = createPistonGateway({ token, upstreamUrl });
  gateway.listen(0, '127.0.0.1');
  await once(gateway, 'listening');
  gatewayUrl = `http://127.0.0.1:${gateway.address().port}`;
});

after(async () => {
  gateway?.close();
  upstream?.close();
  await Promise.all([once(gateway, 'close'), once(upstream, 'close')]);
});

test('authorized Java and Python execution requests are forwarded without forwarding the gateway secret', async () => {
  for (const language of ['java', 'python']) {
    const body = JSON.stringify({ language, version: 'test', files: [{ name: 'main', content: 'source' }], stdin: '' });
    const response = await fetch(`${gatewayUrl}/api/v2/execute`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body,
    });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).run.stdout, 'gateway-ok\n');
    assert.deepEqual(received.at(-1), { url: '/api/v2/execute', authorization: undefined, body });
  }
});

test('rejects missing or invalid authorization and does not contact Piston', async () => {
  const beforeCount = received.length;
  const response = await fetch(`${gatewayUrl}/api/v2/execute`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ language: 'java', files: [{ name: 'Main.java', content: 'x' }] }),
  });
  assert.equal(response.status, 401);
  assert.equal(received.length, beforeCount);
});

test('blocks administrative paths, wrong methods, unsupported languages, and malformed payloads', async () => {
  const admin = await fetch(`${gatewayUrl}/api/v2/packages`);
  assert.equal(admin.status, 404);
  const wrongMethod = await fetch(`${gatewayUrl}/api/v2/execute`);
  assert.equal(wrongMethod.status, 405);
  const unsupported = await fetch(`${gatewayUrl}/api/v2/execute`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ language: 'node', files: [{ name: 'main.js', content: 'x' }] }),
  });
  assert.equal(unsupported.status, 400);
  const malformed = await fetch(`${gatewayUrl}/api/v2/execute`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: '{',
  });
  assert.equal(malformed.status, 400);
});
