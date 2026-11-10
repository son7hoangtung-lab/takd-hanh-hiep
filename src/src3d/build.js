// Dựng kiến trúc & cây cối Đại Việt bằng hình khối 3D
import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {tex,rng} from './tex.js';

const L=(o)=>new THREE.MeshLambertMaterial(o);
export const MAT={};
export function initMats(){
  const ds=THREE.DoubleSide;
  Object.assign(MAT,{
    roof:L({map:tex('roofTile'),side:ds}),roofGold:L({map:tex('roofGold'),side:ds}),thatch:L({map:tex('thatch'),side:ds}),
    plaster:L({map:tex('plaster')}),mud:L({map:tex('mud')}),wood:L({map:tex('wood')}),lacquer:L({map:tex('lacquer')}),door:L({map:tex('door')}),
    stone:L({map:tex('stone')}),brick:L({map:tex('brick')}),cloth:L({map:tex('cloth'),side:ds}),paper:L({map:tex('paper')}),plaque:L({map:tex('plaque')}),
    bark:L({map:tex('bark')}),bamboo:L({map:tex('bamboo')}),
    leaf:L({map:tex('leaf'),side:ds}),leafDark:L({map:tex('leaf'),color:0x9fb08f,side:ds}),leafLight:L({map:tex('leaf'),color:0xd8f0b0,side:ds}),
    bambooLeaf:L({color:0x5f9a3a,side:ds}),palmLeaf:L({color:0x5a9a40,side:ds}),bananaLeaf:L({color:0x7ab84a,side:ds}),
    gold:L({color:0xd9a441,emissive:0x2a1800}),white:L({color:0xe8e0cc}),straw:L({map:tex('thatch'),color:0xffe0a0}),
    red:L({color:0xd8352b}),clay:L({color:0x9a5a30}),darkClay:L({color:0x5a3a22}),black:L({color:0x1a1410}),iron:L({color:0x44464c}),
    lantern:L({color:0xd8352b,emissive:0x601008}),fire:new THREE.MeshBasicMaterial({color:0xffa040}),
    rice:L({color:0x8ac24a,side:ds}),riceGold:L({color:0xc8b84a,side:ds}),grassTuft:L({color:0x7ab648,side:ds}),
    lotusPad:L({color:0x3f8a3a,side:ds}),lotusFlower:L({color:0xf2a8c0,side:ds}),reed:L({color:0x9aa04a,side:ds}),reedTop:L({color:0xd8cfa8}),
    karst:L({color:0x7d8475,flatShading:true}),karstGreen:L({color:0x4f7a36,flatShading:true}),lilac:L({color:0xc9b6e8}),
    hatLeaf:L({color:0xe2d4a0,side:ds}),net:new THREE.MeshLambertMaterial({color:0xcfc4a0,wireframe:true}),flag:L({color:0xd8352b,side:ds}),
  });
}
// ---------- tiện ích dựng ----------
const _m=new THREE.Matrix4(),_q=new THREE.Quaternion(),_e=new THREE.Euler(),_v=new THREE.Vector3(),_s=new THREE.Vector3();
function planarUV(g,sc){const p=g.attributes.position,n=g.attributes.normal;const uv=new Float32Array(p.count*2);
  for(let i=0;i<p.count;i++){const ax=Math.abs(n.getX(i)),ay=Math.abs(n.getY(i)),az=Math.abs(n.getZ(i));let u,v;
    if(ay>=ax&&ay>=az){u=p.getX(i);v=p.getZ(i);}else if(ax>=az){u=p.getZ(i);v=p.getY(i);}else{u=p.getX(i);v=p.getY(i);}uv[i*2]=u/sc;uv[i*2+1]=v/sc;}
  g.setAttribute('uv',new THREE.BufferAttribute(uv,2));}
