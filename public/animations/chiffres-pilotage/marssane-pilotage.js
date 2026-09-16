import { observeSchemaVisibility } from "../observe-schema-visibility.js";

/** Marssane — Chiffres et pilotage. SVG + CSS + JavaScript natif. */
const portrait = new URL('./jacque.jpg', import.meta.url).href;
const fontURL = new URL('./jakarta.woff2', import.meta.url).href;
let fontReady;
const loadFont = () => fontReady ??= (async () => {
 const face = new FontFace('MarssanePilotageJakarta', `url(${fontURL})`, {weight:'200 800',style:'normal'});
 document.fonts.add(face);
 await face.load();
})();
const duration = 13;
const clamp = v => Math.max(0, Math.min(1, v));
const ramp = (t,a,b) => { const p=clamp((t-a)/(b-a)); return p*p*(3-2*p); };
const active = (t,a,b) => ramp(t,a,a+.18)*(1-ramp(t,b,b+.25));
const agent = {x:426,y:280,r:62};
const anchor = degrees => {
 const a=degrees*Math.PI/180;
 return [agent.x+agent.r*Math.cos(a),agent.y+agent.r*Math.sin(a)].map(n=>n.toFixed(4)).join(' ');
};
// Endpoints meet the outer ring; the mask also keeps the signal halo outside it.
const wires = [
 {d:`M426 138 L${anchor(-90)}`,spans:[[.6,1.3]]},
 {d:`M${anchor(-145)} C332 214 342 99 292 99`,spans:[[1.6,2.2],[4.6,5.2,true]]},
 {d:`M${anchor(180)} C338 280 334 259 292 259`,spans:[[2.4,3],[5,5.6,true]]},
 {d:`M${anchor(145)} C334 348 342 419 292 419`,spans:[[3.2,3.8],[5.4,6,true]]},
 {d:`M${anchor(0)} C516 280 510 163 536 163`,spans:[[6.3,7]]}
];
// A shared data model ensures that sources and summary always agree.
// Fictitious daily signed quotes, Monday to Friday; sum = 6.
const signedByDay = [1,2,0,1,2];
const sources = [
 {title:'Facturation',y:70,value:'12 400 € HT',label:'Facturé HT',summary:'12 400 €',start:2.2,end:3,icon:'M2 0h15l6 6v23H2zM17 0v7h6M7 13h10M7 20h10'},
 {title:'Commercial',y:230,value:`${signedByDay.reduce((a,b)=>a+b,0)} devis signés`,label:'Devis signés',summary:String(signedByDay.reduce((a,b)=>a+b,0)),start:3,end:3.8,icon:'M2 2h22v25H2zM7 8h12M7 14h5m3 6 3 3 7-8'},
 {title:'Projets',y:390,value:'3 en cours',label:'Projets en cours',summary:'3',start:3.8,end:4.6,icon:'M0 7h10l4-5h12v26H0zM6 14h14M6 21h9'}
];
const template=`<style>
:host{display:block;width:100%;--schema-background:#FFFFFF;--schema-label:#152C35;--schema-wire:#829E93;--schema-signal:#996222;--schema-border:#B6CBBF;--schema-control:#46695C;color:#152C35;font-family:MarssanePilotageJakarta,'Plus Jakarta Sans',Arial,sans-serif}
:host([theme="dark"]){--schema-background:#0D1118;--schema-label:#FFFFFF;--schema-wire:#829E93;--schema-signal:#D3994F;--schema-border:#B6CBBF;--schema-control:#AAC4C0}
.frame{position:relative;background:var(--schema-background);border-radius:20px;overflow:hidden}svg{display:block;width:100%;height:auto}text{font-family:inherit;letter-spacing:-.015em;font-weight:550}.card{fill:#F5F8F4;stroke:var(--schema-border);stroke-width:1.5}.wire{fill:none;stroke:var(--schema-wire);stroke-width:2.5;stroke-linecap:butt}.signal{fill:none;stroke:var(--schema-signal);stroke-width:3}.ink{fill:#152C35}.muted{fill:#D5E2DA}.accent{color:#996222}.number{font-weight:650;letter-spacing:-.025em}.icon{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.pause{position:absolute;bottom:8px;left:calc(44.375% - 16px);display:grid;place-items:center;width:32px;height:32px;padding:0;border:1px solid var(--schema-wire);border-radius:50%;background:var(--schema-background);color:var(--schema-control);cursor:pointer}.pause:focus-visible{outline:3px solid var(--schema-signal);outline-offset:3px}.pause svg{width:13px;height:13px}.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
</style>
<div class="frame">
<svg viewBox="0 0 960 540" role="img" aria-labelledby="title desc">
<title id="title">Chiffres et pilotage avec Jacque</title>
<desc id="desc">Chaque semaine, Jacque rassemble les informations de la facturation, du suivi commercial et des projets. Il prépare une diapositive PowerPoint pour le point hebdomadaire : 12 400 euros facturés hors taxes, 6 devis signés sur la semaine et 3 projets en cours. Exemple fictif. La présentation est prête à présenter, sans envoi automatique.</desc>
<defs>
 <clipPath id="portrait"><circle cx="426" cy="280" r="54"/></clipPath>
 ${sources.map((s,i)=>`<clipPath id="sourceClip${i}"><rect id="sourceReveal${i}" x="42" y="${s.y}" width="250" height="58" rx="15"/></clipPath>`).join('')}
 <clipPath id="docClip"><rect id="docReveal" x="536" y="139" width="402" height="48" rx="10"/></clipPath>
 <mask id="outsideAgent"><rect width="960" height="540" fill="white"/><circle cx="426" cy="280" r="62" fill="black"/></mask>
 <linearGradient id="paperCurl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B7C7BD"/><stop offset=".4" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D5E2DA"/></linearGradient>
</defs>
<g mask="url(#outsideAgent)">
 ${wires.map((w,i)=>`<path id="wire${i}" class="wire" d="${w.d}"/><g id="signal${i}" opacity="0"><path class="signal" d="${w.d}" opacity=".5"/><g id="particle${i}"><circle r="10" fill="var(--schema-signal)" opacity=".16"/><circle r="4.5" fill="var(--schema-signal)"/></g></g>`).join('')}
</g>
<g data-node="rythme">
 <rect id="scheduleBorder" class="card" x="338" y="50" width="176" height="88" rx="15"/>
 <g class="icon accent" transform="translate(413 64)"><rect x="0" y="4" width="26" height="24" rx="3"/><path d="M6 0v8M20 0v8M0 12h26m-17 6h8"/></g>
 <text x="426" y="120" text-anchor="middle" font-size="21" class="ink">Chaque semaine</text>
</g>
${sources.map((s,i)=>`<g data-node="source-${i}" clip-path="url(#sourceClip${i})">
 <rect id="sourceBorder${i}" class="card" x="42" y="${s.y}" width="250" height="114" rx="15"/>
 <g class="icon accent" transform="translate(59 ${s.y+15})"><path d="${s.icon}"/></g>
 <text x="97" y="${s.y+38}" font-size="25" class="ink">${s.title}</text>
 <path d="M60 ${s.y+58}H274" stroke="#D5E2DA"/>
 <text x="62" y="${s.y+94}" font-size="27" class="ink number">${s.value}</text>
 <path id="sourceCurl${i}" fill="url(#paperCurl)" opacity="0"/>
