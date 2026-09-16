import { observeSchemaVisibility } from "../observe-schema-visibility.js";

/** Marssane — Schéma SVG animé, sans bibliothèque ni lecteur vidéo. */
const portrait=new URL('./noe.jpg',import.meta.url).href;
const fontURL=new URL('./jakarta.woff2',import.meta.url).href;
// Load the bundled face once. FontFaceSet.check can return true for an
// unknown family when no matching face has been registered yet.
let fontReady;
const loadFont=()=>fontReady??=(async()=>{
 const face=new FontFace('MarssaneProspectionJakarta',`url(${fontURL})`,{weight:'200 800',style:'normal'});
 document.fonts.add(face);
 await face.load();
})();
const duration=12.3;
const clamp=v=>Math.max(0,Math.min(1,v));
const ramp=(t,a,b)=>{const p=clamp((t-a)/(b-a));return p*p*(3-2*p);};
const active=(t,a,b)=>ramp(t,a,a+.18)*(1-ramp(t,b,b+.25));
// Same circle geometry and protective mask as the approved reference.
const noe={x:476,y:137,r:62};
const anchor=degrees=>{const a=degrees*Math.PI/180;return [(noe.x+noe.r*Math.cos(a)).toFixed(4),(noe.y+noe.r*Math.sin(a)).toFixed(4)].join(' ');};
// A branched selection replaces the central star of the quote reference.
// Each prospect has its own incoming signal; only Atelier Sève feeds the message.
const wires=[
 {d:`M258 164 H365 Q386 164 386 150 V149 Q386 137 402 137 H${anchor(180).split(' ')[0]}`,spans:[[.6,1.4]]},
 {d:`M${anchor(90)} V218 Q476 233 461 233 H341 Q326 233 326 248 V278 Q326 292 340 292 H356`,spans:[[1.85,2.6]]},
 {d:`M${anchor(90)} V218 Q476 233 461 233 H341 Q326 233 326 248 V390 Q326 404 340 404 H356`,spans:[[2.9,3.65]]},
 {d:'M610 292 H633 Q648 292 648 277 V265 Q648 250 663 250 H688',spans:[[5.1,6.1]]},
];
const template=`<style>
:host{display:block;width:100%;--schema-background:#FFFFFF;--schema-label:#152C35;--schema-wire:#829E93;--schema-signal:#397B50;--schema-border:#B6CBBF;--schema-control:#46695C;color:#152C35;font-family:MarssaneProspectionJakarta,'Plus Jakarta Sans',Arial,sans-serif}
:host([theme="dark"]){--schema-background:#0D1118;--schema-label:#FFFFFF;--schema-wire:#637D73;--schema-signal:#77B791;--schema-border:#B6CBBF;--schema-control:#AAC4C0}
.frame{position:relative;background:var(--schema-background);border-radius:20px;overflow:hidden}svg{display:block;width:100%;height:auto}text{font-family:inherit;letter-spacing:-.015em;font-weight:550}.card{fill:#F5F8F4;stroke:var(--schema-border);stroke-width:1.5}.wire{fill:none;stroke:var(--schema-wire);stroke-width:2.5;stroke-linecap:butt}.signal{fill:none;stroke:var(--schema-signal);stroke-width:3}.ink{fill:#152C35}.muted{fill:#D5E2DA}.mint{color:#11785B}.number{font-weight:650;letter-spacing:-.025em}.icon{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.pause{position:absolute;bottom:10px;left:12px;display:grid;place-items:center;width:32px;height:32px;padding:0;border:1px solid var(--schema-wire);border-radius:50%;background:var(--schema-background);color:var(--schema-control);cursor:pointer}.pause:focus-visible{outline:3px solid var(--schema-signal);outline-offset:3px}.pause svg{width:13px;height:13px}.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
</style>
<div class="frame">
<svg viewBox="0 0 960 540" role="img" aria-labelledby="title desc">
<title id="title">De la cible au premier contact avec Noé</title><desc id="desc">Noé reçoit la cible : des architectes à Lyon, pour une offre d’agencement sur mesure. Il consulte un annuaire professionnel et retient Atelier Sève et Studio Rivage. Il prépare un message personnalisé pour Atelier Sève. Le résultat est à valider. Entreprises et données fictives. Aucun message n’est envoyé.</desc>
<defs>
 <clipPath id="portrait"><circle cx="476" cy="137" r="54"/></clipPath>
 <clipPath id="firstClip"><rect id="firstReveal" x="356" y="264" width="254" height="56" rx="12"/></clipPath>
 <clipPath id="secondClip"><rect id="secondReveal" x="356" y="376" width="254" height="56" rx="12"/></clipPath>
 <clipPath id="docClip"><rect id="docReveal" x="688" y="222" width="250" height="56" rx="12"/></clipPath>
 <mask id="outsideNoe"><rect width="960" height="540" fill="white"/><circle cx="476" cy="137" r="62" fill="black"/></mask>
 <linearGradient id="paperCurl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B7C7BD"/><stop offset=".4" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D5E2DA"/></linearGradient>
</defs>
<g mask="url(#outsideNoe)">
${wires.map((w,i)=>`<path id="wire${i}" class="wire" d="${w.d}"/><g id="signal${i}" opacity="0"><path class="signal" d="${w.d}" opacity=".5"/><g id="particle${i}"><circle r="10" fill="var(--schema-signal)" opacity=".16"/><circle r="4.5" fill="var(--schema-signal)"/></g></g>`).join('')}
</g>
<!-- Three working stages: one targeting dossier, a branched shortlist, one message. -->
<g data-node="ciblage">
 <path d="M39 129h73l16 15h116a14 14 0 0 1 14 14v267a14 14 0 0 1-14 14H39a14 14 0 0 1-14-14V143a14 14 0 0 1 14-14Z" fill="#E8F1E8" stroke="var(--schema-border)" stroke-width="1.5"/>
 <rect id="targetBorder" class="card" x="25" y="144" width="233" height="281" rx="14"/>
 <g class="icon mint" transform="translate(44 158)"><circle cx="11" cy="11" r="10"/><circle cx="11" cy="11" r="4"/><path d="m11 11 11-11"/></g>
 <text x="81" y="181" font-size="27" class="ink">Ma cible</text>
 <text x="44" y="232" font-size="26" class="ink">Architectes</text>
 <text x="44" y="267" font-size="26" class="ink">Lyon</text>
 <path d="M44 291H238" stroke="#D5E2DA"/>
 <g class="icon mint" transform="translate(45 316)"><rect width="22" height="24" rx="3"/><path d="M0 8h22M0 16h22M7 8v16"/></g>
 <text x="79" y="337" font-size="22" class="ink">Annuaire pro</text>
 <g fill="#E8F1E8" stroke="#B6CBBF" stroke-width="1.3"><rect x="44" y="359" width="54" height="46" rx="7"/><rect x="114" y="359" width="54" height="46" rx="7"/><rect x="184" y="359" width="54" height="46" rx="7"/></g>
 <g class="icon" style="color:#688A72"><path d="M60 393v-23h22v23m-17-17h2m8 0h2m-12 6h2m8 0h2m-8 11v-5h4v5M130 393v-23h22v23m-17-17h2m8 0h2m-12 6h2m8 0h2m-8 11v-5h4v5M200 393v-23h22v23m-17-17h2m8 0h2m-12 6h2m8 0h2m-8 11v-5h4v5"/></g>
</g>
<g data-node="agent">
 <circle cx="476" cy="137" r="62" fill="var(--schema-background)" stroke="var(--schema-wire)" stroke-width="1.5"/>
 <circle id="agentRing" cx="476" cy="137" r="62" fill="none" stroke="var(--schema-signal)" stroke-width="3" stroke-dasharray="59 330" opacity="0"/>
 <g clip-path="url(#portrait)"><circle cx="476" cy="137" r="54" fill="#0E0E12"/><image href="${portrait}" x="384.2" y="80.6" width="183.6" height="183.6"/></g>
 <text x="476" y="54" text-anchor="middle" font-size="30" fill="var(--schema-label)">Noé</text>
</g>
${[{id:'first',y:264,name:'Atelier Sève'},{id:'second',y:376,name:'Studio Rivage'}].map(({id,y,name})=>`<g data-node="prospect-${id}" clip-path="url(#${id}Clip)">
 <rect id="${id}Border" class="card" x="356" y="${y}" width="254" height="94" rx="12"/>
 <text x="373" y="${y+37}" font-size="25" class="ink">${name}</text>
 <text x="373" y="${y+74}" font-size="21" fill="#536B62">Architectes · Lyon</text>
 <path id="${id}Check" d="m581 ${y+26} 5 5 9-11" fill="none" stroke="#397B50" stroke-width="2.5" opacity="0"/>
 <path id="${id}Curl" fill="url(#paperCurl)" opacity="0"/>
