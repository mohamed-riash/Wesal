import React, { createContext, useContext, useEffect, useState } from 'react';

const BookmarkContext = createContext();

export function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('wesal_bookmarks');
      return saved ? JSON.parse(saved) : { ayat: [], hadiths: [], azkar: [] };
    } catch {
      return { ayat: [], hadiths: [], azkar: [] };
    }
  });

  const [lastRead, setLastRead] = useState(() => {
    try {
      const saved = localStorage.getItem('wesal_last_read');
      return saved ? JSON.parse(saved) : null; // { surahNumber, surahName, ayahNumber, timestamp }
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('wesal_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    if (lastRead) {
      localStorage.setItem('wesal_last_read', JSON.stringify(lastRead));
    }
  }, [lastRead]);

  const toggleBookmark = (type, item) => {
    setBookmarks(prev => {
      const list = prev[type] || [];
      const exists = list.some(b => b.id === item.id);
      const updated = exists ? list.filter(b => b.id !== item.id) : [...list, item];
      return { ...prev, [type]: updated };
    });
  };

  const isBookmarked = (type, id) => {
    return (bookmarks[type] || []).some(b => b.id === id);
  };

  const saveLastRead = (surahNumber, surahName, ayahNumber = 1) => {
    setLastRead({
      surahNumber,
      surahName,
      ayahNumber,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        toggleBookmark,
        isBookmarked,
        lastRead,
        saveLastRead,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export const useBookmarks = () => useContext(BookmarkContext);
