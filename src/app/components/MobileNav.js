'use client';

import { useApp } from '../context/AppContext';

export default function MobileNav() {
  const { state, dispatch } = useApp();
  const { currentView, ambientOpen } = state;

  const handleNav = (view) => {
    dispatch({ type: 'NAVIGATE', payload: { view } });
  };

  return (
    <nav className="mobile-nav" aria-label="Navigasi Mobile">
      <button
        className={`mobile-nav-item ${currentView === 'home' ? 'active' : ''}`}
        onClick={() => handleNav('home')}
        title="Home"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z" />
        </svg>
        <span>Home</span>
      </button>

      <button
        className={`mobile-nav-item ${currentView === 'search' ? 'active' : ''}`}
        onClick={() => handleNav('search')}
        title="Cari Surah"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.28c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z" />
        </svg>
        <span>Cari</span>
      </button>

      <button
        className={`mobile-nav-item ${currentView === 'library' || currentView === 'playlist' ? 'active' : ''}`}
        onClick={() => handleNav('library')}
        title="Koleksi & Playlist"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z" />
        </svg>
        <span>Library</span>
      </button>

      <button
        className={`mobile-nav-item ${ambientOpen ? 'active' : ''}`}
        onClick={() => dispatch({ type: 'TOGGLE_AMBIENT' })}
        title="Suara Alam"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3c.552 0 1 .448 1 1v16c0 .552-.448 1-1 1s-1-.448-1-1V4c0-.552.448-1 1-1zm-4 4c.552 0 1 .448 1 1v8c0 .552-.448 1-1 1s-1-.448-1-1V8c0-.552.448-1 1-1zm8 0c.552 0 1 .448 1 1v8c0 .552-.448 1-1 1s-1-.448-1-1V8c0-.552.448-1 1-1zm-12 3c.552 0 1 .448 1 1v2c0 .552-.448 1-1 1s-1-.448-1-1v-2c0-.552.448-1 1-1zm16 0c.552 0 1 .448 1 1v2c0 .552-.448 1-1 1s-1-.448-1-1v-2c0-.552.448-1 1-1z" />
        </svg>
        <span>Ambient</span>
      </button>
    </nav>
  );
}
