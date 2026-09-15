'use client';

import { useCallback, useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { fetchAllSurahs } from '../lib/api';

const POPULAR_SURAHS = [1, 18, 36, 55, 56, 67];

export default function PlaylistDetail() {
  const { state, dispatch, playTrack, getGradient, QARI_MAP, showToast } = useApp();
  const { currentPlaylistId, playlists, selectedQari, currentTrack, isPlaying, surahList } = state;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [modalFilterCategory, setModalFilterCategory] = useState('all');

  useEffect(() => {
    if (surahList.length === 0) {
      fetchAllSurahs()
        .then(data => dispatch({ type: 'SET_SURAH_LIST', payload: data }))
        .catch(err => console.error('Failed to fetch surahs:', err));
    }
  }, [surahList.length, dispatch]);

  const playlist = playlists.find(p => p.id === currentPlaylistId);

  const handlePlayAll = useCallback(() => {
    if (!playlist || playlist.surahs.length === 0) return;
    const firstSurah = playlist.surahs[0];
    const audioUrl = firstSurah.audioFull[selectedQari];
    playTrack({
      surahNumber: firstSurah.nomor,
      surahName: firstSurah.namaLatin,
      surahNameArab: firstSurah.nama,
      qariKey: selectedQari,
      audioUrl,
      type: 'full',
    });

    const queue = playlist.surahs.map(s => ({
      surahNumber: s.nomor,
      surahName: s.namaLatin,
      surahNameArab: s.nama,
      qariKey: selectedQari,
      audioUrl: s.audioFull[selectedQari],
      type: 'full',
    }));
    dispatch({ type: 'SET_QUEUE', payload: queue });
  }, [playlist, selectedQari, playTrack, dispatch]);

  const handleShufflePlay = useCallback(() => {
    if (!playlist || playlist.surahs.length === 0) return;
    const shuffled = [...playlist.surahs].sort(() => Math.random() - 0.5);
    const firstSurah = shuffled[0];
    const audioUrl = firstSurah.audioFull[selectedQari];
    playTrack({
      surahNumber: firstSurah.nomor,
      surahName: firstSurah.namaLatin,
      surahNameArab: firstSurah.nama,
      qariKey: selectedQari,
      audioUrl,
      type: 'full',
    });

    const queue = shuffled.map(s => ({
      surahNumber: s.nomor,
      surahName: s.namaLatin,
      surahNameArab: s.nama,
      qariKey: selectedQari,
      audioUrl: s.audioFull[selectedQari],
      type: 'full',
    }));
    dispatch({ type: 'SET_QUEUE', payload: queue });
    showToast('Memutar playlist secara acak');
  }, [playlist, selectedQari, playTrack, dispatch, showToast]);

  const handlePlaySurah = useCallback((surah) => {
    playTrack({
      surahNumber: surah.nomor,
      surahName: surah.namaLatin,
      surahNameArab: surah.nama,
      qariKey: selectedQari,
      audioUrl: surah.audioFull[selectedQari],
      type: 'full',
    });
  }, [selectedQari, playTrack]);

  const handleRemove = useCallback((surahNomor, surahName, e) => {
    e.stopPropagation();
    dispatch({
      type: 'REMOVE_FROM_PLAYLIST',
      payload: { playlistId: currentPlaylistId, surahNomor },
    });
    showToast(`${surahName} dihapus dari playlist`);
  }, [currentPlaylistId, dispatch, showToast]);

  const handleDeletePlaylist = useCallback(() => {
    dispatch({ type: 'DELETE_PLAYLIST', payload: currentPlaylistId });
    dispatch({ type: 'NAVIGATE', payload: { view: 'library' } });
    showToast('Playlist berhasil dihapus');
  }, [currentPlaylistId, dispatch, showToast]);

  const handleToggleSurah = useCallback((nomor) => {
    if (!playlist) return;
    const isAlreadyIn = playlist.surahs.some(s => s.nomor === nomor);
    const surah = surahList.find(s => s.nomor === nomor);
    if (!surah) return;

    if (isAlreadyIn) {
      dispatch({
        type: 'REMOVE_FROM_PLAYLIST',
        payload: { playlistId: currentPlaylistId, surahNomor: nomor },
      });
      showToast(`${surah.namaLatin} dihapus dari playlist`);
    } else {
      dispatch({
        type: 'ADD_TO_PLAYLIST',
        payload: {
          playlistId: currentPlaylistId,
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
      showToast(`${surah.namaLatin} ditambahkan ke playlist`);
    }
  }, [playlist, surahList, currentPlaylistId, dispatch, showToast]);

  const handleNavigateToSearch = useCallback(() => {
    dispatch({ type: 'SET_TARGET_PLAYLIST', payload: currentPlaylistId });
    dispatch({ type: 'NAVIGATE', payload: { view: 'search' } });
  }, [currentPlaylistId, dispatch]);

  const filteredSurahsForModal = useMemo(() => {
    let list = surahList;

    // Filter by category
    if (modalFilterCategory === 'popular') {
      const popNums = [1, 2, 18, 36, 55, 56, 67, 78, 112, 114];
      list = list.filter(s => popNums.includes(s.nomor));
    } else if (modalFilterCategory === 'juz30') {
      list = list.filter(s => s.nomor >= 78);
    } else if (modalFilterCategory === 'makkiyah') {
      list = list.filter(s => s.tempatTurun === 'Mekah');
    } else if (modalFilterCategory === 'madaniyah') {
      list = list.filter(s => s.tempatTurun === 'Madinah');
    }

    // Filter by search query
    if (modalSearchQuery.trim()) {
      const q = modalSearchQuery.toLowerCase().trim();
      list = list.filter(s =>
        s.namaLatin.toLowerCase().includes(q) ||
        s.nama.includes(q) ||
        s.arti.toLowerCase().includes(q) ||
        s.nomor.toString() === q
      );
    }

    return list;
  }, [surahList, modalFilterCategory, modalSearchQuery]);

  if (!playlist) {
    return (
      <div className="empty-state playlist-not-found">
        <div className="empty-state-icon">🔍</div>
        <div className="empty-state-title">Playlist Tidak Ditemukan</div>
        <p className="empty-state-text">Playlist ini mungkin sudah dihapus atau tidak tersedia.</p>
        <button
          className="btn-primary"
          style={{ marginTop: 20 }}
          onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'library' } })}
        >
          Kembali ke Library
        </button>
      </div>
    );
  }

  const gradientIdx = playlists.indexOf(playlist);
  const coverGradient = playlist.gradient || getGradient(gradientIdx);
  const coverIcon = playlist.icon || (playlist.surahs.length > 0 ? '📖' : '♪');
  const totalAyat = playlist.surahs.reduce((sum, s) => sum + (s.jumlahAyat || 0), 0);
  const isPlaylistPlaying = playlist.surahs.some(s => s.nomor === currentTrack?.surahNumber) && isPlaying;

  return (
    <div className="playlist-detail-container">
      {/* Premium Hero Banner */}
      <div className="playlist-hero">
        <div className={`playlist-hero-cover ${coverGradient}`}>
          <div className="playlist-cover-symbol">{coverIcon}</div>
          <div className="playlist-cover-badge">{playlist.surahs.length} SURAT</div>
        </div>

        <div className="playlist-hero-info">
          <div className="playlist-type-tag">
            <span className="playlist-pill">Koleksi Pribadi</span>
          </div>
          <h1 className="playlist-hero-title">{playlist.name}</h1>
          {playlist.description ? (
            <p className="playlist-hero-description">{playlist.description}</p>
          ) : (
            <p className="playlist-hero-description empty-desc">Tidak ada deskripsi</p>
          )}

          <div className="playlist-stats-row">
            <div className="playlist-stat-item">
              <span className="stat-count">{playlist.surahs.length}</span>
              <span className="stat-label">Surat</span>
            </div>
            <span className="stat-separator">•</span>
            <div className="playlist-stat-item">
              <span className="stat-count">{totalAyat}</span>
              <span className="stat-label">Ayat</span>
            </div>
            <span className="stat-separator">•</span>
            <div className="playlist-stat-item">
              <span className="stat-icon">🎙️</span>
              <span className="stat-label">{QARI_MAP[selectedQari]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="playlist-action-bar">
        <div className="action-bar-left">
          <button
            className={`play-btn-large ${isPlaylistPlaying ? 'is-playing' : ''}`}
            onClick={handlePlayAll}
            disabled={playlist.surahs.length === 0}
            title={playlist.surahs.length === 0 ? 'Playlist masih kosong' : 'Putar Semua'}
            style={{ opacity: playlist.surahs.length === 0 ? 0.45 : 1 }}
          >
            {isPlaylistPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1.5" />
                <rect x="14" y="5" width="4" height="14" rx="1.5" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z" />
              </svg>
            )}
          </button>

          <button
            className="action-pill-btn"
            onClick={handleShufflePlay}
            disabled={playlist.surahs.length < 2}
            title="Putar Acak"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
              <line x1="4" y1="4" x2="9" y2="9" />
            </svg>
            <span>Acak</span>
          </button>

          <button
            className="action-pill-btn btn-highlight"
            onClick={() => setIsAddModalOpen(true)}
            title="Tambah Surat Baru ke Playlist Ini"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Tambah Surat</span>
          </button>
        </div>

        <div className="action-bar-right">
          {confirmDelete ? (
            <div className="confirm-delete-box">
              <span className="confirm-text">Hapus playlist?</span>
              <button className="confirm-btn danger" onClick={handleDeletePlaylist}>
                Ya, Hapus
              </button>
              <button className="confirm-btn cancel" onClick={() => setConfirmDelete(false)}>
                Batal
              </button>
            </div>
          ) : (
            <button
              className="action-delete-btn"
              onClick={() => setConfirmDelete(true)}
              title="Hapus Playlist Ini"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
              <span>Hapus Playlist</span>
            </button>
          )}
        </div>
      </div>

      {/* Surah List Table */}
      {playlist.surahs.length === 0 ? (
        <div className="playlist-empty-card">
          <div className="playlist-empty-icon">{coverIcon}</div>
          <h3 className="playlist-empty-title">Playlist Ini Masih Kosong</h3>
          <p className="playlist-empty-desc">
            Mulailah mengumpulkan surat-surat favoritmu untuk didengarkan kapan saja.
          </p>

          {/* Quick Add Popular Surahs */}
          <div className="quick-add-section">
            <div className="quick-add-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--accent-green)' }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Rekomendasi Surat Populer:
            </div>
            <div className="quick-add-chips">
              {POPULAR_SURAHS.map((nomor) => {
                const s = surahList.find(item => item.nomor === nomor);
                if (!s) return null;
                const alreadyIn = playlist.surahs.some(p => p.nomor === nomor);
                return (
                  <button
                    key={nomor}
                    className={`quick-add-chip ${alreadyIn ? 'added' : ''}`}
                    onClick={() => handleToggleSurah(nomor)}
                  >
                    <span className="chip-number">{s.nomor}</span>
                    <span className="chip-name">{s.namaLatin}</span>
                    <span className="chip-action">{alreadyIn ? '✓ Ditambahkan' : '+ Tambah'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn-primary btn-glow"
              onClick={() => setIsAddModalOpen(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Pilih & Tambah Surat Sekarang</span>
            </button>
            <button
              className="btn-secondary"
              onClick={handleNavigateToSearch}
            >
              Buka Halaman Pencarian
            </button>
          </div>
        </div>
      ) : (
        <div className="playlist-table-container">
          <div className="playlist-table-header">
            <div className="th-col th-index">#</div>
            <div className="th-col th-title">Surat</div>
            <div className="th-col th-verses">Jumlah Ayat</div>
            <div className="th-col th-actions">Aksi</div>
          </div>

          <div className="playlist-table-body">
            {playlist.surahs.map((surah, index) => {
              const isThisSurahPlaying = currentTrack?.surahNumber === surah.nomor && isPlaying;
              return (
                <div
                  key={surah.nomor}
                  className={`playlist-row-item ${isThisSurahPlaying ? 'is-active' : ''}`}
                  onClick={() => handlePlaySurah(surah)}
                >
                  {/* Number or Equalizer */}
                  <div className="row-col row-index">
                    {isThisSurahPlaying ? (
                      <div className="equalizer-bars">
                        <span className="bar bar1" />
                        <span className="bar bar2" />
                        <span className="bar bar3" />
                      </div>
                    ) : (
                      <span className="index-num">{index + 1}</span>
                    )}
                    <button className="row-play-overlay-btn" title="Putar Surat Ini">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>

                  {/* Title & Info */}
                  <div className="row-col row-title">
                    <div className={`row-surah-cover ${getGradient(surah.nomor - 1)}`}>
                      <span className="surah-badge-num">{surah.nomor}</span>
                    </div>
                    <div className="row-surah-texts">
                      <div className="row-surah-name-latin">
                        {surah.namaLatin}
                        {isThisSurahPlaying && <span className="now-playing-tag">Sedang Diputar</span>}
                      </div>
                      <div className="row-surah-meaning">
                        {surah.arti}
                      </div>
                    </div>
                    <div className="row-surah-arabic">
                      {surah.nama}
                    </div>
                  </div>

                  {/* Verses Count */}
                  <div className="row-col row-verses">
                    <span className="verses-badge">{surah.jumlahAyat} Ayat</span>
                  </div>

                  {/* Actions */}
                  <div className="row-col row-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="row-remove-btn"
                      onClick={(e) => handleRemove(surah.nomor, surah.namaLatin, e)}
                      title={`Hapus ${surah.namaLatin} dari playlist`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Add Footer if user wants to add more */}
          <div className="playlist-more-suggestions">
            <div className="suggestions-header">
              <span className="suggestions-title">Tambahkan surat lain ke playlist ini</span>
              <button
                className="suggestions-browse-link"
                onClick={() => setIsAddModalOpen(true)}
              >
                Pilih Dari 114 Surat →
              </button>
            </div>
            <div className="suggestions-chips-row">
              {POPULAR_SURAHS.filter(nomor => !playlist.surahs.some(p => p.nomor === nomor)).slice(0, 4).map((nomor) => {
                const s = surahList.find(item => item.nomor === nomor);
                if (!s) return null;
                return (
                  <button
                    key={nomor}
                    className="suggestion-chip-btn"
                    onClick={() => handleToggleSurah(nomor)}
                  >
                    <span>+ {s.namaLatin}</span>
                    <span className="chip-sub">({s.jumlahAyat} ayat)</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* In-Place Surah Picker Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div
            className="modal-card playlist-picker-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="picker-modal-title"
          >
            {/* Header */}
            <div className="modal-header">
              <div className="modal-header-info">
                <div className={`playlist-preview-badge ${coverGradient}`}>
                  <span>{coverIcon}</span>
                </div>
                <div>
                  <h2 id="picker-modal-title" className="modal-title">
                    Tambah Surat ke &quot;{playlist.name}&quot;
                  </h2>
                  <p className="modal-subtitle">
                    Koleksi saat ini: <strong style={{ color: 'var(--text-primary)' }}>{playlist.surahs.length}</strong> surat
                  </p>
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setIsAddModalOpen(false)}
                aria-label="Tutup dialog"
                title="Tutup (Esc)"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="picker-search-bar">
              <div className="search-input-wrapper picker-input-wrapper">
                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.28c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z" />
                </svg>
                <input
                  className="search-input picker-search-input"
                  type="text"
                  placeholder="Ketik nomor surat (1-114), nama latin, arab, atau arti..."
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  autoFocus
                />
                {modalSearchQuery && (
                  <button
                    className="picker-clear-search"
                    onClick={() => setModalSearchQuery('')}
                    title="Hapus pencarian"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="picker-filter-tabs">
                {[
                  { id: 'all', label: 'Semua (114)' },
                  { id: 'popular', label: 'Populer' },
                  { id: 'juz30', label: "Juz 'Amma" },
                  { id: 'makkiyah', label: 'Makkiyah' },
                  { id: 'madaniyah', label: 'Madaniyah' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`picker-tab-btn ${modalFilterCategory === tab.id ? 'active' : ''}`}
                    onClick={() => setModalFilterCategory(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Surah List */}
            <div className="picker-surah-list">
              {filteredSurahsForModal.length === 0 ? (
                <div className="picker-empty-state">
                  <span style={{ fontSize: 32 }}>🔍</span>
                  <p>Tidak ada surat yang cocok dengan kata kunci</p>
                </div>
              ) : (
                filteredSurahsForModal.map((s) => {
                  const alreadyIn = playlist.surahs.some(p => p.nomor === s.nomor);
                  const isCurrentPlaying = currentTrack?.surahNumber === s.nomor && isPlaying;

                  return (
                    <div
                      key={s.nomor}
                      className={`picker-surah-row ${alreadyIn ? 'is-in-playlist' : ''}`}
                    >
                      <div className="picker-row-left">
                        <div className={`picker-surah-badge ${getGradient(s.nomor - 1)}`}>
                          <span>{s.nomor}</span>
                        </div>
                        <div className="picker-surah-texts">
                          <div className="picker-surah-name">
                            <span className="picker-name-latin">{s.namaLatin}</span>
                            <span className="picker-name-arabic">{s.nama}</span>
                          </div>
                          <div className="picker-surah-sub">
                            {s.arti} • {s.jumlahAyat} Ayat • {s.tempatTurun}
                          </div>
                        </div>
                      </div>

                      <div className="picker-row-right">
                        <button
                          type="button"
                          className="picker-preview-play-btn"
                          onClick={() => handlePlaySurah(s)}
                          title="Dengarkan preview"
                        >
                          {isCurrentPlaying ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <rect x="6" y="5" width="4" height="14" rx="1" />
                              <rect x="14" y="5" width="4" height="14" rx="1" />
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </button>

                        <button
                          type="button"
                          className={`picker-action-toggle-btn ${alreadyIn ? 'added' : 'add'}`}
                          onClick={() => handleToggleSurah(s.nomor)}
                        >
                          {alreadyIn ? (
                            <>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              <span>Tersimpan</span>
                            </>
                          ) : (
                            <>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                              </svg>
                              <span>Tambah</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-actions picker-modal-footer">
              <button
                type="button"
                className="btn-link-create"
                onClick={handleNavigateToSearch}
              >
                Buka di Halaman Pencarian Penuh →
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setIsAddModalOpen(false)}
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
