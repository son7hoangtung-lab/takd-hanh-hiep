// ===== BẢN ĐỒ THẾ GIỚI "SƠN HÀ XÃ TẮC" – Đại Việt thời Lý =====
(function(){
// mỗi vùng: 1 thủ lĩnh trong thành + 1 loài quái ở rừng hoang ngoài thành
G.PROVINCES=[
  {id:'kimlien',vi:'Làng Kim Liên',zh:'金莲村',py:'Jīnlián cūn',ll:[105.70,20.86],boss:['Ác bá Râu Hùm','虎须恶霸'],mob:['Sói rừng','野狼'],ch:'HSK 1 · Bài 1–6',map:'kimlien',lv:'1–12'},
  {id:'thanglong',vi:'Kinh thành Thăng Long',zh:'升龙城',py:'Shēnglóng chéng',ll:[105.86,21.05],boss:['Hắc Phong trại chủ','黑风寨主'],mob:['Hổ dữ','老虎'],ch:'HSK 1 · Bài 7–10',map:'thanglong',lv:'10–22',after:'kimlien'},
  {id:'coloa',vi:'Thành Cổ Loa',zh:'古螺城',py:'Gǔluó chéng',ll:[105.93,21.25],boss:['Thạch Giáp tướng quân','石甲将军'],mob:['Ma trơi thành cổ','古城鬼火'],ch:'HSK 2 · Bài 1–3',lv:'22–30',after:'thanglong'},
  {id:'nhunguyet',vi:'Phòng tuyến Như Nguyệt',zh:'如月江',py:'Rúyuè jiāng',ll:[106.2,21.32],boss:['Thủy tặc Hắc Sa','黑沙水寇'],mob:['Cóc sông Cầu','江蟾'],ch:'HSK 2 · Bài 4–6',lv:'30–38',after:'coloa'},
  {id:'chilang',vi:'Ải Chi Lăng',zh:'支棱关',py:'Zhīléng guān',ll:[106.55,21.68],boss:['Đầu lĩnh Ải Bắc','关北贼首'],mob:['Sơn tiêu','山魈'],ch:'HSK 2 · Bài 7–9',lv:'38–46',after:'nhunguyet'},
  {id:'vandon',vi:'Thương cảng Vân Đồn',zh:'云屯港',py:'Yúntún gǎng',ll:[107.42,21.07],boss:['Xích Tu Hải Tặc Vương','赤须海盗王'],mob:['Cua đá','石蟹'],ch:'HSK 1 · Bài 11–15 + Bảo hiểm',map:'vandon',lv:'20–30',after:'thanglong'},
  {id:'bachdang',vi:'Sông Bạch Đằng',zh:'白藤江',py:'Báiténg jiāng',ll:[106.78,20.9],boss:['Giao Long','蛟龙'],mob:['Cá dữ','恶鱼'],ch:'HSK 2 · Bài 10–12',lv:'46–54',after:'vandon'},
  {id:'hoalu',vi:'Cố đô Hoa Lư',zh:'华闾',py:'Huálǘ',ll:[105.9,20.28],boss:['Cửu Vĩ Hồ Vương','九尾狐王'],mob:['Cáo núi','山狐'],ch:'HSK 2 · Bài 13–15',lv:'54–62',after:'bachdang'},
  {id:'aichau',vi:'Ái Châu',zh:'爱州',py:'Àizhōu',ll:[105.72,19.8],boss:['Trại chủ núi Nưa','那山寨主'],mob:['Chó rừng','豺狗'],ch:'HSK 3 · Bài 1–5',lv:'62–70',after:'hoalu'},
  {id:'tong',vi:'Đất Tống',zh:'大宋',py:'Dà Sòng',ll:[106.3,23.25],boss:['?','?'],mob:['?','?'],ch:'HSK 3–4',far:1,after:'chilang'},
  {id:'mongco',vi:'Thảo nguyên Mông Cổ',zh:'蒙古',py:'Měnggǔ',ll:[103.3,23.3],boss:['?','?'],mob:['?','?'],ch:'HSK 4–5',far:1,after:'tong'},
  {id:'chiem',vi:'Chiêm Thành',zh:'占城',py:'Zhànchéng',ll:[105.85,18.85],boss:['?','?'],mob:['?','?'],ch:'HSK 5–6',far:1,after:'aichau'}
];
const W=1000,H=960;const X=lon=>(lon-101.9)*150,Y=lat=>(23.75-lat)*190;const P=([lo,la])=>[X(lo),Y(la)];
const LAND=[[102.15,22.4],[102.6,22.75],[103.2,22.8],[103.9,22.55],[104.4,22.85],[104.95,23.15],[105.35,23.35],[105.9,22.95],[106.25,22.85],[106.7,22.4],[106.65,22.0],[107.05,21.8],[107.6,21.65],[108.0,21.55],
  [107.7,21.42],[107.35,21.2],[107.05,21.05],[106.8,20.85],[106.6,20.6],[106.55,20.35],[106.2,20.05],[105.98,19.85],[105.85,19.55],[105.75,19.15],[105.68,18.85],[105.95,18.4],
  [105.1,18.4],[104.6,19.0],[104.05,19.4],[104.2,19.9],[103.95,20.3],[104.1,20.7],[103.6,20.75],[103.2,20.85],[102.9,21.2],[102.35,21.6]];
const RIVERS=[[[103.95,22.5],[104.4,22.05],[104.87,21.7],[105.4,21.3],[105.86,21.03],[106.05,20.65],[106.3,20.4],[106.55,20.25]],[[103.3,21.4],[104.2,21.15],[104.8,21.25],[105.4,21.3]],
  [[105.86,21.03],[106.1,21.08],[106.4,21.06],[106.8,20.88]],[[105.8,21.95],[106.05,21.5],[106.18,21.3],[106.4,21.06]],[[105.95,21.9],[106.2,21.75],[106.4,21.06]],[[105.4,20.1],[105.9,20.0],[106.2,19.9]]];
const MTN=[[103.4,22.3],[103.8,21.9],[104.2,22.3],[103.0,21.7],[104.6,21.4],[105.0,22.5],[105.6,22.6],[106.2,22.4],[106.0,22.1],[104.5,20.5],[104.9,19.6],[105.3,20.4],[103.7,21.2],[106.9,21.9],[104.2,21.6]];
const ISL=[[107.45,21.0,10,6],[107.62,21.12,8,5],[107.0,20.78,12,7],[107.28,20.92,7,4],[107.8,21.3,6,4]];
function status(p){const S=G.S;if(S.conq&&S.conq[p.id])return 'conq';if(p.far)return 'far';if(!p.map)return 'soon';if(S.unlocked[p.id])return 'open';return 'lock';}
G.provStatus=status;
G.drawSonHa=function(c,sel){c.width=W;c.height=H;const x=c.getContext('2d');
  // đất ngoài cõi (Tống, Ai Lao) làm nền, rồi vẽ biển phía đông
  x.fillStyle='#8f7b58';x.fillRect(0,0,W,H);x.strokeStyle='rgba(90,60,30,.12)';x.lineWidth=2;for(let i=-H;i<W;i+=18){x.beginPath();x.moveTo(i,0);x.lineTo(i+H,H);x.stroke();}
  const sea=x.createLinearGradient(0,0,W,H);sea.addColorStop(0,'#3d6f7a');sea.addColorStop(1,'#24505e');x.fillStyle=sea;x.beginPath();x.moveTo(...P([108.0,21.55]));LAND.slice(14,26).forEach(p=>x.lineTo(...P(p)));x.lineTo(...P([105.95,18.4]));x.lineTo(W,H);x.lineTo(W,P([108.3,21.55])[1]);x.closePath();x.fill();
  x.save();x.clip();for(let i=0;i<220;i++){const sx=(i*137)%W,sy=(i*263)%H;x.strokeStyle='rgba(255,255,255,.08)';x.beginPath();x.arc(sx,sy,6,Math.PI*1.1,Math.PI*1.9);x.stroke();}x.restore();
  // đất Đại Việt
  x.save();x.beginPath();LAND.forEach((p,i)=>i?x.lineTo(...P(p)):x.moveTo(...P(p)));x.closePath();x.shadowColor='rgba(0,0,0,.45)';x.shadowBlur=18;x.fillStyle='#d9c48e';x.fill();x.restore();
  x.save();x.beginPath();LAND.forEach((p,i)=>i?x.lineTo(...P(p)):x.moveTo(...P(p)));x.closePath();x.clip();
  const g2=x.createRadialGradient(...P([105.9,21.0]),40,...P([105.9,21.0]),520);g2.addColorStop(0,'rgba(130,170,90,.55)');g2.addColorStop(1,'rgba(90,120,60,.15)');x.fillStyle=g2;x.fillRect(0,0,W,H);x.restore();
  x.strokeStyle='#7a5a2a';x.lineWidth=3;x.beginPath();LAND.forEach((p,i)=>i?x.lineTo(...P(p)):x.moveTo(...P(p)));x.closePath();x.stroke();
  // biên giới phía bắc (nét đứt đỏ)
  x.setLineDash([10,6]);x.strokeStyle='#8a2a1c';x.lineWidth=3;x.beginPath();LAND.slice(0,14).forEach((p,i)=>i?x.lineTo(...P(p)):x.moveTo(...P(p)));x.stroke();x.setLineDash([]);
  ISL.forEach(([lo,la,a,b])=>{x.fillStyle='#cdb57e';x.beginPath();x.ellipse(...P([lo,la]),a,b,0.4,0,7);x.fill();x.strokeStyle='#7a5a2a';x.lineWidth=1.5;x.stroke();});
  // núi
  MTN.forEach(([lo,la],i)=>{const [mx,my]=P([lo,la]);for(let k=0;k<3;k++){const ox=mx+(k-1)*16,oy=my+(k%2)*6,h=22+((i+k)%3)*6;x.fillStyle=k%2?'#8a7a52':'#9a8a5e';x.beginPath();x.moveTo(ox-14,oy+10);x.lineTo(ox,oy+10-h);x.lineTo(ox+14,oy+10);x.closePath();x.fill();x.strokeStyle='rgba(60,40,20,.5)';x.lineWidth=1.2;x.stroke();x.fillStyle='rgba(255,255,255,.35)';x.beginPath();x.moveTo(ox-4,oy+10-h+8);x.lineTo(ox,oy+10-h);x.lineTo(ox+4,oy+10-h+8);x.fill();}});
  // sông
  RIVERS.forEach((r,i)=>{x.strokeStyle='#4f8fa0';x.lineWidth=i===0?6:3.5;x.lineCap='round';x.lineJoin='round';x.beginPath();r.forEach((p,k)=>k?x.lineTo(...P(p)):x.moveTo(...P(p)));x.stroke();});
  const T=(t,px,py,sz,col,al)=>{x.font=`800 ${sz}px "Be Vietnam Pro",system-ui`;x.textAlign=al||'center';x.textBaseline='middle';x.lineWidth=Math.max(3,sz/4);x.strokeStyle='rgba(30,16,8,.8)';x.strokeText(t,px,py);x.fillStyle=col;x.fillText(t,px,py);};
  T('ĐẤT TỐNG',...P([106.0,23.5]),30,'#f5e6c0');T('AI LAO',...P([103.0,19.7]),26,'#f5e6c0');T('BIỂN ĐÔNG',...P([107.5,19.9]),30,'#cfe8f0');T('Sông Hồng',...P([104.8,21.95]),18,'#bfe6f0');T('Sông Đà',...P([104.0,21.0]),16,'#bfe6f0');
  T('ĐẠI VIỆT',...P([104.9,20.95]),44,'rgba(122,40,24,.85)');
  // đường chinh phạt
  const byId={};G.PROVINCES.forEach(p=>byId[p.id]=p);
  G.PROVINCES.forEach(p=>{if(!p.after)return;const a=byId[p.after];const [x1,y1]=P(a.ll),[x2,y2]=P(p.ll);const done=status(p)==='conq';x.setLineDash(done?[]:[8,7]);x.strokeStyle=done?'#e8b84a':'rgba(90,40,20,.75)';x.lineWidth=done?5:3;x.beginPath();x.moveTo(x1,y1);x.lineTo(x2,y2);x.stroke();});x.setLineDash([]);
  // thành
  const cur=G.map&&G.map.id;
  G.PROVINCES.forEach(p=>{const [px,py]=P(p.ll);const st=status(p);const r=p.far?20:17;
    x.fillStyle=st==='conq'?'#b3261e':st==='open'?'#e8b84a':st==='lock'?'#6a5a4a':'#7a7064';x.strokeStyle=sel===p.id?'#fff':'#2a1a0e';x.lineWidth=sel===p.id?5:3;
    x.beginPath();x.arc(px,py,r,0,7);x.fill();x.stroke();
    x.font='900 18px "Noto Serif SC",serif';x.textAlign='center';x.textBaseline='middle';x.fillStyle=st==='conq'?'#f2d27a':'#2a1a0e';x.fillText(st==='conq'?'越':st==='lock'||st==='soon'||st==='far'?'🔒':'⚔',px,py+1);
    if(st==='conq'){x.fillStyle='#5a3a1a';x.fillRect(px+r-2,py-r-26,3,30);x.fillStyle='#b3261e';x.beginPath();x.moveTo(px+r+1,py-r-26);x.lineTo(px+r+24,py-r-20);x.lineTo(px+r+1,py-r-13);x.fill();}
    const lx=px+(p.id==='kimlien'||p.id==='aichau'||p.id==='hoalu'?-24:24),al=p.id==='kimlien'||p.id==='aichau'||p.id==='hoalu'?'right':'left';T(p.vi,lx,py-6,19,st==='conq'?'#ffd9a0':'#fff6dc',al);T(p.zh,lx,py+15,15,'#e8d6a8',al);});
  // bạn ở đây
  const me=G.PROVINCES.find(p=>p.map===cur);if(me){const [px,py]=P(me.ll);x.fillStyle='#e8352a';x.strokeStyle='#fff';x.lineWidth=3;x.beginPath();x.moveTo(px,py-22);x.arc(px,py-48,16,Math.PI*.75,Math.PI*2.25);x.closePath();x.fill();x.stroke();x.fillStyle='#fff';x.beginPath();x.arc(px,py-48,6,0,7);x.fill();T('BẠN Ở ĐÂY',px,py-80,17,'#ffdad6');}
  // khung
  x.strokeStyle='#c99a42';x.lineWidth=10;x.strokeRect(5,5,W-10,H-10);x.strokeStyle='#5a3a1a';x.lineWidth=2;x.strokeRect(14,14,W-28,H-28);
  T('山河社稷 · SƠN HÀ XÃ TẮC',W/2,44,30,'#f2d27a');};
G.sonHaHit=function(c,ev){const r=c.getBoundingClientRect();const mx=(ev.clientX-r.left)/r.width*W,my=(ev.clientY-r.top)/r.height*H;let best=null,bd=40;G.PROVINCES.forEach(p=>{const [px,py]=P(p.ll);const d=Math.hypot(px-mx,py-my);if(d<bd){bd=d;best=p;}});return best;};
})();
