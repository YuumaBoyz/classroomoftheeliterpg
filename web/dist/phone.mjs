// Téléphone de l'élève : smartphone moderne inspiré d'iOS, pensé pour le roleplay.
// Proportions, barre d'état, îlot, dock, verre dépoli et navigation reprennent les codes d'un iPhone récent.
// Icônes, fond d'écran et noms d'apps sont des créations du jeu : aucune marque ni icône réelle.
// Les actions RP (fiche, salons, Mur, virements, pactes) passent par la session de roleplay.mjs.
import {createLocalSession, migrateRp, syncWorld, unreadRoom, unreadWall, activePacts, markRead, markWallSeen, ROOMS, TRAITS, MOODS, WALL_KINDS, RP_LIMITS} from './roleplay.mjs';
import {whereabouts} from './npc-ai.mjs';

const SVG = {
 messages:'<path d="M6.5 8.5h12a3 3 0 0 1 3 3v5.5a3 3 0 0 1-3 3h-6.2L8 23v-3H6.5a3 3 0 0 1-3-3v-5.5a3 3 0 0 1 3-3z" fill="#fff"/><path d="M14 5.2h7.5a3 3 0 0 1 3 3V13a3 3 0 0 1-2.4 2.95" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" opacity=".75"/>',
 contacts:'<circle cx="11.5" cy="10.5" r="3.6" fill="#fff"/><path d="M4.8 21.5c.6-3.7 3.4-5.8 6.7-5.8s6.1 2.1 6.7 5.8z" fill="#fff"/><circle cx="19.5" cy="9.8" r="2.7" fill="#fff" opacity=".7"/><path d="M18.6 14.6c2.8.1 4.8 1.9 5.3 4.9h-4" fill="#fff" opacity=".7"/>',
 wallet:'<rect x="4.5" y="8" width="19" height="13.5" rx="3" fill="#fff"/><path d="M7 8l9.5-3.3a1.6 1.6 0 0 1 2 1L19.3 8" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round" opacity=".75"/><rect x="16.5" y="12.4" width="7" height="4.6" rx="1.6" fill="currentColor" opacity=".55"/><circle cx="19" cy="14.7" r="1" fill="#fff"/>',
 profile:'<rect x="4" y="6.5" width="20" height="15" rx="2.8" fill="#fff"/><circle cx="10" cy="12.6" r="2.4" fill="currentColor"/><path d="M6.6 18.3c.5-2.1 1.8-3.1 3.4-3.1s2.9 1 3.4 3.1" fill="currentColor"/><path d="M15.6 11.5h5.2M15.6 14.5h4M15.6 17.4h5.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
 rank:'<rect x="5" y="14" width="5.5" height="8" rx="1.2" fill="#fff" opacity=".75"/><rect x="11.25" y="9" width="5.5" height="13" rx="1.2" fill="#fff"/><rect x="17.5" y="16.5" width="5.5" height="5.5" rx="1.2" fill="#fff" opacity=".6"/><path d="M14 4l1.1 2.2 2.4.35-1.75 1.7.4 2.4L14 9.5l-2.15 1.15.4-2.4-1.75-1.7 2.4-.35z" fill="#fff"/>',
 exam:'<rect x="6.5" y="5.5" width="15" height="18" rx="2.6" fill="#fff"/><rect x="10.5" y="3.8" width="7" height="3.6" rx="1.4" fill="#fff" stroke="currentColor" stroke-width="1.2"/><path d="M10 12.6l1.8 1.8 3.4-3.6M10 18.3h8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
 map:'<path d="M4.5 8l5.8-2.5 7.4 2.6 5.8-2.6v14.6l-5.8 2.5-7.4-2.6-5.8 2.5z" fill="#fff"/><path d="M10.3 5.5v14.6M17.7 8.1v14.6" stroke="currentColor" stroke-width="1.3" opacity=".45"/><path d="M14 10.2a2.6 2.6 0 0 1 2.6 2.6c0 2-2.6 4.7-2.6 4.7s-2.6-2.7-2.6-4.7a2.6 2.6 0 0 1 2.6-2.6z" fill="currentColor"/>',
 journal:'<rect x="6.5" y="4.5" width="15.5" height="19" rx="2.2" fill="#fff"/><rect x="6.5" y="4.5" width="3.6" height="19" rx="1.4" fill="currentColor" opacity=".9"/><path d="M12.6 10h6.4M12.6 13.5h6.4M12.6 17h4.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity=".55"/>',
 summary:'<path d="M14 4.5l2.7 5.6 6.1.85-4.45 4.3 1.08 6.05L14 18.4l-5.43 2.9 1.08-6.05L5.2 10.95l6.1-.85z" fill="#fff"/>',
 persona:'<path d="M14 4.5c3.6 0 6.5 2.4 6.5 6.6 0 3.4-1.4 6.3-3 8.1l.9 4.3H9.6l.9-4.3c-1.6-1.8-3-4.7-3-8.1 0-4.2 2.9-6.6 6.5-6.6z" fill="#fff"/><path d="M10.6 11.3c1.1-.9 2.2-.9 3.1 0M14.3 11.3c1.1-.9 2.2-.9 3.1 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M11.3 15.2c1.7 1.3 3.7 1.3 5.4 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>',
 wall:'<rect x="4.5" y="5" width="19" height="13" rx="3.5" fill="#fff"/><path d="M9 18l-2.5 4.5L13 18" fill="#fff"/><circle cx="9.5" cy="11.5" r="1.4" fill="currentColor"/><circle cx="14" cy="11.5" r="1.4" fill="currentColor"/><circle cx="18.5" cy="11.5" r="1.4" fill="currentColor"/>',
 pacts:'<path d="M5 13.5l4.2-4.2a2 2 0 0 1 2.4-.3l2.4 1.5 2.4-1.5a2 2 0 0 1 2.4.3l4.2 4.2-4.5 4.5a2 2 0 0 1-2.8 0L14 16.3l-1.7 1.7a2 2 0 0 1-2.8 0z" fill="#fff"/><path d="M11.2 12.2l2.8 2.8M14.6 11.4l2.2 2.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>'
};
const APPS = {
 messages:{label:'Messages',bg:'linear-gradient(180deg,#5fd88d,#16a874)',ink:'#16a874'},
 agenda:{label:'Agenda',bg:'#fff',ink:'#a23d51'},
 contacts:{label:'Contacts',bg:'linear-gradient(180deg,#5b7393,#2f425c)',ink:'#2f425c'},
 wallet:{label:'Portefeuille',bg:'linear-gradient(180deg,#e9c27a,#b9822f)',ink:'#9a6a22'},
 persona:{label:'Fiche RP',bg:'linear-gradient(180deg,#f47d9b,#b23463)',ink:'#b23463'},
 wall:{label:'Le Mur',bg:'linear-gradient(180deg,#4a4f5c,#1d2029)',ink:'#1d2029'},
 pacts:{label:'Pactes',bg:'linear-gradient(180deg,#c69cff,#7d3fd0)',ink:'#7d3fd0'},
 profile:{label:'Dossier',bg:'linear-gradient(180deg,#61a8ff,#2a62e0)',ink:'#2a62e0'},
 rank:{label:'Classement',bg:'linear-gradient(180deg,#ffae5c,#ef6a2f)',ink:'#ef6a2f'},
 exam:{label:'Examen',bg:'linear-gradient(180deg,#8da2ff,#4b5fd8)',ink:'#4b5fd8'},
 map:{label:'Plan',bg:'linear-gradient(180deg,#5fd3cf,#1f8f9e)',ink:'#1f8f9e'},
 journal:{label:'Carnet',bg:'linear-gradient(180deg,#fbf3dc,#e8dcb8)',ink:'#8f3448'},
 summary:{label:'Bilan',bg:'linear-gradient(180deg,#ff7a8e,#c9304f)',ink:'#c9304f'}
};
const SHORT_DAYS = ['lun.','mar.','mer.','jeu.','ven.','sam.','dim.'];
const AGENDA = ['Découvrir le campus et choisir un partenaire.','Commencer la préparation. Écouter les autres.','Réviser ou aider les binômes fragiles.','Dernier jour de préparation. Tenir ses engagements.','Restitution en salle D et publication des résultats.','Vivre les conséquences. Retrouver ses camarades.','Relire la semaine et choisir la suite.'];
const CHEVRON = '<svg class="chev" viewBox="0 0 8 14"><path d="M1.5 1.5L6.5 7l-5 5.5"/></svg>';
const MOOD_COLOR = {'Disponible':'#34c759','Concentré':'#0a7aff','Joyeux':'#ffcc00','Méfiant':'#ff9f0a','Fatigué':'#8e8e93','Occupé':'#ff3b30','Ne pas déranger':'#5e5ce6'};
const KIND_CLASS = {rumeur:'k-rumeur', temoignage:'k-temoignage', fait:'k-fait', hypothese:'k-hypothese'};

