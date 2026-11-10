// ===== Cơ chế kiểu Kiếm Thế: cưỡi ngựa, chạy/đi, thể lực, ngồi thiền, nộ khí, tự động chiến đấu, chạm để đi, trạng thái PK =====
(function(){
const T=G.T, dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
G.PKMODES=[['luyen','练功','Luyện công','#7ed37a'],['phe','阵营','PK phe','#5aa8ff'],['bang','帮会','PK bang','#ffd84a'],['dosat','屠杀','Đồ sát','#ff5d5d']];
function S(){return G.S;}
G.initExtra=function(){const s=S();G.storyInit();if(s.mounted==null)s.mounted=!!s.gear.horse;if(!s.gear.horse)s.mounted=false;if(s.run==null)s.run=true;if(!s.pkMode)s.pkMode='luyen';if(s.sp==null)s.sp=100;if(!s.slots)s.slots=['s0','s1','s2','s3','s4','s5','kimsang','hoikhi','food'];
  if(!s.food)s.food={};if(s.food.kimsang==null)s.food.kimsang=3;if(s.food.hoikhi==null)s.food.hoikhi=2;G.P.rage=G.P.rage||0;};
G.speedMul=function(){const s=S();if(G.P.boat)return 1;if(s.meditate)return 0;if(s.mounted)return 1.3;return s.run&&s.sp>0?1:0.55;};
G.toggleMount=function(){const s=S();if(G.P.boat)return;if(!s.gear.horse){G.ui.toast('Chưa có ngựa – làm nhiệm vụ ở Phu dịch trạm để được tặng ngựa');return;}s.mounted=!s.mounted;s.meditate=false;G.audio.sfx(s.mounted?'bark':'click');G.ui.toast(s.mounted?'🐎 Lên ngựa 上马':'Xuống ngựa 下马',1200);};
G.toggleRun=function(){const s=S();s.run=!s.run;G.ui.toast(s.run?'Chạy 跑':'Đi bộ 走',1000);};
G.toggleMeditate=function(){const s=S();if(G.P.boat)return;if(G.mobs.some(m=>m.hp>0&&m.st==='chase'&&dist(m,G.P)<160)){G.ui.toast('Đang bị tấn công, không thể ngồi thiền');return;}s.meditate=!s.meditate;if(s.meditate){s.mounted=false;G.autoStop&&G.autoStop();G.ui.toast('🧘 Ngồi thiền 打坐 – hồi nhanh sinh lực, nội lực, thể lực',2200);}};
G.toggleAuto=function(){const s=S();s.autoFight=!s.autoFight;G.chase=null;if(G.autoStop)G.autoStop();G.ui.toast(s.autoFight?'⚔ Bật tự động chiến đấu 自动战斗':'Tắt tự động chiến đấu',1500);};
G.setPK=function(id){S().pkMode=id;const m=G.PKMODES.find(x=>x[0]===id);G.ui.toast(`Trạng thái: <b style="color:${m[3]}">${m[2]}</b> ${m[1]}`,1500);};
G.useItem=function(id){const s=S();if(id==='food'){const best=['zongzi','yutang','kaoyu','mifan'].find(k=>s.food[k]>0);if(!best){G.ui.toast('Chưa có thức ăn – câu cá rồi nấu ở bếp');return;}id=best;}
  if(!s.food[id]){G.ui.toast('Hết rồi – mua ở Thầy lang 郎中');return;}const r=(G.POTIONS||[]).find(x=>x.id===id)||G.RECIPES.find(x=>x.id===id);if(!r)return;s.food[id]--;const st=G.stats();
  if(r.heal)G.P.hp=Math.min(st.hp,G.P.hp+st.hp*r.heal);if(r.mp)G.P.mp=Math.min(st.mp,G.P.mp+st.mp*r.mp);if(r.buff)G.P.buffs.atk=180;G.audio.sfx('right');G.float(G.P.x,G.P.y-30,r.zh,'#9fe07a');};
// ---- nộ khí: combo 3 câu ----
G.rageMax=100;G.addRage=function(n){G.P.rage=Math.min(G.rageMax,(G.P.rage||0)+n);};
// ---- chạm để đi / nhắm mục tiêu ----
G.tapGround=function(x,y){if(G.paused)return;const s=S();s.meditate=false;G.chase=null;const m=G.map,P=G.P;const tx=x/T|0,ty=y/T|0;
  if(m.blocked(tx,ty,!!P.boat)){return;}const path=G.findPath(m,P.x/T|0,P.y/T|0,tx,ty,!!P.boat,90000);if(path)G.auto={path,i:0,goal:null};else G.ui.toast('Không tìm được đường');};
G.tapNpc=function(n){if(G.paused)return;S().meditate=false;G.chase=null;if(dist(n,G.P)<56){G.ui.dialog(n);return;}const m=G.map,P=G.P;const nx=n.x/T|0,ny=n.y/T|0;let path=null;
  for(const [dx,dy] of [[0,0],[0,1],[1,0],[-1,0],[0,-1],[1,1],[-1,1],[0,2],[2,0],[-2,0]]){if(m.blocked(nx+dx,ny+dy))continue;path=G.findPath(m,P.x/T|0,P.y/T|0,nx+dx,ny+dy,false,60000);if(path)break;}
  if(path)G.auto={path,i:0,goal:{kind:'npc',npc:n.id,x:n.x,y:n.y}};else G.ui.toast('Không tìm được đường tới '+n.vi);};
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
  if(!G.target){const b=G.mobs.find(m=>m.boss&&m.hp>0&&m.st==='chase');if(b)G.target=b;}
  G.extUpdate4&&G.extUpdate4(dt);};
// ===== HÀNH TRÌNH TỪ TAY TRẮNG =====
G.RANKS=[['农夫','nóngfū','Nông phu'],['武生','wǔshēng','Võ sinh'],['侠客','xiákè','Hiệp khách'],['掌门','zhǎngmén','Chưởng môn'],['城主','chéngzhǔ','Thành chủ'],['镇守','zhènshǒu','Trấn thủ'],['王','wáng','Vương'],['霸主','bàzhǔ','Bá chủ thiên hạ']];
G.GEAR={shiba:['柴犬','Chó Shiba','🐕'],staff:['竹棍','Gậy tre','🎋'],armor:['铠甲','Giáp trụ','🛡️'],horse:['战马','Chiến mã','🐎'],mace:['铜锤','Chùy đồng','🔨']};
G.storyInit=function(){const s=S();if(!s.v2){// bản cũ: bắt đầu lại hành trình, giữ tiến độ học
    s.v2=1;s.q={i:0,st:'new',p:0};s.gear={shiba:1};s.rank=0;s.conq={};s.taxTs={};s.bosses={};s.unlocked={kimlien:1};s.mounted=false;s.map='kimlien';s.x=null;s.y=null;s.equip=s.equip||{};}
  s.gear=s.gear||{};s.gear.shiba=1;if(!s.v3){s.v3=1;s.settings.quiz='off';if(s.pkMode&&s.pkMode!=='luyen')s.pkMode='luyen';}s.settings.quiz='off';s.rank=s.rank||0;s.rads=s.rads||{};s.gems=s.gems||{};s.lexi=s.lexi||{};s.conq=s.conq||{};s.taxTs=s.taxTs||{};s.cards=s.cards||{};};
G.rankName=function(){const r=G.RANKS[S().rank||0];return r[2];};
G.playerKind=function(){const g=S().gear||{};if(!g.armor)return g.staff||g.mace?'takd1':'takd0';return g.mace?'takd':'takd2';};
G.npcCond=function(c,mapId){const s=S();if(c==='noShiba')return !(s.gear&&s.gear.shiba);if(c==='conq')return !!(s.conq&&s.conq[mapId]);return true;};
// chỉ số theo trang bị câu chuyện
const _stats=G.stats;G.stats=function(){const st=_stats();const g=(S()&&S().gear)||{};
  if(g.mace){st.atk+=10;st.crit+=3;}else if(g.staff)st.atk+=3;else st.atk=Math.round(st.atk*0.85);if(g.armor){st.def+=6;st.hp+=40;}return st;};
// phần thưởng: trang bị câu chuyện, danh hiệu
const _give=G.giveReward;G.giveReward=function(r){_give(r);if(!r)return;const s=S();
  if(r.gear&&!s.gear[r.gear]){s.gear[r.gear]=1;const g=G.GEAR[r.gear];G.ui.toast(`${g[2]} Nhận được <b>${g[1]}</b> <span class="zs">${g[0]}</span>`,3500);G.audio.sfx('gong');
    if(r.gear==='horse'){s.mounted=true;}if(r.gear==='shiba'){G.shiba.x=G.P.x-20;G.shiba.y=G.P.y;}G.save();}
  if(r.rank!=null&&r.rank>(s.rank||0))G.setRank(r.rank);};
G.setRank=function(n){const s=S();s.rank=n;const r=G.RANKS[n];G.ui.big&&G.ui.big('Thăng danh hiệu',r[2],r[0]+' '+r[1]);G.ui.toast(`🎖️ Danh hiệu mới: <b>${r[2]}</b> <span class="zs">${r[0]} ${r[1]}</span>`,4000);G.audio.sfx('gong');G.audio.say(r[0]);};
// ===== CHIẾM THÀNH =====
G.TAX={kimlien:30,thanglong:80,coloa:100,vandon:120};
G.conquer=function(id){const s=S();if(s.conq[id])return;s.conq[id]=Date.now();s.taxTs[id]=Date.now();const reg=G.REGIONS[id];
  G.ui.big&&G.ui.big('Chiếm được',reg.vi,'占领 '+reg.zh);G.ui.toast(`🚩 Cờ Muay Việt đã cắm trên <b>${reg.vi}</b>!<br>Mỗi giờ thu <b>${G.TAX[id]||30} lượng</b> thuế – gặp ${(G.npcs.find(n=>n.role==='tax')||{vi:'trưởng làng'}).vi} để thu.`,5000);
  if((s.rank||0)<4)G.setRank(4);G.audio.say('占领'+reg.zh);
  // lính về theo
  (G.NPCS[id]||[]).filter(n=>n.cond==='conq').forEach(n=>{if(!G.npcs.find(x=>x.id===n.id))G.npcs.push(Object.assign({},n,{x:n.x*T+T/2,y:n.y*T+T/2,f:0}));});G.save();};
G.taxDue=function(id){const s=S();if(!s.conq[id])return 0;const h=Math.min(24,(Date.now()-(s.taxTs[id]||Date.now()))/36e5);return Math.floor(h*(G.TAX[id]||30));};
G.collectTax=function(id){const n=G.taxDue(id);if(n<1){G.ui.toast('Chưa đến kỳ thu thuế – quay lại sau');return 0;}S().taxTs[id]=Date.now();G.addBac(n,G.P.x,G.P.y);G.audio.sfx('coin');G.ui.toast(`💰 Thu thuế <b>${n} lượng</b> 收税 shōu shuì`);G.audio.say('收税');return n;};
const _spawnBoss=G.spawnBoss;G.spawnBoss=function(){if(G.map&&S().conq[G.map.id])return;_spawnBoss();};
// thủ lĩnh thách đấu: ở 66% và 33% máu phải trả lời câu hỏi, sai thì thủ lĩnh hồi máu
function bossChallenge(b){const steps=[.66,.33];b._ch=b._ch||0;if(b._ch>=steps.length||b.hp/b.max>steps[b._ch]||G.learn.active)return;b._ch++;
  G.ui.toast(`⚔️ <b>${b.name.vi}</b> thách đấu chữ nghĩa!`,1800);G.learn.quiz({skill:{zh:'挑战',vi:'Thủ lĩnh thách đấu',col:'#ff5d5d'},onDone:(ok)=>{if(ok){const d=Math.round(b.max*.08);b.hp-=d;G.float(b.x,b.y-40,'破 -'+d,'#ffd84a',true);if(b.hp<=0)G._kill(b);}else{b.hp=Math.min(b.max,b.hp+b.max*.15);G.float(b.x,b.y-40,'Hồi máu +15%','#ff5d5d',true);}}});}
// thẻ chữ rơi từ quái
G.gainCard=function(ch,x,y){const s=S();s.cards[ch]=(s.cards[ch]||0)+1;const c=G.CHARS[ch]||{};G.float(x,y-14,'🀄 '+ch,'#c78aff',true);G.ui.toast(`🀄 Thẻ chữ <b class="zh" style="font-size:20px">${ch}</b> ${c.py||''} – ${c.vi||''}`,2200);G.audio.say(ch);};
function cardPool(){const L=G.LESSONS||[];const done=Object.keys(S().lessons||{}).map(Number);const upto=Math.max(1,...done,0)+1;const set=new Set();L.filter(l=>l.n<=upto&&l.n<=15).forEach(l=>l.words.forEach(w=>[...w].forEach(c=>{if(G.CHARS[c])set.add(c);})));return [...set];}
G.cardDrop=function(t){if(t.boss||Math.random()>.14)return;const pool=cardPool();if(!pool.length)return;G.drops.push({x:t.x+(Math.random()-.5)*14,y:t.y+6,card:pool[(Math.random()*pool.length)|0]});};
// gắn vào vòng cập nhật
// ===== VÙNG AN TOÀN (trong làng, trong thành) =====
G.SAFE={kimlien:[['e',128,104,47,34]],thanglong:[['r',150,60,268,196]],coloa:[['e',192,108,80,64]],vandon:[]};
G.inSafe=function(x,y){const L=G.SAFE[G.map&&G.map.id]||[];const tx=x/T,ty=y/T;return L.some(z=>z[0]==='e'?((tx-z[1])/z[3])**2+((ty-z[2])/z[4])**2<1:tx>=z[1]&&tx<=z[3]&&ty>=z[2]&&ty<=z[4]);};
// ===== TUYỆT CHIÊU: viết đúng nét chữ đã học =====
function learnedChars(){const s=S();const set=new Set(Object.keys(s.chars||{}));(G.LESSONS||[]).forEach(l=>{if(s.lessons&&s.lessons[l.n]&&s.lessons[l.n].done&&G.learn.newChars)G.learn.newChars(l).forEach(c=>set.add(c));});
  let L=[...set].filter(c=>G.STROKES&&G.STROKES[c]);if(L.length<3)L=L.concat(['一','二','三','人','大','口','十','八'].filter(c=>G.STROKES&&G.STROKES[c]&&!L.includes(c)));return L;}
G.useRage=function(){if(G.paused)return;if((G.P.rage||0)<G.rageMax){G.ui.toast('Nộ khí chưa đầy – đánh quái để tích nộ ('+Math.round(G.P.rage||0)+'%)');return;}
  const pool=learnedChars();const c=pool[(Math.random()*pool.length)|0];const info=G.CHARS[c]||{};G.paused=true;G.P.move={x:0,y:0};
  let ov=document.getElementById('ultw');if(!ov){ov=document.createElement('div');ov.id='ultw';document.body.appendChild(ov);}
  ov.innerHTML=`<div class="uw-box"><div class="uw-h">🔥 TUYỆT CHIÊU · Việt Hồn Phá</div><div class="uw-s">Viết đúng nét chữ: <b>${info.py||''}</b> – ${info.vi||''}</div><div id="uw-pad"></div><div class="uw-m" id="uw-m">Viết từng nét theo nét mờ</div><button class="btn ghost" id="uw-x">Bỏ qua (chưởng yếu)</button></div>`;ov.hidden=false;
  const pad=ov.querySelector('#uw-pad');const sz=Math.min(260,innerWidth-80);let miss=0,done=false;
  const w=HanziWriter.create(pad,c,{width:sz,height:sz,padding:10,showOutline:true,showCharacter:false,strokeColor:'#1a1210',outlineColor:'#cbb88c',drawingColor:'#b3261e',drawingWidth:Math.round(sz/10),highlightColor:'#d9a441',charDataLoader:(ch,ok,err)=>{const d=G.STROKES[ch];if(d)ok(d);else err&&err('x');}});
  const finish=(score)=>{if(done)return;done=true;ov.hidden=true;try{w.cancelQuiz();}catch(e){}G.paused=false;G.audio.say(c);fireUlt(score,c);};
  w.quiz({showHintAfterMisses:2,onMistake:()=>{miss++;ov.querySelector('#uw-m').textContent='Sai '+miss+' nét – thử lại';},onComplete:()=>{const sc=miss===0?3:miss<=2?2:1;ov.querySelector('#uw-m').innerHTML=['','Tạm được','Tốt!','<b>Hoàn hảo!</b>'][sc];setTimeout(()=>finish(sc),550);}});
  ov.querySelector('#uw-x').onclick=()=>finish(0);};
function fireUlt(score,c){const P=G.P;P.rage=0;const mult=[2.5,4,5.5,7][score];G.audio.sfx('thunder');G.shake=.7;G.hitStop=.12;G.float(P.x,P.y-50,`越魂破 ${c} ×${mult}`,'#ff5d5d',true);
  for(let k=0;k<4;k++)G.fx.push({k:'ring',x:P.x,y:P.y,r0:6,r1:170*(1-k*.18),t:-k*.1,life:.75,col:k%2?'#ffd84a':'#ff5d5d'});G.fx.push({k:'flash',t:0,life:.35});G.fx.push({k:'burst',x:P.x,y:P.y,t:0,life:.6,col:'#ff8a3a'});
  const st=G.stats();G.mobs.forEach(m=>{if(m.hp>0&&dist(m,P)<170){const d=Math.round(st.atk*mult*(0.9+Math.random()*.2));m.hp-=d;m.hitT=.25;m.aggro=true;m.st='chase';G.float(m.x,m.y-20,'暴击 '+d,'#ffd84a',true);G.fx.push({k:'burst',x:m.x,y:m.y,t:0,life:.4,col:'#ffd84a'});if(m.hp<=0)G._kill&&G._kill(m);}});
  if(G.pk&&G.pk.hp>0&&dist(G.pk,P)<170){G.pk.hp-=Math.round(st.atk*mult);}if(score===3){const s=S();s.stone+=1;G.ui.toast('✍️ Viết hoàn hảo chữ <b class="zh">'+c+'</b> · +1 Huyền tinh');}}
// ===== CẢM GIÁC ĐÁNH: khựng hình, tia lửa, bật lùi =====
G.onHit=function(t,d,crit){G.hitStop=Math.max(G.hitStop||0,crit?.085:.045);if(crit)G.shake=Math.max(G.shake||0,.18);G.fx.push({k:'burst',x:t.x,y:t.y-6,t:0,life:.28,col:crit?'#ffd84a':'#ffffff'});
  if(!t.boss){const a=Math.atan2(t.y-G.P.y,t.x-G.P.x);const kx=t.x+Math.cos(a)*(crit?12:7),ky=t.y+Math.sin(a)*(crit?12:7);if(!G.map.blocked(kx/T|0,ky/T|0,!!t.water)){t.x=kx;t.y=ky;}}};
// ===== THỜI TIẾT =====
G.WX={clear:{ic:'☀️',vi:'Trời nắng',zh:'晴天',py:'qíngtiān'},cloudy:{ic:'⛅',vi:'Nhiều mây',zh:'多云',py:'duōyún'},drizzle:{ic:'🌦️',vi:'Mưa phùn',zh:'下小雨',py:'xià xiǎoyǔ'},rain:{ic:'🌧️',vi:'Mưa rào',zh:'下雨了',py:'xià yǔ le'},
  storm:{ic:'⛈️',vi:'Giông bão',zh:'刮大风，打雷了',py:'guā dà fēng, dǎ léi le'},fog:{ic:'🌫️',vi:'Sương mù',zh:'有雾',py:'yǒu wù'},snow:{ic:'❄️',vi:'Tuyết rơi',zh:'下雪了',py:'xià xuě le'}};
const WXW=[['clear',30],['cloudy',22],['drizzle',13],['rain',12],['storm',7],['fog',9],['snow',5]];let wxT=0,thunderT=6;
G.weather={type:'clear',until:0,i:1};
G.setWeather=function(type,force){const mode=(S().settings.wxMode)||'auto';if(mode!=='auto')type=mode;if(!type){let r=Math.random()*100;type='clear';for(const [k,w] of WXW){if((r-=w)<0){type=k;break;}}}
  const prev=G.weather.type;G.weather={type,until:Date.now()+(4+Math.random()*5)*60000,i:prev===type?1:0};if(prev!==type&&(force||prev)){const w=G.WX[type];G.ui.toast(`${w.ic} ${w.vi} · <span class="zh">${w.zh}</span> <small>${w.py}</small>`,3500);G.audio.say(w.zh);G.lexiGain&&G.lexiGain('wx_'+type);}};
G.wxNow=function(){const w=G.weather,k=w.type,I=w.i;const ic=k==='clear'&&G.isNight()?'🌙':G.WX[k].ic;
  return {type:k,ic,rain:({drizzle:.35,rain:.8,storm:1})[k]*I||0,snow:(k==='snow'?1:0)*I,fog:((k==='fog'?1:k==='storm'?.25:0))*I,cloud:({cloudy:.4,drizzle:.5,rain:.7,storm:.9,fog:.45,snow:.55})[k]*I||0,wind:k==='storm'?1:0};};
G.raining=function(){const w=G.wxNow();return w.rain>0.2;};
// ===== mỗi khung (phần mở rộng) =====
let potT=0,greetT=0;
G.extUpdate4=function(dt){const s=S(),P=G.P;const st=G.stats();
  // thời tiết
  if(Date.now()>G.weather.until)G.setWeather();G.weather.i=Math.min(1,G.weather.i+dt/8);
  if(G.weather.type==='storm'){thunderT-=dt;if(thunderT<=0){thunderT=4+Math.random()*7;G.fx.push({k:'flash',t:0,life:.22});setTimeout(()=>G.audio.sfx('thunder'),300+Math.random()*700);}}
  // tự uống thuốc
  potT-=dt;if(potT<=0&&s.settings.autoPot!==0){if(P.hp<st.hp*.35&&s.food.kimsang>0){G.useItem('kimsang');potT=4;}else if(P.mp<st.mp*.15&&s.food.hoikhi>0){G.useItem('hoikhi');potT=4;}}
  // vùng an toàn: quái không đuổi vào làng/thành
  if(G.inSafe(P.x,P.y))G.mobs.forEach(m=>{if(!m.boss&&m.st==='chase')m.st='back';});
  // NPC chào hỏi khi đi ngang
  greetT-=dt;if(greetT<=0){greetT=1.2;const q=G.curQuest&&G.curQuest();G.npcs.forEach(n=>{const d=dist(n,P);n.sayCd=(n.sayCd||0)-1.2;if(d<70&&n.sayCd<=0&&n.art!=='board'){n.sayCd=45;const L=q&&q.npc===n.id&&s.q.st!=='active'?['我有事找你！','Tôi có việc nhờ cậu!']:NPCLINES[(Math.random()*NPCLINES.length)|0];n.say={zh:L[0],vi:L[1],t:3.5};}});}
  G.npcs.forEach(n=>{if(n.say)n.say.t-=dt;});};
const NPCLINES=[['你好！','Chào cậu!'],['今天天气怎么样？','Hôm nay thời tiết thế nào?'],['你吃饭了吗？','Cậu ăn cơm chưa?'],['小心森林里的狼！','Cẩn thận sói trong rừng!'],['你的狗真可爱。','Con chó của cậu dễ thương quá.'],['你去哪儿？','Cậu đi đâu đấy?'],['欢迎！','Hoan nghênh!']];
const prev=G.extUpdate;G.extUpdate=function(dt,dtRaw){prev&&prev(dt,dtRaw);G.extUpdate3(dt);};
})();
