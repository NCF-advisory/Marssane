import React from 'react';
import {MarssaneLogo} from '../components/MarssaneLogo';
import {useCurrentFrame,Img,staticFile,AbsoluteFill,Sequence} from 'remotion';
import {C,Brand,Mark,font,Icon,ToolMarks,Wave,at,flex,mix,ramp,out,interp,bez} from './Kit';

const INK='#FFFFFF',PAPER='#F7FAF9',TEXT='#152C35';
const people=[
 {name:'Marco',file:'marco',role:'Devis',color:'#008C76',light:'#DCF4E8',icon:'file',task:'Préparer le devis',result:'Devis prêt',start:10,end:12.7},
 {name:'Élise',file:'elise',role:'Relation client',color:'#7856B2',light:'#EBE5FA',icon:'mail',task:'Répondre au client',result:'Réponse prête',start:12.7,end:15.05},
 {name:'Jacques',file:'jacque',role:'Comptabilité',color:'#A36F2A',light:'#F7EDD9',icon:'clock',task:'Relancer la facture',result:'Relance envoyée',start:15.05,end:17.4},
 {name:'Alma',file:'alma',role:'Dossiers',color:'#247CA7',light:'#DEEFF7',icon:'person',task:'Mettre le dossier à jour',result:'Dossier à jour',start:17.4,end:19.75},
];
const introPeople=[...people,
 {name:'Noé',file:'extra/noe',color:'#3F8260'},
 {name:'Inès',file:'extra/ines',color:'#BB5F4C'},
 {name:'Louis',file:'extra/louis',color:'#557CAF'},
 {name:'Sarah',file:'extra/sarah',color:'#98548F'},
 {name:'Hugo',file:'extra/hugo',color:'#A27B34'},
 {name:'Camille',file:'extra/lina',color:'#287F79'},
];
const blend=(a:string,b:string,p:number)=>'#'+[1,3,5].map(i=>Math.round(mix(parseInt(a.slice(i,i+2),16),parseInt(b.slice(i,i+2),16),p)).toString(16).padStart(2,'0')).join('');
const border='1px solid #D8E4DB';
function Portrait({i,size,round=50,crop=1.7}:{i:number,size:number,round?:number,crop?:number}){const a=introPeople[i];return <div style={{width:size,height:size,borderRadius:`${round}%`,overflow:'hidden',position:'relative',background:INK,flexShrink:0}}><Img src={staticFile(i===0?'marco/marco.png':`team-white/${a.file}.png`)} style={{position:'absolute',width:size*crop,height:size*crop,left:-size*(crop-1)/2,top:0,filter:i===0?'none':'contrast(1.04)'}}/></div>}
function Check({size=26,color='#15734F'}:{size?:number,color?:string}){return <span style={{color,display:'flex'}}><Icon type="check" size={size}/></span>}
function Cursor({t}:{t:number}){
 if(t<7.1||t>9.5)return null;
 const p=ramp(t,7.1,7.55),q=ramp(t,8.15,8.65),x=mix(mix(1450,1721,p),1504,q),y=mix(mix(700,211,p),816,q);
 const click=(ramp(t,7.55,7.63)*(1-ramp(t,7.7,7.85)))+(ramp(t,8.65,8.73)*(1-ramp(t,8.8,8.95)));
 return <div style={{...at(x,y),opacity:ramp(t,7.1,7.25)*(1-ramp(t,9.1,9.5))}}>{click>.001&&<div style={{...at(-21-30*click,-21-30*click),width:42+60*click,height:42+60*click,borderRadius:'50%',border:'3px solid #00BAA3',opacity:1-click*.5}}/>}<svg width="44" height="55" viewBox="0 0 44 55" style={{filter:'drop-shadow(0 4px 5px #0003)'}}><path d="M3 3v39l10-9 8 17 8-4-9-17 13-2z" fill="#173B45" stroke="white" strokeWidth="3" strokeLinejoin="round"/></svg></div>;
}

function AgentsOriginal({t}:{t:number}){
 const stacked=1+ramp(t,.8,1.2)+ramp(t,1.33,1.73)+ramp(t,1.86,2.26);
 return <>{people.map((a,i)=>{
  const en=ramp(t,.18+i*.53,.68+i*.53,out),m=ramp(t,3.7+i*.045,5.25+i*.04),erp=ramp(t,19.85+i*.04,21.1+i*.04),done=ramp(t,a.end-.42,a.end-.1),working=t>=a.start&&t<a.end;
  if(en<.001)return null;
  const introH=mix(340,168,(stacked-1)/3),introGap=mix(30,16,(stacked-1)/3),introY=540-(stacked*introH+(stacked-1)*introGap)/2+i*(introH+introGap);
  const x=mix(1010+95*(1-en),112,m),y=mix(introY+150*(1-en),337+i*142,m),w=mix(760,294,m),h=mix(introH,108,m);
  const px=mix(x+15,467,erp),py=mix(y+mix(7,19,m),569+i*88,erp),size=mix(mix(introH-14,70,m),51,erp);
  const nx=mix(x+mix(introH+35,103,m),530,erp),ny=mix(y+mix(introH/2-45,16,m),566+i*88,erp);
  return <React.Fragment key={a.name}>
   <div style={{...at(x,y),width:w,height:h,borderRadius:mix(27,19,m),background:working?a.light:blend('#16272F','#F1F5F0',m),border:`1px solid ${working?a.color:blend('#354C53','#E4EBE4',m)}`,opacity:en*(1-erp),boxShadow:working?`0 8px 25px ${a.color}1A`:'none'}}>
    <div style={{...at(0,23),width:4,height:h-46,borderRadius:3,background:a.color}}/>
    {m>.99&&t>=a.start&&<div style={{...at(103,82),width:162,height:3,borderRadius:3,background:'#D4E5DA'}}><div style={{width:162*ramp(t,a.start,a.end-.3),height:3,background:a.color,borderRadius:3}}/></div>}
   </div>
   <div style={{...at(px,py),opacity:en}}><Portrait i={i} size={size} round={mix(14,50,m)} crop={mix(1.28,1.7,m)}/></div>
   <div style={{...at(nx,ny),fontSize:mix(mix(70,32,m),25,erp),fontWeight:600,letterSpacing:'-.05em',color:blend('#FFFFFF',TEXT,m),opacity:en}}>{a.name}</div>
   {m>.01&&erp<.99&&<div style={{...at(x+103,y+57),fontSize:18,color:working?blend(a.color,TEXT,.35):'#80978D',opacity:ramp(m,.65,1)*(1-erp)}}>{t>=a.end?'Terminé':a.role}</div>}
   {done>.001&&erp<.99&&<div style={{...at(x+257,y+25),opacity:done*(1-erp)}}><Check size={21}/></div>}
  </React.Fragment>;
 })}</>;
}

