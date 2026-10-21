import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BookOpen, Search, Play, Bookmark, BookmarkCheck, Copy, Share2, Info, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { fetchSurahList, fetchSurahWithTafsir } from '../../services/quranApi';
import { useBookmarks } from '../../context/BookmarkContext';
import { useAudioPlayer } from '../../context/AudioContext';
import { useUserPreferences } from '../../context/UserPreferencesContext';
import { CardSkeleton, QuranReaderSkeleton } from '../../components/ui/Skeleton';
import Modal from '../../components/ui/Modal';
import { RECITERS_LIST } from '../../services/reciterService';

export default function QuranPage() {
  const { surahId } = useParams();
  const navigate = useNavigate();

  const { bookmarks, toggleBookmark, isBookmarked, saveLastRead } = useBookmarks();
  const { playSurah } = useAudioPlayer();
  const { quranFontSize, updateQuranFontSize, showToast } = useUserPreferences();

  // Surahs list state
  const [surahs, setSurahs] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Reader state
  const [surahData, setSurahData] = useState(null);
  const [tafsirData, setTafsirData] = useState(null);
  const [loadingReader, setLoadingReader] = useState(false);
  const [activeTafsirAyah, setActiveTafsirAyah] = useState(null);
  const [focusMode, setFocusMode] = useState(false);

  // Fetch Surah list
  useEffect(() => {
    fetchSurahList()
      .then(data => {
        setSurahs(data);
        setLoadingList(false);
      })
      .catch(err => {
        console.error('Error fetching surahs:', err);
        setLoadingList(false);
      });
  }, []);

  // Fetch Reader Data when surahId changes
  useEffect(() => {
    if (surahId) {
      setLoadingReader(true);
      const sNum = parseInt(surahId);

      fetchSurahWithTafsir(sNum)
        .then(({ arabic, tafsir }) => {
          setSurahData(arabic);
          setTafsirData(tafsir);
          setLoadingReader(false);
          saveLastRead(arabic.number, arabic.name, 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        })
        .catch(err => {
          console.error('Error fetching reader surah:', err);
          setLoadingReader(false);
        });
    } else {
      setSurahData(null);
      setTafsirData(null);
    }
  }, [surahId]);

  // Copy Ayah
  const handleCopyAyah = (text, surahName, ayahNum) => {
    const content = `﴿ ${text} ﴾ [ سورة ${surahName}: الآية ${ayahNum} ] — منصة وصال`;
    navigator.clipboard.writeText(content);
    showToast('تم نسخ الآية المباركة إلى الحافظة');
  };

  // Share Ayah
  const handleShareAyah = (text, surahName, ayahNum) => {
    const content = `﴿ ${text} ﴾ [ سورة ${surahName}: الآية ${ayahNum} ] — منصة وصال`;
    if (navigator.share) {
      navigator.share({ title: `آية من سورة ${surahName}`, text: content });
    } else {
      navigator.clipboard.writeText(content);
      showToast('تم نسخ رابط/نص الآية للمشاركة');
    }
  };

  // Filtered Surahs list
  const filteredSurahs = surahs.filter(s => {
    return s.name.includes(searchTerm) || s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) || s.number.toString() === searchTerm;
  });

  // Render Reader View
  if (surahId) {
    if (loadingReader) return <QuranReaderSkeleton />;

    if (!surahData) {
      return (
        <div className="text-center py-20 space-y-4">
          <p className="text-slate-500 dark:text-slate-400">عفواً، تعذر تحميل بيانات السورة.</p>
          <button onClick={() => navigate('/quran')} className="px-6 py-2 rounded-xl bg-emerald-700 dark:bg-gold-400 text-white dark:text-serenity-bg font-bold">
            العودة لقائمة السور
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-8 pb-16">
        {/* Top Floating Control Bar */}
        {!focusMode && (
          <div className="sticky top-24 z-30 wesal-glass rounded-3xl p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/quran')}
                className="p-2.5 rounded-2xl bg-slate-100 dark:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-gold-400 border border-slate-200 dark:border-emerald-500/20 transition-all"
                title="العودة"
              >
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-gold-400 font-heading">
                  سورة {surahData.name}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {surahData.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {surahData.numberOfAyahs} آية
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Play Audio */}
              <button
                onClick={() => playSurah(surahData.number, `سورة ${surahData.name}`, RECITERS_LIST[0])}
                className="px-4 py-2 rounded-xl bg-emerald-700 dark:bg-gradient-to-r dark:from-gold-400 dark:to-amber-500 text-white dark:text-serenity-bg font-bold text-sm shadow-md flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Play className="w-4 h-4 fill-current" />
                <span className="hidden sm:inline">تشغيل السورة</span>
              </button>

              {/* Font Size Controls */}
              <div className="flex items-center bg-slate-100 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-500/20 rounded-xl p-1 text-slate-700 dark:text-slate-300">
                <button
                  onClick={() => updateQuranFontSize(quranFontSize - 2)}
                  className="px-2.5 py-1 text-xs font-bold hover:text-emerald-700 dark:hover:text-gold-400"
                  title="تصغير الخط"
                >
                  A-
                </button>
                <span className="px-2 text-xs font-mono font-bold text-emerald-700 dark:text-gold-400">{quranFontSize}px</span>
                <button
                  onClick={() => updateQuranFontSize(quranFontSize + 2)}
                  className="px-2.5 py-1 text-xs font-bold hover:text-emerald-700 dark:hover:text-gold-400"
                  title="تكبير الخط"
                >
                  A+
                </button>
              </div>

              {/* Focus Mode Toggle */}
              <button
                onClick={() => setFocusMode(true)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-500/20 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-gold-400"
                title="وضع التركيز"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Exit Focus Mode Button */}
        {focusMode && (
          <button
            onClick={() => setFocusMode(false)}
            className="fixed top-24 left-6 z-40 px-4 py-2 rounded-full bg-emerald-700 dark:bg-gold-400 text-white dark:text-serenity-bg font-bold text-xs shadow-2xl flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>إنهاء وضع التركيز</span>
          </button>
        )}

        {/* Bismillah Header (Except Surah At-Tawbah #9) */}
        {surahData.number !== 9 && (
          <div className="text-center py-6">
            <h2 className="font-quran text-3xl sm:text-4xl text-emerald-800 dark:text-gold-400">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </h2>
          </div>
        )}

        {/* Ayahs Flow View */}
        <div className="wesal-card rounded-3xl p-6 sm:p-12 space-y-8 leading-[2.5]">
          {surahData.ayahs.map((ayah, index) => {
            const isBookmarkedAyah = isBookmarked('ayat', { id: `surah_${surahData.number}_ayah_${ayah.numberInSurah}` });
            const tafsirItem = tafsirData?.ayahs?.[index];

            return (
              <div
                key={ayah.number}
                className="group relative border-b border-slate-100 dark:border-white/5 pb-6 last:border-b-0 hover:bg-slate-50/60 dark:hover:bg-white/[0.02] p-4 rounded-2xl transition-all"
              >
                <div className="flex flex-col gap-4">
                  {/* Ayah Text */}
                  <p
                    className="font-quran text-slate-900 dark:text-slate-100 text-right leading-relaxed select-text"
                    style={{ fontSize: `${quranFontSize}px` }}
                  >
                    {ayah.text}{' '}
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-50 dark:bg-gold-400/15 border border-emerald-300 dark:border-gold-400/40 text-emerald-800 dark:text-gold-400 text-xs font-bold font-mono mr-2 align-middle">
                      {ayah.numberInSurah}
                    </span>
                  </p>

                  {/* Ayah Actions */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2">
                    <button
                      onClick={() => setActiveTafsirAyah({ ayahNum: ayah.numberInSurah, text: tafsirItem?.text || 'التفسير غير متاح حالياً' })}
                      className="flex items-center gap-1 hover:text-emerald-700 dark:hover:text-gold-400 transition-colors"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>التفسير</span>
                    </button>

                    <button
                      onClick={() => handleCopyAyah(ayah.text, surahData.name, ayah.numberInSurah)}
                      className="flex items-center gap-1 hover:text-emerald-700 dark:hover:text-gold-400 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ</span>
                    </button>

                    <button
                      onClick={() => handleShareAyah(ayah.text, surahData.name, ayah.numberInSurah)}
                      className="flex items-center gap-1 hover:text-emerald-700 dark:hover:text-gold-400 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>مشاركة</span>
                    </button>

                    <button
                      onClick={() => {
                        toggleBookmark('ayat', {
                          id: `surah_${surahData.number}_ayah_${ayah.numberInSurah}`,
                          surahNumber: surahData.number,
                          surahName: surahData.name,
                          ayahNumber: ayah.numberInSurah,
                          text: ayah.text,
                        });
                        showToast(isBookmarkedAyah ? 'تمت إزالة الآية من المحفوظات' : 'تم حفظ الآية بنجاح');
                      }}
                      className={`flex items-center gap-1 transition-colors ${
                        isBookmarkedAyah ? 'text-amber-600 dark:text-gold-400 font-bold' : 'hover:text-emerald-700 dark:hover:text-gold-400'
                      }`}
                    >
                      {isBookmarkedAyah ? <BookmarkCheck className="w-3.5 h-3.5 fill-current" /> : <Bookmark className="w-3.5 h-3.5" />}
                      <span>{isBookmarkedAyah ? 'محفوظة' : 'حفظ'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tafsir Modal */}
        <Modal
          isOpen={!!activeTafsirAyah}
          onClose={() => setActiveTafsirAyah(null)}
          title={`التفسير الميسر — آية (${activeTafsirAyah?.ayahNum})`}
        >
          <div className="space-y-4 font-sans text-slate-800 dark:text-slate-200 text-base leading-relaxed p-2">
            <p className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/20 p-4 rounded-2xl text-emerald-900 dark:text-emerald-300 font-quran text-lg">
              ﴿ {surahData.ayahs.find(a => a.numberInSurah === activeTafsirAyah?.ayahNum)?.text} ﴾
            </p>
            <div className="pt-2">
              <h4 className="text-sm font-bold text-emerald-800 dark:text-gold-400 mb-2 font-heading">الشرح والتفسير:</h4>
              <p>{activeTafsirAyah?.text}</p>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // Render Surah Catalog List View
  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-gold-400 font-heading">
          فهرس سور القرآن الكريم
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl">
          تصفح 114 سورة قرآنية مباركة بالرسم العثماني مع التفسير الميسر وإمكانية التلاوة والاستماع.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative max-w-xl">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ابحث باسم السورة أو رقمها (مثال: الكهف، 18)..."
          className="w-full bg-white dark:bg-wesal-dark-card border border-slate-300 dark:border-emerald-500/20 rounded-2xl py-3.5 pr-12 pl-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-600 dark:focus:border-gold-400 focus:ring-1 focus:ring-emerald-600 dark:focus:ring-gold-400 shadow-sm"
        />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600 dark:text-gold-400" />
      </div>

      {/* Surahs Catalog Grid */}
      {loadingList ? (
        <CardSkeleton count={9} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSurahs.map((surah) => (
            <Link
              key={surah.number}
              to={`/quran/${surah.number}`}
              className="wesal-card p-6 rounded-3xl hover:border-emerald-600/40 dark:hover:border-gold-400/50 transition-all hover:-translate-y-1 flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4">
                {/* Surah Number Box */}
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-gold-400/30 flex items-center justify-center text-emerald-800 dark:text-gold-400 font-bold font-mono text-sm shrink-0 group-hover:scale-105 transition-transform">
                  {surah.number}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-heading group-hover:text-emerald-700 dark:group-hover:text-gold-400 transition-colors">
                    سورة {surah.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {surah.numberOfAyahs} آية
                  </p>
                </div>
              </div>

              <div className="text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-gold-400 group-hover:-translate-x-1 transition-all shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
