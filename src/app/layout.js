import './globals.css';
import { Inter, Amiri } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-amiri',
});

export const metadata = {
  metadataBase: new URL('https://murotalify.com'),
  title: {
    default: "Murotalify - Dengarkan Murottal Al-Qur'an 30 Juz & Audio Alam Relaksasi",
    template: "%s | Murotalify - Audio Al-Qur'an Online",
  },
  description: "Platform streaming murottal Al-Qur'an 30 juz terlengkap dengan perpaduan audio alam relaksasi (hujan, ombak, hutan, angin). Dilengkapi teks Arab, terjemahan Indonesia, hemat kuota data, dan qari terbaik dunia.",
  keywords: [
    'murotalify',
    'murottal al quran',
    'murottal 30 juz',
    'al quran online',
    'audio murottal merdu',
    'baca quran terjemahan indonesia',
    'murottal hemat kuota',
    'suara alam relaksasi quran',
    'tadabbur al quran',
    'misyari rasyid al afasy',
    'abdurrahman as sudais',
    'yasser al dosari',
    'abdullah al juhany',
    'surat al kahfi',
    'surat al baqarah',
    'surat yasin',
    'surat ar rahman',
    'surat al mulk',
    'spotify quran',
  ],
  authors: [{ name: 'Murotalify Team', url: 'https://murotalify.com' }],
  creator: 'Murotalify',
  publisher: 'Murotalify',
  applicationName: 'Murotalify',
  category: 'music',
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://murotalify.com',
    siteName: 'Murotalify',
    title: "Murotalify - Streaming Murottal Al-Qur'an 30 Juz & Suara Alam",
    description: "Dengarkan tilawah murottal Al-Qur'an merdu lengkap 30 juz dengan perpaduan suara alam penenang jiwa. Mode hemat kuota & qari pilihan dunia.",
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'Murotalify Logo - Murottal Al-Qur’an & Suara Alam',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Murotalify - Streaming Murottal Al-Qur'an & Suara Alam",
    description: "Dengarkan tilawah murottal Al-Qur'an merdu lengkap 30 juz dengan suara alam penenang jiwa.",
    images: ['/logo.png'],
  },
  verification: {
    google: 'PhMd0i_1rZJmUBXjvN1YQ9ARLr_bJDwgmr0oUY7z7bA',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#080c14',
  colorScheme: 'dark',
};

export default function RootLayout({ children }) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Murotalify',
    alternateName: ["Murotalify App", "Al-Qur'an & Suara Alam Online"],
    url: 'https://murotalify.com',
    description: "Platform streaming murottal Al-Qur'an 30 juz terlengkap dipadukan dengan audio suara alam relaksasi penenang hati.",
    inLanguage: 'id-ID',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://murotalify.com/?view=search&q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Murotalify',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5 Audio.',
    url: 'https://murotalify.com',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'IDR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '1250',
    },
    featureList: [
      "Murottal Al-Qur'an 30 Juz Lengkap",
      "Pilihan Qari Internasional Terbaik (Misyari Rasyid, Sudais, Al-Juhany, Al-Dosari)",
      "Audio Mixer Suara Alam Relaksasi (Hujan, Ombak, Hutan, Angin, Malam)",
      "Akustik Ruang Gema Masjid Nabawi & Haram",
      "Mode Super Hemat Kuota & Offline Caching",
      "Teks Arab Lengkap dan Terjemahan Bahasa Indonesia",
    ],
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Murotalify',
    url: 'https://murotalify.com',
    logo: 'https://murotalify.com/logo.png',
  };

  return (
    <html lang="id" className={`dark ${inter.variable} ${amiri.variable}`} data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.equran.id" />
        <link rel="dns-prefetch" href="https://cdn.equran.id" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