</g>`).join('')}
<g data-node="message">
 <g clip-path="url(#docClip)">
 <rect id="docBorder" x="688" y="222" width="250" height="236" rx="12" fill="#FFFFFF" stroke="var(--schema-border)" stroke-width="1.5"/>
 <rect id="resultFlash" x="688" y="222" width="250" height="236" rx="12" fill="#77B791" opacity="0"/>
 <path d="M701 223H925" stroke="#77B791" stroke-width="3"/>
 <g class="icon mint" transform="translate(705 239)"><rect y="2" width="23" height="18" rx="2"/><path d="m0 3 11.5 9L23 3"/></g>
 <text x="741" y="263" font-size="26" class="ink" style="font-weight:650">Message</text>
 <text x="705" y="303" font-size="20" class="ink" style="font-weight:650">Bonjour Atelier Sève,</text>
 <text x="705" y="340" font-size="20" class="ink" style="font-weight:500"><tspan x="705" y="340">Pour vos projets à Lyon,</tspan><tspan x="705" y="371">échangeons sur vos</tspan><tspan x="705" y="402">agencements</tspan><tspan x="705" y="433">sur mesure.</tspan></text>
 <path id="docCurl" fill="url(#paperCurl)" opacity="0"/>
 </g>
 <rect id="completionOutline" x="688" y="222" width="250" height="236" rx="12" fill="none" stroke="#397B50" stroke-width="2.5" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" opacity="0"/>
 <g id="ready" opacity="0"><rect x="688" y="475" width="250" height="38" rx="10" fill="#E8F1E8"/><path id="completionCheck" d="m745 492 5 5 9-10" fill="none" stroke="#397B50" stroke-width="2" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/><text x="776" y="501" font-size="22" fill="#397B50">À valider</text></g>
</g>
</svg>
<button class="pause" type="button" aria-label="Mettre l’animation en pause"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3v10M11 3v10" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
</div>`;

