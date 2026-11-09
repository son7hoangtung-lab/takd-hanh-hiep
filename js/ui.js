// ===== GIAO DIỆN: HUD, bảng, hội thoại, điều khiển =====
(function(){
const U = G.ui = {};
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const rcol=r=>{const c=G.RARITY[r].col;return c==='rainbow'?'#ffd84a':c;};
const rcls=r=>G.RARITY[r].col==='rainbow'?'rainbow':'';

// ---------- TOAST / BANNER / FADE ----------
U.toast=function(html,ms){const box=$('#toasts');const d=document.createElement('div');d.className='toast';d.innerHTML=html;box.appendChild(d);while(box.children.length>3)box.firstChild.remove();setTimeout(()=>{d.classList.add('out');setTimeout(()=>d.remove(),400);},ms||2400);};
U.banner=function(id){const r=G.REGIONS[id];const b=$('#banner');b.innerHTML=`<div class="b-zh">${r.zh}</div><div class="b-vi">${r.vi}</div><div class="b-sub">${r.sub}</div>`;b.classList.remove('show');void b.offsetWidth;b.classList.add('show');};
U.fade=function(cb){const f=$('#fade');f.classList.add('on');setTimeout(()=>{cb();setTimeout(()=>f.classList.remove('on'),80);},380);};

// ---------- KÊNH THẾ GIỚI ----------
const CHAT=[];
U.chat=function(name,zh,vi,col,sys){CHAT.push({name,zh,vi,col,sys,t:Date.now()});if(CHAT.length>40)CHAT.shift();renderChat();};
function renderChat(){const box=$('#chat');box.innerHTML=CHAT.slice(-3).map(c=>`<div class="cl ${c.sys?'sys':''}" data-say="${esc(c.zh)}"><span class="cn" style="color:${c.col}">${esc(c.name)}:</span> <span class="cz">${esc(c.zh)}</span><div class="cv">${esc(c.vi)}</div></div>`).join('');}
$('#chat').addEventListener('click',e=>{const l=e.target.closest('[data-say]');if(l)G.audio.say(l.dataset.say);else U.open('chatlog');});

// ---------- HUD ----------
let goalT=0;const mini=$('#minimap');const mctx=mini.getContext('2d');let miniMap=null,miniT=0;const cache={};
function set(id,val,prop){if(cache[id+prop]===val)return;cache[id+prop]=val;const el=document.getElementById(id);if(!el)return;if(prop==='w')el.style.width=val;else if(prop==='h')el.innerHTML=val;else el.textContent=val;}
U.hud=function(){const S=G.S,P=G.P;if(!S||!G.map)return;const st=G.stats();
  set('h-lv','Lv '+S.lv);const ti=G.title(S.lv);set('h-title',ti[1]+' '+ti[2]);
  set('h-hp',Math.max(0,P.hp/st.hp*100).toFixed(1)+'%','w');set('h-mp',Math.max(0,P.mp/st.mp*100).toFixed(1)+'%','w');set('h-exp',(S.exp/G.expNeed(S.lv)*100).toFixed(1)+'%','w');
  set('h-hpt',Math.ceil(Math.max(0,P.hp))+'/'+st.hp);set('h-bac',S.bac.toLocaleString('vi-VN'));set('h-stone',S.stone);
  const d=new Date();const hh=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');set('h-clock',(G.isNight()?'🌙 ':'☀ ')+hh+(G.raining()?' 🌧':''));
  set('h-region',G.REGIONS[G.map.id].vi);
  // nhiệm vụ
  goalT-=1;if(goalT<=0){goalT=15;const q=G.curQuest();const g=G.questGoal();let qt;
    if(!q)qt='<div class="qt">Đã xong cốt truyện Giai đoạn 1 · ôn bài trong 书房</div>';
    else{const btn=g&&g.ui?'<button class="qgo" data-q="go">📖 Học ngay</button>':g&&g.x!=null?`<button class="qgo ${G.auto?'on':''}" data-q="go">${G.auto?'⏹ Dừng':'🧭 Tự đi'}</button>`:'';
      qt=`<div class="qh">📜 ${esc(q.title)}</div><div class="qrow"><div class="qt">${g?g.text:''}</div>${btn}</div>`;}
    if(G.worldBossNow()&&S.wbDay[G.today()]!==1)qt+=`<div class="wb">🐉 Giao Long đang ở sông Hồng (Thăng Long)!</div>`;
    set('quest',qt,'h');const st2=document.querySelector('[data-open=study]');if(st2)st2.classList.toggle('pulse',!!(g&&g.ui));}
  // chiêu thức
  for(let i=0;i<6;i++){const sk=G.SKILLS[i];const b=document.getElementById('sk'+i);const lock=S.lv<sk.lv;const cd=P.cd[i]/sk.cd;const k=(lock?'L':'')+(cd>0?Math.ceil(P.cd[i]):'')+(P.mp<sk.mp?'m':'');
    if(cache['sk'+i]!==k){cache['sk'+i]=k;b.classList.toggle('lock',lock);b.classList.toggle('nomp',!lock&&P.mp<sk.mp);b.querySelector('.cdn').textContent=lock?'Lv'+sk.lv:(cd>0?Math.ceil(P.cd[i]):'');}
    b.style.setProperty('--cd',cd>0?cd:0);}
  if(atkHeld)G.attack();
  // bản đồ nhỏ
  miniT-=1;if(miniT<=0){miniT=12;drawMini();}
};
function drawMini(){const m=G.map;if(miniMap!==m){miniMap=m;mini.width=m.w;mini.height=m.h;}mctx.imageSmoothingEnabled=false;mctx.drawImage(m.ground,0,0,m.w,m.h);
  mctx.fillStyle='#ff5d5d';G.mobs.forEach(mb=>{if(mb.boss&&mb.hp>0)mctx.fillRect(mb.x/G.T-1.5,mb.y/G.T-1.5,3,3);});
  mctx.fillStyle='#ffd84a';G.npcs.forEach(n=>mctx.fillRect(n.x/G.T-1,n.y/G.T-1,2,2));mctx.fillStyle='#7fe0ff';m.portals.forEach(p=>mctx.fillRect(p.x-1,p.y-1,3,3));
  const gg=G._goal;if(gg&&gg.x!=null){mctx.fillStyle='#ffd84a';mctx.fillRect(gg.x/G.T-2,gg.y/G.T-2,5,5);}mctx.fillStyle='#fff';mctx.fillRect(G.P.x/G.T-2,G.P.y/G.T-2,4,4);mctx.strokeStyle='#b3261e';mctx.lineWidth=1;mctx.strokeRect(G.P.x/G.T-2.5,G.P.y/G.T-2.5,5,5);}

// ---------- NÚT HÀNH ĐỘNG ----------
let curAct=null;
U.setAction=function(a){const b=$('#btn-act');const key=a?a.zh+a.vi:'';if(cache.act===key){curAct=a;return;}cache.act=key;curAct=a;if(!a){b.hidden=true;return;}b.hidden=false;b.innerHTML=`<span class="zh">${a.zh}</span><span>${esc(a.vi)}</span>`;};
$('#btn-act').addEventListener('click',()=>{G.audio.sfx('click');if(curAct)curAct.fn();});

// ---------- ĐIỀU KHIỂN ----------
let atkHeld=false;const keys={};
const stick=$('#stick'),knob=$('#knob'),zone=$('#stick-zone');let sid=null,ox=0,oy=0;
zone.addEventListener('pointerdown',e=>{G.audio.init();G.audio.resume();if(G.auto)G.autoStop();sid=e.pointerId;ox=e.clientX;oy=e.clientY;stick.style.left=ox+'px';stick.style.top=oy+'px';stick.hidden=false;zone.setPointerCapture(sid);e.preventDefault();});
zone.addEventListener('pointermove',e=>{if(e.pointerId!==sid)return;let dx=e.clientX-ox,dy=e.clientY-oy;const L=Math.hypot(dx,dy),R=46;if(L>R){dx=dx/L*R;dy=dy/L*R;}knob.style.transform=`translate(${dx}px,${dy}px)`;G.P.move={x:dx/R,y:dy/R};});
const endStick=e=>{if(e.pointerId!==sid)return;sid=null;stick.hidden=true;knob.style.transform='';G.P.move={x:0,y:0};};zone.addEventListener('pointerup',endStick);zone.addEventListener('pointercancel',endStick);
const atk=$('#btn-atk');atk.addEventListener('pointerdown',e=>{G.audio.init();G.audio.resume();atkHeld=true;e.preventDefault();});['pointerup','pointercancel','pointerleave'].forEach(t=>atk.addEventListener(t,()=>atkHeld=false));
for(let i=0;i<6;i++){const b=document.getElementById('sk'+i);const sk=G.SKILLS[i];b.innerHTML=`<span class="zh">${sk.zh}</span><span class="cdn"></span>`;b.title=sk.vi;b.addEventListener('pointerdown',e=>{e.preventDefault();G.audio.init();G.castSkill(i);});}
function keyMove(){let x=0,y=0;if(G.auto&&Object.values(keys).some(Boolean))G.autoStop();if(keys.a||keys.arrowleft)x--;if(keys.d||keys.arrowright)x++;if(keys.w||keys.arrowup)y--;if(keys.s||keys.arrowdown)y++;if(sid===null)G.P.move={x,y};}
window.addEventListener('keydown',e=>{if(e.target.closest('input,textarea'))return;const k=e.key.toLowerCase();keys[k]=1;keyMove();if(k==='j'||k===' ')atkHeld=true;if(k>='1'&&k<='6')G.castSkill(+k-1);if(k==='e'&&curAct&&!G.paused)curAct.fn();if(k==='escape')U.close();});
window.addEventListener('keyup',e=>{const k=e.key.toLowerCase();keys[k]=0;keyMove();if(k==='j'||k===' ')atkHeld=false;});
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>{G.audio.sfx('click');U.open(b.dataset.open);}));
$('#quest').addEventListener('click',e=>{const b=e.target.closest('[data-q=go]');if(b){G.audio.init();if(G.auto){G.autoStop();G.P.move={x:0,y:0};}else G.autoGo();goalT=0;return;}U.open('quest');});

