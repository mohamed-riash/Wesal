import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Search, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useBookmarks } from '../../context/BookmarkContext';
import GlobalSearchModal from './GlobalSearchModal';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { bookmarks } = useBookmarks();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalBookmarks = (bookmarks.ayat?.length || 0) + (bookmarks.hadiths?.length || 0) + (bookmarks.azkar?.length || 0);

  const navItems = [
    { path: '/', label: 'الرئيسية' },
    { path: '/quran', label: 'القرآن الكريم' },
    { path: '/hadith', label: 'الأحاديث' },
    { path: '/azkar', label: 'الأذكار' },
    { path: '/audio', label: 'الاستماع' },
    { path: '/bookmarks', label: 'المحفوظات', badge: totalBookmarks },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 dark:bg-wesal-dark-bg/85 border-b border-slate-200 dark:border-emerald-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-950 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <img
                src="/logo 2.png"
                alt="وصال WESAL"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-emerald-800 dark:text-gold-400 font-heading group-hover:text-emerald-600 dark:group-hover:text-amber-300 transition-colors">
                وصال
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400/80 tracking-widest font-semibold uppercase">
                WESAL
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-emerald-950/40 p-1.5 rounded-full border border-slate-200 dark:border-emerald-500/10 shadow-inner">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-700 dark:bg-gradient-to-r dark:from-emerald-700 dark:to-emerald-900 text-white dark:text-gold-400 shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5'
                  }`
                }
              >
                <span className="flex items-center gap-1.5">
                  {item.label}
                  {item.badge > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-700 dark:bg-gold-400 text-white dark:text-serenity-bg">
                      {item.badge}
                    </span>
                  )}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-100 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-500/20 hover:border-emerald-500 dark:hover:border-gold-400/50 text-slate-700 dark:text-slate-300 text-sm font-medium transition-all shadow-sm"
              title="البحث السريع"
            >
              <Search className="w-4 h-4 text-emerald-600 dark:text-gold-400" />
              <span className="hidden md:inline">بحث...</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-500/20 text-slate-700 dark:text-gold-400 hover:bg-slate-200 dark:hover:bg-emerald-900/50 transition-colors shadow-sm"
              title={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-gold-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-full bg-slate-100 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-500/20 text-slate-700 dark:text-slate-200"
              aria-label="القائمة"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/95 dark:bg-wesal-dark-card/95 border-b border-slate-200 dark:border-emerald-900/40 p-4 space-y-2 backdrop-blur-xl">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between p-3 rounded-2xl text-base font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-900/60 text-emerald-800 dark:text-gold-400 border border-emerald-300 dark:border-gold-400/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`
                }
              >
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-700 dark:bg-gold-400 text-white dark:text-serenity-bg">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
