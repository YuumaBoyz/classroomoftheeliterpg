// Couche roleplay : fiche de personnage, salons, Mur anonyme, virements et pactes.
// Toutes les actions passent par des commandes { id, author, type, target, params } appliquées par un hôte.
// En solo, l'hôte est local ; en multijoueur, le serveur de session appliquera la même fonction applyCommand
// et diffusera les conséquences (docs/FONDATIONS-PRODUCTION.md §7). Une commande rejouée n'est jamais appliquée deux fois.
import {PEOPLE, DAYS, relation, rep, remember, log, addKnowledge} from './engine.mjs';
import {dmContext} from './npc-ai.mjs';

export const RP_LIMITS = {text:280, bio:400, secret:200, hrp:140, title:60, terms:240, room:150, wall:80, pacts:40, done:300, active:4, transferMin:100, transferMax:20000, dailyTransfer:30000};
export const TRAITS = ['Calme','Ambitieux','Loyal','Curieux','Discret','Charismatique','Impulsif','Stratège','Bienveillant','Secret','Franc','Rêveur'];
export const MOODS = ['Disponible','Concentré','Joyeux','Méfiant','Fatigué','Occupé','Ne pas déranger'];
export const WALL_KINDS = {rumeur:'Rumeur', temoignage:'Témoignage', fait:'Fait observé', hypothese:'Hypothèse'};
export const ROOMS = {
 classe:{name:'Classe 1-D', kind:'rp', about:'Salon de classe. Tous les élèves de la 1-D le lisent.'},
 binome:{name:'Binôme', kind:'rp', about:'Canal privé avec votre partenaire d’examen.'},
 hrp:{name:'Hors-RP', kind:'hrp', about:'Hors personnage : organisation de séance et règles. Rien de ce qui s’écrit ici n’existe pour les personnages.'}
};

