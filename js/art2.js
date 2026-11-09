// ===== ĐỒ HỌA BỔ SUNG: cảnh Đại Việt thời Lý, sinh vật =====
(function(){
const T=G.T, TILES=G.TILES, OBJ=G.OBJ;
function cv(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.imageSmoothingEnabled=false;return [c,x];}
function px(x,c,a,b,w=1,h=1){x.fillStyle=c;x.fillRect(a,b,w,h);}
function blob(x,cx,cy,rx,ry,col){x.fillStyle=col;for(let y=-ry;y<=ry;y++){const ww=Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/(ry*ry))));x.fillRect(cx-ww,cy+y,ww*2,1);}}
function speck(x,r,cols,n,w=1,h=1){for(let i=0;i<n;i++){x.fillStyle=cols[(r()*cols.length)|0];x.fillRect((r()*T)|0,(r()*T)|0,w,h);}}
function tile(name,variants,fn){TILES[name]=[];for(let v=0;v<variants;v++){const [c,x]=cv(T,T);fn(x,G.rng(name.length*1777+v*97+3),v);TILES[name].push(c);}}
// mái cong kiểu Lý: lớp ngói + đầu đao
function roof(x,cx,top,halfTop,halfBot,h,c1,c2,eave){for(let y=0;y<h;y++){const ww=Math.round(halfTop+(halfBot-halfTop)*y/h);x.fillStyle=y%2?c1:c2;x.fillRect(cx-ww,top+y,ww*2,1);}
  const b=top+h;x.fillStyle=eave||'#5f2016';x.fillRect(cx-halfBot-2,b,halfBot*2+4,2);x.fillStyle=c2;x.fillRect(cx-halfBot-4,b-3,3,3);x.fillRect(cx+halfBot+1,b-3,3,3);x.fillRect(cx-halfBot-5,b-5,2,2);x.fillRect(cx+halfBot+3,b-5,2,2);}

// ---------- TILE MỚI ----------
tile('meadow',3,(x,r)=>{x.fillStyle='#548f37';x.fillRect(0,0,T,T);speck(x,r,['#4a8030','#5f9d3f','#679f45'],26);for(let i=0;i<5;i++){const gx=(r()*14)|0,gy=(r()*12)|0;x.fillStyle='#6fae4a';x.fillRect(gx,gy,1,3);}});
tile('flowers',3,(x,r)=>{x.fillStyle='#5e9a3c';x.fillRect(0,0,T,T);speck(x,r,['#6cab46','#548d35'],18);const cols=['#f3e6a0','#e8a6c8','#ffffff','#f2b25a'];for(let i=0;i<5;i++){x.fillStyle=cols[(r()*4)|0];const a=(r()*14)|0,b=(r()*14)|0;x.fillRect(a,b,2,2);x.fillStyle='#3f7a2a';x.fillRect(a,b+2,1,1);}});
tile('dike',2,(x,r)=>{x.fillStyle='#c4a46c';x.fillRect(0,0,T,T);speck(x,r,['#b5955e','#d2b47c','#a98a55'],22);x.fillStyle='#7aa34a';x.fillRect(0,0,T,2);x.fillRect(0,14,T,2);speck(x,r,['#8ab85a'],4);});
tile('mud',2,(x,r)=>{x.fillStyle='#7d6648';x.fillRect(0,0,T,T);speck(x,r,['#6e583c','#8c7452','#5e4a32'],24);x.fillStyle='#8aa0a8';x.fillRect(3,9,4,1);x.fillRect(10,4,3,1);});
tile('cobble',3,(x,r)=>{x.fillStyle='#9b8f7c';x.fillRect(0,0,T,T);for(let y=0;y<T;y+=4)for(let xx=(y/4%2)*2;xx<T;xx+=5){x.fillStyle=['#a89c88','#8f8472','#b2a690'][(r()*3)|0];x.fillRect(xx,y,4,3);}x.fillStyle='#7d725f';x.fillRect(0,15,T,1);});
tile('earthwall',2,(x,r)=>{x.fillStyle='#8a6a42';x.fillRect(0,0,T,T);for(let y=0;y<T;y+=3){x.fillStyle=y%6?'#7a5c36':'#96764c';x.fillRect(0,y,T,1);}speck(x,r,['#6e522e','#a2825a'],10);x.fillStyle='#6a8a3a';x.fillRect(0,0,T,2);});
tile('karstbase',1,(x,r)=>{x.fillStyle='#6d7468';x.fillRect(0,0,T,T);speck(x,r,['#5c6358','#7f8678','#4f564b'],30);});
tile('shallow',3,(x,r,v)=>{x.fillStyle='#4e93a6';x.fillRect(0,0,T,T);speck(x,r,['#5aa2b2','#4486a0'],16,3,1);x.fillStyle='#a9dbe2';x.fillRect((v*5)%14,(v*7+3)%14,2,1);});
G.tileAnim.shallow=1;G.WATER_EXTRA={shallow:1};

