import { HADITHS_DATA, HADITH_CATEGORIES } from '../data/hadithsData';

const PAGE_SIZE = 10;

/**
 * Fetch paginated hadiths with filtering and search
 */
export async function getHadiths({ category = 'all', search = '', page = 1, limit = PAGE_SIZE } = {}) {
  // Simulate network delay for smooth skeleton demonstration
  await new Promise((res) => setTimeout(res, 250));

  let filtered = [...HADITHS_DATA];

  // Category filter
  if (category && category !== 'all') {
    filtered = filtered.filter((h) => h.category === category);
  }

  // Search filter
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (h) =>
        h.title.toLowerCase().includes(q) ||
        h.text.toLowerCase().includes(q) ||
        h.narrator.toLowerCase().includes(q) ||
        h.source.toLowerCase().includes(q) ||
        h.book.toLowerCase().includes(q) ||
        (h.keywords && h.keywords.some((k) => k.toLowerCase().includes(q)))
    );
  }

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = filtered.slice(startIndex, endIndex);
  const hasMore = endIndex < total;

  return {
    data,
    total,
    page,
    limit,
    hasMore,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get daily featured hadith (deterministic based on day of year)
 */
export function getDailyHadith() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
  );
  const index = dayOfYear % HADITHS_DATA.length;
  return HADITHS_DATA[index] || HADITHS_DATA[0];
}

/**
 * Get random hadith
 */
export function getRandomHadith() {
  const randomIndex = Math.floor(Math.random() * HADITHS_DATA.length);
  return HADITHS_DATA[randomIndex];
}
