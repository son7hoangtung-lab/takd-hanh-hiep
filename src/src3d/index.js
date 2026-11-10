// ===== ĐỘNG CƠ 3D: thay phần vẽ 2D bằng cảnh 3D góc nhìn chéo =====
import * as THREE from 'three';
import {initMats,MAT,buildProto,VARIANTS,tuftGeo,lotusPadGeo,lotusFlowerGeo} from './build.js';
import {tex,groundCanvas,toTex,rng} from './tex.js';
import {loadModels,makeActor,play,KINDS,ART2KIND} from './actors.js';
import {CREATURES} from './creatures.js';

const G=window.G;const T=16;
const R3={ready:false,progress:0};window.R3=R3;
let renderer,scene,camera,sun,hemi,canvas,ov,octx,water,terrain,mapGroup,curMap=null,heights=null,HW=0,HH=0;
const cam={yaw:0,pitch:0.92,dist:26,tdist:26,min:7,max:75,tx:0,tz:0};R3.cam=cam;
const lights=[];let clouds=[];

// ---------------- khởi tạo ----------------
R3.init=async function(onProgress){canvas=document.getElementById('gl');ov=document.getElementById('game');octx=ov.getContext('2d');
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:/pdb/.test(location.search)});renderer.setPixelRatio(Math.min(/iPhone|iPad|Android/.test(navigator.userAgent)?1.6:2,window.devicePixelRatio||1));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
  scene=new THREE.Scene();R3._scene=scene;scene.background=new THREE.Color(0xbfd8e8);scene.fog=new THREE.Fog(0xbfd8e8,40,120);
  camera=new THREE.PerspectiveCamera(38,1,0.3,400);R3._camera=camera;
  hemi=new THREE.HemisphereLight(0xdfefff,0x5a6a3a,1.0);scene.add(hemi);
  sun=new THREE.DirectionalLight(0xfff1d6,2.2);sun.castShadow=true;const sm=/iPhone|iPad|Android/.test(navigator.userAgent)?1536:2048;sun.shadow.mapSize.set(sm,sm);
  const sc=sun.shadow.camera;sc.left=-34;sc.right=34;sc.top=34;sc.bottom=-34;sc.near=1;sc.far=140;sun.shadow.bias=-0.0006;sun.shadow.normalBias=0.03;scene.add(sun);scene.add(sun.target);
  initMats();resize();window.addEventListener('resize',resize);gestures();
  for(let i=0;i<6;i++){const p=new THREE.PointLight(0xffa050,0,14,1.6);scene.add(p);lights.push(p);}
  R3.aura=new THREE.PointLight(0xffe2b0,0,22,1.2);scene.add(R3.aura);
  const cm=new THREE.MeshBasicMaterial({map:tex('cloud'),transparent:true,depthWrite:false,opacity:0.0,fog:false});for(let i=0;i<10;i++){const c=new THREE.Mesh(new THREE.PlaneGeometry(40,20),cm.clone());c.rotation.x=-Math.PI/2;c.position.y=26+Math.random()*6;c.userData.v=0.6+Math.random();scene.add(c);clouds.push(c);}
  await loadModels(p=>{R3.progress=p;onProgress&&onProgress(p);});R3.ready=true;};
function resize(){if(!renderer)return;const w=window.innerWidth,h=window.innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}

// ---------------- địa hình ----------------
const BASEH={water:-0.95,lotus:-0.5,paddy:-0.1,shallow:-0.4,sea:-1.3,deep:-1.8,dike:0.45,bridge:-0.95,wood:-0.95,karstbase:0.4,mud:-0.05,floor:0.06,cobble:0.03,stone:0.06,tilered:0.06};
const WATERY={water:1,lotus:1,shallow:1,sea:1,deep:1,bridge:1,wood:1};
function buildTerrain(m){const W=m.w,H=m.h;HW=W;HH=H;const r=rng(m.w*7+m.h);const n=(x,y)=>Math.sin(x*0.13+y*0.07)*0.18+Math.sin(x*0.05-y*0.11)*0.22+Math.sin(x*0.31+y*0.27)*0.05;
  heights=new Float32Array((W+1)*(H+1));
  for(let y=0;y<=H;y++)for(let x=0;x<=W;x++){let s=0,c=0,wet=0;for(let dy=-1;dy<=0;dy++)for(let dx=-1;dx<=0;dx++){const t=m.get(Math.min(W-1,Math.max(0,x+dx)),Math.min(H-1,Math.max(0,y+dy)));const b=BASEH[t]??0;s+=b;c++;if(WATERY[t])wet++;}
    let h=s/c;if(!wet&&h>-0.05)h+=n(x,y)*0.6;heights[y*(W+1)+x]=h;}
  const geo=new THREE.PlaneGeometry(W,H,W,H);geo.rotateX(-Math.PI/2);geo.translate(W/2,0,H/2);const p=geo.attributes.position;
  for(let i=0;i<p.count;i++){const x=Math.round(p.getX(i)),z=Math.round(p.getZ(i));p.setY(i,heights[z*(W+1)+x]);}geo.computeVertexNormals();
  const gc=groundCanvas(m,10);const gt=toTex(gc);gt.wrapS=gt.wrapT=THREE.ClampToEdgeWrapping;gt.anisotropy=8;
  const mesh=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({map:gt}));mesh.receiveShadow=true;mesh.name='terrain';return mesh;}
function groundH(wx,wz){if(!heights)return 0;const W=HW;const x=Math.max(0,Math.min(HW-0.001,wx)),z=Math.max(0,Math.min(HH-0.001,wz));const x0=Math.floor(x),z0=Math.floor(z),fx=x-x0,fz=z-z0;
  const h=(xx,zz)=>heights[zz*(W+1)+xx];return h(x0,z0)*(1-fx)*(1-fz)+h(x0+1,z0)*fx*(1-fz)+h(x0,z0+1)*(1-fx)*fz+h(x0+1,z0+1)*fx*fz;}
