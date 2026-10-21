import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Scroll, HeartHandshake, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import { HADITHS_DATA } from '../../data/hadithsData';
import { AZKAR_DATA } from '../../data/azkarData';
import { searchQuranText } from '../../services/quranApi';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [quranResults, setQuranResults] = useState([]);
  const [hadithResults, setHadithResults] = useState([]);
  const [azkarResults, setAzkarResults] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!searchTerm.trim()) {
      setQuranResults([]);
      setHadithResults([]);
      setAzkarResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const query = searchTerm.trim();

      // Search Hadiths
      const matchedHadiths = HADITHS_DATA.filter(h =>
        h.text.includes(query) ||
        h.title.includes(query) ||
        h.narrator.includes(query) ||
        (h.keywords && h.keywords.some(k => k.includes(query)))
      );
      setHadithResults(matchedHadiths.slice(0, 5));

      // Search Azkar
      const allAzkar = Object.values(AZKAR_DATA).flat();
      const matchedAzkar = allAzkar.filter(a => a.text.includes(query));
      setAzkarResults(matchedAzkar.slice(0, 5));

      // Search Quran API
      try {
        const quranMatches = await searchQuranText(query);
        setQuranResults(quranMatches.slice(0, 5));
      } catch (err) {
        console.error('Quran search error:', err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelect = (url) => {
    onClose();
    navigate(url);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="البحث الشامل في وصال" maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Search Input Box */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث في القرآن، الأحاديث، أو الأذكار..."
            autoFocus
            className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-gold-400/30 rounded-2xl py-3.5 pr-12 pl-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-600 dark:focus:border-gold-400 focus:ring-1 focus:ring-emerald-600 dark:focus:ring-gold-400 text-base sm:text-lg"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600 dark:text-gold-400" />
          {loading && (
            <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-spin" />
          )}
        </div>

        {/* Results */}
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
          {/* Quick Pages */}
          {!searchTerm && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">اقسام سريعة</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => handleSelect('/quran')}
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20 hover:border-emerald-600 dark:hover:border-gold-400/50 text-slate-800 dark:text-slate-200 transition-all text-sm font-semibold"
                >
                  <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>القرآن الكريم</span>
                </button>
                <button
                  onClick={() => handleSelect('/hadith')}
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20 hover:border-emerald-600 dark:hover:border-gold-400/50 text-slate-800 dark:text-slate-200 transition-all text-sm font-semibold"
                >
                  <Scroll className="w-4 h-4 text-amber-600 dark:text-gold-400" />
                  <span>الأحاديث</span>
                </button>
                <button
                  onClick={() => handleSelect('/azkar')}
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20 hover:border-emerald-600 dark:hover:border-gold-400/50 text-slate-800 dark:text-slate-200 transition-all text-sm font-semibold"
                >
                  <HeartHandshake className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>الأذكار</span>
                </button>
                <button
                  onClick={() => handleSelect('/audio')}
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20 hover:border-emerald-600 dark:hover:border-gold-400/50 text-slate-800 dark:text-slate-200 transition-all text-sm font-semibold"
                >
                  <BookOpen className="w-4 h-4 text-indigo-600 dark:text-amber-400" />
                  <span>المستمع</span>
                </button>
              </div>
            </div>
          )}

          {/* Quran Results */}
          {quranResults.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>نتائج القرآن الكريم ({quranResults.length})</span>
              </h4>
              <div className="space-y-2">
                {quranResults.map((m, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelect(`/quran/${m.surah.number}`)}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-500/10 hover:border-emerald-500 dark:hover:border-emerald-500/40 cursor-pointer transition-all flex items-center justify-between gap-4 group"
                  >
                    <div>
                      <p className="font-quran text-lg text-slate-900 dark:text-slate-100 mb-1">{m.text}</p>
                      <span className="text-xs text-emerald-700 dark:text-gold-400 font-bold">سورة {m.surah.name} (آية {m.numberInSurah})</span>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-gold-400 group-hover:-translate-x-1 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hadith Results */}
          {hadithResults.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-700 dark:text-gold-400 uppercase tracking-wider flex items-center gap-2">
                <Scroll className="w-4 h-4" />
                <span>نتائج الأحاديث النبوية ({hadithResults.length})</span>
              </h4>
              <div className="space-y-2">
                {hadithResults.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => handleSelect('/hadith')}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-gold-400/10 hover:border-amber-500 dark:hover:border-gold-400/40 cursor-pointer transition-all flex items-center justify-between gap-4 group"
                  >
                    <div>
                      <h5 className="font-bold text-emerald-800 dark:text-gold-400 text-sm mb-1">{h.title}</h5>
                      <p className="text-sm text-slate-700 dark:text-slate-200 line-clamp-2">{h.text}</p>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-amber-700 dark:group-hover:text-gold-400 group-hover:-translate-x-1 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Azkar Results */}
          {azkarResults.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider flex items-center gap-2">
                <HeartHandshake className="w-4 h-4" />
                <span>نتائج الأذكار ({azkarResults.length})</span>
              </h4>
              <div className="space-y-2">
                {azkarResults.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => handleSelect('/azkar')}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-teal-950/30 border border-slate-200 dark:border-teal-500/10 hover:border-teal-500 dark:hover:border-teal-500/40 cursor-pointer transition-all flex items-center justify-between gap-4 group"
                  >
                    <p className="text-sm text-slate-700 dark:text-slate-200 line-clamp-2">{a.text}</p>
                    <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-teal-700 dark:group-hover:text-teal-400 group-hover:-translate-x-1 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchTerm && !loading && quranResults.length === 0 && hadithResults.length === 0 && azkarResults.length === 0 && (
            <div className="text-center py-10 text-slate-500 dark:text-slate-400 space-y-2">
              <Search className="w-10 h-10 mx-auto opacity-30 text-emerald-600 dark:text-gold-400" />
              <p>لم نجد نتائج مطابقة لبحثك "{searchTerm}"</p>
              <p className="text-xs text-slate-400">تأكد من كتابة الكلمة بشكل صحيح</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