export class Builder{constructor(){this.parts=[];}
  add(geo,mat,o={}){let g=geo.index?geo.toNonIndexed():geo.clone();for(const k of Object.keys(g.attributes))if(!['position','normal','uv'].includes(k))g.deleteAttribute(k);
    _e.set(...(o.r||[0,0,0]),o.order||'XYZ');_q.setFromEuler(_e);_s.set(...(Array.isArray(o.s)?o.s:[o.s||1,o.s||1,o.s||1]));_v.set(...(o.p||[0,0,0]));_m.compose(_v,_q,_s);g.applyMatrix4(_m);
    if(o.uv!==false&&(o.uv||!g.attributes.uv||o.wuv))planarUV(g,o.uv||1.5);else if(!g.attributes.uv)planarUV(g,1.5);
    this.parts.push({g,mat});return this;}
  box(w,h,d,mat,o={}){return this.add(new THREE.BoxGeometry(w,h,d),mat,Object.assign({wuv:1},o));}
  cyl(rt,rb,h,mat,o={},seg=8){return this.add(new THREE.CylinderGeometry(rt,rb,h,seg,1,!!o.open),mat,o);}
  cone(r,h,mat,o={},seg=8){return this.add(new THREE.ConeGeometry(r,h,seg),mat,o);}
  sph(r,mat,o={},d=1){return this.add(new THREE.IcosahedronGeometry(r,d),mat,o);}
  lathe(pts,mat,o={},seg=12){return this.add(new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p[0],p[1])),seg),mat,o);}
  merge(other,o={}){other.parts.forEach(pt=>{const g=pt.g.clone();_e.set(...(o.r||[0,0,0]));_q.setFromEuler(_e);_s.set(...(Array.isArray(o.s)?o.s:[o.s||1,o.s||1,o.s||1]));_v.set(...(o.p||[0,0,0]));_m.compose(_v,_q,_s);g.applyMatrix4(_m);this.parts.push({g,mat:pt.mat});});return this;}
  // gộp theo vật liệu
  bake(){const by=new Map();this.parts.forEach(p=>{if(!by.has(p.mat))by.set(p.mat,[]);by.get(p.mat).push(p.g);});const out=[];by.forEach((gs,mat)=>{const g=mergeGeometries(gs,false);g.computeBoundingSphere();out.push({g,mat});});return out;}
}
// ---------- mái cong ----------
export function roofGeo(w,d,h,o={}){const over=o.over??0.6,curl=o.curl??0,sag=o.sag??0.3,nu=o.nu||14,nv=o.nv||8;const A=w/2+over,B=d/2+over;const R=Math.max(0,(w-d)/2)*(o.ridge??1);
  const faces=[[[-A,B],[A,B],[-R,0],[R,0]],[[A,-B],[-A,-B],[R,0],[-R,0]],[[-A,-B],[-A,B],[-R,0],[-R,0]],[[A,B],[A,-B],[R,0],[R,0]]];
  const pos=[],uv=[],idx=[];
  faces.forEach(([e0,e1,t0,t1])=>{const base=pos.length/3;const len=Math.hypot(e1[0]-e0[0],e1[1]-e0[1]);const slope=Math.hypot(h,Math.hypot((e0[0]+e1[0])/2-(t0[0]+t1[0])/2,(e0[1]+e1[1])/2-(t0[1]+t1[1])/2));
    for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){const u=i/nu,v=j/nv;const ex=e0[0]+(e1[0]-e0[0])*u,ez=e0[1]+(e1[1]-e0[1])*u,tx=t0[0]+(t1[0]-t0[0])*u,tz=t0[1]+(t1[1]-t0[1])*u;
      let x=ex+(tx-ex)*v,z=ez+(tz-ez)*v;let y=h*Math.pow(v,1+sag);const c=Math.pow(Math.abs(2*u-1),6)*(1-v)*(1-v);y+=curl*c;const k=1+0.07*c*(curl>0?1:0);x*=k;z*=k;
      pos.push(x,y,z);uv.push(u*len/1.4,v*slope/1.4);}
    for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){const a=base+j*(nu+1)+i,b=a+1,c=a+nu+1,dd=c+1;idx.push(a,b,c,b,dd,c);}});
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;}
function roof(b,w,d,h,mat,o={}){b.add(roofGeo(w,d,h,o),mat,{p:[0,o.y||0,0],uv:false});const R=Math.max(0,(w-d)/2)*(o.ridge??1);const top=(o.y||0)+h;
  if(R>0.05){b.box(R*2+0.3,0.22,0.3,o.ridgeMat||MAT.darkClay,{p:[0,top+0.05,0]});if(o.horn!==false){[-1,1].forEach(s=>{b.cone(0.12,0.6,o.ridgeMat||MAT.darkClay,{p:[s*(R+0.3),top+0.25,0],r:[0,0,-s*0.9]});});}}
  if(o.curl>0.2&&o.horn!==false){const A=w/2+(o.over??0.6),B=d/2+(o.over??0.6);[[-1,1],[1,1],[-1,-1],[1,-1]].forEach(([sx,sz])=>{b.cone(0.09,0.7,o.ridgeMat||MAT.darkClay,{p:[sx*A*1.07,(o.y||0)+o.curl+0.2,sz*B*1.07],r:[sz*0.5,0,-sx*0.6]});});}}
// ---------- công trình ----------
const B={};
B.hut=(v)=>{const r=rng(11+v);const b=new Builder();const w=4.4+r()*0.8,d=2.8+r()*0.4;b.box(w+0.6,0.25,d+0.6,MAT.stone,{p:[0,0.12,0]});b.box(w,1.75,d,MAT.mud,{p:[0,1.12,0]});
  b.box(0.9,1.45,0.06,MAT.door,{p:[-w*0.15,0.98,d/2+0.03]});b.box(0.7,0.5,0.06,MAT.black,{p:[w*0.25,1.35,d/2+0.03]});for(let i=0;i<4;i++)b.cyl(0.025,0.025,0.5,MAT.bamboo,{p:[w*0.25-0.27+i*0.18,1.35,d/2+0.06]});
  for(const sx of [-1,1])b.cyl(0.07,0.07,1.9,MAT.bamboo,{p:[sx*w/2,1.1,d/2+0.5]});roof(b,w,d,1.9+r()*0.4,MAT.thatch,{y:2.0,over:0.75,sag:0.15,ridgeMat:MAT.straw,horn:false});
  if(r()<.6)b.box(0.3,0.9,0.3,MAT.clay,{p:[w/2+0.5,0.45,d/2-0.2]});return b;};
B.house=(v)=>{const r=rng(31+v);const b=new Builder();const w=5.6+r()*0.8,d=3.3;b.box(w+0.8,0.45,d+0.9,MAT.stone,{p:[0,0.22,0]});b.box(1.6,0.2,0.4,MAT.stone,{p:[0,0.1,d/2+0.6]});
  b.box(w,2.1,0.2,MAT.plaster,{p:[0,1.5,-d/2]});for(const sx of [-1,1])b.box(0.2,2.1,d,MAT.plaster,{p:[sx*w/2,1.5,0]});
  b.box(w-0.2,2.0,0.1,MAT.door,{p:[0,1.45,d/2-0.3],uv:false});
  for(let i=0;i<4;i++){const x=-w/2+0.2+i*(w-0.4)/3;b.cyl(0.11,0.12,2.3,MAT.wood,{p:[x,1.6,d/2+0.05]});}
  roof(b,w,d,1.8,MAT.roof,{y:2.6,over:0.85,curl:0.5,sag:0.45});return b;};