R3.groundH=groundH;
function standH(wx,wz){if(!curMap)return 0;const t=curMap.get(Math.floor(wx),Math.floor(wz));if(t==='bridge'||t==='wood')return 0.18;return Math.max(groundH(wx,wz),WATERY[t]?-0.25:-9);}
function makeWater(m){const g=new THREE.PlaneGeometry(m.w,m.h,1,1);g.rotateX(-Math.PI/2);g.translate(m.w/2,-0.25,m.h/2);
  const mat=new THREE.ShaderMaterial({transparent:true,fog:true,uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,{t:{value:0},deep:{value:new THREE.Color(0x1f4a52)},shal:{value:new THREE.Color(0x5a9aa0)},sky:{value:new THREE.Color(0xcfe6f0)},night:{value:0}}]),
    vertexShader:`varying vec3 vW;\n#include <fog_pars_vertex>\nvoid main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vec4 mvPosition=viewMatrix*w;gl_Position=projectionMatrix*mvPosition;\n#include <fog_vertex>\n}`,
    fragmentShader:`uniform float t;uniform vec3 deep;uniform vec3 shal;uniform vec3 sky;uniform float night;varying vec3 vW;\n#include <fog_pars_fragment>\nfloat h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
      void main(){vec2 p=vW.xz;float w=n(p*0.6+vec2(t*0.25,t*0.15))*0.6+n(p*1.7-vec2(t*0.4,-t*0.3))*0.4;vec3 c=mix(deep,shal,w*0.6);float s=smoothstep(0.78,0.95,n(p*2.3+vec2(t*0.6,t*0.2)));c+=sky*s*0.35*(1.-night);c=mix(c,c*0.35+vec3(0.02,0.04,0.09),night);gl_FragColor=vec4(c,0.82);\n#include <fog_fragment>\n}`});
  const mesh=new THREE.Mesh(g,mat);mesh.renderOrder=1;return mesh;}

// ---------------- đặt công trình & cây (gộp, nhân bản) ----------------
const FOOTV={hut:[5,3],house:[6,3],dinh:[9,5],chua:[7,4],vanmieu:[4,4],dien:[12,5],kho:[6,3],thapbaothien:[4,4],thapchuong:[2,2]};
const NOSHADOW={reeds:1,fence:1,chum:1,net:1};
const protoCache={};
function getProto(type,v){const k=type+'#'+v;if(protoCache[k]!==undefined)return protoCache[k];const b=buildProto(type,v);protoCache[k]=b?b.bake():null;return protoCache[k];}
function buildObjects(m){const grp=new THREE.Group();const buckets=new Map();const r=rng(m.w*13+m.h*7);
  m.objs.forEach((o,i)=>{const type=o.o;const nv=VARIANTS[type]||1;const v=(i*7+((o.x*13+o.y*7)|0))%nv;const parts=getProto(type,v);if(!parts)return;const f=FOOTV[type];
    const wx=o.x/T,wz=o.y/T-(f?f[1]/2:0.5);const y=Math.max(groundH(wx,wz),(type==='sampan'||type==='junk'||type==='sailboat'||type==='bigship'||type==='boatsmall')?-0.45:-9);
    const rot=(f||type==='conglang'||type==='stall'||type==='board'||type==='lantern'||type==='stove'||type==='tent')?0:r()*Math.PI*2;const sc=f?1:0.85+r()*0.35;
    const mat=new THREE.Matrix4().compose(new THREE.Vector3(wx,y,wz),new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),rot),new THREE.Vector3(sc,sc,sc));
    const k=type+'#'+v;if(!buckets.has(k))buckets.set(k,{parts,mats:[],type});buckets.get(k).mats.push(mat);
    if(type==='lantern'||type==='stove'||type==='campfire')R3.lamps.push({x:wx+(type==='lantern'?0.42:0),y:y+(type==='lantern'?1.95:0.5),z:wz,k:type});});
  buckets.forEach(b=>{b.parts.forEach(({g,mat})=>{const im=new THREE.InstancedMesh(g,mat,b.mats.length);b.mats.forEach((mm,i)=>im.setMatrixAt(i,mm));im.instanceMatrix.needsUpdate=true;im.computeBoundingSphere();
    im.castShadow=!NOSHADOW[b.type];im.receiveShadow=true;grp.add(im);});});
  // tường thành theo ô
  const walls=[];for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++){const t=m.t[y*m.w+x];if(t==='earthwall'||t==='brick'||t==='walltop')walls.push([x,y,t]);}
  if(walls.length){const mk=(mat,hgt,list)=>{if(!list.length)return;const im=new THREE.InstancedMesh(new THREE.BoxGeometry(1,hgt,1),mat,list.length);list.forEach(([x,y],i)=>im.setMatrixAt(i,new THREE.Matrix4().makeTranslation(x+0.5,hgt/2+groundH(x+0.5,y+0.5)-0.1,y+0.5)));im.castShadow=im.receiveShadow=true;im.computeBoundingSphere();grp.add(im);};
    mk(MAT.mud,2.6,walls.filter(w=>w[2]==='earthwall'));mk(MAT.brick,3.0,walls.filter(w=>w[2]!=='earthwall'));}
  // sàn cầu & bến
  const deck=[];for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++){const t=m.t[y*m.w+x];if(t==='bridge'||t==='wood')deck.push([x,y]);}
  if(deck.length){const im=new THREE.InstancedMesh(new THREE.BoxGeometry(1.02,0.16,1.02),MAT.wood,deck.length);deck.forEach(([x,y],i)=>im.setMatrixAt(i,new THREE.Matrix4().makeTranslation(x+0.5,0.1,y+0.5)));im.castShadow=im.receiveShadow=true;im.computeBoundingSphere();grp.add(im);
    const posts=new THREE.InstancedMesh(new THREE.CylinderGeometry(0.07,0.07,1.6,5),MAT.wood,deck.length);deck.forEach(([x,y],i)=>posts.setMatrixAt(i,new THREE.Matrix4().makeTranslation(x+0.1,-0.6,y+0.1)));posts.computeBoundingSphere();grp.add(posts);}
  // lúa, cỏ, sen (chia khúc để cắt khung nhìn)
  scatterTiles(m,grp,['paddy'],tuftGeo(0.6,1.0,4),MAT.rice,3,0.08,-0.12,[0.8,1.2]);scatterTiles(m,grp,['grass','meadow','flowers'],tuftGeo(0.34,0.7,3),MAT.grassTuft,0.35,0,0,[0.7,1.3]);
  scatterTiles(m,grp,['lotus'],lotusPadGeo(),MAT.lotusPad,2.2,0,-0.22,[0.7,1.5],true);scatterTiles(m,grp,['lotus'],lotusFlowerGeo(),MAT.lotusFlower,0.35,0,-0.12,[0.8,1.3],true);
  return grp;}
