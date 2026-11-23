'use client';

import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { getAmbientCacheStatus, cacheAllAmbientSounds, formatBytes } from '../lib/quotaTracker';

export default function AmbientMixer() {
  const { state, dispatch, showToast, AMBIENT_SOUNDS, AMBIENT_PRESETS } = useApp();
  const { ambientOpen, ambientSounds, activePreset } = state;
  const [cacheStatus, setCacheStatus] = useState({ total: 5, cached: 0, isAllCached: false, totalBytes: 0 });
  const [caching, setCaching] = useState(false);

  useEffect(() => {
    if (!ambientOpen) return;
    let ignore = false;
    getAmbientCacheStatus()
      .then((status) => {
        if (!ignore) {
          setCacheStatus(status);
        }
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [ambientOpen]);

  const handleCacheAll = async () => {
    if (caching) return;
    setCaching(true);
    showToast?.('⏳ Menyimpan semua suara alam ke memori cache offline...');
    const result = await cacheAllAmbientSounds();
    setCaching(false);
    if (result.success) {
      const status = await getAmbientCacheStatus();
      setCacheStatus(status);
      showToast?.('✓ Semua 5 suara alam berhasil disimpan di cache! Diputar tanpa kuota.');
    } else {
      showToast?.('Gagal menyimpan cache suara alam.');
    }
  };

  if (!ambientOpen) return null;

  const handleToggle = (id) => {
    const current = ambientSounds[id];
    dispatch({
      type: 'SET_AMBIENT_SOUND',
      payload: { id, active: !current.active },
    });
  };

  const handleVolumeChange = (id, volume) => {
    dispatch({
      type: 'SET_AMBIENT_SOUND',
      payload: { id, volume: parseFloat(volume), active: true },
    });
  };

  const handlePreset = (preset) => {
    dispatch({ type: 'APPLY_AMBIENT_PRESET', payload: preset });
  };

  const handleStopAll = () => {
    AMBIENT_SOUNDS.forEach(s => {
      dispatch({ type: 'SET_AMBIENT_SOUND', payload: { id: s.id, active: false } });
    });
    dispatch({ type: 'SET_AMBIENT_PRESET', payload: null });
  };

  const anyActive = Object.values(ambientSounds).some(s => s.active);

  return (
    <div className={`ambient-panel ${ambientOpen ? 'open' : ''}`}>
      <div className="ambient-panel-header">
        <div className="ambient-panel-title">🎧 Pengatur Suara Alam</div>
        <button
          className="ambient-close-btn"
          onClick={() => dispatch({ type: 'SET_AMBIENT_OPEN', payload: false })}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="ambient-sounds-list">
        <p style={{
          fontSize: 13,
          color: 'var(--text-secondary)',
          marginBottom: 12,
          lineHeight: 1.5,
        }}>
          Campurkan suara alam dengan murotal untuk pengalaman mendengarkan yang lebih khusyuk.
        </p>

        {/* Ambient Cache Status Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: cacheStatus.isAllCached ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.04)',
          border: cacheStatus.isAllCached ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--border-subtle)',
          borderRadius: '8px',
          marginBottom: 16,
          fontSize: 12,
          gap: 8,
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: cacheStatus.isAllCached ? '#34d399' : 'var(--text-subdued)', fontSize: 13 }}>
              {cacheStatus.isAllCached ? '✓' : '⚡'}
            </span>
            <span style={{ color: cacheStatus.isAllCached ? '#34d399' : 'var(--text-secondary)', fontWeight: 500 }}>
              {cacheStatus.isAllCached
                ? `Semua Suara Alam Tersimpan di Cache (${formatBytes(cacheStatus.totalBytes)})`
                : `${cacheStatus.cached}/${cacheStatus.total} Suara Alam Tersimpan di Cache`}
            </span>
          </div>
          {!cacheStatus.isAllCached && (
            <button
              onClick={handleCacheAll}
              disabled={caching}
              style={{
                fontSize: 11,
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'var(--accent-green)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              {caching ? 'Menyimpan...' : 'Simpan Semua (0 KB Kuota)'}
            </button>
          )}
        </div>

        {anyActive && !state.isPlaying && (
          <div style={{
            padding: '8px 12px',
            borderRadius: '8px',
            background: 'rgba(234, 179, 8, 0.1)',
            border: '1px solid rgba(234, 179, 8, 0.25)',
            color: '#facc15',
            fontSize: 12,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span>⏸️</span>
            <span>Murotal sedang dijeda — suara alam otomatis ikut dijeda.</span>
          </div>
        )}

        {AMBIENT_SOUNDS.map((sound) => {
          const config = ambientSounds[sound.id] || { active: false, volume: 0.5 };
          return (
            <div
              key={sound.id}
              className={`ambient-sound-item ${config.active ? 'active' : ''}`}
            >
              <div className="ambient-sound-icon">{sound.emoji}</div>
              <div className="ambient-sound-info">
                <div className="ambient-sound-name">{sound.name}</div>
                {sound.desc && (
                  <div style={{ fontSize: 11.5, color: 'var(--text-subdued)', marginBottom: 8 }}>
                    {sound.desc}
                  </div>
                )}
                <input
                  type="range"
                  className="ambient-sound-slider"
                  min="0"
                  max="1"
                  step="0.05"
                  value={config.volume}
                  onChange={(e) => handleVolumeChange(sound.id, e.target.value)}
                  style={{
                    background: config.active
                      ? `linear-gradient(to right, var(--accent-green) ${config.volume * 100}%, rgba(255,255,255,0.2) ${config.volume * 100}%)`
                      : undefined,
                  }}
                />
              </div>
              <button
                className={`ambient-sound-toggle ${config.active ? 'active' : ''}`}
                onClick={() => handleToggle(sound.id)}
                aria-label={`Nyalakan atau matikan ${sound.name}`}
              />
            </div>
          );
        })}
      </div>

      {/* Presets */}
      <div className="ambient-presets">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="ambient-presets-title">Pilihan Suasana</div>
          {anyActive && (
            <button
              style={{
                fontSize: 12,
                color: 'var(--text-secondary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
              onClick={handleStopAll}
            >
              Hentikan Semua
            </button>
          )}
        </div>
        {AMBIENT_PRESETS.map((preset) => (
          <button
            key={preset.name}
            className={`ambient-preset-btn ${activePreset === preset.name ? 'active' : ''}`}
            onClick={() => handlePreset(preset)}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
}
