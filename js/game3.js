// ===== Cơ chế kiểu Kiếm Thế: cưỡi ngựa, chạy/đi, thể lực, ngồi thiền, nộ khí, tự động chiến đấu, chạm để đi, trạng thái PK =====
(function(){
const T=G.T, dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
G.PKMODES=[['luyen','练功','Luyện công','#7ed37a'],['phe','阵营','PK phe','#5aa8ff'],['bang','帮会','PK bang','#ffd84a'],['dosat','屠杀','Đồ sát','#ff5d5d']];
function S(){return G.S;}
G.initExtra=function(){const s=S();if(s.mounted==null)s.mounted=true;if(s.run==null)s.run=true;if(!s.pkMode)s.pkMode='luyen';if(s.sp==null)s.sp=100;if(!s.slots)s.slots=['s0','s1','s2','s3','s4','s5','kimsang','hoikhi','food'];
  if(!s.food)s.food={};if(s.food.kimsang==null)s.food.kimsang=3;if(s.food.hoikhi==null)s.food.hoikhi=2;G.P.rage=G.P.rage||0;};
G.speedMul=function(){const s=S();if(G.P.boat)return 1;if(s.meditate)return 0;if(s.mounted)return 1.3;return s.run&&s.sp>0?1:0.55;};
G.toggleMount=function(){const s=S();if(G.P.boat)return;s.mounted=!s.mounted;s.meditate=false;G.audio.sfx(s.mounted?'bark':'click');G.ui.toast(s.mounted?'🐎 Lên ngựa 上马':'Xuống ngựa 下马',1200);};
G.toggleRun=function(){const s=S();s.run=!s.run;G.ui.toast(s.run?'Chạy 跑':'Đi bộ 走',1000);};
G.toggleMeditate=function(){const s=S();if(G.P.boat)return;if(G.mobs.some(m=>m.hp>0&&m.st==='chase'&&dist(m,G.P)<160)){G.ui.toast('Đang bị tấn công, không thể ngồi thiền');return;}s.meditate=!s.meditate;if(s.meditate){s.mounted=false;G.autoStop&&G.autoStop();G.ui.toast('🧘 Ngồi thiền 打坐 – hồi nhanh sinh lực, nội lực, thể lực',2200);}};
G.toggleAuto=function(){const s=S();s.autoFight=!s.autoFight;G.chase=null;if(G.autoStop)G.autoStop();G.ui.toast(s.autoFight?'⚔ Bật tự động chiến đấu 自动战斗':'Tắt tự động chiến đấu',1500);};
G.setPK=function(id){S().pkMode=id;const m=G.PKMODES.find(x=>x[0]===id);G.ui.toast(`Trạng thái: <b style="color:${m[3]}">${m[2]}</b> ${m[1]}`,1500);};
G.useItem=function(id){const s=S();if(id==='food'){const best=['zongzi','yutang','kaoyu','mifan'].find(k=>s.food[k]>0);if(!best){G.ui.toast('Chưa có thức ăn – câu cá rồi nấu ở bếp');return;}id=best;}
  if(!s.food[id]){G.ui.toast('Hết rồi – mua ở Thầy lang 郎中');return;}const r=(G.POTIONS||[]).find(x=>x.id===id)||G.RECIPES.find(x=>x.id===id);if(!r)return;s.food[id]--;const st=G.stats();
  if(r.heal)G.P.hp=Math.min(st.hp,G.P.hp+st.hp*r.heal);if(r.mp)G.P.mp=Math.min(st.mp,G.P.mp+st.mp*r.mp);if(r.buff)G.P.buffs.atk=180;G.audio.sfx('right');G.float(G.P.x,G.P.y-30,r.zh,'#9fe07a');};
// ---- nộ khí: combo 3 câu ----
G.rageMax=100;G.addRage=function(n){G.P.rage=Math.min(G.rageMax,(G.P.rage||0)+n);};
G.useRage=function(){if((G.P.rage||0)<G.rageMax||G.learn.active)return;let ok=0,n=0;const sk={zh:'越魂破',vi:'Nộ · Việt Hồn Phá',col:'#ff5d5d'};
  const ask=()=>G.learn.quiz({skill:{zh:sk.zh,vi:sk.vi+' '+(n+1)+'/3',col:sk.col},onDone:(r)=>{n++;if(r)ok++;if(n<3)setTimeout(ask,150);else fire();}});
  const fire=()=>{G.P.rage=0;const P=G.P;const mult=2+ok*2;G.audio.sfx('thunder');G.shake=.6;G.float(P.x,P.y-50,`越魂破 ×${ok}`,'#ff5d5d',true);
    for(let k=0;k<3;k++)G.fx.push({k:'ring',x:P.x,y:P.y,r0:6,r1:150*(1-k*.2),t:-k*.12,life:.7,col:k?'#ffd84a':'#ff5d5d'});G.fx.push({k:'flash',t:0,life:.35});
    const st=G.stats();G.mobs.forEach(m=>{if(m.hp>0&&dist(m,P)<150){const d=Math.round(st.atk*mult*(0.9+Math.random()*.2));m.hp-=d;m.hitT=.2;m.aggro=true;G.float(m.x,m.y-20,'暴击 '+d,'#ffd84a',true);if(m.hp<=0)G._kill&&G._kill(m);}});};
  ask();};
// ---- chạm để đi / nhắm mục tiêu ----
G.tapGround=function(x,y){if(G.paused)return;const s=S();s.meditate=false;G.chase=null;const m=G.map,P=G.P;const tx=x/T|0,ty=y/T|0;
  if(m.blocked(tx,ty,!!P.boat)){return;}const path=G.findPath(m,P.x/T|0,P.y/T|0,tx,ty,!!P.boat,90000);if(path)G.auto={path,i:0,goal:null};else G.ui.toast('Không tìm được đường');};
G.tapNpc=function(n){if(G.paused)return;S().meditate=false;G.chase=null;if(dist(n,G.P)<40){G.ui.dialog(n);return;}const m=G.map,P=G.P;const path=G.findPath(m,P.x/T|0,P.y/T|0,n.x/T|0,n.y/T|0,false,30000);if(path)G.auto={path,i:0,goal:{kind:'npc',npc:n.id,x:n.x,y:n.y}};};
G.tapMob=function(mb){if(G.paused)return;S().meditate=false;G.chase=mb;G.target=mb;G.autoStop&&(G.auto=null);};
// ---- mỗi khung ----
let thinkT=0,pathT=0;
G.extUpdate3=function(dt){const s=S(),P=G.P;if(!s)return;const st=G.stats();const moving=Math.hypot(P.move.x,P.move.y)>.1||!!G.auto;
  if(moving&&s.meditate)s.meditate=false;
  // thể lực
  if(!s.mounted&&s.run&&moving&&!P.boat)s.sp=Math.max(0,s.sp-dt*7);else s.sp=Math.min(100,s.sp+dt*(s.meditate?25:9));
  if(s.meditate){P.hp=Math.min(st.hp,P.hp+st.hp*0.06*dt);P.mp=Math.min(st.mp,P.mp+st.mp*0.08*dt);}
  // đuổi theo mục tiêu đã chạm / tự động chiến đấu
  thinkT-=dt;pathT-=dt;
  if(s.autoFight&&(!G.chase||G.chase.hp<=0)&&thinkT<=0){thinkT=0.5;let best=null,bd=14*T;G.mobs.forEach(m=>{if(m.hp>0&&!m.water&&!(m.boss&&!s.autoBoss)){const d=dist(m,P);if(d<bd){bd=d;best=m;}}});if(G.pk&&G.pk.hp>0&&dist(G.pk,P)<bd)best=G.pk;G.chase=best;}
  const c=G.chase;if(c){if(c.hp<=0){G.chase=null;return;}const d=dist(c,P);const reach=(c.boss?34:20)+(s.mounted?6:0);
    if(d>reach){if(pathT<=0||!G.auto){pathT=0.8;const path=G.findPath(G.map,P.x/T|0,P.y/T|0,c.x/T|0,c.y/T|0,!!P.boat,20000);if(path){path.pop();G.auto={path,i:0,goal:null};}}}
    else{G.auto=null;P.move={x:0,y:0};P.face=c.x>=P.x?1:-1;P.dir={x:(c.x-P.x)/(d||1),y:(c.y-P.y)/(d||1)};G.attack();}}
  if(G.target&&(G.target.hp<=0||dist(G.target,P)>420))G.target=null;
  if(!G.target){const b=G.mobs.find(m=>m.boss&&m.hp>0&&m.st==='chase');if(b)G.target=b;}};
// gắn vào vòng cập nhật
const prev=G.extUpdate;G.extUpdate=function(dt,dtRaw){prev&&prev(dt,dtRaw);G.extUpdate3(dt);};
})();