export function createPhone(ctx){
 const {$, $$, esc, fmt, getState, PEOPLE, DAYS, LOCATIONS, ARCHETYPES, openModal, persist, open, extras = {}} = ctx;
 let route = {app:'home'}, unreadFrom = 0, openedRooms = new Set(), bannerTimer = 0, toastTimer = 0, typing = null, wallFilter = 'all';
 const session = createLocalSession({getState:() => getState()});

 const S = () => getState();
 const clock = s => s.ended ? '20:10' : s.actions===3 ? '15:30' : s.actions===2 ? '16:45' : s.actions===1 ? '18:00' : '19:30';
 const legacyUnread = s => Math.max(0, s.messages.length - (s.messagesRead ?? 0));
 const personOf = from => Object.entries(PEOPLE).find(([id, p]) => id===from || p.short===from || p.name===from) ?? null;
 const initials = name => String(name).replace(/^Mme\s+/, '').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
 const dayLabel = (s, d) => d===s.day ? 'Aujourd’hui' : d===s.day-1 ? 'Hier' : DAYS[d-1];
 const trustLabel = t => t>=55 ? 'Confiance' : t>=35 ? 'Ouverture' : 'Découverte';
 const students = () => Object.entries(PEOPLE).filter(([id]) => id!=='hayase');

 // ---------- Avatars et icônes ----------
 function avatar(who, size = 'm'){
  const s = S();
  if(who==='me' || who===s.rp?.playerId || who===s.name && !personOf(who)) return `<span class="ios-avatar ${size} me" aria-hidden="true">${esc(initials(s.name))}</span>`;
  if(who==='Administration' || who==='admin') return `<span class="ios-avatar ${size} crest" aria-hidden="true">D</span>`;
  if(who==='system') return `<span class="ios-avatar ${size} mj" aria-hidden="true">MJ</span>`;
  if(who==='anon') return `<span class="ios-avatar ${size} anon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 10.5c2.5-1.2 5.5-1.6 9-1.6s6.5.4 9 1.6c-.3 3-1.9 5-4.4 5-2 0-3.1-1.4-4.6-1.4s-2.6 1.4-4.6 1.4c-2.5 0-4.1-2-4.4-5z" fill="#fff"/></svg></span>`;
  const found = personOf(who);
  if(found && found[1].portrait!==null) return `<span class="ios-avatar ${size} photo" style="background-position:${found[1].portrait*100/3}% 0" aria-hidden="true"></span>`;
  return `<span class="ios-avatar ${size}" aria-hidden="true">${esc(initials(found ? found[1].name : who))}</span>`;
 }
 function roomAvatar(room, size = 'm'){
  const s = S();
  if(room==='classe') return `<span class="ios-avatar ${size} crest group" aria-hidden="true">1-D</span>`;
  if(room==='binome') return s.partner ? avatar(s.partner, size) : `<span class="ios-avatar ${size}" aria-hidden="true">2</span>`;
  if(room==='hrp') return `<span class="ios-avatar ${size} hrp" aria-hidden="true">HRP</span>`;
  if(room==='admin') return avatar('admin', size);
  return avatar(room.slice(3), size);
 }
 const roomName = room => room==='admin' ? 'Administration' : room.startsWith('dm:') ? PEOPLE[room.slice(3)].name : room==='binome' && S().partner ? `Binôme · ${PEOPLE[S().partner].short}` : ROOMS[room].name;
 function appIcon(id, s){
  const a = APPS[id];
  const glyph = id==='agenda'
   ? `<span class="ios-cal"><small>${esc(SHORT_DAYS[s.day-1].replace('.', '').toUpperCase())}</small><b>${s.day}</b></span>`
   : `<svg viewBox="0 0 28 28" style="color:${a.ink}">${SVG[id]}</svg>`;
  return `<span class="ios-icon" style="background:${a.bg}">${glyph}</span>`;
 }
 function appButton(id, s, {label = true, badge = 0} = {}){
  return `<button class="ios-app-btn" data-launch="${id}" aria-label="${esc(APPS[id].label)}${badge?`, ${badge} nouveauté${badge>1?'s':''}`:''}">${appIcon(id, s)}${badge?`<i class="ios-badge">${badge>99?'99+':badge}</i>`:''}${label?`<span>${esc(APPS[id].label)}</span>`:''}</button>`;
 }

 // ---------- Données de conversation ----------
 // Une conversation réunit les anciens messages du jeu (state.messages) et les messages RP du salon.
 const roomOfLegacy = from => from==='Administration' ? 'admin' : personOf(from) ? 'dm:'+personOf(from)[0] : null;
 function roomItems(s, room){
  const legacy = s.messages.map((m, i) => ({m, i})).filter(({m}) => roomOfLegacy(m.from)===room).reverse()
   .map(({m, i}) => ({id:'legacy-'+i, author:room==='admin' ? 'admin' : room.slice(3), name:m.from, text:m.text, mode:'rp', day:m.day, seq:-1, unread:i < s.messages.length - unreadFrom && !openedRooms.has(room)}));
  const rp = (s.rp.rooms[room] ?? []).map(m => ({...m, unread:m.seq > (s.rp.read[room] ?? 0) && m.author!==s.rp.playerId}));
  return [...legacy, ...rp].sort((a, b) => a.day - b.day || (a.seq===-1 ? -1 : b.seq===-1 ? 1 : a.seq - b.seq));
 }
 function conversations(s){
  const rooms = new Set();
  s.messages.forEach(m => { const r = roomOfLegacy(m.from); if(r) rooms.add(r); });
  Object.keys(s.rp.rooms).filter(r => r.startsWith('dm:') && s.rp.rooms[r].length).forEach(r => rooms.add(r));
  return [...rooms].map(room => { const items = roomItems(s, room); return {room, last:items[items.length-1], unread:items.some(x => x.unread)}; })
   .filter(c => c.last).sort((a, b) => b.last.day - a.last.day || (b.last.seq - a.last.seq));
 }
 const salons = s => ['classe', ...(s.partner ? ['binome'] : []), 'hrp'];
 const messagesBadge = s => legacyUnread(s) + [...salons(s), ...Object.keys(s.rp.rooms).filter(r => r.startsWith('dm:'))].reduce((n, r) => n + unreadRoom(s, r), 0);
 const pactsBadge = s => activePacts(s).filter(p => p.due <= s.day).length;

 // ---------- Barre d'état ----------
 function statusBar(s){
  const level = Math.max(4, Math.min(100, s.energy));
  return `<div class="ios-status" aria-hidden="true"><span class="ios-time">${clock(s)}</span><span class="ios-indicators">
   <svg class="ios-signal" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx=".8"/><rect x="5" y="5.5" width="3" height="6.5" rx=".8"/><rect x="10" y="3" width="3" height="9" rx=".8"/><rect x="15" y="0" width="3" height="12" rx=".8" opacity=".35"/></svg>
   <svg class="ios-wifi" viewBox="0 0 16 12"><path d="M8 11.6l2.3-2.6a3.4 3.4 0 0 0-4.6 0z"/><path d="M3.9 7.1a6 6 0 0 1 8.2 0l-1.1 1.3a4.3 4.3 0 0 0-6 0z"/><path d="M1.6 4.6a9.4 9.4 0 0 1 12.8 0l-1.1 1.3a7.7 7.7 0 0 0-10.6 0z"/></svg>
   <span class="ios-battery ${level<=20?'low':''}"><i style="width:${level}%"></i></span></span></div>`;
 }

 // ---------- Écran d'accueil ----------
 function home(s){
  const toExam = 5 - s.day, mood = s.rp.profile.mood;
  const next = s.ended ? 'Semaine terminée' : s.exam ? `Examen : ${s.exam.score}/100` : toExam>0 ? `Examen dans ${toExam} jour${toExam>1?'s':''}` : 'Examen aujourd’hui';
  const grid = ['persona','wall','pacts','profile','rank','exam','map','journal',...(s.ended?['summary']:[])];
  const badges = {wall:unreadWall(s), pacts:pactsBadge(s)};
  return `<div class="ios-view ios-home" data-view="home">
   <div class="ios-widgets">
    <button class="ios-widget ios-widget-day" data-launch="agenda" aria-label="Agenda : ${esc(DAYS[s.day-1])}, ${esc(next)}">
     <span class="w-kicker">${esc(DAYS[s.day-1].toUpperCase())}</span><b>${s.day}</b>
     <span class="w-line"><i class="w-dot"></i>${esc(next)}</span>
     <span class="w-slots">${[0,1,2].map(i=>`<i class="${i<s.actions?'on':''}"></i>`).join('')}<small>${s.actions} créneau${s.actions>1?'x':''}</small></span>
    </button>
    <button class="ios-widget ios-widget-pp" data-launch="persona" aria-label="Fiche RP : humeur ${esc(mood)}">
     <span class="w-head">${avatar('me','s')}<span>${esc(s.name)}</span></span>
     <b class="w-mood"><i style="background:${MOOD_COLOR[mood]}"></i>${esc(mood)}</b>
     <small>${s.rp.profile.traits.length ? esc(s.rp.profile.traits.join(' · ')) : 'Fiche RP à compléter'}</small>
     <span class="w-foot">${fmt(s.pp)} PP · ${activePacts(s).length} pacte${activePacts(s).length>1?'s':''}</span>
    </button>
   </div>
   <div class="ios-grid">${grid.map(id => appButton(id, s, {badge:badges[id] ?? 0})).join('')}</div>
   <div class="ios-search" aria-hidden="true"><svg viewBox="0 0 12 12"><circle cx="5" cy="5" r="3.6"/><path d="M7.7 7.7L11 11"/></svg>Rechercher</div>
   <nav class="ios-dock" aria-label="Dock">${appButton('messages', s, {label:false, badge:messagesBadge(s)})}${appButton('agenda', s, {label:false})}${appButton('contacts', s, {label:false})}${appButton('wallet', s, {label:false})}</nav>
  </div>`;
 }

 // ---------- Vues génériques ----------
 const backBtn = (to, label = 'Accueil', arg = '') => `<button class="ios-back" data-back="${to}" ${arg?`data-arg="${esc(arg)}"`:''}><svg viewBox="0 0 12 20"><path d="M10 2L2 10l8 8"/></svg><span>${esc(label)}</span></button>`;
 const nav = (back, title = '', backLabel = 'Accueil', right = '') => `<header class="ios-nav">${backBtn(back, backLabel)}<span class="ios-nav-title">${esc(title)}</span>${right?`<span class="ios-nav-right">${right}</span>`:''}</header>`;
 const appView = (id, body, cls = '') => `<div class="ios-view ios-app ${cls}" data-view="${id}">${body}</div>`;

 // ---------- Messages : salons épinglés + conversations privées ----------
 function messagesApp(s){
  const list = conversations(s);
  const compose = `<button class="ios-icon-btn" data-go="newdm" aria-label="Nouveau message"><svg viewBox="0 0 24 24"><path d="M4 20h4l10.5-10.5-4-4L4 16z M13 7l4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg></button>`;
  return appView('messages', `${nav('home','','Accueil',compose)}<div class="ios-scroll"><h1 class="ios-large">Messages</h1>
   <div class="ios-searchfield" aria-hidden="true"><svg viewBox="0 0 12 12"><circle cx="5" cy="5" r="3.6"/><path d="M7.7 7.7L11 11"/></svg>Rechercher</div>
   <div class="ios-pinned-list" role="list" aria-label="Salons">${salons(s).map(room => { const n = unreadRoom(s, room); return `<button class="ios-pinned" role="listitem" data-room="${room}" aria-label="${esc(roomName(room))}${n?`, ${n} non lus`:''}">${roomAvatar(room,'l')}${n?'<i class="ios-pinned-dot"></i>':''}<span>${esc(room==='binome'?'Binôme':ROOMS[room].name)}</span></button>`; }).join('')}</div>
   <div class="ios-threads">${list.map(c => `<button class="ios-thread" data-room="${c.room}">${c.unread?'<i class="ios-unread" aria-label="Non lu"></i>':'<i class="ios-unread off"></i>'}${roomAvatar(c.room)}<span class="t-body"><span class="t-top"><b>${esc(roomName(c.room))}</b><time>${esc(dayLabel(s, c.last.day))}</time>${CHEVRON}</span><span class="t-preview">${c.last.author===s.rp.playerId?'Vous : ':''}${esc(c.last.text)}</span></span></button>`).join('') || '<p class="ios-empty">Aucune conversation privée.</p>'}</div>
   <p class="ios-footnote">${esc(session.label)}. En session multijoueur, les salons réunissent les joueurs de la promotion et les élèves simulés.</p></div>`);
 }
 function newDmApp(s){
  return appView('newdm', `${nav('messages','Nouveau message','Messages')}<div class="ios-scroll"><div class="ios-group-title">À</div>
   <div class="ios-list">${Object.entries(PEOPLE).map(([id, p]) => `<button class="ios-row ios-pick" data-room="dm:${id}">${avatar(id,'s')}<span><b>${esc(p.name)}</b><small>${esc(p.role)}</small></span>${CHEVRON}</button>`).join('')}</div></div>`);
 }
 function bubble(s, m, prev, next, group){
  const mine = m.author===s.rp.playerId;
  if(m.mode==='action') return `<p class="ios-action"><b>${esc(mine ? s.name : m.name)}</b> ${esc(m.text)}</p>`;
  const sameNext = next && next.author===m.author && next.mode===m.mode && next.day===m.day;
  const samePrev = prev && prev.author===m.author && prev.mode!=='action' && prev.day===m.day;
  const name = group && !mine && !samePrev ? `<span class="ios-sender">${esc(m.name)}</span>` : '';
  const av = group && !mine ? `<span class="ios-bubble-av">${sameNext ? '' : avatar(m.author,'xs')}</span>` : '';
  return `<div class="ios-msg ${mine?'mine':''} ${group&&!mine?'grouped':''}">${name}<div class="ios-msg-row">${av}<p class="ios-bubble ${mine?'mine':''} ${m.mode==='hrp'?'hrp':''} ${sameNext?'':'tail'}">${m.mode==='hrp'?'<span class="hrp-tag">HRP</span> ':''}${esc(m.text)}</p></div></div>`;
 }
 function roomApp(s, room){
  const group = !room.startsWith('dm:') && room!=='admin';
  let items = roomItems(s, room), hidden = 0;
  if(typing && typing.room===room){ const before = items.length; items = items.filter(m => !typing.ids.has(m.id)); hidden = before - items.length; }
  let last = 0;
  const body = items.map((m, i) => { const sep = m.day!==last ? `<div class="ios-day-sep"><b>${esc(dayLabel(s, m.day))}</b> · Jour ${m.day}</div>` : ''; last = m.day; return sep + bubble(s, m, items[i-1]?.day===m.day ? items[i-1] : null, items[i+1], group); }).join('');
  const typingEl = hidden ? `<div class="ios-msg grouped"><div class="ios-msg-row"><span class="ios-bubble-av"></span><p class="ios-bubble ios-typing" aria-label="En train d’écrire"><i></i><i></i><i></i></p></div></div>` : '';
  const person = room.startsWith('dm:') ? room.slice(3) : null;
  const sub = room==='classe' ? `${Object.keys(PEOPLE).length} membres · salon RP` : room==='binome' ? 'Canal privé · RP' : room==='hrp' ? 'Hors personnage' : room==='admin' ? 'Messages officiels' : PEOPLE[person].role;
  const canWrite = room!=='admin';
  const ph = room==='hrp' ? 'Message hors-RP' : 'Message RP · /me action · ((HRP))';
  const backTo = route.from==='contact' ? ['contact', 'Contacts'] : ['messages', 'Messages'];
  return appView('room', `<header class="ios-nav ios-nav-thread">${backBtn(backTo[0], backTo[1], route.from==='contact' ? person : '')}<button class="ios-thread-head" ${person?`data-person="${person}"`:'disabled'}>${roomAvatar(room,'s')}<span>${esc(roomName(room))}${person?' '+CHEVRON:''}</span><small>${esc(sub)}</small></button></header>
   ${room==='hrp'?`<div class="ios-hrp-banner">${esc(ROOMS.hrp.about)}</div>`:''}
   <div class="ios-scroll ios-chat" role="log" aria-label="Conversation : ${esc(roomName(room))}">${body || '<p class="ios-empty">Écrivez le premier message.</p>'}${typingEl}</div>
   ${canWrite ? `<form class="ios-compose" data-compose="${room}"><button type="button" class="c-plus" data-insert="/me " aria-label="Insérer une action">✱</button><input class="c-field" name="text" maxlength="${RP_LIMITS.text}" placeholder="${esc(ph)}" autocomplete="off" aria-label="${esc(ph)}"><button class="c-send" aria-label="Envoyer"><svg viewBox="0 0 20 20"><path d="M10 15V5M5.5 9.5L10 5l4.5 4.5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></form>`
    : '<div class="ios-compose ios-compose-off">Les messages officiels ne prennent pas de réponse.</div>'}`, 'ios-thread-view');
 }

 // ---------- Agenda ----------
 function agendaApp(s){
  const pacts = activePacts(s);
  return appView('agenda', `${nav('home','')}<div class="ios-scroll"><h1 class="ios-large ios-cal-title">Avril</h1>
   <div class="ios-week">${DAYS.map((d, i) => `<span class="${i+1===s.day?'today':''} ${i+1<s.day?'past':''}"><small>${d[0]}</small><b>${i+1}</b>${i===4||pacts.some(p=>p.due===i+1)?'<i></i>':''}</span>`).join('')}</div>
   <div class="ios-group-title">Échéances</div>
   <div class="ios-list"><div class="ios-event exam"><i></i><span><b>Contrat de confiance</b><small>Vendredi · Salle de classe D</small><small>Restitution du dossier. Inscription des binômes avant vendredi.</small></span></div>${pacts.map(p => `<button class="ios-event pact" data-launch="pacts"><i></i><span><b>Pacte · ${esc(p.title)}</b><small>${esc(DAYS[p.due-1])} · avec ${esc(PEOPLE[p.with].short)}</small></span><time>J${p.due}</time></button>`).join('')}</div>
   <div class="ios-group-title">Cette semaine</div>
   <div class="ios-list">${DAYS.map((d, i) => `<div class="ios-event ${i+1===s.day?'now':''} ${i+1<s.day?'done':''}"><i></i><span><b>${esc(d)}${i+1===s.day?' · aujourd’hui':''}</b><small>${esc(AGENDA[i])}</small></span><time>J${i+1}</time></div>`).join('')}</div></div>`);
 }

 // ---------- Contacts ----------
 function contactsApp(s){
  const key = p => p.short.replace(/^Mme\s+/, '');
  const people = Object.entries(PEOPLE).sort((a, b) => key(a[1]).localeCompare(key(b[1]), 'fr'));
  const groups = {};
  people.forEach(([id, p]) => { (groups[key(p)[0].toUpperCase()] ||= []).push([id, p]); });
  return appView('contacts', `${nav('home','')}<div class="ios-scroll"><h1 class="ios-large">Contacts</h1>
   <label class="ios-searchfield"><svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="5" cy="5" r="3.6"/><path d="M7.7 7.7L11 11"/></svg><input id="ios-contact-search" type="search" placeholder="Rechercher" aria-label="Rechercher un contact" autocomplete="off"></label>
   <button class="ios-mycard" data-launch="persona">${avatar('me','l')}<span><b>${esc(s.name)}</b><small>Ma fiche RP · <i class="mood-dot" style="background:${MOOD_COLOR[s.rp.profile.mood]}"></i>${esc(s.rp.profile.mood)}</small></span>${CHEVRON}</button>
   ${Object.entries(groups).map(([l, list]) => `<section class="ios-letter" data-letter="${l}"><div class="ios-letter-head">${l}</div>${list.map(([id, p]) => `<button class="ios-contact-row" data-person="${id}" data-name="${esc(p.name.toLowerCase())}"><span>${esc(p.name)}</span>${s.partner===id?'<small class="ios-pill">Binôme</small>':''}<small>${trustLabel(s.relationships[id].trust)}</small></button>`).join('')}</section>`).join('')}</div>`);
 }
 function contactApp(s, id){
  const p = PEOPLE[id], r = s.relationships[id];
  const bar = (label, v) => `<div class="ios-row ios-meter"><span>${label}</span><span class="m-track"><i style="width:${v}%"></i></span><b>${v}</b></div>`;
  const pacts = s.rp.pacts.filter(x => x.with===id);
  const icon = (d) => `<svg viewBox="0 0 24 24">${d}</svg>`;
  return appView('contact', `${nav('contacts','','Contacts')}<div class="ios-scroll"><div class="ios-contact-hero">${avatar(id,'xl')}<h2>${esc(p.name)}</h2><p>${esc(p.role)}</p></div>
   <div class="ios-actions four">
    <button data-room="dm:${id}" data-from="contact">${icon('<path d="M5 6.5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-7l-4 3v-3H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z" fill="#fff"/>')}<span>message</span></button>
    <button data-go="transfer" data-arg="${id}" ${id==='hayase'?'disabled':''}>${icon('<path d="M5 9h12l-3-3M19 15H7l3 3" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>')}<span>virement</span></button>
    <button data-go="newpact" data-arg="${id}" ${id==='hayase'?'disabled':''}>${icon('<path d="M4 12.5l3.5-3.5a1.7 1.7 0 0 1 2-.2l2.5 1.5 2.5-1.5a1.7 1.7 0 0 1 2 .2l3.5 3.5-4 4a1.7 1.7 0 0 1-2.4 0L12 15l-1.6 1.5a1.7 1.7 0 0 1-2.4 0z" fill="#fff"/>')}<span>pacte</span></button>
    <button ${whereabouts(s, id).scene?`data-travel-to="${whereabouts(s, id).scene}"`:'disabled'}>${icon('<path d="M12 4a5.5 5.5 0 0 1 5.5 5.5c0 4-5.5 10-5.5 10s-5.5-6-5.5-10A5.5 5.5 0 0 1 12 4z" fill="#fff"/><circle cx="12" cy="9.5" r="2" fill="currentColor"/>')}<span>rejoindre</span></button>
   </div>
   <div class="ios-list"><div class="ios-row"><span>En ce moment</span><b>${esc(whereabouts(s, id).place)} · ${esc(whereabouts(s, id).label.toLowerCase())}</b></div><div class="ios-row"><span>Humeur</span><b>${esc(whereabouts(s, id).mood)}</b></div><div class="ios-row"><span>Relation</span><b>${trustLabel(r.trust)}${s.partner===id?' · binôme':''}</b></div>${pacts.length?`<button class="ios-row" data-launch="pacts"><span>Pactes</span><b>${pacts.filter(x=>x.status==='signe').length} en cours · ${pacts.length} au total</b>${CHEVRON}</button>`:''}</div>
   <div class="ios-group-title">Lien</div>
   <div class="ios-list">${bar('Confiance', r.trust)}${bar('Respect', r.respect)}${bar('Proximité', r.close)}</div>
   <p class="ios-footnote">Un pacte public demande plus de confiance qu’un pacte privé. Les relations évoluent avec vos messages, vos activités et les promesses tenues.</p></div>`);
 }

 // ---------- 1. Fiche RP ----------
 function personaApp(s){
  const p = s.rp.profile;
  return appView('persona', `${nav('home','','Accueil','<button class="ios-nav-action" data-save-persona>OK</button>')}<form class="ios-scroll" data-persona>
   <div class="ios-contact-hero">${avatar('me','xl')}<h2>${esc(s.name)}</h2><p>Classe 1-D · ${esc(ARCHETYPES[s.archetype]?.label ?? 'Élève')}</p></div>
   <div class="ios-group-title">Humeur · visible par la session</div>
   <div class="ios-chips" role="radiogroup" aria-label="Humeur">${MOODS.map(m => `<label class="ios-chip ${p.mood===m?'on':''}"><input type="radio" name="mood" value="${esc(m)}" ${p.mood===m?'checked':''}><i style="background:${MOOD_COLOR[m]}"></i>${esc(m)}</label>`).join('')}</div>
   <div class="ios-group-title">Présentation · publique</div>
   <div class="ios-list"><textarea class="ios-textarea" name="bio" maxlength="${RP_LIMITS.bio}" rows="4" placeholder="Qui est votre personnage ? D’où vient-il, que montre-t-il aux autres ?">${esc(p.bio)}</textarea></div>
   <div class="ios-group-title">Traits · trois au maximum</div>
   <div class="ios-chips" data-max="3">${TRAITS.map(t => `<label class="ios-chip ${p.traits.includes(t)?'on':''}"><input type="checkbox" name="traits" value="${esc(t)}" ${p.traits.includes(t)?'checked':''}>${esc(t)}</label>`).join('')}</div>
   <div class="ios-group-title ios-lock-title"><svg viewBox="0 0 12 14"><rect x="1.5" y="6" width="9" height="7" rx="1.5"/><path d="M3.5 6V4.5a2.5 2.5 0 0 1 5 0V6" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>Secret ou objectif · vous seul</div>
   <div class="ios-list"><textarea class="ios-textarea" name="secret" maxlength="${RP_LIMITS.secret}" rows="3" placeholder="Ce que votre personnage cache. Jamais transmis aux autres joueurs.">${esc(p.secret)}</textarea></div>
   <div class="ios-group-title">Note hors-RP · pour les joueurs</div>
   <div class="ios-list"><input class="ios-input" name="hrp" maxlength="${RP_LIMITS.hrp}" placeholder="Disponibilités, limites de jeu…" value="${esc(p.hrp)}"></div>
   <button class="ios-primary" type="submit">Enregistrer la fiche</button>
   <p class="ios-footnote">En session, les autres joueurs voient votre humeur, votre présentation et vos traits. Votre secret reste privé : l’hôte ne le partage jamais.</p></form>`);
 }

 // ---------- 2. Le Mur ----------
 function wallApp(s){
  const filters = [['all','Tout'], ...Object.entries(WALL_KINDS)];
  const posts = s.rp.wall.filter(w => wallFilter==='all' || w.kind===wallFilter);
  const known = id => s.knowledge.some(k => k.id==='mur-'+id);
  return appView('wall', `${nav('home','')}<div class="ios-scroll"><h1 class="ios-large">Le Mur</h1><p class="ios-subtitle">Le forum des élèves de l’ANHS. On y publie à visage découvert… ou pas.</p>
   <form class="ios-list ios-wall-compose" data-wall-compose>
    <textarea class="ios-textarea" name="text" maxlength="${RP_LIMITS.text}" rows="3" placeholder="Partager quelque chose avec l’école…" aria-label="Nouvelle publication"></textarea>
    <div class="ios-chips tight" role="radiogroup" aria-label="Catégorie">${Object.entries(WALL_KINDS).map(([k, l], i) => `<label class="ios-chip ${KIND_CLASS[k]} ${i===0?'on':''}"><input type="radio" name="kind" value="${k}" ${i===0?'checked':''}>${esc(l)}</label>`).join('')}</div>
    <div class="ios-row ios-switch-row"><span>Publier anonymement</span><label class="ios-switch"><input type="checkbox" name="anonymous" checked aria-label="Publier anonymement"><i></i></label></div>
    <button class="ios-primary small" type="submit">Publier</button>
   </form>
   <div class="ios-segment" role="tablist">${filters.map(([k, l]) => `<button role="tab" aria-selected="${wallFilter===k}" class="${wallFilter===k?'on':''}" data-wall-filter="${k}">${esc(k==='all'?l:l.split(' ')[0])}</button>`).join('')}</div>
   <div class="ios-posts">${posts.map(w => { const name = w.author==='player' ? s.name : w.author ? PEOPLE[w.author]?.name ?? 'Élève' : 'Anonyme'; return `<article class="ios-post ${w.seq > s.rp.wallSeen ? 'new' : ''}"><header>${w.author==='player'?avatar('me','s'):w.author?avatar(w.author,'s'):avatar('anon','s')}<span><b>${esc(name)}${w.mine&&!w.author?' <small>(vous)</small>':''}</b><small>${esc(dayLabel(s, w.day))}</small></span><span class="ios-kind ${KIND_CLASS[w.kind]}">${esc(WALL_KINDS[w.kind])}</span></header><p>${esc(w.text)}</p><footer><button class="${w.liked?'on':''}" data-react="${w.id}" aria-pressed="${w.liked}" aria-label="Soutenir"><svg viewBox="0 0 20 20"><path d="M10 17s-6.5-4-6.5-8.6A3.6 3.6 0 0 1 10 6.3a3.6 3.6 0 0 1 6.5 2.1C16.5 13 10 17 10 17z"/></svg>${w.likes}</button>${w.mine?'':`<button data-note="${w.id}" ${known(w.id)?'disabled':''}><svg viewBox="0 0 20 20"><path d="M6 3.5h8a1 1 0 0 1 1 1v12l-5-3-5 3v-12a1 1 0 0 1 1-1z"/></svg>${known(w.id)?'Dans le carnet':'Noter au carnet'}</button>`}</footer></article>`; }).join('') || '<p class="ios-empty">Rien dans cette catégorie.</p>'}</div>
   <p class="ios-footnote">Une rumeur notée au carnet reste une rumeur tant que sa source n’est pas établie.</p></div>`);
 }

 // ---------- 3. Portefeuille et virements ----------
 function walletApp(s){
  const left = Math.max(0, RP_LIMITS.dailyTransfer - s.rp.transfers.total);
  return appView('wallet', `${nav('home','')}<div class="ios-scroll"><h1 class="ios-large">Portefeuille</h1>
   <div class="ios-card"><div class="c-top"><span class="c-crest">D</span><span>ANHS · POINTS PRIVÉS</span></div><b>${fmt(s.pp)} <small>PP</small></b><div class="c-bottom"><span>${esc(s.name.toUpperCase())}</span><span>CLASSE D · 1<sup>re</sup> ANNÉE</span></div></div>
   <div class="ios-wallet-actions"><button data-go="transfer"><span><svg viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Envoyer</button><button data-launch="pacts"><span><svg viewBox="0 0 28 28">${SVG.pacts}</svg></span>Pactes</button></div>
   <div class="ios-list"><div class="ios-row"><span>Disponible</span><b>${fmt(s.pp)} PP</b></div>${s.contract?.status==='reserved'?'<div class="ios-row"><span>Dépôt réservé</span><b>4 000 PP</b></div>':''}<div class="ios-row"><span>Virements possibles aujourd’hui</span><b>${fmt(Math.min(left, s.pp))} PP</b></div><div class="ios-row"><span>Points de classe</span><b>${fmt(s.pc)} PC</b></div></div>
   <div class="ios-group-title">Dernières opérations</div>
   <div class="ios-list">${s.ledger.length ? s.ledger.slice(0, 30).map(e => `<div class="ios-row ios-tx"><span class="tx-icon ${e.amount>0?'in':''}">${e.amount>0?'+':'−'}</span><span><b>${esc(e.motif)}</b><small>${esc(DAYS[e.day-1])} · Jour ${e.day}</small></span><b class="${e.amount>0?'pos':''}">${e.amount>0?'+':''}${fmt(e.amount)}</b></div>`).join('') : '<div class="ios-row"><span class="ios-muted">Aucune transaction. Vos points vous appartiennent.</span></div>'}</div>
   <p class="ios-footnote">Les virements déplacent des points existants : ils n’en créent pas. Plafond de ${fmt(RP_LIMITS.dailyTransfer)} PP par jour. En session, l’hôte valide chaque virement une seule fois, même après une coupure.</p></div>`);
 }
 function transferApp(s, to){
  const left = Math.max(0, Math.min(RP_LIMITS.dailyTransfer - s.rp.transfers.total, s.pp));
  return appView('transfer', `${nav('wallet','Envoyer des PP','Portefeuille')}<form class="ios-scroll" data-transfer>
   <div class="ios-group-title">Destinataire</div>
   <div class="ios-people">${students().map(([id, p]) => `<label class="ios-person ${to===id?'on':''}"><input type="radio" name="to" value="${id}" ${to===id?'checked':''}>${avatar(id,'m')}<span>${esc(p.short)}</span></label>`).join('')}</div>
   <div class="ios-amount"><input name="amount" inputmode="numeric" pattern="[0-9]*" placeholder="0" aria-label="Montant en PP" autocomplete="off"><span>PP</span></div>
   <div class="ios-chips tight center">${[500,1000,2000,5000].map(v => `<button type="button" class="ios-chip" data-amount="${v}">${fmt(v)}</button>`).join('')}</div>
   <div class="ios-list"><input class="ios-input" name="motif" maxlength="60" placeholder="Motif (facultatif) : remboursement, aide…"></div>
   <p class="ios-footnote">Disponible pour un virement aujourd’hui : ${fmt(left)} PP. Entre ${fmt(RP_LIMITS.transferMin)} et ${fmt(RP_LIMITS.transferMax)} PP par envoi.</p>
   <button class="ios-primary" type="submit">Envoyer</button></form>`);
 }

 // ---------- 4. Pactes ----------
 const STATUS = {signe:'En cours', tenu:'Tenu', rompu:'Rompu', refuse:'Refusé'};
 function pactsApp(s){
  const active = s.rp.pacts.filter(p => p.status==='signe'), past = s.rp.pacts.filter(p => p.status!=='signe');
  const card = p => { const late = p.due < s.day, today = p.due===s.day; return `<article class="ios-pact ${p.status}"><header>${avatar(p.with,'s')}<span><b>${esc(p.title)}</b><small>avec ${esc(PEOPLE[p.with].name)} · ${p.visibility==='public'?'public':'privé'}</small></span><span class="ios-kind ${p.status==='signe'?(late?'k-late':today?'k-today':'k-fait'):p.status==='tenu'?'k-ok':'k-rumeur'}">${p.status==='signe'?(late?'Échéance dépassée':today?'Aujourd’hui':'Jusqu’à '+DAYS[p.due-1].toLowerCase()):STATUS[p.status]}</span></header><p>${esc(p.terms)}</p>${p.status==='signe'?`<footer><button class="ok" data-resolve="${p.id}" data-outcome="tenu">Pacte tenu</button><button class="ko" data-resolve="${p.id}" data-outcome="rompu">Rompre</button></footer>`:''}</article>`; };
  return appView('pacts', `${nav('home','','Accueil','<button class="ios-icon-btn" data-go="newpact" aria-label="Nouveau pacte"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button>')}<div class="ios-scroll"><h1 class="ios-large">Pactes</h1><p class="ios-subtitle">Des engagements écrits entre élèves. Votre parole a un prix : la tenir rapporte de la confiance, la rompre en coûte.</p>
   <div class="ios-group-title">En cours · ${active.length}/${RP_LIMITS.active}</div>
   ${active.length ? active.map(card).join('') : '<div class="ios-list"><button class="ios-row" data-go="newpact"><span class="ios-link">Proposer un premier pacte</span>'+CHEVRON+'</button></div>'}
   ${past.length ? `<div class="ios-group-title">Historique</div>${past.map(card).join('')}` : ''}
   <p class="ios-footnote">L’hôte enregistre la signature et l’issue. En session, l’autre joueur signe à son tour ; un pacte public apparaît sur le Mur.</p></div>`);
 }
 function newPactApp(s, withId){
  return appView('newpact', `${nav('pacts','Nouveau pacte','Pactes')}<form class="ios-scroll" data-pact>
   <div class="ios-group-title">Avec</div>
   <div class="ios-people">${students().map(([id, p]) => `<label class="ios-person ${withId===id?'on':''}"><input type="radio" name="with" value="${id}" ${withId===id?'checked':''}>${avatar(id,'m')}<span>${esc(p.short)}</span><small>${trustLabel(s.relationships[id].trust)}</small></label>`).join('')}</div>
   <div class="ios-group-title">Objet</div>
   <div class="ios-list"><input class="ios-input" name="title" maxlength="${RP_LIMITS.title}" placeholder="Ex. : Réviser ensemble chaque soir"></div>
   <div class="ios-group-title">Termes</div>
   <div class="ios-list"><textarea class="ios-textarea" name="terms" maxlength="${RP_LIMITS.terms}" rows="3" placeholder="Qui fait quoi, et ce qui arrive si l’un manque à sa parole."></textarea></div>
   <div class="ios-group-title">Échéance</div>
   <div class="ios-chips tight">${DAYS.map((d, i) => i+1 < s.day ? '' : `<label class="ios-chip ${i+1===Math.min(7, s.day+1)?'on':''}"><input type="radio" name="due" value="${i+1}" ${i+1===Math.min(7, s.day+1)?'checked':''}>${esc(d)}</label>`).join('')}</div>
   <div class="ios-group-title">Visibilité</div>
   <div class="ios-segment" role="radiogroup"><label class="on"><input type="radio" name="visibility" value="prive" checked>Privé</label><label><input type="radio" name="visibility" value="public">Public · sur le Mur</label></div>
   <p class="ios-footnote">Un élève signe s’il vous fait assez confiance : « Ouverture » pour un pacte privé, davantage pour un pacte public. Votre binôme est plus indulgent.</p>
   <button class="ios-primary" type="submit">Proposer le pacte</button></form>`);
 }

 // ---------- Dossier et classement ----------
 function profileApp(s){
  const skills = {academic:'Académique', observation:'Observation', communication:'Communication', composure:'Sang-froid'};
  const bar = (label, v, cls = '') => `<div class="ios-row ios-meter ${cls}"><span>${label}</span><span class="m-track"><i style="width:${v}%"></i></span><b>${v}</b></div>`;
  return appView('profile', `${nav('home','')}<div class="ios-scroll"><h1 class="ios-large">Dossier</h1>
   <div class="ios-list ios-profile-card">${avatar('me','l')}<span><b>${esc(s.name)}</b><small>Classe D · Première année · ${esc(ARCHETYPES[s.archetype]?.label ?? 'Élève')}</small></span></div>
   <div class="ios-list"><div class="ios-row"><span>Binôme</span><b>${s.partner?esc(PEOPLE[s.partner].name):'Aucun'}</b></div></div>
   <div class="ios-group-title">Compétences</div>
   <div class="ios-list">${Object.entries(skills).map(([id, l]) => bar(l, s.stats[id])).join('')}</div>
   <div class="ios-group-title">État</div>
   <div class="ios-list">${bar('Énergie', s.energy, s.energy<=25?'warn':'')}${bar('Stress', s.stress, s.stress>=70?'warn':'alt')}</div>
   <div class="ios-group-title">Cette semaine</div>
   <div class="ios-list"><div class="ios-row"><span>Préparation</span><b>${s.prep}</b></div><div class="ios-row"><span>Aide à la classe</span><b>${s.support}</b></div><div class="ios-row"><span>Révisions</span><b>${s.studyCount}</b></div></div>
   ${s.rep ? `<div class="ios-group-title">Réputation</div>
   <div class="ios-list"><div class="ios-row"><span>Titre</span><b>${esc(extras.repTitle ? extras.repTitle(s) : '—')}</b></div>${bar('Fiabilité', s.rep.reliability)}${bar('Influence', s.rep.influence)}${bar('Visibilité', s.rep.visibility, 'alt')}</div>` : ''}
   ${extras.conditions ? `<div class="ios-group-title">États</div>
   <div class="ios-list">${extras.conditions(s).map(c => `<div class="ios-row"><i class="ios-state-dot ${c.kind}"></i><span class="ios-row-text"><b>${esc(c.label)}</b><small>${esc(c.detail)}</small></span></div>`).join('') || '<div class="ios-row"><span class="ios-muted">Aucun état particulier.</span></div>'}</div>` : ''}</div>`);
 }
 function rankApp(s){
  const groups = [['A',1200],['B',1000],['C',800],['D',s.pc]].sort((a, b) => b[1]-a[1]);
  return appView('rank', `${nav('home','')}<div class="ios-scroll"><h1 class="ios-large">Classement</h1>
   <div class="ios-list">${groups.map(([name, pc], i) => `<div class="ios-row ios-rank ${name==='D'?'you':''}"><span class="r-pos">${i+1}</span><span><b>Classe ${name}</b>${name==='D'?'<small>Votre classe</small>':''}</span><b>${fmt(pc)} PC</b></div>`).join('')}</div>
   <p class="ios-footnote">${s.exam?`Premier examen : ${s.exam.classScore}/100 pour la classe · ${s.exam.reward>0?'+':''}${s.exam.reward} PC.`:'Le contrat de confiance aura lieu vendredi. Un binôme bien préparé compte, une classe bien préparée compte davantage.'} Préparation collective accumulée : ${s.support}.</p></div>`);
 }


 function mapApp(s){
  const places = Object.entries(LOCATIONS);
  return appView('map', `${nav('home','')}<div class="ios-scroll"><h1 class="ios-large">Plan</h1>
   ${extras.plan ? '<div class="ios-plan"><canvas width="832" height="544" aria-label="Plan du campus"></canvas><div class="ios-plan-pins"></div></div>' : ''}
   <div class="ios-group-title">Lieux</div>
   <div class="ios-list">${places.map(([id, l], i) => `<button class="ios-row ios-place ${id===s.scene?'here':''}" ${id===s.scene?'disabled':`data-travel-to="${id}"`}><span class="p-num">${String(i).padStart(2,'0')}</span><span><b>${esc(l.name)}</b><small>${id===s.scene?'Vous êtes ici':esc(l.subtitle)}</small></span>${id===s.scene?'':'<svg viewBox="0 0 8 14"><path d="M1.5 1.5L6.5 7l-5 5.5"/></svg>'}</button>`).join('')}</div>
   <p class="ios-footnote">Touchez un lieu pour vous y rendre. Le trajet ne consomme aucun créneau.</p></div>`);
 }
 function drawPlan(view, s){
  const canvas = view.querySelector('.ios-plan canvas');
  if(!canvas || !extras.plan) return;
  const {pins, me} = extras.plan(canvas), pct = (v, max) => (v/max*100).toFixed(2)+'%';
  view.querySelector('.ios-plan-pins').innerHTML = pins.map(p => `<button class="ios-pin ${p.id===s.scene?'here':''}" style="left:${pct(p.x,canvas.width)};top:${pct(p.y,canvas.height)}" ${p.id===s.scene?'disabled':`data-travel-to="${p.id}"`} aria-label="Rejoindre ${esc(LOCATIONS[p.id].name)}">${p.num}</button>`).join('') + (me ? `<span class="ios-me" style="left:${pct(me.x,canvas.width)};top:${pct(me.y,canvas.height)}" aria-label="Votre position"></span>` : '');
  view.querySelectorAll('.ios-plan-pins [data-travel-to]').forEach(b => b.onclick = () => open.travel(b.dataset.travelTo));
 }
 function journalApp(s, tab){
  tab = ['knowledge','memories','journal'].includes(tab) ? tab : 'knowledge';
  const items = tab==='knowledge' ? s.knowledge : tab==='memories' ? s.memories : s.journal;
  const tabs = [['knowledge','Informations'],['memories','Souvenirs'],['journal','Journal']];
  return appView('journal', `${nav('home','')}<div class="ios-scroll"><h1 class="ios-large">Carnet</h1>
   <div class="ios-seg" role="tablist">${tabs.map(([id, l]) => `<button role="tab" aria-selected="${id===tab}" class="${id===tab?'on':''}" data-journal-tab="${id}">${l}</button>`).join('')}</div>
   ${items.length ? `<div class="ios-list">${items.map(k => tab==='knowledge'
    ? `<div class="ios-note"><small>${esc(k.kind)} · Jour ${k.day}</small><p>${esc(k.title)}</p><small>Source : ${esc(k.source)}</small></div>`
    : `<div class="ios-note"><small>${esc(DAYS[k.day-1])} · Jour ${k.day}</small><p>${esc(k.text)}</p></div>`).join('')}</div>`
    : '<p class="ios-empty">Rien pour l’instant. Parlez à Nao ou à Daichi, ou observez la cour centrale.</p>'}</div>`);
 }
 function examApp(s){
  const e = s.exam;
  const rules = ['Choisissez un partenaire avant vendredi.','Révisez à la bibliothèque pour préparer votre dossier.','Aidez les autres binômes en salle de classe pour améliorer la moyenne.','Un contrat de tutorat peut réserver 4 000 PP jusqu’à une nouvelle séance.','Vendredi, restituez votre dossier en salle D : trois questions évaluent votre lecture des faits.'];
  const body = e
   ? `<p class="ios-lead">Résultats officiels du contrat de confiance${s.partner?`, en binôme avec ${esc(PEOPLE[s.partner].short)}`:''}.</p>
    <div class="ios-tiles"><div><b>${e.score}</b><small>Votre binôme, sur 100</small></div><div><b>${e.classScore}</b><small>Classe D, sur 100</small></div><div><b>${e.reward>0?'+':''}${e.reward}</b><small>Points de classe</small></div></div>
    <div class="ios-group-title">Détail</div>
    <div class="ios-list"><div class="ios-row"><span>Exactitude</span><b>${e.exact} / 50</b></div><div class="ios-row"><span>Présentation</span><b>${e.oral} / 30</b></div><div class="ios-row"><span>Engagements</span><b>${e.commitments} / 20</b></div>${Number.isFinite(e.reading)?`<div class="ios-row"><span>Lecture du dossier</span><b>${e.reading} / 3</b></div>`:''}</div>
    <div class="ios-group-title">Classement de l’examen</div>
    <div class="ios-list">${e.ranking.map(r => `<div class="ios-row ios-rank ${r.id==='d'?'you':''}"><span class="r-pos">${e.ranking.filter(o => o.score>r.score).length+1}</span><span><b>${esc(r.name)}</b>${r.id==='d'?'<small>Votre classe</small>':''}</span><b>${r.score}/100</b></div>`).join('')}</div>`
   : `<p class="ios-lead">Le contrat de confiance : un dossier, deux élèves et une promesse à tenir. Vendredi, salle de classe D.</p>
    <div class="ios-tiles"><div><b>50</b><small>Exactitude</small></div><div><b>30</b><small>Présentation</small></div><div><b>20</b><small>Engagements</small></div></div>
    <div class="ios-group-title">Règles</div>
    <div class="ios-list">${rules.map(r => `<div class="ios-row"><span>${esc(r)}</span></div>`).join('')}</div>
    <div class="ios-group-title">Récompenses</div>
    <div class="ios-list"><div class="ios-row"><span>1<sup>re</sup> place</span><b>+80 PC</b></div><div class="ios-row"><span>2<sup>e</sup> place</span><b>+40 PC</b></div><div class="ios-row"><span>3<sup>e</sup> place</span><b>+10 PC</b></div><div class="ios-row"><span>4<sup>e</sup> place</span><b>−30 PC</b></div></div>
    <p class="ios-footnote">Une égalité partage les récompenses des places occupées. Aucun élève n’est exclu.</p>
    <button class="ios-cta" data-travel-to="${s.day===5?'classroom':'library'}">${s.day===5?'Rejoindre la salle D':'Réviser à la bibliothèque'}</button>`;
  return appView('exam', `${nav('home','')}<div class="ios-scroll"><h1 class="ios-large">Examen</h1>${body}</div>`);
 }
 function summaryApp(s){
  const best = Object.entries(s.relationships).sort((a, b) => b[1].trust-a[1].trust)[0][0];
  const path = s.support>=14 ? 'Vous avez choisi de soutenir la classe, même quand cela vous coûtait du temps.' : s.prep>=24 ? 'Vous avez construit votre réussite par une préparation méthodique.' : 'Vous avez commencé à découvrir les règles et ceux qui vivent avec elles.';
  const promise = s.contract?.status==='fulfilled' ? 'Une promesse tenue vous lie à votre partenaire.' : s.contract?.status==='expired' ? 'Une promesse manquée restera à réparer.' : 'Vos alliances se sont construites au fil des échanges.';
  const done = (s.requests ?? []).filter(q => q.status==='done').length, conduct = (s.conductLog ?? []).reduce((t, e) => t+e.delta, 0);
  return appView('summary', `${nav('home','')}<div class="ios-scroll"><h1 class="ios-large">Bilan</h1>
   <p class="ios-lead">${esc(s.name)}, votre première semaine a laissé des traces. ${esc(path)}</p>
   <div class="ios-tiles"><div><b>${fmt(s.pc)}</b><small>Points de classe</small></div><div><b>${s.exam?s.exam.score:'—'}</b><small>Votre dossier</small></div><div><b>${done}</b><small>Demandes tenues</small></div></div>
   <div class="ios-list" style="margin-top:calc(22*var(--pt))"><div class="ios-row"><span>Binôme</span><b>${s.partner?esc(PEOPLE[s.partner].short):'Aucun'}</b></div><div class="ios-row"><span>Meilleure confiance</span><b>${esc(PEOPLE[best].short)}</b></div>${extras.repTitle?`<div class="ios-row"><span>Réputation</span><b>${esc(extras.repTitle(s))}</b></div>`:''}${s.conductLog?`<div class="ios-row"><span>Conduite sur la semaine</span><b>${conduct>0?'+':''}${conduct} PC</b></div>`:''}</div>
   <p class="ios-footnote">${esc(promise)} La démo s’achève ici ; le campus reste ouvert. Une autre approche peut donner une autre semaine.</p>
   <button class="ios-cta" data-phone-close>Continuer à explorer</button>${open.newGame?'<button class="ios-cta secondary" data-new-game>Nouvelle partie</button>':''}</div>`);
 }

 // ---------- Rendu et navigation ----------
 const VIEWS = {home, messages:messagesApp, newdm:newDmApp, room:roomApp, agenda:agendaApp, contacts:contactsApp, contact:contactApp, wallet:walletApp, transfer:transferApp, persona:personaApp, wall:wallApp, pacts:pactsApp, newpact:newPactApp, profile:profileApp, rank:rankApp, map:mapApp, journal:journalApp, exam:examApp, summary:summaryApp};
 function render(app = 'home', arg = null, {anim = 'push', origin = null, focus = true, from = null, keepScroll = false} = {}){
  const s = S(), screen = $('#modal .ios-screen');
  if(!screen) return;
  syncWorld(s);
  if(app==='room'){ if(arg==='admin' || arg.startsWith('dm:')){ s.messagesRead = s.messages.length; } markRead(s, arg); openedRooms.add(arg); }
  const prevScroll = keepScroll ? screen.querySelector('.ios-scroll')?.scrollTop : null;
  route = {app, arg, from: from ?? (app===route.app ? route.from : null)};
  const view = VIEWS[app] ?? home;
  screen.classList.toggle('light', app!=='home');
  screen.querySelector('.ios-status-slot').innerHTML = statusBar(s);
  const stage = screen.querySelector('.ios-stage');
  stage.innerHTML = view(s, arg);
  if(app==='wall') markWallSeen(s);
  persist();
  const el = stage.firstElementChild;
  if(anim){ if(origin) el.style.transformOrigin = origin; el.classList.add('anim-'+anim); }
  const scroller = el.querySelector('.ios-scroll');
  if(app==='room' && scroller) scroller.scrollTop = scroller.scrollHeight; else if(prevScroll!=null && scroller) scroller.scrollTop = prevScroll;
  wire(el);
  if(app==='map') drawPlan(el, s);
  if(focus) queueMicrotask(() => (app==='home' ? stage : (app==='room' ? el.querySelector('.c-field') : null) ?? el.querySelector('.ios-back') ?? stage).focus({preventScroll:true}));
 }
 function launch(id, btn){
  let origin = null;
  const stage = $('#modal .ios-stage');
  if(btn && route.app==='home'){ const a = btn.getBoundingClientRect(), b = stage.getBoundingClientRect(); origin = `${a.left+a.width/2-b.left}px ${a.top+a.height/2-b.top}px`; }
  render(id, null, {anim:route.app==='home' ? 'launch' : 'push', origin});
 }
 function toast(text, bad = false){
  const el = $('#modal .ios-toast'); if(!el) return;
  el.textContent = text; el.classList.toggle('bad', bad); el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
 }
 function send(type, params){ const r = session.send(type, params); if(!r.ok) toast(r.message, true); return r; }

 function wire(view){
  const on = (sel, fn) => view.querySelectorAll(sel).forEach(b => b.addEventListener('click', e => fn(b, e)));
  on('[data-launch]', b => launch(b.dataset.launch, b));
  on('[data-back]', b => { const to = b.dataset.back; render(to, b.dataset.arg || null, {anim:to==='home' ? 'home' : 'pop'}); });
  on('[data-go]', b => render(b.dataset.go, b.dataset.arg ?? null));
  on('[data-room]', b => render('room', b.dataset.room, {from:b.dataset.from ?? 'messages'}));
  on('[data-person]', b => render('contact', b.dataset.person));
  on('[data-travel-to]', b => open.travel(b.dataset.travelTo));
  on('[data-open-profile]', () => open.profile());
  on('[data-wall-filter]', b => { wallFilter = b.dataset.wallFilter; render('wall', null, {anim:null, focus:false, keepScroll:true}); });
  on('[data-react]', b => { send('wall.react', {post:b.dataset.react}); render('wall', null, {anim:null, focus:false, keepScroll:true}); });
  on('[data-note]', b => { const r = send('wall.note', {post:b.dataset.note}); if(r.ok) toast(r.message); render('wall', null, {anim:null, focus:false, keepScroll:true}); });
  on('[data-resolve]', b => {
   if(!b.dataset.confirm){ view.querySelectorAll('[data-confirm]').forEach(x => { delete x.dataset.confirm; x.textContent = x.dataset.outcome==='tenu' ? 'Pacte tenu' : 'Rompre'; }); b.dataset.confirm = '1'; b.textContent = b.dataset.outcome==='tenu' ? 'Confirmer : tenu' : 'Confirmer la rupture'; return; }
   const r = send('pact.resolve', {pact:b.dataset.resolve, outcome:b.dataset.outcome}); if(r.ok) toast(r.message, b.dataset.outcome==='rompu'); render('pacts', null, {anim:null, focus:false, keepScroll:true});
  });
  // Saisie : chips exclusives ou limitées
  view.querySelectorAll('.ios-chips, .ios-people, .ios-segment').forEach(group => group.addEventListener('change', e => {
   const input = e.target; if(!input.matches('input')) return;
   const max = Number(group.dataset.max || 0);
   if(input.type==='checkbox' && max && group.querySelectorAll('input:checked').length > max){ input.checked = false; toast(`${max} traits au maximum.`, true); }
   group.querySelectorAll('label').forEach(l => l.classList.toggle('on', l.querySelector('input')?.checked));
  }));
  on('[data-amount]', b => { const f = view.querySelector('[name=amount]'); f.value = b.dataset.amount; f.focus(); });
  on('[data-insert]', b => { const f = view.querySelector('.c-field'); if(!f.value.startsWith('/me ')) f.value = '/me ' + f.value; f.focus(); });
  // Formulaires
  const compose = view.querySelector('[data-compose]');
  if(compose) compose.addEventListener('submit', e => {
   e.preventDefault();
   const room = compose.dataset.compose, field = compose.querySelector('.c-field'), text = field.value;
   if(!text.trim()) return;
   const r = send('room.post', {room, text});
   if(!r.ok) return;
   const ids = new Set((r.replies ?? []).map(m => m.id));
   if(ids.size){ typing = {room, ids}; setTimeout(() => { if(typing?.room===room){ typing = null; if(route.app==='room' && route.arg===room) render('room', room, {anim:null, focus:true}); } }, 1100 + Math.min(900, text.length*12)); }
   render('room', room, {anim:null, focus:true});
  });
  on('[data-journal-tab]', b => render('journal', b.dataset.journalTab, {anim:null, focus:false}));
  view.querySelector('[data-phone-close]')?.addEventListener('click', () => $('#modal .modal-close')?.click());
  view.querySelector('[data-new-game]')?.addEventListener('click', () => open.newGame());
  const search = view.querySelector('#ios-contact-search');
  if(search) search.oninput = () => { const q = search.value.trim().toLowerCase(); view.querySelectorAll('.ios-letter').forEach(sec => { let any = false; sec.querySelectorAll('.ios-contact-row').forEach(r => { const ok = !q || r.dataset.name.includes(q); r.hidden = !ok; any ||= ok; }); sec.hidden = !any; }); };
  const persona = view.querySelector('[data-persona]');
  if(persona){
   const save = e => { e?.preventDefault(); const f = new FormData(persona); const r = send('profile.update', {bio:f.get('bio'), secret:f.get('secret'), hrp:f.get('hrp'), mood:f.get('mood'), traits:f.getAll('traits')}); if(r.ok){ toast('Fiche enregistrée'); render('home', null, {anim:'home'}); } };
   persona.addEventListener('submit', save);
   view.querySelector('[data-save-persona]')?.addEventListener('click', save);
  }
  const wallForm = view.querySelector('[data-wall-compose]');
  if(wallForm) wallForm.addEventListener('submit', e => { e.preventDefault(); const f = new FormData(wallForm); const r = send('wall.post', {text:f.get('text'), kind:f.get('kind'), anonymous:f.get('anonymous')==='on'}); if(r.ok){ toast(r.message); wallFilter = 'all'; render('wall', null, {anim:null, focus:false}); } });
  const tf = view.querySelector('[data-transfer]');
  if(tf) tf.addEventListener('submit', e => { e.preventDefault(); const f = new FormData(tf); if(!f.get('to')) return toast('Choisissez un destinataire.', true); const amount = Number(String(f.get('amount')).replace(/\s/g, '')); const r = send('pp.transfer', {to:f.get('to'), amount, motif:f.get('motif')}); if(r.ok){ toast(r.message); render('wallet', null, {anim:'pop'}); } });
  const pf = view.querySelector('[data-pact]');
  if(pf) pf.addEventListener('submit', e => { e.preventDefault(); const f = new FormData(pf); if(!f.get('with')) return toast('Choisissez un élève.', true); const r = send('pact.propose', {with:f.get('with'), title:f.get('title'), terms:f.get('terms'), due:Number(f.get('due')), visibility:f.get('visibility')}); if(r.ok){ toast(r.message, !r.accepted); render('pacts', null, {anim:'pop'}); } });
 }
 function banner(s){
  const legacy = legacyUnread(s);
  const rpNew = [...salons(s), ...Object.keys(s.rp.rooms).filter(r => r.startsWith('dm:'))].flatMap(room => (s.rp.rooms[room] ?? []).filter(m => m.seq > (s.rp.read[room] ?? 0) && m.author!==s.rp.playerId).map(m => ({...m, room})));
  const total = legacy + rpNew.length; if(!total) return;
  const latest = legacy ? {name:s.messages[0].from, text:s.messages[0].text, room:roomOfLegacy(s.messages[0].from)} : rpNew.sort((a, b) => b.seq - a.seq)[0];
  const el = $('#modal .ios-banner');
  const title = latest.room && !latest.room.startsWith('dm:') && latest.room!=='admin' ? `${latest.name} · ${roomName(latest.room)}` : latest.name;
  el.innerHTML = `<span class="b-icon">${appIcon('messages', s)}</span><span class="b-body"><span class="b-top"><b>${esc(title)}</b><time>maintenant</time></span><span class="b-text">${esc(latest.text)}</span>${total>1?`<small>+${total-1} autre${total>2?'s':''} message${total>2?'s':''}</small>`:''}</span>`;
  el.hidden = false;
  el.onclick = () => { el.hidden = true; if(latest.room) render('room', latest.room, {anim:'launch', origin:'50% 8%', from:'messages'}); else render('messages', null, {anim:'launch'}); };
  clearTimeout(bannerTimer); bannerTimer = setTimeout(() => { if(el.isConnected) el.classList.add('out'); }, 5200);
 }

 function show(app = 'home', arg = null){
  const s = S();
  if(!s.rp) migrateRp(s);
  syncWorld(s);
  unreadFrom = s.messagesRead ?? 0; openedRooms = new Set();
  if(!$('#modal .ios-screen')){
   openModal(`<div class="iphone-frame" aria-hidden="true"><i class="btn-action"></i><i class="btn-vol-up"></i><i class="btn-vol-down"></i><i class="btn-power"></i></div>
    <div class="iphone-bezel"><div class="ios-screen"><div class="ios-wallpaper" aria-hidden="true"></div><div class="ios-stage" tabindex="-1"></div><div class="ios-status-slot"></div><div class="ios-island" aria-hidden="true"></div><div class="ios-toast" role="status" aria-live="polite"></div><button class="ios-banner" hidden aria-label="Ouvrir le message"></button><button class="ios-home-bar" aria-label="Écran d’accueil"><i></i></button></div></div>
    <button class="iphone-lock" aria-label="Verrouiller le téléphone"></button>`, 'iphone');
   $('#modal .modal-close').setAttribute('aria-label', 'Fermer le téléphone');
   $('#modal .ios-home-bar').onclick = () => { if(route.app!=='home') render('home', null, {anim:'home'}); };
   $('#modal .iphone-lock').onclick = () => $('#modal .modal-close').click();
   route = {app:'home'};
   render(app, arg, {anim: app==='home' ? 'unlock' : 'launch', origin:'50% 50%'});
   if(app==='home') banner(s);
  } else render(app, arg, {anim:'launch', origin:'50% 50%'});
 }
 return {show, session, refresh(){ if($('#modal .ios-screen')) render(route.app, route.arg, {anim:null, focus:false, keepScroll:true}); }};
}