function AppFrame({t}:{t:number}){
 const appear=ramp(t,3.72,4.96),erp=ramp(t,19.75,21.1),notifications=t<5.75?0:t<6.1?1:t<6.35?2:t<6.55?3:Math.round(mix(3,50,ramp(t,6.55,7.02,out)));
 if(appear<.001)return null;
 return <>
  <div style={{...at(mix(2040,90,appear),174),width:1740,height:808,borderRadius:29,background:PAPER,border:'1px solid #D7E6DE',boxShadow:'0 25px 70px #315D3717',overflow:'hidden'}}>
   <div style={{height:81,borderBottom:border,display:'flex',alignItems:'center',padding:'0 32px',gap:13,color:TEXT}}><span style={{width:11,height:11,borderRadius:'50%',background:'#94B9AD'}}/><span style={{fontSize:28,fontWeight:600}}>{t<20.4?'Votre entreprise':'Votre ERP'}</span><span style={{marginLeft:'auto',fontSize:19,color:'#8BA196',marginRight:105}}>{t<20.4?'Messagerie d’équipe':'Tableau de bord'}</span></div>
   <div style={{...at(0,82),width:338,height:726,borderRight:border,background:'#FBFCF8',opacity:1-erp}}/>
  </div>
  <div style={{...at(127,280),fontSize:21,color:'#839D91',opacity:ramp(t,5.02,5.4)*(1-erp)}}>Votre équipe</div>
  <div style={{...at(1695,188),width:58,height:51,borderRadius:14,background:t>=7.55&&t<8?'#C7ECDE':'#E6F0E8',color:'#35766B',...flex,opacity:appear*(1-erp)}}><Icon type="bell" size={32}/>
   {notifications>0&&t<8.72&&<div style={{...at(34,-13),minWidth:32,height:31,padding:'0 7px',boxSizing:'border-box',borderRadius:20,background:t<6.5?'#26AE97':'#E19A49',color:'white',...flex,fontSize:19,fontWeight:700,boxShadow:'0 4px 15px #0002'}}>{notifications}</div>}
  </div>
 </>;
}

// Keep the first four entrances. The final cascade shares one continuous track.
const INTRO_RATIO=.67;
const CASCADE_EXTENSION=.60;
const LAST_INTRO_AGENT=introPeople.length-1;
const INTRO_RAIL_X=(1920-(LAST_INTRO_AGENT*86+66))/2;
const INTRO_STARTS=Array.from({length:introPeople.length},(_,i)=>.08+1.36*(1-Math.pow(INTRO_RATIO,i))/(1-INTRO_RATIO));
const INTRO_RISE=Array.from({length:introPeople.length},(_,i)=>.60*Math.pow(INTRO_RATIO,i));
const INTRO_STOP=4.30+CASCADE_EXTENSION;
const INTRO_MESSAGE=4.56+CASCADE_EXTENSION;
const INTRO_HANDOFF=7.10+CASCADE_EXTENSION;
const INTRO_END=8.00+CASCADE_EXTENSION;
const smooth=(p:number)=>p*p*(3-2*p);
const CASCADE_START=INTRO_STARTS[3]+INTRO_RISE[3];
const CASCADE_BRAKE=4.00;
const CASCADE_END=4.27;
const CASCADE_PITCH=980;
function cascadeBase(t:number){
 const k=1.1,d=CASCADE_BRAKE-CASCADE_START,b=CASCADE_END-CASCADE_BRAKE;
 const e=Math.exp(k*d),distance=e-1-k*d,velocity=k*(e-1),acceleration=k*k*e;
 const gain=4/(distance+velocity*b/2+acceleration*b*b/12);
 if(t<=CASCADE_START)return {position:3,speed:0};
 if(t>=CASCADE_END)return {position:7,speed:0};
 if(t<CASCADE_BRAKE){const u=t-CASCADE_START,exp=Math.exp(k*u);return {position:3+gain*(exp-1-k*u),speed:gain*k*(exp-1)};}
 const u=(t-CASCADE_BRAKE)/b;
 // Match both velocity and acceleration into a smooth final stop.
 const travel=velocity*b*(u-u*u*u+.5*u*u*u*u)+acceleration*b*b*(.5*u*u-2*u*u*u/3+.25*u*u*u*u);
 const speed=velocity*(1-3*u*u+2*u*u*u)+acceleration*b*(u-2*u*u+u*u*u);
 return {position:3+gain*(distance+travel),speed:gain*speed};
}
function cascade(t:number){
 const stretch=(CASCADE_END+CASCADE_EXTENSION-CASCADE_START)/(CASCADE_END-CASCADE_START);
 const scale=(LAST_INTRO_AGENT-3)/4;
 const base=cascadeBase(CASCADE_START+(t-CASCADE_START)/stretch);
 return {position:3+(base.position-3)*scale,speed:base.speed*scale/stretch};
}
function introLift(t:number,i:number){
 if(i>=3&&t>=CASCADE_START){
  const track=cascade(t),offset=i-track.position;
  return {enter:Math.max(0,Math.min(1,(1.2-offset)/1.2)),exit:Math.max(0,Math.min(1,-offset/1.2)),offset,band:true,trail:Math.min(205,CASCADE_PITCH*track.speed/46)};
 }
 const enter=ramp(t,INTRO_STARTS[i],INTRO_STARTS[i]+INTRO_RISE[i],smooth);
 const next=INTRO_STARTS[i+1];
 const exit=i<LAST_INTRO_AGENT?ramp(t,next,next+INTRO_RISE[i+1],smooth):0;
 return {enter,exit,offset:1-enter-exit,band:false,trail:0};
}
function storyTime(t:number){
 if(t<INTRO_HANDOFF)return 0;
 if(t<INTRO_END)return mix(3.72,5.4,(t-INTRO_HANDOFF)/(INTRO_END-INTRO_HANDOFF));
 return mix(5.4,25,Math.min(1,(t-INTRO_END)/17));
}

