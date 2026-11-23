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
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} ${amiri.variable}`}>
      <head>
        <meta name="google-site-verification" content="PhMd0i_1rZJmUBXjvN1YQ9ARLr_bJDwgmr0oUY7z7bA" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
