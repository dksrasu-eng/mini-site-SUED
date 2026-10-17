import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.QA_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ colorScheme: "dark", reducedMotion: "reduce" });
const page = await context.newPage();
const errors = [];
page.on("pageerror", error => errors.push(error.message));
const checks = [];
const results = [];
await mkdir("qa/themes", { recursive: true });

async function currentTheme() {
  return page.locator("html").getAttribute("data-theme");
}

try {
  await page.goto(base, { waitUntil: "networkidle" });
  assert.equal(await currentTheme(), "light");
  assert.equal(await page.getByRole("button", { name: "Usar tema claro" }).getAttribute("aria-pressed"), "true");
  checks.push("Primeira visita usa claro, inclusive quando o sistema prefere escuro.");

  const themeButtons = page.getByRole("group", { name: "Aparência" }).getByRole("button");
  assert.equal(await themeButtons.count(), 2);
  await page.getByRole("button", { name: "Usar tema escuro" }).focus();
  await page.keyboard.press("Enter");
  assert.equal(await currentTheme(), "dark");
  assert.equal(await page.evaluate(() => localStorage.getItem("sued-theme-v1")), "dark");
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await currentTheme(), "dark");
  assert.equal(await page.getByRole("button", { name: "Usar tema escuro" }).getAttribute("aria-pressed"), "true");
  assert.equal(await page.locator('meta[name="theme-color"]').getAttribute("content"), "#0B0B0D");
  checks.push("Alternância funciona pelo teclado; escuro e theme-color sobrevivem a reload.");

  const second = await context.newPage();
  await second.goto(base, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Usar tema claro" }).click();
  await second.waitForFunction(() => document.documentElement.dataset.theme === "light");
  await second.close();
  checks.push("Escolha sincroniza entre duas abas da mesma origem.");

  for (const theme of ["light", "dark"]) {
    await page.getByRole("button", { name: theme === "light" ? "Usar tema claro" : "Usar tema escuro" }).click();
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const geometry = await page.evaluate(() => ({
        pageHeight: document.documentElement.scrollHeight,
        overflow: document.documentElement.scrollWidth > innerWidth,
        themeTargetHeights: [...document.querySelectorAll(".theme-switch button")].map(el => el.getBoundingClientRect().height),
        contactBottom: document.querySelector(".hero-actions .action-primary").getBoundingClientRect().bottom + scrollY,
      }));
      assert.equal(geometry.overflow, false);
      assert.ok(geometry.themeTargetHeights.every(height => height >= 44));
      if (width < 768) {
        assert.ok(geometry.pageHeight < 1250);
        assert.ok(geometry.contactBottom <= 900);
      }
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      assert.equal(axe.violations.length, 0, JSON.stringify({ theme, width, violations: axe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })) }));
      await page.getByRole("heading", { level: 1 }).click();
      await page.screenshot({ path: `qa/themes/${theme}-${width}.png`, fullPage: true });
      results.push({ theme, width, ...geometry, axeViolations: axe.violations.length, incompleteRuleIds: axe.incomplete.map(rule => rule.id) });
    }
    await page.getByRole("button", { name: "Ver portfólio" }).click();
    const dialog = page.getByRole("dialog", { name: "Estou organizando meu portfólio." });
    await dialog.waitFor({ state: "visible" });
    const dialogAxe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    assert.equal(dialogAxe.violations.length, 0, JSON.stringify({ theme, violations: dialogAxe.violations.map(v => v.id) }));
    await page.keyboard.press("Escape");
    assert.equal(await dialog.isVisible(), false);
    await page.getByRole("button", { name: "Assistir à apresentação da Sued" }).click();
    await page.waitForFunction(() => document.querySelector("video")?.readyState >= 2);
    await page.locator("video").evaluate(el => el.pause());
    const videoAxe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    assert.equal(videoAxe.violations.length, 0, JSON.stringify({ theme, violations: videoAxe.violations.map(v => v.id) }));
    await page.reload({ waitUntil: "networkidle" });

  }
  checks.push("Claro e escuro: cinco viewports, alvos >=44px, contato na primeira tela mobile, sem overflow e sem violações axe; diálogo e player WebM também verificados.");

  // Verifica restauração visual sem esperar os bundles de hidratação.
  await page.getByRole("button", { name: "Usar tema escuro" }).click();
  const beforeHydration = await context.newPage();
  await beforeHydration.route("**/_next/static/**/*.js", route => route.abort());
  await beforeHydration.goto(base, { waitUntil: "load" });
  assert.equal(await beforeHydration.locator("html").getAttribute("data-theme"), "dark");
  assert.equal(await beforeHydration.locator("body").evaluate(el => getComputedStyle(el).backgroundColor), "rgb(11, 11, 13)");
  await beforeHydration.close();
  checks.push("Tema salvo é aplicado pelo bootstrap mesmo com os bundles JavaScript bloqueados, antes da hidratação.");

  const blockedContext = await browser.newContext({ reducedMotion: "reduce" });
  await blockedContext.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error("Storage bloqueado no teste"); };
    Storage.prototype.setItem = () => { throw new Error("Storage bloqueado no teste"); };
  });
  const blocked = await blockedContext.newPage();
  await blocked.goto(base, { waitUntil: "networkidle" });
  await blocked.getByRole("button", { name: "Usar tema escuro" }).click();
  assert.equal(await blocked.locator("html").getAttribute("data-theme"), "dark");
  await blocked.reload({ waitUntil: "networkidle" });
  assert.equal(await blocked.locator("html").getAttribute("data-theme"), "light");
  await blockedContext.close();
  checks.push("Storage bloqueado: seleção funciona na sessão; reload usa o claro padrão sem erro.");

  const staticContext = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await staticContext.newPage();
  await staticPage.goto(base);
  assert.equal(await staticPage.locator("html").getAttribute("data-theme"), "light");
  assert.equal(await staticPage.getByRole("link", { name: "Vamos criar seu site" }).isVisible(), true);
  assert.equal(await staticPage.getByRole("group", { name: "Aparência" }).isVisible(), false);
  await staticContext.close();
  checks.push("Sem JavaScript: tema claro legível, contato disponível e seletor inativo oculto.");

  assert.equal(errors.length, 0, JSON.stringify(errors));
  await page.getByRole("button", { name: "Usar tema claro" }).click();
  await writeFile("qa/themes/results.json", JSON.stringify({ timestamp: new Date().toISOString(), base, checks, results, errors }, null, 2));
  console.log(checks.join("\n"));
} finally {
  await browser.close();
}
