// ===== NHẠC NỀN TRUNG HOA & HỌC QUA LỜI BÀI HÁT =====
// Chỉ dùng bài đã hết bản quyền: dân ca cổ, thơ Đường, "Tống biệt" (lời 1915, nhạc 1851).
// Giai điệu thơ Đường do game tự soạn theo ngũ cung. Bài hiện đại chỉ giới thiệu, không chép lời.
(function(){
const SONGS=[
 {id:'molihua',zh:'茉莉花',py:'Mòlìhuā',hv:'Mạt lị hoa',vi:'Hoa nhài',base:293.66,bpm:76,mood:['village'],
  from:'Dân ca Giang Tô, lưu truyền từ thời nhà Thanh (lời cổ dân gian).',fact:'Nhạc sĩ Ý Puccini đã đưa giai điệu này vào vở opera Turandot (1926).',
  lines:[['好一朵茉莉花','hǎo yì duǒ mòlì huā','Một đóa hoa nhài thật đẹp','3:1|3:.5,5:.5|6:.5,1^:.5|1^:.5,6:.5|5:1|5:.5,6:.5,5:2'],
   ['好一朵茉莉花','hǎo yì duǒ mòlì huā','Một đóa hoa nhài thật đẹp','3:1|3:.5,5:.5|6:.5,1^:.5|1^:.5,6:.5|5:1|5:.5,6:.5,5:2'],
   ['满园花草','mǎn yuán huā cǎo','Cả vườn hoa cỏ','5:1|5:1|5:.5,3:.5|5:.5,6:.5,6:1,5:2'],
   ['香也香不过它','xiāng yě xiāng bú guò tā','Chẳng hoa nào thơm hơn nó','3:.5,2:.5|3:1|5:.5,3:.5|2:.5,1:.5|1:.5,2:.5|1:3'],
   ['我有心采一朵戴','wǒ yǒu xīn cǎi yì duǒ dài','Ta muốn hái một bông cài lên','3:.5,2:.5|1:1|3:.5,2:.5|3:1|5:.5,6:.5|1^:1|5:3'],
   ['又怕看花的人儿骂','yòu pà kān huā de rénr mà','Lại sợ người giữ vườn mắng','2:.5,3:.5|5:1|2:.5,3:.5|1:.5,6_:.5|5_:1|6_:.5,1:.5|2:.5,3:.5|2:.5,1:.5,6_:.5,5_:2.5']]},
 {id:'chunxiao',zh:'春晓',py:'Chūn xiǎo',hv:'Xuân hiểu',vi:'Sáng xuân',base:293.66,bpm:84,mood:['village','morning'],
  from:'Thơ Mạnh Hạo Nhiên (689–740), đời Đường. Giai điệu do game soạn theo ngũ cung.',fact:'Bài thơ trẻ em Trung Quốc nào cũng thuộc lòng từ mẫu giáo.',
  lines:[['春眠不觉晓','chūn mián bù jué xiǎo','Giấc xuân say chẳng biết trời sáng','1:1|2:1|3:1|5:1|3:2'],['处处闻啼鸟','chù chù wén tí niǎo','Khắp nơi nghe chim hót','5:1|5:1|6:1|5:.5,3:.5|2:2'],
   ['夜来风雨声','yè lái fēng yǔ shēng','Đêm qua tiếng gió mưa','3:1|5:1|6:1|1^:1|6:2'],['花落知多少','huā luò zhī duō shǎo','Hoa rụng biết bao nhiêu','5:1|3:1|2:.5,3:.5|2:1|1:3']]},
 {id:'jingyesi',zh:'静夜思',py:'Jìng yè sī',hv:'Tĩnh dạ tứ',vi:'Nỗi nhớ đêm thanh',base:261.63,bpm:66,mood:['night'],
  from:'Thơ Lý Bạch (701–762), đời Đường. Giai điệu do game soạn theo ngũ cung.',fact:'Bài thơ về trăng và quê hương nổi tiếng nhất của Trung Hoa.',
  lines:[['床前明月光','chuáng qián míng yuè guāng','Đầu giường ánh trăng soi','3:1|5:1|6:.5,5:.5|3:1|2:2'],['疑是地上霜','yí shì dì shàng shuāng','Ngỡ là sương trên mặt đất','1:1|2:1|3:.5,2:.5|1:1|6_:2'],
   ['举头望明月','jǔ tóu wàng míng yuè','Ngẩng đầu nhìn trăng sáng','6_:1|1:1|2:1|3:.5,5:.5|3:2'],['低头思故乡','dī tóu sī gù xiāng','Cúi đầu nhớ cố hương','2:1|3:1|2:.5,1:.5|6_:1|6_:3']]},
 {id:'songbie',zh:'送别',py:'Sòngbié',hv:'Tống biệt',vi:'Tiễn biệt',base:261.63,bpm:72,mood:['city','night'],
  from:'Lời: Lý Thúc Đồng (1915). Giai điệu phỏng theo "Dreaming of Home and Mother" của J. P. Ordway (Mỹ, 1851).',fact:'Bài hát chia tay kinh điển, thường hát trong lễ tốt nghiệp ở Trung Quốc.',
  lines:[['长亭外','cháng tíng wài','Ngoài trường đình','5:1|3:.5,5:.5|1^:2'],['古道边','gǔ dào biān','Bên đường xưa','6:1|1^:1|5:2'],['芳草碧连天','fāng cǎo bì lián tiān','Cỏ thơm xanh biếc liền trời','5:1|1:.5,2:.5|3:1|2:.5,1:.5|2:4'],
   ['晚风拂柳笛声残','wǎn fēng fú liǔ dí shēng cán','Gió chiều lướt liễu, tiếng sáo tàn','5:1|3:.5,5:.5|1^:1.5|7:.5|6:1|1^:1|5:2'],['夕阳山外山','xī yáng shān wài shān','Nắng chiều, núi ngoài núi','5:1|2:.5,3:.5|4:1.5|7_:.5|1:4'],
   ['天之涯','tiān zhī yá','Nơi chân trời','6:1|1^:1|1^:2'],['地之角','dì zhī jiǎo','Nơi góc bể','7:1|6:.5,7:.5|1^:2'],['知交半零落','zhī jiāo bàn líng luò','Bạn tri âm nửa đã tan tác','6:.5,7:.5|1^:.5,6:.5|6:.5,5:.5|3:.5,1:.5|2:4'],
   ['一壶浊酒尽余欢','yì hú zhuó jiǔ jìn yú huān','Một bầu rượu đục cạn cuộc vui','5:1|3:.5,5:.5|1^:1.5|7:.5|6:1|1^:1|5:2'],['今宵别梦寒','jīn xiāo bié mèng hán','Đêm nay giấc mộng chia ly lạnh lẽo','5:1|2:.5,3:.5|4:1.5|7_:.5|1:4']]},
 {id:'dengguanque',zh:'登鹳雀楼',py:'Dēng Guànquè lóu',hv:'Đăng Quán Tước lâu',vi:'Lên lầu Quán Tước',base:261.63,bpm:78,mood:['sea'],
  from:'Thơ Vương Chi Hoán (688–742), đời Đường. Giai điệu do game soạn theo ngũ cung.',fact:'Câu "更上一层楼" nay thành thành ngữ: tiến thêm một bậc.',
  lines:[['白日依山尽','bái rì yī shān jìn','Mặt trời tựa núi lặn dần','5:1|6:1|1^:1|6:.5,5:.5|3:2'],['黄河入海流','Huáng Hé rù hǎi liú','Hoàng Hà chảy ra biển','5:1|3:1|2:1|1:.5,2:.5|3:2'],
   ['欲穷千里目','yù qióng qiān lǐ mù','Muốn nhìn tận nghìn dặm','6:1|1^:1|2^:1|1^:.5,6:.5|5:2'],['更上一层楼','gèng shàng yì céng lóu','Hãy lên thêm một tầng lầu','3:1|5:1|6:1|1^:.5,2^:.5|1^:3']]}
];
const MODERN=[
 ['月亮代表我的心','Yuèliang dàibiǎo wǒ de xīn','Ánh trăng nói hộ lòng tôi','Đặng Lệ Quân 邓丽君',1977,'Bản tình ca tiếng Hoa nổi tiếng bậc nhất.',[['月亮','yuèliang','mặt trăng'],['代表','dàibiǎo','đại diện, thay cho'],['心','xīn','trái tim']]],
 ['甜蜜蜜','Tiánmìmì','Ngọt ngào','Đặng Lệ Quân 邓丽君',1979,'Giai điệu vui tươi, là tên một bộ phim Hồng Kông nổi tiếng năm 1996.',[['甜','tián','ngọt'],['蜜','mì','mật ong']]],
 ['朋友','Péngyou','Bạn bè','Châu Hoa Kiện 周华健',1997,'Bài hát về tình bạn, hay hát trong các buổi họp lớp.',[['朋友','péngyou','bạn bè']]],
 ['童话','Tónghuà','Truyện cổ tích','Quang Lương 光良',2005,'Tình ca nhẹ nhàng của ca sĩ Malaysia.',[['童话','tónghuà','truyện cổ tích']]],
 ['老鼠爱大米','Lǎoshǔ ài dàmǐ','Chuột yêu gạo','Dương Thần Cương 杨臣刚',2004,'Bài hát mạng gây sốt những năm 2000.',[['老鼠','lǎoshǔ','con chuột'],['爱','ài','yêu'],['大米','dàmǐ','gạo']]],
 ['小幸运','Xiǎo xìngyùn','Chút may mắn nhỏ','Điền Phức Chân 田馥甄',2015,'Nhạc phim "Năm tháng vội vã" (我的少女时代).',[['小','xiǎo','nhỏ'],['幸运','xìngyùn','may mắn']]]
];
G.SONGS=SONGS;
const SEMI={1:0,2:2,3:4,4:5,5:7,6:9,7:11};
function parse(tok){return tok.split('|').map(ch=>ch.split(',').map(n=>{const [d,du]=n.split(':');let semi=SEMI[d[0]];if(d.includes('^'))semi+=12;if(d.includes('_'))semi-=12;return [semi,parseFloat(du)];}));}
SONGS.forEach(s=>s.lines.forEach(l=>{l.notes=parse(l[3]);l.chars=[...l[0]];}));
// ---- nhạc cụ ----
function A(){return G.audio.ctx&&G.audio.ctx();}
function zheng(f,t,dur,g,dest){const c=A();const o=c.createOscillator(),o2=c.createOscillator(),gn=c.createGain();o.type='triangle';o2.type='sine';o.frequency.setValueAtTime(f*0.985,t);o.frequency.exponentialRampToValueAtTime(f,t+0.05);o2.frequency.value=f*2.003;
  gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(g,t+0.006);gn.gain.exponentialRampToValueAtTime(0.0008,t+Math.max(0.35,dur*1.3));const g2=c.createGain();g2.gain.value=0.3;o.connect(gn);o2.connect(g2);g2.connect(gn);gn.connect(dest);
  o.start(t);o2.start(t);o.stop(t+dur*1.3+0.1);o2.stop(t+dur*1.3+0.1);}
function dizi(f,t,dur,g,dest){const c=A();const o=c.createOscillator(),gn=c.createGain(),lfo=c.createOscillator(),lg=c.createGain();o.type='sine';o.frequency.value=f*2;lfo.frequency.value=5.5;lg.gain.value=f*0.012;lfo.connect(lg);lg.connect(o.frequency);
  gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(g,t+0.07);gn.gain.setValueAtTime(g*0.9,t+Math.max(0.08,dur-0.08));gn.gain.linearRampToValueAtTime(0,t+dur);o.connect(gn);gn.connect(dest);o.start(t);lfo.start(t);o.stop(t+dur+0.05);lfo.stop(t+dur+0.05);}
function pad(f,t,dur,g,dest){const c=A();[1,1.5].forEach((k,i)=>{const o=c.createOscillator(),gn=c.createGain();o.type='sine';o.frequency.value=f*k/2;gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(g*(i?0.5:1),t+0.6);gn.gain.linearRampToValueAtTime(0,t+dur);o.connect(gn);gn.connect(dest);o.start(t);o.stop(t+dur+0.05);});}
const fq=(base,semi)=>base*Math.pow(2,semi/12);
// ---- bộ phát: lên lịch các nốt, gọi onNote để tô chữ ----
const M=G.music={cur:null,timers:[],bg:null};
M.stop=function(){M.timers.forEach(clearTimeout);M.timers=[];if(M._gain){const c=A();try{M._gain.gain.setTargetAtTime(0,c.currentTime,0.08);}catch(e){}const g=M._gain;setTimeout(()=>{try{g.disconnect();}catch(e){}},600);M._gain=null;}M.cur=null;};
M.play=function(song,opt){opt=opt||{};const c=A();if(!c)return 0;M.stop();const dest=c.createGain();dest.gain.value=opt.vol||1;dest.connect(G.audio.mdest());M._gain=dest;M.cur=song.id;
  const beat=60/song.bpm*(opt.slow?1.35:1);let t=c.currentTime+0.15;const lines=opt.line!=null?[opt.line]:song.lines.map((l,i)=>i);const flute=opt.flute!=null?opt.flute:Math.random()<.5;
  lines.forEach(li=>{const L=song.lines[li];pad(fq(song.base,0),t,L.notes.reduce((a,ns)=>a+ns.reduce((b,n)=>b+n[1],0),0)*beat,0.05,dest);
    L.notes.forEach((ns,ci)=>{if(opt.onNote){const at=(t-c.currentTime)*1000;M.timers.push(setTimeout(()=>opt.onNote(li,ci),at));}
      ns.forEach(([semi,du])=>{const f=fq(song.base,semi);zheng(f,t,du*beat,0.16,dest);if(flute)dizi(f,t,du*beat,0.045,dest);
        if(du>=1.5)zheng(f/2,t+beat*0.5,beat,0.05,dest);t+=du*beat;});});t+=beat*0.6;});
  const total=(t-c.currentTime)*1000;if(opt.onEnd)M.timers.push(setTimeout(opt.onEnd,total+200));return total;};
// ---- nhạc nền theo vùng / ngày đêm ----
const MOODS={village:['molihua','chunxiao'],night:['jingyesi','songbie'],city:['songbie','molihua'],sea:['dengguanque','jingyesi']};
let bgMood=null,bgIdx=0,plays=0,bgT=0;
function nextBg(){if(!bgMood||!MOODS[bgMood])return;const S=G.S;if(S&&S.settings.music===0){bgT=setTimeout(nextBg,8000);return;}if(G.ui&&G.ui.cur==='songs'){bgT=setTimeout(nextBg,5000);return;}
  const list=MOODS[bgMood];const id=list[bgIdx%list.length];bgIdx++;const song=SONGS.find(s=>s.id===id);plays++;
  M.play(song,{vol:0.75,onEnd:()=>{bgT=setTimeout(nextBg,7000+Math.random()*6000);}});if(plays%2===1)setTimeout(()=>M.hint(song),2500);}
const _music=G.audio.music;G.audio.music=function(name){if(!A()){_music(name);return;}
  if(MOODS[name]){if(bgMood===name)return;bgMood=name;bgIdx=0;G.audio.genStop();clearTimeout(bgT);M.stop();bgT=setTimeout(nextBg,600);}
  else{bgMood=null;clearTimeout(bgT);M.stop();_music(name);}};
// ---- thẻ gợi ý nhạc ----
M.hint=function(song){if(!G.S||G.paused)return;const li=(Math.random()*song.lines.length)|0;const L=song.lines[li];let el=document.getElementById('mhint');if(!el){el=document.createElement('div');el.id='mhint';document.body.appendChild(el);}
  el.innerHTML=`<div class="mh-h">🎵 Đang phát: <b>${song.vi}</b> <span class="zh">${song.zh}</span></div><div class="mh-s">${song.from}</div><div class="mh-l"><span class="zh">${L[0]}</span><small>${L[1]}</small><em>${L[2]}</em></div><div class="mh-b"><button data-a="say">🔊 Nghe câu này</button><button data-a="learn">📖 Học bài hát</button><button data-a="x">✕</button></div>`;
  el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),14000);
  el.onclick=e=>{const a=e.target.dataset&&e.target.dataset.a;if(!a)return;if(a==='say')G.audio.say(L[0]);if(a==='learn'){el.classList.remove('show');G.ui.open('songs',song.id);}if(a==='x')el.classList.remove('show');};};
