// ===== HỌC: SRS, niệm chú, thư phòng, luyện viết, luyện nói =====
(function(){
const L = G.learn = {};
const INT=[0,5*60e3,30*60e3,864e5,3*864e5,10*864e5];
const rnd=Math.random;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
L.w=id=>G.S.words[id]||(G.S.words[id]={b:0,d:0,r:0,x:0});
L.learned=()=>G.VOCAB.filter(v=>(G.S.words[v.id]||{}).b>=1);
L.mark=function(v,ok,fromLesson){const w=L.w(v.id);const was=w.b;if(ok){w.r++;w.b=Math.min(5,w.b+1);}else{w.x++;w.b=Math.max(was>0?1:0,w.b-1);if(fromLesson&&w.b===0)w.b=0;}w.d=Date.now()+INT[w.b];
  if(was<1&&w.b>=1){G.S.stats.learned++;G.questEvent('learn',{t:v.t});}if(ok&&was>=1)G.questEvent('review',{});};
// chọn từ để hỏi: ưu tiên từ đến hạn ôn
L.pickWord=function(){const learned=L.learned();const nowT=Date.now();
  if(learned.length<6){const pool=G.VOCAB.filter(v=>v.t==='co'||v.t==='so').slice(0,24);return pool[(rnd()*pool.length)|0];}
  const due=learned.filter(v=>G.S.words[v.id].d<=nowT);const pool=due.length&&rnd()<.75?due:learned;return pool[(rnd()*pool.length)|0];};
function distractors(v,n,field){const same=G.VOCAB.filter(x=>x.id!==v.id&&x.t===v.t&&x[field]!==v[field]);const other=G.VOCAB.filter(x=>x.id!==v.id&&x[field]!==v[field]);
  const out=[];const pool=same.length>=n?same:other;const used=new Set([v[field]]);let guard=0;while(out.length<n&&guard++<200){const x=pool[(rnd()*pool.length)|0];if(!used.has(x[field])){used.add(x[field]);out.push(x);}}return out;}
L.makeQ=function(v,type){type=type||['zh2vi','vi2zh','hv2zh','zh2vi','audio'][(rnd()*5)|0];if(type==='audio'&&(!window.speechSynthesis||G.S.settings.tts===0))type='zh2vi';
  const toZh=type!=='zh2vi';const field=toZh?'zh':'vi';const opts=[v,...distractors(v,3,field)].sort(()=>rnd()-.5);
  let prompt,label;if(type==='zh2vi'){prompt=`<div class="qz-zh">${v.zh}</div><div class="qz-py">${v.py}</div>`;label='Nghĩa là gì? 什么意思？';}
  else if(type==='vi2zh'){prompt=`<div class="qz-vi">${esc(v.vi)}</div>`;label='Chữ Hán nào? 哪个字？';}
  else if(type==='hv2zh'){prompt=`<div class="qz-vi">« ${esc(v.hv)} »</div><div class="qz-py">âm Hán Việt</div>`;label='Chữ nào đọc là…? 哪个字？';}
  else {prompt=`<button class="qz-ear" data-say="${esc(v.zh)}">🔊</button>`;label='Nghe và chọn chữ 听一听';}
  return {v,type,opts:opts.map(o=>({v:o,txt:toZh?o.zh:o.vi,ok:o.id===v.id})),prompt,label,toZh};};

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
    const card=el.querySelector('.qz-card');card.insertAdjacentHTML('beforeend',`<div class="qz-ans">${ok?(fast?'⚡ Nhanh! Bạo kích':'✔ Đúng'):'✘ '+(i<0?'Hết giờ':'Sai')} — <b>${v.zh}</b> ${v.py} · ${esc(v.hv)} · ${esc(v.vi)}</div>`);
    G.audio.sfx(ok?'right':'wrong');if(!ok||G.S.settings.tts!==0)G.audio.say(v.zh);
    setTimeout(()=>{el.hidden=true;el.innerHTML='';G.timeScale=1;L.active=false;o.onDone(ok,fast);},ok?520:1500);}};