function scatterTiles(m,grp,types,geo,mat,dens,jit,yo,scl,flat){const CH=32;const r=rng(types.join().length*91+m.w);const set=new Set(types);
  for(let cy=0;cy<m.h;cy+=CH)for(let cx=0;cx<m.w;cx+=CH){const mats=[];for(let y=cy;y<Math.min(m.h,cy+CH);y++)for(let x=cx;x<Math.min(m.w,cx+CH);x++){const t=m.t[y*m.w+x];if(!set.has(t)||m.solid[y*m.w+x])continue;let k=dens;while(k>0){if(k<1&&r()>k)break;k--;
      const wx=x+r(),wz=y+r();const s=scl[0]+r()*(scl[1]-scl[0]);const yy=flat?-0.22+yo+0.1:groundH(wx,wz)+yo;mats.push(new THREE.Matrix4().compose(new THREE.Vector3(wx,yy,wz),new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),r()*6.28),new THREE.Vector3(s,s,s)));}}
    if(!mats.length)continue;const im=new THREE.InstancedMesh(geo,mat,mats.length);mats.forEach((mm,i)=>im.setMatrixAt(i,mm));im.computeBoundingSphere();im.receiveShadow=true;grp.add(im);}}
R3.lamps=[];
function loadMap(m){if(curMap===m)return;if(mapGroup){scene.remove(mapGroup);mapGroup.traverse(o=>{if(o.geometry&&o.isInstancedMesh===false)o.geometry.dispose();});}
  clearViews();R3.lamps=[];curMap=m;mapGroup=new THREE.Group();terrain=buildTerrain(m);mapGroup.add(terrain);water=makeWater(m);mapGroup.add(water);mapGroup.add(buildObjects(m));
  // cổng dịch chuyển
  m.portals.forEach(p=>{const ring=new THREE.Mesh(new THREE.RingGeometry(0.9,1.4,32),new THREE.MeshBasicMaterial({color:0x7fe0ff,transparent:true,opacity:0.7,side:THREE.DoubleSide,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.set(p.x+0.5,groundH(p.x+.5,p.y+.5)+0.08,p.y+0.5);ring.userData.portal=p;mapGroup.add(ring);
    const col=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.1,3,24,1,true),new THREE.MeshBasicMaterial({color:0x7fe0ff,transparent:true,opacity:0.18,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));col.position.set(p.x+0.5,ring.position.y+1.5,p.y+0.5);col.userData.portal=p;mapGroup.add(col);});
  // cờ Muay Việt (hiện khi đã chiếm vùng này)
  flagGrp=new THREE.Group();flagGrp.visible=false;const fm=flagMat();(m.flags||[]).forEach(([fx,fy])=>{const g=new THREE.Group();const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.08,6,6),new THREE.MeshLambertMaterial({color:0x5a3a1a}));pole.position.y=3;pole.castShadow=true;g.add(pole);
    const top=new THREE.Mesh(new THREE.SphereGeometry(0.14,8,6),new THREE.MeshStandardMaterial({color:0xd9a441,metalness:.8,roughness:.3}));top.position.y=6.05;g.add(top);
    const cloth=new THREE.Mesh(new THREE.PlaneGeometry(1.9,1.25,10,4),fm);cloth.position.set(0.98,5.2,0);cloth.castShadow=true;cloth.userData.base=cloth.geometry.attributes.position.array.slice();g.add(cloth);g.userData.cloth=cloth;
    g.position.set(fx+0.5,groundH(fx+.5,fy+.5),fy+0.5);flagGrp.add(g);});mapGroup.add(flagGrp);
  scene.add(mapGroup);}
let flagGrp=null,_flagMat=null;
function flagMat(){if(_flagMat)return _flagMat;const c=document.createElement('canvas');c.width=192;c.height=128;const x=c.getContext('2d');x.fillStyle='#b3261e';x.fillRect(0,0,192,128);x.strokeStyle='#d9a441';x.lineWidth=10;x.strokeRect(5,5,182,118);
  x.fillStyle='#f2d27a';x.font='900 84px "Noto Serif SC",serif';x.textAlign='center';x.textBaseline='middle';x.fillText('越',96,68);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;
  return _flagMat=new THREE.MeshLambertMaterial({map:t,side:THREE.DoubleSide});}
R3._flags=()=>flagGrp&&[flagGrp.visible,flagGrp.children.length,flagGrp.parent&&flagGrp.parent.parent===scene];
function updFlags(t){if(!flagGrp)return;const on=!!(G.S.conq&&G.S.conq[curMap.id]);flagGrp.visible=on;if(!on)return;
  flagGrp.children.forEach((g,gi)=>{const cl=g.userData.cloth;const pos=cl.geometry.attributes.position,b=cl.userData.base;for(let i=0;i<pos.count;i++){const x0=b[i*3]+0.95;pos.array[i*3+2]=Math.sin(x0*3-t*5+gi)*0.12*x0;}pos.needsUpdate=true;});}

// ---------------- hiển thị thực thể ----------------
const views=new Map();const pools={};
function poolGet(kind,opt){const key=kind+'|'+(opt&&opt.color||'');const p=pools[key];if(p&&p.length){const v=p.pop();scene.add(v.holder);return v;}
  let v;if(CREATURES[kind]){const c=CREATURES[kind]();v={kind,holder:c.root,creature:c,h:c.h,poolKey:key};c.root.traverse(o=>{if(o.isMesh)o.castShadow=true;});}else{v=makeActor(kind,opt);if(!v)return null;v.poolKey=key;}
  scene.add(v.holder);return v;}
function poolPut(v){scene.remove(v.holder);(pools[v.poolKey]||(pools[v.poolKey]=[])).push(v);}
function clearViews(){views.forEach(v=>{if(v.rider)poolPut(v.rider);poolPut(v);});views.clear();}
function kindOf(e,type){if(type==='player')return 'horse';if(type==='shiba')return 'shiba';if(type==='npc')return ART2KIND[e.art]||'npc_elder';
  if(type==='amb'){if(e.k==='dan')return 'villager';if(e.k==='linh')return 'soldier';return e.k;}
  if(type==='bot'){return ['hero_adv','hero_hood','hero_mon','hero_rogue'][(e.b.name.length+e.b.sect.id.length)%4];}
  if(type==='pk')return 'assassin';
  if(type==='mob'){const a=e.base.art;if(e.wb)return 'serpent';if(e.boss&&a==='warlord')return e.tint?'pirateking':'warlord';if(a==='bandit')return e.base.id==='thichkhach'?'assassin':e.base.id==='haitac'?'pirate':'bandit';return ART2KIND[a]||'wolf';}
  return 'villager';}