</g>`).join('')}
<g data-node="agent">
 <circle cx="426" cy="280" r="62" fill="var(--schema-background)" stroke="#D3994F" stroke-width="1.5"/>
 <circle id="agentRing" cx="426" cy="280" r="62" fill="none" stroke="var(--schema-signal)" stroke-width="3" stroke-dasharray="59 330" opacity="0"/>
 <g clip-path="url(#portrait)"><circle cx="426" cy="280" r="54" fill="#0E0E12"/><image href="${portrait}" x="334.2" y="223.6" width="183.6" height="183.6"/></g>
 <text x="426" y="379" text-anchor="middle" font-size="30" fill="var(--schema-label)">Jacque</text>
</g>
<g data-node="synthese">
 <g clip-path="url(#docClip)">
  <!-- Fixed file header; the landscape slide unfolds only after signal arrival. -->
  <rect x="536" y="139" width="402" height="48" rx="10" class="card"/>
  <rect x="550" y="149" width="28" height="28" rx="5" fill="#B7472A"/>
  <text x="564" y="170" text-anchor="middle" font-size="22" fill="#FFFFFF" class="number">P</text>
  <text x="590" y="171" font-size="24" class="ink">PowerPoint</text>
  <g class="icon accent" transform="translate(899 153)"><rect width="22" height="15" rx="2"/><path d="M11 15v8m-7 0h14"/></g>
  <!-- Actual slide canvas: 402 × 226.125, exactly 16:9. -->
  <rect id="docBorder" x="536" y="197" width="402" height="226.125" rx="3" fill="#FFFFFF" stroke="var(--schema-border)" stroke-width="1.5"/>
  <path d="M539 198H935" stroke="#D3994F" stroke-width="3"/>
  <text x="558" y="234" font-size="28" class="ink number">Point hebdo</text>
  <text x="558" y="258" font-size="16" fill="#536B62">Semaine écoulée</text>
  <g data-metric="facturation">
   <text x="558" y="307" font-size="34" class="ink number">${sources[0].summary}</text>
   <text x="558" y="333" font-size="18" fill="#536B62">${sources[0].label}</text>
  </g>
  <g data-metric="commercial">
   <text x="558" y="369" font-size="28" fill="#996222" class="number">${sources[1].summary}</text>
   <text x="558" y="389" font-size="14" fill="#536B62">Devis signés</text>
  </g>
  <path d="M651 349V390" stroke="#DDE7E0"/>
  <g data-metric="projets">
   <text x="672" y="369" font-size="28" fill="#996222" class="number">${sources[2].summary}</text>
   <text x="672" y="389" font-size="14" fill="#536B62">Projets</text>
   <text x="672" y="405" font-size="14" fill="#536B62">en cours</text>
  </g>
  <!-- A real, coherent miniature chart gives the output the visual grammar of a slide. -->
  <g data-chart="devis-par-jour" role="img" aria-label="Devis signés du lundi au vendredi : 1, 2, 0, 1, 2. Total : 6.">
   <rect x="742" y="271" width="174" height="130" rx="8" fill="#F7EDD9"/>
   <text x="755" y="292" font-size="16" class="ink">Devis signés</text>
   <path d="M755 333H903" stroke="#E8D9BA" stroke-dasharray="3 4"/>
   <path d="M755 371H903" stroke="#C6AD83"/>
   ${signedByDay.map((count,i)=>`<g data-bar-value="${count}">
    <rect x="${758+i*29}" y="${371-count*27}" width="17" height="${count*27}" rx="2" fill="${i===4?'#996222':'#D3994F'}"/>
    <text x="${766.5+i*29}" y="${365-count*27}" text-anchor="middle" font-size="12" fill="#86551B">${count}</text>
    <text x="${766.5+i*29}" y="389" text-anchor="middle" font-size="12" fill="#536B62">${['L','M','M','J','V'][i]}</text>
   </g>`).join('')}
  </g>
  <path d="M558 403H592" stroke="#D3994F" stroke-width="3"/>
  <text x="916" y="408" text-anchor="end" font-size="13" fill="#536B62">01</text>
  <rect id="resultFlash" x="536" y="197" width="402" height="226.125" rx="3" fill="#D3994F" opacity="0"/>
  <path id="docCurl" fill="url(#paperCurl)" opacity="0"/>
 </g>
 <rect id="completionOutline" x="536" y="197" width="402" height="226.125" rx="3" fill="none" stroke="#D3994F" stroke-width="2.5" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" opacity="0"/>
 <g id="ready" opacity="0"><rect x="536" y="440" width="402" height="38" rx="10" fill="#F7EDD9"/><path id="completionCheck" d="m622 458 5 5 10-12" fill="none" stroke="#86551B" stroke-width="2.5" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/><text x="652" y="466" font-size="22" fill="#86551B">Prêt à présenter</text></g>
</g>
</svg>
<button class="pause" type="button" aria-label="Mettre l’animation en pause"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3v10M11 3v10" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
</div>`;