const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '').replace(/\s+\n/g, '\n').trim().slice(0, max);
const newId = () => globalThis.crypto?.randomUUID?.() ?? `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
const isDay = v => Number.isInteger(v) && v >= 1 && v <= 7;
const npcOk = id => Object.hasOwn(PEOPLE, id);
export const roomOk = room => Object.hasOwn(ROOMS, room) || (typeof room === 'string' && room.startsWith('dm:') && npcOk(room.slice(3)));

// ---------- Contenu scénarisé des PNJ (déterministe, ajouté jour après jour) ----------
const ROOM_SCRIPT = [
 {id:'c1a', room:'classe', day:1, author:'hayase', text:'Bienvenue en 1-D. Ce salon est celui de la classe : tout ce qui s’y écrit peut être lu par tous. Restez courtois.'},
 {id:'c1b', room:'classe', day:1, author:'mika', text:'Coucou tout le monde ! On monte un groupe de révision cette semaine ?'},
 {id:'c2a', room:'classe', day:2, author:'daichi', text:'Quelqu’un a compris le système de points ? J’ai déjà dépensé la moitié de mes PP.'},
 {id:'c2b', room:'classe', day:2, author:'nao', text:'Pas de panique. Les PP se dépensent seul, les PC se gagnent ensemble.'},
 {id:'c3a', room:'classe', day:3, author:'reina', text:'Les binômes qui n’ont pas commencé à réviser : la bibliothèque ferme à 19 h.'},
 {id:'c4a', room:'classe', day:4, author:'sora', text:'Je peux partager mes fiches. En échange, soyez à l’heure vendredi.'},
 {id:'c5a', room:'classe', day:5, author:'hayase', text:'Restitution aujourd’hui en salle D. Bonne chance à tous.'},
 {id:'c6a', room:'classe', day:6, author:'mika', text:'Peu importe le résultat, on reste une classe. Pique-nique dimanche ?'},
 {id:'c7a', room:'classe', day:7, author:'nao', text:'Une semaine de faite. Lundi, on recommence avec des règles qu’on connaît un peu mieux.'},
 {id:'h1a', room:'hrp', day:1, author:'system', text:'Canal hors personnage : organisation de la séance, questions de règles, pauses. Une information lue ici n’entre pas dans le carnet de votre personnage.'},
 {id:'h1b', room:'hrp', day:1, author:'system', text:'Astuces : « /me » décrit une action (/me range ses fiches), « ((…)) » signale une remarque hors-RP dans un salon RP.'}
];
const WALL_SCRIPT = [
 {id:'w1a', day:1, kind:'rumeur', anon:true, text:'On dit que la classe D a perdu des points avant même le premier cours.', likes:7, knowledge:'Des points perdus avant le premier cours ?'},
 {id:'w1b', day:1, kind:'temoignage', author:'yui', text:'Le café Sakura n’accepte que les points privés. Vérifié ce midi.', likes:4},
 {id:'w2a', day:2, kind:'hypothese', anon:true, text:'Et si les caméras du couloir servaient à noter notre comportement ?', likes:12, knowledge:'Les caméras noteraient le comportement'},
 {id:'w2b', day:2, kind:'rumeur', anon:true, text:'Ren Kanzaki aurait proposé des PP à un élève de D pour connaître ses notes.', likes:9, knowledge:'Ren achèterait des informations'},
 {id:'w3a', day:3, kind:'fait', author:'sora', text:'Mme Hayase reste en salle D après 17 h et répond aux questions sur l’examen.', likes:15},
 {id:'w3b', day:3, kind:'rumeur', anon:true, text:'Un binôme de la D voudrait se séparer avant vendredi. Devinez lequel.', likes:6, knowledge:'Un binôme de la D se fissure'},
 {id:'w4a', day:4, kind:'temoignage', author:'daichi', text:'Entraînement ouvert demain matin au gymnase. Venez, même pour courir dix minutes.', likes:5},
 {id:'w4b', day:4, kind:'hypothese', anon:true, text:'Ceux qui n’ont pas de binôme seront-ils placés d’office ?', likes:8},
 {id:'w5a', day:5, kind:'fait', anon:true, text:'Les résultats sont affichés ce soir. Respirez.', likes:21},
 {id:'w6a', day:6, kind:'rumeur', anon:true, text:'La classe A aurait payé pour connaître les questions. Aucune preuve.', likes:17, knowledge:'La classe A aurait acheté les questions'},
 {id:'w7a', day:7, kind:'hypothese', anon:true, text:'Les points de classe vont bouger le mois prochain. Qui monte, qui descend ?', likes:11}
];

// Voix des PNJ : courtes répliques par sujet. low = confiance faible.
const VOICE = {
 reina:{hello:'Bonjour. Tu as besoin de quelque chose de précis ?', exam:'Vendredi se gagne avant vendredi. Révise, puis aide un binôme fragile.', help:'Je peux t’aider si tu me dis exactement où tu bloques.', money:'Garde tes points. On en aura besoin quand les règles changeront.', thanks:'Ce n’était rien. Tiens ta part, c’est tout ce que je demande.', other:'Noté. Je te réponds quand j’ai vérifié.', low:'On se connaît à peine. Parlons-en en personne.'},
 nao:{hello:'Salut ! Qu’est-ce qui se dit de ton côté ?', exam:'Tout le monde a une théorie sur l’examen. La mienne : écouter avant de parler.', help:'Je connais quelqu’un qui connaît quelqu’un. Dis-moi ce qu’il te faut.', money:'Les points circulent plus vite que les rumeurs. Et c’est peu dire.', thanks:'Je note que je t’en dois une. Ou l’inverse.', other:'Intéressant. Je garde ça pour moi… pour l’instant.', low:'Hmm. Je préfère attendre de mieux te connaître.'},
 mika:{hello:'Coucou ! Ça me fait plaisir que tu écrives.', exam:'On va y arriver si on y va ensemble. Tu viens réviser ?', help:'Bien sûr ! Dis-moi quand et où, j’apporte des gâteaux.', money:'Ne laisse personne te mettre la pression avec les points.', thanks:'Merci à toi ! Tu as rendu ma journée meilleure.', other:'Haha, je vois. On en reparle au café ?', low:'Oh, salut. On ne s’est pas encore vraiment parlé, si ?'},
 daichi:{hello:'Yo ! Tu passes au gymnase ?', exam:'L’examen, c’est comme un match. On s’échauffe avant.', help:'Si c’est porter des cartons, je suis là. Si c’est des maths… on verra.', money:'Ne me parle pas de points, j’ai déjà presque tout dépensé.', thanks:'Pas de souci, on est une équipe.', other:'Ok ok. Je te suis.', low:'Euh, salut. On se connaît ?'},
 sora:{hello:'Bonjour.', exam:'Les questions portent sur ce qui a été dit en cours. Rien de plus, rien de moins.', help:'Je peux expliquer une fois. Prends des notes.', money:'Les points privés ne remplacent pas le travail.', thanks:'De rien.', other:'Je vois.', low:'Je suis occupé.'},
 yui:{hello:'Salut. Tu as remarqué quelque chose aujourd’hui ?', exam:'Regarde qui reste après les cours. Ça en dit long.', help:'Je peux observer pour toi. Discrètement.', money:'Quelqu’un dépense beaucoup en ce moment. Je ne dirai pas qui.', thanks:'Avec plaisir.', other:'Je note.', low:'…'},
 ren:{hello:'Un élève de D qui m’écrit. Voilà qui est nouveau.', exam:'La classe A n’a pas besoin de deviner les questions.', help:'Tout se négocie. Que proposes-tu en échange ?', money:'Enfin un sujet sérieux. Combien, et pour quoi ?', thanks:'Je m’en souviendrai.', other:'Intéressant. Continue.', low:'Je ne réponds pas aux inconnus.'},
 hayase:{hello:'Bonjour. Je vous écoute.', exam:'Les règles sont dans votre agenda. Le reste vous appartient.', help:'Ma porte est ouverte après 17 h, en salle D.', money:'L’usage de vos points vous regarde. Les conséquences aussi.', thanks:'Je vous en prie.', other:'Je prends note.', low:'Je prends note.'}
};
const TOPICS = [
 ['money', /\b(pp|point|points|argent|payer|prête|prêter|dette|virement)\b/i],
 ['exam', /\b(exam|examen|vendredi|dossier|test|note|notes)\b/i],
 ['help', /\b(aide|aider|besoin|réviser|révision|révise|bibli|bibliothèque|fiche|fiches)\b/i],
 ['thanks', /\b(merci|thx|cool|génial|super)\b/i],
 ['hello', /\b(salut|bonjour|coucou|hello|yo|hey|bonsoir)\b/i]
];
const topicOf = text => TOPICS.find(([, re]) => re.test(text))?.[0] ?? 'other';
const CLASS_VOICE = {money:'nao', exam:'reina', help:'mika', thanks:'mika', hello:'daichi', other:null};
const CLASS_ROTATION = ['mika','nao','daichi','yui','reina','sora'];

// ---------- État ----------
export function rpDefaults(){
 return {version:1, playerId:newId(), seq:0, profile:{bio:'', traits:[], mood:'Disponible', secret:'', hrp:''},
  rooms:{classe:[], binome:[], hrp:[]}, read:{}, wall:[], wallSeen:0, pacts:[], transfers:{day:1, total:0, gifted:[]}, dmDay:{day:1, counts:{}}, done:[]};
}
export function migrateRp(s){
 const d = rpDefaults(), r = s.rp && typeof s.rp === 'object' ? s.rp : d;
 const out = {...d, ...r};
 out.playerId = typeof r.playerId === 'string' && r.playerId.length <= 64 ? r.playerId : d.playerId;
 out.seq = Number.isInteger(r.seq) && r.seq >= 0 ? r.seq : 0;
 const p = r.profile ?? {};
 out.profile = {bio:clean(p.bio, RP_LIMITS.bio), traits:Array.isArray(p.traits) ? p.traits.filter(t => TRAITS.includes(t)).slice(0, 3) : [], mood:MOODS.includes(p.mood) ? p.mood : 'Disponible', secret:clean(p.secret, RP_LIMITS.secret), hrp:clean(p.hrp, RP_LIMITS.hrp)};
 const msgOk = m => m && typeof m.id === 'string' && typeof m.author === 'string' && typeof m.name === 'string' && typeof m.text === 'string' && m.text.length <= 600 && isDay(m.day) && ['rp','action','hrp'].includes(m.mode) && Number.isInteger(m.seq);
 out.rooms = {};
 for(const [room, list] of Object.entries(r.rooms ?? {})) if(roomOk(room) && Array.isArray(list)) out.rooms[room] = list.filter(msgOk).slice(-RP_LIMITS.room);
 for(const room of Object.keys(ROOMS)) out.rooms[room] ||= [];
 out.read = Object.fromEntries(Object.entries(r.read ?? {}).filter(([k, v]) => roomOk(k) && Number.isInteger(v)));
 out.wall = Array.isArray(r.wall) ? r.wall.filter(w => w && typeof w.id === 'string' && typeof w.text === 'string' && w.text.length <= 600 && Object.hasOwn(WALL_KINDS, w.kind) && isDay(w.day) && Number.isInteger(w.likes) && w.likes >= 0).slice(0, RP_LIMITS.wall) : [];
 out.wallSeen = Number.isInteger(r.wallSeen) ? r.wallSeen : 0;
 out.pacts = Array.isArray(r.pacts) ? r.pacts.filter(p => p && typeof p.id === 'string' && npcOk(p.with) && isDay(p.due) && isDay(p.day) && ['signe','refuse','tenu','rompu'].includes(p.status) && ['public','prive'].includes(p.visibility) && typeof p.title === 'string' && typeof p.terms === 'string').slice(0, RP_LIMITS.pacts) : [];
 const t = r.transfers ?? {};
 out.transfers = {day:isDay(t.day) ? t.day : 1, total:Number.isFinite(t.total) && t.total >= 0 ? t.total : 0, gifted:Array.isArray(t.gifted) ? t.gifted.filter(npcOk) : []};
 const dm = r.dmDay ?? {};
 out.dmDay = {day:isDay(dm.day) ? dm.day : 1, counts:Object.fromEntries(Object.entries(dm.counts ?? {}).filter(([k, v]) => npcOk(k) && Number.isInteger(v)))};
 out.done = Array.isArray(r.done) ? r.done.filter(x => typeof x === 'string').slice(-RP_LIMITS.done) : [];
 s.rp = out;
 syncWorld(s);
 return s;
}

function push(s, room, author, text, mode = 'rp', extra = {}){
 const name = author === s.rp.playerId ? s.name : author === 'system' ? 'MJ' : PEOPLE[author]?.short ?? 'Élève';
 const msg = {id:extra.id ?? newId(), author, name, text, mode, day:extra.day ?? s.day, seq:++s.rp.seq};
 (s.rp.rooms[room] ||= []).push(msg);
 s.rp.rooms[room] = s.rp.rooms[room].slice(-RP_LIMITS.room);
 return msg;
}
function wallPush(s, post){
 s.rp.wall.unshift({liked:false, ...post, seq:++s.rp.seq});
 s.rp.wall = s.rp.wall.slice(0, RP_LIMITS.wall);
}

// Ajoute le contenu des PNJ jusqu'au jour courant ; sans effet si déjà présent.
export function syncWorld(s){
 const rp = s.rp, ids = new Set(Object.values(rp.rooms).flat().map(m => m.id));
 for(const m of ROOM_SCRIPT) if(m.day <= s.day && !ids.has(m.id)) push(s, m.room, m.author, m.text, m.room === 'hrp' ? 'hrp' : 'rp', {id:m.id, day:m.day});
 if(s.partner && !ids.has('b-'+s.partner)) push(s, 'binome', s.partner, `C’est notre canal. On s’organise ici, ${s.name}.`, 'rp', {id:'b-'+s.partner});
 const wallIds = new Set(rp.wall.map(w => w.id));
 for(const w of WALL_SCRIPT) if(w.day <= s.day && !wallIds.has(w.id)) wallPush(s, {id:w.id, day:w.day, kind:w.kind, text:w.text, author:w.anon ? null : w.author, likes:w.likes, knowledge:w.knowledge ?? null});
 if(rp.transfers.day !== s.day) rp.transfers = {day:s.day, total:0, gifted:[]};
 if(rp.dmDay.day !== s.day) rp.dmDay = {day:s.day, counts:{}};
 return s;
}

export const unreadRoom = (s, room) => (s.rp.rooms[room] ?? []).filter(m => m.seq > (s.rp.read[room] ?? 0) && m.author !== s.rp.playerId).length;
export const rpUnread = s => s?.rp ? Object.keys(s.rp.rooms).filter(r => r !== 'binome' || s.partner).reduce((n, r) => n + unreadRoom(s, r), 0) : 0;
export const unreadWall = s => s.rp.wall.filter(w => w.seq > s.rp.wallSeen).length;
export const activePacts = s => s.rp.pacts.filter(p => p.status === 'signe');
export function markRead(s, room){ const list = s.rp.rooms[room] ?? []; s.rp.read[room] = list.length ? list[list.length - 1].seq : 0; }
export function markWallSeen(s){ s.rp.wallSeen = s.rp.seq; }

// ---------- Commandes ----------
const fail = message => ({ok:false, message});
export function command(type, params = {}, author = null, id = newId()){
 return {id, author, type, target:params.to ?? params.room ?? params.pact ?? params.post ?? null, params, at:Date.now()};
}

export function applyCommand(s, cmd){
 if(!s.rp) migrateRp(s);
 if(!cmd || typeof cmd.id !== 'string' || typeof cmd.type !== 'string') return fail('Commande invalide.');
 if(s.rp.done.includes(cmd.id)) return {ok:true, duplicate:true, message:'Déjà traité.'};
 const handler = HANDLERS[cmd.type];
 if(!handler) return fail('Commande inconnue.');
 const result = handler(s, cmd.params ?? {}, cmd);
 if(result.ok){ s.rp.done.push(cmd.id); s.rp.done = s.rp.done.slice(-RP_LIMITS.done); }
 return result;
}

const HANDLERS = {
 'profile.update'(s, p){
  const traits = Array.isArray(p.traits) ? [...new Set(p.traits)].filter(t => TRAITS.includes(t)) : s.rp.profile.traits;
  if(traits.length > 3) return fail('Trois traits au maximum.');
  if(p.mood !== undefined && !MOODS.includes(p.mood)) return fail('Humeur inconnue.');
  const prof = s.rp.profile;
  s.rp.profile = {bio:p.bio !== undefined ? clean(p.bio, RP_LIMITS.bio) : prof.bio, traits, mood:p.mood ?? prof.mood, secret:p.secret !== undefined ? clean(p.secret, RP_LIMITS.secret) : prof.secret, hrp:p.hrp !== undefined ? clean(p.hrp, RP_LIMITS.hrp) : prof.hrp};
  return {ok:true, message:'Fiche enregistrée.'};
 },
 'room.post'(s, p){
  const room = p.room;
  if(!roomOk(room)) return fail('Salon inconnu.');
  if(room === 'binome' && !s.partner) return fail('Choisissez d’abord un partenaire.');
  let text = clean(p.text, RP_LIMITS.text), mode = ROOMS[room]?.kind === 'hrp' ? 'hrp' : 'rp';
  if(!text) return fail('Message vide.');
  if(mode === 'rp' && /^\/me\s+/i.test(text)){ text = text.replace(/^\/me\s+/i, ''); mode = 'action'; }
  else if(mode === 'rp' && /^\(\(.*\)\)$/s.test(text)){ text = text.slice(2, -2).trim(); mode = 'hrp'; }
  if(!text) return fail('Message vide.');
  const msg = push(s, room, s.rp.playerId, text, mode);
  const replies = mode === 'rp' ? npcReplies(s, room, text) : mode === 'hrp' && room === 'hrp' ? mjReply(s, text) : [];
  return {ok:true, message:'Envoyé.', msg, replies};
 },
 'wall.post'(s, p){
  const text = clean(p.text, RP_LIMITS.text);
  if(!text) return fail('Publication vide.');
  if(!Object.hasOwn(WALL_KINDS, p.kind)) return fail('Catégorie inconnue.');
  const anonymous = p.anonymous !== false;
  wallPush(s, {id:newId(), day:s.day, kind:p.kind, text, author:anonymous ? null : 'player', name:anonymous ? null : s.name, mine:true, likes:0, knowledge:null});
  if(!anonymous) rep(s, {visibility:2});
  return {ok:true, message:anonymous ? 'Publié anonymement.' : 'Publié sous votre nom.'};
 },
 'wall.react'(s, p){
  const post = s.rp.wall.find(w => w.id === p.post);
  if(!post) return fail('Publication introuvable.');
  post.liked = !post.liked; post.likes = Math.max(0, post.likes + (post.liked ? 1 : -1));
  return {ok:true, message:post.liked ? 'Vous soutenez ce message.' : 'Soutien retiré.'};
 },
 'wall.note'(s, p){
  const post = s.rp.wall.find(w => w.id === p.post);
  if(!post) return fail('Publication introuvable.');
  const added = addKnowledge(s, 'mur-'+post.id, post.knowledge ?? post.text, post.author ? `Le Mur · ${post.name ?? PEOPLE[post.author]?.short ?? 'élève'}` : 'Le Mur · anonyme', WALL_KINDS[post.kind]);
  return added ? {ok:true, message:`Noté dans le carnet comme « ${WALL_KINDS[post.kind]} ».`} : fail('Déjà dans votre carnet.');
 },
 'pp.transfer'(s, p){
  const to = p.to, amount = p.amount;
  if(!npcOk(to)) return fail('Destinataire inconnu.');
  if(!Number.isInteger(amount) || amount < RP_LIMITS.transferMin || amount > RP_LIMITS.transferMax) return fail(`Montant entre ${RP_LIMITS.transferMin} et ${RP_LIMITS.transferMax.toLocaleString('fr-FR')} PP.`);
  if(amount > s.pp) return fail('Solde insuffisant.');
  syncWorld(s);
  if(s.rp.transfers.total + amount > RP_LIMITS.dailyTransfer) return fail(`Plafond quotidien : ${RP_LIMITS.dailyTransfer.toLocaleString('fr-FR')} PP.`);
  const motif = clean(p.motif, 60), npc = PEOPLE[to];
  s.pp -= amount;
  s.ledger.unshift({day:s.day, amount:-amount, motif:`Virement · ${npc.short}${motif ? ' · '+motif : ''}`});
  s.ledger = s.ledger.slice(0, 1000);
  s.rp.transfers.total += amount;
  let trust = 0;
  if(!s.rp.transfers.gifted.includes(to)){ s.rp.transfers.gifted.push(to); trust = amount >= 5000 ? 3 : amount >= 1000 ? 2 : 1; relation(s, to, trust, 0, 1); }
  push(s, 'dm:'+to, to, to === 'ren' ? `${amount.toLocaleString('fr-FR')} PP. Je retiens ton nom.` : to === 'hayase' ? 'Je ne peux pas accepter ce virement pour moi : il sera versé à la caisse de la classe.' : `Reçu, ${amount.toLocaleString('fr-FR')} PP${motif ? ` pour « ${motif} »` : ''}. Merci.`);
  log(s, `Virement de ${amount.toLocaleString('fr-FR')} PP à ${npc.short}.`);
  return {ok:true, message:`${amount.toLocaleString('fr-FR')} PP envoyés à ${npc.short}.`, trust};
 },
 'pact.propose'(s, p){
  const to = p.with;
  if(!npcOk(to) || to === 'hayase') return fail('Choisissez un élève.');
  const title = clean(p.title, RP_LIMITS.title), terms = clean(p.terms, RP_LIMITS.terms);
  if(!title || !terms) return fail('Indiquez l’objet et les termes du pacte.');
  if(!isDay(p.due) || p.due < s.day) return fail('L’échéance doit être aujourd’hui ou plus tard.');
  if(!['public','prive'].includes(p.visibility)) return fail('Visibilité inconnue.');
  if(activePacts(s).length >= RP_LIMITS.active) return fail(`${RP_LIMITS.active} pactes en cours au maximum.`);
  const r = s.relationships[to], need = (p.visibility === 'public' ? 45 : 35) - (s.partner === to ? 10 : 0);
  const accepted = r.trust >= need, npc = PEOPLE[to];
  const pact = {id:newId(), with:to, title, terms, due:p.due, visibility:p.visibility, status:accepted ? 'signe' : 'refuse', day:s.day};
  s.rp.pacts.unshift(pact); s.rp.pacts = s.rp.pacts.slice(0, RP_LIMITS.pacts);
  push(s, 'dm:'+to, to, accepted ? `D’accord pour « ${title} ». Je signe. Ne me fais pas regretter.` : `« ${title} »… Pas encore. On ne se connaît pas assez pour ça.`);
  if(accepted){ remember(s, `Pacte signé avec ${npc.short} : « ${title} » (échéance ${DAYS[p.due-1].toLowerCase()}).`); if(p.visibility === 'public'){ rep(s, {visibility:2}); wallPush(s, {id:'pact-'+pact.id, day:s.day, kind:'fait', text:`${s.name} et ${npc.short} ont signé un pacte public : « ${title} ».`, author:null, likes:3, knowledge:null}); } }
  return {ok:true, accepted, pact, message:accepted ? `${npc.short} a signé le pacte.` : `${npc.short} refuse pour l’instant (confiance insuffisante).`};
 },
 'pact.resolve'(s, p){
  const pact = s.rp.pacts.find(x => x.id === p.pact);
  if(!pact || pact.status !== 'signe') return fail('Ce pacte n’est pas en cours.');
  if(!['tenu','rompu'].includes(p.outcome)) return fail('Issue inconnue.');
  pact.status = p.outcome; pact.resolvedDay = s.day;
  const npc = PEOPLE[pact.with], kept = p.outcome === 'tenu';
  if(kept){ relation(s, pact.with, 5, 3, 2); rep(s, {reliability:3}); }
  else { relation(s, pact.with, -8, -4, 0); rep(s, {reliability:-6}); }
  push(s, 'dm:'+pact.with, pact.with, kept ? `Pacte tenu. Je m’en souviendrai, ${s.name}.` : `Tu avais signé « ${pact.title} ». Je m’en souviendrai aussi.`);
  remember(s, kept ? `Vous avez tenu votre pacte avec ${npc.short}.` : `Vous avez rompu votre pacte avec ${npc.short}.`);
  if(pact.visibility === 'public') wallPush(s, {id:'res-'+pact.id, day:s.day, kind:'fait', text:kept ? `Pacte public honoré : ${s.name} et ${npc.short}, « ${pact.title} ».` : `Pacte public rompu : ${s.name} n’a pas tenu « ${pact.title} » envers ${npc.short}.`, author:null, likes:kept ? 6 : 14, knowledge:null});
  return {ok:true, message:kept ? 'Pacte tenu : confiance et fiabilité en hausse.' : 'Pacte rompu : la confiance en pâtit.'};
 }
};

// ---------- Réactions des PNJ (exécutées par l'hôte) ----------
function npcReplies(s, room, text){
 const topic = topicOf(text), out = [];
 if(room.startsWith('dm:')){
  const id = room.slice(3), c = s.rp.dmDay.counts;
  syncWorld(s);
  c[id] = (c[id] ?? 0) + 1;
  if(c[id] === 1) relation(s, id, 0, 0, 1);
  const voice = VOICE[id];
  const context = dmContext(s, id, topic);
  const line = c[id] > 4 ? 'Je dois y aller. On se reparle demain ?' : context ?? (s.relationships[id].trust < 30 && topic !== 'thanks' ? voice.low : voice[topic]);
  out.push(push(s, room, id, line));
 } else if(room === 'binome' && s.partner){
  out.push(push(s, room, s.partner, VOICE[s.partner][topic === 'other' ? 'help' : topic]));
 } else if(room === 'classe'){
  const id = CLASS_VOICE[topic] ?? CLASS_ROTATION[s.rp.seq % CLASS_ROTATION.length];
  out.push(push(s, room, id, VOICE[id][topic]));
 }
 return out;
}
function mjReply(s, text){
 const t = text.toLowerCase();
 const line = /pause|afk|brb/.test(t) ? 'Pause notée. En multijoueur, votre personnage passe en présence basique (mandat d’absence).' : /règle|regle|rule/.test(t) ? 'Les règles de l’examen sont dans Examen et Agenda. Les PP, pactes et virements sont validés par l’hôte de la session.' : 'Message reçu par le MJ. En solo, l’hôte est local ; en session, ce canal réunit les joueurs hors personnage.';
 return [push(s, 'hrp', 'system', line, 'hrp')];
}

// ---------- Session ----------
// Hôte local : applique les commandes sur l'état du joueur. Un transport réseau (WebSocket) remplacera
// send() par l'envoi de la commande au serveur, qui exécutera applyCommand et renverra le résultat.
export function createLocalSession({getState, onApplied} = {}){
 return {
  mode:'local',
  label:'Session solo · hôte local',
  send(type, params = {}){ const s = getState(); if(!s.rp) migrateRp(s); const cmd = command(type, params, s.rp.playerId); const result = applyCommand(s, cmd); onApplied?.(result, cmd); return result; }
 };
}
