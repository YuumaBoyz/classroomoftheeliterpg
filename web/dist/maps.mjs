import {createResidence} from './residence-map.mjs?v=residence-doors-13';
import {doorBlocks} from './residence-system.mjs?v=residence-doors-13';
// The map objects are also the collision source. Coordinates refer to feet / floor.
export const TILE = 32;
export const SCENES = {
 campus:{w:1664,h:1088,bounds:[32,64,1632,1056],spawn:{x:832,y:784},outdoor:true,objects:[],patches:[],props:[],portals:[],extras:[[736,432],[944,768],[480,464],[1248,464],[704,944],[1120,976]]},
 classroom:{w:1120,h:800,bounds:[64,112,1056,736],spawn:{x:560,y:688},floor:'school',objects:[],patches:[],props:[],extras:[[236,334],[364,446],[748,558]]},
 library:{w:1120,h:800,bounds:[64,112,1056,736],spawn:{x:560,y:688},floor:'wood',objects:[],patches:[],props:[],extras:[[200,384],[896,464],[456,576]]},
 gym:{w:1280,h:896,bounds:[64,112,1216,832],spawn:{x:640,y:784},floor:'court',objects:[],patches:[],props:[],extras:[[416,544],[816,448]]},
 dorm:createResidence(),
 cafe:{w:1120,h:800,bounds:[64,112,1056,736],spawn:{x:560,y:688},floor:'cafe',objects:[],patches:[],props:[],extras:[[236,448],[740,640],[960,288]]},
 courtyard:{w:1216,h:896,bounds:[64,64,1152,832],spawn:{x:608,y:768},outdoor:true,objects:[],patches:[],props:[],extras:[[560,240],[880,736]]}
};
const object=(scene,type,x,y,w,h,extra={})=>{const o={type,x,y,w,h,...extra};SCENES[scene].objects.push(o);return o;};
const patch=(scene,type,x,y,w,h)=>SCENES[scene].patches.push({type,x,y,w,h});
const prop=(scene,id,name,detail,x,y)=>SCENES[scene].props.push({id,name,detail,x,y});
const tree=(scene,x,y,cherry=false)=>object(scene,'tree',x-12,y-16,24,24,{cherry,sortY:y+4,...(cherry?{art:'sakura'}:{})});
const planter=(scene,x,y,w=64)=>object(scene,'planter',x,y,w,32);
const bench=(scene,x,y,w=96)=>object(scene,'bench',x,y,w,28);
const table=(scene,x,y,w=144,h=64,extra={})=>object(scene,'table',x,y,w,h,extra);
const chair=(scene,x,y,up=false)=>object(scene,'chair',x,y,24,24,{up});
const dining=(scene,x,y)=>{table(scene,x,y,112,64,{cafe:true});chair(scene,x+12,y-32,true);chair(scene,x+76,y-32,true);chair(scene,x+12,y+72);chair(scene,x+76,y+72);};

// Campus: an academic north wing, pedestrian esplanade, garden and residences.
patch('campus','paving',96,384,1472,128);patch('campus','paving',736,320,192,704);
patch('campus','paving',192,928,1248,96);patch('campus','paving',224,352,128,608);
patch('campus','paving',1280,352,128,608);patch('campus','stone',576,512,512,288);
object('campus','building',112,184,352,168,{label:'BIBLIOTHÈQUE',roof:'slate',door:288,art:'libraryBuilding'});
object('campus','building',576,160,480,160,{label:'BÂTIMENT ACADÉMIQUE',roof:'wine',door:816,art:'academic'});
object('campus','building',1200,192,320,160,{label:'GYMNASE',roof:'green',door:1360,art:'gymBuilding'});
object('campus','building',112,776,352,152,{label:'RÉSIDENCE SUD',roof:'slate',door:288,art:'dormBuilding'});
object('campus','building',1168,720,352,176,{label:'SAKURA',roof:'wine',door:1344,awning:true,art:'cafeBuilding'});
object('campus','fountain',776,536,112,104);
for(const [x,y,w] of [[592,544,128],[944,544,128],[592,736,128],[944,736,128]])planter('campus',x,y,w);
bench('campus',624,656);bench('campus',944,656);
object('campus','notice',528,400,48,64,{label:'ANHS'});
object('campus','bikes',1104,336,80,32);
for(const [x,y] of [[176,440],[416,440],[640,440],[1008,440],[1216,440],[1488,440],[176,976],[448,976],[1120,976],[1488,976]])object('campus','lamp',x,y,12,12,{solid:false,sortY:y+14});
for(const [x,y] of [[80,160],[512,224],[1120,208],[1584,192],[80,624],[496,624],[1120,624],[1584,592],[528,896],[1088,896],[80,1008],[1584,1008]])tree('campus',x,y,true);
for(const [x,y] of [[64,352],[512,352],[1120,352],[1584,352],[64,800],[1584,816]])tree('campus',x,y);
for(const [x,y,w] of [[560,832,144],[960,832,144],[96,576,256],[1248,576,256]])patch('campus','flowers',x,y,w,64);
SCENES.campus.portals=[{id:'classroom',x:816,y:344,name:'Salle de classe D'},{id:'library',x:288,y:376,name:'La bibliothèque'},{id:'gym',x:1360,y:376,name:'Le gymnase'},{id:'dorm',x:288,y:952,name:'Résidence sud'},{id:'cafe',x:1344,y:920,name:'Le café Sakura'},{id:'courtyard',x:832,y:688,name:'La cour centrale'}];

// Class D: rows of desks, a teaching platform, lockers and a real rear aisle.
patch('classroom','platform',320,112,480,128);
object('classroom','board',368,112,384,44,{label:'EXAMEN SPÉCIAL'});
table('classroom',440,184,128,48,{teacher:true});
for(const y of [256,368,480])for(const x of [208,336,464,592,720]){table('classroom',x,y,64,40,{desk:true});chair('classroom',x+20,y+48);}
object('classroom','locker',928,144,96,192);object('classroom','notice',96,144,64,64,{label:'CLASSE D'});
object('classroom','cabinet',96,576,160,48);planter('classroom',944,624);
prop('classroom','support','Tutorat collectif','1 créneau · préparation de classe',368,448);
prop('classroom','exam','Restituer le dossier','Examen spécial · vendredi',480,240);