// ---------- BẢNG (sheet) ----------
const sheet=$('#sheet'),sbody=$('#sheet-body'),stitle=$('#sheet-title');
U.close=function(){sheet.hidden=true;G.paused=false;sbody.innerHTML='';U.cur=null;G.save();};
$('#sheet-close').addEventListener('click',()=>{G.audio.sfx('click');U.close();});
const TITLES={bag:['背包','Túi đồ'],quest:['任务','Nhiệm vụ'],study:['书房','Thư phòng'],char:['人物','Nhân vật'],map:['地图','Bản đồ'],rank:['排行','Xếp hạng'],set:['设置','Cài đặt'],enhance:['强化','Cường hóa'],cook:['做饭','Nấu ăn'],shop:['商店','Cửa hàng'],chatlog:['世界频道','Kênh thế giới'],dialog:['','']};
U.open=function(name,arg){U.cur=name;G.paused=true;G.P.move={x:0,y:0};atkHeld=false;sheet.hidden=false;sheet.dataset.k=name;const t=TITLES[name]||['',''];stitle.innerHTML=`<span class="zh">${t[0]}</span> ${t[1]}`;sbody.scrollTop=0;
  ({bag:bagPanel,quest:questPanel,study:(b,a)=>G.learn.panel(b,a),char:charPanel,map:mapPanel,rank:rankPanel,set:setPanel,enhance:enhPanel,cook:cookPanel,shop:shopPanel,chatlog:chatPanel})[name](sbody,arg);};
U.refresh=function(arg){if(U.cur)U.open(U.cur,arg);};