B.dinh=()=>{const b=new Builder();const w=9.2,d=5.6;b.box(w+1.6,0.7,d+1.8,MAT.stone,{p:[0,0.35,0]});for(let i=0;i<3;i++)b.box(3.2-i*0.4,0.23,0.5,MAT.stone,{p:[0,0.12+i*0.23,d/2+1.25+(2-i)*0.45]});
  b.box(w,3.0,0.2,MAT.wood,{p:[0,2.2,-d/2+0.2]});for(let ix=0;ix<6;ix++)for(let iz=0;iz<3;iz++){b.cyl(0.18,0.2,3.1,MAT.lacquer,{p:[-w/2+0.3+ix*(w-0.6)/5,2.25,-d/2+0.4+iz*(d-0.8)/2]},10);}
  b.box(2.2,1.2,0.1,MAT.gold,{p:[0,2.8,-d/2+0.35]});b.box(1.0,1.0,0.6,MAT.lacquer,{p:[0,1.2,-d/2+0.8]});
  roof(b,w,d,3.0,MAT.roof,{y:3.7,over:1.5,curl:1.1,sag:0.65,nu:18});
  const top=6.7;b.box(1.0,0.06,0.06,MAT.gold,{p:[0,top+0.6,0]});b.cyl(0.4,0.4,0.08,MAT.gold,{p:[0,top+0.6,0],r:[Math.PI/2,0,0]},14);
  for(const s of [-1,1]){b.add(new THREE.TorusGeometry(0.55,0.09,6,10,Math.PI*1.2),MAT.gold,{p:[s*1.4,top+0.45,0],r:[0,0,s>0?0.2:Math.PI-0.2]});b.cone(0.1,0.4,MAT.gold,{p:[s*2.0,top+0.6,0],r:[0,0,-s*0.6]});}
  return b;};
B.chua=()=>{const b=new Builder();const w=6.6,d=4.2;b.box(w+1.2,0.6,d+1.4,MAT.stone,{p:[0,0.3,0]});b.box(2.4,0.3,0.6,MAT.stone,{p:[0,0.15,d/2+0.9]});
  b.box(w,2.5,d,MAT.plaster,{p:[0,1.85,0]});b.box(1.6,1.9,0.08,MAT.lacquer,{p:[0,1.55,d/2+0.02],uv:false});for(const s of [-1,1])b.box(0.8,0.8,0.08,MAT.black,{p:[s*2,2.0,d/2+0.02]});
  roof(b,w,d,1.2,MAT.roof,{y:3.1,over:0.9,curl:0.55,sag:0.5});b.box(w*0.55,0.9,d*0.6,MAT.plaster,{p:[0,4.55,0]});roof(b,w*0.55,d*0.6,1.2,MAT.roof,{y:5.0,over:0.7,curl:0.5,sag:0.5});
  b.sph(0.18,MAT.gold,{p:[0,6.45,0]});return b;};
B.thapchuong=()=>{const b=new Builder();b.box(2.8,0.4,2.8,MAT.stone,{p:[0,0.2,0]});for(const sx of [-1,1])for(const sz of [-1,1])b.cyl(0.11,0.12,2.6,MAT.lacquer,{p:[sx*1.0,1.7,sz*1.0]});
  b.lathe([[0,0],[0.42,0],[0.45,0.1],[0.36,0.6],[0.24,0.85],[0,0.9]],MAT.gold,{p:[0,1.9,0]});b.cyl(0.03,0.03,0.4,MAT.black,{p:[0,2.95,0]});
  roof(b,2.0,2.0,1.1,MAT.roof,{y:3.0,over:0.6,curl:0.5,sag:0.5});b.box(1.1,0.5,1.1,MAT.lacquer,{p:[0,4.3,0]});roof(b,1.1,1.1,0.9,MAT.roof,{y:4.5,over:0.45,curl:0.4,sag:0.5});b.sph(0.12,MAT.gold,{p:[0,5.5,0]});return b;};
B.conglang=()=>{const b=new Builder();for(const s of [-1,1]){b.box(1.0,3.6,1.0,MAT.white,{p:[s*1.7,1.8,0]});b.box(1.2,0.25,1.2,MAT.stone,{p:[s*1.7,0.12,0]});b.box(0.9,0.5,0.9,MAT.white,{p:[s*1.7,3.85,0]});
    b.box(2.2,2.2,0.5,MAT.white,{p:[s*3.3,1.1,0]});b.add(roofGeo(2.0,0.6,0.5,{over:0.25,curl:0.2}),MAT.roof,{p:[s*3.3,2.25,0],uv:false});}b.box(3.4,0.6,1.1,MAT.white,{p:[0,3.7,0]});b.box(1.8,0.45,0.06,MAT.plaque,{p:[0,3.25,0.56],uv:false});
  roof(b,3.6,1.4,0.9,MAT.roof,{y:4.0,over:0.5,curl:0.45,sag:0.5});return b;};
B.board=()=>{const b=new Builder();for(const s of [-1,1])b.cyl(0.06,0.06,2.2,MAT.wood,{p:[s*0.75,1.1,0]});b.box(1.5,1.0,0.08,MAT.wood,{p:[0,1.5,0]});b.box(1.3,0.85,0.02,MAT.paper,{p:[0,1.5,0.05],uv:false});
  roof(b,1.6,0.4,0.35,MAT.roof,{y:2.15,over:0.2,curl:0.15,horn:false});return b;};
