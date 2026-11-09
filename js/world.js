// ===== BẢN ĐỒ ĐẠI VIỆT THỜI LÝ =====
(function(){
const T = G.T;
const WATERY = {water:1,sea:1,deep:1,lotus:1,shallow:1};
const BLOCK = {brick:1,walltop:1,earthwall:1,karstbase:1};
G.WATERY = WATERY;
const FOOT = Object.assign({banyan:[2,1],areca:[1,1],palm:[1,1],bamboo:[2,1],banana:[1,1],hut:[3,2],house:[4,2],pagoda:[1,1],vanmieu:[4,2],well:[1,1],hay:[1,1],lantern:[0,0],stove:[1,1],rock:[1,1],boatsmall:[0,0],junk:[0,0],gate:[0,0],portal:[0,0],chest:[0,0],stall:[2,1],statue:[1,1]},G.FOOT_EXTRA||{});

function Map(id,w,h,base){this.id=id;this.w=w;this.h=h;this.t=new Array(w*h).fill(base);this.solid=new Uint8Array(w*h);this.objs=[];this.zones=[];this.portals=[];this.docks=[];this.stoves=[];this.chests=[];this.fishSpots=[];this.ambient=[];this.reserved=new Uint8Array(w*h);}
Map.prototype.set=function(x,y,t){x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<this.w&&y<this.h)this.t[y*this.w+x]=t;};
Map.prototype.get=function(x,y){if(x<0||y<0||x>=this.w||y>=this.h)return 'deep';return this.t[y*this.w+x];};
Map.prototype.rect=function(x0,y0,x1,y1,t){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)this.set(x,y,t);};
Map.prototype.ring=function(x0,y0,x1,y1,t,th){th=th||1;for(let k=0;k<th;k++){this.rect(x0+k,y0+k,x1-k,y0+k,t);this.rect(x0+k,y1-k,x1-k,y1-k,t);this.rect(x0+k,y0+k,x0+k,y1-k,t);this.rect(x1-k,y0+k,x1-k,y1-k,t);}};
Map.prototype.ellipse=function(cx,cy,rx,ry,t,only){for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){const dx=(x-cx)/rx,dy=(y-cy)/ry;if(dx*dx+dy*dy<=1&&(!only||only.includes(this.get(x,y))))this.set(x,y,t);}};
Map.prototype.blob=function(cx,cy,r,t,seed,only){const n=G.rng(seed||7);const k=[n(),n(),n()];for(let y=Math.floor(cy-r*1.4);y<=cy+r*1.4;y++)for(let x=Math.floor(cx-r*1.4);x<=cx+r*1.4;x++){const a=Math.atan2(y-cy,x-cx);const rr=r*(1+.18*Math.sin(a*3+k[0]*6)+.12*Math.sin(a*5+k[1]*6));if(Math.hypot(x-cx,y-cy)<=rr&&(!only||only.includes(this.get(x,y))))this.set(x,y,t);}};
Map.prototype.path=function(pts,w,t){for(let i=0;i<pts.length-1;i++){const [a,b]=pts[i],[c,d]=pts[i+1];const n=Math.max(Math.abs(c-a),Math.abs(d-b))*2+1;for(let k=0;k<=n;k++){const x=a+(c-a)*k/n,y=b+(d-b)*k/n;for(let dy=0;dy<w;dy++)for(let dx=0;dx<w;dx++)this.set(Math.round(x)+dx-(w>>1),Math.round(y)+dy-(w>>1),t);}}};
Map.prototype.obj=function(o,tx,ty,extra){const ob=Object.assign({o,x:tx*T+T/2,y:ty*T+T},extra||{});this.objs.push(ob);const f=FOOT[o]||[1,1];
  for(let i=0;i<f[0];i++)for(let j=0;j<f[1];j++){const sx=tx-Math.floor(f[0]/2)+i,sy=ty-j;if(sx>=0&&sy>=0&&sx<this.w&&sy<this.h)this.solid[sy*this.w+sx]=1;}return ob;};
