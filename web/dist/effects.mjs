const COLORS={step:'#d6c6a5',success:'#e3c78d',knowledge:'#b6d3cc',trust:'#d8a1a8',train:'#b1c49b',portal:'#ddcca3'};
export const MAX_PARTICLES=180;
export class Effects{
 constructor(random=Math.random){this.random=random;this.particles=[];this.rings=[];this.labels=[];this.reduced=false;}
 clear(){this.particles=[];this.rings=[];this.labels=[];}
 emit(type,x,y,{count=14}={}){
  const color=COLORS[type]??COLORS.success;
  if(type!=='step'){this.rings.push({x,y,age:0,life:.65,color,type});if(this.rings.length>14)this.rings.shift();}
  if(this.reduced)return;
  for(let i=0;i<count&&this.particles.length<MAX_PARTICLES;i++){const angle=this.random()*Math.PI*2,speed=type==='step'?6+this.random()*10:10+this.random()*27;
   this.particles.push({type,x,y:y-(type==='step'?0:17),vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-(type==='step'?2:16),age:0,life:type==='step'?.28+this.random()*.16:.65+this.random()*.55,size:type==='step'?1+this.random()*1.5:1.2+this.random()*1.7,color});}
 }
 label(text,x,y,type='success'){this.labels.push({text,x,y,age:0,life:1.75,color:COLORS[type]??COLORS.success});if(this.labels.length>5)this.labels.shift();}
 update(dt){for(const p of this.particles){p.age+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.type==='step'?0:12*dt;}this.particles=this.particles.filter(p=>p.age<p.life);
  for(const r of this.rings)r.age+=dt;this.rings=this.rings.filter(r=>r.age<r.life);
  for(const l of this.labels)l.age+=dt;this.labels=this.labels.filter(l=>l.age<l.life);
 }
 drawGround(c){c.save();for(const r of this.rings){const t=r.age/r.life;c.globalAlpha=(1-t)*.45;c.strokeStyle=r.color;c.lineWidth=1;c.beginPath();c.ellipse(r.x,r.y,12+t*22,4+t*9,0,0,Math.PI*2);c.stroke();}for(const p of this.particles.filter(p=>p.type==='step')){c.globalAlpha=(1-p.age/p.life)*.35;c.fillStyle=p.color;c.fillRect(p.x,p.y,p.size*2,p.size);}c.restore();}
 drawOver(c){c.save();for(const p of this.particles.filter(p=>p.type!=='step')){const t=p.age/p.life;c.globalAlpha=Math.sin(Math.PI*t)*.9;c.fillStyle=p.color;if(p.type==='trust'){c.save();c.translate(p.x,p.y);c.rotate(Math.PI/4);c.fillRect(-p.size,-p.size,p.size*1.4,p.size*1.4);c.restore();}else{c.fillRect(p.x-p.size/2,p.y-p.size/2,p.size,p.size);if(p.size>2){c.globalAlpha*=.35;c.fillRect(p.x-p.size*1.2,p.y-.5,p.size*2.4,1);}}}
  for(const l of this.labels){const t=l.age/l.life;c.globalAlpha=Math.min(1,t*8,(1-t)*5);c.font='600 9px sans-serif';c.textAlign='center';c.shadowColor='#10232c';c.shadowBlur=4;c.fillStyle=l.color;c.fillText(l.text,l.x,l.y-57-(this.reduced?0:t*13));}c.restore();}
}