B.well=()=>{const b=new Builder();b.cyl(0.85,0.9,0.7,MAT.stone,{p:[0,0.35,0],open:true},16);b.add(new THREE.TorusGeometry(0.85,0.12,6,18),MAT.stone,{p:[0,0.72,0],r:[Math.PI/2,0,0]});
  b.cyl(0.8,0.8,0.02,MAT.black,{p:[0,0.3,0]},16);for(const s of [-1,1])b.cyl(0.06,0.06,1.8,MAT.wood,{p:[s*0.95,0.9,0]});b.cyl(0.05,0.05,2.0,MAT.wood,{p:[0,1.75,0],r:[0,0,Math.PI/2]});
  b.lathe([[0,0],[0.2,0],[0.24,0.3],[0,0.3]],MAT.wood,{p:[0,1.0,0]});return b;};
B.stall=(v)=>{const r=rng(51+v);const b=new Builder();for(const sx of [-1,1])for(const sz of [-1,1])b.cyl(0.05,0.05,2.1,MAT.bamboo,{p:[sx*1.1,1.05,sz*0.75]});
  roof(b,2.2,1.5,0.7,r()<.5?MAT.thatch:MAT.cloth,{y:2.0,over:0.35,sag:0.1,horn:false});b.box(2.0,0.08,1.2,MAT.wood,{p:[0,0.8,0]});b.box(0.1,0.8,1.0,MAT.wood,{p:[-0.9,0.4,0]});b.box(0.1,0.8,1.0,MAT.wood,{p:[0.9,0.4,0]});
  const cols=[0xf2b25a,0x7ac24a,0xd8352b,0xe8d080,0xffffff];for(let i=0;i<4;i++){const x=-0.65+i*0.43;b.lathe([[0,0],[0.18,0],[0.2,0.12],[0,0.12]],MAT.straw,{p:[x,0.85,0]});
    const fm=new THREE.MeshLambertMaterial({color:cols[(r()*cols.length)|0]});for(let k=0;k<4;k++)b.sph(0.06,fm,{p:[x+(r()-.5)*0.18,0.98+r()*0.05,(r()-.5)*0.18]},0);}return b;};
B.lantern=()=>{const b=new Builder();b.cyl(0.04,0.05,2.4,MAT.wood,{p:[0,1.2,0]});b.box(0.5,0.04,0.04,MAT.wood,{p:[0.2,2.3,0]});b.sph(0.2,MAT.lantern,{p:[0.42,1.95,0],s:[1,1.25,1]});b.cyl(0.1,0.1,0.05,MAT.gold,{p:[0.42,2.2,0]});b.cyl(0.1,0.1,0.05,MAT.gold,{p:[0.42,1.7,0]});return b;};
B.stove=()=>{const b=new Builder();b.box(1.0,0.5,0.8,MAT.clay,{p:[0,0.25,0]});b.lathe([[0,0],[0.35,0],[0.4,0.25],[0.3,0.35],[0,0.35]],MAT.black,{p:[0,0.5,0]});b.cone(0.18,0.35,MAT.fire,{p:[0,0.25,0.42]});return b;};
B.hay=(v)=>{const b=new Builder();const h=1.9+v*0.3;b.lathe([[0,0],[0.95,0],[1.0,0.4],[0.9,h*0.6],[0.55,h*0.9],[0.1,h],[0,h]],MAT.straw,{uv:0.8},12);b.cyl(0.04,0.04,0.7,MAT.wood,{p:[0,h+0.3,0]});return b;};
B.chum=()=>{const b=new Builder();b.lathe([[0,0],[0.25,0],[0.38,0.25],[0.36,0.55],[0.22,0.72],[0.24,0.8],[0,0.8]],MAT.darkClay,{},12);return b;};
B.fence=()=>{const b=new Builder();for(let i=0;i<3;i++)b.cyl(0.04,0.04,1.2,MAT.bamboo,{p:[-0.4+i*0.4,0.6,0]});for(const y of [0.35,0.85])b.cyl(0.03,0.03,1.1,MAT.bamboo,{p:[0,y,0],r:[0,0,Math.PI/2]});return b;};
B.bunhin=()=>{const b=new Builder();b.cyl(0.04,0.04,2.0,MAT.wood,{p:[0,1.0,0]});b.cyl(0.03,0.03,1.4,MAT.wood,{p:[0,1.45,0],r:[0,0,Math.PI/2]});b.cyl(0.2,0.25,0.8,MAT.cloth,{p:[0,1.25,0]});
  b.sph(0.16,MAT.straw,{p:[0,1.8,0]});b.cone(0.38,0.28,MAT.hatLeaf,{p:[0,2.0,0]},12);for(const s of [-1,1])b.cone(0.08,0.3,MAT.straw,{p:[s*0.72,1.45,0],r:[0,0,s*Math.PI/2]});return b;};
B.leu=()=>{const b=new Builder();for(const sx of [-1,1])for(const sz of [-1,1])b.cyl(0.05,0.06,1.8,MAT.bamboo,{p:[sx*0.8,0.9,sz*0.8]});b.box(1.8,0.1,1.8,MAT.wood,{p:[0,1.2,0]});
  roof(b,1.4,1.4,1.0,MAT.thatch,{y:2.0,over:0.4,sag:0.1,horn:false});for(let i=0;i<5;i++)b.box(0.5,0.04,0.06,MAT.bamboo,{p:[0,0.25+i*0.22,1.0]});return b;};
