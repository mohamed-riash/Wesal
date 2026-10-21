import React, { useState, useEffect } from 'react';
import { HeartHandshake, CheckCircle2, RotateCcw, Plus, Sparkles, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AZKAR_DATA, AZKAR_CATEGORIES } from '../../data/azkarData';
import { useUserPreferences } from '../../context/UserPreferencesContext';

export default function AzkarPage() {
  const [activeCategory, setActiveCategory] = useState('morning');
  const { showToast } = useUserPreferences();

  // Local state for counts map: { dhikrId: currentCount }
  const [counts, setCounts] = useState(() => {
    try {
      const saved = localStorage.getItem('wesal_azkar_counts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('wesal_azkar_counts', JSON.stringify(counts));
  }, [counts]);

  const categoryAzkar = AZKAR_DATA[activeCategory] || [];

  // Calculate Category Completion %
  const totalCategoryTarget = categoryAzkar.reduce((acc, a) => acc + a.count, 0);
  const totalCategoryDone = categoryAzkar.reduce((acc, a) => {
    const current = counts[a.id] || 0;
    return acc + Math.min(current, a.count);
  }, 0);

  const progressPercent = totalCategoryTarget > 0 ? Math.round((totalCategoryDone / totalCategoryTarget) * 100) : 0;

  const handleIncrement = (dhikr) => {
    const current = counts[dhikr.id] || 0;
    if (current < dhikr.count) {
      const newCount = current + 1;
      setCounts((prev) => ({ ...prev, [dhikr.id]: newCount }));

      // Check if this completes category!
      if (newCount === dhikr.count) {
        const willBeTotal = totalCategoryDone + 1;
        if (willBeTotal >= totalCategoryTarget) {
          showToast('تهانينا! أكملت جميع أذكار هذا القسم بنجاح 🎉');
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
        }
      }
    }
  };

  const handleResetDhikr = (id) => {
    setCounts((prev) => ({ ...prev, [id]: 0 }));
  };

  const handleResetCategory = () => {
    const updated = { ...counts };
    categoryAzkar.forEach((a) => {
      updated[a.id] = 0;
    });
    setCounts(updated);
    showToast('تمت إعادة ضبط أذكار هذا القسم');
  };

  const handleCopyDhikr = (d) => {
    const content = `﴿ ${d.text} ﴾\n[ العدد: ${d.count} ] — من أذكار وصال`;
    navigator.clipboard.writeText(content);
    showToast('تم نسخ الذكر المأثور');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-gold-400 font-heading flex items-center gap-3">
            <HeartHandshake className="w-8 h-8 text-emerald-600 dark:text-teal-400" />
            <span>الأذكار اليومية التفاعلية</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            حصن نفسك بالأذكار المأثورة مع عداد تفاعلي لحساب التكرارات وحفظ تقدمك اليومي.
          </p>
        </div>

        <button
          onClick={handleResetCategory}
          className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-emerald-950/60 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-gold-400 font-semibold text-xs transition-colors flex items-center gap-2 self-start sm:self-auto shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>إعادة ضبط القسم</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
        {AZKAR_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
              activeCategory === cat.id
                ? 'bg-emerald-700 dark:bg-gradient-to-r dark:from-teal-600 dark:to-emerald-800 text-white dark:text-gold-400 border border-emerald-800 dark:border-gold-400/40 shadow-md scale-105'
                : 'bg-white dark:bg-wesal-dark-card border border-slate-200 dark:border-emerald-500/15 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
            }`}
          >
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Progress Bar Header */}
      <div className="wesal-card rounded-3xl p-6 space-y-3 border border-emerald-500/20">
        <div className="flex items-center justify-between text-sm font-bold">
          <span className="text-emerald-800 dark:text-teal-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-gold-400" />
            <span>نسبة إنجاز القسم:</span>
          </span>
          <span className="text-emerald-700 dark:text-gold-400 font-mono text-base">{progressPercent}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-white/5 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Azkar Cards List */}
      <div className="space-y-6">
        {categoryAzkar.map((dhikr) => {
          const currentCount = counts[dhikr.id] || 0;
          const isDone = currentCount >= dhikr.count;

          return (
            <div
              key={dhikr.id}
              className={`wesal-card rounded-3xl p-6 sm:p-8 space-y-6 transition-all ${
                isDone
                  ? 'border-emerald-600/40 dark:border-gold-400/40 bg-emerald-50/50 dark:bg-gradient-to-r dark:from-emerald-950/60 dark:to-wesal-dark-card'
                  : 'hover:border-emerald-500/40'
              }`}
            >
              {/* Dhikr Content */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 dark:text-gold-400 font-mono bg-emerald-100/70 dark:bg-gold-400/10 border border-emerald-300 dark:border-gold-400/30 px-3 py-1 rounded-full">
                    المطلوب: {dhikr.count} {dhikr.count === 1 ? 'مرة' : 'مرات'}
                  </span>

                  {isDone && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900 border border-emerald-400 text-emerald-800 dark:text-emerald-300 text-xs font-bold animate-pulse">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تم الإنجاز</span>
                    </span>
                  )}
                </div>

                <p className="font-quran text-xl sm:text-2xl text-slate-900 dark:text-slate-100 leading-relaxed text-right select-text">
                  ﴿ {dhikr.text} ﴾
                </p>

                {dhikr.benefit && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-slate-200 dark:border-white/5">
                    💡 <span className="font-semibold text-slate-800 dark:text-slate-300">الفضل والمصدر:</span> {dhikr.benefit} ({dhikr.source})
                  </p>
                )}
              </div>

              {/* Counter Control Section */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 dark:border-white/10 pt-4">
                <div className="flex items-center gap-3">
                  {/* Plus Increment Button */}
                  <button
                    onClick={() => handleIncrement(dhikr)}
                    disabled={isDone}
                    className={`px-6 py-3 rounded-2xl font-bold text-lg flex items-center gap-2 shadow-md transition-all ${
                      isDone
                        ? 'bg-slate-200 dark:bg-emerald-900/40 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-white/5'
                        : 'bg-emerald-700 dark:bg-gradient-to-r dark:from-gold-400 dark:to-amber-500 text-white dark:text-serenity-bg hover:scale-105 active:scale-95'
                    }`}
                  >
                    <Plus className="w-5 h-5 stroke-[3]" />
                    <span>+1</span>
                  </button>

                  {/* Count Display Badge */}
                  <div className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-emerald-950/80 border border-slate-200 dark:border-emerald-500/20 font-mono text-base font-bold text-emerald-800 dark:text-gold-400">
                    [ {currentCount} / {dhikr.count} ]
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <button
                    onClick={() => handleResetDhikr(dhikr.id)}
                    className="hover:text-emerald-700 dark:hover:text-gold-400 transition-colors p-2 text-slate-500"
                    title="إعادة الكرّة"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopyDhikr(dhikr)}
                    className="hover:text-emerald-700 dark:hover:text-gold-400 transition-colors p-2 text-slate-500"
                    title="نسخ الذكر"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
