import {RESIDENCE_SCALE} from './residence-map.mjs?v=residence-doors-13';
const src=name=>`assets/residence-v8/${name}.png`;
const footprint=o=>[o.x,o.y,o.w,o.h];
const bedroom=(x,y)=>({src:src('bedroom'),cell:[x/3,y/2,1/3,1/2],frame:footprint});
const lounge=(x,y)=>({src:src('lounge'),cell:[[0,680/1536,1040/1536][x],y?480/1024:0,[680/1536,360/1536,496/1536][x],y?544/1024:480/1024],frame:footprint});
const utility=(x,y)=>({src:src('utilities'),cell:[x/2,y/2,1/2,1/2],frame:footprint});
export const RESIDENCE_ART=Object.freeze({
 residenceWall:{src:src('architecture'),cell:[0,0,870/1254,750/1254],repeatX:true,frame:o=>[o.x,o.y-48*(o.artScale??1),o.w,o.h+48*(o.artScale??1)]},
 residenceWallSide:{src:src('architecture'),cell:[930/1254,96/1254,110/1254,588/1254],repeatY:true,frame:footprint},
 residenceWindow:{src:src('architecture'),cell:[0,750/1254,670/1254,504/1254],frame:o=>[o.x,o.y-80,o.w,o.h+80]},
 residenceDoor:{src:src('architecture'),cell:[670/1254,750/1254,584/1254,504/1254],frame:o=>[o.x,o.y-64,o.w,o.h+64]},
 residenceBedBlue:bedroom(0,0),residenceBedSage:bedroom(1,0),residenceBedWine:bedroom(2,0),
 residenceDesk:{src:src('bedroom'),cell:[0,.5,650/1536,.5],frame:footprint},
 residenceWardrobe:{src:src('bedroom'),cell:[650/1536,.5,400/1536,.5],frame:footprint},
 residenceNightstand:{src:src('bedroom'),cell:[1050/1536,.5,486/1536,.5],frame:footprint},
 residenceSofa:lounge(0,0),residenceArmchair:lounge(1,0),residenceCoffeeTable:lounge(2,0),
 residenceTV:lounge(0,1),residenceReception:lounge(1,1),residenceMailboxes:lounge(2,1),
 residenceLaundry:utility(0,0),residenceKitchen:utility(1,0),residenceBathroom:utility(0,1),residenceFridge:utility(1,1),
 // Folding table uses the actual source lounge table, rather than a geometric prop.
 residenceFoldTable:lounge(2,0)
});
export const RESIDENCE_VARIANTS=Object.freeze({
 residenceDoorClosed:{src:'assets/residence-v9/interactions.png',cell:[0,0,.5,1],frame:o=>[o.x,o.y-64,o.w,o.h+64]},
 residenceWardrobeOpen:{src:'assets/residence-v9/interactions.png',cell:[.5,0,.5,1],frame:o=>[o.x-o.w*.25,o.y,o.w*1.5,o.h]},
 residenceBedOccupied:{src:'assets/residence-v9/resting-bed.png',frame:footprint}
});
export const RESIDENCE_MATERIALS=Object.freeze({...Object.fromEntries(['residenceOak','residenceStone','residenceTile','residenceCarpet'].map((id,i)=>[id,{src:src('materials'),opaque:true,cell:[(i%2)/2,Math.floor(i/2)/2,.5,.5]}])),residenceCeiling:{src:src('architecture'),opaque:true,cell:[944/1254,40/1254,82/1254,40/1254]}});

export function drawVerticalStrip(c,art,[x,y,w,h]){
 const [sx,sy,sw,sh]=art.bounds,tileHeight=w*sh/sw;
 for(let offset=0;offset<h;offset+=tileHeight){const height=Math.min(tileHeight,h-offset);c.drawImage(art.image,sx,sy,sw,sh*height/tileHeight,x,y+offset,w,height);}
}

function material(c,id,images,patterns){
 if(patterns.has(id))return patterns.get(id);
 const art=images.get(`terrain:${id}`);if(!art)return null;
 // Native 1:1 atlas crop. Sampling density is preserved until the final canvas draw.
 const [sx,sy,w,h]=art.bounds,cv=document.createElement('canvas');cv.width=w;cv.height=h;
 const ctx=cv.getContext('2d');ctx.drawImage(art.image,sx,sy,w,h,0,0,w,h);
 const p=c.createPattern(cv,'repeat'),scale=id==='residenceCeiling'?32/w:192*RESIDENCE_SCALE/w;p.setTransform(new DOMMatrix().scale(scale,scale));patterns.set(id,p);return p;
}
export function drawResidenceGround(c,scene,images,patterns,activeRoomId){
 c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.fillStyle='#20252b';c.fillRect(0,0,scene.w,scene.h);
 for(const p of scene.patches){if(activeRoomId!==undefined&&p.roomId&&p.roomId!==activeRoomId)continue;const texture=material(c,p.type,images,patterns);if(!texture)continue;c.fillStyle=texture;c.fillRect(p.x,p.y,p.w,p.h);}
 if(activeRoomId!==undefined)for(const room of [...scene.rooms,...scene.shared])if(room.id!==activeRoomId){c.fillStyle=material(c,'residenceCeiling',images,patterns)??'#232b34';c.fillRect(room.x,room.y,room.w,room.h);}
 c.textAlign='center';c.textBaseline='middle';
 // Room numbers are live text so they stay crisp and match the actual rooms.
 for(const room of scene.rooms){c.font='bold 10px Georgia';c.fillStyle=room.own?'#713a4b':'#4b3e32';c.fillText(`${room.number}${room.own?' · VOTRE CHAMBRE':''}`,room.door.x,room.door.y+12);}
 c.font='bold 11px Georgia';c.fillStyle='#4b3e32';
 c.fillText('RÉSIDENCE SUD',800,1080);c.font='9px sans-serif';c.fillText('101 — 104  ↑',800,416);c.fillText('← 105 · 106     107 · 108 →',800,808);
 for(const room of scene.shared){c.font='bold 10px Georgia';c.fillStyle='#4b3e32';c.fillText(room.name.toUpperCase(),room.door.x,room.y-48);}
 c.restore();return true;
}
