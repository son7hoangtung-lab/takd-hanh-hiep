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
let CH='all';
U.chat=function(name,zh,vi,col,sys,ch){CHAT.push({name,zh,vi,col,sys,ch:ch||(sys?'sys':(Math.random()<.2?'bang':'all')),t:Date.now()});if(CHAT.length>60)CHAT.shift();renderChat();};
const chList=()=>CH==='all'?CHAT:CHAT.filter(c=>c.ch===CH);
function renderChat(){const box=$('#chat');const L=chList();if(!L.length){box.innerHTML=`<div class="cl"><span class="cv">${{mat:'Chưa có mật thư.',ban:'Hảo hữu chưa nói gì.',tu:'Kênh tự tạo – bấm câu mẫu bên dưới để nói.',bang:'Bang chúng chưa lên tiếng.',sys:'Chưa có thông báo.'}[CH]||''}</span></div>`;return;}box.innerHTML=L.slice(-2).map(c=>`<div class="cl ${c.sys?'sys':''}" data-say="${esc(c.zh)}"><span class="cn" style="color:${c.col}">${esc(c.name)}:</span> <span class="cz">${esc(c.zh)}</span><div class="cv">${esc(c.vi)}</div></div>`).join('');}
$('#chat').addEventListener('click',e=>{const l=e.target.closest('[data-say]');if(l)G.audio.say(l.dataset.say);U.open('chatlog');});
document.querySelectorAll('.ctab').forEach(b=>b.addEventListener('click',()=>{CH=b.dataset.ch;document.querySelectorAll('.ctab').forEach(x=>x.classList.toggle('on',x===b));renderChat();}));
const EMO=[['你好！','Xin chào!'],['谢谢！','Cảm ơn!'],['加油！','Cố lên!'],['一起打怪吧！','Cùng đánh quái nhé!'],['哈哈哈','Ha ha ha'],['厉害！','Lợi hại!'],['等一下','Đợi chút'],['再见！','Tạm biệt!']];
const REPLY=[['你好，掌门！','Chào chưởng môn!'],['好的！','Được!'],['走吧！','Đi thôi!'],['哈哈，你真厉害！','Ha ha, ngài giỏi thật!'],['不客气。','Không có gì.'],['我也去！','Tôi cũng đi!']];
$('#emo').innerHTML=EMO.map((e,i)=>`<button data-e="${i}" title="${e[1]}">${e[0]}</button>`).join('');
$('#emo').addEventListener('click',e=>{const b=e.target.closest('[data-e]');if(!b)return;const m=EMO[+b.dataset.e];G.audio.init();G.audio.say(m[0]);U.chat('Takd',m[0],m[1],'#ffd84a',false,CH==='all'||CH==='sys'?'all':CH);
  G.P.say={zh:m[0],vi:m[1],t:3};if(Math.random()<.75)setTimeout(()=>{const all=G.allBots();const bt=all[(Math.random()*all.length)|0];const r=REPLY[(Math.random()*REPLY.length)|0];U.chat(bt.name,r[0],r[1],bt.sect.col,false,CH==='all'||CH==='sys'?'all':CH);},1400+Math.random()*1600);});

