import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createState,validateState,ITEMS,nextDay} from '../dist/engine.mjs';
import {SCENES,canStand,pathTo,drawPlan} from '../dist/maps.mjs';
import {World} from '../dist/world.mjs';
import {RESIDENCE_VARIANTS,RESIDENCE_MATERIALS,drawResidenceGround} from '../dist/residence-art.mjs';
import {EnvironmentArt} from '../dist/environment-art.mjs';
import {RESIDENCE_ROOMS,roomAt,roomById,doorApproach,operateDoor,toggleWardrobe,transferWardrobe,takeNap,visibleResidenceScene,WARDROBE_CAPACITY} from '../dist/residence-system.mjs';
const inside=id=>{const s=createState();s.scene='dorm';s.position={...roomById(id).door.inside};return s;};

test('Treize pièces ont une vraie porte fermée et une clé, accessible des deux côtés',()=>{
 const s=createState();assert.equal(RESIDENCE_ROOMS.length,13);assert.equal(s.residence.keys.length,13);
 for(const room of RESIDENCE_ROOMS){
  const frames=SCENES.dorm.objects.filter(o=>o.doorId===room.id);assert.equal(frames.length,1,room.id);
  assert.equal(SCENES.dorm.props.filter(p=>p.doorId===room.id).length,1,room.id);
  assert.ok(canStand('dorm',room.door.outside.x,room.door.outside.y,s.residence));assert.ok(canStand('dorm',room.door.inside.x,room.door.inside.y,s.residence));
  assert.equal(canStand('dorm',room.door.x,room.door.centerY,s.residence),false);
  s.scene='dorm';s.position={...room.door.outside};assert.ok(operateDoor(s,room.id,'open').ok);
  assert.ok(canStand('dorm',room.door.x,room.door.centerY,s.residence));
  const path=pathTo('dorm',s.position,room.center,s.residence);assert.ok(path.length,room.id);assert.ok(Math.hypot(path.at(-1).x-room.center.x,path.at(-1).y-room.center.y)<20);
  s.position={...room.door.inside};assert.ok(operateDoor(s,room.id,'close').ok);assert.ok(operateDoor(s,room.id,'lock').ok);
  assert.equal(operateDoor(s,room.id,'open').ok,false);assert.ok(operateDoor(s,room.id,'unlock').ok);assert.ok(operateDoor(s,room.id,'open').ok);
 }
});

test('Une serrure refuse la mauvaise clé, les commandes éloignées et la fermeture sur un occupant',()=>{
 const s=inside('room-106'),r=roomById('room-106');s.residence.keys=[];
 assert.equal(operateDoor(s,r.id,'lock').ok,false);s.residence.keys=[r.id];assert.ok(operateDoor(s,r.id,'open').ok);
 assert.equal(operateDoor(s,r.id,'lock').ok,false);assert.equal(operateDoor(s,r.id,'close',[{x:r.door.x,y:r.door.centerY}]).ok,false);
 s.position={x:r.door.x,y:r.door.centerY};assert.equal(operateDoor(s,r.id,'close').ok,false);
 s.position={...SCENES.dorm.spawn};assert.equal(operateDoor(s,r.id,'close').ok,false);
 s.scene='campus';assert.equal(operateDoor(s,r.id,'open').ok,false);
});

test('La poignée reste utilisable à la distance où le déplacement au clic déclenche son menu',()=>{
 const s=inside('residence-laundry'),r=roomById('residence-laundry');s.position.y+=50;
 assert.ok(operateDoor(s,r.id,'lock').ok);assert.ok(operateDoor(s,r.id,'unlock').ok);assert.ok(operateDoor(s,r.id,'open').ok);
});

test('La navigation, les interactions et les PNJ respectent les portes fermées',()=>{
 const s=createState();s.scene='dorm';s.position={...SCENES.dorm.spawn};const r=roomById('room-106');
 assert.deepEqual(pathTo('dorm',s.position,r.center,s.residence),[]);
 const world=Object.assign(Object.create(World.prototype),{getState:()=>s,npcAgent:()=>null});
 assert.ok(world.items().every(p=>!p.wardrobeId&&p.id!=='sleep'));
 s.position={...r.door.inside};assert.deepEqual(doorApproach(r,s.position),r.door.inside);
 const items=world.items();assert.ok(items.some(p=>p.id==='sleep'));assert.ok(items.filter(p=>p.doorId).every(p=>p.doorId===r.id));
 const actor={x:r.door.x,y:r.door.centerY+22,path:[{x:r.door.x,y:r.door.centerY-22}],speed:68,alpha:1,yieldLeft:0};
 const npc=Object.assign(Object.create(World.prototype),{getState:()=>s,actors:new Map([['resident',actor]])});
 for(let i=0;i<100;i++)npc.stepAgent(actor,.016);
 assert.ok(actor.y>r.door.centerY);assert.ok(canStand('dorm',actor.x,actor.y,s.residence));
});

test('Le contenu ne se dévoile que dans la pièce occupée et se remasque à la sortie',()=>{
 const scene=SCENES.dorm,hall=visibleResidenceScene(scene,scene.spawn);assert.equal(hall.activeRoomId,null);
 assert.ok(hall.objects.every(o=>!o.roomId));assert.equal(hall.windows.length,0);
 for(const room of RESIDENCE_ROOMS){const view=visibleResidenceScene(scene,room.center);assert.equal(view.activeRoomId,room.id);assert.ok(view.objects.every(o=>!o.roomId||o.roomId===room.id));assert.ok(view.objects.some(o=>o.roomId===room.id));}
 const returned=visibleResidenceScene(scene,scene.spawn);assert.deepEqual(returned.objects,hall.objects);
 const rects=[],ctx={save(){},restore(){},translate(){},scale(){},fillText(){},fillRect(...a){rects.push(a);}};
 drawPlan(ctx,'dorm',960,730,null);
 for(const o of scene.objects.filter(o=>o.roomId))assert.ok(!rects.some(r=>r[0]===o.x&&r[1]===o.y&&r[2]===o.w&&r[3]===o.h),'Le plan ne doit pas dévoiler le mobilier');
});

