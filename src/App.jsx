import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AudioProvider } from './context/AudioContext';
import { BookmarkProvider } from './context/BookmarkContext';
import { UserPreferencesProvider } from './context/UserPreferencesContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileBottomNav from './components/layout/MobileBottomNav';
import PersistentAudioPlayer from './components/audio/PersistentAudioPlayer';
import Toast from './components/ui/Toast';

import HomePage from './pages/Home/HomePage';
import QuranPage from './pages/Quran/QuranPage';
import HadithPage from './pages/Hadith/HadithPage';
import AzkarPage from './pages/Azkar/AzkarPage';
import AudioPage from './pages/Audio/AudioPage';
import BookmarksPage from './pages/Bookmarks/BookmarksPage';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <UserPreferencesProvider>
        <BookmarkProvider>
          <AudioProvider>
            <Router>
              <div className="min-h-screen bg-wesal-bg dark:bg-wesal-dark-bg text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-emerald-600 selection:text-white dark:selection:bg-gold-400 dark:selection:text-serenity-bg">
                {/* Global Desktop Navigation */}
                <Navbar />

                {/* Main View Container */}
                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/quran" element={<QuranPage />} />
                    <Route path="/quran/:surahId" element={<QuranPage />} />
                    <Route path="/hadith" element={<HadithPage />} />
                    <Route path="/azkar" element={<AzkarPage />} />
                    <Route path="/audio" element={<AudioPage />} />
                    <Route path="/bookmarks" element={<BookmarksPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>

                {/* Floating Persistent Audio Player */}
                <PersistentAudioPlayer />

                {/* Toast Notifications */}
                <Toast />

                {/* Global Footer */}
                <Footer />

                {/* Mobile Animated Bottom Navigation */}
                <MobileBottomNav />
              </div>
            </Router>
          </AudioProvider>
        </BookmarkProvider>
      </UserPreferencesProvider>
    </ThemeProvider>
  );
}
