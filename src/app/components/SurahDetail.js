'use client';

import { useEffect, useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { fetchSurahDetail } from '../lib/api';
import { saveSurahForOffline, isAudioCached } from '../lib/quotaTracker';
import { GeometricWatermark } from './PlaceholderCover';

const WATERMARK_TYPES = ['focus', 'recitations', 'sleep', 'ruqia'];
function getWatermarkType(nomor) {
  return WATERMARK_TYPES[(nomor - 1) % WATERMARK_TYPES.length];
}

export default function SurahDetail() {
  const { state, dispatch, playTrack, togglePlay, getGradient, QARI_MAP } = useApp();
  const { currentSurahNumber, selectedQari, currentTrack, isPlaying, surahList } = state;
  const [surahData, setSurahData] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!surahData || !selectedQari) return;
    const url = surahData.audioFull?.[selectedQari];
    isAudioCached(url).then(cached => setIsCached(cached));
  }, [surahData, selectedQari]);

  const handleSaveOffline = async () => {
    if (!surahData || downloading) return;
    setDownloading(true);
    dispatch({ type: 'SET_TOAST', payload: `⏳ Mengunduh audio & teks ${surahData.namaLatin} ke memori...` });
    const success = await saveSurahForOffline(surahData, selectedQari);
    setDownloading(false);
    if (success) {
      setIsCached(true);
      dispatch({ type: 'SET_TOAST', payload: `✓ ${surahData.namaLatin} tersimpan offline! Diputar tanpa kuota.` });
      setTimeout(() => dispatch({ type: 'SET_TOAST', payload: null }), 3500);
    } else {
      dispatch({ type: 'SET_TOAST', payload: `Gagal mengunduh audio. Periksa koneksi internet.` });
      setTimeout(() => dispatch({ type: 'SET_TOAST', payload: null }), 3000);
    }
  };

  useEffect(() => {
    if (!currentSurahNumber) return;
    let ignore = false;
    fetchSurahDetail(currentSurahNumber)
      .then(data => {
        if (!ignore) {
          setSurahData(data);
          setFetchError(false);
        }
      })
      .catch(err => {
        if (!ignore) {
          console.error('Failed to fetch surah detail:', err);
          setFetchError(true);
        }
      });
    return () => { ignore = true; };
  }, [currentSurahNumber]);

  const loading = !fetchError && (!surahData || surahData.nomor !== currentSurahNumber);

  const handlePlayFull = useCallback(() => {
    if (!surahData) return;
    const isThisSurahPlaying = currentTrack?.surahNumber === surahData.nomor
      && currentTrack?.type === 'full'
      && isPlaying;

    if (isThisSurahPlaying) {
      togglePlay();
      return;
    }

    const audioUrl = surahData.audioFull[selectedQari];
    playTrack({
      surahNumber: surahData.nomor,
      surahName: surahData.namaLatin,
      surahNameArab: surahData.nama,
      qariKey: selectedQari,
      audioUrl,
      type: 'full',
    });

    // Build queue from all surahs starting from this one
    const startIdx = Math.max(0, surahData.nomor - 1);
    const queue = surahList.slice(startIdx).map(s => ({
      surahNumber: s.nomor,
      surahName: s.namaLatin,
      surahNameArab: s.nama,
      qariKey: selectedQari,
      audioUrl: s.audioFull[selectedQari],
      type: 'full',
    }));
    dispatch({ type: 'SET_QUEUE', payload: queue });
  }, [surahData, selectedQari, surahList, playTrack, dispatch, currentTrack, isPlaying, togglePlay]);

  const handlePlayAyat = useCallback((ayat) => {
    if (!surahData) return;
    const isThisAyatPlaying = currentTrack?.surahNumber === surahData.nomor
      && currentTrack?.ayatNumber === ayat.nomorAyat
      && currentTrack?.type === 'ayat'
      && isPlaying;

    if (isThisAyatPlaying) {
      togglePlay();
      return;
    }

    const audioUrl = ayat.audio[selectedQari];
    playTrack({
      surahNumber: surahData.nomor,
      surahName: surahData.namaLatin,
      surahNameArab: surahData.nama,
      qariKey: selectedQari,
      audioUrl,
      type: 'ayat',
      ayatNumber: ayat.nomorAyat,
    });

    // Build queue from ayat
    const queue = surahData.ayat.slice(ayat.nomorAyat - 1).map(a => ({
      surahNumber: surahData.nomor,
      surahName: surahData.namaLatin,
      surahNameArab: surahData.nama,
      qariKey: selectedQari,
      audioUrl: a.audio[selectedQari],
      type: 'ayat',
      ayatNumber: a.nomorAyat,
    }));
    dispatch({ type: 'SET_QUEUE', payload: queue });
  }, [surahData, selectedQari, playTrack, dispatch, currentTrack, isPlaying, togglePlay]);

  const handleAddToPlaylist = useCallback((playlistId) => {
    if (!surahData) return;
    const surah = surahList.find(s => s.nomor === surahData.nomor);
    if (!surah) return;
    dispatch({
      type: 'ADD_TO_PLAYLIST',
      payload: {
        playlistId,
        surah: {
          nomor: surah.nomor,
          nama: surah.nama,
          namaLatin: surah.namaLatin,
          jumlahAyat: surah.jumlahAyat,
          arti: surah.arti,
          audioFull: surah.audioFull,
        },
      },
    });
    dispatch({ type: 'SET_TOAST', payload: `Ditambahkan ke daftar putar` });
    setTimeout(() => dispatch({ type: 'SET_TOAST', payload: null }), 3000);
  }, [surahData, surahList, dispatch]);

  if (loading) {
    return (
      <div className="surah-detail-loading-wrapper">
        <div className="surah-loading-banner">
          <div className="surah-loading-spinner" />
          <div className="surah-loading-info">
            <h3 className="surah-loading-title">Sedang Mengambil Teks & Audio Surat...</h3>
            <p className="surah-loading-desc">Memuat ayat-ayat mushaf Arab, transliterasi Latin, terjemahan resmi Kemenag, dan link audio qari.</p>
          </div>
        </div>

        {/* Skeleton Detail Header */}
        <div className="skeleton-surah-header">
          <div className="skeleton-surah-cover shimmer" />
          <div className="skeleton-surah-meta">
            <div className="skeleton-line shimmer" style={{ width: '25%', height: 16 }} />
            <div className="skeleton-line shimmer" style={{ width: '50%', height: 36, margin: '8px 0' }} />
            <div className="skeleton-line shimmer" style={{ width: '40%', height: 16 }} />
          </div>
        </div>

        {/* Skeleton Ayat Items */}
        <div className="skeleton-ayat-list">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton-ayat-card shimmer">
              <div className="skeleton-line" style={{ width: '32px', height: 24, borderRadius: '50%' }} />
              <div className="skeleton-line" style={{ width: '80%', height: 26, marginLeft: 'auto', margin: '10px 0' }} />
              <div className="skeleton-line" style={{ width: '65%', height: 14 }} />
              <div className="skeleton-line" style={{ width: '90%', height: 14, marginTop: 4 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (fetchError || !surahData) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon" style={{ fontSize: 44, marginBottom: 12 }}>⚠️</div>
        <div className="empty-state-title">Gagal Mengambil Data Surat</div>
        <p className="empty-state-desc" style={{ color: 'var(--text-secondary)', maxWidth: 420, margin: '8px auto 20px', lineHeight: 1.5 }}>
          Tidak dapat memuat ayat surah. Pastikan koneksi internet aktif atau coba muat ulang halaman.
        </p>
        <button
          className="home-brand-btn-primary"
          onClick={() => {
            setFetchError(false);
            setSurahData(null);
            fetchSurahDetail(currentSurahNumber).then(setSurahData).catch(() => setFetchError(true));
          }}
        >
          Coba Muat Ulang
        </button>
      </div>
    );
  }

  const isCurrentSurahPlaying = currentTrack?.surahNumber === surahData.nomor && isPlaying;

  return (
    <>
      {/* Header */}
      <div className="surah-detail-header">
        <div className={`surah-detail-cover ${getGradient(surahData.nomor - 1)}`}>
          <div className="surah-card-watermark">
            <GeometricWatermark type={getWatermarkType(surahData.nomor)} opacity={0.3} />
          </div>
          <div className="surah-card-number" style={{ fontSize: 72 }}>{surahData.nomor}</div>
          <div className="surah-card-arabic" style={{ fontSize: 32 }}>{surahData.nama}</div>
        </div>
        <div className="surah-detail-info">
          <div className="surah-detail-type">Surat • {surahData.tempatTurun}</div>
          <h1 className="surah-detail-title">{surahData.namaLatin}</h1>
          <div className="surah-detail-meta">
            <span>{surahData.arti}</span> • {surahData.jumlahAyat} Ayat • {QARI_MAP[selectedQari]}
          </div>
        </div>
      </div>

      {/* Data Saver Notice */}
      {state.dataSaver && (
        <div className="surah-datasaver-bar">
          <span className="datasaver-pill">⚡ Mode Hemat Kuota</span>
          <span className="datasaver-text">
            {isCached ? '✓ Surah ini tersimpan di memori perangkat (0 KB kuota internet)!' : 'Simpan Offline saat ada WiFi atau putar per-ayat untuk menghemat hingga 90% kuota.'}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="surah-detail-actions">
        <button className="play-btn-large" onClick={handlePlayFull}>
          {isCurrentSurahPlaying && currentTrack?.type === 'full' ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z" />
            </svg>
          )}
        </button>

        {/* Save Offline (Hemat Kuota) button */}
        <button
          className={`action-pill-btn surah-offline-btn ${isCached ? 'is-cached' : ''}`}
          onClick={handleSaveOffline}
          disabled={downloading}
          title={isCached ? 'Surah sudah tersimpan di cache offline (0 KB kuota)' : 'Simpan surah ke memori lokal untuk hemat kuota'}
        >
          {isCached ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Tersimpan Offline</span>
            </>
          ) : downloading ? (
            <>
              <span className="spinner-mini" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Simpan Offline</span>
            </>
          )}
        </button>

        {/* Add to playlist button */}
        <button
          className="action-pill-btn surah-add-playlist-btn"
          onClick={() => {
            const surah = surahList.find(s => s.nomor === surahData.nomor) || surahData;
            dispatch({
              type: 'OPEN_ADD_TO_PLAYLIST',
              payload: {
                nomor: surah.nomor,
                nama: surah.nama,
                namaLatin: surah.namaLatin,
                jumlahAyat: surah.jumlahAyat,
                arti: surah.arti,
                audioFull: surah.audioFull,
              },
            });
          }}
          title="Tambah Surat Ini ke Daftar Putar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Tambah ke Daftar Putar</span>
        </button>
      </div>

      {/* Ayat List Table Header */}
      <div className="ayat-list-header">
        <span className="ayat-col-num">#</span>
        <span className="ayat-col-title">Ayat &amp; Terjemahan</span>
        <span className="ayat-col-action">Putar</span>
      </div>

      {surahData.ayat.map((ayat) => {
        const isAyatPlaying = currentTrack?.surahNumber === surahData.nomor
          && currentTrack?.ayatNumber === ayat.nomorAyat
          && currentTrack?.type === 'ayat'
          && isPlaying;

        return (
          <div
            key={ayat.nomorAyat}
            className={`ayat-item ${isAyatPlaying ? 'playing' : ''}`}
            onClick={() => handlePlayAyat(ayat)}
          >
            <div className="ayat-number">
              {isAyatPlaying ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--accent-green)">
                  <path d="M1 7.5v4h2v-4H1zm4-3v7h2v-7H5zm4-3v10h2V1.5H9z"/>
                </svg>
              ) : (
                ayat.nomorAyat
              )}
            </div>
            <div className="ayat-text-content">
              <div className="ayat-text-arab">{ayat.teksArab}</div>
              <div className="ayat-text-latin">{ayat.teksLatin}</div>
              <div className="ayat-text-translation">{ayat.teksIndonesia}</div>
            </div>
            <div className="ayat-duration">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--text-secondary)" style={{ opacity: 0.5 }}>
                <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z"/>
                <path d="M8 3.25a.75.75 0 01.75.75v3.25H11a.75.75 0 010 1.5H7.25V4A.75.75 0 018 3.25z"/>
              </svg>
            </div>
          </div>
        );
      })}
    </>
  );
}
