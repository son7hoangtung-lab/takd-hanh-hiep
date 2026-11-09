// ===== BẢN ĐỒ =====
(function(){
const T = G.T;
const WATERY = {water:1,sea:1,deep:1,lotus:1};
const BLOCK = {brick:1,walltop:1};
G.WATERY = WATERY;
// footprint (ô) của vật thể: [rộng, cao]
const FOOT = {banyan:[2,1],areca:[1,1],palm:[1,1],bamboo:[2,1],banana:[1,1],hut:[3,2],house:[4,2],pagoda:[1,1],vanmieu:[4,2],well:[1,1],hay:[1,1],lantern:[0,0],stove:[1,1],rock:[1,1],boatsmall:[0,0],junk:[0,0],gate:[0,0],portal:[0,0],chest:[0,0],stall:[2,1],statue:[1,1]};

function Map(id,w,h,base){this.id=id;this.w=w;this.h=h;this.t=new Array(w*h).fill(base);this.solid=new Uint8Array(w*h);this.objs=[];this.zones=[];this.portals=[];this.docks=[];this.stoves=[];this.chests=[];this.slow=new Uint8Array(w*h);}
Map.prototype.set=function(x,y,t){if(x>=0&&y>=0&&x<this.w&&y<this.h)this.t[y*this.w+x]=t;};
Map.prototype.get=function(x,y){if(x<0||y<0||x>=this.w||y>=this.h)return 'deep';return this.t[y*this.w+x];};
Map.prototype.rect=function(x0,y0,x1,y1,t){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)this.set(x,y,t);};
Map.prototype.ellipse=function(cx,cy,rx,ry,t){for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){const dx=(x-cx)/rx,dy=(y-cy)/ry;if(dx*dx+dy*dy<=1)this.set(x,y,t);}};
Map.prototype.obj=function(o,tx,ty,extra){const ob=Object.assign({o,x:tx*T+T/2,y:ty*T+T},extra||{});this.objs.push(ob);const f=FOOT[o]||[1,1];
  for(let i=0;i<f[0];i++)for(let j=0;j<f[1];j++){const sx=tx-Math.floor(f[0]/2)+i,sy=ty-j;if(sx>=0&&sy>=0&&sx<this.w&&sy<this.h)this.solid[sy*this.w+sx]=1;}return ob;};
Map.prototype.isWater=function(tx,ty){return !!WATERY[this.get(tx,ty)];};
Map.prototype.blocked=function(tx,ty,boat){if(tx<0||ty<0||tx>=this.w||ty>=this.h)return true;const t=this.get(tx,ty);
  if(boat)return !WATERY[t]||this.solid[ty*this.w+tx];
  return !!WATERY[t]||!!BLOCK[t]||!!this.solid[ty*this.w+tx];};
Map.prototype.zone=function(x0,y0,x1,y1,mobs,n,opt){this.zones.push(Object.assign({x0,y0,x1,y1,mobs,n},opt||{}));};
function scatter(m,r,o,x0,y0,x1,y1,n,okTile){let k=0,tries=0;while(k<n&&tries<n*30){tries++;const x=x0+((r()*(x1-x0+1))|0),y=y0+((r()*(y1-y0+1))|0);
  if(okTile&&!okTile.includes(m.get(x,y)))continue;if(m.solid[y*m.w+x])continue;m.obj(o,x,y);k++;}}

