import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = message => errors.push(message);
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const table = text => text.split(/\r?\n/).filter(l => l.startsWith('|') && !/^\|[\s:|-]+\|$/.test(l)).map(l => l.split('|').slice(1,-1).map(v=>v.trim()));
const section = (text, heading) => text.split(`## ${heading}\n`)[1]?.split('\n## ')[0] ?? '';
const rows = (text, heading) => table(section(text.replaceAll('\r\n','\n'), heading)).slice(1);
const required = ['Chunk ID and parent','Purpose','Coverage IDs','Current baseline','Target outcome','Relevant files and symbols','Required inputs','Produced outputs/interfaces','Dependencies','Permitted concurrency','Implementation model/reasoning','Exact scope','Explicit exclusions','Acceptance criteria','Proportionate verification','Evidence required','Known blockers','Handoff/commit boundary'];
for (const name of ['README.md','GLOBAL_RULES.md','COVERAGE.md','DEPENDENCIES.md','DECISIONS.md','evidence/INDEX.md']) if (!fs.existsSync(path.join(root,name))) fail(`Missing ${name}`);
const index=rows(read('README.md'),'Chunk index');
const chunks=new Map();
for(const file of fs.readdirSync(path.join(root,'chunks')).filter(f=>f.endsWith('.md'))) {
  const text=read('chunks/'+file).replaceAll('\r\n','\n');
  const title=text.split('\n')[0].match(/^# (WP\d{2}(?:-\d{2}[A-Z])?) — (.+)$/);
  if(!title) {fail(`Invalid title: ${file}`);continue;}
  const [,id,label]=title;
  if(chunks.has(id)) fail(`Duplicate chunk ${id}`);
  if(file!==id+'.md') fail(`Filename mismatch ${id}`);
  const meta=Object.fromEntries(rows(text,'Chunk ID and parent'));
  if(meta['Chunk ID']!==id) fail(`Metadata ID ${id}`);
  for(const h of required) if(text.split('\n').filter(l=>l==='## '+h).length!==1 || !section(text,h).trim()) fail(`${id}: missing/duplicate/empty ${h}`);
  const model=Object.fromEntries(rows(text,'Implementation model/reasoning'));
  if(!/^gpt-(6-astra|6\.1-sol)$/.test(model.Model??'')) fail(`${id}: invalid Model ${model.Model}`);
  if(!/^(high|xhigh)$/.test(model.Reasoning??'')) fail(`${id}: invalid Reasoning ${model.Reasoning}`);
  const coverage=section(text,'Coverage IDs');
  for (const label of ['Owned','Supporting']) if (!new RegExp(`^${label}:\\s*\\S+`, 'm').test(coverage)) fail(`${id}: missing ${label} declaration`);
  const owned=(coverage.match(/^Owned:\s*(.*)$/m)?.[1]??'').match(/(?:REQ|PROP|BND|BASE|GAP)-\d{3}/g)??[];
  const supporting=(coverage.match(/^Supporting:\s*(.*)$/m)?.[1]??'').match(/(?:REQ|PROP|BND|BASE|GAP)-\d{3}/g)??[];
  chunks.set(id,{id,label,parent:meta.Parent,text,owned,supporting});
}
const indexed=new Map();
for(const [id,title,kind,parent,document,status] of index) {
  if(indexed.has(id)) fail(`Duplicate index ${id}`);
  indexed.set(id,{kind,parent});
  const c=chunks.get(id);
  if(!c) {fail(`Missing indexed chunk ${id}`);continue;}
  if(c.label!==title||c.parent!==parent) fail(`Index disagreement ${id}`);
  if(!['parent','execution'].includes(kind)) fail(`Invalid kind ${id}`);
  if(!document.includes(`chunks/${id}.md`)) fail(`Index link ${id}`);
  if(!status) fail(`Missing status ${id}`);
}
for(const c of chunks.values()) {
  if(!indexed.has(c.id)) fail(`Orphan file ${c.id}`);
  if(c.parent!=='NONE'&&!chunks.has(c.parent)) fail(`Invalid parent ${c.id}`);
  if(indexed.get(c.id)?.kind==='parent'&&c.owned.length) fail(`Parent retains coverage ${c.id}`);
  if(indexed.get(c.id)?.kind==='parent'&&![...chunks.values()].some(x=>x.parent===c.id)) fail(`Childless parent ${c.id}`);
}
const covRows=table(read('COVERAGE.md').split('## Supporting relationships')[0]).slice(1);
const coverage=new Map();
for(const [id,obligation,source,disposition,owner,reason] of covRows) {
  if(!/^(REQ|PROP|BND|BASE|GAP)-\d{3}$/.test(id)) {fail(`Invalid coverage ID ${id}`);continue;}
  if(coverage.has(id)) fail(`Duplicate coverage ${id}`);
  coverage.set(id,{disposition,owner});
  if(!['owned','excluded','satisfied','blocked'].includes(disposition)) fail(`Invalid disposition ${id}`);
  if(!obligation||!source||!reason) fail(`Incomplete coverage ${id}`);
  if(disposition==='owned') {
    if(indexed.get(owner)?.kind!=='execution') fail(`Invalid owner ${id}: ${owner}`);
    if(!chunks.get(owner)?.owned.includes(id)) fail(`Owner omission ${id}`);
  } else if(owner!=='NONE') fail(`Non-owned owner ${id}`);
  if(disposition==='satisfied'&&!/\]\(/.test(reason)) fail(`No evidence link ${id}`);
}
for(const c of chunks.values()) {
  for(const id of c.owned) if(coverage.get(id)?.owner!==c.id) fail(`Coverage collision ${id} in ${c.id}`);
  for(const id of [...c.owned,...c.supporting]) if(!coverage.has(id)) fail(`Unknown coverage ${id} in ${c.id}`);
}
for(const [id,chunk,contribution]of rows(read('COVERAGE.md'),'Supporting relationships')) if(!coverage.has(id)||!chunks.has(chunk)||!contribution) fail(`Invalid support ${id}/${chunk}`);
const edges=rows(read('DEPENDENCIES.md'),'Dependency edges');
const decisionIds = [...read('DECISIONS.md').matchAll(/^\| (DEC-\d{3}) \|/gm)].map(m=>m[1]);
const decisionSet = new Set(decisionIds);
if (decisionSet.size !== decisionIds.length) fail('Duplicate decision ID');
for (const c of chunks.values()) for (const id of c.text.match(/DEC-\d{3}/g)??[]) if (!decisionSet.has(id)) fail(`Unknown decision ${id} in ${c.id}`);
const edgeIds=new Set();
const graph=new Map();
for(const [id,from,to,handoff]of edges){
  if(edgeIds.has(id)||!/^DEP-\d{3}$/.test(id))fail(`Invalid/duplicate edge ${id}`);
  edgeIds.add(id);
  if(!chunks.has(from)||!chunks.has(to)||!handoff)fail(`Invalid edge ${id}`);
  if(!graph.has(from))graph.set(from,[]);graph.get(from).push(to);
  if(chunks.has(to)&&!section(chunks.get(to).text,'Dependencies').includes(id))fail(`Dependent omits ${id}`);
}
const cycles=(nodes,next,label)=>{const done=new Set(),active=new Set();function visit(id){if(active.has(id)){fail(`${label} cycle at ${id}`);return;}if(done.has(id))return;active.add(id);for(const n of next(id))visit(n);active.delete(id);done.add(id);}for(const id of nodes)visit(id);};
cycles(chunks.keys(),id=>graph.get(id)??[],'Dependency');
cycles(chunks.keys(),id=>chunks.get(id)?.parent&&chunks.get(id).parent!=='NONE'?[chunks.get(id).parent]:[],'Parent');
const groups=rows(read('DEPENDENCIES.md'),'Permitted concurrency');
const conIds=new Set();
for(const [id,members,conditions]of groups){if(conIds.has(id)||!/^CON-\d{3}$/.test(id)||!conditions)fail(`Invalid group ${id}`);conIds.add(id);for(const m of members.match(/WP\d{2}(?:-\d{2}[A-Z])?/g)??[])if(!chunks.has(m))fail(`Unknown concurrency member ${m}`);}
for(const c of chunks.values()){
 for(const id of section(c.text,'Dependencies').match(/DEP-\d{3}/g)??[])if(!edgeIds.has(id))fail(`Unknown edge ${id} in ${c.id}`);
 for(const id of section(c.text,'Permitted concurrency').match(/CON-\d{3}/g)??[])if(!conIds.has(id))fail(`Unknown group ${id} in ${c.id}`);
}
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
for(const file of walk(root).filter(f=>f.endsWith('.md'))){
 for(const match of fs.readFileSync(file,'utf8').matchAll(/\]\((<?[^)]+>?)\)/g)){
  const [rawTarget, anchor] = match[1].replace(/^<|>$/g,'').split('#');
  let target=rawTarget;
  if(!target||/^(https?:|codex:|app:)/i.test(target))continue;
  target=decodeURIComponent(target).replace(/^\/([A-Za-z]:\/)/,'$1').replace(/:\d+$/,'');
  const resolved = path.isAbsolute(target)?target:path.resolve(path.dirname(file),target);
  if(!fs.existsSync(resolved)) fail(`Broken link ${path.relative(root,file)}: ${target}`);
  else if(anchor && resolved.endsWith('.md')) {
    const anchors = [...fs.readFileSync(resolved,'utf8').matchAll(/^#{1,6} (.+)$/gm)].map(m=>m[1].trim().toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu,'').replace(/\s/g,'-'));
    if (!anchors.includes(decodeURIComponent(anchor))) fail(`Broken anchor ${path.relative(root,file)}: ${target}#${anchor}`);
  }
 }
}
const result={status:errors.length?'FAIL':'PASS',chunks:chunks.size,executionChunks:index.filter(r=>r[2]==='execution').length,coverageIds:coverage.size,dependencyEdges:edges.length,concurrencyGroups:groups.length,errors};
console.log(JSON.stringify(result,null,2));
process.exitCode=errors.length?1:0;
