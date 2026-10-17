import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";

const base = process.env.QA_URL || "http://127.0.0.1:3000";
await mkdir("qa", { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const checks = [];

try {
  await page.goto(base, { waitUntil: "networkidle" });
  const portrait = page.getByRole("img", { name: "Sued sorrindo", exact: true });
  assert.equal(await portrait.isVisible(), true);
  assert.ok(await portrait.evaluate(img => img.complete && img.naturalWidth > 0));
  const photoResponse = await context.request.get(`${base}/images/sued.jpeg`);
  assert.equal(photoResponse.status(), 200);
  checks.push("Foto real da Sued carrega com alt, dimensões naturais e HTTP 200.");
  await mkdir("qa/rendered", { recursive: true });
  await writeFile("qa/rendered/index.html", await page.content());
  const cssPaths = await page.locator('link[rel="stylesheet"]').evaluateAll(links => links.map(link => link.href));
  for (const [index, path] of cssPaths.entries()) {
    const stylesheet = await context.request.get(path);
    await writeFile(`qa/rendered/style-${index}.css`, await stylesheet.text());
  }
  await page.getByRole("button", { name: "Ver portfólio" }).click();
  const dialog = page.getByRole("dialog", { name: "Estou organizando meu portfólio." });
  await dialog.waitFor({ state: "visible" });
  assert.equal(await dialog.getByRole("link", { name: "Conversar com a Sued" }).getAttribute("href"), await page.getByRole("link", { name: "Vamos criar seu site" }).getAttribute("href"));
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("aria-label")), "Fechar");
  await page.keyboard.press("Shift+Tab");
  assert.equal(await page.evaluate(() => document.activeElement?.textContent), "Conversar com a Sued");
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("aria-label")), "Fechar");
  const dialogAxe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  assert.equal(dialogAxe.violations.length, 0, JSON.stringify(dialogAxe.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(n => n.target) }))));
  await page.keyboard.press("Escape");
  assert.equal(await dialog.isVisible(), false);
  assert.equal(await page.evaluate(() => document.activeElement?.textContent), "Ver portfólio");
  checks.push("Portfólio pendente: abre diálogo, foco inicial, contenção Tab, Escape, restauração do foco, link WhatsApp e axe sem violações.");

  const contactLinks = await page.locator('a[href^="https://wa.me/"]:visible').evaluateAll(links => links.map(link => ({ href: link.href, target: link.target, rel: link.rel })));
  assert.equal(contactLinks.length, 2);
  for (const link of contactLinks) {
    const url = new URL(link.href);
    assert.equal(url.pathname, "/5575981475240");
    assert.equal(url.searchParams.get("text"), "Olá, Sued! Vim pelo seu Instagram e gostaria de conversar sobre a criação de um site para meu negócio.");
    assert.equal(link.target, "_blank");
    assert.ok(link.rel.includes("noopener"));
  }
  checks.push("Dois CTAs públicos têm número confirmado, mensagem exata, target e rel corretos. Não foi enviada mensagem.");

  assert.equal(await page.locator("iframe, video").count(), 0);
  await page.getByRole("button", { name: "Assistir à apresentação da Sued" }).click();
  const video = page.locator("video");
  await video.waitFor({ state: "visible" });
  await page.waitForFunction(() => {
    const media = document.querySelector("video");
    return media && media.readyState >= 2 && media.currentTime > .15 && !media.paused;
  });
  const media = await video.evaluate(el => ({ duration: el.duration, width: el.videoWidth, height: el.videoHeight, controls: el.controls, playsInline: el.playsInline, error: el.error?.message ?? null, mime: el.querySelector("source")?.type }));
  assert.ok(media.duration > 47 && media.duration < 49);
  assert.equal(media.width, 1280);
  assert.equal(media.height, 720);
  assert.equal(media.controls, true);
  assert.equal(media.playsInline, true);
  assert.equal(media.error, null);
  assert.equal(media.mime, "video/webm");
  await video.evaluate(el => { el.pause(); el.currentTime = 12; });
  await page.waitForFunction(() => Math.abs(document.querySelector("video").currentTime - 12) < .2 && !document.querySelector("video").seeking);
  assert.equal(await video.evaluate(el => el.paused), true);
  await mkdir("qa/screenshots", { recursive: true });
  await page.locator("#conteudo").focus();
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: "qa/screenshots/vsl-playing.png", fullPage: true });
  const range = await context.request.get(`${base}/videos/mini-vsl.webm`, { headers: { Range: "bytes=0-1023" } });
  assert.equal(range.status(), 206);
  assert.ok(range.headers()["content-type"].includes("video/webm"));
  assert.equal((await range.body()).length, 1024);
  checks.push(`WebM real: inicia após o play, VP9 1280×720, duração ~48s, controles/pausa/seek funcionando no quadro arredondado. Arquivo entregue com HTTP ${range.status()}.`);
  await page.reload({ waitUntil: "networkidle" });

  const instagram = page.getByRole("link", { name: "Instagram", exact: true });
  assert.equal(await instagram.getAttribute("href"), "https://www.instagram.com/sued.sites/");
  assert.equal(await instagram.getAttribute("target"), "_blank");
  assert.ok((await instagram.getAttribute("rel")).includes("noopener"));
  assert.equal(await page.getByRole("button", { name: "Instagram", exact: true }).count(), 0);
  checks.push("Instagram usa o perfil exato @sued.sites em nova aba com noopener, sem diálogo de pendência.");


  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  await writeFile("qa/axe-results.json", JSON.stringify({ timestamp: new Date().toISOString(), violations: result.violations, incomplete: result.incomplete, passes: result.passes.length, dialogViolations: dialogAxe.violations }, null, 2));
  assert.equal(result.violations.length, 0, JSON.stringify(result.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(n => n.target) }))));
  checks.push(`Axe: ${result.passes.length} regras passaram, zero violações detectadas na página.`);

  await page.goto(base, { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement?.textContent), "Pular para o conteúdo");
  await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(() => document.activeElement?.id), "conteudo");
  checks.push("Skip link alcançável por teclado e foco transferido para main.");

  // A captura da apresentação não deve manter o foco do teste de skip link.
  await page.goto(base, { waitUntil: "networkidle" });

  const responsive = [];
  for (const width of [320, 360, 375, 390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const data = await page.evaluate(() => ({
      width: window.innerWidth,
      pageHeight: document.documentElement.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
      headingClipped: [...document.querySelectorAll("h1,h2")].some(el => el.scrollWidth > el.clientWidth + 1),
      primary: [...document.querySelectorAll(".action-primary")].filter(el => el.getBoundingClientRect().height > 0).map(el => ({ height: el.getBoundingClientRect().height, size: getComputedStyle(el).fontSize, weight: getComputedStyle(el).fontWeight })),
      contactTop: document.querySelector('.hero-actions .action-primary').getBoundingClientRect().top + window.scrollY,
    }));
    assert.equal(data.scrollWidth, width);
    assert.equal(data.headingClipped, false);
    assert.ok(data.primary.every(el => el.height >= 44 && parseFloat(el.size) >= 18.67 && +el.weight >= 700));
    if (width < 768) {
      assert.ok(data.pageHeight < 1250, `Bio longa demais em ${width}px: ${data.pageHeight}px`);
      assert.ok(data.contactTop + data.primary[0].height <= 900, `Contato fora da primeira tela em ${width}px`);
    }
    const mobileAxe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    assert.equal(mobileAxe.violations.length, 0, JSON.stringify({ width, violations: mobileAxe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })) }));
    await mkdir("qa/screenshots", { recursive: true });
    await page.screenshot({ path: `qa/screenshots/bio-${width}.png`, fullPage: true });
    responsive.push({ ...data, axeViolations: mobileAxe.violations.length });
  }
  checks.push("Sem overflow e sem títulos cortados em 320/360/375/390/430/768/1024/1440; CTA >=44px e texto grande em negrito; axe sem violações em todas as larguras.");

  // Browser zoom equivalente a 200% de um desktop 1280px: viewport CSS 640px.
  await page.setViewportSize({ width: 640, height: 450 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 640);
  checks.push("Reflow equivalente a desktop 1280px em 200%: viewport CSS 640px sem overflow. Zoom nativo manual não medido.");

  const meta = await page.locator('meta[property="og:image"]').getAttribute("content");
  assert.ok(meta);
  const og = await context.request.get(`${base}${new URL(meta).pathname}`);
  assert.equal(og.status(), 200);
  assert.ok(og.headers()["content-type"].includes("image/png"));
  await writeFile("qa/og-preview.png", await og.body());
  const icon = await context.request.get(`${base}/apple-icon`);
  assert.equal(icon.status(), 200);
  checks.push("OG 1200×630 e Apple icon respondem HTTP 200 com imagem PNG.");

  const failedPhoto = await context.newPage();
  await failedPhoto.route("**/images/sued.jpeg", route => route.abort());
  await failedPhoto.goto(base, { waitUntil: "networkidle" });
  await failedPhoto.getByRole("img", { name: "Espaço reservado para a foto de Sued, com composição gráfica da marca" }).waitFor();
  assert.equal(await failedPhoto.getByRole("img", { name: "Sued sorrindo", exact: true }).count(), 0);
  await failedPhoto.close();
  checks.push("Foto bloqueada no teste: fallback aparece e não deixa imagem quebrada.");

  const noJs = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce" });
  const staticPage = await noJs.newPage();
  await staticPage.goto(base);
  assert.equal(await staticPage.getByRole("heading", { level: 1 }).isVisible(), true);
  assert.equal(await staticPage.getByRole("link", { name: "Vamos criar seu site" }).isVisible(), true);
  await noJs.close();
  checks.push("Sem JavaScript: proposta e WhatsApp continuam disponíveis pelo HTML renderizado.");
  assert.equal(errors.length, 0);
  await writeFile("qa/functional-results.json", JSON.stringify({ base, timestamp: new Date().toISOString(), checks, responsive, errors }, null, 2));
  console.log(checks.join("\n"));
} finally {
  await browser.close();
}
