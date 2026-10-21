import React, { useState } from 'react';
import { Bookmark, BookOpen, Scroll, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBookmarks } from '../../context/BookmarkContext';
import { useUserPreferences } from '../../context/UserPreferencesContext';

export default function BookmarksPage() {
  const [activeTab, setActiveTab] = useState('ayat');
  const { bookmarks, toggleBookmark } = useBookmarks();
  const { showToast } = useUserPreferences();

  const savedAyat = bookmarks.ayat || [];
  const savedHadiths = bookmarks.hadiths || [];

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-gold-400 font-heading flex items-center gap-3">
          <Bookmark className="w-8 h-8 text-emerald-600 dark:text-gold-400 fill-current" />
          <span>المحفوظات والمفضلة</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
          قائمتك الشخصية للآيات، الأحاديث، والأذكار التي قمت بحفظها للرجوع إليها في أي وقت.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-white/10 gap-6">
        <button
          onClick={() => setActiveTab('ayat')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'ayat'
              ? 'border-emerald-700 dark:border-gold-400 text-emerald-800 dark:text-gold-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>الآيات المحفوظة ({savedAyat.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hadiths')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'hadiths'
              ? 'border-emerald-700 dark:border-gold-400 text-emerald-800 dark:text-gold-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Scroll className="w-4 h-4" />
          <span>الأحاديث المحفوظة ({savedHadiths.length})</span>
        </button>
      </div>

      {/* Saved Content List */}
      {activeTab === 'ayat' && (
        <div className="space-y-4">
          {savedAyat.map((item) => (
            <div
              key={item.id}
              className="wesal-card rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-3xl">
                <span className="text-xs font-bold text-emerald-700 dark:text-gold-400">
                  سورة {item.surahName} (الآية {item.ayahNumber})
                </span>
                <p className="font-quran text-xl text-slate-900 dark:text-slate-100 leading-relaxed">
                  ﴿ {item.text} ﴾
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <Link
                  to={`/quran/${item.surahNumber}`}
                  className="px-4 py-2 rounded-xl bg-emerald-700 dark:bg-gold-400 text-white dark:text-serenity-bg font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-1"
                >
                  <span>عرض بالسورة</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => {
                    toggleBookmark('ayat', item);
                    showToast('تمت إزالة الآية من المحفوظات');
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {savedAyat.length === 0 && (
            <div className="wesal-card rounded-3xl p-12 text-center text-slate-500 dark:text-slate-400 space-y-2 max-w-md mx-auto">
              <BookOpen className="w-12 h-12 mx-auto text-emerald-600 dark:text-gold-400 opacity-40" />
              <p className="font-bold text-slate-800 dark:text-slate-200">لم تقم بحفظ أي آيات قرآنية بعد</p>
              <p className="text-xs">اضغط على زر الحفظ عند قراءة أي سورة لإضافتها إلى قائمتك.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'hadiths' && (
        <div className="space-y-4">
          {savedHadiths.map((item) => (
            <div
              key={item.id}
              className="wesal-card rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-3xl">
                <span className="text-xs font-bold text-emerald-700 dark:text-gold-400">{item.title}</span>
                <p className="font-quran text-lg text-slate-900 dark:text-slate-100 font-medium">"{item.text}"</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.narrator} — {item.source}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => {
                    toggleBookmark('hadiths', item);
                    showToast('تمت إزالة الحديث من المحفوظات');
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {savedHadiths.length === 0 && (
            <div className="wesal-card rounded-3xl p-12 text-center text-slate-500 dark:text-slate-400 space-y-2 max-w-md mx-auto">
              <Scroll className="w-12 h-12 mx-auto text-emerald-600 dark:text-gold-400 opacity-40" />
              <p className="font-bold text-slate-800 dark:text-slate-200">لم تقم بحفظ أي أحاديث نبوية بعد</p>
              <p className="text-xs">تصفح قسم الأحاديث واحفظ الأحاديث التي ترغب في الرجوع إليها.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
