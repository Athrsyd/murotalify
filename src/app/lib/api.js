import { recordQuotaUsage, recordQuotaSaved } from './quotaTracker';

const API_BASE = 'https://equran.id/api/v2';
const SURAH_LIST_CACHE_KEY = 'murotal_cached_surahs_v2';
const SURAH_DETAIL_CACHE_PREFIX = 'murotal_cached_surah_detail_v2_';

/**
 * Fetch list of all 114 surahs with Cache-First strategy.
 */
export async function fetchAllSurahs() {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(SURAH_LIST_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Record saved bytes (estimated ~120 KB)
          recordQuotaSaved({
            bytes: new Blob([cached]).size,
            category: 'api',
            name: 'Daftar Surah (Lokal)',
          });
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Cache read error:', e);
    }
  }

  // Fetch from network
  const url = `${API_BASE}/surat`;
  const res = await fetch(url);
  const text = await res.text();
  const byteSize = new Blob([text]).size;

  recordQuotaUsage({
    bytes: byteSize,
    category: 'api',
    name: 'Unduh Daftar 114 Surah',
  });

  const json = JSON.parse(text);
  if (json.code === 200) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SURAH_LIST_CACHE_KEY, JSON.stringify(json.data));
      } catch (e) {
        console.warn('Cache write failed:', e);
      }
    }
    return json.data;
  }
  throw new Error(json.message || 'Failed to fetch surahs');
}

/**
 * Fetch detail of a surah (arabic verses, latin, audio, translation) with Cache-First strategy.
 */
export async function fetchSurahDetail(nomor) {
  const cacheKey = `${SURAH_DETAIL_CACHE_PREFIX}${nomor}`;

  // 1. Try Cache Storage first (handles large payloads up to hundreds of MBs seamlessly)
  if (typeof window !== 'undefined' && 'caches' in window) {
    try {
      const cache = await caches.open('murotal-api-cache');
      const cachedRes = await cache.match(cacheKey);
      if (cachedRes) {
        const text = await cachedRes.text();
        const json = JSON.parse(text);
        const byteSize = new Blob([text]).size;

        recordQuotaSaved({
          bytes: byteSize,
          category: 'api',
          name: `Detail Surah #${nomor} (Lokal)`,
        });

        if (json.code === 200) return json.data;
      }
    } catch (e) {
      console.warn('Cache Storage match error:', e);
    }
  }

  // 2. Fallback to localStorage check
  if (typeof window !== 'undefined') {
    try {
      const localCached = localStorage.getItem(cacheKey);
      if (localCached) {
        const json = JSON.parse(localCached);
        recordQuotaSaved({
          bytes: new Blob([localCached]).size,
          category: 'api',
          name: `Detail Surah #${nomor} (Lokal)`,
        });
        if (json.code === 200) return json.data;
      }
    } catch (e) {}
  }

  // 3. Fetch from network
  const url = `${API_BASE}/surat/${nomor}`;
  const res = await fetch(url);
  const text = await res.text();
  const byteSize = new Blob([text]).size;

  recordQuotaUsage({
    bytes: byteSize,
    category: 'api',
    name: `Unduh Detail Surah #${nomor}`,
  });

  const json = JSON.parse(text);
  if (json.code === 200) {
    // Save to Cache Storage or LocalStorage
    if (typeof window !== 'undefined' && 'caches' in window) {
      try {
        const cache = await caches.open('murotal-api-cache');
        await cache.put(cacheKey, new Response(text, {
          headers: { 'Content-Type': 'application/json' }
        }));
      } catch (e) {
        try {
          localStorage.setItem(cacheKey, text);
        } catch (le) {}
      }
    } else if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(cacheKey, text);
      } catch (e) {}
    }
    return json.data;
  }
  throw new Error(json.message || 'Failed to fetch surah detail');
}
