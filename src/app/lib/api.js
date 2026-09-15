const API_BASE = 'https://equran.id/api/v2';

export async function fetchAllSurahs() {
  const res = await fetch(`${API_BASE}/surat`);
  const json = await res.json();
  if (json.code === 200) return json.data;
  throw new Error(json.message || 'Failed to fetch surahs');
}

export async function fetchSurahDetail(nomor) {
  const res = await fetch(`${API_BASE}/surat/${nomor}`);
  const json = await res.json();
  if (json.code === 200) return json.data;
  throw new Error(json.message || 'Failed to fetch surah detail');
}
