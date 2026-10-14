import {SceneLighting,lightProfile,directLightAt} from './lighting.mjs?v=residence-doors-13';
import {PEOPLE} from './engine.mjs?v=residence-doors-13';
import {npcScene,npcStatus} from './npc-ai.mjs?v=residence-doors-13';
import {canvasResolution} from './render-quality.mjs';
import {roomAt,roomById,doorApproach,doorState,visibleResidenceScene,contentVisible} from './residence-system.mjs?v=residence-doors-13';
import {initMotion,extendWorldMotion,updateMotion,drawActor,ambientPose} from './motion.mjs?v=residence-doors-13';
import {SceneShaders,drawSceneLight} from './shaders.mjs?v=light-3';
import {EnvironmentArt} from './environment-art.mjs?v=residence-doors-13';
import {SCENES,canStand,pathTo,safePosition,drawGround,drawObject,drawPlan} from './maps.mjs?v=residence-doors-13';
export {SCENES,canStand,pathTo} from './maps.mjs?v=residence-doors-13';
const TAU=Math.PI*2;
function rect(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function ellipse(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fill();}
function line(c,x1,y1,x2,y2,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();}
function sprite(c,x,y,{hair='#493b34',wine='#993b51',player=false,dir='down',moving=false,time=0,seed=0,avatar=null}={}){
 const bob=moving?Math.sin(time*12+seed)*1.3:Math.sin(time*2+seed)*.3;const step=moving?Math.sin(time*12+seed)*3:0;x=Math.round(x);y=Math.round(y+bob);
 ellipse(c,x+2,y+2,11,4,'#142b3377');

 // Feet, trousers, blazer: coordinates on a consistent pixel grid.
 rect(c,x-7,y-14,6,11+step*.3,'#263648');rect(c,x+2,y-14,6,11-step*.3,'#263648');rect(c,x-8,y-4+step,7,4,'#202a32');rect(c,x+2,y-4-step,7,4,'#202a32');
 rect(c,x-9,y-27,18,15,wine);rect(c,x-10,y-23,4,12,'#723147');rect(c,x+7,y-23,4,12,'#723147');rect(c,x-9,y-12+step*.2,4,4,'#d8ad8b');rect(c,x+7,y-12-step*.2,4,4,'#d8ad8b');
 if(dir!=='up'){rect(c,x-3,y-26,6,12,'#e5dfc5');rect(c,x-1,y-24,2,9,'#2d4652');line(c,x-8,y-26,x-3,y-18,'#c5a16e');line(c,x+8,y-26,x+3,y-18,'#c5a16e');}else rect(c,x-7,y-25,14,11,'#8b3c50');
 rect(c,x-7,y-37,14,11,'#dbb18f');rect(c,x-10,y-41,19,9,hair);rect(c,x-11,y-37,4,11,hair);rect(c,x+7,y-37,4,10,hair);rect(c,x-8,y-43,13,4,hair);rect(c,x-6,y-45,8,3,hair);rect(c,x-9,y-39,7,5,hair);rect(c,x+1,y-39,7,4,hair);
 rect(c,x-5,y-42,6,1,'#ffffff12');if(dir==='up')rect(c,x-8,y-37,16,12,hair);else if(dir==='left'){rect(c,x-8,y-31,2,2,'#352c30');rect(c,x+3,y-35,5,7,hair);}else if(dir==='right'){rect(c,x+5,y-31,2,2,'#352c30');rect(c,x-8,y-35,5,7,hair);}else{rect(c,x-5,y-32,2,2,'#352c30');rect(c,x+3,y-32,2,2,'#352c30');rect(c,x-1,y-28,2,1,'#a57160');}
 if(player){line(c,x-4,y-51,x,y-47,'#f1d596',2);line(c,x,y-47,x+4,y-51,'#f1d596',2);}
}
export class World {
 constructor(canvas,minimap,getState,onInteract,onMove){
  this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});this.mini=minimap;this.mc=minimap.getContext('2d');this.getState=getState;this.onInteract=onInteract;this.onMove=onMove;this.keys=new Set();this.path=[];this.camera={x:832,y:600};this.time=0;this.last=0;this.dir='down';this.active=false;this.blocked=false;this.backgrounds={};this.nearby=null;this.zoom=2;this.pending=null;
  this.lighting=new SceneLighting();this.environment=new EnvironmentArt(()=>{this.sceneryCache=new WeakMap();});initMotion(this);this.resize();this.shaders=new SceneShaders(canvas);new ResizeObserver(()=>this.resize()).observe(canvas);requestAnimationFrame(t=>this.frame(t));
 }
 resize(){this.width=this.canvas.clientWidth;this.height=this.canvas.clientHeight;const size=canvasResolution(this.width,this.height,devicePixelRatio||1);this.canvas.width=size.width;this.canvas.height=size.height;this.ctx.setTransform(size.scaleX,0,0,size.scaleY,0,0);this.dpr=size.dpr;}
 setScene(){this.bedPose=null;this.fx.clear();this.actors.clear();this.agentKey=null;this.agentScene=null;this.stepDistance=0;this.clearInput();this.pending=null;this.nearby=null;const s=this.getState();s.position=safePosition(s.scene,s.position,s.residence);this.camera={...s.position};this.onNearby?.(null);}
 moveKey(k,on){if(on){if(['arrowleft','arrowright','arrowup','arrowdown','q','a','d','z','w','s'].includes(k))this.bedPose=null;this.keys.add(k);}else this.keys.delete(k);}
 clearInput(){this.keys.clear();this.path=[];this.pending=null;}
 goToScreen(x,y){if(!this.active||this.blocked)return;this.bedPose=null;const target={x:(x-this.width/2)/this.zoom+this.camera.x,y:(y-this.height/2)/this.zoom+this.camera.y};const item=this.items().filter(i=>Math.hypot(i.x-target.x,i.y-target.y)<32).sort((a,b)=>Math.hypot(a.x-target.x,a.y-target.y)-Math.hypot(b.x-target.x,b.y-target.y))[0];this.pending=item??null;this.path=pathTo(this.getState().scene,this.getState().position,item??target,this.getState().residence);if(item&&Math.hypot(item.x-this.getState().position.x,item.y-this.getState().position.y)<58){this.path=[];this.pending=null;this.onInteract(item);}}
 items(){const s=this.getState(),room=s.scene==='dorm'?roomAt(s.position):null;return[...SCENES[s.scene].portals.map(p=>({...p,type:'portal'})),...SCENES[s.scene].props.filter(p=>s.scene!=='dorm'||(p.doorId?(!room||room.id===p.doorId):contentVisible(p,room?.id))).map(p=>{
  if(!p.doorId)return{...p,type:'prop'};
  const r=roomById(p.doorId),d=doorState(s.residence,r.id);return{...p,...doorApproach(r,s.position),type:'prop',detail:d.locked?'Fermée à clé · déverrouiller':d.open?'Porte ouverte · fermer':'Porte fermée · ouvrir'};
 }),...Object.entries(PEOPLE).filter(([id])=>npcScene(s,id)===s.scene).map(([id,p])=>{const a=this.npcAgent(id);return a&&(s.scene!=='dorm'||roomAt(a)?.id===room?.id)?{...p,id,x:a.x,y:a.y,type:'npc',detail:npcStatus(s,id),status:npcStatus(s,id)}:null;}).filter(Boolean)];}
 nearest(){if(this.bedPose)return{id:'stand-up',type:'prop',name:'Se lever',detail:'Quitter le lit',...this.getState().position};const p=this.getState().position;return this.items().map(i=>({...i,dist:Math.hypot(i.x-p.x,i.y-p.y)})).filter(i=>i.dist<62).sort((a,b)=>a.dist-b.dist)[0]??null;}
 interact(){if(this.blocked)return;const n=this.nearest();if(n)this.onInteract(n);}
 update(dt){
  const s=this.getState(),sc=SCENES[s.scene];this.time+=dt;let moving=false;const previous={...s.position};
  if(this.active&&!this.blocked){let dx=0,dy=0;for(const k of this.keys){if(['arrowleft','q','a'].includes(k))dx--;if(['arrowright','d'].includes(k))dx++;if(['arrowup','z','w'].includes(k))dy--;if(['arrowdown','s'].includes(k))dy++;}
   if(dx||dy){this.path=[];this.pending=null;}else if(this.path.length){const n=this.path[0],dist=Math.hypot(n.x-s.position.x,n.y-s.position.y);if(dist<4)this.path.shift();else{dx=(n.x-s.position.x)/dist;dy=(n.y-s.position.y)/dist;}}
   if(dx||dy){const mag=Math.hypot(dx,dy),speed=(this.keys.has('shift')?208:132)*dt;dx=dx/mag*speed;dy=dy/mag*speed;const p=s.position;if(canStand(s.scene,p.x+dx,p.y,s.residence)){p.x+=dx;moving=true;}if(canStand(s.scene,p.x,p.y+dy,s.residence)){p.y+=dy;moving=true;}if(!moving)this.path=[];this.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');if(moving)this.onMove();}
   if(this.pending&&Math.hypot(this.pending.x-s.position.x,this.pending.y-s.position.y)<54){const target=this.pending;this.pending=null;this.path=[];this.onInteract(target);}
   const n=this.nearest();if(n?.id!==this.nearby?.id||n?.type!==this.nearby?.type||n?.detail!==this.nearby?.detail){this.nearby=n;this.onNearby?.(n);}
  }
  this.moving=moving;updateMotion(this,dt,previous);this.zoom=this.active?1.5:Math.max(this.width/1100,this.height/720);
  const target=this.active?{x:s.position.x,y:s.position.y-24}:{x:832+Math.sin(this.time*.025)*90,y:520};
  const halfw=this.width/(2*this.zoom),halfh=this.height/(2*this.zoom),tx=sc.w<halfw*2?sc.w/2:Math.max(halfw,Math.min(sc.w-halfw,target.x)),ty=sc.h<halfh*2?sc.h/2:Math.max(halfh,Math.min(sc.h-halfh,target.y)),follow=1-Math.exp(-dt*7);
  this.camera.x+=(tx-this.camera.x)*follow;this.camera.y+=(ty-this.camera.y)*follow;
 }
 ground(id){if(!this.backgrounds[id]){const s=SCENES[id],cv=document.createElement('canvas');cv.width=s.w*2;cv.height=s.h*2;const ctx=cv.getContext('2d');ctx.scale(2,2);drawGround(ctx,id);this.backgrounds[id]=cv;if(Object.keys(this.backgrounds).length>2)delete this.backgrounds[Object.keys(this.backgrounds)[0]];}return this.backgrounds[id];}
 scenery(c,o){const s=this.getState();if(s.scene==='dorm'){
  if(o.doorId&&!doorState(s.residence,o.doorId).open)o={...o,art:'residenceDoorClosed'};
  if(o.wardrobeId&&s.residence.wardrobes[o.wardrobeId].open)o={...o,art:'residenceWardrobeOpen'};
  if(this.bedPose&&o.type==='bed'&&o.roomId==='room-106')o={...o,art:'residenceBedOccupied'};
 }if(this.environment.draw(c,o))return;this.sceneryCache??=new WeakMap();let cached=this.sceneryCache.get(o);if(!cached){const cv=document.createElement('canvas'),x=o.x-72,y=o.y-144;cv.width=(o.w+144)*2;cv.height=(o.h+192)*2;const ctx=cv.getContext('2d');ctx.scale(2,2);ctx.translate(-x,-y);if(!this.environment.draw(ctx,o))drawObject(ctx,o);cached={cv,x,y};this.sceneryCache.set(o,cached);}c.drawImage(cached.cv,cached.x,cached.y,cached.cv.width/2,cached.cv.height/2);}
 draw(){
  const c=this.ctx,s=this.getState(),layout=SCENES[s.scene];
  if(s.scene==='dorm'){const key=roomAt(s.position)?.id??null;if(this.residenceView?.key!==key||!this.residenceView)this.residenceView={key,scene:visibleResidenceScene(layout,s.position)};}
  const sc=s.scene==='dorm'?this.residenceView.scene:layout;c.fillStyle='#1c252c';c.fillRect(0,0,this.width,this.height);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.save();c.translate(this.width/2-this.camera.x*this.zoom,this.height/2-this.camera.y*this.zoom);c.scale(this.zoom,this.zoom);if(!this.environment.drawGround(c,s.scene,sc,{activeRoomId:sc.activeRoomId}))c.drawImage(this.ground(s.scene),0,0,sc.w,sc.h);
  const lighting=lightProfile(sc,s.actions);this.lightAt=(x,y)=>directLightAt(x,y,sc,lighting);this.lighting.windows(c,sc);this.lighting.objects(c,sc,this.environment,lighting);
  this.fx.drawGround(c);const objects=sc.objects.map(o=>({y:o.sortY??o.y+o.h,draw:()=>this.scenery(c,o)})),items=this.items();
  for(const a of this.agentsForDraw()){if(s.scene==='dorm'&&(roomAt(a)?.id??null)!==sc.activeRoomId)continue;const pose=this.animator(a.id).pose(),info=a.ambient?null:PEOPLE[a.id];this.lighting.actor(c,this.sprites,a.sprite,a.x,a.y,pose,lighting);objects.push({y:a.y,draw:()=>{c.save();c.globalAlpha=a.alpha;if(!drawActor(this,c,a.sprite,a.x,a.y,{pose}))sprite(c,a.x,a.y,{hair:info?.hair,time:this.time,seed:a.x,avatar:info?.portrait});c.restore();if(!info||a.state==='leave'||a.alpha<.9)return;const i={...info,id:a.id,x:a.x,y:a.y};const near=this.nearby?.id===i.id;const em=a.emote;if(em&&!near&&!this.blocked){const by=i.y-62+(this.fx.reduced?0:Math.sin(this.time*3+i.x)*1.5),col=em==='talk'?'#f2c86b':em==='cold'?'#9fb3c4':'#f1e9cd';rect(c,i.x-7,by-7,14,11,'#13222dcc');rect(c,i.x-2,by+4,4,3,'#13222dcc');if(em==='talk'){rect(c,i.x-1,by-5,2,5,col);rect(c,i.x-1,by+1,2,2,col);}else if(em==='chat'){for(const k of [-4,0,4])rect(c,i.x+k-1,by-1,2,2,col);}else{rect(c,i.x-4,by-2,8,2,col);}}if(near)this.label(c,i.x,i.y-56,i.short,true);else if(s.partner===i.id){rect(c,i.x-3,i.y-54,6,5,'#f1e9cd');rect(c,i.x-1,i.y-49,2,2,'#f1e9cd');}}});}
  if(this.active&&!this.bedPose){this.lighting.actor(c,this.sprites,'player',s.position.x,s.position.y,this.animator('player').pose(),lighting);objects.push({y:s.position.y,draw:()=>{if(!drawActor(this,c,'player',s.position.x,s.position.y))sprite(c,s.position.x,s.position.y,{player:true,dir:this.dir,moving:this.moving,time:this.time});}});}
  objects.sort((a,b)=>a.y-b.y).forEach(o=>o.draw());this.fx.drawOver(c);
  // Door cues stay on the floor; the interaction HUD carries the text.
  for(const i of items){
   if(i.type==='npc')continue;
   const near=this.nearby?.type===i.type&&this.nearby?.id===i.id,dist=Math.hypot(i.x-s.position.x,i.y-s.position.y);
   if(this.blocked||dist>150)continue;
   if(i.type==='portal'){
    const direction=s.scene==='campus'?-1:1,color=near?'#f1e6c4':'#cbd0ad99';
    line(c,i.x-12,i.y+8,i.x+12,i.y+8,color,2);
    for(const offset of [-5,5]){line(c,i.x-4,i.y+offset-direction*2,i.x,i.y+offset+direction*2,color);line(c,i.x,i.y+offset+direction*2,i.x+4,i.y+offset-direction*2,color);}
   }else if(near){
    const color='#f1e6c4';line(c,i.x-8,i.y-3,i.x-8,i.y+3,color);line(c,i.x-8,i.y+3,i.x-3,i.y+3,color);line(c,i.x+3,i.y+3,i.x+8,i.y+3,color);line(c,i.x+8,i.y+3,i.x+8,i.y-3,color);
   }else{rect(c,i.x-1,i.y-3,2,2,'#e4dbb277');}
  }
  if(this.path.length){const d=this.path.at(-1);c.strokeStyle='#f2e6b3';c.lineWidth=1;c.strokeRect(d.x-5,d.y-3,10,6);}
  if(sc.outdoor&&!this.fx.reduced){for(let i=0;i<18;i++){const x=(i*197+this.time*(5+i%3))%sc.w,y=(i*137+this.time*4)%sc.h;ellipse(c,x,y,2,1,'#edc0ae99');}}
  drawSceneLight(c,sc,this.time,this.fx.reduced);c.restore();this.shaders.render({outdoor:sc.outdoor,time:this.time,soft:this.fx.reduced,warmth:lighting.warmth,exposure:lighting.exposure});this.drawMinimap();
 }
 label(c,x,y,text,active=false){c.font='bold 8px monospace';c.textAlign='center';const w=c.measureText(text).width+12;rect(c,x-w/2,y-9,w,15,active?'#f0ead6':'#263b45');c.fillStyle=active?'#2e3f48':'#efe5ce';c.fillText(text,x,y+1);}
 drawMinimap(){const c=this.mc,s=this.getState(),sc=SCENES[s.scene],w=this.mini.width,h=this.mini.height,{scale,ox,oy}=drawPlan(c,s.scene,w,h,s.scene==='dorm'?roomAt(s.position)?.id??null:undefined);for(const p of sc.portals){rect(c,ox+p.x*scale-2,oy+p.y*scale-2,4,4,'#c9c4a2');}const x=ox+s.position.x*scale,y=oy+s.position.y*scale;rect(c,x-3,y-3,6,6,'#eee8d1');rect(c,x-1,y-1,2,2,'#bc4c60');c.strokeStyle='#e5dec54d';c.lineWidth=1;c.strokeRect(ox+(this.camera.x-this.width/(2*this.zoom))*scale,oy+(this.camera.y-this.height/(2*this.zoom))*scale,this.width/this.zoom*scale,this.height/this.zoom*scale);}
 drawCampusPlan(canvas){const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height;c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';return drawPlan(c,'campus',w,h);}
 frame(t){const dt=Math.min((t-this.last)/1000||0,.04);this.last=t;this.update(dt);this.draw();requestAnimationFrame(n=>this.frame(n));}
}

extendWorldMotion(World);