B.board2=B.board;
B.campfire=()=>{const b=new Builder();for(let i=0;i<6;i++){const a=i/6*Math.PI*2;b.cyl(0.05,0.05,0.8,MAT.wood,{p:[Math.cos(a)*0.2,0.15,Math.sin(a)*0.2],r:[Math.sin(a)*1.2,0,-Math.cos(a)*1.2]});}
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2;b.sph(0.12,MAT.stone,{p:[Math.cos(a)*0.5,0.06,Math.sin(a)*0.5]},0);}b.cone(0.25,0.6,MAT.fire,{p:[0,0.35,0]});return b;};
B.net=()=>{const b=new Builder();for(const s of [-1,1])b.cyl(0.04,0.04,2.0,MAT.bamboo,{p:[s*1.2,1.0,0]});b.cyl(0.02,0.02,2.4,MAT.bamboo,{p:[0,1.95,0],r:[0,0,Math.PI/2]});
  b.add(new THREE.PlaneGeometry(2.3,1.5,10,6),MAT.net,{p:[0,1.2,0]});return b;};
B.bia=()=>{const b=new Builder();b.box(0.9,0.3,0.6,MAT.stone,{p:[0,0.15,0]});b.box(0.7,1.5,0.18,MAT.stone,{p:[0,1.05,0]});b.cyl(0.35,0.35,0.18,MAT.stone,{p:[0,1.8,0],r:[Math.PI/2,0,0]},12);return b;};
B.statue=()=>{const b=new Builder();b.box(0.8,0.5,0.8,MAT.stone,{p:[0,0.25,0]});b.cyl(0.25,0.32,1.1,MAT.stone,{p:[0,1.05,0]});b.sph(0.2,MAT.stone,{p:[0,1.75,0]});return b;};
B.sampan=()=>{const b=new Builder();b.add(new THREE.CylinderGeometry(0.55,0.55,3.6,10,1,true,Math.PI/2,Math.PI),MAT.wood,{p:[0,0.4,0],r:[0,0,Math.PI/2],s:[1,1,0.6]});
  for(const s of [-1,1])b.cone(0.33,0.8,MAT.wood,{p:[s*2.15,0.4,0],r:[0,0,-s*Math.PI/2],s:[1,1,0.6]});b.add(new THREE.CylinderGeometry(0.55,0.55,1.4,10,1,true,-Math.PI/2,Math.PI),MAT.thatch,{p:[0.2,0.6,0],r:[0,0,Math.PI/2],s:[1,1,1]});return b;};
B.boatsmall=B.sampan;
B.tent=()=>{const b=new Builder();b.cone(1.6,2.2,MAT.cloth,{p:[0,1.1,0]},6);b.cyl(0.05,0.05,2.6,MAT.wood,{p:[0,1.3,0]});b.box(0.6,1.0,0.1,MAT.black,{p:[0,0.5,1.25]});return b;};
B.barrel=()=>{const b=new Builder();b.lathe([[0,0],[0.3,0],[0.36,0.4],[0.3,0.8],[0,0.8]],MAT.wood,{},12);b.add(new THREE.TorusGeometry(0.34,0.025,4,12),MAT.iron,{p:[0,0.2,0],r:[Math.PI/2,0,0]});b.add(new THREE.TorusGeometry(0.34,0.025,4,12),MAT.iron,{p:[0,0.6,0],r:[Math.PI/2,0,0]});return b;};
B.crate=()=>{const b=new Builder();b.box(0.8,0.8,0.8,MAT.wood,{p:[0,0.4,0]});return b;};
B.rock=(v)=>{const r=rng(61+v);const b=new Builder();for(let i=0;i<3;i++)b.sph(0.4+r()*0.4,MAT.karst,{p:[(r()-.5)*0.8,0.2,(r()-.5)*0.6],s:[1,0.6+r()*0.4,1]},0);return b;};
B.ruins=()=>{const b=new Builder();b.box(0.6,1.8,0.6,MAT.stone,{p:[-0.8,0.9,0]});b.box(0.6,0.9,0.6,MAT.stone,{p:[0.6,0.45,0.2]});b.box(1.5,0.3,0.6,MAT.stone,{p:[0.2,0.15,-0.6],r:[0,0.4,0]});return b;};
// ---------- cây ----------
B.banyan=(v)=>{const r=rng(71+v);const b=new Builder();b.cyl(0.55,0.95,4.2,MAT.bark,{p:[0,2.1,0]},10);for(let i=0;i<5;i++){const a=r()*6.28;b.cyl(0.18,0.35,3.2,MAT.bark,{p:[Math.cos(a)*1.0,3.8,Math.sin(a)*1.0],r:[Math.sin(a)*0.8,0,-Math.cos(a)*0.8]});}
  for(let i=0;i<14;i++){const a=r()*6.28,d=1.5+r()*2.4;b.cyl(0.03,0.04,2.5+r()*1.5,MAT.bark,{p:[Math.cos(a)*d,1.6,Math.sin(a)*d]},4);}
  const mats=[MAT.leaf,MAT.leafDark,MAT.leafLight];for(let i=0;i<16;i++){const a=r()*6.28,d=r()*3.2;b.sph(1.4+r()*1.0,mats[(r()*3)|0],{p:[Math.cos(a)*d,5.0+r()*2.2,Math.sin(a)*d*0.85],s:[1.2,0.75,1.1]},1);}return b;};
