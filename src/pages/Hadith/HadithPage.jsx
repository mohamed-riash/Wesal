import React, { useState, useEffect } from 'react';
import { Scroll, Search, Sparkles, RefreshCw, Loader2, CheckCircle2, RotateCcw } from 'lucide-react';
import { HADITH_CATEGORIES } from '../../data/hadithsData';
import { getHadiths, getRandomHadith } from '../../services/hadithService';
import HadithCard from '../../components/hadith/HadithCard';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { useUserPreferences } from '../../context/UserPreferencesContext';

export default function HadithPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [hadiths, setHadiths] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { showToast } = useUserPreferences();

  // Search input debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Initial load or category/search change
  useEffect(() => {
    setLoadingInitial(true);
    setPage(1);
    getHadiths({ category: activeCategory, search: debouncedSearch, page: 1 })
      .then((res) => {
        setHadiths(res.data);
        setTotal(res.total);
        setHasMore(res.hasMore);
        setLoadingInitial(false);
      })
      .catch((err) => {
        console.error('Failed to load hadiths:', err);
        setLoadingInitial(false);
      });
  }, [activeCategory, debouncedSearch]);

  // Load More button handler
  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;

    getHadiths({ category: activeCategory, search: debouncedSearch, page: nextPage })
      .then((res) => {
        setHadiths((prev) => [...prev, ...res.data]);
        setPage(nextPage);
        setHasMore(res.hasMore);
        setLoadingMore(false);
      })
      .catch((err) => {
        console.error('Failed to load more hadiths:', err);
        setLoadingMore(false);
      });
  };

  const handleRandom = () => {
    const randomItem = getRandomHadith();
    setSearchTerm(randomItem.title);
    showToast(`تم عرض حديث: ${randomItem.title}`);
  };

  const handleResetFilters = () => {
    setActiveCategory('all');
    setSearchTerm('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-emerald-700 dark:text-gold-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>السنة النبوية المطهرة</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-gold-400 font-heading flex items-center gap-3">
            <Scroll className="w-8 h-8 text-emerald-600 dark:text-gold-400" />
            <span>موسوعة الأحاديث النبوية</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl">
            تصفح الأحاديث النبوية الشريفة بنصوص موثقة مع الرواة والمصادر ودرجات الصحة، وتصفح بالتبويب والتصنيف.
          </p>
        </div>

        <button
          onClick={handleRandom}
          className="px-5 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-gold-400/40 text-emerald-800 dark:text-gold-400 font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>حديث عشوائي</span>
        </button>
      </div>

      {/* Search & Category Filter Header */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث في نص الحديث، الراوي، الكتاب، أو الموضوع..."
            className="w-full bg-white dark:bg-wesal-dark-card border border-slate-300 dark:border-emerald-500/20 rounded-2xl py-3.5 pr-12 pl-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-600 dark:focus:border-gold-400 focus:ring-1 focus:ring-emerald-600 dark:focus:ring-gold-400 shadow-sm"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600 dark:text-gold-400" />
        </div>

        {/* Category Pills Filter */}
        <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
          {HADITH_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeCategory === cat.id
                  ? 'bg-emerald-700 dark:bg-gradient-to-r dark:from-gold-400 dark:to-amber-500 text-white dark:text-serenity-bg shadow-md scale-105'
                  : 'bg-white dark:bg-wesal-dark-card border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Results Counter */}
        {!loadingInitial && (
          <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
            يتم عرض <span className="font-bold text-slate-800 dark:text-slate-200">{hadiths.length}</span> من إجمالي <span className="font-bold text-slate-800 dark:text-slate-200">{total}</span> حديث
          </div>
        )}
      </div>

      {/* Hadiths List Grid */}
      {loadingInitial ? (
        <CardSkeleton count={6} />
      ) : hadiths.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hadiths.map((hadith) => (
              <HadithCard key={hadith.id} hadith={hadith} />
            ))}
          </div>

          {/* "عرض المزيد" (Load More) Pagination Button */}
          <div className="pt-6 text-center">
            {hasMore ? (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-8 py-3.5 rounded-2xl bg-white dark:bg-wesal-dark-card border-2 border-emerald-600 dark:border-gold-400 text-emerald-800 dark:text-gold-400 font-bold text-base hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all shadow-md inline-flex items-center gap-2 disabled:opacity-60"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري تحميل المزيد...</span>
                  </>
                ) : (
                  <>
                    <span>عرض المزيد من الأحاديث</span>
                    <span className="text-xs opacity-75 font-mono">({hadiths.length} / {total})</span>
                  </>
                )}
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-xs font-semibold border border-slate-200 dark:border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-gold-400" />
                <span>تم عرض جميع الأحاديث المتوفرة ({total} حديث)</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="wesal-card rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto">
          <Scroll className="w-12 h-12 mx-auto text-emerald-600 dark:text-gold-400 opacity-40" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-heading">
            لم نجد أحاديث مطابقة لبحثك
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            جرب البحث بكلمات أخرى أو قم بإعادة ضبط التصنيف.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 dark:bg-gold-400 text-white dark:text-serenity-bg font-bold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة ضبط الفلاتر</span>
          </button>
        </div>
      )}
    </div>
  );
}