// --------- LÀNG KIM LIÊN ---------
function kimlien(){const m=new Map('kimlien',80,60,'grass');const r=G.rng(1010);
  // ruộng lúa
  m.rect(6,6,30,20,'paddy');m.rect(56,6,74,24,'paddy');
  for(let x=6;x<=30;x+=6)m.rect(x,6,x,20,'dirt');for(let y=6;y<=20;y+=5)m.rect(6,y,30,y,'dirt');
  for(let x=56;x<=74;x+=6)m.rect(x,6,x,24,'dirt');for(let y=6;y<=24;y+=6)m.rect(56,y,74,y,'dirt');
  // sông Tô Lịch phía đông
  for(let y=0;y<60;y++){const o=Math.round(Math.sin(y/7)*1.5);m.rect(75+o,y,79,y,'water');}
  // đường làng
  m.rect(39,3,41,58,'dirt');m.rect(8,33,72,35,'dirt');
  // hồ sen Kim Liên
  m.ellipse(53,46,10,7,'lotus');m.ellipse(55,46,2.6,2.2,'grass');m.rect(42,46,52,46,'bridge');
  // sân đình
  m.rect(35,26,45,32,'floor');
  // nhà cửa
  m.obj('hut',34,25);m.obj('hut',47,25);m.obj('house',40,23);m.obj('hut',31,38);m.obj('hut',47,39);m.obj('hut',25,30);m.obj('hut',56,31);
  m.obj('banyan',45,29);m.obj('well',37,32);m.obj('hay',29,38);m.obj('hay',51,38);m.obj('hay',27,25);
  m.stoves.push(m.obj('stove',48,33));m.obj('lantern',38,30);m.obj('lantern',43,30);m.obj('stall',45,36);
  m.obj('gate',40,7);
  // rừng tre phía tây nam & viền
  scatter(m,r,'bamboo',2,40,26,58,46,['grass']);scatter(m,r,'banana',2,22,12,32,6,['grass']);
  scatter(m,r,'areca',30,22,60,42,12,['grass']);scatter(m,r,'bamboo',0,0,79,2,18,['grass','dirt']);scatter(m,r,'bamboo',0,57,74,59,16,['grass']);
  for(let y=3;y<57;y+=3)if(m.get(1,y)==='grass')m.obj('bamboo',1,y);
  // trại sơn tặc
  m.rect(14,48,22,54,'dirt');m.obj('hut',18,50);m.obj('hay',15,53);m.obj('hay',22,53);
  // vùng quái
  m.zone(7,7,30,20,['chuot'],9);m.zone(57,7,74,24,['chuot','ran'],8);m.zone(42,38,64,54,['ran'],7);
  m.zone(4,40,26,57,['cho'],8);m.zone(12,46,24,56,['sontac'],6);
  m.boss={x:55*T+T/2,y:46*T+T/2,key:'kimlien'};
  m.portals.push({x:40,y:4,to:'thanglong',arrive:[36,55],need:'b1',zh:'升龙城',vi:'Đi Thăng Long'});
  m.start=[40,37];
  return m;}

// --------- THĂNG LONG ---------
function thanglong(){const m=new Map('thanglong',80,60,'grass');const r=G.rng(1070);
  // sông Hồng
  for(let y=0;y<60;y++){const o=Math.round(Math.sin(y/9)*2);m.rect(70+o,y,79,y,y%4?'water':'water');}
  // thành
  m.rect(11,9,61,51,'stone');
  m.rect(10,8,62,8,'walltop');m.rect(10,52,62,52,'walltop');m.rect(10,8,10,52,'walltop');m.rect(62,8,62,52,'walltop');
  m.rect(35,52,37,52,'stone');m.rect(35,8,37,8,'stone');m.rect(62,29,62,31,'stone');
  m.rect(35,53,37,59,'dirt');m.rect(63,29,69,31,'dirt');m.rect(68,28,72,32,'bridge');
  // cỏ trong thành
  m.rect(12,10,30,24,'grass');m.rect(40,10,60,26,'grass');m.rect(12,36,30,50,'grass');
  // Văn Miếu
  m.rect(14,12,30,24,'tilered');m.obj('vanmieu',22,17);m.rect(18,20,26,22,'water');m.obj('statue',15,23);m.obj('statue',29,23);
  // Chùa Một Cột
  m.rect(26,27,34,33,'water');m.obj('pagoda',30,30);m.rect(30,33,30,34,'bridge');
  // hồ Lục Thủy
  m.ellipse(50,18,7,5,'water');m.obj('areca',42,12);m.obj('areca',58,14);m.obj('banyan',44,24);
  // chợ & nhà
  m.obj('stall',44,31);m.obj('stall',49,31);m.obj('stall',54,31);m.obj('house',46,40);m.obj('house',54,44);m.obj('house',20,44);m.obj('house',26,48);
  m.stoves.push(m.obj('stove',40,36));m.obj('lantern',34,44);m.obj('lantern',38,44);m.obj('lantern',34,28);m.obj('lantern',38,28);
  // rừng ngoài thành
  scatter(m,r,'banyan',0,0,9,58,14,['grass']);scatter(m,r,'bamboo',11,0,60,6,16,['grass']);scatter(m,r,'rock',0,0,9,58,8,['grass']);
  // trại Hắc Phong (đông bắc, ngoài thành)
  m.rect(63,1,69,14,'dirt');m.obj('hut',65,5);m.obj('hut',66,11);m.obj('hay',64,13);m.obj('lantern',63,8);
  m.zone(1,10,9,52,['soi'],10);m.zone(12,1,60,6,['ho','soi'],8);m.zone(63,16,68,50,['tuongda'],7);m.zone(12,36,30,50,['thichkhach'],6,{night:1});
  m.zone(63,1,69,14,['thichkhach','ho'],6);
  m.boss={x:66*T,y:8*T,key:'thanglong'};
  m.portals.push({x:36,y:58,to:'kimlien',arrive:[40,6],zh:'金莲村',vi:'Về Kim Liên'});
  m.portals.push({x:70,y:30,to:'vandon',arrive:[14,30],need:'b2',zh:'云屯港',vi:'Xuôi thuyền đi Vân Đồn'});
  m.worldBoss={x:72*T,y:44*T};
  m.start=[36,55];return m;}