function Intro({t}:{t:number}){
 if(t>=INTRO_HANDOFF+.65)return null;
 const clear=ramp(t,INTRO_STOP,INTRO_STOP+.18,out),leave=ramp(t,INTRO_HANDOFF,INTRO_HANDOFF+.6);
 return <>
  <div style={{...at(139,351),fontSize:64,lineHeight:1.18,color:'#000000',letterSpacing:'-.045em',opacity:ramp(t,.06,.19)*(1-clear)}}>Voici</div>
  <div style={{...at(139,428),width:820,height:194,overflow:'hidden',opacity:1-clear}}>
   {introPeople.map((a,i)=>{
    const {enter,exit,trail,offset}=introLift(t,i);
    if(enter<=0||exit>=1)return null;
    return <div key={a.name} style={{...at(0,208*offset),width:820,height:194,fontSize:151,lineHeight:1.08,fontWeight:600,letterSpacing:'-.065em',color:a.color}}>{trail>1?Array.from({length:7},(_,j)=><div key={j} style={{...at(0,trail*.17*(.5-j/6)),opacity:1/(j+1),filter:`blur(${Math.min(2.3,trail/80)}px)`}}>{a.name}.</div>):<>{a.name}.</>}</div>;
   })}
  </div>
  {t>=INTRO_MESSAGE&&<div style={{...at(-2000*leave,260),width:1920,textAlign:'center',color:TEXT}}>
   {[<span>Nous construisons</span>,<span>les agents <span style={{color:'#008D7A'}}>IA</span></span>,<span>dont <span style={{color:'#008D7A',fontWeight:750}}>VOUS</span> avez besoin.</span>].map((line,i)=>{
    const reveal=ramp(t,INTRO_MESSAGE+i*.085,INTRO_MESSAGE+.34+i*.085,out);
    return <div key={i} style={{...at(180,i===0?0:i===1?112:252),width:1560,height:i===1?146:114,overflow:'hidden'}}><div style={{fontSize:i===1?116:83,lineHeight:1.15,fontWeight:i===1?650:550,letterSpacing:'-.052em',transform:`translateY(${105*(1-reveal)}px)`,filter:reveal<1?`blur(${5*(1-reveal)}px)`:'none',opacity:reveal}}>{line}</div></div>;
   })}
   <div style={{...at(818,405),width:284*ramp(t,4.92+CASCADE_EXTENSION,5.14+CASCADE_EXTENSION,out),height:4,borderRadius:3,background:C.mint,opacity:ramp(t,4.92+CASCADE_EXTENSION,5.06+CASCADE_EXTENSION)}}/>
  </div>}
 </>;
}

function IntroPortraits({t}:{t:number}){
 if(t>=4.90+CASCADE_EXTENSION)return null;
 const settle=ramp(t,INTRO_STOP,4.88+CASCADE_EXTENSION,out);
 return <>{introPeople.map((a,i)=>{
  const {enter,exit,trail,offset,band}=introLift(t,i);
  if(enter<=0||exit>=1)return null;
  const last=i===LAST_INTRO_AGENT,blur=!band&&exit>0?13*Math.min(1,exit*4):0;
  const x=last?mix(962,INTRO_RAIL_X+LAST_INTRO_AGENT*86,settle):962;
  const trackY=160+(band?CASCADE_PITCH:1120)*offset;
  const y=last?mix(trackY,815,settle):trackY;
  const size=last?mix(930,66,settle):930;
  const plate=<div style={{width:size,height:size,position:'relative'}}>
   <Portrait i={i} size={size} round={last?50*settle:0} crop={last?mix(1,1.7,settle):1}/>
   {band&&<div style={{...at(0,size-150),width:size,height:150,background:`linear-gradient(transparent,${INK})`,opacity:ramp(Math.abs(offset),0,.18,smooth)}}/>}
  </div>;
  return <div key={a.name} style={{...at(x,y),width:size,height:size,filter:blur>.01?`blur(${blur}px)`:'none',opacity:band?1-ramp(-offset,.55,.96,smooth):1-.22*exit}}>
   {trail>.5?Array.from({length:17},(_,j)=><div key={j} style={{...at(0,trail*(.5-j/16)),width:size,height:size,opacity:1/(j+1),filter:`blur(${Math.min(7,trail/24)}px)`}}>{plate}</div>):plate}
   {last&&settle>.8&&<div style={{position:'absolute',inset:-3,borderRadius:'50%',border:`2px solid ${a.color}`,opacity:ramp(settle,.8,1)}}/>}
  </div>;
 })}</>;
}

