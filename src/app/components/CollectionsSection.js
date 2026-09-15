'use client';

import { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { GeometricWatermark, PLACEHOLDER_THEMES } from './PlaceholderCover';

export default function CollectionsSection() {
  const { state, dispatch, playTrack, showToast } = useApp();
  const { surahList, selectedQari } = state;

  const handlePlayCollection = useCallback((themeKey, e) => {
    e?.stopPropagation();
    const theme = PLACEHOLDER_THEMES[themeKey];
    if (!theme || surahList.length === 0) return;

    // Find the surahs in this collection
    const collectionSurahs = theme.surahIds
      .map(id => surahList.find(s => s.nomor === id))
      .filter(Boolean);

    if (collectionSurahs.length === 0) return;

    // First track
    const first = collectionSurahs[0];
    playTrack({
      surahNumber: first.nomor,
      surahName: first.namaLatin,
      surahNameArab: first.nama,
      qariKey: selectedQari,
      audioUrl: first.audioFull[selectedQari],
      type: 'full',
    });

    // Build queue
    const queue = collectionSurahs.map(s => ({
      surahNumber: s.nomor,
      surahName: s.namaLatin,
      surahNameArab: s.nama,
      qariKey: selectedQari,
      audioUrl: s.audioFull[selectedQari],
      type: 'full',
    }));
    dispatch({ type: 'SET_QUEUE', payload: queue });

    // Auto-enable corresponding ambient sound if defined
    if (theme.ambientSound) {
      dispatch({
        type: 'SET_AMBIENT_SOUND',
        payload: { id: theme.ambientSound, active: true, volume: 0.5 },
      });
      showToast?.(`Memutar koleksi ${theme.title} + Suara Ambient`);
    } else {
      showToast?.(`Memutar koleksi ${theme.title}`);
    }
  }, [surahList, selectedQari, playTrack, dispatch, showToast]);

  const collections = [
    { key: 'focus', ...PLACEHOLDER_THEMES.focus },
    { key: 'recitations', ...PLACEHOLDER_THEMES.recitations },
    { key: 'sleep', ...PLACEHOLDER_THEMES.sleep },
    { key: 'ruqia', ...PLACEHOLDER_THEMES.ruqia },
  ];

  return (
    <section className="collections-section">
      <div className="section-header">
        <h2 className="section-title collections-title">Collections</h2>
        <span className="collections-see-all">Pilihan Spesial</span>
      </div>

      <div className="collections-grid">
        {collections.map((item) => (
          <div
            key={item.key}
            className={`collection-hero-card ${item.className}`}
            onClick={() => handlePlayCollection(item.key)}
            role="button"
            tabIndex={0}
            aria-label={`Play collection ${item.title}`}
          >
            {/* Geometric Art Watermark */}
            <div className="collection-watermark-wrapper">
              <GeometricWatermark type={item.key} opacity={0.3} />
            </div>

            {/* Glass Sheen overlay */}
            <div className="collection-glass-sheen" />

            {/* Floating Play Button on hover */}
            <button
              className="collection-play-btn"
              onClick={(e) => handlePlayCollection(item.key, e)}
              aria-label={`Play ${item.title}`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z" />
              </svg>
            </button>

            {/* Title bottom left */}
            <div className="collection-content">
              <h3 className="collection-card-title">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
