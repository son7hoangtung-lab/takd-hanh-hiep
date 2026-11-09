import os,shutil,re,json,time
root=os.path.dirname(os.path.abspath(__file__));dist=os.path.join(root,'dist')
os.makedirs(dist+'/js',exist_ok=True)
body=open(root+'/index.html',encoding='utf-8').read()
ver=time.strftime('%Y%m%d%H%M')
head='''<!doctype html><html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Takd 行侠">
<meta name="theme-color" content="#1a1210"><link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="icon-180.png"><link rel="icon" href="icon-192.png">
<style>:root{padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}body{margin:0}[hidden]{display:none!important}</style>
</head><body>
'''
open(dist+'/index.html','w',encoding='utf-8').write(head+body+'\n</body></html>')
for f in os.listdir(root+'/js'):shutil.copy(root+'/js/'+f,dist+'/js/'+f)
json.dump({"name":"Takd Hành Hiệp 行侠记","short_name":"Takd 行侠","start_url":"./","display":"standalone","orientation":"any","background_color":"#1a1210","theme_color":"#1a1210",
 "icons":[{"src":"icon-192.png","sizes":"192x192","type":"image/png"},{"src":"icon-512.png","sizes":"512x512","type":"image/png"}]},open(dist+'/manifest.webmanifest','w',encoding='utf-8'),ensure_ascii=False)
files=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png']+['js/'+f for f in os.listdir(root+'/js')]
open(dist+'/sw.js','w').write('''const C='takd-%s';const F=%s;
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{if(res.ok&&new URL(e.request.url).origin===location.origin){const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));}return res;}).catch(()=>caches.match('index.html'))));});
'''%(ver,json.dumps(files)))
print('built',ver)
