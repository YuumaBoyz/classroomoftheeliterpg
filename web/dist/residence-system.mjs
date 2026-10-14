import {createResidence} from './residence-map.mjs?v=residence-doors-13';
const layout=createResidence();
export const RESIDENCE_ROOMS=Object.freeze([...layout.rooms,...layout.shared]);
export const WARDROBE_CAPACITY=24;
export function roomAt(position,rooms=RESIDENCE_ROOMS){return rooms.find(r=>position.x>=r.x&&position.x<=r.x+r.w&&position.y>=r.y&&position.y<=r.y+r.h)??null;}
export const roomById=id=>RESIDENCE_ROOMS.find(r=>r.id===id);
export function residenceDefaults(){return {version:1,keys:RESIDENCE_ROOMS.map(r=>r.id),doors:Object.fromEntries(RESIDENCE_ROOMS.map(r=>[r.id,{open:false,locked:false}])),wardrobes:Object.fromEntries(layout.rooms.map(r=>[r.id,{open:false,items:{}}])),napDay:0};}
export function validateResidence(input,items){
 if(input===undefined)return residenceDefaults();
 if(!input||input.version!==1||!Array.isArray(input.keys)||new Set(input.keys).size!==input.keys.length||input.keys.some(id=>!roomById(id)))return null;
 if(!input.doors||!input.wardrobes||!Number.isInteger(input.napDay)||input.napDay<0||input.napDay>7)return null;
 if(Object.keys(input.doors).length!==RESIDENCE_ROOMS.length||Object.keys(input.wardrobes).length!==layout.rooms.length)return null;
 for(const room of RESIDENCE_ROOMS){const d=input.doors[room.id];if(!d||typeof d.open!=='boolean'||typeof d.locked!=='boolean'||d.open&&d.locked)return null;}
 for(const room of layout.rooms){const w=input.wardrobes[room.id];if(!w||typeof w.open!=='boolean'||!w.items||typeof w.items!=='object'||Array.isArray(w.items))return null;let total=0;for(const [id,n] of Object.entries(w.items)){if(!Object.hasOwn(items,id)||!Number.isInteger(n)||n<0||n>WARDROBE_CAPACITY)return null;total+=n;}if(total>WARDROBE_CAPACITY)return null;}
 return structuredClone(input);
}
export function doorState(residence,id){return residence?.doors?.[id]??{open:true,locked:false};}
export function doorBlocks(residence,x,y){return !!residence&&RESIDENCE_ROOMS.some(r=>{const [bx,by,w,h]=r.door.bounds;return !doorState(residence,r.id).open&&x>bx-8&&x<bx+w+8&&y>by-3&&y<by+h+6;});}
export function doorApproach(room,position){return roomAt(position)?.id===room.id?room.door.inside:room.door.outside;}
export function contentVisible(object,activeRoomId){return !object.roomId||object.roomId===activeRoomId;}
export function visibleResidenceScene(scene,position){const id=roomAt(position)?.id??null;return{...scene,objects:scene.objects.filter(o=>contentVisible(o,id)),windows:scene.windows.filter(w=>w.roomId===id),activeRoomId:id};}
function nearDoor(state,room){const current=roomAt(state.position),handle=doorApproach(room,state.position);return state.scene==='dorm'&&(!current||current.id===room.id)&&Math.hypot(state.position.x-handle.x,state.position.y-handle.y)<62;}
export function operateDoor(state,id,action,occupants=[]){
 const room=roomById(id);if(!room||!nearDoor(state,room))return{ok:false,message:'Approchez-vous de cette porte.'};
 const d=state.residence.doors[id],key=state.residence.keys.includes(id);
 if(action==='open'){if(d.locked)return{ok:false,message:'La porte est verrouillée. Utilisez la clé pour la déverrouiller.'};d.open=true;return{ok:true,message:'Porte ouverte.'};}
 if(action==='close'){
  const [x,y,w,h]=room.door.bounds;
  if([state.position,...occupants].some(p=>p.x>x-9&&p.x<x+w+9&&p.y>y-14&&p.y<y+h+14))return{ok:false,message:'Le passage est occupé. Écartez-vous avant de fermer.'};
  d.open=false;return{ok:true,message:'Porte fermée.'};
 }
 if(!['lock','unlock'].includes(action))return{ok:false,message:'Action inconnue.'};
 if(!key)return{ok:false,message:'La clé de cette pièce manque dans votre trousseau.'};
 if(d.open)return{ok:false,message:'Fermez la porte avant de tourner la clé.'};
 d.locked=action==='lock';return{ok:true,message:d.locked?'Porte fermée à clé.':'Porte déverrouillée.'};
}
export function wardrobeAt(state,id){const room=layout.rooms.find(r=>r.id===id),prop=layout.props.find(p=>p.wardrobeId===id);return room&&prop&&state.scene==='dorm'&&roomAt(state.position)?.id===id&&Math.hypot(state.position.x-prop.x,state.position.y-prop.y)<62?state.residence.wardrobes[id]:null;}
export function toggleWardrobe(state,id,open){const w=wardrobeAt(state,id);if(!w)return{ok:false,message:'Approchez-vous de l’armoire dans sa chambre.'};w.open=open;return{ok:true,message:open?'Armoire ouverte.':'Armoire fermée.'};}
export function transferWardrobe(state,roomId,itemId,direction,items){
 const w=wardrobeAt(state,roomId),item=Object.hasOwn(items,itemId)&&items[itemId];
 if(!w?.open||!item||!['deposit','withdraw'].includes(direction))return{ok:false,message:'Ouvrez l’armoire pour ranger vos affaires.'};
 const stored=w.items[itemId]??0,bag=state.inventory[itemId];
 if(direction==='deposit'){
  if(!bag)return{ok:false,message:'Cet objet n’est pas dans votre sac.'};
  if(Object.values(w.items).reduce((a,b)=>a+b,0)>=WARDROBE_CAPACITY)return{ok:false,message:'L’armoire est pleine.'};
  state.inventory[itemId]--;w.items[itemId]=stored+1;
 }else{
  if(!stored)return{ok:false,message:'Cet objet n’est pas dans l’armoire.'};
  if(bag>=item.max)return{ok:false,message:'Votre sac ne peut pas contenir davantage de cet objet.'};
  state.inventory[itemId]++;w.items[itemId]=stored-1;
 }
 return{ok:true,message:direction==='deposit'?`Objet rangé : ${item.name}.`:`Objet repris dans le sac : ${item.name}.`};
}
export function canUseBed(state){const p=layout.props.find(p=>p.id==='sleep');return state.scene==='dorm'&&roomAt(state.position)?.own&&Math.hypot(state.position.x-p.x,state.position.y-p.y)<62;}
export function napStatus(state){if(!canUseBed(state))return{ok:false,message:'Rejoignez votre lit dans la chambre 106.'};if(state.ended)return{ok:false,message:'La semaine est terminée.'};if(state.residence.napDay===state.day)return{ok:false,message:'Vous avez déjà fait une sieste aujourd’hui.'};if(state.actions<1)return{ok:false,message:'Il ne reste aucun créneau pour une sieste.'};if(state.energy>=100&&state.stress===0)return{ok:false,message:'Vous êtes déjà complètement reposé.'};return{ok:true};}
export function takeNap(state){const check=napStatus(state);if(!check.ok)return check;state.actions--;state.energy=Math.min(100,state.energy+25);state.stress=Math.max(0,state.stress-12);state.residence.napDay=state.day;return{ok:true,message:'Sieste terminée : énergie +25, stress −12. Un créneau utilisé.'};}
