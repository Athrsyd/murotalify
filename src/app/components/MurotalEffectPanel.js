'use client';

import { useApp } from '../context/AppContext';

export default function MurotalEffectPanel() {
  const {
    state,
    dispatch,
    MUROTAL_EFFECT_PRESETS,
    toggleEpicAmbience,
    showToast,
  } = useApp();

  const {
    murotalEffectOpen,
    epicAmbience,
    effectPreset,
    effectSettings,
  } = state;

  if (!murotalEffectOpen) return null;

  const handleSliderChange = (key, value) => {
    // If user changes a slider while effects are OFF, automatically activate effects
    if (!epicAmbience) {
      dispatch({ type: 'SET_EPIC_AMBIENCE', payload: true });
    }
    dispatch({
      type: 'SET_EFFECT_SETTING',
      payload: { key, value: parseFloat(value) },
    });
  };

  const handleSelectPreset = (preset) => {
    if (!epicAmbience) {
      dispatch({ type: 'SET_EPIC_AMBIENCE', payload: true });
    }
    dispatch({ type: 'APPLY_EFFECT_PRESET', payload: preset });
    showToast(`✨ Suasana Gema: ${preset.name}`);
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_EFFECT_SETTINGS' });
    showToast('Pengaturan efek dikembalikan ke standar');
  };

  // Percentages for slider gradient tracks
  const reverbWetPct = Math.round(effectSettings.reverbWet * 100);
  const decayPct = Math.round(((effectSettings.reverbDecay - 1.0) / (8.0 - 1.0)) * 100);
  const delayWetPct = Math.round((effectSettings.delayWet / 0.5) * 100);
  const delayTimePct = Math.round(((effectSettings.delayTime - 0.1) / (0.5 - 0.1)) * 100);

  return (
    <div className={`murotal-effect-panel ${murotalEffectOpen ? 'open' : ''}`}>
      {/* Header */}
      <div className="murotal-panel-header">
        <div className="murotal-panel-title">
          <span>🕌</span>
          <div>
            <div className="murotal-title-text">Gema Murotal</div>
            <div className="murotal-subtitle-text">Gema & Resonansi Tilawah</div>
          </div>
        </div>
        <button
          className="ambient-close-btn"
          onClick={() => dispatch({ type: 'SET_MUROTAL_EFFECT_OPEN', payload: false })}
          aria-label="Tutup Panel Gema"
          title="Tutup"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="murotal-panel-content">
        <p className="murotal-panel-desc">
          Atur tingkat gema dan pantulan lembut untuk menciptakan suasana tilawah yang syahdu dan menenangkan jiwa.
        </p>

        {/* Master ON/OFF Toggle Card */}
        <div className={`effect-master-card ${epicAmbience ? 'active' : ''}`} onClick={toggleEpicAmbience}>
          <div className="effect-master-left">
            <div className="effect-master-icon">
              {epicAmbience ? '✨' : '🔈'}
            </div>
            <div>
              <div className="effect-master-title">Status Gema Tilawah</div>
              <div className="effect-master-subtitle">
                {epicAmbience ? 'Aktif — Gema tilawah aktif' : 'Nonaktif — Suara asli tanpa gema'}
              </div>
            </div>
          </div>
          <button
            className={`ambient-sound-toggle ${epicAmbience ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleEpicAmbience();
            }}
            aria-label="Nyalakan atau matikan gema murotal"
          />
        </div>

        {!epicAmbience && (
          <div className="effect-status-banner">
            <span>💡</span>
            <span>Efek gema sedang nonaktif. Nyalakan tombol di atas untuk mendengarkan lantunan dengan gema syahdu.</span>
          </div>
        )}

        {/* Preset Section */}
        <div className="effect-section">
          <div className="effect-section-header">
            <div className="effect-section-title">Pilihan Suasana Gema</div>
            {effectPreset === 'custom' && (
              <span className="effect-custom-badge">Pengaturan Khusus</span>
            )}
          </div>
          <div className="effect-preset-grid">
            {MUROTAL_EFFECT_PRESETS.map((preset) => {
              const isSelected = effectPreset === preset.id;
              return (
                <div
                  key={preset.id}
                  className={`effect-preset-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectPreset(preset)}
                >
                  <div className="effect-preset-card-top">
                    <span className="effect-preset-emoji">{preset.emoji}</span>
                    <span className="effect-preset-tag">{preset.tag}</span>
                  </div>
                  <div className="effect-preset-name">{preset.name}</div>
                  <div className="effect-preset-desc">{preset.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Sliders Section */}
        <div className="effect-section">
          <div className="effect-section-header">
            <div className="effect-section-title">Pengaturan Khusus</div>
            <button className="effect-reset-link" onClick={handleReset} title="Kembalikan nilai ke standar">
              Kembalikan ke Standar
            </button>
          </div>

          <div className="effect-sliders-list">
            {/* Slider 1: Reverb Wet */}
            <div className="effect-slider-item">
              <div className="effect-slider-label-row">
                <div className="effect-slider-name">
                  <span className="slider-icon">🔊</span>
                  <span>Tingkat Gema</span>
                </div>
                <span className="effect-slider-val">{reverbWetPct}%</span>
              </div>
              <input
                type="range"
                className="ambient-sound-slider"
                min="0"
                max="1"
                step="0.01"
                value={effectSettings.reverbWet}
                onChange={(e) => handleSliderChange('reverbWet', e.target.value)}
                style={{
                  background: `linear-gradient(to right, var(--accent-green) ${reverbWetPct}%, rgba(255,255,255,0.12) ${reverbWetPct}%)`,
                }}
              />
              <div className="effect-slider-hint">
                Ketebalan gema ruang yang dipadukan ke lantunan murotal
              </div>
            </div>

            {/* Slider 2: Reverb Decay */}
            <div className="effect-slider-item">
              <div className="effect-slider-label-row">
                <div className="effect-slider-name">
                  <span className="slider-icon">🏛️</span>
                  <span>Panjang Resonansi</span>
                </div>
                <span className="effect-slider-val">{effectSettings.reverbDecay.toFixed(1)} s</span>
              </div>
              <input
                type="range"
                className="ambient-sound-slider"
                min="1.0"
                max="8.0"
                step="0.1"
                value={effectSettings.reverbDecay}
                onChange={(e) => handleSliderChange('reverbDecay', e.target.value)}
                style={{
                  background: `linear-gradient(to right, var(--accent-green) ${decayPct}%, rgba(255,255,255,0.12) ${decayPct}%)`,
                }}
              />
              <div className="effect-slider-hint">
                Durasi pantulan suara; semakin besar, ruang terasa semakin luas dan megah
              </div>
            </div>

            {/* Slider 3: Delay Wet */}
            <div className="effect-slider-item">
              <div className="effect-slider-label-row">
                <div className="effect-slider-name">
                  <span className="slider-icon">🔁</span>
                  <span>Pantulan Lembut</span>
                </div>
                <span className="effect-slider-val">{Math.round(effectSettings.delayWet * 100)}%</span>
              </div>
              <input
                type="range"
                className="ambient-sound-slider"
                min="0"
                max="0.5"
                step="0.01"
                value={effectSettings.delayWet}
                onChange={(e) => handleSliderChange('delayWet', e.target.value)}
                style={{
                  background: `linear-gradient(to right, var(--accent-green) ${delayWetPct}%, rgba(255,255,255,0.12) ${delayWetPct}%)`,
                }}
              />
              <div className="effect-slider-hint">
                Pantulan lembut layaknya ruangan luas (0% = tanpa pantulan)
              </div>
            </div>

            {/* Slider 4: Delay Time */}
            <div className="effect-slider-item">
              <div className="effect-slider-label-row">
                <div className="effect-slider-name">
                  <span className="slider-icon">⏱️</span>
                  <span>Jeda Pantulan</span>
                </div>
                <span className="effect-slider-val">{Math.round(effectSettings.delayTime * 1000)} ms</span>
              </div>
              <input
                type="range"
                className="ambient-sound-slider"
                min="0.1"
                max="0.5"
                step="0.01"
                value={effectSettings.delayTime}
                onChange={(e) => handleSliderChange('delayTime', e.target.value)}
                style={{
                  background: `linear-gradient(to right, var(--accent-green) ${delayTimePct}%, rgba(255,255,255,0.12) ${delayTimePct}%)`,
                }}
              />
              <div className="effect-slider-hint">
                Jarak jeda waktu antar pantulan suara
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Nature Hint */}
        <div className="effect-ambient-hint" onClick={() => dispatch({ type: 'TOGGLE_AMBIENT' })}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🌧️</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#fff' }}>Ingin padukan dengan Suara Alam?</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>Buka Pengatur Suara Alam (hujan, aliran air, alam)</div>
            </div>
          </div>
          <span style={{ fontSize: 16, color: 'var(--accent-green)' }}>→</span>
        </div>
      </div>
    </div>
  );
}
