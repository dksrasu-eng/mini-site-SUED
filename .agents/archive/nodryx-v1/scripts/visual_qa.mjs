#!/usr/bin/env node
/** Browser smoke test with Playwright. Run from a project with playwright installed:
 * node /path/to/skill/scripts/visual_qa.mjs http://localhost:3000 ./qa-screenshots
 * This script captures screens, overflow, failed images and console errors.
 * It does NOT verify real CTA/backend or certify WCAG.
 */
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';

const url = process.argv[2];
const outDir = resolve(process.argv[3] || './qa-screenshots');
if (!url || !/^https?:\/\//.test(url)) {
  console.error('Uso: node visual_qa.mjs http://localhost:3000 ./qa-screenshots');
  process.exit(2);
}
const requireFromProject = createRequire(join(process.cwd(), 'package.json'));
let chromium;
try {
  ({ chromium } = requireFromProject('playwright'));
} catch (error) {
  console.error('Playwright indisponível no projeto atual. Instale no seu projeto: npm install -D playwright && npx playwright install chromium');
  process.exit(2);
}
const viewports = [320, 375, 768, 1024, 1440];
const output = { url, generatedAt: new Date().toISOString(), viewports: [], limitations: [
  'Screenshots e heurísticas, não certificação WCAG.',
  'Links/formulários e backend exigem testes funcionais específicos.',
  'Web Vitals de campo não são mensuradas por este script.'
]};
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const width of viewports) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const errors = [];
    const failures = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('requestfailed', (req) => failures.push(`${req.method()} ${req.url()} :: ${req.failure()?.errorText || 'erro'}`));
    let status = null;
    let inspection = {};
    try {
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      status = response?.status() ?? null;
      await page.screenshot({ path: join(outDir, `${width}.png`), fullPage: true });
      inspection = await page.evaluate(() => {
        const root = document.documentElement;
        const images = [...document.images];
        return {
          title: document.title,
          h1: [...document.querySelectorAll('h1')].map(e => (e.innerText || '').trim()),
          htmlLang: root.getAttribute('lang'),
          documentWidth: root.scrollWidth,
          viewportWidth: window.innerWidth,
          horizontalOverflow: root.scrollWidth > window.innerWidth + 1,
          brokenImages: images.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.currentSrc || img.src),
          linkWithoutHref: document.querySelectorAll('a:not([href])').length,
          controls: document.querySelectorAll('button').length,
          images: images.length
        };
      });
    } catch (err) {
      errors.push(`Falha ao carregar ou capturar: ${err.message}`);
    }
    const result = { width, height: 900, status, ...inspection, errors, failedRequests: failures };
    result.passSmoke = status !== null && status < 400 && !result.horizontalOverflow && !errors.length && !result.brokenImages?.length;
    output.viewports.push(result);
    console.log(`${width}px: ${result.passSmoke ? 'PASSA smoke' : 'REVER'} | HTTP ${status ?? 'N/A'} | overflow=${!!result.horizontalOverflow} | erros=${errors.length} | imagens quebradas=${result.brokenImages?.length ?? '?'} `);
    await page.close();
  }
} finally {
  await browser.close();
}
await writeFile(join(outDir, 'visual-qa.json'), JSON.stringify(output, null, 2), 'utf8');
console.log(`Resultados: ${outDir}/visual-qa.json e screenshots.`);
if (output.viewports.some(r => !r.passSmoke)) process.exitCode = 1;