Map.prototype.free=function(x0,y0,x1,y1,tiles){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(x<1||y<1||x>=this.w-1||y>=this.h-1)return false;const i=y*this.w+x;if(this.solid[i]||this.reserved[i])return false;if(tiles&&!tiles.includes(this.t[i]))return false;}return true;};
Map.prototype.reserve=function(x,y,r){for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++){const xx=x+i,yy=y+j;if(xx>=0&&yy>=0&&xx<this.w&&yy<this.h)this.reserved[yy*this.w+xx]=1;}};
Map.prototype.isWater=function(tx,ty){return !!WATERY[this.get(tx,ty)];};
Map.prototype.blocked=function(tx,ty,boat){if(tx<0||ty<0||tx>=this.w||ty>=this.h)return true;const t=this.t[ty*this.w+tx];
  if(boat)return !WATERY[t]||this.solid[ty*this.w+tx];return !!WATERY[t]||!!BLOCK[t]||!!this.solid[ty*this.w+tx];};
Map.prototype.zone=function(x0,y0,x1,y1,mobs,n,opt){this.zones.push(Object.assign({x0,y0,x1,y1,mobs,n},opt||{}));};
Map.prototype.amb=function(k,x0,y0,x1,y1,n,opt){this.ambient.push(Object.assign({k,x0,y0,x1,y1,n},opt||{}));};
function scatter(m,r,o,x0,y0,x1,y1,n,okTile,pad){let k=0,tries=0;pad=pad||0;while(k<n&&tries<n*40){tries++;const x=x0+((r()*(x1-x0+1))|0),y=y0+((r()*(y1-y0+1))|0);
  if(!m.free(x-pad,y-pad,x+pad,y,okTile))continue;m.obj(o,x,y);k++;}}
function noiseFill(m,seed,base,alts){const r=G.rng(seed);const pts=[];for(let i=0;i<Math.round(m.w*m.h/260);i++)pts.push([r()*m.w,r()*m.h,alts[(r()*alts.length)|0],2+r()*5]);
  pts.forEach(([x,y,t,rr])=>m.blob(x,y,rr,t,(x*31+y)|0,[base]));}
function houses(m,r,x0,y0,x1,y1,n,inside){let k=0,tries=0;while(k<n&&tries<n*60){tries++;const x=x0+((r()*(x1-x0))|0),y=y0+((r()*(y1-y0))|0);if(inside&&!inside(x,y))continue;
  const big=r()<.35;const w=big?2:1;if(!m.free(x-w-2,y-3,x+w+2,y+2,['grass','meadow','flowers']))continue;
  m.obj(big?'house':'hut',x,y);m.reserve(x,y+1,1);k++;
  // vườn: cau, chuối, rơm, chum
  const deco=[['areca',-3,0],['banana',3,1],['hay',-3,2],['chum',2,2],['areca',4,-1]];deco.forEach(([o,dx,dy])=>{if(r()<.55&&m.free(x+dx,y+dy,x+dx,y+dy,['grass','meadow','flowers']))m.obj(o,x+dx,y+dy);});}}
function bambooRing(m,cx,cy,rx,ry,gates){for(let a=0;a<Math.PI*2;a+=0.055){if(gates.some(g=>Math.abs(((a-g+Math.PI*3)%(Math.PI*2))-Math.PI)<0.13))continue;const x=Math.round(cx+Math.cos(a)*rx),y=Math.round(cy+Math.sin(a)*ry);if(!m.solid[y*m.w+x]&&!WATERY[m.get(x,y)])m.obj('bamboo',x,y);}}

