import test from 'node:test';
import assert from 'node:assert/strict';
import {SCENES,canStand,pathTo,safePosition} from '../dist/maps.mjs';
import {PEOPLE,LOCATIONS} from '../dist/engine.mjs';

test('Les sept cartes relient leurs portes, activités et personnages sans traverser le mobilier',()=>{
 for(const [id,scene] of Object.entries(SCENES)){
  const targets=[...scene.props,...scene.portals,...Object.values(PEOPLE).filter(p=>p.scene===id)];
  for(const target of targets){
   const path=pathTo(id,scene.spawn,target);assert.ok(path.length,`${id} : ${target.id??target.name}`);
   assert.ok(Math.hypot(path.at(-1).x-target.x,path.at(-1).y-target.y)<54,`${id} : interaction trop éloignée`);
   let previous=scene.spawn;
   for(const point of path){const distance=Math.hypot(point.x-previous.x,point.y-previous.y);for(let i=0;i<=distance;i++){const t=distance?i/distance:0;assert.ok(canStand(id,previous.x+(point.x-previous.x)*t,previous.y+(point.y-previous.y)*t),`${id} : chemin à travers un obstacle`);}previous=point;}
  }
 }
});
test('La carte de voyage et les sorties des intérieurs partagent les vrais seuils du campus',()=>{
 for(const p of SCENES.campus.portals){assert.deepEqual(LOCATIONS[p.id].door,[p.x,p.y]);assert.ok(canStand('campus',p.x,p.y+30));assert.equal(SCENES[p.id].portals[0].id,'campus');}
});
test('Les anciennes positions sauvegardées dans un meuble sont déplacées vers un sol praticable',()=>{
 for(const [id,s] of Object.entries(SCENES))for(const [x,y,w,h] of s.blocks){const p=safePosition(id,{x:x+w/2,y:y+h/2});assert.ok(canStand(id,p.x,p.y),`Position de reprise bloquée dans ${id}`);}
});
test('Les meubles solides et les obstacles de navigation ont une seule définition',()=>{
 for(const s of Object.values(SCENES))assert.deepEqual(s.blocks,s.objects.filter(o=>o.solid!==false).map(o=>[o.x,o.y,o.w,o.h]));
});