// ---------- THƯ PHÒNG ----------
L.panel=function(box,tab){tab=tab||L.tab||'new';L.tab=tab;const tabs=[['new','学','Học mới'],['review','复习','Ôn tập'],['write','写','Luyện viết'],['speak','说','Luyện nói'],['book','词','Sổ từ']];
  box.innerHTML=`<div class="tabs">${tabs.map(t=>`<button class="tab ${t[0]===tab?'on':''}" data-t="${t[0]}"><span class="zh">${t[1]}</span>${t[2]}</button>`).join('')}</div><div class="tabbody"></div>`;
  box.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{G.audio.sfx('click');L.panel(box,b.dataset.t);});
  const body=box.querySelector('.tabbody');({new:newTab,review:reviewTab,write:writeTab,speak:speakTab,book:bookTab})[tab](body);};
function topicStats(t){const all=G.VOCAB.filter(v=>v.t===t);const n=all.filter(v=>(G.S.words[v.id]||{}).b>=1).length;return [n,all.length];}
function newTab(b){b.innerHTML=`<p class="hint">Mỗi bài 5 từ: xem thẻ, nghe đọc, rồi kiểm tra nhanh. Thưởng EXP và 玄晶 Huyền tinh để cường hóa.</p><div class="topics">${Object.keys(G.TOPICS).map(t=>{const [n,a]=topicStats(t);const tp=G.TOPICS[t];
    return `<button class="topic" data-t="${t}"><span class="zh">${tp.zh}</span><b>${tp.vi}</b><span class="prog"><i style="width:${n/a*100}%"></i></span><small>${n}/${a}</small></button>`;}).join('')}</div>`;
  b.querySelectorAll('.topic').forEach(x=>x.onclick=()=>lesson(b,x.dataset.t));}
function card(v){return `<div class="fc"><button class="fc-say" data-say="${esc(v.zh)}">🔊</button><div class="fc-zh">${v.zh}</div><div class="fc-py">${v.py}</div><div class="fc-hv">Hán Việt: <b>${esc(v.hv)}</b></div><div class="fc-vi">${esc(v.vi)}</div></div>`;}
function lesson(b,t){const words=G.VOCAB.filter(v=>v.t===t&&!((G.S.words[v.id]||{}).b>=1)).slice(0,5);if(!words.length){b.innerHTML=`<p class="hint">Chủ đề này đã học hết. Vào <b>Ôn tập</b> để giữ trí nhớ nhé.</p><button class="btn" id="bk">‹ Chủ đề khác</button>`;b.querySelector('#bk').onclick=()=>newTab(b);return;}
  let i=0;const show=()=>{const v=words[i];b.innerHTML=`<div class="lesson-top">Thẻ ${i+1}/${words.length} · ${G.TOPICS[t].vi}</div>${card(v)}<div class="row"><button class="btn ghost" id="pv" ${i?'':'disabled'}>‹ Trước</button><button class="btn" id="nx">${i<words.length-1?'Tiếp ›':'Kiểm tra ›'}</button></div>`;
    G.audio.say(v.zh);b.querySelector('.fc-say').onclick=()=>G.audio.say(v.zh);b.querySelector('#pv').onclick=()=>{i--;show();};b.querySelector('#nx').onclick=()=>{if(i<words.length-1){i++;show();}else check(b,words,0,0);};};show();}