// ---------- HỘI THOẠI NPC ----------
const GREET=[['你好！','Nǐ hǎo!','Xin chào!'],['今天天气很好。','Jīntiān tiānqì hěn hǎo.','Hôm nay trời đẹp quá.'],['你吃饭了吗？','Nǐ chī fàn le ma?','Ngài ăn cơm chưa?'],['掌门，你好吗？','Zhǎngmén, nǐ hǎo ma?','Chưởng môn khỏe không?'],['你的狗很漂亮！','Nǐ de gǒu hěn piàoliang!','Chó của ngài đẹp quá!'],['欢迎！','Huānyíng!','Hoan nghênh!']];
const line=(d)=>`<div class="dl" data-say="${esc(d[0])}"><div class="dz">${esc(d[0])} <span class="spk">🔊</span></div><div class="dp">${esc(d[1])}</div><div class="dv">${esc(d[2])}</div></div>`;
const qLines=q=>q.d||(q.type==='lesson'?(()=>{const l=G.learn.lesson(q.lesson);return [['我们一起学习吧！','Wǒmen yìqǐ xuéxí ba!','Chúng ta cùng học nào!'],['今天学：'+l.zh,'',`Hôm nay học Bài ${l.special?'★':l.n}: ${l.vi}`]];})():[['你好！','Nǐ hǎo!','Xin chào!']]);
U.dialog=function(n){const S=G.S,q=G.curQuest();U.open('chatlog');U.cur='dialog';stitle.innerHTML=`<span class="zh">${n.zh}</span> ${n.vi}`;
  const por=`<canvas class="npc-por" width="16" height="26"></canvas>`;let lines=[],btns=[];
  if(q&&q.npc===n.id){if(S.q.st==='new'){lines=qLines(q);btns.push(['accept',q.type==='talk'?'Đáp lời 好的':q.type==='lesson'?'Nhận & học ngay 学习':'Nhận nhiệm vụ 接受']);}
    else if(S.q.st==='done'){lines=[['做得很好！谢谢你！','Zuò de hěn hǎo! Xièxie nǐ!','Làm tốt lắm! Cảm ơn ngài!']];btns.push(['reward','Nhận thưởng 领奖']);}
    else{const ql=qLines(q);lines=[ql[ql.length-1]];if(q.type==='lesson')btns.push(['study',`Học Bài ${q.lesson>15?'★':q.lesson} 学习`]);}}
  else lines=[GREET[(Math.random()*GREET.length)|0]];
  if(n.role==='enhance')btns.push(['enhance','Cường hóa 强化']);if(n.role==='study')btns.push(['study','Thư phòng 书房']);if(n.shop)btns.push(['shop','Cửa hàng 商店']);btns.push(['bye','Tạm biệt 再见']);
  const qinfo=q&&q.npc===n.id?`<div class="qbox"><b>${esc(q.title)}</b><br>${questDesc(q)}${S.q.st==='active'?` · ${S.q.p}/${q.n||1}`:''}<br><small>Thưởng: ${rewardTxt(q.reward)}</small></div>`:'';
  sbody.innerHTML=`<div class="dlg">${por}<div class="dls">${lines.map(line).join('')}</div></div>${qinfo}<div class="row wrap">${btns.map(b=>`<button class="btn ${b[0]==='bye'?'ghost':''}" data-b="${b[0]}">${b[1]}</button>`).join('')}</div>`;
  const pc=sbody.querySelector('.npc-por').getContext('2d');pc.imageSmoothingEnabled=false;pc.drawImage(G.drawPerson(n.art,0),0,0);
  sbody.querySelectorAll('.dl').forEach(x=>x.onclick=()=>G.audio.say(x.dataset.say));if(S.settings.tts!==0)G.audio.say(lines.map(l=>l[0]).join(''));
  sbody.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{G.audio.sfx('click');const k=b.dataset.b;
    if(k==='accept'){if(q.type==='talk'){G.giveReward(q.reward);S.q.i++;S.q.st='new';S.q.p=0;U.close();U.toast(`✔ <b>${esc(q.title)}</b>`);}else{S.q.st='active';S.q.p=0;if(q.type==='lesson'&&G.learn.done(q.lesson)){S.q.st='done';}U.close();if(q.type==='lesson'&&S.q.st==='active'){U.open('study',q.lesson);}else U.toast(`Nhận nhiệm vụ: <b>${esc(q.title)}</b><br>${questDesc(q)}<br><small>Đi theo mũi tên vàng hoặc bấm 🧭 Tự đi</small>`,3600);}}
    else if(k==='reward'){G.giveReward(q.reward);S.q.i++;S.q.st='new';S.q.p=0;U.close();const nq=G.curQuest();if(nq)U.toast(`Nhiệm vụ tiếp: gặp <b>${G.npcName(nq.npc)}</b>`);}
    else if(k==='bye')U.close();else if(k==='study'&&q&&q.type==='lesson'&&q.npc===n.id&&S.q.st==='active')U.open('study',q.lesson);else U.open(k,n.shop);});};
function questDesc(q){const mob=q.mob&&Object.values(G.MOB_BASE).flat().find(m=>m.id===q.mob);
  return {lesson:`Học xong Bài ${q.lesson>15?'★':q.lesson} trong 书房 Thư phòng`,talk:'Trò chuyện',kill:`Diệt ${q.n} ${mob?mob.vi+' ('+mob.zh+')':''}`,learn:`Học ${q.n} từ mới${q.topic?' chủ đề '+G.TOPICS[q.topic].vi:''} trong Thư phòng`,enhance:'Cường hóa thành công 1 lần ở lò rèn',
    fish:`Câu ${q.n} con cá (đứng gần nước, bấm Câu cá)`,cook:'Nấu 1 món ở bếp',write:`Luyện viết ${q.n} chữ trong Thư phòng`,speak:`Luyện nói ${q.n} câu trong Thư phòng`,pk:'Đánh bại 1 kẻ PK (chúng sẽ tự tìm đến)',
    boss:`Đánh bại ${G.BOSSES[q.boss]?G.BOSSES[q.boss].vi:'boss'}`,sail:'Lên thuyền ở cầu tàu và ra khơi'}[q.type]||'';}
function rewardTxt(r){const a=[];if(r.exp)a.push(r.exp+' EXP');if(r.bac)a.push(r.bac+' lượng');if(r.stone)a.push(r.stone+' 玄晶');if(r.item)a.push('trang bị '+G.RARITY[Math.min(r.item,4)].vi+'+');if(r.ingr)a.push('nguyên liệu');return a.join(' · ');}

// ---------- TÚI ĐỒ ----------
function itemRow(it,eq){const n=G.itemName(it),r=G.RARITY[it.r];const s=G.itemStats(it);const st=Object.entries(s).map(([k,v])=>`${{atk:'Công',def:'Thủ',hp:'Máu',mp:'Nội',crit:'Bạo',spd:'Tốc'}[k]} +${v}`).join(' · ');
  return `<button class="item ${rcls(it.r)}" data-id="${it.id}" style="--rc:${rcol(it.r)}"><canvas class="ic" width="14" height="14" data-slot="${it.slot}" data-c="${r.col}"></canvas><div class="in"><div class="nm"><span class="zh">${n.zh}</span>${it.e?` <b>+${it.e}</b>`:''} ${eq?'<span class="tag">Đang mặc</span>':''}</div><div class="sub">[${r.zh} ${r.vi}] ${n.vi} · Lv${it.lv}</div><div class="st">${st}</div></div></button>`;}