// ---------- HUD ----------
let goalT=0;const mini=$('#minimap');const mctx=mini.getContext('2d');let miniMap=null,miniT=0;const cache={};
function set(id,val,prop){if(cache[id+prop]===val)return;cache[id+prop]=val;const el=document.getElementById(id);if(!el)return;if(prop==='w')el.style.width=val;else if(prop==='h')el.innerHTML=val;else el.textContent=val;}
U.hud=function(){const S=G.S,P=G.P;if(!S||!G.map)return;const st=G.stats();
  set('h-lv','Lv '+S.lv);const ti=G.title(S.lv);set('h-title',ti[1]+' '+ti[2]);
  set('h-hp',Math.max(0,P.hp/st.hp*100).toFixed(1)+'%','w');set('h-mp',Math.max(0,P.mp/st.mp*100).toFixed(1)+'%','w');set('h-exp',(S.exp/G.expNeed(S.lv)*100).toFixed(1)+'%','w');
  set('h-hpt',Math.ceil(Math.max(0,P.hp))+'/'+st.hp);set('h-mpt',Math.ceil(Math.max(0,P.mp))+'/'+st.mp);set('h-sp',(S.sp||0).toFixed(0)+'%','w');set('h-expt',(S.exp/G.expNeed(S.lv)*100).toFixed(1)+'%');
  const pm=G.PKMODES.find(x=>x[0]===(S.pkMode||'luyen'));if(cache.pk!==pm[0]){cache.pk=pm[0];const pb=$('#pkstate');pb.textContent=pm[1]+' '+pm[2];pb.style.color=pm[3];}
  const bf=[];if(P.buffs.atk>0)bf.push(['攻',P.buffs.atk]);if(P.buffs.kim>0)bf.push(['金',P.buffs.kim]);if(S.mounted&&!P.boat)bf.push(['马',0]);if(S.meditate)bf.push(['坐',0]);if(S.autoFight)bf.push(['自',0]);
  set('buffs',bf.map(b=>`<span class="buff">${b[0]}${b[1]?`<small>${Math.ceil(b[1])}</small>`:''}</span>`).join(''),'h');
  const tg=G.target;const tb=$('#target');if(tg&&tg.hp>0){if(tb.hidden)tb.hidden=false;set('t-name',(tg.boss?'👑 ':'')+(tg.name?tg.name.zh+' '+tg.name.vi:'')+' · Lv'+(tg.lv||'?'));set('t-hp',Math.max(0,tg.hp/tg.max*100).toFixed(1)+'%','w');set('t-hpt',Math.ceil(Math.max(0,tg.hp))+'/'+tg.max);}else if(!tb.hidden)tb.hidden=true;
  qbarUpd();$('#i-auto').classList.toggle('on',!!S.autoFight);set('h-bac',S.bac.toLocaleString('vi-VN'));set('h-stone',S.stone);
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
  miniT-=1;if(miniT<=0){miniT=6;drawMini();}
};
let miniR=34;$('#zin').addEventListener('click',()=>{if(window.R3)R3.zoom(.75);});$('#zout').addEventListener('click',()=>{if(window.R3)R3.zoom(1.33);});
mini.addEventListener('click',()=>{miniR=miniR===34?70:miniR===70?20:34;miniT=0;});
function drawMini(){const m=G.map,W=mini.width,T=G.T;if(!m.ground)return;const px=G.P.x/T,py=G.P.y/T,k=W/(miniR*2);const tx=t=>(t-px)*k+W/2,ty=t=>(t-py)*k+W/2;
  mctx.fillStyle='#16303a';mctx.fillRect(0,0,W,W);mctx.imageSmoothingEnabled=true;const g=m.ground,s=g.width/m.w;mctx.drawImage(g,(px-miniR)*s,(py-miniR)*s,miniR*2*s,miniR*2*s,0,0,W,W);
  const dot=(x,y,r,c)=>{mctx.fillStyle=c;mctx.beginPath();mctx.arc(tx(x),ty(y),r,0,7);mctx.fill();};
  G.mobs.forEach(mb=>{if(mb.hp>0)dot(mb.x/T,mb.y/T,mb.boss?5:2.2,mb.boss?'#ff3b3b':'#ff8a6a');});
  G.npcs.forEach(n=>dot(n.x/T,n.y/T,3.2,'#ffd84a'));m.portals.forEach(p=>dot(p.x,p.y,4.5,'#7fe0ff'));
  const gg=G._goal;if(gg&&gg.x!=null){const gx=gg.x/T,gy=gg.y/T,d=Math.hypot(gx-px,gy-py);if(d<miniR*.9)dot(gx,gy,5,'#ffd84a');else{const a=Math.atan2(gy-py,gx-px);mctx.save();mctx.translate(W/2+Math.cos(a)*W*.42,W/2+Math.sin(a)*W*.42);mctx.rotate(a);mctx.fillStyle='#ffd84a';mctx.beginPath();mctx.moveTo(8,0);mctx.lineTo(-6,-6);mctx.lineTo(-6,6);mctx.fill();mctx.restore();}}
  const yaw=window.R3?R3.cam.yaw:0;mctx.save();mctx.translate(W/2,W/2);const d=G.P.dir||{x:1,y:0};mctx.rotate(Math.atan2(d.y,d.x));mctx.fillStyle='#fff';mctx.strokeStyle='#b3261e';mctx.lineWidth=2;mctx.beginPath();mctx.moveTo(9,0);mctx.lineTo(-6,-6);mctx.lineTo(-3,0);mctx.lineTo(-6,6);mctx.closePath();mctx.fill();mctx.stroke();mctx.restore();
  // hình nón tầm nhìn camera
  mctx.save();mctx.translate(W/2,W/2);mctx.rotate(-yaw-Math.PI/2);mctx.fillStyle='rgba(255,255,255,.08)';mctx.beginPath();mctx.moveTo(0,0);mctx.arc(0,0,W*.5,-.5,.5);mctx.fill();mctx.restore();}