function check(b,words,k,score){if(k>=words.length){const exp=12*G.S.lv*score,st=Math.ceil(score/2);G.addExp(exp,G.P.x,G.P.y);G.S.stone+=st;G.audio.sfx('level');
    b.innerHTML=`<div class="result"><div class="big">${score}/${words.length}</div><p>+${exp} EXP · +${st} 玄晶 Huyền tinh</p><p class="hint">Từ trả lời đúng đã vào sổ. Từ sai sẽ xuất hiện lại.</p><button class="btn" id="again">Học tiếp</button></div>`;b.querySelector('#again').onclick=()=>newTab(b);G.save();return;}
  const v=words[k];const q=L.makeQ(v,k%2?'vi2zh':'zh2vi');b.innerHTML=`<div class="lesson-top">Kiểm tra ${k+1}/${words.length}</div><div class="qz-card in"><div class="qz-lab">${q.label}</div><div class="qz-prompt">${q.prompt}</div><div class="qz-opts ${q.toZh?'zh':''}">${q.opts.map((x,i)=>`<button data-i="${i}">${esc(x.txt)}</button>`).join('')}</div></div>`;
  b.querySelectorAll('.qz-opts button').forEach(btn=>btn.onclick=()=>{const ok=q.opts[+btn.dataset.i].ok;b.querySelectorAll('.qz-opts button').forEach((x,j)=>{x.disabled=true;if(q.opts[j].ok)x.classList.add('ok');else if(x===btn)x.classList.add('bad');});
    if(ok){L.mark(v,true,true);G.audio.sfx('right');}else{G.audio.sfx('wrong');const w=L.w(v.id);w.x++;}G.audio.say(v.zh);setTimeout(()=>check(b,words,k+1,score+(ok?1:0)),ok?600:1300);});}
function reviewTab(b){const learned=L.learned();if(learned.length<4){b.innerHTML=`<p class="hint">Cần học ít nhất 4 từ trong <b>Học mới</b> trước khi ôn.</p>`;return;}
  const due=learned.filter(v=>G.S.words[v.id].d<=Date.now()).length;
  b.innerHTML=`<p class="hint">Đã thuộc <b>${learned.length}</b> từ · Đến hạn ôn <b>${due}</b> từ. Ôn 10 câu, mỗi câu đúng +EXP và có thể rơi Huyền tinh.</p><button class="btn" id="go">Bắt đầu ôn 开始</button>`;
  b.querySelector('#go').onclick=()=>rv(b,0,0);}
function rv(b,k,score){if(k>=10){const st=Math.floor(score/3);G.S.stone+=st;G.addExp(score*6*G.S.lv,G.P.x,G.P.y);b.innerHTML=`<div class="result"><div class="big">${score}/10</div><p>+${score*6*G.S.lv} EXP · +${st} 玄晶</p><button class="btn" id="again">Ôn thêm</button></div>`;b.querySelector('#again').onclick=()=>rv(b,0,0);G.save();return;}
  const v=L.pickWord();const q=L.makeQ(v);b.innerHTML=`<div class="lesson-top">Câu ${k+1}/10</div><div class="qz-card in"><div class="qz-lab">${q.label}</div><div class="qz-prompt">${q.prompt}</div><div class="qz-opts ${q.toZh?'zh':''}">${q.opts.map((x,i)=>`<button data-i="${i}">${esc(x.txt)}</button>`).join('')}</div></div>`;
  if(q.type==='audio'){G.audio.say(v.zh);b.querySelector('.qz-ear').onclick=()=>G.audio.say(v.zh);}
  b.querySelectorAll('.qz-opts button').forEach(btn=>btn.onclick=()=>{const ok=q.opts[+btn.dataset.i].ok;L.mark(v,ok);b.querySelectorAll('.qz-opts button').forEach((x,j)=>{x.disabled=true;if(q.opts[j].ok)x.classList.add('ok');else if(x===btn)x.classList.add('bad');});
    G.audio.sfx(ok?'right':'wrong');if(!ok)b.querySelector('.qz-card').insertAdjacentHTML('beforeend',`<div class="qz-ans"><b>${v.zh}</b> ${v.py} · ${esc(v.hv)} · ${esc(v.vi)}</div>`);G.audio.say(v.zh);setTimeout(()=>rv(b,k+1,score+(ok?1:0)),ok?550:1500);});}
