import { observeSchemaVisibility } from "../observe-schema-visibility.js";

/** Marssane — Secrétaire digital. SVG natif, dérivé de la référence web v8. */
const portrait = new URL('./elise.png', import.meta.url).href;
const fontURL = new URL('./jakarta.woff2', import.meta.url).href;
let fontReady;
const loadFont = () => fontReady ??= (async () => {
  const face = new FontFace('MarssaneSecretariatJakarta', `url(${fontURL})`, {weight:'200 800', style:'normal'});
  document.fonts.add(face);
  await face.load();
})();
const duration = 13.1;
const clamp = v => Math.max(0, Math.min(1, v));
const ramp = (t,a,b) => { const p=clamp((t-a)/(b-a)); return p*p*(3-2*p); };
const active = (t,a,b) => ramp(t,a,a+.18)*(1-ramp(t,b,b+.2));
const elise = {x:240, y:268, r:62};
const anchor = degrees => {
  const a=degrees*Math.PI/180;
  return `${elise.x+elise.r*Math.cos(a)} ${elise.y+elise.r*Math.sin(a)}`;
};
// Trois trajets sans croisement : relance, retour signé, classement.
const wires = [
  {d:`M${anchor(-60)} C320 128 434 111 578 111`, start:.9, end:1.8},
  {d:`M578 232 C470 232 394 268 ${anchor(0)}`, start:4.5, end:5.5},
  {d:`M${anchor(45)} C367 367 452 332 578 332`, start:6.2, end:7}
];
const template = `<style>
:host{display:block;width:100%;color:#152C35;font-family:MarssaneSecretariatJakarta,'Plus Jakarta Sans',Arial,sans-serif;--bg:#FFFFFF;--ink:#152C35;--wire:#829E93;--border:#B6CBBF;--accent:#9B81E4;--signal:#7756BC}
:host([theme="dark"]){--bg:#0D1118;--ink:#FFFFFF;--wire:#697E81;--signal:#B49AED}
.frame{position:relative;background:var(--bg);border-radius:20px;overflow:hidden}svg{display:block;width:100%;height:auto}text{font-family:inherit;letter-spacing:-.015em;font-weight:550}.card{fill:#F5F8F4;stroke:var(--border);stroke-width:1.5}.result{fill:white;stroke:var(--border);stroke-width:1.5}.wire{fill:none;stroke:var(--wire);stroke-width:2.5;stroke-linecap:butt}.signal{fill:none;stroke:var(--signal);stroke-width:3}.icon{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.purple{color:#7756BC}.muted{fill:#536B62}.strong{font-weight:650}.pause{position:absolute;bottom:10px;left:calc(25% - 16px);display:grid;place-items:center;width:32px;height:32px;padding:0;border:1px solid var(--wire);border-radius:50%;background:var(--bg);color:var(--ink);cursor:pointer}.pause:focus-visible{outline:3px solid var(--signal);outline-offset:3px}.pause svg{width:13px;height:13px}
</style>
<div class="frame">
<svg viewBox="0 0 960 540" role="img" aria-labelledby="title desc">
<title id="title">Secrétaire digital — relance, retour signé et classement</title>
<desc id="desc">Un seul devis, celui de M. Durand. Trois étapes : Élise relance le client après sept jours sans réponse ; le client lui renvoie le même devis signé ; Élise classe le devis dans le dossier client et ouvre le projet. Données fictives, aucune action métier réelle.</desc>
<defs>
 <clipPath id="portrait"><circle cx="240" cy="268" r="54"/></clipPath>
 <clipPath id="folderClip"><rect id="folderReveal" x="578" y="303" width="350" height="58" rx="12"/></clipPath>
 <mask id="outsideElise"><rect width="960" height="540" fill="white"/><circle cx="240" cy="268" r="62" fill="black"/></mask>
 <linearGradient id="curlGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BBCBBF"/><stop offset=".4" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D5E2DA"/></linearGradient>
</defs>
<g mask="url(#outsideElise)">
${wires.map((w,i)=>`<path id="wire${i}" class="wire" d="${w.d}"/><g id="signal${i}" opacity="0"><path class="signal" d="${w.d}" opacity=".45"/><g id="particle${i}"><circle r="10" fill="var(--signal)" opacity=".16"/><circle r="4.5" fill="var(--signal)"/></g></g>`).join('')}
</g>

<g data-node="agent">
 <circle cx="240" cy="268" r="62" fill="var(--bg)" stroke="var(--accent)" stroke-width="1.5"/>
 <circle id="agentRing" cx="240" cy="268" r="62" fill="none" stroke="var(--signal)" stroke-width="3" stroke-dasharray="59 330" opacity="0"/>
 <g clip-path="url(#portrait)"><circle cx="240" cy="268" r="54" fill="#0E0E12"/><image href="${portrait}" x="148.2" y="211.6" width="183.6" height="183.6"/></g>
 <text x="240" y="186" text-anchor="middle" font-size="30" fill="var(--ink)">Élise</text>
</g>
<g data-node="devis-durand">
 <rect id="pendingBorder" class="card" x="578" y="82" width="350" height="180" rx="12"/>
 <g class="icon purple" transform="translate(598 100)"><path d="M0 0h13l6 6v23H0zM13 0v7h6M5 14h9M5 21h9"/></g>
 <text x="635" y="123" font-size="27" class="strong">Devis · Durand</text>
 <path d="M598 139H908" stroke="#D5E2DA"/>
 <g id="pendingStatus">
  <text x="600" y="172" font-size="25">Sans réponse</text>
  <text x="600" y="203" font-size="23" class="muted">depuis 7 jours</text>
  <g id="sentStatus" opacity="0"><rect x="596" y="216" width="314" height="33" rx="8" fill="#EFEAF9"/><g class="icon purple" transform="translate(610 225)"><rect width="21" height="15" rx="2"/><path d="m1 1 9.5 7L20 1"/></g><text x="642" y="240" font-size="22" fill="#7756BC">Relance envoyée</text></g>
 </g>
 <g id="signedStatus" opacity="0">
  <path id="signedCheck" d="m606 174 8 8 15-18" class="icon" color="#11785B" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/>
  <text x="645" y="185" font-size="30" fill="#11785B">Signé</text>
  <g id="receivedStatus" opacity="0"><rect x="596" y="216" width="314" height="33" rx="8" fill="#E4F3E9"/><text x="616" y="240" font-size="22" fill="#11785B">Reçu par Élise</text></g>
 </g>
</g>
<g data-node="dossier-client">
 <g clip-path="url(#folderClip)">
  <rect class="result" x="578" y="303" width="350" height="203" rx="12"/>
  <path d="M590 304H916" stroke="var(--accent)" stroke-width="3"/>
  <g class="icon purple" transform="translate(598 321)"><path d="M0 3h10l4 5h14v19H0zM0 8h14"/></g>
  <text x="638" y="344" font-size="27" class="strong">Dossier client</text>
  <path d="M598 360H908" stroke="#DDE7E0"/>
  <text x="600" y="390" font-size="22" class="muted">M. Durand</text>
  <path d="M609 403v25h18m-18-13h18" fill="none" stroke="#B6CBBF" stroke-width="2"/>
  <g class="icon purple" transform="translate(630 405)"><path d="M0 0h8l3 4h13v16H0z"/></g><text x="664" y="423" font-size="23">Devis signé classé</text>
  <g class="icon purple" transform="translate(630 436)"><path d="M0 0h8l3 4h13v16H0z"/></g><text x="664" y="454" font-size="23">Documents</text>
  <path d="M609 428v21h18" fill="none" stroke="#B6CBBF" stroke-width="2"/>
  <g id="folderReady" opacity="0"><rect x="596" y="466" width="314" height="29" rx="8" fill="#E4F3E9"/><path id="folderCheck" d="m611 479 5 5 10-11" class="icon" color="#11785B" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/><text x="638" y="488" font-size="22" fill="#11785B">Projet ouvert</text></g>
  <path id="folderCurl" fill="url(#curlGradient)" opacity="0"/>
 </g>
 <rect id="folderOutline" x="578" y="303" width="350" height="203" rx="12" fill="none" stroke="#11785B" stroke-width="2.5" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" opacity="0"/>
</g>
</svg>
<button class="pause" type="button" aria-label="Mettre l’animation en pause"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3v10M11 3v10" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
</div>`;

