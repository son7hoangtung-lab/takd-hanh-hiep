// ===== HỌC: lộ trình HSK, bài học có cấu trúc, SRS, niệm chú, viết, nói =====
(function(){
const L = G.learn = {};
const INT=[0,5*60e3,30*60e3,864e5,3*864e5,10*864e5];
const rnd=Math.random, shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=(rnd()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];}return a;};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const PUNCT=/^[，。！？、：；“”"'…,.!?]+$/;
const VZ={};G.VOCAB.forEach(v=>VZ[v.zh]=v);L.VZ=VZ;
const S=()=>G.S;
L.w=id=>S().words[id]||(S().words[id]={b:0,d:0,r:0,x:0});
L.learned=()=>G.VOCAB.filter(v=>(S().words[v.id]||{}).b>=1);
L.mark=function(v,ok){const w=L.w(v.id);const was=w.b;if(ok){w.r++;w.b=Math.min(5,w.b+1);}else{w.x++;w.b=Math.max(was>0?1:0,w.b-1);}w.d=Date.now()+INT[w.b];
  if(was<1&&w.b>=1){S().stats.learned++;}if(ok&&was>=1)G.questEvent('review',{});};
L.done=n=>!!(S().lessons&&S().lessons[n]&&S().lessons[n].done);
L.unlocked=function(n){if(n===1)return true;if(n<=15)return L.done(n-1);if(n===16||n===17)return L.done(5);if(n===18)return L.done(10);return false;};
L.nextLesson=()=>G.LESSONS.find(l=>!l.special&&!L.done(l.n))||null;
L.lesson=n=>G.LESSONS.find(l=>l.n===n);
// chữ mới của bài: những chữ chưa xuất hiện ở các bài trước
L.newChars=function(les){const seen=new Set();G.LESSONS.filter(l=>l.n<les.n&&!(l.special&&!les.special&&l.n>les.n)).forEach(l=>l.words.forEach(w=>[...w].forEach(c=>seen.add(c))));
  const out=[];les.words.forEach(w=>[...w].forEach(c=>{if(!seen.has(c)&&!out.includes(c)&&G.CHARS[c])out.push(c);}));return out;};
L.pickWord=function(){const learned=L.learned();const nowT=Date.now();
  if(learned.length<4){const l1=L.lesson(1).words.map(w=>VZ[w]);return l1[(rnd()*l1.length)|0];}
  const due=learned.filter(v=>S().words[v.id].d<=nowT);const pool=due.length&&rnd()<.75?due:learned;return pool[(rnd()*pool.length)|0];};
function distract(v,n,field,pool){pool=(pool||G.VOCAB).filter(x=>x.zh!==v.zh&&x[field]!==v[field]);if(pool.length<n)pool=G.VOCAB.filter(x=>x.zh!==v.zh&&x[field]!==v[field]);const out=[],used=new Set([v[field]]);
  for(const x of shuffle(pool)){if(out.length>=n)break;if(!used.has(x[field])){used.add(x[field]);out.push(x);}}return out;}
L.makeQ=function(v,type,pool){type=type||['zh2vi','vi2zh','hv2zh','zh2vi','audio','pinyin'][(rnd()*6)|0];if(type==='audio'&&(!window.speechSynthesis||S().settings.tts===0))type='zh2vi';
  const field=type==='zh2vi'?'vi':type==='pinyin'?'py':'zh';const opts=shuffle([v,...distract(v,3,field,pool)]);
  let prompt,label;if(type==='zh2vi'){prompt=`<div class="qz-zh">${v.zh}</div><div class="qz-py">${v.py}</div>`;label='Nghĩa là gì? 什么意思？';}
  else if(type==='pinyin'){prompt=`<div class="qz-zh">${v.zh}</div><div class="qz-py">${esc(v.vi)}</div>`;label='Đọc thế nào? 怎么读？';}
  else if(type==='vi2zh'){prompt=`<div class="qz-vi">${esc(v.vi)}</div>`;label='Chữ Hán nào? 哪个字？';}
  else if(type==='hv2zh'){prompt=`<div class="qz-vi">« ${esc(v.hv)} »</div><div class="qz-py">âm Hán Việt</div>`;label='Chữ nào đọc là…? 哪个字？';}
  else {prompt=`<button class="qz-ear" data-say="${esc(v.zh)}">🔊</button>`;label='Nghe và chọn chữ 听一听';}
  return {v,type,opts:opts.map(o=>({v:o,txt:o[field],ok:o.zh===v.zh})),prompt,label,toZh:field==='zh'};};

// ---------- NIỆM CHÚ KHI RA CHIÊU ----------
L.quiz=function(o){if(L.active)return;L.active=true;G.timeScale=.12;const v=L.pickWord();const q=L.makeQ(v);const t0=performance.now();const LIM=6000;
  const el=document.getElementById('quiz');el.innerHTML=`<div class="qz-card"><div class="qz-head"><span class="qz-skill" style="color:${o.skill.col}">${o.skill.zh} · ${o.skill.vi}</span><span class="qz-lab">${q.label}</span></div>
   <div class="qz-prompt">${q.prompt}</div><div class="qz-timer"><i></i></div><div class="qz-opts ${q.toZh?'zh':''}">${q.opts.map((x,i)=>`<button data-i="${i}">${esc(x.txt)}</button>`).join('')}</div></div>`;
  el.hidden=false;if(q.type==='audio')G.audio.say(v.zh);
  const bar=el.querySelector('.qz-timer i');let done=false;
  const tick=()=>{if(done)return;const p=(performance.now()-t0)/LIM;bar.style.transform=`scaleX(${Math.max(0,1-p)})`;if(p>=1){finish(-1);return;}requestAnimationFrame(tick);};requestAnimationFrame(tick);
  const ear=el.querySelector('.qz-ear');if(ear)ear.onclick=()=>G.audio.say(v.zh);
  el.querySelectorAll('.qz-opts button').forEach(b=>b.onclick=()=>finish(+b.dataset.i));
  function finish(i){if(done)return;done=true;const ok=i>=0&&q.opts[i].ok;const fast=ok&&performance.now()-t0<2500;L.mark(v,ok);
    el.querySelectorAll('.qz-opts button').forEach((b,j)=>{if(q.opts[j].ok)b.classList.add('ok');else if(j===i)b.classList.add('bad');b.disabled=true;});
    const c=G.CHARS[v.zh[0]];el.querySelector('.qz-card').insertAdjacentHTML('beforeend',`<div class="qz-ans">${ok?(fast?'⚡ Nhanh! Bạo kích':'✔ Đúng'):'✘ '+(i<0?'Hết giờ':'Sai')} — <b>${v.zh}</b> ${v.py} · ${esc(v.hv)} · ${esc(v.vi)}${!ok&&c?`<br><small>💡 ${esc(c.tip)}</small>`:''}</div>`);
    G.audio.sfx(ok?'right':'wrong');if(!ok||S().settings.tts!==0)G.audio.say(v.zh);
    setTimeout(()=>{el.hidden=true;el.innerHTML='';G.timeScale=1;L.active=false;o.onDone(ok,fast);},ok?520:2000);}};

// ---------- THƯ PHÒNG ----------
L.panel=function(box,tab){if(typeof tab==='number'){L.openLesson(box,tab);return;}tab=tab||L.tab||'path';L.tab=tab;
  const tabs=[['path','学','Lộ trình'],['review','复习','Ôn tập'],['write','写','Luyện viết'],['speak','说','Luyện nói'],['book','字','Sổ chữ']];
  box.innerHTML=`<div class="tabs">${tabs.map(t=>`<button class="tab ${t[0]===tab?'on':''}" data-t="${t[0]}"><span class="zh">${t[1]}</span>${t[2]}</button>`).join('')}</div><div class="tabbody"></div>`;
  box.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{G.audio.sfx('click');L.panel(box,b.dataset.t);});
  const body=box.querySelector('.tabbody');({path:pathTab,review:reviewTab,write:writeTab,speak:speakTab,book:bookTab})[tab](body,box);};