function Agents({t,storyT}:{t:number,storyT:number}){
 if(t>=INTRO_END)return <AgentsOriginal t={storyT}/>;
 const morph=ramp(t,INTRO_HANDOFF,INTRO_END),settle=ramp(t,INTRO_STOP,4.88+CASCADE_EXTENSION,out);
 return <>
  <IntroPortraits t={t}/>
  {introPeople.map((a,i)=>{
   const en=i>=4&&t>=CASCADE_START?ramp(cascade(t).position,i-.48,i+.08,out):ramp(t,INTRO_STARTS[i]+INTRO_RISE[i]*.6,INTRO_STARTS[i]+INTRO_RISE[i]+.04,out);
   if(en<=0||(i===LAST_INTRO_AGENT&&t<4.9+CASCADE_EXTENSION))return null;
   const core=i<4,clear=core?0:ramp(t,INTRO_HANDOFF+i*.012,INTRO_HANDOFF+.55);
   const railX=mix(145,INTRO_RAIL_X,settle)+i*86,railY=mix(734,815,settle);
   const x=core?mix(railX,127,morph):railX-2000*clear;
   const y=core?mix(railY+28*(1-en),356+i*142,morph):railY+28*(1-en);
   const size=core?mix(66,70,morph):66;
   const card=core?ramp(t,INTRO_END-.28+i*.02,INTRO_END-.08+i*.02,out):0;
   return <React.Fragment key={a.name}>
    {core&&card>0&&<div style={{...at(112,337+i*142),width:294,height:108,borderRadius:19,background:'#F1F5F0',border:'1px solid #E4EBE4',opacity:card}}><div style={{...at(0,23),width:4,height:62,borderRadius:3,background:a.color}}/></div>}
    <div style={{...at(x,y),opacity:en*(1-clear)}}><Portrait i={i} size={size}/><div style={{position:'absolute',inset:-3,borderRadius:'50%',border:`2px solid ${a.color}`,opacity:1-morph}}/></div>
    {core&&card>0&&<>
     <div style={{...at(215,353+i*142),fontSize:32,fontWeight:600,letterSpacing:'-.05em',color:TEXT,opacity:card}}>{a.name}</div>
     <div style={{...at(215,394+i*142),fontSize:18,color:'#80978D',opacity:card}}>{people[i].role}</div>
    </>}
   </React.Fragment>;
  })}
 </>;
}

function Notifications({t}:{t:number}){
 if(t<5.35||t>=8.05)return null;
 const leave=ramp(t,7.55,8.05);
 return <div style={{opacity:1-leave}}>
  <div style={{...at(505,331),fontSize:57,fontWeight:550,letterSpacing:'-.052em',lineHeight:1.18,color:TEXT,opacity:ramp(t,5.35,5.8)}}>Les demandes<br/>s’accumulent.</div>
  {people.map((a,i)=>{const en=ramp(t,5.78+i*.24,6.2+i*.24,out),top=445+i*106;return en>.001?<div key={a.name} style={{...at(1120+550*(1-en),top),width:627,height:89,borderRadius:18,background:'white',border,boxShadow:'0 14px 30px #234A3312',display:'flex',alignItems:'center',padding:'0 22px',boxSizing:'border-box',gap:18,opacity:en}}><div style={{width:49,height:49,borderRadius:13,background:a.light,color:blend(a.color,TEXT,.22),...flex}}><Icon type={a.icon} size={29}/></div><span style={{fontSize:27,fontWeight:550,color:TEXT}}>{['Demande de devis','Question client','Facture échue','Dossier à modifier'][i]}</span><span style={{marginLeft:'auto',width:7,height:7,borderRadius:'50%',background:a.color}}/></div>:null;})}
  <div style={{...at(510,646),display:'flex',alignItems:'baseline',gap:17,color:'#537F73',opacity:ramp(t,6.7,7.05)}}><span style={{fontSize:100,fontWeight:550,letterSpacing:'-.07em'}}>50</span><span style={{fontSize:24}}>notifications</span></div>
 </div>;
}

function Delegation({t}:{t:number}){
 if(t<7.65||t>=10.18)return null;
 const en=ramp(t,7.65,8.05),send=ramp(t,8.73,9.72),leave=ramp(t,9.7,10.18);
 return <>
  <div style={{...at(506,291),fontSize:49,fontWeight:550,color:TEXT,letterSpacing:'-.045em',opacity:en*(1-send)}}>Confiez-les à votre équipe.</div>
  {people.map((a,i)=>{
   const p=ramp(t,8.78+i*.09,9.53+i*.09),sx=516+(i%2)*625,sy=416+Math.floor(i/2)*166,ex=452,ey=352+i*142,w=mix(592,632,p),h=mix(140,78,p),pos=bez([sx,sy],[sx-100,sy-45],[ex+200,ey],[ex,ey],p);
   return <div key={a.name} style={{...at(pos[0],pos[1]+28*(1-en)),width:w,height:h,borderRadius:19,background:blend('#FFFFFF',a.light,p),border:`1px solid ${p>.6?a.color:'#DBE6DE'}`,boxShadow:`0 ${18*(1-p)}px 35px #264E3312`,display:'flex',alignItems:'center',padding:'0 25px',gap:19,boxSizing:'border-box',opacity:en*(1-leave)}}><span style={{color:blend(a.color,TEXT,.25)}}><Icon type={a.icon} size={35}/></span><span style={{fontSize:mix(29,27,p),fontWeight:550,color:TEXT}}>{a.task}</span><span style={{marginLeft:'auto',opacity:ramp(p,.7,1)}}><Check size={27}/></span></div>;
  })}
  <div style={{...at(1369,778),width:326,height:75,borderRadius:16,background:t>8.65?'#154F48':'#127C70',color:'white',...flex,gap:19,fontSize:28,fontWeight:550,opacity:en*(1-ramp(t,8.82,9.18)),boxShadow:'0 14px 25px #16746822'}}>Déléguer<Icon type="arrow" size={30}/></div>
  <div style={{...at(1160,848),fontSize:32,fontWeight:550,color:'#267963',opacity:ramp(t,9.33,9.65)*(1-leave)}}>Chacun sa mission.</div>
 </>;
}

