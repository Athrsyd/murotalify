export default function manifest() {
  return {
    name: "Murotalify - Murottal Al-Qur'an 30 Juz & Suara Alam",
    short_name: 'Murotalify',
    description: "Platform streaming murottal Al-Qur'an 30 juz merdu dipadukan audio alam relaksasi hemat kuota data.",
    start_url: '/',
    display: 'standalone',
    background_color: '#080c14',
    theme_color: '#080c14',
    orientation: 'portrait-primary',
    categories: ['music', 'lifestyle', 'education', 'religion'],
    lang: 'id',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
