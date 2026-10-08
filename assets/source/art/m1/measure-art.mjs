import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const path='assets/asset-register.json';
const register=JSON.parse(readFileSync(path,'utf8'));
const rows=register.assets.filter(a=>a.milestone==='M1'&&a.kind==='svg');
assert.equal(rows.length,36);
const results=[];
for(const a of rows){
 const source=readFileSync(a.sourcePaths[0]);const runtime=readFileSync(`public/${a.runtimePath}`);assert(source.equals(runtime),`${a.id}: source/export drift`);
 const xml=runtime.toString('utf8');
 assert(!/<(?:script|foreignObject|text|image|animate|set)\b|\bon[a-z]+\s*=|(?:href|src)\s*=|https?:\/\/(?!www\.w3\.org\/2000\/svg)/i.test(xml),`${a.id}: forbidden dependency/text`);
 const ids=[...xml.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);assert(ids.every(id=>id.startsWith(`${a.id}-`)));
 for(const m of xml.matchAll(/url\(#([^)]*)\)/g))assert(ids.includes(m[1]),`${a.id}: dangling reference`);
 const width=Number(xml.match(/\bwidth="(\d+)"/)[1]),height=Number(xml.match(/\bheight="(\d+)"/)[1]);
 assert(xml.includes(`viewBox="0 0 ${width} ${height}"`));
 if(a.id.startsWith('scene-'))for(const depth of ['background','middle','landmark','foreground','initial'])assert(ids.includes(`${a.id}-${depth}`));
 results.push({id:a.id,sourcePath:a.sourcePaths[0],runtimePath:a.runtimePath,width,height,viewBox:`0 0 ${width} ${height}`,bytes:runtime.length,sha256:createHash('sha256').update(runtime).digest('hex'),layerIds:ids.filter(i=>!['title','sky','wood','wall','roof','leaf','water','fox','apple','pear','light','shadow'].some(s=>i===`${a.id}-${s}`)),resultIds:[...xml.matchAll(/data-result="([^"]+)"/g)].map(m=>m[1])});
 if(process.argv.includes('--ready'))Object.assign(a,{status:'ready',author:'OpenAI Codex — original SVG artwork for Learning is Fun',permission:{kind:'original',status:'confirmed',holder:'Learning is Fun project requester (AI-generated project output)',statement:'Original text-authored SVG produced for this project under explicit user authorization; no external artwork or stock assets used. No CC0/GPL relicensing or copyright eligibility claim. See retained provenance.',evidencePath:'assets/source/art/m1/PROVENANCE.md'},attribution:'Original artwork created with OpenAI Codex for Learning is Fun.',width,height,bytes:runtime.length});
 else if(a.status==='ready'){assert.equal(a.bytes,runtime.length);assert.equal(a.width,width);assert.equal(a.height,height);}
}
const report={toolchain:{node:process.version,authoring:'Original deterministic JavaScript/SVG',renderer:'Playwright Chromium 156.0.8078.4'},count:results.length,totalRuntimeBytes:results.reduce((n,r)=>n+r.bytes,0),exports:results};
writeFileSync('assets/source/art/m1/manifest.json',JSON.stringify(report,null,2)+'\n');
writeFileSync('assets/source/art/m1/required-runtime.json',JSON.stringify(rows.filter(a=>a.status==='ready').map(a=>a.runtimePath),null,2)+'\n');
if(process.argv.includes('--ready')){
 const browser=JSON.parse(readFileSync('assets/source/art/m1/evidence/browser-checks.json','utf8'));
 assert.equal(browser.length,3);assert(browser.every(r=>!r.errors.length&&!r.horizontalOverflow&&!r.brokenImages&&r.sceneChecks.length===4&&r.sceneChecks.every(s=>s.initialDiffers&&s.staticEqualsRestored)));
 writeFileSync(path,JSON.stringify(register,null,2)+'\n');
}
console.log(`Validated ${results.length} original SVG pairs; ${report.totalRuntimeBytes} runtime bytes. ${process.argv.includes('--ready')?'Updated only M1 SVG register records.':'Measurements verified.'}`);
