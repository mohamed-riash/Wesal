import React, { useState } from 'react';
import { Copy, Share2, Bookmark, BookmarkCheck, ArrowLeft, BookOpen } from 'lucide-react';
import { useBookmarks } from '../../context/BookmarkContext';
import { useUserPreferences } from '../../context/UserPreferencesContext';
import HadithDetailModal from './HadithDetailModal';

export default function HadithCard({ hadith }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { showToast } = useUserPreferences();

  const isSaved = isBookmarked('hadiths', hadith);

  const handleCopy = (e) => {
    e.stopPropagation();
    const content = `قال رسول الله ﷺ:\n"${hadith.text}"\n— [${hadith.narrator} - ${hadith.source}]\nعن طريق منصة وصال`;
    navigator.clipboard.writeText(content);
    showToast('تم نسخ الحديث الشريف إلى الحافظة');
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const content = `قال رسول الله ﷺ:\n"${hadith.text}"\n— [${hadith.narrator} - ${hadith.source}]\nعن طريق منصة وصال`;
    if (navigator.share) {
      navigator.share({ title: hadith.title, text: content });
    } else {
      navigator.clipboard.writeText(content);
      showToast('تم نسخ نص الحديث للمشاركة');
    }
  };

  const handleBookmarkToggle = (e) => {
    e.stopPropagation();
    toggleBookmark('hadiths', hadith);
    showToast(isSaved ? 'تمت إزالة الحديث من المحفوظات' : 'تم حفظ الحديث بنجاح');
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="wesal-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 cursor-pointer hover:border-emerald-600/40 dark:hover:border-gold-400/40 hover:-translate-y-1 transition-all group relative overflow-hidden"
      >
        <div className="space-y-4">
          {/* Header info */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-gold-400 border border-emerald-200 dark:border-gold-400/30 font-mono font-bold text-xs flex items-center justify-center">
                #{hadith.number || hadith.id}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-gold-400 font-heading group-hover:text-emerald-700 dark:group-hover:text-amber-300 transition-colors">
                {hadith.title}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-emerald-950/90 border border-slate-200 dark:border-emerald-500/30 text-slate-700 dark:text-emerald-300 text-[11px] font-bold shrink-0">
              {hadith.grade}
            </span>
          </div>

          {/* Hadith Matn */}
          <p className="font-quran text-lg sm:text-xl text-slate-800 dark:text-slate-100 leading-relaxed text-right select-text">
            "{hadith.text}"
          </p>

          {/* Narrator & Book Source */}
          <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-emerald-950/30 p-3 rounded-2xl border border-slate-200/60 dark:border-white/5 space-y-0.5">
            <p className="font-semibold text-slate-700 dark:text-slate-300">{hadith.narrator}</p>
            <p className="truncate">{hadith.source} — {hadith.book}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/10 pt-4 text-xs text-slate-500 dark:text-slate-400">
          <button
            onClick={handleBookmarkToggle}
            className={`flex items-center gap-1.5 transition-colors p-1 rounded-lg ${
              isSaved
                ? 'text-amber-600 dark:text-gold-400 font-bold'
                : 'hover:text-emerald-700 dark:hover:text-gold-400'
            }`}
            title="حفظ"
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaved ? 'محفوظ' : 'حفظ'}</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 hover:text-emerald-700 dark:hover:text-gold-400 transition-colors p-1"
              title="نسخ"
            >
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">نسخ</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1 hover:text-emerald-700 dark:hover:text-gold-400 transition-colors p-1"
              title="مشاركة"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">مشاركة</span>
            </button>

            <span className="flex items-center gap-1 text-emerald-700 dark:text-gold-400 font-bold group-hover:-translate-x-1 transition-transform mr-1">
              <span>التفاصيل</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <HadithDetailModal
        hadith={hadith}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
