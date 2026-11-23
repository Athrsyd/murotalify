'use client';

import { useSyncExternalStore } from 'react';
import { useApp } from '../context/AppContext';
import { getQuotaStats, getServerQuotaStats, subscribeQuota, formatBytes } from '../lib/quotaTracker';
import Sidebar from './Sidebar';
import NowPlayingBar from './NowPlayingBar';
import AmbientMixer from './AmbientMixer';
import MurotalEffectPanel from './MurotalEffectPanel';
import HomePage from './HomePage';
import SearchPage from './SearchPage';
import SurahDetail from './SurahDetail';
import PlaylistDetail from './PlaylistDetail';
import LibraryPage from './LibraryPage';
import LandingPage from './LandingPage';
import QuotaPage from './QuotaPage';
import CreatePlaylistModal from './CreatePlaylistModal';
import AddToPlaylistModal from './AddToPlaylistModal';
import MobileNav from './MobileNav';
import ContextMenu from './ContextMenu';
import Toast from './Toast';

function MainContent() {
  const { state, dispatch, QARI_MAP, toggleTheme } = useApp();
  const { currentView, theme } = state;
  const quotaStats = useSyncExternalStore(
    subscribeQuota,
    getQuotaStats,
    getServerQuotaStats
  );

  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomePage />;
      case 'search': return <SearchPage />;
      case 'surah': return <SurahDetail />;
      case 'playlist': return <PlaylistDetail />;
      case 'library': return <LibraryPage />;
      case 'quota': return <QuotaPage />;
      case 'landing':
      case 'info': return <LandingPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="main-content">
      {/* Top Bar */}
      <div className="topbar">
        <div className="topbar-nav-buttons">
          <button
            className="topbar-nav-btn"
            onClick={() => dispatch({ type: 'GO_BACK' })}
            disabled={state.navHistory.length === 0}
            title="Kembali"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.03.47a.75.75 0 0 1 0 1.06L4.56 8l6.47 6.47a.75.75 0 1 1-1.06 1.06L2.44 8 9.97.47a.75.75 0 0 1 1.06 0z" />
            </svg>
          </button>
        </div>

        <div className="topbar-right">
          {/* Quota Quick Pill Button */}
          <button
            className={`topbar-quota-btn ${currentView === 'quota' ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'quota' } })}
            title="Penggunaan Kuota Hari Ini & Penghematan Cache"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span className="topbar-quota-text" suppressHydrationWarning>
              <span className="topbar-quota-label">Kuota: </span>
              {formatBytes(quotaStats.bytesUsed || 0)}
            </span>
          </button>

          {/* Theme Toggle Button */}
          <button
            className="topbar-theme-btn"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Beralih ke Mode Gelap' : 'Beralih ke Mode Terang'}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          <button
            className={`topbar-info-btn ${currentView === 'landing' || currentView === 'info' ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'landing' } })}
            title="Pusat Informasi & Panduan Web"
          >
            <img src="/logo.png" alt="Logo" className="topbar-info-logo" />
            <span className="topbar-info-text">Info</span>
          </button>

          <select
            className="topbar-qari-select"
            value={state.selectedQari}
            onChange={(e) => dispatch({ type: 'SET_SELECTED_QARI', payload: e.target.value })}
          >
            {Object.entries(QARI_MAP).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="main-content-inner">
        {renderView()}
      </div>
    </div>
  );
}

export default function AppShell() {
  return (
    <div className="app-layout">
      <Sidebar />
      <MainContent />
      <NowPlayingBar />
      <MobileNav />
      <AmbientMixer />
      <MurotalEffectPanel />
      <CreatePlaylistModal />
      <AddToPlaylistModal />
      <ContextMenu />
      <Toast />
    </div>
  );
}
