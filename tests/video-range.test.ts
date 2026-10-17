import test from "node:test";
import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import { onRequest, VIDEO_BYTES } from "../functions/videos/mini-vsl.webm.js";

test("tamanho de fallback corresponde ao WebM publicado", async () => {
  assert.equal((await stat("public/videos/mini-vsl.webm")).size, VIDEO_BYTES);
});

const bytes = new Uint8Array(100).map((_, index) => index);
async function fetchVideo(range?: string, method = "GET", ifRange?: string) {
  const request = new Request("https://example.com/videos/mini-vsl.webm", { method, headers: { ...(range ? { Range: range } : {}), ...(ifRange ? { "If-Range": ifRange } : {}) } });
  return onRequest({ request, env: { ASSETS: { fetch: async (input: Request) => {
    assert.equal(input.headers.has("Range"), false);
    return new Response(input.method === "HEAD" ? null : bytes, { headers: { "Content-Length": "100", "Content-Type": "video/webm", ETag: '"video-v1"' } });
  } } } });
}

test("vídeo entrega intervalos, sufixos e final aberto com os bytes corretos", async () => {
  for (const [range, start, end] of [["bytes=10-19", 10, 19], ["bytes=-10", 90, 99], ["bytes=95-", 95, 99], ["bytes=95-200", 95, 99]] as const) {
    const response = await fetchVideo(range);
    assert.equal(response.status, 206);
    assert.equal(response.headers.get("Content-Range"), `bytes ${start}-${end}/100`);
    assert.deepEqual(new Uint8Array(await response.arrayBuffer()), bytes.slice(start, end + 1));
  }
});
test("vídeo rejeita intervalos impossíveis sem servir bytes incorretos", async () => {
  for (const range of ["bytes=100-", "bytes=20-10", "bytes=-0"]) {
    const response = await fetchVideo(range);
    assert.equal(response.status, 416);
    assert.equal(response.headers.get("Content-Range"), "bytes */100");
  }
});
test("vídeo preserva GET, HEAD e If-Range sem conceder escrita", async () => {
  assert.equal((await fetchVideo()).status, 200);
  const head = await fetchVideo(undefined, "HEAD");
  assert.equal(await head.text(), "");
  assert.equal(head.headers.get("Accept-Ranges"), "bytes");
  assert.equal((await fetchVideo("bytes=1-2", "GET", '"old"')).status, 200);
  assert.equal((await fetchVideo(undefined, "POST")).status, 405);
});
