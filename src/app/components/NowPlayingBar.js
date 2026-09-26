'use client';

import { useApp } from '../context/AppContext';

function VolumeIcon({ volume }) {
  if (volume === 0) return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z"/>
      <path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-13a.75.75 0 0 0 0 0z"/>
    </svg>
  );
  if (volume < 0.5) return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.683 3.281V2.87L2.817 6.15zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"/>
    </svg>
  );
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.683 3.281V2.87L2.817 6.15zm8.683 6.087a4.502 4.502 0 0 0 0-8.474v1.65a2.999 2.999 0 0 1 0 5.175v1.649z"/>
    </svg>
  );
}

function MosqueIcon({ active }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? "2.2" : "1.8"}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        filter: active ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.75))' : 'none',
        transition: 'all 0.25s ease',
        flexShrink: 0,
      }}
    >
      {/* Mosque Dome */}
      <path d="M12 3c-2 2.2-4.5 4-4.5 7.5V20h9V10.5C16.5 7 14 5.2 12 3z" />
      {/* Arch Doorway */}
      <path d="M10.5 20v-3.5a1.5 1.5 0 0 1 3 0V20" />
      {/* Crescent finial */}
      <path d="M12 2v1.5" />
      {/* Sparkles / Acoustic Aura */}
      <path d="M18.8 4.2l.5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5.5-1.2z" fill="currentColor" stroke="none" />
      <path d="M5.2 6.5l.4.9.9.4-.9.4-.4.9-.4-.9-.9-.4.9-.4.4-.9z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function NowPlayingBar() {
  const { state, dispatch, togglePlay, seek, playNext, playPrev, getGradient, QARI_MAP, toggleEpicAmbience } = useApp();
  const { currentTrack, isPlaying, currentTime, duration, volume, isShuffle, repeatMode, epicAmbience, murotalEffectOpen } = state;

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(ratio * duration);
  };

  const handleVolumeClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    dispatch({ type: 'SET_VOLUME', payload: ratio });
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="now-playing-bar">
      {/* Left - Track Info */}
      <div className="now-playing-info">
        {currentTrack ? (
          <>
            <div className={`now-playing-cover ${getGradient((currentTrack.surahNumber - 1) || 0)}`}>
              <span style={{ position: 'relative', zIndex: 2 }}>{currentTrack.surahNumber}</span>
            </div>
            <div className="now-playing-text">
              <div
                className="now-playing-title"
                onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'surah', surahNumber: currentTrack.surahNumber } })}
              >
                {currentTrack.surahName}
                {currentTrack.type === 'ayat' && ` - Ayat ${currentTrack.ayatNumber}`}
              </div>
              <div className="now-playing-artist">
                {QARI_MAP[currentTrack.qariKey]}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="now-playing-cover now-playing-cover-logo" style={{ background: 'rgba(16, 185, 129, 0.1)', padding: 6 }}>
              <img src="/logo.png" alt="Murotalify" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 6 }} />
            </div>
            <div className="now-playing-text">
              <div className="now-playing-title" style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                Pilih surah untuk diputar
              </div>
              <div className="now-playing-artist" style={{ fontSize: 11 }}>
                Murotalify
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile Right Controls (Spotify Mobile Style) */}
      <div className="now-playing-mobile-controls">
        <button
          className={`player-btn mobile-epic-btn ${epicAmbience ? 'active' : ''} ${murotalEffectOpen ? 'panel-open' : ''}`}
          onClick={() => dispatch({ type: 'TOGGLE_MUROTAL_EFFECT_PANEL' })}
          title={epicAmbience ? "Gema Murotal: Aktif (Klik untuk atur efek)" : "Gema Murotal: Nonaktif (Klik untuk atur efek)"}
          aria-label="Atur Gema Murotal"
          style={{ padding: '6px' }}
        >
          <MosqueIcon active={epicAmbience} />
        </button>

        <button
          className={`player-btn ${state.ambientOpen ? 'active' : ''}`}
          onClick={() => dispatch({ type: 'TOGGLE_AMBIENT' })}
          title="Pengatur Suara Alam"
          style={{ padding: '6px' }}
        >
          <span style={{ fontSize: 16 }}>🌧️</span>
        </button>

        <button
          className="mobile-play-btn"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Jeda' : 'Putar'}
        >
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Center - Controls */}
      <div className="player-controls">
        <div className="player-buttons">
          <button
            className={`player-btn ${isShuffle ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_SHUFFLE' })}
            title={isShuffle ? "Acak: Aktif" : "Acak: Nonaktif"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06l2.306-2.306a.75.75 0 0 0 0-1.06L13.15.92zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z"/>
              <path d="m7.5 10.723.98-1.167 1.796 2.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017-1.018a.75.75 0 1 1 1.06-1.06l2.306 2.306a.75.75 0 0 1 0 1.06l-2.306 2.306a.75.75 0 1 1-1.06-1.06L13.109 14H11.16a3.75 3.75 0 0 1-2.873-1.34L7.5 10.723z"/>
            </svg>
          </button>

          <button className="player-btn" onClick={playPrev} title="Sebelumnya">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H2.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h.6z"/>
            </svg>
          </button>

          <button className="player-btn player-btn-play" onClick={togglePlay} title={isPlaying ? 'Jeda' : 'Putar'}>
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/>
              </svg>
            )}
          </button>

          <button className="player-btn" onClick={playNext} title="Berikutnya">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-.6z"/>
            </svg>
          </button>

          <button
            className={`player-btn ${repeatMode !== 'off' ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_REPEAT' })}
            title={`Ulangi: ${repeatMode === 'one' ? 'Satu Surah' : repeatMode === 'all' ? 'Semua' : 'Nonaktif'}`}
          >
            {repeatMode === 'one' ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h.75v1.5h-.75A2.25 2.25 0 0 0 1.5 4.75v5.5A2.25 2.25 0 0 0 3.75 12.5h7.5A2.25 2.25 0 0 0 13.5 10.25V8H15v2.25A3.75 3.75 0 0 1 11.25 14h-7.5A3.75 3.75 0 0 1 0 10.25v-5.5z"/>
                <path d="M12.53.47a.75.75 0 0 0-1.06 0l-2 2a.75.75 0 0 0 1.06 1.06l.72-.72V7h1.5V2.81l.72.72a.75.75 0 1 0 1.06-1.06l-2-2z"/>
                <text x="7" y="10" fontSize="7" fontWeight="bold">1</text>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5.5A3.75 3.75 0 0 1 12.25 14h-8.5A3.75 3.75 0 0 1 0 10.25v-5.5zM12.25 2.5h-8.5A2.25 2.25 0 0 0 1.5 4.75v5.5a2.25 2.25 0 0 0 2.25 2.25h8.5a2.25 2.25 0 0 0 2.25-2.25v-5.5a2.25 2.25 0 0 0-2.25-2.25z"/>
              </svg>
            )}
          </button>
        </div>

        <div className="player-progress">
          <span className="player-time">{formatTime(currentTime)}</span>
          <div className="progress-bar-container" onClick={handleProgressClick}>
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}>
              <div className="progress-bar-thumb" />
            </div>
          </div>
          <span className="player-time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right - Volume & Extra */}
      <div className="player-extra">
        <button
          className={`epic-toggle-btn ${epicAmbience ? 'active' : ''} ${murotalEffectOpen ? 'panel-open' : ''}`}
          onClick={() => dispatch({ type: 'TOGGLE_MUROTAL_EFFECT_PANEL' })}
          title={epicAmbience ? "Gema Murotal: Aktif (Klik untuk atur efek)" : "Gema Murotal: Nonaktif (Klik untuk atur efek)"}
          aria-label="Atur Gema Murotal"
        >
          <MosqueIcon active={epicAmbience} />
          <span className="epic-toggle-label">Gema Murotal</span>
          <span className="epic-toggle-badge" />
        </button>

        <button
          className={`player-btn ${state.ambientOpen ? 'active' : ''}`}
          onClick={() => dispatch({ type: 'TOGGLE_AMBIENT' })}
          title="Pengatur Suara Alam"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
            <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
            <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
          </svg>
        </button>

        <div className="volume-control">
          <button
            className="player-btn"
            onClick={() => dispatch({ type: 'SET_VOLUME', payload: volume === 0 ? 0.8 : 0 })}
            aria-label="Volume"
          >
            <VolumeIcon volume={volume} />
          </button>
          <div className="volume-slider-container" onClick={handleVolumeClick}>
            <div className="volume-slider-fill" style={{ width: `${volume * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Spotify Mobile Bottom Thin Progress Line */}
      <div className="mobile-progress-line" onClick={handleProgressClick}>
        <div className="mobile-progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>
    </div>
  );
}

