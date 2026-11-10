// ===== ĐỒ HỌA PIXEL VẼ BẰNG CODE =====
(function(){
const T = 16;
G.T = T;
function cv(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.imageSmoothingEnabled=false;return [c,x];}
function rng(seed){let s=seed>>>0||1;return ()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296;};}
G.rng = rng;
function shade(hex,f){ // f<1 tối hơn, >1 sáng hơn
  const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;
  if(f<1){r*=f;g*=f;b*=f;}else{r+=(255-r)*(f-1);g+=(255-g)*(f-1);b+=(255-b)*(f-1);}
  return '#'+[r,g,b].map(v=>Math.max(0,Math.min(255,v|0)).toString(16).padStart(2,'0')).join('');
}
G.shade = shade;

// ---------- TILE ----------
const TILES = {};
function speck(x,r,cols,n,w=1,h=1){for(let i=0;i<n;i++){x.fillStyle=cols[(r()*cols.length)|0];x.fillRect((r()*T)|0,(r()*T)|0,w,h);}}
function tile(name,variants,fn){TILES[name]=[];for(let v=0;v<variants;v++){const [c,x]=cv(T,T);fn(x,rng(name.length*977+v*131+7),v);TILES[name].push(c);}}
tile('grass',4,(x,r,v)=>{x.fillStyle='#5e9a3c';x.fillRect(0,0,T,T);speck(x,r,['#6cab46','#548d35','#71b24b'],22);
  for(let i=0;i<4;i++){const gx=(r()*14)|0,gy=(r()*13)|0;x.fillStyle='#7cc052';x.fillRect(gx,gy,1,2);x.fillRect(gx+1,gy-1,1,2);}
  if(v===3){x.fillStyle='#f3e6a0';x.fillRect(5,6,1,1);x.fillRect(11,10,1,1);x.fillStyle='#e8a6c8';x.fillRect(8,3,1,1);}});
tile('dirt',3,(x,r)=>{x.fillStyle='#b48f5a';x.fillRect(0,0,T,T);speck(x,r,['#a5814c','#c29d67','#9c7843'],26);speck(x,r,['#8a6a3c'],3,2,1);});
tile('sand',3,(x,r)=>{x.fillStyle='#e2cd93';x.fillRect(0,0,T,T);speck(x,r,['#d5bd7c','#ecdba6','#cfb26f'],28);});
tile('stone',3,(x,r)=>{x.fillStyle='#a49d90';x.fillRect(0,0,T,T);x.fillStyle='#8c857a';for(let y=0;y<T;y+=8){x.fillRect(0,y,T,1);const o=(y/8)%2?4:0;for(let xx=o;xx<T;xx+=8)x.fillRect(xx,y,1,8);}speck(x,r,['#b2ab9e','#97907f'],10);});
tile('brick',2,(x,r)=>{x.fillStyle='#8f3d2b';x.fillRect(0,0,T,T);x.fillStyle='#6f2c1f';for(let y=0;y<T;y+=4){x.fillRect(0,y,T,1);const o=(y/4)%2?3:0;for(let xx=o;xx<T;xx+=6)x.fillRect(xx,y,1,4);}speck(x,r,['#a24a35','#7d3424'],8);});
tile('walltop',1,(x)=>{x.fillStyle='#8f3d2b';x.fillRect(0,0,T,T);x.fillStyle='#c9a46a';x.fillRect(0,0,T,5);x.fillStyle='#a78450';x.fillRect(0,5,T,1);for(let i=0;i<T;i+=8){x.fillStyle='#c9a46a';x.fillRect(i+2,-0,4,2);}x.fillStyle='#6f2c1f';x.fillRect(0,10,T,1);});
tile('wood',2,(x,r)=>{x.fillStyle='#86592f';x.fillRect(0,0,T,T);x.fillStyle='#6a4423';for(let i=0;i<T;i+=4)x.fillRect(0,i,T,1);speck(x,r,['#9a6a3a'],6,2,1);x.fillStyle='#4d3018';x.fillRect(3,1,1,1);x.fillRect(12,9,1,1);});
tile('floor',1,(x)=>{x.fillStyle='#c79a5b';x.fillRect(0,0,T,T);x.fillStyle='#b4864a';x.fillRect(0,0,T,1);x.fillRect(0,8,T,1);x.fillRect(8,0,1,8);x.fillRect(0,8,1,8);});
tile('tilered',1,(x)=>{x.fillStyle='#b25a3c';x.fillRect(0,0,T,T);x.fillStyle='#9a4a30';x.fillRect(0,0,T,1);x.fillRect(0,0,1,T);x.fillStyle='#c46c4c';x.fillRect(1,1,14,1);});
tile('bridge',1,(x)=>{x.fillStyle='#8d6438';x.fillRect(0,0,T,T);x.fillStyle='#6a4626';for(let i=0;i<T;i+=4)x.fillRect(i,0,1,T);x.fillStyle='#5a3a1e';x.fillRect(0,0,T,2);x.fillRect(0,14,T,2);});
// nước: 3 khung hoạt hình
function waterTile(name,base,deep,hi,extra){
  TILES[name]=[];
  for(let f=0;f<3;f++){const [c,x]=cv(T,T);const r=rng(name.length*91+3);x.fillStyle=base;x.fillRect(0,0,T,T);
    for(let i=0;i<10;i++){x.fillStyle=deep;x.fillRect((r()*T)|0,(r()*T)|0,3,1);}
    for(let i=0;i<3;i++){const yy=((r()*T)|0),xx=((r()*12+f*3)|0)%14;x.fillStyle=hi;x.fillRect(xx,yy,2,1);x.fillRect(xx+2,yy-1,1,1);}
    if(extra)extra(x,r,f);TILES[name].push(c);}
}
waterTile('water','#3d82ab','#336f94','#a7dcef');
waterTile('sea','#20618a','#1a5276','#7fc4e2');
waterTile('deep','#174a6e','#123d5c','#5aa6cc');
waterTile('paddy','#6c9f8d','#5d8b7b','#b9e3d4',(x,r)=>{x.fillStyle='#8ccf55';for(let y=2;y<T;y+=5)for(let xx=1;xx<T;xx+=4){x.fillRect(xx,y,1,3);x.fillStyle='#a6e06a';x.fillRect(xx+1,y,1,2);x.fillStyle='#8ccf55';}});
waterTile('lotus','#3c7f86','#336e74','#a7dcef',(x,r,f)=>{const rr=rng(77);for(let i=0;i<2;i++){const px=(rr()*10|0)+1,py=(rr()*10|0)+2;x.fillStyle='#3f8a3a';x.fillRect(px,py,5,3);x.fillRect(px+1,py-1,3,5);x.fillStyle='#2e6e2b';x.fillRect(px+2,py+1,1,1);}
  if(rr()<.9){x.fillStyle='#f4c64a';x.fillRect(10,4,3,2);x.fillStyle='#ffe58a';x.fillRect(11,3,1,1);x.fillStyle='#e9a8c0';x.fillRect(4,11,2,2);x.fillStyle='#ffd3e2';x.fillRect(4,10,1,1);}});
G.TILES = TILES;
G.tileAnim = {water:1,sea:1,deep:1,paddy:1,lotus:1};

// ---------- VẬT THỂ (cây, nhà...) ----------
const OBJ = {};
function obj(name,w,h,fn){const [c,x]=cv(w,h);fn(x,w,h,rng(name.length*313+5));OBJ[name]=c;}
function blob(x,cx,cy,rx,ry,col){x.fillStyle=col;for(let y=-ry;y<=ry;y++){const ww=Math.round(rx*Math.sqrt(1-(y*y)/(ry*ry)));x.fillRect(cx-ww,cy+y,ww*2,1);}}
// cây đa
obj('banyan',56,60,(x,w,h,r)=>{x.fillStyle='#5b3a22';x.fillRect(24,30,9,28);x.fillStyle='#704a2b';x.fillRect(26,30,3,28);
  for(let i=0;i<6;i++){x.fillStyle='#4b301b';x.fillRect(14+i*5,36+(i%2)*3,1,22);}
  blob(x,28,22,26,18,'#2f6a2a');blob(x,22,18,16,12,'#3b7d31');blob(x,36,16,15,11,'#3f8735');blob(x,28,10,12,8,'#4b9a3d');
  for(let i=0;i<40;i++){x.fillStyle=r()<.5?'#56a845':'#2a5e25';x.fillRect((r()*48+4)|0,(r()*34+4)|0,2,1);}});
// cây cau
obj('areca',20,46,(x)=>{x.fillStyle='#8b8a6a';x.fillRect(9,12,3,34);x.fillStyle='#6f6e52';for(let y=14;y<46;y+=4)x.fillRect(9,y,3,1);
  x.fillStyle='#3d8a35';x.fillRect(2,10,8,2);x.fillRect(11,10,8,2);x.fillRect(4,6,6,2);x.fillRect(11,6,6,2);x.fillRect(9,2,3,9);x.fillRect(0,12,3,2);x.fillRect(18,12,2,2);
  x.fillStyle='#53a646';x.fillRect(5,7,4,1);x.fillRect(12,7,4,1);x.fillStyle='#d9a441';x.fillRect(8,13,2,2);x.fillRect(11,14,2,2);});
// dừa
obj('palm',26,46,(x)=>{x.fillStyle='#8a6a43';for(let y=12;y<46;y++){const o=Math.round(Math.sin(y/9)*2);x.fillRect(11+o,y,4,1);}x.fillStyle='#6d5132';for(let y=14;y<46;y+=3)x.fillRect(11,y,4,1);
  x.fillStyle='#3f8e3a';[[0,10,12,2],[14,10,12,2],[3,6,9,2],[14,6,9,2],[1,13,4,3],[21,13,4,3],[10,3,6,8]].forEach(a=>x.fillRect(...a));x.fillStyle='#5fb04f';x.fillRect(5,7,6,1);x.fillRect(15,7,6,1);x.fillStyle='#6b4a28';x.fillRect(10,11,3,3);x.fillRect(13,12,3,3);});
// bụi tre
obj('bamboo',30,48,(x,w,h,r)=>{for(let i=0;i<6;i++){const bx=3+i*4+(r()*2|0),top=4+(r()*10|0);x.fillStyle=i%2?'#7fae3e':'#6a9a33';x.fillRect(bx,top,3,48-top);x.fillStyle='#4f7a24';for(let y=top+5;y<48;y+=7)x.fillRect(bx,y,3,1);}
  for(let i=0;i<30;i++){x.fillStyle=r()<.5?'#5aa03a':'#8cc455';const lx=(r()*28)|0,ly=(r()*26)|0;x.fillRect(lx,ly,4,1);x.fillRect(lx+1,ly+1,3,1);}});
// chuối
obj('banana',24,30,(x)=>{x.fillStyle='#7a8f3a';x.fillRect(10,12,4,18);x.fillStyle='#5f9c3a';x.fillRect(0,8,11,4);x.fillRect(13,8,11,4);x.fillRect(4,2,7,4);x.fillRect(13,3,8,4);x.fillStyle='#7cbf4c';x.fillRect(1,9,9,1);x.fillRect(14,9,9,1);x.fillStyle='#9d5a6a';x.fillRect(14,13,3,4);});
// nhà tranh
obj('hut',52,44,(x)=>{x.fillStyle='#7a5434';x.fillRect(6,20,40,22);x.fillStyle='#8f6640';for(let i=6;i<46;i+=4)x.fillRect(i,20,1,22);
  x.fillStyle='#3b2615';x.fillRect(22,28,9,14);x.fillStyle='#5d3e22';x.fillRect(10,26,7,6);x.fillRect(35,26,7,6);x.fillStyle='#2a1a0d';x.fillRect(11,27,5,4);x.fillRect(36,27,5,4);
  for(let y=0;y<22;y++){const ww=8+y*2.1|0;x.fillStyle=y%3===0?'#a8823e':'#c8a35a';x.fillRect(26-ww,y+2,ww*2,1);}x.fillStyle='#8a6a2e';x.fillRect(4,22,44,2);x.fillStyle='#e2c27a';x.fillRect(20,3,12,1);
  x.fillStyle='#d8b467';for(let i=0;i<14;i++)x.fillRect(5+i*3,23,1,2);});
// nhà ngói (mái cong)
obj('house',60,50,(x)=>{x.fillStyle='#9a8466';x.fillRect(8,24,44,24);x.fillStyle='#7a2a1e';for(let i=10;i<52;i+=8)x.fillRect(i,24,3,24);
  x.fillStyle='#4a2414';x.fillRect(25,32,10,16);x.fillStyle='#d9a441';x.fillRect(29,38,2,2);
  for(let y=0;y<20;y++){const ww=10+y*1.7|0;x.fillStyle=y%2?'#7e2f22':'#93392a';x.fillRect(30-ww,y+6,ww*2,1);}
  x.fillStyle='#5f2016';x.fillRect(0,25,60,2);x.fillStyle='#93392a';x.fillRect(0,22,4,3);x.fillRect(56,22,4,3);x.fillRect(0,20,2,2);x.fillRect(58,20,2,2);
  x.fillStyle='#c9a46a';x.fillRect(18,5,24,2);x.fillRect(16,3,3,3);x.fillRect(41,3,3,3);x.fillStyle='#e6c88a';x.fillRect(28,2,4,3);});
// Chùa Một Cột
obj('pagoda',44,64,(x)=>{x.fillStyle='#7f7a70';x.fillRect(19,38,6,26);x.fillStyle='#9a958a';x.fillRect(20,38,2,26);
  x.fillStyle='#8a3a24';x.fillRect(10,30,24,10);x.fillStyle='#5b2414';x.fillRect(12,32,20,6);x.fillStyle='#d9a441';x.fillRect(20,33,4,4);
  for(let y=0;y<16;y++){const ww=6+y*1.4|0;x.fillStyle=y%2?'#7e2f22':'#93392a';x.fillRect(22-ww,y+14,ww*2,1);}x.fillStyle='#5f2016';x.fillRect(0,29,44,2);x.fillStyle='#93392a';x.fillRect(0,26,3,3);x.fillRect(41,26,3,3);
  x.fillStyle='#d9a441';x.fillRect(20,8,4,6);x.fillRect(21,4,2,4);x.fillRect(16,13,12,2);});
// Khuê Văn Các (cổng Văn Miếu)
obj('vanmieu',72,64,(x)=>{x.fillStyle='#b9ae98';x.fillRect(6,36,60,28);x.fillStyle='#9e937c';for(let y=40;y<64;y+=6)x.fillRect(6,y,60,1);
  x.fillStyle='#3d2414';x.fillRect(29,44,14,20);x.fillRect(12,48,8,16);x.fillRect(52,48,8,16);
  x.fillStyle='#8a3a24';x.fillRect(14,18,44,18);x.fillStyle='#d9a441';x.fillRect(33,22,6,6);x.fillStyle='#ffe6a0';x.fillRect(35,24,2,2);
  for(let y=0;y<12;y++){const ww=16+y*1.6|0;x.fillStyle=y%2?'#7e2f22':'#93392a';x.fillRect(36-ww,y+6,ww*2,1);}x.fillStyle='#5f2016';x.fillRect(2,17,68,2);x.fillStyle='#93392a';x.fillRect(2,14,4,3);x.fillRect(66,14,4,3);
  for(let y=0;y<8;y++){const ww=10+y*2|0;x.fillStyle=y%2?'#7e2f22':'#93392a';x.fillRect(36-ww,y+34,ww*2,1);}x.fillStyle='#d9a441';x.fillRect(32,2,8,4);});
// giếng, đống rơm, đèn lồng, bếp lửa, đá, thuyền
obj('well',22,20,(x)=>{blob(x,11,12,10,6,'#7f7a70');blob(x,11,11,7,4,'#1f4f6a');x.fillStyle='#5b3a22';x.fillRect(2,0,2,13);x.fillRect(18,0,2,13);x.fillRect(2,0,18,2);});
obj('hay',22,20,(x)=>{blob(x,11,12,10,8,'#d2ad5c');blob(x,11,10,8,7,'#e2c27a');x.fillStyle='#b68f42';for(let i=0;i<8;i++)x.fillRect(3+i*2,8+(i%3),1,6);x.fillStyle='#8a6a2e';x.fillRect(10,0,2,6);});
obj('lantern',10,26,(x)=>{x.fillStyle='#5b3a22';x.fillRect(4,8,2,18);x.fillStyle='#c0392b';x.fillRect(1,1,8,8);x.fillStyle='#e74c3c';x.fillRect(2,2,6,6);x.fillStyle='#ffd27a';x.fillRect(4,3,2,4);x.fillStyle='#d9a441';x.fillRect(1,0,8,1);x.fillRect(1,9,8,1);});
obj('stove',24,22,(x)=>{x.fillStyle='#6f6a62';x.fillRect(2,12,20,10);x.fillStyle='#55504a';x.fillRect(2,12,20,2);x.fillStyle='#2b2b2b';blob(x,12,9,9,4,'#2b2b2b');x.fillStyle='#3a3a3a';x.fillRect(4,6,16,2);x.fillStyle='#ff9a3c';x.fillRect(8,17,8,4);x.fillStyle='#ffd27a';x.fillRect(10,18,4,2);});
obj('rock',20,14,(x)=>{blob(x,10,8,9,6,'#7d7769');blob(x,8,6,6,4,'#948d7d');x.fillStyle='#a8a191';x.fillRect(6,4,3,1);});
obj('boatsmall',36,18,(x)=>{x.fillStyle='#6b4423';x.fillRect(2,8,32,6);x.fillRect(0,6,4,4);x.fillRect(32,6,4,4);x.fillStyle='#8a5a30';x.fillRect(4,8,28,2);x.fillStyle='#3d2614';x.fillRect(4,14,28,2);x.fillStyle='#c8a35a';x.fillRect(12,2,12,6);x.fillStyle='#a8823e';x.fillRect(12,6,12,2);});
obj('junk',64,64,(x)=>{x.fillStyle='#5a3a1e';x.fillRect(4,46,56,12);x.fillRect(0,42,8,8);x.fillRect(56,40,8,10);x.fillStyle='#7a4f2c';x.fillRect(6,46,52,3);x.fillStyle='#3b2615';x.fillRect(6,56,52,3);
  x.fillStyle='#5b3a22';x.fillRect(30,6,3,40);x.fillRect(46,16,2,30);x.fillStyle='#b5523a';x.fillRect(16,8,18,34);x.fillStyle='#93392a';for(let y=12;y<42;y+=6)x.fillRect(16,y,18,1);x.fillStyle='#c8a35a';x.fillRect(40,18,14,24);x.fillStyle='#a8823e';for(let y=22;y<42;y+=5)x.fillRect(40,y,14,1);x.fillStyle='#d9a441';x.fillRect(50,49,3,3);});
obj('gate',48,48,(x)=>{x.fillStyle='#8a3a24';x.fillRect(4,14,6,34);x.fillRect(38,14,6,34);x.fillStyle='#7e2f22';x.fillRect(0,8,48,6);x.fillRect(4,4,40,4);x.fillStyle='#d9a441';x.fillRect(16,9,16,4);x.fillStyle='#5f2016';x.fillRect(0,13,48,1);x.fillStyle='#93392a';x.fillRect(0,5,3,3);x.fillRect(45,5,3,3);});
obj('portal',40,44,(x)=>{x.fillStyle='#4a4038';x.fillRect(2,10,6,34);x.fillRect(32,10,6,34);x.fillStyle='#c9a46a';x.fillRect(0,4,40,6);x.fillStyle='#8a3a24';x.fillRect(2,0,36,4);x.fillStyle='#d9a441';x.fillRect(14,5,12,4);});
obj('chest',16,14,(x)=>{x.fillStyle='#7a4f2c';x.fillRect(1,4,14,10);x.fillStyle='#5a3a1e';x.fillRect(1,2,14,4);x.fillStyle='#d9a441';x.fillRect(1,6,14,1);x.fillRect(7,5,2,4);x.fillRect(1,2,1,12);x.fillRect(14,2,1,12);});
obj('stall',40,36,(x)=>{x.fillStyle='#6b4423';x.fillRect(4,14,2,22);x.fillRect(34,14,2,22);x.fillStyle='#c0392b';x.fillRect(0,6,40,9);x.fillStyle='#e8dcc0';for(let i=0;i<40;i+=8)x.fillRect(i,6,4,9);x.fillStyle='#86592f';x.fillRect(2,24,36,4);x.fillStyle='#f4c64a';x.fillRect(6,21,4,3);x.fillStyle='#7ed37a';x.fillRect(14,21,5,3);x.fillStyle='#ff9a3c';x.fillRect(24,21,4,3);});
obj('statue',20,30,(x)=>{x.fillStyle='#8c857a';x.fillRect(4,22,12,8);blob(x,10,14,5,8,'#9a948a');blob(x,10,5,4,4,'#a8a191');x.fillStyle='#6d675d';x.fillRect(7,16,6,1);});
G.OBJ = OBJ;

// ---------- NHÂN VẬT ----------
const CACHE = {};
function getSprite(key,w,h,draw){if(CACHE[key])return CACHE[key];const [c,x]=cv(w,h);draw(x);CACHE[key]=c;return c;}
G.getSprite = getSprite;
function px(x,c,a,b,w=1,h=1){x.fillStyle=c;x.fillRect(a,b,w,h);}

// Ngựa + Kị sỹ Takd (32x32). f: khung chân 0..3, atk: đang đánh
G.drawTakd = function(f,atk,mounted,armorCol,glow){
  return getSprite(`takd${f}${atk}${mounted}${armorCol}${glow}`,36,40,(x)=>{
    const ac=armorCol||'#b3261e', gold='#d9a441';
    if(mounted){
      const legs=[[0,0,0,0],[2,-1,-2,1],[0,0,0,0],[-2,1,2,-1]][f%4];
      // ngựa
      px(x,'#3a2414',6+legs[0],28,3,10);px(x,'#3a2414',11+legs[1],28,3,10);px(x,'#4a2e18',21+legs[2],28,3,10);px(x,'#4a2e18',26+legs[3],28,3,10);
      px(x,'#1a1008',6+legs[0],37,3,2);px(x,'#1a1008',11+legs[1],37,3,2);px(x,'#1a1008',21+legs[2],37,3,2);px(x,'#1a1008',26+legs[3],37,3,2);
      px(x,'#7a4a26',4,20,26,10);px(x,'#8f5a30',5,20,24,3);px(x,'#5e3a1d',4,28,26,2);
      px(x,'#7a4a26',27,12,6,12);px(x,'#7a4a26',29,8,7,6);px(x,'#8f5a30',30,9,5,2);px(x,'#1a1008',33,10,1,1);px(x,'#2b1a0c',35,12,1,2);
      px(x,'#2b1a0c',26,9,3,12);px(x,'#2b1a0c',1,20,4,2);px(x,'#2b1a0c',0,22,3,8);
      // yên & chăn yên đỏ
      px(x,ac,10,18,14,6);px(x,gold,10,23,14,1);px(x,gold,10,18,14,1);
    }
    const oy = mounted?0:14;
    // người
    px(x,'#2b2b33',14,16+oy,3,mounted?6:8);px(x,'#2b2b33',19,16+oy,3,mounted?6:8);
    px(x,ac,12,7+oy,12,10);px(x,shade(ac,.75),12,14+oy,12,3);px(x,gold,12,12+oy,12,1);px(x,gold,17,7+oy,2,10);
    px(x,'#c9b48a',12,7+oy,3,3);px(x,'#c9b48a',21,7+oy,3,3);
    px(x,'#e8b98a',15,1+oy,6,6);px(x,'#1a1008',17,3+oy,1,1);px(x,'#1a1008',19,3+oy,1,1);
    px(x,'#3a3a44',14,0+oy,8,2);px(x,gold,14,-0+oy,8,1);px(x,'#d14b3c',17,-1+oy,2,2);
    // chùy
    const ax = atk?26:24, ay = atk?2+oy:6+oy;
    px(x,'#5a3a1e',atk?20:22,atk?6+oy:8+oy,atk?8:2,atk?2:10);
    px(x,'#8a8f98',ax,ay,6,6);px(x,'#c3c8d0',ax+1,ay+1,2,2);px(x,'#5d626a',ax,ay+5,6,1);
    px(x,'#8a8f98',ax+2,ay-2,2,2);px(x,'#8a8f98',ax+6,ay+2,2,2);px(x,'#8a8f98',ax-2,ay+2,2,2);
    if(glow){x.globalAlpha=.35;px(x,glow,ax-2,ay-2,10,10);x.globalAlpha=1;}
  });
};
// Thuyền của người chơi
G.drawPlayerBoat = function(f){return getSprite('pboat'+f,44,30,(x)=>{const b=f%2;
  px(x,'#5a3a1e',4,18+b,36,8);px(x,'#7a4f2c',2,16+b,6,4);px(x,'#7a4f2c',36,14+b,6,6);px(x,'#8a5a30',6,18+b,32,2);
  px(x,'#5b3a22',21,0+b,2,18);px(x,'#c8a35a',10,2+b,11,14);px(x,'#a8823e',10,6+b,11,1);px(x,'#a8823e',10,10+b,11,1);
  px(x,'#b3261e',24,12+b,6,6);px(x,'#e8b98a',25,8+b,4,4);px(x,'#d14b3c',26,7+b,2,1);
  px(x,'#e0a246',31,14+b,4,3);px(x,'#fff',31,16+b,2,1);
});};
// Shiba
G.drawShiba = function(f,sit){return getSprite('shiba'+f+sit,18,14,(x)=>{
  const l=f%2;const o='#e0953d',w='#fbeedd',d='#b06a22';
  if(!sit){px(x,d,3,10+l,2,3);px(x,d,6,10-l,2,3);px(x,d,10,10+l,2,3);px(x,d,13,10-l,2,3);}
  else{px(x,d,4,11,3,2);px(x,d,11,11,3,2);}
  px(x,o,2,5,13,6);px(x,w,4,8,9,3);px(x,o,1,2,4,4);px(x,o,0,0,2,2);px(x,o,0,1,1,3);
  px(x,o,12,1,6,6);px(x,w,13,4,5,3);px(x,o,12,0,2,2);px(x,o,16,0,2,2);px(x,'#1a1008',15,3,1,1);px(x,'#1a1008',17,5,1,1);px(x,'#f08a9a',16,6,1,1);
});};
// NPC & người
const NPC_STYLE = {
  elder:{body:'#5b4a8a',hat:'#2b2b33',beard:1}, woman:{body:'#8a5a2c',hat:'#d8b467',skirt:'#2b2b33',quai:1},
  smith:{body:'#6f5a48',hat:null,apron:'#3d2a1a'}, fisher:{body:'#5d6f7a',hat:'#d8c48a',non:1},
  scholar:{body:'#2b3a5a',hat:'#1a1a22',beard:1}, officer:{body:'#8a2a1e',hat:'#1a1a22',gold:1},
  merchant:{body:'#2f6f62',hat:'#3a2a1a'}, monk:{body:'#c98a2c',hat:null,bald:1}
};
G.drawPerson = function(style,f,col,weapon){const s=NPC_STYLE[style]||{body:col||'#555',hat:'#222'};const key=`p${style}${f}${col}${weapon}`;
  return getSprite(key,16,26,(x)=>{const l=f%2;const body=col||s.body;
    px(x,'#2b2b33',5,19,2,6-l);px(x,'#2b2b33',9,19,2,5+l);
    px(x,body,3,9,10,11);px(x,shade(body,.7),3,17,10,3);if(s.skirt)px(x,s.skirt,3,16,10,5);
    if(s.apron)px(x,s.apron,5,12,6,8);if(s.gold){px(x,'#d9a441',3,13,10,1);px(x,'#d9a441',7,9,2,11);}
    px(x,'#e8b98a',5,2,6,7);px(x,'#1a1008',6,5,1,1);px(x,'#1a1008',9,5,1,1);
    if(s.beard){px(x,'#e8e8e8',6,8,4,3);}
    if(s.bald){px(x,'#e8b98a',5,1,6,2);}else if(s.non){px(x,s.hat,1,2,14,2);px(x,s.hat,4,0,8,2);px(x,shade(s.hat,.8),6,-0,4,1);}
    else if(s.quai){px(x,s.hat,0,2,16,2);px(x,s.hat,3,0,10,2);px(x,'#2b2b33',5,1,6,1);}
    else if(s.hat){px(x,s.hat,4,0,8,3);} else {px(x,'#2b2b33',5,1,6,2);}
    px(x,'#e8b98a',2,12,2,4);px(x,'#e8b98a',12,12,2,4);
    if(weapon){px(x,weapon,13,3,1,13);px(x,'#ffffff',13,2,1,2);}
  });
};

// Quái vật: art type, frame, tint
G.drawMob = function(art,f,tint,size){
  const key=`m${art}${f}${tint}`;
  const defs = {
    rat:[16,12,(x)=>{const c=tint||'#7d6a58';px(x,c,3,5,9,5);px(x,c,10,3,5,5);px(x,shade(c,1.3),11,2,2,2);px(x,'#1a1008',13,4,1,1);px(x,'#f08a9a',15,6,1,1);px(x,'#d8a0a0',0,7,4,1);px(x,shade(c,.7),4,10-(f%2),2,2);px(x,shade(c,.7),9,10-((f+1)%2),2,2);}],
    snake:[20,12,(x)=>{const c=tint||'#4a7d3a';for(let i=0;i<5;i++)px(x,c,1+i*3,6+Math.round(Math.sin(i+f*1.6)*2),4,3);px(x,shade(c,1.25),15,3,5,4);px(x,'#ffd84a',17,4,1,1);px(x,'#d14b3c',20-1,6,2,1);px(x,shade(c,.7),2,9,12,1);}],
    dog:[22,16,(x)=>{const c=tint||'#8a6a48';const l=f%2;px(x,shade(c,.7),4,11+l,2,5-l);px(x,shade(c,.7),8,11-l+1,2,4);px(x,shade(c,.7),14,11+l,2,5-l);px(x,shade(c,.7),17,11-l+1,2,4);
      px(x,c,3,6,16,6);px(x,c,16,2,6,6);px(x,shade(c,.75),16,0,2,3);px(x,shade(c,.75),20,0,2,3);px(x,'#ff3b30',19,4,1,1);px(x,'#fff',21,7,1,1);px(x,c,0,4,4,2);}],
    tiger:[28,18,(x)=>{const c=tint||'#e08a2a';const l=f%2;[[5,12],[10,12],[18,12],[22,12]].forEach((p,i)=>px(x,'#3a2414',p[0],p[1]+((i+l)%2),3,6));
      px(x,c,3,6,22,8);px(x,c,21,2,7,8);px(x,'#fbeedd',22,7,5,3);for(let i=5;i<24;i+=4)px(x,'#2b1a0c',i,6,2,6);px(x,'#2b1a0c',22,3,1,3);px(x,'#2b1a0c',25,3,1,3);px(x,'#7fd34a',23,4,1,1);px(x,'#7fd34a',26,4,1,1);px(x,c,0,5,4,2);px(x,'#2b1a0c',0,5,1,2);}],
    bandit:[16,26,(x)=>{const c=tint||'#4a4038';const l=f%2;px(x,'#2b2b33',5,19,2,6-l);px(x,'#2b2b33',9,19,2,5+l);px(x,c,3,9,10,11);px(x,'#7a2a1e',3,14,10,2);px(x,'#e8b98a',5,2,6,7);px(x,'#1a1a22',5,4,6,2);px(x,'#ff3b30',6,5,1,1);px(x,'#ff3b30',9,5,1,1);px(x,'#1a1a22',4,0,8,3);px(x,'#c3c8d0',13,4,2,12);px(x,'#8a8f98',13,14,2,2);}],
    golem:[24,28,(x)=>{const c=tint||'#8c857a';px(x,c,4,8,16,14);px(x,shade(c,1.2),6,2,12,8);px(x,c,0,10,5,10);px(x,c,19,10,5,10);px(x,shade(c,.7),6,22,5,6-(f%2));px(x,shade(c,.7),13,22,5,5+(f%2));px(x,'#7fe0ff',8,5,2,2);px(x,'#7fe0ff',14,5,2,2);px(x,shade(c,.75),8,14,8,1);}],
    crab:[26,16,(x)=>{const c=tint||'#d0503a';const l=f%2;for(let i=0;i<3;i++){px(x,shade(c,.7),3+i*2,10+l,1,5);px(x,shade(c,.7),21-i*2,10+((l+1)%2),1,5);}blob(x,13,9,9,5,c);px(x,shade(c,1.3),8,6,10,2);px(x,c,0,2+l,6,5);px(x,c,20,2+((l+1)%2),6,5);px(x,'#1a1008',10,4,1,2);px(x,'#1a1008',15,4,1,2);}],
    ghost:[18,24,(x)=>{const c=tint||'#7fb8c8';x.globalAlpha=.85;blob(x,9,9,8,8,c);px(x,c,1,9,16,10);for(let i=0;i<4;i++)px(x,c,1+i*4,19,3,3+((i+f)%2)*2);x.globalAlpha=1;px(x,'#0c2a33',5,7,2,3);px(x,'#0c2a33',11,7,2,3);px(x,'#0c2a33',7,13,4,2);px(x,'#3d7a3a',2,2,4,2);}],
    shark:[34,16,(x)=>{const c=tint||'#5d7a8a';px(x,c,4,6,24,7);px(x,c,26,4,8,7);px(x,'#e8eef0',8,10,20,3);px(x,c,14,0,5,6);px(x,c,0,3+(f%2),5,4);px(x,c,0,9-(f%2),5,4);px(x,'#1a1008',29,6,1,1);px(x,'#fff',31,10,2,1);}],
    lotusdemon:[44,44,(x)=>{px(x,'#2e6e2b',4,30,36,10);px(x,'#3f8a3a',6,28,32,6);px(x,'#e9a8c0',12,10,20,22);px(x,'#ffd3e2',16,12,12,8);px(x,'#e9a8c0',4,18,10,12);px(x,'#e9a8c0',30,18,10,12);px(x,'#c46a8c',8,20,4,8);px(x,'#c46a8c',32,20,4,8);
      px(x,'#f4c64a',18,4+(f%2),8,8);px(x,'#ffe58a',20,5+(f%2),4,3);px(x,'#7a0e2a',17,18,3,3);px(x,'#7a0e2a',24,18,3,3);px(x,'#7a0e2a',19,25,6,2);}],
    warlord:[24,32,(x)=>{const c=tint||'#2b2b33';const l=f%2;px(x,'#1a1a22',7,24,4,8-l);px(x,'#1a1a22',13,24,4,7+l);px(x,c,4,11,16,14);px(x,'#d9a441',4,17,16,2);px(x,'#7a7f88',2,10,6,5);px(x,'#7a7f88',16,10,6,5);
      px(x,'#e8b98a',8,3,8,8);px(x,'#7a1a1a',8,8,8,5);px(x,'#1a1008',9,5,2,1);px(x,'#1a1008',13,5,2,1);px(x,'#3a3a44',7,0,10,4);px(x,'#d14b3c',11,-0,2,2);px(x,'#c3c8d0',20,0,3,24);px(x,'#e8eef0',19,0,5,6);}],
    serpent:[60,36,(x)=>{const c=tint||'#2f6f62';for(let i=0;i<9;i++){const yy=16+Math.round(Math.sin(i*.8+f*1.3)*6);px(x,c,i*5,yy,8,10);px(x,'#d9a441',i*5+1,yy+7,6,2);px(x,shade(c,1.3),i*5+2,yy,3,2);}
      px(x,c,44,6,16,14);px(x,shade(c,1.25),46,6,12,4);px(x,'#ffd84a',52,10,3,2);px(x,'#fff',56,17,4,2);px(x,'#d9a441',46,0,2,7);px(x,'#d9a441',52,0,2,7);px(x,'#7fd3c3',40,8,4,2);}]
  };
  const d=defs[art]||defs.rat;
  return getSprite(key,d[0],d[1],d[2]);
};

// Icon vật phẩm theo slot (14x14)
G.drawItemIcon = function(slot,col){return getSprite('ic'+slot+col,14,14,(x)=>{const c=col==='rainbow'?'#ffd84a':col;
  const m={weapon:()=>{px(x,'#7a4f2c',6,6,2,8);px(x,c,3,1,8,6);px(x,'#fff',4,2,2,2);px(x,c,6,0,2,1);},
    helm:()=>{px(x,c,2,4,10,7);px(x,shade(c,.7),2,9,10,2);px(x,'#d14b3c',6,1,2,3);px(x,'#1a1a22',4,7,6,2);},
    armor:()=>{px(x,c,2,2,10,11);px(x,shade(c,.7),2,8,10,1);px(x,'#d9a441',6,2,2,11);px(x,c,0,2,2,4);px(x,c,12,2,2,4);},
    belt:()=>{px(x,c,0,5,14,4);px(x,'#d9a441',5,4,4,6);px(x,'#7a4f2c',6,5,2,4);},
    boots:()=>{px(x,c,2,2,4,9);px(x,c,2,9,7,3);px(x,c,8,3,4,8);px(x,shade(c,.7),8,10,6,3);},
    ring:()=>{blob(x,7,8,5,5,c);blob(x,7,8,3,3,'#1a1210');px(x,'#7fe0ff',6,1,3,3);},
    amulet:()=>{px(x,'#c9a46a',3,0,1,6);px(x,'#c9a46a',10,0,1,6);px(x,'#c9a46a',3,0,8,1);blob(x,7,9,4,4,c);px(x,'#fff',6,7,2,2);},
    fish:()=>{blob(x,6,7,5,3,c);px(x,c,10,4,3,6);px(x,'#1a1008',3,6,1,1);},
    food:()=>{blob(x,7,9,6,4,'#e8dcc0');blob(x,7,7,4,3,c);},
    stone:()=>{px(x,c,4,2,6,10);px(x,c,2,5,10,4);px(x,'#fff',5,3,2,2);},
    ingr:()=>{blob(x,7,8,5,5,c);px(x,'#fff',5,6,2,1);}};
  (m[slot]||m.stone)();});};
})();