// ---------- VẬT THỂ MỚI ----------
function obj(name,w,h,fn){const [c,x]=cv(w,h);fn(x,w,h,G.rng(name.length*911+w*7+h));OBJ[name]=c;}
// Đình làng
obj('dinh',84,64,(x)=>{px(x,'#7f7a70',4,52,76,12);px(x,'#9a958a',4,52,76,2);for(let i=8;i<78;i+=10){px(x,'#5b2414',i,34,4,18);}px(x,'#3d2414',14,40,56,12);px(x,'#7a2a1e',14,40,56,2);
  for(let i=18;i<68;i+=10){px(x,'#c9a46a',i,42,6,8);px(x,'#8a6a3a',i+2,42,2,8);}
  roof(x,42,6,20,40,26,'#7e2f22','#93392a');px(x,'#d9a441',30,6,24,3);px(x,'#d9a441',22,3,4,4);px(x,'#d9a441',58,3,4,4);px(x,'#e6c88a',39,0,6,6);px(x,'#8a3a24',40,22,4,8);px(x,'#d9a441',41,23,2,2);});
// Chùa làng
obj('chua',70,58,(x)=>{px(x,'#8c857a',6,48,58,10);px(x,'#c9b48a',10,30,50,18);for(let i=12;i<58;i+=9)px(x,'#8a3a24',i,30,3,18);px(x,'#4a2414',30,36,10,12);px(x,'#d9a441',33,40,4,4);
  roof(x,35,8,14,32,22,'#6e5a3a','#86704a','#4f3f28');px(x,'#d9a441',31,2,8,6);px(x,'#ffd27a',34,4,2,2);x.fillStyle='rgba(255,210,122,.25)';x.fillRect(30,36,10,12);});
// Tháp chuông
obj('thapchuong',32,52,(x)=>{px(x,'#8c857a',4,44,24,8);px(x,'#5b2414',7,22,3,22);px(x,'#5b2414',22,22,3,22);px(x,'#4a3a2a',10,26,12,1);px(x,'#7a5a2a',12,28,8,10);px(x,'#9a7a3a',13,29,3,8);px(x,'#5a4020',11,37,10,2);roof(x,16,6,4,14,14,'#7e2f22','#93392a');px(x,'#d9a441',15,2,2,5);});
// Cổng làng
obj('conglang',56,52,(x)=>{px(x,'#9a958a',2,16,12,36);px(x,'#9a958a',42,16,12,36);px(x,'#7f7a70',2,16,12,2);px(x,'#7f7a70',42,16,12,2);px(x,'#b9ae98',4,22,8,26);px(x,'#b9ae98',44,22,8,26);
  roof(x,28,2,10,26,10,'#7e2f22','#93392a');px(x,'#3d2414',18,12,20,8);px(x,'#d9a441',19,13,18,6);px(x,'#5a1a0c',22,15,3,2);px(x,'#5a1a0c',27,15,3,2);px(x,'#5a1a0c',32,15,3,2);
  roof(x,8,10,2,7,5,'#7e2f22','#93392a');roof(x,48,10,2,7,5,'#7e2f22','#93392a');});
// Cây gạo hoa đỏ
obj('caygao',50,70,(x,w,h,r)=>{px(x,'#6b5038',22,28,7,42);px(x,'#7d6044',23,28,2,42);px(x,'#6b5038',12,30,12,3);px(x,'#6b5038',28,24,14,3);px(x,'#6b5038',16,18,3,12);px(x,'#6b5038',34,14,3,12);
  for(let i=0;i<70;i++){const a=r()*6.28,d=r()*20;const xx=25+Math.cos(a)*d*1.2,yy=20+Math.sin(a)*d*.75;x.fillStyle=r()<.7?'#d8352b':(r()<.5?'#f05a3a':'#7aa34a');x.fillRect(xx|0,yy|0,3,2);}
  for(let i=0;i<12;i++){x.fillStyle='#d8352b';x.fillRect((r()*44)|0,58+(r()*10|0),2,1);}});
