# 🌙 Murotalify — Quran Recitation with Ambient Nature Sounds

<div align="center">

![Murotalify Banner](https://img.shields.io/badge/Next.js-16.3.5-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react)
![Theme](https://img.shields.io/badge/Style-Dark%20Glassmorphism-1DB954?style=for-the-badge)
![API](https://img.shields.io/badge/Data-equran.id%20v2-green?style=for-the-badge)
![Storage](https://img.shields.io/badge/Storage-localStorage-orange?style=for-the-badge)

<br/>

**Aplikasi web streaming Murotal Al-Quran dengan antarmuka modern ala Spotify, dipadukan dengan *Ambient Nature Sounds Mixer* (suara alam) untuk meningkatkan fokus tilawah, hafalan, relaksasi, dan istirahat.**

[Fitur Utama](#-fitur-utama) • [Pilihan Qari](#-pilihan-qari) • [Ambient Nature Mixer](#-ambient-nature-mixer) • [Koleksi Spesial](#-koleksi-spesial) • [Instalasi & Menjalankan](#-instalasi--menjalankan) • [Struktur Proyek](#-struktur-proyek) • [API Reference](#-api-reference)

</div>

---

## 📖 Tentang Proyek

**Murotalify** dirancang untuk menghadirkan pengalaman mendengarkan lantunan ayat suci Al-Quran dengan kenyamanan dan estetika modern seperti Spotify. Pengguna dapat mendengarkan 114 surat secara lengkap atau per-ayat dari 6 qari terkemuka dunia, sambil memadukan suara alam yang menenangkan (rintik hujan, gemercik air sungai, dan kicauan burung) yang tersinkronisasi secara otomatis dengan tilawah.

---

## ✨ Fitur Utama

### 🎵 1. Spotify-Inspired Dark Glassmorphism UI
- **Desain Premium**: Tampilan gelap elegan dengan efek *frosted glass* (`backdrop-filter: blur`), batas kaca tipis, pendaran cahaya atmosferik, dan aksen hijau khas Spotify.
- **Dock Player Bawah (Now Playing Bar)**:
  - Tombol kontrol pemutaran: *Play/Pause, Previous, Next, Shuffle, Repeat (Off / All / One)*.
  - Progress bar interaktif dengan durasi real-time dan scrubbing/seek audio.
  - Slider pengatur volume suara tilawah & toggle cepat ke panel Ambient Mixer.
- **Persistensi Pemutaran**: Melanjutkan surat terakhir yang diputar, waktu detik terakhir, antrean, dan pengaturan volume secara otomatis saat browser dimuat ulang melalui `localStorage`.

### 🎧 2. 114 Surah Lengkap & Audio Ayat per Ayat
- Data surat lengkap dari Surah Al-Fatihah hingga An-Nas.
- Teks kaligrafi Arab (*Amiri typography*), transliterasi Latin, dan terjemahan bahasa Indonesia resmi Kemenag.
- Fleksibilitas pemutaran:
  - Putar surat penuh (Full Surah).
  - Putar ayat tertentu secara berurutan.

### 🎙️ 3. 6 Pilihan Qari Terkemuka Dunia
Pengguna dapat mengganti qari favorit kapan saja melalui dropdown di bagian header:
| Kode | Nama Qari | Keterangan |
|---|---|---|
| `01` | **Abdullah Al-Juhany** | Imam Masjidil Haram |
| `02` | **Abdul Muhsin Al-Qasim** | Imam & Khatib Masjid Nabawi |
| `03` | **Abdurrahman As-Sudais** | Imam Besar Masjidil Haram |
| `04` | **Ibrahim Al-Dossari** | Qari & Pengajar Qira'at Internasional |
| `05` | **Misyari Rasyid Al-Afasy** *(Default)* | Qari bersuara merdu asal Kuwait |
| `06` | **Yasser Al-Dosari** | Imam Masjidil Haram |

---

## 🍃 Ambient Nature Mixer

Salah satu keunggulan utama Murotalify adalah kemampuan memadukan audio tilawah dengan efek suara alam:

### 🔊 Suara Alam Lokal (`public/sounds/`)
1. 🌧️ **Suara Hujan (`rain.mp3`)**: Rintik hujan tenang yang cocok untuk fokus membaca atau tidur.
2. 💧 **Air Mengalir (`water.mp3`)**: Gemercik aliran sungai pegunungan yang menyejukkan.
3. 🍃 **Suara Alam (`nature.mp3`)**: Suasana hutan asri dengan kicauan burung dan hembusan dedaunan.

### ⚙️ Fitur Mixer & Sinkronisasi Cerdas
- **Pengatur Volume Independen**: Atur keseimbangan volume setiap suara alam sesuai preferensi Anda.
- **Preset Suara Instan**:
  - *Hujan Damai* (Rain 65%)
  - *Sungai Asri* (Water 70%)
  - *Kicauan Burung* (Nature 65%)
  - *Hujan & Sungai* (Rain 45%, Water 40%)
  - *Harmoni Alam* (Rain 35%, Water 35%, Nature 45%)
- **Sinkronisasi Otomatis dengan Murotal**:
  - Saat tilawah di-*pause*, seluruh suara alam aktif **otomatis ikut ter-pause**.
  - Saat tilawah di-*resume*, suara alam **otomatis kembali bersuara**.
  - Terdapat indikator status visual pada drawer mixer saat audio sedang dijeda.

---

## 🎨 Koleksi Spesial & Watermark Art

Bagian **Collections** menyajikan kumpulan surat kurasi berdasarkan kebutuhan aktivitas harian dengan cover gradien geometris estetik:

| Koleksi | Gradien | Watermark Seni Garis | Kurasi Surat | Ambient Terkait |
|---|---|---|---|---|
| **Focus & Work** | Cyan / Navy | Lingkaran konsentris (*concentric circles*) | Ar-Rahman, Al-Mulk, Yasin, Al-Insyirah | 🍃 Suara Alam |
| **Most Beautiful Recitations** | Magenta / Crimson | Mandala bunga simetris 8-kelopak | Al-Fatihah, Maryam, Yusuf, Ar-Rahman, Al-Kahf | — |
| **Sleep Mode** | Cosmic Blue | Lengkungan sabit & garis geometris *Z z z* | Al-Mulk, As-Sajdah, Al-Insan, Ad-Duha, Muawwidzat | 🌧️ Suara Hujan |
| **Duaa & Ruqia** | Emerald Aurora | Pancaran sinar garis kipas (*fan rays*) | Al-Fatihah, Al-Baqarah, Ayat Kursi, Muawwidzat | 💧 Air Mengalir |

---

## 📑 Fitur Tambahan

- **Manajemen Playlist Kustom**:
  - Buat playlist baru dengan nama, deskripsi, dan cover gradien.
  - Tambahkan surat ke playlist via klik kanan (*Context Menu*) atau modal interaktif.
  - Hapus surat dari playlist atau hapus seluruh playlist.
  - Disimpan secara lokal di browser (`localStorage`).
- **Pencarian Cepat (Instant Search)**:
  - Cari surat berdasarkan nama latin, nama Arab, nomor surat, arti surat, atau tempat turun (Makkiyah/Madaniyah).
- **Recently Played**:
  - Akses cepat ke riwayat surat yang baru saja Anda dengarkan.
- **Kategori Cepat**:
  - Surat Pilihan, Juz 'Amma (Surat 78–114), dan Surat Makkiyah.
- **Responsive Navigation**:
  - Desktop: Sidebar navigasi tetap dan drawer geser.
  - Mobile: Dock navigasi bawah ramah sentuhan.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router + Turbopack)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: Vanilla CSS (Dark Glassmorphism Design System)
- **Typography**: Google Fonts (*Inter* & *Amiri Quranic Serif*)
- **Data Source**: [EQuran.id API v2](https://equran.id/apidev/v2)
- **Audio Delivery**: HTML5 Audio API + Static Assets Serving
- **Storage**: Browser LocalStorage API

---

## 🚀 Instalasi & Menjalankan

### Prasyarat
- [Node.js](https://nodejs.org/) versi 18.18.0 atau yang lebih baru
- NPM, Yarn, atau PNPM

### 1. Clone Repositori
```bash
git clone https://github.com/username/murotal-player.git
cd murotal-player
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Jalankan Development Server
```bash
npm run dev
```

Buka peramban Anda dan akses:
```
http://localhost:3000
```

### 4. Build untuk Produksi
```bash
npm run build
npm run start
```

---

## 📁 Struktur Proyek

```
murotal-player/
├── public/
│   └── sounds/                    # File audio suara alam lokal
│       ├── nature.mp3             # Suara alam & burung
│       ├── rain.mp3               # Suara rintik hujan
│       └── water.mp3              # Suara gemercik air
├── src/
│   └── app/
│       ├── components/            # Komponen modular aplikasi
│       │   ├── AddToPlaylistModal.js  # Modal tambah ke playlist
│       │   ├── AmbientMixer.js        # Drawer mixer suara alam
│       │   ├── AppShell.js            # Layout shell utama
│       │   ├── CollectionsSection.js  # Kartu kurasi koleksi
│       │   ├── ContextMenu.js         # Klik kanan (tambah ke playlist)
│       │   ├── CreatePlaylistModal.js # Modal buat playlist baru
│       │   ├── HomePage.js            # Beranda & grid surat
│       │   ├── LandingPage.js         # Landing page & penjelajah fitur
│       │   ├── LibraryPage.js         # Koleksi playlist & riwayat
│       │   ├── MobileNav.js           # Navigasi bawah untuk mobile
│       │   ├── NowPlayingBar.js       # Player bar bawah ala Spotify
│       │   ├── PlaceholderCover.js    # Seni watermark geometris
│       │   ├── PlaylistDetail.js      # Halaman detail playlist
│       │   ├── SearchPage.js          # Pencarian surat real-time
│       │   ├── Sidebar.js             # Sidebar navigasi desktop
│       │   ├── SurahDetail.js         # Teks ayat, terjemahan & qari
│       │   └── Toast.js               # Notifikasi toast mengambang
│       ├── context/
│       │   └── AppContext.js      # Global state, audio lifecycle & storage
│       ├── lib/
│       │   └── api.js             # Client API EQuran.id v2
│       ├── globals.css            # Desain sistem Dark Glassmorphism
│       ├── layout.js              # Root layout & metadata SEO
│       └── page.js                # Root entry point
├── package.json
└── README.md
```

---

## 🌐 API Reference

Data Al-Quran diambil langsung dari API publik resmi **[EQuran.id API v2](https://equran.id/apidev/v2)**:

- **Daftar Seluruh Surat**:
  ```http
  GET https://equran.id/api/v2/surat
  ```
- **Detail Surat & Audio per Ayat**:
  ```http
  GET https://equran.id/api/v2/surat/{nomor}
  ```

Format audio qari yang didukung pada API:
- `audioFull['01']` s/d `audioFull['06']` untuk audio satu surat penuh.
- `ayat[i].audio['01']` s/d `audio['06']` untuk audio per ayat.

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan ibadah, edukasi, dan pengembangan pribadi non-komersial. Seluruh konten ayat Al-Quran dan terjemahan bersumber dari Kemenag RI melalui EQuran.id.

---

<div align="center">
  <sub>Dibuat dengan penuh dedikasi untuk memudahkan interaksi harian bersama Al-Quran. ✨</sub>
</div>