function ensure(e,type,extra){let v=views.get(e);if(v)return v;const kind=kindOf(e,type);const opt={};if(type==='bot')opt.color=e.b.sect.col;if(type==='amb'||type==='bot')opt.seed=(e.x*13+e.y*7|0)%9973+1;
  v=poolGet(kind,opt);if(!v)return null;v.type=type;v.e=e;v.px=e.x;v.py=e.y;v.yaw=v.yaw||0;v.spd=0;
  if(type==='player'&&!v.rider){v.rider=poolGet('takd');v.saddle=v.saddle||makeSaddle();v.holder.add(v.saddle);}
  if(type==='mob'&&(e.tier>=3||e.boss)){v.aura=v.aura||auraRing(e.boss?0xff5d5d:0xb9a3ff,e.boss?1.8:0.9);if(!v.aura.parent)v.holder.add(v.aura);}else if(v.aura&&v.aura.parent)v.holder.remove(v.aura);
  if(type==='mob'&&e.tier>0&&!e.boss){const s=1+e.tier*0.12;v.holder.scale.setScalar(s);}else v.holder.scale.setScalar(1);
  views.set(e,v);return v;}
function makeSaddle(){const g=new THREE.Group();const m1=new THREE.Mesh(new THREE.BoxGeometry(0.62,0.08,0.75),MAT.cloth);m1.castShadow=true;g.add(m1);const m2=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.04,0.82),MAT.gold);m2.position.y=-0.05;g.add(m2);return g;}
function auraRing(col,r){const m=new THREE.Mesh(new THREE.RingGeometry(r*0.75,r,32),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0.55,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));m.rotation.x=-Math.PI/2;m.position.y=0.06;return m;}
const _v=new THREE.Vector3(),_w=new THREE.Vector3();
function syncView(v,dt,t){const e=v.e;const wx=e.x/T,wz=e.y/T;const dx=e.x-v.px,dz=e.y-v.py;const sp=Math.hypot(dx,dz)/Math.max(dt,1e-3)/T;v.px=e.x;v.py=e.y;v.spd=v.spd*0.8+sp*0.2;
  let target=v.yaw;if(Math.hypot(dx,dz)>0.05)target=Math.atan2(dx,dz);else if(v.type==='player'&&G.P.face)target=v.lastYaw??target;
  let d=target-v.yaw;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;v.yaw+=d*Math.min(1,dt*10);v.lastYaw=v.yaw;
  const water=v.creature&&v.creature.water;const y=water?-0.27:standH(wx,wz);v.holder.position.set(wx,y,wz);v.holder.rotation.y=v.yaw;
  if(v.creature){v.creature.update(dt,v.spd>0.3,t,e);return;}
  // trạng thái hoạt ảnh
  let st=v.spd>3.2?'run':v.spd>0.35?'walk':'idle';
  if(e.hp!=null&&e.hp<=0&&v.type!=='player'){if(v.curName!=='death')play(v,'death',0.1,true);}
  else if((e.lunge>0||e.atkT>0.85)&&v.type!=='player'){if(v.curName!=='attack'||!v.cur.isRunning())play(v,'attack',0.08,true);}
  else if(e.hitT>0&&v.acts.hit&&v.curName!=='hit'){play(v,'hit',0.06,true);}
  else if(!(v.curName==='attack'||v.curName==='hit')||!v.cur.isRunning()){if(v.type==='amb'&&e.k==='trau'&&st==='idle'&&v.acts.eat)st='eat';play(v,st);}
  v.mixer.update(dt*(st==='run'&&v.kind==='horse'?Math.min(1.6,v.spd/7):1));
  if(v.aura)v.aura.material.opacity=0.35+Math.sin(t*4)*0.2;}
function syncPlayer(v,dt,t){const P=G.P,S=G.S;const e=P;const wx=e.x/T,wz=e.y/T;const dx=e.x-v.px,dz=e.y-v.py;const sp=Math.hypot(dx,dz)/Math.max(dt,1e-3)/T;v.px=e.x;v.py=e.y;v.spd=v.spd*0.75+sp*0.25;
  if(Math.hypot(dx,dz)>0.05)v.tyaw=Math.atan2(dx,dz);if(v.tyaw==null)v.tyaw=0;let d=v.tyaw-v.yaw;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;v.yaw+=d*Math.min(1,dt*9);
  const want=G.playerKind?G.playerKind():'takd';if(v.rider.kind!==want){const nr=poolGet(want);if(nr){poolPut(v.rider);v.rider=nr;}}
  const y=standH(wx,wz);const mounted=S.mounted!==false&&!P.boat&&!S.meditate&&!!(S.gear&&S.gear.horse);const rider=v.rider;
  if(P.boat){v.holder.visible=false;rider.holder.visible=true;if(!v.boat){v.boat=poolGet('sampan');}v.boat.holder.visible=true;v.boat.holder.position.set(wx,-0.27,wz);v.boat.holder.rotation.y=v.yaw+Math.PI/2;v.boat.creature.update(dt,true,t);
    rider.holder.position.set(wx,0.1,wz);rider.holder.rotation.y=v.yaw;play(rider,'idle');rider.mixer.update(dt);return;}
  if(v.boat){v.boat.holder.visible=false;}
  v.holder.visible=mounted;v.holder.position.set(wx,y,wz);v.holder.rotation.y=v.yaw;
  const attacking=P.swing>0||P.atkT>0.25;
  if(mounted){play(v,v.spd>4.5?'run':v.spd>0.4?'walk':'idle');v.mixer.update(dt*(v.spd>4.5?Math.min(1.5,v.spd/8):1));v.holder.updateMatrixWorld(true);
    const back=v.bones.Torso||v.bones.Back;back.getWorldPosition(_v);const loc=v.holder.worldToLocal(_w.copy(_v));loc.z+=0.22;loc.y+=0.05;v.saddle.position.copy(loc);_v.copy(loc);v.holder.localToWorld(_v);
    legsAxes(rider);rider.holder.position.set(_v.x,_v.y+0.16-(rider._hipY||0.85),_v.z);rider.holder.rotation.y=v.yaw;
    if(attacking){if(rider.curName!=='slash'||!rider.cur.isRunning())play(rider,'slash',0.06,true);}else if(!(rider.curName==='slash'&&rider.cur.isRunning()))play(rider,'idle');
    rider.mixer.update(dt);seat(rider);}
  else{legsAxes(rider);rider.holder.position.set(wx,y-(S.meditate?(rider._hipY||0.85)-0.22:0),wz);rider.holder.rotation.y=v.yaw;
    if(S.meditate){play(rider,'idle');rider.mixer.update(dt);sitCross(rider);}
    else if(attacking){const want=G._lastSkillKind==='kick'?'kick':G._lastSkillKind==='punch'?'punch':'slash';if(!rider.cur||!rider.cur.isRunning()||(rider.curName!==want&&rider.curName!=='slash'&&rider.curName!=='punch'&&rider.curName!=='kick'))play(rider,want,0.06,true);rider.mixer.update(dt);}
    else{const st=v.spd>4?'run':v.spd>0.35?'walk':'idle';if(!(['slash','punch','kick'].includes(rider.curName)&&rider.cur.isRunning()))play(rider,st);rider.mixer.update(dt);}}
  rider.holder.visible=true;}
