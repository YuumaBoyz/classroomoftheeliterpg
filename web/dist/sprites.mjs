import {loadArtwork} from './artwork.mjs';
// Animation timing is driven by distance travelled, so feet stop when collisions stop movement.
export const DIRECTIONS=['down','left','right','up'];
export const ACTOR_IDS=['player','reina','nao','mika','daichi','sora','yui','ren','hayase'];
export const FRAME_COUNT=4;
export const STRIDE=18;
export class Animator{
 constructor(seed=0){this.time=seed;this.distance=0;this.direction='down';this.state='idle';this.action=null;this.actionLeft=0;}
 trigger(type,duration=.8){this.action=type;this.actionLeft=duration;}
 update(dt,{distance=0,direction=this.direction,running=false,talking=false,reduced=false}={}){
  this.time+=dt;this.direction=DIRECTIONS.includes(direction)?direction:this.direction;
  if(this.actionLeft>0)this.actionLeft=Math.max(0,this.actionLeft-dt);
  if(this.actionLeft===0)this.action=null;
  if(distance>0){this.distance+=distance;this.state=running?'run':'walk';}else this.state=this.action?'action':talking?'talk':'idle';
  this.reduced=reduced;
 }
 pose(){const moving=this.state==='walk'||this.state==='run';const phase=moving?Math.floor(this.distance/STRIDE)%4:1;
  const gait=(this.distance/STRIDE)*Math.PI/2;
  const breathe=this.reduced?0:Math.sin(this.time*2.4)*.35;
  const bob=moving&&!this.reduced?-Math.abs(Math.sin(gait))*(this.state==='run'?1.15:.6):breathe;
  const progress=this.actionLeft>0?Math.min(1,this.actionLeft/.8):0;
  return {state:this.state,direction:this.direction,frame:DIRECTIONS.indexOf(this.direction)*FRAME_COUNT+phase,phase,bob,
   lean:this.state==='run'&&!this.reduced?(this.direction==='left'?-.055:this.direction==='right'?.055:0):0,
   scaleX:this.action==='success'&&!this.reduced?1+Math.sin(progress*Math.PI*3)*.025:1,
   scaleY:this.action==='success'&&!this.reduced?1-Math.sin(progress*Math.PI*3)*.025:1};
 }
}
export function alphaFrames(data,width,height,{columns=4,rows=4,threshold=110}={}){
 const frames=[];
 for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
  const left=Math.floor(col*width/columns),right=Math.floor((col+1)*width/columns),top=Math.floor(row*height/rows),bottom=Math.floor((row+1)*height/rows);
  let minX=right,minY=bottom,maxX=left-1,maxY=top-1,pixels=0;
  for(let y=top;y<bottom;y++)for(let x=left;x<right;x++)if(data[(y*width+x)*4+3]>threshold){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);pixels++;}
  frames.push(pixels?{x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1,pixels}:null);
 }
 return frames;
}
const median=values=>[...values].sort((a,b)=>a-b)[Math.floor(values.length/2)];
export class SpriteLibrary{
 constructor(){this.display={width:64,height:64,anchor:[32,59]};this.sheets=new Map();this.failed=[];this.ready=this.loadAll();}
 async loadAll(){try{const response=await fetch('assets/sprites/manifest.json');if(!response.ok)throw Error('Manifest indisponible');const manifest=await response.json();this.assetVersion=manifest.version;this.display={width:manifest.displayWidth??64,height:manifest.displayHeight??64,anchor:manifest.displayAnchor??[32,59]};const loaded=[];for(const id of ACTOR_IDS)loaded.push(await this.load(id,manifest.characters[id]));return loaded;}catch(error){console.warn(error.message);return[];}}
 async load(id,entry){try{
  const image=path=>loadArtwork('assets/sprites/'+path+'?v='+this.assetVersion);
  // Four simultaneous requests keep mobile/local servers from dropping sprite loads.
  const frames=[];
  for(const dir of DIRECTIONS)frames.push(...await Promise.all(entry.walk[dir].map(image)));
  const idle=await Promise.all(DIRECTIONS.map(dir=>image(entry.idle[dir])));
  this.sheets.set(id,{frames,idle});return true;
 }catch(error){this.failed.push(id);console.warn(`Sprites indisponibles : ${id}`,error.message);return false;}}
 draw(c,id,x,y,pose,{player=false,focused=false,reduced=false,lighting=1}={}){
  const sheet=this.sheets.get(id);if(!sheet)return false;
  c.save();c.translate(x,y);
  // Feet always remain anchored to the ground; breathing moves only the visual body.
  // Contact and projected shadows are drawn before actors by SceneLighting.
  if(player||focused){c.strokeStyle=focused?'#ecd3a292':'#c4cdb440';c.lineWidth=.8;c.beginPath();c.ellipse(0,1,13,5,0,0,Math.PI*2);c.stroke();}
  c.translate(0,pose.bob);c.rotate(pose.lean);c.scale(pose.scaleX,pose.scaleY);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
  if(lighting<1)c.filter=`brightness(${lighting}) saturate(.94)`;
  const image=(pose.state==='walk'||pose.state==='run')?sheet.frames[pose.frame]:sheet.idle[DIRECTIONS.indexOf(pose.direction)];c.drawImage(image,-this.display.anchor[0],-this.display.anchor[1],this.display.width,this.display.height);c.filter='none';
  if(player){const bob=reduced?0:Math.sin(pose.bob+performance.now()*.003)*.6;c.strokeStyle='#f5dda7';c.lineWidth=1.3;c.beginPath();c.moveTo(-3,-49+bob);c.lineTo(0,-46+bob);c.lineTo(3,-49+bob);c.stroke();}
  c.restore();return true;
 }
}