function ServerCard({i,q}:{i:number,q:number}){
 const a=people[i],read=ramp(q,.1,.47),checked=ramp(q,.36,.48);
 return <div style={{...at(28,192),width:368,height:mix(95,289,ramp(q,0,.24)),background:'#FCFEFB',border:'1px solid #CEDFD4',borderRadius:22,boxShadow:'0 16px 32px #1F4A2C0A',overflow:'hidden'}}>
  <div style={{height:69,borderBottom:'1px solid #E1EBE2',display:'flex',alignItems:'center',gap:13,padding:'0 22px',fontSize:25,fontWeight:600,color:TEXT}}><span style={{color:'#57897E'}}><Icon type={i===3?'mail':'server'} size={30}/></span>{['Vos tarifs','Dossier client','Comptabilité','Mail reçu'][i]}</div>
  <div style={{padding:'24px 25px',color:TEXT}}>
   <div style={{fontSize:22,color:'#839E8F'}}>{['Bureau','Livraison','Facture F-028','Nouvelle adresse'][i]}</div>
   <div style={{marginTop:23,fontSize:i===3?28:41,fontWeight:600,color:i===2?'#A16A32':TEXT,letterSpacing:'-.045em',lineHeight:1.2,opacity:read}}>{['690 €','Vendredi','Non réglée','12 rue Victor-Hugo'][i]}</div>
   <div style={{marginTop:21,display:'flex',alignItems:'center',gap:8,fontSize:19,color:'#3A8C6A',opacity:checked}}><Icon type="check" size={24}/>{['Tarif retrouvé','Date confirmée','Statut vérifié','Adresse identifiée'][i]}</div>
  </div>
  {read>0&&read<1&&<div style={{...at(-65+490*read,70),width:65,height:220,background:`linear-gradient(90deg,transparent,${a.color}33,transparent)`}}/>}
 </div>;
}

function ResultCard({i,q}:{i:number,q:number}){
 const a=people[i],build=ramp(q,.36,.67),done=ramp(q,.63,.76),opening=ramp(q,.17,.4),cover=ramp(q,.84,.9);
 if(q>=.9)return null;
 return <div style={{...at(mix(795,641,opening),mix(255,176,opening)),width:mix(289,596,opening),height:mix(174,353,opening),borderRadius:25,background:'white',border:`1px solid ${done>.1?'#9CCEB7':'#D4E3D8'}`,boxShadow:'0 22px 47px #27523E14',color:TEXT,overflow:'hidden'}}>
  <div style={{height:77,padding:'0 29px',display:'flex',alignItems:'center',gap:15,borderBottom:'1px solid #E3EAE4',fontSize:30,fontWeight:600,opacity:ramp(opening,.35,1)}}><span style={{color:blend(a.color,TEXT,.25)}}><Icon type={i===2?'send':a.icon} size={33}/></span>{['Devis','Réponse au client','Relance','Fiche client'][i]}</div>
  <div style={{...at(28,109),width:538,height:135,background:blend('#F4F7F2',a.light,build),borderRadius:16,overflow:'hidden'}}>
   {i===0?<><div style={{...at(24,23),fontSize:28,fontWeight:550}}>3 bureaux</div><div style={{...at(24,70),fontSize:23,color:'#7D9888',opacity:build}}>3 × 690 €</div><div style={{position:'absolute',right:24,top:43,fontSize:44,fontWeight:650,letterSpacing:'-.055em',opacity:build}}>2 070 €</div></>:i===1?<div style={{padding:'23px 24px',fontSize:28,lineHeight:1.48,opacity:build}}>Votre livraison est prévue<br/><span style={{fontWeight:650,color:'#6954A8'}}>vendredi.</span></div>:i===2?<div style={{padding:'22px 24px',opacity:build}}><div style={{fontSize:29,fontWeight:600}}>Facture F-028</div><div style={{fontSize:25,color:'#96713C',marginTop:16}}>Rappel de paiement</div></div>:<div style={{padding:'21px 24px'}}><div style={{fontSize:21,color:'#7F988C'}}>Adresse</div><div style={{fontSize:29,fontWeight:550,marginTop:18,opacity:build}}>12 rue Victor-Hugo</div></div>}
  </div>
  <div style={{...at(29,269),display:'flex',alignItems:'center',gap:12,color:'#177952',fontSize:25,fontWeight:550,opacity:done}}><Icon type="check" size={28}/>{['Devis prêt à valider','Réponse prête','Relance envoyée','Dossier mis à jour'][i]}</div>
  <div style={{...at(0,347),width:596*build,height:6,background:a.color}}/>
  {opening<.99&&<div style={{position:'absolute',inset:0,background:a.light,...flex,color:blend(a.color,TEXT,.25),opacity:1-ramp(opening,.25,.7)}}><Icon type={i===2?'send':a.icon} size={76}/></div>}
  {cover>.001&&<div style={{...at(-596*(1-cover),0),width:596,height:353,background:a.light,...flex,color:blend(a.color,TEXT,.25)}}><Icon type="check" size={59}/></div>}
 </div>;
}

