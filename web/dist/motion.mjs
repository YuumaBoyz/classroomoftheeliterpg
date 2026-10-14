import {PEOPLE} from './engine.mjs?v=residence-doors-13';
import {canStand,safePosition,pathTo} from './maps.mjs?v=residence-doors-13';
import {extendWorldAgents} from './npc-agents.mjs?v=residence-doors-13';
import {Animator,SpriteLibrary} from './sprites.mjs?v=light-3';
import {Effects} from './effects.mjs';
export function initMotion(world){
 world.sprites=new SpriteLibrary();world.animators=new Map();world.actors=new Map();world.fx=new Effects();world.stepDistance=0;world.speaker=null;world.effectMode='full';
 try{world.effectMode=localStorage.getItem('anhs-effects')??'full';}catch{}
 world.motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
}
export function extendWorldMotion(World){Object.assign(World.prototype,{
 setEffects(mode){this.effectMode=mode==='soft'?'soft':'full';try{localStorage.setItem('anhs-effects',this.effectMode);}catch{}this.fx.clear();},
 feedback(type,text='',id=null){const who=id?this.actors.get(id):null,p=who??this.getState().position;this.fx.emit(type,p.x,p.y);if(text)this.fx.label(text,p.x,p.y,type);this.animator(id??'player').trigger(type==='trust'?'talk':'success');},
 animator(id){if(!this.animators.has(id))this.animators.set(id,new Animator(id.length*.61));return this.animators.get(id);},
 npc(id,p){return this.npcAgent(id);}
});extendWorldAgents(World);}
export function updateMotion(world,dt,previous){const s=world.getState(),distance=Math.hypot(s.position.x-previous.x,s.position.y-previous.y);world.running=world.moving&&world.keys.has('shift');world.fx.reduced=world.motionQuery.matches||world.effectMode==='soft';world.fx.update(dt);world.animator('player').update(dt,{distance,direction:world.dir,running:world.running,reduced:world.fx.reduced});if(distance>0){world.stepDistance+=distance;if(world.stepDistance>=(world.running?19:23)){world.stepDistance=0;world.fx.emit('step',s.position.x,s.position.y,{count:world.running?5:2});world.onFootstep?.({running:world.running,scene:s.scene});}}else world.stepDistance=0;world.updateActors(dt);}
export function drawActor(world,c,id,x,y,options={}){return world.sprites.draw(c,id,x,y,options.pose??world.animator(id).pose(),{lighting:world.lightAt?.(x,y)??1,player:id==='player',focused:world.nearby?.id===id,reduced:world.fx.reduced});}
export function ambientPose(world,id,index){const a=world.animator('ambient-'+index);const moving=world.active&&!world.blocked&&!world.fx.reduced,phase=Math.floor(world.time*3+index)%4;return {...a.pose(),direction:moving?(index%2?'left':'right'):'down',frame:moving?(index%2?4:8)+phase:1,state:moving?'walk':'idle',bob:moving?-Math.abs(Math.sin(world.time*3+index))*.5:0,lean:0,scaleX:1,scaleY:1};}