// Cây xoan / cây bàng
obj('xoan',36,46,(x,w,h,r)=>{px(x,'#5b3a22',16,26,5,20);blob(x,18,18,16,13,'#3f7f34');blob(x,13,15,9,8,'#4a9040');blob(x,24,13,9,8,'#55a046');for(let i=0;i<30;i++){x.fillStyle=r()<.5?'#68b452':'#2f6a28';x.fillRect((r()*30+3)|0,(r()*24+4)|0,2,1);}for(let i=0;i<6;i++){x.fillStyle='#c9b6e8';x.fillRect((r()*28+4)|0,(r()*20+5)|0,1,1);}});
// Bù nhìn
obj('bunhin',18,28,(x)=>{px(x,'#6b4a2a',8,8,2,20);px(x,'#6b4a2a',1,12,16,2);px(x,'#8a5a2c',5,12,8,9);px(x,'#d8b467',2,4,14,3);px(x,'#c8a35a',5,1,8,4);px(x,'#e8d6a0',6,6,6,5);px(x,'#1a1008',7,8,1,1);px(x,'#1a1008',10,8,1,1);px(x,'#c8a35a',0,13,2,4);px(x,'#c8a35a',16,13,2,4);});
// Lều canh ruộng
obj('leu',34,36,(x)=>{px(x,'#5b3a22',4,16,3,20);px(x,'#5b3a22',27,16,3,20);px(x,'#7a5434',4,22,26,3);for(let y=0;y<16;y++){const ww=4+y;x.fillStyle=y%3?'#c8a35a':'#a8823e';x.fillRect(17-ww,y+2,ww*2,1);}px(x,'#e2c27a',14,2,6,1);});
// Hàng rào tre
obj('fence',16,14,(x)=>{for(let i=1;i<16;i+=3){px(x,'#a88a4a',i,2,2,12);px(x,'#c8a96a',i,2,1,12);}px(x,'#7a5f2c',0,5,16,1);px(x,'#7a5f2c',0,10,16,1);});
// Tháp Báo Thiên (12 tầng thời Lý)
obj('thapbaothien',46,120,(x)=>{px(x,'#8c857a',2,108,42,12);px(x,'#a49d90',2,108,42,2);let y=104;for(let i=0;i<12;i++){const w=17-i*1.0,h=8;px(x,'#c9b48a',23-w,y-h+2,w*2,h-2);px(x,'#8a3a24',23-2,y-h+3,4,h-4);px(x,'#7e2f22',23-w-3,y-h,w*2+6,2);px(x,'#93392a',23-w-4,y-h-1,2,2);px(x,'#93392a',23+w+2,y-h-1,2,2);y-=h;}
  px(x,'#d9a441',21,y-12,4,12);px(x,'#ffd84a',22,y-15,2,3);});
// Điện (cung điện)
obj('dien',130,80,(x)=>{px(x,'#a49d90',0,64,130,16);px(x,'#8c857a',0,64,130,2);for(let i=0;i<5;i++)px(x,'#b9ae98',50+i*0,66+i*3,30,3);
  px(x,'#8a3a24',10,40,110,24);for(let i=14;i<118;i+=12){px(x,'#5b2414',i,40,4,24);}for(let i=20;i<112;i+=12){px(x,'#d9a441',i,46,4,12);px(x,'#ffd27a',i+1,48,2,8);}
  roof(x,65,18,34,62,22,'#a8742a','#c08a3a','#6f4a1a');roof(x,65,2,18,36,14,'#a8742a','#c08a3a','#6f4a1a');px(x,'#d9a441',50,0,30,3);px(x,'#2f6f62',44,0,4,5);px(x,'#2f6f62',82,0,4,5);px(x,'#2a1810',56,30,18,8);px(x,'#ffd84a',58,31,14,6);px(x,'#7a1a0c',61,33,8,2);});
