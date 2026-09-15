'use client';

import { useEffect, useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { fetchSurahDetail } from '../lib/api';
import { GeometricWatermark } from './PlaceholderCover';

const WATERMARK_TYPES = ['focus', 'recitations', 'sleep', 'ruqia'];
function getWatermarkType(nomor) {
  return WATERMARK_TYPES[(nomor - 1) % WATERMARK_TYPES.length];
}

export default function SurahDetail() {
  const { state, dispatch, playTrack, getGradient, QARI_MAP } = useApp();
  const { currentSurahNumber, selectedQari, currentTrack, isPlaying, surahList } = state;
  const [surahData, setSurahData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentSurahNumber) return;
    setLoading(true);
    fetchSurahDetail(currentSurahNumber)
      .then(data => {
        setSurahData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch surah detail:', err);
        setLoading(false);
      });
  }, [currentSurahNumber]);

  const handlePlayFull = useCallback(() => {
    if (!surahData) return;
    const surahInfo = surahList.find(s => s.nomor === surahData.nomor);
    const audioUrl = surahData.audioFull[selectedQari];
    playTrack({
      surahNumber: surahData.nomor,
      surahName: surahData.namaLatin,
      surahNameArab: surahData.nama,
      qariKey: selectedQari,
      audioUrl,
      type: 'full',
    });

    // Build queue from all surahs starting from this one
    const startIdx = Math.max(0, surahData.nomor - 1);
    const queue = surahList.slice(startIdx).map(s => ({
      surahNumber: s.nomor,
      surahName: s.namaLatin,
      surahNameArab: s.nama,
      qariKey: selectedQari,
      audioUrl: s.audioFull[selectedQari],
      type: 'full',
    }));
    dispatch({ type: 'SET_QUEUE', payload: queue });
  }, [surahData, selectedQari, surahList, playTrack, dispatch]);

  const handlePlayAyat = useCallback((ayat) => {
    if (!surahData) return;
    const audioUrl = ayat.audio[selectedQari];
    playTrack({
      surahNumber: surahData.nomor,
      surahName: surahData.namaLatin,
      surahNameArab: surahData.nama,
      qariKey: selectedQari,
      audioUrl,
      type: 'ayat',
      ayatNumber: ayat.nomorAyat,
    });

    // Build queue from ayat
    const queue = surahData.ayat.slice(ayat.nomorAyat - 1).map(a => ({
      surahNumber: surahData.nomor,
      surahName: surahData.namaLatin,
      surahNameArab: surahData.nama,
      qariKey: selectedQari,
      audioUrl: a.audio[selectedQari],
      type: 'ayat',
      ayatNumber: a.nomorAyat,
    }));
    dispatch({ type: 'SET_QUEUE', payload: queue });
  }, [surahData, selectedQari, playTrack, dispatch]);

  const handleAddToPlaylist = useCallback((playlistId) => {
    if (!surahData) return;
    const surah = surahList.find(s => s.nomor === surahData.nomor);
    if (!surah) return;
    dispatch({
      type: 'ADD_TO_PLAYLIST',
      payload: {
        playlistId,
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
    dispatch({ type: 'SET_TOAST', payload: `Ditambahkan ke playlist` });
    setTimeout(() => dispatch({ type: 'SET_TOAST', payload: null }), 3000);
  }, [surahData, surahList, dispatch]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    );
  }

  if (!surahData) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">Surah tidak ditemukan</div>
      </div>
    );
  }

  const isCurrentSurahPlaying = currentTrack?.surahNumber === surahData.nomor && isPlaying;

  return (
    <>
      {/* Header */}
      <div className="surah-detail-header">
        <div className={`surah-detail-cover ${getGradient(surahData.nomor - 1)}`}>
          <div className="surah-card-watermark">
            <GeometricWatermark type={getWatermarkType(surahData.nomor)} opacity={0.3} />
          </div>
          <div className="surah-card-number" style={{ fontSize: 72 }}>{surahData.nomor}</div>
          <div className="surah-card-arabic" style={{ fontSize: 32 }}>{surahData.nama}</div>
        </div>
        <div className="surah-detail-info">
          <div className="surah-detail-type">Surat • {surahData.tempatTurun}</div>
          <h1 className="surah-detail-title">{surahData.namaLatin}</h1>
          <div className="surah-detail-meta">
            <span>{surahData.arti}</span> • {surahData.jumlahAyat} Ayat • {QARI_MAP[selectedQari]}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="surah-detail-actions">
        <button className="play-btn-large" onClick={handlePlayFull}>
          {isCurrentSurahPlaying && currentTrack?.type === 'full' ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z" />
            </svg>
          )}
        </button>

        {/* Add to playlist button */}
        <button
          className="action-pill-btn surah-add-playlist-btn"
          onClick={() => {
            const surah = surahList.find(s => s.nomor === surahData.nomor) || surahData;
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
          }}
          title="Tambah Surat Ini ke Playlist"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Tambah ke Playlist</span>
        </button>
      </div>

      {/* Ayat List */}
      <div className="ayat-list-header">
        <span>#</span>
        <span>Ayat</span>
        <span style={{ textAlign: 'right' }}>Durasi</span>
      </div>

      {surahData.ayat.map((ayat) => {
        const isAyatPlaying = currentTrack?.surahNumber === surahData.nomor
          && currentTrack?.ayatNumber === ayat.nomorAyat
          && currentTrack?.type === 'ayat'
          && isPlaying;

        return (
          <div
            key={ayat.nomorAyat}
            className={`ayat-item ${isAyatPlaying ? 'playing' : ''}`}
            onClick={() => handlePlayAyat(ayat)}
          >
            <div className="ayat-number">
              {isAyatPlaying ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--accent-green)">
                  <path d="M1 7.5v4h2v-4H1zm4-3v7h2v-7H5zm4-3v10h2V1.5H9z"/>
                </svg>
              ) : (
                ayat.nomorAyat
              )}
            </div>
            <div className="ayat-text-content">
              <div className="ayat-text-arab">{ayat.teksArab}</div>
              <div className="ayat-text-latin">{ayat.teksLatin}</div>
              <div className="ayat-text-translation">{ayat.teksIndonesia}</div>
            </div>
            <div className="ayat-duration">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--text-secondary)" style={{ opacity: 0.5 }}>
                <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z"/>
                <path d="M8 3.25a.75.75 0 01.75.75v3.25H11a.75.75 0 010 1.5H7.25V4A.75.75 0 018 3.25z"/>
              </svg>
            </div>
          </div>
        );
      })}
    </>
  );
}