// tư thế: xoay xương để trỏ tới hướng mong muốn (theo hệ toạ độ holder: +Z phía trước, +X bên trái nhân vật)
const _q1=new THREE.Quaternion(),_q2=new THREE.Quaternion(),_q3=new THREE.Quaternion(),_a=new THREE.Vector3(),_t=new THREE.Vector3();
function boneAxis(r,name,child){const k='ax_'+name;if(r[k])return r[k];const b=r.bones[name],c=r.bones[child];if(!b||!c)return null;
  r.holder.updateMatrixWorld(true);const pb=new THREE.Vector3(),pc=new THREE.Vector3();b.getWorldPosition(pb);c.getWorldPosition(pc);const d=pc.sub(pb).normalize();b.getWorldQuaternion(_q1);d.applyQuaternion(_q1.invert());return r[k]=d;}
function aim(r,name,axis,dir){const b=r.bones[name];if(!b||!axis)return;b.parent.updateWorldMatrix(true,false);b.updateMatrixWorld(true);b.getWorldQuaternion(_q1);_a.copy(axis).applyQuaternion(_q1);
  r.holder.getWorldQuaternion(_q3);_t.copy(dir).normalize().applyQuaternion(_q3);_q2.setFromUnitVectors(_a,_t);_q1.premultiply(_q2);b.parent.getWorldQuaternion(_q3);b.quaternion.copy(_q3.invert().multiply(_q1));b.updateMatrixWorld(true);}
function legsAxes(r){if(r._ax)return r._ax;const s=r.curName;play(r,'idle',0);r.mixer.update(0);r._ax={uL:boneAxis(r,'UpperLegL','LowerLegL'),uR:boneAxis(r,'UpperLegR','LowerLegR'),lL:boneAxis(r,'LowerLegL','FootL'),lR:boneAxis(r,'LowerLegR','FootR')};
  const h=r.bones.Hips;if(h){const p=new THREE.Vector3();h.getWorldPosition(p);r._hipY=p.y-r.holder.position.y;}return r._ax;}
const LEG={ride:{uL:[0.42,-0.5,0.75],uR:[-0.42,-0.5,0.75],lL:[0.12,-0.95,-0.15],lR:[-0.12,-0.95,-0.15]},sit:{uL:[0.8,-0.08,0.6],uR:[-0.8,-0.08,0.6],lL:[-0.85,-0.12,0.45],lR:[0.85,-0.08,0.5]}};
const _d=new THREE.Vector3();
function pose(r,P){const ax=legsAxes(r);aim(r,'UpperLegL',ax.uL,_d.set(...P.uL));aim(r,'LowerLegL',ax.lL,_d.set(...P.lL));aim(r,'UpperLegR',ax.uR,_d.set(...P.uR));aim(r,'LowerLegR',ax.lR,_d.set(...P.lR));}
function seat(r){pose(r,LEG.ride);}
function sitCross(r){pose(r,LEG.sit);}
// ---------------- hiệu ứng ----------------
const fxViews=new Map();const glowTex=()=>tex('glow');
function fxMake(f){const col=new THREE.Color(f.col||'#ffffff');const add={transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide};let o;
  if(f.k==='ring'){o=new THREE.Mesh(new THREE.RingGeometry(0.8,1,48),new THREE.MeshBasicMaterial(Object.assign({color:col,map:tex('ring')},add)));o.rotation.x=-Math.PI/2;}
  else if(f.k==='burst'||f.k==='dust'){o=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(),color:f.k==='dust'?0xd8c49a:col,transparent:true,depthWrite:false,blending:f.k==='dust'?THREE.NormalBlending:THREE.AdditiveBlending}));}
  else if(f.k==='slash'){o=new THREE.Mesh(new THREE.RingGeometry(0.9,1.25,24,1,-0.9,2.0),new THREE.MeshBasicMaterial(Object.assign({color:0xffffff},add)));}
  else if(f.k==='bolt'){const pts=[];let x=0,z=0;for(let y=14;y>=0;y-=1){pts.push(new THREE.Vector3(x,y,z));x+=(Math.random()-.5)*0.7;z+=(Math.random()-.5)*0.7;}o=new THREE.Group();
    o.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0xcfe8ff,transparent:true,blending:THREE.AdditiveBlending})));const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(),color:0x9fd0ff,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));s.scale.set(4,4,1);s.position.y=0.5;o.add(s);}
  else if(f.k==='warn'){o=new THREE.Mesh(new THREE.CircleGeometry(1,40),new THREE.MeshBasicMaterial({color:0xff3b30,transparent:true,opacity:0.35,depthWrite:false,side:THREE.DoubleSide}));o.rotation.x=-Math.PI/2;
    const edge=new THREE.Mesh(new THREE.RingGeometry(0.96,1,48),new THREE.MeshBasicMaterial({color:0xff5d5d,transparent:true,opacity:0.9,depthWrite:false,side:THREE.DoubleSide}));o.add(edge);}
  if(o){o.renderOrder=5;scene.add(o);}return o;}
function syncFx(){const live=new Set(G.fx);fxViews.forEach((o,f)=>{if(!live.has(f)){scene.remove(o);fxViews.delete(f);}});
  G.fx.forEach(f=>{if(f.k==='flash'||f.t<0)return;let o=fxViews.get(f);if(!o){o=fxMake(f);if(!o)return;fxViews.set(f,o);}const p=Math.min(1,f.t/f.life);const wx=f.x/T,wz=f.y/T;const gy=standH(wx,wz);
    if(f.k==='ring'){const r=(f.r0+(f.r1-f.r0)*p)/T;o.position.set(wx,gy+0.12,wz);o.scale.setScalar(Math.max(0.05,r));o.material.opacity=1-p;}
    else if(f.k==='burst'){o.position.set(wx,gy+0.9,wz);const s=(f.r||12)/T*2*(0.6+p);o.scale.set(s,s,1);o.material.opacity=1-p;}
    else if(f.k==='dust'){o.position.set(wx,gy+0.2,wz);o.scale.setScalar(0.6+p);o.material.opacity=(1-p)*0.6;}
    else if(f.k==='slash'){o.position.set(wx,gy+1.1,wz);o.lookAt(camera.position);o.material.opacity=1-p;o.scale.setScalar(1+p*0.4);}
    else if(f.k==='bolt'){o.position.set(wx,gy,wz);o.children.forEach(c=>{if(c.material)c.material.opacity=1-p;});}
    else if(f.k==='warn'){const r=(f.r||40)/T;o.position.set(wx,gy+0.08,wz);o.scale.setScalar(r);o.material.opacity=0.15+0.35*p;}});}