// Library: reading islands west, long stack aisles east, a service desk south.
patch('library','rug',112,240,544,384);
object('library','shelf',112,128,544,40,{art:'libraryWallcase'});
for(const x of [736,864,992])object('library','shelfTall',x,176,32,352,{art:'libraryStack'});
for(const [x,y] of [[160,288],[416,288],[160,480],[416,480]]){table('library',x,y+13,176,38,{reading:true,art:'reading'});object('library','chair',x+32,y-32,24,24,{up:true,art:'libraryChair'});object('library','chair',x+112,y+72,24,24,{up:false,art:'libraryChair'});}
table('library',96,624,224,56,{service:true,art:'libraryDesk'});object('library','cart',672,576,48,48,{art:'libraryCart'});
planter('library',944,656);planter('library',80,192,48);
for(const o of SCENES.library.objects)if(o.type==='planter')o.art='libraryPlanter';
prop('library','study','Réviser le dossier','1 créneau · préparation +8',480,376);
prop('library','book','Acheter un manuel','1 créneau · 3 000 PP',208,704);

// Gym: full marked court, equipment, bleachers and changing-room lockers.
patch('gym','basketball',224,224,832,448);
object('gym','bleachers',96,240,64,384);object('gym','bleachers',1120,240,64,384);
object('gym','ballrack',224,128,128,48);object('gym','locker',864,128,192,48);
object('gym','hoop',192,416,32,48);object('gym','hoop',1056,416,32,48);
object('gym','mat',224,704,160,48);object('gym','mat',896,704,160,48);
prop('gym','train','Entraînement avec Daichi','1 créneau · sang-froid +4',416,352);

// The residence is authored as a continuous multi-room floor in residence-map.mjs.

// Sakura: deep counter, espresso station, a central aisle and window seats.
patch('cafe','tile',192,112,768,144);
object('cafe','counter',224,144,704,104,{art:'cafeCounter'});
for(const [x,y] of [[208,352],[448,352],[720,352],[208,560],[720,560]])dining('cafe',x,y);
object('cafe','sofa',96,272,56,312,{art:'cafeBanquette'});object('cafe','cabinet',944,144,48,64,{art:'cafeShop'});
planter('cafe',976,624,48);planter('cafe',80,640,64);
prop('cafe','coffee','Commander au comptoir','1 créneau · 600 PP · énergie +25',416,272);prop('cafe','shop','Supérette du Sakura','Boissons, fiches et cadeaux · sans créneau',992,272);

// Courtyard: a quieter enclosed garden, pond, benches and two meeting routes.
patch('courtyard','paving',512,64,192,768);patch('courtyard','paving',128,352,960,192);
patch('courtyard','stone',448,288,320,320);patch('courtyard','paving',256,640,704,96);
object('courtyard','fountain',552,392,112,104);
object('courtyard','pond',832,144,192,144);
bench('courtyard',256,320,128);bench('courtyard',832,512,128);bench('courtyard',320,640,128);
for(const [x,y] of [[256,192],[960,128],[208,640],[1008,704]])tree('courtyard',x,y,true);
for(const [x,y] of [[80,240],[1120,368],[112,768],[1088,800]])tree('courtyard',x,y);
for(const [x,y,w] of [[160,160,224],[768,640,224],[736,336,224],[256,560,160]])patch('courtyard','flowers',x,y,w,64);
planter('courtyard',448,192,64);planter('courtyard',704,704,64);
object('courtyard','notice',736,176,48,64,{label:'CLUBS'});
prop('courtyard','observe','Observer le passage','1 créneau · recueillir un indice',864,320);

// Small, authored landmarks make activities readable before a marker appears.
object('campus','wayfinder',680,400,24,32,{lines:['← Bibliothèque','Classe D ↑','Gymnase →']});
object('campus','wayfinder',1040,880,24,32,{lines:['← Résidence','Sakura →']});
object('campus','banner',576,312,20,36,{label:'D'});
object('campus','banner',1036,312,20,36,{label:'ANHS'});
object('campus','drain',736,808,192,8,{solid:false});
object('campus','drain',96,512,416,8,{solid:false});
object('campus','bin',1152,400,24,32);
object('classroom','wallClock',832,92,24,24,{solid:false});
object('classroom','notice',816,128,64,64,{label:'1-D',solid:false});
object('classroom','satchel',676,520,22,22);
object('classroom','satchel',292,292,22,22);
object('classroom','bin',992,560,24,32);
object('library','catalogue',608,144,48,48,{art:'libraryCatalogue'});
object('library','stackSign',736,176,32,16,{label:'01',solid:false});
object('library','stackSign',864,176,32,16,{label:'02',solid:false});
object('library','stackSign',992,176,32,16,{label:'03',solid:false});
object('library','returnBox',352,640,64,40,{art:'libraryReturn'});
object('gym','scoreboard',544,116,192,48,{solid:false});
object('gym','waterStation',1120,704,56,64);
object('gym','satchel',160,704,28,28);
object('cafe','vending',1000,144,40,64,{art:'cafeVending'});
object('cafe','chalkboard',944,352,40,56,{label:'SAKURA',art:'cafeChalkboard'});
object('cafe','bin',960,544,24,32,{art:'outdoorBin'});
let cafeTableIndex=0;
for(const o of SCENES.cafe.objects){
 if(o.type==='table')o.art=cafeTableIndex++%2?'cafeTableTea':'cafeTableCoffee';
 if(o.type==='chair')o.art=o.up?'cafeChairSouth':'cafeChairNorth';
 if(o.type==='planter')o.art='cafePlants';
}
object('courtyard','wayfinder',400,240,24,32,{lines:['← Campus','Jardin →']});
object('courtyard','drain',512,736,192,8,{solid:false});

