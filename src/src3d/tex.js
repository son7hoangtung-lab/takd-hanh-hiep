// Kết cấu vẽ bằng canvas (gói trong bundle, không cần tải ảnh)
import * as THREE from 'three';

function rng(seed){let s=seed>>>0||1;return ()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296;};}
export {rng};
function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return [c,c.getContext('2d')];}
function toTex(c,rep){const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;if(rep)t.repeat.set(rep[0],rep[1]);t.anisotropy=4;return t;}
const shade=(hex,f)=>{const c=new THREE.Color(hex);c.multiplyScalar(f);return '#'+c.getHexString();};

const cache={};
export function tex(name){if(cache[name])return cache[name];const f=MAKERS[name];const t=toTex(f());cache[name]=t;return t;}

const MAKERS={
  // ngói âm dương đỏ nâu
  roofTile(){const [c,x]=canvas(128,128);const r=rng(3);x.fillStyle='#7a3322';x.fillRect(0,0,128,128);
    for(let row=0;row<8;row++){for(let col=0;col<8;col++){const X=col*16+(row%2)*8,Y=row*16;const g=x.createLinearGradient(X,0,X+16,0);const b=0.8+r()*0.35;
      g.addColorStop(0,shade('#5e2418',b));g.addColorStop(.5,shade('#a24a32',b));g.addColorStop(1,shade('#5e2418',b));x.fillStyle=g;x.fillRect(X+1,Y,14,17);
      x.fillStyle='rgba(0,0,0,.35)';x.fillRect(X,Y+15,16,2);if(r()<.15){x.fillStyle='rgba(60,80,40,.35)';x.fillRect(X+2,Y+4,8,6);}}}return c;},
  // ngói lưu ly vàng (hoàng cung)
  roofGold(){const [c,x]=canvas(128,128);const r=rng(5);x.fillStyle='#8a5a12';x.fillRect(0,0,128,128);
    for(let row=0;row<8;row++)for(let col=0;col<8;col++){const X=col*16+(row%2)*8,Y=row*16;const g=x.createLinearGradient(X,0,X+16,0);const b=.85+r()*.3;g.addColorStop(0,shade('#8a5a12',b));g.addColorStop(.5,shade('#e2b04a',b));g.addColorStop(1,shade('#8a5a12',b));x.fillStyle=g;x.fillRect(X+1,Y,14,17);x.fillStyle='rgba(0,0,0,.3)';x.fillRect(X,Y+15,16,2);}return c;},
  // mái rạ / tranh
  thatch(){const [c,x]=canvas(128,128);const r=rng(9);x.fillStyle='#a8854a';x.fillRect(0,0,128,128);
    for(let i=0;i<1400;i++){const X=r()*128,Y=r()*128,l=6+r()*14;const b=.7+r()*.6;x.strokeStyle=shade(['#c9a35a','#b08a48','#8a6a34','#d8b46a'][(r()*4)|0],b);x.lineWidth=1+r();x.beginPath();x.moveTo(X,Y);x.lineTo(X+(r()-.5)*3,Y+l);x.stroke();}
    for(let y=0;y<128;y+=16){x.fillStyle='rgba(60,40,15,.25)';x.fillRect(0,y+13,128,3);}return c;},
  // tường trát vàng
  plaster(){const [c,x]=canvas(128,128);const r=rng(11);x.fillStyle='#d8c08a';x.fillRect(0,0,128,128);
    for(let i=0;i<900;i++){x.fillStyle=`rgba(${120+r()*60|0},${100+r()*40|0},${60+r()*30|0},${r()*.12})`;x.fillRect(r()*128,r()*128,2+r()*6,2+r()*6);}
    x.fillStyle='rgba(90,70,40,.35)';x.fillRect(0,116,128,12);for(let i=0;i<6;i++){x.strokeStyle='rgba(90,60,30,.25)';x.beginPath();let X=r()*128,Y=r()*100;x.moveTo(X,Y);for(let k=0;k<5;k++){X+=(r()-.5)*14;Y+=r()*10;x.lineTo(X,Y);}x.stroke();}return c;},
  // tường đất trộn rơm
  mud(){const [c,x]=canvas(128,128);const r=rng(13);x.fillStyle='#9a7a4a';x.fillRect(0,0,128,128);
    for(let i=0;i<1200;i++){x.fillStyle=`rgba(${100+r()*70|0},${75+r()*50|0},${40+r()*30|0},${.15+r()*.2})`;x.fillRect(r()*128,r()*128,1+r()*4,1+r()*3);}
    for(let i=0;i<120;i++){x.strokeStyle='rgba(220,190,120,.35)';x.beginPath();const X=r()*128,Y=r()*128;x.moveTo(X,Y);x.lineTo(X+(r()-.5)*8,Y+(r()-.5)*3);x.stroke();}return c;},
  // gỗ
  wood(){const [c,x]=canvas(64,128);const r=rng(17);x.fillStyle='#6a4426';x.fillRect(0,0,64,128);
    for(let i=0;i<64;i+=8){x.fillStyle=shade('#6a4426',.8+r()*.4);x.fillRect(i,0,8,128);x.fillStyle='rgba(0,0,0,.35)';x.fillRect(i,0,1,128);}
    for(let i=0;i<120;i++){x.strokeStyle=`rgba(40,22,10,${.15+r()*.2})`;x.beginPath();const X=r()*64,Y=r()*128;x.moveTo(X,Y);x.lineTo(X+(r()-.5)*2,Y+10+r()*20);x.stroke();}return c;},
  // gỗ sơn son
  lacquer(){const [c,x]=canvas(32,128);const g=x.createLinearGradient(0,0,32,0);g.addColorStop(0,'#5a120c');g.addColorStop(.45,'#a8261a');g.addColorStop(.55,'#c43a26');g.addColorStop(1,'#5a120c');x.fillStyle=g;x.fillRect(0,0,32,128);
    x.fillStyle='rgba(217,164,65,.8)';x.fillRect(0,4,32,3);x.fillRect(0,121,32,3);return c;},
  // cửa bức bàn
  door(){const [c,x]=canvas(128,128);x.fillStyle='#4a2a14';x.fillRect(0,0,128,128);for(let p=0;p<4;p++){const X=p*32;x.fillStyle='#6a3a1c';x.fillRect(X+3,4,26,120);x.strokeStyle='#2a160a';x.lineWidth=2;
    for(let y=10;y<70;y+=8){x.beginPath();x.moveTo(X+5,y);x.lineTo(X+27,y);x.stroke();}for(let xx=X+8;xx<X+27;xx+=6){x.beginPath();x.moveTo(xx,10);x.lineTo(xx,66);x.stroke();}x.fillStyle='#3a2010';x.fillRect(X+5,76,22,44);}return c;},
  // đá tảng
  stone(){const [c,x]=canvas(128,128);const r=rng(19);x.fillStyle='#8a857a';x.fillRect(0,0,128,128);
    for(let row=0;row<4;row++)for(let col=0;col<3;col++){const X=col*44+(row%2)*20-10,Y=row*32;x.fillStyle=shade('#9a948a',.8+r()*.35);x.fillRect(X+2,Y+2,40,28);x.fillStyle='rgba(255,255,255,.12)';x.fillRect(X+2,Y+2,40,3);}
    for(let i=0;i<500;i++){x.fillStyle=`rgba(0,0,0,${r()*.12})`;x.fillRect(r()*128,r()*128,2,2);}return c;},
  // gạch nung
  brick(){const [c,x]=canvas(128,128);const r=rng(23);x.fillStyle='#5a2a1a';x.fillRect(0,0,128,128);
    for(let row=0;row<16;row++)for(let col=0;col<5;col++){const X=col*28+(row%2)*14-14,Y=row*8;x.fillStyle=shade('#9a4a30',.75+r()*.4);x.fillRect(X+1,Y+1,26,6);}return c;},
  // vải đỏ
  cloth(){const [c,x]=canvas(64,64);x.fillStyle='#a8261a';x.fillRect(0,0,64,64);x.fillStyle='#d9a441';x.fillRect(0,0,64,5);x.fillRect(0,59,64,5);for(let i=6;i<64;i+=12){x.fillStyle='rgba(255,200,120,.25)';x.fillRect(i,8,2,48);}return c;},
  // giấy cáo thị
  paper(){const [c,x]=canvas(128,128);const r=rng(29);x.fillStyle='#efe1bc';x.fillRect(0,0,128,128);x.fillStyle='#2a1a10';
    for(let col=0;col<6;col++)for(let row=0;row<8;row++){if(r()<.85)x.fillRect(110-col*18,12+row*14,9,9);}x.fillStyle='#b3261e';x.fillRect(14,96,18,18);return c;},
  // bảng tên cổng: chữ
  plaque(){const [c,x]=canvas(256,64);x.fillStyle='#3a1a0c';x.fillRect(0,0,256,64);x.strokeStyle='#d9a441';x.lineWidth=4;x.strokeRect(4,4,248,56);x.fillStyle='#e8c060';x.font='bold 40px serif';x.textAlign='center';x.textBaseline='middle';x.fillText('金 蓮 村',128,34);return c;},
  bark(){const [c,x]=canvas(64,128);const r=rng(31);x.fillStyle='#5a4030';x.fillRect(0,0,64,128);for(let i=0;i<200;i++){x.strokeStyle=`rgba(${30+r()*40|0},${20+r()*30|0},10,.5)`;x.beginPath();const X=r()*64;x.moveTo(X,r()*128);x.lineTo(X+(r()-.5)*4,r()*128);x.stroke();}return c;},
  bamboo(){const [c,x]=canvas(32,128);const g=x.createLinearGradient(0,0,32,0);g.addColorStop(0,'#4a7a28');g.addColorStop(.5,'#9ac25a');g.addColorStop(1,'#3a6a20');x.fillStyle=g;x.fillRect(0,0,32,128);
    for(let y=0;y<128;y+=32){x.fillStyle='#e0e8a0';x.fillRect(0,y,32,2);x.fillStyle='#355a18';x.fillRect(0,y+2,32,2);}return c;},
  leaf(){const [c,x]=canvas(64,64);const r=rng(37);x.fillStyle='#3f7a2e';x.fillRect(0,0,64,64);for(let i=0;i<220;i++){x.fillStyle=['#2f6624','#4f8f3a','#5fa046','#2a5a20','#6aab4a'][(r()*5)|0];x.beginPath();x.ellipse(r()*64,r()*64,2+r()*4,1+r()*2,r()*3,0,7);x.fill();}return c;},
  water(){const [c,x]=canvas(128,128);const r=rng(41);x.fillStyle='#808080';x.fillRect(0,0,128,128);for(let i=0;i<60;i++){x.strokeStyle=`rgba(255,255,255,${.2+r()*.5})`;x.lineWidth=1+r()*1.5;x.beginPath();const X=r()*128,Y=r()*128;x.moveTo(X,Y);x.quadraticCurveTo(X+8,Y-3,X+16+r()*10,Y);x.stroke();}return c;},
  glow(){const [c,x]=canvas(64,64);const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.3,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return c;},
  ring(){const [c,x]=canvas(128,128);const g=x.createRadialGradient(64,64,40,64,64,62);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.6,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return c;},
  cloud(){const [c,x]=canvas(256,128);const r=rng(43);for(let i=0;i<26;i++){const X=40+r()*176,Y=40+r()*48,R=18+r()*30;const g=x.createRadialGradient(X,Y,0,X,Y,R);g.addColorStop(0,'rgba(255,255,255,.75)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(X-R,Y-R,R*2,R*2);}return c;},
};

// Kết cấu mặt đất cho cả bản đồ (vẽ theo loại ô, làm mềm biên)
const GROUND={grass:['#5d8f3a','#679c40','#567f34'],meadow:['#6c9c44','#78a84c','#628f3c'],flowers:['#62973e','#6fa246','#5a8a36'],dirt:['#9a7a4c','#a8875a','#8c6e44'],sand:['#d8c48e','#e2d09c','#cbb47c'],
  paddy:['#5f8a4a','#6b9654','#557e42'],lotus:['#2e5a4a','#335f50','#2a5244'],water:['#2c4f52','#30565a','#284a4c'],shallow:['#4a7a6a','#52826e','#466e60'],sea:['#1e4a5e','#22526a','#1a4256'],deep:['#163a4e','#18405a','#143446'],
  dike:['#8f8a52','#9a945c','#86804a'],mud:['#6e5a3e','#7a6446','#64503a'],cobble:['#8f8676','#9a9180','#857c6c'],floor:['#a88a62','#b4966c','#9c7e58'],stone:['#8c877c','#979286','#837e74'],
  tilered:['#9a5a3e','#a8644a','#8e5236'],bridge:['#2c4f52','#2c4f52','#2c4f52'],wood:['#2c4f52','#2c4f52','#2c4f52'],earthwall:['#7a6040','#86684a','#705838'],brick:['#7a3a26','#86422c','#6e3420'],walltop:['#7a3a26','#86422c','#6e3420'],karstbase:['#6d7468','#757c70','#656c60']};
export function groundCanvas(m,P){const W=m.w*P,H=m.h*P;const [c,x]=canvas(W,H);const r=rng(77);
  for(let ty=0;ty<m.h;ty++)for(let tx=0;tx<m.w;tx++){const t=m.t[ty*m.w+tx];const cols=GROUND[t]||GROUND.grass;x.fillStyle=cols[((tx*7+ty*13)^(tx*ty))%3];x.fillRect(tx*P,ty*P,P,P);}
  // làm mềm biên
  const [c2,x2]=canvas(W,H);x2.filter=`blur(${Math.max(1,P*0.45)}px)`;x2.drawImage(c,0,0);x2.filter='none';
  // chi tiết sắc nét theo loại ô
  for(let ty=0;ty<m.h;ty++)for(let tx=0;tx<m.w;tx++){const t=m.t[ty*m.w+tx];const X=tx*P,Y=ty*P;
    if(t==='grass'||t==='meadow'||t==='flowers'){for(let k=0;k<3;k++){x2.fillStyle=r()<.5?'rgba(120,170,70,.5)':'rgba(40,80,25,.35)';x2.fillRect(X+r()*P,Y+r()*P,1,2);}
      if(t==='flowers'&&r()<.5){x2.fillStyle=['#f3e6a0','#e8a6c8','#fff','#f2b25a'][(r()*4)|0];x2.fillRect(X+r()*P,Y+r()*P,2,2);}}
    else if(t==='dirt'){if(r()<.5){x2.fillStyle='rgba(60,40,20,.3)';x2.fillRect(X+r()*P,Y+r()*P,2,1);}}
    else if(t==='cobble'||t==='stone'){x2.strokeStyle='rgba(50,45,38,.45)';x2.lineWidth=1;x2.strokeRect(X+.5,Y+.5,P/2,P/2);x2.strokeRect(X+P/2+.5,Y+P/2+.5,P/2-1,P/2-1);}
    else if(t==='floor'||t==='tilered'){x2.strokeStyle='rgba(80,50,30,.4)';x2.strokeRect(X+.5,Y+.5,P-1,P-1);}
    else if(t==='paddy'){x2.fillStyle='rgba(160,200,120,.25)';x2.fillRect(X,Y+P*.3,P,1);}
  }
  return c2;}
export {canvas,toTex};