// Cổng thành
obj('congthanh',72,64,(x)=>{px(x,'#8f3d2b',0,24,72,40);for(let y=24;y<64;y+=4){px(x,'#6f2c1f',0,y,72,1);}px(x,'#2a1a10',24,36,24,28);blob(x,36,36,12,6,'#2a1a10');px(x,'#c9a46a',0,22,72,3);roof(x,36,4,16,30,16,'#7e2f22','#93392a');px(x,'#8a3a24',14,12,44,8);px(x,'#d9a441',28,13,16,5);});
// Cột cờ
obj('cotco',20,70,(x)=>{px(x,'#8c857a',2,60,16,10);px(x,'#5b3a22',9,4,2,56);px(x,'#d8352b',11,4,8,10);px(x,'#ffd84a',13,7,3,3);});
// Bia đá
obj('bia',14,20,(x)=>{px(x,'#7f7a70',1,16,12,4);px(x,'#9a958a',3,2,8,15);px(x,'#b2ab9e',4,3,6,1);px(x,'#7f7a70',5,6,4,1);px(x,'#7f7a70',5,9,4,1);px(x,'#7f7a70',5,12,4,1);});
// Núi đá vôi (vịnh)
obj('karst',60,86,(x,w,h,r)=>{for(let y=0;y<86;y++){const t=y/86;const ww=Math.round(8+t*22+Math.sin(y*.5)*2);x.fillStyle=y%4?'#7d8475':'#8f9686';x.fillRect(30-ww+Math.round(Math.sin(y*.13)*3),y,ww*2,1);}
  for(let i=0;i<60;i++){x.fillStyle=r()<.6?'#4f7a36':'#3d6a2c';x.fillRect((r()*44+8)|0,(r()*60)|0,3,2);}px(x,'#5c6358',4,82,52,4);x.fillStyle='rgba(255,255,255,.25)';x.fillRect(4,84,52,1);});
obj('karst2',40,58,(x,w,h,r)=>{for(let y=0;y<58;y++){const ww=Math.round(5+y/58*15);x.fillStyle=y%4?'#848b7c':'#969d8d';x.fillRect(20-ww+Math.round(Math.cos(y*.2)*2),y,ww*2,1);}for(let i=0;i<30;i++){x.fillStyle=r()<.6?'#4f7a36':'#3d6a2c';x.fillRect((r()*30+5)|0,(r()*40)|0,3,2);}});
// Phi lao
obj('philao',22,48,(x,w,h,r)=>{px(x,'#6b4a2a',10,22,3,26);for(let y=0;y<26;y++){const ww=2+y*.35;x.fillStyle=y%3?'#3e6e3a':'#4f8048';x.fillRect(11-ww,y,ww*2,1);}for(let i=0;i<20;i++){x.fillStyle='#2e5a2a';x.fillRect((r()*16+3)|0,(r()*24)|0,1,2);}});
// Đước
obj('duoc',28,24,(x,w,h,r)=>{for(let i=0;i<6;i++){px(x,'#6b5038',3+i*4,14,1,10);px(x,'#6b5038',2+i*4,22,3,1);}blob(x,14,9,13,8,'#3d7a3a');blob(x,10,7,7,5,'#4f8f46');for(let i=0;i<14;i++){x.fillStyle='#2e5e2a';x.fillRect((r()*24+2)|0,(r()*12+2)|0,2,1);}});
// Lau sậy
obj('reeds',16,20,(x,w,h,r)=>{for(let i=0;i<7;i++){const xx=1+i*2+(r()*2|0),hh=10+(r()*8|0);px(x,'#8aa04a',xx,20-hh,1,hh);px(x,'#d8cfa8',xx-1,20-hh-2,2,3);}});
// Kho hàng
obj('kho',64,50,(x)=>{px(x,'#7a5434',4,22,56,28);for(let i=4;i<60;i+=4)px(x,'#8f6640',i,22,1,28);px(x,'#3b2615',24,30,16,20);px(x,'#5b3a22',24,30,16,2);
  for(let y=0;y<20;y++){const ww=24+y*0.6|0;x.fillStyle=y%2?'#5e4a3a':'#6e5a48';x.fillRect(32-ww,y+2,ww*2,1);}px(x,'#4a3a2a',2,22,60,2);
  px(x,'#8a6a42',6,40,8,10);px(x,'#a07a4a',6,40,8,2);px(x,'#8a6a42',48,42,10,8);});
