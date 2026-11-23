// Quota Tracker & Data Saver System for Murotalify
// Provides network bytes tracking, audio cache-first offline storage, and daily auto-reset.

const STORAGE_KEY = 'murotal_quota_stats';
const DATA_SAVER_KEY = 'murotal_data_saver';
const AUDIO_CACHE_NAME = 'murotal-audio-v2';
const API_CACHE_NAME = 'murotal-api-v2';

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const defaultStats = () => ({
  date: getTodayKey(),
  bytesUsed: 0,
  bytesSaved: 0,
  audioBytes: 0,
  apiBytes: 0,
  assetBytes: 0,
  history: [], // { id, time, name, size, type: 'used' | 'saved', category }
});

const SERVER_STATS = Object.freeze({
  date: '',
  bytesUsed: 0,
  bytesSaved: 0,
  audioBytes: 0,
  apiBytes: 0,
  assetBytes: 0,
  history: [],
});

export function getServerQuotaStats() {
  return SERVER_STATS;
}

let memoryStats = null;
let memoryDataSaver = null;

function loadStatsFromStorage() {
  if (typeof window === 'undefined') return SERVER_STATS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const today = getTodayKey();
    if (!raw) {
      const initial = { ...defaultStats(), date: today };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    const parsed = JSON.parse(raw);
    // Check if day has changed -> Auto-reset for new day
    if (parsed.date !== today) {
      const refreshed = {
        ...defaultStats(),
        date: today,
        previousDayUsage: parsed.bytesUsed || 0,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(refreshed));
      return refreshed;
    }

    return parsed;
  } catch (err) {
    console.error('[QuotaTracker] Error reading stats:', err);
    return SERVER_STATS;
  }
}

export function getQuotaStats() {
  if (typeof window === 'undefined') return SERVER_STATS;
  if (!memoryStats) {
    memoryStats = loadStatsFromStorage();
  }
  return memoryStats;
}

const listeners = new Set();
const dataSaverListeners = new Set();

function notifyListeners(stats) {
  listeners.forEach((listener) => {
    try {
      listener(stats);
    } catch (e) {
      console.error(e);
    }
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('murotal-quota-updated', { detail: stats }));
  }
}

function setAndNotifyStats(newStats) {
  memoryStats = newStats;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
  } catch (e) {}
  notifyListeners(newStats);
}

export function subscribeQuota(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isDataSaverEnabled() {
  if (typeof window === 'undefined') return true;
  if (memoryDataSaver === null) {
    const stored = localStorage.getItem(DATA_SAVER_KEY);
    memoryDataSaver = stored === null ? true : stored === 'true'; // Default ON for max savings!
  }
  return memoryDataSaver;
}

export function setDataSaverEnabled(enabled) {
  if (typeof window === 'undefined') return;
  memoryDataSaver = enabled;
  localStorage.setItem(DATA_SAVER_KEY, enabled ? 'true' : 'false');
  dataSaverListeners.forEach((fn) => {
    try { fn(enabled); } catch (e) {}
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('murotal-datasaver-updated', { detail: enabled }));
  }
}

export function subscribeDataSaver(listener) {
  dataSaverListeners.add(listener);
  return () => dataSaverListeners.delete(listener);
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      memoryStats = loadStatsFromStorage();
      notifyListeners(memoryStats);
    } else if (e.key === DATA_SAVER_KEY) {
      memoryDataSaver = e.newValue === null ? true : e.newValue === 'true';
      dataSaverListeners.forEach((fn) => {
        try { fn(memoryDataSaver); } catch (err) {}
      });
    }
  });
}

export function recordQuotaUsage({ bytes, category = 'audio', name = 'Download' }) {
  if (typeof window === 'undefined' || !bytes || bytes <= 0) return;

  try {
    const current = getQuotaStats();
    const nextStats = {
      ...current,
      bytesUsed: (current.bytesUsed || 0) + bytes,
      audioBytes: category === 'audio' ? (current.audioBytes || 0) + bytes : (current.audioBytes || 0),
      apiBytes: category === 'api' ? (current.apiBytes || 0) + bytes : (current.apiBytes || 0),
      assetBytes: category === 'asset' || category === 'assets' ? (current.assetBytes || 0) + bytes : (current.assetBytes || 0),
      history: [
        {
          id: Date.now() + Math.random(),
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          name,
          size: bytes,
          type: 'used',
          category,
        },
        ...(current.history || []),
      ].slice(0, 30),
    };
    setAndNotifyStats(nextStats);
  } catch (err) {
    console.error('[QuotaTracker] Error recording usage:', err);
  }
}