function pathTab(b,box){const nx=L.nextLesson();const dn=G.LESSONS.filter(l=>!l.special&&L.done(l.n)).length;
  b.innerHTML=`<div class="path-head"><div><b>HSK 1</b> · ${dn}/15 bài</div><div class="prog"><i style="width:${dn/15*100}%"></i></div></div>
   <div class="path">${G.LESSONS.map(l=>{const st=L.done(l.n)?'done':L.unlocked(l.n)?(nx&&nx.n===l.n?'cur':'open'):'lock';
     return `<button class="node ${st} ${l.special?'sp':''}" data-n="${l.n}" ${st==='lock'?'disabled':''}><span class="nn">${l.special?'★':l.n}</span><span class="nt"><span class="zh">${l.zh}</span><b>${esc(l.vi)}</b><small>${esc(l.place)} · ${l.words.length} từ · ${L.newChars(l).length} chữ mới</small></span><span class="ns">${st==='done'?'✔':st==='lock'?'🔒':'▶'}</span></button>`;}).join('')}</div>
   <p class="hint">Học lần lượt từng bài. Bài sau mở khi xong bài trước. Bài ★ là bài đặc biệt (giang hồ, bảo hiểm).</p>`;
  b.querySelectorAll('.node').forEach(x=>x.onclick=()=>{G.audio.sfx('click');L.openLesson(box,+x.dataset.n);});}

// ---------- TRÌNH HỌC BÀI ----------
L.openLesson=function(box,n){const les=L.lesson(n);if(!les)return;if(!L.unlocked(n)){G.ui.toast('🔒 Học xong bài trước để mở bài này');return;}
  const chars=L.newChars(les);const words=les.words.map(w=>VZ[w]).filter(Boolean);
  const steps=[{k:'intro'},{k:'dialog'},...chars.map(c=>({k:'char',c})),...words.map(v=>({k:'word',v})),{k:'drill'},{k:'order',i:0},{k:'order',i:1},{k:'roleplay'},{k:'done'}];
  const st={les,steps,i:0,words,chars,box};L.cur=st;render(st);};
