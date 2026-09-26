'use client';

import { useApp } from '../context/AppContext';

export default function Sidebar() {
  const { state, dispatch } = useApp();

  const handleNav = (view) => {
    dispatch({ type: 'NAVIGATE', payload: { view } });
  };

  const handlePlaylistClick = (playlistId) => {
    dispatch({ type: 'NAVIGATE', payload: { view: 'playlist', playlistId } });
  };

  const gradientClasses = ['gradient-emerald', 'gradient-teal', 'gradient-blue', 'gradient-indigo'];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo" onClick={() => handleNav('home')} style={{ cursor: 'pointer' }}>
        <div className="sidebar-logo-icon">
          <img src="/logo.png" alt="Murotalify Logo" className="sidebar-logo-img" />
        </div>
        <div className="sidebar-logo-title-wrap">
          <span className="sidebar-logo-text">Murotalify</span>
          <span className="sidebar-logo-badge">Al-Quran & Alam</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <button
          className={`sidebar-nav-item ${state.currentView === 'home' ? 'active' : ''}`}
          onClick={() => handleNav('home')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z" />
          </svg>
          Beranda
        </button>

        <button
          className={`sidebar-nav-item ${state.currentView === 'search' ? 'active' : ''}`}
          onClick={() => handleNav('search')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.28c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z" />
          </svg>
          Cari
        </button>

        <button
          className={`sidebar-nav-item ${state.currentView === 'landing' || state.currentView === 'info' ? 'active' : ''}`}
          onClick={() => handleNav('landing')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
          Info & Panduan
        </button>

        <button
          className={`sidebar-nav-item`}
          onClick={() => dispatch({ type: 'TOGGLE_AMBIENT' })}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c.552 0 1 .448 1 1v16c0 .552-.448 1-1 1s-1-.448-1-1V4c0-.552.448-1 1-1zm-4 4c.552 0 1 .448 1 1v8c0 .552-.448 1-1 1s-1-.448-1-1V8c0-.552.448-1 1-1zm8 0c.552 0 1 .448 1 1v8c0 .552-.448 1-1 1s-1-.448-1-1V8c0-.552.448-1 1-1zm-12 3c.552 0 1 .448 1 1v2c0 .552-.448 1-1 1s-1-.448-1-1v-2c0-.552.448-1 1-1zm16 0c.552 0 1 .448 1 1v2c0 .552-.448 1-1 1s-1-.448-1-1v-2c0-.552.448-1 1-1z" />
          </svg>
          Pengatur Suara Alam
        </button>
      </nav>

      <div className="sidebar-divider" />

      {/* Library */}
      <div className="sidebar-library-header">
        <div 
          className={`sidebar-library-title ${state.currentView === 'library' ? 'active-nav' : ''}`}
          onClick={() => handleNav('library')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z" />
          </svg>
          Pustaka Saya
        </div>
        <button
          className="sidebar-create-btn"
          onClick={() => dispatch({ type: 'SHOW_CREATE_PLAYLIST', payload: true })}
          title="Buat Daftar Putar Baru"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75z" />
          </svg>
        </button>
      </div>

      {/* Playlists list */}
      <div className="sidebar-playlists">
        {state.playlists.length === 0 ? (
          <div className="sidebar-empty-box">
            <div className="sidebar-empty-icon">🎵</div>
            <p className="sidebar-empty-title">Buat daftar putar pertamamu</p>
            <p className="sidebar-empty-desc">Kumpulkan surat-surat favoritmu dalam satu daftar</p>
            <button
              className="btn-primary sidebar-empty-create-btn"
              onClick={() => dispatch({ type: 'SHOW_CREATE_PLAYLIST', payload: true })}
            >
              + Buat Daftar Putar
            </button>
          </div>
        ) : (
          state.playlists.map((playlist, i) => {
            const thumbGradient = playlist.gradient || gradientClasses[i % gradientClasses.length];
            const thumbIcon = playlist.icon || (playlist.surahs.length > 0 ? '📖' : '♪');
            const isActive = state.currentView === 'playlist' && state.currentPlaylistId === playlist.id;

            return (
              <div
                key={playlist.id}
                className={`sidebar-playlist-item ${isActive ? 'active' : ''}`}
                onClick={() => handlePlaylistClick(playlist.id)}
              >
                <div className={`sidebar-playlist-thumb ${thumbGradient}`}>
                  <span className="sidebar-thumb-icon">{thumbIcon}</span>
                </div>
                <div className="sidebar-playlist-info">
                  <div className="sidebar-playlist-name">{playlist.name}</div>
                  <div className="sidebar-playlist-meta">
                    {playlist.surahs.length} surat
                  </div>
                </div>
                {isActive && <div className="sidebar-active-indicator" />}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