function Working({t}:{t:number}){
 if(t<9.72||t>=20.55)return null;
 return <div style={{...at(478,278),width:1302,height:660,overflow:'hidden',borderRadius:20}}>{people.map((a,i)=>{
  const enter=ramp(t,a.start-.26,a.start+.16),exit=ramp(t,a.end-.18,a.end+.2),q=Math.max(0,Math.min(1,(t-a.start)/(a.end-a.start))),x=1308*(1-enter)-1308*exit;
  if(t<a.start-.26||t>a.end+.2)return null;
  const transfer=ramp(q,.4,.64),pulse=Math.sin(Math.PI*transfer);
  return <div key={a.name} style={{...at(x,0),width:1300,height:650,background:PAPER,color:TEXT}}>
   <div style={{...at(26,7),fontSize:i===3?45:49,fontWeight:550,letterSpacing:'-.05em',whiteSpace:'nowrap'}}><span style={{color:blend(a.color,TEXT,.32)}}>{a.name}</span>{[' prépare le devis.',' répond au client.',' relance la facture.',' met le dossier à jour.'][i]}</div>
   <div style={{...at(29,99),height:58,display:'flex',alignItems:'center',gap:15,padding:'0 19px',borderRadius:13,background:a.light,color:blend(a.color,TEXT,.45),fontSize:24}}><Icon type={i===0?'mic':a.icon} size={29}/>{['Vocal · 3 bureaux','« Livraison prévue ? »','Facture échue','Changement d’adresse'][i]}{i===0&&<Wave t={t} w={139} h={27} dark/>}</div>
   <svg width="1300" height="650" style={at(0,0)} fill="none"><path d="M397 334H641" stroke="#C6DCD0" strokeWidth="3"/><path d="M397 334H641" stroke={a.color} strokeWidth="4" pathLength="1" strokeDasharray={`${transfer} 1`}/><path d="m624 325 14 9-14 9" stroke={a.color} strokeWidth="3"/></svg>
   <ServerCard i={i} q={q}/><ResultCard i={i} q={q}/>
   {transfer>0&&transfer<1&&<div style={{...at(mix(397,641,transfer)-38,299-24*pulse),width:76,height:70,borderRadius:16,background:a.color,color:'white',...flex,boxShadow:`0 ${12*pulse}px 25px ${a.color}33`}}><Icon type={i===0?'file':i===1?'clock':i===2?'check':'person'} size={36}/></div>}
   <div style={{...at(29,577),fontSize:18,color:'#90A295',display:'flex',alignItems:'center',gap:12}}><Icon type="server" size={22}/>Les données de votre entreprise</div>
   <div style={{...at(769,579)}}><ToolMarks active={i===0?2:i===1?1:0} dark/></div>
  </div>;
 })}</div>;
}

function ProfitabilityChart({t,en}:{t:number,en:number}){
 const progress=ramp(t,21.3,23.65,smooth),finish=ramp(t,23.5,23.85,out);
 const knots=[277,267,224,217,166,115,47].map((y,i)=>[27+i*83.5,y] as [number,number]);
 const segment=Math.min(5,Math.floor(progress*6)),local=progress>=1?1:progress*6-segment;
 const a=knots[segment],b=knots[segment+1],head=bez(a,[a[0]+35,a[1]],[b[0]-35,b[1]],b,local);
 const curve='M'+knots[0].join(' ')+knots.slice(1).map((p,i)=>` C${knots[i][0]+35} ${knots[i][1]} ${p[0]-35} ${p[1]} ${p[0]} ${p[1]}`).join('');
 const area=curve+` L${knots[6][0]} 309 L27 309 Z`;
 const endPulse=ramp(t,23.64,24.25,out);
 return <div style={{...at(1130+130*(1-en),361+40*(1-en)),width:621,height:554,borderRadius:24,background:'linear-gradient(145deg,#F0FAF5,#FFFFFF)',border:'1px solid #CDDFD4',boxShadow:'0 18px 34px #19473118',opacity:en,color:TEXT,overflow:'hidden'}}>
  <div style={{...at(28,24),fontSize:33,fontWeight:600,letterSpacing:'-.045em'}}>Rentabilité</div>
  <div style={{...at(29,72),fontSize:18,color:'#637F70'}}>Évolution illustrée</div>
  <div style={{...at(418,27),height:34,padding:'0 13px',borderRadius:10,background:'#DDF2E5',color:'#126B50',fontSize:17,fontWeight:550,...flex,gap:7,opacity:finish}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 18 18 4M7 4h11v11"/></svg>En progression</div>
  <div style={{...at(23,107),width:576,height:354}}><svg width="576" height="354" viewBox="0 0 576 354" style={{display:'block'}}>
   <defs>
    <linearGradient id="profit-area-v4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00D1B6" stopOpacity=".33"/><stop offset="100%" stopColor="#00D1B6" stopOpacity=".018"/></linearGradient>
    <clipPath id="profit-reveal-v4"><rect x="0" y="0" width={head[0]+1} height="330"/></clipPath>
   </defs>
   {[58,121,184,247,309].map((y,i)=><line key={'h'+i} x1="27" y1={y} x2="546" y2={y} stroke="#719A87" strokeWidth="1" opacity={i===4?.3:.13} strokeDasharray={i===4?undefined:'4 7'}/>)}
   {[27,110.5,194,277.5,361,444.5,528].map((x,i)=><line key={'v'+i} x1={x} y1="34" x2={x} y2="309" stroke="#719A87" strokeWidth="1" opacity=".07"/>)}
   <line x1="27" y1="34" x2="27" y2="309" stroke="#719A87" opacity=".24"/>
   <g clipPath="url(#profit-reveal-v4)">
    <path d={area} fill="url(#profit-area-v4)"/>
    <path d={curve} stroke="#00D1B6" strokeWidth="18" strokeLinecap="round" fill="none" opacity=".065"/>
    <path d={curve} stroke="#008D73" strokeWidth="5" strokeLinecap="round" fill="none"/>
    {knots.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="4" fill="#098B73"/>)}
   </g>
   {progress>0&&<>
    <line x1={head[0]} y1={head[1]} x2={head[0]} y2="309" stroke="#188F78" strokeWidth="1" strokeDasharray="4 6" opacity={.3*(1-finish)}/>
    <circle cx={head[0]} cy={head[1]} r="13" fill="#00D1B6" opacity=".15"/>
    <circle cx={head[0]} cy={head[1]} r="6" fill="#087E69" stroke="#FFFFFF" strokeWidth="2"/>
   </>}
   {endPulse>0&&endPulse<1&&<circle cx={knots[6][0]} cy={knots[6][1]} r={9+24*endPulse} fill="none" stroke="#1A947D" strokeWidth="2" opacity={.7*(1-endPulse)}/>}
  </svg></div>
  <div style={{...at(50,429),fontSize:17,color:'#658576'}}>Aujourd’hui</div>
  <div style={{position:'absolute',right:58,top:429,fontSize:17,color:'#658576'}}>Au fil du temps</div>
  <div style={{...at(29,477),display:'flex',alignItems:'center',gap:9,color:'#4B7560',fontSize:19}}><Icon type="clock" size={24}/>Temps disponible</div>
  <div style={{...at(29,518),width:561,height:8,borderRadius:6,background:'#D7E8DD',overflow:'hidden'}}><div style={{width:mix(106,561,ramp(t,21.4,23.2,smooth)),height:8,borderRadius:6,background:'#16A67B'}}/></div>
 </div>;
}

