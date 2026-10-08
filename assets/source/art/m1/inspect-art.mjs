import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const output='assets/source/art/m1/evidence';mkdirSync(output,{recursive:true});
const browser=await chromium.launch({headless:true,chromiumSandbox:true});
const reports=[];
for(const [width,height] of [[1366,768],[1024,768],[768,1024]]){
 const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto('http://127.0.0.1:5178/Learning-is-Fun/assets/source/art/m1/preview.html');
 await page.waitForFunction(()=>document.querySelectorAll('img[data-asset]').length>=72);
 await page.evaluate(()=>Promise.all([...document.images].map(im=>im.decode())));
 await page.screenshot({path:`${output}/preview-${width}x${height}.png`});
 const sceneChecks=[];
 for(const name of ['Village Green','River Bridge','Whispering Library','Market Square']){
  await page.getByRole('button',{name,exact:true}).click();
  const hashes={};
  for(const state of ['Initial','Restored','Static result']){
   await page.getByRole('button',{name:state,exact:true}).click();
   await page.waitForFunction(()=>[...document.querySelectorAll('.hero img')].every(i=>i.complete&&i.naturalWidth&&i.dataset.loaded===`${i.dataset.asset}:${i.dataset.mode}`));
   // Read decoded scene pixels, excluding the overlaid DOM state caption.
   const pixels=await page.locator('.scene>img').evaluate(im=>{const c=document.createElement('canvas');c.width=Math.round(im.width);c.height=Math.round(im.height);c.getContext('2d').drawImage(im,0,0,c.width,c.height);return c.toDataURL();});
   hashes[state]=createHash('sha256').update(pixels).digest('hex');
  }
  sceneChecks.push({scene:name,initialDiffers:hashes.Initial!==hashes.Restored,staticEqualsRestored:hashes.Restored===hashes['Static result'],hashes});
 }
 for(const section of ['comparisons','characters','creative','inventory','discoveries','reference']){
  await page.locator(`#${section}`).screenshot({path:`${output}/${section}-${width}.png`});
 }
 for(const comparison of await page.locator('.comparison').all()){
  const slug=(await comparison.locator('h3').innerText()).toLowerCase().replaceAll(' ','-');
  await comparison.screenshot({path:`${output}/comparison-${slug}-${width}.png`});
 }
 const layout=await page.evaluate(()=>({horizontalOverflow:document.documentElement.scrollWidth>innerWidth,brokenImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).length,controls:[...document.querySelectorAll('button')].map(b=>({label:b.textContent,w:b.getBoundingClientRect().width,h:b.getBoundingClientRect().height})),imageCount:document.images.length}));
 reports.push({width,height,engine:'Playwright Chromium',browserVersion:browser.version(),reducedMotion:'reduce',errors,sceneChecks,...layout});
 await context.close();
}
writeFileSync(`${output}/browser-checks.json`,JSON.stringify(reports,null,2)+'\n');await browser.close();console.log(JSON.stringify(reports.map(r=>({...r,controls:undefined,sceneChecks:r.sceneChecks.map(s=>({...s,hashes:undefined}))})),null,2));
if(reports.some(r=>r.errors.length||r.horizontalOverflow||r.brokenImages||r.controls.some(c=>c.w<44||c.h<44)||r.sceneChecks.some(s=>!s.initialDiffers||!s.staticEqualsRestored)))process.exitCode=1;