// ================= LÀNG KIM LIÊN =================
function kimlien(){const W=120,H=90;const m=new Map('kimlien',W,H,'grass');const r=G.rng(1010);noiseFill(m,11,'grass',['meadow','meadow','flowers']);
  const rx=y=>108+Math.round(3*Math.sin(y/10));
  // sông Tô Lịch + đê
  for(let y=0;y<H;y++){const c=rx(y);m.rect(c-2,y,W-1,y,'water');m.rect(c+3,y,W-1,y,'meadow');m.rect(c-4,y,c-3,y,'dike');}
  for(let y=0;y<H;y++){const c=rx(y);m.rect(c+3,y,c+3,y,'sand');}
  // ruộng lúa phía bắc & nam, ruộng sen
  const paddy=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const t=m.get(x,y);if(t==='water'||t==='dike')continue;const cellx=Math.floor((x-x0)/7),celly=Math.floor((y-y0)/5);
    const dikeX=(x-x0)%7===0,dikeY=(y-y0)%5===0;if(dikeX||dikeY)m.set(x,y,'dirt');else m.set(x,y,G.rng(cellx*13+celly*7+x0)()<.12?'lotus':'paddy');}};
  paddy(6,3,100,20);paddy(42,70,100,86);
  // hồ Kim Liên (hồ sen lớn, đảo giữa hồ)
  m.blob(24,77,11,'lotus',5);m.ellipse(24,77,15,10,'lotus');m.ellipse(26,77,2.6,2.2,'grass');m.rect(28,77,40,77,'bridge');
  // đường
  m.path([[58,1],[58,88]],2,'dirt');m.path([[4,44],[W-1,44]],2,'dirt');m.path([[40,77],[44,77],[44,66],[57,66]],1,'dirt');
  for(let y=0;y<H;y++){const c=rx(y);if(y===44||y===45){m.rect(c-2,y,c+2,y,'bridge');}}
  m.path([[38,34],[78,34]],1,'dirt');m.path([[38,54],[64,54]],1,'dirt');m.path([[42,34],[42,56]],1,'dirt');m.path([[76,34],[76,54]],1,'dirt');
  // bên trong làng
  const VX=58,VY=44,RX=30,RY=21;const inside=(x,y)=>((x-VX)/(RX-3))**2+((y-VY)/(RY-3))**2<1;
  m.rect(60,33,74,39,'floor');m.obj('dinh',67,32);m.reserve(67,36,2);m.obj('banyan',62,37);m.obj('banyan',73,38);m.obj('lantern',63,33);m.obj('lantern',71,33);
  m.rect(36,57,50,61,'floor');m.obj('chua',43,56);m.obj('thapchuong',49,55);m.obj('bia',38,59);m.obj('caygao',34,52);
  m.ellipse(71,52,6,3.6,'lotus');m.obj('well',52,48);m.obj('stall',62,47);m.obj('stall',67,47);m.obj('stall',72,47);m.stoves.push(m.obj('stove',69,50));
  m.obj('hut',45,38);m.obj('campfire',48,39);m.stoves.push(m.objs[m.objs.length-1]);m.obj('house',82,38);m.obj('areca',86,37);m.obj('bia',79,39);
  ['lytruong','thaydo','thoren','trangba'].forEach(()=>{});[[67,36],[82,41],[46,41],[63,49],[58,40]].forEach(([x,y])=>m.reserve(x,y,1));
  m.reserve(58,47,2);houses(m,r,30,24,88,64,22,inside);
  bambooRing(m,VX,VY,RX,RY,[0,Math.PI/2,Math.PI,-Math.PI/2]);
  m.obj('conglang',VX,VY-RY+1);m.obj('conglang',VX,VY+RY+1);m.obj('conglang',VX-RX,VY+1);m.obj('conglang',VX+RX,VY+1);
  // đồng: bù nhìn, lều, cây gạo
  scatter(m,r,'bunhin',8,4,98,19,9,['paddy']);scatter(m,r,'leu',8,4,98,19,4,['dirt']);scatter(m,r,'bunhin',44,71,98,85,5,['paddy']);scatter(m,r,'leu',44,71,98,85,2,['dirt']);
  // rừng tre phía tây, trại sơn tặc
  scatter(m,r,'bamboo',2,22,26,66,60,['grass','meadow','flowers']);scatter(m,r,'caygao',2,22,26,66,5,['grass','meadow','flowers'],1);scatter(m,r,'xoan',2,22,26,66,10,['grass','meadow','flowers'],1);
  m.rect(8,24,22,34,'dirt');m.obj('tent',11,27);m.obj('tent',19,27);m.obj('tent',14,33);m.obj('campfire',15,29);for(let x=7;x<=23;x+=1){if(x<13||x>16)m.obj('fence',x,23);}
  // bến đò
  const cb=rx(40);m.rect(cb-4,40,cb+1,40,'wood');m.obj('sampan',cb+2,42);m.obj('net',cb-6,38);m.obj('chum',cb-7,41);m.stoves.push(m.obj('stove',cb-8,38));
  m.fishSpots.push({x:cb,y:40},{x:65,y:52},{x:38,y:77},{x:cb-3,y:60});
  // lau sậy bờ sông & hồ, viền
  for(let y=2;y<H-2;y+=3){const c=rx(y);if(m.get(c-3,y)==='dike'&&r()<.5)m.obj('reeds',c-3,y,{deco:1});}
  for(let x=0;x<W-14;x+=2){if(Math.abs(x-58)>2&&m.free(x,0,x,0))m.obj('bamboo',x,1);if(Math.abs(x-58)>2&&m.free(x,H-1,x,H-1))m.obj('bamboo',x,H-1);}
  for(let y=4;y<H-2;y+=2){if(Math.abs(y-44)>2&&m.free(1,y,1,y))m.obj('bamboo',1,y);}
  // quái
  m.zone(7,4,99,19,['chuot'],12);m.zone(43,71,99,85,['chuot','ran'],8);m.zone(28,64,52,88,['ran'],8);m.zone(2,36,26,66,['cho'],10);m.zone(6,22,24,36,['sontac'],7);
  m.boss={x:26*T+T/2,y:77*T+T/2,key:'kimlien'};
  m.portals.push({x:58,y:1,to:'thanglong',arrive:[70,104],need:'b1',zh:'升龙城',vi:'Đi Thăng Long'});
  // sinh vật
  m.amb('trau',8,4,98,19,5,{tiles:['paddy','dirt']});m.amb('trau',44,70,98,86,3,{tiles:['paddy','dirt']});m.amb('co',8,4,98,19,9,{tiles:['paddy','lotus']});m.amb('co',12,68,40,88,4,{tiles:['lotus']});
  m.amb('vit',65,49,77,55,5,{water:1});m.amb('vit',12,70,36,85,6,{water:1});m.amb('ga',34,28,84,62,10,{tiles:['grass','meadow','dirt','floor','flowers']});
  m.amb('dan',34,26,84,62,10,{tiles:['dirt','floor']});m.amb('sampan',100,2,118,88,2,{water:1});
  m.start=[58,47];return m;}