// đồ rơi
const dropViews=new Map();
function syncDrops(t){const live=new Set(G.drops);dropViews.forEach((o,d)=>{if(!live.has(d)){scene.remove(o);dropViews.delete(d);}});
  G.drops.forEach(d=>{let o=dropViews.get(d);if(!o){o=new THREE.Group();let col=0xffd27a;if(d.item){const c=G.RARITY[d.item.r].col;col=c==='rainbow'?0xffd84a:new THREE.Color(c).getHex();}else if(d.stone)col=0x7fe0ff;else if(d.ingr)col=0xd98a6a;
      const core=new THREE.Mesh(d.item?new THREE.OctahedronGeometry(0.22):d.stone?new THREE.OctahedronGeometry(0.14):new THREE.CylinderGeometry(0.14,0.1,0.12,6),new THREE.MeshLambertMaterial({color:col,emissive:new THREE.Color(col).multiplyScalar(0.4)}));core.position.y=0.4;o.add(core);
      const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(),color:col,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));s.scale.set(1.2,1.2,1);s.position.y=0.4;o.add(s);
      if(d.item&&d.item.r>=3){const beam=new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.25,3,8,1,true),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0.35,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));beam.position.y=1.5;o.add(beam);}
      scene.add(o);dropViews.set(d,o);}const wx=d.x/T,wz=d.y/T;o.position.set(wx,standH(wx,wz)+Math.sin(t*4+wx)*0.08,wz);o.children[0].rotation.y=t*2;});}
// ---------------- máy quay & cử chỉ ----------------
function gestures(){const pts=new Map();let pinch0=null,downAt=null;
  canvas.addEventListener('pointerdown',e=>{pts.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pts.size===1)downAt={x:e.clientX,y:e.clientY,t:performance.now()};if(pts.size===2){const [a,b]=[...pts.values()];pinch0={d:Math.hypot(a.x-b.x,a.y-b.y),dist:cam.tdist,ang:Math.atan2(b.y-a.y,b.x-a.x),yaw:cam.yaw};downAt=null;}canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pts.size===2&&pinch0){const [a,b]=[...pts.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);cam.tdist=Math.max(cam.min,Math.min(cam.max,pinch0.dist*pinch0.d/Math.max(20,d)));
      const ang=Math.atan2(b.y-a.y,b.x-a.x);cam.yaw=pinch0.yaw-(ang-pinch0.ang);}
    else if(pts.size===1&&downAt&&Math.hypot(e.clientX-downAt.x,e.clientY-downAt.y)>12&&e.pointerType==='mouse'&&e.buttons===2){cam.yaw+=e.movementX*0.01;}});
  const up=e=>{if(pts.size===1&&downAt&&Math.hypot(e.clientX-downAt.x,e.clientY-downAt.y)<12&&performance.now()-downAt.t<450)tap(e.clientX,e.clientY);pts.delete(e.pointerId);if(pts.size<2)pinch0=null;if(!pts.size)downAt=null;};
  canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',e=>{pts.delete(e.pointerId);pinch0=null;});
  canvas.addEventListener('wheel',e=>{e.preventDefault();cam.tdist=Math.max(cam.min,Math.min(cam.max,cam.tdist*(1+Math.sign(e.deltaY)*0.12)));},{passive:false});
  canvas.addEventListener('contextmenu',e=>e.preventDefault());}
R3.zoom=f=>{cam.tdist=Math.max(cam.min,Math.min(cam.max,cam.tdist*f));};R3.rotate=a=>{cam.yaw+=a;};
const ray=new THREE.Raycaster();
function tap(cx,cy){if(G.paused||!terrain)return;G.audio&&G.audio.init();const W=window.innerWidth,H=window.innerHeight;
  // chạm vào NPC / quái gần điểm chạm
  let best=null,bd=46;const test=(e,type,h)=>{const s=project(e.x/T,standH(e.x/T,e.y/T)+h*0.6,e.y/T);if(!s)return;const d=Math.hypot(s[0]-cx,s[1]-cy);if(d<bd){bd=d;best={e,type};}};
  G.npcs.forEach(n=>test(n,'npc',1.7));G.mobs.forEach(m=>{if(m.hp>0)test(m,'mob',m.boss?2.5:1);});if(G.pk&&G.pk.hp>0)test(G.pk,'mob',1.7);
  if(best){if(best.type==='npc'){G.tapNpc&&G.tapNpc(best.e);}else{G.tapMob&&G.tapMob(best.e);}return;}
  ray.setFromCamera(new THREE.Vector2(cx/W*2-1,-(cy/H)*2+1),camera);const hit=ray.intersectObject(terrain,false)[0];if(hit){G.tapGround&&G.tapGround(hit.point.x*T,hit.point.z*T);marker(hit.point);}}
