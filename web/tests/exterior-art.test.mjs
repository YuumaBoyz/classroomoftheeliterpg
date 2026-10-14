import test from 'node:test';
import assert from 'node:assert/strict';
import {access} from 'node:fs/promises';
import {SCENES} from '../dist/maps.mjs';
import {ENVIRONMENT_ART} from '../dist/environment-art.mjs';
import {EXTERIOR_ART,TERRAIN_ART,drawImageStrip,drawOutdoorGround} from '../dist/exterior-art.mjs';

test('Chaque objet extérieur et chaque massif dispose d’un asset image livré',async()=>{
 let count=0;
 for(const s of Object.values(SCENES).filter(s=>s.outdoor)){
  for(const o of s.objects){assert.ok(ENVIRONMENT_ART[o.art],`${o.type} sans asset`);count++;}
  for(const p of s.patches.filter(p=>p.type==='flowers'))assert.equal(p.art,'outdoorFlowers');
 }
 assert.equal(count,67);
 for(const spec of [...Object.values(EXTERIOR_ART),...Object.values(TERRAIN_ART)])await access(new URL(`../dist/${spec.src}`,import.meta.url));
});

test('Les grilles et clôtures se répètent sans étirement, trou ni dépassement',()=>{
 const image={},draws=[],art={image,bounds:[10,20,300,100]};
 drawImageStrip({drawImage(...args){draws.push(args);}},art,[100,200,50,8]);
 assert.equal(draws.length,3);assert.deepEqual(draws.map(d=>d[7]),[24,24,2]);
 assert.equal(draws[2][3],25);
 for(let i=0;i<draws.length;i++){
  const d=draws[i];assert.equal(d[0],image);assert.equal(d[7]/d[8],d[3]/d[4]);
  if(i)assert.equal(draws[i-1][5]+draws[i-1][7],d[5]);
 }
 assert.equal(draws.at(-1)[5]+draws.at(-1)[7],150);
});

test('Un sol extérieur incomplet conserve le décor de repli pendant le chargement',()=>{
 assert.equal(drawOutdoorGround(null,SCENES.campus,new Map(),new Map()),false);
 const images=new Map(['grass','paving','stone','fence'].map(id=>[`terrain:${id}`,{}]));
 assert.equal(drawOutdoorGround(null,SCENES.courtyard,images,new Map()),false);
});
