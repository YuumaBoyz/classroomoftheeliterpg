import {RESIDENCE_VERSION,RESIDENCE_WAKE} from './residence-map.mjs?v=residence-doors-13';
import {residenceDefaults,validateResidence} from './residence-system.mjs?v=residence-doors-13';
export const SAVE_KEY = 'anhs-save-v1';
export const PEOPLE = {
  reina: {name:'Reina Kurose',short:'Reina',role:'La stratège',portrait:0,hair:'#563d40',eyes:'#a8a3ae',academic:72,social:53,scene:'library',x:624,y:376},
  nao: {name:'Nao Fujita',short:'Nao',role:'L’intermédiaire',portrait:1,hair:'#282333',eyes:'#bd9764',academic:62,social:66,scene:'courtyard',x:784,y:448},
  mika: {name:'Mika Tachibana',short:'Mika',role:'Le lien du groupe',portrait:2,hair:'#914b49',eyes:'#d2a56c',academic:57,social:82,scene:'cafe',x:640,y:432},
  daichi: {name:'Daichi Mori',short:'Daichi',role:'Le sportif',portrait:3,hair:'#443039',eyes:'#b8885d',academic:43,social:64,scene:'gym',x:928,y:544},
  sora: {name:'Sora Endō',short:'Sora',role:'Le premier de classe',portrait:null,hair:'#34333c',academic:85,social:42,scene:'classroom',x:620,y:355},
  yui: {name:'Yui Takase',short:'Yui',role:'L’observatrice',portrait:null,hair:'#b3886c',academic:64,social:67,scene:'courtyard',x:400,y:448},
  ren: {name:'Ren Kanzaki',short:'Ren',role:'Représentant · classe A',portrait:null,hair:'#484355',academic:87,social:78,scene:'library',x:368,y:512},
  hayase: {name:'Mme Hayase',short:'Mme Hayase',role:'Professeure référente',portrait:null,hair:'#35343c',academic:90,social:80,scene:'classroom',x:600,y:224}
};
export const LOCATIONS = {
 campus:{name:'Le campus',subtitle:'Allées et bâtiments',tag:'EXPLORATION'},
 classroom:{name:'Salle de classe D',subtitle:'Cours et tutorat',tag:'BÂTIMENT ACADÉMIQUE',door:[816,344]},
 library:{name:'La bibliothèque',subtitle:'Révisions et manuels',tag:'AILE OUEST',door:[288,376]},
 gym:{name:'Le gymnase',subtitle:'Entraînement',tag:'COMPLEXE SPORTIF',door:[1360,376]},
 dorm:{name:'Résidence sud',subtitle:'Chambres, couloirs et espaces communs',tag:'DORTOIR / CHAMBRE 106',door:[288,952]},
 cafe:{name:'Le café Sakura',subtitle:'Pause et rencontres',tag:'GALERIE COMMERCIALE',door:[1344,920]},
 courtyard:{name:'La cour centrale',subtitle:'Rencontres et observation',tag:'JARDIN INTÉRIEUR',door:[832,688]}
};
export const DAYS = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
export const ARCHETYPES = {
 analyse:{label:'L’observateur',description:'Lire entre les lignes. Trouver ce que les autres manquent.',stats:{academic:45,observation:58,communication:38,composure:49}},
 social:{label:'Le médiateur',description:'Créer des liens. Donner une voix au groupe.',stats:{academic:40,observation:42,communication:60,composure:48}},
 scholar:{label:'Le méthodique',description:'Préparer chaque détail. Faire du savoir un atout.',stats:{academic:60,observation:43,communication:36,composure:51}}
};
export function createState(name='Akira',archetype='analyse') {
 const type=ARCHETYPES[archetype]??ARCHETYPES.analyse;
 const s={version:1,residenceVersion:RESIDENCE_VERSION,name:name.trim().slice(0,24)||'Akira',archetype,day:1,actions:3,pp:60000,pc:600,energy:90,stress:15,stats:{...type.stats},partner:null,prep:0,support:0,studyCount:0,contract:null,exam:null,ended:false,book:false,scene:'campus',position:{x:835,y:701},relationships:Object.fromEntries(Object.keys(PEOPLE).map(id=>[id,{trust:25,respect:30,close:10}])),memories:[],dailyTalks:[],dailyActions:[],knowledge:[],ledger:[],messages:[{from:'Administration',text:'Bienvenue à l’ANHS. Votre premier examen aura lieu vendredi : Le contrat de confiance.',day:1}],journal:[{day:1,text:'Premier jour. La classe D possède 600 points. Tout reste à écrire.'}],...systemDefaults(),residence:residenceDefaults()};
 offerRequests(s);return s;
}
const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
export function log(s,text){s.journal.unshift({day:s.day,text});s.journal=s.journal.slice(0,100);}
export function remember(s,text){s.memories.unshift({day:s.day,text});s.memories=s.memories.slice(0,60);}
export function known(s,id){return s.knowledge.some(k=>k.id===id);}
export function addKnowledge(s,id,title,source,kind='Témoignage') {if(known(s,id))return false;s.knowledge.unshift({id,title,source,kind,day:s.day});return true;}
export function relation(s,id,trust=0,respect=0,close=0){const r=s.relationships[id];if(!r)return;r.trust=clamp(r.trust+trust,0,100);r.respect=clamp(r.respect+respect,0,100);r.close=clamp(r.close+close,0,100);}
export function spend(s,amount,motif){if(!Number.isInteger(amount)||amount<=0||s.pp<amount)return false;s.pp-=amount;s.ledger.unshift({day:s.day,amount:-amount,motif});return true;}
export function selectPartner(s,id){if(!['reina','nao','mika','daichi'].includes(id))return{ok:false,message:'Ce personnage ne participe pas au binôme.'};if(s.day>=5||s.exam)return{ok:false,message:'Les inscriptions sont closes.'};if(s.partner)return{ok:false,message:'Votre binôme est déjà inscrit.'};s.partner=id;relation(s,id,8,4,4);log(s,`Binôme inscrit avec ${PEOPLE[id].short}.`);remember(s,`${PEOPLE[id].short} a accepté de préparer le dossier avec vous.`);return{ok:true,message:`Vous formez désormais un binôme avec ${PEOPLE[id].short}.`};}
export function signContract(s){if(!s.partner)return{ok:false,message:'Choisissez votre partenaire avant de proposer un contrat.'};if(s.day>=5)return{ok:false,message:'Les contrats de préparation sont clos.'};if(s.contract)return{ok:false,message:'Votre contrat est déjà enregistré.'};if(!spend(s,4000,'Dépôt réservé · tutorat'))return{ok:false,message:'Il vous faut 4 000 PP disponibles.'};s.contract={status:'reserved',amount:4000,partner:s.partner,signedDay:s.day,studyAt:s.studyCount};log(s,'4 000 PP réservés. Engagement : tenir une séance de révision avant vendredi.');return{ok:true,message:'Contrat signé. Le dépôt sera restitué après une séance de révision.'};}
export function settleContract(s,fulfilled){const c=s.contract;if(!c||c.status!=='reserved')return false;c.status=fulfilled?'fulfilled':'expired';s.pp+=c.amount;s.ledger.unshift({day:s.day,amount:c.amount,motif:fulfilled?'Dépôt libéré · engagement tenu':'Dépôt restitué · contrat expiré'});relation(s,c.partner,fulfilled?12:-8,fulfilled?5:0);rep(s,fulfilled?{reliability:10}:{reliability:-12});remember(s,fulfilled?'Vous avez tenu votre engagement de révision.':'Votre promesse de révision est arrivée à échéance.');return true;}
export function performAction(s,id){
 if(s.ended)return{ok:false,message:'Cette semaine est terminée. Vous pouvez encore explorer le campus.'};
 if(s.actions<=0)return{ok:false,message:'Vous avez utilisé vos créneaux. Passez au jour suivant dans votre chambre.'};
 if(s.dailyActions.includes(id))return{ok:false,message:'Cette activité a déjà été réalisée aujourd’hui.'};
 if(SCENE_FOR[id]&&s.scene!==SCENE_FOR[id])return{ok:false,message:'Rendez-vous dans le lieu de cette activité.'};
 if(!SCENE_FOR[id])return{ok:false,message:'Activité inconnue.'};
 if(id==='book'&&s.book)return{ok:false,message:'Vous avez déjà ce manuel.'};
 if(id!=='coffee'&&s.energy<15)return{ok:false,message:'Vous êtes trop fatigué. Prenez une pause au café ou reposez-vous.'};
 if((id==='coffee'&&!spend(s,600,'Pause au café'))||(id==='book'&&!spend(s,3000,'Manuel de révision')))return{ok:false,message:'Votre solde est insuffisant.'};
 // Les états se lisent avant de payer le coût en énergie.
 const tired=s.energy<=25,serene=!tired&&s.stress<=20&&s.energy>=60;
 s.actions--;s.dailyActions.push(id);s.energy-=energyCost(s,id);
 const effects={
 study:()=>{const focus=consumeEffect(s,'focus'),acad=tired?3:4,prep=8+(serene?2:0)-(tired?3:0)+(focus?4:0);s.stats.academic=clamp(s.stats.academic+acad,0,100);s.prep+=prep;s.studyCount++;s.stress+=3;if(s.partner)relation(s,s.partner,5,3);if(s.contract?.status==='reserved'&&s.studyCount>s.contract.studyAt)settleContract(s,true);return`Révision terminée : académique +${acad}, préparation +${prep}.${focus?' Vos fiches ont payé.':''}${tired?' La fatigue a ralenti votre travail.':''}`;},
 observe:()=>{const seen=s.rep.visibility>=50,gain=seen?1:3;s.stats.observation=clamp(s.stats.observation+gain,0,100);addKnowledge(s,'schedule','Daichi s’est engagé pour l’entraînement de jeudi. Son horaire chevauche une préparation.','Observation · cour centrale','Fait observé');let extra='';if(s.day>=2&&!s.conductKnown){learnConductRule(s,'Observation · cour centrale','Fait observé');extra=' Un surveillant note les retards de la classe D sur une tablette.';}return`Vous avez repéré un conflit d’emploi du temps. Observation +${gain}.${seen?' On vous remarque : difficile de rester discret.':''}${extra}`;},
 train:()=>{s.stats.composure=clamp(s.stats.composure+4,0,100);s.stress-=6;relation(s,'daichi',5,4,3);return'Entraînement terminé : sang-froid +4, stress −6.';},
 support:()=>{const inspired=consumeEffect(s,'inspired'),gain=7+(inspired?3:0);s.support+=gain;s.stats.communication=clamp(s.stats.communication+3,0,100);s.stress+=2;s.conduct=clamp(s.conduct+6,0,100);rep(s,{influence:3,visibility:3});relation(s,'reina',4,6);relation(s,'sora',4,4);remember(s,'Vous avez aidé les binômes les moins préparés.');return`Tutorat collectif : préparation de classe +${gain}, communication +3, conduite +6.`;},
 coffee:()=>{s.energy+=25;s.stress-=12;rep(s,{visibility:2});relation(s,'mika',3,0,4);return'Une vraie pause : énergie +25, stress −12. 600 PP dépensés.';},
 book:()=>{s.book=true;s.stats.academic=clamp(s.stats.academic+3,0,100);s.prep+=5;return'Manuel acquis : académique +3, préparation +5. 3 000 PP dépensés.';}
 };
 let message=effects[id]();s.energy=clamp(s.energy,0,100);s.stress=clamp(s.stress,0,100);log(s,message);
 const completed=progressRequests(s,{type:'activity',id});if(completed.length)message+=' '+completed.map(c=>c.message).join(' ');
 return{ok:true,message,completed};
}
export function nextDay(s){if(s.ended)return{ok:false,message:'La semaine est terminée.'};if(s.day===5&&!s.exam)return{ok:false,message:'L’examen vous attend en salle de classe. Mme Hayase peut vous expliquer les règles.'};if(s.day>=7){s.ended=true;log(s,'La première semaine s’achève. Votre histoire à l’ANHS ne fait que commencer.');return{ok:true,message:'Une semaine, de nouvelles alliances. Votre bilan est prêt.'};}const report=s.day<=5?evaluateConduct(s):null,worn=s.energy<20,early=!worn&&s.actions>=2;s.day++;s.actions=3;s.energy=worn?80:early?100:95;s.rest=worn?'overworked':early?'rested':null;s.stress=clamp(s.stress-12+(worn?5:0),0,100);s.dailyTalks=[];s.dailyActions=[];s.scene='dorm';s.position={...RESIDENCE_WAKE};s.residenceVersion=RESIDENCE_VERSION;if(s.day===3)s.messages.unshift({from:'Reina',text:'Notre score individuel ne suffira pas. Les binômes en difficulté ont besoin d’aide.',day:3});if(s.day===4)s.messages.unshift({from:'Administration',text:'Dernier jour de préparation. Les inscriptions fermeront demain matin.',day:4});if(s.day===5){settleContract(s,false);s.messages.unshift({from:'Mme Hayase',text:'La restitution commence aujourd’hui. Rendez-vous en classe D.',day:5});}const requests=updateRequests(s);offerRequests(s);log(s,`${DAYS[s.day-1]} : une nouvelle journée commence.`);return{ok:true,message:`${DAYS[s.day-1]}. Trois nouveaux créneaux disponibles.`,report,requests};}
export function resolveExam(s,strategy='balanced'){
 if(s.exam)return{ok:false,message:'Le résultat de cet examen est déjà publié.'};
 if(s.day!==5||s.scene!=='classroom')return{ok:false,message:'La restitution a lieu vendredi en salle de classe.'};
 if(!s.partner)return{ok:false,message:'Vous devez choisir un partenaire de rattrapage avant la restitution.'};
 if(!['balanced','solo','team'].includes(strategy))return{ok:false,message:'Stratégie inconnue.'};
 const p=PEOPLE[s.partner];const r=s.relationships[s.partner];
 const reading=Array.isArray(s.examDraft?.answers)?s.examDraft.answers.filter((a,i)=>a===[1,2,0][i]).length:0;
 const exact=clamp(Math.round((s.stats.academic+p.academic)*.23+s.prep*.24+reading*2-3+(strategy==='solo'?6:0)),0,50);
 const oral=clamp(Math.round((s.stats.communication+p.social)*.16+s.stats.composure*.06-s.stress*.04+(s.inventory.kit?3:0)-(s.stress>=70?2:0)),0,30);
 const commitments=clamp(Math.round(6+s.studyCount*2+r.trust*.07+(s.contract?.status==='fulfilled'?4:0)),0,20);
 const score=exact+oral+commitments;
 const classScore=clamp(Math.round(56+(score-60)*.38+s.support*.55+(strategy==='team'?7:strategy==='solo'?-4:2)+repExamBonus(s)),0,100);
 const ranking=[{id:'a',name:'Classe A',score:81},{id:'b',name:'Classe B',score:73},{id:'c',name:'Classe C',score:66},{id:'d',name:'Classe D',score:classScore}].sort((a,b)=>b.score-a.score);
 const tied=ranking.map((x,i)=>x.score===classScore?i:-1).filter(i=>i>=0);
 const delta=[80,40,10,-30];const reward=tied.reduce((sum,i)=>sum+delta[i],0)/tied.length+(classScore<50?-20:0);
 s.pc+=reward;s.exam={score,exact,oral,commitments,classScore,rank:tied[0]+1,reward,ranking,strategy,reading};
 relation(s,s.partner,score>=70?8:3,5,3);if(strategy==='team'){relation(s,'reina',8,5);relation(s,'mika',6,4);rep(s,{influence:6,visibility:4});s.conduct=clamp(s.conduct+4,0,100);}else if(strategy==='solo')rep(s,{visibility:5,influence:-3});remember(s,`Votre binôme avec ${p.short} obtient ${score}/100. La classe gagne ${reward>0?'+':''}${reward} PC.`);log(s,`Examen publié : ${classScore}/100 pour la classe. ${reward>0?'+':''}${reward} PC.`);s.messages.unshift({from:p.short,text:score>=70?'On a réussi à tenir notre plan. Merci d’avoir joué le jeu.':'On peut faire mieux. Mais je suis content de ne pas avoir été seul.',day:s.day});return{ok:true,message:'Résultats publiés.',exam:s.exam};
}
export function fallbackPartner(s){if(s.day!==5||s.partner)return false;s.partner='daichi';log(s,'Daichi rejoint votre binôme de rattrapage.');return true;}
export function validateState(input){
 if(!input||input.version!==1||typeof input.name!=='string'||input.name.length>24)return null;
 if(!Number.isInteger(input.day)||input.day<1||input.day>7||!Number.isInteger(input.actions)||input.actions<0||input.actions>3)return null;
 for(const k of ['pp','pc','energy','stress','prep','support','studyCount'])if(!Number.isFinite(input[k])||input[k]<0)return null;
 if(input.pp>1e9||input.pc>1e6||input.energy>100||input.stress>100)return null;
 if(!LOCATIONS[input.scene]||!Number.isFinite(input.position?.x)||!Number.isFinite(input.position?.y))return null;
 for(const k of ['academic','observation','communication','composure'])if(!Number.isFinite(input.stats?.[k])||input.stats[k]<0||input.stats[k]>100)return null;
 for(const id of Object.keys(PEOPLE)){const r=input.relationships?.[id];if(!r||['trust','respect','close'].some(k=>!Number.isFinite(r[k])||r[k]<0||r[k]>100))return null;}
 for(const k of ['messages','journal','knowledge','ledger','memories','dailyTalks','dailyActions'])if(!Array.isArray(input[k]))return null;
 const str=(v,max=5000)=>typeof v==='string'&&v.length<=max;
 const day=v=>Number.isInteger(v)&&v>=1&&v<=7;
 if(input.messages.length>100||input.journal.length>100||input.memories.length>60||input.knowledge.length>100||input.ledger.length>1000)return null;
 if(input.messages.some(m=>!m||!str(m.from,100)||!str(m.text)||!day(m.day)))return null;
 if([...input.journal,...input.memories].some(m=>!m||!str(m.text)||!day(m.day)))return null;
 if(input.knowledge.some(k=>!k||!str(k.id,100)||!str(k.title)||!str(k.source,200)||!str(k.kind,100)||!day(k.day)))return null;
 if(input.ledger.some(e=>!e||!Number.isFinite(e.amount)||Math.abs(e.amount)>1e9||!str(e.motif,200)||!day(e.day)))return null;
 if(input.dailyTalks.some(id=>!Object.hasOwn(PEOPLE,id))||input.dailyActions.some(id=>!['study','observe','train','support','coffee','book'].includes(id)))return null;
 if(!Object.hasOwn(ARCHETYPES,input.archetype)||typeof input.ended!=='boolean'||typeof input.book!=='boolean')return null;
 if(input.partner&&!['reina','nao','mika','daichi'].includes(input.partner))return null;
 if(input.contract&&(!['reserved','fulfilled','expired'].includes(input.contract.status)||input.contract.amount!==4000||input.contract.partner!==input.partner||!day(input.contract.signedDay)||!Number.isInteger(input.contract.studyAt)||input.contract.studyAt<0))return null;
 if(input.examDraft&&(!Array.isArray(input.examDraft.answers)||input.examDraft.answers.length>3||input.examDraft.answers.some(a=>!Number.isInteger(a)||a<0||a>2)))return null;
 if(input.exam){const e=input.exam;if(!input.partner||!['score','exact','oral','commitments','classScore','rank','reward'].every(k=>Number.isFinite(e[k]))||!['balanced','solo','team'].includes(e.strategy)||!Array.isArray(e.ranking)||e.ranking.length!==4)return null;
 if(e.ranking.some(r=>!r||!['a','b','c','d'].includes(r.id)||!str(r.name,50)||!Number.isFinite(r.score)||r.score<0||r.score>100))return null;
 if(e.score<0||e.score>100||e.exact<0||e.exact>50||e.oral<0||e.oral>30||e.commitments<0||e.commitments>20||e.classScore<0||e.classScore>100||e.reward< -50||e.reward>80)return null;
 }
 const migrated=migrateSystems({...input,residenceVersion:RESIDENCE_VERSION,...(input.scene==='dorm'&&input.residenceVersion!==RESIDENCE_VERSION?{position:input.residenceVersion===8?{x:input.position.x/2,y:input.position.y/2}:{...RESIDENCE_WAKE}}:{})});
 if(!migrated)return null;const residence=validateResidence(migrated.residence,ITEMS);if(!residence||residence.napDay>migrated.day)return null;return{...migrated,residence};
}

