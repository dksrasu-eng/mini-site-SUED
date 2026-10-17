#!/usr/bin/env node
// Optional QA script. Requires `playwright` installed in the executing project.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(path.join(process.cwd(), 'package.json'));
let chromium;
try { ({chromium} = require('playwright')); }
catch { console.error('NOT_RUN: Playwright ausente. Execute npm install -D playwright && npx playwright install chromium no projeto de teste.'); process.exit(2); }
const url=process.argv[2], out=process.argv[3] || './qa-screenshots';
if (!url || !/^https?:\/\//.test(url)) { console.error('Uso: node scripts/visual_qa.mjs http://localhost:3000 ./qa-screenshots'); process.exit(2); }
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const results=[];
try {
  for (const width of [320,375,768,1024,1440]) {
    const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
    const consoleErrors=[];
    page.on('pageerror',err=>consoleErrors.push(String(err)));
    try {
      const response=await page.goto(url,{waitUntil:'networkidle',timeout:30000});
      await page.evaluate(()=>document.fonts.ready.then(()=>true));
      await page.screenshot({path:path.join(out,`viewport-${width}.png`),fullPage:true});
      const issues=await page.evaluate(()=>({
        overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+2,
        brokenImages:[...document.images].filter(img=>!img.complete || img.naturalWidth===0).map(img=>img.currentSrc||img.src),
        missingH1:document.querySelectorAll('h1').length===0
      }));
      const status=response?.ok()&&!issues.overflow&&!issues.brokenImages.length&&!issues.missingH1&&!consoleErrors.length?'PASS':'FAIL';
      results.push({width,status,httpStatus:response?.status(),...issues,consoleErrors});
    } catch(err) {results.push({width,status:'FAIL',error:String(err)});}
    await page.close();
  }
} finally { await browser.close(); }
await fs.writeFile(path.join(out,'report.json'),JSON.stringify({url,createdAt:new Date().toISOString(),results},null,2));
console.log(JSON.stringify(results,null,2));
if(results.some(r=>r.status==='FAIL'||r.overflow||r.brokenImages?.length||r.consoleErrors?.length))process.exitCode=1;
