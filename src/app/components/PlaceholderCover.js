'use client';

export function GeometricWatermark({ type = 'focus', opacity = 0.25 }) {
  switch (type) {
    case 'focus': // Concentric circles
      return (
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="watermark-svg"
          style={{ opacity }}
        >
          <circle cx="100" cy="100" r="22" stroke="white" strokeWidth="1.2" />
          <circle cx="100" cy="100" r="42" stroke="white" strokeWidth="1.2" />
          <circle cx="100" cy="100" r="62" stroke="white" strokeWidth="1.2" />
          <circle cx="100" cy="100" r="82" stroke="white" strokeWidth="1.2" />
          <circle cx="100" cy="100" r="98" stroke="white" strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      );

    case 'recitations': // Floral symmetrical mandala
      return (
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="watermark-svg"
          style={{ opacity }}
        >
          <g transform="translate(100, 100)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-36"
                rx="20"
                ry="38"
                stroke="white"
                strokeWidth="1.2"
                transform={`rotate(${angle})`}
              />
            ))}
            <circle cx="0" cy="0" r="14" stroke="white" strokeWidth="1.2" />
          </g>
        </svg>
      );

    case 'sleep': // Sleep mode: subtle crescent glow arc + stylized geometric Z z z
      return (
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="watermark-svg"
          style={{ opacity }}
        >
          {/* Subtle planet crescent glow curve on the right */}
          <path
            d="M 120,20 A 80,80 0 0,1 150,180"
            stroke="rgba(96, 165, 250, 0.45)"
            strokeWidth="8"
            strokeLinecap="round"
            filter="blur(2px)"
          />
          <path
            d="M 120,20 A 80,80 0 0,1 150,180"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Stylized geometric Z z z */}
          <g transform="translate(105, 55)" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 0,0 L 22,0 L 4,20 L 26,20" />
          </g>
          <g transform="translate(130, 25)" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 0,0 L 16,0 L 3,14 L 19,14" />
          </g>
          <g transform="translate(85, 90)" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 0,0 L 30,0 L 6,28 L 36,28" />
          </g>
        </svg>
      );

    case 'ruqia': // Radiant rays fanning out from bottom
      return (
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="watermark-svg"
          style={{ opacity }}
        >
          <g stroke="white" strokeWidth="1.1" strokeLinecap="round">
            {Array.from({ length: 17 }).map((_, i) => {
              const startX = 100;
              const startY = 205;
              const targetX = (200 / 16) * i;
              return (
                <line
                  key={i}
                  x1={startX}
                  y1={startY}
                  x2={targetX}
                  y2="0"
                />
              );
            })}
          </g>
        </svg>
      );

    default:
      return null;
  }
}