function head(st,title){const p=Math.round(st.i/(st.steps.length-1)*100);return `<div class="ls-top"><button class="mini-btn" data-x="exit">‹ Lộ trình</button><span>Bài ${st.les.special?'★':st.les.n} · <span class="zh">${st.les.zh}</span></span></div><div class="prog ls"><i style="width:${p}%"></i></div>${title?`<div class="ls-title">${title}</div>`:''}`;}
function next(st){st.i++;render(st);}
function bindCommon(b,st){const x=b.querySelector('[data-x=exit]');if(x)x.onclick=()=>{G.audio.sfx('click');L.cur=null;L.panel(st.box,'path');};b.querySelectorAll('[data-say]').forEach(e=>e.onclick=(ev)=>{ev.stopPropagation();G.audio.say(e.dataset.say);});}
function lineHtml(d,hl){if(d[0]==='N')return `<div class="dl nar">${esc(d[1])}</div>`;const who=d[0]==='T'?'Takd':G.npcName(L.cur.les.npc)||'NPC';const zh=d[1].split(' ').map(t=>hl&&t===hl?`<mark>${t}</mark>`:t).join('');
  return `<div class="dl ${d[0]==='T'?'me':''}" data-say="${esc(d[1].replace(/ /g,''))}"><div class="who">${esc(who)}</div><div class="dz">${zh} <span class="spk">🔊</span></div><div class="dp">${esc(d[2])}</div><div class="dv">${esc(d[3])}</div></div>`;}
function render(st){const b=st.box,s=st.steps[st.i],les=st.les;G.audio.sfx('click');
  if(s.k==='intro'){b.innerHTML=head(st,'Hoàn cảnh 情景')+`<div class="scene"><div class="sc-place">📍 ${esc(les.place)}</div><p>${esc(les.scene)}</p></div>
     <h4>Bài này sẽ học</h4><div class="chips">${st.words.map(v=>`<span class="chip"><span class="zh">${v.zh}</span> ${esc(v.vi)}</span>`).join('')}</div>
     <h4>Chữ mới (${st.chars.length})</h4><div class="chips">${st.chars.map(c=>`<span class="chip zh big">${c}</span>`).join('')||'<span class="hint">Không có chữ mới – bài này ghép từ chữ đã học</span>'}</div>
     <div class="row"><button class="btn big" data-go>Bắt đầu 开始</button></div>`;}
  else if(s.k==='dialog'){b.innerHTML=head(st,'Hội thoại 对话')+`<p class="hint">Nghe cả bài trước, chưa cần hiểu hết. Chạm từng câu để nghe lại.</p><div class="dls">${les.d.map(d=>lineHtml(d)).join('')}</div>
     <div class="grammar">📘 <b>Ngữ pháp</b><br>${esc(les.grammar)}</div><div class="row"><button class="btn ghost" data-play>▶ Nghe cả bài</button><button class="btn" data-go>Học chữ ›</button></div>`;
    b.querySelector('[data-play]').onclick=()=>playAll(les.d);}
  else if(s.k==='char'){charCard(st,s.c);return;}
  else if(s.k==='word'){const v=s.v;const ex=les.d.find(d=>d[1].split(' ').includes(v.zh));const parts=[...v.zh].map(c=>G.CHARS[c]).filter(Boolean);
    b.innerHTML=head(st,'Từ mới 生词')+`<div class="fc"><button class="fc-say" data-say="${esc(v.zh)}">🔊</button><div class="fc-zh">${v.zh}</div><div class="fc-py">${v.py}</div><div class="fc-hv">Hán Việt: <b>${esc(v.hv)}</b></div><div class="fc-vi">${esc(v.vi)}</div></div>
     ${parts.length>1?`<div class="breakdown">${parts.map(c=>`<div><span class="zh big">${c.zh}</span> ${esc(c.hv)} · ${esc(c.vi)}</div>`).join('')}</div>`:''}
     ${ex?`<h4>Trong hội thoại</h4><div class="dls">${lineHtml(ex,v.zh)}</div>`:''}<div class="row"><button class="btn" data-go>Tiếp ›</button></div>`;G.audio.say(v.zh);}
  else if(s.k==='drill'){drill(st);return;}
  else if(s.k==='order'){orderEx(st,s.i);return;}
  else if(s.k==='roleplay'){roleplay(st);return;}
  else if(s.k==='done'){finishLesson(st);return;}
  bindCommon(b,st);const go=b.querySelector('[data-go]');if(go)go.onclick=()=>next(st);}