function paintIcons(box){box.querySelectorAll('canvas.ic').forEach(c=>{const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(G.drawItemIcon(c.dataset.slot,c.dataset.c),0,0);});}
function bagPanel(b,selId){const S=G.S;const eq=G.SLOTS.map(s=>S.equip[s.id]?itemRow(S.equip[s.id],true):`<div class="item empty"><div class="in"><span class="zh">${s.zh}</span> ${s.vi} – trống</div></div>`).join('');
  const bag=S.bag.slice().sort((a,b)=>G.itemPower(b)-G.itemPower(a));const fishN=Object.values(S.fish).reduce((a,b)=>a+b,0);
  b.innerHTML=`<div class="money">💰 ${S.bac.toLocaleString('vi-VN')} lượng · 💎 ${S.stone} 玄晶 · Lực chiến <b>${G.power()}</b></div><h4>Trang bị 装备</h4><div class="items">${eq}</div>
   <h4>Hành trang (${bag.length}/60) <button class="mini-btn" id="sellj">Bán đồ Phàm/Tinh</button></h4><div class="items">${bag.map(i=>itemRow(i)).join('')||'<p class="hint">Chưa có gì. Đánh quái và boss để nhặt đồ – Shiba sẽ chạy đi nhặt giúp.</p>'}</div>
   <h4>Thức ăn 食物</h4><div class="foods">${G.RECIPES.map(r=>`<div class="food"><span class="zh">${r.zh}</span> ${r.vi} ×${S.food[r.id]||0} <small>${r.desc}</small> <button class="mini-btn" data-eat="${r.id}" ${S.food[r.id]?'':'disabled'}>Ăn</button></div>`).join('')}</div>
   <h4>Cá & nguyên liệu</h4><p class="hint">Cá: ${fishN} con${fishN?' – '+Object.entries(S.fish).filter(e=>e[1]).map(([k,v])=>k+'×'+v).join(', '):''}<br>${Object.keys(G.INGR).map(k=>G.INGR[k].zh+' '+G.INGR[k].vi+' ×'+(S.ingr[k]||0)).join(' · ')}</p><div id="detail"></div>`;
  paintIcons(b);b.querySelectorAll('.item[data-id]').forEach(x=>x.onclick=()=>detail(b,x.dataset.id));
  b.querySelector('#sellj').onclick=()=>{let g=0;S.bag=S.bag.filter(i=>{if(i.r<=1&&!i.e){g+=8*i.lv*(i.r+1);return false;}return true;});G.addBac(g);U.toast(`Đã bán, thu ${g} lượng`);G.audio.sfx('coin');bagPanel(b);};
  b.querySelectorAll('[data-eat]').forEach(x=>x.onclick=()=>eat(x.dataset.eat,b));
  if(selId)detail(b,selId);}
function findItem(id){const S=G.S;for(const k in S.equip)if(S.equip[k]&&S.equip[k].id===id)return {it:S.equip[k],eq:k};const it=S.bag.find(i=>i.id===id);return it?{it}:null;}
function detail(b,id){const f=findItem(id);if(!f)return;const it=f.it;const S=G.S;const cur=S.equip[it.slot];const diff=cur&&!f.eq?Math.round(G.itemPower(it)-G.itemPower(cur)):null;
  const d=b.querySelector('#detail');const n=G.itemName(it);
  d.innerHTML=`<div class="dsheet" style="--rc:${rcol(it.r)}"><div class="dn ${rcls(it.r)}"><span class="zh">${n.zh}</span> ${it.e?'+'+it.e:''} · [${G.RARITY[it.r].vi}] ${n.vi}</div>${diff!==null?`<div class="${diff>=0?'up':'down'}">So với đồ đang mặc: ${diff>=0?'▲ +':'▼ '}${diff} lực chiến</div>`:''}
   <div class="row wrap">${f.eq?`<button class="btn ghost" data-a="off">Tháo ra</button>`:`<button class="btn" data-a="on">Trang bị</button><button class="btn ghost" data-a="sell">Bán ${sellPrice(it)} lượng</button>`}</div></div>`;
  d.scrollIntoView({block:'nearest'});
  d.querySelectorAll('[data-a]').forEach(x=>x.onclick=()=>{const a=x.dataset.a;if(a==='on'){S.bag=S.bag.filter(i=>i!==it);if(S.equip[it.slot])S.bag.push(S.equip[it.slot]);S.equip[it.slot]=it;G.audio.sfx('anvil');}
    else if(a==='off'){S.bag.push(it);delete S.equip[it.slot];}else if(a==='sell'){S.bag=S.bag.filter(i=>i!==it);G.addBac(sellPrice(it));G.audio.sfx('coin');}
    const st=G.stats();G.P.hp=Math.min(G.P.hp,st.hp);bagPanel(b);});}
const sellPrice=it=>Math.round(8*it.lv*(it.r+1)*(it.r+1)*(1+(it.e||0)*.5));
function eat(id,b){const S=G.S,r=G.RECIPES.find(x=>x.id===id);if(!S.food[id])return;S.food[id]--;const st=G.stats();G.P.hp=Math.min(st.hp,G.P.hp+st.hp*r.heal);if(r.mp)G.P.mp=Math.min(st.mp,G.P.mp+st.mp*r.mp);if(r.buff)G.P.buffs.atk=180;G.audio.sfx('right');U.toast(`Ăn ${r.vi} ${r.zh} – ${r.desc}`);if(b)bagPanel(b);}

