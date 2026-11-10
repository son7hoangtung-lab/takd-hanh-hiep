// Nhân vật & thú có xương (mô hình CC0), đổi màu, gắn binh khí, điều khiển hoạt ảnh
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

const FILES=['adventurer','hooded_adventurer','monarch','rogue','worker','soldier','shiba','deer','wolf','fox','husky','frog','cat','yeti','orc_brute','crab','pirate','ghost','dragon','fish'];
const GL={};
export async function loadModels(onProgress){const ld=new GLTFLoader();ld.setMeshoptDecoder(MeshoptDecoder);let done=0;
  await Promise.all(FILES.map(f=>new Promise(res=>{ld.load('assets/m/'+f+'.json',g=>{GL[f]=g;done++;onProgress&&onProgress(done/FILES.length);res();},undefined,e=>{console.warn('model',f,e);done++;res();});})));}

// Nhân vật Việt: áo nâu, chàm, quần đen
const VN=['#5a3a2a','#2f3a5a','#6b4a2e','#3b3b44','#4a5a3a','#7a5a3a','#2a2a30'];
// cấu hình loại: file, chiều cao, màu theo tên vật liệu, ẩn nút, mũ, binh khí
export const KINDS={
  takd:{f:'adventurer',h:1.78,tint:{Green:'#a8261a',LightGreen:'#d9a441',Brown:'#3a2416',Brown2:'#5a3420',Black:'#1a1210',Grey:'#5a5c64',Gold:'#e8b84a',Hair:'#141010'},hide:['Backpack'],weapon:'mace'},
  takd0:{f:'adventurer',h:1.76,tint:{Green:'#6b5a3e',LightGreen:'#8a7a58',Brown:'#3a2a1a',Brown2:'#4a3a28',Black:'#2a2018',Grey:'#4a4a44',Gold:'#7a6a4a',Hair:'#141010'},hide:['Backpack']},
  takd1:{f:'adventurer',h:1.76,tint:{Green:'#6b5a3e',LightGreen:'#8a7a58',Brown:'#3a2a1a',Brown2:'#4a3a28',Black:'#2a2018',Grey:'#4a4a44',Gold:'#7a6a4a',Hair:'#141010'},hide:['Backpack'],weapon:'staff'},
  takd2:{f:'adventurer',h:1.78,tint:{Green:'#a8261a',LightGreen:'#d9a441',Brown:'#3a2416',Brown2:'#5a3420',Black:'#1a1210',Grey:'#5a5c64',Gold:'#e8b84a',Hair:'#141010'},hide:['Backpack'],weapon:'staff'},
  cuonghao:{f:'soldier',h:2.35,tint:{Character_Main:'#1c1c24',Red:'#c9a040',Pants:'#2a1a12'},weapon:'hammer',hat:'khan'},
  horse:{f:'deer',h:2.05,tint:{Main:'#6e3c1c',Main_Light:'#8a5632',Main_Dark:'#2a160a',Hooves:'#1a1008'}},
  shiba:{f:'shiba',h:0.72},
  hero_adv:{f:'adventurer',h:1.76,hide:['Backpack'],weapon:'sword',tintKey:'Green'},
  hero_hood:{f:'hooded_adventurer',h:1.76,weapon:'sword',tintKey:'Brown2'},
  hero_mon:{f:'monarch',h:1.8,weapon:'sword',tintKey:'Blue'},
  hero_rogue:{f:'rogue',h:1.72,weapon:'dagger',tintKey:'Shirt'},
  villager:{f:'worker',h:1.66,hat:'non',tintRand:{Shirt:VN,Pants:['#1a1a1e','#2a2a30','#3a2a20']}},
  npc_elder:{f:'worker',h:1.68,hat:'khan',tint:{Shirt:'#3a2a6a',Pants:'#1a1a1e',Hair:'#d8d8d8'}},
  npc_woman:{f:'worker',h:1.6,hat:'non',tint:{Shirt:'#7a4a2a',Pants:'#1a1a1e'}},
  npc_smith:{f:'worker',h:1.74,tint:{Shirt:'#4a3020',Pants:'#2a2018'},weapon:'hammer'},
  npc_fisher:{f:'worker',h:1.66,hat:'non',tint:{Shirt:'#4a5a6a',Pants:'#2a2a30'}},
  npc_scholar:{f:'worker',h:1.7,hat:'khan',tint:{Shirt:'#1f2a4a',Pants:'#1a1a1e'}},
  npc_officer:{f:'soldier',h:1.82,tint:{Character_Main:'#8a2a1e',Red:'#d9a441',Pants:'#2a1a12'}},
  npc_merchant:{f:'worker',h:1.68,hat:'khan',tint:{Shirt:'#2f6f62',Pants:'#1a1a1e'}},
  npc_monk:{f:'worker',h:1.68,tint:{Shirt:'#c98a2c',Pants:'#8a5a1c',Hair:'#e0b088'}},
  npc_groom:{f:'worker',h:1.66,hat:'non',tint:{Shirt:'#6b4a2e',Pants:'#2a2a30'}},
  npc_doctor:{f:'worker',h:1.68,hat:'khan',tint:{Shirt:'#e8e0cc',Pants:'#2f3a5a'}},
  soldier:{f:'soldier',h:1.8,tint:{Character_Main:'#8a2a1e',Red:'#d9a441'},weapon:'spear'},
  // quái
  fox:{f:'fox',h:0.75},frog:{f:'frog',h:0.55,tint:{Green:'#6a4a7a',Yellow:'#b89ac8'}},husky:{f:'husky',h:0.9,tintAll:'#5a4a3e'},
  bandit:{f:'rogue',h:1.74,tint:{Shirt:'#4a3a2a',UnderShirt:'#2a2018',Pants:'#2a2018',Detail:'#7a1a10'},weapon:'sword'},
  assassin:{f:'rogue',h:1.74,tintAll:'#2a2a33',tint:{Skin:'#d8a880',Eye:'#ff3b30'},weapon:'dagger'},
  wolf:{f:'wolf',h:1.0,tint:{Main:'#6d6f76',Main_Light:'#a8aab0'}},tiger:{f:'cat',h:1.25,tintAll:'#d8802a'},golem:{f:'yeti',h:2.3,tint:{Yeti_Main:'#8c857a',Yeti_Secondary:'#6d675d'}},
  crab:{f:'crab',h:0.7},pirate:{f:'pirate',h:1.8,weapon:'sword'},ghost:{f:'ghost',h:1.6,trans:0.85},shark:{f:'fish',h:1.0,tintAll:'#5d7a8a',len:2.2},
  bossfrog:{f:'frog',h:3.2,tint:{Green:'#4a2a6a',Yellow:'#e9a8c0',Red:'#ff3b30'},crown:1},warlord:{f:'orc_brute',h:2.9,tint:{Orc_Main:'#5a6a4a',Orc_Secondary:'#2a2a33'}},
  pirateking:{f:'pirate',h:2.8,weapon:'sword'},serpent:{f:'dragon',h:5.5,tint:{Dragon_Main:'#2f6f62',Dragon_Secondary:'#d9a441'}},
};
export const ART2KIND={fox:'fox',rat:'fox',frog:'frog',snake:'frog',husky:'husky',dog:'wolf',wolf:'wolf',bandit:'bandit',tiger:'tiger',golem:'golem',crab:'crab',ghost:'ghost',shark:'shark',bossfrog:'bossfrog',lotusdemon:'bossfrog',warlord:'warlord',cuonghao:'cuonghao',shiba:'shiba',soldier:'soldier',serpent:'serpent',
  elder:'npc_elder',woman:'npc_woman',smith:'npc_smith',fisher:'npc_fisher',scholar:'npc_scholar',officer:'npc_officer',merchant:'npc_merchant',monk:'npc_monk',groom:'npc_groom',doctor:'npc_doctor'};
