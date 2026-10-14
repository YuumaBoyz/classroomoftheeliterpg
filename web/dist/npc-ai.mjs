// IA des personnages (bible §21) : emploi du temps, choix motivés, humeur et mémoire.
// Tout est calculé à partir de l'état de la partie : même résultat après un rechargement,
// et le même calcul pourra tourner sur l'hôte d'une session multijoueur.
import {PEOPLE, LOCATIONS, DAYS, REQUESTS} from './engine.mjs?v=residence-doors-13';
import {canStand, safePosition} from './maps.mjs?v=residence-doors-13';

export const ACTIVITIES = {
 study:{scene:'library', label:'Révise', verb:'réviser', mode:'still'},
 tutor:{scene:'classroom', label:'Aide un binôme', verb:'aider un binôme', mode:'still'},
 class:{scene:'classroom', label:'Prépare la salle', verb:'préparer la salle', mode:'wander'},
 train:{scene:'gym', label:'S’entraîne', verb:'m’entraîner', mode:'train'},
 chat:{scene:'courtyard', label:'Discute', verb:'retrouver du monde', mode:'social'},
 break:{scene:'cafe', label:'Fait une pause', verb:'faire une pause au café', mode:'social'},
 observe:{scene:'courtyard', label:'Observe', verb:'observer la cour', mode:'wander'},
 stroll:{scene:'campus', label:'Se promène', verb:'faire un tour', mode:'wander'},
 teach:{scene:'classroom', label:'Reçoit les élèves', verb:'recevoir les élèves', mode:'still'},
 wait:{scene:'classroom', label:'Attend la restitution', verb:'attendre la restitution', mode:'still'},
 away:{scene:null, label:'Au dortoir', verb:'rentrer', mode:'away'}
};
// Préférences de chaque personnage. studious : sensibilité à l'examen ; social : envie d'aller vers les autres.
export const PROFILE = {
 reina:{pref:{study:.9, tutor:.45, break:.25, chat:.15, stroll:.1}, studious:1, social:.4, chat:'cafe', nightOwl:true},
 nao:{pref:{chat:.85, observe:.5, stroll:.55, break:.45, study:.25}, studious:.5, social:1, chat:'courtyard'},
 mika:{pref:{chat:.7, break:.8, tutor:.5, study:.3}, studious:.6, social:1, chat:'cafe'},
 daichi:{pref:{train:.95, chat:.4, break:.35, study:.12}, studious:.35, social:.75, chat:'cafe'},
 sora:{pref:{study:.7, tutor:.75, class:.6, stroll:.1}, studious:1, social:.3, chat:'courtyard'},
 yui:{pref:{observe:.9, stroll:.5, chat:.25, study:.3}, studious:.6, social:.4, chat:'courtyard'},
 ren:{pref:{study:.6, observe:.55, stroll:.45, chat:.35}, studious:.8, social:.7, chat:'courtyard'},
 hayase:{pref:{teach:1}, studious:0, social:.5, teacher:true}
};
// Places possibles par lieu (vérifiées par les tests : toutes praticables).
const SPOTS = {
 library:[[624,376],[368,512],[700,470],[520,470],[760,380],[440,380]],
 classroom:[[620,355],[500,420],[700,440],[420,520],[760,540],[560,520]],
 gym:[[928,544],[700,560],[560,480],[860,420],[760,640]],
 cafe:[[640,432],[520,520],[760,520],[880,400],[440,420]],
 courtyard:[[784,448],[400,448],[600,500],[700,360],[500,380],[880,560]],
 campus:[[736,520],[944,700],[600,560],[1100,600],[880,500]]
};
const TEACHER_SPOT = [600,224];