export const PLACEHOLDER_THEMES = {
  focus: {
    id: 'focus',
    title: 'Fokus & Belajar',
    subtitle: 'Konsentrasi mental, kelapangan dada, dan ketenangan berpikir',
    targetWave: 'Gelombang Alpha (8–12 Hz) • Fokus Kerja Mendalam',
    className: 'collection-card-focus',
    surahIds: [94, 20, 87, 55, 35, 67], // Al-Insyirah, Thaha, Al-A'la, Ar-Rahman, Fatir, Al-Mulk
    defaultQari: '01', // Syaikh Abdullah Al-Juhany
    qariName: 'Abdullah Al-Juhany',
    qariMaqam: 'Rast & Bayati (Tempo tadwir stabil & artikulasi huruf tegas)',
    ambientSound: 'nature',
    ambientSoundName: 'Suara Alam',
    ambientVolume: 0.30,
    murotalVolume: 0.70,
    effectPreset: 'khusyuk', // Jernih & Khidmat
    effectPresetName: 'Jernih & Khidmat',
    tracks: [
      {
        nomor: 94,
        namaLatin: 'Al-Insyirah',
        format: 'Surah Utuh',
        ayatRange: 'Ayat 1–8',
        dalil: 'Penenang beban pikiran, kelapangan dada dari rasa cemas dan letih belajar (fa inna ma\'al \'usri yusra).',
      },
      {
        nomor: 20,
        namaLatin: 'Thaha',
        format: 'Ayat Pilihan',
        ayatRange: 'Ayat 1–36 & 114',
        dalil: 'Doa Nabi Musa meminta kelapangan urusan (Rabbi-syrahli shadrii) & permohonan ilmu (Rabbi zidnii \'ilmaa).',
      },
      {
        nomor: 87,
        namaLatin: 'Al-A\'la',
        format: 'Surah Utuh',
        ayatRange: 'Ayat 1–19',
        dalil: 'Janji kemudahan mengingat dan memahami ilmu hafalan (Sanuqri\'uka falaa tansaa).',
      },
      {
        nomor: 55,
        namaLatin: 'Ar-Rahman',
        format: 'Ayat Pilihan',
        ayatRange: 'Ayat 1–30',
        dalil: 'Harmoni berpikir teratur dan pengingat hakikat ilmu (\'Allamal-Qur\'an, khalaqal-insan, \'allamahul-bayan).',
      },
      {
        nomor: 35,
        namaLatin: 'Fatir',
        format: 'Ayat Pilihan',
        ayatRange: 'Ayat 27–29',
        dalil: 'Etika penuntut ilmu dan kekhusyukan hamba yang berpengetahuan (Innama yakhsyallaha min \'ibadihil-\'ulama\').',
      },
      {
        nomor: 67,
        namaLatin: 'Al-Mulk',
        format: 'Ayat Pilihan',
        ayatRange: 'Ayat 1–15',
        dalil: 'Stimulasi nalar observatif melalui kesempurnaan ciptaan langit tanpa cela.',
      },
    ],
  },
  recitations: {
    id: 'recitations',
    title: 'Tilawah Syahdu',
    subtitle: 'Lantunan penuh penghayatan yang menggetarkan kalbu',
    targetWave: 'Katarsis Emosional & Tadabbur Mendalam',
    className: 'collection-card-recitations',
    surahIds: [19, 12, 18, 25, 50, 55], // Maryam, Yusuf, Al-Kahf, Al-Furqan, Qaf, Ar-Rahman
    defaultQari: '06', // Syaikh Yasser Al-Dosari
    qariName: 'Yasser Al-Dosari',
    qariMaqam: 'Kurd & Hijaz (Vokal haru buka\'iyyah & resonansi dada megah)',
    ambientSound: null, // Clean audio
    ambientSoundName: 'Audio Jernih (Tanpa Suara Alam)',
    ambientVolume: 0.0,
    murotalVolume: 0.95,
    effectPreset: 'kubah', // Mendalam & Mengalun
    effectPresetName: 'Mendalam & Mengalun',
    tracks: [
      {
        nomor: 19,
        namaLatin: 'Maryam',
        format: 'Ayat Pilihan',
        ayatRange: 'Ayat 1–36',
        dalil: 'Kisah munajat lirih Nabi Zakariya (nidaa-an khafiyya) dan mukjizat Maryam dengan rima akhir menyentuh kalbu.',
      },
      {
        nomor: 12,
        namaLatin: 'Yusuf',
        format: 'Ayat Pilihan',
        ayatRange: 'Ayat 1–34 & 83–93',
        dalil: 'Kisah terindah (Ahsan al-Qashash), kepasrahan Nabi Ya\'qub (Innama asykuu bats-tsi wa huznii ilallah).',
      },
      {
        nomor: 18,
        namaLatin: 'Al-Kahf',
        format: 'Ayat Pilihan',
        ayatRange: '10 Awal & 10 Akhir',
        dalil: 'Perlindungan dari fitnah (HR. Muslim no. 809) dan ayat penutup tentang kerinduan berjumpa Allah.',
      },
      {
        nomor: 25,
        namaLatin: 'Al-Furqan',
        format: 'Ayat Pilihan',
        ayatRange: 'Ayat 63–77',
        dalil: 'Potret hamba ar-Rahman yang berjalan rendah hati dan bermunajat di keheningan malam.',
      },
      {
        nomor: 50,
        namaLatin: 'Qaf',
        format: 'Ayat Pilihan',
        ayatRange: 'Ayat 16–35',
        dalil: 'Keintiman Allah yang lebih dekat dari urat leher (Wa nahnu aqrabu ilaihi min hablil-warid) dan kabar surga.',
      },
      {
        nomor: 55,
        namaLatin: 'Ar-Rahman',
        format: 'Surah Utuh',
        ayatRange: 'Ayat 1–78',
        dalil: 'Pengantin Al-Qur\'an (\'Arusul Qur\'an), perayaan limpahan nikmat dan rahmat Ilahi.',
      },
    ],
  },
  sleep: {
    id: 'sleep',
    title: 'Pengantar Tidur',
    subtitle: 'Sunnah malam dan zikir perlindungan istirahat lelap',
    targetWave: 'Gelombang Theta & Delta • Relaksasi Parasimpatis',
    className: 'collection-card-sleep',
    surahIds: [67, 32, 2, 76, 112, 113, 114], // Al-Mulk, As-Sajdah, Al-Baqarah, Al-Insan, Muawwidzat
    defaultQari: '02', // Syaikh Abdul Muhsin Al-Qasim
    qariName: 'Abdul Muhsin Al-Qasim',
    qariMaqam: 'Nahawand & Bayati (Bariton teduh bertempo tenang)',
    ambientSound: 'rain',
    ambientSoundName: 'Suara Hujan',
    ambientVolume: 0.40,
    murotalVolume: 0.60,
    effectPreset: 'nabawi', // Tenang & Syahdu
    effectPresetName: 'Tenang & Syahdu',
    tracks: [
      {
        nomor: 67,
        namaLatin: 'Al-Mulk',
        format: 'Surah Utuh',
        ayatRange: 'Ayat 1–30',
        dalil: 'Sunnah malam Rasulullah ﷺ dan penyelamat dari siksa kubur (HR. At-Tirmidzi no. 2891).',
      },
      {
        nomor: 32,
        namaLatin: 'As-Sajdah',
        format: 'Surah Utuh',
        ayatRange: 'Ayat 1–30',
        dalil: 'Sunnah Nabawiyyah dibaca sebelum tidur setiap malam (HR. Ahmad no. 14249 & At-Tirmidzi no. 3404).',
      },
      {
        nomor: 2,
        namaLatin: 'Al-Baqarah',
        format: 'Ayat Pilihan',
        ayatRange: 'Khawatim (2 Ayat Terakhir)',
        dalil: 'Penjagaan malam dan kecukupan dari marabahaya serta insomnia (HR. Bukhari no. 5009 & Muslim no. 808).',
      },
      {
        nomor: 76,
        namaLatin: 'Al-Insan',
        format: 'Ayat Pilihan',
        ayatRange: 'Ayat 1–22',
        dalil: 'Kedamaian negeri akhirat dan ketenangan surga yang sejuk menghadirkan relaksasi jiwa.',
      },
      {
        nomor: 112,
        namaLatin: 'Al-Ikhlas',
        format: 'Surah Utuh',
        ayatRange: 'Ayat 1–4',
        dalil: 'Al-Mu\'awwidzat dibaca 3x dan ditiupkan ke telapak tangan sebelum tidur (HR. Bukhari no. 5017).',
      },
      {
        nomor: 113,
        namaLatin: 'Al-Falaq',
        format: 'Surah Utuh',
        ayatRange: 'Ayat 1–5',
        dalil: 'Perlindungan dari kegelapan malam apabila telah gelap gulita (ghasiqin idza waqab).',
      },
      {
        nomor: 114,
        namaLatin: 'An-Nas',
        format: 'Surah Utuh',
        ayatRange: 'Ayat 1–6',
        dalil: 'Benteng dari bisikan was-was setan saat hendak terlelap.',
      },
    ],
  },
  ruqia: {
    id: 'ruqia',
    title: 'Doa & Ruqyah',
    subtitle: 'Ayat perlindungan tauhid, penawar batin, dan benteng diri',
    targetWave: 'Tazkiyatun Nafs & Proteksi Spiritual',
    className: 'collection-card-ruqia',
    surahIds: [1, 2, 59, 112, 113, 114], // Al-Fatihah, Al-Baqarah, Al-Hasyr, Muawwidzat
    defaultQari: '05', // Syaikh Misyari Rasyid Al-Afasy
    qariName: 'Misyari Rasyid Al-Afasy',
    qariMaqam: 'Kurd & Ajam (Artikulasi tajwid tegas, makhraj isti\'la kokoh)',
    ambientSound: 'water',
    ambientSoundName: 'Air Mengalir',
    ambientVolume: 0.20,
    murotalVolume: 0.80,
    effectPreset: 'haram', // Megah & Luas
    effectPresetName: 'Megah & Luas',
    tracks: [
      {
        nomor: 1,
        namaLatin: 'Al-Fatihah',
        format: 'Surah Utuh',
        ayatRange: 'Ayat 1–7',
        dalil: 'Induk segala kesembuhan (Asy-Syifaa\' & Ar-Ruqyah) sesuai sabda Nabi ﷺ (HR. Bukhari no. 5736).',
      },
      {
        nomor: 2,
        namaLatin: 'Al-Baqarah',
        format: 'Ayat Pilihan',
        ayatRange: 'Ayat Kursi (255) & Ayat 1–5, 284–286',
        dalil: 'Rumah yang dibacakan Al-Baqarah tidak dimasuki setan (HR. Muslim no. 780); Ayat Kursi adalah ayat teragung penjaga diri.',
      },
      {
        nomor: 59,
        namaLatin: 'Al-Hasyr',
        format: 'Ayat Pilihan',
        ayatRange: 'Ayat 21–24 (Akhir Al-Hasyr)',
        dalil: 'Keagungan Al-Qur\'an yang meluluhkan kesombongan dan serangkaian Asmaul Husna penjaga jiwa.',
      },
      {
        nomor: 112,
        namaLatin: 'Al-Ikhlas',
        format: 'Surah Utuh',
        ayatRange: 'Ayat 1–4',
        dalil: 'Kemurnian tauhid; membacanya setara sepertiga Al-Qur\'an (HR. Bukhari no. 5013).',
      },
      {
        nomor: 113,
        namaLatin: 'Al-Falaq',
        format: 'Surah Utuh',
        ayatRange: 'Ayat 1–5',
        dalil: 'Benteng penangkal sihir, hasad dengki, dan kejahatan makhluk di kala gelap.',
      },
      {
        nomor: 114,
        namaLatin: 'An-Nas',
        format: 'Surah Utuh',
        ayatRange: 'Ayat 1–6',
        dalil: 'Perlindungan dari bisikan was-was jin dan manusia (HR. Abu Dawud no. 5082).',
      },
    ],
  },
};

export default function PlaceholderCover({ type = 'focus', title = '', number = null, arabic = '' }) {
  return (
    <div className={`placeholder-cover collection-card-${type}`}>
      <GeometricWatermark type={type} />
      <div className="placeholder-content">
        {number && <div className="placeholder-number">{number}</div>}
        {arabic && <div className="placeholder-arabic">{arabic}</div>}
        {title && <div className="placeholder-title">{title}</div>}
      </div>
    </div>
  );
}
