import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Scroll, HeartHandshake, Headphones, Bookmark } from 'lucide-react';
import { useBookmarks } from '../../context/BookmarkContext';

export default function MobileBottomNav() {
  const { bookmarks } = useBookmarks();
  const totalBookmarks = (bookmarks.ayat?.length || 0) + (bookmarks.hadiths?.length || 0) + (bookmarks.azkar?.length || 0);

  const items = [
    { path: '/', label: 'الرئيسية', icon: Home },
    { path: '/quran', label: 'القرآن', icon: BookOpen },
    { path: '/hadith', label: 'الأحاديث', icon: Scroll },
    { path: '/azkar', label: 'الأذكار', icon: HeartHandshake },
    { path: '/audio', label: 'الاستماع', icon: Headphones },
    { path: '/bookmarks', label: 'المحفوظات', icon: Bookmark, badge: totalBookmarks },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-wesal-dark-bg/95 border-t border-slate-200 dark:border-emerald-900/40 backdrop-blur-xl px-2 py-2">
      <nav className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-emerald-700 dark:text-gold-400 font-bold scale-105'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-emerald-700 dark:bg-gold-400 text-white dark:text-serenity-bg text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-heading">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