const ANIM={idle:['Idle','Man_Idle','Frog_Idle','Flying_Idle','Idle_Neutral','Skeleton_Idle'],walk:['Walk','Man_Walk','Frog_Jump','Flying_Idle'],run:['Gallop','Run','Man_Run','Frog_Jump','Fast_Flying'],
  attack:['Attack','Sword_Slash','Weapon','Punch','Bite_Front','Frog_Attack','Attack_Headbutt','Headbutt','Man_SwordSlash','Dagger_Attack','Man_Punch'],hit:['HitRecieve','HitReact','Idle_HitReact_Left','RecieveHit','Hit'],
  death:['Death','Man_Death','Frog_Death'],eat:['Eating','Idle_Eating'],punch:['Punch_Right','Punch','Man_Punch'],kick:['Kick_Right','Kick_Left'],slash:['Sword_Slash','Man_SwordSlash','Weapon'],sit:['Man_Sitting'],wave:['Wave'],roll:['Roll']};
function findClip(clips,names){for(const n of names){const c=clips.find(c=>c.name===n)||clips.find(c=>c.name.endsWith('|'+n));if(c)return c;}return null;}
// --------- binh khí, mũ ---------
const WM={};function wm(){if(WM.iron)return;Object.assign(WM,{iron:new THREE.MeshStandardMaterial({color:0x8a8f98,metalness:0.7,roughness:0.35}),dark:new THREE.MeshLambertMaterial({color:0x4a2e18}),gold:new THREE.MeshStandardMaterial({color:0xd9a441,metalness:0.8,roughness:0.3}),
  blade:new THREE.MeshStandardMaterial({color:0xdfe6ee,metalness:0.9,roughness:0.2}),hat:new THREE.MeshLambertMaterial({color:0xe2d4a0,side:THREE.DoubleSide}),khan:new THREE.MeshLambertMaterial({color:0x1a1a22}),red:new THREE.MeshLambertMaterial({color:0xb3261e})});}