// ================= KINH THÀNH THĂNG LONG =================
function thanglong(){const W=140,H=110;const m=new Map('thanglong',W,H,'grass');const r=G.rng(1070);noiseFill(m,23,'grass',['meadow','meadow','flowers']);
  const rx=y=>128+Math.round(3*Math.sin(y/12));
  for(let y=0;y<H;y++){const c=rx(y);m.rect(c-3,y,W-1,y,'water');m.rect(c-5,y,c-4,y,'sand');m.rect(c-7,y,c-6,y,'dike');}
  // hồ Dâm Đàm
  m.blob(16,22,12,'water',31);m.ellipse(16,22,13,15,'water');m.ellipse(16,22,15,17,'shallow',['grass','meadow','flowers']);m.ellipse(20,14,3,2,'lotus');m.ellipse(10,30,3,2,'lotus');
  // sông Tô Lịch
  for(let x=26;x<rx(20)-2;x++){const y=21+Math.round(2*Math.sin(x/9));m.rect(x,y-1,x,y+1,'water');}
  // tường thành đất & cổng
  m.ring(34,28,112,100,'earthwall',2);m.rect(68,28,72,29,'cobble');m.rect(68,99,72,100,'cobble');m.rect(34,62,35,66,'cobble');m.rect(111,62,112,66,'cobble');
  // phố phường
  m.rect(36,30,110,98,'grass');noiseFill(m,77,'grass',['meadow']);
  m.rect(69,30,71,98,'cobble');m.rect(36,63,110,65,'cobble');[46,94].forEach(x=>m.rect(x,30,x,98,'cobble'));[44,82].forEach(y=>m.rect(36,y,110,y,'cobble'));
  m.path([[70,0],[70,28]],2,'dirt');m.path([[70,101],[70,109]],2,'dirt');m.path([[113,64],[rx(64)-6,64]],2,'dirt');m.path([[0,64],[33,64]],2,'dirt');
  for(let x=68;x<=72;x++){const y=21+Math.round(2*Math.sin(x/9));m.rect(x,y-1,x,y+1,'bridge');}
  for(let y=63;y<=65;y++)m.rect(rx(y)-7,y,rx(y)-6,y,'dike');
  // Hoàng thành
  m.rect(54,32,86,56,'stone');m.ring(54,32,86,56,'brick',1);m.rect(54,32,86,32,'walltop');m.rect(69,56,71,56,'stone');
  m.obj('dien',70,42);m.reserve(70,46,2);m.obj('cotco',62,52);m.obj('cotco',78,52);m.obj('xoan',58,36);m.obj('xoan',82,36);m.obj('lantern',66,48);m.obj('lantern',74,48);m.obj('congthanh',70,58);
  // Văn Miếu – Quốc Tử Giám
  m.rect(38,70,56,96,'tilered');m.ring(38,70,56,96,'brick',1);m.rect(46,96,48,96,'tilered');m.obj('vanmieu',47,76);m.rect(44,84,50,87,'water');
  m.obj('bia',41,82);m.obj('bia',41,86);m.obj('bia',53,82);m.obj('bia',53,86);m.obj('areca',40,92);m.obj('areca',54,92);m.obj('statue',43,94);m.obj('statue',51,94);m.reserve(47,91,1);
  // Chùa Diên Hựu (Một Cột) & tháp Báo Thiên
  m.rect(86,34,96,46,'stone');m.rect(88,36,94,42,'lotus');m.rect(89,37,93,41,'water');m.obj('pagoda',91,39);m.rect(91,42,91,43,'bridge');m.reserve(91,45,1);m.obj('xoan',87,35);m.obj('xoan',95,35);
  m.rect(92,72,100,80,'stone');m.obj('thapbaothien',96,77);m.obj('lantern',93,79);m.obj('lantern',99,79);
  // chợ Cửa Đông
  m.rect(96,57,110,71,'cobble');[[99,59],[103,59],[107,59],[99,69],[103,69],[107,69]].forEach(([x,y])=>m.obj('stall',x,y));m.stoves.push(m.obj('stove',108,71));m.reserve(102,64,1);
  // lò rèn, cửa nam
  m.obj('hut',60,90);m.stoves.push(m.obj('campfire',63,91));m.reserve(60,93,1);m.reserve(73,96,1);
  // nhà phố
  const inCity=(x,y)=>x>37&&x<109&&y>31&&y<97&&!(x>=53&&x<=87&&y>=31&&y<=57)&&!(x>=37&&x<=57&&y>=69&&y<=97)&&!(x>=85&&x<=101&&y>=33&&y<=81)&&!(x>=95&&y>=56&&y<=72);
  m.reserve(70,104,2);houses(m,r,38,31,108,97,46,inCity);
  for(let y=34;y<98;y+=6){[[68,y],[72,y]].forEach(([x,yy])=>{if(m.free(x,yy,x,yy))m.obj('lantern',x,yy);});}
  // ngoài thành: rừng, phế tích, trại Hắc Phong
  scatter(m,r,'banyan',30,2,116,17,10,['grass','meadow','flowers'],1);scatter(m,r,'xoan',30,2,116,17,16,['grass','meadow','flowers'],1);scatter(m,r,'bamboo',30,2,116,17,22,['grass','meadow','flowers']);scatter(m,r,'rock',30,2,116,17,8,['grass','meadow']);
  scatter(m,r,'banyan',1,40,31,108,12,['grass','meadow','flowers'],1);scatter(m,r,'bamboo',1,40,31,108,30,['grass','meadow','flowers']);scatter(m,r,'caygao',1,40,31,108,6,['grass','meadow'],1);
  scatter(m,r,'ruins',4,82,30,106,7,['grass','meadow']);scatter(m,r,'statue',4,82,30,106,6,['grass','meadow']);
  m.rect(98,3,116,15,'dirt');m.obj('tent',101,6);m.obj('tent',110,6);m.obj('tent',104,13);m.obj('campfire',106,10);for(let x=97;x<=117;x++){if(x<104||x>108)m.obj('fence',x,16);}
  scatter(m,r,'reeds',2,4,30,40,10,['shallow']);
  // bến Đông Bộ Đầu
  const cd=rx(60);m.rect(cd-6,60,cd+4,60,'wood');m.obj('bigship',cd+10,68);m.obj('sailboat',cd+3,58);m.docks.push({x:cd+3,y:60});
  for(let y=4;y<H-4;y+=5){const c=rx(y);if(r()<.5)m.obj('philao',c-8,y);}
  m.fishSpots.push({x:28,y:22},{x:cd-2,y:60},{x:47,y:88},{x:rx(90)-4,y:90});
  // quái
  m.zone(2,42,31,78,['soi'],12);m.zone(32,2,96,17,['ho','soi'],10);m.zone(4,82,30,106,['tuongda'],8);m.zone(38,66,108,98,['thichkhach'],7,{night:1});m.zone(98,3,116,15,['thichkhach','ho'],6);m.zone(114,30,rx(60)-8,100,['tuongda','soi'],5);
  m.boss={x:106*T,y:9*T,key:'thanglong'};m.worldBoss={x:(rx(84)-4)*T,y:84*T};
  m.portals.push({x:70,y:109,to:'kimlien',arrive:[58,4],zh:'金莲村',vi:'Về Kim Liên'});
  m.portals.push({x:cd+4,y:60,to:'vandon',arrive:[10,58],need:'b2',zh:'云屯港',vi:'Xuôi thuyền đi Vân Đồn'});
  m.amb('dan',37,30,109,98,18,{tiles:['cobble']});m.amb('linh',55,33,85,55,4,{tiles:['stone']});m.amb('ga',38,66,108,98,6,{tiles:['grass','meadow','dirt']});m.amb('vit',4,8,28,36,7,{water:1});
  m.amb('co',2,6,32,40,5,{tiles:['shallow','lotus']});m.amb('sampan',118,0,139,109,4,{water:1});m.amb('trau',114,20,122,100,3,{tiles:['grass','meadow','dike']});
  m.start=[70,104];return m;}

