'use client';

import { useApp } from '../context/AppContext';

export default function LibraryPage() {
  const { state, dispatch, playTrack, getGradient, QARI_MAP } = useApp();
  const { playlists, recentlyPlayed, surahList, selectedQari, currentTrack, isPlaying } = state;

  const handlePlayPlaylistDirect = (playlist, e) => {
    e.stopPropagation();
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
  };

  return (
    <div className="library-page-container">
      <div className="library-header-section">
        <div>
          <h1 className="library-main-title">Koleksi Saya</h1>
          <p className="library-subtitle">Kelola playlist favorit dan riwayat mendengarkan Al-Quran</p>
        </div>
        <button
          className="btn-primary library-create-btn"
          onClick={() => dispatch({ type: 'SHOW_CREATE_PLAYLIST', payload: true })}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Buat Playlist
        </button>
      </div>

      {/* Playlists Grid */}
      <div className="section-header">
        <h2 className="section-title">Playlist ({playlists.length})</h2>
      </div>

      <div className="playlist-cards-grid">
        {/* New Playlist Action Card */}
        <div
          className="create-playlist-card"
          onClick={() => dispatch({ type: 'SHOW_CREATE_PLAYLIST', payload: true })}
          role="button"
          tabIndex={0}
        >
          <div className="create-card-icon-circle">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <div className="create-card-title">Buat Playlist Baru</div>
          <div className="create-card-desc">Kumpulkan surat pilihanmu</div>
        </div>

        {/* Existing Playlists */}
        {playlists.map((playlist, i) => {
          const cardGradient = playlist.gradient || getGradient(i);
          const cardIcon = playlist.icon || (playlist.surahs.length > 0 ? '📖' : '♪');
          const isThisPlaylistPlaying = playlist.surahs.some(s => s.nomor === currentTrack?.surahNumber) && isPlaying;

          return (
            <div
              key={playlist.id}
              className="surah-card playlist-grid-card"
              onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'playlist', playlistId: playlist.id } })}
            >
              <div className="surah-card-cover">
                <div className={`surah-card-cover-gradient ${cardGradient}`}>
                  <div className="playlist-grid-cover-symbol">
                    {cardIcon}
                  </div>
                  <div className="playlist-grid-badge">
                    {playlist.surahs.length} Surat
                  </div>
                </div>

                {/* Hover Play Button */}
                {playlist.surahs.length > 0 && (
                  <button
                    className={`surah-card-play ${isThisPlaylistPlaying ? 'is-playing' : ''}`}
                    onClick={(e) => handlePlayPlaylistDirect(playlist, e)}
                    title={`Putar ${playlist.name}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="surah-card-title">{playlist.name}</div>
              <div className="surah-card-subtitle">
                {playlist.description ? playlist.description : `Koleksi ${playlist.surahs.length} surat`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <div className="section-header">
            <h2 className="section-title">Terakhir Diputar</h2>
          </div>
          <div className="surah-grid">
            {recentlyPlayed.map((item) => {
              const surah = surahList.find(s => s.nomor === item.nomor);
              if (!surah) return null;
              return (
                <div
                  key={item.nomor}
                  className="surah-card"
                  onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'surah', surahNumber: surah.nomor } })}
                >
                  <div className="surah-card-cover">
                    <div className={`surah-card-cover-gradient ${getGradient(surah.nomor - 1)}`}>
                      <div className="surah-card-number">{surah.nomor}</div>
                      <div className="surah-card-arabic">{surah.nama}</div>
                    </div>
                  </div>
                  <div className="surah-card-title">{surah.namaLatin}</div>
                  <div className="surah-card-subtitle">{surah.arti} • {surah.jumlahAyat} Ayat</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
