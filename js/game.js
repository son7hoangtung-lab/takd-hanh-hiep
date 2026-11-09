// ===== LÕI GAME: trạng thái, thực thể, chiến đấu, người chơi ảo, vòng lặp =====
(function(){
const T=G.T, SAVE_KEY='takd_vlhsk_v1';
const now=()=>Date.now(), rnd=Math.random, clamp=(v,a,b)=>v<a?a:v>b?b:v;
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
G.timeScale=1;

// ---------- LƯU / NẠP ----------
function newState(){return {v:1,lv:1,exp:0,bac:120,stone:6,map:'kimlien',x:null,y:null,unlocked:{kimlien:1},bosses:{},equip:{},bag:[],fish:{},ingr:{gao:1,rau:1,thit:0},food:{},
  q:{i:0,st:'new',p:0},daily:null,words:{},stats:{kills:0,written:0,spoken:0,pk:0,learned:0,fished:0,cooked:0,deaths:0},lastTs:now(),botStart:now()-3*864e5,
  settings:{music:1,sfx:1,tts:1,quiz:'all'},foes:[],chestDay:{},wbDay:{},intro:0};}
G.load=function(){try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');if(s&&s.v===1){G.S=Object.assign(newState(),s);G.S.settings=Object.assign(newState().settings,s.settings||{});return true;}}catch(e){}
  G.S=newState();const w=G.makeItem(1,0,0,'weapon');w.r=0;w.m=0;const a=G.makeItem(1,0,0,'armor');a.r=0;a.m=0;G.S.equip={weapon:w,armor:a};return false;};
G.save=function(){const S=G.S;S.lastTs=now();if(G.P){S.x=G.P.x;S.y=G.P.y;S.hp=G.P.hp;S.mp=G.P.mp;S.boat=G.P.boat?1:0;S.map=G.map.id;}try{localStorage.setItem(SAVE_KEY,JSON.stringify(S));}catch(e){}};
G.resetSave=function(){try{localStorage.removeItem(SAVE_KEY);}catch(e){}location.reload();};
G.exportSave=function(){return btoa(unescape(encodeURIComponent(JSON.stringify(G.S))));};
G.importSave=function(code){try{const s=JSON.parse(decodeURIComponent(escape(atob(code.trim()))));if(s.v!==1)throw 0;localStorage.setItem(SAVE_KEY,JSON.stringify(s));location.reload();return true;}catch(e){return false;}};

// ---------- VẬT PHẨM ----------
let seq=0;
G.makeItem=function(lv,rarMin,boost,slot){
  const rs=G.RARITY;let tot=0;const ws=rs.map((r,i)=>i<rarMin?0:r.w*(1+(boost||0)*i*i));ws.forEach(w=>tot+=w);let roll=rnd()*tot,rar=rarMin;for(let i=0;i<ws.length;i++){roll-=ws[i];if(roll<=0){rar=i;break;}}
  slot=slot||G.SLOTS[(rnd()*G.SLOTS.length)|0].id;const sd=G.SLOTS.find(s=>s.id===slot);
  const m=clamp(Math.floor(lv/4)+((rnd()*3)|0)-1,0,G.MATERIALS.length-1);
  const st={};for(const k in sd.st)st[k]=Math.max(1,Math.round(sd.st[k]*(1+lv*.14)*rs[rar].mul*(.9+rnd()*.2)));
  if(rar>=3){const extra=['atk','def','hp','crit'][(rnd()*4)|0];st[extra]=(st[extra]||0)+Math.round((extra==='hp'?20:extra==='crit'?1:4)*(1+lv*.1)*rs[rar].mul*.5);}
  return {id:now().toString(36)+(seq++)+((rnd()*1e4)|0),slot,r:rar,lv,m,e:0,st};};
G.enhMul=e=>1+e*.1+(e>=7?.1:0)+(e>=10?.2:0)+(e>=12?.3:0);
G.itemStats=function(it){const o={};const k=G.enhMul(it.e||0);for(const s in it.st)o[s]=Math.round(it.st[s]*k);return o;};
G.itemName=function(it){const s=G.SLOTS.find(x=>x.id===it.slot),m=G.MATERIALS[it.m];return {zh:m.zh+s.zh,vi:s.vi+' '+m.vi};};
G.itemPower=function(it){const s=G.itemStats(it);return (s.atk||0)*3+(s.def||0)*3+(s.hp||0)*.4+(s.mp||0)*.3+(s.crit||0)*8+(s.spd||0)*2;};
G.gainItem=function(it,silent){G.S.bag.push(it);if(G.S.bag.length>60){G.S.bag.sort((a,b)=>G.itemPower(b)-G.itemPower(a));G.S.bag.length=60;}
  if(!silent){const n=G.itemName(it),r=G.RARITY[it.r];G.ui.toast(`Nhặt được <b style="color:${r.col==='rainbow'?'#ffd84a':r.col}">[${r.vi}] ${n.vi}</b> · ${n.zh}`);}};

// ---------- CHỈ SỐ ----------
G.expNeed=lv=>Math.round(40*Math.pow(lv,1.7))+20;
G.TITLES=[[1,'学徒','Học đồ'],[10,'秀才','Tú tài'],[20,'举人','Cử nhân'],[35,'进士','Tiến sĩ'],[50,'状元','Trạng nguyên']];
G.title=function(lv){let t=G.TITLES[0];for(const x of G.TITLES)if(lv>=x[0])t=x;return t;};
G.stats=function(){const S=G.S,lv=S.lv;const s={atk:10+lv*4,def:3+lv*2,hp:110+lv*28,mp:40+lv*7,crit:5,spd:0};
  for(const k in S.equip){const it=S.equip[k];if(!it)continue;const st=G.itemStats(it);for(const a in st)s[a]=(s[a]||0)+st[a];}
  if(G.P&&G.P.buffs.atk>0)s.atk=Math.round(s.atk*1.2);if(G.P&&G.P.buffs.kim>0)s.def=Math.round(s.def*1.6);
  s.crit=Math.min(60,s.crit);return s;};
G.power=function(){const s=G.stats();return Math.round(s.atk*3+s.def*3+s.hp*.4+s.crit*8+G.S.lv*10);};

// ---------- MÔ PHỎNG NGƯỜI CHƠI ẢO ----------
G.allBots=function(){if(G._bots)return G._bots;const r=G.rng(Math.floor(G.S.botStart/1000)%99991+17);const arr=[];
  for(let i=0;i<G.BOT_NAMES.length;i++){const name=G.BOT_NAMES[i]+G.BOT_SUFFIX[(r()*G.BOT_SUFFIX.length)|0];const sect=G.SECTS[r()<.12?0:1+((r()*(G.SECTS.length-1))|0)];
    arr.push({name,sect,lv0:1+r()*14,rate:.4+r()*r()*5,pw:.8+r()*.5,guild:['越拳门','龙门','Hào Kiệt','逍遥','Đại Việt','无名'][(r()*6)|0]});}
  G._bots=arr;return arr;};
G.botLevel=function(b){const days=(now()-G.S.botStart)/864e5;return Math.min(120,Math.floor(b.lv0+days*b.rate));};

// ---------- KHỞI TẠO VÙNG ----------
G.mobs=[];G.bots=[];G.fx=[];G.texts=[];G.drops=[];G.npcs=[];
function tileFree(m,tx,ty,water){if(tx<1||ty<1||tx>=m.w-1||ty>=m.h-1)return false;const t=m.get(tx,ty);const isW=!!G.WATERY[t];if(water)return isW&&!m.solid[ty*m.w+tx];return !m.blocked(tx,ty,false);}
function randInZone(z,m){for(let k=0;k<40;k++){const tx=z.x0+((rnd()*(z.x1-z.x0+1))|0),ty=z.y0+((rnd()*(z.y1-z.y0+1))|0);if(tileFree(m,tx,ty,z.water))return {x:tx*T+T/2,y:ty*T+T/2};}return null;}
G.makeMob=function(base,tier,pos,zi){const t=G.MOB_TIER[tier];const lv=base.lv+tier*2+((rnd()*3)|0);const k=t.m*(1+(lv-base.lv)*.08);
  return {base,tier,lv,name:{zh:t.zh+base.zh,vi:(t.vi?t.vi+' ':'')+base.vi},hp:Math.round(base.hp*k),max:Math.round(base.hp*k),atk:Math.round(base.atk*(1+(tier*.25))*(1+(lv-base.lv)*.05)),
    spd:base.spd,x:pos.x,y:pos.y,hx:pos.x,hy:pos.y,st:'idle',wt:rnd()*2,tx:pos.x,ty:pos.y,cd:0,f:0,face:1,hitT:0,aggro:tier>=1,zi,water:!!base.water,exp:Math.round(base.exp*t.m*(1+(lv-base.lv)*.1)),tint:base.tint};};
function spawnZone(zi){const m=G.map,z=m.zones[zi];if(z.night&&!G.isNight())return;const pos=randInZone(z,m);if(!pos)return;const id=z.mobs[(rnd()*z.mobs.length)|0];
  const base=G.MOB_BASE[m.id].find(b=>b.id===id);const r=rnd();const tier=r<.6?0:r<.8?1:r<.92?2:r<.98?3:4;G.mobs.push(G.makeMob(base,tier,pos,zi));}
G.spawnBoss=function(){const m=G.map;if(!m.boss)return;if(G.mobs.some(x=>x.boss))return;const b=G.BOSSES[m.boss.key];
  const mob=G.makeMob(Object.assign({},b),0,{x:m.boss.x,y:m.boss.y},-1);Object.assign(mob,{boss:b.id,lv:b.lv,hp:b.hp,max:b.hp,atk:b.atk,exp:b.exp,name:{zh:b.zh,vi:b.vi},aggro:true,slamT:4,tint:b.tint});G.mobs.push(mob);};
G.spawnWorldBoss=function(){const m=G.map;if(!m.worldBoss||G.mobs.some(x=>x.wb))return;const b=G.WORLD_BOSS;
  const mob=G.makeMob(Object.assign({},b),0,{x:m.worldBoss.x,y:m.worldBoss.y},-1);Object.assign(mob,{wb:1,boss:'wb',lv:b.lv,hp:b.hp,max:b.hp,atk:b.atk,exp:b.exp,name:{zh:b.zh,vi:b.vi},aggro:true,slamT:5,water:false});G.mobs.push(mob);
  G.ui.chat('系统','蛟龙出现了！','Giao Long đã xuất hiện bên sông Hồng!','#ffd84a',true);G.audio.sfx('gong');};
G.worldBossNow=function(){const d=new Date();return G.WORLD_BOSS.hours.includes(d.getHours())&&d.getMinutes()<30;};

G.enterMap=function(id,arrive,boat){G.map=G.getMap(id);G.S.map=id;G.mobs=[];G.bots=[];G.fx=[];G.drops=[];G.texts=[];G.pk=null;
  const m=G.map;let px,py;if(arrive){px=arrive[0]*T+T/2;py=arrive[1]*T+T/2;}else if(G.S.x!=null&&G.S.map===id){px=G.S.x;py=G.S.y;}else{px=m.start[0]*T+T/2;py=m.start[1]*T+T/2;}
  G.P.x=px;G.P.y=py;G.P.boat=!!boat&&m.isWater(px/T|0,py/T|0);
  G.npcs=(G.NPCS[id]||[]).map(n=>Object.assign({},n,{x:n.x*T+T/2,y:n.y*T+T/2,f:0}));
  m.zones.forEach((z,i)=>{for(let k=0;k<z.n;k++)spawnZone(i);});
  G.spawnBoss();if(G.worldBossNow()&&m.worldBoss&&G.S.wbDay[today()]!==1)G.spawnWorldBoss();
  // người chơi ảo trên bản đồ
  const all=G.allBots();const pick=all.slice().sort(()=>rnd()-.5).slice(0,8);
  pick.forEach(b=>{const z=m.zones[(rnd()*m.zones.length)|0];const pos=(z&&!z.water&&randInZone(z,m))||{x:px+(rnd()-.5)*200,y:py+(rnd()-.5)*200};
    if(m.blocked(pos.x/T|0,pos.y/T|0,false))return;G.bots.push({b,x:pos.x,y:pos.y,tx:pos.x,ty:pos.y,wt:0,f:0,face:1,atkT:0,target:null,hp:1,lv:G.botLevel(b)});});
  G.shiba.x=px-14;G.shiba.y=py+4;
  G.audio.music(G.isNight()?'night':G.REGIONS[id].music);G.ui.banner(id);G.save();};
G.travel=function(portal){const S=G.S;if(portal.need&&!S.bosses[portal.need]){const b=Object.values(G.BOSSES).find(x=>x.id===portal.need);G.ui.toast(`🔒 Cần đánh bại <b>${b.vi}</b> · ${b.zh}`);G.P.y+=T*1.2;return;}
  S.unlocked[portal.to]=1;G.ui.fade(()=>G.enterMap(portal.to,portal.arrive));};
G.teleport=function(id){if(!G.S.unlocked[id])return;const m=G.getMap(id);G.ui.fade(()=>G.enterMap(id,m.start));};

// ---------- NGÀY ĐÊM ----------
G.hourF=function(){const d=new Date();return d.getHours()+d.getMinutes()/60;};
G.isNight=function(){const h=G.hourF();return h>=19||h<5;};
G.darkness=function(){const h=G.hourF();if(h>=7&&h<17)return 0;if(h>=17&&h<19)return (h-17)/2*.6;if(h>=5&&h<7)return (7-h)/2*.6;return .6;};
G.raining=function(){const d=new Date();const r=G.rng(d.getFullYear()*1000+d.getMonth()*40+d.getDate()*24+d.getHours()+3)();return r<.22;};
function today(){const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
G.today=today;

// ---------- KINH NGHIỆM & PHẦN THƯỞNG ----------
G.addExp=function(n,x,y){const S=G.S;S.exp+=n;if(x!=null)G.float(x,y-20,'+'+n+' EXP','#9fe07a');
  while(S.exp>=G.expNeed(S.lv)){S.exp-=G.expNeed(S.lv);S.lv++;const st=G.stats();G.P.hp=st.hp;G.P.mp=st.mp;G.audio.sfx('level');
    G.fx.push({k:'ring',x:G.P.x,y:G.P.y,r0:4,r1:70,t:0,life:.9,col:'#ffd84a'});G.fx.push({k:'ring',x:G.P.x,y:G.P.y,r0:2,r1:46,t:-.15,life:.9,col:'#fff'});
    const sk=G.SKILLS.find(s=>s.lv===S.lv);const ti=G.TITLES.find(t=>t[0]===S.lv);
    G.ui.toast(`<b>升级！Lên cấp ${S.lv}</b>`+(sk?`<br>Mở chiêu mới: <b>${sk.vi}</b> ${sk.zh}`:'')+(ti?`<br>Danh hiệu mới: <b>${ti[2]}</b> ${ti[1]}`:''),3500);}
};
G.addBac=function(n,x,y){G.S.bac+=n;if(x!=null)G.float(x,y-30,'+'+n+' 两','#ffd27a');};
G.float=function(x,y,txt,col,big){G.texts.push({x,y,txt,col,t:0,life:big?1.3:1,big});};

// ---------- NHIỆM VỤ ----------
G.curQuest=function(){return G.MAIN_QUESTS[G.S.q.i]||null;};
G.questTarget=function(){const q=G.curQuest();if(!q)return null;return q.n||1;};
G.questEvent=function(type,data){const S=G.S,q=G.curQuest();
  if(q&&S.q.st==='active'&&q.type===type){let ok=true;if(type==='kill'&&data.id!==q.mob)ok=false;if(type==='boss'&&data.key!==q.boss)ok=false;if(type==='learn'&&q.topic&&data.t!==q.topic)ok=false;
    if(ok){S.q.p++;if(S.q.p>=(q.n||1)){S.q.st='done';G.ui.toast(`✔ Hoàn thành: <b>${q.title}</b><br>Về gặp ${npcName(q.npc)} để nhận thưởng`);G.audio.sfx('right');}}}
  const D=G.ensureDaily();D.list.forEach(d=>{if(d.done||d.type!==type)return;if(type==='kill'&&d.mob&&data.id!==d.mob)return;d.p++;if(d.p>=d.n){d.done=1;G.giveReward(d.reward);G.ui.toast(`✔ Nhiệm vụ ngày: <b>${d.title}</b>`);}});};
function npcName(id){for(const k in G.NPCS){const n=G.NPCS[k].find(x=>x.id===id);if(n)return n.vi;}return '';}
G.npcName=npcName;
G.giveReward=function(r){if(!r)return;const S=G.S;if(r.exp)G.addExp(r.exp,G.P.x,G.P.y);if(r.bac)G.addBac(r.bac,G.P.x,G.P.y);if(r.stone){S.stone+=r.stone;G.float(G.P.x,G.P.y-40,'+'+r.stone+' 玄晶','#7fe0ff');}
  if(r.ingr)for(const k in r.ingr)S.ingr[k]=(S.ingr[k]||0)+r.ingr[k];if(r.item)G.gainItem(G.makeItem(S.lv,Math.min(r.item,4),.3));G.audio.sfx('coin');};
G.ensureDaily=function(){const S=G.S,d=today();if(S.daily&&S.daily.date===d)return S.daily;const reg=Object.keys(S.unlocked);const id=reg[reg.length-1];const pool=G.MOB_BASE[id];const mob=pool[(rnd()*pool.length)|0];
  S.daily={date:d,list:[{type:'kill',mob:mob.id,n:10,p:0,title:`Diệt 10 ${mob.vi} (${mob.zh})`,reward:{exp:60*S.lv,bac:40*S.lv}},{type:'fish',n:3,p:0,title:'Câu 3 con cá 钓鱼',reward:{exp:40*S.lv,ingr:{gao:2}}},
    {type:'review',n:10,p:0,title:'Ôn 10 từ 复习',reward:{stone:5,exp:30*S.lv}},{type:'write',n:2,p:0,title:'Viết 2 chữ 写字',reward:{stone:4}},{type:'pk',n:1,p:0,title:'Thắng 1 trận PK',reward:{bac:80*S.lv}}]};return S.daily;};

// ---------- NGƯỜI CHƠI ----------
G.P={x:0,y:0,face:1,dir:{x:1,y:0},hp:100,mp:40,f:0,ft:0,atkT:0,swing:0,cd:[0,0,0,0,0,0],buffs:{atk:0,kim:0},boat:false,inv:0,move:{x:0,y:0},dashT:0};
G.shiba={x:0,y:0,f:0,ft:0,sit:false,target:null,barkT:0};
function walk(e,dx,dy,boat){const m=G.map;const r=5;const nx=e.x+dx,ny=e.y+dy;
  const ok=(x,y)=>!m.blocked(Math.floor((x-r)/T),Math.floor(y/T),boat)&&!m.blocked(Math.floor((x+r)/T),Math.floor(y/T),boat)&&!m.blocked(Math.floor(x/T),Math.floor((y-3)/T),boat);
  if(ok(nx,e.y))e.x=nx;if(ok(e.x,ny))e.y=ny;}
function mobWalk(mb,dx,dy){const m=G.map;const nx=mb.x+dx,ny=mb.y+dy;const can=(x,y)=>{const tx=x/T|0,ty=y/T|0;if(mb.water)return m.isWater(tx,ty);if(mb.boss&&!mb.wb)return !m.isWater(tx,ty)||m.get(tx,ty)==='lotus';return !m.blocked(tx,ty,false);};
  if(can(nx,mb.y))mb.x=nx;if(can(mb.x,ny))mb.y=ny;}

// ---------- CHIẾN ĐẤU ----------
function targets(){const arr=G.mobs.filter(m=>m.hp>0);if(G.pk&&G.pk.hp>0)arr.push(G.pk);return arr;}
function dmgTo(t,raw,crit,col){const def=t.def||t.lv*1.5;let d=Math.max(1,Math.round(raw-def*.4));if(crit)d=Math.round(d*1.8);t.hp-=d;t.hitT=.15;t.aggro=true;if(t.st!=='pk')t.st='chase';
  G.float(t.x+(rnd()-.5)*8,t.y-18,(crit?'暴击 ':'')+d,crit?'#ffd84a':(col||'#fff'),crit);G.audio.sfx(crit?'crit':'hit');
  const k=Math.max(0,1-(t.boss?.9:.3));const a=Math.atan2(t.y-G.P.y,t.x-G.P.x);if(!t.boss){t.x+=Math.cos(a)*4*k;t.y+=Math.sin(a)*4*k;}
  if(t.hp<=0)killed(t);}
function hit(t,mult,col){const st=G.stats();const crit=rnd()*100<st.crit||G._forceCrit;dmgTo(t,st.atk*mult*(.9+rnd()*.2),crit,col);}
G.attack=function(){const P=G.P;if(P.atkT>0||G.paused)return;P.atkT=.42;P.swing=.22;
  let best=null,bd=46;targets().forEach(t=>{const d=dist(t,P)-(t.boss?18:0);if(d<bd){bd=d;best=t;}});
  if(best){P.face=best.x>=P.x?1:-1;hit(best,1);G.fx.push({k:'slash',x:(P.x+best.x)/2,y:(P.y+best.y)/2-8,t:0,life:.18,face:P.face});}
  else G.audio.sfx('click');};
G.castSkill=function(i){const S=G.S,P=G.P,sk=G.SKILLS[i];if(!sk||G.paused)return;if(S.lv<sk.lv){G.ui.toast(`🔒 Cấp ${sk.lv} mới học được <b>${sk.vi}</b>`);return;}
  if(P.cd[i]>0)return;if(P.mp<sk.mp){G.ui.toast('Không đủ nội lực 内力不足');return;}
  const mode=S.settings.quiz;const need=mode==='all'||(mode==='big'&&i>=2);
  if(need){G.learn.quiz({skill:sk,onDone:(ok,fast)=>{if(ok){fire(i,fast);}else{P.cd[i]=sk.cd*.5;G.ui.toast('Niệm chú sai – chiêu thất bại');}}});}else fire(i,false);};
function fire(i,fast){const P=G.P,sk=G.SKILLS[i];P.mp-=sk.mp;P.cd[i]=sk.cd;G.audio.sfx('skill');G._forceCrit=fast;
  G.float(P.x,P.y-36,sk.zh+' '+sk.vi,sk.col,true);const mul=sk.mult*(fast?1.25:1);const ts=targets();
  switch(sk.kind){
    case 'strike':{let best=null,bd=sk.range+20;ts.forEach(t=>{const d=dist(t,P);if(d<bd){bd=d;best=t;}});if(best){P.face=best.x>=P.x?1:-1;hit(best,mul,sk.col);G.fx.push({k:'burst',x:best.x,y:best.y-8,t:0,life:.35,col:sk.col,r:16});}else G.fx.push({k:'burst',x:P.x+P.face*24,y:P.y-8,t:0,life:.3,col:sk.col,r:10});break;}
    case 'spin':ts.forEach(t=>{if(dist(t,P)<sk.range)hit(t,mul,sk.col);});G.fx.push({k:'ring',x:P.x,y:P.y-4,r0:8,r1:sk.range,t:0,life:.4,col:sk.col});break;
    case 'cone':{const d=P.dir;ts.forEach(t=>{const vx=t.x-P.x,vy=t.y-P.y,L=Math.hypot(vx,vy);if(L<sk.range&&(vx*d.x+vy*d.y)/(L||1)>.35){hit(t,mul,sk.col);G.fx.push({k:'bolt',x:t.x,y:t.y,t:0,life:.4});}});
      for(let k=1;k<=3;k++)G.fx.push({k:'bolt',x:P.x+d.x*k*24,y:P.y+d.y*k*24,t:-k*.05,life:.4});G.audio.sfx('thunder');G.shake=.25;break;}
    case 'buff':P.buffs.kim=10;const st=G.stats();P.hp=Math.min(st.hp,P.hp+st.hp*.3);G.fx.push({k:'ring',x:P.x,y:P.y-6,r0:30,r1:6,t:0,life:.6,col:'#ffe08a'});G.float(P.x,P.y-50,'+30% HP','#9fe07a');break;
    case 'dash':{const d=P.dir;const hitSet=new Set();P.dashT=.25;P.dashV={x:d.x*sk.range/.25,y:d.y*sk.range/.25};P.dashHit=(t)=>{if(!hitSet.has(t)){hitSet.add(t);hit(t,mul,sk.col);}};break;}
    case 'nova':ts.forEach(t=>{if(dist(t,P)<sk.range)hit(t,mul,sk.col);});for(let k=0;k<3;k++)G.fx.push({k:'ring',x:P.x,y:P.y,r0:6,r1:sk.range*(1-k*.2),t:-k*.12,life:.6,col:k?'#ffd84a':'#ff5d5d'});G.fx.push({k:'flash',t:0,life:.3});G.shake=.5;G.audio.sfx('thunder');break;
  }G._forceCrit=false;};
function killed(t){const S=G.S;t.hp=0;t.deadT=0;
  if(t===G.pk){S.stats.pk++;const l=G.PK_LOSE[(rnd()*G.PK_LOSE.length)|0];t.say={zh:l[0],vi:l[1],t:3};G.ui.chat(t.b.name,l[0],l[1],'#ff6b6b');G.addBac(30*S.lv,t.x,t.y);if(rnd()<.35)G.drops.push({x:t.x,y:t.y,item:G.makeItem(S.lv,1,.2)});
    G.addExp(25*S.lv,t.x,t.y);G.questEvent('pk',{});setTimeout(()=>{G.pk=null;},1500);return;}
  S.stats.kills++;G.addExp(t.exp,t.x,t.y);const bac=Math.round((4+t.lv*2)*(1+t.tier)*(t.boss?20:1)*(.7+rnd()*.6));G.drops.push({x:t.x+(rnd()-.5)*10,y:t.y,bac});
  const ic=t.boss?1:.06*(1+t.tier*1.2);if(rnd()<ic)G.drops.push({x:t.x+(rnd()-.5)*16,y:t.y+(rnd()-.5)*10,item:G.makeItem(t.lv,t.boss?(t.wb?4:2+Object.keys(G.BOSSES).indexOf(G.map.id)):Math.min(t.tier,2),t.boss?.6:t.tier*.15)});
  if(t.boss&&!t.wb&&rnd()<.6)G.drops.push({x:t.x+8,y:t.y+6,item:G.makeItem(t.lv,2,.5)});
  if(t.base.drop==='thit'&&rnd()<.5)G.drops.push({x:t.x,y:t.y+6,ingr:'thit'});if(rnd()<.08+t.tier*.05)G.drops.push({x:t.x-6,y:t.y,stone:1+t.tier});
  G.questEvent('kill',{id:t.base.id});
  if(t.boss&&!t.wb){const key=G.map.boss.key;const first=!S.bosses[t.boss];S.bosses[t.boss]=1;G.questEvent('boss',{key});G.audio.sfx('gong');G.shake=.6;
    const b=G.BOSSES[key];if(first&&b.unlock){S.unlocked[b.unlock]=1;G.ui.toast(`🏆 Đánh bại <b>${b.vi}</b>!<br>Đã mở đường đến <b>${G.REGIONS[b.unlock].vi}</b>`,4500);}
    setTimeout(()=>{if(G.map&&G.map.boss&&G.map.boss.key===key)G.spawnBoss();},90000);}
  if(t.wb){S.wbDay[today()]=1;G.ui.chat('系统','蛟龙被打败了！','Giao Long đã bị đánh bại!','#ffd84a',true);for(let k=0;k<3;k++)G.drops.push({x:t.x+(rnd()-.5)*30,y:t.y+(rnd()-.5)*20,item:G.makeItem(t.lv,3,.6)});}
  if(t.zi>=0)setTimeout(()=>{if(G.map&&G.map.zones[t.zi])spawnZone(t.zi);},7000+rnd()*6000);}
function playerHurt(raw,from){const P=G.P;if(P.inv>0)return;const st=G.stats();let d=Math.max(1,Math.round(raw*(.85+rnd()*.3)-st.def*.5));P.hp-=d;P.inv=.25;G.float(P.x,P.y-24,'-'+d,'#ff6b6b');G.audio.sfx('hurt');
  if(P.hp<=0)die(from);}
function die(from){const S=G.S,P=G.P;S.stats.deaths++;const lost=Math.round(S.bac*.1);S.bac-=lost;
  if(from&&from===G.pk){G.ui.chat(from.b.name,'哈哈！你的钱是我的了！','Ha ha! Tiền của ngươi là của ta!','#ff6b6b');if(!S.foes.includes(from.b.name))S.foes.unshift(from.b.name);S.foes.length=Math.min(S.foes.length,10);G.pk=null;}
  G.ui.toast(`💀 Trọng thương! Mất ${lost} lượng bạc. Về điểm hồi sinh.`,3000);const st=G.stats();P.hp=st.hp;P.mp=st.mp;P.boat=false;const m=G.map;P.x=m.start[0]*T+T/2;P.y=m.start[1]*T+T/2;G.shake=.4;}

// ---------- PK ----------
let pkTimer=60+rnd()*60;
function spawnPK(){const S=G.S,P=G.P;if(G.pk||S.lv<4||P.boat)return;const all=G.allBots();let b=all[(rnd()*all.length)|0];if(S.foes.length&&rnd()<.4){const n=S.foes[(rnd()*S.foes.length)|0];b=all.find(x=>x.name===n)||b;}
  const a=rnd()*Math.PI*2;let x=P.x+Math.cos(a)*180,y=P.y+Math.sin(a)*140;if(G.map.blocked(x/T|0,y/T|0,false)){x=P.x+Math.cos(a)*60;y=P.y+Math.sin(a)*60;if(G.map.blocked(x/T|0,y/T|0,false))return;}
  const st=G.stats();const lv=Math.max(1,S.lv+((rnd()*5)|0)-2);const hp=Math.round(st.hp*(.7+rnd()*.3));
  G.pk={b,x,y,hp,max:hp,lv,atk:Math.round(st.def*.6+lv*5),def:st.def*.6,st:'pk',cd:1,f:0,face:1,hitT:0,base:{id:'pk'},tier:0,
    name:{zh:b.name,vi:b.sect.vi}};const l=G.PK_LINES[(rnd()*G.PK_LINES.length)|0];G.pk.say={zh:l[0],vi:l[1],t:3};G.ui.chat(b.name,l[0],l[1],'#ff6b6b');G.audio.sfx('bark');};

// ---------- CẬP NHẬT ----------
let chatT=4,saveT=10,wbCheck=5,regenT=0,animT=0;
G.update=function(dtRaw){const dt=dtRaw*G.timeScale;const P=G.P,S=G.S,m=G.map;animT+=dt;G.anim=animT;
  if(G.shake>0)G.shake-=dtRaw;
  const st=G.stats();
  // di chuyển
  if(P.dashT>0){P.dashT-=dt;walk(P,P.dashV.x*dt,P.dashV.y*dt,P.boat);targets().forEach(t=>{if(dist(t,P)<26)P.dashHit(t);});G.fx.push({k:'dust',x:P.x,y:P.y,t:0,life:.3});}
  else{const mv=P.move;const L=Math.hypot(mv.x,mv.y);if(L>.1&&!G.paused){const sp=(P.boat?120:96)+(st.spd||0);const nx=mv.x/L,ny=mv.y/L;P.dir={x:nx,y:ny};if(Math.abs(nx)>.2)P.face=nx>0?1:-1;
    walk(P,nx*sp*Math.min(L,1)*dt,ny*sp*Math.min(L,1)*dt,P.boat);P.ft+=dt*(P.boat?3:9);P.f=(P.ft|0)%4;}else P.f=0;}
  P.atkT-=dt;P.swing-=dt;P.inv-=dt;for(let i=0;i<6;i++)P.cd[i]=Math.max(0,P.cd[i]-dt);P.buffs.atk=Math.max(0,P.buffs.atk-dt);P.buffs.kim=Math.max(0,P.buffs.kim-dt);
  regenT+=dt;if(regenT>1){regenT=0;P.mp=Math.min(st.mp,P.mp+st.mp*.04);if(!targets().some(t=>t.st==='chase'&&dist(t,P)<160))P.hp=Math.min(st.hp,P.hp+st.hp*.02);}
  P.hp=Math.min(P.hp,st.hp);
  // cổng
  m.portals.forEach(p=>{if(Math.hypot(P.x-(p.x*T+T/2),P.y-(p.y*T+T/2))<14&&!G.paused&&!G._travel){G._travel=1;setTimeout(()=>G._travel=0,800);G.travel(p);}});
  // Shiba
  const sb=G.shiba;let goal={x:P.x-P.face*16,y:P.y+6};if(G.drops.length){let nd=null,bd=140;G.drops.forEach(d=>{const dd=Math.hypot(d.x-sb.x,d.y-sb.y);if(dd<bd){bd=dd;nd=d;}});if(nd)goal=nd;}
  const gx=goal.x-sb.x,gy=goal.y-sb.y,gl=Math.hypot(gx,gy);if(gl>4){const sp=gl>80?180:110;sb.x+=gx/gl*Math.min(gl,sp*dt);sb.y+=gy/gl*Math.min(gl,sp*dt);sb.ft+=dt*10;sb.f=(sb.ft|0)%2;sb.face=gx>0?1:-1;sb.sit=false;}else{sb.sit=true;}
  if(gl>400){sb.x=P.x;sb.y=P.y;}
  // nhặt đồ
  for(let i=G.drops.length-1;i>=0;i--){const d=G.drops[i];d.age=(d.age||0)+dt;if(Math.hypot(d.x-sb.x,d.y-sb.y)<8||Math.hypot(d.x-P.x,d.y-P.y)<18||d.age>4){G.drops.splice(i,1);
    if(d.bac){G.addBac(d.bac,d.x,d.y);G.audio.sfx('coin');}if(d.item){G.gainItem(d.item);G.audio.sfx('bark');}if(d.ingr){S.ingr[d.ingr]=(S.ingr[d.ingr]||0)+1;G.float(d.x,d.y-12,'+1 '+G.INGR[d.ingr].vi,'#e8dcc0');}
    if(d.stone){S.stone+=d.stone;G.float(d.x,d.y-12,'+'+d.stone+' 玄晶','#7fe0ff');}}}
  // quái
  G.mobs.forEach(mb=>{if(mb.hp<=0){mb.deadT+=dt;return;}mb.hitT-=dt;mb.cd-=dt;const d=dist(mb,P);
    const reach=!P.boat||mb.water||mb.boss;const seeR=mb.boss?150:(mb.aggro?95:0);
    if(mb.st==='idle'){mb.wt-=dt;if(mb.wt<=0){mb.wt=2+rnd()*3;mb.tx=mb.hx+(rnd()-.5)*70;mb.ty=mb.hy+(rnd()-.5)*50;}
      const vx=mb.tx-mb.x,vy=mb.ty-mb.y,L=Math.hypot(vx,vy);if(L>3){mobWalk(mb,vx/L*mb.spd*.35*dt,vy/L*mb.spd*.35*dt);mb.face=vx>0?1:-1;mb.f=((animT*4)|0)%2;}
      if(d<seeR&&reach&&P.hp>0)mb.st='chase';}
    else if(mb.st==='chase'){const home=Math.hypot(mb.x-mb.hx,mb.y-mb.hy);if(home>(mb.boss?220:260)||!reach||d>320){mb.st='back';}
      else{const rr=mb.boss?(mb.wb?40:28):16;if(d>rr){const vx=P.x-mb.x,vy=P.y-mb.y;mobWalk(mb,vx/d*mb.spd*dt,vy/d*mb.spd*dt);mb.face=vx>0?1:-1;mb.f=((animT*6)|0)%2;}
        else if(mb.cd<=0){mb.cd=mb.boss?1.1:1.3;playerHurt(mb.atk*(P.buffs.kim>0?.6:1),mb);mb.lunge=.15;}
        if(mb.boss){mb.slamT-=dt;if(mb.slamT<=0){mb.slamT=mb.hp<mb.max*.3?3.2:5.5;G.fx.push({k:'warn',x:P.x,y:P.y,r:mb.wb?54:40,t:0,life:1.1,cb:(f)=>{if(Math.hypot(G.P.x-f.x,G.P.y-f.y)<f.r)playerHurt(mb.atk*1.8,mb);G.fx.push({k:'ring',x:f.x,y:f.y,r0:6,r1:f.r,t:0,life:.35,col:'#ff5d5d'});G.shake=.3;G.audio.sfx('thunder');}});}}}}
    else if(mb.st==='back'){const vx=mb.hx-mb.x,vy=mb.hy-mb.y,L=Math.hypot(vx,vy);if(L<6){mb.st='idle';mb.hp=Math.min(mb.max,mb.hp+mb.max*.5);}else mobWalk(mb,vx/L*mb.spd*1.2*dt,vy/L*mb.spd*1.2*dt);}
    if(mb.lunge>0)mb.lunge-=dt;});
  G.mobs=G.mobs.filter(mb=>mb.hp>0||mb.deadT<.6);
  // PK
  pkTimer-=dt;if(pkTimer<=0){pkTimer=100+rnd()*120;if(rnd()<.6)spawnPK();}
  const k=G.pk;if(k&&k.hp>0){k.cd-=dt;k.hitT-=dt;const d=dist(k,P);if(d>22){k.x+=(P.x-k.x)/d*88*dt;k.y+=(P.y-k.y)/d*88*dt;k.f=((animT*8)|0)%2;k.face=P.x>k.x?1:-1;}else if(k.cd<=0&&!P.boat){k.cd=1;playerHurt(k.atk,k);k.lunge=.15;}if(k.lunge>0)k.lunge-=dt;if(d>500)G.pk=null;}
  if(k&&k.say)k.say.t-=dt;
  // người chơi ảo
  G.bots.forEach(b=>{b.atkT-=dt;if(b.say)b.say.t-=dt;if(b.target&&(b.target.hp<=0||!G.mobs.includes(b.target)))b.target=null;
    if(!b.target){if(rnd()<dt*.3){let best=null,bd=150;G.mobs.forEach(mb=>{if(mb.hp>0&&!mb.water&&!mb.boss){const dd=dist(mb,b);if(dd<bd){bd=dd;best=mb;}}});if(best)b.target=best;}
      b.wt-=dt;if(b.wt<=0){b.wt=3+rnd()*5;b.tx=b.x+(rnd()-.5)*160;b.ty=b.y+(rnd()-.5)*120;}
      const vx=b.tx-b.x,vy=b.ty-b.y,L=Math.hypot(vx,vy);if(L>4){const ox=b.x,oy=b.y;walk(b,vx/L*60*dt,vy/L*60*dt,false);if(b.x===ox&&b.y===oy)b.wt=0;b.face=vx>0?1:-1;b.f=((animT*7)|0)%2;}else b.f=0;}
    else{const t=b.target,d=dist(t,b);if(d>20){walk(b,(t.x-b.x)/d*70*dt,(t.y-b.y)/d*70*dt,false);b.face=t.x>b.x?1:-1;b.f=((animT*8)|0)%2;}
      else if(b.atkT<=0){b.atkT=1.1;t.hp-=Math.max(1,Math.round(b.lv*3*b.b.pw*(.8+rnd()*.4)-t.lv));t.hitT=.12;G.fx.push({k:'burst',x:t.x,y:t.y-8,t:0,life:.25,col:b.b.sect.col,r:8});if(t.hp<=0){t.hp=0;t.deadT=0;if(t.zi>=0)setTimeout(()=>{if(G.map&&G.map.zones[t.zi])spawnZone(t.zi);},8000);}}}});
  // kênh thế giới
  chatT-=dtRaw;if(chatT<=0){chatT=7+rnd()*12;const all=G.allBots();const b=all[(rnd()*all.length)|0];const l=G.CHAT_LINES[(rnd()*G.CHAT_LINES.length)|0];G.ui.chat(b.name,l[0],l[1],b.sect.col);
    const vis=G.bots[(rnd()*G.bots.length)|0];if(vis&&rnd()<.5){vis.say={zh:l[0],vi:l[1],t:3.5};}}
  // boss thế giới
  wbCheck-=dtRaw;if(wbCheck<=0){wbCheck=20;if(m.worldBoss&&G.worldBossNow()&&S.wbDay[today()]!==1)G.spawnWorldBoss();if(!G.worldBossNow())G.mobs=G.mobs.filter(x=>!x.wb||x.st==='chase');
    const want=G.isNight()?'night':G.REGIONS[m.id].music;const boss=G.mobs.find(x=>x.boss&&x.hp>0&&x.st==='chase');G.audio.music(boss?'boss':want);}
  // fx
  G.fx.forEach(f=>{f.t+=dtRaw;if(f.k==='warn'&&f.t>=f.life&&f.cb&&!f.done){f.done=1;f.cb(f);}});G.fx=G.fx.filter(f=>f.t<f.life);
  G.texts.forEach(t=>{t.t+=dtRaw;t.y-=dtRaw*22;});G.texts=G.texts.filter(t=>t.t<t.life);
  // npc
  G.npcs.forEach(n=>{n.f=((animT*1.5+n.x)|0)%2;});
  // hành động theo ngữ cảnh
  G.ui.setAction(contextAction());
  saveT-=dtRaw;if(saveT<=0){saveT=10;G.save();}
};
// ---------- HÀNH ĐỘNG THEO NGỮ CẢNH ----------
function nearWater(){const P=G.P,m=G.map;const tx=P.x/T|0,ty=P.y/T|0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(m.isWater(tx+dx,ty+dy))return true;}return false;}
function landNear(){const P=G.P,m=G.map;const tx=P.x/T|0,ty=P.y/T|0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!m.blocked(tx+dx,ty+dy,false))return {x:tx+dx,y:ty+dy};}return null;}
function contextAction(){const P=G.P,m=G.map;let best=null,bd=30;
  G.npcs.forEach(n=>{const d=Math.hypot(n.x-P.x,n.y-P.y);if(d<bd){bd=d;best=n;}});
  if(best){const q=G.curQuest();const mark=q&&q.npc===best.id&&(G.S.q.st!=='active')?' ❗':'';return {zh:'说话',vi:best.vi+mark,fn:()=>G.ui.dialog(best)};}
  for(const c of m.chests){if(Math.hypot(c.x*T+T/2-P.x,c.y*T+T/2-P.y)<26){const key=m.id+c.x+','+c.y;if(G.S.chestDay[key]===today())return {zh:'空',vi:'Rương trống (mai quay lại)',fn:()=>{}};return {zh:'开箱',vi:'Mở rương báu',fn:()=>{G.S.chestDay[key]=today();const it=G.makeItem(G.S.lv+2,3,.5);G.gainItem(it);G.addBac(100*G.S.lv,P.x,P.y);G.audio.sfx('level');}};}}
  for(const s of m.stoves){if(Math.hypot(s.x-P.x,s.y-8-P.y)<30&&!P.boat)return {zh:'做饭',vi:'Nấu ăn',fn:()=>G.ui.open('cook')};}
  if(!P.boat)for(const d of m.docks){if(Math.hypot(d.x*T+T/2-P.x,d.y*T+T/2-P.y)<24)return {zh:'上船',vi:'Lên thuyền',fn:()=>{const tx=d.x+1;P.x=tx*T+T/2;P.y=d.y*T+T/2;P.boat=true;G.audio.sfx('splash');G.questEvent('sail',{});G.ui.toast('⛵ Ra khơi! Lái thuyền tới các đảo. Đến gần bờ để <b>Lên bờ</b>');}};}
  if(P.boat){const l=landNear();if(l){const t=m.get(l.x,l.y);if(t==='sand'||t==='wood'||t==='grass'||t==='dirt'||t==='stone')return {zh:'上岸',vi:'Lên bờ',fn:()=>{P.boat=false;P.x=l.x*T+T/2;P.y=l.y*T+T/2;G.audio.sfx('splash');}};}}
  if(nearWater()||P.boat)return {zh:'钓鱼',vi:'Câu cá',fn:()=>G.ui.fishing()};
  return null;}

