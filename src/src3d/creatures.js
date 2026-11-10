// Thú dựng bằng khối có khớp, cử động bằng code: trâu, gà, vịt, cò, thuyền có người chèo
import * as THREE from 'three';
const L=(c,o={})=>new THREE.MeshLambertMaterial(Object.assign({color:c},o));
const M={};
function mats(){if(M.buf)return;Object.assign(M,{buf:L(0x3c3c44),bufD:L(0x2a2a30),horn:L(0xd8d0b8),eye:L(0x111111),chick:L(0xb8642a),chickL:L(0xe0a050),comb:L(0xd8352b),beak:L(0xe0a030),tailG:L(0x2a6a3a),
  duck:L(0xf2efe6),egret:L(0xf8f8f2),leg:L(0x2a2a2a),boat:L(0x6b4423),boatD:L(0x4a2e18),mui:L(0xc8a35a,{side:THREE.DoubleSide}),shirt:L(0x5a3a2a),skin:L(0xe0b088),hat:L(0xe2d4a0,{side:THREE.DoubleSide}),oar:L(0x8a6a3a)});}
function mesh(g,m,p,r,s){const o=new THREE.Mesh(g,m);if(p)o.position.set(...p);if(r)o.rotation.set(...r);if(s)o.scale.set(...s);o.castShadow=true;return o;}
function pivot(parent,p){const g=new THREE.Group();g.position.set(...p);parent.add(g);return g;}
export function makeBuffalo(){mats();const root=new THREE.Group();const body=pivot(root,[0,1.05,0]);
  body.add(mesh(new THREE.CapsuleGeometry(0.48,1.1,4,10),M.buf,[0,0,0],[Math.PI/2,0,0]));body.add(mesh(new THREE.SphereGeometry(0.5,10,8),M.buf,[0,0.12,-0.45],null,[1,0.95,1]));
  const neck=pivot(body,[0,0.15,0.85]);neck.add(mesh(new THREE.CylinderGeometry(0.28,0.36,0.5,8),M.buf,[0,0,0.15],[1.2,0,0]));
  const head=pivot(neck,[0,-0.05,0.45]);head.add(mesh(new THREE.BoxGeometry(0.42,0.4,0.62),M.buf,[0,-0.05,0.18]));head.add(mesh(new THREE.BoxGeometry(0.34,0.24,0.2),M.bufD,[0,-0.14,0.5]));
  for(const s of [-1,1]){const h=mesh(new THREE.TorusGeometry(0.42,0.06,5,10,Math.PI*0.95),M.horn,[s*0.3,0.18,0.0],[0,Math.PI/2,s>0?0.4:Math.PI-0.4]);head.add(h);head.add(mesh(new THREE.SphereGeometry(0.04,5,4),M.eye,[s*0.2,0.05,0.3]));head.add(mesh(new THREE.BoxGeometry(0.16,0.06,0.1),M.buf,[s*0.27,0.05,0.05]));}
  const legs=[];[[-0.28,0.55],[0.28,0.55],[-0.28,-0.55],[0.28,-0.55]].forEach(([x,z])=>{const p=pivot(body,[x,-0.25,z]);p.add(mesh(new THREE.CylinderGeometry(0.11,0.09,0.85,6),M.buf,[0,-0.42,0]));p.add(mesh(new THREE.CylinderGeometry(0.1,0.1,0.08,6),M.bufD,[0,-0.84,0]));legs.push(p);});
  const tail=pivot(body,[0,0.25,-1.0]);tail.add(mesh(new THREE.CylinderGeometry(0.03,0.02,0.7,4),M.bufD,[0,-0.35,0]));
  let ph=Math.random()*6;return {root,h:1.7,update(dt,mv,t){ph+=dt*(mv?5:0);const s=mv?0.5:0;legs.forEach((l,i)=>l.rotation.x=Math.sin(ph+(i===0||i===3?0:Math.PI))*s);
    tail.rotation.x=0.3+Math.sin(t*2+ph)*0.25;tail.rotation.z=Math.sin(t*1.3)*0.3;neck.rotation.x=mv?0.05:0.55+Math.sin(t*0.7)*0.15;body.position.y=1.05+(mv?Math.abs(Math.sin(ph))*0.03:0);}};}
export function makeChicken(){mats();const root=new THREE.Group();const body=pivot(root,[0,0.32,0]);body.add(mesh(new THREE.SphereGeometry(0.17,8,6),M.chick,null,null,[1,0.95,1.25]));
  const head=pivot(body,[0,0.16,0.14]);head.add(mesh(new THREE.SphereGeometry(0.09,7,5),M.chickL));head.add(mesh(new THREE.ConeGeometry(0.03,0.08,4),M.beak,[0,-0.01,0.1],[Math.PI/2,0,0]));head.add(mesh(new THREE.BoxGeometry(0.02,0.07,0.1),M.comb,[0,0.09,0.01]));
  body.add(mesh(new THREE.ConeGeometry(0.1,0.28,5),M.tailG,[0,0.12,-0.22],[-0.9,0,0]));const legs=[];for(const s of [-1,1]){const p=pivot(body,[s*0.06,-0.12,0]);p.add(mesh(new THREE.CylinderGeometry(0.012,0.012,0.18,3),M.beak,[0,-0.09,0]));legs.push(p);}
  let ph=Math.random()*6,peck=0;return {root,h:0.6,update(dt,mv,t){ph+=dt*(mv?14:0);legs.forEach((l,i)=>l.rotation.x=mv?Math.sin(ph+i*Math.PI)*0.6:0);peck-=dt;if(!mv&&peck<-1.5&&Math.random()<0.02)peck=0.4;head.rotation.x=peck>0?0.9:Math.sin(t*3)*0.1;}};}