// ================= THƯƠNG CẢNG VÂN ĐỒN =================
function vandon(){const W=150,H=110;const m=new Map('vandon',W,H,'sea');const r=G.rng(1149);
  const sx=y=>38+Math.round(4*Math.sin(y/11)+2*Math.sin(y/4.3));
  for(let y=0;y<H;y++){const s=sx(y);m.rect(0,y,s-4,y,'grass');m.rect(s-3,y,s,y,'sand');m.rect(s+1,y,s+4,y,'shallow');m.rect(80+Math.round(6*Math.sin(y/9)),y,W-1,y,'deep');}
  noiseFill(m,41,'grass',['meadow','meadow','flowers']);
  // núi đá vôi trên bờ
  for(let i=0;i<9;i++){const x=4+((r()*22)|0),y=3+((r()*20)|0);m.blob(x,y,2.4,'karstbase',i*13,['grass','meadow','flowers']);}
  m.objs.length=0;for(let y=1;y<26;y++)for(let x=1;x<30;x++){if(m.get(x,y)==='karstbase'&&r()<.12&&m.free(x-1,y-1,x+1,y))m.obj(r()<.5?'karst':'karst2',x,y);}
  // làng chài phía bắc
  for(let i=0;i<5;i++){const y=6+i*4,x=sx(y)-7;if(m.free(x-2,y-2,x+2,y))m.obj('hut',x,y);if(m.free(x+3,y,x+3,y))m.obj('net',x+3,y);}
  // phố cảng
  m.rect(4,40,sx(58)-4,76,'cobble');m.rect(4,57,sx(58),59,'cobble');m.path([[0,58],[4,58]],3,'dirt');
  m.obj('kho',sx(48)-9,48);m.obj('kho',sx(70)-9,70);m.obj('house',12,46);m.obj('house',20,46);m.obj('house',10,72);m.obj('hut',22,73);
  [[12,64],[17,64],[22,64]].forEach(([x,y])=>m.obj('stall',x,y));m.stoves.push(m.obj('stove',17,69));m.obj('hut',8,66);m.stoves.push(m.obj('campfire',11,68));
  for(let x=6;x<sx(58)-4;x+=6)m.obj('lantern',x,56);m.reserve(22,56,1);m.reserve(14,51,1);m.reserve(10,62,1);m.reserve(8,58,1);
  // cầu tàu
  [50,66].forEach(y=>{const s=sx(y);m.rect(s-3,y,s+12,y,'wood');m.docks.push({x:s+12,y});});m.reserve(sx(52)-1,52,1);
  m.obj('bigship',sx(58)+22,64);m.obj('junk',sx(50)+8,48);m.obj('sailboat',sx(66)+8,64);
  // phi lao, đước
  for(let y=2;y<H-2;y+=3){const s=sx(y);if(y>36&&y<78)continue;if(m.free(s-2,y,s-2,y))m.obj('philao',s-2,y);}
  for(let y=4;y<24;y+=3)m.obj('duoc',sx(y)+2,y,{deco:1});for(let y=88;y<106;y+=3)m.obj('duoc',sx(y)+2,y,{deco:1});
  scatter(m,r,'xoan',2,28,24,106,10,['grass','meadow','flowers'],1);scatter(m,r,'bamboo',2,78,24,106,14,['grass','meadow','flowers']);
  // đảo
  function island(cx,cy,rad,seed){m.blob(cx,cy,rad+1.8,'sand',seed,['sea','deep','shallow']);m.blob(cx,cy,rad,'grass',seed+1,['sand']);m.blob(cx,cy,rad+3.5,'shallow',seed+2,['sea','deep']);}
  island(72,28,7,3);island(92,80,8,5);island(132,52,9,7);island(58,96,3,9);island(116,16,3,11);
  [[69,25],[76,30],[70,31]].forEach(([x,y])=>m.obj('stall',x,y));m.obj('hut',74,25);m.obj('philao',66,28);m.obj('philao',78,26);
  [[89,77],[95,82],[90,84]].forEach(([x,y])=>m.obj('tent',x,y));m.obj('campfire',93,79);
  [[128,48],[136,48],[130,56],[136,56]].forEach(([x,y])=>m.obj('tent',x,y));m.obj('campfire',133,52);for(let x=124;x<=140;x++){if(x<130||x>134)m.obj('fence',x,44);}
  m.chests.push({x:73,y:30},{x:58,y:96},{x:94,y:79},{x:116,y:16});
  // núi đá vôi giữa vịnh
  for(let k=0,tries=0;k<44&&tries<600;tries++){const x=46+((r()*100)|0),y=3+((r()*104)|0);let ok=true;
    [[72,28,12],[92,80,13],[132,52,14],[58,96,7],[116,16,7]].forEach(([a,b,d])=>{if(Math.hypot(x-a,y-b)<d)ok=false;});if(Math.abs(y-50)<3&&x<70)ok=false;if(Math.abs(y-66)<3&&x<70)ok=false;if(!ok)continue;
    if(!['sea','deep'].includes(m.get(x,y)))continue;m.blob(x,y,1.4+r()*1.2,'karstbase',k*7,['sea','deep']);m.obj(r()<.55?'karst':'karst2',x,y+1,{deco:1});k++;}
  m.fishSpots.push({x:sx(50)+11,y:50},{x:sx(66)+11,y:66},{x:sx(90)+1,y:90},{x:65,y:28});
  m.zone(26,4,44,106,['cua'],12,{onSand:1});m.zone(86,74,98,86,['haitac'],7);m.zone(124,46,140,58,['haitac'],6);m.zone(66,22,78,34,['cua','haitac'],4);
  m.zone(46,4,146,106,['thuyquy','camap'],14,{water:1});
  m.boss={x:133*T,y:51*T,key:'vandon'};
  m.portals.push({x:1,y:58,to:'thanglong',arrive:[118,64],zh:'升龙城',vi:'Về Thăng Long'});
  m.amb('dan',4,40,32,76,10,{tiles:['cobble']});m.amb('ga',2,28,28,40,5,{tiles:['grass','meadow']});m.amb('sampan',44,2,146,106,6,{water:1});m.amb('co',30,2,46,30,4,{tiles:['shallow','sand']});
  m.start=[10,58];return m;}