function playAll(lines){const ls=lines.filter(d=>d[0]!=='N');let i=0;const step=()=>{if(i>=ls.length||!window.speechSynthesis)return;const u=new SpeechSynthesisUtterance(ls[i][1].replace(/ /g,''));u.lang='zh-CN';u.rate=.85;u.onend=()=>{i++;setTimeout(step,250);};try{speechSynthesis.speak(u);}catch(e){}};try{speechSynthesis.cancel();}catch(e){}step();}
// ---- thẻ chữ: cấu tạo, mẹo, xem viết, tự viết ----
function charCard(st,c){const b=st.box,info=G.CHARS[c];const words=st.words.filter(v=>v.zh.includes(c));
  b.innerHTML=head(st,'Chữ mới 生字')+`<div class="cc"><div class="cc-left"><div class="w-pad sm" id="cpad"></div></div><div class="cc-right"><div class="cc-zh">${c}</div><div class="fc-py">${info.py}</div><div>Hán Việt: <b>${esc(info.hv)}</b></div><div><b>${esc(info.vi)}</b></div><span class="badge t-${info.type}">${G.CHAR_TYPES[info.type]}</span></div></div>
   <div class="memo"><div>🧩 <b>Cấu tạo:</b> ${esc(info.parts)}</div><div>💡 <b>Mẹo nhớ:</b> ${esc(info.tip)}</div>${words.length?`<div>📚 Có trong: ${words.map(v=>`<span class="zh">${v.zh}</span> (${esc(v.vi)})`).join(', ')}</div>`:''}</div>
   <div class="w-msg" id="cmsg">Xem thứ tự nét…</div><div class="row"><button class="btn ghost" data-anim>↻ Xem lại nét</button><button class="btn" data-write>✍ Tự viết</button></div><div class="row" id="cskip" hidden><button class="btn ghost" data-go>Bỏ qua ›</button></div>`;
  bindCommon(b,st);G.audio.say(c);const pad=b.querySelector('#cpad');const msg=b.querySelector('#cmsg');
  if(!window.HanziWriter||!G.STROKES[c]){msg.textContent='(Không có dữ liệu nét chữ)';b.querySelector('#cskip').hidden=false;b.querySelector('[data-go]').onclick=()=>next(st);return;}
  const size=Math.min(170,pad.clientWidth||170);const w=makeWriter(pad,c,size,true);let misses=0;
  const anim=()=>{w.cancelQuiz();w.showCharacter();w.animateCharacter({onComplete:()=>{msg.textContent='Đến lượt anh viết: bấm ✍ Tự viết';}});};
  anim();b.querySelector('[data-anim]').onclick=anim;
  b.querySelector('[data-write]').onclick=()=>{w.hideCharacter();w.showOutline();msg.textContent='Viết theo nét mờ, đúng thứ tự…';w.quiz({showHintAfterMisses:1,
    onMistake:()=>{misses++;G.audio.sfx('wrong');msg.textContent='Chưa đúng nét – xem nét gợi ý';if(misses>=6)b.querySelector('#cskip').hidden=false;},
    onCorrectStroke:(d)=>{G.audio.sfx('click');msg.textContent=`Nét ${d.strokeNum+1}/${d.strokeNum+1+d.strokesRemaining}`;},
    onComplete:()=>{const cs=S().chars||(S().chars={});cs[c]=cs[c]||{w:0};cs[c].w++;S().stats.written++;G.questEvent('write',{});G.audio.sfx('right');msg.innerHTML='<b>写得好！</b> Viết đúng rồi';setTimeout(()=>next(st),700);}});};
  b.querySelector('[data-go]').onclick=()=>next(st);}
function makeWriter(el,c,size,show){return HanziWriter.create(el,c,{width:size,height:size,padding:8,showOutline:true,showCharacter:!!show,strokeColor:'#1a1210',outlineColor:'#d8c9a6',drawingColor:'#8a1f14',drawingWidth:Math.round(size/11),highlightColor:'#d9a441',
  strokeAnimationSpeed:1.2,delayBetweenStrokes:180,charDataLoader:(ch,done,err)=>{const d=G.STROKES&&G.STROKES[ch];if(d)done(d);else err&&err('missing');}});}
