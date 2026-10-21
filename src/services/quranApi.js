// Quran API client supporting AlQuran Cloud and Mp3Quran endpoints

const ALQURAN_BASE = 'https://api.alquran.cloud/v1';

/**
 * Fetch all 114 Surahs metadata
 */
export async function fetchSurahList() {
  try {
    const res = await fetch(`${ALQURAN_BASE}/surah`);
    if (!res.ok) throw new Error('فشل جلب قائمة السور');
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error('Error fetching surah list:', err);
    throw err;
  }
}

/**
 * Fetch a specific Surah with verses (Arabic text + optional edition)
 */
export async function fetchSurahDetails(surahNumber, edition = 'quran-uthmani') {
  try {
    const res = await fetch(`${ALQURAN_BASE}/surah/${surahNumber}/${edition}`);
    if (!res.ok) throw new Error(`فشل جلب تفاصيل السورة ${surahNumber}`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error(`Error fetching surah ${surahNumber}:`, err);
    throw err;
  }
}

/**
 * Fetch Surah with both Arabic text and Arabic Tafsir (e.g. ar.muyassar)
 */
export async function fetchSurahWithTafsir(surahNumber) {
  try {
    const res = await fetch(`${ALQURAN_BASE}/surah/${surahNumber}/editions/quran-uthmani,ar.muyassar`);
    if (!res.ok) throw new Error('فشل جلب التفسير الميسر للسورة');
    const data = await res.json();
    return {
      arabic: data.data[0],
      tafsir: data.data[1],
    };
  } catch (err) {
    console.error(`Error fetching Tafsir for surah ${surahNumber}:`, err);
    throw err;
  }
}

/**
 * Fetch specific Juz
 */
export async function fetchJuzDetails(juzNumber) {
  try {
    const res = await fetch(`${ALQURAN_BASE}/juz/${juzNumber}/quran-uthmani`);
    if (!res.ok) throw new Error(`فشل جلب الجزء ${juzNumber}`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error(`Error fetching Juz ${juzNumber}:`, err);
    throw err;
  }
}

/**
 * Search Quran text
 */
export async function searchQuranText(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const encoded = encodeURIComponent(query);
    const res = await fetch(`${ALQURAN_BASE}/search/${encoded}/all/ar`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.matches || [];
  } catch (err) {
    console.error('Error searching Quran:', err);
    return [];
  }
}