// Thúng / chum / lưới
obj('chum',14,16,(x)=>{blob(x,7,9,6,6,'#6b4a2a');blob(x,7,8,5,5,'#8a5f34');px(x,'#5a3a1e',3,2,8,3);px(x,'#2a3a4a',4,2,6,1);});
obj('net',34,26,(x)=>{px(x,'#5b3a22',2,4,2,22);px(x,'#5b3a22',30,4,2,22);px(x,'#5b3a22',2,4,30,2);x.strokeStyle='#cfc4a0';x.lineWidth=1;for(let i=6;i<30;i+=4){x.beginPath();x.moveTo(i,6);x.lineTo(i+2,24);x.stroke();}for(let y=9;y<24;y+=4){x.beginPath();x.moveTo(4,y);x.lineTo(30,y);x.stroke();}});
obj('campfire',18,16,(x)=>{px(x,'#5b3a22',2,12,14,3);px(x,'#7a4f2c',5,10,8,2);px(x,'#ff7a2a',6,4,6,7);px(x,'#ffd27a',8,6,2,4);px(x,'#ff4a1a',7,2,2,3);});
obj('tent',36,30,(x)=>{for(let y=0;y<26;y++){const ww=2+y*.65;x.fillStyle=y%3?'#7a6a4a':'#6a5a3a';x.fillRect(18-ww,y+4,ww*2,1);}px(x,'#2a1a10',15,18,6,12);px(x,'#5b3a22',17,0,2,6);px(x,'#b3261e',19,0,6,4);});
obj('sailboat',44,46,(x)=>{px(x,'#5a3a1e',4,36,36,7);px(x,'#7a4f2c',2,34,6,4);px(x,'#7a4f2c',36,32,6,6);px(x,'#5b3a22',21,4,2,32);px(x,'#c8a35a',8,6,13,26);px(x,'#a8823e',8,12,13,1);px(x,'#a8823e',8,18,13,1);px(x,'#a8823e',8,24,13,1);});
obj('sampan',30,14,(x)=>{px(x,'#6b4423',2,6,26,5);px(x,'#8a5a30',0,5,4,3);px(x,'#8a5a30',26,5,4,3);px(x,'#c8a35a',10,0,10,6);px(x,'#a8823e',10,4,10,2);});
obj('ruins',30,22,(x)=>{px(x,'#8c857a',2,12,8,10);px(x,'#9a948a',20,8,8,14);px(x,'#7d7769',10,18,10,4);px(x,'#a8a191',21,8,6,1);px(x,'#6a8a3a',3,12,3,2);});
obj('bigship',100,80,(x)=>{px(x,'#4a2e18',6,58,88,14);px(x,'#2e1c0e',10,70,80,4);px(x,'#6a4426',0,52,14,12);px(x,'#6a4426',84,48,16,14);px(x,'#8a5a30',8,58,84,2);for(let i=14;i<86;i+=8)px(x,'#d9a441',i,62,3,3);
  [[30,4,52],[54,10,46],[74,20,34]].forEach(([mx,top,len])=>{px(x,'#5b3a22',mx,top,3,len);px(x,'#b5523a',mx-16,top+2,16,len-12);for(let y=top+6;y<top+len-10;y+=5)px(x,'#93392a',mx-16,y,16,1);});});
Object.assign(G.FOOT_EXTRA=G.FOOT_EXTRA||{},{dinh:[5,2],chua:[4,2],thapchuong:[1,1],conglang:[0,0],caygao:[1,1],xoan:[1,1],bunhin:[0,0],leu:[1,1],fence:[1,1],thapbaothien:[2,2],dien:[8,3],congthanh:[0,0],cotco:[1,1],bia:[1,1],
  karst:[3,2],karst2:[2,1],philao:[1,1],duoc:[1,1],reeds:[0,0],kho:[4,2],chum:[1,1],net:[2,1],campfire:[1,1],tent:[2,1],sailboat:[0,0],sampan:[0,0],ruins:[2,1],bigship:[0,0]});

