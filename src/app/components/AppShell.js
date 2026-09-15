'use client';

import { useApp } from '../context/AppContext';
import Sidebar from './Sidebar';
import NowPlayingBar from './NowPlayingBar';
import AmbientMixer from './AmbientMixer';
import HomePage from './HomePage';
import SearchPage from './SearchPage';
import SurahDetail from './SurahDetail';
import PlaylistDetail from './PlaylistDetail';
import LibraryPage from './LibraryPage';
import LandingPage from './LandingPage';
import CreatePlaylistModal from './CreatePlaylistModal';
import AddToPlaylistModal from './AddToPlaylistModal';
import MobileNav from './MobileNav';
import ContextMenu from './ContextMenu';
import Toast from './Toast';

function MainContent() {
  const { state, dispatch, QARI_MAP } = useApp();
  const { currentView } = state;

  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomePage />;
      case 'search': return <SearchPage />;
      case 'surah': return <SurahDetail />;
      case 'playlist': return <PlaylistDetail />;
      case 'library': return <LibraryPage />;
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
          <button
            className={`topbar-info-btn ${currentView === 'landing' || currentView === 'info' ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'landing' } })}
            title="Pusat Informasi & Panduan Web"
          >
            <img src="/logo.png" alt="Logo" className="topbar-info-logo" />
            <span>Info & Panduan Web</span>
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
      <CreatePlaylistModal />
      <AddToPlaylistModal />
      <ContextMenu />
      <Toast />
    </div>
  );
}