export function recordQuotaSaved({ bytes, category = 'audio', name = 'Cache Terpakai' }) {
  if (typeof window === 'undefined' || !bytes || bytes <= 0) return;

  try {
    const current = getQuotaStats();
    const nextStats = {
      ...current,
      bytesSaved: (current.bytesSaved || 0) + bytes,
      history: [
        {
          id: Date.now() + Math.random(),
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          name,
          size: bytes,
          type: 'saved',
          category,
        },
        ...(current.history || []),
      ].slice(0, 30),
    };
    setAndNotifyStats(nextStats);
  } catch (err) {
    console.error('[QuotaTracker] Error recording saved:', err);
  }
}

export function resetQuota() {
  if (typeof window === 'undefined') return;
  const refreshed = {
    ...defaultStats(),
    date: getTodayKey(),
  };
  setAndNotifyStats(refreshed);
}

// All 5 Ambient Nature Sounds to cache permanently
export const AMBIENT_SOUND_FILES = [
  { id: 'rain', name: 'Suara Hujan', emoji: '🌧️', url: '/sounds/rain.mp3', size: 3477420 },
  { id: 'water', name: 'Air Mengalir', emoji: '💧', url: '/sounds/water.mp3', size: 869376 },
  { id: 'nature', name: 'Suara Alam', emoji: '🍃', url: '/sounds/nature.mp3', size: 9665280 },
  { id: 'bird', name: 'Kicauan Burung', emoji: '🐦', url: '/sounds/bird.mp3', size: 836352 },
  { id: 'water-drop', name: 'Tetesan Air', emoji: '🫧', url: '/sounds/water-drop.mp3', size: 2191778 },
];

// Pre-cache all ambient nature sounds into Cache Storage for 100% offline & zero quota usage
export async function cacheAllAmbientSounds(onProgress) {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return { success: false, error: 'Cache API not supported' };
  }

  try {
    const cache = await caches.open(AUDIO_CACHE_NAME);
    let newlyCachedBytes = 0;
    let cachedCount = 0;

    for (let i = 0; i < AMBIENT_SOUND_FILES.length; i++) {
      const sound = AMBIENT_SOUND_FILES[i];
      const cacheKey = new Request(sound.url, { method: 'GET' });
      let match = await cache.match(cacheKey);

      if (!match) {
        try {
          const res = await fetch(sound.url, {
            method: 'GET',
            headers: { Accept: 'audio/*' },
          });

          if (res.ok) {
            await cache.put(cacheKey, res.clone());
            const blob = await res.blob();
            newlyCachedBytes += blob.size;

            recordQuotaUsage({
              bytes: blob.size,
              category: 'audio',
              name: `Simpan Cache Suara Alam: ${sound.name}`,
            });
          }
        } catch (fetchErr) {
          console.warn(`[QuotaTracker] Gagal mengunduh ${sound.name}:`, fetchErr);
        }
      }

      cachedCount++;
      if (onProgress) {
        onProgress({
          current: cachedCount,
          total: AMBIENT_SOUND_FILES.length,
          name: sound.name,
        });
      }
    }

    return { success: true, count: cachedCount, newlyCachedBytes };
  } catch (err) {
    console.error('[QuotaTracker] Error in cacheAllAmbientSounds:', err);
    return { success: false, error: err.message };
  }
}

// Inspect how many ambient sounds are stored in Cache Storage
export async function getAmbientCacheStatus() {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return { total: AMBIENT_SOUND_FILES.length, cached: 0, isAllCached: false, totalBytes: 0, details: [] };
  }

  try {
    const cache = await caches.open(AUDIO_CACHE_NAME);
    let cached = 0;
    let totalBytes = 0;
    const details = [];

    for (const sound of AMBIENT_SOUND_FILES) {
      const match = await cache.match(new Request(sound.url));
      const isCached = !!match;
      if (isCached) {
        cached++;
        const cl = match.headers.get('content-length');
        const size = cl ? parseInt(cl, 10) : sound.size;
        totalBytes += size;
      }
      details.push({ ...sound, isCached });
    }

    return {
      total: AMBIENT_SOUND_FILES.length,
      cached,
      isAllCached: cached === AMBIENT_SOUND_FILES.length,
      totalBytes,
      details,
    };
  } catch (err) {
    return { total: AMBIENT_SOUND_FILES.length, cached: 0, isAllCached: false, totalBytes: 0, details: [] };
  }
}

