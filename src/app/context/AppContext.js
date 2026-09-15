'use client';

import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';

const QARI_MAP = {
  '01': 'Abdullah Al-Juhany',
  '02': 'Abdul Muhsin Al-Qasim',
  '03': 'Abdurrahman As-Sudais',
  '04': 'Ibrahim Al-Dossari',
  '05': 'Misyari Rasyid Al-Afasy',
  '06': 'Yasser Al-Dosari',
};

const GRADIENTS = [
  'gradient-emerald', 'gradient-teal', 'gradient-blue', 'gradient-indigo',
  'gradient-purple', 'gradient-rose', 'gradient-amber', 'gradient-cyan',
  'gradient-gold', 'gradient-sky',
];

function getGradient(index) {
  return GRADIENTS[index % GRADIENTS.length];
}

const AMBIENT_SOUNDS = [
  { id: 'rain', name: 'Suara Hujan', emoji: '🌧️', url: '/sounds/rain.mp3', desc: 'Rintik hujan menenangkan' },
  { id: 'water', name: 'Air Mengalir', emoji: '💧', url: '/sounds/water.mp3', desc: 'Aliran sungai jernih' },
  { id: 'nature', name: 'Suara Alam', emoji: '🍃', url: '/sounds/nature.mp3', desc: 'Hutan & gemerisik dedaunan' },
  { id: 'bird', name: 'Kicauan Burung', emoji: '🐦', url: '/sounds/bird.mp3', desc: 'Kicauan burung pagi hari' },
  { id: 'water-drop', name: 'Tetesan Air', emoji: '🫧', url: '/sounds/water-drop.mp3', desc: 'Tetesan air hening & jernih' },
];

const AMBIENT_PRESETS = [
  { name: 'Hujan Damai', sounds: { rain: 0.65 } },
  { name: 'Sungai Asri', sounds: { water: 0.7 } },
  { name: 'Kicauan Pagi', sounds: { bird: 0.7, nature: 0.4 } },
  { name: 'Tetesan Hening', sounds: { 'water-drop': 0.65, water: 0.35 } },
  { name: 'Harmoni Alam', sounds: { rain: 0.3, water: 0.3, bird: 0.45, nature: 0.35 } },
];

const initialState = {
  // Data
  surahList: [],
  currentSurahDetail: null,
  loading: false,
  
  // Navigation
  currentView: 'home', // home, search, surah, playlist, library
  currentSurahNumber: null,
  currentPlaylistId: null,
  navHistory: [],
  
  // Player
  isPlaying: false,
  currentTrack: null, // { surahNumber, surahName, surahNameArab, qariKey, audioUrl, type: 'full' | 'ayat', ayatNumber }
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  isShuffle: false,
  repeatMode: 'off', // off, all, one
  queue: [],
  
  // Qari
  selectedQari: '05', // Default Misyari Rasyid Al-Afasy
  
  // Ambient
  ambientOpen: false,
  ambientSounds: AMBIENT_SOUNDS.reduce((acc, s) => {
    acc[s.id] = { active: false, volume: 0.5 };
    return acc;
  }, {}),
  activePreset: null,
  
  // Playlists
  playlists: [],
  
  // Recently Played
  recentlyPlayed: [],
  
  // Search
  searchQuery: '',
  
  // UI
  showCreatePlaylist: false,
  addToPlaylistSurah: null, // Holds { nomor, nama, namaLatin, jumlahAyat, arti, audioFull }
  targetPlaylistId: null, // Tracks target playlist when user is adding surahs
  contextMenu: null,
  toast: null,
};

