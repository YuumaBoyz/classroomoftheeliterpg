import test from 'node:test';
import assert from 'node:assert/strict';
import {canvasResolution,artworkFrame} from '../dist/render-quality.mjs';
import {EnvironmentArt,ENVIRONMENT_ART} from '../dist/environment-art.mjs';
import {SCENES} from '../dist/maps.mjs';

test('Le rendu respecte les écrans 1x, Retina 2x et mobiles 3x sans plafond à 2x',()=>{
 for(const density of [1,1.25,2,3,4]){
  const s=canvasResolution(1321,877,density);
  assert.equal(s.width,Math.round(1321*density));assert.equal(s.height,Math.round(877*density));
  assert.equal(s.scaleX*1321,s.width);assert.equal(s.scaleY*877,s.height);
 }
 assert.equal(canvasResolution(400,800,NaN).width,400);
});

test('Les détourages gardent leur rapport largeur / hauteur et leur ancrage',()=>{
 const bounds=[91,187,1897,407],layout=[160,288,176,64];
 const floor=artworkFrame(bounds,layout),center=artworkFrame(bounds,layout,.5);
 assert.equal(floor[0],layout[0]);assert.equal(floor[2],layout[2]);
 assert.ok(Math.abs(floor[2]/floor[3]-1897/407)<1e-12);
 assert.equal(floor[1]+floor[3],layout[1]+layout[3]);
 assert.equal(center[1]+center[3]/2,layout[1]+layout[3]/2);
});

test('Les décors utilisent directement l’image source et son cadrage, sans texture intermédiaire réduite',()=>{
 for(const [id,spec] of Object.entries(ENVIRONMENT_ART)){
  const o=Object.values(SCENES).flatMap(s=>[...s.objects,...s.patches]).find(o=>o.art===id);
  assert.ok(o,id);const image={naturalWidth:2048,naturalHeight:1024},bounds=[20,30,1800,900];let args;
  const c={save(){},restore(){},translate(){},scale(){},fillText(){},drawImage(...a){args=a;}};
  const images=new Map([[id,{image,bounds}]]);
  assert.equal(EnvironmentArt.prototype.draw.call({images},c,{...o,up:false}),true);
  assert.equal(args[0],image);
  if(spec.repeatX){assert.equal(args[1],bounds[0]);assert.equal(args[2],bounds[1]);assert.ok(args[3]<=bounds[2]);assert.equal(args[4],bounds[3]);}
  else if(spec.repeatY){assert.equal(args[1],bounds[0]);assert.equal(args[2],bounds[1]);assert.equal(args[3],bounds[2]);assert.ok(args[4]<=bounds[3]);}
  else assert.deepEqual(args.slice(1,5),bounds);
  assert.ok(Math.abs(args[7]/args[8]-args[3]/args[4])<1e-12,id);
  assert.equal(c.imageSmoothingQuality,'high');
 }
});
