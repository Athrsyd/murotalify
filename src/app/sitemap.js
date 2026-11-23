export default async function sitemap() {
  const baseUrl = 'https://murotalify.com';
  const lastModified = new Date();

  // Highlighted popular surahs get higher priority for search ranking
  const popularSurahs = [1, 2, 3, 18, 36, 55, 56, 67, 112, 113, 114];

  const surahEntries = Array.from({ length: 114 }, (_, i) => {
    const nomor = i + 1;
    const isPopular = popularSurahs.includes(nomor);
    return {
      url: `${baseUrl}/?surah=${nomor}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: isPopular ? 0.95 : 0.8,
    };
  });

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/landing`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/?view=search`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/?view=quota`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/?view=library`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...surahEntries,
  ];
}
