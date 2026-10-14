// Agents des personnages dans le monde : vrais trajets, marche animée, pauses, regards, entrées et sorties par les portes.
// npc-ai.mjs décide où va chacun et pourquoi ; ce module décide comment il s'y rend et ce qu'il fait sur place.
import {PEOPLE} from './engine.mjs?v=residence-doors-13';
import {SCENES, canStand, safePosition, pathTo} from './maps.mjs?v=residence-doors-13';
import {npcScene, presentIn, behaviorOf, planFor, decide, slotOf} from './npc-ai.mjs?v=residence-doors-13';

export const SPEED = {walk:68, stroll:54, approach:82, run:116, leave:74};
const face = (dx, dy) => Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const rand = (a, b) => a + Math.random() * (b - a);
const pick = list => list[Math.floor(Math.random() * list.length)];
// Orientation au repos selon l'activité : on révise face à la table, on enseigne face à la classe.
const REST_DIR = {study:'up', tutor:'up', wait:'up', teach:'down', class:'up'};

// Simplifie un chemin de la grille : garde seulement les virages.
function simplify(points){
 if(points.length < 3) return points;
 const out = [points[0]];
 for(let i = 1; i < points.length - 1; i++){
  const a = out[out.length - 1], b = points[i], c = points[i + 1];
  if(Math.sign(b.x - a.x) !== Math.sign(c.x - b.x) || Math.sign(b.y - a.y) !== Math.sign(c.y - b.y)) out.push(b);
 }
 out.push(points[points.length - 1]);
 return out;
}
function portalPoint(scene, id){
 const p = SCENES[scene]?.portals.find(q => q.id === id);
 return p ? safePosition(scene, {x:p.x, y:p.y - 18}) : null;
}

