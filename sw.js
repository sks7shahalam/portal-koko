/* Portal Koko: simpan fail app (bukan data portal) supaya app terbuka pantas.
   Tukar VERSI setiap kali fail app (logo, nama, warna) dikemas kini. */
const VERSI = 'portal-koko-v1';
const FAIL = ['./', 'index.html', 'manifest.webmanifest', 'logo.png', 'icon-192.png', 'icon-512.png',
  'icon-maskable-192.png', 'icon-maskable-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSI).then(c => c.addAll(FAIL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(k => Promise.all(k.filter(n => n !== VERSI).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return; // portal Apps Script tidak disentuh
  e.respondWith(
    fetch(e.request)
      .then(r => { const salin = r.clone(); caches.open(VERSI).then(c => c.put(e.request, salin)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('index.html')))
  );
});
