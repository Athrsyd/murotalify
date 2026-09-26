# 🌙 Murotalify — Pemutar Murotal Al-Quran & Suara Alam Real-Time

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react)
![Tone.js](https://img.shields.io/badge/Tone.js-15.1.22-ff6b6b?style=for-the-badge)
![Analytics](https://img.shields.io/badge/Vercel-Analytics-000000?style=for-the-badge&logo=vercel)
![Style](https://img.shields.io/badge/Style-Dark%20Glassmorphism-10b981?style=for-the-badge)
![API](https://img.shields.io/badge/Data-equran.id%20v2-green?style=for-the-badge)

<br/>

**Aplikasi web pemutar audio Murotal Al-Quran modern berestetika gelap *glassmorphism*, dilengkapi pemrosesan audio *real-time* Tone.js (Gema & Resonansi Murotal ala Masjid), *Ambient Nature Mixer*, serta kurasi tematik berdasarkan dalil sahih dan psikoakustik.**

[Fitur Utama](#-fitur-utama) • [Mesin Audio Tone.js](#-mesin-audio-tonejs--gema-murotal) • [Koleksi Kurasi Dalil](#-koleksi-kurasi-tematik--dalil-nabawi) • [Pilihan Qari](#-pilihan-qari-dan-nuansa-maqam) • [Pengatur Suara Alam](#-pengatur-suara-alam-ambient-mixer) • [Instalasi & Menjalankan](#-instalasi--menjalankan) • [Struktur Proyek](#-struktur-proyek)

</div>

---

## 📖 Tentang Murotalify

**Murotalify** menghadirkan pengalaman tilawah Al-Quran yang syahdu, fokus, dan mendalam. Menggabungkan kemudahan antarmuka modern pemutar musik dengan teknologi Web Audio API melalui **Tone.js**, Murotalify memungkinkan pengguna mendengarkan lantunan ayat-ayat suci Al-Quran dengan efek akustik gema masjid yang luas (*Epic Mosque Reverb & Soft Echo*) yang dapat diatur secara mandiri.

Selain pemutaran tilawah 114 surat lengkap dan ayat-per-ayat dari 6 qari internasional, aplikasi ini memadukan suara latar alam (*Ambient Nature Sounds*) yang terisolasi secara jernih untuk menemani sesi belajar (*deep work*), istirahat malam (*sleep mode*), tadabbur emosional, maupun ruqyah syar'iyyah.

---

## ✨ Fitur Utama

### 1. 🎛️ Mesin Audio Real-Time Tone.js (Gema Murotal)
- **Gema Masjid & Resonansi Syahdu**: Pemrosesan sinyal digital *real-time* (`Tone.Reverb` dan `Tone.FeedbackDelay`) pada audio tilawah untuk menghadirkan atmosfer shalat malam di masjid agung.
- **Isolasi Suara Alam (Clean Ambient)**: Suara alam (*hujan, aliran air, desau hutan, kicauan burung*) tidak terkena efek gema, menjaga keaslian frekuensi suara alam tetap natural.
- **Proxy Audio Streaming (`/api/audio`)**: Mengalirkan audio dari server penyedia dengan header CORS `crossOrigin="anonymous"` untuk mencegah pemblokiran Web Audio API browser.
- **Panel Pengaturan Mandiri**: Pengguna bebas menyesuaikan *Tingkat Gema*, *Panjang Resonansi*, *Pantulan Lembut*, dan *Jeda Pantulan*.

### 2. 📚 Koleksi Pilihan Berbasis Dalil & Psikoakustik
- 4 playlist bawaan dengan kurasi surah, pembagian format (*Surah Utuh* vs *Ayat Pilihan*), rujukan hadits, dan otomatisasi konfigurasi audio optimal dalam satu kali klik.

### 3. 🎧 Pengatur Suara Alam (Ambient Nature Mixer)
- Padukan audio murotal dengan suara rintik hujan, gemercik air mengalir, desau hutan, dan kicauan burung.
- Volume independen tiap suara serta fitur sinkronisasi otomatis (*auto-pause* & *auto-resume* mengikuti status tilawah).

### 4. 🌙 Desain Antarmuka Dark Glassmorphism Bersih
- Estetika gelap elegan dengan material kaca (*frosted glass*), tipografi Arab *Amiri Serif*, serta navigasi konsisten **100% Bahasa Indonesia**.
- Penggunaan bayangan gelap netral yang bersih dan nyaman di mata tanpa pendaran neon berwarna berlebihan.

### 5. 🗂️ Manajemen Pustaka & Daftar Putar Kustom
- Pembuatan dan pengelolaan daftar putar pribadi tanpa batas.
- Riwayat putar (*Recently Played*) dan persistensi data pemutaran otomatis via `localStorage`.

---

## 🎚️ Mesin Audio Tone.js & Gema Murotal

Arsitektur perutean audio Murotalify memisahkan jalur audio tilawah dan audio suara alam:

```
[Audio Murotal] ──> [Proxy /api/audio] ──> [MediaElementSource] ──> [Tone.FeedbackDelay] ──> [Tone.Reverb] ──> [Tone.Destination] (Speaker)
                                                                             │
                                                                   (Wet/Dry Real-time FX)

[Suara Alam]    ──> [HTML5 Audio Nodes] ─────────────────────────────────────────────────────────────────────> [Master Output] (Clean / Dry)
```

### Pilihan Preset Suasana Gema Murotal

| Preset | Emoji | Karakter Akustik | Parameter Teknis |
|---|---|---|---|
| **Tenang & Syahdu** *(Rekomendasi)* | 🕊️ | Lantunan hangat menyejukkan hati dengan gema lembut | Decay: 3.5s • Reverb Wet: 35% • Delay: 15% (250ms) |
| **Megah & Luas** *(Agung)* | 🌌 | Resonansi lapang dan bergetar di dada ala ruangan luas | Decay: 5.2s • Reverb Wet: 45% • Delay: 20% (280ms) |
| **Mendalam & Mengalun** *(Gema Panjang)* | ✨ | Pantulan mengalun tinggi dengan resonansi yang mendalam | Decay: 6.5s • Reverb Wet: 55% • Delay: 25% (320ms) |
| **Jernih & Khidmat** *(Fokus)* | 🎙️ | Suasana hening dengan artikulasi huruf tilawah yang tegas | Decay: 2.0s • Reverb Wet: 20% • Delay: 5% (200ms) |

---

## 📜 Koleksi Kurasi Tematik & Dalil Nabawi

Murotalify menyediakan 4 playlist kurasi khusus yang dilengkapi **Modal Detail Kurasi Tematik** berisi penjelasan dalil dan otomatisasi setelan audio:

| Koleksi | Sasaran Psikoakustik | Qari Default | Preset Gema | Rasio Audio | Daftar Surah Terkurasi |
|---|---|---|---|---|---|
| **Fokus & Belajar** | Gelombang Alpha (8–12 Hz) • Fokus Kerja Mendalam | **Syaikh Abdullah Al-Juhany** | Jernih & Khidmat | Murotal 70% : Suara Alam 30% | • **Al-Insyirah (94)** [Utuh]: Kelapangan dada & pereda cemas (*fa inna ma'al 'usri yusra*)<br/>• **Thaha (20)** [Pilihan: 1–36 & 114]: Doa Nabi Musa & permohonan ilmu (*Rabbi zidnii 'ilmaa*)<br/>• **Al-A'la (87)** [Utuh]: Janji kemudahan hafalan (*Sanuqri'uka falaa tansaa*)<br/>• **Ar-Rahman (55)** [Pilihan: 1–30]: Harmoni nalar & komunikasi<br/>• **Fatir (35)** [Pilihan: 27–29]: Etika hamba berilmu (*Innama yakhsyallaha...*)<br/>• **Al-Mulk (67)** [Pilihan: 1–15]: Observasi nalar atas keteraturan langit |
| **Tilawah Syahdu** | Katarsis Emosional & Tadabbur Mendalam | **Syaikh Yasser Al-Dosari** | Mendalam & Mengalun | Murotal 95% : Audio Jernih | • **Maryam (19)** [Pilihan: 1–36]: Munajat lirih Nabi Zakariya (*nidaa-an khafiyya*)<br/>• **Yusuf (12)** [Pilihan: 1–34 & 83–93]: Kisah terindah & kepasrahan Nabi Ya'qub<br/>• **Al-Kahf (18)** [Pilihan: 10 Awal & 10 Akhir]: Hadits Shahih Muslim no. 809<br/>• **Al-Furqan (25)** [Pilihan: 63–77]: Potret sifat mulia hamba ar-Rahman<br/>• **Qaf (50)** [Pilihan: 16–35]: Keintiman Allah (*aqrabu ilaihi min hablil-warid*)<br/>• **Ar-Rahman (55)** [Utuh: 1–78]: *'Arusul Qur'an* (Pengantin Al-Qur'an) |
| **Pengantar Tidur** | Gelombang Theta & Delta • Relaksasi Parasimpatis | **Syaikh Abdul Muhsin Al-Qasim** | Tenang & Syahdu | Murotal 60% : Suara Hujan 40% | • **Al-Mulk (67)** [Utuh]: Sunnah malam pelindung siksa kubur (HR. Tirmidzi no. 2891)<br/>• **As-Sajdah (32)** [Utuh]: Sunnah malam Nabawiyyah (HR. Ahmad no. 14249)<br/>• **Al-Baqarah (2)** [Pilihan: 2 Ayat Terakhir]: Khawatim Al-Baqarah (HR. Bukhari no. 5009)<br/>• **Al-Insan (76)** [Pilihan: 1–22]: Kesejukan negeri akhirat penenteram jiwa<br/>• **Al-Mu'awwidzat (112, 113, 114)** [Utuh]: Sunnah sebelum tidur (HR. Bukhari no. 5017) |
| **Doa & Ruqyah** | Tazkiyatun Nafs & Proteksi Spiritual | **Syaikh Misyari Rasyid Al-Afasy** | Megah & Luas | Murotal 80% : Air Mengalir 20% | • **Al-Fatihah (1)** [Utuh]: Induk obat (*Asy-Syifaa' & Ar-Ruqyah*, HR. Bukhari no. 5736)<br/>• **Al-Baqarah (2)** [Pilihan: Ayat Kursi & 1–5, 284–286]: Pengusir setan (HR. Muslim no. 780)<br/>• **Al-Hasyr (59)** [Pilihan: 21–24]: Keagungan Al-Qur'an & Asmaul Husna<br/>• **Al-Mu'awwidzat (112, 113, 114)** [Utuh]: Benteng dari sihir dan was-was (HR. Abu Dawud no. 5082) |

---

## 🎙️ Pilihan Qari dan Nuansa Maqam

| Kode | Nama Qari | Karakteristik Vokal & Maqam | Peran Ideal |
|---|---|---|---|
| `01` | **Abdullah Al-Juhany** | Artikulasi huruf renyah (*crisp*), tempo *tadwir* stabil, Maqam Rast & Bayati | Fokus & Belajar |
| `02` | **Abdul Muhsin Al-Qasim** | Bariton teduh, tempo *tahqiq* lambat dan hening, Maqam Nahawand | Pengantar Tidur & Istirahat |
| `03` | **Abdurrahman As-Sudais** | Vokal tinggi bertenaga, emosional (*buka'iyyah*), Maqam Sikah & Hijaz | Doa & Perlindungan |
| `04` | **Ibrahim Al-Dossari** | Tartil klasik murni, tajwid presisi tanpa cengkok berlebih | Menghafal & Belajar |
| `05` | **Misyari Rasyid Al-Afasy** | Vokal hangat melodius, makhraj *isti'la* kokoh, Maqam Kurd & Ajam | Doa & Ruqyah Syar'iyyah |
| `06` | **Yasser Al-Dosari** | Resonansi dada megah, penghayatan mendalam menggugah kalbu, Maqam Kurd | Tilawah Syahdu & Tadabbur |

---

## 🍃 Pengatur Suara Alam (Ambient Mixer)

Suara alam lokal berkualitas tinggi di `public/sounds/`:
1. 🌧️ **Suara Hujan (`rain.mp3`)**: Rintik hujan tenang untuk menurunkan ritme jantung dan membantu relaksasi tidur.
2. 💧 **Air Mengalir (`water.mp3`)**: Gemercik aliran sungai jernih yang menghadirkan sensasi kesegaran batin.
3. 🍃 **Suara Alam (`nature.mp3`)**: Desau angin hutan dan gemerisik dedaunan sebagai *pink noise* penangkal distraksi.
4. 🐦 **Kicauan Burung (`bird.mp3`)**: Suasana pagi hari yang membangkitkan kesegaran pikiran.
5. 🫧 **Tetesan Air (`water-drop.mp3`)**: Tetesan air hening untuk meditasi zikir dan ketenangan.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router + Turbopack)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Audio Processing**: [Tone.js 15](https://tonejs.github.io/) (Web Audio API Engine)
- **Analytics**: [@vercel/analytics](https://vercel.com/analytics)
- **Styling**: Vanilla CSS (Custom Design System, Dark Mode, Frosted Glass)
- **Typography**: Google Fonts (*Inter* & *Amiri Quranic Serif*)
- **Data Source**: [EQuran.id API v2](https://equran.id/apidev/v2)
- **Storage**: Browser LocalStorage API

---

## 🚀 Instalasi & Menjalankan

### Prasyarat
- [Node.js](https://nodejs.org/) versi 18.18.0 atau yang lebih baru
- NPM, Yarn, atau PNPM

### 1. Clone Repositori
```bash
git clone https://github.com/username/murotalify.git
cd murotalify/murotalify
```

### 2. Pasang Dependensi
```bash
npm install
```

### 3. Jalankan Development Server
```bash
npm run dev
```

Buka peramban Anda pada tautan:
```
http://localhost:3000
```

### 4. Build untuk Lingkungan Produksi
```bash
npm run build
npm run start
```

---

## 📁 Struktur Proyek

```
murotalify/
├── public/
│   ├── logo.png                   # Aset grafis logo aplikasi
│   └── sounds/                    # Berkas audio suara alam (Clean / Dry)
│       ├── bird.mp3               # Kicauan burung
│       ├── nature.mp3             # Suara alam & hutan
│       ├── rain.mp3               # Rintik hujan
│       ├── water.mp3              # Aliran sungai jernih
│       └── water-drop.mp3         # Tetesan air hening
├── src/
│   └── app/
│       ├── api/
│       │   └── audio/
│       │       └── route.js       # Streaming audio proxy dengan header CORS Web Audio API
│       ├── components/
│       │   ├── AddToPlaylistModal.js    # Modal tambah surah ke daftar putar
│       │   ├── AmbientMixer.js          # Drawer mixer suara alam mandiri
│       │   ├── AppShell.js              # Rangka layout dan navigasi atas
│       │   ├── CollectionsSection.js    # Kartu koleksi & modal kurasi dalil
│       │   ├── ContextMenu.js           # Menu klik-kanan cepat
│       │   ├── CreatePlaylistModal.js   # Modal pembuatan daftar putar baru
│       │   ├── HomePage.js              # Beranda & grid 114 surah
│       │   ├── LandingPage.js           # Halaman panduan & pusat informasi
│       │   ├── LibraryPage.js           # Pustaka daftar putar & riwayat
│       │   ├── MobileNav.js             # Navigasi bawah perangkat mobile
│       │   ├── MurotalEffectPanel.js    # Panel kendali gema & resonansi Tone.js
│       │   ├── NowPlayingBar.js         # Player dock bawah ala Spotify
│       │   ├── PlaceholderCover.js      # Seni geometris & metadata kurasi dalil
│       │   ├── PlaylistDetail.js        # Halaman detail daftar putar
│       │   ├── SearchPage.js            # Pencarian instan surah & ayat
│       │   ├── Sidebar.js               # Navigasi samping desktop
│       │   ├── SurahDetail.js           # Penampil ayat Arab, Latin & tafsir
│       │   └── Toast.js                 # Notifikasi interaktif
│       ├── context/
│       │   └── AppContext.js            # Global state, Tone.js engine & audio lifecycle
│       ├── lib/
│       │   └── api.js                   # Client fetcher EQuran.id v2
│       ├── globals.css                  # Desain sistem CSS tanpa colored shadows
│       ├── layout.js                    # Root layout & Vercel Analytics integration
│       └── page.js                      # Root entry point
├── package.json
└── README.md
```

---

## 🌐 API Reference

Data Al-Quran dan audio qari bersumber dari API publik **[EQuran.id API v2](https://equran.id/apidev/v2)**:

- **Daftar Seluruh Surat**:
  ```http
  GET https://equran.id/api/v2/surat
  ```
- **Detail Surat & Ayat**:
  ```http
  GET https://equran.id/api/v2/surat/{nomor}
  ```

Proxy streaming audio lokal untuk Web Audio API:
```http
GET /api/audio?url={audioUrlEncoded}
```

---

## 📄 Lisensi & Kontribusi

Proyek ini dibangun untuk tujuan edukasi, ibadah, dan pemanfaatan non-komersial. Seluruh teks ayat Al-Quran dan terjemahan bersumber dari Kementerian Agama RI melalui EQuran.id.

---

<div align="center">
  <sub>Murotalify — Menghadirkan ketenangan tilawah Al-Quran ke dalam ritme harian Anda. 🕊️✨</sub>
</div>
