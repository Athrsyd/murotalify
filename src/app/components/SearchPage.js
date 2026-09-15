'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { fetchAllSurahs } from '../lib/api';
import { GeometricWatermark } from './PlaceholderCover';

const WATERMARK_TYPES = ['focus', 'recitations', 'sleep', 'ruqia'];
function getWatermarkType(nomor) {
  return WATERMARK_TYPES[(nomor - 1) % WATERMARK_TYPES.length];
}

export default function SearchPage() {
  const { state, dispatch, playTrack, getGradient, showToast } = useApp();
  const { surahList, searchQuery, selectedQari, targetPlaylistId, playlists } = state;

  const targetPlaylist = playlists.find(p => p.id === targetPlaylistId);

  useEffect(() => {
    if (surahList.length === 0) {
      fetchAllSurahs()
        .then(data => dispatch({ type: 'SET_SURAH_LIST', payload: data }))
        .catch(err => console.error('Failed to fetch surahs:', err));
    }
  }, [surahList.length, dispatch]);

  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return surahList;
    const q = searchQuery.toLowerCase().trim();
    return surahList.filter(s =>
      s.namaLatin.toLowerCase().includes(q) ||
      s.nama.includes(q) ||
      s.arti.toLowerCase().includes(q) ||
      s.nomor.toString() === q
    );
  }, [surahList, searchQuery]);

  const handlePlaySurah = useCallback((surah, e) => {
    e.stopPropagation();
    playTrack({
      surahNumber: surah.nomor,
      surahName: surah.namaLatin,
      surahNameArab: surah.nama,
      qariKey: selectedQari,
      audioUrl: surah.audioFull[selectedQari],
      type: 'full',
    });
  }, [selectedQari, playTrack]);

  const handleCardClick = useCallback((surah) => {
    dispatch({ type: 'NAVIGATE', payload: { view: 'surah', surahNumber: surah.nomor } });
  }, [dispatch]);

  const handleAddToPlaylist = useCallback((surah, e) => {
    e.stopPropagation();
    if (targetPlaylist) {
      const isAlreadyIn = targetPlaylist.surahs.some(s => s.nomor === surah.nomor);
      if (isAlreadyIn) {
        dispatch({
          type: 'REMOVE_FROM_PLAYLIST',
          payload: { playlistId: targetPlaylist.id, surahNomor: surah.nomor },
        });
        showToast(`${surah.namaLatin} dihapus dari ${targetPlaylist.name}`);
      } else {
        dispatch({
          type: 'ADD_TO_PLAYLIST',
          payload: {
            playlistId: targetPlaylist.id,
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
        showToast(`${surah.namaLatin} ditambahkan ke ${targetPlaylist.name}`);
      }
    } else {
      // Global add: open the AddToPlaylistModal
      dispatch({
        type: 'OPEN_ADD_TO_PLAYLIST',
        payload: {
          nomor: surah.nomor,
          nama: surah.nama,
          namaLatin: surah.namaLatin,
          jumlahAyat: surah.jumlahAyat,
          arti: surah.arti,
          audioFull: surah.audioFull,
        },
      });
    }
  }, [targetPlaylist, dispatch, showToast]);

  return (
    <>
      {/* Target Playlist Mode Banner */}
      {targetPlaylist && (
        <div className="target-playlist-banner">
          <div className="target-playlist-info">
            <span className="target-icon">📁</span>
            <div>
              <div className="target-title">
                Mode Tambah Surat ke: <strong>{targetPlaylist.name}</strong>
              </div>
              <div className="target-desc">
                {targetPlaylist.surahs.length} surat dalam playlist ini • Klik tombol <strong>+</strong> pada surat untuk menambahkan
              </div>
            </div>
          </div>
          <button
            className="btn-secondary target-finish-btn"
            onClick={() => {
              dispatch({ type: 'SET_TARGET_PLAYLIST', payload: null });
              dispatch({ type: 'NAVIGATE', payload: { view: 'playlist', playlistId: targetPlaylist.id } });
            }}
          >
            Selesai & Kembali ke Playlist
          </button>
        </div>
      )}

      {/* Search Input */}
      <div style={{ marginBottom: 32 }}>
        <div className="search-input-wrapper" style={{ maxWidth: 480 }}>
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.28c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z" />
          </svg>
          <input
            className="search-input"
            type="text"
            placeholder="Cari surat, nama latin, nomor, atau arti..."
            value={searchQuery}
            onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
            autoFocus
          />
        </div>
      </div>

      {/* Results */}
      {searchQuery.trim() && filteredSurahs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-title">Tidak ditemukan</div>
          <div className="empty-state-text">
            Tidak ada surat yang cocok dengan &quot;{searchQuery}&quot;
          </div>
        </div>
      ) : (
        <>
          <div className="section-header">
            <h2 className="section-title">
              {searchQuery.trim() ? `Hasil Pencarian (${filteredSurahs.length})` : 'Semua Surat'}
            </h2>
          </div>
          <div className="surah-grid">
            {filteredSurahs.map((surah) => {
              const isAddedToTarget = targetPlaylist && targetPlaylist.surahs.some(s => s.nomor === surah.nomor);

              return (
                <div
                  key={surah.nomor}
                  className={`surah-card ${isAddedToTarget ? 'is-target-added' : ''}`}
                  onClick={() => handleCardClick(surah)}
                >
                  <div className="surah-card-cover">
                    <div className={`surah-card-cover-gradient ${getGradient(surah.nomor - 1)}`}>
                      <div className="surah-card-watermark">
                        <GeometricWatermark type={getWatermarkType(surah.nomor)} opacity={0.25} />
                      </div>
                      <div className="surah-card-number">{surah.nomor}</div>
                      <div className="surah-card-arabic">{surah.nama}</div>
                    </div>
                  </div>
                  <div className="surah-card-title">{surah.namaLatin}</div>
                  <div className="surah-card-subtitle">
                    {surah.arti} • {surah.jumlahAyat} Ayat • {surah.tempatTurun}
                  </div>

                  {/* Card Action Buttons (Play & Add to Playlist) */}
                  <div className="surah-card-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="surah-card-play"
                      onClick={(e) => handlePlaySurah(surah, e)}
                      aria-label={`Putar ${surah.namaLatin}`}
                      title="Putar Surat"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z" />
                      </svg>
                    </button>

                    <button
                      className={`surah-card-add-btn ${isAddedToTarget ? 'is-added' : ''}`}
                      onClick={(e) => handleAddToPlaylist(surah, e)}
                      aria-label={`Tambah ${surah.namaLatin} ke playlist`}
                      title={
                        targetPlaylist
                          ? isAddedToTarget
                            ? `Sudah ada di ${targetPlaylist.name} (klik untuk hapus)`
                            : `Tambah ke ${targetPlaylist.name}`
                          : 'Tambah ke Playlist'
                      }
                    >
                      {isAddedToTarget ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