// ---- bảng "Học qua bài hát" (karaoke) ----
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
G.songsPanel=function(b,sel){const S=G.S;S.songs=S.songs||{};const song=SONGS.find(s=>s.id===sel);
  if(!song){b.innerHTML=`<p class="hint">Nhạc nền trong game là các bài Trung Hoa đã hết bản quyền. Bấm một bài để nghe từng câu, xem pinyin và nghĩa, rồi làm bài kiểm tra điền chữ.</p>
    ${SONGS.map(s=>`<button class="songrow" data-s="${s.id}"><span class="zh big">${s.zh}</span><span><b>${s.vi}</b> · ${s.hv}<br><small>${s.from}</small></span><span class="tag">${S.songs[s.id]?'⭐ '+S.songs[s.id]:'Mới'}</span></button>`).join('')}
    <h4>Góc nhạc hiện đại <small>(còn bản quyền – chỉ giới thiệu, bấm để nghe trên YouTube)</small></h4>
    ${MODERN.map(m=>`<div class="modern"><div><span class="zh big">${m[0]}</span> <small>${m[1]}</small><br><b>${m[2]}</b> · ${m[3]} · ${m[4]}<br><small>${m[5]}</small><div class="mvocab">${m[6].map(v=>`<button data-say="${v[0]}"><span class="zh">${v[0]}</span> ${v[1]} – ${v[2]}</button>`).join('')}</div></div><a class="btn ghost sm" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(m[0]+' '+m[3].split(' ').pop())}">▶ YouTube</a></div>`).join('')}`;
    b.querySelectorAll('[data-s]').forEach(x=>x.onclick=()=>{G.audio.init();G.songsPanel(b,x.dataset.s);});b.querySelectorAll('[data-say]').forEach(x=>x.onclick=()=>G.audio.say(x.dataset.say));return;}
  b.innerHTML=`<button class="btn ghost sm" id="sback">← Danh sách bài</button><div class="songhead"><span class="zh" style="font-size:34px;color:var(--gold2)">${song.zh}</span> <b>${song.vi}</b> · ${song.hv} <small>${song.py}</small><br><small>${song.from}</small><br><small>💡 ${song.fact}</small></div>
   <div class="row wrap"><button class="btn" id="splay">▶ Nghe cả bài</button><button class="btn ghost" id="sslow">🐢 Chậm</button><button class="btn ghost" id="sread">🗣️ Đọc lời</button><button class="btn" id="squiz">✍️ Kiểm tra điền chữ</button></div>
   <div class="klines">${song.lines.map((L,li)=>`<div class="kl" data-l="${li}"><button class="kp" data-pl="${li}">▶</button><div><div class="kz">${L.chars.map((c,ci)=>`<span data-c="${li}-${ci}">${c}</span>`).join('')}</div><div class="kpy">${L[1]}</div><div class="kvi">${L[2]}</div></div></div>`).join('')}</div><div id="sq"></div>`;
  const mark=(li,ci)=>{b.querySelectorAll('.kz span.on').forEach(x=>x.classList.remove('on'));const el=b.querySelector(`[data-c="${li}-${ci}"]`);if(el){el.classList.add('on');if(ci===0)el.closest('.kl').scrollIntoView({block:'nearest',behavior:'smooth'});}};
  const done=()=>b.querySelectorAll('.kz span.on').forEach(x=>x.classList.remove('on'));
  b.querySelector('#sback').onclick=()=>{M.stop();G.songsPanel(b);};
  b.querySelector('#splay').onclick=()=>{G.audio.init();M.play(song,{onNote:mark,onEnd:done,flute:true});};
  b.querySelector('#sslow').onclick=()=>{G.audio.init();M.play(song,{onNote:mark,onEnd:done,slow:1,flute:false});};
  b.querySelector('#sread').onclick=()=>G.audio.say(song.lines.map(l=>l[0]).join('，'));
  b.querySelectorAll('[data-pl]').forEach(x=>x.onclick=()=>{G.audio.init();const li=+x.dataset.pl;G.audio.say(song.lines[li][0]);setTimeout(()=>M.play(song,{line:li,onNote:mark,onEnd:done,flute:true}),1400);});
  b.querySelectorAll('.kz span').forEach(x=>x.onclick=()=>{const c=x.textContent;const d=G.CHARS[c]||{};G.ui.tip(x,c,(d.vi||'')+(d.tip?' – '+d.tip:''));});
  b.querySelector('#squiz').onclick=()=>quiz(b,song,0,0);};
