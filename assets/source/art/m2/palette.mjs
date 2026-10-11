// Original shared shape language extracted from accepted M1 authoring source; M1 remains unchanged.
const ink='#344B40', cream='#FFF6E5', teal='#24665E', coral='#C16C60', plum='#70536F';
let pre='';
const p=(d,f,extra='')=>`<path d="${d}" fill="${f}" ${extra}/>`;
const line=(d,c=ink,w=3,extra='')=>p(d,'none',`stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}`);
const e=(x,y,rx,ry,f,extra='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" ${extra}/>`;
const r=(x,y,w,h,rad,f,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rad}" fill="${f}" ${extra}/>`;
const g=(body,transform='',extra='')=>`<g ${transform?`transform="${transform}"`:''} ${extra}>${body}</g>`;
const url=n=>`url(#${pre}-${n})`;
const layer=(name,body,extra='')=>g(body,'',`id="${pre}-${name}" aria-label="${name.replaceAll('-',' ')}" ${extra}`);
const result=(name,body)=>layer(name,body,`data-result="${name}" style="display:none"`);
const initial=body=>layer('initial',body,'data-state="initial"');
function defs(){return `<defs>
 <linearGradient id="${pre}-sky" x2="0" y2="1"><stop stop-color="#D9EAE0"/><stop offset=".7" stop-color="#F4EED4"/><stop offset="1" stop-color="#F6DFB1"/></linearGradient>
 <linearGradient id="${pre}-wood" x1="0" y1="0" x2=".2" y2="1"><stop stop-color="#E6BD7F"/><stop offset=".5" stop-color="#BD8B53"/><stop offset="1" stop-color="#8D603E"/></linearGradient>
 <linearGradient id="${pre}-wall" x2=".8" y2="1"><stop stop-color="#FFF3D5"/><stop offset=".65" stop-color="#EAD5AC"/><stop offset="1" stop-color="#C3AE84"/></linearGradient>
 <linearGradient id="${pre}-roof" x2=".25" y2="1"><stop stop-color="#DA8C6C"/><stop offset=".6" stop-color="#B86556"/><stop offset="1" stop-color="#874B46"/></linearGradient>
 <linearGradient id="${pre}-leaf" x2=".7" y2="1"><stop stop-color="#8DA66B"/><stop offset=".55" stop-color="#527C59"/><stop offset="1" stop-color="#2B5748"/></linearGradient>
 <linearGradient id="${pre}-water" x2="0" y2="1"><stop stop-color="#8AC1AF"/><stop offset=".45" stop-color="#519688"/><stop offset="1" stop-color="#266F68"/></linearGradient>
 <linearGradient id="${pre}-fox" x2=".6" y2="1"><stop stop-color="#ECAF64"/><stop offset=".45" stop-color="#D68549"/><stop offset="1" stop-color="#A95635"/></linearGradient>
 <linearGradient id="${pre}-apple" x2=".8" y2="1"><stop stop-color="#E6A077"/><stop offset=".35" stop-color="#CA6B54"/><stop offset="1" stop-color="#963E3D"/></linearGradient>
 <linearGradient id="${pre}-pear" x2=".7" y2="1"><stop stop-color="#E7CC76"/><stop offset=".4" stop-color="#B9BA60"/><stop offset="1" stop-color="#788C4D"/></linearGradient>
 <radialGradient id="${pre}-light"><stop stop-color="#FFE8A5" stop-opacity=".9"/><stop offset="1" stop-color="#FFE8A5" stop-opacity="0"/></radialGradient>
 <filter id="${pre}-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="5" stdDeviation="3" flood-color="#263D38" flood-opacity=".16"/></filter>
 </defs>`;}
function tree(x,y,s=1,kind=0){return g(
 e(0,3,48,9,'#395B44','opacity=".13"')+line('M0 0Q-5-70 0-137','#826B48',10)+line('M0-55L-27-92M0-82L23-113','#826B48',6)+
 p(kind?'M-47-89Q-66-116-38-143Q-47-174-12-181Q17-211 41-169Q76-153 50-119Q58-87 22-83Z':'M-52-78Q-74-112-43-136Q-53-169-18-178Q6-211 35-177Q74-172 64-137Q83-106 49-83Q29-64-2-76Z',url('leaf'))+
 p('M-42-129Q-51-154-24-162Q-7-187 14-170Q29-180 44-153Q16-162 2-141Q-19-121-42-129Z','#B6C087','opacity=".5"')+
 line('M-25-112q18-8 28-24m12 28q18-7 23-21','#CCD39C',2,'opacity=".4"')+
 Array.from({length:9},(_,i)=>g(p('M0 0q-9-10 3-13q9 8-3 13Z',i%2?'#D0D59C':'#839C66','opacity=".48"'),`translate(${-32+(i*23)%76} ${-99-(i*17)%61}) rotate(${i*39})`)).join('')+line('M-2-10l-2-27M-3-47v-11','#C0A474',2)+
 (kind?e(27,-138,5,6,'#E5B468')+e(-27,-113,4,5,coral):''),`translate(${x} ${y}) scale(${s})`);}
function tuft(x,y,s=1){return g(p('M-18 0Q-23-22-9-28Q-2-17 0-5Q0-34 12-35Q18-20 8-3Q29-24 30-9L19 3Z','#547654')+line('M0 1Q4-14 10-26','#8FA773',2),`translate(${x} ${y}) scale(${s})`);}
function flower(x,y,s=1,c=coral){return g(line('M0 0Q5-19 0-36','#3C6950',3)+p('M2-10Q-24-29-19-9Q-5-2 2-10M3-17Q20-34 21-21Q17-11 3-17','#779858')+Array.from({length:5},(_,i)=>g(e(0,-44,7,10,c),`rotate(${i*72} 0 -36)`)).join('')+e(0,-36,6,6,'#F8CF77')+e(-2,-38,2,2,cream),`translate(${x} ${y}) scale(${s})`);}
function stones(x,y,s=1){return g(e(-13,0,24,9,'#AFAD8F')+p('M-37-2Q-29-18-7-9L10 0Z','#D0C4A2')+e(28,4,18,7,'#A1A688')+p('M11 3Q23-8 42 3Z','#D5CCAC'),`translate(${x} ${y}) scale(${s})`);}
function bird(x,y,s=1){return g(line('M-12 0Q-5-8 0 0Q6-9 14-3','#678273',2),`translate(${x} ${y}) scale(${s})`);}
function windowArt(x,y,s=1,lit=false){return g(p('M-24 31V-8Q-24-38 0-38Q24-38 24-8V31Z','#866D51')+p('M-18 25V-7Q-18-30 0-30Q18-30 18-7V25Z',lit?'#F7CD73':'#738F84')+line('M0-29V26M-18 0H18','#F5E3B7',4)+r(-30,28,60,8,4,url('wood'))+(lit?line('M-12-16l7-7','#FFF3BF',3):''),`translate(${x} ${y}) scale(${s})`);}
function bunting(x,y,w){return g(line(`M0 0Q${w/2} 66 ${w} 0`,'#685E47',3)+Array.from({length:9},(_,i)=>{let xx=16+i*(w-32)/9,yy=33*Math.sin(xx/w*Math.PI);return p(`M${xx} ${yy}l29 6-11 33Z`,[coral,'#E6B868',teal,plum][i%4])+line(`M${xx+5} ${yy+5}l18 4`,cream,1,'opacity=".55"');}).join(''),`translate(${x} ${y})`);}
function book(){return p('M19 51Q64 34 120 60Q172 34 220 51L225 192Q170 178 120 204Q65 181 15 192Z',plum,`stroke="#51484D" stroke-width="3"`)+p('M26 48Q73 36 120 61V193Q72 173 26 181Z',url('wall'))+p('M120 61Q168 35 215 48V181Q164 176 120 193Z',cream)+line('M120 64v127M34 170q42-5 76 13M132 183q40-15 74-13','#BEAC89',2)+p('M171 43l13-1v83l-7-7-7 9Z',coral)+p('M58 90Q86 67 97 101Q79 127 58 90Z','#9BAB7C')+line('M64 94l26 14','#647A53',2);}

export function setPrefix(value){pre=value;}
export {ink,cream,teal,coral,plum,p,line,e,r,g,url,layer,result,initial,defs,tree,tuft,flower,stones,bird,windowArt,bunting,book};