B.bamboo=(v)=>{const r=rng(81+v);const b=new Builder();const n=7+((r()*5)|0);for(let i=0;i<n;i++){const a=r()*6.28,d=r()*0.5,h=6+r()*4,tilt=0.05+r()*0.18;const x=Math.cos(a)*d,z=Math.sin(a)*d;
    b.cyl(0.05,0.07,h,MAT.bamboo,{p:[x+Math.cos(a)*Math.sin(tilt)*h/2,h/2*Math.cos(tilt),z+Math.sin(a)*Math.sin(tilt)*h/2],r:[Math.sin(a)*tilt,0,-Math.cos(a)*tilt],uv:1.6},6);
    for(let k=0;k<5;k++){const t=0.45+k*0.12;const lx=x+Math.cos(a)*Math.sin(tilt)*h*t,ly=h*t*Math.cos(tilt),lz=z+Math.sin(a)*Math.sin(tilt)*h*t;const la=r()*6.28;
      b.cone(0.45,1.3,k%2?MAT.bambooLeaf:MAT.leafDark,{p:[lx+Math.cos(la)*0.45,ly,lz+Math.sin(la)*0.45],r:[Math.sin(la)*1.9,0,-Math.cos(la)*1.9],s:[1,1,0.25]},4);}}return b;};
B.areca=(v)=>{const r=rng(91+v);const b=new Builder();const h=6.5+r()*1.5;b.cyl(0.08,0.12,h,MAT.bamboo,{p:[0,h/2,0],uv:0.6},6);
  for(let i=0;i<9;i++){const a=i/9*6.28+r()*0.3;b.add(new THREE.BoxGeometry(0.35,0.02,2.2),MAT.palmLeaf,{p:[Math.cos(a)*1.0,h-0.25,Math.sin(a)*1.0],r:[0.55,-a+Math.PI/2,0],order:'YXZ'});}for(let i=0;i<6;i++)b.sph(0.07,MAT.gold,{p:[0.15*Math.cos(i),h-0.5,0.15*Math.sin(i)]},0);return b;};
B.palm=(v)=>{const b=B.areca(v);return b;};
B.banana=(v)=>{const r=rng(101+v);const b=new Builder();b.cyl(0.12,0.17,1.8,MAT.bananaLeaf,{p:[0,0.9,0]},7);for(let i=0;i<7;i++){const a=i/7*6.28+r();b.box(0.55,0.02,1.9,MAT.bananaLeaf,{p:[Math.cos(a)*0.8,2.0+r()*0.3,Math.sin(a)*0.8],r:[-0.45,-a+Math.PI/2,0],order:'YXZ'});}return b;};
B.caygao=(v)=>{const r=rng(111+v);const b=new Builder();b.cyl(0.25,0.45,7,MAT.bark,{p:[0,3.5,0]},8);for(let i=0;i<5;i++){const a=r()*6.28,y=4+r()*3;b.cyl(0.06,0.12,2.6,MAT.bark,{p:[Math.cos(a)*1.0,y,Math.sin(a)*1.0],r:[Math.sin(a)*1.1,0,-Math.cos(a)*1.1]},5);}
  for(let i=0;i<40;i++){const a=r()*6.28,d=r()*2.6;b.sph(0.22+r()*0.15,r()<.8?MAT.red:MAT.leaf,{p:[Math.cos(a)*d,5+r()*3.2,Math.sin(a)*d]},0);}return b;};
B.xoan=(v)=>{const r=rng(121+v);const b=new Builder();b.cyl(0.14,0.24,3.2,MAT.bark,{p:[0,1.6,0]},7);const mats=[MAT.leaf,MAT.leafDark,MAT.leafLight];for(let i=0;i<7;i++){const a=r()*6.28,d=r()*1.2;b.sph(0.9+r()*0.6,mats[(r()*3)|0],{p:[Math.cos(a)*d,3.6+r()*1.4,Math.sin(a)*d],s:[1,0.8,1]},1);}
  for(let i=0;i<14;i++)b.sph(0.1,MAT.lilac,{p:[(r()-.5)*2.6,3.4+r()*2,(r()-.5)*2.6]},0);return b;};
B.philao=(v)=>{const r=rng(131+v);const b=new Builder();b.cyl(0.08,0.14,3,MAT.bark,{p:[0,1.5,0]},6);for(let i=0;i<4;i++)b.cone(1.1-i*0.22,1.8,MAT.leafDark,{p:[0,2.4+i*1.0,0]},7);return b;};
B.duoc=(v)=>{const r=rng(141+v);const b=new Builder();for(let i=0;i<7;i++){const a=r()*6.28;b.cyl(0.03,0.05,1.0,MAT.bark,{p:[Math.cos(a)*0.5,0.2,Math.sin(a)*0.5],r:[Math.sin(a)*0.6,0,-Math.cos(a)*0.6]},4);}for(let i=0;i<5;i++)b.sph(0.7+r()*0.4,MAT.leafDark,{p:[(r()-.5)*1.2,1.2+r()*0.5,(r()-.5)*1.2],s:[1,0.7,1]},1);return b;};
B.reeds=(v)=>{const r=rng(151+v);const b=new Builder();for(let i=0;i<9;i++){const x=(r()-.5)*0.9,z=(r()-.5)*0.9,h=1.0+r()*0.8;b.cone(0.03,h,MAT.reed,{p:[x,h/2,z],r:[(r()-.5)*0.3,0,(r()-.5)*0.3]},3);b.cone(0.07,0.3,MAT.reedTop,{p:[x,h+0.05,z]},4);}return b;};
B.karst=(v)=>{const r=rng(161+v);const b=new Builder();const h=7+r()*5;for(let i=0;i<4;i++)b.sph(1.4+r()*0.8,MAT.karst,{p:[(r()-.5)*1.6,h*(i/4)+1.2,(r()-.5)*1.6],s:[1,1.8,1]},0);for(let i=0;i<10;i++)b.sph(0.6,MAT.karstGreen,{p:[(r()-.5)*2.4,r()*h,(r()-.5)*2.4],s:[1,0.5,1]},0);return b;};
B.karst2=(v)=>{const b=B.karst(v+5);return b;};
// ---------- Thăng Long / Vân Đồn ----------
B.dien=()=>{const b=new Builder();const w=12,d=6;b.box(w+2,1.0,d+2.4,MAT.stone,{p:[0,0.5,0]});for(let i=0;i<5;i++)b.box(4-i*0.3,0.2,0.4,MAT.stone,{p:[0,0.1+i*0.2,d/2+1.2+(4-i)*0.35]});
  b.box(w,3.2,d,MAT.lacquer,{p:[0,2.6,0],uv:false});b.box(w-1,2.6,0.1,MAT.door,{p:[0,2.4,d/2+0.02],uv:false});for(let i=0;i<8;i++)b.cyl(0.2,0.22,3.3,MAT.lacquer,{p:[-w/2+0.4+i*(w-0.8)/7,2.65,d/2+0.5]},10);
  roof(b,w,d,2.2,MAT.roofGold,{y:4.2,over:1.4,curl:0.9,sag:0.6,ridgeMat:MAT.gold});b.box(w*0.6,1.2,d*0.6,MAT.lacquer,{p:[0,6.8,0],uv:false});roof(b,w*0.6,d*0.6,1.8,MAT.roofGold,{y:7.3,over:1.0,curl:0.7,sag:0.6,ridgeMat:MAT.gold});return b;};
