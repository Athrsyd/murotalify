'use client';

import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import * as Tone from 'tone';

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

export const MUROTAL_EFFECT_PRESETS = [
  {
    id: 'nabawi',
    name: 'Tenang & Syahdu',
    emoji: '🕊️',
    tag: 'Rekomendasi',
    desc: 'Lantunan hangat menyejukkan hati dengan gema lembut dan hening',
    reverbDecay: 3.5,
    reverbWet: 0.35,
    delayWet: 0.15,
    delayTime: 0.25,
  },
  {
    id: 'haram',
    name: 'Megah & Luas',
    emoji: '🌌',
    tag: 'Agung',
    desc: 'Resonansi lapang dan bergetar di dada dengan gema ruangan luas',
    reverbDecay: 5.2,
    reverbWet: 0.45,
    delayWet: 0.20,
    delayTime: 0.28,
  },
  {
    id: 'kubah',
    name: 'Mendalam & Mengalun',
    emoji: '✨',
    tag: 'Gema Panjang',
    desc: 'Pantulan mengalun tinggi dengan resonansi yang panjang dan mendalam',
    reverbDecay: 6.5,
    reverbWet: 0.55,
    delayWet: 0.25,
    delayTime: 0.32,
  },
  {
    id: 'khusyuk',
    name: 'Jernih & Khidmat',
    emoji: '🎙️',
    tag: 'Fokus',
    desc: 'Suasana hening dengan artikulasi huruf tilawah yang jernih',
    reverbDecay: 2.0,
    reverbWet: 0.20,
    delayWet: 0.05,
    delayTime: 0.20,
  },
];

export const DEFAULT_EFFECT_SETTINGS = {
  reverbDecay: 3.5, // 1.0s - 8.0s
  reverbWet: 0.35,   // 0.0 - 1.0 (0% - 100%)
  delayWet: 0.15,    // 0.0 - 0.5 (0% - 50%)
  delayTime: 0.25,   // 0.1s - 0.5s (100ms - 500ms)
};

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
  
  // Murotal Effect Panel & Settings (Acoustics & Mosque Reverb)
  murotalEffectOpen: false,
  epicAmbience: false,
  effectPreset: 'nabawi',
  effectSettings: DEFAULT_EFFECT_SETTINGS,
  
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