export class MarssanePilotage extends HTMLElement{
 constructor(){super();this.attachShadow({mode:'open'}).innerHTML=template;this.elapsed=0;this.running=true;this.inView=false;this.raf=0;this.last=0;this.nodes={};this.reduced=matchMedia('(prefers-reduced-motion: reduce)');this.onVisibility=()=>this.schedule();this.onPreference=()=>{if(this.reduced.matches){this.pause();this.seek(9);}else this.schedule();};}
 connectedCallback(){
  this.shadowRoot.querySelectorAll('[id]').forEach(el=>this.nodes[el.id]=el);
  this.paths=wires.map((_,i)=>({node:this.nodes['wire'+i],length:this.nodes['wire'+i].getTotalLength()}));
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
 border(id,value){this.nodes[id].style.stroke=value>.1?'var(--schema-signal)':'var(--schema-border)';}
 unroll(id,curl,x,y,width,closed,opened,progress){
  const height=closed+(opened-closed)*progress, bottom=y+height;
  this.nodes[id].setAttribute('height',height.toFixed(3));
  this.nodes[curl].setAttribute('d',`M${x+2} ${bottom-10} Q${x+width/2} ${bottom-4} ${x+width-2} ${bottom-10} L${x+width-2} ${bottom-1} Q${x+width/2} ${bottom+5} ${x+2} ${bottom-1} Z`);
  this.opacity(curl,Math.sin(Math.PI*progress)*.85);
 }
 draw(t){
  const reset=1-ramp(t,12.45,duration);
  this.border('scheduleBorder',active(t,.2,1.3));
  sources.forEach((s,i)=>{
   this.unroll('sourceReveal'+i,'sourceCurl'+i,42,s.y,250,58,114,ramp(t,s.start,s.end)*reset);
   this.border('sourceBorder'+i,active(t,s.start,6));
  });
  this.opacity('agentRing',active(t,1.3,7.8));
  this.nodes.agentRing.setAttribute('stroke-dashoffset',String(-Math.max(0,Math.min(t-1.3,6.5))*72));
  this.unroll('docReveal','docCurl',536,139,402,48,284.125,ramp(t,7,8)*reset);
  const completion=ramp(t,8.1,8.55), check=ramp(t,8.25,8.55);
  this.nodes.completionOutline.setAttribute('stroke-dashoffset',String(1-completion));
  this.opacity('completionOutline',completion*reset);
  this.nodes.completionCheck.setAttribute('stroke-dashoffset',String(1-check));
  this.opacity('resultFlash',Math.sin(Math.PI*completion)*.1);
  this.opacity('ready',ramp(t,8.15,8.55)*reset);
  wires.forEach((w,i)=>{
   let opacity=0,progress=0;
   for(const [start,end,reverse=false] of w.spans){
    const a=active(t,start-.12,end+.05);
    if(a>opacity){opacity=a;progress=ramp(t,start,end);if(reverse)progress=1-progress;}
   }
   this.opacity('signal'+i,opacity);
   const point=this.paths[i].node.getPointAtLength(this.paths[i].length*progress);
   this.nodes['particle'+i].setAttribute('transform',`translate(${point.x} ${point.y})`);
  });
 }
 updateButton(){const b=this.shadowRoot.querySelector('button');b.setAttribute('aria-label',this.running?'Mettre l’animation en pause':'Lire l’animation');b.querySelector('path').setAttribute('d',this.running?'M5 3v10M11 3v10':'M5 3l7 5-7 5z');}
 schedule(){cancelAnimationFrame(this.raf);this.last=0;if(this.isConnected&&this.running&&this.inView&&!document.hidden){this.raf=requestAnimationFrame(this.tick);}}
 tick=(now)=>{if(this.last)this.elapsed=(this.elapsed+(now-this.last)/1000)%duration;this.last=now;this.draw(this.elapsed);this.raf=requestAnimationFrame(this.tick);};
 play(){this.running=true;this.updateButton();this.schedule();}
 pause(){this.running=false;this.updateButton();this.schedule();}
 seek(seconds){this.elapsed=Math.max(0,Math.min(duration-.001,Number(seconds)||0));this.draw(this.elapsed);this.last=0;}
}
if(!customElements.get('marssane-pilotage'))customElements.define('marssane-pilotage',MarssanePilotage);