B.congthanh=()=>{const b=new Builder();for(const s of [-1,1])b.box(3.2,4.4,3.0,MAT.brick,{p:[s*2.8,2.2,0]});b.box(8.8,1.4,3.0,MAT.brick,{p:[0,5.1,0]});b.box(9.4,0.3,3.4,MAT.stone,{p:[0,5.95,0]});
  b.box(5,1.6,2,MAT.lacquer,{p:[0,6.9,0],uv:false});roof(b,5,2,1.4,MAT.roof,{y:7.7,over:0.9,curl:0.6,sag:0.5});b.box(2,0.5,0.06,MAT.plaque,{p:[0,4.9,1.52],uv:false});return b;};
B.vanmieu=()=>{const b=new Builder();for(const sx of [-1,1])for(const sz of [-1,1])b.box(0.9,3.4,0.9,MAT.white,{p:[sx*1.6,1.7,sz*1.6]});b.box(4.2,0.3,4.2,MAT.stone,{p:[0,3.55,0]});
  b.box(3,2.0,3,MAT.lacquer,{p:[0,4.7,0],uv:false});for(const s of [-1,1])b.cyl(0.6,0.6,0.06,MAT.gold,{p:[s*1.51,4.7,0],r:[0,0,Math.PI/2]},14);roof(b,3,3,1.2,MAT.roof,{y:5.7,over:0.8,curl:0.55,sag:0.5});
  roof(b,4.2,4.2,0.6,MAT.roof,{y:3.6,over:0.4,curl:0.4,sag:0.3,horn:false});b.sph(0.15,MAT.gold,{p:[0,7.0,0]});return b;};
B.pagoda=()=>{const b=new Builder();b.cyl(0.55,0.6,2.6,MAT.stone,{p:[0,1.3,0]},10);b.box(2.6,0.25,2.6,MAT.wood,{p:[0,2.7,0]});b.box(2.2,1.6,2.2,MAT.lacquer,{p:[0,3.6,0],uv:false});roof(b,2.2,2.2,1.2,MAT.roof,{y:4.4,over:0.6,curl:0.55,sag:0.5});b.sph(0.12,MAT.gold,{p:[0,5.7,0]});return b;};
B.thapbaothien=()=>{const b=new Builder();b.box(4.6,0.8,4.6,MAT.stone,{p:[0,0.4,0]});let y=0.8;for(let i=0;i<12;i++){const w=3.4-i*0.22,h=1.25-i*0.04;b.box(w,h,w,MAT.white,{p:[0,y+h/2,0]});b.box(0.5,h*0.6,0.05,MAT.black,{p:[0,y+h*0.45,w/2+0.01]});
    roof(b,w,w,0.35,MAT.roof,{y:y+h,over:0.35,curl:0.25,sag:0.2,horn:false,nu:8,nv:3});y+=h+0.35;}b.cyl(0.05,0.12,1.6,MAT.gold,{p:[0,y+0.8,0]});return b;};
// cổ thụ rừng hoang: thân lớn, rễ bạnh, tán tầng tối, dây leo
B.cothu=(v)=>{const r=rng(171+v);const b=new Builder();const h=4.6+r()*2;b.cyl(0.32,0.7,h,MAT.bark,{p:[0,h/2,0]},9);
  for(let i=0;i<5;i++){const a=i/5*6.28+r();b.box(0.12,1.2,1.1,MAT.bark,{p:[Math.cos(a)*0.55,0.55,Math.sin(a)*0.55],r:[0,-a,0]});}
  for(let i=0;i<4;i++){const a=r()*6.28;b.cyl(0.08,0.2,2.6,MAT.bark,{p:[Math.cos(a)*0.9,h-0.6,Math.sin(a)*0.9],r:[Math.sin(a)*0.9,0,-Math.cos(a)*0.9]},5);}
  for(let i=0;i<9;i++){const a=r()*6.28,d=0.6+r()*1.8;b.cyl(0.02,0.02,2.2+r()*2,MAT.leafDark,{p:[Math.cos(a)*d,h-1.6,Math.sin(a)*d]},3);}
  const mats=[MAT.leafDark,MAT.leafDark,MAT.leaf];for(let i=0;i<10;i++){const a=r()*6.28,d=r()*2.0;b.sph(1.1+r()*0.7,mats[(r()*3)|0],{p:[Math.cos(a)*d,h+0.2+r()*1.4,Math.sin(a)*d],s:[1.2,0.6,1.1]},1);}return b;};