export function getProxiedAudioUrl(url) {
  if (!url) return '';
  if (url.startsWith('/') || url.startsWith('blob:')) return url;
  if (url.includes('cdn.equran.id') || url.includes('equran.id')) {
    return `/api/audio?url=${encodeURIComponent(url)}`;
  }
  return url;
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
    
    case 'TOGGLE_EPIC_AMBIENCE': {
      const nextVal = !state.epicAmbience;
      if (typeof window !== 'undefined') {
        try { localStorage.setItem('murotal_epic_ambience', nextVal.toString()); } catch (e) {}
      }
      return { ...state, epicAmbience: nextVal };
    }
    case 'SET_EPIC_AMBIENCE': {
      if (typeof window !== 'undefined') {
        try { localStorage.setItem('murotal_epic_ambience', action.payload.toString()); } catch (e) {}
      }
      return { ...state, epicAmbience: action.payload };
    }
    case 'TOGGLE_MUROTAL_EFFECT_PANEL':
      return {
        ...state,
        murotalEffectOpen: !state.murotalEffectOpen,
        ambientOpen: false,
      };
    case 'SET_MUROTAL_EFFECT_OPEN':
      return { ...state, murotalEffectOpen: action.payload };
    case 'SET_EFFECT_SETTING': {
      const { key, value } = action.payload;
      const nextSettings = { ...state.effectSettings, [key]: value };
      if (typeof window !== 'undefined') {
        try { localStorage.setItem('murotal_effect_settings', JSON.stringify(nextSettings)); } catch (e) {}
      }
      return {
        ...state,
        effectSettings: nextSettings,
        effectPreset: 'custom',
      };
    }
    case 'APPLY_EFFECT_PRESET': {
      const preset = action.payload;
      const nextSettings = {
        reverbDecay: preset.reverbDecay,
        reverbWet: preset.reverbWet,
        delayWet: preset.delayWet,
        delayTime: preset.delayTime,
      };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('murotal_effect_settings', JSON.stringify(nextSettings));
          localStorage.setItem('murotal_effect_preset', preset.id);
        } catch (e) {}
      }
      return {
        ...state,
        effectSettings: nextSettings,
        effectPreset: preset.id,
      };
    }
    case 'RESET_EFFECT_SETTINGS': {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('murotal_effect_settings', JSON.stringify(DEFAULT_EFFECT_SETTINGS));
          localStorage.setItem('murotal_effect_preset', 'nabawi');
        } catch (e) {}
      }
      return {
        ...state,
        effectSettings: DEFAULT_EFFECT_SETTINGS,
        effectPreset: 'nabawi',
      };
    }
    case 'RESTORE_EFFECT_SETTINGS': {
      return {
        ...state,
        effectSettings: action.payload.settings,
        effectPreset: action.payload.preset || 'nabawi',
      };
    }
    
    case 'TOGGLE_AMBIENT':
      return {
        ...state,
        ambientOpen: !state.ambientOpen,
        murotalEffectOpen: false,
      };
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
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const audioRef = useRef(null);
  const ambientRefs = useRef({});
  const decayTimeoutRef = useRef(null);
  const toneNodesRef = useRef({
    sourceNode: null,
    dryGain: null,
    effectGain: null,
    delay: null,
    reverb: null,
    masterMurotalGain: null,
    isInitialized: false,
  });

  const ensureAudioContext = useCallback(async () => {
    if (typeof window === 'undefined') return;
    try {
      if (Tone.context.state !== 'running') {
        await Tone.start();
      }
    } catch (e) {
      console.warn('Tone.start error:', e);
    }
  }, []);

  const showToast = useCallback((message) => {
    dispatch({ type: 'SET_TOAST', payload: message });
    setTimeout(() => dispatch({ type: 'SET_TOAST', payload: null }), 3000);
  }, []);

  const toggleEpicAmbience = useCallback(() => {
    ensureAudioContext();
    const nextVal = !state.epicAmbience;
    dispatch({ type: 'TOGGLE_EPIC_AMBIENCE' });
    showToast(nextVal ? '✨ Gema Murotal: Aktif' : 'Gema Murotal: Nonaktif');
  }, [state.epicAmbience, ensureAudioContext, showToast]);

  const ensureToneGraph = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const current = toneNodesRef.current;
    if (
      current.isInitialized &&
      current.dryGain &&
      !current.dryGain.disposed &&
      current.masterMurotalGain &&
      !current.masterMurotalGain.disposed
    ) {
      return current;
    }

    try {
      const currentSettings = stateRef.current?.effectSettings ?? DEFAULT_EFFECT_SETTINGS;

      // FeedbackDelay: customizable delay time, feedback, and wet
      const delay = new Tone.FeedbackDelay({
        delayTime: currentSettings.delayTime,
        feedback: 0.15,
        wet: currentSettings.delayWet,
      });

      // Reverb: customizable decay, preDelay 0.02s, customizable wet
      const reverb = new Tone.Reverb({
        decay: currentSettings.reverbDecay,
        preDelay: 0.02,
        wet: currentSettings.reverbWet,
      });

      const currentVol = stateRef.current?.volume ?? initialState.volume;
      const currentEpic = stateRef.current?.epicAmbience ?? false;

      const masterMurotalGain = new Tone.Gain(currentVol);

      // Bypass switching gains
      const initialDry = currentEpic ? 0 : 1;
      const initialWet = currentEpic ? 1 : 0;
      const dryGain = new Tone.Gain(initialDry);
      const effectGain = new Tone.Gain(initialWet);

      // Dry bypass path: dryGain -> masterMurotalGain -> destination
      dryGain.connect(masterMurotalGain);

      // Effect path: effectGain -> delay -> reverb -> masterMurotalGain -> destination
      effectGain.connect(delay);
      delay.connect(reverb);
      reverb.connect(masterMurotalGain);

      masterMurotalGain.toDestination();

      const prevSource = current.sourceNode;
      if (prevSource) {
        try {
          Tone.connect(prevSource, dryGain);
          Tone.connect(prevSource, effectGain);
        } catch (e) {}
      }

      toneNodesRef.current = {
        sourceNode: prevSource || null,
        dryGain,
        effectGain,
        delay,
        reverb,
        masterMurotalGain,
        isInitialized: true,
      };

      if (typeof window !== 'undefined') {
        window.__tone = toneNodesRef.current;
      }

      return toneNodesRef.current;
    } catch (err) {
      console.error('Failed to initialize Tone.js audio graph:', err);
      return null;
    }
  }, []);

  const attachSourceNodeIfNeeded = useCallback((audio) => {
    if (!audio) return;
    const graph = ensureToneGraph();
    if (!graph) return;

    if (!graph.sourceNode) {
      try {
        const rawContext = Tone.getContext();
        const sourceNode = rawContext.createMediaElementSource(audio);
        const { dryGain, effectGain } = graph;
        if (dryGain && effectGain) {
          Tone.connect(sourceNode, dryGain);
          Tone.connect(sourceNode, effectGain);
        }
        graph.sourceNode = sourceNode;
        console.log('[Tone] MediaElementSource attached successfully');
      } catch (err) {
        console.warn('[Tone] Failed to attach MediaElementSource:', err);
      }
    }
  }, [ensureToneGraph]);

  const playTrack = useCallback(async (track) => {
    const audio = audioRef.current;
    if (!audio || !track || !track.audioUrl) return;

    // Immediately dispatch so UI updates instantly (active track title, playing state, etc.)
    dispatch({ type: 'SET_CURRENT_TRACK', payload: track });

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('murotal_last_track', JSON.stringify(track));
        localStorage.setItem('murotal_last_time', '0');
      } catch (e) {}
    }

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

    try {
      await ensureAudioContext();
      audio.crossOrigin = 'anonymous';
      const targetSrc = getProxiedAudioUrl(track.audioUrl);
      if (audio.src !== targetSrc && !audio.src.endsWith(targetSrc)) {
        audio.src = targetSrc;
      }
      attachSourceNodeIfNeeded(audio);
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error('[playTrack] Play error:', e);
      }
    }
  }, [ensureAudioContext, attachSourceNodeIfNeeded]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    await ensureAudioContext();
    const currentTrack = stateRef.current?.currentTrack;
    if (!audio.src && currentTrack?.audioUrl) {
      audio.crossOrigin = 'anonymous';
      audio.src = getProxiedAudioUrl(currentTrack.audioUrl);
    }
    attachSourceNodeIfNeeded(audio);
    if (audio.paused) {
      audio.play().catch(e => {
        if (e.name !== 'AbortError') console.error('Play error:', e);
      });
    } else {
      audio.pause();
    }
  }, [ensureAudioContext, attachSourceNodeIfNeeded]);

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

  // Initialize audio element, Tone audio graph, and load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = 'anonymous';
      audioRef.current.volume = initialState.volume;
    } else {
      audioRef.current.crossOrigin = 'anonymous';
    }
    if (typeof window !== 'undefined') {
      window.__audio = audioRef.current;
      window.__tone = toneNodesRef.current;
      window.__Tone = Tone;
    }

    // Restore Epic Ambience setting from localStorage
    let savedEpic = false;
    try {
      const epicStored = localStorage.getItem('murotal_epic_ambience');
      if (epicStored !== null) {
        savedEpic = epicStored === 'true';
        dispatch({ type: 'SET_EPIC_AMBIENCE', payload: savedEpic });
      }
    } catch (e) {}

    // Restore Custom Effect Settings from localStorage
    try {
      const savedPreset = localStorage.getItem('murotal_effect_preset');
      const savedSettings = localStorage.getItem('murotal_effect_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed && typeof parsed.reverbDecay === 'number') {
          dispatch({
            type: 'RESTORE_EFFECT_SETTINGS',
            payload: {
              settings: parsed,
              preset: savedPreset || 'custom',
            },
          });
        }
      }
    } catch (e) {}

    // Initialize Tone.js audio graph for Murotal tilawah (effect chain + bypass)
    ensureToneGraph();

    // Unlock Web Audio Context on first user interaction
    const unlockAudio = () => {
      ensureAudioContext();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('click', unlockAudio, { once: true, passive: true });
    window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
    window.addEventListener('keydown', unlockAudio, { once: true, passive: true });

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
            audioRef.current.crossOrigin = 'anonymous';
            audioRef.current.src = getProxiedAudioUrl(parsedTrack.audioUrl);
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

  // Synchronize bypass state with Tone.js gains
  useEffect(() => {
    const { dryGain, effectGain } = toneNodesRef.current;
    if (!dryGain || !effectGain || dryGain.disposed || effectGain.disposed) return;

    try {
      const now = Tone.now();
      if (state.epicAmbience) {
        dryGain.gain.rampTo(0, 0.06, now);
        effectGain.gain.rampTo(1, 0.06, now);
      } else {
        dryGain.gain.rampTo(1, 0.06, now);
        effectGain.gain.rampTo(0, 0.06, now);
      }
    } catch (err) {
      console.error('Tone bypass ramp error:', err);
    }
  }, [state.epicAmbience]);

  // Synchronize custom effect settings (reverb, echo) with Tone.js nodes in real-time
  useEffect(() => {
    const { delay, reverb } = toneNodesRef.current;
    if (!delay || !reverb || delay.disposed || reverb.disposed) return;

    try {
      const { reverbDecay, reverbWet, delayWet, delayTime } = state.effectSettings;
      const now = Tone.now();

      if (reverb.wet && typeof reverb.wet.rampTo === 'function') {
        reverb.wet.rampTo(reverbWet, 0.04, now);
      }
      if (delay.wet && typeof delay.wet.rampTo === 'function') {
        delay.wet.rampTo(delayWet, 0.04, now);
      }
      if (delay.delayTime && typeof delay.delayTime.rampTo === 'function') {
        delay.delayTime.rampTo(delayTime, 0.04, now);
      }

      // Reverb decay triggers impulse response regeneration, debounce slightly
      if (Math.abs(reverb.decay - reverbDecay) > 0.05) {
        if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current);
        decayTimeoutRef.current = setTimeout(() => {
          if (reverb && !reverb.disposed) {
            try {
              reverb.decay = reverbDecay;
            } catch (e) {}
          }
        }, 120);
      }
    } catch (err) {
      console.warn('Error applying effect settings to Tone nodes:', err);
    }

    return () => {
      if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current);
    };
  }, [state.effectSettings]);

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

  // Volume control (applies to HTMLMediaElement and Tone master gain)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
    const { masterMurotalGain } = toneNodesRef.current;
    if (masterMurotalGain && !masterMurotalGain.disposed) {
      try {
        masterMurotalGain.gain.rampTo(state.volume, 0.02);
      } catch (err) {}
    }
  }, [state.volume]);

  // Ambient sounds control - synchronized with murotal playback (remains dry and independent)
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
    toggleEpicAmbience,
    ensureAudioContext,
    QARI_MAP,
    GRADIENTS,
    getGradient,
    AMBIENT_SOUNDS,
    AMBIENT_PRESETS,
    MUROTAL_EFFECT_PRESETS,
    DEFAULT_EFFECT_SETTINGS,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