const outdoorArt={tree:o=>o.cherry?'sakura':(Math.round(o.x+o.y)%3?'zelkova':'camphor'),lamp:()=> 'outdoorLamp',banner:o=>o.label==='D'?'bannerD':'bannerSchool',wayfinder:()=> 'outdoorWayfinder',notice:()=> 'outdoorNotice',bikes:()=> 'outdoorBikes',bench:()=> 'outdoorBench',planter:()=> 'outdoorPlanter',bin:()=> 'outdoorBin',fountain:()=> 'outdoorFountain',pond:()=> 'outdoorPond',drain:()=> 'outdoorDrain'};
for(const [id,s] of Object.entries(SCENES)){
 if(s.outdoor){for(const o of s.objects)if(!o.art&&outdoorArt[o.type])o.art=outdoorArt[o.type](o);for(const p of s.patches)if(p.type==='flowers')p.art='outdoorFlowers';}
 s.blocks=s.objects.filter(o=>o.solid!==false).map(o=>[o.x,o.y,o.w,o.h]);
 if(id!=='campus')s.portals=[{id:'campus',x:s.spawn.x,y:s.bounds[3]-8,name:'Retour au campus'}];
}
export function canStand(scene,x,y,residence=null){const s=SCENES[scene];if(!s)return false;const [l,t,r,b]=s.bounds;return x>=l+9&&x<=r-9&&y>=t+12&&y<=b-5&&(!s.walkable||s.walkable.some(([x0,y0,x1,y1])=>x>=x0&&x<=x1&&y>=y0&&y<=y1))&&!(scene==='dorm'&&doorBlocks(residence,x,y))&&!s.blocks.some(([bx,by,w,h])=>x>bx-8&&x<bx+w+8&&y>by-3&&y<by+h+6);}
export function safePosition(scene,p,residence=null){if(canStand(scene,p.x,p.y,residence))return {...p};for(let radius=12;radius<=160;radius+=12)for(let i=0;i<16;i++){const a=i*Math.PI/8,x=Math.round(p.x+Math.cos(a)*radius),y=Math.round(p.y+Math.sin(a)*radius);if(canStand(scene,x,y,residence))return{x,y};}return{...SCENES[scene].spawn};}
export function pathTo(scene,from,to,residence=null){
 const s=SCENES[scene];if(!s)return[];const step=16,cols=Math.ceil(s.w/step),rows=Math.ceil(s.h/step);
 const snap=p=>{let best=null,distance=Infinity;const cx=Math.round(p.x/step),cy=Math.round(p.y/step);for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const x=(cx+dx)*step,y=(cy+dy)*step,d=Math.hypot(x-p.x,y-p.y);if(d<distance&&canStand(scene,x,y,residence)){best=[cx+dx,cy+dy];distance=d;}}return best;};
 const startCell=snap(from),goalCell=snap(to);if(!startCell||!goalCell)return[];const [sx,sy]=startCell,[tx,ty]=goalCell,key=(x,y)=>y*cols+x,start=key(sx,sy),goal=key(tx,ty),open=[start],prev=new Map(),g=new Map([[start,0]]),f=new Map([[start,0]]),visited=new Set();
 while(open.length){open.sort((a,b)=>f.get(a)-f.get(b));const cur=open.shift();if(cur===goal){const path=[];let k=cur;while(k!==start){path.unshift({x:k%cols*step,y:Math.floor(k/cols)*step});k=prev.get(k);}if(Math.hypot(sx*step-from.x,sy*step-from.y)>4)path.unshift({x:sx*step,y:sy*step});return path.length?path:[{x:tx*step,y:ty*step}];}visited.add(cur);const x=cur%cols,y=Math.floor(cur/cols);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,n=key(nx,ny);if(nx<0||ny<0||nx>=cols||ny>=rows||visited.has(n)||!canStand(scene,nx*step,ny*step,residence)||!canStand(scene,(x+dx/2)*step,(y+dy/2)*step,residence))continue;const cost=g.get(cur)+1;if(cost<(g.get(n)??Infinity)){g.set(n,cost);prev.set(n,cur);f.set(n,cost+Math.abs(nx-tx)+Math.abs(ny-ty));if(!open.includes(n))open.push(n);}}}
 return[];
}