// ─── Systèmes 0.3 : états, réputation, demandes, supérette, conduite de classe ───
const SCENE_FOR={study:'library',observe:'courtyard',train:'gym',support:'classroom',coffee:'cafe',book:'library'};
const ENERGY_COST={study:12,observe:5,train:15,support:12,coffee:0,book:0};
export const STUDENTS=['reina','nao','mika','daichi','sora','yui','ren'];
export const ITEMS={
 drink:{name:'Boisson énergisante',price:1200,max:3,use:true,detail:'Énergie +18, sans créneau.'},
 tea:{name:'Tisane au yuzu',price:800,max:3,use:true,detail:'Stress −10. Elle peut aussi s’offrir.'},
 cards:{name:'Fiches de révision',price:1500,max:2,use:true,detail:'État Concentré : préparation +4 à la prochaine révision.'},
 gift:{name:'Dorayaki du Sakura',price:2000,max:2,use:false,detail:'À offrir en conversation : confiance +3, proximité +6.'},
 kit:{name:'Kit de présentation',price:8000,max:1,use:false,detail:'Effet permanent : oral de l’examen +3.'}
};
export const REQUESTS={
 'daichi-train':{giver:'daichi',day:1,until:3,title:'Un partenaire d’entraînement',text:'Viens t’entraîner avec moi au gymnase. Seul, je n’arrive pas à garder le rythme.',goal:{type:'activity',id:'train'},goalText:'S’entraîner au gymnase',reward:{trust:8,close:4},rewardText:'Confiance de Daichi +8'},
 'sora-review':{giver:'sora',day:2,until:4,title:'Relecture croisée',text:'Révise à la bibliothèque et relis ma partie statistique en même temps. Je te dédommagerai.',goal:{type:'activity',id:'study'},goalText:'Réviser à la bibliothèque',reward:{trust:8,pp:1500,stat:['academic',2]},rewardText:'1 500 PP · académique +2'},
 'mika-yui':{giver:'mika',day:2,until:3,title:'Personne sur le côté',text:'Yui reste souvent seule dans la cour. Tu pourrais prendre le temps de l’écouter ?',goal:{type:'listen',npc:'yui'},goalText:'Écouter Yui dans la cour',reward:{trust:6,close:4,also:['yui',6]},rewardText:'Confiance de Mika et de Yui +6'},
 'reina-tea':{giver:'reina',day:3,until:4,title:'Une longue soirée',text:'Je passe la soirée sur le plan de classe. Une tisane de la supérette du Sakura m’aiderait à tenir.',goal:{type:'give',item:'tea',npc:'reina'},goalText:'Offrir une tisane à Reina',reward:{trust:8,respect:3},rewardText:'Confiance de Reina +8'},
 'nao-loan':{giver:'nao',day:3,until:4,title:'Un prêt discret',text:'Il me manque 2 000 PP jusqu’à samedi. Je te rembourse sans faute, et sans que ça se sache.',goal:{type:'loan',amount:2000,repay:6},goalText:'Prêter 2 000 PP · remboursés samedi',reward:{trust:10},rewardText:'Confiance de Nao +10 · 2 000 PP rendus'},
 'yui-expo':{giver:'yui',day:6,until:7,title:'L’exposition du club photo',text:'Avant d’accrocher mes photos, j’aimerais savoir ce que les gens regardent vraiment dans la cour.',goal:{type:'activity',id:'observe'},goalText:'Observer la cour centrale',reward:{trust:8,stat:['observation',2]},rewardText:'Confiance de Yui +8 · observation +2'}
};
const REQUEST_STATUS=['offered','active','pending','done','failed','declined','expired'];
export const CONDUCT_STEPS=[[70,5,'Exemplaire'],[55,0,'Correcte'],[40,-10,'Relâchée'],[0,-20,'Préoccupante']];
export function systemDefaults(){return{rep:{reliability:50,influence:15,visibility:10},conduct:62,conductKnown:false,conductLog:[],inventory:Object.fromEntries(Object.keys(ITEMS).map(id=>[id,0])),effects:[],rest:null,requests:[],gifted:[],charterDay:0};}
export function rep(s,d={}){for(const k of ['reliability','influence','visibility'])if(d[k])s.rep[k]=clamp(s.rep[k]+d[k],0,100);}
export function repTitle(s){const r=s.rep;if(r.reliability>=70&&r.influence>=40)return'Pilier de la classe';if(r.reliability>=70)return'Digne de confiance';if(r.influence>=45)return'Voix de la classe';if(r.visibility>=60)return'Sous les projecteurs';if(r.reliability<35)return'Promesses fragiles';if(r.visibility<20)return'Élève discret';return'Visage connu';}
export function repExamBonus(s){return Math.round((s.rep.reliability-50)*.05+s.rep.influence*.04);}
export function energyCost(s,id){const base=ENERGY_COST[id]??0;return base?Math.max(0,base+(s.rest==='rested'?-3:s.rest==='overworked'?3:0)):0;}
function consumeEffect(s,id){const i=s.effects.indexOf(id);if(i<0)return false;s.effects.splice(i,1);return true;}
export function conditions(s){const list=[];
 if(s.rest==='rested')list.push({id:'rested',label:'Bien reposé',kind:'buff',detail:'Activités : énergie −3 aujourd’hui.'});
 if(s.rest==='overworked')list.push({id:'overworked',label:'Surmené',kind:'debuff',detail:'Activités : énergie +3 aujourd’hui.'});
 if(s.energy<=25)list.push({id:'exhausted',label:'Épuisé',kind:'debuff',detail:'Révision : préparation −3, académique −1.'});
 else if(s.stress<=20&&s.energy>=60)list.push({id:'serene',label:'Serein',kind:'buff',detail:'Révision : préparation +2. Écoute : confiance +1.'});
 if(s.stress>=70)list.push({id:'pressure',label:'Sous pression',kind:'debuff',detail:'Écoute : confiance +2 au lieu de +4. Oral de l’examen −2.'});
 if(s.effects.includes('focus'))list.push({id:'focus',label:'Concentré',kind:'buff',detail:'Prochaine révision : préparation +4.'});
 if(s.effects.includes('inspired'))list.push({id:'inspired',label:'Inspiré',kind:'buff',detail:'Prochain tutorat : aide à la classe +3.'});
 if(s.inventory.kit)list.push({id:'kit',label:'Kit de présentation',kind:'item',detail:'Oral de l’examen +3.'});
 return list;}
