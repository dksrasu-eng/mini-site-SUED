import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const browser = await chromium.launch({ headless: true });
const base = process.env.QA_URL || "http://127.0.0.1:3000";
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "no-preference" });
const page = await context.newPage();
const errors = [];
page.on("pageerror", error => errors.push(error.message));
const checks = [];
await mkdir("qa/particles", { recursive: true });
async function pixels() {
  return page.locator(".particle-name-canvas").evaluate(canvas => Array.from(canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data));
}
function difference(a, b) {
  assert.equal(a.length, b.length);
  let total = 0;
  for (let i = 3; i < a.length; i += 4) total += Math.abs(a[i] - b[i]);
  return total / (a.length / 4);
}
try {
  await page.goto(base, { waitUntil: "networkidle" });
  const name = page.locator(".particle-name");
  await page.waitForFunction(() => document.querySelector('.particle-name')?.dataset.particles === 'ready' && document.querySelector('.particle-name')?.dataset.particleState === 'idle');
  assert.equal(await name.innerText(), "Sued.");
  assert.equal(await name.locator("canvas").getAttribute("aria-hidden"), "true");
  const baseline = await pixels();
  await page.screenshot({ path: "qa/particles/desktop-light.png", fullPage: false });
  const box = await name.boundingBox();
  await page.mouse.move(box.x + box.width * .38, box.y + box.height * .55, { steps: 8 });
  await page.waitForFunction(before => {
    const canvas = document.querySelector('.particle-name-canvas');
    const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    let total = 0;
    for (let i = 3; i < data.length; i += 4) total += Math.abs(data[i] - before[i]);
    return total / (data.length / 4) > 1;
  }, baseline);
  const active = await pixels();
  await page.screenshot({ path: "qa/particles/hover-light.png", fullPage: false });
  await page.mouse.move(1, 1);
  await page.waitForFunction(() => document.querySelector('.particle-name')?.dataset.particleState === 'idle');
  const restored = await pixels();
  const duringDifference = difference(baseline, active);
  const afterDifference = difference(baseline, restored);
  assert.ok(duringDifference > 1, `Sem reação visível: ${duringDifference}`);
  assert.ok(afterDifference < duringDifference / 2, JSON.stringify({ duringDifference, afterDifference }));
  checks.push("Canvas muda de pixels ao aproximar o cursor; o nome retorna e o RAF entra em repouso depois da saída.");

  await page.getByRole("button", { name: "Usar tema escuro" }).click();
  const matchingInkPixels = await name.evaluate(el => {
    const expected = getComputedStyle(el).color.match(/\d+/g).slice(0, 3).map(Number);
    const canvas = el.querySelector("canvas");
    const data = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
    let count = 0;
    for (let i = 0; i < data.length; i += 4) if (data[i + 3] > 240 && expected.every((v, channel) => Math.abs(v - data[i + channel]) < 3)) count++;
    return count;
  });
  assert.ok(matchingInkPixels > 100);
  await page.screenshot({ path: "qa/particles/desktop-dark.png", fullPage: false });
  checks.push("Troca de tema reconstrói as partículas na cor do texto, sem outra família tipográfica.");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForFunction(() => document.querySelector('.particle-name')?.dataset.particleState === 'reduced');
  assert.equal(await name.locator(".particle-name-label").evaluate(el => getComputedStyle(el).opacity), "1");
  assert.equal(await name.locator("canvas").isVisible(), false);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator(".intro-signature").waitFor({ state: "hidden" });
  await page.waitForFunction(() => document.querySelector('.particle-name')?.dataset.particles === 'ready');
  await page.setViewportSize({ width: 320, height: 900 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 320);
  checks.push("Preferência de movimento reduzido mostra o texto estático; resize para 320px mantém o nome e não cria overflow.");
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForFunction(() => document.querySelector('.particle-name')?.dataset.particles === 'ready');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
    await page.screenshot({ path: `qa/particles/dark-${width}.png`, fullPage: false });
  }


  await page.setViewportSize({ width: 1280, height: 360 });
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForFunction(() => document.querySelector('.particle-name')?.dataset.particleState === 'paused');
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForFunction(() => document.querySelector('.particle-name')?.dataset.particleState === 'idle');
  checks.push("Fora da tela, a animação pausa; ao voltar, retoma e repousa.");

  await context.route("https://www.instagram.com/sued.sites/", route => route.fulfill({ contentType: "text/html", body: "<title>Instagram route test</title>" }));
  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("link", { name: "Instagram", exact: true }).click();
  const popup = await popupPromise;
  await popup.waitForURL("https://www.instagram.com/sued.sites/");
  await popup.close();
  checks.push("Clique no Instagram abre exatamente o link fornecido em nova aba; navegação interceptada no teste, sem login ou verificação do perfil.");

  const touchContext = await browser.newContext({ viewport: { width: 375, height: 900 }, isMobile: true, hasTouch: true, reducedMotion: "no-preference" });
  const touch = await touchContext.newPage();
  await touch.goto(base, { waitUntil: "networkidle" });
  await touch.waitForFunction(() => document.querySelector('.particle-name')?.dataset.particles === 'ready');
  await touch.locator(".particle-name").tap();
  await touch.waitForFunction(() => document.querySelector('.particle-name')?.dataset.particleState === 'idle');
  assert.equal(await touch.evaluate(() => document.documentElement.scrollWidth), 375);
  await touch.evaluate(() => scrollTo(0, 0));
  await touch.screenshot({ path: "qa/particles/mobile-light.png", fullPage: false });
  await touchContext.close();
  checks.push("Toque em 375px não bloqueia a página e as partículas voltam à palavra.");

  for (const mode of ["no-js", "canvas-unavailable"]) {
    const fallbackContext = await browser.newContext({ javaScriptEnabled: mode !== "no-js", reducedMotion: "no-preference" });
    if (mode === "canvas-unavailable") await fallbackContext.addInitScript(() => { HTMLCanvasElement.prototype.getContext = () => null; });
    const fallback = await fallbackContext.newPage();
    await fallback.goto(base, { waitUntil: "networkidle" });
    assert.equal(await fallback.locator(".particle-name-label").innerText(), "Sued.");
    assert.equal(await fallback.locator(".particle-name-label").evaluate(el => getComputedStyle(el).opacity), "1");
    assert.equal(await fallback.getByRole("link", { name: "Instagram", exact: true }).getAttribute("href"), "https://www.instagram.com/sued.sites/");
    await fallbackContext.close();
  }
  checks.push("Sem JavaScript ou canvas disponível, o nome e o link Instagram continuam no HTML.");
  assert.deepEqual(errors, []);
  await writeFile("qa/particles/results.json", JSON.stringify({ timestamp: new Date().toISOString(), base, duringDifference, afterDifference, matchingInkPixels, checks, errors }, null, 2));
  console.log(JSON.stringify({ duringDifference, afterDifference, matchingInkPixels }));
  console.log(checks.join("\n"));
} finally {
  await browser.close();
}
