import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,validateState,nextDay} from '../dist/engine.mjs';
import {migrateRp,applyCommand,command,syncWorld,unreadRoom,RP_LIMITS} from '../dist/roleplay.mjs';

const fresh=()=>migrateRp(createState('Mina'));
const run=(s,type,params)=>applyCommand(s,command(type,params,s.rp.playerId));

test('RP : une ancienne sauvegarde reçoit la couche roleplay et la conserve après relecture',()=>{
 const old=createState('Mina');assert.equal(old.rp,undefined);
 const s=migrateRp(validateState(JSON.parse(JSON.stringify(old))));
 assert.ok(s.rp.playerId);assert.ok(s.rp.rooms.classe.length>=2);assert.ok(s.rp.wall.length>=2);
 run(s,'profile.update',{bio:'Arrivée de Kyoto.',traits:['Calme','Loyal'],mood:'Concentré',secret:'Elle cherche sa sœur.'});
 const again=migrateRp(validateState(JSON.parse(JSON.stringify(s))));
 assert.deepEqual(again.rp.profile.traits,['Calme','Loyal']);assert.equal(again.rp.profile.secret,'Elle cherche sa sœur.');
});
test('RP : fiche limitée à trois traits connus',()=>{
 const s=fresh();
 assert.equal(run(s,'profile.update',{traits:['Calme','Loyal','Curieux','Franc']}).ok,false);
 assert.equal(run(s,'profile.update',{traits:['Calme','Inventé']}).ok,true);assert.deepEqual(s.rp.profile.traits,['Calme']);
});
test('RP : /me devient une action, ((…)) une remarque hors-RP, et un PNJ répond',()=>{
 const s=fresh();
 const a=run(s,'room.post',{room:'classe',text:'/me range ses fiches'});assert.equal(a.msg.mode,'action');assert.equal(a.msg.text,'range ses fiches');assert.equal(a.replies.length,0);
 const b=run(s,'room.post',{room:'classe',text:'((je reviens dans 5 min))'});assert.equal(b.msg.mode,'hrp');
 const c=run(s,'room.post',{room:'classe',text:'Qui veut réviser pour l’examen ?'});assert.equal(c.msg.mode,'rp');assert.equal(c.replies.length,1);
 assert.equal(run(s,'room.post',{room:'binome',text:'Salut'}).ok,false,'pas de salon binôme sans partenaire');
 assert.ok(unreadRoom(s,'classe')>=1);
});
test('RP : un virement rejoué n’est débité qu’une fois',()=>{
 const s=fresh(),pp=s.pp,cmd=command('pp.transfer',{to:'mika',amount:2000,motif:'gâteaux'},s.rp.playerId);
 assert.equal(applyCommand(s,cmd).ok,true);const dup=applyCommand(s,cmd);
 assert.equal(dup.duplicate,true);assert.equal(s.pp,pp-2000);assert.equal(s.ledger.filter(e=>e.amount===-2000).length,1);
 assert.equal(s.relationships.mika.trust,27);
 run(s,'pp.transfer',{to:'mika',amount:2000});assert.equal(s.relationships.mika.trust,27,'un seul gain de confiance par jour et par élève');
});
test('RP : montants invalides, solde et plafond quotidien',()=>{
 const s=fresh();
 for(const amount of [0,50,1.5,-100,RP_LIMITS.transferMax+1])assert.equal(run(s,'pp.transfer',{to:'nao',amount}).ok,false);
 assert.equal(run(s,'pp.transfer',{to:'inconnu',amount:500}).ok,false);
 assert.equal(run(s,'pp.transfer',{to:'nao',amount:20000}).ok,true);assert.equal(run(s,'pp.transfer',{to:'reina',amount:10000}).ok,true);
 assert.equal(run(s,'pp.transfer',{to:'daichi',amount:100}).ok,false,'plafond atteint');
 nextDay(s);syncWorld(s);assert.equal(run(s,'pp.transfer',{to:'daichi',amount:100}).ok,true,'plafond remis à zéro le lendemain');
 s.pp=50;assert.equal(run(s,'pp.transfer',{to:'daichi',amount:100}).ok,false);
});
test('RP : un pacte dépend de la confiance et sa rupture se paie',()=>{
 const s=fresh();
 const refused=run(s,'pact.propose',{with:'ren',title:'Échange de fiches',terms:'Je partage mes notes.',due:3,visibility:'public'});
 assert.equal(refused.accepted,false);assert.equal(s.rp.pacts[0].status,'refuse');
 s.relationships.reina.trust=50;
 const ok=run(s,'pact.propose',{with:'reina',title:'Réviser chaque soir',terms:'Une heure à la bibliothèque jusqu’à jeudi.',due:4,visibility:'public'});
 assert.equal(ok.accepted,true);assert.ok(s.rp.wall.some(w=>w.text.includes('pacte public')));
 assert.equal(run(s,'pact.propose',{with:'nao',title:'x',terms:'y',due:0,visibility:'prive'}).ok,false,'échéance passée');
 const trust=s.relationships.reina.trust,rel=s.rep.reliability;
 assert.equal(run(s,'pact.resolve',{pact:ok.pact.id,outcome:'rompu'}).ok,true);
 assert.equal(s.relationships.reina.trust,trust-8);assert.equal(s.rep.reliability,rel-6);
 assert.ok(s.rp.wall.some(w=>w.text.startsWith('Pacte public rompu')));
 assert.equal(run(s,'pact.resolve',{pact:ok.pact.id,outcome:'tenu'}).ok,false,'un pacte ne se résout qu’une fois');
});
test('RP : le Mur publie anonymement et alimente le carnet une seule fois',()=>{
 const s=fresh();
 assert.equal(run(s,'wall.post',{text:'Le distributeur est en panne.',kind:'fait',anonymous:true}).ok,true);
 assert.equal(s.rp.wall[0].author,null);assert.equal(run(s,'wall.post',{text:'x',kind:'inconnu'}).ok,false);
 const rumor=s.rp.wall.find(w=>w.id==='w1a');
 assert.equal(run(s,'wall.note',{post:rumor.id}).ok,true);assert.equal(run(s,'wall.note',{post:rumor.id}).ok,false);
 assert.equal(s.knowledge.find(k=>k.id==='mur-w1a').kind,'Rumeur');
 const likes=rumor.likes;run(s,'wall.react',{post:rumor.id});assert.equal(rumor.likes,likes+1);run(s,'wall.react',{post:rumor.id});assert.equal(rumor.likes,likes);
});
test('RP : le contenu des PNJ arrive jour après jour sans doublon',()=>{
 const s=fresh(),n=s.rp.wall.length;syncWorld(s);assert.equal(s.rp.wall.length,n);
 nextDay(s);syncWorld(s);assert.ok(s.rp.wall.length>n);assert.ok(s.rp.rooms.classe.some(m=>m.id==='c2a'));
});
