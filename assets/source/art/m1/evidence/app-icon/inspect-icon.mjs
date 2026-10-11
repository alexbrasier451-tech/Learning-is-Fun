import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const dir='assets/source/art/m1/evidence/app-icon';
const source='assets/source/art/m1/ui/app-icon.svg', runtime='public/assets/art/m1/ui/app-icon.svg';
const bytes=readFileSync(runtime);assert(bytes.equals(readFileSync(source)));
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><title>Pip app icon · native scale inspection</title><style>body{margin:32px;background:#fff6e5;color:#263d38;font:16px/1.5 system-ui}h1{font-size:28px}h2{font-size:18px}.lead{display:flex;align-items:center;gap:36px}.sizes{display:flex;align-items:end;gap:24px;flex-wrap:wrap}.sizes figure{margin:0;display:grid;justify-items:center;gap:10px}img{display:block}.dark{background:#263d38;padding:24px;color:#fff6e5;margin-top:24px;border-radius:16px}</style><h1>Pip · a storybook app icon</h1><p>Original 512×512 SVG, rendered at native CSS pixels. Purpose: any.</p><div class="lead"><img src="../../../ui/app-icon.svg" width="256" height="256" alt="New Pip app icon"><div><img src="../../../characters/pip-idle.svg" width="180" height="192" alt="Established Pip idle artwork"><p>Established Pip identity</p></div></div><h2>Light surface · native pixels</h2><div class="sizes">${[16,24,32,48,64,128,192].map(n=>`<figure><img src="../../../ui/app-icon.svg" width="${n}" height="${n}" alt="${n} pixel icon"><figcaption>${n}px</figcaption></figure>`).join('')}</div><div class="dark"><h2>Dark surface · native pixels</h2><div class="sizes">${[16,24,32,48,64].map(n=>`<figure><img src="../../../ui/app-icon.svg" width="${n}" height="${n}" alt="${n} pixel icon on dark"><figcaption>${n}px</figcaption></figure>`).join('')}</div></div></html>`;
// The HTML is two directories below m1, so local references use ../../.
writeFileSync(`${dir}/preview.html`,html.replaceAll('../../../','../../'));
const browser=await chromium.launch({headless:true,chromiumSandbox:true});
try {
 const page=await browser.newPage({viewport:{width:1120,height:980},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(resolve(`${dir}/preview.html`)).href);
 await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
 await page.screenshot({path:`${dir}/native-scales.png`,fullPage:true});
 const layout=await page.evaluate(()=>[...document.images].map(i=>({alt:i.alt,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,width:i.width,height:i.height,complete:i.complete})));
 const parsed=await page.evaluate(t=>{const d=new DOMParser().parseFromString(t,'image/svg+xml');return{parserErrors:d.querySelectorAll('parsererror').length};},bytes.toString('utf8'));
 assert.equal(parsed.parserErrors,0);assert.equal(errors.length,0);assert(layout.every(i=>i.complete&&i.naturalWidth));
 writeFileSync(`${dir}/render-checks.json`,JSON.stringify({engine:'Playwright Chromium',version:browser.version(),chromiumSandbox:true,deviceScaleFactor:1,viewport:{width:1120,height:980},source:'file:// private preview; no port/server',errors,parsed,images:layout,iconBytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')},null,2)+'\n');
 console.log(`Native-scale rendering passed in Chromium ${browser.version()}; ${bytes.length} bytes.`);
} finally {await browser.close();}