// ---------- LUYỆN VIẾT ----------
function writeTab(b){const learned=L.learned();const chars=[...new Set(learned.flatMap(v=>[...v.zh]).filter(c=>G.STROKES&&G.STROKES[c]))];
  const base=chars.length?chars:['一','二','三','人','大','小','你','我','好','马','鱼','山'];
  b.innerHTML=`<p class="hint">Chọn một chữ. Viết bằng ngón tay theo đúng thứ tự nét. Sai 2 lần sẽ hiện gợi ý. ${chars.length?'':'(Chưa học từ nào – luyện chữ cơ bản)'}</p><div class="chars">${base.map(c=>`<button class="ch" data-c="${c}">${c}</button>`).join('')}</div>`;
  b.querySelectorAll('.ch').forEach(x=>x.onclick=()=>writeOne(b,x.dataset.c));}
function writeOne(b,c){const v=G.VOCAB.find(x=>x.zh.includes(c));b.innerHTML=`<div class="w-top"><div><div class="w-big">${c}</div></div><div>${v?`<b>${v.zh}</b> ${v.py}<br>Hán Việt: ${esc(v.hv)}<br>${esc(v.vi)}`:''}</div></div>
  <div class="w-pad" id="wpad"></div><div class="w-msg" id="wmsg">Bắt đầu viết nét đầu tiên…</div><div class="row"><button class="btn ghost" id="wshow">Xem cách viết</button><button class="btn ghost" id="wagain">Viết lại</button><button class="btn ghost" id="wback">‹ Chữ khác</button></div>`;
  b.querySelector('#wback').onclick=()=>writeTab(b);
  if(!window.HanziWriter){b.querySelector('#wmsg').textContent='Không tải được bộ luyện viết.';return;}
  const pad=b.querySelector('#wpad');const size=Math.min(260,pad.clientWidth||260);
  const opts={width:size,height:size,padding:12,showOutline:true,showCharacter:false,strokeColor:'#1a1210',outlineColor:'#d8c9a6',drawingColor:'#8a1f14',drawingWidth:22,highlightColor:'#d9a441',
    charDataLoader:(ch,done,err)=>{const d=G.STROKES&&G.STROKES[ch];if(d)done(d);else err&&err('missing');}};
  const w=HanziWriter.create(pad,c,opts);const msg=b.querySelector('#wmsg');
  const start=()=>w.quiz({showHintAfterMisses:2,onMistake:()=>{msg.textContent='Chưa đúng nét – thử lại';G.audio.sfx('wrong');},onCorrectStroke:(d)=>{msg.textContent=`Đúng nét ${d.strokeNum+1}/${d.strokeNum+1+d.strokesRemaining}`;G.audio.sfx('click');},
    onComplete:(d)=>{G.S.stats.written++;G.S.stone+=1;G.addExp(15*G.S.lv);G.questEvent('write',{});G.audio.sfx('level');G.audio.say(v?v.zh:c);msg.innerHTML=`<b>写得好！</b> Viết đẹp! +1 玄晶 · ${d.totalMistakes} lỗi`;G.save();}});
  start();b.querySelector('#wagain').onclick=()=>{w.cancelQuiz();start();};b.querySelector('#wshow').onclick=()=>{w.cancelQuiz();w.showCharacter();w.animateCharacter({onComplete:()=>{w.hideCharacter();start();}});};}
// ---------- LUYỆN NÓI ----------
function speakPool(){const lines=[];const learned=L.learned();learned.forEach(v=>lines.push([v.zh,v.py,v.vi]));G.MAIN_QUESTS.slice(0,G.S.q.i+1).forEach(q=>q.d.forEach(d=>lines.push(d)));
  if(lines.length<5)G.VOCAB.slice(0,12).forEach(v=>lines.push([v.zh,v.py,v.vi]));return lines;}