// ---------- THANH 9 Ô ----------
const QB=[{id:'kimsang',zh:'药',k:'1'},{id:'hoikhi',zh:'丹',k:'2'},{id:'food',zh:'食',k:'3'},{id:'sit',zh:'坐',vi:'Thiền',k:'4',sep:1},{id:'run',zh:'跑',vi:'Chạy',k:'5'},{id:'horse',zh:'马',vi:'Ngựa',k:'6'},{id:'auto',zh:'战',vi:'Tự đánh',k:'7'},{id:'tab',zh:'选',vi:'Mục tiêu',k:'8'},{id:'rage',zh:'怒',vi:'Nộ khí',k:'9',sep:1}];
$('#qbar').innerHTML=QB.map(q=>`<button class="qs ${q.sep?'sep':''} ${q.id==='rage'?'rage':''}" data-qs="${q.id}" title="${q.vi||''}"><i>${q.k}</i><span class="zh">${q.zh}</span><small></small></button>`).join('');
function qbarUpd(){const S=G.S,P=G.P;const f=S.food||{};const food=['zongzi','yutang','kaoyu','mifan'].reduce((a,k)=>a+(f[k]||0),0);
  const st={kimsang:'×'+(f.kimsang||0),hoikhi:'×'+(f.hoikhi||0),food:'×'+food,sit:S.meditate?'on':'',run:S.run?'on':'',horse:S.mounted?'on':'',auto:S.autoFight?'on':'',rage:Math.round(P.rage||0)};
  const key=JSON.stringify(st);if(cache.qb===key)return;cache.qb=key;
  document.querySelectorAll('#qbar .qs').forEach(b=>{const id=b.dataset.qs,v=st[id];if(id==='rage'){b.style.setProperty('--r',v+'%');b.classList.toggle('full',v>=G.rageMax);b.querySelector('small').textContent=v>=G.rageMax?'MAX':v;return;}
    if(v==='on'||v==='')b.classList.toggle('on',v==='on');else b.querySelector('small').textContent=v;});}
function qsDo(id){G.audio.init();if(G.paused&&id!=='rage')return;({kimsang:()=>G.useItem('kimsang'),hoikhi:()=>G.useItem('hoikhi'),food:()=>G.useItem('food'),sit:G.toggleMeditate,run:G.toggleRun,horse:G.toggleMount,auto:G.toggleAuto,
  tab:()=>{const P=G.P;const L=G.mobs.filter(m=>m.hp>0&&Math.hypot(m.x-P.x,m.y-P.y)<14*G.T).sort((a,b)=>Math.hypot(a.x-P.x,a.y-P.y)-Math.hypot(b.x-P.x,b.y-P.y));if(!L.length)return U.toast('Không có mục tiêu gần');const i=(L.indexOf(G.target)+1)%L.length;G.target=L[i];G.chase=L[i];},
  rage:()=>{if((G.P.rage||0)<G.rageMax)return U.toast('Nộ khí chưa đầy – đánh và chịu đòn để tích nộ');G.useRage();}})[id]();cache.qb='';}