function Dashboard({t}:{t:number}){
 const en=ramp(t,19.75,21.1),title=ramp(t,21.05,21.65),settle=ramp(t,20.7,21.6);
 if(en<.001)return null;
 return <>
  <div style={{...at(118,282),width:280,height:645,background:'#EEF4ED',borderRadius:21,opacity:en}}>
   <div style={{padding:'26px 24px',color:TEXT,fontSize:24,fontWeight:600}}>Tableau de bord</div>
   {['Vue d’ensemble','Clients','Devis','Factures'].map((n,i)=><div key={n} style={{margin:'8px 15px',height:57,borderRadius:12,padding:'0 15px',background:i===0?'#D8EEE1':'transparent',display:'flex',alignItems:'center',gap:14,fontSize:22,color:i===0?'#176E56':'#8BA193'}}><Icon type={['box','person','file','clock'][i]} size={25}/>{n}</div>)}
   <div style={{...at(26,470),width:228,color:'#458471',fontSize:23,lineHeight:1.42}}>Du temps pour<br/><span style={{fontSize:31,fontWeight:650,color:'#157658'}}>vos clients.</span></div>
  </div>
  <div style={{...at(446,282),fontSize:43,fontWeight:550,letterSpacing:'-.045em',color:TEXT,opacity:en}}>Les missions avancent.</div>
  {[{label:'À traiter',value:Math.round(4*(1-settle)),color:'#607B6E'},{label:'Terminées',value:Math.round(4*settle),color:'#13785A'}].map((m,i)=><div key={m.label} style={{...at(447+i*332,361+40*(1-en)),width:309,height:142,borderRadius:20,background:i?'#E1F3E7':'white',border:'1px solid #D1E3D4',opacity:en,padding:'22px 27px',boxSizing:'border-box'}}><div style={{fontSize:22,color:'#729280'}}>{m.label}</div><div style={{fontSize:62,lineHeight:1.05,fontWeight:600,color:m.color,letterSpacing:'-.07em',marginTop:9}}>{m.value}</div></div>)}
  <div style={{...at(451,527),fontSize:18,color:'#8AA191',opacity:en}}>VOTRE ÉQUIPE</div><div style={{...at(898,527),fontSize:18,color:'#8AA191',opacity:en}}>RÉSULTATS</div>
  {people.map((a,i)=>{const p=ramp(t,19.9+i*.1,21.1+i*.1);return <div key={a.name} style={{...at(mix(610,446,p),558+i*88),width:642,height:74,borderRadius:15,background:'white',border:'1px solid #DCE8DE',opacity:p}}><div style={{...at(84,43),fontSize:i===3?18.5:20,fontWeight:500,color:'#6C8578'}}>{a.task}</div></div>})}
  <ProfitabilityChart t={t} en={en}/>
  <div style={{...at(94,109),fontSize:45,fontWeight:550,color:TEXT,letterSpacing:'-.045em',opacity:title}}>Moins d’administratif. <span style={{color:'#008D7A'}}>Plus de temps pour vos clients.</span></div>
 </>;
}