// ---- luyện đến khi thuộc ----
function drill(st){const b=st.box;if(!st.m){st.m={};st.words.forEach(v=>st.m[v.zh]=0);st.queue=shuffle(st.words.map(v=>v.zh));st.last=null;st.types={};st.correct=0;st.wrong=0;}
  const need=2;const left=st.words.filter(v=>st.m[v.zh]<need);if(!left.length){next(st);return;}
  // chọn từ: đầu hàng đợi chưa thuộc, tránh lặp liền
  let zh=st.queue.find(z=>st.m[z]<need&&z!==st.last)||left[0].zh;st.queue=st.queue.filter(z=>z!==zh);st.queue.push(zh);st.last=zh;const v=VZ[zh];
  const cyc=st.m[zh]===0?['zh2vi','audio','hv2zh']:['vi2zh','pinyin','cloze','audio'];let type=cyc[(st.types[zh]=(st.types[zh]||0)+1)%cyc.length];
  const ex=st.les.d.find(d=>d[1].split(' ').includes(zh));if(type==='cloze'&&!ex)type='vi2zh';
  const done=st.words.filter(x=>st.m[x.zh]>=need).length;const pool=st.words;
  let q,prompt,label,toZh;if(type==='cloze'){const opts=shuffle([v,...distract(v,3,'zh',pool)]);q={v,opts:opts.map(o=>({v:o,txt:o.zh,ok:o.zh===zh})),toZh:true};label='Điền vào chỗ trống 填空';
    prompt=`<div class="cloze">${ex[1].split(' ').map(t=>t===zh?'<span class="blank">＿＿</span>':t).join('')}</div><div class="qz-py">${esc(ex[3])}</div>`;}
  else{q=L.makeQ(v,type,pool);prompt=q.prompt;label=q.label;}
  b.innerHTML=head(st,'Luyện tập đến khi thuộc 练习')+`<div class="mastery"><span>Đã thuộc <b>${done}/${st.words.length}</b></span><span class="dots">${st.words.map(x=>`<i class="m${Math.min(st.m[x.zh],need)}"></i>`).join('')}</span></div>
   <div class="qz-card in"><div class="qz-lab">${label}</div><div class="qz-prompt">${prompt}</div><div class="qz-opts ${q.toZh?'zh':''}">${q.opts.map((x,i)=>`<button data-i="${i}">${esc(x.txt)}</button>`).join('')}</div></div><div id="fb"></div>`;
  bindCommon(b,st);if(type==='audio')G.audio.say(zh);
  b.querySelectorAll('.qz-opts button').forEach(btn=>btn.onclick=()=>{const ok=q.opts[+btn.dataset.i].ok;b.querySelectorAll('.qz-opts button').forEach((x,j)=>{x.disabled=true;if(q.opts[j].ok)x.classList.add('ok');else if(x===btn)x.classList.add('bad');});
    if(ok){st.m[zh]++;st.correct++;G.audio.sfx('right');G.audio.say(zh);setTimeout(()=>drill(st),650);}
    else{st.m[zh]=Math.max(0,st.m[zh]-1);st.wrong++;G.audio.sfx('wrong');G.audio.say(zh);const ci=[...zh].map(c=>G.CHARS[c]).filter(Boolean);
      // đưa từ sai lên gần đầu hàng đợi để hỏi lại sớm
      st.queue=st.queue.filter(z=>z!==zh);st.queue.splice(Math.min(2,st.queue.length),0,zh);
      b.querySelector('#fb').innerHTML=`<div class="memo bad"><div><span class="zh big">${zh}</span> ${v.py} · ${esc(v.hv)} · <b>${esc(v.vi)}</b></div>${ci.map(c=>`<div>💡 <span class="zh">${c.zh}</span>: ${esc(c.tip)}</div>`).join('')}<div class="row"><button class="btn" data-c>Đã nhớ, tiếp ›</button></div></div>`;
      b.querySelector('[data-c]').onclick=()=>drill(st);}});}
// ---- ghép câu ----
function orderEx(st,k){const b=st.box;const cands=st.les.d.filter(d=>d[0]!=='N'&&d[1].split(' ').filter(t=>!PUNCT.test(t)).length>=3);if(!cands.length||k>=cands.length){next(st);return;}
  const line=cands[(k*2+(st.les.n%2))%cands.length];const toks=line[1].split(' ').filter(t=>!PUNCT.test(t));let shuf=shuffle(toks);let g=0;while(shuf.join('')===toks.join('')&&g++<8)shuf=shuffle(toks);
  let picked=[],tries=0;
  const draw=()=>{b.innerHTML=head(st,'Ghép câu 排列句子')+`<p class="hint">Sắp xếp thành câu: <b>${esc(line[3])}</b></p><div class="ans">${picked.map((pi,i)=>`<button class="tok on" data-a="${i}">${shuf[pi]}</button>`).join('')||'<span class="hint">Chạm vào các ô chữ bên dưới theo đúng thứ tự</span>'}</div>
     <div class="toks">${shuf.map((t,i)=>`<button class="tok ${picked.includes(i)?'used':''}" data-t="${i}" ${picked.includes(i)?'disabled':''}>${t}</button>`).join('')}</div><div id="fb"></div><div class="row"><button class="btn" data-chk ${picked.length===toks.length?'':'disabled'}>Kiểm tra</button></div>`;
    bindCommon(b,st);
    b.querySelectorAll('[data-t]').forEach(x=>x.onclick=()=>{picked.push(+x.dataset.t);G.audio.sfx('click');draw();});
    b.querySelectorAll('[data-a]').forEach(x=>x.onclick=()=>{picked.splice(+x.dataset.a,1);draw();});
    b.querySelector('[data-chk]').onclick=()=>{if(picked.map(i=>shuf[i]).join('')===toks.join('')){G.audio.sfx('right');G.audio.say(line[1].replace(/ /g,''));b.querySelector('#fb').innerHTML=`<div class="memo ok">✔ ${esc(line[1].replace(/ /g,''))} · ${esc(line[2])}</div>`;b.querySelector('[data-chk]').disabled=true;setTimeout(()=>next(st),1100);}
      else{tries++;G.audio.sfx('wrong');b.querySelector('#fb').innerHTML=`<div class="memo bad">Chưa đúng. Gợi ý: câu bắt đầu bằng <b class="zh">${toks[0]}</b>${tries>=2?` · đáp án: <span class="zh">${toks.join(' ')}</span>`:''}</div>`;picked=[];setTimeout(draw,tries>=2?2400:1300);}};};
  draw();}