// ---------- CƯỜNG HÓA ----------
function enhPanel(b,selId){const S=G.S;const all=[...G.SLOTS.map(s=>S.equip[s.id]).filter(Boolean),...S.bag.slice().sort((a,b)=>G.itemPower(b)-G.itemPower(a))];
  let sel=selId?all.find(i=>i.id===selId):all[0];
  b.innerHTML=`<p class="hint">+1 đến +3 chắc chắn thành công. Từ +7 trở lên, thất bại sẽ <b>rớt 1 bậc</b>. Tối đa +12. Huyền tinh 玄晶 kiếm từ học bài, viết chữ, luyện nói.</p><div id="enh-sel"></div><h4>Chọn đồ</h4><div class="items">${all.map(i=>itemRow(i,Object.values(S.equip).includes(i))).join('')}</div>`;
  paintIcons(b);b.querySelectorAll('.item[data-id]').forEach(x=>x.onclick=()=>enhPanel(b,x.dataset.id));if(!sel)return;
  const e=sel.e||0,box=b.querySelector('#enh-sel');const n=G.itemName(sel);
  if(e>=12){box.innerHTML=`<div class="enh max ${rcls(sel.r)}" style="--rc:${rcol(sel.r)}"><div class="eb">+12</div><div><span class="zh">${n.zh}</span> ${n.vi}<br>Đã đạt cực hạn 已满级</div></div>`;return;}
  const rate=G.ENH_RATE[e],cost=Math.round(40*Math.pow(e+1,2.1)*(1+sel.lv*.05)),stones=e+1;const before=G.itemStats(sel);sel.e=e+1;const after=G.itemStats(sel);sel.e=e;
  box.innerHTML=`<div class="enh" style="--rc:${rcol(sel.r)}"><div class="eb">+${e} → +${e+1}</div><div><span class="zh">${n.zh}</span> ${n.vi}<br>${Object.keys(after).map(k=>`${{atk:'Công',def:'Thủ',hp:'Máu',mp:'Nội',crit:'Bạo',spd:'Tốc'}[k]} ${before[k]}→<b>${after[k]}</b>`).join(' · ')}</div>
   <div class="er">Tỉ lệ <b>${Math.round(rate*100)}%</b> · Phí ${cost} lượng + ${stones} 玄晶</div><button class="btn big" id="doenh" ${S.bac<cost||S.stone<stones?'disabled':''}>🔨 强化 Cường hóa</button><div id="enh-res"></div></div>`;
  b.querySelector('#doenh').onclick=()=>{if(S.bac<cost||S.stone<stones)return;S.bac-=cost;S.stone-=stones;G.audio.sfx('anvil');const ok=Math.random()<rate;
    if(ok){sel.e=e+1;G.questEvent('enhance',{});G.audio.sfx('level');}else{if(e>=7)sel.e=e-1;G.audio.sfx('fail');}
    enhPanel(b,sel.id);b.querySelector('#enh-res').innerHTML=ok?`<div class="res ok">成功！Thành công +${sel.e}</div>`:`<div class="res bad">失败… Thất bại${e>=7?' – rớt về +'+sel.e:''}</div>`;G.save();};}

// ---------- NẤU ĂN ----------
function cookPanel(b){const S=G.S;const fishN=Object.values(S.fish).reduce((a,c)=>a+c,0);
  const can=r=>(!r.need.fish||fishN>=r.need.fish)&&Object.keys(r.need).filter(k=>k!=='fish').every(k=>(S.ingr[k]||0)>=r.need[k]);
  const needTxt=r=>Object.entries(r.need).map(([k,v])=>k==='fish'?`${v} cá`:`${v} ${G.INGR[k].vi}`).join(' + ');
  b.innerHTML=`<p class="hint">Có: ${fishN} cá · ${Object.keys(G.INGR).map(k=>G.INGR[k].vi+' '+(S.ingr[k]||0)).join(' · ')}. Gạo, rau mua ở cửa hàng; thịt rơi từ thú.</p>${G.RECIPES.map(r=>`<div class="recipe"><div><span class="zh big">${r.zh}</span> <b>${r.vi}</b><br><small>${needTxt(r)} → ${r.desc}</small></div><button class="btn" data-c="${r.id}" ${can(r)?'':'disabled'}>Nấu 做</button></div>`).join('')}`;
  b.querySelectorAll('[data-c]').forEach(x=>x.onclick=()=>{const r=G.RECIPES.find(y=>y.id===x.dataset.c);if(!can(r))return;
    let nf=r.need.fish||0;for(const k in S.fish){while(nf>0&&S.fish[k]>0){S.fish[k]--;nf--;}}for(const k in r.need)if(k!=='fish')S.ingr[k]-=r.need[k];
    S.food[r.id]=(S.food[r.id]||0)+1;S.stats.cooked++;G.questEvent('cook',{});G.audio.sfx('right');G.audio.say(r.zh);U.toast(`Nấu xong <b>${r.vi}</b> ${r.zh}! (trong Túi đồ)`);cookPanel(b);});}

// ---------- CỬA HÀNG ----------
function shopPanel(b,kind){const S=G.S;kind=kind||'tea';const goods=[{k:'gao',p:10},{k:'rau',p:8}];if(kind!=='tea')goods.push({k:'thit',p:22});
  if(!U._stock||U._stock.k!==kind+S.lv){U._stock={k:kind+S.lv,items:kind==='tea'?[]:[0,1,2].map(()=>G.makeItem(S.lv,1,.2))};}
  const fishVal=Object.entries(S.fish).reduce((a,[k,v])=>{const f=Object.values(G.FISH).flat().find(x=>x.zh===k);return a+(f?f.p*v:0);},0)*(kind==='port'?1.5:1)|0;
  b.innerHTML=`<div class="money">💰 ${S.bac.toLocaleString('vi-VN')} lượng · 💎 ${S.stone} 玄晶</div><h4>Nguyên liệu</h4>${goods.map(g=>`<div class="recipe"><div><span class="zh big">${G.INGR[g.k].zh}</span> ${G.INGR[g.k].vi} <small>(có ${S.ingr[g.k]||0})</small></div><button class="btn" data-buy="${g.k}" data-p="${g.p}">Mua ${g.p} lượng</button></div>`).join('')}
   ${kind==='port'?`<div class="recipe"><div><span class="zh big">玄晶</span> Huyền tinh</div><button class="btn" data-stone="1">Mua 150 lượng</button></div>`:''}
   ${U._stock.items.length?`<h4>Binh khí & giáp</h4><div class="items">${U._stock.items.map(i=>itemRow(i)).join('')}</div>`:''}
   <h4>Bán cá</h4><button class="btn" id="sellfish" ${fishVal?'':'disabled'}>Bán hết cá – ${fishVal} lượng</button>`;
  paintIcons(b);b.querySelectorAll('[data-buy]').forEach(x=>x.onclick=()=>{const p=+x.dataset.p;if(S.bac<p){U.toast('Không đủ bạc');return;}S.bac-=p;S.ingr[x.dataset.buy]=(S.ingr[x.dataset.buy]||0)+1;G.audio.sfx('coin');shopPanel(b,kind);});
  const sb=b.querySelector('[data-stone]');if(sb)sb.onclick=()=>{if(S.bac<150)return U.toast('Không đủ bạc');S.bac-=150;S.stone++;G.audio.sfx('coin');shopPanel(b,kind);};
  b.querySelectorAll('.item[data-id]').forEach(x=>x.onclick=()=>{const it=U._stock.items.find(i=>i.id===x.dataset.id);const p=sellPrice(it)*4;if(S.bac<p)return U.toast(`Cần ${p} lượng`);S.bac-=p;U._stock.items=U._stock.items.filter(i=>i!==it);G.gainItem(it);shopPanel(b,kind);});
  b.querySelectorAll('.item[data-id]').forEach(x=>{const it=U._stock.items.find(i=>i.id===x.dataset.id);x.querySelector('.sub').insertAdjacentHTML('beforeend',` · <b>Giá ${sellPrice(it)*4}</b>`);});
  b.querySelector('#sellfish').onclick=()=>{S.fish={};G.addBac(fishVal);G.audio.sfx('coin');shopPanel(b,kind);};}

