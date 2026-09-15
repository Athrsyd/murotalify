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
    title: 'Focus & Work',
    subtitle: 'Murotal penenang untuk fokus dan produktivitas',
    className: 'collection-card-focus',
    surahIds: [55, 67, 36, 94], // Ar-Rahman, Al-Mulk, Yasin, Al-Insyirah
    ambientSound: 'nature',
  },
  recitations: {
    id: 'recitations',
    title: 'Most Beautiful Recitations',
    subtitle: 'Lantunan ayat paling merdu dan menyentuh hati',
    className: 'collection-card-recitations',
    surahIds: [1, 19, 12, 55, 18], // Al-Fatihah, Maryam, Yusuf, Ar-Rahman, Al-Kahf
    ambientSound: 'bird',
  },
  sleep: {
    id: 'sleep',
    title: 'Sleep Mode',
    subtitle: 'Surat penenang tidur & istirahat malam',
    className: 'collection-card-sleep',
    surahIds: [67, 32, 76, 93, 112, 113, 114], // Al-Mulk, As-Sajdah, Al-Insan, Ad-Duha, Muawwidzat
    ambientSound: 'rain',
  },
  ruqia: {
    id: 'ruqia',
    title: 'Duaa & Ruqia',
    subtitle: 'Ayat perlindungan & doa penawar hati',
    className: 'collection-card-ruqia',
    surahIds: [1, 2, 109, 112, 113, 114], // Al-Fatihah, Al-Baqarah, Muawwidzat
    ambientSound: 'water-drop',
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
