import test from 'node:test';
import assert from 'node:assert/strict';
import { ALLOWED_HOSTS, validateUrl, requestVideo } from '../src/api.js';

for (const host of ALLOWED_HOSTS) {
  test(`accept platform ${host}`, () => assert.equal(validateUrl(`https://${host}/video/123`), true));
}
for (const url of ['http://x.com/a/status/1', 'https://x.com/', 'https://x.com.evil.test/video', 'https://user@x.com/video', 'https://localhost/video', 'not a url']) {
  test(`reject invalid URL ${url}`, () => assert.equal(validateUrl(url), false));
}
const reply = (body, options = {}) => async () => new Response(body, options);
test('surface backend error without creating a file', async () => {
  await assert.rejects(requestVideo('', 'download', 'url', { fetchImpl: reply(JSON.stringify({detail:'Platform blocked access.'}), {status:502}) }), /Platform blocked/);
});
test('explain Render HTML error', async () => {
  await assert.rejects(requestVideo('', 'download', 'url', { fetchImpl: reply('<html>Unavailable</html>', {status:503}) }), /starting/);
});
test('reject zero-byte MP4', async () => {
  await assert.rejects(requestVideo('', 'download', 'url', { fetchImpl: reply('', {headers:{'content-type':'video/mp4'}}) }), /empty/);
});
test('reject JSON masquerading as a download', async () => {
  await assert.rejects(requestVideo('', 'download', 'url', { fetchImpl: reply('{}', {headers:{'content-type':'application/json'}}) }), /did not return an MP4/);
});
test('reject corrupt MP4 body', async () => {
  await assert.rejects(requestVideo('', 'download', 'url', { fetchImpl: reply('not a video', {headers:{'content-type':'video/mp4'}}) }), /invalid MP4/);
});
test('reject truncated response', async () => {
  await assert.rejects(requestVideo('', 'download', 'url', { fetchImpl: reply('123', {headers:{'content-type':'video/mp4', 'content-length':'100'}}) }), /incomplete/);
});
test('reject metadata without video formats', async () => {
  await assert.rejects(requestVideo('', 'analyze', 'url', { fetchImpl: reply(JSON.stringify({title:'No formats'})) }), /downloadable video/);
});
test('post the exact analyzed URL and accept metadata', async () => {
  const data = await requestVideo('/backend', 'analyze', 'https://x.com/a/status/1', {fetchImpl: async (url, options) => {
    assert.equal(url, '/backend/api/analyze');
    assert.deepEqual(JSON.parse(options.body), {url:'https://x.com/a/status/1'});
    return new Response(JSON.stringify({title:'Video', available_formats:[{ext:'mp4'}]}));
  }});
  assert.equal(data.title, 'Video');
});
test('abort slow server with explicit message', async () => {
  await assert.rejects(requestVideo('', 'analyze', 'url', {timeoutMs:5, fetchImpl: (_url, {signal}) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
  })}), /timed out/);
});
test('explain interrupted fetch', async () => {
  await assert.rejects(requestVideo('', 'download', 'url', {fetchImpl: async () => {throw new TypeError('Failed to fetch');}}), /transfer was interrupted/);
});
