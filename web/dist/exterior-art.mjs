// Native ImageGen atlases. Cells deliberately follow each source's transparent gutters.
const src=name=>`assets/exterior-v6/${name}.png`;
const building=o=>[o.x-8,o.y-12,o.w+16,o.h+28];
const tree=o=>[o.x-44,o.y-112,112,144];
export const EXTERIOR_ART=Object.freeze({
 zelkova:{src:src('trees'),cell:[0,0,984/1774,1],frame:tree},
 camphor:{src:src('trees'),cell:[984/1774,0,790/1774,1],frame:tree},
 gymBuilding:{src:src('gym'),frame:building},
 dormBuilding:{src:src('residence'),frame:building},
 cafeBuilding:{src:src('cafe'),frame:building},
 outdoorLamp:{src:src('street'),cell:[0,0,1/3,.5],frame:o=>[o.x-4,o.y-74,20,91]},
 bannerD:{src:src('street'),cell:[1/3,0,1/3,.5],frame:o=>[o.x-2,o.y-32,30,o.h+32]},
 bannerSchool:{src:src('street'),cell:[2/3,0,1/3,.5],frame:o=>[o.x-2,o.y-32,30,o.h+32]},
 outdoorWayfinder:{src:src('street'),cell:[0,.5,1/3,.5],labels:true,frame:o=>[o.x-36,o.y-80,96,o.h+80]},
 outdoorNotice:{src:src('street'),cell:[1/3,.5,1/3,.5],frame:o=>[o.x-3,o.y-6,o.w+6,o.h+6]},
 outdoorBikes:{src:src('street'),cell:[2/3,.5,1/3,.5],frame:o=>[o.x,o.y-28,o.w,o.h+28]},
 outdoorBench:{src:src('garden'),cell:[0,0,.5,.5],frame:o=>[o.x,o.y-12,o.w,o.h+12]},
 outdoorPlanter:{src:src('garden'),cell:[.5,0,.5,.5],frame:o=>[o.x,o.y-8,o.w,o.h+8]},
 outdoorBin:{src:src('garden'),cell:[0,.5,.5,.5],frame:o=>[o.x,o.y-10,o.w,o.h+10]},
 outdoorFlowers:{src:src('garden'),cell:[.5,.5,.5,.5],frame:o=>[o.x,o.y,o.w,o.h]},
 outdoorFountain:{src:src('water'),cell:[0,0,.5,.64],frame:o=>[o.x,o.y-24,o.w,o.h+24]},
 outdoorPond:{src:src('water'),cell:[.5,0,.5,.64],frame:o=>[o.x,o.y,o.w,o.h]},
 outdoorDrain:{src:src('water'),cell:[0,.64,.5,.36],repeatX:true,frame:o=>[o.x,o.y,o.w,o.h]}
});
export const TERRAIN_ART=Object.freeze({
 grass:{src:src('terrain'),opaque:true,cell:[0,0,.5,.5]},
 paving:{src:src('terrain'),opaque:true,cell:[.5,0,.5,.5]},
 grassShade:{src:src('terrain'),opaque:true,cell:[0,.5,.5,.5]},
 stone:{src:src('terrain'),opaque:true,cell:[.5,.5,.5,.5]},
 fence:{src:src('water'),cell:[.5,.64,.5,.36]}
});

// Repeat a native strip without stretching, including a cropped final segment.
export function drawImageStrip(c,art,[x,y,w,h]){
 const [sx,sy,sw,sh]=art.bounds,tileWidth=h*sw/sh;
 for(let offset=0;offset<w;offset+=tileWidth){const width=Math.min(tileWidth,w-offset);c.drawImage(art.image,sx,sy,sw*width/tileWidth,sh,x+offset,y,width,h);}
}

export function drawOutdoorLabels(c,o,frame){
 const shorten=line=>line.replace(/[←→↑]/g,'').trim().replace('Bibliothèque','Biblio.').replace('Résidence','Résid.');
 const lines=o.lines??[],left=lines.find(s=>s.includes('←'))??'',right=lines.filter(s=>s!==left);
 const positions=[[.72,.205,right[0]??''],[.23,.37,left],[.70,.525,right[1]??'']];
 c.save();c.textAlign='center';c.textBaseline='middle';c.font='bold 5px sans-serif';
 for(let i=0;i<positions.length;i++){const [x,y,label]=positions[i];c.fillStyle=i===1?'#ede4c9':'#304842';c.fillText(shorten(label),frame[0]+x*frame[2],frame[1]+y*frame[3],frame[2]*.37);}
 c.restore();
}

function pattern(c,id,images,patterns){
 if(patterns.has(id))return patterns.get(id);
 const art=images.get(`terrain:${id}`);if(!art)return null;
 // This canvas is a 1:1 crop of the original cell, never a reduced texture.
 const cv=document.createElement('canvas'),[sx,sy,w,h]=art.bounds;cv.width=w;cv.height=h;
 cv.getContext('2d').drawImage(art.image,sx,sy,w,h,0,0,w,h);
 const p=c.createPattern(cv,'repeat');p.setTransform(new DOMMatrix().scale(128/w,128/h));patterns.set(id,p);return p;
}

export function drawOutdoorGround(c,scene,images,patterns){
 if(!['grass','paving','stone','fence'].every(id=>images.has(`terrain:${id}`))||!images.has('outdoorFlowers'))return false;
 c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
 c.fillStyle=pattern(c,'grass',images,patterns);c.fillRect(0,0,scene.w,scene.h);
 for(const p of scene.patches){
  if(p.type==='flowers'){
   const art=images.get('outdoorFlowers'),ratio=art.bounds[2]/art.bounds[3],w=Math.min(p.w,p.h*ratio),h=w/ratio;
   c.drawImage(art.image,...art.bounds,p.x+(p.w-w)/2,p.y+(p.h-h)/2,w,h);
  }else{c.fillStyle=pattern(c,p.type==='stone'?'stone':'paving',images,patterns);c.fillRect(p.x,p.y,p.w,p.h);}
 }
 const fence=images.get('terrain:fence');
 drawImageStrip(c,fence,[32,32,scene.w-64,32]);
 c.save();c.translate(32,64);c.rotate(Math.PI/2);drawImageStrip(c,fence,[0,0,scene.h-112,24]);c.restore();
 c.save();c.translate(scene.w-8,64);c.rotate(Math.PI/2);drawImageStrip(c,fence,[0,0,scene.h-112,24]);c.restore();
 c.restore();return true;
}
