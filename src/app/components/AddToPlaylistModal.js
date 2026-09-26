'use client';

import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function AddToPlaylistModal() {
  const { state, dispatch, showToast, getGradient } = useApp();
  const { addToPlaylistSurah, playlists } = state;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && addToPlaylistSurah) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addToPlaylistSurah]);

  if (!addToPlaylistSurah) return null;

  const handleClose = () => {
    dispatch({ type: 'CLOSE_ADD_TO_PLAYLIST' });
  };

  const handleToggleSurahInPlaylist = (playlist) => {
    const isAlreadyIn = playlist.surahs.some(s => s.nomor === addToPlaylistSurah.nomor);
    if (isAlreadyIn) {
      dispatch({
        type: 'REMOVE_FROM_PLAYLIST',
        payload: { playlistId: playlist.id, surahNomor: addToPlaylistSurah.nomor },
      });
      showToast(`${addToPlaylistSurah.namaLatin} dihapus dari ${playlist.name}`);
    } else {
      dispatch({
        type: 'ADD_TO_PLAYLIST',
        payload: {
          playlistId: playlist.id,
          surah: {
            nomor: addToPlaylistSurah.nomor,
            nama: addToPlaylistSurah.nama,
            namaLatin: addToPlaylistSurah.namaLatin,
            jumlahAyat: addToPlaylistSurah.jumlahAyat,
            arti: addToPlaylistSurah.arti,
            audioFull: addToPlaylistSurah.audioFull,
          },
        },
      });
      showToast(`${addToPlaylistSurah.namaLatin} ditambahkan ke ${playlist.name}`);
    }
  };

  const handleOpenCreatePlaylist = () => {
    handleClose();
    dispatch({ type: 'SHOW_CREATE_PLAYLIST', payload: true });
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-card add-playlist-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-to-playlist-title"
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <div className={`playlist-preview-badge ${getGradient(addToPlaylistSurah.nomor - 1)}`}>
              <span className="surah-badge-num-preview">{addToPlaylistSurah.nomor}</span>
            </div>
            <div>
              <h2 id="add-to-playlist-title" className="modal-title">
                Tambah ke Daftar Putar
              </h2>
              <div className="add-modal-surah-meta">
                <span className="add-modal-surah-latin">{addToPlaylistSurah.namaLatin}</span>
                <span className="meta-dot">•</span>
                <span className="add-modal-surah-arabic">{addToPlaylistSurah.nama}</span>
                <span className="meta-dot">•</span>
                <span>{addToPlaylistSurah.jumlahAyat} Ayat</span>
              </div>
            </div>
          </div>
          <button
            className="modal-close-btn"
            onClick={handleClose}
            aria-label="Tutup dialog"
            title="Tutup (Esc)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body add-playlist-modal-body">
          {playlists.length === 0 ? (
            <div className="add-playlist-empty">
              <div className="add-playlist-empty-icon">🎵</div>
              <p className="add-playlist-empty-title">Belum ada daftar putar</p>
              <p className="add-playlist-empty-desc">
                Buat daftar putar pertamamu untuk menyimpan dan mengorganisir surat-surat favorit.
              </p>
              <button
                type="button"
                className="btn-primary"
                style={{ marginTop: 12 }}
                onClick={handleOpenCreatePlaylist}
              >
                + Buat Daftar Putar Baru
              </button>
            </div>
          ) : (
            <>
              <div className="add-playlist-list-label">Pilih Daftar Putar Tujuan:</div>
              <div className="add-playlist-list">
                {playlists.map((playlist, idx) => {
                  const isAlreadyIn = playlist.surahs.some(s => s.nomor === addToPlaylistSurah.nomor);
                  const gradient = playlist.gradient || getGradient(idx);
                  const icon = playlist.icon || '📖';

                  return (
                    <div
                      key={playlist.id}
                      className={`add-playlist-item-row ${isAlreadyIn ? 'is-added' : ''}`}
                      onClick={() => handleToggleSurahInPlaylist(playlist)}
                    >
                      <div className={`add-playlist-item-icon ${gradient}`}>
                        <span>{icon}</span>
                      </div>
                      <div className="add-playlist-item-info">
                        <div className="add-playlist-item-name">{playlist.name}</div>
                        <div className="add-playlist-item-count">
                          {playlist.surahs.length} Surat
                          {playlist.description ? ` • ${playlist.description}` : ''}
                        </div>
                      </div>
                      <div className="add-playlist-item-action">
                        {isAlreadyIn ? (
                          <span className="add-badge-added" title="Klik untuk menghapus dari daftar putar">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Tersimpan
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="btn-secondary add-btn-action"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleSurahInPlaylist(playlist);
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Tambah
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-actions" style={{ justifyContent: 'space-between' }}>
          <button
            type="button"
            className="btn-link-create"
            onClick={handleOpenCreatePlaylist}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Buat Daftar Putar Baru
          </button>
          <button type="button" className="btn-secondary" onClick={handleClose}>
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
