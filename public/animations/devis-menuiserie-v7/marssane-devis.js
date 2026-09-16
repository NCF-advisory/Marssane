import { observeSchemaVisibility } from "../observe-schema-visibility.js";

/** Marssane — Schéma SVG animé, sans bibliothèque ni lecteur vidéo. */
const portrait=new URL('./marco.jpg',import.meta.url).href;
const fontURL=new URL('./jakarta.woff2',import.meta.url).href;
const duration=13;
const clamp=v=>Math.max(0,Math.min(1,v));
const ramp=(t,a,b)=>{const p=clamp((t-a)/(b-a));return p*p*(3-2*p);};
const active=(t,a,b)=>ramp(t,a,a+.18)*(1-ramp(t,b,b+.25));
// Every connection terminates on the same outer circle, including its active ring.
const marco={x:399,y:267,r:62};
const anchor=degrees=>{const a=degrees*Math.PI/180;return [(marco.x+marco.r*Math.cos(a)).toFixed(4),(marco.y+marco.r*Math.sin(a)).toFixed(4)].join(' ');};
const wires=[
 {d:`M235 267 C285 267 302 267 ${anchor(180)}`,spans:[[.8,1.55]]},
 {d:`M${anchor(90)} C399 342 399 350 399 361`,spans:[[1.65,2.25]]},
 {d:`M${anchor(-25)} C498 220 470 96 510 96`,spans:[[3.8,4.55],[5.95,6.5,true]]},
 {d:`M${anchor(10)} C529 290 570 300 624 300`,spans:[[6.7,7.3]]},
];
const template=`<style>
:host{display:block;width:100%;--schema-background:#0D1118;color:#152C35;font-family:MarssaneJakarta,'Plus Jakarta Sans',Arial,sans-serif}
.frame{position:relative;background:var(--schema-background);border-radius:20px;overflow:hidden}svg{display:block;width:100%;height:auto}text{font-family:inherit;letter-spacing:-.04em;font-weight:550}.card{fill:#F5F8F4;stroke:#D8E4DB;stroke-width:1.5}.wire{fill:none;stroke:#466366;stroke-width:2.5;stroke-linecap:butt}.signal{fill:none;stroke:#00D1B6;stroke-width:3}.ink{fill:#152C35}.muted{fill:#D5E2DA}.mint{color:#11785B}.number{font-weight:650;letter-spacing:-.055em}.icon{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.pause{position:absolute;bottom:10px;left:12px;display:grid;place-items:center;width:32px;height:32px;padding:0;border:1px solid #466366;border-radius:50%;background:#0d1118;color:#aac4c0;cursor:pointer}.pause:focus-visible{outline:3px solid #00D1B6;outline-offset:3px}.pause svg{width:13px;height:13px}.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
</style>
<div class="frame">
<svg viewBox="0 0 960 540" role="img" aria-labelledby="title desc">
<title id="title">Du vocal au devis avec Marco</title><desc id="desc">Marco reçoit la demande de Mme Martin : un placard en chêne de 2,40 mètres de large, pose comprise. La transcription se déroule sur une feuille. La grille tarifaire se déroule à l’arrivée du signal de Marco : placard 1 850 euros, pose 350 euros. Le devis se déroule, affiche le total de 2 200 euros, puis un contour et une coche animés signalent qu’il est prêt à envoyer. Exemple fictif, montants hors taxes. Aucun envoi n’est déclenché.</desc>
<defs><clipPath id="portrait"><circle cx="399" cy="267" r="54"/></clipPath><clipPath id="paperClip"><rect id="paperReveal" x="252" y="361" width="290" height="36" rx="12"/></clipPath><clipPath id="tariffClip"><rect id="tariffReveal" x="510" y="64" width="380" height="58" rx="15"/></clipPath><clipPath id="docClip"><rect id="docReveal" x="624" y="271" width="296" height="58" rx="9"/></clipPath><mask id="outsideMarco"><rect width="960" height="540" fill="white"/><circle cx="399" cy="267" r="62" fill="black"/></mask><linearGradient id="paperCurl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B7C7BD"/><stop offset=".4" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D5E2DA"/></linearGradient></defs>
<g mask="url(#outsideMarco)">
${wires.map((w,i)=>`<path id="wire${i}" class="wire" d="${w.d}"/><g id="signal${i}" opacity="0"><path class="signal" d="${w.d}" opacity=".5"/><g id="particle${i}"><circle r="10" fill="#00D1B6" opacity=".16"/><circle r="4.5" fill="#00D1B6"/></g></g>`).join('')}</g>
<!-- Les positions et dimensions des cinq nœuds restent fixes durant toute la boucle. -->
<g data-node="vocal"><rect id="voiceBorder" class="card" x="50" y="205" width="185" height="130" rx="15"/><g class="icon mint" transform="translate(69 220)"><rect x="4" y="0" width="9" height="16" rx="4.5"/><path d="M0 12v3a8.5 8.5 0 0 0 17 0v-3M8.5 24v7m-5 0h10"/></g><text x="98" y="244" font-size="25" class="ink">Vocal</text><g id="wave">${Array.from({length:32},(_,i)=>`<rect x="${65+i*4.8}" y="283" width="2.2" height="6" rx="1.1" fill="${i<24?'#11785B':'#B5D4C8'}"/>`).join('')}</g></g>
<g data-node="agent"><circle cx="399" cy="267" r="62" fill="var(--schema-background)" stroke="#466366" stroke-width="1.5"/><circle id="agentRing" cx="399" cy="267" r="62" fill="none" stroke="#00D1B6" stroke-width="3" stroke-dasharray="59 330" opacity="0"/><g clip-path="url(#portrait)"><circle cx="399" cy="267" r="54" fill="#0E0E12"/><image href="${portrait}" x="307.2" y="210.6" width="183.6" height="183.6"/></g><text x="399" y="187" text-anchor="middle" font-size="30" fill="white">Marco</text></g>
<g data-node="transcription" clip-path="url(#paperClip)">
 <rect id="textBorder" class="card" x="252" y="361" width="290" height="160" rx="12"/>
 <path d="M274 385h13m-13-6h21" class="icon mint"/>
 <text x="308" y="387" font-size="12" fill="#638076" style="letter-spacing:.09em;font-weight:650">TRANSCRIPTION</text>
 <!-- These four complete lines are never typed or replaced: only the paper's clipping edge moves. -->
 <text id="transcript" x="274" y="417" font-size="20.5" class="ink" style="letter-spacing:-.025em;font-weight:500"><tspan x="274" y="417">Pour Mme Martin,</tspan><tspan x="274" y="446">un placard en chêne,</tspan><tspan x="274" y="475">2,40 m de large,</tspan><tspan x="274" y="504">pose comprise.</tspan></text>
 <path id="curl" fill="url(#paperCurl)" opacity="0"/>
</g>
<g data-node="database" clip-path="url(#tariffClip)">
 <rect id="dataBorder" class="card" x="510" y="64" width="380" height="172" rx="15"/>
 <g class="icon mint" transform="translate(526 80)"><rect width="24" height="25" rx="3"/><path d="M0 8h24M0 16h24M9 8v17"/></g>
 <text x="561" y="103" font-size="25" class="ink">Grille tarifaire</text>
 <text x="868" y="102" text-anchor="end" font-size="12" fill="#638076">HT</text>
 <path d="M526 118H874" stroke="#D5E2DA"/>
 <rect id="dataHighlight" x="521" y="126" width="358" height="45" rx="7" fill="#DCF4E8" opacity="0"/>
 <rect id="poseHighlight" x="521" y="177" width="358" height="44" rx="7" fill="#DCF4E8" opacity="0"/>
 <text x="530" y="155" font-size="18" class="ink">Placard chêne · 2,40 m</text><text x="866" y="156" text-anchor="end" font-size="23" class="ink number">1 850 €</text>
 <path d="M530 174H866" stroke="#DDE7E0"/>
 <text x="530" y="205" font-size="20" class="ink">Pose</text><text x="866" y="207" text-anchor="end" font-size="23" class="ink number">350 €</text>
 <path id="tariffCurl" fill="url(#paperCurl)" opacity="0"/>
</g>
<g data-node="devis">
 <g clip-path="url(#docClip)">
 <rect id="docBorder" x="624" y="271" width="296" height="211" rx="9" fill="#FFFFFF" stroke="#D8E4DB" stroke-width="1.5"/>
 <rect id="resultFlash" x="624" y="271" width="296" height="211" rx="9" fill="#00D1B6" opacity="0"/>
 <path d="M634 272H910" stroke="#00B99D" stroke-width="3"/>
 <g class="icon mint" transform="translate(644 289)"><path d="M0 0h13l6 6v21H0zM13 0v7h6M5 13h9M5 19h9"/></g>
 <text x="676" y="312" font-size="27" class="ink" style="font-weight:650">Devis</text>
 <text x="772" y="352" text-anchor="middle" font-size="27" fill="#638076">Total HT</text>
 <rect id="totalPlaceholder" x="699" y="400" width="146" height="9" rx="4.5" fill="#D5E2DA"/>
 <text id="total" x="772" y="427" text-anchor="middle" font-size="55" class="ink number" opacity="0">2 200 €</text>
 <path id="docCurl" fill="url(#paperCurl)" opacity="0"/>
 </g>
 <rect id="completionOutline" x="624" y="271" width="296" height="211" rx="9" fill="none" stroke="#00B99D" stroke-width="2.5" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" opacity="0"/>
 <g id="ready" opacity="0"><rect x="624" y="496" width="296" height="35" rx="10" fill="#DCF4E8"/><path id="completionCheck" d="m664 511 5 5 9-10" fill="none" stroke="#11785B" stroke-width="2" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/><text x="690" y="521" font-size="21" fill="#11785B">Prêt à envoyer</text></g>
</g>
</svg>
<button class="pause" type="button" aria-label="Mettre l’animation en pause"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3v10M11 3v10" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
</div>`;

