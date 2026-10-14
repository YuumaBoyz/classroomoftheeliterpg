// One continuous floor: eight bedrooms, two cross halls and five shared rooms.
export const RESIDENCE_VERSION=9;
export const RESIDENCE_SCALE=.5;
export const RESIDENCE_WAKE=Object.freeze({x:544,y:592});
export function createResidence(){
 const s={w:3200,h:2432,bounds:[64,112,3136,2368],spawn:{x:1600,y:2304},floor:'residence',objects:[],patches:[],props:[],portals:[],extras:[],walkable:[],rooms:[],windows:[]};
 const floor=(type,x,y,w,h)=>{const p={type,x,y,w,h};s.patches.push(p);s.walkable.push([x,y,x+w,y+h]);return p;};
 const obj=(type,art,x,y,w,h,extra={})=>{const o={type,art,x,y,w,h,...extra};s.objects.push(o);return o;};
 const wall=(x,y,w,h,vertical=false)=>obj('residenceWall',vertical?'residenceWallSide':'residenceWall',x,y,w,h,{vertical});
 const marker=(id,name,detail,x,y,description)=>s.props.push({id,name,detail,x,y,description});
 const bedroom=(number,x,y)=>{
  const w=608,h=480,door=x+w/2,own=number===106;
  floor('residenceOak',x,y,w,h);
  floor('residenceStone',door-56,y+h,112,40);
  wall(x-24,y-24,w+48,24);wall(x-24,y,24,h,true);wall(x+w,y,24,h,true);
  wall(x,y+h,w/2-56,24);wall(door+56,y+h,w/2-56,24);
  obj('doorFrame','residenceDoor',door-56,y+h,112,24,{solid:false,sortY:y+h+24});
  obj('window','residenceWindow',x+240,y-24,128,8,{solid:false,sortY:y});s.windows.push({x:x+240,y,w:128,room:[x,y,w,h]});
  obj('bed',number%3===0?'residenceBedWine':number%2?'residenceBedSage':'residenceBedBlue',x+40,y+48,64,120);
  obj('wardrobe','residenceWardrobe',x+488,y+80,80,64);
  obj('table','residenceDesk',x+240,y+80,112,64);
  obj('chair','libraryChair',x+296,y+168,32,32);
  obj('shelf','libraryWallcase',x+40,y+320,144,28);
  obj('cabinet','residenceNightstand',x+464,y+352,48,40);
  obj('planter','libraryPlanter',x+528,y+208,40,32);
  s.patches.push({type:'residenceCarpet',x:x+208,y:y+240,w:192,h:112});
  const room={id:`room-${number}`,number,x,y,w,h,door:{x:door,y:y+h+48},center:{x:x+288,y:y+288},own};s.rooms.push(room);
  marker(`room-${number}`,own?'Chambre 106 · Votre chambre':`Chambre ${number}`,own?'Lit, carnet et téléphone':'Chambre individuelle',door,y+h+48,own?'Votre chambre. Votre lit se trouve à gauche ; votre carnet est sur le bureau et votre téléphone sur la table près de l’entrée.':'Un lit, un bureau, une armoire et quelques affaires personnelles. Chaque élève dispose de sa propre chambre dans cette aile.');
  if(own){
   marker('sleep','Votre lit · Chambre 106','Se reposer · terminer la journée',x+136,y+184);
   marker('journal','Votre carnet','Informations et souvenirs',x+320,y+224);
   marker('phone','Votre téléphone','Messages et points privés',x+464,y+416);
  }
 };
 floor('residenceStone',1440,112,320,2256);
 floor('residenceStone',96,664,3008,200);floor('residenceStone',96,1400,3008,264);
 for(const [row,y] of [160,896].entries())for(const [col,x] of [96,800,1792,2496].entries())bedroom(101+row*4+col,x,y);
 // Corridor ends and the entrance spine are enclosed independently of the rooms.
 wall(1416,112,24,528,true);wall(1760,112,24,528,true);wall(1416,896,24,480,true);wall(1760,896,24,480,true);
 wall(1416,1696,24,672,true);wall(1760,1696,24,672,true);wall(1440,88,320,24);
 for(const [y,h] of [[664,200],[1400,264]]){wall(72,y,24,h,true);wall(3104,y,24,h,true);}
 for(const [x,w] of [[96,1312],[1792,1312]]){
  s.patches.push({type:'residenceCarpet',x:x+24,y:720,w:w-48,h:80},{type:'residenceCarpet',x:x+24,y:1488,w:w-48,h:96});
 }
 s.patches.push({type:'residenceCarpet',x:1536,y:256,w:128,h:1856},{type:'residenceCarpet',x:1496,y:2192,w:208,h:144});
 const shared=(id,name,x,w,material,description)=>{
  const y=1696,h=592,door=x+w/2;
  floor(material,x,y,w,h);floor('residenceStone',door-56,y-32,112,32);
  wall(x-24,y,24,h,true);wall(x+w,y,24,h,true);wall(x,y+h,w,24);
  wall(x,y-32,w/2-56,32);wall(door+56,y-32,w/2-56,32);
  obj('doorFrame','residenceDoor',door-56,y-32,112,32,{solid:false,sortY:y});
  obj('window','residenceWindow',x+w/2-64,y+h,128,8,{solid:false});
  marker(id,name,'Espace commun · explorer',door,y+48,description);
  return {id,name,x,y,w,h,door:{x:door,y:y-8},center:{x:door,y:y+304}};
 };
 s.shared=[
  shared('residence-lounge','Salon commun',96,704,'residenceOak','Des canapés, une télévision et une table basse. Le salon est ouvert aux résidents après les cours.'),
  shared('residence-study','Salle d’étude',832,576,'residenceOak','Deux grandes tables permettent de lire ou de préparer les cours au calme. Les séances de tutorat restent organisées en classe D et à la bibliothèque.'),
  shared('residence-laundry','Laverie',1792,384,'residenceTile','Les machines et la table de pliage sont partagées par les résidents. Un panier oublié attend son propriétaire.'),
  shared('residence-bathroom','Sanitaires communs',2208,352,'residenceTile','Les cabines de douche et les sanitaires se trouvent à côté de la laverie.'),
  shared('residence-kitchen','Cuisine commune',2592,512,'residenceOak','Un évier, une plaque de cuisson, un réfrigérateur et une table pour prendre le petit déjeuner ensemble.')
 ];
 s.shared[0].center.y=2128;
 s.shared[4].center={x:2960,y:2096};
 obj('sofa','residenceSofa',208,1776,176,96);obj('sofa','residenceArmchair',624,1840,80,80);obj('sofa','residenceArmchair',192,2032,80,80);
 obj('table','residenceCoffeeTable',368,1968,128,64);obj('cabinet','residenceTV',144,2160,192,64);
 obj('shelf','libraryWallcase',560,2184,176,32);obj('planter','libraryPlanter',112,1800,48,40);
 for(const [x,y] of [[912,1792],[912,2064]]){obj('table','reading',x,y,336,72,{reading:true});obj('chair','libraryChair',x+48,y+112,40,40);obj('chair','libraryChair',x+240,y+112,40,40);}
 obj('counter','residenceLaundry',1912,1840,144,96);obj('table','residenceFoldTable',1920,2072,128,72);
 obj('cabinet','residenceBathroom',2304,1776,160,176);
 obj('counter','residenceKitchen',2656,1840,176,144);obj('cabinet','residenceFridge',2976,1792,64,104);
 obj('table','cafeTableTea',2704,2064,176,100);obj('chair','cafeChairNorth',2736,2192,40,40);obj('chair','cafeChairSouth',2800,2000,40,40);
 obj('counter','residenceReception',1680,2112,64,136);obj('cabinet','residenceMailboxes',1456,1728,80,48);
 marker('residence-reception','Accueil de la résidence','Plan et attribution des chambres',1616,2128,'Votre chambre porte le numéro 106 : prenez le couloir inférieur vers l’ouest, puis la première chambre à droite. Les chambres 101 à 104 sont dans le couloir nord ; les chambres 105 à 108 dans le couloir sud. Les espaces communs occupent l’aile d’entrée.');
 obj('doorFrame','residenceDoor',1536,2344,128,24,{solid:false});
 for(const [x,y] of [[1456,192],[1704,192],[1456,960],[1704,960],[1456,2240]])obj('planter','libraryPlanter',x,y,40,32);
 s.extras=[[448,1904],[1280,2240],[1984,2016]];
 // Scale the architecture in world space, leaving the character at its usual size.
 // Sprite widths are calibrated above before scaling; collision and art stay aligned.
 const scalePoint=p=>{p.x*=RESIDENCE_SCALE;p.y*=RESIDENCE_SCALE;};
 for(const key of ['w','h'])s[key]*=RESIDENCE_SCALE;
 s.bounds=s.bounds.map(v=>v*RESIDENCE_SCALE);scalePoint(s.spawn);
 for(const o of [...s.objects,...s.patches]){scalePoint(o);o.w*=RESIDENCE_SCALE;o.h*=RESIDENCE_SCALE;if(o.sortY!==undefined)o.sortY*=RESIDENCE_SCALE;o.artScale=RESIDENCE_SCALE;}
 for(const p of s.props)scalePoint(p);
 for(const room of [...s.rooms,...s.shared]){scalePoint(room);room.w*=RESIDENCE_SCALE;room.h*=RESIDENCE_SCALE;scalePoint(room.door);scalePoint(room.center);}
 s.walkable=s.walkable.map(rect=>rect.map(v=>v*RESIDENCE_SCALE));
 for(const window of s.windows){scalePoint(window);window.w*=RESIDENCE_SCALE;window.room=window.room.map(v=>v*RESIDENCE_SCALE);}
 s.extras=s.extras.map(point=>point.map(v=>v*RESIDENCE_SCALE));
 // Every piece of furniture belongs to exactly one room. Architecture stays visible.
 const rooms=[...s.rooms,...s.shared],containing=(x,y)=>rooms.find(r=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h);
 for(const room of rooms){
  const bedroom=!!room.number,y=bedroom?room.y+room.h:room.y-16,h=bedroom?12:16;
  room.door.bounds=[room.door.x-28,y,56,h];room.door.centerY=y+h/2;
  room.door.inside={x:room.door.x,y:bedroom?y-24:y+h+28};
  room.door.outside={x:room.door.x,y:bedroom?y+h+24:y-24};
  const frame=s.objects.find(o=>o.type==='doorFrame'&&Math.abs(o.x+o.w/2-room.door.x)<1&&Math.abs(o.y-y)<1);if(frame)frame.doorId=room.id;
 }
 s.props=s.props.filter(p=>!/^room-\d+$/.test(p.id));
 for(const room of s.shared){const marker=s.props.find(p=>p.id===room.id);if(marker){marker.x=room.center.x;marker.y=room.center.y;}}
 for(const room of rooms)s.props.push({id:`door-${room.id}`,doorId:room.id,name:`Porte · ${room.number?`Chambre ${room.number}`:room.name}`,detail:'Ouvrir, fermer ou tourner la clé',...room.door.outside});
 for(const o of s.objects){if(['residenceWall','doorFrame'].includes(o.type))continue;const room=containing(o.x+o.w/2,o.y+o.h/2);if(room)o.roomId=room.id;if(o.type==='wardrobe'&&room){o.wardrobeId=room.id;s.props.push({id:`wardrobe-${room.id}`,wardrobeId:room.id,roomId:room.id,name:`Armoire · Chambre ${room.number}`,detail:'Ouvrir · ranger et récupérer des objets',x:o.x+o.w/2,y:o.y+o.h+20});}}
 for(const p of s.patches){const room=containing(p.x+p.w/2,p.y+p.h/2);if(room&&p.w<=room.w&&p.h<=room.h)p.roomId=room.id;}
 for(const p of s.props){if(!p.doorId){const room=containing(p.x,p.y);if(room)p.roomId=room.id;}}
 for(const window of s.windows)window.roomId=containing(window.x+window.w/2,window.y+1)?.id;
 return s;
}