// ---------- VẼ ----------
const cv=document.getElementById('game');const ctx=cv.getContext('2d');let W=0,H=0,DPR=1,SC=3;
const dark=document.createElement('canvas');const dctx=dark.getContext('2d');
G.resize=function(){DPR=Math.min(2,window.devicePixelRatio||1);W=cv.width=Math.round(cv.clientWidth*DPR);H=cv.height=Math.round(cv.clientHeight*DPR);SC=Math.max(2,Math.floor(Math.min(W,H)/(13*T)));dark.width=Math.ceil(W/4);dark.height=Math.ceil(H/4);ctx.imageSmoothingEnabled=false;};
let rain=[];for(let i=0;i<120;i++)rain.push({x:rnd(),y:rnd(),s:.6+rnd()*.6});
G.render=function(){const P=G.P,m=G.map;if(!m)return;ctx.imageSmoothingEnabled=false;
  const vw=W/SC,vh=H/SC;let cx=clamp(P.x-vw/2,0,Math.max(0,m.w*T-vw)),cy=clamp(P.y-vh/2,0,Math.max(0,m.h*T-vh));
  if(G.shake>0){cx+=(rnd()-.5)*6;cy+=(rnd()-.5)*6;}cx=Math.round(cx*SC)/SC;cy=Math.round(cy*SC)/SC;G.cam={x:cx,y:cy,vw,vh,SC,DPR};
  ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#174a6e';ctx.fillRect(0,0,W,H);
  ctx.setTransform(SC,0,0,SC,-cx*SC,-cy*SC);
  ctx.drawImage(m.ground,0,0);
  // nước động
  const fr=((G.anim*2.5)|0)%3;const tx0=Math.max(0,cx/T|0),ty0=Math.max(0,cy/T|0),tx1=Math.min(m.w-1,((cx+vw)/T|0)+1),ty1=Math.min(m.h-1,((cy+vh)/T|0)+1);
  for(let ty=ty0;ty<=ty1;ty++)for(let tx=tx0;tx<=tx1;tx++){const t=m.t[ty*m.w+tx];if(G.tileAnim[t]&&fr){ctx.drawImage(G.TILES[t][fr],tx*T,ty*T);}}
  // cổng
  m.portals.forEach(p=>{const x=p.x*T+T/2,y=p.y*T+T/2;const lock=p.need&&!G.S.bosses[p.need];ctx.globalAlpha=.55+Math.sin(G.anim*3)*.2;ctx.fillStyle=lock?'#ff5d5d':'#7fe0ff';ctx.beginPath();ctx.ellipse(x,y,12,6,0,0,7);ctx.fill();ctx.globalAlpha=1;});
  // danh sách vẽ theo y
  const L=[];const inV=(x,y,pad)=>x>cx-pad&&x<cx+vw+pad&&y>cy-pad&&y<cy+vh+pad+40;
  m.objs.forEach(o=>{if(inV(o.x,o.y,80))L.push({y:o.y,d:()=>{const im=G.OBJ[o.o];ctx.drawImage(im,Math.round(o.x-im.width/2),Math.round(o.y-im.height));}});});
  m.chests.forEach(c=>{const x=c.x*T+T/2,y=c.y*T+T;const key=m.id+c.x+','+c.y;if(G.S.chestDay[key]!==today())L.push({y,d:()=>{ctx.drawImage(G.OBJ.chest,x-8,y-14);}});});
  G.npcs.forEach(n=>{if(inV(n.x,n.y,30))L.push({y:n.y,d:()=>{const im=G.drawPerson(n.art,n.f);ctx.drawImage(im,Math.round(n.x-8),Math.round(n.y-24));}});});
  G.drops.forEach(d=>L.push({y:d.y,d:()=>{const b=Math.sin(G.anim*6+d.x)*1.5;if(d.bac){ctx.fillStyle='#ffd27a';ctx.fillRect(d.x-3,d.y-5+b,6,4);ctx.fillStyle='#b8862e';ctx.fillRect(d.x-2,d.y-4+b,4,1);}
    else if(d.item){const c=G.RARITY[d.item.r].col;ctx.globalAlpha=.5;ctx.fillStyle=c==='rainbow'?`hsl(${G.anim*200%360},90%,60%)`:c;ctx.fillRect(d.x-7,d.y-14+b,14,14);ctx.globalAlpha=1;ctx.drawImage(G.drawItemIcon(d.item.slot,c),d.x-7,d.y-14+b);}
    else{ctx.fillStyle=d.stone?'#7fe0ff':'#d98a6a';ctx.fillRect(d.x-3,d.y-6+b,6,5);}}}));
  G.mobs.forEach(mb=>{if(!inV(mb.x,mb.y,60))return;L.push({y:mb.y,d:()=>{const im=G.drawMob(mb.base.art,mb.f,mb.tint);const a=mb.hp<=0?1-mb.deadT/.6:1;ctx.globalAlpha=Math.max(0,a);
    const sh=mb.boss?1:1;ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(mb.x,mb.y,im.width*.32,3,0,0,7);ctx.fill();
    ctx.save();ctx.translate(Math.round(mb.x+(mb.lunge>0?mb.face*3:0)),Math.round(mb.y));if(mb.face<0)ctx.scale(-1,1);if(mb.water){ctx.globalAlpha*=.92;}
    ctx.drawImage(im,-im.width/2,-im.height+2);if(mb.hitT>0){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.6;ctx.drawImage(im,-im.width/2,-im.height+2);}ctx.restore();
    if(mb.tier>=3||mb.boss){ctx.globalAlpha=.35+Math.sin(G.anim*4)*.15;ctx.strokeStyle=mb.boss?'#ff5d5d':G.MOB_TIER[mb.tier].col;ctx.beginPath();ctx.ellipse(mb.x,mb.y,im.width*.45,5,0,0,7);ctx.stroke();}ctx.globalAlpha=1;}});});
  G.bots.forEach(b=>{if(!inV(b.x,b.y,30))return;L.push({y:b.y,d:()=>{const im=G.drawPerson('bot'+b.b.sect.id,b.f,b.b.sect.col,'#c3c8d0');ctx.save();ctx.translate(Math.round(b.x),Math.round(b.y));if(b.face<0)ctx.scale(-1,1);ctx.drawImage(im,-8,-24);ctx.restore();}});});
  const k=G.pk;if(k&&k.hp>0)L.push({y:k.y,d:()=>{const im=G.drawPerson('pk',k.f,'#5a1414','#ff5d5d');ctx.save();ctx.translate(Math.round(k.x+(k.lunge>0?k.face*3:0)),Math.round(k.y));if(k.face<0)ctx.scale(-1,1);ctx.drawImage(im,-8,-24);if(k.hitT>0){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.6;ctx.drawImage(im,-8,-24);}ctx.restore();ctx.globalAlpha=.4;ctx.strokeStyle='#ff3b30';ctx.beginPath();ctx.ellipse(k.x,k.y,9,3,0,0,7);ctx.stroke();ctx.globalAlpha=1;}});
  // Shiba
  const sb=G.shiba;if(!P.boat)L.push({y:sb.y,d:()=>{const im=G.drawShiba(sb.f,sb.sit);ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(sb.x,sb.y,7,2,0,0,7);ctx.fill();ctx.save();ctx.translate(Math.round(sb.x),Math.round(sb.y));if((sb.face||1)<0)ctx.scale(-1,1);ctx.drawImage(im,-9,-13);ctx.restore();}});
  // Takd
  L.push({y:P.y,d:()=>{const flick=P.inv>0&&((G.anim*30)|0)%2;if(flick)ctx.globalAlpha=.6;
    if(P.boat){const im=G.drawPlayerBoat(((G.anim*2)|0)%2);ctx.save();ctx.translate(Math.round(P.x),Math.round(P.y));if(P.face<0)ctx.scale(-1,1);ctx.drawImage(im,-22,-22);ctx.restore();ctx.globalAlpha=1;return;}
    const w=G.S.equip.weapon;const glow=w&&w.e>=10?'#ffd84a':w&&w.e>=7?'#7fe0ff':null;const ar=G.S.equip.armor;const acol=ar?(['#8a3a24','#2f6f62','#2b4a8a','#6b2f8a','#b8602a','#b3261e','#c9a022','#b3261e'][ar.r]):'#8a3a24';
    const im=G.drawTakd(P.f,P.swing>0?1:0,1,acol,glow);ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(P.x,P.y,14,4,0,0,7);ctx.fill();
    if(P.buffs.kim>0){ctx.globalAlpha=.25+Math.sin(G.anim*8)*.1;ctx.fillStyle='#ffe08a';ctx.beginPath();ctx.ellipse(P.x,P.y-16,20,24,0,0,7);ctx.fill();ctx.globalAlpha=1;}
    ctx.save();ctx.translate(Math.round(P.x),Math.round(P.y));if(P.face<0)ctx.scale(-1,1);ctx.drawImage(im,-18,-38);ctx.restore();ctx.globalAlpha=1;}});
  L.sort((a,b)=>a.y-b.y);L.forEach(o=>o.d());
  // hiệu ứng
  G.fx.forEach(f=>{if(f.t<0)return;const p=f.t/f.life;ctx.save();
    if(f.k==='ring'){ctx.globalAlpha=1-p;ctx.strokeStyle=f.col;ctx.lineWidth=3*(1-p)+1;ctx.beginPath();ctx.ellipse(f.x,f.y,f.r0+(f.r1-f.r0)*p,(f.r0+(f.r1-f.r0)*p)*.55,0,0,7);ctx.stroke();}
    else if(f.k==='burst'){ctx.globalAlpha=1-p;ctx.fillStyle=f.col;for(let i=0;i<8;i++){const a=i/8*6.28;const r=f.r*p+3;ctx.fillRect(f.x+Math.cos(a)*r-1.5,f.y+Math.sin(a)*r-1.5,3,3);}ctx.globalAlpha=(1-p)*.6;ctx.beginPath();ctx.arc(f.x,f.y,f.r*(1-p)*.6+2,0,7);ctx.fill();}
    else if(f.k==='slash'){ctx.globalAlpha=1-p;ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(f.x,f.y,10,-1.2*f.face+(f.face<0?Math.PI:0),.6*f.face+(f.face<0?Math.PI:0));ctx.stroke();}
    else if(f.k==='bolt'){ctx.globalAlpha=1-p;ctx.strokeStyle='#cfe8ff';ctx.lineWidth=2;ctx.beginPath();let x=f.x+(rnd()-.5)*4,y=f.y-80;ctx.moveTo(x,y);while(y<f.y){y+=10;x+=(rnd()-.5)*10;ctx.lineTo(x,y);}ctx.stroke();ctx.fillStyle='#9fd0ff';ctx.globalAlpha=(1-p)*.5;ctx.beginPath();ctx.ellipse(f.x,f.y,14,6,0,0,7);ctx.fill();}
    else if(f.k==='warn'){ctx.globalAlpha=.25+.35*p;ctx.fillStyle='#ff3b30';ctx.beginPath();ctx.ellipse(f.x,f.y,f.r*p,f.r*p*.55,0,0,7);ctx.fill();ctx.globalAlpha=.8;ctx.strokeStyle='#ff5d5d';ctx.beginPath();ctx.ellipse(f.x,f.y,f.r,f.r*.55,0,0,7);ctx.stroke();}
    else if(f.k==='dust'){ctx.globalAlpha=(1-p)*.5;ctx.fillStyle='#d8c49a';ctx.beginPath();ctx.arc(f.x,f.y,3+p*5,0,7);ctx.fill();}
    ctx.restore();});
  // mưa
  const raining=G.raining();
  // bóng tối & ánh đèn
  ctx.setTransform(1,0,0,1,0,0);
  const dk=G.darkness()+(raining?.12:0);
  if(dk>0.01){dctx.setTransform(1,0,0,1,0,0);dctx.globalCompositeOperation='source-over';dctx.clearRect(0,0,dark.width,dark.height);dctx.fillStyle=`rgba(10,14,40,${dk})`;dctx.fillRect(0,0,dark.width,dark.height);
    dctx.globalCompositeOperation='destination-out';const sx=SC/4;const light=(x,y,r,a)=>{const X=(x-cx)*sx,Y=(y-cy)*sx;const g=dctx.createRadialGradient(X,Y,0,X,Y,r*sx);g.addColorStop(0,`rgba(0,0,0,${a})`);g.addColorStop(1,'rgba(0,0,0,0)');dctx.fillStyle=g;dctx.fillRect(X-r*sx,Y-r*sx,r*2*sx,r*2*sx);};
    light(P.x,P.y-10,80,.9);m.objs.forEach(o=>{if((o.o==='lantern'||o.o==='stove')&&inV(o.x,o.y,100))light(o.x,o.y-20,58,.85);});G.fx.forEach(f=>{if(f.k!=='warn')light(f.x,f.y,40,.6);});
    ctx.imageSmoothingEnabled=true;ctx.drawImage(dark,0,0,W,H);ctx.imageSmoothingEnabled=false;
    ctx.globalCompositeOperation='lighter';m.objs.forEach(o=>{if(o.o==='lantern'&&inV(o.x,o.y,60)){const X=(o.x-cx)*SC,Y=(o.y-22-cy)*SC;const g=ctx.createRadialGradient(X,Y,0,X,Y,30*SC);g.addColorStop(0,`rgba(255,170,80,${.25*dk})`);g.addColorStop(1,'rgba(255,170,80,0)');ctx.fillStyle=g;ctx.fillRect(X-30*SC,Y-30*SC,60*SC,60*SC);}});ctx.globalCompositeOperation='source-over';}
  if(raining){ctx.strokeStyle='rgba(180,200,230,.45)';ctx.lineWidth=DPR;ctx.beginPath();rain.forEach(r=>{r.y+=.018*r.s;r.x-=.004*r.s;if(r.y>1){r.y=0;r.x=rnd()*1.2;}const X=r.x*W,Y=r.y*H;ctx.moveTo(X,Y);ctx.lineTo(X-4*DPR,Y+14*DPR);});ctx.stroke();}
  // nhãn tên, thanh máu, chữ nổi (tọa độ màn hình cho sắc nét)
  const S2=(x,y)=>[(x-cx)*SC,(y-cy)*SC];const fs=Math.round(10*DPR);
  const label=(x,y,txt,col,sub)=>{const [X,Y]=S2(x,y);ctx.font=`600 ${fs}px "Be Vietnam Pro",system-ui,sans-serif`;ctx.textAlign='center';ctx.lineWidth=3*DPR;ctx.strokeStyle='rgba(0,0,0,.75)';ctx.strokeText(txt,X,Y);ctx.fillStyle=col;ctx.fillText(txt,X,Y);
    if(sub){ctx.font=`500 ${Math.round(8.5*DPR)}px "Be Vietnam Pro",system-ui,sans-serif`;ctx.strokeText(sub,X,Y+fs);ctx.fillStyle='#e8dcc0';ctx.fillText(sub,X,Y+fs);}};
  const bar=(x,y,w,p,col)=>{const [X,Y]=S2(x,y);const ww=w*SC;ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(X-ww/2-1,Y-1,ww+2,4*DPR+2);ctx.fillStyle=col;ctx.fillRect(X-ww/2,Y,ww*Math.max(0,p),4*DPR);};
  G.npcs.forEach(n=>{if(inV(n.x,n.y,30)){const q=G.curQuest();label(n.x,n.y-28,n.zh+' '+n.vi,'#ffe6a0');if(q&&q.npc===n.id&&G.S.q.st!=='active'){const [X,Y]=S2(n.x,n.y-40);ctx.font=`900 ${fs*1.6}px system-ui`;ctx.fillStyle=G.S.q.st==='done'?'#9fe07a':'#ffd84a';ctx.fillText(G.S.q.st==='done'?'?':'!',X,Y+Math.sin(G.anim*4)*3*DPR);}}});
  G.mobs.forEach(mb=>{if(mb.hp<=0||!inV(mb.x,mb.y,40))return;const im=G.drawMob(mb.base.art,0,mb.tint);const top=mb.y-im.height-4;if(mb.boss){label(mb.x,top-6,`${mb.name.zh} ${mb.name.vi}`,'#ff8a7a',`Lv ${mb.lv} · BOSS`);bar(mb.x,top-2,40,mb.hp/mb.max,'#e0412f');}
    else{label(mb.x,top-2,mb.name.zh+' Lv'+mb.lv,mb.tier?G.MOB_TIER[mb.tier].col:'#f0e6d0');if(mb.hp<mb.max)bar(mb.x,top+1,18,mb.hp/mb.max,'#e0412f');}});
  G.bots.forEach(b=>{if(!inV(b.x,b.y,30))return;label(b.x,b.y-28,b.b.name+' Lv'+b.lv,b.b.sect.col);if(b.say&&b.say.t>0)bubble(b.x,b.y-40,b.say);});
  if(k&&k.hp>0){label(k.x,k.y-28,'⚔ '+k.b.name+' Lv'+k.lv,'#ff5d5d');bar(k.x,k.y-26,20,k.hp/k.max,'#e0412f');}if(k&&k.say&&k.say.t>0)bubble(k.x,k.y-42,k.say);
  m.portals.forEach(p=>{const x=p.x*T+T/2,y=p.y*T;if(inV(x,y,40))label(x,y-6,(p.need&&!G.S.bosses[p.need]?'🔒 ':'➜ ')+p.zh,'#7fe0ff',p.vi);});
  G.texts.forEach(t=>{const [X,Y]=S2(t.x,t.y);ctx.globalAlpha=1-t.t/t.life;ctx.font=`800 ${Math.round((t.big?14:11)*DPR)}px "Be Vietnam Pro",system-ui,sans-serif`;ctx.textAlign='center';ctx.lineWidth=3*DPR;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText(t.txt,X,Y);ctx.fillStyle=t.col;ctx.fillText(t.txt,X,Y);ctx.globalAlpha=1;});
  G.fx.forEach(f=>{if(f.k==='flash'&&f.t>0){ctx.globalAlpha=(1-f.t/f.life)*.5;ctx.fillStyle='#fff3c4';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;}});
  function bubble(x,y,s){const [X,Y]=S2(x,y);ctx.font=`600 ${Math.round(12*DPR)}px "Noto Sans SC",system-ui,sans-serif`;const w1=ctx.measureText(s.zh).width;ctx.font=`500 ${Math.round(9*DPR)}px "Be Vietnam Pro",system-ui`;const w2=ctx.measureText(s.vi).width;const w=Math.max(w1,w2)+12*DPR,h=30*DPR;
    ctx.fillStyle='rgba(250,242,222,.95)';ctx.beginPath();ctx.roundRect?ctx.roundRect(X-w/2,Y-h,w,h,6*DPR):ctx.rect(X-w/2,Y-h,w,h);ctx.fill();ctx.fillStyle='#1a1210';ctx.textAlign='center';ctx.font=`600 ${Math.round(12*DPR)}px "Noto Sans SC",system-ui,sans-serif`;ctx.fillText(s.zh,X,Y-h+13*DPR);ctx.font=`500 ${Math.round(9*DPR)}px "Be Vietnam Pro",system-ui`;ctx.fillStyle='#5a4636';ctx.fillText(s.vi,X,Y-5*DPR);}
};

// ---------- ỦY THÁC (treo máy offline) ----------
G.offline=function(){const S=G.S;const mins=Math.min(480,Math.floor((now()-S.lastTs)/60000));if(mins<5)return null;return {mins,exp:Math.round(mins*S.lv*2.2+mins*4),bac:Math.round(mins*(1+S.lv*.6))};};

// ---------- VÒNG LẶP ----------
let last=0;function loop(t){const dt=Math.min(.05,(t-last)/1000||0);last=t;try{if(!G.paused)G.update(dt);G.render();G.ui.hud();}catch(e){console.error(e);}requestAnimationFrame(loop);}
G.start=function(){G.resize();window.addEventListener('resize',G.resize);const S=G.S;const st=G.stats();G.P.hp=S.hp||st.hp;G.P.mp=S.mp||st.mp;G.enterMap(S.map||'kimlien',null,S.boat);requestAnimationFrame(loop);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)G.save();});window.addEventListener('pagehide',G.save);};
})();
