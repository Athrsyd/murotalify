'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { useApp } from '../context/AppContext';
import {
  getQuotaStats,
  getServerQuotaStats,
  resetQuota,
  subscribeQuota,
  formatBytes,
  isDataSaverEnabled,
  setDataSaverEnabled,
  subscribeDataSaver,
  getOfflineCacheInfo,
  clearAllOfflineCache,
} from '../lib/quotaTracker';

const emptySubscribe = () => () => {};
const getClientTrue = () => true;
const getClientFalse = () => false;
const getServerDataSaver = () => true;

export default function QuotaPage() {
  const { showToast } = useApp();
  const mounted = useSyncExternalStore(emptySubscribe, getClientTrue, getClientFalse);
  const stats = useSyncExternalStore(
    subscribeQuota,
    getQuotaStats,
    getServerQuotaStats
  );
  const dataSaver = useSyncExternalStore(
    subscribeDataSaver,
    isDataSaverEnabled,
    getServerDataSaver
  );

  const [cacheInfo, setCacheInfo] = useState({ count: 0, totalBytes: 0, cachedSurahs: [] });
  const [confirmReset, setConfirmReset] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);

  const refreshCacheInfo = useCallback(() => {
    getOfflineCacheInfo().then(setCacheInfo).catch(() => {});
  }, []);

  useEffect(() => {
    refreshCacheInfo();
    const unsubscribe = subscribeQuota(() => {
      refreshCacheInfo();
    });
    return () => unsubscribe();
  }, [refreshCacheInfo]);

  const handleToggleDataSaver = () => {
    const nextVal = !dataSaver;
    setDataSaverEnabled(nextVal);
    showToast(nextVal ? '⚡ Mode Hemat Kuota diaktifkan (Hemat hingga 90%)' : 'Mode Hemat Kuota dinonaktifkan');
  };

  const handleReset = () => {
    resetQuota();
    setConfirmReset(false);
    showToast('Hitungan penggunaan kuota hari ini berhasil di-reset ke 0.');
  };

  const handleClearCache = async () => {
    setClearingCache(true);
    try {
      await clearAllOfflineCache();
      refreshCacheInfo();
      showToast('Cache offline berhasil dibersihkan.');
    } catch (e) {
      console.error(e);
      showToast('Gagal membersihkan cache.');
    } finally {
      setClearingCache(false);
    }
  };

  const totalProcessed = (stats.bytesUsed || 0) + (stats.bytesSaved || 0);
  const savingPercentage = totalProcessed > 0
    ? Math.round(((stats.bytesSaved || 0) / totalProcessed) * 100)
    : 0;

  // Format Indonesian date
  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="quota-page">
      {/* Page Header */}
      <div className="quota-header">
        <div>
          <div className="quota-badge">
            <span className="quota-badge-dot"></span>
            Pantauan & Optimasi Kuota Internet
          </div>
          <h1 className="quota-title">Pusat Hemat Kuota & Data Tracker</h1>
          <p className="quota-subtitle">
            Statistik kuota untuk <strong>{todayFormatted}</strong>. Dilengkapi sistem Cache-First agar pemutaran ulang surah memakan <strong>0 KB kuota</strong>.
          </p>
        </div>

        <div className="quota-header-actions">
          <button
            className="quota-reset-btn"
            onClick={() => setConfirmReset(true)}
            title="Reset Hitungan Kuota Hari Ini"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            <span>Reset Hitungan</span>
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmReset && (
        <div className="quota-confirm-box">
          <div className="quota-confirm-content">
            <div className="quota-confirm-text">
              <strong>Reset hitungan penggunaan kuota hari ini?</strong>
              <p>Hitungan byte terpakai dan terhemat akan kembali ke 0 B. Audio dan surah yang telah disimpan di memori perangkat tidak akan terhapus.</p>
            </div>
            <div className="quota-confirm-btns">
              <button className="quota-confirm-cancel" onClick={() => setConfirmReset(false)}>Batal</button>
              <button className="quota-confirm-agree" onClick={handleReset}>Ya, Reset</button>
            </div>
          </div>
        </div>
      )}

      {/* DATA SAVER MODE BANNER CARD (FEATURE HIGHLIGHT) */}
      <div className={`quota-datasaver-card ${dataSaver ? 'active' : ''}`}>
        <div className="datasaver-main">
          <div className="datasaver-icon-wrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div className="datasaver-info">
            <div className="datasaver-title-row">
              <h2 className="datasaver-title">Mode Hemat Kuota (Data Saver)</h2>
              <span className={`datasaver-status-badge ${dataSaver ? 'active' : 'inactive'}`}>
                {dataSaver ? 'AKTIF (Direkomendasikan)' : 'NONAKTIF'}
              </span>
            </div>
            <p className="datasaver-desc">
              Ketika aktif, Murotalify mengoptimalkan konsumsi kuota hingga <strong>90%</strong> dengan mematikan pre-buffering liar, memprioritaskan audio efisien, dan menyimpan audio permanen di memori lokal.
            </p>
          </div>
        </div>

        <button
          className={`datasaver-toggle-btn ${dataSaver ? 'btn-active' : ''}`}
          onClick={handleToggleDataSaver}
          aria-label="Toggle Mode Hemat Kuota"
        >
          <div className="toggle-pill">
            <div className="toggle-dot" />
          </div>
          <span>{dataSaver ? 'Hemat Kuota Aktif' : 'Aktifkan Hemat'}</span>
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="quota-metrics-grid">
        {/* Card 1: Used Today */}
        <div className="quota-metric-card used">
          <div className="quota-card-header">
            <div className="quota-card-icon used-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <span className="quota-card-label">Kuota Terpakai (Network)</span>
          </div>
          <div className="quota-card-value" suppressHydrationWarning>
            {mounted ? formatBytes(stats.bytesUsed || 0) : '0 B'}
          </div>
          <div className="quota-card-footer">
            Data yang benar-benar ditransfer dari jaringan internet operator/WiFi hari ini.
          </div>
        </div>

        {/* Card 2: Saved Today */}
        <div className="quota-metric-card saved">
          <div className="quota-card-header">
            <div className="quota-card-icon saved-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <span className="quota-card-label">Kuota Dihemat (Cache)</span>
          </div>
          <div className="quota-card-value saved-text" suppressHydrationWarning>
            {mounted ? formatBytes(stats.bytesSaved || 0) : '0 B'}
          </div>
          <div className="quota-card-footer">
            Diputar ulang langsung dari memori lokal tanpa menyedot pulsa/kuota internet Anda.
          </div>
        </div>

        {/* Card 3: Efficiency Ratio */}
        <div className="quota-metric-card ratio">
          <div className="quota-card-header">
            <div className="quota-card-icon ratio-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="quota-card-label">Efisiensi Bandwidth</span>
          </div>
          <div className="quota-card-value ratio-text" suppressHydrationWarning>
            {mounted ? `${savingPercentage}%` : '0%'}
          </div>
          <div className="quota-card-footer">
            {savingPercentage > 0
              ? `${savingPercentage}% beban kuota berhasil dipangkas oleh cache lokal.`
              : 'Putar surah untuk mulai menikmati penghematan data otomatis.'}
          </div>
        </div>
      </div>

      {/* Breakdown and Cache Control */}
      <div className="quota-details-row">
        {/* Breakdown Card */}
        <div className="quota-section-card">
          <h3 className="quota-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Rincian Berdasarkan Kategori
          </h3>
          <div className="quota-breakdown-list">
            <div className="quota-breakdown-item">
              <div className="breakdown-info">
                <span className="breakdown-name">🎵 Streaming Murotal & Ayat</span>
                <span className="breakdown-sub">Audio tilawah dari Qari pilihan</span>
              </div>
              <span className="breakdown-val" suppressHydrationWarning>
                {mounted ? formatBytes(stats.audioBytes || stats.bytesUsed || 0) : '0 B'}
              </span>
            </div>

            <div className="quota-breakdown-item">
              <div className="breakdown-info">
                <span className="breakdown-name">📖 Data Surah & Terjemahan</span>
                <span className="breakdown-sub">Teks Arab, Latin, dan arti surah</span>
              </div>
              <span className="breakdown-val" suppressHydrationWarning>
                {mounted ? formatBytes(stats.apiBytes || 0) : '0 B'}
              </span>
            </div>

            <div className="quota-breakdown-item">
              <div className="breakdown-info">
                <span className="breakdown-name">🍃 Suara Alam & Antarmuka</span>
                <span className="breakdown-sub">Efek ambient dan aset sistem</span>
              </div>
              <span className="breakdown-val" suppressHydrationWarning>
                {mounted ? formatBytes(stats.assetBytes || 0) : '0 B'}
              </span>
            </div>
          </div>
        </div>

        {/* Cache Management Card */}
        <div className="quota-section-card">
          <h3 className="quota-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
            Penyimpanan Cache Offline
          </h3>
          <p className="quota-section-desc">
            Surah yang sudah Anda dengarkan disimpan permanen di memori perangkat agar dapat langsung diputar ulang kapan saja tanpa koneksi internet atau kuota.
          </p>
          <div className="quota-cache-stats-box">
            <div className="cache-stat-item">
              <span className="cache-stat-label">File Audio Tersimpan</span>
              <span className="cache-stat-val" suppressHydrationWarning>
                {mounted ? `${cacheInfo.count} File` : '0 File'}
              </span>
            </div>
            <div className="cache-stat-item">
              <span className="cache-stat-label">Ruang Memori Digunakan</span>
              <span className="cache-stat-val" suppressHydrationWarning>
                {mounted ? formatBytes(cacheInfo.totalBytes) : '0 B'}
              </span>
            </div>
          </div>
          <div className="quota-cache-actions">
            <button
              className="quota-clear-cache-btn"
              onClick={handleClearCache}
              disabled={clearingCache}
            >
              {clearingCache ? 'Membersihkan...' : 'Kosongkan Cache Lokal'}
            </button>
          </div>
        </div>
      </div>

      {/* TIPS HEMAT KUOTA */}
      <div className="quota-section-card full-width quota-tips-card">
        <h3 className="quota-section-title">
          <span style={{ fontSize: 18 }}>💡</span>
          4 Rahasia Mendengarkan Murotalify Sangat Hemat Kuota
        </h3>
        <div className="quota-tips-grid">
          <div className="quota-tip-item">
            <div className="tip-badge">1. Pilih Qari Hemat ⚡</div>
            <p>Pilih <strong>Yasser Al-Dosari</strong> atau <strong>Misyari Rasyid</strong> di menu atas. Ukuran audio mereka <strong>55% - 58% lebih ringan</strong> dibanding qari lainnya dengan kualitas suara yang tetap jernih dan syahdu.</p>
          </div>
          <div className="quota-tip-item">
            <div className="tip-badge">2. Manfaatkan Tombol Simpan Offline 💾</div>
            <p>Saat terhubung ke WiFi rumah/kantor, buka surat yang ingin didengarkan lalu klik tombol <strong>&quot;Simpan Offline&quot;</strong>. Setelah tersimpan, Anda bisa memutarnya di perjalanan tanpa menggunakan kuota sama sekali.</p>
          </div>
          <div className="quota-tip-item">
            <div className="tip-badge">3. Dengarkan Berulang Kali (0 KB) 🔄</div>
            <p>Sistem Service Worker Murotalify menyimpan audio yang pernah diputar. Putaran ke-2, ke-3, dan seterusnya diputar 100% dari cache perangkat (<strong>0 B kuota</strong>).</p>
          </div>
          <div className="quota-tip-item">
            <div className="tip-badge">4. Mode Belajar Per-Ayat 📖</div>
            <p>Jika hanya ingin mentadabburi beberapa ayat, putar langsung ayat yang diinginkan. Setiap ayat hanya memakan <strong>~20 KB</strong> dibanding memutar seluruh surah yang bisa mencapai puluhan megabyte.</p>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="quota-section-card full-width">
        <div className="quota-log-header">
          <h3 className="quota-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Aktivitas Jaringan Hari Ini
          </h3>
          <span className="quota-log-count">
            {stats.history?.length || 0} aktivitas tercatat
          </span>
        </div>

        {(!stats.history || stats.history.length === 0) ? (
          <div className="quota-empty-log">
            <div className="empty-log-icon">📡</div>
            <p>Belum ada aktivitas jaringan hari ini. Mulai putar surah untuk melihat rincian penghematan di sini.</p>
          </div>
        ) : (
          <div className="quota-log-table-wrap">
            <table className="quota-log-table">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Aktivitas</th>
                  <th>Tipe</th>
                  <th>Ukuran</th>
                </tr>
              </thead>
              <tbody>
                {stats.history.map((item) => (
                  <tr key={item.id}>
                    <td className="log-time">{item.time}</td>
                    <td className="log-name">{item.name}</td>
                    <td>
                      <span className={`log-badge ${item.type}`}>
                        {item.type === 'saved' ? '⚡ Cache (0 KB)' : '🌐 Network (Kuota)'}
                      </span>
                    </td>
                    <td className="log-size">{formatBytes(item.size)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