// ---- đóng vai ----
function roleplay(st){const b=st.box,les=st.les;const lines=les.d.filter(d=>d[0]!=='N');let i=0;const shown=[];const otherT=G.LESSONS.flatMap(l=>l.d.filter(d=>d[0]==='T'&&l.n!==les.n));
  const draw=()=>{while(i<lines.length&&lines[i][0]!=='T'){shown.push(lines[i]);i++;}
    if(i>=lines.length){b.innerHTML=head(st,'Đóng vai 角色扮演')+`<div class="dls">${shown.map(d=>lineHtml(d)).join('')}</div><div class="row"><button class="btn big" data-go>Hoàn thành bài ›</button></div>`;bindCommon(b,st);b.querySelector('[data-go]').onclick=()=>next(st);return;}
    const cur=lines[i];const opts=shuffle([cur,...shuffle(otherT).slice(0,2)]);
    b.innerHTML=head(st,'Đóng vai 角色扮演')+`<p class="hint">Anh là Takd. Chọn câu trả lời đúng.</p><div class="dls">${shown.map(d=>lineHtml(d)).join('')}</div>
     <div class="qz-opts one">${opts.map((o,k)=>`<button data-k="${k}"><span class="zh">${esc(o[1].replace(/ /g,''))}</span><br><small>${esc(o[2])}</small></button>`).join('')}</div><div id="fb"></div>`;
    bindCommon(b,st);const last=shown[shown.length-1];if(last)G.audio.say(last[1].replace(/ /g,''));
    b.querySelectorAll('[data-k]').forEach(x=>x.onclick=()=>{const o=opts[+x.dataset.k];if(o===cur){G.audio.sfx('right');G.audio.say(cur[1].replace(/ /g,''));shown.push(cur);i++;setTimeout(draw,600);}
      else{G.audio.sfx('wrong');x.classList.add('bad');x.disabled=true;b.querySelector('#fb').innerHTML=`<div class="memo bad">Chưa hợp ngữ cảnh. Câu này nghĩa là: ${esc(o[3])}</div>`;}});};draw();}
function finishLesson(st){const S0=S(),les=st.les;S0.lessons=S0.lessons||{};const first=!L.done(les.n);S0.lessons[les.n]={done:1,t:Date.now(),acc:Math.round(st.correct/Math.max(1,st.correct+st.wrong)*100)};
  st.words.forEach(v=>{const w=L.w(v.id);if(w.b<1){w.b=1;w.d=Date.now()+INT[1];S0.stats.learned++;}});
  const exp=first?25*les.words.length+20*S0.lv:10*S0.lv,stone=first?3+Math.ceil(les.words.length/3):1;G.addExp(exp,G.P.x,G.P.y);S0.stone+=stone;G.audio.sfx('level');G.questEvent('lesson',{n:les.n});
  const nx=L.nextLesson();
  st.box.innerHTML=head(st,'')+`<div class="result"><div class="big">🎉 Xong bài ${les.special?'★':les.n}</div><p class="zh" style="font-size:24px">${les.zh}</p><p>Độ chính xác <b>${S0.lessons[les.n].acc}%</b> · +${exp} EXP · +${stone} 玄晶</p>
   <p class="hint">Các từ của bài đã vào lịch ôn tập. Chúng sẽ xuất hiện khi anh ra chiêu và trong mục Ôn tập.</p>
   <div class="row">${nx?`<button class="btn" data-nx>Bài tiếp: ${nx.n} · ${esc(nx.vi)} ›</button>`:''}<button class="btn ghost" data-x="exit">Lộ trình</button></div></div>`;
  bindCommon(st.box,st);const n2=st.box.querySelector('[data-nx]');if(n2)n2.onclick=()=>L.openLesson(st.box,nx.n);L.cur=null;G.save();}

// ---------- ÔN TẬP (SRS) ----------
function reviewTab(b){const learned=L.learned();if(learned.length<4){b.innerHTML=`<p class="hint">Học xong <b>Bài 1</b> trong Lộ trình trước khi ôn tập.</p>`;return;}
  const due=learned.filter(v=>S().words[v.id].d<=Date.now()).length;
  b.innerHTML=`<p class="hint">Đã thuộc <b>${learned.length}</b> từ · Đến hạn ôn <b>${due}</b> từ. Mỗi lượt 10 câu, gồm cả ghép câu từ các bài đã học. Từ sai sẽ được hỏi lại.</p><button class="btn big" id="go">Bắt đầu ôn 开始</button>`;
  b.querySelector('#go').onclick=()=>rv(b,0,0,[]);}
function rv(b,k,score,redo){if(k>=10&&!redo.length){const st=Math.floor(score/3);S().stone+=st;G.addExp(score*6*S().lv,G.P.x,G.P.y);b.innerHTML=`<div class="result"><div class="big">${score}/10</div><p>+${score*6*S().lv} EXP · +${st} 玄晶</p><button class="btn" id="again">Ôn thêm</button></div>`;b.querySelector('#again').onclick=()=>rv(b,0,0,[]);G.save();return;}
  const v=redo.length&&k>=10?redo.shift():(redo.length&&rnd()<.3?redo.shift():L.pickWord());const q=L.makeQ(v);
  b.innerHTML=`<div class="lesson-top">Câu ${Math.min(k+1,10)}/10${redo.length?` · cần ôn lại ${redo.length}`:''}</div><div class="qz-card in"><div class="qz-lab">${q.label}</div><div class="qz-prompt">${q.prompt}</div><div class="qz-opts ${q.toZh?'zh':''}">${q.opts.map((x,i)=>`<button data-i="${i}">${esc(x.txt)}</button>`).join('')}</div></div><div id="fb"></div>`;
  if(q.type==='audio'){G.audio.say(v.zh);b.querySelector('.qz-ear').onclick=()=>G.audio.say(v.zh);}
  b.querySelectorAll('.qz-opts button').forEach(btn=>btn.onclick=()=>{const ok=q.opts[+btn.dataset.i].ok;L.mark(v,ok);b.querySelectorAll('.qz-opts button').forEach((x,j)=>{x.disabled=true;if(q.opts[j].ok)x.classList.add('ok');else if(x===btn)x.classList.add('bad');});
    G.audio.sfx(ok?'right':'wrong');G.audio.say(v.zh);if(ok){setTimeout(()=>rv(b,k+1,score+1,redo),550);}
    else{redo.push(v);const ci=[...v.zh].map(c=>G.CHARS[c]).filter(Boolean);b.querySelector('#fb').innerHTML=`<div class="memo bad"><div><span class="zh big">${v.zh}</span> ${v.py} · ${esc(v.hv)} · <b>${esc(v.vi)}</b></div>${ci.map(c=>`<div>💡 <span class="zh">${c.zh}</span>: ${esc(c.tip)}</div>`).join('')}<div class="row"><button class="btn" data-c>Tiếp ›</button></div></div>`;b.querySelector('[data-c]').onclick=()=>rv(b,k+1,score,redo);}});}
