// Service Worker for Murotalify: Audio Caching & Quota Tracking v2
const CACHE_NAME = 'murotal-audio-v2';
const API_CACHE_NAME = 'murotal-api-v2';

// All ambient sounds that must be cached permanently for zero data usage & offline play
const AMBIENT_SOUNDS_URLS = [
  '/sounds/rain.mp3',
  '/sounds/water.mp3',
  '/sounds/nature.mp3',
  '/sounds/bird.mp3',
  '/sounds/water-drop.mp3',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Pre-cache all ambient nature sounds immediately on installation
      for (const url of AMBIENT_SOUNDS_URLS) {
        try {
          const match = await cache.match(url);
          if (!match) {
            const res = await fetch(url);
            if (res.ok) {
              await cache.put(new Request(url), res);
            }
          }
        } catch (err) {
          console.warn('[SW] Ambient precache skip:', url, err);
        }
      }
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== API_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

async function notifyClients(message) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  clients.forEach((client) => {
    client.postMessage(message);
  });
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Intercept Audio Requests (/api/audio, /sounds/ or .mp3 files)
  const isAudioRequest =
    url.pathname.startsWith('/api/audio') ||
    url.pathname.includes('/sounds/') ||
    url.pathname.endsWith('.mp3');

  if (isAudioRequest) {
    event.respondWith(handleAudioFetch(event.request));
    return;
  }
});

async function handleAudioFetch(request) {
  const rangeHeader = request.headers.get('range');
  const cleanUrl = request.url.split('&range=')[0];
  const cacheKey = new Request(cleanUrl, { method: 'GET' });
  const cache = await caches.open(CACHE_NAME);
  let cachedResponse = await cache.match(cacheKey);

  // Fallback match by pathname if domain differs or relative match
  if (!cachedResponse) {
    try {
      const urlObj = new URL(cleanUrl);
      cachedResponse = await cache.match(urlObj.pathname);
    } catch (e) {}
  }

  const isAmbient = request.url.includes('/sounds/') || cleanUrl.includes('/sounds/');

  // 1. If not in cache, fetch clean audio and store permanently in Cache Storage
  if (!cachedResponse) {
    try {
      const networkResponse = await fetch(cleanUrl, {
        method: 'GET',
        headers: { Accept: 'audio/*' },
      });

      if (networkResponse.ok) {
        // Store cloned complete audio in Cache Storage
        await cache.put(cacheKey, networkResponse.clone());

        const contentLength = networkResponse.headers.get('content-length');
        const bytes = contentLength ? parseInt(contentLength, 10) : 0;

        notifyClients({
          type: 'QUOTA_USED',
          bytes: bytes || (isAmbient ? 2000000 : 500000),
          category: 'audio',
          name: isAmbient ? 'Suara Alam (Disimpan ke Cache)' : 'Murotal Audio (Disimpan ke Cache)',
        });

        cachedResponse = networkResponse;
      } else {
        return fetch(request);
      }
    } catch (err) {
      console.warn('[SW] Audio fetch failed:', err);
      return fetch(request);
    }
  } else {
    // Audio is already cached! Report 100% saved quota
    const savedBytes = parseInt(cachedResponse.headers.get('content-length') || (isAmbient ? '2500000' : '500000'), 10);
    notifyClients({
      type: 'QUOTA_SAVED',
      bytes: savedBytes,
      category: 'audio',
      name: isAmbient ? 'Suara Alam (Offline Cache - 0 KB Kuota)' : 'Murotal (Offline Cache - 0 KB Kuota)',
    });
  }

  // 2. Serve from cachedResponse (handling Range request if browser asks)
  try {
    const arrayBuffer = await cachedResponse.clone().arrayBuffer();
    const totalBytes = arrayBuffer.byteLength;

    if (rangeHeader) {
      const parts = rangeHeader.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalBytes - 1;
      const chunk = arrayBuffer.slice(start, end + 1);

      return new Response(chunk, {
        status: 206,
        statusText: 'Partial Content',
        headers: {
          'Content-Type': cachedResponse.headers.get('Content-Type') || 'audio/mpeg',
          'Content-Range': `bytes ${start}-${end}/${totalBytes}`,
          'Content-Length': chunk.byteLength.toString(),
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': cachedResponse.headers.get('Content-Type') || 'audio/mpeg',
        'Content-Length': totalBytes.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (e) {
    return cachedResponse;
  }
}