let mk=null;function marker(p){if(!mk){mk=new THREE.Mesh(new THREE.RingGeometry(0.3,0.45,24),new THREE.MeshBasicMaterial({color:0xffd84a,transparent:true,side:THREE.DoubleSide,depthWrite:false}));mk.rotation.x=-Math.PI/2;scene.add(mk);}mk.position.set(p.x,p.y+0.08,p.z);mk.userData.t=0.6;mk.visible=true;}
R3.rotMove=(jx,jy)=>{const c=Math.cos(cam.yaw),s=Math.sin(cam.yaw);return {x:c*jx+s*jy,y:-s*jx+c*jy};};
// ---------------- chiếu toạ độ ----------------
const _p=new THREE.Vector3();let SW=1,SH=1,DPR=1;
function project(x,y,z){_p.set(x,y,z).project(camera);if(_p.z>1)return null;return [(_p.x+1)/2*SW,(1-_p.y)/2*SH];}
R3.project=project;R3._make=makeActor;R3._play=play;
R3.dbg=()=>({calls:renderer.info.render.calls,tris:renderer.info.render.triangles,cam:camera.position.toArray().map(v=>+v.toFixed(1)),kids:scene.children.length,cv:[canvas.width,canvas.height,canvas.clientWidth],map:!!curMap,ctx:renderer.getContext().isContextLost()});
// ---------------- vòng vẽ ----------------
let lastT=performance.now(),acc=0;const clock={t:0};
R3.render=function(){if(!R3.ready||!G.map)return;const now=performance.now();const dt=Math.min(0.05,(now-lastT)/1000);lastT=now;clock.t+=dt;const t=clock.t;
  if(curMap!==G.map)loadMap(G.map);const P=G.P;const px=P.x/T,pz=P.y/T;
  cam.dist+=(cam.tdist-cam.dist)*Math.min(1,dt*8);cam.tx+=(px-cam.tx)*Math.min(1,dt*6);cam.tz+=(pz-cam.tz)*Math.min(1,dt*6);if(Math.abs(px-cam.tx)>30){cam.tx=px;cam.tz=pz;}
  const ty=standH(cam.tx,cam.tz)+0.8;const ch=Math.cos(cam.pitch)*cam.dist,cv=Math.sin(cam.pitch)*cam.dist;let sx=0,sz=0;if(G.shake>0){sx=(Math.random()-.5)*0.3;sz=(Math.random()-.5)*0.3;}
  camera.position.set(cam.tx+Math.sin(cam.yaw)*ch+sx,ty+cv,cam.tz+Math.cos(cam.yaw)*ch+sz);camera.lookAt(cam.tx,ty,cam.tz);
  scene.fog.near=cam.dist*1.4;scene.fog.far=cam.dist*3.6+30;
  // ánh sáng ngày đêm
  const dk=G.darkness()/0.6;const rain=G.raining();const day=1-dk;
  // đêm trăng sáng: vẫn nhìn rõ cảnh vật
  sun.intensity=0.9+1.4*day*(rain?0.6:1);sun.color.setRGB(1,0.92+0.06*day,0.8+0.18*day).lerp(new THREE.Color(0xb8c8ff),dk);hemi.intensity=0.95+0.3*day;hemi.color.set(0xdfefff).lerp(new THREE.Color(0x8796c8),dk);hemi.groundColor&&hemi.groundColor.set(0x6a5a40).lerp(new THREE.Color(0x3a3a50),dk);
  renderer.toneMappingExposure=1.05+0.35*dk;
  const sky=new THREE.Color(rain?0x9aa8b0:0xbfd8e8).lerp(new THREE.Color(0x2a3a66),dk);scene.background.copy(sky);scene.fog.color.copy(sky);
  R3.aura.position.set(px,(G.S.mounted?3.2:2.6)+groundH(px,pz),pz);R3.aura.intensity=dk*7;
  sun.position.set(cam.tx-30,50,cam.tz+20);sun.target.position.set(cam.tx,0,cam.tz);
  updFlags(t);  if(water){water.material.uniforms.t.value=t;water.material.uniforms.night.value=dk*0.45;}
  // đèn lồng gần nhất
  const near=R3.lamps.map(l=>({l,d:(l.x-px)**2+(l.z-pz)**2})).sort((a,b)=>a.d-b.d);lights.forEach((L,i)=>{const n=near[i];if(n&&dk>0.05){L.position.set(n.l.x,n.l.y,n.l.z);L.intensity=dk*(n.l.k==='lantern'?6:9);}else L.intensity=0;});
  MAT.lantern.emissive.setRGB(0.4+dk*0.9,0.06+dk*0.25,0.03);
  clouds.forEach((c,i)=>{c.position.x+=dt*c.userData.v;if(c.position.x>cam.tx+90)c.position.x=cam.tx-90;if(Math.abs(c.position.z-cam.tz)>70||!c.userData.init){c.position.z=cam.tz+(Math.random()-.5)*120;c.position.x=cam.tx+(Math.random()-.5)*160;c.userData.init=1;}c.material.opacity=Math.max(0,Math.min(0.55,(cam.dist-34)/40))*(1-dk*0.6);});
  if(mk&&mk.visible){mk.userData.t-=dt;mk.scale.setScalar(1+(0.6-mk.userData.t));mk.material.opacity=Math.max(0,mk.userData.t/0.6);if(mk.userData.t<=0)mk.visible=false;}
  // thực thể trong tầm
  const R2=(cam.dist*1.6+16)**2;const seen=new Set();const near2=(e)=>(e.x/T-cam.tx)**2+(e.y/T-cam.tz)**2<R2;
  const handle=(e,type)=>{if(!near2(e))return;const v=ensure(e,type);if(!v)return;seen.add(e);if(type==='player')syncPlayer(v,dt,t);else syncView(v,dt,t);};
  handle(P,'player');if(!P.boat&&G.S.gear&&G.S.gear.shiba)handle(G.shiba,'shiba');G.npcs.forEach(n=>{if(n.art!=='board')handle(n,'npc');});G.mobs.forEach(m=>handle(m,'mob'));G.bots.forEach(b=>handle(b,'bot'));if(G.pk&&G.pk.hp>0)handle(G.pk,'pk');(G.amb||[]).forEach(a=>handle(a,'amb'));
  views.forEach((v,e)=>{if(!seen.has(e)){if(v.rider)poolPut(v.rider);if(v.boat)poolPut(v.boat);v.rider=null;v.boat=null;poolPut(v);views.delete(e);}});
  syncFx();syncDrops(t);
  // mây đen khi mưa
  renderer.render(scene,camera);overlay(t);};