$('#qbar').addEventListener('click',e=>{const b=e.target.closest('[data-qs]');if(b)qsDo(b.dataset.qs);});
$('#pkstate').addEventListener('click',e=>{e.stopPropagation();const L=G.PKMODES;const i=L.findIndex(x=>x[0]===(G.S.pkMode||'luyen'));G.setPK(L[(i+1)%L.length][0]);});
$('#ava').addEventListener('click',()=>U.open('char'));$('#i-auto').addEventListener('click',()=>{G.audio.sfx('click');G.toggleAuto();});
$('#tb-toggle').addEventListener('click',()=>{G.audio.sfx('click');$('#toolbar').classList.toggle('fold');});

// ---------- NÚT HÀNH ĐỘNG ----------
let curAct=null;
U.setAction=function(a){const b=$('#btn-act');const key=a?a.zh+a.vi:'';if(cache.act===key){curAct=a;return;}cache.act=key;curAct=a;if(!a){b.hidden=true;return;}b.hidden=false;b.innerHTML=`<span class="zh">${a.zh}</span><span>${esc(a.vi)}</span>`;};
$('#btn-act').addEventListener('click',()=>{G.audio.sfx('click');if(curAct)curAct.fn();});

// ---------- ĐIỀU KHIỂN ----------
let atkHeld=false;const keys={};
const stick=$('#stick'),knob=$('#knob'),zone=$('#stick-zone');let sid=null,ox=0,oy=0;
zone.addEventListener('pointerdown',e=>{G.audio.init();G.audio.resume();if(G.auto)G.autoStop();sid=e.pointerId;ox=e.clientX;oy=e.clientY;stick.style.left=ox+'px';stick.style.top=oy+'px';stick.hidden=false;zone.setPointerCapture(sid);e.preventDefault();});
zone.addEventListener('pointermove',e=>{if(e.pointerId!==sid)return;let dx=e.clientX-ox,dy=e.clientY-oy;const L=Math.hypot(dx,dy),R=46;if(L>R){dx=dx/L*R;dy=dy/L*R;}knob.style.transform=`translate(${dx}px,${dy}px)`;G.P.move=window.R3?R3.rotMove(dx/R,dy/R):{x:dx/R,y:dy/R};if(G.S)G.S.meditate=false;G.chase=null;});
const endStick=e=>{if(e.pointerId!==sid)return;sid=null;stick.hidden=true;knob.style.transform='';G.P.move={x:0,y:0};};zone.addEventListener('pointerup',endStick);zone.addEventListener('pointercancel',endStick);
const atk=$('#btn-atk');atk.addEventListener('pointerdown',e=>{G.audio.init();G.audio.resume();atkHeld=true;e.preventDefault();});['pointerup','pointercancel','pointerleave'].forEach(t=>atk.addEventListener(t,()=>atkHeld=false));
for(let i=0;i<6;i++){const b=document.getElementById('sk'+i);const sk=G.SKILLS[i];b.innerHTML=`<span class="zh">${sk.zh}</span><span class="cdn"></span>`;b.title=sk.vi;b.addEventListener('pointerdown',e=>{e.preventDefault();G.audio.init();G.castSkill(i);});}
function keyMove(){let x=0,y=0;if(G.auto&&Object.values(keys).some(Boolean))G.autoStop();if(keys.a||keys.arrowleft)x--;if(keys.d||keys.arrowright)x++;if(keys.w||keys.arrowup)y--;if(keys.s||keys.arrowdown)y++;if(sid===null)G.P.move=window.R3?R3.rotMove(x,y):{x,y};if(x||y)G.chase=null;}
window.addEventListener('keydown',e=>{if(e.target.closest('input,textarea'))return;const k=e.key.toLowerCase();keys[k]=1;keyMove();if(k==='j'||k===' ')atkHeld=true;if(k>='1'&&k<='6')G.castSkill(+k-1);if(k==='e'&&curAct&&!G.paused)curAct.fn();if(k==='h')qsDo('horse');if(k==='r')qsDo('run');if(k==='t')qsDo('sit');if(k==='q')qsDo('rage');if(k==='tab'){e.preventDefault();qsDo('tab');}if(k==='z'&&window.R3)R3.zoom(.8);if(k==='x'&&window.R3)R3.zoom(1.25);if(k==='escape')U.close();});
window.addEventListener('keyup',e=>{const k=e.key.toLowerCase();keys[k]=0;keyMove();if(k==='j'||k===' ')atkHeld=false;});
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>{G.audio.sfx('click');U.open(b.dataset.open);}));
$('#quest').addEventListener('click',e=>{const b=e.target.closest('[data-q=go]');if(b){G.audio.init();if(G.auto){G.autoStop();G.P.move={x:0,y:0};}else G.autoGo();goalT=0;return;}U.open('quest');});

