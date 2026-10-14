import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SpriteLibrary,Animator} from '../dist/sprites.mjs';
import {SceneShaders} from '../dist/shaders.mjs';

test('Les 180 poses HD existent et restent des PNG RGBA de même définition',()=>{
 const root=new URL('../dist/assets/sprites/',import.meta.url);
 const manifest=JSON.parse(readFileSync(new URL('manifest.json',root)));
 let count=0;
 for(const entry of Object.values(manifest.characters))for(const file of [...Object.values(entry.walk).flat(),...Object.values(entry.idle)]){
  const png=readFileSync(new URL(file,root));
  assert.equal(png.subarray(1,4).toString(),'PNG',file);
  assert.equal(png.readUInt32BE(16),256,file);assert.equal(png.readUInt32BE(20),256,file);
  assert.equal(png[25],6,`${file} conserve son alpha`);count++;
 }
 assert.equal(count,180);
});
test('Une texture HD conserve la taille et l’ancrage du personnage dans le monde',()=>{
 const img={width:256,height:256};let drawn;
 const library={sheets:new Map([['player',{frames:Array(16).fill(img),idle:Array(4).fill(img)}]]),display:{width:64,height:64,anchor:[32,59]}};
 const c={save(){},restore(){},translate(){},rotate(){},scale(){},beginPath(){},ellipse(){},fill(){},drawImage(...args){drawn=args;}};
 assert.equal(SpriteLibrary.prototype.draw.call(library,c,'player',100,200,new Animator().pose()),true);
 assert.deepEqual(drawn,[img,-32,-59,64,64]);assert.equal(c.imageSmoothingEnabled,true);
});
test('Une perte de WebGL réaffiche immédiatement le canvas 2D',()=>{
 const shader={enabled:true,canvas:{hidden:false},source:{style:{opacity:'0'}}};
 SceneShaders.prototype.fallback.call(shader);
 assert.equal(shader.enabled,false);assert.equal(shader.canvas.hidden,true);assert.equal(shader.source.style.opacity,'');
});

test('Le soleil projette toutes les hauteurs dans la même direction et les ombres s’allongent le soir',async()=>{
 const {lightProfile,shadowOffset}=await import('../dist/lighting.mjs');
 const afternoon=lightProfile({outdoor:true},3),evening=lightProfile({outdoor:true},0);
 const small=shadowOffset(44,afternoon),tall=shadowOffset(100,afternoon);
 assert.ok(small.x>0&&small.y>0);assert.ok(tall.x>small.x&&tall.y>small.y);
 assert.ok(Math.abs(small.x/small.y-tall.x/tall.y)<1e-10);
 assert.ok(shadowOffset(44,evening).x>small.x);assert.ok(evening.exposure<afternoon.exposure);
});
test('Un personnage dans l’ombre projetée d’un bâtiment reçoit moins de lumière directe',async()=>{
 const {lightProfile,directLightAt}=await import('../dist/lighting.mjs');
 const scene={outdoor:true,objects:[{type:'building',x:100,y:100,w:200,h:100}]},p=lightProfile(scene);
 assert.ok(directLightAt(240,220,scene,p)<1);
 assert.equal(directLightAt(60,220,scene,p),1);
 assert.equal(directLightAt(240,190,scene,p),1);
 assert.equal(directLightAt(240,220,{...scene,outdoor:false},p),1);
});
