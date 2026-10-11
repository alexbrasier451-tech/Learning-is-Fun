import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const baseCommit='9485a2cf67b0703deb4efa6c178602dc7952f705';
const root='assets/source/art/m2';const file='assets/asset-register.json';
const register=JSON.parse(readFileSync(file,'utf8')), rows=register.assets.filter(a=>a.milestone==='M2');
assert.equal(rows.length,28);assert(rows.every(a=>a.kind==='svg'));
const beforePath=`${root}/baseline-register.json`;if(!existsSync(beforePath))writeFileSync(beforePath,JSON.stringify(register,null,2)+'\n');
const baseline=JSON.parse(readFileSync(beforePath,'utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
const records=[],exports=[];
for(const row of rows){const bytes=readFileSync(`public/${row.runtimePath}`),xml=bytes.toString('utf8');assert(bytes.equals(readFileSync(row.sourcePaths[0])),row.id);assert(!/[\r\n]/.test(xml));
assert(!/<(?:script|foreignObject|text|image|animate|set)\b|\bon[a-z]+\s*=|(?:href|src)\s*=|https?:\/\/(?!www\.w3\.org\/2000\/svg)/i.test(xml));
const ids=[...xml.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);assert(ids.every(i=>i.startsWith(row.id+'-')));for(const m of xml.matchAll(/url\(#([^)]*)\)/g))assert(ids.includes(m[1]));
const width=Number(xml.match(/\bwidth="(\d+)"/)[1]),height=Number(xml.match(/\bheight="(\d+)"/)[1]);assert(xml.includes(`viewBox="0 0 ${width} ${height}"`));if(row.id.startsWith('scene-'))for(const d of ['background','middle','landmark','foreground','initial'])assert(ids.includes(`${row.id}-${d}`));
records.push({...row,status:'ready',author:'OpenAI Codex — original SVG artwork for Learning is Fun',permission:{kind:'original',status:'confirmed',holder:'Learning is Fun project requester (AI-generated project output)',statement:'Original text-authored M2 SVG extension of this project’s accepted original M1 family, produced under explicit user authorization. No external artwork, stock pack or paid media; no invented CC0/GPL relicensing or copyright eligibility claim.',evidencePath:`${root}/PROVENANCE.md`},attribution:'Original artwork created with OpenAI Codex for Learning is Fun.',width,height,bytes:bytes.length});
exports.push({id:row.id,sourcePath:row.sourcePaths[0],runtimePath:row.runtimePath,width,height,viewBox:`0 0 ${width} ${height}`,bytes:bytes.length,sha256:hash(bytes),layerIds:ids.filter(i=>!['title','sky','wood','wall','roof','leaf','water','fox','apple','pear','light','shadow'].some(s=>i===row.id+'-'+s)),resultIds:[...xml.matchAll(/data-result="([^"]+)"/g)].map(m=>m[1])});}
const bindings=JSON.parse(readFileSync(`${root}/bindings.json`,'utf8'));
for(const b of bindings.resultBindings){const a=exports.find(a=>a.id===b.assetId);assert(a,b.assetId);if(b.showLayer)assert(a.layerIds.includes(b.showLayer));if(b.hideLayer)assert(a.layerIds.includes(b.hideLayer));if(b.additionalAssetId)assert(exports.some(a=>a.id===b.additionalAssetId));}
const m1=JSON.parse(readFileSync('assets/source/art/m1/manifest.json','utf8'));for(const a of m1.exports){assert.equal(hash(readFileSync(`public/${a.runtimePath}`)),a.sha256);assert.equal(hash(readFileSync(a.sourcePath)),a.sha256);}
const evidence=JSON.parse(readFileSync(`${root}/evidence/browser-checks.json`,'utf8'));assert.equal(evidence.length,3);assert(evidence.every(r=>!r.errors.length&&!r.external.length&&!r.brokenImages&&!r.horizontalOverflow&&r.checks.every(c=>c.initialDiffers&&c.staticEqualsRestored)));
const manifest={baseCommit,count:28,totalM2Bytes:exports.reduce((n,a)=>n+a.bytes,0),rightsEvidence:`${root}/PROVENANCE.md`,bindingsPath:`${root}/bindings.json`,exports};
writeFileSync(`${root}/manifest.json`,JSON.stringify(manifest,null,2)+'\n');
writeFileSync(`${root}/asset-register.delta.json`,JSON.stringify({baseCommit,instruction:'Replace ONLY these 28 M2 rows by id after checking expectedBefore. Preserve all current M1/audio rows and top-level schema. NEVER copy the private complete register.',expectedBefore:baseline.assets.filter(a=>a.milestone==='M2'),records},null,2)+'\n');
const combined=register.assets.map(a=>records.find(r=>r.id===a.id)??a);for(const a of combined.filter(a=>a.milestone!=='M2'))assert.deepEqual(a,baseline.assets.find(b=>b.id===a.id));
writeFileSync(`${root}/required-runtime.delta.json`,JSON.stringify(records.map(a=>a.runtimePath),null,2)+'\n');
writeFileSync(`${root}/required-runtime.complete.json`,JSON.stringify(combined.filter(a=>a.status==='ready').map(a=>a.runtimePath),null,2)+'\n');
writeFileSync(file,JSON.stringify({...register,assets:combined},null,2)+'\n');
writeFileSync(`${root}/evidence/measurement-checks.json`,JSON.stringify({baseCommit,exportCount:28,totalM2Bytes:manifest.totalM2Bytes,sourceRuntimeEqual:true,prefixedUniqueIds:true,localReferencesResolve:true,noScriptsRemoteOrBakedText:true,canonicalSingleLine:true,allDeclaredResultBindingsResolve:true,inheritedM1PairsUnchanged:m1.exports.length,unchangedNonM2RegisterRecords:combined.filter(a=>a.milestone!=='M2').length,completeRequiredRuntimePaths:combined.filter(a=>a.status==='ready').length,audioRecordsPreservedFromPrivateBase:true,privateOnly:true},null,2)+'\n');
console.log(`PASS: 28 ready M2 pairs, ${manifest.totalM2Bytes} bytes; ${m1.exports.length} inherited art pairs and all non-M2 rows unchanged. Art-row delta only.`);