// bụi rậm, dương xỉ
B.bui=(v)=>{const r=rng(181+v);const b=new Builder();for(let i=0;i<5;i++){const a=r()*6.28,d=r()*0.5;b.sph(0.45+r()*0.35,i%2?MAT.leafDark:MAT.leaf,{p:[Math.cos(a)*d,0.35+r()*0.3,Math.sin(a)*d],s:[1.2,0.8,1.2]},1);}
  for(let i=0;i<6;i++){const a=i/6*6.28;b.cone(0.18,1.2,MAT.leafDark,{p:[Math.cos(a)*0.55,0.5,Math.sin(a)*0.55],r:[Math.sin(a)*1.1,0,-Math.cos(a)*1.1],s:[1,1,0.25]},3);}return b;};
B.cotco=()=>{const b=new Builder();b.box(1.2,0.6,1.2,MAT.stone,{p:[0,0.3,0]});b.cyl(0.07,0.09,7,MAT.wood,{p:[0,3.8,0]});b.add(new THREE.PlaneGeometry(2.0,1.3),MAT.flag,{p:[1.05,6.5,0]});return b;};
B.kho=()=>{const b=new Builder();const w=6,d=3.4;b.box(w,2.4,d,MAT.wood,{p:[0,1.2,0]});b.box(1.6,2.0,0.06,MAT.black,{p:[0,1.0,d/2+0.02]});roof(b,w,d,1.5,MAT.thatch,{y:2.4,over:0.6,sag:0.2,horn:false});return b;};
function junk(scale,sails){const b=new Builder();b.add(new THREE.CylinderGeometry(1,1,6,12,1,true,Math.PI/2,Math.PI),MAT.wood,{p:[0,0.9,0],r:[0,0,Math.PI/2],s:[1,1,0.75]});for(const s of [-1,1])b.cone(0.75,1.6,MAT.wood,{p:[s*3.6,1.0,0],r:[0,0,-s*Math.PI/2],s:[1,1,0.75]});
  b.box(5.4,0.15,1.4,MAT.wood,{p:[0,1.0,0]});b.box(1.6,1.0,1.3,MAT.wood,{p:[-2.2,1.5,0]});for(let i=0;i<sails;i++){const x=1.4-i*1.8,h=5-i*0.8;b.cyl(0.06,0.08,h,MAT.wood,{p:[x,1+h/2,0]});b.box(0.04,h*0.75,2.2,MAT.cloth,{p:[x+0.1,1+h*0.55,0],uv:false});}
  const out=new Builder();out.merge(b,{s:scale});return out;}
B.junk=()=>junk(1.2,2);B.sailboat=()=>junk(0.9,1);B.bigship=()=>junk(1.7,3);
B.gate=B.conglang;B.portal=B.conglang;B.chest=()=>{const b=new Builder();b.box(0.8,0.5,0.55,MAT.wood,{p:[0,0.25,0]});b.box(0.82,0.1,0.57,MAT.gold,{p:[0,0.5,0]});return b;};
B.rock_=B.rock;
export const VARIANTS={cothu:4,bui:3,hut:4,house:4,stall:3,hay:2,banyan:2,bamboo:5,areca:3,palm:2,banana:2,caygao:2,xoan:3,philao:2,duoc:2,reeds:3,karst:4,karst2:2,rock:3};
export function buildProto(type,v){const f=B[type];if(!f)return null;return f(v||0);}
// ---------- bụi lúa, cỏ, sen (instanced) ----------
export function tuftGeo(h,w,blades){const pos=[],nor=[];const n=blades*3;for(let i=0;i<n;i++){const a=i/n*Math.PI*2+Math.sin(i*7.1)*0.6,r=w*0.25*((i*37%10)/10),hh=h*(0.6+((i*53)%10)/22),lean=0.18+((i*29)%10)/40;
  const bx=Math.cos(a)*r,bz=Math.sin(a)*r,px=-Math.sin(a)*w*0.09,pz=Math.cos(a)*w*0.09,tx=bx+Math.cos(a)*hh*lean,tz=bz+Math.sin(a)*hh*lean;
  pos.push(bx-px,0,bz-pz, bx+px,0,bz+pz, tx,hh,tz);for(let k=0;k<3;k++)nor.push(Math.cos(a)*0.3,1,Math.sin(a)*0.3);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));return g;}
export function lotusPadGeo(){return new THREE.CircleGeometry(0.32,9).rotateX(-Math.PI/2);}
export function lotusFlowerGeo(){const b=new Builder();for(let i=0;i<6;i++){const a=i/6*Math.PI*2;b.add(new THREE.SphereGeometry(0.12,5,4,0,Math.PI*2,0,Math.PI/2),MAT.lotusFlower,{p:[Math.cos(a)*0.06,0.12,Math.sin(a)*0.06],r:[Math.sin(a)*0.5,0,-Math.cos(a)*0.5],s:[0.6,1.4,0.6]});}
  b.cyl(0.015,0.015,0.3,MAT.lotusPad,{p:[0,-0.05,0]},3);return mergeGeometries(b.parts.map(p=>p.g));}
