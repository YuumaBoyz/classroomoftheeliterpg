import {loadArtwork} from './artwork.mjs';
import {artworkFrame} from './render-quality.mjs';
import {CAFE_ART,CAFE_GROUND} from './cafe-art.mjs';
import {RESIDENCE_ART,RESIDENCE_VARIANTS,RESIDENCE_MATERIALS,drawResidenceGround,drawVerticalStrip} from './residence-art.mjs?v=residence-doors-13';
import {EXTERIOR_ART,TERRAIN_ART,drawImageStrip,drawOutdoorGround,drawOutdoorLabels} from './exterior-art.mjs';
// ImageGen cutouts are rendered into the same footprints as the existing map props.
// Source PNGs keep their original alpha; only their transparent margin is skipped.
export const ENVIRONMENT_ART = Object.freeze({
 ...EXTERIOR_ART,
 ...CAFE_ART,
 ...RESIDENCE_ART,
 sakura:{src:'assets/environment-v4/sakura.png',frame:o=>[o.x-44,o.y-112,112,144]},
 academic:{src:'assets/environment-v4/academic-building.png',frame:o=>[o.x-8,o.y-12,o.w+16,o.h+28]},
 libraryBuilding:{src:'assets/library-v5/library-building.png',frame:o=>[o.x-8,o.y-12,o.w+16,o.h+28]},
 reading:{src:'assets/environment-v4/reading-table.png',frame:o=>[o.x,o.y,o.w,o.h]},
 libraryWallcase:{src:'assets/library-v5/wall-bookcase.png',frame:o=>[o.x,o.y-44,o.w,o.h+44]},
 libraryStack:{src:'assets/library-v5/book-stack.png',frame:o=>[o.x-6,o.y-20,o.w+12,o.h+20]},
 libraryChair:{src:'assets/library-v5/reading-chair.png',frame:o=>[o.x-2,o.y-3,o.w+4,o.h+4],flipY:o=>o.up},
 libraryDesk:{src:'assets/library-v5/reception-desk.png',frame:o=>[o.x,o.y-6,o.w,o.h+6]},
 libraryCatalogue:{src:'assets/library-v5/library-props.png',cell:[0,0,.5,.5],frame:o=>[o.x,o.y-14,o.w,o.h+14]},
 libraryCart:{src:'assets/library-v5/library-props.png',cell:[.5,0,.5,.5],frame:o=>[o.x,o.y-8,o.w,o.h+8]},
 libraryReturn:{src:'assets/library-v5/library-props.png',cell:[0,.5,.5,.5],frame:o=>[o.x,o.y-6,o.w,o.h+6]},
 libraryPlanter:{src:'assets/library-v5/library-props.png',cell:[.5,.5,.5,.5],frame:o=>[o.x-4,o.y-14,o.w+8,o.h+14]}
});

// Nine image slices align the painted floor / wall seams with collision bounds.
export const GROUND_ART = Object.freeze({
 cafe:CAFE_GROUND,
 library:{src:'assets/library-v5/room.png',opaque:true,floor:[112/1484,180/1060,1396/1484,964/1060]}
});

export function alphaBounds(data,width,height,threshold=32,region=[0,0,width,height]){
 let left=width,top=height,right=-1,bottom=-1;
 const [rx,ry,rw,rh]=region,x0=Math.max(0,Math.floor(rx)),y0=Math.max(0,Math.floor(ry)),x1=Math.min(width,Math.ceil(rx+rw)),y1=Math.min(height,Math.ceil(ry+rh));
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(data[(y*width+x)*4+3]>threshold){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);}
 return right<left?null:[left,top,right-left+1,bottom-top+1];
}

export class EnvironmentArt{
 constructor(onLoad=()=>{}){this.images=new Map();this.terrainPatterns=new Map();const sheets=new Map(),specs={...ENVIRONMENT_ART,...RESIDENCE_VARIANTS,...Object.fromEntries(Object.entries(GROUND_ART).map(([id,spec])=>[`ground:${id}`,spec])),...Object.fromEntries(Object.entries({...TERRAIN_ART,...RESIDENCE_MATERIALS}).map(([id,spec])=>[`terrain:${id}`,spec]))};
 this.ready=Promise.all(Object.entries(specs).map(async([id,spec])=>{
  try{
   if(!sheets.has(spec.src))sheets.set(spec.src,(async()=>{
    const image=await loadArtwork(spec.src);const width=image.naturalWidth,height=image.naturalHeight;
    if(spec.opaque)return{image,width,height};
    const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
    const c=canvas.getContext('2d',{willReadFrequently:true});c.drawImage(image,0,0);
    return{image,width,height,data:c.getImageData(0,0,width,height).data};
   })());
   const {image,width,height,data}=await sheets.get(spec.src);
   const region=spec.cell?.map((v,i)=>Math.round(v*(i%2?height:width)));
   const bounds=spec.opaque?(region??[0,0,width,height]):alphaBounds(data,width,height,32,region);
   if(!bounds)throw Error('Image vide');
   this.images.set(id,{image,bounds});onLoad(id);return true;
  }catch(error){console.warn(`Décor ImageGen indisponible : ${id}`,error.message);return false;}
 }));}
 draw(c,o){
  const art=this.images.get(o.art),spec=ENVIRONMENT_ART[o.art]??RESIDENCE_VARIANTS[o.art];if(!art||!spec)return false;
  c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
  if(spec.repeatX){drawImageStrip(c,art,spec.frame(o));c.restore();return true;}
  if(spec.repeatY){drawVerticalStrip(c,art,spec.frame(o));c.restore();return true;}
  const frame=artworkFrame(art.bounds,spec.frame(o),o.art==='reading'?.5:1);
  if(spec.flipY?.(o)){c.translate(frame[0],frame[1]+frame[3]);c.scale(1,-1);c.drawImage(art.image,...art.bounds,0,0,frame[2],frame[3]);}
  else c.drawImage(art.image,...art.bounds,...frame);
  if(spec.labels)drawOutdoorLabels(c,o,frame);
  c.restore();return true;
 }
 drawGround(c,id,scene,state){
  if(scene.outdoor)return drawOutdoorGround(c,scene,this.images,this.terrainPatterns);
  if(id==='dorm')return drawResidenceGround(c,scene,this.images,this.terrainPatterns,state?.activeRoomId);
  const art=this.images.get(`ground:${id}`),spec=GROUND_ART[id];if(!art||!spec)return false;
  const {image}=art,[l,t,r,b]=scene.bounds,[sl,st,sr,sb]=spec.floor;
  const sx=[0,Math.round(sl*image.naturalWidth),Math.round(sr*image.naturalWidth),image.naturalWidth],sy=[0,Math.round(st*image.naturalHeight),Math.round(sb*image.naturalHeight),image.naturalHeight],dx=[0,l,r,scene.w],dy=[0,t,b,scene.h];
  if(spec.centerX){sx.splice(2,0,Math.round(spec.centerX*image.naturalWidth));dx.splice(2,0,scene.spawn.x);}
  c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
  for(let y=0;y<3;y++)for(let x=0;x<sx.length-1;x++)c.drawImage(image,sx[x],sy[y],sx[x+1]-sx[x],sy[y+1]-sy[y],dx[x],dy[y],dx[x+1]-dx[x],dy[y+1]-dy[y]);
  c.restore();return true;
 }
}