// Écouter : la confiance dépend de l’état du joueur, et une demande peut s’accomplir.
export function listen(s,id){if(!PEOPLE[id])return{ok:false,first:false,trust:0,completed:[]};if(s.dailyTalks.includes(id))return{ok:true,first:false,trust:0,completed:[]};s.dailyTalks.push(id);const trust=(s.stress>=70?2:4)+(s.energy>25&&s.stress<=20&&s.energy>=60?1:0);relation(s,id,trust,1,3);rep(s,{influence:1});remember(s,`Vous avez pris le temps d’écouter ${PEOPLE[id].short}.`);return{ok:true,first:true,trust,completed:progressRequests(s,{type:'listen',npc:id})};}
// Supérette et sac.
export function buyItem(s,id){const it=ITEMS[id];if(!it)return{ok:false,message:'Article inconnu.'};if(s.scene!=='cafe')return{ok:false,message:'La supérette se trouve au café Sakura.'};if(id==='kit'&&s.exam)return{ok:false,message:'L’examen est passé : le kit ne servirait plus.'};if(s.inventory[id]>=it.max)return{ok:false,message:`Votre sac contient déjà ${it.max} × ${it.name}.`};if(!spend(s,it.price,`Supérette · ${it.name}`))return{ok:false,message:'Votre solde est insuffisant.'};s.inventory[id]++;return{ok:true,message:`${it.name} rangé dans votre sac.`};}
export function useItem(s,id){const it=ITEMS[id];if(!it||!s.inventory[id])return{ok:false,message:'Cet objet n’est pas dans votre sac.'};if(!it.use)return{ok:false,message:id==='gift'?'Offrez-le en parlant à un camarade.':'Cet objet agit de lui-même.'};
 if(id==='drink'){if(s.energy>=100)return{ok:false,message:'Votre énergie est déjà au maximum.'};s.energy=clamp(s.energy+18,0,100);}
 if(id==='tea'){if(s.stress<=0)return{ok:false,message:'Vous êtes déjà parfaitement calme.'};s.stress=clamp(s.stress-10,0,100);}
 if(id==='cards'){if(s.effects.includes('focus'))return{ok:false,message:'Vous êtes déjà concentré.'};s.effects.push('focus');}
 s.inventory[id]--;return{ok:true,message:{drink:'Boisson énergisante : énergie +18.',tea:'Tisane au yuzu : stress −10.',cards:'Fiches relues : vous êtes concentré pour la prochaine révision.'}[id]};}