function Receipts({t}:{t:number}){
 return <>{people.map((a,i)=>{
  const begin=a.start+.9*(a.end-a.start),p=ramp(t,begin,a.end+.18),erp=ramp(t,20.05+i*.055,21.38+i*.055);
  if(t<begin)return null;
  const pos=bez([1119,454],[1119,625],[520+i*311,777],[493+i*318,911],p),x=mix(pos[0],876,erp),y=mix(pos[1],572+i*88,erp),w=mix(mix(596,298,p),197,erp),h=mix(mix(353,51,p),46,erp),show=ramp(p,.74,.98);
  return <div key={a.name} style={{...at(x,y),width:w,height:h,borderRadius:mix(25,13,p),background:a.light,border:`1px solid ${a.color}55`,boxSizing:'border-box',overflow:'hidden',color:blend(a.color,TEXT,.5),boxShadow:`0 ${12*(1-p)}px ${25*(1-p)}px #153D3218`}}>
   <div style={{...at(mix(w/2-29,15,show),mix(h/2-29,13,show)),display:'flex',alignItems:'center',gap:10,whiteSpace:'nowrap'}}><Icon type="check" size={mix(mix(59,24,show),21,erp)}/><span style={{fontSize:mix(21,17.5,erp),fontWeight:550,opacity:show}}>{a.result}</span></div>
  </div>;
 })}</>;
}

function FinalCTA({t,light=false}:{t:number,light?:boolean}){
 if(t<25.55)return null;
 const logo=ramp(t,25.80,26.32,out),line=ramp(t,26.08,26.53,out),url=ramp(t,26.36,26.81,out);
 return <>
  <AbsoluteFill style={{background:light?'#FFFFFF':C.ink,opacity:ramp(t,25.55,26.20)}}/>
  <div style={{...at(0,301),width:1920,height:275,overflow:'hidden',...flex,alignItems:'flex-start'}}>
   <div style={{display:'flex',alignItems:'center',gap:48.87,color:light?C.ink:'white',fontSize:181,fontWeight:550,letterSpacing:'-.045em',lineHeight:1.12,whiteSpace:'nowrap',opacity:logo,transform:`translateY(${66*(1-logo)}px)`,filter:logo<1?`blur(${5*(1-logo)}px)`:'none'}}><MarssaneLogo size={262.45}/></div>
  </div>
  <div style={{...at(960-44*line,641),width:88*line,height:4,borderRadius:3,background:C.mint,opacity:line}}/>
  {['Discutons de ce que l’IA peut faire','pour votre entreprise.'].map((text,i)=>{
   const p=ramp(t,26.10+i*.11,26.62+i*.11,out);
   return <div key={text} style={{...at(160,694+i*81.92),width:1600,height:89,overflow:'hidden',textAlign:'center'}}><div style={{fontSize:64,lineHeight:1.28,fontWeight:500,letterSpacing:'-.04em',color:i?(light?'#087F72':C.mint):(light?C.ink:'white'),opacity:p,transform:`translateY(${54*(1-p)}px)`,filter:p<1?`blur(${4*(1-p)}px)`:'none'}}>{text}</div></div>;
  })}
  <div style={{...at(0,930+22*(1-url)),width:1920,...flex,gap:22,fontSize:31,fontWeight:550,color:light?'#506F69':'#9FC3BE',letterSpacing:'-.02em',opacity:url}}>marssane.fr<Icon type="arrow" size={36}/></div>
 </>;
}

// Retiming only: keep every V7 visual and transition on its source timeline.
export const V10_LIGHT_DURATION_FRAMES=2065;
export function sourceTimeV10Light(t:number){
 const pauseAt=7.5,pause=0,slowStart=11,slowEnd=21.3,rate=.7;
 if(t<=pauseAt)return t;
 if(t<=pauseAt+pause)return pauseAt;
 const unpaused=t-pause;
 if(unpaused<=slowStart)return unpaused;
 const slowDuration=(slowEnd-slowStart)/rate;
 if(unpaused<=slowStart+slowDuration)return slowStart+(unpaused-slowStart)*rate;
 return slowEnd+unpaused-slowStart-slowDuration;
}

export const Team34V10Light=({lightEnd=true}:{lightEnd?:boolean}={})=>{
 const realT=sourceTimeV10Light(useCurrentFrame()/60),t=storyTime(realT),closing=ramp(realT,25.55,26.2,out);
 return <AbsoluteFill style={{background:'#FFFFFF',...font,color:TEXT,overflow:"hidden",WebkitFontSmoothing:"antialiased"}}>
  <div style={{position:'absolute',inset:0,background:'#FFFFFF'}}/>
  <div style={{position:'absolute',inset:0,transform:`translateY(${-100*closing}px) scale(${1-.045*closing})`,transformOrigin:'50% 50%',opacity:1-closing,filter:closing>0?`blur(${8*closing}px)`:'none'}}>
   {realT<INTRO_END&&<div style={{position:'absolute',inset:0,background:INK,opacity:1-ramp(realT,INTRO_HANDOFF,INTRO_END)}}/>}
   <Intro t={realT}/><AppFrame t={t}/>
   {t>4.4&&t<20.8&&<div style={{...at(94,109),fontSize:45,fontWeight:550,letterSpacing:'-.045em',opacity:ramp(t,4.4,5.1)*(1-ramp(t,19.8,20.55))}}>Votre équipe <span style={{color:'#008D7A'}}>au travail.</span></div>}
   <Notifications t={t}/><Delegation t={t}/><Working t={t}/><Dashboard t={t}/><Agents t={realT} storyT={t}/><Receipts t={t}/><Cursor t={t}/>
  </div>
  <FinalCTA t={realT} light={lightEnd}/>
  <div style={{...at(59,40),opacity:1-ramp(realT,25.55,26.08)}}><Brand dark/></div>
 </AbsoluteFill>;
};

export const V10_LIGHT_END_START=1797;
export const Team34V10LightEnd=()=> <Sequence from={-V10_LIGHT_END_START}><Team34V10Light/></Sequence>;