// ---------- NHIỆM VỤ ----------
function questPanel(b){const S=G.S,q=G.curQuest();const D=G.ensureDaily();
  b.innerHTML=`<h4>Nhiệm vụ chính 主线 (${Math.min(S.q.i+1,G.MAIN_QUESTS.length)}/${G.MAIN_QUESTS.length})</h4>${q?`<div class="qbox"><b>${esc(q.title)}</b> — ${S.q.st==='new'?'chưa nhận':S.q.st==='done'?'đã xong, về nhận thưởng':'đang làm'}<br>${questDesc(q)}${S.q.st==='active'?` · <b>${S.q.p}/${q.n||1}</b>`:''}<br>NPC: <b>${G.npcName(q.npc)}</b><br><small>Thưởng: ${rewardTxt(q.reward)}</small>
   <div class="dls">${qLines(q).map(line).join('')}</div></div>`:'<p class="hint">Đã hoàn thành toàn bộ cốt truyện Giai đoạn 1.</p>'}
   <h4>Nhiệm vụ ngày 日常 · ${D.date}</h4>${D.list.map(d=>`<div class="daily ${d.done?'done':''}"><span>${d.done?'✔':'○'} ${esc(d.title)}</span><b>${Math.min(d.p,d.n)}/${d.n}</b></div>`).join('')}
   <h4>Hoạt động theo giờ</h4><p class="hint">🐉 Boss thế giới <b>Giao Long</b> xuất hiện ở bờ sông Hồng (Thăng Long) lúc <b>12:00</b> và <b>20:00</b>, mỗi lần 30 phút.<br>🌙 Ban đêm (19:00–5:00) thích khách xuất hiện trong kinh thành.<br>⚔ Kẻ PK sẽ tự tìm đến khi bạn từ cấp 4.</p>`;
  b.querySelectorAll('.dl').forEach(x=>x.onclick=()=>G.audio.say(x.dataset.say));}

// ---------- NHÂN VẬT ----------
function charPanel(b){const S=G.S,st=G.stats(),ti=G.title(S.lv);
  b.innerHTML=`<div class="char"><canvas id="por" width="36" height="40"></canvas><div><div class="cname">Kị sỹ Takd</div><div>越拳门掌门 · Chưởng môn <b>Muay Việt</b></div><div>${ti[1]} ${ti[2]} · Lv ${S.lv} · EXP ${S.exp}/${G.expNeed(S.lv)}</div><div>Lực chiến <b>${G.power()}</b></div></div></div>
   <div class="stats">${[['Công','攻',st.atk],['Thủ','防',st.def],['Máu','血',st.hp],['Nội lực','内',st.mp],['Bạo kích','暴',st.crit+'%'],['Tốc','速',st.spd]].map(s=>`<div><span class="zh">${s[1]}</span> ${s[0]}<b>${s[2]}</b></div>`).join('')}</div>
   <h4>Chiêu thức Muay Việt</h4>${G.SKILLS.map(s=>`<div class="skillrow ${S.lv<s.lv?'lock':''}"><span class="zh big" style="color:${s.col}">${s.zh}</span><div><b>${s.vi}</b> · Lv ${s.lv} · ${s.mp} nội · hồi ${s.cd}s<br><small>${s.desc}</small></div></div>`).join('')}
   <h4>Bạn đồng hành</h4><div class="skillrow"><canvas id="shp" width="18" height="14"></canvas><div><b>Shiba</b> 柴犬 – luôn theo sau, tự chạy đi nhặt bạc và đồ rơi.</div></div>
   <h4>Thành tích</h4><div class="stats">${[['Quái đã diệt',S.stats.kills],['Từ đã thuộc',G.learn.learned().length],['Chữ đã viết',S.stats.written],['Câu đã nói',S.stats.spoken],['Cá đã câu',S.stats.fished],['Thắng PK',S.stats.pk]].map(s=>`<div>${s[0]}<b>${s[1]}</b></div>`).join('')}</div>`;
  const x=b.querySelector('#por').getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(G.drawTakd(0,0,1,'#b3261e',null),0,0);const y=b.querySelector('#shp').getContext('2d');y.drawImage(G.drawShiba(0,1),0,0);}

