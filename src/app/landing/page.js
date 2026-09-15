'use client';

import { AppProvider } from '../context/AppContext';
import LandingPage from '../components/LandingPage';
import NowPlayingBar from '../components/NowPlayingBar';
import AmbientMixer from '../components/AmbientMixer';
import Toast from '../components/Toast';

export default function StandaloneLanding() {
  return (
    <AppProvider>
      <div className="standalone-landing-wrap">
        <header className="standalone-header">
          <div className="standalone-header-brand" onClick={() => window.location.href = '/'}>
            <div className="sidebar-logo-icon">
              <img src="/logo.png" alt="Murotalify Logo" className="sidebar-logo-img" />
            </div>
            <div className="sidebar-logo-title-wrap">
              <span className="sidebar-logo-text">Murotalify</span>
              <span className="sidebar-logo-badge">Al-Quran & Alam</span>
            </div>
          </div>

          <div className="standalone-header-nav">
            <a href="#info-search-section" className="standalone-header-link">Pusat Informasi</a>
            <button className="standalone-play-cta" onClick={() => window.location.href = '/'}>
              <span>▶ Buka Pemutar</span>
            </button>
          </div>
        </header>

        <main style={{ paddingBottom: 100 }}>
          <LandingPage standalone={true} />
        </main>

        <NowPlayingBar />
        <AmbientMixer />
        <Toast />
      </div>
    </AppProvider>
  );
}
