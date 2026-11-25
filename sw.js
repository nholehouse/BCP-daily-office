const V = 'bcp-office-20261125000113';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
// each file is fetched with ?v=<this build> so GitHub's cache cannot hand back the previous build's page; it is stored under its plain name
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => Promise.all(FILES.map(f => fetch(f + (f.includes('?') ? '&' : '?') + 'v=' + V, { cache: 'reload' }).then(r => { if (!r.ok) throw new Error(f + ' ' + r.status); return c.put(f, r); })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== self.location.origin || e.request.headers.has('range')) return;       
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).catch(() => e.request.mode === 'navigate' ? caches.match('./index.html') : Response.error())));
});