// --------- VÂN ĐỒN ---------
function vandon(){const m=new Map('vandon',96,64,'deep');const r=G.rng(1149);
  for(let y=0;y<64;y++){const o=Math.round(Math.sin(y/6)*2);m.rect(0,y,25+o,y,'grass');m.rect(26+o,y,31+o,y,'sand');m.rect(32+o,y,50+o,y,'sea');}
  // phố cảng
  m.rect(6,18,24,40,'stone');m.obj('house',10,22);m.obj('house',20,22);m.obj('hut',8,38);m.obj('stall',16,34);m.obj('stall',21,38);
  m.stoves.push(m.obj('stove',18,30));m.obj('lantern',14,26);m.obj('lantern',22,30);
  // cầu tàu
  m.rect(26,26,40,26,'wood');m.rect(26,34,40,34,'wood');m.obj('junk',38,30);m.obj('boatsmall',34,38);
  m.docks.push({x:40,y:26},{x:40,y:34});
  // đảo
  function island(cx,cy,rad){m.ellipse(cx,cy,rad+1.5,rad+1,'sand');m.ellipse(cx,cy,rad,rad-.5,'grass');}
  island(58,14,5);island(68,46,6);island(86,28,6);island(46,56,3);
  scatter(m,r,'palm',52,9,64,19,6,['grass','sand']);scatter(m,r,'palm',62,40,74,52,7,['grass','sand']);scatter(m,r,'palm',80,22,92,34,6,['grass','sand']);
  m.chests.push({x:58,y:14},{x:46,y:56},{x:70,y:48});
  m.obj('hut',85,26);m.obj('hut',67,44);
  // rừng dừa trên bờ
  scatter(m,r,'palm',0,0,24,16,16,['grass']);scatter(m,r,'palm',0,42,24,63,16,['grass']);scatter(m,r,'rock',0,0,25,63,10,['grass']);
  m.zone(27,2,33,62,['cua'],9,{onSand:1});m.zone(54,10,62,18,['haitac'],5);m.zone(63,41,73,51,['haitac','cua'],6);
  m.zone(34,4,94,62,['thuyquy','camap'],10,{water:1});
  m.boss={x:87*T,y:29*T,key:'vandon'};
  m.portals.push({x:2,y:30,to:'thanglong',arrive:[66,30],zh:'升龙城',vi:'Về Thăng Long'});
  m.start=[14,30];return m;}

const BUILDERS={kimlien,thanglong,vandon};
const CACHE={};
G.getMap=function(id){if(CACHE[id])return CACHE[id];const m=BUILDERS[id]();prerender(m);CACHE[id]=m;return m;};

function hash(x,y){let h=x*374761393+y*668265263;h=(h^(h>>13))*1274126177;return (h^(h>>16))>>>0;}
function prerender(m){const c=document.createElement('canvas');c.width=m.w*T;c.height=m.h*T;const x=c.getContext('2d');x.imageSmoothingEnabled=false;
  m.anim=[];
  for(let ty=0;ty<m.h;ty++)for(let tx=0;tx<m.w;tx++){const t=m.get(tx,ty);const arr=G.TILES[t];const v=arr[hash(tx,ty)%arr.length];x.drawImage(G.tileAnim[t]?arr[0]:v,tx*T,ty*T);
    // bờ nước: viền sáng
    if(WATERY[t]){const up=m.get(tx,ty-1);if(!WATERY[up]&&up!=='bridge'&&up!=='wood'){x.fillStyle='rgba(255,255,255,.35)';x.fillRect(tx*T,ty*T,T,1);x.fillStyle='rgba(0,0,0,.18)';x.fillRect(tx*T,ty*T+1,T,2);}}
    else if(t==='grass'){const dn=m.get(tx,ty+1);if(WATERY[dn]){x.fillStyle='#4a7d2e';x.fillRect(tx*T,ty*T+T-2,T,2);}}
  }
  m.ground=c;
  m.objs.sort((a,b)=>a.y-b.y);
}
})();