function quiz(b,song,k,ok){const box=b.querySelector('#sq');const N=Math.min(5,song.lines.length);if(k>=N){const S=G.S;const star=ok>=N?3:ok>=N-1?2:ok>=Math.ceil(N/2)?1:0;S.songs[song.id]=Math.max(S.songs[song.id]||0,star);G.addExp(15*ok,G.P.x,G.P.y);
    box.innerHTML=`<div class="qbox">🎉 Đúng ${ok}/${N} · ${'⭐'.repeat(star)||'Thử lại nhé'} · +${15*ok} EXP</div>`;G.audio.sfx(star?'right':'click');G.save();return;}
  const L=song.lines[(Math.random()*song.lines.length)|0];const pos=(Math.random()*L.chars.length)|0;const ans=L.chars[pos];
  const pool=[...new Set(song.lines.flatMap(l=>l.chars))].filter(c=>c!==ans);const opts=[ans];while(opts.length<4&&pool.length){opts.push(pool.splice((Math.random()*pool.length)|0,1)[0]);}opts.sort(()=>Math.random()-.5);
  box.innerHTML=`<div class="qbox"><small>Câu ${k+1}/${N} – chọn chữ còn thiếu</small><div class="kz big">${L.chars.map((c,i)=>i===pos?'<span class="gap">？</span>':`<span>${c}</span>`).join('')}</div><div class="kpy">${L[1]}</div><div class="kvi">${L[2]}</div>
    <div class="row wrap">${opts.map(o=>`<button class="btn ghost opt" data-o="${o}"><span class="zh" style="font-size:22px">${o}</span></button>`).join('')}</div></div>`;
  box.scrollIntoView({block:'nearest',behavior:'smooth'});
  box.querySelectorAll('[data-o]').forEach(x=>x.onclick=()=>{const r=x.dataset.o===ans;x.classList.add(r?'right':'wrong');G.audio.sfx(r?'right':'wrong');G.audio.say(L[0]);setTimeout(()=>quiz(b,song,k+1,ok+(r?1:0)),1100);});}
})();
