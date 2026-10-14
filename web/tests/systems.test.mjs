import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,performAction,selectPartner,signContract,nextDay,resolveExam,validateState,conditions,energyCost,repTitle,buyItem,useItem,giveItem,acceptRequest,declineRequest,requestOf,listen,conductCharter,learnConductRule,renMethod} from '../dist/engine.mjs';
const at=(s,scene,id)=>{s.scene=scene;return performAction(s,id);};
const pass=(s,days)=>{for(let i=0;i<days;i++)assert.equal(nextDay(s).ok,true);};

test('Conduite : la règle invisible fait perdre des PC sans être expliquée',()=>{
 const s=createState();pass(s,4);
 assert.deepEqual(s.conductLog.map(e=>e.delta).reverse(),[0,0,-10,-10]);assert.equal(s.pc,580);
 assert.ok(s.messages.some(m=>m.text.includes('Motif non communiqué')));
 assert.equal(conductCharter(s).ok,false);
 s.scene='classroom';s.partner='reina';s.examDraft={answers:[1,2,0]};resolveExam(s,'balanced');const before=s.pc;nextDay(s);assert.equal(s.pc,before-20);
});
test('Conduite : le tutorat, la charte et la règle découverte protègent la classe',()=>{
 const s=createState();for(let d=1;d<=4;d++){at(s,'classroom','support');nextDay(s);}
 assert.ok(s.conductLog.every(e=>e.delta>=0),'aucune perte avec un tutorat quotidien');
 assert.equal(learnConductRule(s,'Mme Hayase'),true);assert.equal(learnConductRule(s,'Mme Hayase'),false);
 const c=s.conduct;assert.equal(conductCharter(s).ok,true);assert.equal(s.conduct,Math.min(100,c+5));assert.equal(conductCharter(s).ok,false);
});
test('Conduite : l’observation révèle la règle à partir de mardi',()=>{
 const s=createState();at(s,'courtyard','observe');assert.equal(s.conductKnown,false);nextDay(s);at(s,'courtyard','observe');assert.equal(s.conductKnown,true);assert.ok(s.knowledge.some(k=>k.id==='conduct-rule'));
});
test('Demandes : accepter, accomplir, être récompensé une seule fois',()=>{
 const s=createState();assert.equal(requestOf(s,'daichi-train').status,'offered');
 at(s,'gym','train');assert.equal(requestOf(s,'daichi-train').status,'offered','pas de progrès sans accepter');
 nextDay(s);assert.equal(acceptRequest(s,'daichi-train').ok,true);assert.equal(acceptRequest(s,'daichi-train').ok,false);
 const trust=s.relationships.daichi.trust,rel=s.rep.reliability;const r=at(s,'gym','train');
 assert.equal(r.completed.length,1);assert.equal(requestOf(s,'daichi-train').status,'done');assert.ok(s.relationships.daichi.trust>=trust+8);assert.equal(s.rep.reliability,rel+5);
 assert.ok(s.effects.includes('inspired'));const sup=s.support;at(s,'classroom','support');assert.equal(s.support,sup+10);assert.equal(s.effects.includes('inspired'),false);
});
test('Demandes : une promesse oubliée coûte de la fiabilité, un refus ne coûte rien',()=>{
 const s=createState();nextDay(s);assert.equal(declineRequest(s,'mika-yui').ok,true);assert.equal(acceptRequest(s,'sora-review').ok,true);
 const rel=s.rep.reliability,trust=s.relationships.sora.trust;pass(s,3);
 assert.equal(requestOf(s,'sora-review').status,'failed');assert.equal(s.rep.reliability,rel-7);assert.ok(s.relationships.sora.trust<trust);assert.equal(requestOf(s,'mika-yui').status,'declined');
});
test('Demandes : écouter Yui accomplit la demande de Mika',()=>{
 const s=createState();nextDay(s);acceptRequest(s,'mika-yui');const r=listen(s,'yui');assert.equal(r.first,true);assert.equal(r.completed.length,1);assert.equal(listen(s,'yui').first,false);
});
test('Demandes : le prêt à Nao est débité puis remboursé samedi',()=>{
 const s=createState();pass(s,2);assert.equal(acceptRequest(s,'nao-loan').ok,true);assert.equal(s.pp,58000);assert.equal(requestOf(s,'nao-loan').status,'pending');
 pass(s,2);s.scene='classroom';s.partner='nao';resolveExam(s);nextDay(s);assert.equal(s.day,6);assert.equal(s.pp,60000);assert.equal(requestOf(s,'nao-loan').status,'done');
});
test('Supérette : achat sur place, plafond, utilisation et effets',()=>{
 const s=createState();assert.equal(buyItem(s,'drink').ok,false);s.scene='cafe';
 for(let i=0;i<3;i++)assert.equal(buyItem(s,'drink').ok,true);assert.equal(buyItem(s,'drink').ok,false);assert.equal(s.pp,60000-3600);
 s.energy=50;assert.equal(useItem(s,'drink').ok,true);assert.equal(s.energy,68);assert.equal(s.inventory.drink,2);
 buyItem(s,'cards');useItem(s,'cards');assert.equal(useItem(s,'cards').ok,false);const prep=s.prep;s.stress=40;at(s,'library','study');assert.equal(s.prep,prep+12);
 s.scene='cafe';assert.equal(buyItem(s,'kit').ok,true);assert.ok(conditions(s).some(c=>c.id==='kit'));
});
test('Supérette : un dorayaki par camarade, la tisane accomplit la demande de Reina',()=>{
 const s=createState();s.scene='cafe';buyItem(s,'gift');buyItem(s,'gift');
 assert.equal(giveItem(s,'gift','mika').ok,true);assert.equal(giveItem(s,'gift','mika').ok,false);assert.equal(giveItem(s,'gift','hayase').ok,false);assert.equal(s.inventory.gift,1);
 pass(s,2);acceptRequest(s,'reina-tea');s.scene='cafe';buyItem(s,'tea');const r=giveItem(s,'tea','reina');assert.equal(r.ok,true);assert.equal(requestOf(s,'reina-tea').status,'done');assert.equal(s.inventory.tea,0);
});
test('États : dormir tôt repose, finir épuisé surmène',()=>{
 const s=createState();nextDay(s);assert.equal(s.rest,'rested');assert.equal(s.energy,100);assert.equal(energyCost(s,'study'),9);
 s.energy=18;s.actions=0;nextDay(s);assert.equal(s.rest,'overworked');assert.equal(s.energy,80);assert.equal(energyCost(s,'train'),18);
 s.energy=20;assert.ok(conditions(s).some(c=>c.id==='exhausted'));s.stress=75;assert.ok(conditions(s).some(c=>c.id==='pressure'));assert.equal(listen(s,'mika').trust,2);
});
test('Réputation : promesse tenue, visibilité, titre et classement',()=>{
 const s=createState();assert.equal(repTitle(s),'Élève discret');selectPartner(s,'reina');signContract(s);at(s,'library','study');assert.equal(s.rep.reliability,60);
 s.rep.visibility=55;const obs=s.stats.observation;at(s,'courtyard','observe');assert.equal(s.stats.observation,obs+1);
 assert.equal(renMethod(s).ok,false);s.rep.influence=40;assert.equal(renMethod(s).ok,true);assert.equal(renMethod(s).ok,false);
 s.rep.reliability=75;assert.equal(repTitle(s),'Pilier de la classe');
 const score=rep=>{const t=createState();selectPartner(t,'mika');for(let i=0;i<4;i++)nextDay(t);t.scene='classroom';t.rep=rep;resolveExam(t);return t.exam.classScore;};
 assert.ok(score({reliability:90,influence:60,visibility:10})>score({reliability:20,influence:0,visibility:10}));
});
test('Sauvegardes : une partie 0.2 est migrée, un sac falsifié est refusé',()=>{
 const old=createState();for(const k of ['rep','conduct','conductKnown','conductLog','inventory','effects','rest','requests','gifted','charterDay'])delete old[k];
 const s=validateState(JSON.parse(JSON.stringify(old)));assert.ok(s);assert.equal(s.conduct,62);assert.equal(s.inventory.drink,0);assert.ok(requestOf(s,'daichi-train'));
 const bad=createState();bad.inventory.drink=99;assert.equal(validateState(JSON.parse(JSON.stringify(bad))),null);
 const bad2=createState();bad2.requests.push({id:'inconnue',status:'done',day:1});assert.equal(validateState(JSON.parse(JSON.stringify(bad2))),null);
 const full=createState();pass(full,4);assert.ok(validateState(JSON.parse(JSON.stringify(full))));
});
