// A consistent afternoon sun projects every outdoor shadow toward the southeast.
export function lightProfile(scene,actions=3){
 const late=Math.max(0,Math.min(1,(3-actions)/3));
 return scene.outdoor?{dx:.88+late*.32,dy:.48+late*.16,opacity:.28+late*.06,warmth:late,exposure:1.04-late*.07}
  :{dx:.48,dy:.24,opacity:.18,warmth:.25,exposure:.96};
}
export function shadowOffset(height,profile){return {x:height*profile.dx,y:height*profile.dy};}

export class SceneLighting{
 constructor(){this.masks=new WeakMap();this.props=new WeakMap();}
 mask(image,bounds){
  const [x,y,w,h]=bounds??[0,0,image.naturalWidth,image.naturalHeight];
  const key=`${x},${y},${w},${h}`;let variants=this.masks.get(image);if(!variants)this.masks.set(image,variants=new Map());
  let mask=variants.get(key);if(mask)return mask;
  const scale=Math.min(1,384/Math.max(w,h));
  mask=document.createElement('canvas');mask.width=Math.max(1,Math.ceil(w*scale));mask.height=Math.max(1,Math.ceil(h*scale));
  const c=mask.getContext('2d');c.drawImage(image,x,y,w,h,0,0,mask.width,mask.height);
  c.globalCompositeOperation='source-in';c.fillStyle='#203045';c.fillRect(0,0,mask.width,mask.height);
  variants.set(key,mask);return mask;
 }
 contact(c,x,y,rx,ry,opacity=.26){
  c.save();c.translate(x,y);c.scale(rx,ry);
  const g=c.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,`rgba(13,24,35,${opacity})`);g.addColorStop(.45,`rgba(13,24,35,${opacity*.5})`);g.addColorStop(1,'rgba(13,24,35,0)');
  c.fillStyle=g;c.beginPath();c.arc(0,0,1,0,Math.PI*2);c.fill();c.restore();
 }
 silhouette(c,mask,x,y,w,h,anchorX,anchorY,p){
  // The sprite alpha becomes a ground projection; feet remain exactly at the anchor.
  c.save();c.translate(x,y);c.transform(1,0,-p.dx,-p.dy,0,0);
  c.globalAlpha=p.opacity;c.filter='blur(1.5px)';c.drawImage(mask,-anchorX,-anchorY,w,h);c.restore();
 }
 actor(c,library,id,x,y,pose,p){
  const sheet=library.sheets.get(id);if(!sheet)return;
  const image=['walk','run'].includes(pose.state)?sheet.frames[pose.frame]:sheet.idle[['down','left','right','up'].indexOf(pose.direction)];
  const d=library.display;
  this.silhouette(c,this.mask(image),x,y,d.width,d.height,...d.anchor,p);
  this.contact(c,x,y+1,12,4,.4);
 }
 objects(c,scene,environment,p){
  const key=`${p.dx}:${p.dy}:${p.opacity}:${environment.images.size}`;
  let cached=this.props.get(scene);
  if(!cached||cached.key!==key){
   const canvas=document.createElement('canvas');canvas.width=Math.ceil(scene.w*1.5);canvas.height=Math.ceil(scene.h*1.5);
   const ctx=canvas.getContext('2d');ctx.scale(1.5,1.5);this.paintObjects(ctx,scene,environment,p);
   cached={key,canvas};this.props.set(scene,cached);
  }
  c.drawImage(cached.canvas,0,0,scene.w,scene.h);
 }
 paintObjects(c,scene,environment,p){
  for(const o of scene.objects){
   if(['rug','mat','calendar','board','menu','pond','shoes','satchel','bag','drain','residenceWall','window','doorFrame'].includes(o.type))continue;
   const {x,y,w,h}=o;
   if(o.type==='tree'){
    const art=environment.images.get(o.art);
    if(art)this.silhouette(c,this.mask(art.image,art.bounds),x+12,y+24,112,144,56,144,p);
    else{
     const end=shadowOffset(106,p);c.save();c.filter='blur(3px)';c.globalAlpha=p.opacity;c.fillStyle='#233349';
     c.beginPath();c.ellipse(x+12+end.x,y+24+end.y,43,18,.25,0,Math.PI*2);c.fill();
     c.lineWidth=7;c.strokeStyle='#233349';c.beginPath();c.moveTo(x+12,y+24);c.lineTo(x+12+end.x,y+24+end.y);c.stroke();c.restore();
    }
    this.contact(c,x+12,y+24,15,6,.42);continue;
   }
   const height=o.type==='building'?100:o.type==='lamp'?70:['shelfTall','wardrobe','locker','shelf'].includes(o.type)?40:18;
   const delta=shadowOffset(height,p),base=y+h;
   c.save();c.filter=`blur(${o.type==='building'?3:1.5}px)`;
   const g=c.createLinearGradient(x,base,x+delta.x,base+delta.y+2);
   g.addColorStop(0,`rgba(24,38,55,${p.opacity})`);g.addColorStop(1,`rgba(24,38,55,${p.opacity*.45})`);c.fillStyle=g;
   c.beginPath();c.moveTo(x,base-4);c.lineTo(x+w,base-4);c.lineTo(x+w+delta.x,base+delta.y);c.lineTo(x+delta.x,base+delta.y);c.closePath();c.fill();c.restore();
   this.contact(c,x+w/2,base-1,w*.54,5,.25);
  }
 }
 windows(c,scene){
  if(scene.outdoor)return;
  if(scene.windows){
   for(const {x,y,w,room} of scene.windows){
    c.save();c.beginPath();c.rect(...room);c.clip();c.globalCompositeOperation='screen';
    const g=c.createLinearGradient(x,y,x+72,y+256);g.addColorStop(0,'#ffe9b94d');g.addColorStop(1,'#ffe9b900');c.fillStyle=g;
    for(const offset of [0,w/2+4]){c.beginPath();c.moveTo(x+offset,y);c.lineTo(x+offset+w/2-4,y);c.lineTo(x+offset+w/2+68,y+256);c.lineTo(x+offset+72,y+256);c.closePath();c.fill();}
    c.restore();
   }
   return;
  }
  const [l,t,r,b]=scene.bounds;
  c.save();c.beginPath();c.rect(l,t,r-l,b-t);c.clip();
  c.globalCompositeOperation='screen';
  for(let y=t+80;y<b-56;y+=144){
   // Window panes project a warm patch with mullion shadows, rather than a white overlay.
   const reach=Math.min(360,(r-l)*.4),g=c.createLinearGradient(l,y,l+reach,y+155);
   g.addColorStop(0,'#ffe9b961');g.addColorStop(.45,'#ffe9b933');g.addColorStop(1,'#ffe9b900');
   for(const offset of [0,40]){
    c.fillStyle=g;c.beginPath();c.moveTo(l,y+offset);c.lineTo(l+reach,y+offset+135);c.lineTo(l+reach,y+offset+166);c.lineTo(l,y+offset+31);c.closePath();c.fill();
   }
  }
  c.restore();
 }
}

