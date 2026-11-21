// Math Quest offline cache. Bump V when you upload a new version of the app.
const V='mq-v3',CORE=['./','index.html','math-quest.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
const net=fetch(r).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>null);e.waitUntil(net);
e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||net.then(res=>res||(r.mode==='navigate'?caches.match('./').then(x=>x||caches.match('index.html')).then(x=>x||caches.match('math-quest.html')):Response.error()))))});
