import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {artworkFrame} from '../dist/render-quality.mjs';
import {SCENES,canStand,pathTo} from '../dist/maps.mjs';
import {RESIDENCE_WAKE,RESIDENCE_VERSION} from '../dist/residence-map.mjs';
import {RESIDENCE_ART,RESIDENCE_MATERIALS,drawVerticalStrip,drawResidenceGround} from '../dist/residence-art.mjs';
import {ENVIRONMENT_ART} from '../dist/environment-art.mjs';
import {createState,validateState,nextDay} from '../dist/engine.mjs';

test('Les huit chambres et les cinq espaces communs sont reliés à pied depuis le hall',()=>{
 const s=SCENES.dorm;assert.deepEqual(s.rooms.map(r=>r.number),[101,102,103,104,105,106,107,108]);
 assert.equal(s.shared.length,5);assert.ok(s.w*s.h>2.9*896*736);
 for(const room of [...s.rooms,...s.shared]){
  assert.ok(canStand('dorm',room.center.x,room.center.y),room.name??room.number);
  const path=pathTo('dorm',s.spawn,room.center);assert.ok(path.length,room.name??room.number);
  assert.ok(Math.hypot(path.at(-1).x-room.center.x,path.at(-1).y-room.center.y)<20);
  let previous=s.spawn;
  for(const p of path){const length=Math.hypot(p.x-previous.x,p.y-previous.y);for(let i=0;i<=length;i++){const k=length?i/length:0;assert.ok(canStand('dorm',previous.x+(p.x-previous.x)*k,previous.y+(p.y-previous.y)*k));}previous=p;}
 }
});

test('Les murs et le vide bloquent les déplacements, mais chaque porte de chambre est ouverte',()=>{
 for(const r of SCENES.dorm.rooms){
  assert.equal(canStand('dorm',r.x+r.w/2,r.y-6),false,'Mur nord');
  assert.equal(canStand('dorm',r.x+r.w+6,r.y+120),false,'Mur latéral');
  assert.equal(canStand('dorm',r.x+96,r.y+r.h+6),false,'Mur du couloir');
  for(let y=r.y+r.h-12;y<=r.y+r.h+24;y+=4)assert.ok(canStand('dorm',r.door.x,y),`Porte ${r.number}`);
 }
 assert.equal(canStand('dorm',376,200),false,'Vide entre deux chambres');
 assert.equal(canStand('dorm',250,1170),false,'Extérieur de l’aile sud');
});

test('Le lit, le carnet, le téléphone et les activités de résidence se trouvent sur un sol accessible',()=>{
 const s=SCENES.dorm;
 assert.equal(s.rooms.filter(r=>r.own).length,1);assert.equal(s.rooms.find(r=>r.own).number,106);
 for(const p of [...s.props,...s.portals]){
  assert.ok(canStand('dorm',p.x,p.y),p.name);
  const path=pathTo('dorm',s.spawn,p);assert.ok(path.length,p.name);
  assert.ok(Math.hypot(path.at(-1).x-p.x,path.at(-1).y-p.y)<20,p.name);
 }
 const state=createState();assert.ok(nextDay(state).ok);assert.equal(state.scene,'dorm');assert.deepEqual(state.position,RESIDENCE_WAKE);
 assert.ok(canStand('dorm',state.position.x,state.position.y));
});

test('Les anciennes sauvegardes de chambre migrent une fois, les nouvelles conservent leur position',()=>{
 const old=createState();delete old.residenceVersion;old.scene='dorm';old.position={x:480,y:415};old.pp=42000;
 const migrated=validateState(old);assert.deepEqual(migrated.position,RESIDENCE_WAKE);assert.equal(migrated.pp,42000);assert.equal(migrated.residenceVersion,RESIDENCE_VERSION);
 const modern={...migrated,position:{...SCENES.dorm.spawn}};assert.deepEqual(validateState(modern).position,modern.position);
 const previousScale={...modern,residenceVersion:8,position:{x:1600,y:2304}};assert.deepEqual(validateState(previousScale).position,SCENES.dorm.spawn);
 const campus=createState();delete campus.residenceVersion;const position={...campus.position};assert.deepEqual(validateState(campus).position,position);
});