// ---------- BẢNG (sheet) ----------
const sheet=$('#sheet'),sbody=$('#sheet-body'),stitle=$('#sheet-title');
U.close=function(){sheet.hidden=true;G.paused=false;sbody.innerHTML='';U.cur=null;G.save();};
$('#sheet-close').addEventListener('click',()=>{G.audio.sfx('click');U.close();});
const TITLES={skills:['武功','Võ công'],guild:['帮会','Bang hội · Tổ đội'],pet:['同伴','Đồng hành'],life:['生活','Kỹ năng sống'],medicine:['药铺','Hiệu thuốc'],bag:['背包','Túi đồ'],quest:['任务','Nhiệm vụ'],study:['书房','Thư phòng'],char:['人物','Nhân vật'],map:['地图','Bản đồ'],rank:['排行','Xếp hạng'],set:['设置','Cài đặt'],enhance:['强化','Cường hóa'],cook:['做饭','Nấu ăn'],shop:['商店','Cửa hàng'],chatlog:['世界频道','Kênh thế giới'],dialog:['','']};
U.open=function(name,arg){U.cur=name;G.paused=true;G.P.move={x:0,y:0};atkHeld=false;sheet.hidden=false;sheet.dataset.k=name;const t=TITLES[name]||['',''];stitle.innerHTML=`<span class="zh">${t[0]}</span> ${t[1]}`;sbody.scrollTop=0;
  ({bag:bagPanel,quest:questPanel,study:(b,a)=>G.learn.panel(b,a),char:charPanel,map:mapPanel,rank:rankPanel,set:setPanel,enhance:enhPanel,cook:cookPanel,shop:(b,k)=>k==='medicine'?medPanel(b):shopPanel(b,k),chatlog:chatPanel,skills:skillsPanel,guild:guildPanel,pet:petPanel,life:lifePanel})[name](sbody,arg);};
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
  if(n.role==='enhance')btns.push(['enhance','Cường hóa 强化']);if(n.role==='teleport')btns.push(['map','Truyền tống 传送']);if(n.role==='board')btns.push(['quest','Xem cáo thị 告示']);if(n.role==='study')btns.push(['study','Thư phòng 书房']);if(n.shop)btns.push(['shop','Cửa hàng 商店']);btns.push(['bye','Tạm biệt 再见']);
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
   <h4>Thuốc 药品</h4><div class="foods">${G.POTIONS.map(r=>`<div class="food"><span class="zh">${r.zh}</span> ${r.vi} ×${S.food[r.id]||0} <small>${r.desc}</small> <button class="mini-btn" data-use="${r.id}" ${S.food[r.id]?'':'disabled'}>Dùng</button></div>`).join('')}</div>
   <h4>Thức ăn 食物</h4><div class="foods">${G.RECIPES.map(r=>`<div class="food"><span class="zh">${r.zh}</span> ${r.vi} ×${S.food[r.id]||0} <small>${r.desc}</small> <button class="mini-btn" data-eat="${r.id}" ${S.food[r.id]?'':'disabled'}>Ăn</button></div>`).join('')}</div>
   <h4>Cá & nguyên liệu</h4><p class="hint">Cá: ${fishN} con${fishN?' – '+Object.entries(S.fish).filter(e=>e[1]).map(([k,v])=>k+'×'+v).join(', '):''}<br>${Object.keys(G.INGR).map(k=>G.INGR[k].zh+' '+G.INGR[k].vi+' ×'+(S.ingr[k]||0)).join(' · ')}</p><div id="detail"></div>`;
  paintIcons(b);b.querySelectorAll('.item[data-id]').forEach(x=>x.onclick=()=>detail(b,x.dataset.id));
  b.querySelector('#sellj').onclick=()=>{let g=0;S.bag=S.bag.filter(i=>{if(i.r<=1&&!i.e){g+=8*i.lv*(i.r+1);return false;}return true;});G.addBac(g);U.toast(`Đã bán, thu ${g} lượng`);G.audio.sfx('coin');bagPanel(b);};
  b.querySelectorAll('[data-eat]').forEach(x=>x.onclick=()=>eat(x.dataset.eat,b));b.querySelectorAll('[data-use]').forEach(x=>x.onclick=()=>{G.useItem(x.dataset.use);bagPanel(b);});
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

function medPanel(b){const S=G.S;b.innerHTML=`<div class="money">💰 ${S.bac.toLocaleString('vi-VN')} lượng</div><p class="hint">Thầy lang 郎中 bán thuốc. Thuốc đặt sẵn ở ô <b>药</b> và <b>丹</b> trên thanh dưới.</p>${G.POTIONS.map(p=>`<div class="recipe"><div><span class="zh big">${p.zh}</span> <b>${p.vi}</b> <small>(có ${S.food[p.id]||0})</small><br><small>${p.desc}</small></div><div class="row"><button class="btn" data-m="${p.id}" data-n="1">1 · ${p.price}</button><button class="btn ghost" data-m="${p.id}" data-n="5">5 · ${p.price*5}</button></div></div>`).join('')}`;
  b.querySelectorAll('[data-m]').forEach(x=>x.onclick=()=>{const p=G.POTIONS.find(q=>q.id===x.dataset.m),n=+x.dataset.n;if(S.bac<p.price*n)return U.toast('Không đủ bạc');S.bac-=p.price*n;S.food[p.id]=(S.food[p.id]||0)+n;G.audio.sfx('coin');G.audio.say(p.zh);medPanel(b);});}
function skillsPanel(b){const S=G.S;b.innerHTML=`<p class="hint">Mỗi chiêu cần <b>niệm chú</b> – trả lời đúng tiếng Trung để phát huy toàn lực. Nộ khí 怒 đầy thì tung <b>越魂破 Việt Hồn Phá</b> (3 câu liên hoàn).</p>`+G.SKILLS.map(s=>`<div class="skillrow ${S.lv<s.lv?'lock':''}"><span class="zh big" style="color:${s.col}">${s.zh}</span><div><b>${s.vi}</b> · Lv ${s.lv} · ${s.mp} nội · hồi ${s.cd}s<br><small>${s.desc}</small></div></div>`).join('')+`<div class="skillrow"><span class="zh big" style="color:#ff5d5d">越魂破</span><div><b>Nộ · Việt Hồn Phá</b> · cần 100 nộ khí<br><small>Trả lời 3 câu, mỗi câu đúng tăng ×2 sát thương diện rộng.</small></div></div>`;}
function guildPanel(b){const S=G.S;const mates=G.allBots().filter(x=>x.guild==='越拳门').slice(0,8);b.innerHTML=`<div class="qbox"><span class="zh big">越拳门</span> <b>Môn phái Muay Việt</b> · Chưởng môn: <b>Kị sỹ Takd</b><br><small>Bang hội & tổ đội đầy đủ sẽ mở ở Đợt 2 (Thăng Long).</small></div><h4>Môn đồ trực tuyến</h4>${mates.length?mates.map(m=>`<div class="rr"><span class="rn" style="color:${m.sect.col}">${esc(m.name)}</span><span class="rs">${m.sect.zh}</span><b>Lv${G.botLevel(m)}</b></div>`).join(''):'<p class="hint">Chưa có môn đồ – hãy lên cấp để chiêu mộ.</p>'}`;}
function petPanel(b){const S=G.S;b.innerHTML=`<div class="skillrow"><span class="zh big">柴犬</span><div><b>Shiba</b> – luôn theo sau, tự nhặt bạc và đồ rơi.</div></div><div class="skillrow"><span class="zh big">战马</span><div><b>Chiến mã</b> – ${S.mounted?'đang cưỡi':'đang dắt'}. Cưỡi ngựa đi nhanh hơn 30%, không tốn thể lực. Ô <b>马</b> để lên/xuống.</div></div><p class="hint">Hệ thống nuôi dưỡng đồng hành mở ở Đợt 2.</p>`;}
function lifePanel(b){const S=G.S;b.innerHTML=`<div class="skillrow"><span class="zh big">钓鱼</span><div><b>Câu cá</b> · đã câu ${S.stats.fished}<br><small>Đứng sát bờ ao, sông, hồ rồi bấm nút Câu cá.</small></div></div><div class="skillrow"><span class="zh big">做饭</span><div><b>Nấu ăn</b> · đã nấu ${S.stats.cooked||0}<br><small>Đến bếp (quán nước, trại) để nấu từ cá + gạo + rau.</small></div></div><div class="skillrow"><span class="zh big">强化</span><div><b>Rèn đúc</b><br><small>Gặp Thợ rèn để cường hóa tới +12.</small></div></div>`;}

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
   <button class="btn big" id="i-go" disabled>Đang tải 0%</button><p class="i-help">Kéo nửa trái để đi hoặc chạm mặt đất · Chụm 2 ngón để phóng to/thu nhỏ, xoay 2 ngón để xoay góc nhìn · Nút <b>打</b> để đánh · Chiêu thức cần trả lời đúng tiếng Trung</p></div>`;
  const x=ov.querySelector('#i-por').getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(G.drawTakd(0,0,1,'#b3261e',null),0,0);
  const go=ov.querySelector('#i-go');const lbl=cont?'Tiếp tục 继续':'Bắt đầu 开始';
  const poll=()=>{if(!window.R3){go.disabled=false;go.textContent=lbl;return;}if(R3.err){go.textContent='Máy không hỗ trợ 3D (WebGL)';return;}if(R3.ready){go.disabled=false;go.textContent=lbl;return;}go.textContent='Đang tải thế giới '+Math.round((R3.progress||0)*100)+'%';setTimeout(poll,150);};poll();
  go.onclick=()=>{if(go.disabled)return;G.audio.init();G.audio.resume();G.audio.sfx('gong');ov.hidden=true;G.paused=false;
    const off=G.offline();G.start();if(!G.S.intro){G.S.intro=1;setTimeout(()=>U.toast('Đi theo <b>mũi tên vàng</b> tới Lý trưởng, hoặc bấm <b>🧭 Tự đi</b> ở khung nhiệm vụ',5500),2500);}
    if(off)setTimeout(()=>offlineModal(off),900);};};