// ---------- BẢN ĐỒ ----------
function mapPanel(b){const S=G.S,m=G.map;b.innerHTML=`<canvas id="bigmap"></canvas><h4>Các vùng đất · truyền tống</h4>${Object.keys(G.REGIONS).map(id=>{const r=G.REGIONS[id];const un=S.unlocked[id];return `<div class="recipe"><div><span class="zh big">${r.zh}</span> <b>${r.vi}</b><br><small>${r.sub}</small></div>${id===m.id?'<span class="tag">Đang ở đây</span>':un?`<button class="btn" data-tp="${id}">Đi</button>`:'<span class="tag">🔒</span>'}</div>`;}).join('')}
   <div class="recipe lockd"><div><span class="zh big">大宋</span> <b>Đất Tống · Mông Cổ…</b><br><small>Giai đoạn 2 – 3</small></div><span class="tag">🔒</span></div>`;
  const c=b.querySelector('#bigmap');c.width=m.w*4;c.height=m.h*4;const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(m.ground,0,0,c.width,c.height);
  m.objs.forEach(o=>{if(o.o==='house'||o.o==='hut'||o.o==='vanmieu'||o.o==='pagoda'){x.fillStyle='#93392a';x.fillRect(o.x/4-4,o.y/4-6,8,6);}});
  x.font='bold 11px system-ui';x.textAlign='center';G.npcs.forEach(n=>{x.fillStyle='#ffd84a';x.fillRect(n.x/4-2,n.y/4-2,4,4);});
  m.portals.forEach(p=>{x.fillStyle='#7fe0ff';x.fillRect(p.x*4-3,p.y*4-3,6,6);x.fillStyle='#fff';x.fillText(p.vi,p.x*4,p.y*4-6);});
  if(m.boss){x.fillStyle='#ff5d5d';x.fillRect(m.boss.x/4-4,m.boss.y/4-4,8,8);x.fillText('BOSS',m.boss.x/4,m.boss.y/4-7);}
  x.fillStyle='#fff';x.beginPath();x.arc(G.P.x/4,G.P.y/4,5,0,7);x.fill();x.strokeStyle='#b3261e';x.lineWidth=2;x.stroke();
  b.querySelectorAll('[data-tp]').forEach(x=>x.onclick=()=>{U.close();G.teleport(x.dataset.tp);});}

// ---------- XẾP HẠNG ----------
function rankPanel(b){const S=G.S;const rows=G.allBots().map(x=>({name:x.name,sect:x.sect,lv:G.botLevel(x),pw:Math.round(G.botLevel(x)*(80+x.pw*40)),guild:x.guild}));
  rows.push({name:'Kị sỹ Takd',sect:G.SECTS[0],lv:S.lv,pw:G.power(),guild:'越拳门',me:1});rows.sort((a,b)=>b.lv-a.lv||b.pw-a.pw);const me=rows.findIndex(r=>r.me)+1;
  b.innerHTML=`<p class="hint">Người chơi ảo cũng tự lên cấp theo thời gian thật. Hạng của bạn: <b>#${me}</b> / ${rows.length}</p><div class="rank">${rows.slice(0,40).map((r,i)=>`<div class="rr ${r.me?'me':''}"><span class="no">${i+1}</span><span class="rn" style="color:${r.sect.col}">${esc(r.name)}</span><span class="rs">${r.sect.zh}</span><b>Lv${r.lv}</b></div>`).join('')}</div>
   ${S.foes.length?`<h4>Cừu nhân 仇人</h4><p class="hint">${S.foes.map(esc).join(' · ')}</p>`:''}<h4>Các môn phái</h4>${G.SECTS.map(s=>`<div class="skillrow"><span class="zh big" style="color:${s.col}">${s.zh}</span><div><b>${s.vi}</b> · hành ${s.el}<br><small>${s.desc}</small></div></div>`).join('')}`;}

// ---------- KÊNH THẾ GIỚI ----------
function chatPanel(b){b.innerHTML=`<p class="hint">Chạm vào câu để nghe đọc.</p>`+CHAT.slice().reverse().map(c=>`<div class="cl big" data-say="${esc(c.zh)}"><span class="cn" style="color:${c.col}">${esc(c.name)}:</span> <span class="cz">${esc(c.zh)}</span><div class="cv">${esc(c.vi)}</div></div>`).join('');
  b.querySelectorAll('[data-say]').forEach(x=>x.onclick=()=>G.audio.say(x.dataset.say));}

// ---------- CÀI ĐẶT ----------
function setPanel(b){const s=G.S.settings;const tg=(k,l)=>`<label class="tg"><input type="checkbox" id="set-${k}" ${s[k]!==0?'checked':''}> ${l}</label>`;
  b.innerHTML=`${tg('music','Nhạc nền 音乐')}${tg('sfx','Hiệu ứng âm thanh 音效')}${tg('tts','Tự đọc tiếng Trung khi hội thoại 朗读')}
   <h4>Niệm chú khi ra chiêu</h4><select id="set-quiz"><option value="all">Mọi chiêu đều phải trả lời (học nhiều nhất)</option><option value="big">Chỉ chiêu lớn (Lôi Chùy trở lên)</option><option value="off">Tắt</option></select>
   <h4>Sao lưu</h4><p class="hint">Mã sao lưu dùng để chuyển dữ liệu sang máy khác.</p><div class="row"><button class="btn ghost" id="exp">Sao chép mã</button></div><textarea id="imp" rows="3" placeholder="Dán mã sao lưu vào đây"></textarea><div class="row"><button class="btn ghost" id="doimp">Nạp mã</button></div>
   <h4>Chơi lại từ đầu</h4><div class="row"><button class="btn danger" id="rst">Xóa dữ liệu</button></div><div id="rstc"></div>
   <p class="hint">Takd 行侠记 · Bản chơi thử Giai đoạn 1. Điều khiển máy tính: WASD di chuyển, J đánh, 1–6 chiêu, E hành động.</p>`;
  b.querySelector('#set-quiz').value=s.quiz||'all';
  ['music','sfx','tts'].forEach(k=>b.querySelector('#set-'+k).onchange=e=>{s[k]=e.target.checked?1:0;G.audio.apply();});b.querySelector('#set-quiz').onchange=e=>s.quiz=e.target.value;
  b.querySelector('#exp').onclick=()=>{const code=G.exportSave();const ta=b.querySelector('#imp');ta.value=code;ta.select();try{navigator.clipboard.writeText(code).then(()=>U.toast('Đã sao chép mã'),()=>U.toast('Mã đã hiện trong ô – hãy tự sao chép'));}catch(e){U.toast('Mã đã hiện trong ô – hãy tự sao chép');}};
  b.querySelector('#doimp').onclick=()=>{if(!G.importSave(b.querySelector('#imp').value))U.toast('Mã không hợp lệ');};
  b.querySelector('#rst').onclick=()=>{b.querySelector('#rstc').innerHTML=`<p class="hint">Chắc chắn xóa toàn bộ tiến trình?</p><div class="row"><button class="btn danger" id="rsty">Xóa thật</button><button class="btn ghost" id="rstn">Thôi</button></div>`;b.querySelector('#rsty').onclick=G.resetSave;b.querySelector('#rstn').onclick=()=>b.querySelector('#rstc').innerHTML='';};}

