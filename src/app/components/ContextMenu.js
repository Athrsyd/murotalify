'use client';

import { useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';

export default function ContextMenu() {
  const { state, dispatch, showToast } = useApp();
  const { contextMenu, playlists } = state;

  const handleClose = useCallback(() => {
    dispatch({ type: 'SET_CONTEXT_MENU', payload: null });
  }, [dispatch]);

  useEffect(() => {
    if (contextMenu) {
      const handler = () => handleClose();
      document.addEventListener('click', handler);
      return () => document.removeEventListener('click', handler);
    }
  }, [contextMenu, handleClose]);

  if (!contextMenu) return null;

  const { x, y, surah } = contextMenu;

  const handleAddToPlaylist = (playlistId) => {
    dispatch({
      type: 'ADD_TO_PLAYLIST',
      payload: { playlistId, surah },
    });
    showToast(`Ditambahkan ke playlist`);
    handleClose();
  };

  const handleGoToSurah = () => {
    dispatch({ type: 'NAVIGATE', payload: { view: 'surah', surahNumber: surah.nomor } });
    handleClose();
  };

  // Adjust position to stay within viewport
  const menuStyle = {
    left: Math.min(x, window.innerWidth - 220),
    top: Math.min(y, window.innerHeight - 300),
  };

  return (
    <div className="context-menu" style={menuStyle} onClick={e => e.stopPropagation()}>
      <button className="context-menu-item" onClick={handleGoToSurah}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
        Lihat Detail Surat
      </button>

      {playlists.length > 0 && (
        <>
          <div className="context-menu-divider" />
          <div style={{ padding: '6px 12px', fontSize: 11, color: 'var(--text-subdued)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
            Tambah ke Playlist
          </div>
          {playlists.map(p => (
            <button key={p.id} className="context-menu-item" onClick={() => handleAddToPlaylist(p.id)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              {p.name}
            </button>
          ))}
        </>
      )}

      <div className="context-menu-divider" />
      <button
        className="context-menu-item"
        onClick={() => {
          dispatch({ type: 'SHOW_CREATE_PLAYLIST', payload: true });
          handleClose();
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
        Buat Playlist Baru
      </button>
    </div>
  );
}