function offlineModal(o){G.paused=true;const ov=$('#fish');ov.hidden=false;
  ov.innerHTML=`<div class="fish-card"><div class="f-title"><span class="zh">托管</span> Ủy thác</div><p>Trong ${o.mins} phút vắng mặt, Takd và Shiba vẫn luyện công.</p><div class="f-catch">+${o.exp} EXP · +${o.bac} lượng</div>
   <button class="btn big" id="o2">Nhận ×2 (trả lời 3 câu)</button><button class="btn ghost" id="o1">Nhận thường</button></div>`;
  const give=k=>{G.addExp(o.exp*k,G.P.x,G.P.y);G.addBac(o.bac*k,G.P.x,G.P.y);ov.hidden=true;ov.innerHTML='';G.paused=false;G.save();};
  ov.querySelector('#o1').onclick=()=>give(1);
  ov.querySelector('#o2').onclick=()=>{ov.hidden=true;G.paused=false;let n=0,ok=0;const ask=()=>G.learn.quiz({skill:{zh:'托管',vi:'Ủy thác '+(n+1)+'/3',col:'#ffd84a'},onDone:(r)=>{n++;if(r)ok++;if(n<3)setTimeout(ask,200);else{give(ok===3?2:1);U.toast(ok===3?'Nhận gấp đôi!':'Trả lời đúng '+ok+'/3 – nhận thường');}}});ask();};}
})();
