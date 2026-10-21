import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Scroll, HeartHandshake, Headphones, Bookmark, Sparkles, ArrowLeft, Play, Copy, Share2, Compass, Sun, Moon, Check, ShieldCheck, Search, Radio } from 'lucide-react';
import { useBookmarks } from '../../context/BookmarkContext';
import { useAudioPlayer } from '../../context/AudioContext';
import { useUserPreferences } from '../../context/UserPreferencesContext';
import { getDailyHadith } from '../../services/hadithService';
import { RECITERS_LIST } from '../../services/reciterService';
import { AZKAR_CATEGORIES } from '../../data/azkarData';

export default function HomePage() {
  const { lastRead } = useBookmarks();
  const { playSurah } = useAudioPlayer();
  const { showToast } = useUserPreferences();

  const dailyHadith = getDailyHadith();

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`تم نسخ ${label} إلى الحافظة`);
  };

  const handleShare = (title, text) => {
    if (navigator.share) {
      navigator.share({ title, text });
    } else {
      navigator.clipboard.writeText(text);
      showToast('تم نسخ النص للمشاركة');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative min-h-[75vh] flex items-center justify-center rounded-3xl overflow-hidden wesal-glass border border-emerald-500/20 p-8 sm:p-16 text-center">
        {/* Ambient background glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-gold-400/30 text-emerald-800 dark:text-gold-400 text-xs sm:text-sm font-semibold shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-gold-400 animate-pulse" />
            <span>منصة وصال الإسلامية — سكينتك في تلاوة الذكر الحكيم</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 font-heading leading-tight tracking-tight">
            رفيقك الدائم للتدبر والتأمل في{' '}
            <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-800 dark:from-gold-400 dark:via-amber-300 dark:to-emerald-400 bg-clip-text text-transparent">
              كتاب الله وسنة رسوله
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-sans max-w-3xl mx-auto">
            منصة إسلامية متكاملة تقدم القرآن الكريم بالرسم العثماني مع التفسير الميسر، والأذكار اليومية التفاعلية، وموسوعة الأحاديث الموثقة في تجربة هادئة وسلسة.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/quran"
              className="px-8 py-4 rounded-2xl bg-emerald-700 dark:bg-gradient-to-r dark:from-gold-400 dark:to-amber-500 text-white dark:text-serenity-bg font-bold text-lg shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              <span>ابدأ قراءة القرآن</span>
            </Link>
            <Link
              to="/azkar"
              className="px-8 py-4 rounded-2xl bg-white dark:bg-emerald-950/80 border border-slate-200 dark:border-emerald-500/30 text-slate-800 dark:text-emerald-200 font-semibold text-lg hover:border-emerald-600 dark:hover:border-gold-400/50 hover:bg-slate-50 dark:hover:bg-emerald-900/60 transition-all flex items-center gap-2 shadow-sm"
            >
              <HeartHandshake className="w-5 h-5 text-emerald-600 dark:text-teal-400" />
              <span>أذكار اليوم</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Continue Reading Banner (If lastRead present) */}
      {lastRead && (
        <section className="wesal-card rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-2 border-emerald-600/30 dark:border-gold-400/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-gold-400/10 border border-emerald-200 dark:border-gold-400/30 flex items-center justify-center text-emerald-700 dark:text-gold-400 shrink-0">
              <Bookmark className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700 dark:text-gold-400 uppercase tracking-wider">تابع من حيث توقفت</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-heading">
                سورة {lastRead.surahName} (الآية {lastRead.ayahNumber})
              </h3>
            </div>
          </div>
          <Link
            to={`/quran/${lastRead.surahNumber}`}
            className="px-6 py-3 rounded-xl bg-emerald-700 dark:bg-gold-400 text-white dark:text-serenity-bg font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0"
          >
            <span>متابعة القراءة</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </section>
      )}

      {/* 3. Daily Ayah Card */}
      <section className="wesal-card rounded-3xl p-8 sm:p-12 space-y-6 text-center relative overflow-hidden border border-emerald-500/20">
        <div className="inline-flex items-center gap-2 text-emerald-700 dark:text-gold-400 font-bold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>آية اليوم المختارة</span>
        </div>

        <blockquote className="font-quran text-2xl sm:text-4xl text-slate-900 dark:text-emerald-50 leading-relaxed max-w-4xl mx-auto select-text">
          ﴿اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ مَثَلُ نُورِهِ كَمِشْكَاةٍ فِيهَا مِصْبَاحٌ﴾
        </blockquote>

        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">[ سورة النور: الآية 35 ]</p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => playSurah(24, 'سورة النور', RECITERS_LIST[0])}
            className="px-5 py-2.5 rounded-full bg-emerald-700 dark:bg-emerald-900/80 border border-transparent dark:border-gold-400/30 text-white dark:text-gold-400 hover:opacity-90 text-sm font-semibold transition-all inline-flex items-center gap-2 shadow-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>استمع للتلاوة</span>
          </button>

          <button
            onClick={() => handleCopy('﴿اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ مَثَلُ نُورِهِ كَمِشْكَاةٍ فِيهَا مِصْبَاحٌ﴾ [سورة النور: 35]', 'الآية')}
            className="p-2.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-gold-400 transition-colors"
            title="نسخ الآية"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleShare('آية من القرآن الكريم', '﴿اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ مَثَلُ نُورِهِ كَمِشْكَاةٍ فِيهَا مِصْبَاحٌ﴾ [سورة النور: 35]')}
            className="p-2.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-gold-400 transition-colors"
            title="مشاركة الآية"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. Quick Access Categories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-gold-400 font-heading flex items-center gap-2">
            <Compass className="w-6 h-6 text-emerald-600 dark:text-gold-400" />
            <span>أقسام المنصة الرئيسية</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/quran"
            className="wesal-card p-6 rounded-3xl hover:border-emerald-600/40 dark:hover:border-gold-400/50 transition-all hover:-translate-y-1 space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-heading group-hover:text-emerald-700 dark:group-hover:text-gold-400 transition-colors">
              القرآن الكريم
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              قراءة السور بالرسم العثماني، التفسير الميسر لكل آية، والبحث في الآيات.
            </p>
          </Link>

          <Link
            to="/hadith"
            className="wesal-card p-6 rounded-3xl hover:border-emerald-600/40 dark:hover:border-gold-400/50 transition-all hover:-translate-y-1 space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-gold-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Scroll className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-heading group-hover:text-emerald-700 dark:group-hover:text-gold-400 transition-colors">
              الأحاديث النبوية
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              موسوعة الأحاديث الصحيحة والحسنة مع التبويب، الشرح، والتحميل التفاعلي.
            </p>
          </Link>

          <Link
            to="/azkar"
            className="wesal-card p-6 rounded-3xl hover:border-emerald-600/40 dark:hover:border-gold-400/50 transition-all hover:-translate-y-1 space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-heading group-hover:text-emerald-700 dark:group-hover:text-gold-400 transition-colors">
              الأذكار التفاعلية
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              عدّاد تفاعلي لأذكار الصباح والمساء والنوم مع تتبع الإنجاز وحفظ التقدم.
            </p>
          </Link>

          <Link
            to="/audio"
            className="wesal-card p-6 rounded-3xl hover:border-emerald-600/40 dark:hover:border-gold-400/50 transition-all hover:-translate-y-1 space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-heading group-hover:text-emerald-700 dark:group-hover:text-gold-400 transition-colors">
              مشغل التلاوات
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              تلاوات بأصوات أشهر القراء مع مشغل صوتي مستمر يعمل أثناء التنقل.
            </p>
          </Link>
        </div>
      </section>

      {/* 5. Daily Hadith Section */}
      <section className="wesal-card rounded-3xl p-8 sm:p-10 space-y-6 border border-emerald-500/20">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-gold-400 font-bold text-sm">
            <Scroll className="w-5 h-5" />
            <span>حديث اليوم المأثور</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-600/30">
            {dailyHadith.grade}
          </span>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-heading">
            {dailyHadith.title}
          </h3>
          <p className="font-quran text-lg sm:text-2xl text-slate-800 dark:text-slate-100 leading-relaxed select-text">
            "{dailyHadith.text}"
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {dailyHadith.narrator} — {dailyHadith.source}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/10 pt-4">
          <Link
            to="/hadith"
            className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-gold-400 hover:underline flex items-center gap-1"
          >
            <span>استكشف المزيد من الأحاديث</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(`قال رسول الله ﷺ: "${dailyHadith.text}" [${dailyHadith.source}]`, 'الحديث')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-gold-400"
              title="نسخ"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleShare(dailyHadith.title, `قال رسول الله ﷺ: "${dailyHadith.text}" [${dailyHadith.source}]`)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-gold-400"
              title="مشاركة"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. Selected Azkar Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-gold-400 font-heading flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-emerald-600 dark:text-teal-400" />
            <span>أذكار اليوم والليلة</span>
          </h2>
          <Link to="/azkar" className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-gold-400 hover:underline flex items-center gap-1">
            <span>جميع الأذكار</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {AZKAR_CATEGORIES.slice(0, 3).map((cat) => (
            <Link
              key={cat.id}
              to="/azkar"
              className="wesal-card p-6 rounded-3xl hover:border-emerald-600/40 dark:hover:border-gold-400/40 transition-all hover:-translate-y-1 space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-400 flex items-center justify-center font-bold">
                  ✓
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">تفاعلي مع عداد</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-heading group-hover:text-emerald-700 dark:group-hover:text-gold-400 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                أذكار مأثورة مع عداد ذكي يحفظ تقدمك اليومي تلقائياً.
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. Quran Audio Preview Section */}
      <section className="wesal-card rounded-3xl p-8 sm:p-10 space-y-6 border border-emerald-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-gold-400 font-heading flex items-center gap-2">
              <Radio className="w-6 h-6 text-emerald-600 dark:text-gold-400" />
              <span>تلاوات خاشعة بأصوات كبار القراء</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              استمع إلى القرآن الكريم بجودة صوتية عالية مع مشغل مستمر.
            </p>
          </div>
          <Link
            to="/audio"
            className="px-5 py-2.5 rounded-xl bg-emerald-700 dark:bg-gold-400 text-white dark:text-serenity-bg font-bold text-sm hover:opacity-90 transition-opacity self-start sm:self-auto shrink-0"
          >
            مشغل التلاوات الكامل
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {RECITERS_LIST.slice(0, 4).map((reciter) => (
            <div
              key={reciter.id}
              onClick={() => playSurah(1, 'سورة الفاتحة', reciter)}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-white/5 hover:border-emerald-600 dark:hover:border-gold-400/40 cursor-pointer transition-all flex flex-col items-center text-center space-y-2 group"
            >
              <img
                src={reciter.image}
                alt={reciter.name}
                className="w-16 h-16 rounded-2xl object-cover border border-emerald-200 dark:border-gold-400/30 group-hover:scale-105 transition-transform"
                onError={(e) => { e.target.src = '/logo 2.png'; }}
              />
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-gold-400 transition-colors">
                {reciter.name}
              </h4>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{reciter.rewaya}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Explore Platform Section */}
      <section className="rounded-3xl p-8 sm:p-12 bg-emerald-900 dark:bg-emerald-950 text-white space-y-6 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black font-heading text-gold-400">
            تجربة رقمية إسلامية صُممت لراحتك
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            محفوظات شخصية تعمل دون إنترنت، قراءة بوضع التركيز المريح للعين، وبحث سريع في نصوص القرآن والأحاديث.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/quran"
              className="px-6 py-3 rounded-xl bg-gold-400 text-serenity-bg font-bold text-sm hover:bg-amber-300 transition-colors"
            >
              تصفح المصحف الشريف
            </Link>
            <Link
              to="/bookmarks"
              className="px-6 py-3 rounded-xl bg-emerald-950/80 border border-emerald-400/30 text-emerald-200 font-bold text-sm hover:bg-emerald-800 transition-colors"
            >
              قائمتي المحفوظة
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