// ---------- LUYỆN VIẾT ----------
function writeTab(b){const ls=G.LESSONS.filter(l=>L.done(l.n));if(!ls.length){b.innerHTML=`<p class="hint">Học xong Bài 1 để mở luyện viết. Trong mỗi bài, chữ mới đều có phần xem nét và tự viết.</p>`;return;}
  const cs=S().chars||{};b.innerHTML=`<p class="hint">Hai cách luyện: <b>Có nét mờ</b> để quen tay, <b>Viết theo trí nhớ</b> chỉ xem nghĩa và âm. Chữ đã viết được đánh dấu ✓.</p>
   <div class="row"><button class="btn" id="mem">✍ Viết theo trí nhớ 10 chữ</button></div>`+ls.map(l=>`<h4>Bài ${l.special?'★':l.n} · <span class="zh">${l.zh}</span></h4><div class="chars">${L.newChars(l).map(c=>`<button class="ch ${cs[c]&&cs[c].w?'did':''}" data-c="${c}">${c}</button>`).join('')}</div>`).join('');
  b.querySelectorAll('.ch').forEach(x=>x.onclick=()=>writeOne(b,x.dataset.c,false,null));
  b.querySelector('#mem').onclick=()=>{const all=shuffle(ls.flatMap(l=>L.newChars(l))).slice(0,10);writeOne(b,all[0],true,all.slice(1));};}
function writeOne(b,c,memory,rest){const info=G.CHARS[c];b.innerHTML=`<div class="w-top">${memory?`<div><div class="w-big">?</div></div><div>Viết chữ nghĩa là <b>${esc(info.vi)}</b><br>${info.py} · Hán Việt: ${esc(info.hv)}${rest?`<br><small>Còn ${rest.length} chữ</small>`:''}</div>`:`<div><div class="w-big">${c}</div></div><div>${info.py} · ${esc(info.hv)} · <b>${esc(info.vi)}</b><br><small>💡 ${esc(info.tip)}</small></div>`}</div>
  <div class="w-pad" id="wpad"></div><div class="w-msg" id="wmsg">${memory?'Viết theo trí nhớ – sai 3 lần sẽ hiện gợi ý':'Viết theo nét mờ'}</div><div class="row"><button class="btn ghost" id="wshow">Xem cách viết</button><button class="btn ghost" id="wback">‹ Danh sách</button></div>`;
  b.querySelector('#wback').onclick=()=>writeTab(b);if(!window.HanziWriter)return;
  const pad=b.querySelector('#wpad');const size=Math.min(260,pad.clientWidth||260);const w=makeWriter(pad,c,size,false);if(memory)w.hideOutline();const msg=b.querySelector('#wmsg');
  const start=()=>w.quiz({showHintAfterMisses:memory?3:1,onMistake:()=>{msg.textContent='Chưa đúng nét – thử lại';G.audio.sfx('wrong');},onCorrectStroke:(d)=>{msg.textContent=`Đúng nét ${d.strokeNum+1}/${d.strokeNum+1+d.strokesRemaining}`;G.audio.sfx('click');},
    onComplete:(d)=>{const cs=S().chars||(S().chars={});cs[c]=cs[c]||{w:0};cs[c].w++;S().stats.written++;S().stone+=memory?2:1;G.addExp(15*S().lv);G.questEvent('write',{});G.audio.sfx('level');G.audio.say(c);
      msg.innerHTML=`<b>写得好！</b> <span class="zh">${c}</span> · +${memory?2:1} 玄晶 · ${d.totalMistakes} lỗi`;G.save();if(rest){setTimeout(()=>{if(rest.length)writeOne(b,rest[0],true,rest.slice(1));else writeTab(b);},1100);}}});
  start();b.querySelector('#wshow').onclick=()=>{w.cancelQuiz();w.showCharacter();w.animateCharacter({onComplete:()=>{w.hideCharacter();start();}});};}
