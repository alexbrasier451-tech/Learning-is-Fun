/** Private Vite/Chromium preview. Dependency reads only; all caches/evidence physical and local. */
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {resolve,dirname} from 'node:path';
import {mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const toolsRoot=process.env.ART_TOOLS_ROOT;if(!toolsRoot)throw Error('Set ART_TOOLS_ROOT to read-only dependency checkout');
const req=createRequire(resolve(toolsRoot,'package.json'));
const {createServer}=await import(pathToFileURL(req.resolve('vite')).href);
const {default:react}=await import(pathToFileURL(req.resolve('@vitejs/plugin-react')).href);
const {chromium}=req('@playwright/test');
const root=process.cwd(),output=resolve('assets/source/art/m2/evidence');mkdirSync(output,{recursive:true});
const server=await createServer({configFile:false,root,base:'/Learning-is-Fun/',cacheDir:resolve('.private-cache/vite-art'),plugins:[react()],define:{__BUILD_ID__:JSON.stringify('private-wp02-08a')},resolve:{alias:[{find:/^react-dom(?=\/|$)/,replacement:dirname(req.resolve('react-dom/package.json'))},{find:/^react(?=\/|$)/,replacement:dirname(req.resolve('react/package.json'))}]},optimizeDeps:{entries:['assets/source/art/m2/preview.html']},server:{host:'127.0.0.1',port:5198,strictPort:true,fs:{allow:[root,resolve(toolsRoot,'node_modules')]}}});
let browser;const reports=[];
try {await server.listen();browser=await chromium.launch({headless:true,chromiumSandbox:true});
for(const [width,height] of [[1366,768],[1024,768],[768,1024]]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'}),errors=[],external=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('request',r=>{if(!/^(http:\/\/127\.0\.0\.1:5198\/|blob:|data:)/.test(r.url()))external.push(r.url())});
 await page.goto('http://127.0.0.1:5198/Learning-is-Fun/assets/source/art/m2/preview.html');
 await page.waitForFunction(()=>document.querySelectorAll('img[data-asset]').length>70&&document.querySelectorAll('.loading').length===0);
 await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
 await page.screenshot({path:`${output}/preview-${width}x${height}.png`});
 const checks=[];
 for(const name of ["Tinker's Workshop",'Storywood Forest','Clockwork Castle','A growing village','Stories on the shelf']){
  await page.getByRole('button',{name,exact:true}).click();const hashes={};
  for(const mode of ['initial','restored','static']){
   await page.getByRole('button',{name:mode==='static'?'Static result':mode,exact:true}).click();
   await page.waitForFunction(()=>!document.querySelector('.hero .loading')&&[...document.querySelectorAll('.hero img')].every(i=>i.complete&&i.naturalWidth&&i.dataset.loaded===`${i.dataset.asset}:${i.dataset.mode}`));
   const pixels=await page.locator('.hero>.canvas').evaluate(el=>{const box=el.getBoundingClientRect(),c=document.createElement('canvas');c.width=Math.round(box.width);c.height=Math.round(box.height);const ctx=c.getContext('2d');for(const im of el.querySelectorAll('img')){const b=im.getBoundingClientRect();ctx.drawImage(im,(b.x-box.x)*c.width/box.width,(b.y-box.y)*c.height/box.height,b.width*c.width/box.width,b.height*c.height/box.height)}return c.toDataURL()});
   hashes[mode]=createHash('sha256').update(pixels).digest('hex');
  }
  checks.push({name,initialDiffers:hashes.initial!==hashes.restored,staticEqualsRestored:hashes.restored===hashes.static,hashes});
 }
 for(const item of await page.locator('.comparison').all()){const id=await item.getAttribute('data-place');await item.screenshot({path:`${output}/comparison-${id}-${width}.png`});}
 if(width===1366)await page.locator('#overview').screenshot({path:`${output}/overview-three-scenes.png`});
 for(const section of ['cast','creative','props'])await page.locator(`#${section}`).screenshot({path:`${output}/${section}-${width}.png`});
 const layout=await page.evaluate(()=>({brokenImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).length,horizontalOverflow:document.documentElement.scrollWidth>innerWidth,controls:[...document.querySelectorAll('button')].map(b=>({name:b.textContent,width:b.getBoundingClientRect().width,height:b.getBoundingClientRect().height})),imageCount:document.images.length}));
 reports.push({width,height,engine:'Playwright Chromium',version:browser.version(),reducedMotion:'reduce',errors,external,checks,...layout});await page.close();
}
writeFileSync(`${output}/browser-checks.json`,JSON.stringify(reports,null,2)+'\n');
assert(reports.every(r=>!r.errors.length&&!r.external.length&&!r.brokenImages&&!r.horizontalOverflow&&r.controls.every(c=>c.width>=44&&c.height>=48)&&r.checks.every(c=>c.initialDiffers&&c.staticEqualsRestored)),JSON.stringify(reports));
console.log(JSON.stringify(reports.map(r=>({viewport:`${r.width}x${r.height}`,version:r.version,errors:r.errors,external:r.external,imageCount:r.imageCount,checks:r.checks.map(({hashes,...c})=>c)})),null,2));
} finally {if(browser)await browser.close();await server.close();console.log('Private Chromium and port 5198 closed.');}
