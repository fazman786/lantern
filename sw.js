const CACHE = 'lantern-v1';
const STATIC = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
];

// Install — cache core assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — cache first for static, network first for API
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Never intercept Claude API calls
  if (url.hostname === 'api.anthropic.com' || url.hostname === 'www.paypal.com' || url.hostname === 'api.paypal.com') {
    return;
  }

  // Cache first for fonts and static assets
  if (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com' ||
    url.hostname === 'cdnjs.cloudflare.com' ||
    e.request.destination === 'image' ||
    e.request.destination === 'style' ||
    e.request.destination === 'script' ||
    e.request.destination === 'font'
  ) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Network first for HTML (so updates get through)
  if (e.request.destination === 'document' || e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Default: network with cache fallback
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

// Push notifications (for deadline reminders)
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || 'Lantern', {
      body: data.body || 'You have a pending deadline.',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      vibrate: [200, 100, 200],
      data: data.url || '/',
      actions: [
        { action: 'open', title: 'View in Lantern' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action !== 'dismiss') {
    e.waitUntil(clients.openWindow(e.notification.data || '/'));
  }
});