// ---------- LUYỆN NÓI ----------
function speakPool(){const lines=[];G.LESSONS.filter(l=>L.done(l.n)).forEach(l=>l.d.forEach(d=>{if(d[0]!=='N')lines.push([d[1].replace(/ /g,''),d[2],d[3]]);}));
  if(lines.length<3)L.lesson(1).d.forEach(d=>{if(d[0]!=='N')lines.push([d[1].replace(/ /g,''),d[2],d[3]]);});return lines;}
const norm=s=>(s||'').replace(/[\s，。！？、,.!?…"'：:；;《》“”]/g,'');
function score(target,heard){const t=[...norm(target)].filter(c=>/\p{Script=Han}/u.test(c)),h=norm(heard);if(!t.length)return 0;let hit=0;t.forEach(c=>{if(h.includes(c))hit++;});return hit/t.length;}
function speakTab(b){const pool=speakPool();const line=pool[(rnd()*pool.length)|0];const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  b.innerHTML=`<p class="hint">Câu lấy từ hội thoại các bài đã học. Nghe mẫu, rồi bấm 🎤 và đọc to.</p><div class="fc"><button class="fc-say" id="sl">🔊</button><div class="fc-zh sm">${esc(line[0])}</div><div class="fc-py">${esc(line[1])}</div><div class="fc-vi">${esc(line[2])}</div></div>
  <div class="row"><button class="btn big" id="mic">🎤 Nói 说</button><button class="btn ghost" id="nx">Câu khác ›</button></div><div class="w-msg" id="smsg"></div><div id="self" hidden class="row"><button class="btn" id="selfok">Tôi đã đọc to ✓</button></div>`;
  const msg=b.querySelector('#smsg');b.querySelector('#sl').onclick=()=>G.audio.say(line[0]);b.querySelector('#nx').onclick=()=>speakTab(b);G.audio.say(line[0]);
  const pass=(half)=>{S().stats.spoken++;S().stone+=half?1:2;G.addExp((half?8:20)*S().lv);G.questEvent('speak',{});G.audio.sfx('level');G.save();};
  const selfMode=(why)=>{msg.innerHTML=why+'<br>Tạm thời: nghe mẫu, đọc to theo, rồi tự xác nhận.';b.querySelector('#self').hidden=false;};
  b.querySelector('#selfok').onclick=()=>{pass(true);msg.innerHTML='<b>很好！</b> +1 玄晶';b.querySelector('#self').hidden=true;};
  b.querySelector('#mic').onclick=()=>{if(!SR){selfMode('Trình duyệt này chưa hỗ trợ nhận giọng.');return;}let rec;try{rec=new SR();}catch(e){selfMode('Không mở được micro.');return;}
    rec.lang='zh-CN';rec.interimResults=false;rec.maxAlternatives=3;msg.textContent='Đang nghe… 请说';
    rec.onresult=(e)=>{let best=0,heard='';for(const alt of e.results[0]){const s=score(line[0],alt.transcript);if(s>best){best=s;heard=alt.transcript;}}if(!heard)heard=e.results[0][0].transcript;
      if(best>=.7){msg.innerHTML=`<b>很好！Tốt lắm!</b> Nghe được: “${esc(heard)}” · ${Math.round(best*100)}%`;pass(false);}else{msg.innerHTML=`Nghe được: “${esc(heard)}” · ${Math.round(best*100)}% — thử lại nhé`;G.audio.sfx('wrong');}};
    rec.onerror=(e)=>{if(e.error==='not-allowed'||e.error==='service-not-allowed'||e.error==='audio-capture')selfMode('Micro chưa được cho phép. Vào Cài đặt iPhone › Safari › Micro để bật.');else msg.textContent='Không nghe rõ ('+e.error+'). Thử lại.';};
    try{rec.start();}catch(e){selfMode('Không mở được micro.');}};}
// ---------- SỔ CHỮ ----------
function bookTab(b){const cs=S().chars||{};b.innerHTML=`<p class="hint">Mọi chữ theo thứ tự bài học. Chạm để xem cấu tạo và mẹo nhớ. Viền xanh: đã viết được.</p>`+G.LESSONS.map(l=>`<h4>Bài ${l.special?'★':l.n} · <span class="zh">${l.zh}</span> ${L.done(l.n)?'✔':''}</h4><div class="chars">${L.newChars(l).map(c=>`<button class="ch ${cs[c]&&cs[c].w?'did':''} ${L.done(l.n)?'':'dim'}" data-c="${c}">${c}</button>`).join('')}</div>`).join('')+`<div id="cinfo"></div>`;
  b.querySelectorAll('.ch').forEach(x=>x.onclick=()=>{const c=G.CHARS[x.dataset.c];G.audio.say(c.zh);const box=b.querySelector('#cinfo');box.innerHTML=`<div class="dsheet"><div class="cc"><div class="cc-zh">${c.zh}</div><div><div class="fc-py">${c.py}</div><div>Hán Việt: <b>${esc(c.hv)}</b> · ${esc(c.vi)}</div><span class="badge t-${c.type}">${G.CHAR_TYPES[c.type]}</span></div></div><div class="memo"><div>🧩 ${esc(c.parts)}</div><div>💡 ${esc(c.tip)}</div></div></div>`;box.scrollIntoView({block:'nearest',behavior:'smooth'});});}
})();