// Procedural architecture shares the same world coordinates as native cutouts.
const R=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
const L=(c,x,y,x2,y2,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.stroke();};
const poly=(c,points,color)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();};
const random=seed=>()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
function tile(c,x,y,type,rand){
 if(type==='grass'){R(c,x,y,32,32,['#697b50','#6c7e53','#6f8156'][Math.floor(rand()*3)]);for(let i=0;i<7;i++){const px=x+rand()*28+2,py=y+rand()*28+2;c.strokeStyle=i%2?'#80915e80':'#5d704880';c.lineWidth=.7;c.beginPath();c.moveTo(px,py+2);c.quadraticCurveTo(px-1,py,px+1,py-2);c.stroke();}return;}
 if(type==='wood'||type==='court'){const colors=type==='court'?['#bd9361','#c19a69','#c8a373']:['#a47d56','#aa835c','#b18b62'];R(c,x,y,32,32,colors[Math.floor(rand()*3)]);for(let j=0;j<2;j++){R(c,x,y+j*16,32,1,'#80664a');R(c,x+2,y+j*16+2,28,1,'#d4ae7d66');R(c,x+9,y+j*16+10,14,1,'#805f3c33');}R(c,x+(Math.floor(y/32)%2)*16,y,1,32,'#8e6b46');return;}
 const palettes={school:['#b5b6aa','#b8b9ad','#bdbdb1'],cafe:['#acaa96','#b3af9b','#b9b4a1'],paving:['#b6b6a5','#bfbfae','#b9baaa'],stone:['#c7c4b1','#ccc8b6','#c0beac'],tile:['#ddd6bc','#cfc8ae','#d9d1b8']};const colors=palettes[type]??palettes.stone;
 R(c,x,y,32,32,type==='school'?'#a3aa99':'#a5ab99');R(c,x+1,y+1,31,31,colors[Math.floor(rand()*3)]);R(c,x+2,y+2,29,1,'#e3ddc026');if(rand()>.7)R(c,x+6,y+24,12,1,'#838c7955');
}
function patchDraw(c,p){const rand=random(p.x*5+p.y);if(p.type==='rug'){R(c,p.x,p.y,p.w,p.h,'#464f4b');R(c,p.x+4,p.y+4,p.w-8,p.h-8,'#68756b');R(c,p.x+10,p.y+10,p.w-20,p.h-20,'#7a8676');for(let y=p.y+18;y<p.y+p.h-12;y+=8)R(c,p.x+14,y,p.w-28,1,'#65776a');return;}
 if(p.type==='flowers'){R(c,p.x,p.y,p.w,p.h,'#7f8264');R(c,p.x+4,p.y+4,p.w-8,p.h-8,'#506a48');for(let i=0;i<p.w*p.h/110;i++){const x=p.x+8+Math.floor(rand()*(p.w-20)/4)*4,y=p.y+8+Math.floor(rand()*(p.h-20)/4)*4;c.fillStyle=['#bc8784','#deaaa0','#d6c486','#8eae76'][i%4];c.beginPath();c.arc(x+2,y+2,2.6,0,Math.PI*2);c.fill();c.fillStyle='#e3d2a6';c.beginPath();c.arc(x+2,y+2,.8,0,Math.PI*2);c.fill();}return;}
 if(p.type==='platform'){R(c,p.x,p.y,p.w,p.h,'#8d795b');R(c,p.x,p.y+p.h-5,p.w,5,'#645b49');for(let x=p.x;x<p.x+p.w;x+=32)R(c,x+2,p.y+3,29,p.h-10,'#ad9572');return;}
 if(p.type==='basketball'){for(let yy=p.y;yy<p.y+p.h;yy+=32)for(let xx=p.x;xx<p.x+p.w;xx+=32)tile(c,xx,yy,'court',rand);c.strokeStyle='#e5dbc0';c.lineWidth=3;c.strokeRect(p.x,p.y,p.w,p.h);L(c,p.x+p.w/2,p.y,p.x+p.w/2,p.y+p.h,'#eee0bd',3);c.beginPath();c.arc(p.x+p.w/2,p.y+p.h/2,64,0,Math.PI*2);c.stroke();for(const x of [p.x,p.x+p.w-128]){c.strokeRect(x,p.y+112,128,224);c.beginPath();c.arc(x===p.x?x+128:x,p.y+p.h/2,64,-Math.PI/2,Math.PI/2,x!==p.x);c.stroke();}return;}
 for(let y=p.y;y<p.y+p.h;y+=32)for(let x=p.x;x<p.x+p.w;x+=32)tile(c,x,y,p.type,rand);
}
function roomWalls(c,s){const [l,t,r,b]=s.bounds;R(c,l-24,t-64,r-l+48,b-t+88,'#282d33');R(c,l-20,t-60,r-l+40,58,'#c0c5b2');R(c,l-20,t-60,r-l+40,6,'#e2e0c9');R(c,l-20,t-24,r-l+40,24,'#69817a');R(c,l-20,t-24,r-l+40,3,'#8e9d8c');R(c,l-20,t-3,r-l+40,8,'#435c59');R(c,l-20,t,20,b-t,'#829386');R(c,r,t,20,b-t,'#697f75');R(c,l,b,r-l,12,'#546e65');R(c,l,b+12,r-l,7,'#b1b8a1');
 for(let y=t+80;y<b-56;y+=144){R(c,l-17,y,14,80,'#375765');R(c,l-14,y+3,9,72,'#9bbbc0');R(c,l-14,y+39,9,3,'#d8dbc1');poly(c,[[l,y+4],[l+160,y+68],[l+160,y+136],[l,y+72]],'#ead8a027');}
 for(let x=l+112;x<r-80;x+=192){R(c,x,t-52,96,24,'#45595e');R(c,x+3,t-49,90,18,'#96b5b4');R(c,x+46,t-49,3,18,'#d9decc');R(c,x-3,t-28,102,4,'#e1dfc8');}
 R(c,s.spawn.x-36,b-2,72,21,'#bdb79c');R(c,s.spawn.x-36,b+17,72,3,'#e0dbc2');for(let x=s.spawn.x-30;x<s.spawn.x+32;x+=12)R(c,x,b,1,16,'#8e967e');
}
export function drawGround(c,id){const s=SCENES[id],rand=random(id.length*387);R(c,0,0,s.w,s.h,s.outdoor?'#66794e':'#202831');if(!s.outdoor)roomWalls(c,s);const [l,t,r,b]=s.bounds;for(let y=s.outdoor?0:t;y<(s.outdoor?s.h:b);y+=32)for(let x=s.outdoor?0:l;x<(s.outdoor?s.w:r);x+=32)tile(c,x,y,s.outdoor?'grass':s.floor,rand);for(const p of s.patches)patchDraw(c,p);
 if(s.outdoor){for(let x=32;x<s.w-32;x+=24){R(c,x,48,2,14,'#3e564b');R(c,x,50,23,2,'#9aab83');}for(let y=64;y<s.h-48;y+=24){R(c,24,y,2,14,'#3e564b');R(c,s.w-26,y,2,14,'#3e564b');}for(let i=0;i<90;i++){const x=Math.floor(rand()*s.w),y=Math.floor(rand()*s.h);if(rand()>.5)R(c,x,y,3,2,'#c9a68c66');}}
 else{for(let x=l+8;x<r;x+=64)R(c,x,t+8,36,2,'#454d4322');R(c,l,t,r-l,12,'#263c3d22');for(let y=t+80;y<b-56;y+=144){poly(c,[[l,y+4],[l+160,y+68],[l+160,y+136],[l,y+72]],'#ffe0a524');L(c,l+4,y+8,l+155,y+68,'#fff0c522',2);}R(c,l,b-4,r-l,4,'#263c3d22');
  // The south entrance has a recessed threshold and a worn entrance mat.
  const sx=s.spawn.x;R(c,sx-43,b-37,86,25,'#67796d');R(c,sx-40,b-35,80,19,'#849084');for(let yy=b-32;yy<b-17;yy+=4)R(c,sx-36,yy,72,1,'#536d62');
  const label={classroom:'1-D',library:'BIBLIOTHÈQUE',gym:'GYMNASE',dorm:'CHAMBRE 104',cafe:'SAKURA'}[id];R(c,sx+53,b-19,88,14,'#d7d4bb');c.fillStyle='#495c59';c.font='bold 7px monospace';c.textAlign='center';c.fillText(label,sx+97,b-9);
 }
}
function books(c,x,y,w,h=24){const colors=['#7e4150','#55716d','#c5ab73','#4f5c75','#9a7655'];for(let i=0;i<w-8;i+=7){R(c,x+i,y,5,h,colors[(i*3)%5]);R(c,x+i,y+3,5,1,'#e2cca877');R(c,x+i+1,y+6,1,h-9,'#fff1c21a');}}
function book(c,x,y,color='#d1c9a8'){R(c,x+2,y+2,22,15,'#26373744');R(c,x,y,22,14,color);R(c,x+10,y,2,14,'#8f8d77');R(c,x+3,y+4,5,1,'#a59b7c');R(c,x+14,y+4,5,1,'#a59b7c');}
function leaves(c,x,y,w,h,cherry=false){
 const colors=cherry?['#896c76','#af818d','#cd999e','#e4b3af','#f1cbbd']:['#425d43','#5d754a','#7a8d53','#98a260','#b2b172'],rand=random(x+y*17);
 const blob=(px,py,rx,ry,color)=>{c.fillStyle=color;c.beginPath();c.ellipse(px,py,rx,ry,-.25,0,Math.PI*2);c.fill();};
 blob(x+w/2,y+h/2,w*.47,h*.46,colors[1]);
 for(let i=0;i<Math.max(35,w*h/60);i++){
  const nx=rand()*2-1,ny=rand()*2-1;if(nx*nx+ny*ny>.88)continue;
  const shade=Math.max(0,Math.min(4,Math.floor((1-ny)*1.2+(1-nx)*.5+rand())));
  blob(x+w/2+nx*w*.47,y+h/2+ny*h*.47,3+rand()*5,2+rand()*3,colors[shade]);
 }
}
export function drawObject(c,o){const {x,y,w,h,type}=o;const shadow=()=>{};
 if(type==='wayfinder'){shadow();R(c,x+9,y-34,6,h+34,'#536259');R(c,x+10,y-34,2,h+29,'#8c9985');for(let i=0;i<o.lines.length;i++){R(c,x-29,y-39+i*14,82,13,i%2?'#e0dbc2':'#405b59');c.fillStyle=i%2?'#435d58':'#e0dbc2';c.font='bold 7px monospace';c.textAlign='center';c.fillText(o.lines[i],x+12,y-30+i*14);}R(c,x+3,y+h-5,18,5,'#7a8876');return;}
 if(type==='banner'){shadow();R(c,x+2,y-32,3,h+30,'#4b6263');R(c,x+5,y-29,w+10,h-3,'#8a4054');R(c,x+7,y-27,w+6,2,'#c69385');poly(c,[[x+5,y+h-32],[x+w+15,y+h-32],[x+w+15,y+h-20],[x+14,y+h-25],[x+5,y+h-20]],'#8a4054');c.fillStyle='#e3d4b3';c.font=`bold ${o.label.length>1?6:16}px monospace`;c.textAlign='center';c.fillText(o.label,x+w/2+9,y-9);return;}
 if(type==='drain'){R(c,x,y,w,h,'#818d7d');R(c,x+1,y+1,w-2,h-2,'#4b625b');for(let xx=x+3;xx<x+w-2;xx+=5)R(c,xx,y+1,2,h-2,'#a1ac92');return;}
 if(type==='wallClock'){R(c,x+3,y+3,w,h,'#304b4d33');R(c,x,y,w,h,'#526c69');R(c,x+3,y+3,w-6,h-6,'#e4dec2');for(const [dx,dy] of [[11,4],[18,11],[11,18],[4,11]])R(c,x+dx,y+dy,2,2,'#8c9783');L(c,x+12,y+12,x+12,y+6,'#45575a',2);L(c,x+12,y+12,x+17,y+15,'#8a4a58');return;}
 if(type==='stackSign'){R(c,x,y-23,w,15,'#e1dbc0');R(c,x,y-10,w,2,'#5c5142');c.fillStyle='#644855';c.textAlign='center';c.font='bold 8px monospace';c.fillText(o.label,x+w/2,y-12);return;}
 if(type==='catalogue'){shadow();R(c,x,y,w,h,'#605d49');R(c,x+2,y+2,w-4,h-7,'#9f865f');for(let row=0;row<3;row++)for(let col=0;col<2;col++){const xx=x+4+col*20,yy=y+4+row*12;R(c,xx,yy,18,10,'#b4a17a');R(c,xx+5,yy+4,8,3,'#6d705a');R(c,xx+7,yy+4,4,1,'#e2d2a4');}return;}
 if(type==='returnBox'){shadow();R(c,x,y,w,h,'#3a555c');R(c,x+3,y+3,w-6,h-9,'#738e8a');R(c,x+8,y+6,w-16,7,'#29444c');c.fillStyle='#e1dec0';c.font='bold 6px monospace';c.textAlign='center';c.fillText('RETOURS',x+w/2,y+25);return;}
 if(type==='vending'){shadow();R(c,x,y-24,w,h+24,'#8d4d55');R(c,x+3,y-21,w-6,h+16,'#b56468');R(c,x+7,y-17,w-22,44,'#3c5b60');for(let row=0;row<2;row++)for(let col=0;col<4;col++){const xx=x+11+col*9,yy=y-13+row*18;R(c,xx,yy,6,13,['#a9c2b2','#d3b57e','#ba7b7d','#8fa9be'][col]);R(c,xx+1,yy+2,4,2,'#ede4bf');}R(c,x+w-11,y-9,5,16,'#263c48');R(c,x+w-10,y-4,3,3,'#d9d8a5');R(c,x+12,y+38,w-24,11,'#385057');R(c,x+15,y+39,w-30,3,'#233c48');return;}
 if(type==='chalkboard'){shadow();R(c,x+2,y+1,4,h+4,'#8b7450');R(c,x+w-6,y+1,4,h+4,'#8b7450');R(c,x,y-22,w,h,'#9f8760');R(c,x+3,y-19,w-6,h-7,'#3c5b51');c.font='bold 6px monospace';c.textAlign='center';c.fillStyle='#dfddbb';c.fillText(o.label,x+w/2,y-7);for(let row=0;row<3;row++){R(c,x+7,y+1+row*7,w-20,1,'#a8ba95');R(c,x+w-11,y+1+row*7,4,1,'#bcbf9c');}return;}
 if(type==='scoreboard'){R(c,x,y,w,h,'#586956');R(c,x+3,y+3,w-6,h-6,'#273f4a');R(c,x+w/2-1,y+4,2,h-8,'#8b9a7a');c.font='bold 20px monospace';c.textAlign='center';c.fillStyle='#d2b177';c.fillText('00',x+w/4,y+30);c.fillText('00',x+w*3/4,y+30);c.font='6px monospace';c.fillStyle='#c5cfac';c.fillText('HOME',x+w/4,y+10);c.fillText('GUEST',x+w*3/4,y+10);return;}
 if(type==='waterStation'){shadow();R(c,x,y-20,w,h+20,'#556a68');R(c,x+3,y-17,w-6,h+12,'#a1b2a3');R(c,x+10,y-15,w-20,20,'#93b7b7');R(c,x+12,y-13,w-24,3,'#c1d1b9');R(c,x+12,y+15,w-24,18,'#3f5a5c');R(c,x+w/2-3,y+12,6,8,'#d7d9bc');R(c,x+8,y+h-13,w-16,5,'#718c80');return;}
 if(type==='bin'){shadow();R(c,x+1,y,w-2,h,'#597469');R(c,x+4,y+3,w-8,h-6,'#7e9581');R(c,x,y-2,w,5,'#afbaa0');R(c,x+6,y+6,w-12,5,'#3b5752');return;}
 if(type==='satchel'){shadow();R(c,x+3,y+3,w-6,h-4,'#3d414e');R(c,x+5,y+5,w-10,h-10,'#61616b');R(c,x+6,y,w-12,4,'#343d45');R(c,x+7,y+7,w-14,2,'#988b82');return;}
 if(type==='shoes'){for(let i=0;i<2;i++){R(c,x+i*21,y+3,14,h-4,'#3a3e45');R(c,x+2+i*21,y+2,10,6,'#6c625b');R(c,x+i*21,y+h-4,14,2,'#b8ac91');}return;}
 if(type==='calendar'){R(c,x+2,y+2,w,h,'#273d4533');R(c,x,y,w,h,'#ece2c3');R(c,x,y,w,10,'#9e525e');R(c,x+6,y-2,3,7,'#526b62');R(c,x+w-9,y-2,3,7,'#526b62');for(let row=0;row<4;row++)for(let col=0;col<5;col++)R(c,x+6+col*6,y+16+row*7,3,3,(row+col)%6===0?'#a65c68':'#94a18b');return;}
 if(type==='building'){shadow();const roof={slate:['#465968','#617482','#81909a'],wine:['#713e4b','#925460','#b07579'],green:['#4f6865','#6d8580','#8d9e8c']}[o.roof];R(c,x,y,w,h,'#53625f');R(c,x+4,y+8,w-8,h-8,'#dfd6b7');R(c,x+4,y+h-58,w-8,58,'#b6b397');for(let i=16;i<w-32;i+=48){R(c,x+i,y+h-48,32,32,'#405563');R(c,x+i+2,y+h-46,28,26,'#7f9fa6');R(c,x+i+14,y+h-46,2,26,'#c4d3c1');R(c,x+i+2,y+h-31,28,2,'#c4d3c1');R(c,x+i-2,y+h-16,36,4,'#e5dec3');}R(c,x-8,y-12,w+16,h-52,roof[0]);R(c,x-4,y-8,w+8,h-56,roof[1]);for(let yy=y;yy<y+h-68;yy+=12){R(c,x,yy,w,2,roof[0]);R(c,x,yy+2,w,1,roof[2]);for(let xx=x+(yy%24?12:0);xx<x+w;xx+=24)R(c,xx,yy+3,1,8,roof[0]);}R(c,x-8,y-12,w+16,5,roof[2]);R(c,x-10,y+h-66,w+20,5,roof[0]);R(c,x+w/2-20,y+16,40,32,'#344652');R(c,x+w/2-16,y+18,32,24,'#91aaa9');R(c,x+w/2-18,y+16,36,3,'#c7c6ac');R(c,o.door-24,y+h-48,48,48,'#334f58');R(c,o.door-20,y+h-44,40,40,'#7a9998');R(c,o.door-1,y+h-43,2,40,'#d8d4b6');R(c,o.door+4,y+h-23,3,3,'#e9d7a8');R(c,o.door-36,y+h,72,10,'#b7b6a1');R(c,o.door-40,y+h+10,80,5,'#8b998c');R(c,o.door-48,y+h-62,96,14,'#e0d7b8');c.font='bold 7px monospace';c.textAlign='center';c.fillStyle='#3a4d52';c.fillText(o.label,o.door,y+h-52);if(o.awning){for(let i=0;i<10;i++)R(c,x+16+i*(w-32)/10,y+h-62,(w-32)/10,20,i%2?'#e0d5b7':'#8f4050');}return;}
 if(type==='tree'){R(c,x+6,y-18,12,48,'#4a4936');R(c,x+9,y-17,5,43,'#877458');leaves(c,x-44,y-112,112,104,o.cherry);return;}
 if(type==='planter'){shadow();R(c,x,y,w,h,'#7d8270');R(c,x+2,y+2,w-4,h-8,'#bcc0a0');R(c,x+5,y+5,w-10,h-16,'#3e5743');for(let xx=x+12;xx<x+w;xx+=20)leaves(c,xx-8,y-10,24,28);R(c,x,y+h-6,w,5,'#647663');return;}
 if(type==='fountain'||type==='pond'){shadow();const cut=type==='fountain'?16:12;poly(c,[[x+cut,y],[x+w-cut,y],[x+w,y+cut],[x+w,y+h-cut],[x+w-cut,y+h],[x+cut,y+h],[x,y+h-cut],[x,y+cut]],'#747e73');R(c,x+cut,y+4,w-cut*2,h-8,'#d1d0b5');R(c,x+4,y+cut,w-8,h-cut*2,'#c3c6ac');R(c,x+cut,y+10,w-cut*2,h-20,'#557d82');R(c,x+10,y+cut,w-20,h-cut*2,'#6d999a');for(let yy=y+20;yy<y+h-16;yy+=14)R(c,x+20+(yy%3)*7,yy,w-54,2,'#a5c3b2');if(type==='fountain'){R(c,x+w/2-14,y+h/2-12,28,32,'#c4ccb4');R(c,x+w/2-8,y+h/2-44,16,36,'#9eaf9c');R(c,x+w/2-18,y+h/2-48,36,8,'#e0e0c1');}else{leaves(c,x+4,y+4,36,24);R(c,x+w-36,y+h-36,16,8,'#8da782');R(c,x+w-30,y+h-32,5,4,'#d8ab95');}return;}
 if(type==='lamp'){R(c,x+4,y-64,4,80,'#33494b');R(c,x,y+12,12,5,'#596c60');R(c,x-4,y-71,20,5,'#34494c');R(c,x-1,y-66,14,11,'#dbcf9e');R(c,x+2,y-64,7,7,'#f2deb1');return;}
 if(type==='bench'||type==='bleachers'){shadow();const count=type==='bleachers'?Math.floor(h/32):1;for(let i=0;i<count;i++){const yy=y+i*32;R(c,x+8,yy+12,w-16,17,'#4d5c4e');R(c,x,yy,w,20,'#8c6e4b');for(let j=0;j<3;j++)R(c,x+1,yy+2+j*6,w-2,3,'#b09260');R(c,x+4,yy-7,w-8,5,'#a58b5c');}return;}
 if(type==='chair'){shadow();R(c,x+3,y+3,w-6,h-3,'#344b48');R(c,x+2,y+2,w-4,h-7,'#665d4c');R(c,x+4,y+4,w-8,h-11,'#85917c');R(c,x+2,y+(o.up?18:-2),w-4,5,'#ad9e7b');return;}
 if(type==='table'||type==='counter'){shadow();R(c,x,y,w,h,'#534b3d');R(c,x+2,y+2,w-4,h-8,'#ac875c');R(c,x+3,y+3,w-6,3,'#cfac77');for(let xx=x+24;xx<x+w;xx+=32){R(c,xx,y+6,1,h-16,'#73573d44');R(c,xx-13,y+12,9,1,'#dec19033');R(c,xx+4,y+h-17,18,1,'#634d3433');}R(c,x+2,y+h-7,w-4,5,'#74573d');if(o.reading||o.teacher||(o.desk&&(x+y)%5<3)){book(c,x+16,y+12);R(c,x+w-34,y+12,18,11,'#8d5355');R(c,x+w-29,y+8,2,10,'#d2bc87');}if(o.reading){R(c,x+w/2-5,y+5,10,10,'#4b6259');R(c,x+w/2-13,y+2,26,7,'#acbc90');}if(o.service){books(c,x+12,y+10,w-64,20);R(c,x+w-44,y+10,30,24,'#354b54');R(c,x+w-40,y+13,22,14,'#97b5a3');}if(o.phone){R(c,x+34,y+14,13,20,'#243a49');R(c,x+36,y+16,9,14,'#8faeb0');book(c,x+76,y+14);}if(o.cafe){for(const xx of [x+18,x+78]){R(c,xx,y+18,16,12,'#e5d8b7');R(c,xx+3,y+19,10,6,'#6a4937');R(c,xx+16,y+21,4,6,'#d1c7a7');}R(c,x+44,y+38,22,10,'#c8b89b');}if(type==='counter'){R(c,x+16,y+8,80,44,'#2c424b');R(c,x+20,y+12,72,28,'#7c9090');R(c,x+28,y+16,17,19,'#354e54');R(c,x+60,y+16,17,19,'#354e54');for(let xx=x+176;xx<x+w-24;xx+=64){R(c,xx,y+10,40,36,'#d7cab1');R(c,xx+4,y+15,32,24,'#9da69a');R(c,xx+6,y+18,12,8,'#9d7451');}R(c,x+108,y+12,32,48,'#577465');}return;}
 if(type==='shelf'||type==='shelfTall'){shadow();R(c,x,y,w,h,'#554d3b');R(c,x+3,y+3,w-6,h-7,'#87714e');if(type==='shelf')books(c,x+7,y+5,w-12,24);else for(let yy=y+8;yy<y+h-24;yy+=40){books(c,x+5,yy,w-6,24);R(c,x+2,yy+27,w-4,4,'#b89d6c');}R(c,x,y+h-5,w,5,'#b39766');R(c,x+1,y+h-5,w-2,1,'#d8bd86');return;}
 if(type==='board'||type==='menu'){R(c,x-3,y-3,w+6,h+6,'#8d7554');R(c,x,y,w,h,'#31534e');R(c,x+4,y+4,w-8,h-8,'#3a5e55');c.font='bold 10px monospace';c.fillStyle='#d9deba';c.textAlign='center';c.fillText(o.label,x+w/2,y+18);L(c,x+18,y+h-10,x+w-18,y+h-10,'#96a991');return;}
 if(type==='notice'){shadow();R(c,x,y,w,h,'#6d6550');R(c,x+3,y+3,w-6,h-7,'#a48e65');R(c,x+7,y+9,w/2-9,24,'#e2d9ba');R(c,x+w/2+2,y+18,w/2-9,30,'#bbc4b0');R(c,x+10,y+8,3,3,'#8b3e4b');R(c,x+w/2+6,y+16,3,3,'#8b3e4b');return;}
 if(type==='bed'){shadow();R(c,x,y,w,h,'#6b5c49');R(c,x+3,y+4,w-6,h-10,'#ccc9b0');R(c,x+7,y+8,w-14,32,'#e9e1c8');R(c,x+8,y+47,w-16,h-56,'#596e7d');for(let yy=y+56;yy<y+h-12;yy+=12)R(c,x+9,yy,w-18,2,'#79929a');R(c,x+4,y+h-12,w-8,8,'#3e555f');return;}
 if(type==='sofa'){shadow();R(c,x,y,w,h,'#42534d');R(c,x+5,y+3,w-10,h-10,'#768471');R(c,x+10,y+12,w-20,h-22,'#99a18a');for(let xx=x+12;xx<x+w-8;xx+=48)R(c,xx,y+12,2,h-24,'#667c6b');R(c,x+3,y+3,8,h-9,'#a9af92');R(c,x+w-11,y+3,8,h-9,'#a9af92');return;}
 if(type==='locker'||type==='wardrobe'||type==='cabinet'){shadow();R(c,x,y,w,h,'#526862');const horizontal=w>h;const n=Math.max(1,Math.floor((horizontal?w:h)/32));for(let i=0;i<n;i++){const xx=x+(horizontal?i*w/n:0),yy=y+(horizontal?0:i*h/n),ww=horizontal?w/n:w,hh=horizontal?h:h/n;R(c,xx+2,yy+2,ww-4,hh-5,type==='wardrobe'?'#9a8060':'#8d9d8a');R(c,xx+6,yy+6,ww-12,2,'#a9b6a0');R(c,xx+ww-8,yy+hh/2,2,6,'#344f4e');}return;}
 if(type==='mat'){shadow();R(c,x,y,w,h,'#466a77');R(c,x+3,y+3,w-6,h-8,'#72979b');for(let xx=x+32;xx<x+w;xx+=32)R(c,xx,y+3,2,h-8,'#4e7984');return;}
 if(type==='hoop'){R(c,x+w/2-3,y-32,6,70,'#4c6266');R(c,x,y-34,w,6,'#ced3bf');R(c,x+7,y-25,w-14,4,'#b26f50');for(let xx=x+9;xx<x+w-5;xx+=4)R(c,xx,y-21,1,12,'#e8dfbf');return;}
 if(type==='ballrack'){shadow();R(c,x,y,w,h,'#59695b');for(let xx=x+8;xx<x+w;xx+=24){R(c,xx,y+8,16,16,'#ac714a');R(c,xx+7,y+8,2,16,'#654b37');R(c,xx,y+15,16,2,'#654b37');}return;}
 if(type==='bikes'){for(let xx=x;xx<x+w;xx+=24){c.strokeStyle='#394f52';c.lineWidth=2;c.strokeRect(xx,y+14,16,14);L(c,xx+2,y+25,xx+13,y+10,'#a5b1a0',2);L(c,xx+13,y+10,xx+19,y+25,'#a5b1a0',2);}return;}
 if(type==='cart'){shadow();R(c,x,y,w,h,'#667564');R(c,x+3,y+4,w-6,h-10,'#b2a178');books(c,x+6,y+8,w-10,22);return;}
 if(type==='bag'){shadow();R(c,x+4,y+2,w-8,h-5,'#503f47');R(c,x+8,y+6,w-16,h-13,'#73515b');R(c,x+10,y-2,w-20,4,'#343b41');}
}
export function drawPlan(c,id,w,h,activeRoomId=id==='dorm'?null:undefined){const s=SCENES[id],scale=Math.min((w-20)/s.w,(h-20)/s.h),ox=(w-s.w*scale)/2,oy=(h-s.h*scale)/2;R(c,0,0,w,h,'#202c37');c.save();c.translate(ox,oy);c.scale(scale,scale);R(c,0,0,s.w,s.h,s.walkable?'#20272d':'#394b4b');for(const p of s.patches)if(!p.roomId||p.roomId===activeRoomId)R(c,p.x,p.y,p.w,p.h,p.type==='flowers'?'#687d63':p.type==='residenceCarpet'?'#80505b':p.type==='rug'?'#657064':'#a6ad97');for(const o of s.objects)if(!o.roomId||o.roomId===activeRoomId)R(c,o.x,o.y,o.w,o.h,o.type==='pond'||o.type==='fountain'?'#63878c':o.type==='building'?'#697d83':o.type==='residenceWall'?'#39434a':'#63716b');if(s.rooms){for(const room of [...s.rooms,...s.shared])if(room.id!==activeRoomId)R(c,room.x,room.y,room.w,room.h,'#29343e');c.textAlign='center';c.textBaseline='middle';c.font='bold 64px sans-serif';for(const room of s.rooms){c.fillStyle=room.own?'#ffe5a2':'#f2e5ce';c.fillText(String(room.number),room.x+room.w/2,room.y+room.h/2);}}c.restore();return{scale,ox,oy};}