function savePlaylistsToStorage(playlists) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('murotal_playlists', JSON.stringify(playlists));
    } catch (e) {
      console.error('Error saving playlists to localStorage:', e);
    }
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SURAH_LIST':
      return { ...state, surahList: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CURRENT_SURAH_DETAIL':
      return { ...state, currentSurahDetail: action.payload, loading: false };
    
    case 'NAVIGATE': {
      const newHistory = [...state.navHistory, { view: state.currentView, surahNumber: state.currentSurahNumber, playlistId: state.currentPlaylistId }];
      return {
        ...state,
        currentView: action.payload.view,
        currentSurahNumber: action.payload.surahNumber || null,
        currentPlaylistId: action.payload.playlistId || null,
        navHistory: newHistory,
      };
    }
    case 'GO_BACK': {
      if (state.navHistory.length === 0) return state;
      const prev = state.navHistory[state.navHistory.length - 1];
      return {
        ...state,
        currentView: prev.view,
        currentSurahNumber: prev.surahNumber,
        currentPlaylistId: prev.playlistId,
        navHistory: state.navHistory.slice(0, -1),
      };
    }
    
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_CURRENT_TRACK': {
      if (typeof window !== 'undefined' && action.payload) {
        try {
          localStorage.setItem('murotal_last_track', JSON.stringify(action.payload));
        } catch (e) {}
      }
      return { ...state, currentTrack: action.payload, isPlaying: true };
    }
    case 'RESTORE_LAST_TRACK': {
      return {
        ...state,
        currentTrack: action.payload.track,
        currentTime: action.payload.time || 0,
        isPlaying: false,
      };
    }
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_VOLUME':
      if (typeof window !== 'undefined') {
        try { localStorage.setItem('murotal_volume', action.payload.toString()); } catch (e) {}
      }
      return { ...state, volume: action.payload };
    case 'TOGGLE_SHUFFLE':
      return { ...state, isShuffle: !state.isShuffle };
    case 'TOGGLE_REPEAT':
      return { ...state, repeatMode: state.repeatMode === 'off' ? 'all' : state.repeatMode === 'all' ? 'one' : 'off' };
    case 'SET_QUEUE': {
      if (typeof window !== 'undefined' && Array.isArray(action.payload) && action.payload.length > 0) {
        try {
          localStorage.setItem('murotal_queue', JSON.stringify(action.payload));
        } catch (e) {}
      }
      return { ...state, queue: action.payload };
    }
    
    case 'SET_SELECTED_QARI':
      if (typeof window !== 'undefined') {
        try { localStorage.setItem('murotal_selected_qari', action.payload); } catch (e) {}
      }
      return { ...state, selectedQari: action.payload };
    
    case 'TOGGLE_AMBIENT':
      return { ...state, ambientOpen: !state.ambientOpen };
    case 'SET_AMBIENT_OPEN':
      return { ...state, ambientOpen: action.payload };
    case 'SET_AMBIENT_SOUND': {
      const { id, ...rest } = action.payload;
      return {
        ...state,
        ambientSounds: {
          ...state.ambientSounds,
          [id]: { ...state.ambientSounds[id], ...rest },
        },
        activePreset: null,
      };
    }
    case 'SET_AMBIENT_PRESET':
      return { ...state, activePreset: action.payload };
    case 'APPLY_AMBIENT_PRESET': {
      const preset = action.payload;
      const newSounds = {};
      AMBIENT_SOUNDS.forEach(s => {
        const vol = preset.sounds[s.id] || 0;
        newSounds[s.id] = { active: vol > 0, volume: vol || 0.5 };
      });
      return { ...state, ambientSounds: newSounds, activePreset: preset.name };
    }
    
    case 'SET_PLAYLISTS':
      return { ...state, playlists: action.payload };
    case 'ADD_PLAYLIST': {
      const nextPlaylists = [...state.playlists, action.payload];
      savePlaylistsToStorage(nextPlaylists);
      return { ...state, playlists: nextPlaylists, showCreatePlaylist: false };
    }
    case 'DELETE_PLAYLIST': {
      const nextPlaylists = state.playlists.filter(p => p.id !== action.payload);
      savePlaylistsToStorage(nextPlaylists);
      return { ...state, playlists: nextPlaylists };
    }
    case 'ADD_TO_PLAYLIST': {
      const { playlistId, surah } = action.payload;
      const nextPlaylists = state.playlists.map(p => {
        if (p.id !== playlistId) return p;
        if (p.surahs.some(s => s.nomor === surah.nomor)) return p;
        return { ...p, surahs: [...p.surahs, surah] };
      });
      savePlaylistsToStorage(nextPlaylists);
      return { ...state, playlists: nextPlaylists };
    }
    case 'REMOVE_FROM_PLAYLIST': {
      const { playlistId: pid, surahNomor } = action.payload;
      const nextPlaylists = state.playlists.map(p =>
        p.id === pid ? { ...p, surahs: p.surahs.filter(s => s.nomor !== surahNomor) } : p
      );
      savePlaylistsToStorage(nextPlaylists);
      return { ...state, playlists: nextPlaylists };
    }
    
    case 'ADD_RECENTLY_PLAYED': {
      const filtered = state.recentlyPlayed.filter(r => r.nomor !== action.payload.nomor);
      const nextRecent = [action.payload, ...filtered].slice(0, 20);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('murotal_recently_played', JSON.stringify(nextRecent));
        } catch (e) {}
      }
      return { ...state, recentlyPlayed: nextRecent };
    }
    case 'SET_RECENTLY_PLAYED':
      return { ...state, recentlyPlayed: action.payload };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SHOW_CREATE_PLAYLIST':
      return { ...state, showCreatePlaylist: action.payload };
    case 'OPEN_ADD_TO_PLAYLIST':
      return { ...state, addToPlaylistSurah: action.payload };
    case 'CLOSE_ADD_TO_PLAYLIST':
      return { ...state, addToPlaylistSurah: null };
    case 'SET_TARGET_PLAYLIST':
      return { ...state, targetPlaylistId: action.payload };
    case 'SET_CONTEXT_MENU':
      return { ...state, contextMenu: action.payload };
    case 'SET_TOAST':
      return { ...state, toast: action.payload };
    
    default:
      return state;
  }
}