export class MarssaneSecretaire extends HTMLElement {
 constructor(){
  super();this.attachShadow({mode:'open'}).innerHTML=template;
  this.elapsed=0;this.running=true;this.inView=false;this.raf=0;this.last=0;this.nodes={};
  this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
  this.onVisibility=()=>this.schedule();
  this.onPreference=()=>{if(this.reduced.matches){this.pause();this.seek(9);}else this.schedule();};
 }
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
 disconnectedCallback(){cancelAnimationFrame(this.raf);this.last=0;this.observer?.disconnect();document.removeEventListener('visibilitychange',this.onVisibility);this.reduced.removeEventListener('change',this.onPreference);}
 opacity(id,value){this.nodes[id].setAttribute('opacity',value.toFixed(3));}
 draw(t){
  const reset=1-ramp(t,12.6,duration);
  // Le texte est constant. Seul le clip descend après l'arrivée du signal.
  for(const [name,y,height,start,end,done] of [['folder',303,203,7,8,8.15]]){
   const unroll=ramp(t,start,end)*reset, h=58+(height-58)*unroll, bottom=y+h;
   this.nodes[name+'Reveal'].setAttribute('height',h.toFixed(3));
   this.nodes[name+'Curl'].setAttribute('d',`M580 ${bottom-10} Q753 ${bottom-4} 926 ${bottom-10} L926 ${bottom-1} Q753 ${bottom+5} 580 ${bottom-1} Z`);
   this.opacity(name+'Curl',Math.sin(Math.PI*unroll)*.85);
   const completion=ramp(t,done,done+.45);
   this.opacity(name+'Outline',completion*reset);
   this.nodes[name+'Outline'].setAttribute('stroke-dashoffset',String(1-completion));
   this.opacity(name+'Ready',completion*reset);
   this.nodes[name+'Check'].setAttribute('stroke-dashoffset',String(1-ramp(t,done+.1,done+.45)));
  }
  const signed=ramp(t,3.8,4.2)*reset;
  this.opacity('pendingStatus',1-signed);
  this.opacity('signedStatus',signed);
  this.nodes.signedCheck.setAttribute('stroke-dashoffset',String(1-signed));
  this.opacity('sentStatus',ramp(t,1.8,2.25)*reset);
  this.opacity('receivedStatus',ramp(t,5.5,5.9)*reset);
  this.nodes.pendingBorder.style.stroke=signed>.9?'#11785B':active(t,1.8,2.3)>.1?'var(--accent)':'var(--border)';
  const ring=Math.max(active(t,.4,1.8),active(t,5.4,7));
  this.opacity('agentRing',ring);this.nodes.agentRing.setAttribute('stroke-dashoffset',String(-Math.min(t,7.2)*72));
  wires.forEach((w,i)=>{
   this.opacity('signal'+i,active(t,w.start-.12,w.end+.03));
   const p=this.paths[i].node.getPointAtLength(this.paths[i].length*ramp(t,w.start,w.end));
   this.nodes['particle'+i].setAttribute('transform',`translate(${p.x} ${p.y})`);
  });
 }
 updateButton(){const b=this.shadowRoot.querySelector('button');b.setAttribute('aria-label',this.running?'Mettre l’animation en pause':'Lire l’animation');b.querySelector('path').setAttribute('d',this.running?'M5 3v10M11 3v10':'M5 3l7 5-7 5z');}
 schedule(){cancelAnimationFrame(this.raf);this.last=0;if(this.isConnected&&this.running&&this.inView&&!document.hidden)this.raf=requestAnimationFrame(this.tick);}
 tick=(now)=>{if(this.last)this.elapsed=(this.elapsed+(now-this.last)/1000)%duration;this.last=now;this.draw(this.elapsed);this.raf=requestAnimationFrame(this.tick);};
 play(){this.running=true;this.updateButton();this.schedule();}
 pause(){this.running=false;this.updateButton();this.schedule();}
 seek(seconds){const t=Number(seconds);this.elapsed=Math.max(0,Math.min(duration-.001,Number.isFinite(t)?t:0));if(this.paths)this.draw(this.elapsed);this.last=0;}
}
if(!customElements.get('marssane-secretaire'))customElements.define('marssane-secretaire',MarssaneSecretaire);
