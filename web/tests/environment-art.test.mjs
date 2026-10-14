import test from 'node:test';
import assert from 'node:assert/strict';
import {access} from 'node:fs/promises';
import {ENVIRONMENT_ART,GROUND_ART,EnvironmentArt,alphaBounds} from '../dist/environment-art.mjs';
import {SCENES} from '../dist/maps.mjs';

test('Le cadrage alpha d’un atlas exclut les objets des cellules voisines',()=>{
 const data=new Uint8ClampedArray(8*8*4),put=(x,y,a)=>{data[(y*8+x)*4+3]=a;};
 put(1,1,255);put(2,2,255);put(7,1,255);put(1,7,255);put(0,0,20);
 assert.deepEqual(alphaBounds(data,8,8,32,[0,0,4,4]),[1,1,2,2]);
 assert.deepEqual(alphaBounds(data,8,8,32,[4,0,4,4]),[7,1,1,1]);
 assert.equal(alphaBounds(data,8,8,32,[4,4,4,4]),null);
 assert.deepEqual(alphaBounds(data,8,8),[1,1,7,7]);
});

test('Le sol peint rejoint les limites de déplacement sans trou entre les tranches',()=>{
 const image={naturalWidth:1484,naturalHeight:1060},images=new Map([['ground:library',{image}]]),draws=[];
 const ctx={save(){},restore(){},drawImage(...args){draws.push(args);}};
 assert.equal(EnvironmentArt.prototype.drawGround.call({images},ctx,'library',SCENES.library),true);
 assert.equal(draws.length,9);
 assert.deepEqual(draws[4].slice(1),[112,180,1284,784,64,112,992,624]);
 let area=0;
 for(let y=0;y<3;y++)for(let x=0;x<3;x++){
  const d=draws[y*3+x];assert.ok(d.slice(3,5).every(v=>v>0));area+=d[7]*d[8];
  if(x<2)assert.equal(d[5]+d[7],draws[y*3+x+1][5]);
  if(y<2)assert.equal(d[6]+d[8],draws[(y+1)*3+x][6]);
 }
 assert.equal(area,1120*800);
 assert.equal(EnvironmentArt.prototype.drawGround.call({images:new Map()},ctx,'library',SCENES.library),false);
 assert.equal(GROUND_ART.dorm,undefined,'La résidence utilise des matériaux modulaires, pas un fond de chambre étiré');
});

test('Tous les meubles de la bibliothèque disposent d’un asset livré',async()=>{
 for(const o of SCENES.library.objects.filter(o=>o.type!=='stackSign'))assert.ok(ENVIRONMENT_ART[o.art],`Asset manquant : ${o.type}`);
 for(const spec of [...Object.values(ENVIRONMENT_ART),...Object.values(GROUND_ART)])await access(new URL(`../dist/${spec.src}`,import.meta.url));
});
