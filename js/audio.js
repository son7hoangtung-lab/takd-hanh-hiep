// ===== ÂM THANH: nhạc ngũ cung + hiệu ứng, giọng đọc =====
(function(){
let ctx=null, master=null, musicGain=null, sfxGain=null, timer=null, cur=null, step=0;
const A = G.audio = {};
A.init=function(){if(ctx)return;try{ctx=new (window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=.8;master.connect(ctx.destination);
  musicGain=ctx.createGain();musicGain.connect(master);sfxGain=ctx.createGain();sfxGain.connect(master);A.apply();}catch(e){ctx=null;}};
A.apply=function(){if(!ctx)return;const s=G.S&&G.S.settings||{};musicGain.gain.value=s.music===0?0:.22;sfxGain.gain.value=s.sfx===0?0:.5;};
A.resume=function(){if(ctx&&ctx.state==='suspended')ctx.resume();};
function note(freq,t,dur,type,gain,dest,attack){const o=ctx.createOscillator(),g=ctx.createGain();o.type=type||'triangle';o.frequency.value=freq;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(gain,t+(attack||.005));g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(dest||sfxGain);o.start(t);o.stop(t+dur+.05);}
// đàn tranh: 2 dao động lệch nhẹ, tắt nhanh
function pluck(freq,t,dur,gain){note(freq,t,dur,'triangle',gain,musicGain);note(freq*2.005,t,dur*.6,'sine',gain*.35,musicGain);}
const PENTA=[0,2,4,7,9]; // cung Đô – ngũ cung
function pfreq(base,idx){const o=Math.floor(idx/5),n=((idx%5)+5)%5;return base*Math.pow(2,(PENTA[n]+12*o)/12);}
const STYLES={
  village:{base:261.6,bpm:84,drone:130.8,density:.65,low:-2,high:9},
  city:{base:293.7,bpm:96,drone:146.8,density:.75,low:0,high:10,drum:1},
  sea:{base:220,bpm:72,drone:110,density:.5,low:-3,high:8,swell:1},
  boss:{base:196,bpm:132,drone:98,density:.9,low:-2,high:10,drum:2},
  night:{base:233.1,bpm:66,drone:116.5,density:.45,low:-2,high:7}
};
let pos=4, seedR=Math.random;
A.music=function(name){if(!ctx){cur=name;return;}if(cur===name&&timer)return;cur=name;if(timer)clearInterval(timer);step=0;pos=4;
  const st=STYLES[name]||STYLES.village;const beat=60/st.bpm/2;let next=ctx.currentTime+.1;
  timer=setInterval(()=>{if(!ctx)return;while(next<ctx.currentTime+.4){
    if(step%16===0){note(st.drone,next,beat*16,'sine',.10,musicGain,.4);note(st.drone*1.5,next,beat*16,'sine',.05,musicGain,.4);}
    if(Math.random()<st.density&&step%2===0||step%8===0){pos+=Math.round((Math.random()-.5)*4);pos=Math.max(st.low,Math.min(st.high,pos));pluck(pfreq(st.base,pos),next,beat*3,.13);
      if(Math.random()<.18)pluck(pfreq(st.base,pos+2),next+beat,beat*2,.08);}
    if(st.drum&&step%4===0){note(st.drum===2?70:90,next,.18,'sine',.25,musicGain);}
    if(st.drum===2&&step%4===2){note(140,next,.08,'square',.05,musicGain);}
    if(st.swell&&step%32===0){note(st.base/2,next,beat*28,'sine',.06,musicGain,2);}
    next+=beat;step++;}},100);};
A.stop=function(){if(timer)clearInterval(timer);timer=null;};
A.sfx=function(k){if(!ctx)return;const t=ctx.currentTime;
  switch(k){
    case 'hit':note(180,t,.08,'square',.18);note(90,t,.12,'sine',.3);break;
    case 'crit':note(320,t,.06,'square',.2);note(120,t,.2,'sawtooth',.18);break;
    case 'hurt':note(110,t,.15,'sawtooth',.16);break;
    case 'skill':[523,659,784].forEach((f,i)=>note(f,t+i*.04,.25,'triangle',.18));break;
    case 'thunder':note(60,t,.5,'sawtooth',.3);note(40,t+.05,.6,'square',.15);break;
    case 'level':[392,523,659,784,1046].forEach((f,i)=>note(f,t+i*.08,.4,'triangle',.22));break;
    case 'coin':note(988,t,.08,'square',.1);note(1318,t+.07,.15,'square',.1);break;
    case 'right':note(784,t,.12,'triangle',.2);note(1046,t+.08,.2,'triangle',.2);break;
    case 'wrong':note(220,t,.18,'square',.12);note(185,t+.12,.25,'square',.12);break;
    case 'anvil':note(1200,t,.25,'square',.12);note(2400,t,.1,'sine',.1);break;
    case 'fail':note(300,t,.3,'sawtooth',.15);note(150,t+.15,.4,'sawtooth',.15);break;
    case 'splash':note(400,t,.2,'sine',.12);note(200,t+.05,.3,'sine',.1);break;
    case 'bark':note(600,t,.06,'square',.12);note(500,t+.08,.06,'square',.12);break;
    case 'gong':note(110,t,2.2,'sine',.35,null,.01);note(167,t,1.8,'sine',.15);note(233,t,1.4,'sine',.1);break;
    case 'click':note(660,t,.04,'square',.06);break;
  }};
// ---- giọng đọc ----
let zhVoice=null,viVoice=null;
function pickVoices(){if(!window.speechSynthesis)return;const vs=speechSynthesis.getVoices();zhVoice=vs.find(v=>/zh[-_]CN/i.test(v.lang))||vs.find(v=>/^zh/i.test(v.lang))||null;viVoice=vs.find(v=>/^vi/i.test(v.lang))||null;}
if(window.speechSynthesis){pickVoices();try{speechSynthesis.onvoiceschanged=pickVoices;}catch(e){}}
A.say=function(text,lang){if(!window.speechSynthesis||!text)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text.replace(/[《》]/g,''));u.lang=lang==='vi'?'vi-VN':'zh-CN';const v=lang==='vi'?viVoice:zhVoice;if(v)u.voice=v;u.rate=lang==='vi'?1:.85;speechSynthesis.speak(u);}catch(e){}};
})();
