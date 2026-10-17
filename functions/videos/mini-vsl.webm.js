// Pages serves static assets with HTTP 200 even for Range requests.
// Only this video uses a Function; the rest of the site stays static.
export async function onRequest({ request, env }) {
  if (!["GET", "HEAD"].includes(request.method)) {
    return new Response(null, { status: 405, headers: { Allow: "GET, HEAD" } });
  }
  const asset = await env.ASSETS.fetch(new Request(request.url, { method: request.method }));
  if (asset.status !== 200) return asset;
  const headers = new Headers(asset.headers);
  headers.set("Accept-Ranges", "bytes");
  const size = Number(headers.get("Content-Length"));
  const range = request.headers.get("Range");
  const ifRange = request.headers.get("If-Range");
  const match = range?.match(/^bytes=(\d*)-(\d*)$/);
  if (request.method === "HEAD" || !size || !match || (!match[1] && !match[2]) || (ifRange && ifRange !== headers.get("ETag"))) {
    return new Response(asset.body, { status: 200, headers });
  }
  const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
  const end = match[1] ? (match[2] ? Math.min(Number(match[2]), size - 1) : size - 1) : size - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= size || end < start) {
    await asset.body?.cancel();
    headers.set("Content-Range", `bytes */${size}`);
    headers.set("Content-Length", "0");
    return new Response(null, { status: 416, headers });
  }
  headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  headers.set("Content-Length", String(end - start + 1));
  const reader = asset.body.getReader();
  let offset = 0;
  const body = new ReadableStream({
    async pull(controller) {
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) { controller.close(); return; }
          const chunkStart = offset;
          offset += value.byteLength;
          if (offset <= start) continue;
          controller.enqueue(value.subarray(Math.max(0, start - chunkStart), Math.min(value.byteLength, end + 1 - chunkStart)));
          if (offset > end) { controller.close(); await reader.cancel(); }
          return;
        }
      } catch (error) { controller.error(error); await reader.cancel().catch(() => {}); }
    },
    cancel(reason) { return reader.cancel(reason); },
  });
  return new Response(body, { status: 206, headers });
}
