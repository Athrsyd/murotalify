import './globals.css';

export const metadata = {
  title: 'Murotalify - Quran Recitation with Nature Sounds',
  description: 'Dengarkan murotal Al-Quran dari qari terbaik dunia dengan suara alam yang menenangkan di Murotalify. Seperti Spotify, tapi untuk Al-Quran.',
  keywords: 'murotalify, murotal, quran, al-quran, recitation, nature sounds, ambient, islamic, muslim',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
