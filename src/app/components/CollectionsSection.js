'use client';

import { useState, useCallback, useEffect } from 'react';
import { useApp, MUROTAL_EFFECT_PRESETS } from '../context/AppContext';
import { GeometricWatermark, PLACEHOLDER_THEMES } from './PlaceholderCover';

export default function CollectionsSection() {
  const { state, dispatch, playTrack, showToast } = useApp();
  const { surahList, selectedQari, currentTrack, isPlaying } = state;
  const [activeModalKey, setActiveModalKey] = useState(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeModalKey) {
        setActiveModalKey(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalKey]);

  const handlePlayCollection = useCallback((themeKey, e, specificSurahId = null) => {
    e?.stopPropagation();
    const theme = PLACEHOLDER_THEMES[themeKey];
    if (!theme || surahList.length === 0) return;

    // 1. Terapkan Qari yang direkomendasikan
    const qariKey = theme.defaultQari || selectedQari;
    if (theme.defaultQari && theme.defaultQari !== selectedQari) {
      dispatch({ type: 'SET_SELECTED_QARI', payload: theme.defaultQari });
    }

    // 2. Sesuaikan volume murotal sesuai rasio
    if (typeof theme.murotalVolume === 'number') {
      dispatch({ type: 'SET_VOLUME', payload: theme.murotalVolume });
    }

    // 3. Terapkan preset gema murotal optimal
    if (theme.effectPreset) {
      const presetObj = MUROTAL_EFFECT_PRESETS.find(p => p.id === theme.effectPreset);
      if (presetObj) {
        dispatch({ type: 'APPLY_EFFECT_PRESET', payload: presetObj });
      }
      if (!state.epicAmbience) {
        dispatch({ type: 'TOGGLE_EPIC_AMBIENCE' });
      }
    }

    // 4. Konfigurasikan suara alam sesuai rasio
    if (state.ambientSounds) {
      Object.keys(state.ambientSounds).forEach((sId) => {
        if (theme.ambientSound && sId === theme.ambientSound) {
          dispatch({
            type: 'SET_AMBIENT_SOUND',
            payload: { id: sId, active: true, volume: theme.ambientVolume ?? 0.35 },
          });
        } else if (state.ambientSounds[sId]?.active) {
          dispatch({
            type: 'SET_AMBIENT_SOUND',
            payload: { id: sId, active: false, volume: state.ambientSounds[sId].volume },
          });
        }
      });
    }

    // 5. Susun daftar antrean surah terkurasi
    const collectionSurahs = theme.surahIds
      .map(id => surahList.find(s => s.nomor === id))
      .filter(Boolean);

    if (collectionSurahs.length === 0) return;

    const targetSurah = specificSurahId
      ? collectionSurahs.find(s => s.nomor === specificSurahId) || collectionSurahs[0]
      : collectionSurahs[0];

    playTrack({
      surahNumber: targetSurah.nomor,
      surahName: targetSurah.namaLatin,
      surahNameArab: targetSurah.nama,
      qariKey,
      audioUrl: targetSurah.audioFull[qariKey],
      type: 'full',
    });

    const queue = collectionSurahs.map(s => ({
      surahNumber: s.nomor,
      surahName: s.namaLatin,
      surahNameArab: s.nama,
      qariKey,
      audioUrl: s.audioFull[qariKey],
      type: 'full',
    }));
    dispatch({ type: 'SET_QUEUE', payload: queue });

    if (activeModalKey) {
      setActiveModalKey(null);
    }

    showToast?.(`✨ Memutar koleksi ${theme.title} • Qari: ${theme.qariName}`);
  }, [surahList, selectedQari, state.ambientSounds, state.epicAmbience, playTrack, dispatch, showToast, activeModalKey]);

  const collections = [
    { key: 'focus', ...PLACEHOLDER_THEMES.focus },
    { key: 'recitations', ...PLACEHOLDER_THEMES.recitations },
    { key: 'sleep', ...PLACEHOLDER_THEMES.sleep },
    { key: 'ruqia', ...PLACEHOLDER_THEMES.ruqia },
  ];

  const activeTheme = activeModalKey ? PLACEHOLDER_THEMES[activeModalKey] : null;

  return (
    <section className="collections-section">
      <div className="section-header">
        <div>
          <h2 className="section-title collections-title">Koleksi Pilihan</h2>
          <p className="collections-subtitle">Kurasi tematik berdasarkan dalil Nabawi, nilai ketenangan, dan psikoakustik</p>
        </div>
        <span className="collections-see-all">Kurasi Khusus</span>
      </div>

      <div className="collections-grid">
        {collections.map((item) => (
          <div
            key={item.key}
            className={`collection-hero-card ${item.className}`}
            onClick={() => setActiveModalKey(item.key)}
            role="button"
            tabIndex={0}
            aria-label={`Buka panduan dan putar koleksi ${item.title}`}
          >
            {/* Geometric Art Watermark */}
            <div className="collection-watermark-wrapper">
              <GeometricWatermark type={item.key} opacity={0.3} />
            </div>

            {/* Glass Sheen overlay */}
            <div className="collection-glass-sheen" />

            {/* Top Recommended Qari Tag */}
            <div className="collection-top-badge">
              <span className="collection-qari-pill">🎙️ {item.qariName}</span>
            </div>

            {/* Floating Play Button on hover */}
            <button
              className="collection-play-btn"
              onClick={(e) => handlePlayCollection(item.key, e)}
              aria-label={`Putar langsung koleksi ${item.title}`}
              title={`Putar ${item.title} (Preset Optimal)`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z" />
              </svg>
            </button>

            {/* Card Content */}
            <div className="collection-content">
              <h3 className="collection-card-title">{item.title}</h3>
              <p className="collection-card-tagline">{item.subtitle}</p>
              <div className="collection-card-meta">
                <span className="collection-surah-count">📖 {item.surahIds.length} Surah</span>
                <span className="collection-detail-link">Detail & Dalil →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail Kurasi Tematik */}
      {activeModalKey && activeTheme && (
        <div className="modal-overlay" onClick={() => setActiveModalKey(null)}>
          <div
            className="collection-curation-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="collection-modal-title"
          >
            {/* Modal Header */}
            <div className={`collection-modal-header collection-modal-banner-${activeModalKey}`}>
              <div className="collection-modal-watermark">
                <GeometricWatermark type={activeModalKey} opacity={0.35} />
              </div>
              <button
                className="collection-modal-close"
                onClick={() => setActiveModalKey(null)}
                aria-label="Tutup panduan"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <div className="collection-modal-header-content">
                <span className="collection-modal-wave-tag">{activeTheme.targetWave}</span>
                <h2 id="collection-modal-title" className="collection-modal-title">
                  {activeTheme.title}
                </h2>
                <p className="collection-modal-desc">{activeTheme.subtitle}</p>
              </div>
            </div>

            {/* Curated Acoustic & Preset Bar */}
            <div className="collection-curation-specs">
              <div className="curation-spec-item">
                <div className="curation-spec-icon">🎙️</div>
                <div className="curation-spec-info">
                  <div className="curation-spec-label">Qari Rekomendasi</div>
                  <div className="curation-spec-val">Syaikh {activeTheme.qariName}</div>
                  <div className="curation-spec-sub">{activeTheme.qariMaqam}</div>
                </div>
              </div>

              <div className="curation-spec-item">
                <div className="curation-spec-icon">✨</div>
                <div className="curation-spec-info">
                  <div className="curation-spec-label">Gema Murotal</div>
                  <div className="curation-spec-val">Preset: {activeTheme.effectPresetName}</div>
                  <div className="curation-spec-sub">Resonansi & pantulan syahdu</div>
                </div>
              </div>

              <div className="curation-spec-item">
                <div className="curation-spec-icon">🎚️</div>
                <div className="curation-spec-info">
                  <div className="curation-spec-label">Keseimbangan Audio</div>
                  <div className="curation-spec-val">
                    {activeTheme.ambientSound
                      ? `Murotal ${Math.round(activeTheme.murotalVolume * 100)}% • ${activeTheme.ambientSoundName} ${Math.round(activeTheme.ambientVolume * 100)}%`
                      : `Murotal ${Math.round(activeTheme.murotalVolume * 100)}% • Audio Jernih`}
                  </div>
                  <div className="curation-spec-sub">
                    {activeTheme.ambientSound ? 'Suara alam menenangkan' : 'Fokus tilawah tanpa suara alam'}
                  </div>
                </div>
              </div>
            </div>

            {/* Tracklist Kurasi */}
            <div className="collection-tracks-section">
              <div className="collection-tracks-header">
                <h3 className="collection-tracks-title">Daftar Surah & Rujukan Dalil</h3>
                <span className="collection-tracks-count">{activeTheme.tracks.length} Surah Terpilih</span>
              </div>

              <div className="collection-tracks-list">
                {activeTheme.tracks.map((t, idx) => {
                  const surahData = surahList.find(s => s.nomor === t.nomor);
                  const isCurrent = currentTrack?.surahNumber === t.nomor && isPlaying;

                  return (
                    <div
                      key={t.nomor}
                      className={`collection-track-card ${isCurrent ? 'active-track' : ''}`}
                    >
                      <div className="collection-track-left">
                        <span className="collection-track-idx">{idx + 1}</span>
                        <div className="collection-track-info">
                          <div className="collection-track-names">
                            <span className="collection-track-latin">QS. {t.namaLatin}</span>
                            <span className="collection-track-nomor">({t.nomor})</span>
                            {surahData?.nama && (
                              <span className="collection-track-arabic">{surahData.nama}</span>
                            )}
                            <span className={`collection-format-badge ${t.format === 'Surah Utuh' ? 'badge-full' : 'badge-choice'}`}>
                              {t.format}
                            </span>
                          </div>
                          <div className="collection-track-range">
                            <span className="range-icon">📖</span>
                            <span>{t.ayatRange}</span>
                          </div>
                          <p className="collection-track-dalil">{t.dalil}</p>
                        </div>
                      </div>

                      <button
                        className="collection-track-play-btn"
                        onClick={(e) => handlePlayCollection(activeModalKey, e, t.nomor)}
                        title={`Putar ${t.namaLatin}`}
                        aria-label={`Putar ${t.namaLatin}`}
                      >
                        {isCurrent ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"/>
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="collection-modal-footer">
              <button
                className="btn-secondary collection-modal-btn-cancel"
                onClick={() => setActiveModalKey(null)}
              >
                Tutup
              </button>
              <button
                className="btn-primary collection-modal-btn-play"
                onClick={(e) => handlePlayCollection(activeModalKey, e)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z" />
                </svg>
                Putar Koleksi Lengkap (Preset Optimal)
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

