import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,PEOPLE,LOCATIONS,nextDay,acceptRequest,requestOf} from '../dist/engine.mjs';
import {canStand} from '../dist/maps.mjs';
import {decide,daySchedule,planFor,presentIn,npcScene,moodOf,behaviorOf,greetingFor,dmContext,memoryOf,whereabouts} from '../dist/npc-ai.mjs';
import {migrateRp,applyCommand,command} from '../dist/roleplay.mjs';

const at=(s,day,actions)=>{s.day=day;s.actions=actions;return s;};
const ids=Object.keys(PEOPLE);

test('IA : chaque créneau de la semaine donne un lieu valide et une place praticable',()=>{
 const s=createState('Mina');
 for(let day=1;day<=7;day++)for(let actions=3;actions>=0;actions--){at(s,day,actions);
  for(const id of ids){const sc=npcScene(s,id);assert.ok(sc===null||Object.hasOwn(LOCATIONS,sc),`${id} J${day}`);assert.notEqual(sc,'dorm','personne n’entre dans la chambre du joueur');}
  for(const scene of Object.keys(LOCATIONS)){const pos=presentIn(s,scene);for(const [id,p] of Object.entries(pos))assert.ok(canStand(scene,p.x,p.y),`${id} praticable en ${scene}`);
   const list=Object.values(pos);for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++)assert.ok(Math.hypot(list[i].x-list[j].x,list[i].y-list[j].y)>=30,'pas deux personnages au même endroit');}
 }
});
test('IA : le même état donne toujours le même emploi du temps',()=>{
 const a=createState('Mina'),b=createState('Mina');at(a,3,2);at(b,3,2);
 for(const id of ids)assert.deepEqual(daySchedule(a,id),daySchedule(b,id));
});
test('IA : les rendez-vous indispensables sont tenus',()=>{
 const s=createState('Mina');
 for(let actions=3;actions>=0;actions--)assert.equal(npcScene(at(s,1,actions),'reina'),'library','Reina attend à la bibliothèque le premier jour');
 for(let actions=3;actions>=0;actions--){at(s,5,actions);assert.equal(npcScene(s,'hayase'),'classroom');for(const id of ['reina','nao','mika','daichi','sora','yui'])assert.equal(npcScene(s,id),'classroom','toute la classe attend la restitution');}
 at(s,4,2);assert.equal(decide(s,'daichi').activity,'train');assert.match(decide(s,'daichi').reason,/entraîneur/);
 at(s,2,3);assert.equal(npcScene(s,'yui'),'courtyard','Yui reste dans la cour pour la demande de Mika');
 for(let day=1;day<=4;day++)for(const id of ['reina','nao','mika','daichi'])assert.ok([3,2,1,0].some(a=>npcScene(at(s,day,a),id)),`${id} joignable le jour ${day}`);
});
test('IA : la semaine varie, les élèves rentrent le soir et l’examen pèse sur les choix',()=>{
 const s=createState('Mina');const acts=new Set();let away=0,studyJ4=0,studyJ1=0;
 for(let day=1;day<=7;day++)for(let a=3;a>=0;a--){at(s,day,a);for(const id of ids){const d=decide(s,id);acts.add(d.activity);if(a===0&&d.activity==='away')away++;if(day===4&&d.activity==='study')studyJ4++;if(day===1&&d.activity==='study')studyJ1++;}}
 assert.ok(acts.size>=8,'au moins huit activités différentes');assert.ok(away>=25,'la plupart rentrent à 19 h 30');assert.ok(studyJ4>=studyJ1,'on révise davantage à l’approche de l’examen');
 at(s,3,0);s.partner='mika';const before=daySchedule(createState('x'),'mika',3).filter(d=>d.activity==='study').length;assert.ok(daySchedule(s,'mika',3).filter(d=>d.activity==='study').length>=before,'un binôme révise davantage');
});
test('IA : la mémoire change l’humeur et le comportement',()=>{
 const s=migrateRp(createState('Mina'));at(s,2,3);
 assert.equal(moodOf(s,'reina').key,'reserve');
 s.relationships.reina.trust=50;const r=applyCommand(s,command('pact.propose',{with:'reina',title:'Réviser',terms:'Chaque soir',due:3,visibility:'prive'},s.rp.playerId));assert.equal(r.accepted,true);
 applyCommand(s,command('pact.resolve',{pact:r.pact.id,outcome:'rompu'},s.rp.playerId));
 assert.equal(moodOf(s,'reina').key,'froid');assert.ok(memoryOf(s,'reina').some(m=>m.kind==='betrayed'));
 const b=behaviorOf(s,'reina');assert.equal(b.avoid,true);assert.equal(b.wantsTalk,false);
 s.ai={met:['reina']};assert.match(greetingFor(s,'reina','intro'),/rompu/);
 assert.match(dmContext(s,'reina','hello'),/rompu/);
 nextDay(s);nextDay(s);nextDay(s);assert.notEqual(moodOf(s,'reina').key,'froid','la rancune s’estompe');
});
test('IA : un élève qui a une demande vient vers le joueur, puis se calme une fois écouté',()=>{
 const s=createState('Mina');at(s,1,3);
 const offer=s.requests.find(q=>q.status==='offered');assert.ok(offer,'une demande est proposée');
 const giver=['daichi','sora','mika','reina','nao','yui'].find(id=>behaviorOf(s,id).offer);assert.ok(giver);
 if(npcScene(s,giver))assert.equal(behaviorOf(s,giver).wantsTalk,true);
 s.dailyTalks.push(giver);assert.equal(behaviorOf(s,giver).wantsTalk,false);
});
test('IA : première rencontre puis répliques selon l’activité ; messages selon la disponibilité',()=>{
 const s=createState('Mina');at(s,3,2);
 assert.equal(greetingFor(s,'daichi','Bonjour, je suis Daichi.'),'Bonjour, je suis Daichi.');
 const second=greetingFor(s,'daichi','Bonjour, je suis Daichi.');assert.notEqual(second,'Bonjour, je suis Daichi.');assert.ok(second.length>10);
 at(s,2,0);const away=ids.find(id=>id!=='hayase'&&planFor(s,id).mode==='away');assert.ok(away);assert.match(dmContext(s,away,'hello'),/dortoir/);
 at(s,2,3);assert.match(dmContext(s,'reina','hello'),/bibliothèque/);
 const w=whereabouts(s,'reina');assert.equal(w.place,'La bibliothèque');assert.equal(w.time,'15:30');
});