export function giveItem(s,id,npc){if(!s.inventory[id]||!PEOPLE[npc])return{ok:false,message:'Cet objet n’est pas dans votre sac.'};
 const completed=progressRequests(s,{type:'give',item:id,npc});if(completed.length){s.inventory[id]--;return{ok:true,message:completed.map(c=>c.message).join(' '),completed};}
 if(id!=='gift'||!STUDENTS.includes(npc))return{ok:false,message:'Ce n’est pas le bon moment pour l’offrir.'};if(s.gifted.includes(npc))return{ok:false,message:`Vous avez déjà partagé un dorayaki avec ${PEOPLE[npc].short} cette semaine.`};
 s.inventory.gift--;s.gifted.push(npc);relation(s,npc,3,0,6);remember(s,`Vous avez partagé un dorayaki avec ${PEOPLE[npc].short}.`);return{ok:true,message:`${PEOPLE[npc].short} accepte le dorayaki. Proximité +6.`,completed:[]};}
// Demandes des camarades.
export function requestOf(s,id){return s.requests.find(r=>r.id===id);}
export function offerRequests(s){for(const [id,r] of Object.entries(REQUESTS))if(r.day===s.day&&!requestOf(s,id)&&!s.ended){s.requests.push({id,status:'offered',day:s.day});s.messages.unshift({from:PEOPLE[r.giver].short,text:`${r.text} (Demande · jusqu’à ${DAYS[r.until-1].toLowerCase()})`,day:s.day});}}
export function acceptRequest(s,id){const q=requestOf(s,id),r=REQUESTS[id];if(!q||q.status!=='offered')return{ok:false,message:'Cette demande n’est plus disponible.'};if(s.requests.filter(x=>x.status==='active').length>=3)return{ok:false,message:'Trois demandes en cours : terminez-en une d’abord.'};
 if(r.goal.type==='loan'){if(!spend(s,r.goal.amount,`Prêt à ${PEOPLE[r.giver].short} · remboursement ${DAYS[r.goal.repay-1].toLowerCase()}`))return{ok:false,message:`Il vous faut ${new Intl.NumberFormat('fr-FR').format(r.goal.amount)} PP disponibles.`};q.status='pending';relation(s,r.giver,3,0,2);log(s,`Prêt accordé à ${PEOPLE[r.giver].short}.`);return{ok:true,message:`${PEOPLE[r.giver].short} vous remercie. Remboursement prévu ${DAYS[r.goal.repay-1].toLowerCase()}.`};}
 q.status='active';relation(s,r.giver,1,0,1);log(s,`Demande acceptée : ${r.title} (${PEOPLE[r.giver].short}).`);return{ok:true,message:`Demande acceptée : ${r.goalText[0].toLowerCase()+r.goalText.slice(1)} avant la fin de ${DAYS[r.until-1].toLowerCase()}.`};}
