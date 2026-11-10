// ===== SỔ VẠN VẬT & RÈN ĐỒ BẰNG BỘ THỦ =====
(function(){
const T=G.T,S=()=>G.S;
// ---------- SỔ VẠN VẬT: chữ Hán hiện trên đồ vật, con vật quanh mình ----------
const CATS={animal:['🐃','Con vật'],plant:['🌿','Cây cỏ'],place:['🏯','Nơi chốn'],thing:['🏮','Đồ vật'],sky:['🌤️','Trời đất']};
const LX=[
 ['animal','niu','牛','niú','con trâu, con bò',{amb:['trau']}],['animal','ji','鸡','jī','con gà',{amb:['ga']}],['animal','ya','鸭子','yāzi','con vịt',{amb:['vit']}],['animal','niao','鸟','niǎo','con chim (cò)',{amb:['co']}],
 ['animal','gou','狗','gǒu','con chó',{shiba:1}],['animal','ma','马','mǎ','con ngựa',{horse:1}],['animal','lang','狼','láng','con sói',{mob:['soirung']}],['animal','hu','老虎','lǎohǔ','con hổ',{mob:['ho']}],
 ['plant','shu','树','shù','cái cây',{obj:['banyan','cothu','xoan','caygao','philao']}],['plant','zhuzi','竹子','zhúzi','cây tre',{obj:['bamboo']}],['plant','hehua','荷花','héhuā','hoa sen',{tile:['lotus']}],
 ['plant','xiangjiao','香蕉','xiāngjiāo','cây chuối',{obj:['banana']}],['plant','cao','草','cǎo','cỏ, bụi cây',{obj:['bui']}],['plant','binglang','槟榔','bīngláng','cây cau',{obj:['areca']}],
 ['place','fangzi','房子','fángzi','ngôi nhà',{obj:['house','hut']}],['place','si','寺','sì','ngôi chùa',{obj:['chua','pagoda']}],['place','miao','庙','miào','đình, miếu',{obj:['dinh','vanmieu']}],['place','ta','塔','tǎ','ngọn tháp',{obj:['thapchuong','thapbaothien']}],
 ['place','men','门','mén','cái cổng',{obj:['conglang','congthanh']}],['place','jing','井','jǐng','cái giếng',{obj:['well']}],['place','shichang','市场','shìchǎng','cái chợ',{obj:['stall']}],['place','tian','田','tián','ruộng',{tile:['paddy']}],
 ['place','shui','水','shuǐ','nước',{tile:['water','shallow']}],['place','chuan','船','chuán','con thuyền',{obj:['sampan','sailboat','bigship'],amb:['sampan']}],
 ['thing','denglong','灯笼','dēnglong','đèn lồng',{obj:['lantern']}],['thing','qi','旗','qí','lá cờ',{obj:['cotco']}],['thing','bei','碑','bēi','bia đá',{obj:['bia']}],['thing','shitou','石头','shítou','hòn đá',{obj:['rock','karst']}],
 ['thing','huo','火','huǒ','lửa',{obj:['campfire','stove']}],['thing','daocaoren','稻草人','dàocǎorén','bù nhìn rơm',{obj:['bunhin']}],['thing','zhangpeng','帐篷','zhàngpeng','cái lều',{obj:['tent','leu']}],['thing','yizi','椅子','yǐzi','cái ghế / sạp',{obj:['stall']},1],
 ['sky','wx_clear','晴天','qíngtiān','trời nắng',{wx:1}],['sky','wx_cloudy','多云','duōyún','nhiều mây',{wx:1}],['sky','wx_drizzle','下小雨','xià xiǎoyǔ','mưa phùn',{wx:1}],['sky','wx_rain','下雨','xià yǔ','trời mưa',{wx:1}],
 ['sky','wx_storm','打雷','dǎ léi','sấm sét, giông',{wx:1}],['sky','wx_fog','雾','wù','sương mù',{wx:1}],['sky','wx_snow','下雪','xià xuě','tuyết rơi',{wx:1}],['sky','taiyang','太阳','tàiyáng','mặt trời',{sun:1}],['sky','yueliang','月亮','yuèliang','mặt trăng',{moon:1}]
].filter(e=>!e[6]).map(e=>({cat:e[0],id:e[1],zh:e[2],py:e[3],vi:e[4],m:e[5]}));
G.LEXI=LX;const byId={};LX.forEach(e=>byId[e.id]=e);
G.lexiGain=function(id,quiet){const s=S();if(!s||!byId[id]||s.lexi[id])return false;s.lexi[id]=Date.now();const e=byId[id];G.addExp(8+s.lv*2,G.P.x,G.P.y);G.audio.sfx('right');G.audio.say(e.zh);
  if(!quiet)G.ui.toast(`📖 Sổ vạn vật: <b class="zh" style="font-size:20px">${e.zh}</b> ${e.py} – ${e.vi}`,3000);
  const all=LX.filter(x=>x.cat===e.cat),got=all.filter(x=>s.lexi[x.id]).length;if(got===all.length){s.stone+=8;G.addBac(300*Math.max(1,s.lv/5|0),G.P.x,G.P.y);G.ui.big&&G.ui.big('Hoàn thành bộ sưu tập',CATS[e.cat][0]+' '+CATS[e.cat][1],'+8 Huyền tinh · bạc thưởng');G.audio.sfx('level');}
  G.save();return true;};
let labT=0,labs=[];
G.lexiLabels=function(){if(G.paused)return [];const now=performance.now();if(now-labT<350)return labs;labT=now;const s=S(),P=G.P,m=G.map;const R=7*T,R2=R*R;const out=[];
  const cand=(e,x,y,h)=>{const d=(x-P.x)**2+(y-P.y)**2;if(d>R2)return;const isNew=!s.lexi[e.id];if(!isNew&&d>(3.5*T)**2)return;const prev=out.find(o=>o.id===e.id);if(prev){if(prev.d>d){prev.x=x;prev.y=y;prev.d=d;prev.h=h;}return;}out.push({id:e.id,zh:e.zh,x,y,h,d,isNew});};
  LX.forEach(e=>{const M=e.m;if(M.obj){for(const o of m.objs){if(M.obj.includes(o.o))cand(e,o.x,o.y,o.o==='banyan'||o.o==='cothu'?5:o.o==='bamboo'?4:o.o==='house'||o.o==='hut'?3.2:o.o==='dinh'||o.o==='chua'?5:1.8);}}
    if(M.amb)(G.amb||[]).forEach(a=>{if(M.amb.includes(a.k))cand(e,a.x,a.y,a.k==='trau'?2:1.2);});
    if(M.mob)G.mobs.forEach(mb=>{if(mb.hp>0&&M.mob.includes(mb.base.id))cand(e,mb.x,mb.y,2.2);});
    if(M.shiba&&s.gear&&s.gear.shiba)cand(e,G.shiba.x,G.shiba.y,1.3);if(M.horse&&s.mounted)cand(e,P.x+10,P.y,3.4);
    if(M.tile&&!s.lexi[e.id]){const tx=P.x/T|0,ty=P.y/T|0;let best=null,bd=99;for(let y=-6;y<=6;y++)for(let x=-6;x<=6;x++){if(M.tile.includes(m.get(tx+x,ty+y))){const d=x*x+y*y;if(d<bd){bd=d;best=[tx+x,ty+y];}}}if(best)cand(e,best[0]*T+8,best[1]*T+8,0.8);}});
  if(!s.lexi.taiyang&&!G.isNight()&&G.weather&&G.weather.type==='clear')out.push({id:'taiyang',zh:'太阳',x:P.x,y:P.y,h:4.2,d:0,isNew:true});
  if(!s.lexi.yueliang&&G.isNight())out.push({id:'yueliang',zh:'月亮',x:P.x,y:P.y,h:4.2,d:0,isNew:true});
  out.sort((a,b)=>(b.isNew-a.isNew)||(a.d-b.d));labs=[...out.filter(o=>o.isNew).slice(0,3),...out.filter(o=>!o.isNew).slice(0,2)];return labs;};
G.lexiTap=function(id){const e=byId[id];if(!e)return;labT=0;if(!G.lexiGain(id)){G.audio.say(e.zh);G.ui.toast(`<b class="zh" style="font-size:20px">${e.zh}</b> ${e.py} – ${e.vi}`,2000);}};
G.lexiPanel=function(b){const s=S();const tot=LX.length,got=LX.filter(e=>s.lexi[e.id]).length;
  b.innerHTML=`<p class="hint">Đi quanh làng, rừng, thành… chữ Hán vàng có dấu <b>？</b> sẽ hiện trên con vật, đồ vật. <b>Chạm vào chữ</b> để thu thập. Đủ một bộ được thưởng Huyền tinh và bạc. Thời tiết thu tự động khi gặp.</p>
   <div class="lxbar"><i style="width:${got/tot*100}%"></i><span>${got}/${tot} chữ</span></div>`+
   Object.keys(CATS).map(c=>{const L=LX.filter(e=>e.cat===c);const g=L.filter(e=>s.lexi[e.id]).length;return `<h4>${CATS[c][0]} ${CATS[c][1]} <small>${g}/${L.length}</small></h4><div class="lxgrid">${L.map(e=>s.lexi[e.id]?`<button class="lx on" data-lx="${e.id}"><b class="zh">${e.zh}</b><small>${e.py}</small><em>${e.vi}</em></button>`:`<div class="lx"><b>？</b><em>${e.vi}</em></div>`).join('')}</div>`;}).join('');
  b.querySelectorAll('[data-lx]').forEach(x=>x.onclick=()=>{const e=byId[x.dataset.lx];G.audio.say(e.zh);x.classList.add('pulse');setTimeout(()=>x.classList.remove('pulse'),600);});};

// ---------- RÈN ĐỒ BẰNG BỘ THỦ ----------
const RADS={'木':['mù','Mộc','cây'],'亻':['rén','Nhân đứng','người'],'人':['rén','Nhân','người'],'女':['nǚ','Nữ','phụ nữ'],'子':['zǐ','Tử','con'],'日':['rì','Nhật','mặt trời'],'月':['yuè','Nguyệt','mặt trăng'],
 '田':['tián','Điền','ruộng'],'力':['lì','Lực','sức'],'宀':['mián','Miên','mái nhà'],'火':['huǒ','Hỏa','lửa'],'口':['kǒu','Khẩu','miệng'],'山':['shān','Sơn','núi'],'石':['shí','Thạch','đá'],'心':['xīn','Tâm','tim'],
 '目':['mù','Mục','mắt'],'土':['tǔ','Thổ','đất'],'言':['yán','Ngôn','lời nói'],'小':['xiǎo','Tiểu','nhỏ'],'大':['dà','Đại','to'],'手':['shǒu','Thủ','tay'],'禾':['hé','Hòa','cây lúa']};
const REC=[
 ['林',['木','木'],'lín','rừng','Hai cây đứng cạnh nhau thành rừng.',{hp:40}],['休',['亻','木'],'xiū','nghỉ ngơi','Người tựa vào gốc cây để nghỉ.',{hp:25,def:2}],
 ['好',['女','子'],'hǎo','tốt','Mẹ bế con – điều tốt đẹp nhất.',{crit:3}],['明',['日','月'],'míng','sáng','Mặt trời cạnh mặt trăng – sáng rực.',{atk:6,mp:10}],
 ['男',['田','力'],'nán','đàn ông','Dùng sức trên ruộng – người đàn ông.',{atk:8}],['安',['宀','女'],'ān','bình an','Người phụ nữ dưới mái nhà – bình an.',{def:5}],
 ['字',['宀','子'],'zì','chữ','Đứa con dưới mái nhà ngồi học chữ.',{mp:25}],['炎',['火','火'],'yán','nóng rực','Lửa chồng lên lửa – nóng bỏng.',{atk:12}],
 ['尖',['小','大'],'jiān','nhọn','Trên nhỏ dưới to – đầu nhọn.',{crit:4}],['从',['人','人'],'cóng','đi theo','Người đi sau người.',{atk:4,hp:15}],
 ['岩',['山','石'],'yán','đá núi','Đá nằm trên núi.',{def:9}],['看',['手','目'],'kàn','nhìn','Đưa tay lên che mắt để nhìn xa.',{crit:3,atk:3}],
 ['信',['亻','言'],'xìn','tin','Lời của con người – niềm tin.',{def:4,mp:15}],['秋',['禾','火'],'qiū','mùa thu','Lúa chín vàng như lửa – mùa thu.',{hp:30,atk:4}],
 ['森',['木','木','木'],'sēn','rừng rậm','Ba cây là rừng sâu thăm thẳm.',{hp:90}],['众',['人','人','人'],'zhòng','đông người','Ba người – một đám đông.',{atk:15}],
 ['品',['口','口','口'],'pǐn','phẩm chất','Ba cái miệng cùng bàn – phẩm bình.',{mp:40,def:3}],['坐',['人','人','土'],'zuò','ngồi','Hai người ngồi trên đất.',{def:6,hp:25}],
 ['想',['木','目','心'],'xiǎng','nghĩ, nhớ','Mắt nhìn cây, trong tim nhớ.',{mp:30,crit:2}]
].map(r=>({c:r[0],parts:r[1],py:r[2],vi:r[3],story:r[4],st:r[5]}));
G.RADS=RADS;G.RECIPES_CHAR=REC;const RB={};REC.forEach(r=>RB[r.c]=r);
const stTxt=st=>Object.keys(st).map(k=>({hp:'Sinh lực',mp:'Nội lực',atk:'Công',def:'Thủ',crit:'Bạo kích %'})[k]+' +'+st[k]).join(', ');
// rơi bộ thủ từ quái
G.radDrop=function(t){const s=S();const n=t.boss?3:(Math.random()<.22?1:0);for(let i=0;i<n;i++){const need={};REC.forEach(r=>{if(!(s.gems[r.c]>0))r.parts.forEach(p=>need[p]=(need[p]||0)+1);});const ks=Object.keys(need).length?Object.keys(need):Object.keys(RADS);
  const rad=ks[(Math.random()*ks.length)|0];G.drops.push({x:t.x+(Math.random()-.5)*16,y:t.y+6,rad});}};
G.gainRad=function(r,x,y){const s=S();s.rads[r]=(s.rads[r]||0)+1;const d=RADS[r]||['','',''];G.float(x,y-14,'部 '+r,'#7fffb0',true);G.ui.toast(`🧩 Bộ thủ <b class="zh" style="font-size:20px">${r}</b> ${d[0]} – bộ ${d[1]} (${d[2]})`,2000);};
// chỉ số ngọc chữ
const _st=G.stats;G.stats=function(){const st=_st();const s=S();if(!s||!s.equip)return st;Object.values(s.equip).forEach(it=>{if(it&&it.gem&&RB[it.gem]){const g=RB[it.gem].st;Object.keys(g).forEach(k=>st[k]=(st[k]||0)+g[k]);}});return st;};
G.composePanel=function(b){const s=S();const have=r=>{const need={};r.parts.forEach(p=>need[p]=(need[p]||0)+1);return Object.keys(need).every(p=>(s.rads[p]||0)>=need[p]);};
  const radList=Object.keys(s.rads).filter(k=>s.rads[k]>0);
  b.innerHTML=`<p class="hint">Quái ngoài rừng rơi <b style="color:#7fffb0">bộ thủ</b>. Ghép đúng bộ thủ thành chữ để rèn <b>ngọc chữ</b>, rồi khảm ngọc vào trang bị đang mặc để tăng chỉ số. Mỗi chữ kèm câu chuyện cấu tạo giúp nhớ lâu.</p>
   <h4>Bộ thủ đang có</h4><div class="radrow">${radList.length?radList.map(k=>`<span class="rad"><b class="zh">${k}</b><small>${RADS[k]?RADS[k][1]:''} ×${s.rads[k]}</small></span>`).join(''):'<span class="hint">Chưa có – hạ quái trong rừng hoang để nhặt.</span>'}</div>
   <h4>Công thức ghép chữ</h4><div class="recgrid">${REC.map(r=>{const ok=have(r);const made=s.gems[r.c]||0;return `<div class="rec ${ok?'ok':''}"><div class="rparts">${r.parts.map(p=>`<span class="zh ${(s.rads[p]||0)>0?'got':''}">${p}</span>`).join('<i>+</i>')}<i>=</i><b class="zh">${r.c}</b></div>
     <div class="rinfo"><b>${r.py}</b> – ${r.vi}<br><small>${r.story}</small><br><small class="rst">💎 ${stTxt(r.st)}${made?` · có ${made} ngọc`:''}</small></div><button class="btn sm" data-mk="${r.c}" ${ok?'':'disabled'}>Ghép</button></div>`;}).join('')}</div>
   <h4>Khảm ngọc vào trang bị</h4><div id="sockets"></div>`;
  b.querySelectorAll('[data-mk]').forEach(x=>x.onclick=()=>{const r=RB[x.dataset.mk];r.parts.forEach(p=>s.rads[p]--);s.gems[r.c]=(s.gems[r.c]||0)+1;G.audio.sfx('level');G.audio.say(r.c);G.addExp(20+s.lv*4,G.P.x,G.P.y);
    G.ui.big&&G.ui.big('Ghép chữ thành công',r.c+' · '+r.vi,r.parts.join(' + ')+' = '+r.c+' · '+r.py);G.save();G.composePanel(b);});
  const sk=b.querySelector('#sockets');const eq=Object.keys(s.equip||{}).filter(k=>s.equip[k]);const gems=Object.keys(s.gems).filter(k=>s.gems[k]>0);
  sk.innerHTML=eq.length?eq.map(k=>{const it=s.equip[k];const nm=G.itemName(it);return `<div class="sock"><div><b>${nm.vi}</b><br><small>Ngọc: ${it.gem?`<b class="zh">${it.gem}</b> (${stTxt(RB[it.gem].st)})`:'trống'}</small></div><div class="row wrap">${gems.map(g=>`<button class="btn ghost sm" data-sock="${k}" data-g="${g}"><span class="zh">${g}</span> ×${s.gems[g]}</button>`).join('')||'<small class="hint">Chưa có ngọc</small>'}</div></div>`;}).join(''):'<p class="hint">Chưa mặc trang bị nào.</p>';
  sk.querySelectorAll('[data-sock]').forEach(x=>x.onclick=()=>{const it=s.equip[x.dataset.sock],g=x.dataset.g;if(it.gem)s.gems[it.gem]=(s.gems[it.gem]||0)+1;it.gem=g;s.gems[g]--;G.audio.sfx('coin');G.ui.toast(`💎 Khảm ngọc <b class="zh">${g}</b> vào ${G.itemName(it).vi}`);G.save();G.composePanel(b);});};
})();