export function makeDuck(){mats();const root=new THREE.Group();const body=pivot(root,[0,0.08,0]);body.add(mesh(new THREE.SphereGeometry(0.17,8,6),M.duck,null,null,[0.95,0.75,1.35]));
  const head=pivot(body,[0,0.17,0.17]);head.add(mesh(new THREE.SphereGeometry(0.085,7,5),M.duck));head.add(mesh(new THREE.BoxGeometry(0.06,0.025,0.1),M.beak,[0,-0.02,0.1]));body.add(mesh(new THREE.ConeGeometry(0.06,0.14,4),M.duck,[0,0.08,-0.24],[-1.2,0,0]));
  return {root,h:0.4,water:true,update(dt,mv,t){body.position.y=0.08+Math.sin(t*2.2+root.id)*0.02;head.rotation.x=Math.sin(t*1.5+root.id)*0.2;}};}
export function makeEgret(){mats();const root=new THREE.Group();const body=pivot(root,[0,0.75,0]);body.add(mesh(new THREE.SphereGeometry(0.13,8,6),M.egret,null,null,[0.8,0.8,1.8]));
  const neck=pivot(body,[0,0.08,0.18]);neck.add(mesh(new THREE.CylinderGeometry(0.03,0.04,0.42,5),M.egret,[0,0.2,0.04],[0.25,0,0]));const head=pivot(neck,[0,0.42,0.1]);head.add(mesh(new THREE.SphereGeometry(0.05,6,5),M.egret));head.add(mesh(new THREE.ConeGeometry(0.015,0.2,4),M.beak,[0,0,0.12],[Math.PI/2,0,0]));
  const wings=[];for(const s of [-1,1]){const w=pivot(body,[s*0.08,0.05,0]);w.add(mesh(new THREE.BoxGeometry(0.5,0.02,0.3),M.egret,[s*0.25,0,0]));w.visible=false;wings.push(w);}
  const legs=[];for(const s of [-1,1]){const p=pivot(body,[s*0.04,-0.08,0]);p.add(mesh(new THREE.CylinderGeometry(0.012,0.012,0.65,3),M.leg,[0,-0.32,0]));legs.push(p);}
  let ph=0;return {root,h:1.1,update(dt,mv,t,e){const fly=e&&e.fly;wings.forEach((w,i)=>{w.visible=!!fly;w.rotation.z=fly?Math.sin(t*12)*0.7*(i?1:-1):0;});legs.forEach(l=>l.visible=!fly);
    body.position.y=fly?2.2:0.75;if(!fly){ph+=dt;neck.rotation.x=Math.sin(ph*0.8)>0.85?0.9:0;legs[1].rotation.x=0;legs[0].rotation.x=Math.sin(t*0.3)>0.6?-0.9:0;}}};}
export function makeSampan(){mats();const root=new THREE.Group();const hull=new THREE.Group();root.add(hull);
  hull.add(mesh(new THREE.CylinderGeometry(0.55,0.55,3.4,10,1,true,Math.PI/2,Math.PI),M.boat,[0,0.35,0],[0,Math.PI/2,Math.PI/2],[1,1,0.55]));
  for(const s of [-1,1])hull.add(mesh(new THREE.ConeGeometry(0.33,0.8,8),M.boat,[0,0.35,s*2.05],[s*Math.PI/2,0,0],[1,1,0.55]));
  hull.add(mesh(new THREE.CylinderGeometry(0.5,0.5,1.2,10,1,true,-Math.PI/2,Math.PI),M.mui,[0,0.5,0.3],[0,Math.PI/2,Math.PI/2]));
  const man=pivot(hull,[0,0.35,-1.2]);man.add(mesh(new THREE.CylinderGeometry(0.13,0.16,0.6,6),M.shirt,[0,0.35,0]));man.add(mesh(new THREE.SphereGeometry(0.1,6,5),M.skin,[0,0.75,0]));man.add(mesh(new THREE.ConeGeometry(0.28,0.18,10),M.hat,[0,0.88,0]));
  const oar=pivot(man,[0.15,0.45,0]);oar.add(mesh(new THREE.CylinderGeometry(0.02,0.02,2.0,4),M.oar,[0,-0.6,0.2],[0.4,0,0]));
  return {root,h:1.4,water:true,update(dt,mv,t){hull.position.y=Math.sin(t*1.4+root.id)*0.05;hull.rotation.z=Math.sin(t*1.1+root.id)*0.04;oar.rotation.x=Math.sin(t*2)*0.5;}};}
export const CREATURES={trau:makeBuffalo,ga:makeChicken,vit:makeDuck,co:makeEgret,sampan:makeSampan};