export function declineRequest(s,id){const q=requestOf(s,id);if(!q||q.status!=='offered')return{ok:false,message:'Cette demande n’est plus disponible.'};q.status='declined';return{ok:true,message:`Vous déclinez poliment. ${PEOPLE[REQUESTS[id].giver].short} comprend.`};}
function completeRequest(s,q){const r=REQUESTS[q.id],w=r.reward;q.status='done';relation(s,r.giver,w.trust??0,w.respect??0,w.close??0);if(w.also)relation(s,w.also[0],w.also[1],0,2);if(w.stat)s.stats[w.stat[0]]=clamp(s.stats[w.stat[0]]+w.stat[1],0,100);if(w.pp){s.pp+=w.pp;s.ledger.unshift({day:s.day,amount:w.pp,motif:`${r.title} · ${PEOPLE[r.giver].short}`});}
 rep(s,{reliability:5,influence:2});s.conduct=clamp(s.conduct+3,0,100);if(!s.effects.includes('inspired'))s.effects.push('inspired');remember(s,`Vous avez répondu à la demande de ${PEOPLE[r.giver].short} : ${r.title.toLowerCase()}.`);log(s,`Demande accomplie : ${r.title}.`);
 return{id:q.id,title:r.title,giver:r.giver,message:`Demande de ${PEOPLE[r.giver].short} accomplie : ${r.rewardText[0].toLowerCase()+r.rewardText.slice(1)}.`};}