function weapon(kind){wm();const g=new THREE.Group();const add=(geo,m,p,r)=>{const o=new THREE.Mesh(geo,m);if(p)o.position.set(...p);if(r)o.rotation.set(...r);o.castShadow=true;g.add(o);return o;};
  if(kind==='mace'){add(new THREE.CylinderGeometry(0.03,0.035,0.75,6),WM.dark,[0,0.3,0]);add(new THREE.SphereGeometry(0.12,10,8),WM.iron,[0,0.72,0]);add(new THREE.CylinderGeometry(0.045,0.045,0.06,8),WM.gold,[0,0.62,0]);
    for(let i=0;i<10;i++){const th=Math.acos(1-2*(i+0.5)/10),ph=i*2.4;const d=new THREE.Vector3(Math.sin(th)*Math.cos(ph),Math.cos(th),Math.sin(th)*Math.sin(ph));const s=add(new THREE.ConeGeometry(0.03,0.1,4),WM.iron,[d.x*0.13,0.72+d.y*0.13,d.z*0.13]);s.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d);}}
  else if(kind==='sword'){add(new THREE.BoxGeometry(0.05,0.8,0.012),WM.blade,[0,0.55,0]);add(new THREE.BoxGeometry(0.16,0.03,0.05),WM.gold,[0,0.14,0]);add(new THREE.CylinderGeometry(0.02,0.02,0.2,6),WM.dark,[0,0.03,0]);}
  else if(kind==='dagger'){add(new THREE.BoxGeometry(0.04,0.35,0.01),WM.blade,[0,0.28,0]);add(new THREE.CylinderGeometry(0.018,0.018,0.14,5),WM.dark,[0,0.04,0]);}
  else if(kind==='hammer'){add(new THREE.CylinderGeometry(0.02,0.02,0.5,5),WM.dark,[0,0.2,0]);add(new THREE.BoxGeometry(0.16,0.09,0.09),WM.iron,[0,0.45,0]);}
  else if(kind==='staff'){const bm=new THREE.MeshLambertMaterial({color:0xb8a860});add(new THREE.CylinderGeometry(0.022,0.026,1.9,6),bm,[0,0.45,0]);for(let k=0;k<5;k++)add(new THREE.CylinderGeometry(0.03,0.03,0.03,6),WM.dark,[0,-0.3+k*0.38,0]);}
  else if(kind==='spear'){add(new THREE.CylinderGeometry(0.018,0.018,2.0,5),WM.dark,[0,0.5,0]);add(new THREE.ConeGeometry(0.04,0.25,4),WM.blade,[0,1.6,0]);add(new THREE.SphereGeometry(0.05,5,4),WM.red,[0,1.45,0]);}
  return g;}
function hat(kind){wm();const g=new THREE.Group();if(kind==='non'){const m=new THREE.Mesh(new THREE.ConeGeometry(0.3,0.2,14,1,true),WM.hat);m.position.y=0.17;m.castShadow=true;g.add(m);}
  else if(kind==='khan'){const m=new THREE.Mesh(new THREE.TorusGeometry(0.1,0.045,6,12),WM.khan);m.rotation.x=Math.PI/2;m.position.y=0.11;g.add(m);}return g;}
// --------- tạo nhân vật ---------
const matCache=new Map();
function tintMats(root,kind,cfg,seed){const r=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};const picks={};if(cfg.tintRand)for(const k in cfg.tintRand){const a=cfg.tintRand[k];picks[k]=a[Math.floor(r()*a.length)];}
  root.traverse(o=>{if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=false;o.frustumCulled=false;const ms=Array.isArray(o.material)?o.material:[o.material];const out=ms.map(m=>{const nm=m.name;let col=null;
      if(cfg.tint&&cfg.tint[nm])col=cfg.tint[nm];else if(picks[nm])col=picks[nm];else if(cfg.extraTint&&cfg.extraTint[nm])col=cfg.extraTint[nm];
      if(cfg.tintAll&&!col&&!/Eye|eye|Pupil|White|Black|Teeth|Tongue|Nose/.test(nm))col=cfg.tintAll;
      const key=kind+'|'+nm+'|'+(col||'')+'|'+(cfg.trans||'');if(matCache.has(key))return matCache.get(key);
      const n=new THREE.MeshLambertMaterial({color:col?new THREE.Color(col):m.color.clone(),map:m.map||null,transparent:!!cfg.trans,opacity:cfg.trans||1});n.name=nm;matCache.set(key,n);return n;});
    o.material=Array.isArray(o.material)?out:out[0];});}
