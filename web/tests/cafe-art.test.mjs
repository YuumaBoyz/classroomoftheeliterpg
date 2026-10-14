import test from 'node:test';
import assert from 'node:assert/strict';
import {access} from 'node:fs/promises';
import {CAFE_ART,CAFE_GROUND} from '../dist/cafe-art.mjs';
import {EnvironmentArt,ENVIRONMENT_ART} from '../dist/environment-art.mjs';
import {SCENES,canStand,pathTo} from '../dist/maps.mjs';

test('Le café utilise des assets livrés pour tous ses meubles et un fond distinct',async()=>{
 assert.equal(SCENES.cafe.objects.length,33);
 for(const o of SCENES.cafe.objects)assert.ok(ENVIRONMENT_ART[o.art],`${o.type} sans image`);
 for(const spec of [...Object.values(CAFE_ART),CAFE_GROUND])await access(new URL(`../dist/${spec.src}`,import.meta.url));
});

test('Le fond du Sakura aligne sa porte peinte sur le seuil jouable et couvre toute la salle',()=>{
 const image={naturalWidth:1484,naturalHeight:1060},images=new Map([['ground:cafe',{image}]]),draws=[];
 const ctx={save(){},restore(){},drawImage(...args){draws.push(args);}};
 assert.ok(EnvironmentArt.prototype.drawGround.call({images},ctx,'cafe',SCENES.cafe));
 assert.equal(draws.length,12);let area=0;
 for(let y=0;y<3;y++)for(let x=0;x<4;x++){
  const d=draws[y*4+x];area+=d[7]*d[8];
  if(x<3)assert.equal(d[5]+d[7],draws[y*4+x+1][5]);
  if(y<2)assert.equal(d[6]+d[8],draws[(y+1)*4+x][6]);
 }
 assert.equal(area,1120*800);
 assert.equal(draws[9][1]+draws[9][3],742);
 assert.equal(draws[9][5]+draws[9][7],560);
 assert.equal(draws[10][1],742);assert.equal(draws[10][5],560);
});

test('La commande, la supérette et le seuil restent accessibles après pose des meubles',()=>{
 const s=SCENES.cafe;
 for(const p of [...s.props,...s.portals]){
  assert.ok(canStand('cafe',p.x,p.y),p.name);
  const path=pathTo('cafe',s.spawn,p);assert.ok(path.length,p.name);
  assert.ok(Math.hypot(path.at(-1).x-p.x,path.at(-1).y-p.y)<24,p.name);
 }
 const shop=s.objects.find(o=>o.art==='cafeShop'),vending=s.objects.find(o=>o.art==='cafeVending');
 assert.ok(shop.x+shop.w<=vending.x,'Le distributeur et le cabinet doivent rester séparés');
});
