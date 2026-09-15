'use client';

import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const PLAYLIST_ICONS = [
  { emoji: '📖', label: 'Mushaf' },
  { emoji: '🌙', label: 'Malam' },
  { emoji: '🕊️', label: 'Damai' },
  { emoji: '💧', label: 'Sejuk' },
  { emoji: '⭐', label: 'Favorit' },
  { emoji: '🌿', label: 'Hening' },
  { emoji: '🕌', label: 'Masjid' },
  { emoji: '✨', label: 'Tadabbur' },
];

const GRADIENT_PRESETS = [
  { id: 'gradient-emerald', name: 'Emerald', color: '#10b981' },
  { id: 'gradient-teal', name: 'Teal', color: '#14b8a6' },
  { id: 'gradient-blue', name: 'Ocean', color: '#3b82f6' },
  { id: 'gradient-indigo', name: 'Deep Sea', color: '#6366f1' },
  { id: 'gradient-purple', name: 'Amethyst', color: '#a855f7' },
  { id: 'gradient-rose', name: 'Rose', color: '#f43f5e' },
  { id: 'gradient-amber', name: 'Amber', color: '#f59e0b' },
  { id: 'gradient-gold', name: 'Gold', color: '#eab308' },
];

export default function CreatePlaylistModal() {
  const { state, dispatch, showToast } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('📖');
  const [selectedGradient, setSelectedGradient] = useState('gradient-emerald');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && state.showCreatePlaylist) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.showCreatePlaylist]);

  if (!state.showCreatePlaylist) return null;

  const handleCreate = () => {
    if (!name.trim()) return;
    const newPlaylist = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      icon: selectedIcon,
      gradient: selectedGradient,
      surahs: [],
      createdAt: Date.now(),
    };
    dispatch({ type: 'ADD_PLAYLIST', payload: newPlaylist });
    showToast(`Playlist "${newPlaylist.name}" berhasil dibuat`);
    setName('');
    setDescription('');
    setSelectedIcon('📖');
    setSelectedGradient('gradient-emerald');
  };

  const handleClose = () => {
    dispatch({ type: 'SHOW_CREATE_PLAYLIST', payload: false });
    setName('');
    setDescription('');
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div 
        className="modal-card playlist-create-modal" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-playlist-title"
      >
        {/* Header with Close button */}
        <div className="modal-header">
          <div className="modal-header-info">
            <div className={`playlist-preview-badge ${selectedGradient}`}>
              <span>{selectedIcon}</span>
            </div>
            <div>
              <h2 id="create-playlist-title" className="modal-title">Buat Playlist Baru</h2>
              <p className="modal-subtitle">Kumpulkan surat-surat pilihanmu dalam satu tempat</p>
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

        {/* Modal Form */}
        <div className="modal-body">
          {/* Playlist Name Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="playlist-name-input">
              Nama Playlist <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <input
                id="playlist-name-input"
                className="glass-input modal-input"
                type="text"
                placeholder="Contoh: Tadabbur Pagi, Pengantar Tidur..."
                value={name}
                maxLength={50}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
              <span className="input-counter">{name.length}/50</span>
            </div>
          </div>

          {/* Playlist Description Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="playlist-desc-input">
              Deskripsi <span className="optional-tag">(Opsional)</span>
            </label>
            <textarea
              id="playlist-desc-input"
              className="glass-input modal-input modal-textarea"
              placeholder="Ceritakan tentang kumpulan surat dalam playlist ini..."
              rows={2}
              maxLength={120}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Choose Icon / Emoji */}
          <div className="form-group">
            <label className="form-label">Pilih Ikon Cover</label>
            <div className="icon-selector-grid">
              {PLAYLIST_ICONS.map((item) => (
                <button
                  type="button"
                  key={item.emoji}
                  className={`icon-choice-btn ${selectedIcon === item.emoji ? 'active' : ''}`}
                  onClick={() => setSelectedIcon(item.emoji)}
                  title={item.label}
                >
                  <span className="icon-emoji">{item.emoji}</span>
                  <span className="icon-label">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Choose Color Gradient */}
          <div className="form-group">
            <label className="form-label">Warna Tema Cover</label>
            <div className="color-selector-row">
              {GRADIENT_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.id}
                  className={`color-choice-dot ${preset.id} ${selectedGradient === preset.id ? 'active' : ''}`}
                  onClick={() => setSelectedGradient(preset.id)}
                  title={preset.name}
                >
                  {selectedGradient === preset.id && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={handleClose}>
            Batal
          </button>
          <button
            type="button"
            className="btn-primary btn-glow"
            onClick={handleCreate}
            disabled={!name.trim()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Buat Playlist
          </button>
        </div>
      </div>
    </div>
  );
}
