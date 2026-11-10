// ===== SINH VẬT, CHỈ ĐƯỜNG NHIỆM VỤ, TỰ ĐI =====
(function(){
const T=G.T, rnd=Math.random;
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
G.amb=[];
const GREET=[['你好！','Xin chào!'],['你吃饭了吗？','Ăn cơm chưa?'],['今天天气很好。','Hôm nay trời đẹp.'],['掌门好！','Chào chưởng môn!'],['你的狗很漂亮！','Chó của ngài đẹp quá!'],['再见！','Tạm biệt!'],['谢谢！','Cảm ơn!'],['我去买菜。','Tôi đi chợ.'],['我很忙。','Tôi bận lắm.']];
function pickTile(m,a){for(let k=0;k<60;k++){const tx=a.x0+((rnd()*(a.x1-a.x0+1))|0),ty=a.y0+((rnd()*(a.y1-a.y0+1))|0);const t=m.get(tx,ty);
  if(a.water){if(G.WATERY[t]&&!m.solid[ty*m.w+tx])return {x:tx*T+T/2,y:ty*T+T/2};continue;}
  if(m.solid[ty*m.w+tx]||G.WATERY[t])continue;if(a.tiles&&!a.tiles.includes(t))continue;return {x:tx*T+T/2,y:ty*T+T/2};}return null;}
function spawnAmb(){const m=G.map;G.amb=[];(m.ambient||[]).forEach(a=>{for(let i=0;i<a.n;i++){const p=pickTile(m,a);if(!p)continue;
  G.amb.push({k:a.k,a,x:p.x,y:p.y,tx:p.x,ty:p.y,wt:rnd()*3,f:0,face:rnd()<.5?1:-1,col:G.VILLAGER_COLS[(rnd()*G.VILLAGER_COLS.length)|0],style:['fisher','woman','elder','merchant','smith'][(rnd()*5)|0],say:null,sayT:rnd()*20});}});}
const SPEED={trau:10,co:0,vit:9,ga:14,dan:26,linh:0,sampan:16};
function canStand(m,e,x,y){const tx=x/T|0,ty=y/T|0;const t=m.get(tx,ty);if(e.a.water)return G.WATERY[t]&&!m.solid[ty*m.w+tx];if(m.solid[ty*m.w+tx]||G.WATERY[t]||t==='brick'||t==='earthwall'||t==='walltop'||t==='karstbase')return false;if(e.a.tiles&&!e.a.tiles.includes(t))return false;return true;}
function updAmb(dt){const m=G.map,P=G.P;G.amb.forEach(e=>{e.ft=(e.ft||0)+dt;
  if(e.k==='co'){if(e.fly){e.x+=e.vx*dt;e.y+=e.vy*dt;e.fly-=dt;e.f=((e.ft*8)|0)%2;if(e.fly<=0){const p=pickTile(m,e.a);if(p){e.x=p.x;e.y=p.y;}e.fly=0;}return;}
    if(dist(e,P)<55){e.fly=3;const a=Math.atan2(e.y-P.y,e.x-P.x);e.vx=Math.cos(a)*90;e.vy=Math.sin(a)*60-20;e.face=e.vx>0?1:-1;}return;}
  if(e.k==='linh')return;
  e.wt-=dt;if(e.wt<=0){e.wt=(e.k==='dan'?3:4)+rnd()*6;const r=e.k==='dan'?90:e.k==='sampan'?160:50;const nx=e.x+(rnd()-.5)*r*2,ny=e.y+(rnd()-.5)*r*1.4;if(canStand(m,e,nx,ny)){e.tx=nx;e.ty=ny;}}
  const vx=e.tx-e.x,vy=e.ty-e.y,L=Math.hypot(vx,vy);const sp=SPEED[e.k]||10;
  if(L>2){const nx=e.x+vx/L*sp*dt,ny=e.y+vy/L*sp*dt;if(canStand(m,e,nx,ny)){e.x=nx;e.y=ny;}else e.wt=0;e.face=vx>0?1:-1;e.f=((e.ft*(e.k==='dan'?6:3))|0)%2;e.moving=1;}else{e.moving=0;e.f=e.k==='ga'?((e.ft*3)|0)%2:0;}
  if(e.k==='dan'){e.sayT-=dt;if(e.say)e.say.t-=dt;if(e.sayT<=0&&dist(e,P)<70){e.sayT=25+rnd()*30;const g=GREET[(rnd()*GREET.length)|0];e.say={zh:g[0],vi:g[1],t:3.2};}}});
  // chim bay ngang trời, đom đóm, bướm
  birdT-=dt;if(birdT<=0){birdT=18+rnd()*25;const cam=G.cam;if(cam){const y0=cam.y+20+rnd()*cam.vh*.5;const dir=rnd()<.5?1:-1;for(let i=0;i<5;i++)fx.push({k:'bird',x:(dir>0?cam.x-40:cam.x+cam.vw+40)-dir*i*10,y:y0+Math.abs(i-2)*7,vx:dir*45,life:(cam.vw+120)/45,t:0});}}
  const night=G.isNight();const cam=G.cam;if(cam&&fx.filter(f=>f.k==='fly'||f.k==='bf').length<(night?14:4)&&!G.raining()){fx.push({k:night?'fly':'bf',x:cam.x+rnd()*cam.vw,y:cam.y+rnd()*cam.vh,vx:(rnd()-.5)*14,vy:(rnd()-.5)*10,t:0,life:6+rnd()*6,ph:rnd()*6});}
  fx.forEach(f=>{f.t+=dt;f.x+=f.vx*dt;f.y+=(f.vy||0)*dt;if(f.k==='fly'||f.k==='bf'){f.vx+=(rnd()-.5)*20*dt;f.vy+=(rnd()-.5)*20*dt;}});fx=fx.filter(f=>f.t<f.life);}
let birdT=6,fx=[];
function drawAmb(L,inV,ctx){G.amb.forEach(e=>{if(!inV(e.x,e.y,40))return;L.push({y:e.k==='co'&&e.fly?e.y+999:e.y,d:()=>{let im;const fly=e.k==='co'&&e.fly;
  if(e.k==='dan'||e.k==='linh'){im=G.drawPerson(e.k==='linh'?'officer':e.style,e.moving?e.f:0,e.k==='linh'?null:e.col);}else im=G.drawCreature(fly?'cofly':e.k,e.f);
  if(!fly&&e.k!=='vit'&&e.k!=='sampan'){ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(e.x,e.y,im.width*.3,2,0,0,7);ctx.fill();}
  ctx.save();ctx.translate(Math.round(e.x),Math.round(e.y-(fly?18:0)));if(e.face<0)ctx.scale(-1,1);ctx.drawImage(im,-im.width/2,-im.height+(e.k==='vit'||e.k==='sampan'?4:1));ctx.restore();}});});}
function drawWorld(ctx,inV){fx.forEach(f=>{const a=Math.min(1,f.t,(f.life-f.t));if(a<=0)return;ctx.globalAlpha=Math.max(0,a);
  if(f.k==='bird'){ctx.drawImage(G.drawCreature('bird',((f.t*6)|0)%2),Math.round(f.x),Math.round(f.y));}
  else if(f.k==='fly'){const b=.5+.5*Math.sin(f.t*5+f.ph);ctx.globalAlpha=a*b;ctx.fillStyle='#fff8a0';ctx.fillRect(Math.round(f.x),Math.round(f.y),2,2);ctx.globalAlpha=a*b*.3;ctx.beginPath();ctx.arc(f.x+1,f.y+1,4,0,7);ctx.fill();}
  else if(f.k==='bf'){ctx.drawImage(G.drawCreature('butterfly',((f.t*8)|0)%2),Math.round(f.x),Math.round(f.y));}
  ctx.globalAlpha=1;});}

// ---------- MỤC TIÊU NHIỆM VỤ ----------
function npcLoc(id){for(const mid in G.NPCS){const n=G.NPCS[mid].find(x=>x.id===id);if(n)return {map:mid,x:n.x*T+T/2,y:n.y*T+T/2,name:n.vi,npc:id};}return null;}
function mobRegion(id){for(const r in G.MOB_BASE)if(G.MOB_BASE[r].some(b=>b.id===id))return r;return null;}
function route(from,to){if(from===to)return null;const q=[[from]];const seen=new Set([from]);while(q.length){const p=q.shift();const last=p[p.length-1];for(const n of G.mapNeighbors[last]||[]){if(seen.has(n))continue;const np=[...p,n];if(n===to)return np[1];seen.add(n);q.push(np);}}return null;}
function nearest(arr,pt){let b=null,bd=1e9;arr.forEach(a=>{const d=Math.hypot(a.x-pt.x,a.y-pt.y);if(d<bd){bd=d;b=a;}});return b;}
G.questGoal=function(){const S=G.S,q=G.curQuest(),m=G.map,P=G.P;if(!q)return null;
  let g=null;
  if(S.q.st!=='active'){const n=npcLoc(q.npc);g=Object.assign({},n,{kind:'npc',text:S.q.st==='new'?`Gặp <b>${n.name}</b> để nhận: ${q.title}`:`✔ Xong! Về gặp <b>${n.name}</b> nhận thưởng`});}
  else switch(q.type){
    case 'lesson':return {ui:'lesson',n:q.lesson,text:`Mở <b>书房 Học</b> → học <b>Bài ${q.lesson>15?'★':q.lesson}</b>`};
    case 'write':return {ui:'write',text:`Mở <b>书房 Học</b> → Luyện viết · ${S.q.p}/${q.n} chữ`};
    case 'speak':return {ui:'speak',text:`Mở <b>书房 Học</b> → Luyện nói · ${S.q.p}/${q.n} câu`};
    case 'pk':return {text:`Đi dạo ngoài đường, kẻ PK sẽ tự tìm đến · ${S.q.p}/1`};
    case 'kill':{const base=Object.values(G.MOB_BASE).flat().find(b=>b.id===q.mob);const reg=mobRegion(q.mob);const txt=`Diệt <b>${base.vi}</b> ${base.zh} · ${S.q.p}/${q.n}`;
      if(reg!==m.id){g={map:reg,text:txt};break;}const zs=m.zones.filter(z=>z.mobs.includes(q.mob));const z=nearest(zs.map(z=>({x:(z.x0+z.x1)/2*T,y:(z.y0+z.y1)/2*T,z})),P);
      const mob=nearest(G.mobs.filter(x=>x.hp>0&&x.base.id===q.mob),P);if(mob&&dist(mob,P)<260)return {map:m.id,x:mob.x,y:mob.y,kind:'mob',text:txt};
      g={map:m.id,x:z?z.x:P.x,y:z?z.y:P.y,kind:'zone',text:txt};break;}
    case 'boss':{const b=G.BOSSES[q.boss];const txt=`Đánh bại <b>${b.vi}</b> ${b.zh}`;if(q.boss!==m.id){g={map:q.boss,text:txt};break;}g={map:m.id,x:m.boss.x,y:m.boss.y,kind:'boss',text:txt};break;}
    case 'fish':{const s=nearest(m.fishSpots.map(f=>({x:f.x*T+T/2,y:f.y*T+T/2})),P);g={map:m.id,x:s.x,y:s.y,kind:'fish',text:`Đến chỗ nước, bấm <b>Câu cá</b> · ${S.q.p}/${q.n}`};break;}
    case 'cook':{const s=nearest(m.stoves,P);g={map:m.id,x:s.x,y:s.y-4,kind:'cook',text:'Đến bếp lửa, bấm <b>Nấu ăn</b>'};break;}
    case 'enhance':{const n=G.npcs.find(x=>x.role==='enhance');g=n?{map:m.id,x:n.x,y:n.y,kind:'npc',npc:n.id,text:`Gặp <b>${n.vi}</b>, chọn Cường hóa`}:npcLoc(q.npc);break;}
    case 'sail':{if(m.id!=='vandon'){g={map:'vandon',text:'Ra cầu tàu Vân Đồn, bấm <b>Lên thuyền</b>'};break;}const d=nearest(m.docks.map(d=>({x:d.x*T+T/2,y:d.y*T+T/2})),P);g={map:m.id,x:d.x,y:d.y,kind:'dock',text:'Ra cầu tàu, bấm <b>Lên thuyền</b>'};break;}
    case 'talk':default:{const n=npcLoc(q.npc);g=Object.assign({},n,{kind:'npc',text:`Gặp <b>${n.name}</b>`});}
  }
  if(g&&g.map&&g.map!==m.id){const hop=route(m.id,g.map);const p=m.portals.find(x=>x.to===hop);if(p)return {map:m.id,x:p.x*T+T/2,y:p.y*T+T/2,kind:'portal',portal:p,text:g.text+`<br><small>➜ Đi qua cổng <b>${p.vi}</b></small>`};}
  return g;};

// ---------- TỰ ĐI ----------
function freeNear(m,tx,ty,boat){for(let r=0;r<8;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;if(!m.blocked(tx+dx,ty+dy,boat))return [tx+dx,ty+dy];}return null;}
G.autoGo=function(){const g=G.questGoal();if(!g){G.ui.toast('Không có mục tiêu');return;}
  if(g.ui){G.ui.open('study',g.ui==='lesson'?g.n:g.ui);return;}
  if(g.x==null){G.ui.toast(g.text.replace(/<[^>]+>/g,''));return;}
  const m=G.map,P=G.P;const boat=!!P.boat;const s=[P.x/T|0,P.y/T|0];const e=freeNear(m,g.x/T|0,g.y/T|0,boat)||freeNear(m,g.x/T|0,g.y/T|0,!boat);
  let path=e&&G.findPath(m,s[0],s[1],e[0],e[1],boat);
  if(!path&&!boat&&m.docks.length){const d=nearest(m.docks.map(d=>({x:d.x,y:d.y})),{x:P.x/T,y:P.y/T});const de=freeNear(m,d.x,d.y,false);path=de&&G.findPath(m,s[0],s[1],de[0],de[1],false);
    if(path){G.ui.toast('Mục tiêu ở ngoài đảo: đi tới cầu tàu rồi bấm <b>Lên thuyền</b>',3500);G.auto={path,i:0,goal:g,dock:1};return;}}
  if(!path){G.ui.toast('Chưa tìm được đường. Đi theo mũi tên vàng nhé.');return;}
  G.auto={path,i:0,goal:g};G.audio.sfx('click');};
G.autoStop=function(){G.auto=null;G.autoContinue=false;};
function autoStep(){const A=G.auto,P=G.P;if(!A)return;if(G.paused){return;}
  if(A.i>=A.path.length){const g=A.goal;G.auto=null;P.move={x:0,y:0};
    if(!A.dock&&g){if(g.kind==='npc'){const n=G.npcs.find(x=>x.id===(g.npc||''))||nearest(G.npcs,P);if(n&&dist(n,P)<40)G.ui.dialog(n);}else if(g.kind==='fish')G.ui.fishing();else if(g.kind==='cook')G.ui.open('cook');}return;}
  const [tx,ty]=A.path[A.i];const wx=tx*T+T/2,wy=ty*T+T/2;const vx=wx-P.x,vy=wy-P.y,L=Math.hypot(vx,vy);
  if(L<5){A.i++;return;}P.move={x:vx/L,y:vy/L};
  A.stuck=(A.lx!=null&&Math.hypot(P.x-A.lx,P.y-A.ly)<.05)?(A.stuck||0)+1:0;A.lx=P.x;A.ly=P.y;if(A.stuck>40){A.i++;A.stuck=0;}}

// ---------- VẼ MŨI TÊN CHỈ ĐƯỜNG ----------
function overlay(ctx,S2,label,bubble,v){const g=G.questGoal();G._goal=g;
  G.amb.forEach(e=>{if(e.say&&e.say.t>0)bubble(e.x,e.y-28,e.say);});
  if(G.auto){ctx.fillStyle='rgba(255,216,74,.55)';const A=G.auto;for(let i=A.i;i<A.path.length;i+=2){const [X,Y]=S2(A.path[i][0]*T+T/2,A.path[i][1]*T+T/2);ctx.beginPath();ctx.arc(X,Y,2.2*v.DPR,0,7);ctx.fill();}}
  if(!g||g.x==null)return;const [X,Y]=S2(g.x,g.y);const t=G.anim||0;const pad=40*v.DPR;
  const inView=X>pad&&X<v.W-pad&&Y>pad*2.2&&Y<v.H-pad*2;
  ctx.save();
  if(inView){const bob=Math.sin(t*5)*5*v.DPR;const y=Y-(g.kind==='npc'?52:g.kind==='boss'?70:30)*v.DPR+bob;ctx.translate(X,y);ctx.fillStyle='#ffd84a';ctx.strokeStyle='#5a1a0c';ctx.lineWidth=2*v.DPR;
    ctx.beginPath();ctx.moveTo(0,14*v.DPR);ctx.lineTo(-11*v.DPR,0);ctx.lineTo(-4*v.DPR,0);ctx.lineTo(-4*v.DPR,-12*v.DPR);ctx.lineTo(4*v.DPR,-12*v.DPR);ctx.lineTo(4*v.DPR,0);ctx.lineTo(11*v.DPR,0);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=.5+.3*Math.sin(t*4);ctx.strokeStyle='#ffd84a';ctx.lineWidth=2*v.DPR;ctx.beginPath();ctx.ellipse(X,Y,20*v.DPR,8*v.DPR,0,0,7);ctx.stroke();}
  else{const cx=v.W/2,cy=v.H/2;const a=Math.atan2(Y-cy,X-cx);const dx=Math.cos(a),dy=Math.sin(a);const left=pad,right=v.W-pad,top=pad*2.6,bottom=v.H-pad*3.4;
    const tX=dx>0?(right-cx)/dx:dx<0?(left-cx)/dx:1e9,tY=dy>0?(bottom-cy)/dy:dy<0?(top-cy)/dy:1e9;const tt=Math.min(tX,tY);const qx=cx+dx*tt,qy=cy+dy*tt;
    ctx.translate(qx,qy);ctx.rotate(a);const s=v.DPR*(1+.12*Math.sin(t*6));ctx.fillStyle='#ffd84a';ctx.strokeStyle='#5a1a0c';ctx.lineWidth=2*v.DPR;
    ctx.beginPath();ctx.moveTo(18*s,0);ctx.lineTo(-8*s,-12*s);ctx.lineTo(-3*s,0);ctx.lineTo(-8*s,12*s);ctx.closePath();ctx.fill();ctx.stroke();ctx.setTransform(1,0,0,1,0,0);
    const dTiles=Math.round(Math.hypot(g.x-G.P.x,g.y-G.P.y)/T);ctx.font=`700 ${Math.round(10*v.DPR)}px "Be Vietnam Pro",system-ui`;ctx.textAlign='center';ctx.lineWidth=3*v.DPR;ctx.strokeStyle='rgba(0,0,0,.8)';
    const tx=qx-Math.cos(a)*30*v.DPR,ty=qy-Math.sin(a)*24*v.DPR+4*v.DPR;ctx.strokeText(dTiles+' bước',tx,ty);ctx.fillStyle='#ffe6a0';ctx.fillText(dTiles+' bước',tx,ty);}
  ctx.restore();}
G.extPre=function(dt){autoStep();};
G.extUpdate=function(dt){updAmb(dt);};
G.extDrawList=drawAmb;G.extDrawWorld=drawWorld;G.extOverlay=overlay;
G.extEnter=function(){spawnAmb();fx=[];if(G.autoContinue){G.autoContinue=false;G.auto=null;setTimeout(()=>G.autoGo(),700);}else G.auto=null;};
})();
