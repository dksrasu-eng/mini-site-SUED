import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveVideo, safeWebUrl, whatsappUrl } from "../src/lib/links";
import { siteConfig } from "../src/config/site";

test("WhatsApp usa o número confirmado e preserva a mensagem com acentos", () => {
  const link = whatsappUrl(siteConfig.whatsapp.number, siteConfig.whatsapp.message);
  assert.ok(link);
  const url = new URL(link);
  assert.equal(url.hostname, "wa.me");
  assert.equal(url.pathname, "/5575981475240");
  assert.equal(url.searchParams.get("text"), siteConfig.whatsapp.message);
  assert.equal(whatsappUrl("", "Oi"), null);
});

test("destinos pendentes e protocolos executáveis não geram links", () => {
  assert.equal(safeWebUrl(""), null);
  assert.equal(safeWebUrl("javascript:alert(1)"), null);
  assert.equal(safeWebUrl("https://example.com"), "https://example.com/");
});

test("vídeo aceita YouTube, Vimeo privado, MP4 e WebM; rejeita iframe arbitrário", () => {
  assert.deepEqual(resolveVideo("https://youtu.be/abcdefghijk?t=3"), { kind: "embed", src: "https://www.youtube-nocookie.com/embed/abcdefghijk?rel=0" });
  assert.deepEqual(resolveVideo("https://www.youtube.com/watch?v=abcdefghijk"), resolveVideo("https://youtube.com/embed/abcdefghijk"));
  assert.deepEqual(resolveVideo("https://vimeo.com/123456/secret"), { kind: "embed", src: "https://player.vimeo.com/video/123456?h=secret" });
  assert.deepEqual(resolveVideo("/videos/apresentacao.mp4"), { kind: "file", src: "/videos/apresentacao.mp4" });
  assert.deepEqual(resolveVideo("/videos/mini-vsl.webm"), { kind: "file", src: "/videos/mini-vsl.webm" });
  assert.deepEqual(resolveVideo("https://example.com/apresentacao.webm?v=2"), { kind: "file", src: "https://example.com/apresentacao.webm?v=2" });
  assert.equal(resolveVideo("https://example.com/pretend-video").kind, "invalid");
  assert.equal(resolveVideo("https://youtube.com.evil.test/watch?v=abcdefghijk").kind, "invalid");
  assert.equal(resolveVideo("").kind, "missing");
});