test('Chaque mur et meuble de résidence utilise un PNG livré, avec alpha pour les sprites',async()=>{
 for(const o of SCENES.dorm.objects)assert.ok(ENVIRONMENT_ART[o.art],`${o.type} sans image`);
 for(const spec of [...Object.values(RESIDENCE_ART),...Object.values(RESIDENCE_MATERIALS)]){
  const url=new URL(`../dist/${spec.src}`,import.meta.url);await access(url);const png=await readFile(url);
  assert.equal(png.subarray(1,4).toString(),'PNG');if(!spec.opaque)assert.equal(png[25],6,'Alpha natif');
 }
});

test('Un mur vertical répète la source native sans déformer la dernière portion',()=>{
 const image={},bounds=[20,30,100,500],draws=[];drawVerticalStrip({drawImage(...a){draws.push(a);}},{image,bounds},[200,300,24,296]);
 assert.equal(draws.length,3);assert.equal(draws[0][0],image);assert.deepEqual(draws[0].slice(1),[20,30,100,500,200,300,24,120]);
 assert.deepEqual(draws[2].slice(5),[200,540,24,56]);
 for(const d of draws)assert.ok(Math.abs(d[3]/d[4]-d[7]/d[8])<1e-12);
});

test('Les sprites ont une taille cohérente avec le personnage après cadrage alpha',async()=>{
 const audit=JSON.parse(await readFile(new URL('../../art/residence-sud-imagen-v8/echelle-sprites.json',import.meta.url),'utf8'));
 const limits={residenceLaundry:1.25,residenceDoor:1.35,residenceDesk:1.25,residenceNightstand:.8,residenceBedBlue:1.6,residenceBedSage:1.6,residenceBedWine:1.6,residenceSofa:1.2,residenceArmchair:1.2,residenceFridge:1.7};
 for(const [id,limit] of Object.entries(limits)){
  const source=audit.sprites.find(s=>s.id===id),spec=RESIDENCE_ART[id];
  const png=await readFile(new URL(`../dist/${spec.src}`,import.meta.url));assert.equal(createHash('sha256').update(png).digest('hex'),source.sha256,'Le cadrage audité correspond au PNG livré');
  for(const o of SCENES.dorm.objects.filter(o=>o.art===id)){
   const frame=artworkFrame(source.sourceBounds,spec.frame(o));assert.ok(frame[3]<=audit.playerVisibleHeight*limit,`${id} : ${frame[3]} unités pour un joueur de ${audit.playerVisibleHeight}`);
  }
 }
});

test('Les matériaux sont des découpes à leur définition native, répétées sur la grande carte',()=>{
 const doc=globalThis.document,matrix=globalThis.DOMMatrix,crops=[],fills=[],patterns=[];
 globalThis.document={createElement(){const cv={getContext(){return{drawImage(...a){crops.push({cv,a});}};}};return cv;}};
 globalThis.DOMMatrix=class{scale(x,y){return{x,y};}};
 try{
  const image={naturalWidth:1254,naturalHeight:1254},images=new Map();
  for(const [id,spec] of Object.entries(RESIDENCE_MATERIALS))images.set(`terrain:${id}`,{image,bounds:spec.cell.map(v=>v*1254)});
  const ctx={save(){},restore(){},fillText(){},fillRect(...a){fills.push(a);},createPattern(cv){const p={cv,setTransform(m){this.transform=m;}};patterns.push(p);return p;}};
  assert.ok(drawResidenceGround(ctx,SCENES.dorm,images,new Map()));
  assert.equal(crops.length,4);assert.equal(patterns.length,4);
  for(const {cv,a} of crops){assert.equal(cv.width,627);assert.equal(cv.height,627);assert.equal(a[0],image);assert.deepEqual(a.slice(3),[627,627,0,0,627,627]);}
  assert.equal(fills.length,SCENES.dorm.patches.length+1);
 }finally{globalThis.document=doc;globalThis.DOMMatrix=matrix;}
});