// Inspect Cache Storage status for offline surahs
export async function getOfflineCacheInfo() {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return { count: 0, totalBytes: 0, cachedSurahs: [] };
  }

  try {
    const audioCache = await caches.open(AUDIO_CACHE_NAME);
    const requests = await audioCache.keys();
    let totalBytes = 0;
    const cachedSurahs = [];

    for (const req of requests) {
      const match = await audioCache.match(req);
      if (match) {
        const cl = match.headers.get('content-length');
        const size = cl ? parseInt(cl, 10) : 1000000;
        totalBytes += size;

        // Try extracting surah number / qari from URL
        const urlObj = new URL(req.url);
        const targetUrl = urlObj.searchParams.get('url') || req.url;
        const nameParts = targetUrl.split('/');
        const fileName = nameParts[nameParts.length - 1] || 'audio.mp3';
        const qariPart = nameParts[nameParts.length - 2] || 'Qari';

        cachedSurahs.push({
          url: req.url,
          fileName,
          qari: qariPart,
          size,
        });
      }
    }

    return {
      count: requests.length,
      totalBytes,
      cachedSurahs,
    };
  } catch (err) {
    console.warn('[QuotaTracker] Error inspecting cache:', err);
    return { count: 0, totalBytes: 0, cachedSurahs: [] };
  }
}

// Download and permanently store a surah into Cache Storage for offline zero-data playback
export async function saveSurahForOffline(surah, qariKey = '05') {
  if (typeof window === 'undefined') return false;

  try {
    const audioUrl = surah.audioFull?.[qariKey];
    if (!audioUrl) throw new Error('Audio URL not found');

    const proxiedAudio = `/api/audio?url=${encodeURIComponent(audioUrl)}`;

    // 1. Fetch and store audio in Cache Storage
    if ('caches' in window) {
      const cache = await caches.open(AUDIO_CACHE_NAME);
      const res = await fetch(proxiedAudio, {
        method: 'GET',
        headers: { 'Accept': 'audio/*' },
      });

      if (res.ok) {
        await cache.put(new Request(proxiedAudio), res.clone());
        const blob = await res.blob();

        recordQuotaUsage({
          bytes: blob.size,
          category: 'audio',
          name: `Simpan Offline: ${surah.namaLatin} (${surah.nomor})`,
        });
      }
    }

    // 2. Fetch and store surah detail in Cache Storage
    const detailKey = `murotal_cached_surah_detail_v2_${surah.nomor}`;
    const detailRes = await fetch(`https://equran.id/api/v2/surat/${surah.nomor}`);
    if (detailRes.ok) {
      const text = await detailRes.text();
      if ('caches' in window) {
        const apiCache = await caches.open(API_CACHE_NAME);
        await apiCache.put(new Request(detailKey), new Response(text, {
          headers: { 'Content-Type': 'application/json' },
        }));
      }
      try {
        localStorage.setItem(detailKey, text);
      } catch (e) {}
    }

    return true;
  } catch (err) {
    console.error('[QuotaTracker] Failed to save surah offline:', err);
    return false;
  }
}

// Check if a specific audio URL is already in cache
export async function isAudioCached(audioUrl) {
  if (typeof window === 'undefined' || !('caches' in window) || !audioUrl) return false;
  try {
    const cache = await caches.open(AUDIO_CACHE_NAME);
    const proxied = audioUrl.startsWith('/api/audio') ? audioUrl : `/api/audio?url=${encodeURIComponent(audioUrl)}`;
    const match = await cache.match(proxied);
    return !!match;
  } catch (e) {
    return false;
  }
}

// Clear all offline caches (frees storage)
export async function clearAllOfflineCache() {
  if (typeof window === 'undefined') return;

  try {
    if ('caches' in window) {
      await caches.delete(AUDIO_CACHE_NAME);
      await caches.delete(API_CACHE_NAME);
      await caches.delete('murotal-audio-v1');
      await caches.delete('murotal-api-v1');
    }

    // Remove cached surahs from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('murotal_cached_')) {
        localStorage.removeItem(key);
      }
    });

    return true;
  } catch (err) {
    console.error('[QuotaTracker] Failed to clear offline cache:', err);
    return false;
  }
}

// Utility to format bytes human-readably
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