export class MarssaneProspection extends HTMLElement{
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
 border(id,value){this.nodes[id].style.stroke=value>.1?'#397B50':'var(--schema-border)';}
 draw(t){
  const reset=1-ramp(t,11.75,duration);
  this.border('targetBorder',active(t,.2,1.5));
  this.border('firstBorder',active(t,2.6,3.5)+active(t,4.8,6.1));
  this.border('secondBorder',active(t,3.65,4.55));
  this.opacity('agentRing',active(t,1.25,5.15));
  this.nodes.agentRing.setAttribute('stroke-dashoffset',String(-Math.max(0,Math.min(t-1.25,3.9))*72));
  const unfold=(id,x,y,w,closed,opened,progress)=>{
   const height=closed+(opened-closed)*progress,bottom=y+height;
   this.nodes[id+'Reveal'].setAttribute('height',height.toFixed(3));
   this.nodes[id+'Curl'].setAttribute('d',`M${x+2} ${bottom-10} Q${x+w/2} ${bottom-4} ${x+w-2} ${bottom-10} L${x+w-2} ${bottom-1} Q${x+w/2} ${bottom+5} ${x+2} ${bottom-1} Z`);
   this.opacity(id+'Curl',Math.sin(Math.PI*progress)*.85);
  };
  unfold('first',356,264,254,56,94,ramp(t,2.6,3.3)*reset);
  unfold('second',356,376,254,56,94,ramp(t,3.65,4.35)*reset);
  unfold('doc',688,222,250,56,236,ramp(t,6.1,7.15)*reset);
  this.opacity('firstCheck',ramp(t,3.3,3.55)*reset);
  this.opacity('secondCheck',ramp(t,4.35,4.6)*reset);
  const completion=ramp(t,7.3,7.75),check=ramp(t,7.45,7.75);
  this.nodes.completionOutline.setAttribute('stroke-dashoffset',String(1-completion));
  this.opacity('completionOutline',completion*reset);
  this.nodes.completionCheck.setAttribute('stroke-dashoffset',String(1-check));
  this.opacity('resultFlash',Math.sin(Math.PI*completion)*.1);
  this.opacity('ready',ramp(t,7.35,7.75)*reset);
  wires.forEach((w,i)=>{let opacity=0,progress=0;for(const [start,end,reverse=false] of w.spans){const a=active(t,start-.12,end+.05);if(a>opacity){opacity=a;progress=ramp(t,start,end);if(reverse)progress=1-progress;}}this.opacity('signal'+i,opacity);const point=this.paths[i].node.getPointAtLength(this.paths[i].length*progress);this.nodes['particle'+i].setAttribute('transform',`translate(${point.x} ${point.y})`);});
 }
 updateButton(){const b=this.shadowRoot.querySelector('button');b.setAttribute('aria-label',this.running?'Mettre l’animation en pause':'Lire l’animation');b.querySelector('path').setAttribute('d',this.running?'M5 3v10M11 3v10':'M5 3l7 5-7 5z');}
 schedule(){cancelAnimationFrame(this.raf);this.last=0;if(this.isConnected&&this.running&&this.inView&&!document.hidden){this.raf=requestAnimationFrame(this.tick);}}
 tick=(now)=>{if(this.last)this.elapsed=(this.elapsed+(now-this.last)/1000)%duration;this.last=now;this.draw(this.elapsed);this.raf=requestAnimationFrame(this.tick);};
 play(){this.running=true;this.updateButton();this.schedule();}
 pause(){this.running=false;this.updateButton();this.schedule();}
 seek(seconds){this.elapsed=Math.max(0,Math.min(duration-.001,Number(seconds)||0));this.draw(this.elapsed);this.last=0;}
}
if(!customElements.get('marssane-prospection'))customElements.define('marssane-prospection',MarssaneProspection);
