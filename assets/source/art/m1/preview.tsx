import { useEffect, useState } from 'react';
import { mountPanel } from '../../../../tests/fixtures/host';
import { assetUrl } from '../../../../src/platform/assets';
import { AVATARS, DISCOVERIES } from '../../../../src/experience/catalogue';
import register from '../../../asset-register.json';
import './preview.css';
import referenceUrl from '../../../../docs/art-direction-reference.svg?url';

const rows = register.assets.filter(a => a.milestone === 'M1' && a.kind === 'svg');
const scenes = rows.filter(a => a.id.startsWith('scene-'));
const names: Record<string,string> = { 'scene-village-green':'Village Green','scene-river-bridge':'River Bridge','scene-whispering-library':'Whispering Library','scene-market-square':'Market Square' };
const observations: Record<string,string> = { 'scene-village-green':'Bunting welcomes everyone home. Three garden plots become available.', 'scene-river-bridge':'A continuous timber crossing joins the river banks.', 'scene-whispering-library':'Warm windows, an open doorway and a book ready to unfold.', 'scene-market-square':'The curved stall fills with apples and pears, beneath fresh bunting.' };
type Mode = 'initial' | 'restored' | 'static';
function Art({id,mode='initial',className=''}:{id:string;mode?:Mode;className?:string}) {
  const [loaded,setLoaded] = useState<{src:string;key:string}>({src:'',key:''});
  useEffect(() => {
    const row = rows.find(a=>a.id===id)!;
    let cancelled=false, objectUrl='';
    fetch(assetUrl(row.runtimePath)).then(r=>{if(!r.ok)throw Error(row.runtimePath);return r.text();}).then(text=>{
      const doc=new DOMParser().parseFromString(text,'image/svg+xml');
      if(doc.querySelector('parsererror'))throw Error(`Invalid SVG: ${id}`);
      if(mode!=='initial') {
        doc.querySelectorAll('[data-state="initial"]').forEach(el=>el.setAttribute('display','none'));
        doc.querySelectorAll('[data-result]').forEach(el=>el.removeAttribute('style'));
      }
      objectUrl=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(doc)],{type:'image/svg+xml'}));
      if(!cancelled)setLoaded({src:objectUrl,key:`${id}:${mode}`});else URL.revokeObjectURL(objectUrl);
    }).catch(console.error);
    return ()=>{cancelled=true;if(objectUrl)URL.revokeObjectURL(objectUrl);};
  },[id,mode]);
  return loaded.src?<img className={className} src={loaded.src} alt="" data-asset={id} data-mode={mode} data-loaded={loaded.key}/>:<span>Loading artwork…</span>;
}
function Stack({ids}:{ids:string[]}) { return <div className="stack">{ids.map(id=><Art key={id} id={id}/>)}</div>; }
function App(){
  const [scene,setScene]=useState('scene-village-green');
  const [mode,setMode]=useState<Mode>('initial');
  return <main>
    <header><div><p className="eyebrow">THE LOST KINGDOM / ORIGINAL M1 ART</p><h1>A little world worth mending.</h1><p>Painted timber. Stitched scarves. A warm welcome home.</p></div><span className="edition">Art atelier<br/>36 finished SVG exports</span></header>
    <nav aria-label="Location preview">{scenes.map(s=><button key={s.id} aria-pressed={scene===s.id} onClick={()=>setScene(s.id)}>{names[s.id]}</button>)}</nav>
    <section className="hero" aria-label="Early scene preview">
      <div className="scene"><Art id={scene} mode={mode}/><span className="scene-caption">{mode==='initial'?'Before restoration':mode==='static'?'Restored · reduced motion':'After restoration'}</span></div>
      <aside><p className="eyebrow">A SMALL WORLD, A VISIBLE CHANGE</p><h2>{names[scene]}</h2><p>{observations[scene]}</p><div className="modes">{(['initial','restored','static'] as const).map(m=><button key={m} aria-pressed={mode===m} onClick={()=>setMode(m)}>{m==='static'?'Static result':m[0].toUpperCase()+m.slice(1)}</button>)}</div><div className="companion"><Art id={mode==='initial'?'pip-help':'pip-celebration'}/><p>Quiet space for live instructions and full-sized controls.</p></div><small>Development art preview. State controls are visual comparisons; no quests, saves or rewards run here.</small></aside>
    </section>
    <section id="comparisons"><h2>Every place has a before and after.</h2><p>Identical viewBox and camera; restoration is an authored layer. Static results need no animation.</p>{scenes.map(s=><article className="comparison" key={s.id}><h3>{names[s.id]}</h3><div className="triptych">{(['initial','restored','static'] as const).map(m=><figure key={m}><Art id={s.id} mode={m}/><figcaption>{m==='static'?'Static / reduced motion':m}</figcaption></figure>)}</div></article>)}</section>
    <section id="characters"><h2>Familiar faces.</h2><p>One shared silhouette, palette and material language; readable expressions at small scale.</p><div className="cast">{rows.filter(a=>a.runtimePath.includes('/characters/')).map(a=><figure key={a.id}><Art id={a.id}/><figcaption>{a.id}</figcaption></figure>)}</div><h3>Reused profile portraits</h3><div className="avatars">{AVATARS.map(a=><figure key={a.id}><div className="avatar"><Art id={a.assetId}/></div><figcaption>{a.label}</figcaption></figure>)}</div></section>
    <section id="creative"><h2>A scarf, a bloom, a place of your own.</h2><div className="creative">{['teal','amber','plum'].map(c=><figure key={c}><Stack ids={['pip-idle',`scarf-${c}`,'scarf-leaf']}/><figcaption>{c} scarf + leaf embroidery</figcaption></figure>)}{['coral','gold','violet'].map(c=><figure key={c}><Stack ids={['decoration-planter',`flowers-${c}`,'planter-rim']}/><figcaption>{c} flowers + decorated rim</figcaption></figure>)}</div></section>
    <section id="inventory"><h2>Objects made for little hands.</h2><p>Prompts, numbers and punctuation belong in live controls. These surrounds deliberately contain no assessed text.</p><div className="lengths"><h3>Timber lengths at one shared scale</h3>{[1,2,3,4,5,6].map(n=><figure key={n}><div style={{width:(n*72+16)*.8}}><Art id={`plank-${n}`}/></div><figcaption>Length {n} · live label</figcaption></figure>)}</div><div className="inventory">{rows.filter(a=>!a.runtimePath.includes('/characters/')&&!a.id.startsWith('scene-')).map(a=><figure key={a.id}><Art id={a.id} mode={a.id==='world-map'?'restored':'initial'}/><figcaption>{a.id}</figcaption></figure>)}</div></section>
    <section id="discoveries"><h2>Four small discoveries.</h2><div className="discoveries">{DISCOVERIES.filter(d=>d.milestone==='M1').map(d=><figure key={d.id}><Art id={d.assetId}/><figcaption>{d.label}<small>{d.sceneId} · transient, non-scored</small></figcaption></figure>)}</div></section>
    <section id="reference"><h2>From compact direction to finished family.</h2><img className="reference" src={referenceUrl} alt="Compact original art direction reference"/><p>The reference establishes palette and materials; the exports add dimensional landmarks, crafted details and a consistent illustrated cast.</p></section>
    <footer>Original text-authored SVG · No external stock, paid tools, remote fonts or image services. Preview only; runtime assembly and browser acceptance remain with their owners.</footer>
  </main>;
}
const root=document.getElementById('root');if(!root)throw Error('Missing preview root');mountPanel(root,<App/>);