const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const audioRef = useRef(null);
  const ambientRefs = useRef({});

  const playTrack = useCallback((track) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.src = track.audioUrl;
    audio.play().catch(e => console.error('Play error:', e));
    dispatch({ type: 'SET_CURRENT_TRACK', payload: track });
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('murotal_last_track', JSON.stringify(track));
        localStorage.setItem('murotal_last_time', '0');
      } catch (e) {}
    }
    
    // Add to recently played
    if (track.type === 'full') {
      dispatch({
        type: 'ADD_RECENTLY_PLAYED',
        payload: {
          nomor: track.surahNumber,
          nama: track.surahNameArab,
          namaLatin: track.surahName,
          timestamp: Date.now(),
        },
      });
    }
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.src && state.currentTrack?.audioUrl) {
      audio.src = state.currentTrack.audioUrl;
    }
    if (audio.paused) {
      audio.play().catch(e => console.error('Play error:', e));
    } else {
      audio.pause();
    }
  }, [state.currentTrack]);

  const seek = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const playNext = useCallback(() => {
    if (state.queue.length === 0) return;
    const currentIndex = state.queue.findIndex(
      t => t.surahNumber === state.currentTrack?.surahNumber && t.ayatNumber === state.currentTrack?.ayatNumber
    );
    let nextIndex;
    if (state.isShuffle) {
      nextIndex = Math.floor(Math.random() * state.queue.length);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= state.queue.length) {
        if (state.repeatMode === 'all') {
          nextIndex = 0;
        } else {
          dispatch({ type: 'SET_PLAYING', payload: false });
          return;
        }
      }
    }
    if (state.queue[nextIndex]) {
      playTrack(state.queue[nextIndex]);
    }
  }, [state.queue, state.currentTrack, state.isShuffle, state.repeatMode, playTrack]);

  const playPrev = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    
    if (state.queue.length === 0) return;
    const currentIndex = state.queue.findIndex(
      t => t.surahNumber === state.currentTrack?.surahNumber && t.ayatNumber === state.currentTrack?.ayatNumber
    );
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0 && state.queue[prevIndex]) {
      playTrack(state.queue[prevIndex]);
    }
  }, [state.queue, state.currentTrack, playTrack]);

  const showToast = useCallback((message) => {
    dispatch({ type: 'SET_TOAST', payload: message });
    setTimeout(() => dispatch({ type: 'SET_TOAST', payload: null }), 3000);
  }, []);

  // Initialize audio element and load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = initialState.volume;
    }

    try {
      // 1. Playlists
      const playlists = localStorage.getItem('murotal_playlists');
      if (playlists) {
        const parsed = JSON.parse(playlists);
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: 'SET_PLAYLISTS', payload: parsed });
        }
      }
      
      // 2. Recently Played
      const recent = localStorage.getItem('murotal_recently_played');
      if (recent) {
        const parsedRecent = JSON.parse(recent);
        if (Array.isArray(parsedRecent)) {
          dispatch({ type: 'SET_RECENTLY_PLAYED', payload: parsedRecent });
        }
      }
      
      // 3. Selected Qari
      const qari = localStorage.getItem('murotal_selected_qari');
      if (qari) dispatch({ type: 'SET_SELECTED_QARI', payload: qari });
      
      // 4. Volume
      const vol = localStorage.getItem('murotal_volume');
      if (vol) {
        const parsedVol = parseFloat(vol);
        dispatch({ type: 'SET_VOLUME', payload: parsedVol });
        if (audioRef.current) audioRef.current.volume = parsedVol;
      }

      // 5. Restore Last Played Track from localStorage
      const lastTrack = localStorage.getItem('murotal_last_track');
      if (lastTrack) {
        const parsedTrack = JSON.parse(lastTrack);
        if (parsedTrack && parsedTrack.audioUrl) {
          const lastTimeStr = localStorage.getItem('murotal_last_time');
          const lastTime = lastTimeStr ? parseFloat(lastTimeStr) : 0;

          dispatch({
            type: 'RESTORE_LAST_TRACK',
            payload: { track: parsedTrack, time: lastTime },
          });

          if (audioRef.current) {
            audioRef.current.src = parsedTrack.audioUrl;
            audioRef.current.preload = 'metadata';
            if (lastTime > 0) {
              const handleLoaded = () => {
                if (audioRef.current) {
                  audioRef.current.currentTime = lastTime;
                }
                audioRef.current?.removeEventListener('loadedmetadata', handleLoaded);
              };
              audioRef.current.addEventListener('loadedmetadata', handleLoaded);
            }
          }
        }
      }

      // 6. Restore Queue
      const savedQueue = localStorage.getItem('murotal_queue');
      if (savedQueue) {
        const parsedQueue = JSON.parse(savedQueue);
        if (Array.isArray(parsedQueue) && parsedQueue.length > 0) {
          dispatch({ type: 'SET_QUEUE', payload: parsedQueue });
        }
      }
    } catch (e) {
      console.error('Error loading from localStorage:', e);
    }
  }, []);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      dispatch({ type: 'SET_CURRENT_TIME', payload: audio.currentTime });
      // Throttled persist every 2 seconds
      if (Math.floor(audio.currentTime) % 2 === 0) {
        try {
          localStorage.setItem('murotal_last_time', audio.currentTime.toString());
        } catch (e) {}
      }
    };
    const onDurationChange = () => dispatch({ type: 'SET_DURATION', payload: audio.duration || 0 });
    const onLoadedMetadata = () => dispatch({ type: 'SET_DURATION', payload: audio.duration || 0 });
    const onEnded = () => {
      if (state.repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };
    const onPause = () => {
      dispatch({ type: 'SET_PLAYING', payload: false });
      try {
        localStorage.setItem('murotal_last_time', audio.currentTime.toString());
      } catch (e) {}
    };
    const onPlay = () => dispatch({ type: 'SET_PLAYING', payload: true });

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('play', onPlay);

    const onBeforeUnload = () => {
      if (audio && audio.currentTime > 0) {
        try {
          localStorage.setItem('murotal_last_time', audio.currentTime.toString());
        } catch (e) {}
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('play', onPlay);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [state.repeatMode, state.queue, state.currentTrack, playNext]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
  }, [state.volume]);

  // Ambient sounds control - synchronized with murotal playback
  useEffect(() => {
    AMBIENT_SOUNDS.forEach(sound => {
      const config = state.ambientSounds[sound.id];
      if (!config) return;
      let audioEl = ambientRefs.current[sound.id];
      
      // Ambient only plays if active AND murotal is playing
      if (config.active && state.isPlaying) {
        if (!audioEl) {
          audioEl = new Audio(sound.url);
          audioEl.loop = true;
          ambientRefs.current[sound.id] = audioEl;
        }
        audioEl.volume = config.volume;
        if (audioEl.paused) {
          audioEl.play().catch(() => {});
        }
      } else {
        if (audioEl && !audioEl.paused) {
          audioEl.pause();
        }
      }
    });
  }, [state.ambientSounds, state.isPlaying]);

  const value = {
    state,
    dispatch,
    playTrack,
    togglePlay,
    seek,
    playNext,
    playPrev,
    showToast,
    QARI_MAP,
    GRADIENTS,
    getGradient,
    AMBIENT_SOUNDS,
    AMBIENT_PRESETS,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