// ---------- Outils ----------
export const slotOf = s => 3 - Math.max(0, Math.min(3, s.actions));            // 0 = 15:30 … 3 = 19:30
export const SLOT_TIMES = ['15:30','16:45','18:00','19:30'];
const hash = str => { let h = 2166136261; for(const ch of str){ h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return ((h >>> 0) % 1000) / 1000; };
const examPressure = (s, day = s.day) => s.exam || day >= 5 ? 0 : [0.1, 0.25, 0.45, 0.7][day-1] ?? 0;
const weekend = (s, day = s.day) => day >= 6 || s.ended;
export const AT = {library:'à la bibliothèque', classroom:'en salle D', gym:'au gymnase', cafe:'au café Sakura', courtyard:'dans la cour centrale', campus:'sur le campus', dorm:'au dortoir'};
// Mémorise le jour où un fait sans date a été remarqué pour la première fois.
function firstSeen(s, key){ s.ai ??= {met:[]}; s.ai.seen ??= {}; return s.ai.seen[key] ??= s.day; }
const inDays = n => n <= 0 ? 'aujourd’hui' : n === 1 ? 'demain' : `dans ${n} jours`;

// ---------- Choix de l'activité ----------
// Emploi du temps d'une journée : quatre créneaux choisis l'un après l'autre (lassitude, besoin de voir du monde, fatigue).
export function daySchedule(s, id, day = s.day){
 const key = `${id}|${day}|${signature(s)}`;
 if(CACHE.has(key)) return CACHE.get(key);
 const out = [];
 let last = null, streak = 0, social = false;
 for(let slot = 0; slot < 4; slot++){
  const d = choose(s, id, day, slot, last, streak, social);
  out.push(d);
  streak = d.activity === last ? streak + 1 : 1; last = d.activity;
  if(ACTIVITIES[d.activity].mode === 'social') social = true;
 }
 if(CACHE.size > 400) CACHE.clear();
 CACHE.set(key, out);
 return out;
}
const CACHE = new Map();
// Les faits qui peuvent changer un choix ; le cache se renouvelle dès que l'un d'eux bouge.
// (la confiance et les demandes n'y figurent pas : elles changent l'humeur, pas l'emploi du temps, pour qu'un personnage ne disparaisse pas au milieu d'une discussion)
const signature = s => [s.exam ? 1 : 0, s.ended ? 1 : 0, s.partner ?? '', (s.rp?.pacts ?? []).filter(p => p.status === 'rompu').map(p => p.with + p.resolvedDay).join(',')].join('|');
export const decide = (s, id, day = s.day, slot = slotOf(s)) => PROFILE[id] ? daySchedule(s, id, day)[slot] : {activity:'away', scene:null, factor:'routine', reason:''};

function choose(s, id, day, slot, last, streak, hadSocial){
 const prof = PROFILE[id];
 const press = examPressure(s, day), toExam = 5 - day;
 const forced = anchor(s, id, day, slot);
 if(forced) return forced;
 const scores = {};
 const stress = npcStress(s, id, day);
 for(const [act, base] of Object.entries(prof.pref)){
  let v = base, factor = 'routine';
  if((act === 'study' || act === 'tutor') && press){ v += press * prof.studious * (act === 'study' ? 1 : .8); if(press >= .45) factor = 'exam'; }
  if(weekend(s, day) && ['study','tutor','class'].includes(act)) v *= .3;
  if(s.partner === id && day < 5 && !s.exam && act === 'study'){ v += .3; factor = 'partner'; }
  if(stress > 55 && ['break','chat','train','stroll'].includes(act)){ v += .25; factor = 'stress'; }
  if(!hadSocial && prof.social >= .6 && ['chat','break'].includes(act) && slot >= 1){ v += .2 * prof.social; if(factor === 'routine') factor = 'social'; }
  if(act === last) v += streak >= 2 ? (press >= .45 && prof.studious >= .9 ? -.08 : -.32) : .12;
  v += hash(`${id}:${day}:${slot}:${act}`) * .3;
  scores[act] = {v, factor};
 }
 const tired = slot === 3 ? (prof.nightOwl && press >= .45 ? .2 : .95) : slot === 2 ? .1 : 0;
 if(tired) scores.away = {v:tired + hash(`${id}:${day}:${slot}:away`) * .35 + (weekend(s, day) ? .15 : 0), factor:'tired'};
 const [activity, {factor}] = Object.entries(scores).sort((a, b) => b[1].v - a[1].v)[0];
 return {activity, scene:sceneOf(id, activity), factor, reason:reasonText(factor, toExam)};
}
function anchor(s, id, day, slot){
 const a = (activity, factor = 'routine', reason = '') => ({activity, scene:sceneOf(id, activity), factor, reason});
 if(id === 'hayase'){
  if(day === 5 && !s.exam) return a('teach', 'duty', 'La restitution a lieu aujourd’hui.');
  return day <= 5 && slot < 3 ? a('teach', 'duty') : a('away', 'tired');
 }
 if(day === 1 && id === 'reina' && !s.partner) return a('study', 'routine');                                   // Premier rendez-vous du tutoriel
 if(day === 5 && !s.exam) return id === 'ren' ? a('study', 'exam', 'La classe A passe aussi son examen.') : a('wait', 'exam', 'La restitution a lieu aujourd’hui.');
 if(day === 4 && id === 'daichi' && (slot === 1 || slot === 2)) return a('train', 'coach', 'L’entraîneur m’a réservé ce créneau.');
 if((day === 2 || day === 3) && id === 'yui' && slot <= 1) return a('observe', 'routine');
 return null;
}
const sceneOf = (id, activity) => activity === 'chat' ? PROFILE[id].chat ?? 'courtyard' : ACTIVITIES[activity].scene;
function reasonText(factor, toExam){
 return factor === 'exam' ? `L’examen est ${inDays(toExam)}.` : factor === 'partner' ? 'On s’était promis de préparer ensemble.' : factor === 'stress' ? 'J’avais besoin de souffler.' : factor === 'tired' ? 'La journée a été longue.' : factor === 'social' ? 'J’avais envie de voir du monde.' : '';
}

// Stress estimé : l'approche de l'examen, puis les événements récents.
export function npcStress(s, id, day = s.day){
 const prof = PROFILE[id]; if(!prof || prof.teacher) return 20;
 let v = 22 + examPressure(s, day) * 55 * (0.5 + prof.studious / 2);
 if(memoryOf(s, id).some(m => m.kind === 'betrayed' && day - m.day <= 2)) v += 15;
 if(s.exam) v = s.partner === id && s.exam.score < 70 ? 45 : 18;
 return Math.round(Math.min(95, v));
}

// ---------- Plan courant, présence et places ----------
export function planFor(s, id){
 const d = decide(s, id);
 return {...d, ...ACTIVITIES[d.activity], activity:d.activity, scene:d.scene, label:ACTIVITIES[d.activity].label};
}
export const npcScene = (s, id) => PEOPLE[id] ? decide(s, id).scene : null;
export function presentIn(s, scene){
 const ids = Object.keys(PEOPLE).filter(id => npcScene(s, id) === scene).sort();
 const used = [], out = {};
 for(const id of ids){
  const home = PEOPLE[id].scene === scene ? [[PEOPLE[id].x, PEOPLE[id].y]] : [];
  const pool = id === 'hayase' ? [TEACHER_SPOT, ...SPOTS[scene] ?? []] : [...home, ...SPOTS[scene] ?? []];
  const start = Math.floor(hash(id + scene) * pool.length);
  let spot = null;
  // Les élèves qui discutent se regroupent : place à côté d'un camarade déjà installé dans la même activité sociale.
  if(ACTIVITIES[decide(s, id).activity].mode === 'social'){
   const mate = Object.entries(out).find(([o]) => ACTIVITIES[decide(s, o).activity].mode === 'social');
   if(mate) for(const [dx, dy] of [[52,0],[-52,0],[26,40],[-26,40],[26,-40]]){ const c = [mate[1].x+dx, mate[1].y+dy]; if(canStand(scene, c[0], c[1]) && !used.some(u => Math.hypot(u[0]-c[0], u[1]-c[1]) < 40)){ spot = c; break; } }
  }
  for(let k = 0; k < pool.length && !spot; k++){ const p = pool[(k === 0 && home.length) ? 0 : (start + k) % pool.length]; if(!used.some(u => Math.hypot(u[0]-p[0], u[1]-p[1]) < 48)) spot = p; }
  spot ??= pool[0] ?? [0, 0];
  used.push(spot);
  const pos = canStand(scene, spot[0], spot[1]) ? {x:spot[0], y:spot[1]} : safePosition(scene, {x:spot[0], y:spot[1]});
  out[id] = pos;
 }
 return out;
}

// ---------- Mémoire et humeur ----------
// La mémoire se lit dans les faits déjà enregistrés par la partie : pactes, contrat, demandes, cadeaux, virements, examen.
export function memoryOf(s, id){
 const m = [];
 for(const p of s.rp?.pacts ?? []) if(p.with === id){
  if(p.status === 'rompu') m.push({kind:'betrayed', day:p.resolvedDay ?? s.day, text:`Pacte rompu : « ${p.title} »`});
  if(p.status === 'tenu') m.push({kind:'kept', day:p.resolvedDay ?? s.day, text:`Pacte tenu : « ${p.title} »`});
 }
 if(s.partner === id && s.contract?.status === 'expired') m.push({kind:'betrayed', day:5, text:'Promesse de révision non tenue'});
 if(s.partner === id && s.contract?.status === 'fulfilled') m.push({kind:'kept', day:firstSeen(s, 'contract'), text:'Promesse de révision tenue'});
 for(const q of s.requests ?? []) if(REQUESTS[q.id]?.giver === id && q.status === 'done') m.push({kind:'helped', day:firstSeen(s, 'req:'+q.id), text:`Demande accomplie : ${REQUESTS[q.id].title}`});
 if((s.gifted ?? []).includes(id)) m.push({kind:'gift', day:firstSeen(s, 'gift:'+id), text:'Un dorayaki partagé'});
 if(s.rp?.transfers?.day === s.day && s.rp.transfers.gifted?.includes(id)) m.push({kind:'gift', day:s.day, text:'Un virement reçu aujourd’hui'});
 if(s.partner === id) m.push({kind:'partner', day:s.day, text:'Binôme pour l’examen'});
 return m;
}
export const MOODS = {
 froid:{label:'Méfiance', tone:'cold'}, reconnaissant:{label:'Gratitude', tone:'warm'}, tendu:{label:'Tension', tone:'tense'},
 fatigue:{label:'Fatigue', tone:'tired'}, chaleureux:{label:'Chaleur', tone:'warm'}, ouvert:{label:'Ouverture', tone:'neutral'}, reserve:{label:'Réserve', tone:'neutral'}
};
export function moodOf(s, id){
 const mem = memoryOf(s, id), trust = s.relationships?.[id]?.trust ?? 25, slot = slotOf(s);
 let key;
 if(mem.some(m => m.kind === 'betrayed' && s.day - m.day <= 2)) key = 'froid';
 else if(mem.some(m => ['kept','helped','gift'].includes(m.kind) && s.day - m.day <= 1)) key = 'reconnaissant';
 else if(npcStress(s, id) >= 55) key = 'tendu';
 else if(PROFILE[id]?.teacher) key = 'ouvert';
 else if(slot === 3) key = 'fatigue';
 else key = trust >= 55 ? 'chaleureux' : trust >= 35 ? 'ouvert' : 'reserve';
 return {key, ...MOODS[key]};
}
export function npcStatus(s, id){
 const plan = planFor(s, id), mood = moodOf(s, id);
 return `${plan.label} · ${mood.label.toLowerCase()}`;
}

// ---------- Comportement dans le monde ----------
export function behaviorOf(s, id){
 const plan = planFor(s, id), mood = moodOf(s, id), prof = PROFILE[id];
 const talked = (s.dailyTalks ?? []).includes(id);
 const offer = (s.requests ?? []).some(q => q.status === 'offered' && REQUESTS[q.id]?.giver === id && (REQUESTS[q.id].until ?? 7) >= s.day);
 const avoid = mood.key === 'froid';
 const wantsTalk = !avoid && !talked && plan.mode !== 'away' && (offer || mood.key === 'reconnaissant' || (mood.key === 'chaleureux' && prof.social >= .7 && plan.mode !== 'still'));
 const range = {still:5, social:12, wander:44, train:80}[plan.mode] ?? 10;
 const speed = plan.mode === 'train' ? 58 : plan.mode === 'wander' ? 22 : 18;
 return {mode:plan.mode, activity:plan.activity, range, speed, wantsTalk, avoid, offer, mood:mood.key};
}

// ---------- Paroles ----------
const LINES = {
 reina:{study:'Je relis nos fiches. Chaque erreur trouvée maintenant est un point gagné vendredi.', tutor:'J’aide un binôme qui s’est perdu dans ses notes.', break:'Même moi, je m’accorde une pause. Une courte.', chat:'On discute de la répartition des binômes.', wait:'Respire. On a fait ce qu’il fallait.'},
 nao:{chat:'Il se passe toujours quelque chose dans la cour, si on écoute.', observe:'Regarde qui parle à qui. C’est plus instructif qu’un manuel.', stroll:'Je fais le tour du campus. On y croise ceux qu’on ne voit jamais en classe.', break:'Un café, deux rumeurs. L’équilibre parfait.', study:'Je révise, oui. N’en parle à personne, ça ruinerait ma réputation.', wait:'Le moment de vérité. Tout le monde fait semblant d’être calme.'},
 mika:{break:'Viens t’asseoir ! J’ai gardé une place.', chat:'On organise un pique-nique dimanche, tu viens ?', tutor:'J’aide les autres à réviser. Personne ne reste sur le côté.', study:'Je révise… enfin, j’essaie.', wait:'J’ai les mains qui tremblent. C’est normal ?'},
 daichi:{train:'Encore dix tours ! Tu cours avec moi ?', break:'Je recharge les batteries.', chat:'Salut ! On parlait du tournoi.', study:'Les maths, c’est mon match le plus dur.', wait:'C’est comme avant un match. J’aime pas attendre.'},
 sora:{study:'Je termine un chapitre. Sois bref.', tutor:'Je corrige les dossiers des autres. Quelqu’un doit le faire.', class:'J’affiche les horaires au tableau.', wait:'J’ai relu trois fois. Ça devrait aller.'},
 yui:{observe:'La lumière est belle à cette heure-ci. Les gens aussi, quand ils ne savent pas qu’on les regarde.', stroll:'Je cherche un bon cadre pour une photo.', study:'Je révise près de la fenêtre. On voit toute la cour d’ici.', chat:'On parle photo. Tu veux voir ?', wait:'Tout le monde a la même tête. J’aurais dû prendre une photo.'},
 ren:{study:'La classe A révise aussi. Surprenant ?', observe:'J’observe votre classe. Elle change vite.', stroll:'Je prends l’air. Les négociations fatiguent.', chat:'Je parle affaires. Tu veux te joindre à nous ?'},
 hayase:{teach:'Je suis à mon bureau jusqu’à 18 heures. Posez vos questions.'}
};
const MOOD_LINES = {
 froid:{reina:'Tu as signé, puis tu as rompu. Je t’écoute, mais je n’oublie pas.', nao:'On m’a raconté ce qui s’est passé. Moi aussi, je sais tenir des comptes.', mika:'Ça m’a fait de la peine, tu sais. Je préfère qu’on se parle franchement.', daichi:'Tu m’as laissé tomber. Je t’en veux encore un peu.', sora:'Je ne travaille pas avec ceux qui ne tiennent pas parole.', yui:'Je t’ai vu tenir ta promesse… puis la rompre. J’ai retenu les deux.', ren:'Une parole rompue a un prix. Le tien vient d’augmenter.', _:'Je n’ai pas oublié ce qui s’est passé.'},
 reconnaissant:{_:'Merci encore pour ce que tu as fait. Ça compte.'},
 tendu:{_:'Excuse-moi, j’ai la tête ailleurs. Tout le monde ne parle que de vendredi.'},
 fatigue:{_:'La journée a été longue. Je vais bientôt rentrer.'}
};
// Réplique d'accueil : présentation à la première rencontre, puis réplique selon l'activité, l'humeur et les changements de plan.
export function greetingFor(s, id, intro){
 s.ai ??= {met:[]};
 if(!Array.isArray(s.ai.met)) s.ai.met = [];
 if(!s.ai.met.includes(id)){ s.ai.met.push(id); return intro; }
 const plan = planFor(s, id), mood = moodOf(s, id), parts = [];
 const ml = MOOD_LINES[mood.key]; if(ml) parts.push(ml[id] ?? ml._);
 if(mood.key !== 'froid'){
  const slot = slotOf(s), prev = slot > 0 ? decide(s, id, s.day, slot - 1) : null;
  if(prev && prev.activity !== plan.activity && plan.reason && plan.factor !== 'tired') parts.push(`J’avais prévu de ${ACTIVITIES[prev.activity].verb}, mais ${plan.reason.charAt(0).toLowerCase()+plan.reason.slice(1)}`);
  else if(plan.reason && mood.key !== 'fatigue' && plan.factor !== 'tired') parts.push(plan.reason);
  const line = LINES[id]?.[plan.activity]; if(line) parts.push(line);
 }
 return parts.join(' ') || intro;
}
// Réponse de messagerie selon le contexte (null : laisser la voix habituelle répondre).
export function dmContext(s, id, topic){
 const plan = planFor(s, id), mood = moodOf(s, id);
 if(plan.mode === 'away') return id === 'hayase' ? 'Je vous répondrai demain, pendant mes heures de permanence.' : 'Je suis déjà au dortoir. On en reparle demain ?';
 if(mood.key === 'froid' && topic !== 'thanks') return MOOD_LINES.froid[id] ?? MOOD_LINES.froid._;
 if(topic === 'hello' || topic === 'other'){
  const where = AT[plan.scene] ?? 'sur le campus';
  if(plan.mode === 'still' && id !== 'hayase') return `${plan.label} ${where}. Passe me voir si c’est important.`;
  if(plan.mode === 'social' && PROFILE[id].social >= .7) return `Je suis ${where}. Tu nous rejoins ?`;
 }
 return null;
}
// Résumé pour le téléphone et les tests.
export function whereabouts(s, id){
 const plan = planFor(s, id);
 return {scene:plan.scene, place:plan.scene ? LOCATIONS[plan.scene].name : 'Hors du campus', label:plan.label, mood:moodOf(s, id).label, time:SLOT_TIMES[slotOf(s)], day:DAYS[s.day-1]};
}