export function extendWorldAgents(World){Object.assign(World.prototype, {
 // Met en accord les agents présents avec les emplois du temps ; les changements se font en marchant.
 syncAgents(){
  const s = this.getState(), scene = s.scene;
  const key = `${scene}|${s.day}|${s.actions}|${Object.keys(PEOPLE).map(id => npcScene(s, id) ?? '-').join(',')}`;
  if(this.agentKey === key) return;
  const fresh = this.agentScene !== scene || !this.agentKey;
  this.agentKey = key; this.agentScene = scene;
  const spots = presentIn(s, scene);
  for(const [id, a] of this.actors){
   if(a.ambient) continue;
   if(!spots[id] && a.state !== 'leave'){ if(fresh) this.actors.delete(id); else this.leave(a); }
  }
  for(const [id, pos] of Object.entries(spots)){
   let a = this.actors.get(id);
   if(!a){
    const start = fresh ? pos : this.entryPoint(scene, id) ?? pos;
    a = this.makeAgent(id, id, start, pos);
    if(!fresh){ a.alpha = 0; a.fade = 1; this.goTo(a, pos, SPEED.walk); }
    this.actors.set(id, a);
   } else {
    a.home = pos; a.state = 'live'; a.fade = a.alpha < 1 ? 1 : 0;
    if(dist(a, pos) > 10) this.goTo(a, pos, SPEED.walk);
   }
  }
  // Élèves de fond : de vrais passants, avec l'apparence d'élèves absents de ce lieu.
  const pool = Object.keys(PEOPLE).filter(id => id !== 'hayase' && !spots[id]);
  (SCENES[scene].extras ?? []).forEach(([x, y], j) => {
   const id = 'ambient-' + j, sprite = pool[j % Math.max(1, pool.length)] ?? 'reina';
   const ok = canStand(scene, x, y, this.getState().residence) && !Object.values(spots).some(p => Math.hypot(p.x - x, p.y - y) < 40);
   let a = this.actors.get(id);
   if(!ok){ if(a) this.actors.delete(id); return; }
   if(!a){ a = this.makeAgent(id, sprite, {x, y}, {x, y}); a.ambient = true; a.wait = rand(.5, 4); this.actors.set(id, a); }
   else a.sprite = sprite;
  });
 },
 makeAgent(id, sprite, at, home){
  return {id, sprite, x:at.x, y:at.y, home:{...home}, dir:'down', path:[], speed:SPEED.walk, state:'live', wait:rand(.4, 2.5), alpha:1, fade:0, look:null, lookLeft:0, talking:false, chatLeft:rand(1, 3), trip:false, lap:0, repath:0, emote:null, yieldLeft:0, ambient:false};
 },
 entryPoint(scene, id){
  const s = this.getState();
  if(scene !== 'campus') return portalPoint(scene, 'campus');
  const slot = slotOf(s), prev = slot > 0 ? decide(s, id, s.day, slot - 1).scene : null;
  return portalPoint('campus', prev && prev !== 'campus' ? prev : 'dorm') ?? SCENES.campus.spawn;
 },
 exitPoint(scene, id){
  if(scene !== 'campus') return portalPoint(scene, 'campus');
  const next = npcScene(this.getState(), id);
  return portalPoint('campus', next && next !== 'campus' ? next : 'dorm');
 },
 leave(a){ a.state = 'leave'; a.talking = false; const door = this.exitPoint(this.getState().scene, a.id); if(!door || !this.goTo(a, door, SPEED.leave)) a.fade = -1; },
 goTo(a, target, speed = SPEED.walk){
  const scene = this.getState().scene;
  const path = pathTo(scene, {x:a.x, y:a.y}, target, this.getState().residence);
  if(!path || !path.length){ a.path = []; a.wait = 1; return false; }
  a.path = [...path.slice(1), ...(canStand(scene, target.x, target.y, this.getState().residence) ? [{x:target.x, y:target.y}] : [])];
  a.speed = speed; a.wait = 0; return true;
 },
 // Une marche d'agent : suit son chemin, cède le passage, et renvoie la distance parcourue.
 stepAgent(a, dt){
  if(!a.path.length) return 0;
  if(a.yieldLeft > 0){ a.yieldLeft -= dt; return 0; }
  const t = a.path[0], dx = t.x - a.x, dy = t.y - a.y, len = Math.hypot(dx, dy);
  if(len < 1.5){ a.path.shift(); return 0; }
  const step = Math.min(len, a.speed * dt), nx = a.x + dx / len * step, ny = a.y + dy / len * step;
  // Laisse passer celui qui est juste devant soi.
  for(const o of this.actors.values()) if(o !== a && o.alpha > .5 && Math.hypot(o.x - nx, o.y - ny) < 16 && Math.hypot(o.x - a.x, o.y - a.y) > Math.hypot(o.x - nx, o.y - ny)){ a.yieldLeft = .35; a.dir = face(dx, dy); return 0; }
  const scene = this.getState().scene;
  if(canStand(scene, nx, ny, this.getState().residence)){ a.x = nx; a.y = ny; }
  else if(canStand(scene, nx, a.y, this.getState().residence)) a.x = nx;
  else if(canStand(scene, a.x, ny, this.getState().residence)) a.y = ny;
  else { a.path.shift(); return 0; }
  a.dir = face(dx, dy);
  return step;
 },
 updateActors(dt){
  this.syncAgents();
  const s = this.getState(), reduced = this.motionQuery.matches || this.effectMode === 'soft', live = this.active && !this.blocked;
  for(const [key, a] of [...this.actors]){
   let moved = 0;
   if(a.fade){ a.alpha = Math.max(0, Math.min(1, a.alpha + a.fade * dt * 2.6)); if(a.alpha >= 1 && a.fade > 0) a.fade = 0; if(a.alpha <= 0 && a.fade < 0){ this.actors.delete(key); continue; } }
   if(a.state === 'leave'){ moved = this.stepAgent(a, dt); if(!a.path.length) a.fade = -1; this.animate(a, dt, moved, reduced); continue; }
   if(live) moved = a.ambient ? this.ambientBrain(a, dt, reduced) : this.brain(a, dt, s, reduced);
   else if(this.speaker === a.id){ a.dir = face(s.position.x - a.x, s.position.y - a.y); }
   this.animate(a, dt, moved, reduced);
  }
 },
 animate(a, dt, moved, reduced){
  if(a.lookLeft > 0){ a.lookLeft -= dt; if(a.lookLeft <= 0) a.look = null; }
  const direction = moved ? a.dir : a.look ?? a.dir;
  this.animator(a.id).update(dt, {distance:moved, direction, running:a.speed >= SPEED.run && moved > 0, talking:this.speaker === a.id || a.talking, reduced});
 },
 // Comportement d'un personnage nommé.
 brain(a, dt, s, reduced){
  const b = behaviorOf(s, a.id), plan = planFor(s, a.id);
  const pdx = s.position.x - a.x, pdy = s.position.y - a.y, dp = Math.hypot(pdx, pdy) || 1;
  a.emote = null;
  if(this.speaker === a.id){ a.path = []; a.dir = face(pdx, pdy); a.look = null; return 0; }
  // Méfiance : se détourne, recule si l'on s'approche trop.
  if(b.avoid && dp < 130){
   a.emote = 'cold';
   if(dp < 70 && !a.path.length && !reduced){ const away = safePosition(s.scene, {x:a.x - pdx / dp * 64, y:a.y - pdy / dp * 64}); this.goTo(a, away, SPEED.walk); a.trip = true; }
   if(!a.path.length){ a.dir = face(-pdx, -pdy); a.look = null; }
   return this.stepAgent(a, dt);
  }
  // Envie de parler : vient vers le joueur, puis l'attend en le regardant.
  if(b.wantsTalk && dp < 340){
   a.emote = 'talk';
   if(dp > 58 && !reduced){
    a.repath -= dt;
    if(a.repath <= 0){ a.repath = .9; const goal = safePosition(s.scene, {x:s.position.x - pdx / dp * 44, y:s.position.y - pdy / dp * 44}); this.goTo(a, goal, SPEED.approach); a.trip = true; }
    return this.stepAgent(a, dt);
   }
   a.path = []; a.dir = face(pdx, pdy); a.look = null; return 0;
  }
  // Le joueur passe tout près : un regard, puis on reprend.
  if(dp < 84 && !a.path.length){ a.look = face(pdx, pdy); a.lookLeft = .6; }
  if(a.path.length){ const m = this.stepAgent(a, dt); if(!a.path.length) this.arrive(a, plan); return m; }
  if(a.trip && dist(a, a.home) > 10 && a.wait <= 0){ a.trip = false; this.goTo(a, a.home, SPEED.walk); return 0; }
  if(b.mode === 'social') this.socialize(a, dt, s);
  a.wait -= dt;
  if(a.wait > 0 || reduced) return 0;
  return this.routine(a, b, plan, s);
 },
 arrive(a, plan){
  a.speed = SPEED.walk;
  const rest = REST_DIR[plan.activity];
  if(!a.trip && rest) a.dir = rest;
  a.wait = plan.mode === 'still' ? rand(5, 11) : plan.mode === 'social' ? rand(3, 6) : plan.mode === 'train' ? (a.lap % 4 === 3 ? rand(3, 5) : .15) : rand(2, 6);
  if(a.trip && plan.mode !== 'train' && plan.mode !== 'wander') a.wait = rand(1.5, 3);
 },
 routine(a, b, plan, s){
  const scene = s.scene, home = a.home;
  if(b.mode === 'still'){
   const r = Math.random();
   if(r < .55){ a.look = pick(['left','right','down']); a.lookLeft = rand(1, 2.2); a.wait = rand(4, 9); }
   else if(r < .8){ a.wait = rand(5, 10); }
   else { // petit trajet : une étagère, la fenêtre, un camarade
    for(let k = 0; k < 8; k++){ const t = {x:home.x + rand(-110, 110), y:home.y + rand(-70, 90)}; if(canStand(scene, t.x, t.y, this.getState().residence) && dist(t, home) > 40){ a.trip = true; this.goTo(a, t, SPEED.stroll); break; } }
    a.wait = rand(1.5, 3);
   }
   return 0;
  }
  if(b.mode === 'social' && a.hasMate){
   if(Math.random() < .25){ for(let k = 0; k < 6; k++){ const t = {x:home.x + rand(-26, 26), y:home.y + rand(-18, 18)}; if(canStand(scene, t.x, t.y, this.getState().residence)){ this.goTo(a, t, SPEED.stroll); break; } } }
   a.wait = rand(3, 7); return 0;
  }
  if(b.mode === 'train'){
   a.lap++;
   const corners = [[120, 0], [120, 80], [-120, 80], [-120, 0]], c = corners[a.lap % 4];
   const t = safePosition(scene, {x:home.x + c[0], y:home.y + c[1]});
   this.goTo(a, t, SPEED.run); a.trip = false; return 0;
  }
  // Flâner : une destination au hasard autour de son coin, puis une pause pour regarder.
  for(let k = 0; k < 10; k++){
   const ang = rand(0, Math.PI * 2), r = rand(50, 190), t = {x:home.x + Math.cos(ang) * r, y:home.y + Math.sin(ang) * r * .7};
   if(canStand(scene, t.x, t.y, this.getState().residence)){ this.goTo(a, t, plan.activity === 'observe' ? SPEED.stroll : SPEED.walk); break; }
  }
  a.wait = rand(2, 5);
  return 0;
 },
 // Discuter : se tourner vers le camarade le plus proche, parler à tour de rôle.
 socialize(a, dt, s){
  let mate = null, best = 120;
  for(const o of this.actors.values()){ if(o === a || o.state === 'leave' || o.alpha < .8) continue; const d = dist(o, a); if(d < best){ best = d; mate = o; } }
  a.hasMate = !!mate;
  if(!mate){ a.talking = false; return; }
  if(!a.path.length && !a.look) a.dir = face(mate.x - a.x, mate.y - a.y);
  a.chatLeft -= dt;
  if(a.chatLeft <= 0){ a.talking = !a.talking && !mate.talking; a.chatLeft = a.talking ? rand(1.8, 3.5) : rand(1, 2.5); }
  a.emote = a.talking ? 'chat' : a.emote;
 },
 // Passants anonymes : marchent entre quelques points, s'arrêtent, regardent autour d'eux.
 ambientBrain(a, dt, reduced){
  if(a.path.length){ const m = this.stepAgent(a, dt); if(!a.path.length){ a.wait = rand(2.5, 7); a.look = null; } return m; }
  a.wait -= dt;
  if(a.wait > 0 || reduced){ if(a.wait > 1 && Math.random() < dt * .25){ a.look = pick(['left','right','down','up']); a.lookLeft = rand(.8, 1.8); } return 0; }
  const scene = this.getState().scene;
  for(let k = 0; k < 10; k++){ const t = {x:a.home.x + rand(-150, 150), y:a.home.y + rand(-90, 90)}; if(canStand(scene, t.x, t.y, this.getState().residence)){ this.goTo(a, t, SPEED.stroll); break; } }
  a.wait = rand(2, 5);
  return 0;
 },
 // Agents visibles pour le dessin (personnages nommés et passants).
 agentsForDraw(){ this.syncAgents(); return [...this.actors.values()].filter(a => a.alpha > .02); },
 npcAgent(id){ this.syncAgents(); const a = this.actors.get(id); return a && !a.ambient && a.state !== 'leave' && a.alpha > .6 ? a : null; }
});}
