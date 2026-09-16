import { observeSchemaVisibility } from "../observe-schema-visibility.js";

/** Marssane — Secrétaire digital : du vocal aux dossiers et à la to-do list.
 * SVG/CSS/JS natif, dérivé de la référence validée v8. */
const portrait=new URL('./alma.png',import.meta.url).href;
const fontURL=new URL('./jakarta.woff2',import.meta.url).href;
let fontReady;
const loadFont=()=>fontReady??=(async()=>{
 const face=new FontFace('MarssaneVocalJakarta',`url(${fontURL})`,{weight:'200 800',style:'normal'});
 document.fonts.add(face);await face.load();
})();
const duration=13.2;
const clamp=v=>Math.max(0,Math.min(1,v));
const ramp=(t,a,b)=>{const p=clamp((t-a)/(b-a));return p*p*(3-2*p);};
const active=(t,a,b)=>ramp(t,a,a+.18)*(1-ramp(t,b,b+.25));
const alma={x:380,y:262,r:62};
const anchor=degrees=>{const a=degrees*Math.PI/180;return `${alma.x+alma.r*Math.cos(a)} ${alma.y+alma.r*Math.sin(a)}`;};
// Les liens se terminent sur le cercle extérieur, et sur les en-têtes fixes.
const wires=[
 {d:`M230 262 C268 262 286 262 ${anchor(180)}`,spans:[[.8,1.55]]},
 {d:`M${anchor(90)} L380 359`,spans:[[1.65,2.15]]},
 {d:`M${anchor(-30)} C481 204 470 84 520 84`,spans:[[3.8,4.55],[6.05,6.6,true]]},
 {d:`M${anchor(12)} C500 288 550 311 608 311`,spans:[[6.75,7.35]]},
];
const sheets=[
 {id:'paper',x:226,y:359,w:346,h:162,fold:36,start:2.15,end:3.65},
 {id:'folder',x:520,y:55,w:396,h:190,fold:58,start:4.55,end:5.45,done:5.55},
 {id:'todo',x:608,y:282,w:316,h:208,fold:58,start:7.35,end:8.1,done:8.25},
];
const template=`<style>
:host{display:block;width:100%;color:#152C35;font-family:MarssaneVocalJakarta,'Plus Jakarta Sans',Arial,sans-serif;--bg:#FFFFFF;--label:#152C35;--wire:#829E93;--border:#B6CBBF;--accent:#52A6D1;--signal:#287899}
:host([theme="dark"]){--bg:#0D1118;--label:#FFFFFF;--wire:#69828A;--signal:#77C7EF}
.frame{position:relative;background:var(--bg);border-radius:20px;overflow:hidden}svg{display:block;width:100%;height:auto}text{font-family:inherit;letter-spacing:-.015em;font-weight:550}.card{fill:#F5F8F4;stroke:var(--border);stroke-width:1.5}.wire{fill:none;stroke:var(--wire);stroke-width:2.5;stroke-linecap:butt}.signal{fill:none;stroke:var(--signal);stroke-width:3}.icon{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.blue{color:#287899}.muted{fill:#536B62}.strong{font-weight:650}.pause{position:absolute;bottom:10px;left:12px;display:grid;place-items:center;width:32px;height:32px;padding:0;border:1px solid var(--wire);border-radius:50%;background:var(--bg);color:var(--label);cursor:pointer}.pause:focus-visible{outline:3px solid var(--signal);outline-offset:3px}.pause svg{width:13px;height:13px}
</style>
<div class="frame">
<svg viewBox="0 0 960 540" role="img" aria-labelledby="title desc">
<title id="title">Secrétaire digital — du vocal à la to-do list avec Alma</title>
<desc id="desc">Vous envoyez un vocal WhatsApp à Alma : pour Mme Martin, décaler la pose à jeudi, noter l’accès par la cour et ajouter une tâche pour confirmer l’heure. Alma comprend la demande, met à jour le dossier Martin, puis ajoute la tâche à votre to-do list. Les cases restent vides : les tâches sont à faire. Exemple fictif, sans envoi au client.</desc>
<defs>
 <clipPath id="portrait"><circle cx="380" cy="262" r="54"/></clipPath>
 ${sheets.map(s=>`<clipPath id="${s.id}Clip"><rect id="${s.id}Reveal" x="${s.x}" y="${s.y}" width="${s.w}" height="${s.fold}" rx="12"/></clipPath>`).join('')}
 <mask id="outsideAlma"><rect width="960" height="540" fill="white"/><circle cx="380" cy="262" r="62" fill="black"/></mask>
 <linearGradient id="paperCurl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B7C7BD"/><stop offset=".4" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D5E2DA"/></linearGradient>
</defs>
<g mask="url(#outsideAlma)">
${wires.map((w,i)=>`<path id="wire${i}" class="wire" d="${w.d}"/><g id="signal${i}" opacity="0"><path class="signal" d="${w.d}" opacity=".45"/><g id="particle${i}"><circle r="10" fill="var(--signal)" opacity=".16"/><circle r="4.5" fill="var(--signal)"/></g></g>`).join('')}
</g>
<g data-node="vocal">
 <rect id="voiceBorder" class="card" x="34" y="197" width="196" height="139" rx="15"/>
 <g class="icon" color="#11785B" transform="translate(51 214)"><path d="M26 13a13 13 0 0 1-19 11L0 26l2-7A13 13 0 1 1 26 13Z"/><path d="M8 6c-4 4 3 13 9 13l3-4-5-2-2 2-3-4 1-2Z"/></g>
 <text x="89" y="235" font-size="23" class="strong">WhatsApp</text>
 <text x="53" y="270" font-size="22">Vocal</text>
 <g id="wave">${Array.from({length:30},(_,i)=>`<rect x="${53+i*5.2}" y="298" width="2.4" height="6" rx="1.2" fill="${i<24?'#11785B':'#B5D4C8'}"/>`).join('')}</g>
</g>
<g data-node="agent">
 <circle cx="380" cy="262" r="62" fill="var(--bg)" stroke="var(--accent)" stroke-width="1.5"/>
 <circle id="agentRing" cx="380" cy="262" r="62" fill="none" stroke="var(--signal)" stroke-width="3" stroke-dasharray="59 330" opacity="0"/>
 <g clip-path="url(#portrait)"><circle cx="380" cy="262" r="54" fill="#0E0E12"/><image href="${portrait}" x="288.2" y="205.6" width="183.6" height="183.6"/></g>
 <text x="380" y="181" text-anchor="middle" font-size="30" fill="var(--label)">Alma</text>
</g>
<g data-node="transcription" clip-path="url(#paperClip)">
 <rect class="card" x="226" y="359" width="346" height="162" rx="12"/>
 <path d="M244 383h13m-13-6h21" class="icon blue"/>
 <text x="279" y="384" font-size="13" class="muted" style="letter-spacing:.08em;font-weight:650">VOTRE DEMANDE</text>
 <text id="transcript" font-size="21" style="font-weight:500"><tspan x="245" y="415">Pour Mme Martin,</tspan><tspan x="245" y="444">décale la pose à jeudi.</tspan><tspan x="245" y="473">Note : accès par la cour.</tspan><tspan x="245" y="502">Ajoute : confirmer l’heure.</tspan></text>
 <path id="paperCurlEdge" fill="url(#paperCurl)" opacity="0"/>
</g>
<g data-node="dossier">
 <g clip-path="url(#folderClip)">
  <rect class="card" x="520" y="55" width="396" height="190" rx="12"/>
  <g class="icon blue" transform="translate(541 73)"><path d="M0 2h10l4 5h14v21H0zM0 7h14"/></g>
  <text x="584" y="95" font-size="27" class="strong">Dossier · Martin</text>
  <path d="M540 112H896" stroke="#D5E2DA"/>
  <g class="icon blue" transform="translate(543 130)"><rect width="22" height="22" rx="3"/><path d="M0 7h22M6-3v6m10-6v6"/></g>
  <text x="582" y="151" font-size="24">Pose · jeudi</text>
  <g class="icon blue" transform="translate(546 173)"><path d="M8 0a8 8 0 0 1 8 8c0 6-8 13-8 13S0 14 0 8a8 8 0 0 1 8-8Z"/><circle cx="8" cy="8" r="2.5"/></g>
  <text x="582" y="193" font-size="24">Accès par la cour</text>
  <g id="folderReady" opacity="0"><path id="folderCheck" d="m548 223 5 5 10-11" class="icon" color="#11785B" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/><text x="582" y="231" font-size="21" fill="#11785B">Dossier mis à jour</text></g>
  <path id="folderCurlEdge" fill="url(#paperCurl)" opacity="0"/>
 </g>
 <rect id="folderOutline" x="520" y="55" width="396" height="190" rx="12" fill="none" stroke="#11785B" stroke-width="2" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" opacity="0"/>
</g>
<g data-node="todo">
 <g clip-path="url(#todoClip)">
  <rect x="608" y="282" width="316" height="208" rx="12" fill="#FFFFFF" stroke="var(--border)" stroke-width="1.5"/>
  <path d="M620 283H912" stroke="var(--accent)" stroke-width="3"/>
  <g class="icon blue" transform="translate(629 301)"><path d="m0 5 3 3 5-6m-8 17 3 3 5-6M13 6h13M13 20h13"/></g>
  <text x="669" y="323" font-size="28" class="strong">Ma to-do list</text>
  <path d="M628 340H904" stroke="#DDE7E0"/>
  <text x="631" y="373" font-size="21" class="muted">Mme Martin</text>
  <rect x="624" y="386" width="284" height="43" rx="7" fill="#EAF4F9"/>
  <rect x="635" y="398" width="17" height="17" rx="4" fill="#FFFFFF" stroke="#287899" stroke-width="1.8"/>
  <text x="665" y="416" font-size="23">Confirmer l’heure</text>
  <rect x="635" y="449" width="17" height="17" rx="4" fill="#FFFFFF" stroke="#829E93" stroke-width="1.8"/>
  <text x="665" y="467" font-size="23">Pose · jeudi</text>
  <path id="todoCurlEdge" fill="url(#paperCurl)" opacity="0"/>
 </g>
 <rect id="todoOutline" x="608" y="282" width="316" height="208" rx="12" fill="none" stroke="#11785B" stroke-width="2.5" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" opacity="0"/>
 <g id="todoReady" opacity="0"><rect x="608" y="501" width="316" height="32" rx="9" fill="#DCF4E8"/><path id="todoCheck" d="m632 516 5 5 10-11" class="icon" color="#11785B" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/><text x="662" y="524" font-size="21" fill="#11785B">To-do list à jour</text></g>
</g>
</svg>
<button class="pause" type="button" aria-label="Mettre l’animation en pause"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3v10M11 3v10" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
</div>`;