const sizeCache={};
function measure(scene){const o0=SkeletonUtils.clone(scene);o0.updateMatrixWorld(true);const box=new THREE.Box3();
  o0.traverse(o=>{if(!o.isMesh||o.visible===false)return;let bb;if(o.isSkinnedMesh){o.computeBoundingBox();bb=o.boundingBox.clone();}else{o.geometry.computeBoundingBox();bb=o.geometry.boundingBox.clone();}bb.applyMatrix4(o.matrixWorld);box.union(bb);});return box;}
export function makeActor(kind,opt={}){const cfg=Object.assign({},KINDS[kind]);if(!cfg.f||!GL[cfg.f])return null;const src=GL[cfg.f];const root=SkeletonUtils.clone(src.scene);
  if(cfg.hide)cfg.hide.forEach(n=>{const o=root.getObjectByName(n);if(o)o.visible=false;});
  if(opt.color&&cfg.tintKey){cfg.extraTint={[cfg.tintKey]:opt.color};}
  tintMats(root,kind+(opt.color||''),cfg,opt.seed||1);
  // chuẩn hóa chiều cao
  const sk=cfg.f+'|'+cfg.h;if(!sizeCache[sk]){const b=measure(src.scene);const sz=new THREE.Vector3();b.getSize(sz);sizeCache[sk]={s:cfg.h/Math.max(0.001,sz.y),minY:b.min.y};}
  const S=sizeCache[sk];const holder=new THREE.Group();root.scale.setScalar(S.s);root.position.y=-S.minY*S.s;holder.add(root);
  const mixer=new THREE.AnimationMixer(root);const acts={};for(const k in ANIM){const c=findClip(src.animations,ANIM[k]);if(c)acts[k]=mixer.clipAction(c);}
  const bones={};root.traverse(o=>{if(o.isBone)bones[o.name]=o;});
  const v={kind,cfg,holder,root,mixer,acts,bones,cur:null,scale:S.s,h:cfg.h};
  const hand=bones['WristR']||bones['MiddleHandR']||bones['PalmR']||bones['LowerArmR']||bones['Wrist.R'];
  holder.updateMatrixWorld(true);const _ws=new THREE.Vector3();const inv=b=>{b.getWorldScale(_ws);return 1/(_ws.x||1);};
  if(cfg.weapon&&hand){const w=weapon(cfg.weapon);w.scale.setScalar(inv(hand));w.rotation.set(Math.PI/2,0,0);hand.add(w);v.weapon=w;}
  const head=bones['Head'];if(cfg.hat&&head){const h=hat(cfg.hat);h.scale.setScalar(inv(head));head.add(h);v.hatObj=h;}
  if(cfg.crown){const c=new THREE.Mesh(new THREE.ConeGeometry(0.5,0.6,8,1,true),new THREE.MeshLambertMaterial({color:0xf2a8c0,side:THREE.DoubleSide}));c.position.y=cfg.h*0.95;holder.add(c);}
  if(cfg.len){root.scale.multiplyScalar(1);}
  play(v,'idle',0);return v;}
export function play(v,name,fade=0.18,once=false){if(!v||!v.acts)return;let a=v.acts[name];if(!a){if(name==='run')a=v.acts.walk;if(!a&&(name==='walk'||name==='run'))a=v.acts.idle;if(!a&&name==='slash')a=v.acts.attack;if(!a&&name==='punch')a=v.acts.attack;if(!a&&name==='kick')a=v.acts.attack;if(!a)a=v.acts.idle;}
  if(!a)return;if(v.cur===a&&!once)return;a.reset();a.enabled=true;a.setEffectiveWeight(1);if(once){a.setLoop(THREE.LoopOnce,1);a.clampWhenFinished=true;}else a.setLoop(THREE.LoopRepeat,Infinity);
  if(v.cur&&v.cur!==a)a.crossFadeFrom(v.cur,fade,false);a.play();v.cur=a;v.curName=name;}
export function isPlaying(v,name){return v.curName===name&&v.cur&&v.cur.isRunning();}