export function progressRequests(s,e){const done=[];for(const q of s.requests){if(q.status!=='active')continue;const g=REQUESTS[q.id].goal;if(g.type!==e.type)continue;if((g.type==='activity'&&g.id===e.id)||(g.type==='listen'&&g.npc===e.npc)||(g.type==='give'&&g.item===e.item&&g.npc===e.npc))done.push(completeRequest(s,q));}return done;}
function updateRequests(s){const out=[];for(const q of s.requests){const r=REQUESTS[q.id];
 if(q.status==='pending'&&r.goal.type==='loan'&&s.day>=r.goal.repay){q.status='done';s.pp+=r.goal.amount;s.ledger.unshift({day:s.day,amount:r.goal.amount,motif:`Remboursement · ${PEOPLE[r.giver].short}`});relation(s,r.giver,r.reward.trust,2,3);rep(s,{reliability:3,influence:2});s.messages.unshift({from:PEOPLE[r.giver].short,text:'Comme promis : 2 000 PP. Et je n’oublie pas que tu m’as fait confiance.',day:s.day});out.push({id:q.id,status:'done'});}
 else if(q.status==='active'&&s.day>r.until){q.status='failed';relation(s,r.giver,-6,-2);rep(s,{reliability:-7});remember(s,`Vous n’avez pas tenu la demande de ${PEOPLE[r.giver].short}.`);log(s,`Demande échouée : ${r.title}.`);out.push({id:q.id,status:'failed'});}
 else if(q.status==='offered'&&s.day>r.until)q.status='expired';}
 return out;}
