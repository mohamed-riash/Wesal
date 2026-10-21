import React from 'react';
import { Copy, Share2, Bookmark, BookmarkCheck, BookOpen, User, Award, Tag } from 'lucide-react';
import Modal from '../ui/Modal';
import { useBookmarks } from '../../context/BookmarkContext';
import { useUserPreferences } from '../../context/UserPreferencesContext';

export default function HadithDetailModal({ hadith, isOpen, onClose }) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { showToast } = useUserPreferences();

  if (!hadith) return null;

  const isSaved = isBookmarked('hadiths', hadith);

  const handleCopy = () => {
    const content = `قال رسول الله ﷺ:\n"${hadith.text}"\n— [${hadith.narrator} - ${hadith.source}]\nعن طريق منصة وصال`;
    navigator.clipboard.writeText(content);
    showToast('تم نسخ الحديث الشريف إلى الحافظة');
  };

  const handleShare = () => {
    const content = `قال رسول الله ﷺ:\n"${hadith.text}"\n— [${hadith.narrator} - ${hadith.source}]\nعن طريق منصة وصال`;
    if (navigator.share) {
      navigator.share({ title: hadith.title, text: content });
    } else {
      navigator.clipboard.writeText(content);
      showToast('تم نسخ نص الحديث للمشاركة');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={hadith.title} maxWidth="max-w-3xl">
      <div className="space-y-6 text-slate-800 dark:text-slate-100 p-2">
        {/* Authenticity Badge & Number */}
        <div className="flex items-center justify-between">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-600/30">
            {hadith.grade}
          </span>
          <span className="text-xs font-mono text-slate-400 font-bold">
            حديث رقم #{hadith.number || hadith.id}
          </span>
        </div>

        {/* Hadith Matn (Text) */}
        <div className="bg-amber-50/50 dark:bg-emerald-950/30 border border-amber-200/60 dark:border-emerald-500/20 p-6 rounded-3xl">
          <p className="font-quran text-xl sm:text-2xl text-slate-900 dark:text-emerald-50 leading-loose text-right select-text">
            "{hadith.text}"
          </p>
        </div>

        {/* Explanation / Fawa'id */}
        {hadith.explanation && (
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-wesal-emerald dark:text-gold-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>شرح ومقصد الحديث:</span>
            </h4>
            <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-white/5">
              {hadith.explanation}
            </p>
          </div>
        )}

        {/* Metadata Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 flex items-center gap-2.5">
            <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">الراوي:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{hadith.narrator}</span>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 flex items-center gap-2.5">
            <Award className="w-4 h-4 text-amber-600 dark:text-gold-400 shrink-0" />
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">المصدر والكتاب:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{hadith.source} — {hadith.book}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/10 pt-4">
          <button
            onClick={() => {
              toggleBookmark('hadiths', hadith);
              showToast(isSaved ? 'تمت إزالة الحديث من المحفوظات' : 'تم حفظ الحديث بنجاح');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              isSaved
                ? 'bg-amber-100 dark:bg-gold-400/20 text-amber-700 dark:text-gold-400 border border-amber-300 dark:border-gold-400/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaved ? 'محفوظ بالمفضلة' : 'حفظ بالمفضلة'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-gold-400 transition-colors text-sm font-semibold"
            >
              <Copy className="w-4 h-4" />
              <span>نسخ</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 dark:bg-emerald-800 text-white hover:bg-emerald-700 transition-colors text-sm font-semibold"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