const BUILDERS={kimlien,thanglong,vandon};
const CACHE={};
G.getMap=function(id){if(CACHE[id])return CACHE[id];for(const k in CACHE){if(k!==id&&CACHE[k].ground){CACHE[k].ground.width=1;CACHE[k].ground=null;delete CACHE[k];}}const m=BUILDERS[id]();prerender(m);CACHE[id]=m;return m;};
G.mapNeighbors={kimlien:['thanglong'],thanglong:['kimlien','vandon'],vandon:['thanglong']};
function hash(x,y){let h=x*374761393+y*668265263;h=(h^(h>>13))*1274126177;return (h^(h>>16))>>>0;}
function prerender(m){const c=document.createElement('canvas');c.width=m.w*T;c.height=m.h*T;const x=c.getContext('2d');x.imageSmoothingEnabled=false;
  for(let ty=0;ty<m.h;ty++)for(let tx=0;tx<m.w;tx++){const t=m.get(tx,ty);const arr=G.TILES[t]||G.TILES.grass;const v=arr[hash(tx,ty)%arr.length];x.drawImage(G.tileAnim[t]?arr[0]:v,tx*T,ty*T);
    if(WATERY[t]){const up=m.get(tx,ty-1);if(!WATERY[up]&&up!=='bridge'&&up!=='wood'){x.fillStyle='rgba(255,255,255,.3)';x.fillRect(tx*T,ty*T,T,1);x.fillStyle='rgba(0,0,0,.18)';x.fillRect(tx*T,ty*T+1,T,2);}}
    else if(t==='earthwall'||t==='brick'){const dn=m.get(tx,ty+1);if(dn!=='earthwall'&&dn!=='brick'&&dn!=='walltop'){x.fillStyle='rgba(0,0,0,.25)';x.fillRect(tx*T,ty*T+T,T,3);}}
  }
  m.ground=c;m.objs.sort((a,b)=>a.y-b.y);
}
// ---------- tìm đường A* ----------
G.findPath=function(m,sx,sy,gx,gy,boat,maxN){const W=m.w,H=m.h;const idx=(x,y)=>y*W+x;const start=idx(sx,sy),goal=idx(gx,gy);
  if(sx===gx&&sy===gy)return [];const open=[start];const g=new Float32Array(W*H).fill(1e9);const came=new Int32Array(W*H).fill(-1);const f=new Float32Array(W*H).fill(1e9);const inOpen=new Uint8Array(W*H);
  g[start]=0;f[start]=Math.hypot(gx-sx,gy-sy);inOpen[start]=1;let n=0;maxN=maxN||40000;
  const ok=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&(!m.blocked(x,y,boat)||(x===gx&&y===gy));
  while(open.length&&n++<maxN){let bi=0;for(let i=1;i<open.length;i++)if(f[open[i]]<f[open[bi]])bi=i;const cur=open[bi];open[bi]=open[open.length-1];open.pop();inOpen[cur]=0;
    if(cur===goal){const p=[];let c=cur;while(c!==start){p.push([c%W,(c/W)|0]);c=came[c];}return p.reverse();}
    const cx=cur%W,cy=(cur/W)|0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const nx=cx+dx,ny=cy+dy;if(!ok(nx,ny))continue;if(dx&&dy&&(!ok(cx+dx,cy)||!ok(cx,cy+dy)))continue;
      const ni=idx(nx,ny);const ng=g[cur]+(dx&&dy?1.414:1);if(ng<g[ni]){g[ni]=ng;came[ni]=cur;f[ni]=ng+Math.hypot(gx-nx,gy-ny)*1.05;if(!inOpen[ni]){open.push(ni);inOpen[ni]=1;}}}}
  return null;};
})();