// Conduite : la règle invisible qui fait varier les points de classe chaque jour d’école.
export function conductStep(v){return CONDUCT_STEPS.find(([min])=>v>=min);}
function evaluateConduct(s){const [,delta,label]=conductStep(s.conduct),entry={day:s.day,delta,conduct:Math.round(s.conduct)};s.pc=Math.max(0,s.pc+delta);s.conductLog.unshift(entry);s.conductLog=s.conductLog.slice(0,30);
 s.messages.unshift({from:'Administration',text:`Rapport de conduite · ${DAYS[s.day-1]} : ${delta>0?'+':''}${delta} PC pour la classe D.${s.conductKnown?` Conduite ${label.toLowerCase()} (${entry.conduct}/100).`:' Motif non communiqué.'}`,day:s.day});
 if(delta<0)log(s,`La classe D perd ${-delta} PC. ${s.conductKnown?'La conduite de la classe se relâche.':'Personne ne sait pourquoi.'}`);
 if(s.day<5)s.conduct=clamp(s.conduct-7,0,100);return{...entry,label};}
export function learnConductRule(s,source,kind='Témoignage'){if(s.conductKnown)return false;s.conductKnown=true;addKnowledge(s,'conduct-rule','Chaque jour d’école, la conduite de la classe D (retards, bavardages, téléphones en cours) fait varier ses points de classe.',source,kind);remember(s,'Vous avez compris une règle que personne n’affiche.');return true;}
export function conductCharter(s){if(!s.conductKnown)return{ok:false,message:'Vous ne savez pas encore ce qui fait baisser les points.'};if(s.day>5||s.ended)return{ok:false,message:'Les cours sont terminés pour la semaine.'};if(s.charterDay===s.day)return{ok:false,message:'Vous avez déjà rappelé les règles aujourd’hui.'};s.charterDay=s.day;s.conduct=clamp(s.conduct+5,0,100);rep(s,{influence:2,visibility:2});relation(s,'sora',2,2);log(s,'Rappel des règles organisé avec Sora : conduite +5.');return{ok:true,message:'Sora affiche un rappel des horaires au tableau. Conduite +5.'};}
export function renMethod(s){if(known(s,'a-method'))return{ok:false,message:'Ren vous a déjà expliqué sa méthode.'};if(s.rep.influence<35)return{ok:false,message:'Ren ne partage pas ses méthodes avec n’importe qui.'};addKnowledge(s,'a-method','La classe A relit les dossiers en binômes croisés : chacun vérifie les sources de l’autre.','Ren Kanzaki · conversation');s.prep+=4;rep(s,{visibility:3});relation(s,'ren',3,4);return{ok:true,message:'Ren détaille la relecture croisée. Préparation +4.'};}
function migrateSystems(input){const d=systemDefaults();
 for(const k of Object.keys(d))if(input[k]===undefined)input[k]=structuredClone(d[k]);
 const n=(v,min,max)=>Number.isFinite(v)&&v>=min&&v<=max;
 if(!input.rep||!['reliability','influence','visibility'].every(k=>n(input.rep[k],0,100)))return null;
 if(!n(input.conduct,0,100)||typeof input.conductKnown!=='boolean'||!Array.isArray(input.conductLog)||input.conductLog.length>30||input.conductLog.some(e=>!e||!n(e.day,1,7)||!n(e.delta,-50,50)||!n(e.conduct,0,100)))return null;
 if(!input.inventory||typeof input.inventory!=='object')return null;for(const [id,it] of Object.entries(ITEMS)){input.inventory[id]??=0;if(!Number.isInteger(input.inventory[id])||input.inventory[id]<0||input.inventory[id]>it.max)return null;}if(Object.keys(input.inventory).some(k=>!ITEMS[k]))return null;
 if(!Array.isArray(input.effects)||input.effects.length>4||input.effects.some(e=>!['focus','inspired'].includes(e)))return null;
 if(![null,'rested','overworked'].includes(input.rest))return null;
 if(!Array.isArray(input.requests)||input.requests.length>20||input.requests.some(q=>!q||!Object.hasOwn(REQUESTS,q.id)||!REQUEST_STATUS.includes(q.status)||!n(q.day,1,7)))return null;
 if(!Array.isArray(input.gifted)||input.gifted.some(id=>!STUDENTS.includes(id))||!Number.isInteger(input.charterDay)||input.charterDay<0||input.charterDay>7)return null;
 if(!input.requests.length&&!input.ended){for(const [id,r] of Object.entries(REQUESTS))if(r.day<=input.day&&r.until>=input.day){input.requests.push({id,status:'offered',day:input.day});}}
 return input;}