// ---------- CÂU CÁ ----------
U.fishing=function(){G.paused=true;const ov=$('#fish');ov.hidden=false;const P=G.P;const reg=P.boat||G.map.id==='vandon'?'vandon':G.map.id;const pool=G.FISH[reg];
  ov.innerHTML=`<div class="fish-card"><div class="f-title"><span class="zh">钓鱼</span> Câu cá</div><div class="f-msg" id="fmsg">Thả câu… đợi cá cắn</div><div class="f-bar"><div class="f-zone"></div><div class="f-mark"></div></div><button class="btn big" id="fpull" disabled>Giật cần 拉!</button><button class="btn ghost" id="fclose">Thôi</button></div>`;
  G.audio.sfx('splash');const zone=ov.querySelector('.f-zone'),mark=ov.querySelector('.f-mark'),btn=ov.querySelector('#fpull'),msg=ov.querySelector('#fmsg');
  const zw=.18+Math.random()*.1,zx=Math.random()*(1-zw);zone.style.left=zx*100+'%';zone.style.width=zw*100+'%';let pos=0,dir=1,run=false,raf,done=false;const spd=.9+Math.random()*.6;
  const wait=setTimeout(()=>{if(done)return;run=true;btn.disabled=false;msg.innerHTML='<b>上钩了！</b> Cá cắn! Giật khi vạch vào vùng xanh';G.audio.sfx('bark');let last=performance.now();
    const step=t=>{if(!run)return;const dt=(t-last)/1000;last=t;pos+=dir*spd*dt;if(pos>1){pos=1;dir=-1;}if(pos<0){pos=0;dir=1;}mark.style.left=pos*100+'%';raf=requestAnimationFrame(step);};raf=requestAnimationFrame(step);},1200+Math.random()*2200);
  const end=()=>{done=true;run=false;cancelAnimationFrame(raf);clearTimeout(wait);ov.hidden=true;ov.innerHTML='';G.paused=false;};
  ov.querySelector('#fclose').onclick=end;
  btn.onclick=()=>{if(!run)return;run=false;cancelAnimationFrame(raf);const hit=pos>=zx&&pos<=zx+zw;
    if(hit){const rare=Math.random()<.08;const c=pool.filter(f=>!!f.rare===rare);const f=c[(Math.random()*c.length)|0]||pool[0];
      if(f.p>0){G.S.fish[f.zh]=(G.S.fish[f.zh]||0)+1;}else{G.addExp(50*G.S.lv);}G.S.stats.fished++;G.questEvent('fish',{});G.audio.sfx('right');G.audio.say(f.zh);
      msg.innerHTML=`<div class="f-catch"><span class="zh">${f.zh}</span><br>${f.vi}${f.rare?' ✨ hiếm!':''}</div>`;}
    else{msg.innerHTML='Cá sổng mất… 鱼跑了';G.audio.sfx('wrong');}
    btn.textContent='Câu tiếp';btn.onclick=()=>{end();U.fishing();};};};

// ---------- MÀN MỞ ĐẦU ----------
U.intro=function(cont){const ov=$('#intro');ov.hidden=false;
  ov.innerHTML=`<div class="i-card"><canvas id="i-por" width="36" height="40"></canvas><div class="i-zh">行侠记</div><div class="i-vi">Takd Hành Hiệp</div><div class="i-sub">Võ lâm Đại Việt · vừa đánh vừa học tiếng Trung</div>
   <p class="i-story">${cont?'Chào mừng chưởng môn trở lại.':'Năm 1010, vua Lý dời đô về Thăng Long. Kị sỹ <b>Takd</b>, chưởng môn phái <b>Muay Việt</b>, cưỡi ngựa cùng chú Shiba trở về làng Kim Liên. Giang hồ dậy sóng, sơn tặc hoành hành, hải tặc chặn biển Đông…'}</p>
   <button class="btn big" id="i-go">${cont?'Tiếp tục 继续':'Bắt đầu 开始'}</button><p class="i-help">Kéo nửa trái màn hình để đi · Nút <b>打</b> để đánh · Chiêu thức cần trả lời đúng tiếng Trung</p></div>`;
  const x=ov.querySelector('#i-por').getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(G.drawTakd(0,0,1,'#b3261e',null),0,0);
  ov.querySelector('#i-go').onclick=()=>{G.audio.init();G.audio.resume();G.audio.sfx('gong');ov.hidden=true;G.paused=false;
    const off=G.offline();G.start();if(!G.S.intro){G.S.intro=1;setTimeout(()=>U.toast('Đi theo <b>mũi tên vàng</b> tới Lý trưởng, hoặc bấm <b>🧭 Tự đi</b> ở khung nhiệm vụ',5500),2500);}
    if(off)setTimeout(()=>offlineModal(off),900);};};
function offlineModal(o){G.paused=true;const ov=$('#fish');ov.hidden=false;
  ov.innerHTML=`<div class="fish-card"><div class="f-title"><span class="zh">托管</span> Ủy thác</div><p>Trong ${o.mins} phút vắng mặt, Takd và Shiba vẫn luyện công.</p><div class="f-catch">+${o.exp} EXP · +${o.bac} lượng</div>
   <button class="btn big" id="o2">Nhận ×2 (trả lời 3 câu)</button><button class="btn ghost" id="o1">Nhận thường</button></div>`;
  const give=k=>{G.addExp(o.exp*k,G.P.x,G.P.y);G.addBac(o.bac*k,G.P.x,G.P.y);ov.hidden=true;ov.innerHTML='';G.paused=false;G.save();};
  ov.querySelector('#o1').onclick=()=>give(1);
  ov.querySelector('#o2').onclick=()=>{ov.hidden=true;G.paused=false;let n=0,ok=0;const ask=()=>G.learn.quiz({skill:{zh:'托管',vi:'Ủy thác '+(n+1)+'/3',col:'#ffd84a'},onDone:(r)=>{n++;if(r)ok++;if(n<3)setTimeout(ask,200);else{give(ok===3?2:1);U.toast(ok===3?'Nhận gấp đôi!':'Trả lời đúng '+ok+'/3 – nhận thường');}}});ask();};}
})();