export class MarssaneDevis extends HTMLElement{
 constructor(){super();this.attachShadow({mode:'open'}).innerHTML=template;this.elapsed=0;this.running=true;this.inView=false;this.raf=0;this.last=0;this.nodes={};this.reduced=matchMedia('(prefers-reduced-motion: reduce)');this.onVisibility=()=>this.schedule();this.onPreference=()=>{if(this.reduced.matches){this.pause();this.seek(9);}else this.schedule();};}
 connectedCallback(){
  this.shadowRoot.querySelectorAll('[id]').forEach(el=>this.nodes[el.id]=el);
  this.paths=wires.map((_,i)=>({node:this.nodes['wire'+i],length:this.nodes['wire'+i].getTotalLength()}));
  this.bars=[...this.shadowRoot.querySelectorAll('#wave rect')];
  this.shadowRoot.querySelector('button').onclick=()=>this.running?this.pause():this.play();
  if(!document.fonts.check('16px MarssaneJakarta')){const face=new FontFace('MarssaneJakarta',`url(${fontURL})`,{weight:'200 800'});face.load().then(f=>document.fonts.add(f)).catch(()=>{});}
  this.observer=observeSchemaVisibility(this);
  document.addEventListener('visibilitychange',this.onVisibility);this.reduced.addEventListener('change',this.onPreference);
  if(this.reduced.matches){this.running=false;this.elapsed=9;}
  this.draw(this.elapsed);this.updateButton();this.schedule();
 }
 disconnectedCallback(){cancelAnimationFrame(this.raf);this.observer?.disconnect();document.removeEventListener('visibilitychange',this.onVisibility);this.reduced.removeEventListener('change',this.onPreference);}
 opacity(id,value){this.nodes[id].setAttribute('opacity',value.toFixed(3));}
 border(id,value){this.nodes[id].style.stroke=value>.1?'#00B99D':'#D8E4DB';}
 draw(t){
  const reset=1-ramp(t,12.45,duration),unroll=ramp(t,2.05,3.75)*reset,tariffUnroll=ramp(t,4.55,5.5)*reset,docUnroll=ramp(t,7.3,8.05)*reset,total=ramp(t,7.7,8.1)*reset,ready=ramp(t,8.15,8.55)*reset;
  const speech=Math.min(Math.max(t-.2,0),1.4);
  this.bars.forEach((b,i)=>{const h=5+29*Math.abs(Math.sin(i*1.51+speech*3.8)*Math.cos(i*.2-speech*1.6));b.setAttribute('y',(288-h/2).toFixed(2));b.setAttribute('height',h.toFixed(2));});
  this.border('voiceBorder',active(t,.2,1.65));this.border('textBorder',active(t,2.05,3.75));this.border('dataBorder',active(t,4.55,6.5));
  this.opacity('agentRing',active(t,1.4,7.8));this.nodes.agentRing.setAttribute('stroke-dashoffset',String(-Math.max(0,Math.min(t-1.4,6.4))*72));
  const paperHeight=36+124*unroll,bottom=361+paperHeight;
  this.nodes.paperReveal.setAttribute('height',paperHeight.toFixed(3));
  this.nodes.curl.setAttribute('d',`M254 ${bottom-10} Q397 ${bottom-4} 540 ${bottom-10} L540 ${bottom-1} Q397 ${bottom+5} 254 ${bottom-1} Z`);
  this.opacity('curl',Math.sin(Math.PI*unroll)*.85);
  const tariffHeight=58+114*tariffUnroll,tariffBottom=64+tariffHeight;
  this.nodes.tariffReveal.setAttribute('height',tariffHeight.toFixed(3));
  this.nodes.tariffCurl.setAttribute('d',`M512 ${tariffBottom-10} Q700 ${tariffBottom-4} 888 ${tariffBottom-10} L888 ${tariffBottom-1} Q700 ${tariffBottom+5} 512 ${tariffBottom-1} Z`);
  this.opacity('tariffCurl',Math.sin(Math.PI*tariffUnroll)*.85);
  this.opacity('dataHighlight',active(t,5.15,5.65));this.opacity('poseHighlight',active(t,5.7,6.1));
  const docHeight=58+153*docUnroll,docBottom=271+docHeight;
  this.nodes.docReveal.setAttribute('height',docHeight.toFixed(3));
  this.nodes.docCurl.setAttribute('d',`M626 ${docBottom-10} Q772 ${docBottom-4} 918 ${docBottom-10} L918 ${docBottom-1} Q772 ${docBottom+5} 626 ${docBottom-1} Z`);
  this.opacity('docCurl',Math.sin(Math.PI*docUnroll)*.85);
  const completion=ramp(t,8.1,8.55),check=ramp(t,8.25,8.55);
  this.nodes.completionOutline.setAttribute('stroke-dashoffset',String(1-completion));
  this.opacity('completionOutline',completion*reset);
  this.nodes.completionCheck.setAttribute('stroke-dashoffset',String(1-check));
  this.opacity('resultFlash',Math.sin(Math.PI*completion)*.1);
  this.opacity('total',total);this.opacity('totalPlaceholder',1-total);this.opacity('ready',ready);
  wires.forEach((w,i)=>{let opacity=0,progress=0;for(const [start,end,reverse=false] of w.spans){const a=active(t,start-.12,end+.05);if(a>opacity){opacity=a;progress=ramp(t,start,end);if(reverse)progress=1-progress;}}this.opacity('signal'+i,opacity);const point=this.paths[i].node.getPointAtLength(this.paths[i].length*progress);this.nodes['particle'+i].setAttribute('transform',`translate(${point.x} ${point.y})`);});
 }
 updateButton(){const b=this.shadowRoot.querySelector('button');b.setAttribute('aria-label',this.running?'Mettre l’animation en pause':'Lire l’animation');b.querySelector('path').setAttribute('d',this.running?'M5 3v10M11 3v10':'M5 3l7 5-7 5z');}
 schedule(){cancelAnimationFrame(this.raf);this.last=0;if(this.isConnected&&this.running&&this.inView&&!document.hidden){this.raf=requestAnimationFrame(this.tick);}}
 tick=(now)=>{if(this.last)this.elapsed=(this.elapsed+(now-this.last)/1000)%duration;this.last=now;this.draw(this.elapsed);this.raf=requestAnimationFrame(this.tick);};
 play(){this.running=true;this.updateButton();this.schedule();}
 pause(){this.running=false;this.updateButton();this.schedule();}
 seek(seconds){this.elapsed=Math.max(0,Math.min(duration-.001,Number(seconds)||0));this.draw(this.elapsed);this.last=0;}
}
if(!customElements.get('marssane-devis'))customElements.define('marssane-devis',MarssaneDevis);