const norm=s=>(s||'').replace(/[\s，。！？、,.!?…"'：:；;《》]/g,'');
function score(target,heard){const t=[...norm(target)],h=norm(heard);if(!t.length)return 0;let hit=0;t.forEach(c=>{if(h.includes(c))hit++;});return hit/t.length;}
function speakTab(b){const pool=speakPool();const line=pool[(rnd()*pool.length)|0];const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  b.innerHTML=`<p class="hint">Nghe mẫu, rồi bấm 🎤 và đọc to câu dưới đây.</p><div class="fc"><button class="fc-say" id="sl">🔊</button><div class="fc-zh sm">${line[0]}</div><div class="fc-py">${line[1]}</div><div class="fc-vi">${esc(line[2])}</div></div>
  <div class="row"><button class="btn big" id="mic">🎤 Nói 说</button><button class="btn ghost" id="nx">Câu khác ›</button></div><div class="w-msg" id="smsg"></div><div id="self" hidden class="row"><button class="btn" id="selfok">Tôi đã đọc to ✓</button></div>`;
  const msg=b.querySelector('#smsg');b.querySelector('#sl').onclick=()=>G.audio.say(line[0]);b.querySelector('#nx').onclick=()=>speakTab(b);G.audio.say(line[0]);
  const pass=(half)=>{G.S.stats.spoken++;G.S.stone+=half?1:2;G.addExp((half?8:20)*G.S.lv);G.questEvent('speak',{});G.audio.sfx('level');G.save();};
  const selfMode=(why)=>{msg.innerHTML=why+'<br>Tạm thời: nghe mẫu, đọc to theo, rồi tự xác nhận.';b.querySelector('#self').hidden=false;};
  b.querySelector('#selfok').onclick=()=>{pass(true);msg.innerHTML='<b>很好！</b> +1 玄晶';b.querySelector('#self').hidden=true;};
  b.querySelector('#mic').onclick=()=>{if(!SR){selfMode('Trình duyệt này chưa hỗ trợ nhận giọng.');return;}let rec;try{rec=new SR();}catch(e){selfMode('Không mở được micro.');return;}
    rec.lang='zh-CN';rec.interimResults=false;rec.maxAlternatives=3;msg.textContent='Đang nghe… 请说';
    rec.onresult=(e)=>{let best=0,heard='';for(const alt of e.results[0]){const s=score(line[0],alt.transcript);if(s>best){best=s;heard=alt.transcript;}}if(!heard)heard=e.results[0][0].transcript;
      if(best>=.7){msg.innerHTML=`<b>很好！Tốt lắm!</b> Nghe được: “${esc(heard)}” · ${Math.round(best*100)}%`;pass(false);}else{msg.innerHTML=`Nghe được: “${esc(heard)}” · ${Math.round(best*100)}% — thử lại nhé`;G.audio.sfx('wrong');}};
    rec.onerror=(e)=>{if(e.error==='not-allowed'||e.error==='service-not-allowed'||e.error==='audio-capture')selfMode('Micro bị chặn ở bản xem thử này. Bản cài trên iPhone (GitHub) sẽ nhận giọng được.');else msg.textContent='Không nghe rõ ('+e.error+'). Thử lại.';};
    try{rec.start();}catch(e){selfMode('Không mở được micro.');}};}
function bookTab(b){b.innerHTML=Object.keys(G.TOPICS).map(t=>{const ws=G.VOCAB.filter(v=>v.t===t);return `<h4>${G.TOPICS[t].zh} · ${G.TOPICS[t].vi}</h4><div class="book">${ws.map(v=>{const w=G.S.words[v.id]||{b:0};
  return `<button class="bk lv${w.b}" data-say="${esc(v.zh)}"><span class="zh">${v.zh}</span><span>${v.py}</span><small>${esc(v.hv)} · ${esc(v.vi)}</small></button>`;}).join('')}</div>`;}).join('');
  b.querySelectorAll('[data-say]').forEach(x=>x.onclick=()=>G.audio.say(x.dataset.say));}
})();