export function drawLocalLights(c,scene){
 c.save();c.globalCompositeOperation='screen';
 const glow=(x,y,r,color)=>{const g=c.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,color);g.addColorStop(.25,'#ffcf7814');g.addColorStop(1,'#ffcf7800');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);};
 for(const o of scene.objects){
  if(o.reading||o.art==='reading')for(const f of [.24,.76])glow(o.x+o.w*f,o.y+o.h*.32,65,'#ffdd9555');
  if(o.type==='lamp'&&scene.outdoor)glow(o.x+5,o.y-60,32,'#ffdf9a32');
  if(o.type==='counter')glow(o.x+o.w*.4,o.y+o.h*.3,100,'#ffd39a1c');
 }
 c.restore();
}

export function directLightAt(x,y,scene,p){
 if(!scene.outdoor)return 1;
 for(const o of scene.objects){
  if(o.type==='tree'){
   const delta=shadowOffset(106,p),nx=(x-o.x-12-delta.x)/43,ny=(y-o.y-24-delta.y)/20;
   if(nx*nx+ny*ny<1)return .78;
  }
  if(o.type==='building'){
   const delta=shadowOffset(100,p),t=(y-o.y-o.h)/delta.y;
   if(t>=0&&t<=1&&x>=o.x+t*delta.x&&x<=o.x+o.w+t*delta.x)return .76;
  }
 }
 return 1;
}
