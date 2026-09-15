'use client';

import { useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { fetchAllSurahs } from '../lib/api';
import CollectionsSection from './CollectionsSection';
import { GeometricWatermark } from './PlaceholderCover';

const WATERMARK_TYPES = ['focus', 'recitations', 'sleep', 'ruqia'];
function getWatermarkType(nomor) {
  return WATERMARK_TYPES[(nomor - 1) % WATERMARK_TYPES.length];
}

export default function HomePage() {
  const { state, dispatch, playTrack, getGradient, QARI_MAP } = useApp();
  const { surahList, recentlyPlayed, selectedQari, loading } = state;

  useEffect(() => {
    if (surahList.length === 0) {
      dispatch({ type: 'SET_LOADING', payload: true });
      fetchAllSurahs()
        .then(data => dispatch({ type: 'SET_SURAH_LIST', payload: data }))
        .catch(err => {
          console.error('Failed to fetch surahs:', err);
          dispatch({ type: 'SET_LOADING', payload: false });
        });
    }
  }, [surahList.length, dispatch]);

  const handlePlaySurah = useCallback((surah, e) => {
    e.stopPropagation();
    const audioUrl = surah.audioFull[selectedQari];
    playTrack({
      surahNumber: surah.nomor,
      surahName: surah.namaLatin,
      surahNameArab: surah.nama,
      qariKey: selectedQari,
      audioUrl,
      type: 'full',
    });

    // Build queue from surrounding surahs
    const startIdx = Math.max(0, surah.nomor - 1);
    const queue = surahList.slice(startIdx, startIdx + 20).map(s => ({
      surahNumber: s.nomor,
      surahName: s.namaLatin,
      surahNameArab: s.nama,
      qariKey: selectedQari,
      audioUrl: s.audioFull[selectedQari],
      type: 'full',
    }));
    dispatch({ type: 'SET_QUEUE', payload: queue });
  }, [selectedQari, surahList, playTrack, dispatch]);

  const handleCardClick = useCallback((surah) => {
    dispatch({ type: 'NAVIGATE', payload: { view: 'surah', surahNumber: surah.nomor } });
  }, [dispatch]);

  const handleAddToPlaylist = useCallback((surah, e) => {
    e.stopPropagation();
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
  }, [dispatch]);

  const handleContextMenu = useCallback((e, surah) => {
    e.preventDefault();
    dispatch({
      type: 'SET_CONTEXT_MENU',
      payload: {
        x: e.clientX,
        y: e.clientY,
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
  }, [dispatch]);

  if (loading && surahList.length === 0) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    );
  }

  // Popular surahs
  const popularSurahs = [1, 2, 18, 36, 55, 56, 67, 78, 112, 114]
    .map(n => surahList.find(s => s.nomor === n))
    .filter(Boolean);

  // Short surahs (Juz Amma)
  const juzAmma = surahList.filter(s => s.nomor >= 78);

  // Makkiyah surahs
  const makkiyah = surahList.filter(s => s.tempatTurun === 'Mekah').slice(0, 10);

  return (
    <>
      {/* Brand Hero & Greeting Banner */}
      <div className="home-brand-banner">
        <div className="home-brand-banner-content">
          <div className="home-brand-logo-wrap">
            <img src="/logo.png" alt="Murotalify Logo" className="home-brand-logo-img" />
          </div>
          <div className="home-brand-text-wrap">
            <div className="home-brand-tag">
              <span className="home-brand-tag-dot" />
              <span>Murotalify Platform Resmi</span>
            </div>
            <h1 className="home-brand-title">
              {getGreeting()}
            </h1>
            <p className="home-brand-subtitle">
              Dengarkan lantunan suci Al-Quran 114 surah dipadukan dengan relaksasi suara alam yang menenangkan hati dan pikiran.
            </p>
            <div className="home-brand-actions">
              <button
                className="home-brand-btn-primary"
                onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'landing' } })}
              >
                <img src="/logo.png" alt="Logo" style={{ width: 16, height: 16, borderRadius: 4 }} />
                <span>Pelajari Info & Fitur Web</span>
              </button>
              <button
                className="home-brand-btn-secondary"
                onClick={() => dispatch({ type: 'TOGGLE_AMBIENT' })}
              >
                <span>🌧️ Ambient Nature Mixer</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && (
        <div className="recent-section">
          <div className="recent-grid">
            {recentlyPlayed.slice(0, 6).map((item) => {
              const surah = surahList.find(s => s.nomor === item.nomor);
              if (!surah) return null;
              return (
                <div
                  key={item.nomor}
                  className="recent-card"
                  onClick={() => handleCardClick(surah)}
                >
                  <div className={`recent-card-cover ${getGradient(surah.nomor - 1)}`}>
                    <GeometricWatermark type={getWatermarkType(surah.nomor)} opacity={0.25} />
                    <span className="recent-card-cover-number">{surah.nomor}</span>
                  </div>
                  <div className="recent-card-title">{surah.namaLatin}</div>
                  <button
                    className="recent-card-play"
                    onClick={(e) => handlePlaySurah(surah, e)}
                    aria-label={`Play ${surah.namaLatin}`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Collections Section (Matching user reference) */}
      <CollectionsSection />

      {/* Popular / Surat Pilihan */}
      <div className="section-header">
        <h2 className="section-title">Surat Pilihan</h2>
        <button className="section-link" onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'search' } })}>
          Lihat Semua
        </button>
      </div>
      <div className="surah-grid">
        {popularSurahs.map((surah) => (
          <div
            key={surah.nomor}
            className="surah-card"
            onClick={() => handleCardClick(surah)}
            onContextMenu={(e) => handleContextMenu(e, surah)}
          >
            <div className="surah-card-cover">
              <div className={`surah-card-cover-gradient ${getGradient(surah.nomor - 1)}`}>
                <div className="surah-card-watermark">
                  <GeometricWatermark type={getWatermarkType(surah.nomor)} opacity={0.25} />
                </div>
                <div className="surah-card-number">{surah.nomor}</div>
                <div className="surah-card-arabic">{surah.nama}</div>
              </div>
            </div>
            <div className="surah-card-title">{surah.namaLatin}</div>
            <div className="surah-card-subtitle">{surah.arti} • {surah.jumlahAyat} Ayat</div>

            <div className="surah-card-actions" onClick={(e) => e.stopPropagation()}>
              <button
                className="surah-card-play"
                onClick={(e) => handlePlaySurah(surah, e)}
                aria-label={`Play ${surah.namaLatin}`}
                title="Putar Surat"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z" />
                </svg>
              </button>

              <button
                className="surah-card-add-btn"
                onClick={(e) => handleAddToPlaylist(surah, e)}
                aria-label={`Tambah ${surah.namaLatin} ke playlist`}
                title="Tambah ke Playlist"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Juz Amma */}
      <div className="section-header">
        <h2 className="section-title">Juz Amma</h2>
      </div>
      <div className="surah-grid">
        {juzAmma.map((surah) => (
          <div
            key={surah.nomor}
            className="surah-card"
            onClick={() => handleCardClick(surah)}
            onContextMenu={(e) => handleContextMenu(e, surah)}
          >
            <div className="surah-card-cover">
              <div className={`surah-card-cover-gradient ${getGradient(surah.nomor - 1)}`}>
                <div className="surah-card-watermark">
                  <GeometricWatermark type={getWatermarkType(surah.nomor)} opacity={0.25} />
                </div>
                <div className="surah-card-number">{surah.nomor}</div>
                <div className="surah-card-arabic">{surah.nama}</div>
              </div>
            </div>
            <div className="surah-card-title">{surah.namaLatin}</div>
            <div className="surah-card-subtitle">{surah.arti} • {surah.jumlahAyat} Ayat</div>

            <div className="surah-card-actions" onClick={(e) => e.stopPropagation()}>
              <button
                className="surah-card-play"
                onClick={(e) => handlePlaySurah(surah, e)}
                aria-label={`Play ${surah.namaLatin}`}
                title="Putar Surat"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z" />
                </svg>
              </button>

              <button
                className="surah-card-add-btn"
                onClick={(e) => handleAddToPlaylist(surah, e)}
                aria-label={`Tambah ${surah.namaLatin} ke playlist`}
                title="Tambah ke Playlist"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Surat Makkiyah */}
      <div className="section-header">
        <h2 className="section-title">Surat Makkiyah</h2>
      </div>
      <div className="surah-grid">
        {makkiyah.map((surah) => (
          <div
            key={surah.nomor}
            className="surah-card"
            onClick={() => handleCardClick(surah)}
            onContextMenu={(e) => handleContextMenu(e, surah)}
          >
            <div className="surah-card-cover">
              <div className={`surah-card-cover-gradient ${getGradient(surah.nomor - 1)}`}>
                <div className="surah-card-watermark">
                  <GeometricWatermark type={getWatermarkType(surah.nomor)} opacity={0.25} />
                </div>
                <div className="surah-card-number">{surah.nomor}</div>
                <div className="surah-card-arabic">{surah.nama}</div>
              </div>
            </div>
            <div className="surah-card-title">{surah.namaLatin}</div>
            <div className="surah-card-subtitle">{surah.arti} • {surah.jumlahAyat} Ayat</div>

            <div className="surah-card-actions" onClick={(e) => e.stopPropagation()}>
              <button
                className="surah-card-play"
                onClick={(e) => handlePlaySurah(surah, e)}
                aria-label={`Play ${surah.namaLatin}`}
                title="Putar Surat"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z" />
                </svg>
              </button>

              <button
                className="surah-card-add-btn"
                onClick={(e) => handleAddToPlaylist(surah, e)}
                aria-label={`Tambah ${surah.namaLatin} ke playlist`}
                title="Tambah ke Playlist"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Selamat Pagi 🌅';
  if (hour < 15) return 'Selamat Siang ☀️';
  if (hour < 18) return 'Selamat Sore 🌇';
  return 'Selamat Malam 🌙';
}