export class MarssaneSecretaireVocal extends HTMLElement{
 constructor(){super();this.attachShadow({mode:'open'}).innerHTML=template;this.elapsed=0;this.running=true;this.inView=false;this.raf=0;this.last=0;this.nodes={};this.reduced=matchMedia('(prefers-reduced-motion: reduce)');this.onVisibility=()=>this.schedule();this.onPreference=()=>{if(this.reduced.matches){this.pause();this.seek(9);}else this.schedule();};}
 connectedCallback(){
  this.shadowRoot.querySelectorAll('[id]').forEach(el=>this.nodes[el.id]=el);
  this.paths=wires.map((_,i)=>({node:this.nodes['wire'+i],length:this.nodes['wire'+i].getTotalLength()}));
  this.bars=[...this.shadowRoot.querySelectorAll('#wave rect')];
  this.shadowRoot.querySelector('button').onclick=()=>this.running?this.pause():this.play();
  this.setAttribute('data-font-status','loading');
  loadFont().then(()=>this.setAttribute('data-font-status','ready')).catch(()=>this.setAttribute('data-font-status','fallback'));
  this.observer=observeSchemaVisibility(this);
  document.addEventListener('visibilitychange',this.onVisibility);this.reduced.addEventListener('change',this.onPreference);
  if(this.reduced.matches){this.running=false;this.elapsed=9;}
  this.draw(this.elapsed);this.updateButton();this.schedule();
 }
 disconnectedCallback(){cancelAnimationFrame(this.raf);this.observer?.disconnect();document.removeEventListener('visibilitychange',this.onVisibility);this.reduced.removeEventListener('change',this.onPreference);}
 opacity(id,value){this.nodes[id].setAttribute('opacity',value.toFixed(3));}
 draw(t){
  const reset=1-ramp(t,12.7,duration);
  const speech=Math.min(Math.max(t-.2,0),1.4);
  this.bars.forEach((b,i)=>{const h=5+25*Math.abs(Math.sin(i*1.51+speech*3.8)*Math.cos(i*.2-speech*1.6));b.setAttribute('y',(303-h/2).toFixed(2));b.setAttribute('height',h.toFixed(2));});
  this.nodes.voiceBorder.style.stroke=active(t,.2,1.65)>.1?'#11785B':'var(--border)';
  this.opacity('agentRing',active(t,1.4,7.65));this.nodes.agentRing.setAttribute('stroke-dashoffset',String(-Math.max(0,Math.min(t-1.4,6.5))*72));
  for(const s of sheets){
   const unroll=ramp(t,s.start,s.end)*reset,h=s.fold+(s.h-s.fold)*unroll,bottom=s.y+h;
   this.nodes[s.id+'Reveal'].setAttribute('height',h.toFixed(3));
   this.nodes[s.id+'CurlEdge'].setAttribute('d',`M${s.x+2} ${bottom-10} Q${s.x+s.w/2} ${bottom-4} ${s.x+s.w-2} ${bottom-10} L${s.x+s.w-2} ${bottom-1} Q${s.x+s.w/2} ${bottom+5} ${s.x+2} ${bottom-1} Z`);
   this.opacity(s.id+'CurlEdge',Math.sin(Math.PI*unroll)*.85);
   if(s.done){
    const completion=ramp(t,s.done,s.done+.45);
    this.opacity(s.id+'Outline',completion*reset);
    this.nodes[s.id+'Outline'].setAttribute('stroke-dashoffset',String(1-completion));
    this.opacity(s.id+'Ready',completion*reset);
    this.nodes[s.id+'Check'].setAttribute('stroke-dashoffset',String(1-ramp(t,s.done+.1,s.done+.45)));
   }
  }
  wires.forEach((w,i)=>{let opacity=0,progress=0;for(const [start,end,reverse=false] of w.spans){const a=active(t,start-.12,end+.05);if(a>opacity){opacity=a;progress=ramp(t,start,end);if(reverse)progress=1-progress;}}this.opacity('signal'+i,opacity);const point=this.paths[i].node.getPointAtLength(this.paths[i].length*progress);this.nodes['particle'+i].setAttribute('transform',`translate(${point.x} ${point.y})`);});
 }
 updateButton(){const b=this.shadowRoot.querySelector('button');b.setAttribute('aria-label',this.running?'Mettre l’animation en pause':'Lire l’animation');b.querySelector('path').setAttribute('d',this.running?'M5 3v10M11 3v10':'M5 3l7 5-7 5z');}
 schedule(){cancelAnimationFrame(this.raf);this.last=0;if(this.isConnected&&this.running&&this.inView&&!document.hidden){this.raf=requestAnimationFrame(this.tick);}}
 tick=(now)=>{if(this.last)this.elapsed=(this.elapsed+(now-this.last)/1000)%duration;this.last=now;this.draw(this.elapsed);this.raf=requestAnimationFrame(this.tick);};
 play(){this.running=true;this.updateButton();this.schedule();}
 pause(){this.running=false;this.updateButton();this.schedule();}
 seek(seconds){const t=Number(seconds);this.elapsed=Math.max(0,Math.min(duration-.001,Number.isFinite(t)?t:0));if(this.paths)this.draw(this.elapsed);this.last=0;}
}
if(!customElements.get('marssane-secretaire-vocal'))customElements.define('marssane-secretaire-vocal',MarssaneSecretaireVocal);
