'use client';

import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';

export default function LandingPage({ standalone = false }) {
  const { state, dispatch, QARI_MAP } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Comprehensive knowledge base items for searching web information
  const infoItems = useMemo(() => [
    {
      id: 'about-app',
      category: 'tentang',
      badge: 'Tentang Web',
      title: 'Apa itu Murotalify?',
      shortDesc: 'Platform audio murotal Al-Quran modern berdesain Spotify-style dengan fitur perpaduan suara alam.',
      content: 'Murotalify adalah aplikasi web audio Islami yang dirancang khusus untuk menghadirkan pengalaman mendengarkan lantunan ayat suci Al-Quran yang syahdu, khusyuk, dan menenangkan. Terinspirasi dari antarmuka modern pemutar musik terbaik dunia Spotify, platform ini memadukan kemudahan navigasi 114 surah dengan fitur unik Ambient Sound Mixer.',
      keywords: ['tentang', 'murotalify', 'murotal', 'player', 'al-quran', 'quran', 'pengenalan', 'web', 'aplikasi', 'profil'],
      icon: '🌿',
    },
    {
      id: 'inspiration-quranify',
      category: 'tentang',
      badge: 'Inspirasi & Kredit',
      title: 'Terinspirasi dari Quranify',
      shortDesc: 'Apresiasi mendalam untuk Quranify sebagai pelopor pemutar Al-Quran modern kelas dunia.',
      content: 'Aplikasi web Murotalify dibangun dengan rasa hormat dan inspirasi besar dari proyek Quranify (https://quranify.pro/). Konsep antarmuka modern pemutar audio Islami yang bersih, nyaman, dan berfokus pada kemudahan akses dipelopori dengan sangat indah oleh Quranify. Murotalify melanjutkan inspirasi tersebut dengan menghadirkan integrasi fitur Ambient Nature Mixer (rintik hujan, sungai, kicauan burung) serta manajemen playlist kustom. Kami sangat merekomendasikan Anda untuk turut mengunjungi dan mendukung karya luar biasa dari tim Quranify.',
      keywords: ['quranify', 'inspirasi', 'kredit', 'tribute', 'tentang', 'asal', 'pembuat', 'developer', 'referensi', 'website', 'link'],
      icon: '💚',
      isTribute: true,
      link: {
        url: 'https://quranify.pro/',
        label: 'Kunjungi Website Quranify',
      },
    },
    {
      id: 'feature-ambient',
      category: 'ambient',
      badge: 'Fitur Utama',
      title: 'Ambient Nature Mixer (Suara Alam)',
      shortDesc: 'Padukan lantunan murotal dengan rintik hujan, aliran sungai jernih, dan kicauan burung asri.',
      content: 'Fitur unggulan kami memungkinkan Anda memutar efek suara alam bersamaan dengan audio tilawah. Anda dapat menyesuaikan volume masing-masing suara alam secara independen (Hujan, Air Mengalir, Kicauan Hutan) atau memilih preset instan seperti "Hujan Damai" dan "Harmoni Alam" untuk meningkatkan fokus hafalan atau relaksasi tidur.',
      keywords: ['ambient', 'suara alam', 'hujan', 'air', 'sungai', 'burung', 'nature', 'mixer', 'sound', 'fokus', 'tidur'],
      icon: '🌧️',
    },
    {
      id: 'feature-qari',
      category: 'qari',
      badge: 'Audio & Qari',
      title: '6 Pilihan Qari Terkemuka Dunia',
      shortDesc: 'Dengarkan tilawah dari imam Masjidil Haram, Masjid Nabawi, dan qari internasional bersuara emas.',
      content: 'Murotalify menyediakan 6 pilihan qari ternama: Abdullah Al-Juhany, Abdul Muhsin Al-Qasim, Abdurrahman As-Sudais (Imam Besar Masjidil Haram), Ibrahim Al-Dossari, Misyari Rasyid Al-Afasy, dan Yasser Al-Dosari. Anda dapat berganti qari kapan saja melalui dropdown di bagian atas layar.',
      keywords: ['qari', 'imam', 'sudais', 'alafasy', 'afasy', 'juhany', 'qasim', 'dossari', 'suara', 'reciter', 'bacaan'],
      icon: '🎙️',
    },
    {
      id: 'feature-surah-ayat',
      category: 'surah',
      badge: 'Tilawah & Teks',
      title: '114 Surah Lengkap & Audio Ayat per Ayat',
      shortDesc: 'Dengarkan surah secara penuh atau putar ayat tertentu dilengkapi teks Arab, Latin, dan Terjemahan Kemenag.',
      content: 'Setiap surah memiliki halaman detail khusus yang menyajikan teks Arab berfont Utsmani yang indah, transliterasi Latin untuk mempermudah pelafalan, serta terjemahan resmi bahasa Indonesia. Anda dapat memutar audio ayat demi ayat atau memutar surah secara utuh tanpa henti.',
      keywords: ['surat', 'surah', 'ayat', 'teks', 'arab', 'latin', 'terjemahan', 'arti', 'kemenag', '114', 'juz amma'],
      icon: '📖',
    },
    {
      id: 'feature-playlist',
      category: 'fitur',
      badge: 'Koleksi',
      title: 'Playlist Kustom & Koleksi Tematik',
      shortDesc: 'Buat daftar putar pribadi untuk target hafalan harian, ruqyah syar’iyyah, atau surat sebelum tidur.',
      content: 'Anda dapat membuat playlist pribadi dengan nama dan deskripsi khusus, lalu menambahkan surat-surat pilihan ke dalamnya melalui menu klik kanan (context menu) atau tombol di halaman surah. Selain itu, tersedia koleksi tematik siap putar seperti Juz ‘Amma, Surat Pilihan Makkiyah, dan Surat Populer.',
      keywords: ['playlist', 'koleksi', 'favorit', 'daftar putar', 'tahfidz', 'hafalan', 'ruqyah', 'tidur'],
      icon: '📑',
    },
    {
      id: 'feature-search',
      category: 'fitur',
      badge: 'Pencarian',
      title: 'Mesin Pencari Surah Cepat & Cerdas',
      shortDesc: 'Cari surah berdasarkan nama, arti, nomor, atau tempat diturunkannya (Makkiyah/Madaniyah).',
      content: 'Cukup ketik nama surat (misal "Yasin", "Al-Mulk"), nomor surat ("67"), atau artinya ("Kerajaan"), sistem pencarian real-time akan menampilkan hasil seketika lengkap dengan jumlah ayat dan kategori tempat turunnya.',
      keywords: ['cari', 'search', 'filter', 'nomor', 'arti', 'makkiyah', 'madaniyah', 'temukan'],
      icon: '🔍',
    },
    {
      id: 'faq-free',
      category: 'faq',
      badge: 'Tanya Jawab',
      title: 'Apakah Murotalify ini gratis?',
      shortDesc: 'Ya, 100% gratis untuk seluruh umat Muslim tanpa biaya langganan maupun iklan komersial yang mengganggu.',
      content: 'Aplikasi ini dibuat sebagai amal jariyah dan sarana ibadah digital agar setiap Muslim dapat mendekatkan diri dengan Al-Quran setiap saat di mana pun berada dengan kenyamanan visual dan audio terbaik.',
      keywords: ['gratis', 'bayar', 'langganan', 'biaya', 'iklan', 'ads', 'free', 'amal'],
      icon: '💎',
    },
    {
      id: 'faq-source',
      category: 'faq',
      badge: 'Tanya Jawab',
      title: 'Dari mana sumber audio dan data Al-Quran?',
      shortDesc: 'Data Al-Quran bersumber dari Kemenag RI dan audio qari bersumber dari arsip resmi audio Al-Quran terpercaya.',
      content: 'Teks Al-Quran, nomor ayat, dan terjemahan bahasa Indonesia mengacu pada standar resmi Kementerian Agama Republik Indonesia (Kemenag RI), sedangkan rekaman audio qari bersumber dari repositori audio Al-Quran internasional berkualitas tinggi (EveryAyah / Quran API).',
      keywords: ['sumber', 'data', 'api', 'kemenag', 'valid', 'shahih', 'everyayah', 'audio', 'kualitas'],
      icon: '🛡️',
    },
    {
      id: 'tips-ambient-sleep',
      category: 'tips',
      badge: 'Tips Penggunaan',
      title: 'Tips Mendengarkan untuk Ketenangan Tidur & Ruqyah',
      shortDesc: 'Kombinasi surat pilihan dengan rintik hujan lembut untuk relaksasi malam yang damai.',
      content: 'Untuk ketenangan sebelum tidur atau ruqyah mandiri, pilihlah Surat Al-Baqarah, Ayat Kursi, Surat Al-Mulk, atau Al-Ikhlas/Al-Falaq/An-Nas. Buka Ambient Mixer di samping kanan, aktifkan preset "Hujan Damai" atau atur suara hujan ke volume 40% dan air mengalir ke 30%.',
      keywords: ['tips', 'tidur', 'ruqyah', 'tenang', 'relaksasi', 'malam', 'al-mulk', 'hujan'],
      icon: '🌙',
    },
    {
      id: 'tips-memorization',
      category: 'tips',
      badge: 'Tips Penggunaan',
      title: 'Tips Menghafal Al-Quran (Tahfidz) Menggunakan Fitur Repeat',
      shortDesc: 'Gunakan mode putar berulang (Repeat 1) pada ayat atau surat yang sedang Anda hafalkan.',
      content: 'Pada kontrol pemutar di bagian bawah, klik tombol Repeat hingga berubah menjadi "Repeat One". Audio akan terus berputar berulang kali tanpa henti sehingga memudahkan lisan dan memori otak Anda dalam menyerap makhraj dan tajwid yang dibacakan qari.',
      keywords: ['tips', 'hafalan', 'tahfidz', 'repeat', 'ulang', 'tajwid', 'makhraj', 'belajar'],
      icon: '🎯',
    },
    {
      id: 'faq-offline',
      category: 'faq',
      badge: 'Tanya Jawab',
      title: 'Apakah bisa digunakan di HP / Ponsel?',
      shortDesc: 'Ya, web ini sepenuhnya responsif dan dapat diakses dengan lancar melalui browser Chrome, Safari, dan Firefox.',
      content: 'Tampilan antarmuka otomatis menyesuaikan ukuran layar perangkat Anda, baik di desktop, laptop, tablet, hingga smartphone dengan navigasi yang ramah sentuhan jari.',
      keywords: ['hp', 'mobile', 'android', 'iphone', 'smartphone', 'responsif', 'browser'],
      icon: '📱',
    },
    {
      id: 'about-developer',
      category: 'tentang',
      badge: 'Tentang Web',
      title: 'Visi & Identitas Visual Baru Murotalify',
      shortDesc: 'Menyatukan keindahan simbol Islami (Bulan, Bintang, Zamrud, dan Daun Zaitun) dalam harmoni digital.',
      content: 'Logo baru kami memadukan lambang kubah perisai Islami, bulan sabit, bintang kemuliaan, dan ranting dedaunan hijau zamrud yang melambangkan kesuburan iman, ketenangan alam, dan kemurnian wahyu ilahi. Kami berkomitmen untuk terus menghadirkan karya teknologi bernilai ibadah.',
      keywords: ['logo', 'identitas', 'simbol', 'visi', 'hijau', 'zamrud', 'desain', 'tujuan'],
      icon: '✨',
    },
  ], []);

  // Filter items by category and query
  const filteredItems = useMemo(() => {
    return infoItems.filter((item) => {
      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      if (!matchCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.shortDesc.toLowerCase().includes(q);
      const matchContent = item.content.toLowerCase().includes(q);
      const matchKeywords = item.keywords.some(k => k.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchContent || matchKeywords;
    });
  }, [infoItems, activeCategory, searchQuery]);

  const categories = [
    { id: 'all', label: 'Semua Info', icon: '🌟' },
    { id: 'tentang', label: 'Tentang Web', icon: 'ℹ️' },
    { id: 'fitur', label: 'Fitur Utama', icon: '✨' },
    { id: 'ambient', label: 'Ambient Mixer', icon: '🌧️' },
    { id: 'qari', label: 'Daftar Qari', icon: '🎙️' },
    { id: 'surah', label: 'Surat & Ayat', icon: '📖' },
    { id: 'tips', label: 'Tips & Panduan', icon: '💡' },
    { id: 'faq', label: 'Tanya Jawab (FAQ)', icon: '❓' },
  ];

  const handleGoToPlayer = () => {
    if (standalone) {
      window.location.href = '/';
    } else {
      dispatch({ type: 'NAVIGATE', payload: { view: 'home' } });
    }
  };

  const handleSelectQariAndPlay = (qariKey) => {
    dispatch({ type: 'SET_SELECTED_QARI', payload: qariKey });
    dispatch({ type: 'NAVIGATE', payload: { view: 'home' } });
  };

  const qarisList = [
    { key: '01', name: 'Abdullah Al-Juhany', role: 'Imam Masjidil Haram Makkah', style: 'Tartil lembut, jelas, penuh penghayatan' },
    { key: '02', name: 'Abdul Muhsin Al-Qasim', role: 'Imam Masjid Nabawi Madinah', style: 'Tartil tenang, artikulasi makhraj sangat presisi' },
    { key: '03', name: 'Abdurrahman As-Sudais', role: 'Imam Besar Masjidil Haram', style: 'Irama emosional khas, penuh wibawa dan getaran ruhani' },
    { key: '04', name: 'Ibrahim Al-Dossari', role: 'Qari & Syaikh Qira’at Arab Saudi', style: 'Pelafalan tajwid mendalam dengan tempo teratur' },
    { key: '05', name: 'Misyari Rasyid Al-Afasy', role: 'Qari Internasional Kuwait', style: 'Suara merdu, vokal sangat jernih dan disukai jutaan umat' },
    { key: '06', name: 'Yasser Al-Dosari', role: 'Imam Masjidil Haram Makkah', style: 'Lantunan syahdu penuh power dan penghayatan ayat' },
  ];

  return (
    <div className="landing-page-container">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-bg-glow" />
        
        <div className="landing-hero-content">
          <div className="landing-logo-badge-wrap">
            <div className="landing-logo-glow-ring">
              <img src="/logo.png" alt="Murotalify Logo" className="landing-hero-logo" />
            </div>
            <span className="landing-hero-pill">
              <span className="pill-dot" /> Resmi • Al-Quran Audio Platform
            </span>
          </div>

          <h1 className="landing-hero-title">
            Murotalify
          </h1>
          <p className="landing-hero-tagline">
            Lantunan Suci Al-Quran dengan Harmoni Ketenangan Suara Alam
          </p>
          <p className="landing-hero-desc">
            Rasakan kedamaian spiritual mendengarkan 114 surah dari 6 qari ternama dunia, 
            dipadukan dengan rintik hujan damai dan gemercik aliran air untuk menemani 
            tadabbur, belajar tahfidz, bekerja, serta relaksasi hati.
          </p>

          <div className="landing-hero-actions">
            <button className="landing-btn-primary" onClick={handleGoToPlayer}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z" />
              </svg>
              <span>Mulai Dengarkan Murotal</span>
            </button>

            <a href="#info-search-section" className="landing-btn-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.28c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z" />
              </svg>
              <span>Cari Informasi & Panduan</span>
            </a>

            {!standalone && (
              <button
                className="landing-btn-glass"
                onClick={() => dispatch({ type: 'TOGGLE_AMBIENT' })}
              >
                <span>🌧️ Buka Ambient Mixer</span>
              </button>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="landing-stats-grid">
            <div className="landing-stat-card">
              <div className="landing-stat-value">114</div>
              <div className="landing-stat-label">Surah Lengkap</div>
            </div>
            <div className="landing-stat-card">
              <div className="landing-stat-value">6</div>
              <div className="landing-stat-label">Qari Dunia Pilihan</div>
            </div>
            <div className="landing-stat-card">
              <div className="landing-stat-value">3+</div>
              <div className="landing-stat-label">Suara Alam Realistis</div>
            </div>
            <div className="landing-stat-card">
              <div className="landing-stat-value">6.236</div>
              <div className="landing-stat-label">Ayat & Terjemahan RI</div>
            </div>
            <div className="landing-stat-card">
              <div className="landing-stat-value">100%</div>
              <div className="landing-stat-label">Gratis & Tanpa Iklan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Information Search Engine */}
      <section id="info-search-section" className="landing-search-section">
        <div className="landing-section-header">
          <div className="landing-badge">
            <img src="/logo.png" alt="Logo" style={{ width: 16, height: 16, borderRadius: 4 }} />
            <span>Pusat Informasi & Pengetahuan Web</span>
          </div>
          <h2 className="landing-section-title">Temukan Jawaban & Informasi Lengkap</h2>
          <p className="landing-section-subtitle">
            Ketik pertanyaan atau kata kunci apa saja (contoh: <em>qari</em>, <em>hujan</em>, <em>ayat</em>, <em>playlist</em>, <em>gratis</em>, <em>kemenag</em>).
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="landing-search-box-wrap">
          <div className="landing-search-box">
            <svg className="landing-search-icon" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.28c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z" />
            </svg>
            <input
              type="text"
              className="landing-search-input"
              placeholder="Cari informasi seputar fitur, cara pakai, qari, ambient sound, atau FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="landing-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Category Filters */}
          <div className="landing-category-pills">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span className="category-pill-icon">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="landing-search-meta">
            Menampilkan <strong>{filteredItems.length}</strong> topik informasi
            {searchQuery && <span> untuk kata kunci &ldquo;{searchQuery}&rdquo;</span>}
          </div>
        </div>

        {/* Featured Inspiration & Tribute to Quranify */}
        <div className="landing-tribute-banner">
          <div className="landing-tribute-banner-left">
            <div className="landing-tribute-badge">
              <span className="pill-dot" />
              <span>Inspirasi & Dedikasi Web</span>
            </div>
            <h3 className="landing-tribute-title">
              Terinspirasi dari <span className="text-emerald-gradient">Quranify</span>
            </h3>
            <p className="landing-tribute-text">
              Murotalify dirancang dengan inspirasi dan apresiasi mendalam kepada inovasi tim <strong>Quranify</strong> dalam menghadirkan antarmuka pemutar Al-Quran yang modern, indah, dan nyaman didengarkan. Silakan akses karya inspiratif mereka melalui tautan resmi di bawah ini.
            </p>
          </div>
          <div className="landing-tribute-banner-right">
            <a
              href="https://quranify.pro/"
              target="_blank"
              rel="noopener noreferrer"
              className="landing-tribute-cta-btn"
              title="Buka Website Resmi Quranify (quranify.pro)"
            >
              <span>Kunjungi Quranify</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
            <span className="landing-tribute-url">quranify.pro ↗</span>
          </div>
        </div>

        {/* Results Grid */}
        <div className="landing-info-grid">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const isExpanded = expandedFaq === item.id;
              return (
                <article
                  key={item.id}
                  className={`landing-info-card ${item.isTribute ? 'is-tribute' : ''} ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => setExpandedFaq(isExpanded ? null : item.id)}
                >
                  <div className="landing-info-card-header">
                    <span className="landing-info-card-icon">{item.icon}</span>
                    <span className="landing-info-card-badge">{item.badge}</span>
                  </div>
                  <h3 className="landing-info-card-title">{item.title}</h3>
                  <p className="landing-info-card-short">{item.shortDesc}</p>
                  
                  {isExpanded && (
                    <div className="landing-info-card-body">
                      <p>{item.content}</p>
                    </div>
                  )}

                  {item.link && (
                    <div className="landing-info-card-link-wrap" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={item.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="landing-quranify-btn"
                        title={item.link.label}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        <span>{item.link.label}</span>
                        <span style={{ marginLeft: 4 }}>↗</span>
                      </a>
                    </div>
                  )}

                  <div className="landing-info-card-footer">
                    <span className="landing-info-toggle-hint">
                      {isExpanded ? 'Tutup rincian ▲' : 'Baca selengkapnya ▼'}
                    </span>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="landing-search-empty">
              <img src="/logo.png" alt="Logo" style={{ width: 64, height: 64, borderRadius: 16, opacity: 0.6, marginBottom: 16 }} />
              <h3>Informasi Tidak Ditemukan</h3>
              <p>Tidak ada hasil yang sesuai dengan kata kunci &ldquo;{searchQuery}&rdquo;.</p>
              <button className="landing-btn-secondary" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
                Reset Pencarian
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Feature Pillars Showcase */}
      <section className="landing-features-section">
        <div className="landing-section-header">
          <div className="landing-badge">
            <span>✨ Fitur Unggulan</span>
          </div>
          <h2 className="landing-section-title">Semua yang Anda Butuhkan untuk Khusyuk</h2>
          <p className="landing-section-subtitle">
            Didesain khusus untuk memberikan pengalaman mendengarkan Al-Quran paling intim dan menyejukkan jiwa.
          </p>
        </div>

        <div className="landing-feature-cards-grid">
          <div className="feature-highlight-card">
            <div className="feature-highlight-icon">🌧️</div>
            <h3>Perpaduan Suara Alam</h3>
            <p>
              Campurkan rintik hujan, gemerisik air sungai, dan suara alam pegunungan dengan lantunan ayat Al-Quran. 
              Membantu meredam kebisingan luar dan menciptakan suasana hening mendalam.
            </p>
          </div>

          <div className="feature-highlight-card">
            <div className="feature-highlight-icon">🎙️</div>
            <h3>6 Qari Pilihan Berkualitas Studio</h3>
            <p>
              Dengarkan lantunan merdu dari Abdullah Al-Juhany, Abdul Muhsin Al-Qasim, Abdurrahman As-Sudais, 
              Ibrahim Al-Dossari, Misyari Rasyid Al-Afasy, dan Yasser Al-Dosari.
            </p>
          </div>

          <div className="feature-highlight-card">
            <div className="feature-highlight-icon">📜</div>
            <h3>Teks Ayat & Terjemahan Kemenag RI</h3>
            <p>
              Ikuti setiap lafadz dengan teks Arab khat Utsmani yang jernih, transliterasi Latin yang akurat, 
              dan terjemahan resmi Kementerian Agama Republik Indonesia.
            </p>
          </div>

          <div className="feature-highlight-card">
            <div className="feature-highlight-icon">📑</div>
            <h3>Playlist Pribadi & Favorit</h3>
            <p>
              Simpan surat-surat favorit Anda ke dalam playlist khusus seperti target hafalan, dzikir pagi/petang, 
              surat penenang hati, atau pengantar tidur anak.
            </p>
          </div>

          <div className="feature-highlight-card">
            <div className="feature-highlight-icon">⚡</div>
            <h3>Antarmuka Cepat & Tanpa Gangguan</h3>
            <p>
              Navigasi instan berbasis web modern tanpa jeda muat, tanpa iklan sponsor, dan sepenuhnya bebas gangguan 
              agar Anda dapat fokus beribadah.
            </p>
          </div>

          <div className="feature-highlight-card">
            <div className="feature-highlight-icon">🔁</div>
            <h3>Mode Ulang (Repeat) & Acak (Shuffle)</h3>
            <p>
              Fitur repeat 1 ayat/surah sangat ideal bagi para santri dan pembelajar Al-Quran untuk memperkuat 
              hafalan dan memperbaiki makharijul huruf.
            </p>
          </div>
        </div>
      </section>

      {/* Qari Showcase Section */}
      <section className="landing-qari-section">
        <div className="landing-section-header">
          <div className="landing-badge">
            <img src="/logo.png" alt="Logo" style={{ width: 16, height: 16, borderRadius: 4 }} />
            <span>Tilawah Qari Dunia</span>
          </div>
          <h2 className="landing-section-title">6 Qari Terbaik Tersedia</h2>
          <p className="landing-section-subtitle">
            Pilih qari favorit Anda dan langsung nikmati lantunannya sekarang.
          </p>
        </div>

        <div className="landing-qari-grid">
          {qarisList.map((qari) => {
            const isSelected = state.selectedQari === qari.key;
            return (
              <div key={qari.key} className={`landing-qari-card ${isSelected ? 'selected' : ''}`}>
                <div className="landing-qari-avatar">
                  <span>{qari.name.charAt(0)}</span>
                </div>
                <div className="landing-qari-info">
                  <h4>{qari.name}</h4>
                  <div className="landing-qari-role">{qari.role}</div>
                  <p className="landing-qari-style">{qari.style}</p>
                </div>
                <button
                  className={`landing-qari-play-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelectQariAndPlay(qari.key)}
                >
                  {isSelected ? '✓ Qari Aktif' : 'Pilih & Putar'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Practical Guide Steps */}
      <section className="landing-guide-section">
        <div className="landing-section-header">
          <div className="landing-badge">
            <span>🚀 Panduan Cepat</span>
          </div>
          <h2 className="landing-section-title">Cara Menggunakan Murotalify</h2>
          <p className="landing-section-subtitle">
            Hanya butuh 3 langkah sederhana untuk memulai ketenangan Anda.
          </p>
        </div>

        <div className="landing-steps-grid">
          <div className="landing-step-card">
            <div className="landing-step-number">01</div>
            <h4>Pilih Surah & Qari</h4>
            <p>Jelajahi Beranda atau gunakan fitur Cari untuk menemukan surah yang ingin Anda dengarkan, lalu pilih qari sesuai kenyamanan hati Anda.</p>
          </div>
          <div className="landing-step-card">
            <div className="landing-step-number">02</div>
            <h4>Kombinasikan Suara Alam</h4>
            <p>Buka <em>Ambient Mixer</em> di panel samping atau kanan, lalu atur volume rintik hujan atau aliran air sungai sesuai suasana yang Anda inginkan.</p>
          </div>
          <div className="landing-step-card">
            <div className="landing-step-number">03</div>
            <h4>Tadabbur & Nikmati Kedamaian</h4>
            <p>Baca teks ayat dan terjemahan bahasa Indonesia yang tersaji untuk mendalami makna wahyu suci Al-Quran dengan khusyuk.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="landing-cta-banner">
        <div className="landing-cta-card">
          <div className="landing-cta-logo-wrap">
            <img src="/logo.png" alt="Murotal Logo" className="landing-cta-logo" />
          </div>
          <div className="landing-cta-content">
            <h2>Mulai Mendengarkan Sekarang</h2>
            <p>Dekatkan diri dengan Al-Quran di setiap hembusan nafas. Rasakan lantunan merdu berpadu harmoni alam yang menenteramkan sanubari.</p>
            <div className="landing-cta-buttons">
              <button className="landing-btn-primary" onClick={handleGoToPlayer}>
                Buka Pemutar Audio Sekarang
              </button>
              <button
                className="landing-btn-secondary"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setSearchQuery('');
                }}
              >
                Kembali ke Atas
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-brand">
          <img src="/logo.png" alt="Murotalify Logo" style={{ width: 28, height: 28, borderRadius: 6 }} />
          <span className="landing-footer-title">Murotalify</span>
        </div>
        <p className="landing-footer-desc">
          Platform Audio Al-Quran & Ambient Nature Sounds. Didedikasikan untuk umat Muslim di seluruh dunia.
        </p>
        <div className="landing-footer-sources">
          <span>Data Teks: Kemenag RI</span>
          <span>•</span>
          <span>Audio: EveryAyah & Quran API</span>
          <span>•</span>
          <span>Inspirasi: <a href="https://quranify.pro/" target="_blank" rel="noopener noreferrer" style={{ color: '#34d399', textDecoration: 'underline' }}>Quranify</a></span>
          <span>•</span>
          <span>100% Free & Open</span>
        </div>
      </footer>
    </div>
  );
}