test('Les sols cachés sont remplacés par un plafond opaque, sans leurs tapis',()=>{
 const scene=SCENES.dorm,patterns=new Map(Object.keys(RESIDENCE_MATERIALS).map(id=>[id,id])),rects=[],c={save(){},restore(){},fillText(){},fillRect(...r){rects.push({r,fill:this.fillStyle});}};
 drawResidenceGround(c,scene,new Map(),patterns,null);
 assert.equal(rects.filter(r=>r.fill==='residenceCeiling').length,13);
 for(const p of scene.patches.filter(p=>p.roomId))assert.ok(!rects.some(({r,fill})=>fill===p.type&&r[0]===p.x&&r[1]===p.y&&r[2]===p.w&&r[3]===p.h));
});

test('Les huit armoires stockent vraiment les objets sans duplication et gardent leur état',()=>{
 for(const room of SCENES.dorm.rooms){
  const s=inside(room.id),prop=SCENES.dorm.props.find(p=>p.wardrobeId===room.id);assert.ok(prop);s.position={x:prop.x,y:prop.y};s.inventory.drink=2;
  assert.equal(transferWardrobe(s,room.id,'drink','deposit',ITEMS).ok,false);
  assert.ok(toggleWardrobe(s,room.id,true).ok);assert.ok(transferWardrobe(s,room.id,'drink','deposit',ITEMS).ok);
  assert.equal(s.inventory.drink,1);assert.equal(s.residence.wardrobes[room.id].items.drink,1);
  const loaded=validateState(JSON.parse(JSON.stringify(s)));assert.ok(loaded.residence.wardrobes[room.id].open);assert.equal(loaded.residence.wardrobes[room.id].items.drink,1);
  assert.ok(transferWardrobe(loaded,room.id,'drink','withdraw',ITEMS).ok);assert.equal(loaded.inventory.drink,2);assert.equal(loaded.residence.wardrobes[room.id].items.drink,0);
  assert.equal(transferWardrobe(loaded,room.id,'drink','withdraw',ITEMS).ok,false);
  assert.ok(toggleWardrobe(loaded,room.id,false).ok);assert.equal(transferWardrobe(loaded,room.id,'drink','deposit',ITEMS).ok,false);
 }
});

test('Le rangement respecte la capacité, les limites du sac, la distance et la validation des sauvegardes',()=>{
 const s=inside('room-106'),p=SCENES.dorm.props.find(p=>p.wardrobeId==='room-106');s.position={...p};const w=s.residence.wardrobes['room-106'];w.open=true;w.items.drink=WARDROBE_CAPACITY;s.inventory.drink=ITEMS.drink.max;
 assert.equal(transferWardrobe(s,'room-106','drink','deposit',ITEMS).ok,false);assert.equal(transferWardrobe(s,'room-106','drink','withdraw',ITEMS).ok,false);
 s.position={...SCENES.dorm.spawn};assert.equal(toggleWardrobe(s,'room-106',true).ok,false);assert.equal(transferWardrobe(s,'room-106','drink','withdraw',ITEMS).ok,false);
 assert.ok(validateState(s));w.items.drink++;assert.equal(validateState(s),null);w.items.drink=1;w.items.fake=1;assert.equal(validateState(s),null);delete w.items.fake;
 s.residence.doors['room-106']={open:true,locked:true};assert.equal(validateState(s),null);
 const old=createState();delete old.residence;assert.equal(Object.keys(validateState(old).residence.doors).length,13);
});

test('La sieste coûte un créneau, ne se cumule pas et la nuit garde serrures et rangement',()=>{
 const s=createState();assert.equal(takeNap(s).ok,false);s.scene='dorm';s.position={...SCENES.dorm.props.find(p=>p.id==='sleep')};s.energy=80;s.stress=8;
 const before={day:s.day,actions:s.actions};assert.ok(takeNap(s).ok);assert.equal(s.day,before.day);assert.equal(s.actions,before.actions-1);assert.equal(s.energy,100);assert.equal(s.stress,0);assert.equal(takeNap(s).ok,false);
 s.residence.doors['room-106'].locked=true;s.residence.wardrobes['room-106'].items.tea=1;assert.ok(nextDay(s).ok);assert.equal(s.residence.doors['room-106'].locked,true);assert.equal(s.residence.wardrobes['room-106'].items.tea,1);
 s.position={...SCENES.dorm.props.find(p=>p.id==='sleep')};s.energy=50;assert.ok(takeNap(s).ok);assert.equal(s.energy,75);assert.ok(validateState(s));
});

test('Les sprites de porte fermée et armoire ouverte sont livrés avec alpha et conservent les proportions',async()=>{
 const png=await readFile(new URL('../dist/assets/residence-v9/interactions.png',import.meta.url));assert.equal(png[25],6);
 for(const [id,spec] of Object.entries(RESIDENCE_VARIANTS)){
  const image={},bounds=[10,20,300,400],draws=[],c={save(){},restore(){},drawImage(...a){draws.push(a);}},o={art:id,x:10,y:20,w:40,h:30};
  assert.ok(EnvironmentArt.prototype.draw.call({images:new Map([[id,{image,bounds}]])},c,o));assert.equal(draws[0][0],image);assert.deepEqual(draws[0].slice(1,5),bounds);assert.equal(draws[0][7]/draws[0][8],300/400);assert.ok(spec.src.endsWith('.png'));
 }
});