// ---------------- lớp chữ 2D ----------------
function overlay(t){const W=ov.width,H=ov.height;DPR=W/window.innerWidth;SW=W;SH=H;octx.setTransform(1,0,0,1,0,0);octx.clearRect(0,0,W,H);
  const fs=Math.round(11*DPR);const P=G.P;
  const label=(x,y,txt,col,sub,h)=>{const s=project(x/T,standH(x/T,y/T)+(h||2.1),y/T);if(!s)return null;const [X,Y]=s;octx.font=`700 ${fs}px "Be Vietnam Pro",system-ui,sans-serif`;octx.textAlign='center';octx.lineWidth=3*DPR;octx.strokeStyle='rgba(0,0,0,.8)';octx.strokeText(txt,X,Y);octx.fillStyle=col;octx.fillText(txt,X,Y);
    if(sub){octx.font=`600 ${Math.round(9.5*DPR)}px "Be Vietnam Pro",system-ui,sans-serif`;octx.strokeText(sub,X,Y-fs*1.05);octx.fillStyle='#ffe6a0';octx.fillText(sub,X,Y-fs*1.05);}return s;};
  const bar=(s,w,p,col)=>{if(!s)return;const ww=w*DPR;const X=s[0],Y=s[1]+3*DPR;octx.fillStyle='rgba(0,0,0,.65)';octx.fillRect(X-ww/2-1,Y-1,ww+2,4*DPR+2);octx.fillStyle=col;octx.fillRect(X-ww/2,Y,ww*Math.max(0,p),4*DPR);};
  const bubble=(x,y,b,h)=>{const s=project(x/T,standH(x/T,y/T)+(h||2.5),y/T);if(!s)return;const [X,Y]=s;octx.font=`600 ${Math.round(13*DPR)}px "Noto Sans SC",system-ui,sans-serif`;const w1=octx.measureText(b.zh).width;octx.font=`500 ${Math.round(9.5*DPR)}px "Be Vietnam Pro",system-ui`;const w2=octx.measureText(b.vi).width;const w=Math.max(w1,w2)+14*DPR,hh=32*DPR;
    octx.fillStyle='rgba(250,242,222,.95)';octx.strokeStyle='rgba(120,80,30,.8)';octx.lineWidth=1.5*DPR;octx.beginPath();(octx.roundRect?octx.roundRect(X-w/2,Y-hh,w,hh,7*DPR):octx.rect(X-w/2,Y-hh,w,hh));octx.fill();octx.stroke();octx.fillStyle='#1a1210';octx.textAlign='center';
    octx.font=`600 ${Math.round(13*DPR)}px "Noto Sans SC",system-ui,sans-serif`;octx.fillText(b.zh,X,Y-hh+14*DPR);octx.font=`500 ${Math.round(9.5*DPR)}px "Be Vietnam Pro",system-ui`;octx.fillStyle='#5a4636';octx.fillText(b.vi,X,Y-6*DPR);};
  const near=(e,r)=>(e.x/T-cam.tx)**2+(e.y/T-cam.tz)**2<(r||cam.dist*1.3+10)**2;const showSmall=cam.dist<45;
  // tên mình
  const me=label(P.x,P.y,'Kị sỹ Takd',G.S.pkMode&&G.S.pkMode!=='luyen'?'#ff8a7a':'#7fe0ff',((G.S.rank||0)>=3?'Muay Việt · ':'')+(G.rankName?G.rankName():''),G.S.mounted!==false&&!P.boat?3.0:2.2);
  const q=G.curQuest&&G.curQuest();
  G.npcs.forEach(n=>{if(!near(n))return;const s=label(n.x,n.y,n.vi,'#ffe6a0',n.zh,n.art==='board'?2.6:2.15);if(s&&q&&q.npc===n.id&&G.S.q.st!=='active'){octx.font=`900 ${fs*2}px system-ui`;octx.fillStyle=G.S.q.st==='done'?'#9fe07a':'#ffd84a';octx.strokeStyle='#000';octx.lineWidth=3*DPR;const yy=s[1]-fs*1.6+Math.sin(t*4)*3*DPR;octx.strokeText(G.S.q.st==='done'?'?':'!',s[0],yy);octx.fillText(G.S.q.st==='done'?'?':'!',s[0],yy);}});
  if(showSmall)G.mobs.forEach(mb=>{if(mb.hp<=0||!near(mb))return;const kk=KINDS[kindOf(mb,'mob')];const h=(kk?kk.h:1)*(1+(mb.tier||0)*0.12)+0.35;
    if(mb.boss){const s=label(mb.x,mb.y,'👑 '+mb.name.vi,'#ff8a7a',mb.name.zh+' · Lv '+mb.lv,h);bar(s,60,mb.hp/mb.max,'#e0412f');}
    else{const s=label(mb.x,mb.y,mb.name.vi+' Lv'+mb.lv,mb.tier?G.MOB_TIER[mb.tier].col:'#f0e6d0',null,h);if(mb.hp<mb.max)bar(s,30,mb.hp/mb.max,'#e0412f');}});
  G.bots.forEach(b=>{if(!near(b))return;label(b.x,b.y,b.b.name+' Lv'+b.lv,b.b.sect.col,b.b.sect.vi||b.b.sect.zh,2.15);if(b.say&&b.say.t>0)bubble(b.x,b.y,b.say,3.0);});
  const k=G.pk;if(k&&k.hp>0){const s=label(k.x,k.y,'⚔ '+k.b.name+' Lv'+k.lv,'#ff5d5d',null,2.15);bar(s,34,k.hp/k.max,'#e0412f');if(k.say&&k.say.t>0)bubble(k.x,k.y,k.say,3.0);}
  (G.amb||[]).forEach(a=>{if(a.say&&a.say.t>0&&near(a,30))bubble(a.x,a.y,a.say,2.4);});
  G.map.portals.forEach(p=>{label(p.x*T+8,p.y*T+8,(p.need&&!G.S.bosses[p.need]?'🔒 ':'➜ ')+p.vi,'#7fe0ff',p.zh,3.4);});
  G.texts.forEach(tx=>{const s=project(tx.x/T,standH(tx.x/T,tx.y/T)+1.6,tx.y/T);if(!s)return;octx.globalAlpha=1-tx.t/tx.life;octx.font=`900 ${Math.round((tx.big?17:13)*DPR)}px "Be Vietnam Pro",system-ui,sans-serif`;octx.textAlign='center';octx.lineWidth=3.5*DPR;octx.strokeStyle='rgba(0,0,0,.85)';octx.strokeText(tx.txt,s[0],s[1]);octx.fillStyle=tx.col;octx.fillText(tx.txt,s[0],s[1]);octx.globalAlpha=1;});
  G.fx.forEach(f=>{if(f.k==='flash'&&f.t>0){octx.globalAlpha=(1-f.t/f.life)*0.5;octx.fillStyle='#fff3c4';octx.fillRect(0,0,W,H);octx.globalAlpha=1;}});
  if(G.raining()){octx.strokeStyle='rgba(190,205,230,.45)';octx.lineWidth=DPR;octx.beginPath();for(let i=0;i<140;i++){const X=((i*97+t*60*(1+i%3))%W+W)%W,Y=((i*53*7+t*700*(0.8+(i%5)/5))%H);octx.moveTo(X,Y);octx.lineTo(X-4*DPR,Y+16*DPR);}octx.stroke();}
  // dùng lại mũi tên nhiệm vụ của game2
  if(G.extOverlay){const S2=(x,y)=>{const s=project(x/T,standH(x/T,y/T),y/T);return s||[-9999,-9999];};G.cam={x:(cam.tx-20)*T,y:(cam.tz-20)*T,vw:40*T,vh:40*T};G.extOverlay(octx,S2,()=>{},()=>{},{W,H,DPR,SC:1,cx:0,cy:0,vw:0,vh:0},true);}
}