// ---------- SINH VẬT ----------
const gs=G.getSprite;
G.drawCreature=function(k,f){
  if(k==='trau')return gs('cr-trau'+f,30,20,(x)=>{const l=f%2;const c='#4a4a52',d='#34343a';px(x,d,5,13,3,6-l);px(x,d,10,13+l,3,5);px(x,d,19,13,3,6-l);px(x,d,24,13+l,3,5);px(x,c,4,6,22,9);px(x,'#5c5c66',5,6,20,2);px(x,c,23,3,7,8);px(x,'#2a2a30',26,9,4,2);
    px(x,'#e8e0c8',21,1,4,2);px(x,'#e8e0c8',20,0,2,2);px(x,'#e8e0c8',28,1,2,2);px(x,'#1a1a1a',26,5,1,1);px(x,c,1,7,3,1);px(x,c,0,8,2,4);});
  if(k==='vit')return gs('cr-vit'+f,12,9,(x)=>{px(x,'#f2efe6',1,3,8,5);px(x,'#f2efe6',7,0,4,4);px(x,'#e0a030',10,2,2,1);px(x,'#1a1a1a',9,1,1,1);px(x,'#d8d2c2',2,6,6,1);if(f%2)px(x,'#a8d8e8',0,8,10,1);});
  if(k==='ga')return gs('cr-ga'+f,10,10,(x)=>{const p=f%2;px(x,'#b8642a',1,3,7,5);px(x,'#d88a3a',2,3,5,2);px(x,'#b8642a',6,0+p,3,4);px(x,'#d8352b',7,-0+p,2,1);px(x,'#e0a030',9,2+p,1,1);px(x,'#2a6a3a',0,1,2,4);px(x,'#e0a030',3,8,1,2);px(x,'#e0a030',6,8,1,2);});
  if(k==='co')return gs('cr-co'+f,14,18,(x)=>{px(x,'#f8f8f2',3,6,7,5);px(x,'#f8f8f2',8,1,2,6);px(x,'#f8f8f2',8,0,4,2);px(x,'#e0b030',11,1,3,1);px(x,'#2a2a2a',5,11,1,7);px(x,'#2a2a2a',7,11,1,7);px(x,'#dcdcd4',3,9,6,1);});
  if(k==='cofly')return gs('cr-cofly'+f,20,10,(x)=>{const u=f%2;px(x,'#f8f8f2',6,4,8,3);px(x,'#f8f8f2',13,3,5,2);px(x,'#e0b030',18,3,2,1);if(u){px(x,'#f8f8f2',2,0,8,3);px(x,'#f8f8f2',8,0,6,2);}else{px(x,'#f8f8f2',2,6,8,3);px(x,'#f8f8f2',8,7,6,2);}px(x,'#2a2a2a',0,5,6,1);});
  if(k==='bird')return gs('cr-bird'+f,8,4,(x)=>{const u=f%2;px(x,'#2a2a30',3,2,2,1);if(u){px(x,'#2a2a30',0,0,3,1);px(x,'#2a2a30',5,0,3,1);px(x,'#2a2a30',2,1,1,1);px(x,'#2a2a30',5,1,1,1);}else{px(x,'#2a2a30',0,2,3,1);px(x,'#2a2a30',5,2,3,1);}});
  if(k==='fly')return gs('cr-fly'+f,4,4,(x)=>{px(x,'#fff8a0',1,1,2,2);});
  if(k==='butterfly')return gs('cr-bf'+f,6,5,(x)=>{const u=f%2;px(x,'#2a2a2a',2,1,2,3);px(x,'#f2c94a',0,u?0:1,2,2);px(x,'#f2c94a',4,u?0:1,2,2);});
  if(k==='sampan')return gs('cr-sampan'+f,30,18,(x)=>{const b=f%2;px(x,'#6b4423',2,10+b,26,5);px(x,'#8a5a30',0,9+b,4,3);px(x,'#8a5a30',26,9+b,4,3);px(x,'#c8a35a',10,5+b,10,5);px(x,'#4a3a2a',22,3+b,3,7);px(x,'#d8c48a',20,1+b,7,2);px(x,'#5b3a22',25,5+b,1,10);});
  return gs('cr-none',2,2,()=>{});
};
// dân làng: phối màu áo nâu, chàm, đen
G.VILLAGER_COLS=['#6b4a2e','#3b3b44','#7a5a3a','#4a5a3a','#2f4a6a','#5a3a2a','#8a6a3a'];
})();
